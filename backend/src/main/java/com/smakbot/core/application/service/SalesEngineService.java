package com.smakbot.core.application.service;

import com.smakbot.core.application.engine.*;
import com.smakbot.core.domain.exception.ResourceNotFoundException;
import com.smakbot.core.domain.model.*;
import com.smakbot.core.domain.ports.in.ProcessMessageUseCase;
import com.smakbot.core.domain.ports.out.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Orquestador comercial central del motor conversacional.
 * Integra detección de SKU, máquina de estados de checkout, políticas de Honduras, asesoría y persistencia.
 */
@Service
public class SalesEngineService implements ProcessMessageUseCase {

    private final TenantRepositoryPort tenantRepo;
    private final ProductRepositoryPort productRepo;
    private final OrderRepositoryPort orderRepo;
    private final ChatSessionRepositoryPort sessionRepo;

    private final CatalogAdvisor catalogAdvisor;
    private final HonduranCommercePolicy commercePolicy;
    private final CheckoutStateMachine checkoutStateMachine;

    public SalesEngineService(
            TenantRepositoryPort tenantRepo,
            ProductRepositoryPort productRepo,
            OrderRepositoryPort orderRepo,
            ChatSessionRepositoryPort sessionRepo
    ) {
        this.tenantRepo = tenantRepo;
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
        this.sessionRepo = sessionRepo;

        this.catalogAdvisor = new CatalogAdvisor();
        this.commercePolicy = new HonduranCommercePolicy(this.catalogAdvisor);
        this.checkoutStateMachine = new CheckoutStateMachine(this.commercePolicy, this.catalogAdvisor);
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

        MessageText m = MessageText.of(msg.text());

        // 1. Manejo de sesión transferida a humano (reactivación automática si el cliente consulta productos o saluda)
        if (session.isHuman()) {
            boolean userResumesBot = m.hasAny("bot", "asistente", "menu", "menú", "reiniciar", "inicio", "empezar", "volver", "cancelar")
                    || IntentDetector.isGreeting(m)
                    || IntentDetector.isCatalogQuery(m)
                    || IntentDetector.isPurchase(m)
                    || IntentDetector.isPrice(m)
                    || IntentDetector.isStockQuery(m)
                    || IntentDetector.isColor(m)
                    || IntentDetector.isDimension(m)
                    || IntentDetector.isWeight(m)
                    || IntentDetector.isMaterial(m)
                    || IntentDetector.isPhotoQuery(m)
                    || IntentDetector.isShippingQuery(m)
                    || ProductMatcher.extract(m.raw(), catalog).isPresent();

            if (userResumesBot) {
                session.reset();
                sessionRepo.save(session);
            } else {
                return BotReply.text("¡Hola! Ya te tengo en atención. Si deseas consultar algún modelo, medidas o hacer tu pedido directamente por aquí, dime con confianza y te ayudo de inmediato.")
                        .human(true)
                        .build(CheckoutStep.HUMAN);
            }
        }

        // 2. Flujo de checkout activo
        if (session.inCheckout()) {
            CheckoutStateMachine.StepResult res = checkoutStateMachine.handle(session, m, msg.location(), catalog, tenant);
            session.setStep(res.nextStep());

            if (res.orderCompleted()) {
                CheckoutDraft draft = session.getCheckout();
                if (draft.orderNumber == null || orderRepo.existsByOrderNumber(draft.orderNumber)) {
                    draft.orderNumber = generateOrderNumber(tenantId);
                }
                Order orderToSave = Order.fromDraft(tenantId, draft);
                Order saved = orderRepo.save(orderToSave);
                session.completeCheckout(saved.orderNumber());
                sessionRepo.save(session);

                String finalReplyText = "¡Muchas gracias, " + draft.effectiveRecipient() + "! 🎉 Tu pedido **" + saved.orderNumber()
                        + "** (" + draft.effectiveQuantityLabel() + ") ha quedado formalmente registrado en **" + tenant.name() + "**.\n\n"
                        + "🚚 **Próximos pasos:** Estamos preparando tu paquete para despacho vía **Cargo Expreso** (1 a 2 días hábiles, envío 100% GRATIS). El repartidor se contactará vía llamada telefónica o WhatsApp antes de llegar para coordinar la entrega en tu puerta. ¡Gracias por tu confianza!";

                return BotReply.text(finalReplyText)
                        .confirmedOrder(saved)
                        .build(CheckoutStep.IDLE);
            }

            sessionRepo.save(session);
            return BotReply.text(res.text())
                    .orderDraft(session.getCheckout())
                    .location(res.location())
                    .build(res.nextStep());
        }

        // 3. Consulta de rastreo post-venta
        if (IntentDetector.isTracking(m)) {
            Matcher matcher = IntentDetector.TRACKING_CODE.matcher(m.raw());
            String code = matcher.find() ? matcher.group() : session.getLastOrderNumber();

            Optional<Order> orderOpt = (code != null)
                    ? orderRepo.findByNumberOrTracking(tenantId, code)
                    : orderRepo.findByTenant(tenantId).stream().findFirst();

            if (orderOpt.isPresent()) {
                Order o = orderOpt.get();
                String statusText = o.status() != null ? o.status().label() : "🚚 En proceso de entrega";
                String trackingInfo = (o.trackingNumber() != null && !o.trackingNumber().isBlank())
                        ? "• Guía de rastreo: **" + o.trackingNumber() + "** (" + o.trackingCarrier() + ")\n• Transportadora: " + o.trackingCarrier() + " a domicilio"
                        : "• Guía de rastreo: *En preparación para despacho en el siguiente lote.*";

                String reply = "📦 **Información de tu Pedido (" + o.orderNumber() + ")**:\n\n"
                        + "• Estado: **" + statusText + "**\n"
                        + "• Cliente: " + o.customerName() + "\n"
                        + "• Detalle: " + o.quantity() + " unid. · " + o.productName() + "\n"
                        + "• Dirección: " + o.deliveryAddress() + "\n"
                        + "• Total contra entrega: **" + Money.lempiras(o.total()) + "**\n"
                        + trackingInfo + "\n\n"
                        + "Si requieres apoyo de un asesor, escribe *asesor* en cualquier momento.";

                return BotReply.text(reply).build(session.getStep());
            }
        }

        // 4. Ubicación enviada fuera de checkout
        if (msg.location() != null && msg.location().lat() != null && msg.location().lng() != null) {
            String locName = msg.location().resolvedAddress();
            String reply = "¡Ubicación detectada! 📍 Veo que te encuentras en **" + locName + "**.\n\n"
                    + "🚚 **Cobertura de Entrega:** ¡Sí, tenemos cobertura completa a domicilio en tu zona a través de Cargo Expreso!\n"
                    + "💵 **Pago Seguro:** Cancelas en efectivo contra entrega al recibir tu paquete.\n\n"
                    + "¿Te gustaría que te tome los datos para programar la entrega a tu dirección o qué mueble te gustaría cotizar?";
            return BotReply.text(reply).location(msg.location()).build(session.getStep());
        }

        // 5. Transferencia a asesor humano solicitada
        if (IntentDetector.isHumanRequest(m)) {
            session.handoverToHuman();
            sessionRepo.save(session);
            return BotReply.text(commercePolicy.humanHandoverText(tenant))
                    .human(true)
                    .build(CheckoutStep.HUMAN);
        }

        // 6. Consulta de transferencia bancaria fuera de checkout
        if (IntentDetector.isTransferQuery(m)) {
            Product activeProd = resolveActiveProduct(session, catalog);
            return BotReply.text(commercePolicy.fullTransferText(activeProd))
                    .product(activeProd)
                    .build(session.getStep());
        }

        // 7. Identificar producto en contexto del mensaje
        Optional<ProductMatcher.Match> matched = ProductMatcher.extract(m.raw(), catalog);
        if (matched.isPresent()) {
            Product p = matched.get().product();
            session.setSelectedSku(p.sku());
            session.addOfferedSku(p.sku());
            String cat = catalogAdvisor.detectCategoryKey(p);
            if (cat != null) {
                session.setActiveCategory(cat);
            }
            sessionRepo.save(session);
        }
        Product currentProduct = resolveActiveProduct(session, catalog);

        // 8. Políticas comerciales de Honduras (ciudades, envíos, garantía, ensamble, etc.)
        Optional<String> policyAns = commercePolicy.policyResponse(m, currentProduct, catalog);
        if (policyAns.isPresent()) {
            return BotReply.text(policyAns.get())
                    .product(currentProduct)
                    .build(session.getStep());
        }

        // 9. Asesoría por categoría / familia de productos ("¿Qué sillas tienen?", etc.)
        Optional<Answer> categoryAdvisory = catalogAdvisor.categoryAdvisory(m, catalog, tenant, session);
        if (categoryAdvisory.isPresent()) {
            sessionRepo.save(session);
            Answer ans = categoryAdvisory.get();
            return BotReply.text(ans.text())
                    .images(ans.images())
                    .build(session.getStep());
        }

        // 9b. Continuidad conversacional ("¿Tienes más?", "¿Otro modelo?", "¿Tienes otra opción?")
        if (IntentDetector.isMoreOptionsQuery(m)) {
            Answer ans = catalogAdvisor.moreOptions(session, currentProduct, catalog, tenant);
            sessionRepo.save(session);
            return BotReply.text(ans.text())
                    .product(ans.product())
                    .images(ans.images())
                    .build(session.getStep());
        }

        // 10. Cotización por volumen ("¿Si compro 3 sillas cuánto saldría?")
        Optional<Answer> volumeQuote = catalogAdvisor.volumeQuote(m, currentProduct, catalog);
        if (volumeQuote.isPresent()) {
            Answer ans = volumeQuote.get();
            session.setSelectedSku(ans.product().sku());
            sessionRepo.save(session);
            return BotReply.text(ans.text())
                    .product(ans.product())
                    .images(ans.images())
                    .build(session.getStep());
        }

        // 11. Intenciones específicas de producto
        if (IntentDetector.isColor(m)) {
            Answer ans = catalogAdvisor.colors(m, currentProduct, catalog, tenant);
            return BotReply.text(ans.text()).product(ans.product()).images(ans.images()).build(session.getStep());
        }
        if (IntentDetector.isPrice(m)) {
            Answer ans = catalogAdvisor.price(currentProduct, tenant, catalog);
            return BotReply.text(ans.text()).product(ans.product()).build(session.getStep());
        }
        if (IntentDetector.isDimension(m)) {
            Answer ans = catalogAdvisor.dimensions(currentProduct, catalog, tenant);
            return BotReply.text(ans.text()).product(ans.product()).images(ans.images()).build(session.getStep());
        }
        if (IntentDetector.isMaterial(m)) {
            Answer ans = catalogAdvisor.material(currentProduct);
            return BotReply.text(ans.text()).product(ans.product()).build(session.getStep());
        }
        if (IntentDetector.isWeight(m)) {
            Answer ans = catalogAdvisor.weight(currentProduct);
            return BotReply.text(ans.text()).product(ans.product()).build(session.getStep());
        }
        if (IntentDetector.isPhotoQuery(m) && currentProduct != null) {
            Answer ans = catalogAdvisor.photos(currentProduct);
            return BotReply.text(ans.text()).product(ans.product()).images(ans.images()).build(session.getStep());
        }
        if (IntentDetector.isScheduleDelivery(m) || IntentDetector.isAgencyPickupQuery(m)) {
            return BotReply.text(commercePolicy.scheduleAndAgencyExplanation())
                    .product(currentProduct)
                    .build(session.getStep());
        }
        if (IntentDetector.isShippingQuery(m) && currentProduct != null) {
            Answer ans = catalogAdvisor.shipping(currentProduct);
            return BotReply.text(ans.text()).product(ans.product()).images(ans.images()).build(session.getStep());
        }
        // 11b. Catálogo general (consultas sobre qué productos o modelos tienen)
        if (IntentDetector.isCatalogQuery(m)) {
            session.setFallbackCount(0);
            sessionRepo.save(session);
            Answer ans = catalogAdvisor.catalog(catalog, tenant);
            return BotReply.text(ans.text()).build(session.getStep());
        }

        // 11c. Inicio de compra / checkout
        if (IntentDetector.isPurchase(m)) {
            Product toBuy = matched.map(ProductMatcher.Match::product).orElse(currentProduct);
            if (toBuy == null) {
                return BotReply.text("¡Con mucho gusto te ayudo a tomar tu pedido! 😊 ¿Qué producto o modelo te gustaría ordenar?")
                        .build(session.getStep());
            }
            session.setSelectedSku(toBuy.sku());
            String orderNumber = generateOrderNumber(tenantId);
            int qty = extractPurchaseQuantity(m);
            CheckoutDraft draft = CheckoutDraft.start(toBuy, qty, orderNumber);
            if (qty > 1) {
                draft.quantity = qty;
                draft.quantityLabel = qty + " unidades";
                draft.recalculate();
            }
            session.startCheckout(draft);
            session.setFallbackCount(0);
            sessionRepo.save(session);

            String qtyText = qty > 1 ? qty + " unidades de " : "";
            String totalText = qty > 1
                    ? " (Total: **" + Money.lempiras(toBuy.salePrice().multiply(BigDecimal.valueOf(qty))) + "**)"
                    : " (" + Money.lempiras(toBuy.salePrice()) + ")";

            String text = "¡Excelente elección! Preparo tu orden (*N° " + orderNumber + "*) para **" + qtyText + toBuy.name()
                    + "**" + totalText + ". ¿A qué nombre registramos tu pedido?";
            return BotReply.text(text).orderDraft(draft).product(toBuy).build(CheckoutStep.NAME);
        }

        if (matched.isPresent() || (IntentDetector.isStockQuery(m) && currentProduct != null)) {
            session.setFallbackCount(0);
            sessionRepo.save(session);
            Product target = matched.map(ProductMatcher.Match::product).orElse(currentProduct);
            Answer ans = catalogAdvisor.stock(target);
            return BotReply.text(ans.text()).product(ans.product()).images(ans.images()).build(session.getStep());
        }

        // 14. Agradecimientos
        if (IntentDetector.isGratitude(m)) {
            session.setFallbackCount(0);
            sessionRepo.save(session);
            String hook = currentProduct != null
                    ? "¿Te gustaría que tomemos tus datos para apartar tu **" + currentProduct.name() + "** o a qué ciudad sería tu entrega?"
                    : "¿Te gustaría que tomemos tus datos para apartar tu pedido o a qué ciudad sería tu entrega?";
            return BotReply.text("¡Con muchísimo gusto! 😊 Estamos a tu entera disposición.\n\n"
                    + "🚚 ¡Aprovecha que hoy tenemos **envío 100% GRATIS** a todo el país y pagas al recibir en tu puerta!\n\n"
                    + hook)
                    .build(session.getStep());
        }

        // 15. Saludos y consulta abierta sin link de anuncio (Escenario 3D)
        if (IntentDetector.isGreeting(m)) {
            session.setFallbackCount(0);
            sessionRepo.save(session);
            List<Product> topProducts = catalog.stream().filter(Product::inStock).limit(4).toList();
            StringBuilder catalogSummary = new StringBuilder();
            for (Product p : topProducts) {
                catalogSummary.append("• **").append(p.name()).append("** — **")
                        .append(Money.lempiras(p.salePrice())).append("**\n");
            }

            String text = "¡Hola! 👋 Bienvenido a **" + tenant.name() + "**. Con mucho gusto te atiendo.\n\n"
                    + "Te comparto los modelos que más nos piden:\n"
                    + (catalogSummary.length() > 0 ? catalogSummary.toString() : "• Sillas ergonómicas, gamers y muebles para el hogar.\n")
                    + "\n🚚 Todos con **envío 100% GRATIS** a todo el país vía Cargo Expreso y pago en **efectivo al recibir** en tu puerta.\n\n"
                    + "¿Buscas algún mueble en especial o te gustaría ver fotos y detalles de alguno?";
            return BotReply.text(text).build(session.getStep());
        }

        // 16. Fallback no mapeado -> Sugerencias directas y amigables antes de transferir
        List<Product> candidates = ProductMatcher.findCandidates(m.raw(), catalog, 3);
        if (!candidates.isEmpty()) {
            session.setFallbackCount(0);
            StringBuilder sb = new StringBuilder();
            sb.append("¡Claro con gusto! Tengo estos modelos disponibles en tienda:\n\n");
            for (Product p : candidates) {
                sb.append("• **").append(p.name()).append("** — **").append(Money.lempiras(p.salePrice())).append("**\n");
                session.addOfferedSku(p.sku());
            }
            session.setSelectedSku(candidates.get(0).sku());
            String cat = catalogAdvisor.detectCategoryKey(candidates.get(0));
            if (cat != null) session.setActiveCategory(cat);
            sessionRepo.save(session);

            sb.append("\n🚚 ¡Todos con **envío gratis** y pagas al recibir en tu puerta!\n")
                    .append("¿Cuál de estos te llama más la atención o de cuál te gustaría conocer medidas y fotos reales?");
            return BotReply.text(sb.toString())
                    .images(candidates.stream().flatMap(p -> p.firstImages(1).stream()).toList())
                    .build(session.getStep());
        }

        // 17. Mensaje no entendido: Estrategia de 2do intento amable antes de transferir a humano
        if (session.getFallbackCount() == 0) {
            session.setFallbackCount(1);
            sessionRepo.save(session);

            String clarification;
            if (currentProduct != null) {
                clarification = "Disculpa, no logré entender bien tu mensajito. 😊 ¿Te gustaría que te tome los datos para apartar tu **"
                        + currentProduct.name() + "**, o prefieres consultar sus medidas, colores o ver fotos reales? Con gusto te ayudo.";
            } else {
                clarification = "Disculpa, no logré entender bien tu mensajito. 😊 ¿Podrías ser un poquito más claro o decirme qué mueble o producto estás buscando? Con gusto te ayudo a revisarlo.";
            }
            return BotReply.text(clarification).build(session.getStep());
        }

        // Segundo intento consecutivo fallido -> Transferencia directa a asesor humano (sin links externos)
        session.handoverToHuman();
        session.setFallbackCount(0);
        sessionRepo.save(session);

        String handoverText = "Para brindarte una mejor atención, voy a transferir tu consulta directamente con un ejecutivo comercial de nuestro equipo para que te asista de forma personalizada por este mismo chat. Un miembro del equipo te responderá en breve. ¡Muchas gracias por tu paciencia! 🙌";
        return BotReply.text(handoverText)
                .human(true)
                .build(CheckoutStep.HUMAN);
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

    private Product resolveActiveProduct(ChatSession session, List<Product> catalog) {
        if (session.getSelectedSku() != null) {
            Optional<Product> found = catalog.stream().filter(p -> session.getSelectedSku().equalsIgnoreCase(p.sku())).findFirst();
            if (found.isPresent()) return found.get();
        }
        return null;
    }

    private static final Pattern DIGITS_QTY = Pattern.compile("\\b(\\d+)\\b");
    private static final Map<String, Integer> WORD_QTY = Map.of(
            "un", 1, "uno", 1, "una", 1, "dos", 2, "tres", 3,
            "cuatro", 4, "cinco", 5, "seis", 6, "diez", 10, "docena", 12
    );

    private int extractPurchaseQuantity(MessageText m) {
        Matcher matcher = DIGITS_QTY.matcher(m.raw());
        if (matcher.find()) {
            try {
                int q = Integer.parseInt(matcher.group(1));
                if (q > 0 && q <= 100) return q;
            } catch (NumberFormatException ignored) {}
        }
        for (Map.Entry<String, Integer> e : WORD_QTY.entrySet()) {
            if (m.tokens().contains(e.getKey())) {
                return e.getValue();
            }
        }
        return 1;
    }

    private String generateOrderNumber(String tenantId) {
        String prefix = "calzado".equalsIgnoreCase(tenantId) ? "CALZ-ORD" : "SMAK-ORD";
        long nextNum = 1001 + orderRepo.countByTenant(tenantId);
        String candidate = String.format("%s-%04d", prefix, nextNum);
        while (orderRepo.existsByOrderNumber(candidate)) {
            nextNum++;
            candidate = String.format("%s-%04d", prefix, nextNum);
        }
        return candidate;
    }
}
