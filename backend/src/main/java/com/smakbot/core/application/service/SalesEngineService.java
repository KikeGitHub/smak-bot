package com.smakbot.core.application.service;

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
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;

/**
 * Orquestador comercial central impulsado por IA (gpt-4o-mini) con validación estricta
 * de precios, inventario, historial multi-turno y parametrización multitenant.
 */
@Service
public class SalesEngineService implements ProcessMessageUseCase {

    private static final Set<String> RESET_COMMANDS = Set.of(
            "reiniciar", "reset", "menu", "inicio", "empezar de nuevo", "volver a empezar", "reinicio"
    );

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

    /**
     * Constructor alternativo para pruebas unitarias sin repositorios JPA opcionales.
     */
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

        // 2. Comando de cancelar cuando no hay checkout activo
        if (!session.inCheckout() && ("cancelar".equals(normText) || "cancelar pedido".equals(normText) || "cancelar orden".equals(normText))) {
            session.reset();
            String cancelReply = "Entendido, he reiniciado tu conversación. 😊 Si deseas consultar algún producto, ver el catálogo o hacer un pedido, escríbeme con confianza.";
            session.addTurn("user", rawText);
            session.addTurn("assistant", cancelReply);
            sessionRepo.save(session);
            return BotReply.text(cancelReply).build(CheckoutStep.IDLE);
        }

        // 3. Si estaba en modo HUMANO y el usuario escribe para retomar con el bot o hacer una consulta nueva, reactivar
        if (session.isHuman()) {
            session.setStep(CheckoutStep.IDLE);
            session.setFallbackCount(0);
        }

        // 4. Cargar reglas dinámicas, campañas activas y órdenes recientes del tenant
        List<RuleContext> activeRules = loadActiveRules(tenantId);
        List<CampaignContext> activeCampaigns = loadActiveCampaigns(tenantId);
        List<Order> recentOrders = loadRecentOrders(tenantId, session);

        // 5. Invocar al asistente comercial IA (gpt-4o-mini o fallback integrado)
        AssistantDecision decision = aiAssistant.generateReply(
                tenant,
                catalog,
                activeRules,
                activeCampaigns,
                recentOrders,
                session,
                msg
        );

        // 6. Sincronizar SKU seleccionado y categoría en la sesión
        Product selectedProduct = resolveProductBySku(decision.selectedSku(), catalog)
                .orElseGet(() -> resolveProductBySku(session.getSelectedSku(), catalog).orElse(null));

        if (selectedProduct != null) {
            session.setSelectedSku(selectedProduct.sku());
            session.addOfferedSku(selectedProduct.sku());
            if (selectedProduct.category() != null) {
                session.setActiveCategory(selectedProduct.category());
            }
        }

        // 7. Sincronizar estado de checkout y borrador (con precios validados estrictamente contra DB)
        CheckoutStep nextStep = decision.nextStep() != null ? decision.nextStep() : CheckoutStep.IDLE;
        if (decision.cancelCheckout()) {
            session.setCheckout(null);
            if (nextStep.isCheckout()) {
                nextStep = CheckoutStep.IDLE;
            }
        }

        if ( nextStep == CheckoutStep.HUMAN) {
            session.handoverToHuman();
        } else {
            session.setStep(nextStep);
        }

        if (!decision.cancelCheckout() && !decision.confirmOrderNow()) {
            applyDraftUpdates(session, decision.draftUpdate(), selectedProduct, catalog, tenant);
        }

        // Si el usuario proporcionó ubicación GPS y estamos en checkout sin dirección, autocompletar dirección
        if (msg.location() != null && session.getCheckout() != null
                && (session.getCheckout().address == null || session.getCheckout().address.isBlank())) {
            session.getCheckout().address = msg.location().resolvedAddress();
            session.getCheckout().location = msg.location();
        }

        String replyText = decision.replyText() != null ? decision.replyText() : "";

        // Blindaje estricto de inventario en tiempo real: validar que la cantidad no supere el stock disponible
        if (selectedProduct != null && session.inCheckout()) {
            int currentStock = selectedProduct.stock();
            CheckoutDraft draft = session.getCheckout();
            if (draft != null && draft.quantity > currentStock) {
                if (currentStock <= 0) {
                    replyText = "Fíjate que el modelo *" + selectedProduct.name()
                            + "* se encuentra temporalmente *agotado* 📦. ¿Te gustaría que te muestre otro modelo similar disponible?";
                    session.setStep(CheckoutStep.IDLE);
                    session.setCheckout(null);
                    nextStep = CheckoutStep.IDLE;
                } else {
                    replyText = "Fíjate que de momento solo nos quedan *" + currentStock
                            + (currentStock == 1 ? " unidad disponible*" : " unidades disponibles*")
                            + " de *" + selectedProduct.name() + "* 📦.\n\n¿Te apartamos las *" + currentStock
                            + "* disponibles o prefieres ver otro modelo?";
                    draft.quantity = currentStock;
                    draft.quantityLabel = currentStock + (currentStock == 1 ? " unidad" : " unidades");
                    draft.recalculate();
                    session.setStep(CheckoutStep.QUANTITY);
                    nextStep = CheckoutStep.QUANTITY;
                }
            }
        }

        // 8. Confirmación formal de pedido en Base de Datos con validación y descuento de inventario
        Order confirmedOrder = null;
        if (decision.confirmOrderNow()) {
            CheckoutDraft draft = ensureDraftForConfirmation(session, decision.draftUpdate(), selectedProduct, catalog, tenant);
            if (draft != null && draft.productSku != null) {
                Product currentProd = resolveProductBySku(draft.productSku, catalog).orElse(selectedProduct);
                if (currentProd != null && currentProd.stock() <= 0) {
                    replyText = "Lo sentimos mucho. El modelo *" + currentProd.name()
                            + "* se encuentra temporalmente agotado 📦. ¿Te gustaría ver otro modelo similar?";
                    session.setStep(CheckoutStep.IDLE);
                    session.setCheckout(null);
                    nextStep = CheckoutStep.IDLE;
                } else if (currentProd != null && draft.quantity > currentProd.stock()) {
                    replyText = "Fíjate que de momento solo nos quedan *" + currentProd.stock()
                            + (currentProd.stock() == 1 ? " unidad disponible*" : " unidades disponibles*")
                            + " de *" + currentProd.name() + "* 📦.\n\n¿Confirmamos tu orden por las *" + currentProd.stock()
                            + "* unidades disponibles?";
                    draft.quantity = currentProd.stock();
                    draft.quantityLabel = currentProd.stock() + (currentProd.stock() == 1 ? " unidad" : " unidades");
                    draft.recalculate();
                    session.setStep(CheckoutStep.CONFIRM);
                    nextStep = CheckoutStep.CONFIRM;
                } else {
                    if (draft.orderNumber == null || draft.orderNumber.isBlank() || orderRepo.existsByOrderNumber(draft.orderNumber)) {
                        draft.orderNumber = generateOrderNumber(tenant);
                    }
                    Order orderToSave = Order.fromDraft(tenantId, draft);
                    confirmedOrder = orderRepo.save(orderToSave);

                    // Descontar inventario en tiempo real en la Base de Datos
                    if (currentProd != null) {
                        int remainingStock = Math.max(0, currentProd.stock() - draft.quantity);
                        Product updatedProd = currentProd.withStock(remainingStock);
                        productRepo.save(updatedProd);
                    }

                    session.completeCheckout(confirmedOrder.orderNumber());
                    nextStep = CheckoutStep.IDLE;

                    if (!replyText.contains(confirmedOrder.orderNumber())) {
                        replyText = "¡Muchas gracias, *" + draft.effectiveRecipient() + "*! 🎉 Tu pedido *" + confirmedOrder.orderNumber()
                                + "* (" + draft.effectiveQuantityLabel() + " de *" + draft.productName + "* — Total: *"
                                + Money.lempiras(confirmedOrder.total()) + "*) ha quedado formalmente registrado en *" + tenant.name() + "*.\n\n"
                                + "🚚 *Próximos pasos:* Estamos preparando tu paquete para despacho vía *Cargo Expreso* (1 a 2 días hábiles, envío 100% GRATIS). El repartidor se contactará antes de llegar para coordinar la entrega en tu puerta. ¡Gracias por tu confianza!";
                    }
                }
            }
        }

        // 9. Registrar el turno actual en el historial conversacional (memoria de 16 turnos)
        String userTurnText = !rawText.isBlank()
                ? rawText
                : (msg.location() != null ? "[Ubicación GPS: " + msg.location().resolvedAddress() + "]" : "");
        session.addTurn("user", userTurnText);
        session.addTurn("assistant", replyText);
        sessionRepo.save(session);

        // 10. Construir respuesta final y selección de fotos
        // Si el cliente pide ver más fotos o la galería, enviar hasta 5 fotos.
        // Si es la presentación inicial, enviar SOLO 1 foto y ofrecer ver más fotos si existen.
        List<String> imagesToSend = Collections.emptyList();
        if (selectedProduct != null && selectedProduct.images() != null && !selectedProduct.images().isEmpty()) {
            boolean userAskedMorePhotos = isMorePhotosQuery(normText);
            if (decision.sendAllPhotos() || userAskedMorePhotos) {
                imagesToSend = selectedProduct.firstImages(5);
            } else if (decision.sendProductPhotos()) {
                imagesToSend = selectedProduct.firstImages(1);
                int totalImages = selectedProduct.images().size();
                if (totalImages > 1 && !replyText.toLowerCase().contains("más fotos") && !replyText.toLowerCase().contains("mas fotos")) {
                    int extra = totalImages - 1;
                    replyText += "\n\n📸 *(Tenemos " + extra + (extra == 1 ? " foto más" : " fotos más")
                            + " con más detalles de este modelo. Si deseas verlas, solo dime *más fotos*)*";
                }
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

    private void applyDraftUpdates(
            ChatSession session,
            DraftUpdate update,
            Product selectedProduct,
            List<Product> catalog,
            Tenant tenant
    ) {
        if (session.getStep() == CheckoutStep.IDLE && update == null) {
            session.setCheckout(null);
            return;
        }

        if (session.getStep() == CheckoutStep.IDLE && update != null
                && update.productSku() == null && update.customerName() == null && update.deliveryAddress() == null) {
            session.setCheckout(null);
            return;
        }

        Product targetProduct = selectedProduct;
        if (update != null && update.productSku() != null && !update.productSku().isBlank()) {
            targetProduct = resolveProductBySku(update.productSku(), catalog).orElse(selectedProduct);
        }

        CheckoutDraft draft = session.getCheckout();
        if (draft == null && targetProduct != null && session.getStep().isCheckout()) {
            int initialQty = (update != null && update.quantity() != null && update.quantity() > 0) ? update.quantity() : 1;
            draft = CheckoutDraft.start(targetProduct, initialQty, generateOrderNumber(tenant));
            session.setCheckout(draft);
        }

        if (draft == null) {
            return;
        }

        // Si el cliente cambió de producto durante el checkout, recalcular precio unitario real desde el catálogo en BD
        if (targetProduct != null && !targetProduct.sku().equalsIgnoreCase(draft.productSku)) {
            draft.applyProduct(targetProduct);
        }

        if (update != null) {
            if (update.customerName() != null && !update.customerName().isBlank()) {
                draft.name = update.customerName().trim();
                draft.recipientName = draft.name;
            }
            if (update.quantity() != null && update.quantity() > 0) {
                draft.quantity = update.quantity();
                draft.quantityLabel = update.quantity() + (update.quantity() == 1 ? " unidad" : " unidades");
                draft.recalculate();
            }
            if (update.deliveryAddress() != null && !update.deliveryAddress().isBlank()) {
                draft.address = update.deliveryAddress().trim();
            }
            if (update.agencyPickup() != null) {
                draft.agencyPickup = update.agencyPickup();
            }
            if (update.customerPhone() != null && !update.customerPhone().isBlank()) {
                draft.phone = update.customerPhone().trim();
            }
            if (update.requiresInvoice() != null) {
                draft.requiresInvoice = update.requiresInvoice();
                if (!Boolean.TRUE.equals(update.requiresInvoice()) && (draft.rtn == null || draft.rtn.isBlank())) {
                    draft.rtn = "Consumidor Final (Sin RTN)";
                }
            }
            if (update.rtn() != null && !update.rtn().isBlank()) {
                draft.rtn = update.rtn().trim();
            }
            if (update.businessName() != null && !update.businessName().isBlank()) {
                draft.businessName = update.businessName().trim();
            }
        }

        // Blindaje financiero: asegurar que unitPrice y total provengan siempre del producto en BD
        final CheckoutDraft finalDraft = draft;
        resolveProductBySku(finalDraft.productSku, catalog).ifPresent(dbProd -> {
            BigDecimal dbPrice = dbProd.salePrice();
            int qty = finalDraft.quantity > 0 ? finalDraft.quantity : 1;
            if (qty >= 3) {
                dbPrice = dbPrice.multiply(new BigDecimal("0.95")).setScale(0, java.math.RoundingMode.HALF_UP);
            }
            finalDraft.unitPrice = dbPrice;
            finalDraft.recalculate();
        });
    }

    private CheckoutDraft ensureDraftForConfirmation(
            ChatSession session,
            DraftUpdate update,
            Product selectedProduct,
            List<Product> catalog,
            Tenant tenant
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
            draft = CheckoutDraft.start(prod, qty, generateOrderNumber(tenant));
            session.setCheckout(draft);
        }
        if (update != null) {
            session.setStep(CheckoutStep.CONFIRM);
            applyDraftUpdates(session, update, selectedProduct, catalog, tenant);
        }
        return session.getCheckout();
    }

    private Optional<Product> resolveProductBySku(String sku, List<Product> catalog) {
        if (sku == null || sku.isBlank()) {
            return Optional.empty();
        }
        return catalog.stream()
                .filter(p -> p.sku().equalsIgnoreCase(sku.trim()))
                .findFirst();
    }

    private List<RuleContext> loadActiveRules(String tenantId) {
        List<RuleContext> result = new ArrayList<>();
        if (botRuleRepo != null) {
            try {
                botRuleRepo.findByTenantIdOrderByCreatedAtAsc(tenantId).stream()
                        .filter(r -> Boolean.TRUE.equals(r.getEnabled()))
                        .forEach(r -> {
                            String resp = r.getResponse();
                            if (resp == null || resp.isBlank()) {
                                resp = r.getResponseInStock();
                            }
                            if (resp != null && !resp.isBlank()) {
                                result.add(new RuleContext(r.getName(), r.getCategory(), resp));
                            }
                        });
            } catch (Exception e) {
                // ignore
            }
        }
        if (synonymRepo != null) {
            try {
                synonymRepo.findByTenantIdOrderByConceptAsc(tenantId).forEach(s -> {
                    if (s.getWords() != null && !s.getWords().isEmpty()) {
                        result.add(new RuleContext(
                                s.getConcept(),
                                "Sinónimos y Términos Equivalentes",
                                "Términos o sinónimos usados por clientes: " + String.join(", ", s.getWords())
                        ));
                    }
                });
            } catch (Exception e) {
                // ignore
            }
        }
        return result;
    }

    private List<CampaignContext> loadActiveCampaigns(String tenantId) {
        if (campaignRepo == null) {
            return Collections.emptyList();
        }
        try {
            return campaignRepo.findByTenantIdOrderByCreatedAtAsc(tenantId).stream()
                    .map(c -> new CampaignContext(c.getPlatform(), c.getUrl(), c.getHeadline(), c.getSku()))
                    .toList();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    private List<Order> loadRecentOrders(String tenantId, ChatSession session) {
        try {
            if (session.getLastOrderNumber() != null) {
                Optional<Order> last = orderRepo.findByNumberOrTracking(tenantId, session.getLastOrderNumber());
                if (last.isPresent()) {
                    return List.of(last.get());
                }
            }
            return orderRepo.findByTenant(tenantId).stream().limit(5).toList();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    private BotReply buildWelcomeReply(Tenant tenant, List<Product> catalog, boolean isReset) {
        List<Product> topProducts = catalog.stream().filter(Product::inStock).limit(4).toList();
        StringBuilder catalogSummary = new StringBuilder();
        for (Product p : topProducts) {
            catalogSummary.append("• *").append(p.name()).append("* — *")
                    .append(Money.lempiras(p.salePrice())).append("*\n");
        }

        String header = isReset
                ? "🔄 ¡Conversación reiniciada! 👋 Bienvenido nuevamente a *" + tenant.name() + "*. Con mucho gusto te atiendo.\n\n"
                : "¡Hola! 👋 Bienvenido a *" + tenant.name() + "*. Con mucho gusto te atiendo.\n\n";

        String text = header
                + "Te comparto los modelos que más nos piden:\n"
                + (catalogSummary.length() > 0 ? catalogSummary.toString() : "• Sillas ergonómicas, gamers y muebles para el hogar.\n")
                + "\n🚚 Todos con *envío 100% GRATIS* a todo el país vía Cargo Expreso y pago en *efectivo al recibir* en tu puerta.\n\n"
                + "¿Buscas algún modelo en especial o te gustaría ver fotos y detalles de alguno?";
        return BotReply.text(text).build(CheckoutStep.IDLE);
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

    private boolean isMorePhotosQuery(String norm) {
        if (norm == null || norm.isBlank()) return false;
        return norm.contains("mas foto") || norm.contains("más foto")
                || norm.contains("mas fotos") || norm.contains("más fotos")
                || norm.contains("otras fotos") || norm.contains("otra foto")
                || norm.contains("galeria") || norm.contains("galería")
                || norm.contains("ver foto") || norm.contains("ver fotos")
                || norm.contains("todas las fotos") || norm.contains("mas imagenes")
                || norm.contains("más imagenes") || norm.contains("mas imagenes");
    }

    private String normalizeCommand(String raw) {
        if (raw == null || raw.isBlank()) return "";
        String noAccents = Normalizer.normalize(raw.toLowerCase(Locale.ROOT), Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "");
        return noAccents.replaceAll("[^a-z0-9\\s]", " ").replaceAll("\\s+", " ").trim();
    }
}
