package com.smakbot.core.application.engine;

import com.smakbot.core.domain.model.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.smakbot.core.application.engine.Money.lempiras;
import static com.smakbot.core.application.engine.TextNormalizer.clean;

/**
 * Máquina de estados conversacional del checkout.
 * Port exacto del flujo de 7 pasos del Oráculo (bot-engine.js líneas 1134 a 1482 y 174 a 395).
 */
public class CheckoutStateMachine {

    private static final Pattern DIGITS_PHONE = Pattern.compile("\\d+");
    private static final Pattern RTN_PATTERN = Pattern.compile("\\b\\d{14}\\b|\\b\\d{8,14}\\b");
    private static final Pattern POSTAL_CODE = Pattern.compile("\\b\\d{5}\\b");

    private static final Map<String, Integer> NUM_WORDS = Map.of(
            "un", 1, "uno", 1, "una", 1, "dos", 2, "tres", 3,
            "cuatro", 4, "cinco", 5, "seis", 6, "diez", 10, "docena", 12
    );

    private static final List<String> HONDURAS_GEO_KEYWORDS = List.of(
            "col", "colonia", "barrio", "b°", "sector", "calle", "ave", "avenida", "casa", "bloque", "res", "residencial",
            "tegucigalpa", "san pedro", "sps", "ceiba", "choluteca", "comayagua", "frente", "cerca", "etapa", "aldea",
            "puerto cortes", "villanueva", "progreso", "la lima", "danli", "juticalpa", "siguatepeque", "santa rosa", "copan",
            "catacamas", "tocoa", "olanchito", "tela", "bulevar", "blvd", "plaza", "pulperia", "esquina", "circunvalacion",
            "toncontin", "pedregal", "kennedy", "hato", "miramontes", "palmira", "lomas", "prado", "san felipe"
    );

    private final HonduranCommercePolicy policy;
    private final CatalogAdvisor advisor;

    public CheckoutStateMachine(HonduranCommercePolicy policy, CatalogAdvisor advisor) {
        this.policy = policy;
        this.advisor = advisor;
    }

    public record StepResult(String text, CheckoutStep nextStep, GeoLocation location, boolean orderCompleted) {
        public static StepResult of(String text, CheckoutStep step) {
            return new StepResult(text, step, null, false);
        }

        public static StepResult withLoc(String text, CheckoutStep step, GeoLocation loc) {
            return new StepResult(text, step, loc, false);
        }

        public static StepResult completed(String text) {
            return new StepResult(text, CheckoutStep.IDLE, null, true);
        }
    }

    public StepResult handle(ChatSession session, MessageText m, GeoLocation incomingLoc, List<Product> catalog, Tenant tenant) {
        CheckoutDraft c = session.getCheckout();
        if (c == null) {
            return StepResult.of("No hay un proceso de compra activo.", CheckoutStep.IDLE);
        }

        CheckoutStep current = session.getStep();

        switch (current) {
            case NAME:
                return handleName(c, m, catalog);
            case QUANTITY:
                return handleQuantity(c, m, catalog);
            case ADDRESS:
                return handleAddress(c, m, incomingLoc, catalog);
            case PHONE:
                return handlePhone(c, m, catalog);
            case REQUIRES_INVOICE:
                return handleRequiresInvoice(c, m);
            case INVOICE_RTN:
                return handleInvoiceRtn(c, m);
            case INVOICE_BUSINESS_NAME:
                return handleInvoiceBusinessName(c, m);
            case CONFIRM:
                return handleConfirm(c, m, incomingLoc, catalog, tenant);
            default:
                return StepResult.of("Continúa con tu pedido...", current);
        }
    }

    private StepResult handleName(CheckoutDraft c, MessageText m, List<Product> catalog) {
        Optional<String> policyAns = policy.policyResponse(m, findProduct(c, catalog), catalog);
        if (policyAns.isPresent()) {
            return StepResult.of(policyAns.get() + "\n\nPara preparar tu orden, ¿a qué nombre registramos el pedido?", CheckoutStep.NAME);
        }
        if (m.hasAny("transferencia", "transfer", "como pago")) {
            return StepResult.of(policy.checkoutTransferText() + "\n\nPara preparar tu orden, ¿a qué nombre registramos el pedido?", CheckoutStep.NAME);
        }
        if (IntentDetector.isScheduleDelivery(m) || IntentDetector.isAgencyPickupQuery(m)) {
            return StepResult.of(policy.scheduleAndAgencyExplanation() + "\n\nPara preparar tu orden, ¿a qué nombre registramos el pedido?", CheckoutStep.NAME);
        }
        Product p = findProduct(c, catalog);
        if (p != null) {
            if (IntentDetector.isColor(m)) {
                return StepResult.of("🎨 **Colores de " + p.name() + " (" + p.sku() + "):** En catálogo oficial viene en acabado: **"
                        + p.colors() + "**.\n\nPara preparar tu orden, ¿a qué nombre registramos el pedido?", CheckoutStep.NAME);
            }
            if (IntentDetector.isPrice(m)) {
                return StepResult.of("🏷️ **Precio de " + p.name() + " (" + p.sku() + "):** **" + lempiras(p.salePrice())
                        + "** con envío gratuito.\n\nPara preparar tu orden, ¿a qué nombre registramos el pedido?", CheckoutStep.NAME);
            }
            if (IntentDetector.isMaterial(m)) {
                return StepResult.of("📦 **Materiales y Ensamble de " + p.name() + ":** 100% nuevo de fábrica en caja sellada con manual gráfico y herramientas de armado incluidas.\n\nPara preparar tu orden, ¿a qué nombre registramos el pedido?", CheckoutStep.NAME);
            }
            if (IntentDetector.isDimension(m)) {
                return StepResult.of("📏 **Medidas de " + p.name() + " (" + p.sku() + "):** **" + p.dimensions()
                        + "** (Soporte: " + p.weightLimit() + ").\n\nPara preparar tu orden, ¿a qué nombre registramos el pedido?", CheckoutStep.NAME);
            }
        }

        c.name = m.raw().trim();
        c.recipientName = c.name;
        return StepResult.of("Gracias, " + c.name + ". ¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):", CheckoutStep.QUANTITY);
    }

    private StepResult handleQuantity(CheckoutDraft c, MessageText m, List<Product> catalog) {
        Optional<String> policyAns = policy.policyResponse(m, findProduct(c, catalog), catalog);
        if (policyAns.isPresent()) {
            return StepResult.of(policyAns.get() + "\n\n¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):", CheckoutStep.QUANTITY);
        }
        if (IntentDetector.isScheduleDelivery(m) || IntentDetector.isAgencyPickupQuery(m)) {
            return StepResult.of(policy.scheduleAndAgencyExplanation() + "\n\n¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):", CheckoutStep.QUANTITY);
        }
        Product p = findProduct(c, catalog);
        if (p != null) {
            if (IntentDetector.isColor(m)) {
                return StepResult.of("🎨 **Colores de " + p.name() + " (" + p.sku() + "):** En catálogo oficial viene en acabado: **"
                        + p.colors() + "**.\n\n¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):", CheckoutStep.QUANTITY);
            }
            if (IntentDetector.isPrice(m)) {
                return StepResult.of("🏷️ **Precio de " + p.name() + " (" + p.sku() + "):** **" + lempiras(p.salePrice())
                        + "** con envío gratuito.\n\n¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):", CheckoutStep.QUANTITY);
            }
            if (IntentDetector.isMaterial(m)) {
                return StepResult.of("📦 **Materiales y Ensamble de " + p.name() + ":** 100% nuevo de fábrica en caja sellada con manual gráfico y herramientas de armado incluidas.\n\n¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):", CheckoutStep.QUANTITY);
            }
            if (IntentDetector.isDimension(m)) {
                return StepResult.of("📏 **Medidas de " + p.name() + " (" + p.sku() + "):** **" + p.dimensions()
                        + "** (Soporte: " + p.weightLimit() + ").\n\n¿Cuántas piezas o unidades deseas ordenar? (Ejemplo: *1 kit de sillas*, *2 regaderas*, *3 escritorios*... o solo el número):", CheckoutStep.QUANTITY);
            }
        }

        int q = 1;
        Matcher match = DIGITS_PHONE.matcher(m.raw());
        if (match.find()) {
            q = Math.max(1, Integer.parseInt(match.group()));
        } else {
            for (Map.Entry<String, Integer> e : NUM_WORDS.entrySet()) {
                if (m.tokens().contains(e.getKey())) {
                    q = e.getValue();
                    break;
                }
            }
        }

        c.quantity = q;
        c.quantityLabel = m.raw().trim().isEmpty() ? q + (q == 1 ? " unidad" : " unidades") : m.raw().trim();
        c.recalculate();

        String prompt = "Anotado: **" + c.quantityLabel + "** (Total: " + lempiras(c.total) + ").\n\n"
                + "🚚 Para coordinar la entrega con **Cargo Expreso**, por favor compártenos tus datos de entrega:\n\n"
                + "• **Entrega a domicilio:** Destinatario, Calle y número de casa / referencia, Colonia o barrio, Ciudad y Código postal (o presiona el botón 📍 abajo para enviar tu ubicación GPS de WhatsApp).\n"
                + "• **¿Prefieres retirar en agencia?** Puedes indicarnos la **oficina o agencia de Cargo Expreso** de tu ciudad donde prefieres retirar (teniendo en cuenta que los sábados trabajan medio día).\n\n"
                + "💡 *Ejemplo domicilio:* " + c.name + ", Calle Principal #15 frente a pulpería, Col. Palmira, Tegucigalpa, CP 11101\n"
                + "💡 *Ejemplo agencia:* Agencia Cargo Expreso San Pedro Sula Centro";

        return StepResult.of(prompt, CheckoutStep.ADDRESS);
    }

    private StepResult handleAddress(CheckoutDraft c, MessageText m, GeoLocation incomingLoc, List<Product> catalog) {
        // 1. Ubicación GPS enviada (objeto de ubicación nativo o mapa)
        if (incomingLoc != null && incomingLoc.lat() != null && incomingLoc.lng() != null) {
            String locName = incomingLoc.resolvedAddress();
            c.address = locName;
            c.recipientName = c.effectiveRecipient();
            c.location = incomingLoc;
            String txt = "¡Ubicación GPS registrada con éxito! 📍\n\n"
                    + "📌 **Dirección de entrega:** " + locName + "\n"
                    + "🗺️ [Ver en Google Maps](" + incomingLoc.resolvedMapUrl() + ")\n"
                    + "👤 **Destinatario:** " + c.recipientName + "\n\n"
                    + "📞 ¿A qué **número telefónico que reciba llamadas** te contactamos para coordinar la entrega?\n\n"
                    + "⚠️ **Importante:** Cargo Expreso coordina la entrega **únicamente vía llamada telefónica** antes de llegar a tu domicilio (asegúrate de que la línea pueda recibir llamadas directas).";
            return StepResult.withLoc(txt, CheckoutStep.PHONE, incomingLoc);
        }

        // 2. Retiro en agencia u oficina Cargo Expreso (Ocurre)
        if (IntentDetector.isAgencyAddress(m.raw())) {
            c.agencyPickup = true;
            c.address = m.raw().trim();
            c.recipientName = c.effectiveRecipient();
            String txt = "¡Excelente elección! 🏢 Registrado para **retiro en agencia de Cargo Expreso**:\n\n"
                    + "📌 **Agencia de retiro:** " + c.address + "\n"
                    + "👤 **Destinatario para reclamar en ventanilla:** " + c.recipientName + "\n\n"
                    + "⚠️ **Horarios de agencia:** Atienden de Lunes a Viernes (8:00 AM - 5:00 PM) y los **Sábados únicamente medio día** (hasta las 12:00 PM).\n\n"
                    + "📞 ¿A qué **número telefónico que reciba llamadas** te contactamos para coordinar la entrega y notificarte la guía de rastreo?\n\n"
                    + "⚠️ **Importante:** Cargo Expreso coordina y avisa la llegada del paquete **únicamente vía llamada telefónica** (asegúrate de que la línea pueda recibir llamadas directas).";
            return StepResult.of(txt, CheckoutStep.PHONE);
        }

        // 3. Dirección textual con palabras clave de geografía hondureña
        String cleaned = m.clean();
        String[] words = m.raw().trim().split("\\s+");
        boolean hasGeoKey = HONDURAS_GEO_KEYWORDS.stream().anyMatch(cleaned::contains);

        if (hasGeoKey && words.length >= 3) {
            c.address = m.raw().trim();
            Matcher cp = POSTAL_CODE.matcher(m.raw());
            if (cp.find()) c.postalCode = cp.group();
            c.recipientName = c.effectiveRecipient();
            String txt = "¡Dirección registrada con éxito! 📦\n\n"
                    + "📌 **Dirección de entrega:** " + c.address + "\n"
                    + "👤 **Destinatario:** " + c.recipientName + "\n\n"
                    + "📞 ¿A qué **número telefónico que reciba llamadas** te contactamos para coordinar la entrega?\n\n"
                    + "⚠️ **Importante:** Cargo Expreso coordina la entrega **únicamente vía llamada telefónica** antes de llegar a tu domicilio (asegúrate de que la línea pueda recibir llamadas directas).";
            return StepResult.of(txt, CheckoutStep.PHONE);
        }

        // 4. Dudas / políticas en este paso
        Optional<String> policyAns = policy.policyResponse(m, findProduct(c, catalog), catalog);
        if (policyAns.isPresent()) {
            return StepResult.of(policyAns.get() + "\n\nContinuemos con la entrega: compártenos tu dirección completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP) o envía tu ubicación GPS 📍:", CheckoutStep.ADDRESS);
        }
        if (m.hasAny("transferencia", "transfer")) {
            return StepResult.of(policy.shortTransferText() + "\n\nContinuemos con la entrega: compártenos tu dirección completa (Destinatario, Calle/Casa, Colonia, Ciudad y CP) o envía tu ubicación GPS 📍:", CheckoutStep.ADDRESS);
        }
        if (IntentDetector.isScheduleDelivery(m) || IntentDetector.isAgencyPickupQuery(m)) {
            return StepResult.of(policy.scheduleAndAgencyExplanation() + "\n\n📍 Para continuar con tu orden, indícanos si prefieres que lo enviemos a tu **dirección de domicilio** (con destinatario, colonia y ciudad) o la **oficina/agencia de Cargo Expreso** donde pasarás a retirar:", CheckoutStep.ADDRESS);
        }

        // 5. Demasiado corta
        if (m.raw().trim().length() < 12 || words.length < 3) {
            String guide = "Para que **Cargo Expreso** pueda entregar tu paquete sin retrasos, por favor indícanos una dirección más detallada (o presiona el botón 📍 abajo para enviar tu ubicación GPS):\n\n"
                    + "• **A domicilio:** Nombre del destinatario, Calle y casa / referencia, Colonia o barrio, y Ciudad / Municipio.\n"
                    + "• **En agencia:** Oficina o sucursal de Cargo Expreso de tu ciudad donde prefieres retirar en ventanilla.\n\n"
                    + "💡 *Ejemplo domicilio:* " + c.name + ", Calle Principal, Casa #15 frente a pulpería, Col. Miramontes, Tegucigalpa.\n"
                    + "💡 *Ejemplo agencia:* Agencia Cargo Expreso San Pedro Sula Centro.";
            return StepResult.of(guide, CheckoutStep.ADDRESS);
        }

        c.address = m.raw().trim();
        Matcher cp = POSTAL_CODE.matcher(m.raw());
        if (cp.find()) c.postalCode = cp.group();
        c.recipientName = c.effectiveRecipient();
        String txt = "¡Dirección registrada con éxito! 📦\n\n"
                + "📌 **Dirección de entrega:** " + c.address + "\n"
                + "👤 **Destinatario:** " + c.recipientName + "\n\n"
                + "📞 ¿A qué **número telefónico que reciba llamadas** te contactamos para coordinar la entrega?\n\n"
                + "⚠️ **Importante:** Cargo Expreso coordina la entrega **únicamente vía llamada telefónica** antes de llegar a tu domicilio (asegúrate de que la línea pueda recibir llamadas directas).";
        return StepResult.of(txt, CheckoutStep.PHONE);
    }

    private StepResult handlePhone(CheckoutDraft c, MessageText m, List<Product> catalog) {
        Optional<String> policyAns = policy.policyResponse(m, findProduct(c, catalog), catalog);
        if (policyAns.isPresent()) {
            return StepResult.of(policyAns.get() + "\n\nPara continuar, compártenos tu **número telefónico que reciba llamadas** para que Cargo Expreso coordine la entrega de tu paquete 📞:", CheckoutStep.PHONE);
        }
        if (m.hasAny("transferencia", "transfer")) {
            return StepResult.of(policy.shortTransferText() + "\n\nPara continuar, compártenos tu **número telefónico que reciba llamadas** para que Cargo Expreso coordine la entrega de tu paquete 📞:", CheckoutStep.PHONE);
        }
        if (IntentDetector.isScheduleDelivery(m) || IntentDetector.isAgencyPickupQuery(m)) {
            return StepResult.of(policy.scheduleAndAgencyExplanation() + "\n\nPara continuar con tu pedido, compártenos tu **número telefónico que reciba llamadas** para coordinar la entrega con Cargo Expreso 📞:", CheckoutStep.PHONE);
        }

        String phoneDigits = m.raw().replaceAll("\\D", "");
        if (phoneDigits.length() < 8) {
            return StepResult.of("Por favor compártenos un número telefónico válido de al menos 8 dígitos (ejemplo: **9800-8559** o **+504 9876-5432**).\n\n⚠️ **Recordatorio importante:** Cargo Expreso **solo coordina las entregas mediante llamada telefónica** directa al destinatario. Es indispensable contar con un número activo para llamadas para recibir el paquete.", CheckoutStep.PHONE);
        }

        c.phone = m.raw().trim();
        return StepResult.of("Teléfono registrado para llamadas: **" + c.phone + "** 📞\n\n¿Requieres factura con RTN para tu pedido? (Responde *Sí* o *No*):", CheckoutStep.REQUIRES_INVOICE);
    }

    private StepResult handleRequiresInvoice(CheckoutDraft c, MessageText m) {
        String cleaned = m.clean();
        boolean explicitNo = cleaned.contains("no") || cleaned.contains("sin factura") || cleaned.contains("consumidor final") || cleaned.contains("particular");
        boolean wantsInvoice = !explicitNo && (cleaned.contains("si") || cleaned.contains("factura") || cleaned.contains("rtn") || cleaned.contains("requiero") || cleaned.contains("ocupo"));
        if (wantsInvoice) {
            return StepResult.of("Por favor compártenos tu número de **RTN** (14 dígitos):", CheckoutStep.INVOICE_RTN);
        } else {
            c.requiresInvoice = false;
            c.rtn = null;
            c.businessName = null;
            return StepResult.of(buildOrderConfirmationText(c), CheckoutStep.CONFIRM);
        }
    }

    private StepResult handleInvoiceRtn(CheckoutDraft c, MessageText m) {
        c.requiresInvoice = true;
        Matcher rtnMatch = RTN_PATTERN.matcher(m.raw());
        c.rtn = rtnMatch.find() ? rtnMatch.group() : m.raw().trim();
        return StepResult.of("RTN registrado: **" + c.rtn + "**.\n\n¿Cuál es el **Nombre o Razón Social** de la empresa para la factura?", CheckoutStep.INVOICE_BUSINESS_NAME);
    }

    private StepResult handleInvoiceBusinessName(CheckoutDraft c, MessageText m) {
        c.businessName = m.raw().trim().isEmpty() ? c.name : m.raw().trim();
        return StepResult.of(buildOrderConfirmationText(c), CheckoutStep.CONFIRM);
    }

    private StepResult handleConfirm(CheckoutDraft c, MessageText m, GeoLocation incomingLoc, List<Product> catalog, Tenant tenant) {
        // 1. Modificaciones de datos sobre la marcha
        ModificationResult mod = handleModifications(c, m, incomingLoc, catalog);
        if (mod.redirect()) {
            return StepResult.of(mod.prompt(), mod.targetStep());
        }
        if (mod.modified()) {
            return StepResult.of(mod.ack() + "\n\n" + buildOrderConfirmationText(c), CheckoutStep.CONFIRM);
        }

        // 2. Confirmación formal
        if (IntentDetector.isConfirm(m)) {
            String name = c.effectiveRecipient();
            String orderNum = c.orderNumber;
            String qty = c.effectiveQuantityLabel();
            String txt = "¡Muchas gracias, " + name + "! 🎉 Tu pedido **" + orderNum + "** (" + qty + ") ha quedado formalmente registrado en nuestro sistema backend. En breve te notificaremos cuando la guía de rastreo sea asignada.";
            return StepResult.completed(txt);
        }

        // 3. Responder dudas conservando el resumen
        Optional<String> policyAns = policy.policyResponse(m, findProduct(c, catalog), catalog);
        String answerText = policyAns.orElseGet(() -> "Con gusto resolvemos cualquier duda adicional.");
        String replyText = answerText + "\n\n👇 **Tu pedido (" + c.orderNumber + ") sigue listo para confirmar:**\n\n" + buildOrderConfirmationText(c);
        return StepResult.of(replyText, CheckoutStep.CONFIRM);
    }

    public String buildOrderConfirmationText(CheckoutDraft c) {
        String invoiceTxt = c.requiresInvoice
                ? "Sí (RTN: " + c.rtn + " · " + c.businessName + ")"
                : "No (Consumidor Final)";
        String deliverySummary = c.agencyPickup
                ? "🏢 Retiro en Agencia Cargo Expreso (" + c.address + ")"
                : c.address + (c.location != null ? "\n• 📍 Mapa GPS: [Ver en Google Maps](" + c.location.resolvedMapUrl() + ")" : "");

        return "📋 **Resumen de tu pedido (" + c.orderNumber + ")**:\n"
                + "• Producto: **" + c.productName + "** (SKU: " + c.productSku + ")\n"
                + "• Cantidad / Piezas: **" + c.effectiveQuantityLabel() + "**\n"
                + "• Total a pagar: **" + lempiras(c.total) + "**\n"
                + "• Destinatario: " + c.effectiveRecipient() + "\n"
                + "• Entrega: " + deliverySummary + "\n"
                + "• Contacto (Llamadas Cargo Expreso): " + c.phone + "\n"
                + "• Facturación: **" + invoiceTxt + "**\n\n"
                + "Escribe *Confirmar* (o *Sí*) para confirmar tu compra con pago contra entrega.";
    }

    private record ModificationResult(boolean modified, boolean redirect, String ack, String prompt, CheckoutStep targetStep) {
        public static ModificationResult none() { return new ModificationResult(false, false, null, null, null); }
        public static ModificationResult redirect(String prompt, CheckoutStep target) { return new ModificationResult(false, true, null, prompt, target); }
        public static ModificationResult mod(String ack) { return new ModificationResult(true, false, ack, null, null); }
    }

    private ModificationResult handleModifications(CheckoutDraft c, MessageText m, GeoLocation incomingLoc, List<Product> catalog) {
        // Ubicación GPS
        if (incomingLoc != null && incomingLoc.lat() != null && incomingLoc.lng() != null) {
            String locName = incomingLoc.resolvedAddress();
            c.address = locName;
            c.location = incomingLoc;
            return ModificationResult.mod("✏️ ¡Listo! Hemos actualizado tu ubicación GPS de entrega a: **" + locName + "** 📍");
        }

        // Modificación de dirección
        if (m.clean().matches("^(?:cambiar|modificar|corregir)?\\s*(?:la\\s+)?(?:direccion|entrega|ubicacion)$")) {
            return ModificationResult.redirect("Por favor compártenos tu nueva dirección de entrega detallada (o presiona el botón 📍 abajo para enviar tu ubicación GPS):\n\n• **Nombre del destinatario**\n• **Calle y número de casa / referencia**\n• **Colonia, barrio o sector**\n• **Ciudad / Municipio**\n• **Código postal**", CheckoutStep.ADDRESS);
        }

        Matcher addrMatch = Pattern.compile("(?:entregar|mandar|llevar|enviar)\\b\\s*(?:en|a)\\s*[:\\-]?\\s*(.+)|(?:mi\\s+nueva\\s+direcci[oó]n\\s+es|mi\\s+direcci[oó]n\\s+es)\\s*[:\\-]?\\s*(.+)|(?:cambiar|modificar|corregir|actualizar)?\\s*(?:la\\s+)?(?:direcci[oó]n|entrega|ubicaci[oó]n)\\b\\s*(?:a|por|es|ser[ií]a)?\\s*[:\\-]?\\s*(.+)", Pattern.CASE_INSENSITIVE).matcher(m.raw());
        if (addrMatch.find()) {
            String newAddress = addrMatch.group(1) != null ? addrMatch.group(1) : (addrMatch.group(2) != null ? addrMatch.group(2) : addrMatch.group(3));
            if (newAddress != null && newAddress.trim().length() >= 6 && !newAddress.contains("?") && !newAddress.contains("¿")) {
                c.address = newAddress.trim();
                c.agencyPickup = IntentDetector.isAgencyAddress(newAddress);
                Matcher cp = POSTAL_CODE.matcher(newAddress);
                if (cp.find()) c.postalCode = cp.group();
                String ack = c.agencyPickup
                        ? "✏️ ¡Listo! Hemos actualizado tu entrega para **retiro en agencia de Cargo Expreso**: **" + c.address + "** (Recordando que los sábados atienden únicamente medio día)."
                        : "✏️ ¡Listo! Hemos actualizado tu dirección de entrega a: **" + c.address + "**.";
                return ModificationResult.mod(ack);
            }
        }

        // Modificación de teléfono
        if (m.clean().matches("^(?:cambiar|modificar|corregir)?\\s*(?:el\\s+)?(?:telefono|celular|cel|numero|num)$")) {
            return ModificationResult.redirect("Por favor compártenos tu nuevo **número telefónico que reciba llamadas** para que Cargo Expreso coordine la entrega de tu paquete 📞:", CheckoutStep.PHONE);
        }

        // Modificación de cantidad
        Matcher qtyRegex = Pattern.compile("(?:cambiar|modificar|actualizar)?\\s*(?:la\\s+)?(?:cantidad|piezas?|unidades?)\\b\\s*(?:a|por|es|ser[ií]a)?\\s*[:\\-]?\\s*(\\d+)", Pattern.CASE_INSENSITIVE).matcher(m.raw());
        if (qtyRegex.find()) {
            int q = Integer.parseInt(qtyRegex.group(1));
            if (q > 0) {
                c.quantity = q;
                c.quantityLabel = q + (q == 1 ? " unidad" : " unidades");
                c.recalculate();
                return ModificationResult.mod("✏️ ¡Listo! Hemos actualizado la cantidad a **" + c.quantityLabel + "** (Nuevo total: **" + lempiras(c.total) + "**).");
            }
        }

        // Modificación de producto
        if (m.hasAny("cambiar por", "cambiar a", "mejor el", "mejor la", "cambiar producto", "quiero el", "quiero la", "en vez de", "en lugar de")) {
            Optional<ProductMatcher.Match> hit = ProductMatcher.extract(m.raw(), catalog);
            if (hit.isPresent() && !hit.get().product().sku().equalsIgnoreCase(c.productSku)) {
                Product newP = hit.get().product();
                c.applyProduct(newP);
                return ModificationResult.mod("✏️ ¡Listo! Hemos cambiado el producto de tu pedido a **" + newP.name() + "** (Nuevo total: **" + lempiras(c.total) + "**).");
            }
        }

        return ModificationResult.none();
    }

    private Product findProduct(CheckoutDraft c, List<Product> catalog) {
        if (c.productSku == null) return null;
        return catalog.stream().filter(p -> c.productSku.equalsIgnoreCase(p.sku())).findFirst().orElse(null);
    }
}
