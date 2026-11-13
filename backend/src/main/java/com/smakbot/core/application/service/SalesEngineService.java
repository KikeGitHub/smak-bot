package com.smakbot.core.application.service;

import com.smakbot.core.application.engine.HondurasDeliveryPolicy;
import com.smakbot.core.application.engine.HondurasOrderValidator;
import com.smakbot.core.application.engine.Money;
import com.smakbot.core.domain.exception.ResourceNotFoundException;
import com.smakbot.core.domain.model.*;
import com.smakbot.core.domain.ports.in.ProcessMessageUseCase;
import com.smakbot.core.domain.ports.out.*;
import com.smakbot.core.domain.ports.out.AiSalesAssistantPort.AssistantDecision;
import com.smakbot.core.domain.ports.out.AiSalesAssistantPort.CampaignContext;
import com.smakbot.core.domain.ports.out.AiSalesAssistantPort.DraftUpdate;
import com.smakbot.core.domain.ports.out.AiSalesAssistantPort.RuleContext;
import com.smakbot.core.infrastructure.persistence.repository.SpringDataBotRuleRepository;
import com.smakbot.core.infrastructure.persistence.repository.SpringDataCampaignRepository;
import com.smakbot.core.infrastructure.persistence.repository.SpringDataSynonymRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Orquestador comercial central impulsado por IA (gpt-4o-mini) con validación determinista
 * paso a paso para Honduras, inventario en tiempo real, trazabilidad/cancelación con motivo
 * y consulta estricta desde PostgreSQL.
 */
@Service
public class SalesEngineService implements ProcessMessageUseCase {

    private static final Set<String> RESET_COMMANDS = Set.of(
            "reiniciar", "reset", "menu", "inicio", "empezar de nuevo", "volver a empezar", "reinicio"
    );

    private static final Pattern ORDER_OR_TRACKING_CODE = Pattern.compile(
            "\\b([A-Z]{2,6}-ORD-\\d+|CAEX-[A-Z0-9-]+)\\b",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern STANDALONE_QTY_DIGITS = Pattern.compile("(?:^|\\s)(\\d{1,3})(?=\\s|$)");

    private final TenantRepositoryPort tenantRepo;
    private final ProductRepositoryPort productRepo;
    private final OrderRepositoryPort orderRepo;
    private final ChatSessionRepositoryPort sessionRepo;
    private final AiSalesAssistantPort aiAssistant;
    private final SpringDataBotRuleRepository botRuleRepo;
    private final SpringDataCampaignRepository campaignRepo;
    private final SpringDataSynonymRepository synonymRepo;

    @Autowired
    public SalesEngineService(
            TenantRepositoryPort tenantRepo,
            ProductRepositoryPort productRepo,
            OrderRepositoryPort orderRepo,
            ChatSessionRepositoryPort sessionRepo,
            AiSalesAssistantPort aiAssistant,
            SpringDataBotRuleRepository botRuleRepo,
            SpringDataCampaignRepository campaignRepo,
            SpringDataSynonymRepository synonymRepo
    ) {
        this.tenantRepo = tenantRepo;
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
        this.sessionRepo = sessionRepo;
        this.aiAssistant = aiAssistant;
        this.botRuleRepo = botRuleRepo;
        this.campaignRepo = campaignRepo;
        this.synonymRepo = synonymRepo;
    }

    /** Constructor alternativo para pruebas unitarias sin repositorios JPA opcionales. */
    public SalesEngineService(
            TenantRepositoryPort tenantRepo,
            ProductRepositoryPort productRepo,
            OrderRepositoryPort orderRepo,
            ChatSessionRepositoryPort sessionRepo,
            AiSalesAssistantPort aiAssistant
    ) {
        this(tenantRepo, productRepo, orderRepo, sessionRepo, aiAssistant, null, null, null);
    }

    @Override
    @Transactional
    public BotReply process(IncomingMessage msg) {
        String tenantId = msg.tenantId();
        Tenant tenant = tenantRepo.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant no encontrado: " + tenantId));

        List<Product> catalog = productRepo.findActiveByTenant(tenantId);
        String sessionId = msg.sessionId();
        ChatSession session = sessionRepo.findById(sessionId)
                .orElseGet(() -> new ChatSession(sessionId, tenantId, msg.channel()));

        session.setLastInteraction(OffsetDateTime.now());
        CheckoutStep prevStep = session.getStep() != null ? session.getStep() : CheckoutStep.IDLE;

        String rawText = msg.text() != null ? msg.text().trim() : "";
        String normText = normalizeCommand(rawText);

        // 1. Comandos globales deterministas de reinicio / menú
        if (RESET_COMMANDS.contains(normText)) {
            session.reset();
            BotReply welcome = buildWelcomeReply(tenant, catalog, true);
            session.addTurn("user", rawText);
            session.addTurn("assistant", welcome.text());
            sessionRepo.save(session);
            return welcome;
        }

        // 2. Si estaba esperando motivo de cancelación de pedido (CANCEL_REASON)
        if (prevStep == CheckoutStep.CANCEL_REASON) {
            return handlePendingCancellationReason(tenantId, msg, session, catalog, rawText, normText);
        }

        // 3. Solicitud explícita de cancelación de pedido registrado (o en paso CONFIRM con datos completos)
        Optional<BotReply> cancellationStart = tryStartOrderCancellation(tenantId, msg, session, prevStep, rawText, normText);
        if (cancellationStart.isPresent()) {
            session.addTurn("user", rawText);
            session.addTurn("assistant", cancellationStart.get().text());
            sessionRepo.save(session);
            return cancellationStart.get();
        }

        // 4. Cancelación simple cuando no hay checkout activo ni orden por cancelar
        if (!session.inCheckout() && ("cancelar".equals(normText) || "cancelar pedido".equals(normText) || "cancelar orden".equals(normText))) {
            session.reset();
            String cancelReply = "Entendido, he reiniciado tu conversación. Si deseas consultar algún producto, ver el catálogo o hacer un pedido, escríbeme con confianza.";
            session.addTurn("user", rawText);
            session.addTurn("assistant", cancelReply);
            sessionRepo.save(session);
            return BotReply.text(cancelReply).build(CheckoutStep.IDLE);
        }

        // 5. Si estaba en modo HUMANO y el usuario retoma el chat, reactivar bot
        if (session.isHuman()) {
            session.setStep(CheckoutStep.IDLE);
            session.setFallbackCount(0);
        }

        // 6. Cargar reglas, sinónimos, campañas y órdenes reales DEL CLIENTE desde BD PostgreSQL
        List<RuleContext> activeRules = loadActiveRules(tenantId);
        List<CampaignContext> activeCampaigns = loadActiveCampaigns(tenantId);
        List<Order> customerOrders = loadRelevantOrdersForCustomer(tenantId, session, msg, rawText);

        // 7. Invocar asistente IA (gpt-4o-mini o motor de respaldo grounded en BD)
        AssistantDecision decision = aiAssistant.generateReply(
                tenant,
                catalog,
                activeRules,
                activeCampaigns,
                customerOrders,
                session,
                msg
        );

        // 8. Sincronizar SKU seleccionado y categoría en la sesión
        Product selectedProduct;
        if (decision.cancelCheckout() && (decision.selectedSku() == null || decision.selectedSku().isBlank())) {
            selectedProduct = null;
            session.setSelectedSku(null);
        } else {
            selectedProduct = resolveProductBySku(decision.selectedSku(), catalog)
                    .orElseGet(() -> resolveProductBySku(session.getSelectedSku(), catalog).orElse(null));
            if (selectedProduct != null) {
                session.setSelectedSku(selectedProduct.sku());
                session.addOfferedSku(selectedProduct.sku());
                if (selectedProduct.category() != null) {
                    session.setActiveCategory(selectedProduct.category());
                }
            }
        }

        // 9. Sincronizar borrador y aplicar VALIDACIÓN SECUENCIAL ESTRICTA HONDURAS
        CheckoutStep nextStep = decision.nextStep() != null ? decision.nextStep() : CheckoutStep.IDLE;
        if (decision.cancelCheckout()) {
            session.setCheckout(null);
            if (nextStep.isCheckout()) {
                nextStep = CheckoutStep.IDLE;
            }
        }

        if (nextStep == CheckoutStep.HUMAN) {
            session.handoverToHuman();
        } else {
            session.setStep(nextStep);
        }

        String validationError = null;
        boolean customerRequestedInvoiceNow = HondurasOrderValidator.explicitInvoiceRequested(rawText);
        if (!decision.cancelCheckout() && (!decision.confirmOrderNow() || customerRequestedInvoiceNow)) {
            validationError = applyDraftUpdatesAndValidate(
                    session, prevStep, decision.draftUpdate(), selectedProduct, catalog, tenant, rawText, msg.location()
            );
        }

        // Autocompletar dirección si envió ubicación GPS nativa durante checkout
        if (msg.location() != null && msg.location().lat() != null && session.getCheckout() != null
                && !HondurasOrderValidator.isValidHondurasAddress(session.getCheckout().address, null)) {
            session.getCheckout().address = msg.location().resolvedAddress();
            session.getCheckout().location = msg.location();
        }

        String replyText = decision.replyText() != null ? decision.replyText() : "";
        boolean allowConfirmNow = decision.confirmOrderNow() && !customerRequestedInvoiceNow;

        // Guardrail supremo sobre estado del checkout: límites de cantidad, stock, entrega y pasos Honduras
        if (!decision.cancelCheckout() && nextStep != CheckoutStep.HUMAN
                && (session.inCheckout() || allowConfirmNow || session.getCheckout() != null)) {
            CheckoutDraft draft = session.getCheckout();
            if (allowConfirmNow && draft == null) {
                draft = ensureDraftForConfirmation(session, prevStep, decision.draftUpdate(), selectedProduct, catalog, tenant, rawText, msg.location());
            }
            if (draft != null) {
                Product prodForDraft = resolveProductBySku(draft.productSku, catalog).orElse(selectedProduct);
                int handoverLimit = HondurasDeliveryPolicy.humanHandoverThreshold(prodForDraft, catalog);

                // 1. Validar inventario en tiempo real (nunca vender más unidades que el stock real en BD)
                if (prodForDraft != null && (draft.quantity > prodForDraft.stock() || prodForDraft.stock() <= 0)) {
                    allowConfirmNow = false;
                    if (prodForDraft.stock() <= 0) {
                        replyText = "El modelo " + prodForDraft.name()
                                + " se encuentra temporalmente agotado. ¿Te gustaría que te muestre otro modelo similar disponible?";
                        session.setStep(CheckoutStep.IDLE);
                        session.setCheckout(null);
                        nextStep = CheckoutStep.IDLE;
                    } else {
                        replyText = "De momento solo nos quedan " + prodForDraft.stock()
                                + (prodForDraft.stock() == 1 ? " unidad disponible" : " unidades disponibles")
                                + " de " + prodForDraft.name() + ".\n\n¿Te apartamos "
                                + (prodForDraft.stock() == 1 ? "esa unidad disponible" : "las " + prodForDraft.stock() + " disponibles")
                                + " o prefieres ver otro modelo?";
                        draft.quantity = prodForDraft.stock();
                        draft.quantityConfirmed = false;
                        draft.quantityLabel = prodForDraft.stock() + (prodForDraft.stock() == 1 ? " unidad" : " unidades");
                        draft.recalculate();
                        session.setStep(CheckoutStep.QUANTITY);
                        nextStep = CheckoutStep.QUANTITY;
                    }
                } else if (prodForDraft != null && draft.quantityConfirmed && draft.quantity >= handoverLimit) {
                    // 2. Regla comercial: > 2 unidades en general (o >= 5 en línea Set/Tolix) -> trasladar a asesor humano
                    allowConfirmNow = false;
                    session.setSelectedSku(prodForDraft.sku());
                    session.setCheckout(null);
                    session.handoverToHuman();
                    nextStep = CheckoutStep.HUMAN;
                    replyText = HondurasDeliveryPolicy.buildHumanHandoverForQuantityReply(prodForDraft, draft.quantity);
                } else {
                    CheckoutStep requiredStep = computeNextPendingStep(draft, prodForDraft);
                    boolean askedSaturday = HondurasDeliveryPolicy.mentionsSaturday(normText);
                    boolean askedSpecificDate = HondurasDeliveryPolicy.mentionsSpecificDate(normText);

                    if (requiredStep != CheckoutStep.CONFIRM) {
                        // Nunca permitir confirmar ni saltar por encima del campo pendiente/inválido
                        allowConfirmNow = false;
                        boolean skippedAhead = stepOrder(nextStep) > stepOrder(requiredStep);
                        boolean rejectedCurrent = (validationError != null);
                        boolean isQuestion = isCheckoutQuestion(rawText, normText, prevStep, msg.location());

                        if (rejectedCurrent && !isQuestion) {
                            session.setStep(requiredStep);
                            nextStep = requiredStep;
                            replyText = validationError;
                        } else if (skippedAhead || (nextStep == CheckoutStep.IDLE && session.inCheckout())
                                || nextStep == CheckoutStep.REQUIRES_INVOICE) {
                            session.setStep(requiredStep);
                            nextStep = requiredStep;
                            if (!isQuestion) {
                                replyText = buildPromptForStep(requiredStep, draft);
                            } else if (!replyText.contains("?")) {
                                replyText = replyText + "\n\n" + buildPromptForStep(requiredStep, draft);
                            }
                        } else {
                            session.setStep(requiredStep);
                            nextStep = requiredStep;
                        }

                        if (askedSaturday && !replyText.toLowerCase(Locale.ROOT).contains("pareja")) {
                            replyText = HondurasDeliveryPolicy.buildSaturdayReply(
                                    (draft.address != null && !draft.address.isBlank()) ? draft.address : rawText)
                                    + "\n\n" + buildPromptForStep(requiredStep, draft);
                        } else if (askedSpecificDate && !askedSaturday && !replyText.contains("100%")) {
                            replyText = HondurasDeliveryPolicy.buildSpecificDateReply(
                                    (draft.address != null && !draft.address.isBlank()) ? draft.address : rawText)
                                    + "\n\n" + buildPromptForStep(requiredStep, draft);
                        }
                    } else if (!allowConfirmNow) {
                        boolean justEnteredConfirm = prevStep != CheckoutStep.CONFIRM;
                        session.setStep(CheckoutStep.CONFIRM);
                        nextStep = CheckoutStep.CONFIRM;
                        if (askedSaturday) {
                            replyText = HondurasDeliveryPolicy.buildSaturdayReply(draft.address)
                                    + "\n\n" + buildConciseOrderSummary(draft);
                        } else if (askedSpecificDate) {
                            replyText = HondurasDeliveryPolicy.buildSpecificDateReply(draft.address)
                                    + "\n\n" + buildConciseOrderSummary(draft);
                        } else if (justEnteredConfirm || !replyText.toLowerCase(Locale.ROOT).contains("confirm")) {
                            replyText = buildConciseOrderSummary(draft);
                        }
                    }
                }
            }
        }

        // 10. Confirmación formal e inserción en BD con datos completos de auditoría y descuento de inventario
        Order confirmedOrder = null;
        if (allowConfirmNow) {
            CheckoutDraft draft = session.getCheckout();
            if (draft != null && computeNextPendingStep(draft, selectedProduct) == CheckoutStep.CONFIRM) {
                Product currentProd = resolveProductBySku(draft.productSku, catalog).orElse(selectedProduct);
                int handoverLimit = HondurasDeliveryPolicy.humanHandoverThreshold(currentProd, catalog);
                if (currentProd != null && currentProd.stock() <= 0) {
                    replyText = "Lo sentimos, el modelo " + currentProd.name()
                            + " se encuentra temporalmente agotado. ¿Te gustaría ver otro modelo similar?";
                    session.setStep(CheckoutStep.IDLE);
                    session.setCheckout(null);
                    nextStep = CheckoutStep.IDLE;
                } else if (currentProd != null && draft.quantity > currentProd.stock()) {
                    replyText = "De momento solo nos quedan " + currentProd.stock()
                            + (currentProd.stock() == 1 ? " unidad disponible" : " unidades disponibles")
                            + " de " + currentProd.name() + ".\n\n¿Confirmamos tu orden por "
                            + (currentProd.stock() == 1 ? "esa unidad" : "las " + currentProd.stock() + " unidades disponibles") + "?";
                    draft.quantity = currentProd.stock();
                    draft.quantityLabel = currentProd.stock() + (currentProd.stock() == 1 ? " unidad" : " unidades");
                    draft.recalculate();
                    session.setStep(CheckoutStep.CONFIRM);
                    nextStep = CheckoutStep.CONFIRM;
                } else if (currentProd != null && draft.quantity >= handoverLimit) {
                    session.setSelectedSku(currentProd.sku());
                    session.setCheckout(null);
                    session.handoverToHuman();
                    nextStep = CheckoutStep.HUMAN;
                    replyText = HondurasDeliveryPolicy.buildHumanHandoverForQuantityReply(currentProd, draft.quantity);
                } else {
                    if (!draft.requiresInvoice && (draft.rtn == null || draft.rtn.isBlank())) {
                        draft.rtn = "Consumidor Final (Sin RTN)";
                    }
                    if (draft.orderNumber == null || draft.orderNumber.isBlank() || orderRepo.existsByOrderNumber(draft.orderNumber)) {
                        draft.orderNumber = generateOrderNumber(tenant);
                    }
                    Order orderToSave = Order.fromDraft(
                            tenantId,
                            draft,
                            msg.channel() != null ? msg.channel().name() : "WEB",
                            msg.customerId(),
                            msg.clientIp()
                    );
                    confirmedOrder = orderRepo.save(orderToSave);

                    if (currentProd != null) {
                        int remainingStock = Math.max(0, currentProd.stock() - draft.quantity);
                        Product updatedProd = currentProd.withStock(remainingStock);
                        productRepo.save(updatedProd);
                    }

                    session.completeCheckout(confirmedOrder.orderNumber());
                    nextStep = CheckoutStep.IDLE;

                    replyText = HondurasDeliveryPolicy.buildFinalOrderConfirmation(
                            draft.effectiveRecipient(),
                            confirmedOrder.orderNumber(),
                            draft.effectiveQuantityLabel(),
                            draft.productName,
                            confirmedOrder.total(),
                            confirmedOrder.deliveryAddress(),
                            confirmedOrder.customerPhone()
                    );
                }
            }
        }

        // Sanitización suprema: sin emojis, sin negritas/asteriscos, sin "Fíjate que", sin SKUs
        replyText = HondurasDeliveryPolicy.sanitizeCustomerReply(replyText);

        // 11. Registrar turno en historial conversacional (16 turnos)
        String userTurnText = !rawText.isBlank()
                ? rawText
                : (msg.location() != null ? "[Ubicación GPS: " + msg.location().resolvedAddress() + "]" : "");
        session.addTurn("user", userTurnText);
        session.addTurn("assistant", replyText);
        sessionRepo.save(session);

        // 12. Selección de imágenes del producto
        List<String> imagesToSend = Collections.emptyList();
        if (selectedProduct != null && selectedProduct.images() != null && !selectedProduct.images().isEmpty()) {
            boolean userAskedMorePhotos = isMorePhotosQuery(normText);
            if (decision.sendAllPhotos() || userAskedMorePhotos) {
                imagesToSend = selectedProduct.firstImages(5);
            } else if (decision.sendProductPhotos()) {
                imagesToSend = selectedProduct.firstImages(1);
            }
        }

        return BotReply.text(replyText)
                .product(selectedProduct)
                .images(imagesToSend)
                .orderDraft(session.getCheckout())
                .confirmedOrder(confirmedOrder)
                .location(msg.location())
                .human(session.isHuman())
                .build(nextStep);
    }

    @Override
    @Transactional
    public void resetSession(IncomingMessage identity) {
        String sessionId = identity.sessionId();
        sessionRepo.findById(sessionId).ifPresent(s -> {
            s.reset();
            sessionRepo.save(s);
        });
    }

    // =========================================================================
    // FLUJO DETERMINISTA DE CANCELACIÓN DE PEDIDOS CON MOTIVO EN BD
    // =========================================================================
    private Optional<BotReply> tryStartOrderCancellation(
            String tenantId,
            IncomingMessage msg,
            ChatSession session,
            CheckoutStep prevStep,
            String rawText,
            String normText
    ) {
        boolean explicitOrderCancel = containsAny(normText,
                "cancelar mi pedido", "cancelar el pedido", "cancela mi pedido", "quiero cancelar mi pedido",
                "cancelar mi orden", "cancelar la orden", "cancela mi orden", "quiero cancelar mi orden",
                "anular pedido", "anular mi pedido", "cancelar pedido");
        boolean plainCancel = "cancelar".equals(normText) || "cancela".equals(normText);

        if (!explicitOrderCancel && !(plainCancel && prevStep == CheckoutStep.CONFIRM)) {
            return Optional.empty();
        }

        // A. Buscar si existe una orden confirmada activa en PostgreSQL para cancelar
        Order activeDbOrder = findCancellableOrderInDb(tenantId, session, msg, rawText).orElse(null);
        if (activeDbOrder != null) {
            session.setPendingCancelOrderNumber(activeDbOrder.orderNumber());
            session.setStep(CheckoutStep.CANCEL_REASON);
            String prompt = "Con gusto te ayudo a cancelar tu pedido " + activeDbOrder.orderNumber()
                    + " (" + activeDbOrder.productName() + ").\n\n"
                    + "Por favor indícame brevemente el motivo de la cancelación para registrarlo en nuestro sistema:";
            return Optional.of(BotReply.text(prompt).build(CheckoutStep.CANCEL_REASON));
        }

        // B. Si está en CONFIRM con todos los datos validados (incluyendo teléfono) y cancela en ese punto
        CheckoutDraft draft = session.getCheckout();
        if (prevStep == CheckoutStep.CONFIRM && draft != null && HondurasOrderValidator.isValidHondurasPhone(draft.phone)) {
            session.setPendingCancelOrderNumber(draft.orderNumber);
            session.setStep(CheckoutStep.CANCEL_REASON);
            String prompt = "Entendido, podemos cancelar tu pedido " + draft.orderNumber
                    + " (" + draft.productName + ").\n\n"
                    + "¿Me compartes brevemente el motivo de la cancelación para dejarlo registrado?";
            return Optional.of(BotReply.text(prompt).build(CheckoutStep.CANCEL_REASON));
        }

        return Optional.empty();
    }

    private BotReply handlePendingCancellationReason(
            String tenantId,
            IncomingMessage msg,
            ChatSession session,
            List<Product> catalog,
            String rawText,
            String normText
    ) {
        String targetNum = session.getPendingCancelOrderNumber();
        if (containsAny(normText, "no cancelar", "mejor no", "mantener", "no lo canceles", "seguir con el pedido")) {
            session.setPendingCancelOrderNumber(null);
            session.setStep(CheckoutStep.IDLE);
            String keepReply = "Perfecto. Mantenemos activo tu pedido " + (targetNum != null ? targetNum : "") + ". ¿En qué más puedo ayudarte?";
            session.addTurn("user", rawText);
            session.addTurn("assistant", keepReply);
            sessionRepo.save(session);
            return BotReply.text(keepReply).build(CheckoutStep.IDLE);
        }

        if (!HondurasOrderValidator.isValidCancellationReason(rawText)) {
            String retry = "Para registrar la cancelación en nuestro sistema, por favor indícame el motivo (ejemplo: \"Ya no lo voy a necesitar\" o \"Me equivoqué de modelo\"):";
            session.addTurn("user", rawText);
            session.addTurn("assistant", retry);
            sessionRepo.save(session);
            return BotReply.text(retry).build(CheckoutStep.CANCEL_REASON);
        }

        String reason = rawText.trim();
        Optional<Order> existingOpt = (targetNum != null && !targetNum.isBlank())
                ? orderRepo.findByNumberOrTracking(tenantId, targetNum)
                : Optional.empty();

        Order cancelledOrder;
        if (existingOpt.isPresent()) {
            Order existing = existingOpt.get();
            OrderStatus prevStatus = existing.status();
            cancelledOrder = existing.withStatusUpdate(
                    OrderStatus.CANCELADO,
                    null,
                    null,
                    reason,
                    "CLIENTE (" + (msg.channel() != null ? msg.channel().name() : "WEB") + ")"
            );
            cancelledOrder = orderRepo.save(cancelledOrder);

            // Reponer stock en PostgreSQL si la orden aún no estaba cancelada ni entregada
            if (prevStatus != OrderStatus.CANCELADO && prevStatus != OrderStatus.ENTREGADO) {
                resolveProductBySku(existing.productSku(), catalog).ifPresent(prod -> {
                    productRepo.save(prod.withStock(prod.stock() + existing.quantity()));
                });
            }
        } else if (session.getCheckout() != null && HondurasOrderValidator.isValidHondurasPhone(session.getCheckout().phone)) {
            Order draftCancel = Order.cancelledFromDraft(
                    tenantId,
                    session.getCheckout(),
                    msg.channel() != null ? msg.channel().name() : "WEB",
                    msg.customerId(),
                    msg.clientIp(),
                    reason
            );
            cancelledOrder = orderRepo.save(draftCancel);
        } else {
            cancelledOrder = null;
        }

        String orderLabel = cancelledOrder != null ? cancelledOrder.orderNumber() : (targetNum != null ? targetNum : "");
        session.setPendingCancelOrderNumber(null);
        session.setCheckout(null);
        session.setStep(CheckoutStep.IDLE);

        String doneReply = "Tu pedido " + orderLabel + " ha quedado cancelado y registramos tu motivo (" + reason + "). "
                + "Cuando gustes ordenar nuevamente, aquí estoy para atenderte.";
        session.addTurn("user", rawText);
        session.addTurn("assistant", doneReply);
        sessionRepo.save(session);

        return BotReply.text(doneReply)
                .confirmedOrder(cancelledOrder)
                .build(CheckoutStep.IDLE);
    }

    private Optional<Order> findCancellableOrderInDb(
            String tenantId,
            ChatSession session,
            IncomingMessage msg,
            String rawText
    ) {
        List<Order> candidates = loadRelevantOrdersForCustomer(tenantId, session, msg, rawText);
        return candidates.stream()
                .filter(o -> o.status() == OrderStatus.PENDIENTE || o.status() == OrderStatus.EN_CAMINO)
                .findFirst();
    }

    // =========================================================================
    // VALIDACIÓN Y SINCRONIZACIÓN ESTRICTA DEL CHECKOUT HONDURAS
    // =========================================================================
    private String applyDraftUpdatesAndValidate(
            ChatSession session,
            CheckoutStep prevStep,
            DraftUpdate update,
            Product selectedProduct,
            List<Product> catalog,
            Tenant tenant,
            String rawText,
            GeoLocation location
    ) {
        if (session.getStep() == CheckoutStep.IDLE && update == null) {
            session.setCheckout(null);
            return null;
        }

        if (session.getStep() == CheckoutStep.IDLE && update != null
                && update.productSku() == null && update.customerName() == null && update.deliveryAddress() == null) {
            session.setCheckout(null);
            return null;
        }

        Product targetProduct = selectedProduct;
        if (update != null && update.productSku() != null && !update.productSku().isBlank()) {
            targetProduct = resolveProductBySku(update.productSku(), catalog).orElse(selectedProduct);
        }

        CheckoutDraft draft = session.getCheckout();
        if (draft == null && targetProduct != null && session.getStep().isCheckout()) {
            boolean explicitQty = hasExplicitQuantityInMessage(rawText);
            Integer parsedQty = parseQuantityFromText(rawText);
            int initialQty = (update != null && update.quantity() != null && update.quantity() > 0)
                    ? update.quantity()
                    : (explicitQty && parsedQty != null ? parsedQty : 1);
            draft = CheckoutDraft.start(targetProduct, initialQty, generateOrderNumber(tenant), explicitQty);
            session.setCheckout(draft);
        }

        if (draft == null) {
            return null;
        }

        if (targetProduct != null && !targetProduct.sku().equalsIgnoreCase(draft.productSku)) {
            draft.applyProduct(targetProduct);
        }

        // Factura con RTN solo si el cliente la solicita explícitamente
        final CheckoutDraft currentDraft = draft;
        if (HondurasOrderValidator.explicitInvoiceRequested(rawText)) {
            currentDraft.requiresInvoice = true;
            currentDraft.invoiceAnswered = true;
            HondurasOrderValidator.normalizeAndValidateRtn(rawText).ifPresent(r -> currentDraft.rtn = r);
        }

        String validationError = null;
        boolean isQuestion = isCheckoutQuestion(rawText, normalizeCommand(rawText), prevStep, location);

        // 1. Validar entrada directa del turno actual según el paso previo (protege contra errores del LLM)
        if (!isQuestion && rawText != null && !rawText.isBlank()) {
            switch (prevStep) {
                case NAME -> {
                    String candidateName = (update != null && update.customerName() != null && !update.customerName().isBlank())
                            ? update.customerName() : rawText;
                    if (HondurasOrderValidator.isValidFullName(candidateName)) {
                        draft.name = HondurasOrderValidator.extractCleanFullName(candidateName);
                        draft.recipientName = draft.name;
                    } else if (HondurasOrderValidator.isValidFullName(rawText)) {
                        draft.name = HondurasOrderValidator.extractCleanFullName(rawText);
                        draft.recipientName = draft.name;
                    } else {
                        validationError = "Para registrar tu guía de Cargo Expreso necesito tu nombre completo (nombre y al menos un apellido, por ejemplo: Carlos Mendoza):";
                    }
                }
                case QUANTITY -> {
                    Integer qtyVal = (update != null && update.quantity() != null && update.quantity() > 0)
                            ? update.quantity()
                            : parseQuantityFromText(rawText);
                    if (qtyVal != null && qtyVal > 0) {
                        draft.quantity = qtyVal;
                        draft.quantityConfirmed = true;
                        draft.quantityLabel = qtyVal + (qtyVal == 1 ? " unidad" : " unidades");
                        draft.recalculate();
                    } else {
                        validationError = "Por favor indícanos en número cuántas unidades de " + draft.productName + " deseas ordenar (ejemplo: 1 o 2):";
                    }
                }
                case ADDRESS -> {
                    if (location != null && location.lat() != null && location.lng() != null) {
                        draft.address = location.resolvedAddress();
                        draft.location = location;
                    } else {
                        String candidateAddr = (update != null && update.deliveryAddress() != null && HondurasOrderValidator.isValidHondurasAddress(update.deliveryAddress(), location))
                                ? update.deliveryAddress()
                                : rawText;
                        if (HondurasOrderValidator.isValidHondurasAddress(candidateAddr, location)) {
                            draft.address = candidateAddr.trim();
                            draft.agencyPickup = HondurasOrderValidator.isAgencyAddress(candidateAddr);
                        } else {
                            validationError = "Para enviar por Cargo Expreso sin retrasos, compártenos tu dirección completa en Honduras:\n"
                                    + "- Ciudad / Municipio\n- Colonia, barrio o residencial\n- Calle, número de casa y referencia\n"
                                    + "(O indica una Agencia Cargo Expreso con ciudad, o envía tu ubicación GPS):";
                        }
                    }
                }
                case PHONE -> {
                    String candidatePhone = (update != null && update.customerPhone() != null && HondurasOrderValidator.isValidHondurasPhone(update.customerPhone()))
                            ? update.customerPhone() : rawText;
                    Optional<String> validPhone = HondurasOrderValidator.normalizeAndValidatePhone(candidatePhone);
                    if (validPhone.isEmpty()) {
                        validPhone = HondurasOrderValidator.normalizeAndValidatePhone(rawText);
                    }
                    if (validPhone.isPresent()) {
                        draft.phone = validPhone.get();
                    } else {
                        validationError = "Por favor indícanos un teléfono válido en Honduras de 8 dígitos que reciba llamadas directas de Cargo Expreso (ejemplo: 9800-8559):";
                    }
                }
                case REQUIRES_INVOICE -> {
                    Optional<Boolean> invOpt = HondurasOrderValidator.parseInvoiceDecision(rawText);
                    if (invOpt.isPresent()) {
                        draft.invoiceAnswered = true;
                        draft.requiresInvoice = invOpt.get();
                        if (!draft.requiresInvoice) {
                            draft.rtn = "Consumidor Final (Sin RTN)";
                            draft.businessName = null;
                        }
                    } else {
                        validationError = "Si requieres factura con RTN indícanos tu número de RTN de 14 dígitos; si no, escribe Confirmar para finalizar.";
                    }
                }
                case INVOICE_RTN -> {
                    String candidateRtn = (update != null && update.rtn() != null && HondurasOrderValidator.isValidHondurasRtn(update.rtn()))
                            ? update.rtn() : rawText;
                    Optional<String> validRtn = HondurasOrderValidator.normalizeAndValidateRtn(candidateRtn);
                    if (validRtn.isEmpty()) {
                        validRtn = HondurasOrderValidator.normalizeAndValidateRtn(rawText);
                    }
                    if (validRtn.isPresent()) {
                        draft.invoiceAnswered = true;
                        draft.requiresInvoice = true;
                        draft.rtn = validRtn.get();
                    } else {
                        validationError = "El RTN en Honduras debe tener exactamente 14 dígitos numéricos (ejemplo: 08011990123456). ¿Me lo compartes completo?";
                    }
                }
                case INVOICE_BUSINESS_NAME -> {
                    String candidateBiz = (update != null && update.businessName() != null && HondurasOrderValidator.isValidBusinessName(update.businessName()))
                            ? update.businessName() : rawText;
                    if (HondurasOrderValidator.isValidBusinessName(candidateBiz)) {
                        draft.businessName = HondurasOrderValidator.extractCleanBusinessName(candidateBiz);
                    } else if (HondurasOrderValidator.isValidBusinessName(rawText)) {
                        draft.businessName = HondurasOrderValidator.extractCleanBusinessName(rawText);
                    } else {
                        validationError = "Por favor compárteme el Nombre o Razón Social completo para tu factura con RTN:";
                    }
                }
                default -> {
                    // Al iniciar compra desde IDLE (prevStep == IDLE): solo aceptar campos explícitos si son válidos
                    boolean explicitQty = hasExplicitQuantityInMessage(rawText);
                    Integer parsedQty = parseQuantityFromText(rawText);
                    if (explicitQty && parsedQty != null && parsedQty > 0) {
                        draft.quantity = parsedQty;
                        draft.quantityConfirmed = true;
                        draft.quantityLabel = draft.quantity + (draft.quantity == 1 ? " unidad" : " unidades");
                        draft.recalculate();
                    }
                    if (update != null) {
                        if (update.quantity() != null && update.quantity() > 0 && !(explicitQty && parsedQty != null)) {
                            draft.quantity = update.quantity();
                            if (explicitQty) {
                                draft.quantityConfirmed = true;
                                draft.quantityLabel = draft.quantity + (draft.quantity == 1 ? " unidad" : " unidades");
                            }
                            draft.recalculate();
                        }
                        if (HondurasOrderValidator.isValidFullName(update.customerName())) {
                            draft.name = HondurasOrderValidator.extractCleanFullName(update.customerName());
                            draft.recipientName = draft.name;
                        }
                        if (HondurasOrderValidator.isValidHondurasAddress(update.deliveryAddress(), location)) {
                            draft.address = update.deliveryAddress().trim();
                            draft.agencyPickup = HondurasOrderValidator.isAgencyAddress(draft.address);
                        }
                        Optional<String> validPhone = HondurasOrderValidator.normalizeAndValidatePhone(update.customerPhone());
                        if (validPhone.isPresent()) {
                            draft.phone = validPhone.get();
                        }
                    }
                }
            }
        }

        // Blindaje financiero: precios fijos siempre desde catálogo real en BD (sin descuentos ni rebajas)
        final CheckoutDraft finalDraft = draft;
        resolveProductBySku(finalDraft.productSku, catalog).ifPresent(dbProd -> {
            finalDraft.unitPrice = dbProd.salePrice();
            finalDraft.recalculate();
        });

        return validationError;
    }

    private CheckoutDraft ensureDraftForConfirmation(
            ChatSession session,
            CheckoutStep prevStep,
            DraftUpdate update,
            Product selectedProduct,
            List<Product> catalog,
            Tenant tenant,
            String rawText,
            GeoLocation location
    ) {
        CheckoutDraft draft = session.getCheckout();
        if (draft == null) {
            Product prod = selectedProduct;
            if (update != null && update.productSku() != null) {
                prod = resolveProductBySku(update.productSku(), catalog).orElse(selectedProduct);
            }
            if (prod == null) {
                return null;
            }
            int qty = (update != null && update.quantity() != null && update.quantity() > 0) ? update.quantity() : 1;
            draft = CheckoutDraft.start(prod, qty, generateOrderNumber(tenant), hasExplicitQuantityInMessage(rawText));
            session.setCheckout(draft);
        }
        if (update != null) {
            applyDraftUpdatesAndValidate(session, prevStep, update, selectedProduct, catalog, tenant, rawText, location);
        }
        return session.getCheckout();
    }

    private CheckoutStep computeNextPendingStep(CheckoutDraft d, Product currentProd) {
        if (!HondurasOrderValidator.isValidFullName(d.name)) {
            return CheckoutStep.NAME;
        }
        if (!d.quantityConfirmed || d.quantity <= 0 || (currentProd != null && d.quantity > currentProd.stock())) {
            return CheckoutStep.QUANTITY;
        }
        if (!HondurasOrderValidator.isValidHondurasAddress(d.address, d.location)) {
            return CheckoutStep.ADDRESS;
        }
        if (!HondurasOrderValidator.isValidHondurasPhone(d.phone)) {
            return CheckoutStep.PHONE;
        }
        // Solo pedir datos de factura RTN si el cliente la solicitó por iniciativa propia
        if (d.requiresInvoice) {
            if (!HondurasOrderValidator.isValidHondurasRtn(d.rtn)) {
                return CheckoutStep.INVOICE_RTN;
            }
            if (!HondurasOrderValidator.isValidBusinessName(d.businessName)) {
                return CheckoutStep.INVOICE_BUSINESS_NAME;
            }
        }
        return CheckoutStep.CONFIRM;
    }

    private int stepOrder(CheckoutStep s) {
        if (s == null) return 0;
        return switch (s) {
            case IDLE -> 0;
            case NAME -> 1;
            case QUANTITY -> 2;
            case ADDRESS -> 3;
            case PHONE -> 4;
            case REQUIRES_INVOICE -> 5;
            case INVOICE_RTN -> 6;
            case INVOICE_BUSINESS_NAME -> 7;
            case CONFIRM -> 8;
            case CANCEL_REASON, HUMAN -> 9;
        };
    }

    private String buildPromptForStep(CheckoutStep step, CheckoutDraft d) {
        return switch (step) {
            case NAME -> "Para apartar tu " + d.productName + ", ¿cuál es tu nombre completo (nombre y apellido)?";
            case QUANTITY -> "Gracias, " + d.name + ". ¿Cuántas unidades de " + d.productName + " deseas ordenar? (Ejemplo: 1, 2):";
            case ADDRESS -> "Anotado. ¿A qué dirección en Honduras te lo enviamos?\n- Ciudad / Municipio\n- Colonia, barrio o residencial\n- Calle, casa y referencia (o Agencia Cargo Expreso / ubicación GPS):";
            case PHONE -> "Dirección registrada. ¿A qué número telefónico de 8 dígitos en Honduras (que reciba llamadas directas) te contactará Cargo Expreso?";
            case INVOICE_RTN -> "Por favor indícanos tu número de RTN de Honduras (14 dígitos numéricos, ejemplo: 08011990123456):";
            case INVOICE_BUSINESS_NAME -> "RTN registrado (" + d.rtn + "). ¿Cuál es el Nombre o Razón Social de la empresa para la factura?";
            case CONFIRM -> buildConciseOrderSummary(d);
            default -> "¿En qué puedo ayudarte hoy?";
        };
    }

    private String buildConciseOrderSummary(CheckoutDraft d) {
        String window = HondurasDeliveryPolicy.estimateDeliveryWindow(d.address);
        String invLine = d.requiresInvoice
                ? "\n- Factura RTN: " + d.rtn + " (" + d.businessName + ")"
                : "";
        return "Resumen de tu pedido listo para confirmar:\n"
                + "- Producto: " + d.productName + " (" + d.effectiveQuantityLabel() + ")\n"
                + "- Total: " + Money.lempiras(d.total) + " (Envío gratis)\n"
                + "- Cliente: " + d.name + " | Tel: " + d.phone + "\n"
                + "- Entrega estimada (" + window + "): " + d.address
                + invLine + "\n\n"
                + "Escribe Confirmar para registrar tu pedido (o dime si necesitas factura con RTN).";
    }

    // =========================================================================
    // CONSULTAS ESTRICTAS DESDE POSTGRESQL (SKU, REGLAS, SINÓNIMOS, ÓRDENES)
    // =========================================================================
    private Optional<Product> resolveProductBySku(String sku, List<Product> catalog) {
        if (sku == null || sku.isBlank()) {
            return Optional.empty();
        }
        String cleanSku = sku.trim();
        Optional<Product> exact = catalog.stream()
                .filter(p -> p.sku().equalsIgnoreCase(cleanSku))
                .findFirst();
        if (exact.isPresent()) {
            return exact;
        }
        return catalog.stream()
                .filter(p -> p.keywords() != null && p.keywords().stream()
                        .anyMatch(kw -> kw != null && kw.equalsIgnoreCase(cleanSku)))
                .findFirst();
    }

    private List<RuleContext> loadActiveRules(String tenantId) {
        List<RuleContext> result = new ArrayList<>();
        if (botRuleRepo != null) {
            try {
                var ruleEntities = botRuleRepo.findByTenantIdOrderByCreatedAtAsc(tenantId);
                if (ruleEntities.isEmpty() && !"smak".equalsIgnoreCase(tenantId)) {
                    ruleEntities = botRuleRepo.findByTenantIdOrderByCreatedAtAsc("smak");
                }
                ruleEntities.stream()
                        .filter(r -> Boolean.TRUE.equals(r.getEnabled()))
                        .forEach(r -> {
                            String resp = r.getResponse();
                            if (resp == null || resp.isBlank()) {
                                resp = r.getResponseInStock();
                            }
                            if ((resp != null && !resp.isBlank()) || r.getResponseInStock() != null) {
                                result.add(new RuleContext(
                                        r.getName(),
                                        r.getCategory(),
                                        r.getTrainingPhrases() != null ? r.getTrainingPhrases() : List.of(),
                                        resp,
                                        r.getResponseInStock(),
                                        r.getResponseOutOfStock(),
                                        r.getResponseNotFound()
                                ));
                            }
                        });
            } catch (Exception ignored) {
            }
        }
        if (synonymRepo != null) {
            try {
                var synEntities = synonymRepo.findByTenantIdOrderByConceptAsc(tenantId);
                if (synEntities.isEmpty() && !"smak".equalsIgnoreCase(tenantId)) {
                    synEntities = synonymRepo.findByTenantIdOrderByConceptAsc("smak");
                }
                synEntities.forEach(s -> {
                    if (s.getWords() != null && !s.getWords().isEmpty()) {
                        result.add(new RuleContext(
                                s.getConcept(),
                                "Sinónimos y Términos Equivalentes",
                                s.getWords(),
                                "Términos o sinónimos usados por clientes: " + String.join(", ", s.getWords()),
                                null, null, null
                        ));
                    }
                });
            } catch (Exception ignored) {
            }
        }
        return result;
    }

    private List<CampaignContext> loadActiveCampaigns(String tenantId) {
        if (campaignRepo == null) {
            return Collections.emptyList();
        }
        try {
            var campEntities = campaignRepo.findByTenantIdOrderByCreatedAtAsc(tenantId);
            if (campEntities.isEmpty() && !"smak".equalsIgnoreCase(tenantId)) {
                campEntities = campaignRepo.findByTenantIdOrderByCreatedAtAsc("smak");
            }
            return campEntities.stream()
                    .map(c -> new CampaignContext(c.getPlatform(), c.getUrl(), c.getHeadline(), c.getSku()))
                    .toList();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    /**
     * Consulta en PostgreSQL únicamente las órdenes pertenecientes al cliente actual
     * o al código exacto de pedido/guía solicitado en el mensaje.
     */
    private List<Order> loadRelevantOrdersForCustomer(
            String tenantId,
            ChatSession session,
            IncomingMessage msg,
            String rawText
    ) {
        Map<String, Order> uniqueByNumber = new LinkedHashMap<>();
        try {
            // 1. Código explícito de orden o guía mencionado en el mensaje
            if (rawText != null && !rawText.isBlank()) {
                Matcher m = ORDER_OR_TRACKING_CODE.matcher(rawText);
                while (m.find()) {
                    String code = m.group(1);
                    orderRepo.findByNumberOrTracking(tenantId, code)
                            .ifPresent(o -> uniqueByNumber.put(o.orderNumber(), o));
                }
            }

            // 2. Última orden generada en esta sesión
            if (session.getLastOrderNumber() != null && !session.getLastOrderNumber().isBlank()) {
                orderRepo.findByNumberOrTracking(tenantId, session.getLastOrderNumber())
                        .ifPresent(o -> uniqueByNumber.put(o.orderNumber(), o));
            }

            // 3. Órdenes del mismo cliente (por source_session_id o últimos 8 dígitos del teléfono WA)
            String waPhone = (msg.channel() == Channel.WHATSAPP) ? msg.customerId() : "";
            List<Order> owned = orderRepo.findRecentForCustomer(tenantId, msg.customerId(), waPhone);
            if (owned != null) {
                for (Order o : owned) {
                    uniqueByNumber.putIfAbsent(o.orderNumber(), o);
                    if (uniqueByNumber.size() >= 5) break;
                }
            }
        } catch (Exception ignored) {
        }
        return new ArrayList<>(uniqueByNumber.values());
    }

    private BotReply buildWelcomeReply(Tenant tenant, List<Product> catalog, boolean isReset) {
        // Priorizar sillas, escritorios y muebles variados de BD en lugar de un único tipo
        List<Product> inStock = catalog.stream().filter(Product::inStock).toList();
        List<Product> featured = new ArrayList<>();
        inStock.stream().filter(p -> p.name().toLowerCase(Locale.ROOT).contains("silla") && !p.name().toLowerCase(Locale.ROOT).contains("ruedas")).limit(2).forEach(featured::add);
        inStock.stream().filter(p -> p.name().toLowerCase(Locale.ROOT).contains("escritorio") || p.name().toLowerCase(Locale.ROOT).contains("mesa")).limit(1).forEach(featured::add);
        for (Product p : inStock) {
            if (featured.size() >= 4) break;
            if (featured.stream().noneMatch(f -> f.sku().equals(p.sku()))) {
                featured.add(p);
            }
        }

        StringBuilder catalogSummary = new StringBuilder();
        for (Product p : featured) {
            catalogSummary.append("- ").append(p.name()).append(" — ")
                    .append(Money.lempiras(p.salePrice())).append("\n");
        }

        String header = isReset
                ? "Conversación reiniciada. Bienvenido nuevamente a " + tenant.name() + ". Con mucho gusto te atiendo.\n\n"
                : "Hola, bienvenido a " + tenant.name() + ". Con mucho gusto te atiendo.\n\n";

        String text = header
                + "Te comparto algunos de nuestros modelos destacados:\n"
                + (catalogSummary.length() > 0 ? catalogSummary.toString() : "- Sillas ergonómicas, gamers y muebles para el hogar.\n")
                + "\nTodos cuentan con envío gratis en Honduras vía Cargo Expreso y pago contra entrega.\n\n"
                + "¿Qué modelo buscas o te gustaría cotizar?";
        return BotReply.text(HondurasDeliveryPolicy.sanitizeCustomerReply(text)).build(CheckoutStep.IDLE);
    }

    private String generateOrderNumber(Tenant tenant) {
        String prefix = tenant.effectiveOrderPrefix();
        long nextNum = 1001 + orderRepo.countByTenant(tenant.id());
        String candidate = String.format("%s-%04d", prefix, nextNum);
        while (orderRepo.existsByOrderNumber(candidate)) {
            nextNum++;
            candidate = String.format("%s-%04d", prefix, nextNum);
        }
        return candidate;
    }

    private boolean hasExplicitQuantityInMessage(String rawText) {
        if (rawText == null || rawText.isBlank()) return false;
        if (STANDALONE_QTY_DIGITS.matcher(rawText).find()) return true;
        String norm = normalizeCommand(rawText);
        return containsAny(norm, "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho");
    }

    private Integer parseQuantityFromText(String rawText) {
        if (rawText == null || rawText.isBlank()) return null;
        Matcher m = STANDALONE_QTY_DIGITS.matcher(rawText);
        if (m.find()) {
            try {
                int v = Integer.parseInt(m.group(1));
                if (v > 0 && v <= 100) return v;
            } catch (NumberFormatException ignored) {
            }
        }
        String norm = normalizeCommand(rawText);
        if (containsAny(norm, "uno", "una", "un")) return 1;
        if (containsAny(norm, "dos")) return 2;
        if (containsAny(norm, "tres")) return 3;
        if (containsAny(norm, "cuatro")) return 4;
        if (containsAny(norm, "cinco")) return 5;
        if (containsAny(norm, "seis")) return 6;
        if (containsAny(norm, "siete")) return 7;
        if (containsAny(norm, "ocho")) return 8;
        return null;
    }

    private boolean isCheckoutQuestion(String raw, String norm, CheckoutStep prevStep, GeoLocation location) {
        if (raw != null && (raw.contains("?") || raw.contains("¿"))) return true;
        // Si ya cumplió el dato esperado para el paso actual (ej. envió dirección completa + mencionó sábado),
        // permitir guardar el dato en lugar de bloquear el paso como pregunta pura.
        if (prevStep == CheckoutStep.ADDRESS && HondurasOrderValidator.isValidHondurasAddress(raw, location)) {
            return false;
        }
        if (prevStep == CheckoutStep.PHONE && HondurasOrderValidator.isValidHondurasPhone(raw)) {
            return false;
        }
        return containsAny(norm, "precio", "cuesta", "vale", "color", "colores", "medida", "medidas",
                "mide", "peso", "soporta", "foto", "fotos", "garantia", "envio", "horario", "horarios",
                "roatan", "utila", "transferencia", "tarjeta", "otro modelo", "otros modelos",
                "sabado", "sabados", "fecha", "cuando llega", "cuanto tarda");
    }

    private boolean isMorePhotosQuery(String norm) {
        if (norm == null || norm.isBlank()) return false;
        return norm.contains("mas foto") || norm.contains("más foto")
                || norm.contains("mas fotos") || norm.contains("más fotos")
                || norm.contains("otras fotos") || norm.contains("otra foto")
                || norm.contains("galeria") || norm.contains("galería")
                || norm.contains("ver foto") || norm.contains("ver fotos")
                || norm.contains("todas las fotos") || norm.contains("mas imagenes")
                || norm.contains("más imagenes");
    }

    private String normalizeCommand(String raw) {
        if (raw == null || raw.isBlank()) return "";
        String noAccents = Normalizer.normalize(raw.toLowerCase(Locale.ROOT), Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "");
        return noAccents.replaceAll("[^a-z0-9\\s]", " ").replaceAll("\\s+", " ").trim();
    }

    private static boolean containsAny(String text, String... terms) {
        for (String t : terms) {
            if (text.contains(t)) return true;
        }
        return false;
    }
}
