package com.smakbot.core.application.service;

import com.smakbot.core.application.engine.*;
import com.smakbot.core.domain.exception.ResourceNotFoundException;
import com.smakbot.core.domain.model.*;
import com.smakbot.core.domain.ports.in.ProcessMessageUseCase;
import com.smakbot.core.domain.ports.out.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;

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
                return BotReply.text("Tu conversación está asignada a un asesor comercial. Si deseas reactivar las consultas automáticas de catálogo o hacer tu pedido, escribe *menú* o *hola*.")
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
                    + "¿Te gustaría ver nuestro catálogo completo o hacer el pedido de algún producto?";
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
            session.setSelectedSku(matched.get().product().sku());
        }
        Product currentProduct = resolveActiveProduct(session, catalog);

        // 8. Políticas comerciales de Honduras (ciudades, envíos, garantía, ensamble, etc.)
        Optional<String> policyAns = commercePolicy.policyResponse(m, currentProduct, catalog);
        if (policyAns.isPresent()) {
            String suffix = currentProduct != null ? " para **" + currentProduct.name() + "**" : "";
            return BotReply.text(policyAns.get() + "\n\n¿Deseas que preparemos tu pedido" + suffix + "?")
                    .product(currentProduct)
                    .build(session.getStep());
        }

        // 9. Asesoría por categoría / familia de productos ("¿Qué sillas tienen?", etc.)
        Optional<Answer> categoryAdvisory = catalogAdvisor.categoryAdvisory(m, catalog, tenant);
        if (categoryAdvisory.isPresent()) {
            Answer ans = categoryAdvisory.get();
            return BotReply.text(ans.text())
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
            String suffix = currentProduct != null ? " para **" + currentProduct.name() + "**" : "";
            return BotReply.text(commercePolicy.scheduleAndAgencyExplanation() + "\n\n¿Deseas que preparemos tu pedido" + suffix + "?")
                    .product(currentProduct)
                    .build(session.getStep());
        }
        if (IntentDetector.isShippingQuery(m) && currentProduct != null) {
            Answer ans = catalogAdvisor.shipping(currentProduct);
            return BotReply.text(ans.text()).product(ans.product()).images(ans.images()).build(session.getStep());
        }
        // 11b. Inicio de compra / checkout
        if (IntentDetector.isPurchase(m)) {
            Product toBuy = matched.map(ProductMatcher.Match::product).orElse(currentProduct);
            if (toBuy == null) {
                toBuy = catalog.stream().findFirst().orElse(null);
            }
            if (toBuy != null) {
                session.setSelectedSku(toBuy.sku());
                String orderNumber = generateOrderNumber(tenantId);
                CheckoutDraft draft = CheckoutDraft.start(toBuy, 1, orderNumber);
                session.startCheckout(draft);
                sessionRepo.save(session);

                String text = "¡Excelente elección! Preparo tu orden (*N° " + orderNumber + "*) para **" + toBuy.name()
                        + "** (" + Money.lempiras(toBuy.salePrice()) + "). ¿A qué nombre registramos tu pedido?";
                return BotReply.text(text).orderDraft(draft).product(toBuy).build(CheckoutStep.NAME);
            }
        }

        if (matched.isPresent() || (IntentDetector.isStockQuery(m) && currentProduct != null)) {
            Product target = matched.map(ProductMatcher.Match::product).orElse(currentProduct);
            Answer ans = catalogAdvisor.stock(target);
            return BotReply.text(ans.text()).product(ans.product()).images(ans.images()).build(session.getStep());
        }

        // 12. Catálogo general
        if (IntentDetector.isCatalogQuery(m)) {
            Answer ans = catalogAdvisor.catalog(catalog, tenant);
            return BotReply.text(ans.text()).build(session.getStep());
        }

        // 14. Agradecimientos
        if (IntentDetector.isGratitude(m)) {
            return BotReply.text("¡Con muchísimo gusto! 😊 Estamos a tu entera disposición. Si deseas apartar algún producto, revisar colores, medidas o necesitas comunicarte con un asesor comercial, escríbenos en cualquier momento.")
                    .build(session.getStep());
        }

        // 15. Saludos y consulta abierta sin link de anuncio (Escenario 3D)
        if (IntentDetector.isGreeting(m)) {
            List<Product> topProducts = catalog.stream().filter(Product::inStock).limit(4).toList();
            StringBuilder catalogSummary = new StringBuilder();
            for (Product p : topProducts) {
                catalogSummary.append("• **").append(p.name()).append("** (SKU: ").append(p.sku())
                        .append(") — **").append(Money.lempiras(p.salePrice())).append("**\n");
            }

            String text = "¡Hola! 👋 Te damos la bienvenida a **" + tenant.name() + "** (Plaza Krisale, Puerto Cortés).\n\n"
                    + "✨ **Nuestros productos más solicitados:**\n"
                    + (catalogSummary.length() > 0 ? catalogSummary.toString() : "• Muebles ergonómicos, sillas de oficina y equipamiento para el hogar.\n")
                    + "\n🚚 **Beneficios de compra:**\n"
                    + "• Envíos **100% GRATIS** a nivel nacional a través de **Cargo Expreso** (1 a 2 días hábiles).\n"
                    + "• Pago en **efectivo contra entrega** al recibir el paquete en la puerta de tu casa o negocio (o transferencia bancaria).\n\n"
                    + "¿Deseas conocer medidas, colores o fotografías reales de alguno de ellos, o buscas algún mueble en específico?";
            return BotReply.text(text).build(session.getStep());
        }

        // 16. Fallback no mapeado -> Sugerencias guiadas o menú de autoservicio antes de transferir
        List<Product> candidates = ProductMatcher.findCandidates(m.raw(), catalog, 3);
        if (!candidates.isEmpty()) {
            StringBuilder sb = new StringBuilder();
            sb.append("🔎 ¿Te refieres a alguno de estos modelos de nuestro catálogo?\n\n");
            int idx = 1;
            for (Product p : candidates) {
                sb.append(idx).append("️⃣ **").append(p.name()).append("** (SKU: ").append(p.sku()).append(")\n")
                        .append("   • Precio de oferta: **").append(Money.lempiras(p.salePrice())).append("**\n\n");
                idx++;
            }
            sb.append("🚚 ¡Todos incluyen **envío 100% GRATIS** y pago contra entrega!\n")
                    .append("Escribe el nombre o número del producto para ver fotos y medidas, o escribe *catálogo* para ver todo.");
            return BotReply.text(sb.toString())
                    .images(candidates.stream().flatMap(p -> p.firstImages(1).stream()).toList())
                    .build(session.getStep());
        }

        return BotReply.text(commercePolicy.fallbackExecutiveText(tenant, m.raw()))
                .build(session.getStep());
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
