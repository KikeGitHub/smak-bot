package com.smakbot.core.infrastructure.adapter.out.openai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smakbot.core.application.engine.Money;
import com.smakbot.core.domain.model.ChatSession;
import com.smakbot.core.domain.model.CheckoutDraft;
import com.smakbot.core.domain.model.CheckoutStep;
import com.smakbot.core.domain.model.ConversationTurn;
import com.smakbot.core.domain.model.IncomingMessage;
import com.smakbot.core.domain.model.Order;
import com.smakbot.core.domain.model.Product;
import com.smakbot.core.domain.model.Tenant;
import com.smakbot.core.domain.ports.out.AiSalesAssistantPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Component
public class OpenAiSalesAssistantAdapter implements AiSalesAssistantPort {

    private static final Logger log = LoggerFactory.getLogger(OpenAiSalesAssistantAdapter.class);

    private final String openAiApiKey;
    private final String openAiModel;
    private final String openAiBaseUrl;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    public OpenAiSalesAssistantAdapter(
            @Value("${smakbot.openai.api-key:}") String openAiApiKey,
            @Value("${smakbot.openai.model:gpt-4o-mini}") String openAiModel,
            @Value("${smakbot.openai.base-url:https://api.openai.com/v1}") String openAiBaseUrl,
            ObjectMapper objectMapper) {
        this.openAiApiKey = openAiApiKey != null ? openAiApiKey.trim() : "";
        this.openAiModel = (openAiModel != null && !openAiModel.isBlank()) ? openAiModel.trim() : "gpt-4o-mini";
        this.openAiBaseUrl = (openAiBaseUrl != null && !openAiBaseUrl.isBlank()) ? openAiBaseUrl.trim()
                : "https://api.openai.com/v1";
        this.objectMapper = objectMapper;

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(6000);
        requestFactory.setReadTimeout(20000);
        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .build();
    }

    public boolean isConfigured() {
        return !openAiApiKey.isBlank() && !openAiApiKey.startsWith("CHANGE_ME");
    }

    @Override
    public AssistantDecision generateReply(
            Tenant tenant,
            List<Product> catalog,
            List<RuleContext> rules,
            List<CampaignContext> campaigns,
            List<Order> customerOrders,
            ChatSession session,
            IncomingMessage incomingMessage) {

        if (!isConfigured()) {
            log.debug("OPENAI_API_KEY no configurada; utilizando motor conversacional integrado de respaldo.");
            return fallbackDecision(tenant, catalog, rules, customerOrders, session, incomingMessage);
        }

        try {
            String systemPrompt = buildSystemPrompt(tenant, catalog, rules, campaigns, customerOrders, session,
                    incomingMessage);
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));

            if (session.getHistory() != null) {
                for (ConversationTurn turn : session.getHistory()) {
                    if (turn.role() != null && turn.content() != null && !turn.content().isBlank()) {
                        messages.add(Map.of("role", turn.role(), "content", turn.content()));
                    }
                }
            }

            String userContent = incomingMessage.text() != null ? incomingMessage.text() : "";
            if (incomingMessage.location() != null && incomingMessage.location().lat() != null) {
                userContent += "\n[UBICACIÓN GPS ADJUNTA POR EL CLIENTE: "
                        + incomingMessage.location().resolvedAddress()
                        + " | Mapa: " + incomingMessage.location().resolvedMapUrl() + "]";
            }
            messages.add(Map.of("role", "user", "content", userContent));

            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("model", openAiModel);
            requestBody.put("temperature", 0.25);
            requestBody.put("max_tokens", 750);
            requestBody.put("messages", messages);
            requestBody.put("response_format", buildStructuredJsonSchema());

            JsonNode responseNode = restClient.post()
                    .uri(openAiBaseUrl + "/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + openAiApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(JsonNode.class);

            if (responseNode != null && responseNode.has("choices") && !responseNode.get("choices").isEmpty()) {
                String contentJson = responseNode.get("choices").get(0).path("message").path("content").asText("");
                if (!contentJson.isBlank()) {
                    return parseDecisionJson(contentJson);
                }
            }
            log.warn("Respuesta vacía o inesperada de OpenAI: {}", responseNode);
        } catch (Exception ex) {
            log.error("Error al consultar OpenAI ({}): {}. Activando respaldo automático.", openAiModel,
                    ex.getMessage());
        }

        return fallbackDecision(tenant, catalog, rules, customerOrders, session, incomingMessage);
    }

    private String buildSystemPrompt(
            Tenant tenant,
            List<Product> catalog,
            List<RuleContext> rules,
            List<CampaignContext> campaigns,
            List<Order> customerOrders,
            ChatSession session,
            IncomingMessage incomingMessage) {

        StringBuilder sb = new StringBuilder();
        String businessType = (tenant.businessType() != null && !tenant.businessType().isBlank())
                ? tenant.businessType()
                : "Venta en línea de productos";
        String persona = (tenant.botPersona() != null && !tenant.botPersona().isBlank())
                ? tenant.botPersona()
                : "Eres el asesor comercial oficial de " + tenant.name()
                        + ". Trato cálido, claro, conciso y enfocado en ayudar al cliente.";
        String scopePolicy = (tenant.scopePolicy() != null && !tenant.scopePolicy().isBlank())
                ? tenant.scopePolicy()
                : "Solo atiendes consultas relacionadas con el catálogo y servicios de " + tenant.name() + ".";
        String currency = (tenant.currency() != null && !tenant.currency().isBlank()) ? tenant.currency() : "L.";

        sb.append("=== IDENTIDAD Y GIRO DEL NEGOCIO (TENANT: ").append(tenant.name()).append(") ===\n");
        sb.append("- Giro del negocio: ").append(businessType).append("\n");
        sb.append("- País: ").append(tenant.country() != null ? tenant.country() : "HN")
                .append(" | Moneda: ").append(currency).append("\n");
        sb.append("- Rol y Persona: ").append(persona).append("\n\n");

        sb.append("=== SCOPE Y POLÍTICAS OBLIGATORIAS DEL TENANT ===\n");
        sb.append(scopePolicy).append("\n\n");

        if (rules != null && !rules.isEmpty()) {
            sb.append("=== REGLAS Y PREGUNTAS FRECUENTES CONFIGURADAS EN EL ADMIN ===\n");
            for (RuleContext r : rules) {
                if (r.response() != null && !r.response().isBlank()) {
                    sb.append("• [").append(r.category()).append(" - ").append(r.name()).append("]: ")
                            .append(r.response().replace("\n", " ")).append("\n");
                }
            }
            sb.append("\n");
        }

        sb.append("=== CATÁLOGO OFICIAL EN TIEMPO REAL (ÚNICA FUENTE DE VERDAD) ===\n");
        sb.append("PROHIBIDO inventar productos, precios, colores, medidas o stock que no estén en esta lista:\n");
        for (Product p : catalog) {
            sb.append("- SKU: ").append(p.sku())
                    .append(" | Nombre: ").append(p.name())
                    .append(" | Precio Oferta: ").append(currency).append(p.salePrice())
                    .append(p.regularPrice() != null ? " (Antes: " + currency + p.regularPrice() + ")" : "")
                    .append(" | Stock: ").append(p.stock() > 0 ? p.stock() + " disponibles" : "AGOTADO (0 uds)")
                    .append(" | Colores: ").append(p.colors() != null ? p.colors() : "Único")
                    .append(" | Medidas: ").append(p.dimensions() != null ? p.dimensions() : "Estándar")
                    .append(" | Soporte/Peso: ").append(p.weightLimit() != null ? p.weightLimit() : "N/A")
                    .append(" | Categoría: ").append(p.category() != null ? p.category() : "General")
                    .append("\n");
        }
        sb.append("\n");

        if (campaigns != null && !campaigns.isEmpty()) {
            sb.append("=== CAMPAÑAS Y ANUNCIOS DE REDES SOCIALES ===\n");
            for (CampaignContext c : campaigns) {
                sb.append("- URL: ").append(c.url()).append(" -> SKU: ").append(c.sku())
                        .append(" (").append(c.headline()).append(")\n");
            }
            sb.append("\n");
        }

        if (customerOrders != null && !customerOrders.isEmpty()) {
            sb.append("=== PEDIDOS RECIENTES ENCONTRADOS PARA ESTE CLIENTE ===\n");
            for (Order o : customerOrders) {
                sb.append("- Orden: ").append(o.orderNumber())
                        .append(" | Estado: ").append(o.status() != null ? o.status().label() : "En proceso")
                        .append(" | Producto: ").append(o.quantity()).append("x ").append(o.productName())
                        .append(" | Total: ").append(Money.lempiras(o.total()))
                        .append(" | Cliente: ").append(o.customerName())
                        .append(" | Dirección: ").append(o.deliveryAddress())
                        .append(" | Guía: ")
                        .append(o.trackingNumber() != null ? o.trackingNumber() + " (" + o.trackingCarrier() + ")"
                                : "En preparación para despacho")
                        .append("\n");
            }
            sb.append("\n");
        }

        sb.append("=== ESTADO ACTUAL DE LA SESIÓN ===\n");
        sb.append("- Paso actual (step): ").append(session.getStep() != null ? session.getStep().name() : "IDLE")
                .append("\n");
        sb.append("- Último SKU en conversación (selectedSku): ")
                .append(session.getSelectedSku() != null ? session.getSelectedSku() : "Ninguno").append("\n");
        CheckoutDraft d = session.getCheckout();
        if (d != null) {
            sb.append("- Borrador de pedido activo:\n")
                    .append("  * SKU: ").append(d.productSku).append(" (").append(d.productName).append(")\n")
                    .append("  * Cantidad: ").append(d.quantity).append("\n")
                    .append("  * Nombre cliente: ").append(d.name != null && !d.name.isBlank() ? d.name : "PENDIENTE")
                    .append("\n")
                    .append("  * Dirección entrega: ")
                    .append(d.address != null && !d.address.isBlank() ? d.address : "PENDIENTE").append("\n")
                    .append("  * Teléfono para llamadas: ")
                    .append(d.phone != null && !d.phone.isBlank() ? d.phone : "PENDIENTE").append("\n")
                    .append("  * ¿Requiere factura RTN?: ")
                    .append(d.requiresInvoice ? "SÍ (RTN: " + d.rtn + ", Razón Social: " + d.businessName + ")"
                            : "No / Pendiente")
                    .append("\n");
        } else {
            sb.append("- Borrador de pedido activo: Ninguno\n");
        }
        sb.append("\n");

        sb.append(
                """
                        === REGLAS SUPREMAS DE CONVERSACIÓN, TONO Y VENTAS ===
                        1. TONO ULTRA DIRECTO, CONCISO Y HUMANO (ESTILO WHATSAPP):
                           - Mensajes breves de 2 a 3 líneas MÁXIMO. Directo al grano, sin rodeos, sin introducciones largas ni textos pesados.
                           - PROHIBIDO enviar listas numeradas de preguntas o formularios largos (ej. NUNCA pidas "1. Nombre, 2. Cantidad, 3. Dirección...").
                           - Si el cliente envía una imagen o dice "kiero esta", "quiero una", "precio", "tienen?":
                             Confirma disponibilidad de inmediato + Precio con envío gratis + 1 sola pregunta para iniciar el pedido.
                             Ejemplo: "¡Sí, la tenemos disponible! 🎉 Su precio de oferta es de L.995 con envío gratis y pagas al recibir. Para apartar la tuya, ¿cuál es tu nombre completo?"
                           - PROHIBIDO ofrecer otros productos o dar un menú largo si el cliente ya eligió uno. Céntrate 100% en cerrar la venta del producto que él quiere.
                           - PROHIBIDO sonar a bot ("Lamentablemente...", "Como modelo de lenguaje...", "En SMAK nos enfocamos...", "Disculpe las molestias...").

                        2. CATÁLOGO REAL ES TU VERDAD ABSOLUTA (REVISA ANTES DE RESPONDER):
                           - Todo producto que aparezca en la lista "CATÁLOGO OFICIAL EN TIEMPO REAL" de arriba es un producto activo que SÍ vendes y que tienes para entrega inmediata con envío gratis a toda Honduras.
                           - Si el cliente pregunta por "bicicleta", "bici", "silla", "ezry", "ezry123", "pileta", "lavabo", "estante", etc., revisa tu lista de catálogo: si ves un producto coincidente, respóndele DE INMEDIATO con entusiasmo que SÍ lo tienes, dale el precio de oferta y unidades disponibles.
                           - NUNCA digas que no vendes un producto si dicho producto o algo equivalente está en tu catálogo.
                           - Solo si tras revisar detalladamente todo tu catálogo confirmas que NO existe, responde con calidez humana en 2 líneas: "Fíjate que de momento no nos han entrado bicicletas para adulto, solo tenemos la Bicicleta Infantil Rosa Rin 14 😊 ¿Te gustaría ver esa o qué otro artículo buscas?".

                        3. FOTOS DEL PRODUCTO:
                           - Al presentar un producto o si el cliente pregunta por primera vez sobre él, pon `sendProductPhotos = true` y `sendAllPhotos = false` (el sistema enviará 1 foto principal).
                           - Si el cliente pide expresamente más fotos o la galería ("ver más fotos", "más fotos", "otras fotos", "mándame fotos", "galería"), pon `sendAllPhotos = true` y `sendProductPhotos = true`.
                           - Si solo estás tomando datos de envío o respondiendo una duda puntual (ej. medidas, peso), pon `sendProductPhotos = false` y `sendAllPhotos = false`.

                        4. COHERENCIA CON EL HISTORIAL:
                           - Lee con atención el historial. Si el cliente dice "ese", "el primero", "cuánto mide?" o "mejor no, quiero otro modelo", responde SIEMPRE sobre el producto exacto del que están hablando actualmente.
                           - Si el cliente dice "mejor no", "quiero ver otro modelo" o cambia de producto, marca `cancelCheckout = true` y JAMÁS le sigas pidiendo datos del producto que ya descartó.

                        5. FLUJO DE TOMA DE PEDIDO PASO A PASO (UNA SOLA PREGUNTA POR TURNO):
                           - PROHIBIDO pedir múltiples datos juntos. Pregunta ÚNICAMENTE el siguiente dato pendiente (1 pregunta a la vez):
                             * Si falta nombre (`customerName`) -> Pregunta SOLO el nombre completo (paso `NAME`).
                             * Si ya dio nombre y falta cantidad (`quantity`) -> Pregunta cuántas unidades desea ordenar (paso `QUANTITY`).
                             * Si ya dio nombre y cantidad, y falta dirección (`deliveryAddress`) -> Pregunta a qué ciudad y dirección o agencia Cargo Expreso se la envían (paso `ADDRESS`).
                             * Si falta teléfono (`customerPhone`) -> Pregunta un número de teléfono para que el repartidor llame al entregar (paso `PHONE`).
                             * Si falta factura (`requiresInvoice`) -> Pregunta si requiere factura con RTN o consumidor final (paso `REQUIRES_INVOICE`).
                           - Cuando tengas todos los datos, muestra un resumen ultra conciso (2-3 líneas):
                             "Listo [Nombre], te confirmo:
                             • [Cantidad]x [Producto] — [Total]
                             • Entrega: [Dirección] (Tel: [Teléfono])
                             ¿Confirmamos el pedido para mandártelo hoy?" (paso `CONFIRM`).
                           - Solo pon `confirmOrderNow = true` cuando el cliente confirme explícitamente ("Confirmar", "Sí", "Dale viaje", "Mándelo").
                           - Si pide humano/asesor, pon `nextStep = "HUMAN"`.
                        """);

        return sb.toString();
    }

    private Map<String, Object> buildStructuredJsonSchema() {
        Map<String, Object> draftProperties = new LinkedHashMap<>();
        draftProperties.put("productSku", nullableString());
        draftProperties.put("quantity", Map.of("type", List.of("integer", "null")));
        draftProperties.put("customerName", nullableString());
        draftProperties.put("deliveryAddress", nullableString());
        draftProperties.put("agencyPickup", Map.of("type", List.of("boolean", "null")));
        draftProperties.put("customerPhone", nullableString());
        draftProperties.put("requiresInvoice", Map.of("type", List.of("boolean", "null")));
        draftProperties.put("rtn", nullableString());
        draftProperties.put("businessName", nullableString());

        Map<String, Object> draftSchema = new LinkedHashMap<>();
        draftSchema.put("type", "object");
        draftSchema.put("properties", draftProperties);
        draftSchema.put("required", List.copyOf(draftProperties.keySet()));
        draftSchema.put("additionalProperties", false);

        Map<String, Object> rootProperties = new LinkedHashMap<>();
        rootProperties.put("replyText", Map.of("type", "string"));
        rootProperties.put("nextStep", Map.of(
                "type", "string",
                "enum", List.of("IDLE", "NAME", "QUANTITY", "ADDRESS", "PHONE", "REQUIRES_INVOICE", "INVOICE_RTN",
                        "INVOICE_BUSINESS_NAME", "CONFIRM", "HUMAN")));
        rootProperties.put("selectedSku", nullableString());
        rootProperties.put("sendProductPhotos", Map.of("type", "boolean"));
        rootProperties.put("sendAllPhotos", Map.of("type", "boolean"));
        rootProperties.put("cancelCheckout", Map.of("type", "boolean"));
        rootProperties.put("confirmOrderNow", Map.of("type", "boolean"));
        rootProperties.put("draft", draftSchema);

        Map<String, Object> schema = new LinkedHashMap<>();
        schema.put("type", "object");
        schema.put("properties", rootProperties);
        schema.put("required", List.copyOf(rootProperties.keySet()));
        schema.put("additionalProperties", false);

        return Map.of(
                "type", "json_schema",
                "json_schema", Map.of(
                        "name", "sales_assistant_decision",
                        "strict", true,
                        "schema", schema));
    }

    private Map<String, Object> nullableString() {
        return Map.of("type", List.of("string", "null"));
    }

    private AssistantDecision parseDecisionJson(String json) throws Exception {
        JsonNode root = objectMapper.readTree(json);
        String replyText = root.path("replyText").asText("");
        String stepStr = root.path("nextStep").asText("IDLE");
        CheckoutStep nextStep;
        try {
            nextStep = CheckoutStep.valueOf(stepStr);
        } catch (IllegalArgumentException e) {
            nextStep = CheckoutStep.IDLE;
        }

        String selectedSku = root.path("selectedSku").isNull() ? null : root.path("selectedSku").asText(null);
        boolean sendPhotos = root.path("sendProductPhotos").asBoolean(false);
        boolean sendAllPhotos = root.path("sendAllPhotos").asBoolean(false);
        boolean cancelCheckout = root.path("cancelCheckout").asBoolean(false);
        boolean confirmOrderNow = root.path("confirmOrderNow").asBoolean(false);

        JsonNode d = root.path("draft");
        DraftUpdate draftUpdate = new DraftUpdate(
                d.path("productSku").isNull() ? null : d.path("productSku").asText(null),
                d.path("quantity").isNull() ? null : d.path("quantity").asInt(),
                d.path("customerName").isNull() ? null : d.path("customerName").asText(null),
                d.path("deliveryAddress").isNull() ? null : d.path("deliveryAddress").asText(null),
                d.path("agencyPickup").isNull() ? null : d.path("agencyPickup").asBoolean(),
                d.path("customerPhone").isNull() ? null : d.path("customerPhone").asText(null),
                d.path("requiresInvoice").isNull() ? null : d.path("requiresInvoice").asBoolean(),
                d.path("rtn").isNull() ? null : d.path("rtn").asText(null),
                d.path("businessName").isNull() ? null : d.path("businessName").asText(null));

        return new AssistantDecision(replyText, nextStep, selectedSku, sendPhotos, sendAllPhotos, cancelCheckout,
                confirmOrderNow, draftUpdate);
    }

    // =========================================================================
    // MOTOR INTEGRADO DE RESPALDO (CUANDO NO HAY OPENAI_API_KEY O SIN RED)
    // =========================================================================
    private AssistantDecision fallbackDecision(
            Tenant tenant,
            List<Product> catalog,
            List<RuleContext> rules,
            List<Order> customerOrders,
            ChatSession session,
            IncomingMessage incomingMessage) {

        String raw = incomingMessage.text() != null ? incomingMessage.text().trim() : "";
        String norm = normalize(raw);

        // 1. Solicitud explícita de humano
        if (containsAny(norm, "asesor", "humano", "persona", "ejecutivo", "agente", "operador")) {
            String text = "Para brindarte una mejor atención, voy a transferir tu consulta directamente con un ejecutivo comercial de *"
                    + tenant.name()
                    + "* por este mismo chat. Un miembro del equipo te responderá en breve. ¡Gracias por tu paciencia! 🙌";
            return new AssistantDecision(text, CheckoutStep.HUMAN, session.getSelectedSku(), false, false, false, null);
        }

        // 2. Cancelación o cambio de opinión ("mejor no", "quiero otro modelo",
        // "cancelar")
        if (containsAny(norm, "mejor no", "cancelar", "cancela", "ya no quiero", "salir", "olvidalo")) {
            if (containsAny(norm, "otro modelo", "otra opcion", "otras opciones", "que mas tienen", "otros modelos")) {
                Product alt = findAlternativeProduct(session, catalog);
                if (alt != null) {
                    String txt = "¡Claro con gusto! He cancelado el pedido anterior para que revises con calma. También tenemos disponible:\n\n"
                            + "• *" + alt.name() + "* — *" + Money.lempiras(alt.salePrice()) + "*\n"
                            + (alt.weightLimit() != null ? "Soporte: " + alt.weightLimit() + "\n" : "")
                            + (alt.colors() != null ? "Colores: " + alt.colors() + "\n" : "")
                            + "\n🚚 ¡Con *envío gratis* a todo el país y pagas al recibir!\n¿Qué te parece este modelo?";
                    return new AssistantDecision(txt, CheckoutStep.IDLE, alt.sku(), true, true, false, null);
                }
            }
            return new AssistantDecision(
                    "Entendido, he cancelado la orden actual. 😊 Si deseas consultar cualquier otro modelo o ver nuestro catálogo, dime con confianza.",
                    CheckoutStep.IDLE, null, false, true, false, null);
        }

        // 3. Detectar producto mencionado en el mensaje o mantener el actual de la
        // sesión
        Product matchedProduct = matchProductFromCatalog(norm, catalog).orElse(null);
        Product activeProduct = matchedProduct != null ? matchedProduct
                : resolveBySku(session.getSelectedSku(), catalog);

        // 4. Si el cliente pide "otro modelo" / "tienes más opciones"
        if (containsAny(norm, "otro modelo", "otros modelos", "otra opcion", "otras opciones", "tienes mas",
                "tienen mas", "otras sillas")) {
            Product alt = findAlternativeProduct(session, catalog);
            if (alt != null) {
                String txt = "¡Claro con gusto! También tenemos este modelo disponible en tienda:\n\n"
                        + "• *" + alt.name() + "* — *" + Money.lempiras(alt.salePrice()) + "*\n"
                        + (alt.dimensions() != null ? "Medidas: " + alt.dimensions() + "\n" : "")
                        + (alt.colors() != null ? "Colores: " + alt.colors() + "\n" : "")
                        + "\n🚚 ¡Con *envío gratis* a todo el país y pago contra entrega!\n¿Te gustaría ver más detalles o prefieres este modelo?";
                return new AssistantDecision(txt, CheckoutStep.IDLE, alt.sku(), true, true, false, null);
            }
        }

        // 5. Si está en medio del checkout y no está haciendo una pregunta informativa
        if (session.inCheckout() && !isInformationalQuestion(norm)) {
            return handleFallbackCheckoutStep(session, raw, norm, incomingMessage, activeProduct);
        }

        // 6. Rastreo de pedido
        if (containsAny(norm, "rastrear", "rastreo", "mi pedido", "mi orden", "guia", "smak-ord", "caex")) {
            if (customerOrders != null && !customerOrders.isEmpty()) {
                Order o = customerOrders.get(0);
                String status = o.status() != null ? o.status().label() : "🚚 En proceso";
                String guia = (o.trackingNumber() != null && !o.trackingNumber().isBlank())
                        ? "• Guía Cargo Expreso: *" + o.trackingNumber() + "*"
                        : "• Guía: *En preparación para despacho*";
                String reply = "📦 *Información de tu Pedido (" + o.orderNumber() + ")*:\n\n"
                        + "• Estado: *" + status + "*\n"
                        + "• Cliente: " + o.customerName() + "\n"
                        + "• Producto: " + o.quantity() + "x " + o.productName() + "\n"
                        + "• Total contra entrega: *" + Money.lempiras(o.total()) + "*\n"
                        + guia;
                return new AssistantDecision(reply, CheckoutStep.IDLE, session.getSelectedSku(), false, false, false,
                        null);
            }
        }

        // 7. Ubicación GPS fuera de checkout
        if (incomingMessage.location() != null && incomingMessage.location().lat() != null) {
            String locName = incomingMessage.location().resolvedAddress();
            String reply = "¡Ubicación detectada! 📍 Veo que te encuentras en *" + locName + "*.\n\n"
                    + "🚚 *Cobertura de Entrega:* ¡Sí, tenemos cobertura completa a domicilio en tu zona vía Cargo Expreso con envío GRATIS y pago en efectivo al recibir!\n\n"
                    + "¿Qué mueble te gustaría ordenar para enviarlo a tu ubicación?";
            return new AssistantDecision(reply, session.getStep(), session.getSelectedSku(), false, false, false, null);
        }

        // 8. Intención de compra
        if (isPurchaseIntent(norm) && activeProduct != null) {
            if (!activeProduct.inStock()) {
                return new AssistantDecision(
                        "El modelo *" + activeProduct.name() + "* (SKU: " + activeProduct.sku()
                                + ") se encuentra temporalmente *agotado* 📦. ¿Te gustaría ver otro modelo similar disponible?",
                        CheckoutStep.IDLE, activeProduct.sku(), false, false, false, null);
            }
            int qty = extractQuantity(norm, 1);
            DraftUpdate du = new DraftUpdate(activeProduct.sku(), qty, null, null, null, null, null, null, null);
            String txt = "¡Sí, la tenemos disponible! 🎉 Su precio de oferta es de *"
                    + Money.lempiras(activeProduct.salePrice())
                    + "* con envío gratis y pagas al recibir.\n\nPara apartar la tuya, ¿a qué nombre te la anotamos?";
            return new AssistantDecision(txt, CheckoutStep.NAME, activeProduct.sku(), false, false, false, du);
        }

        // 9. Consultas sobre el producto activo (colores, medidas, peso, precio, fotos,
        // stock)
        if (activeProduct != null) {
            String resumeSuffix = session.inCheckout() ? "\n\n" + buildCheckoutResumePrompt(session) : "";
            CheckoutStep stepToKeep = session.inCheckout() ? session.getStep() : CheckoutStep.IDLE;

            if (containsAny(norm, "color", "colores", "tono", "verde", "azul", "rojo", "negro", "blanco", "cafe",
                    "marron", "gris", "rosa")) {
                String colors = activeProduct.colors() != null ? activeProduct.colors() : "su presentación estándar";
                String reply = "🎨 Para el modelo *" + activeProduct.name() + "*, lo tenemos disponible en color: *"
                        + colors + "*.\n\n"
                        + "🚚 ¡Incluye envío 100% gratis por Cargo Expreso y pagas al recibir!"
                        + (session.inCheckout() ? resumeSuffix : "\n¿Te gustaría ordenarlo?");
                return new AssistantDecision(reply, stepToKeep, activeProduct.sku(), false, false, false, null);
            }
            if (containsAny(norm, "medida", "medidas", "dimension", "dimensiones", "mide", "tamano", "alto", "ancho")) {
                String dims = activeProduct.dimensions() != null ? activeProduct.dimensions()
                        : "medidas estándar de fábrica";
                String reply = "📏 Las medidas exactas de *" + activeProduct.name() + "* son: *" + dims + "*."
                        + (activeProduct.weightLimit() != null
                                ? "\n• Capacidad de soporte: *" + activeProduct.weightLimit() + "*."
                                : "")
                        + (session.inCheckout() ? resumeSuffix
                                : "\n\n¿Deseas que tomemos tus datos para enviártelo con flete gratis?");
                return new AssistantDecision(reply, stepToKeep, activeProduct.sku(), false, false, false, null);
            }
            if (containsAny(norm, "peso", "soporta", "aguanta", "resistencia", "kilos", "libras")) {
                String weight = activeProduct.weightLimit() != null ? activeProduct.weightLimit()
                        : "alta resistencia estructural";
                String reply = "💪 El modelo *" + activeProduct.name() + "* soporta hasta *" + weight + "*."
                        + (session.inCheckout() ? resumeSuffix : "\n\n¿Te gustaría hacer tu pedido?");
                return new AssistantDecision(reply, stepToKeep, activeProduct.sku(), false, false, false, null);
            }
            if (containsAny(norm, "mas fotos", "más fotos", "todas las fotos", "galeria", "galería", "otras fotos")) {
                String reply = "📸 ¡Con mucho gusto! Aquí te comparto la galería completa con más ángulos y detalles de *"
                        + activeProduct.name() + "*."
                        + (session.inCheckout() ? resumeSuffix
                                : "\n\n¿A qué ciudad o dirección te gustaría que te lo enviemos?");
                return new AssistantDecision(reply, stepToKeep, activeProduct.sku(), true, true, false, false, null);
            }
            if (containsAny(norm, "foto", "fotos", "imagen", "imagenes")) {
                String reply = "📸 ¡Claro con gusto! Aquí tienes la foto de *" + activeProduct.name() + "* (*"
                        + Money.lempiras(activeProduct.salePrice()) + "* con envío gratis)."
                        + (session.inCheckout() ? resumeSuffix : "\n\n¿Te gustaría pedirlo para entrega a domicilio?");
                return new AssistantDecision(reply, stepToKeep, activeProduct.sku(), true, false, false, false, null);
            }
            if (matchedProduct != null
                    || containsAny(norm, "precio", "cuesta", "vale", "stock", "disponible", "tienen", "hay")) {
                if (!activeProduct.inStock()) {
                    String reply = "Por el momento el modelo *" + activeProduct.name() + "* (SKU: "
                            + activeProduct.sku() + ") se encuentra *agotado* 📦.";
                    return new AssistantDecision(reply, stepToKeep, activeProduct.sku(), false, false, false, null);
                }
                String reply = "¡Sí, tenemos disponible! 🎉\n\n"
                        + "• *" + activeProduct.name() + "* (SKU: " + activeProduct.sku() + ")\n"
                        + "• Precio de oferta: *" + Money.lempiras(activeProduct.salePrice()) + "*\n"
                        + "• Stock: *" + activeProduct.stock() + " unidades*\n"
                        + (activeProduct.dimensions() != null ? "• Medidas: " + activeProduct.dimensions() + "\n" : "")
                        + (activeProduct.colors() != null ? "• Colores: " + activeProduct.colors() + "\n" : "")
                        + "\n🚚 *Envío 100% GRATIS* a todo el país vía Cargo Expreso y pagas en efectivo al recibir."
                        + (session.inCheckout() ? resumeSuffix : "\n\n¿Deseas hacer tu pedido ahora?");
                return new AssistantDecision(reply, stepToKeep, activeProduct.sku(), matchedProduct != null, false,
                        false, null);
            }
        }

        // 10. Políticas comerciales comunes (islas, transferencia, tarjetas, envíos,
        // ubicación)
        if (containsAny(norm, "roatan", "utila", "guanaja", "isla", "ceiba", "ferry")) {
            String reply = "🏝️ *Entregas en Roatán, Útila e Islas de la Bahía:*\n"
                    + "Para islas realizamos el envío con *transferencia bancaria previa*. Una vez confirmado el comprobante, despachamos sin costo hasta el *muelle de cabotaje de La Ceiba* para embarcar en el ferry que nos indiques (Utila Dream o Galaxy Wave). El costo del ferry corre por cuenta del cliente.";
            return new AssistantDecision(reply, session.getStep(), session.getSelectedSku(), false, false, false, null);
        }
        if (containsAny(norm, "tarjeta", "credito", "debito", "pos", "link de pago")) {
            String reply = "💳 *Forma de Pago:* No aceptamos pagos con tarjeta. Manejamos *pago en efectivo contra entrega* (le pagas al motorista de Cargo Expreso al recibir en tu puerta) o *transferencia bancaria previa*.";
            return new AssistantDecision(reply, session.getStep(), session.getSelectedSku(), false, false, false, null);
        }
        if (containsAny(norm, "transferencia", "cuenta", "banco", "bac", "ficohsa", "atlantida", "banpais")) {
            String reply = "🏦 *Pago por Transferencia Bancaria:*\n"
                    + "Cuentas oficiales a nombre de *SMAK Honduras S. de R.L.* (RTN: 08011990123456):\n"
                    + "• BAC Credomatic (Cheques): 742-108-951\n"
                    + "• Banco Ficohsa (Cheques): 2000-098-432\n"
                    + "• Banco Atlántida (Ahorros): 110-045-892\n"
                    + "• Banpaís (Cheques): 01-501-002345";
            return new AssistantDecision(reply, session.getStep(), session.getSelectedSku(), false, false, false, null);
        }
        if (containsAny(norm, "envio", "flete", "entrega", "cargo expreso", "forza", "domicilio", "tardan", "horario",
                "agencia", "sabado")) {
            String reply = "🚚 *Envíos y Entregas:*\n"
                    + "Realizamos envíos *100% GRATIS* a todo el país exclusivamente a través de *Cargo Expreso* (entrega de 1 a 2 días hábiles, Lunes a Viernes 8am-5pm y Sábados hasta las 12pm, o retiro en agencia Cargo Expreso). Pagas en efectivo al recibir.";
            return new AssistantDecision(reply, session.getStep(), session.getSelectedSku(), false, false, false, null);
        }

        // 11. Catálogo general o saludo
        if (containsAny(norm, "hola", "buenas", "buenos dias", "buenas tardes", "buenas noches", "catalogo",
                "productos", "muebles", "sillas", "que tienen", "que venden")) {
            StringBuilder list = new StringBuilder();
            catalog.stream().filter(Product::inStock).limit(5).forEach(p -> list.append("• *").append(p.name())
                    .append("* — *").append(Money.lempiras(p.salePrice())).append("*\n"));
            String reply = "¡Hola! 👋 Bienvenido a *" + tenant.name()
                    + "*. Con gusto te comparto nuestros modelos disponibles:\n\n"
                    + list
                    + "\n🚚 Todos con *envío 100% GRATIS* por Cargo Expreso y pago en *efectivo contra entrega*.\n"
                    + "¿De cuál modelo te gustaría ver fotos, medidas o hacer tu pedido?";
            return new AssistantDecision(reply, CheckoutStep.IDLE, session.getSelectedSku(), false, false, false, null);
        }

        // 12. No entendido
        String fallback = "Disculpa, no logré entender bien tu mensajito. 😊 ¿Podrías indicarme qué mueble o modelo estás buscando? Con gusto te comparto fotos, medidas y precios.";
        return new AssistantDecision(fallback, session.getStep(), session.getSelectedSku(), false, false, false, null);
    }

    private AssistantDecision handleFallbackCheckoutStep(
            ChatSession session,
            String raw,
            String norm,
            IncomingMessage incomingMessage,
            Product activeProduct) {

        CheckoutDraft c = session.getCheckout();
        CheckoutStep step = session.getStep();

        switch (step) {
            case NAME -> {
                DraftUpdate du = new DraftUpdate(c.productSku, null, raw, null, null, null, null, null, null);
                if (c.quantity > 1) {
                    return new AssistantDecision(
                            "¡Gracias, *" + raw + "*! Anotamos *" + c.quantity
                                    + " unidades*.\n\n🚚 ¿A qué *dirección exacta* (ciudad, colonia y referencia, o agencia Cargo Expreso) te lo enviamos?",
                            CheckoutStep.ADDRESS, c.productSku, false, false, false, du);
                }
                return new AssistantDecision(
                        "Gracias, *" + raw + "*. ¿Cuántas unidades deseas ordenar? (Ejemplo: *1*, *2*):",
                        CheckoutStep.QUANTITY, c.productSku, false, false, false, du);
            }
            case QUANTITY -> {
                int q = extractQuantity(norm, 0);
                if (q <= 0) {
                    return new AssistantDecision(
                            "Por favor indícanos en número cuántas unidades de *" + c.productName
                                    + "* deseas ordenar (ejemplo: *1* o *2*):",
                            CheckoutStep.QUANTITY, c.productSku, false, false, false, null);
                }
                DraftUpdate du = new DraftUpdate(c.productSku, q, null, null, null, null, null, null, null);
                return new AssistantDecision(
                        "¡Anotado! *" + q + (q == 1 ? " unidad*" : " unidades*.")
                                + "\n\n🚚 ¿A qué *dirección completa* (ciudad, colonia y referencia de casa, o retiro en agencia de Cargo Expreso) te enviamos tu pedido?",
                        CheckoutStep.ADDRESS, c.productSku, false, false, false, du);
            }
            case ADDRESS -> {
                String addr = (incomingMessage.location() != null && incomingMessage.location().lat() != null)
                        ? incomingMessage.location().resolvedAddress()
                        : raw;
                if (addr.length() < 8 && incomingMessage.location() == null) {
                    return new AssistantDecision(
                            "Para que Cargo Expreso entregue sin contratiempos, por favor indícanos tu *Ciudad, Colonia y referencia de domicilio* (o la agencia de Cargo Expreso donde deseas retirar):",
                            CheckoutStep.ADDRESS, c.productSku, false, false, false, null);
                }
                boolean isAgency = containsAny(norm, "agencia", "oficina", "sucursal", "ocurre");
                DraftUpdate du = new DraftUpdate(c.productSku, null, null, addr, isAgency, null, null, null, null);
                return new AssistantDecision(
                        "¡Dirección registrada! 📦\n\n📞 ¿A qué *número de teléfono (que reciba llamadas directas)* te contactará el repartidor de Cargo Expreso?",
                        CheckoutStep.PHONE, c.productSku, false, false, false, du);
            }
            case PHONE -> {
                String digits = raw.replaceAll("\\D", "");
                if (digits.length() < 8) {
                    return new AssistantDecision(
                            "Por favor compártenos un número telefónico válido de al menos 8 dígitos (ejemplo: *9800-8559*) que reciba llamadas de Cargo Expreso:",
                            CheckoutStep.PHONE, c.productSku, false, false, false, null);
                }
                DraftUpdate du = new DraftUpdate(c.productSku, null, null, null, null, raw, null, null, null);
                return new AssistantDecision(
                        "Teléfono registrado: *" + raw
                                + "* 📞.\n\n¿Requieres factura con RTN para tu pedido? (Responde *Sí* o *No*):",
                        CheckoutStep.REQUIRES_INVOICE, c.productSku, false, false, false, du);
            }
            case REQUIRES_INVOICE -> {
                boolean wantsInvoice = containsAny(norm, "si", "factura", "rtn")
                        && !containsAny(norm, "no", "consumidor final");
                if (wantsInvoice) {
                    DraftUpdate du = new DraftUpdate(c.productSku, null, null, null, null, null, true, null, null);
                    return new AssistantDecision(
                            "Por favor indícanos tu número de *RTN* (14 dígitos):",
                            CheckoutStep.INVOICE_RTN, c.productSku, false, false, false, du);
                }
                DraftUpdate du = new DraftUpdate(c.productSku, null, null, null, null, null, false, null, null);
                return new AssistantDecision(
                        "📋 *Resumen de tu pedido listo para confirmar*:\n"
                                + "• Producto: *" + c.productName + "*\n"
                                + "• Cantidad: *" + c.quantity + " unid.*\n"
                                + "• Total: *" + Money.lempiras(c.total) + "* (Envío gratis)\n"
                                + "• Cliente: " + c.name + "\n"
                                + "• Entrega: " + c.address + "\n"
                                + "• Teléfono: " + c.phone + "\n"
                                + "• Factura: Consumidor Final\n\n"
                                + "Escribe *Confirmar* (o presiona el botón ✅) para registrar tu pedido.",
                        CheckoutStep.CONFIRM, c.productSku, false, false, false, du);
            }
            case INVOICE_RTN -> {
                DraftUpdate du = new DraftUpdate(c.productSku, null, null, null, null, null, true, raw, null);
                return new AssistantDecision(
                        "RTN registrado (*" + raw + "*). ¿Cuál es el *Nombre o Razón Social* de la empresa?",
                        CheckoutStep.INVOICE_BUSINESS_NAME, c.productSku, false, false, false, du);
            }
            case INVOICE_BUSINESS_NAME -> {
                DraftUpdate du = new DraftUpdate(c.productSku, null, null, null, null, null, true, c.rtn, raw);
                return new AssistantDecision(
                        "📋 *Resumen de tu pedido listo para confirmar*:\n"
                                + "• Producto: *" + c.productName + "*\n"
                                + "• Cantidad: *" + c.quantity + " unid.*\n"
                                + "• Total: *" + Money.lempiras(c.total) + "*\n"
                                + "• Cliente: " + c.name + "\n"
                                + "• Entrega: " + c.address + "\n"
                                + "• Teléfono: " + c.phone + "\n"
                                + "• Factura RTN: " + c.rtn + " (" + raw + ")\n\n"
                                + "Escribe *Confirmar* (o presiona el botón ✅) para registrar tu pedido.",
                        CheckoutStep.CONFIRM, c.productSku, false, false, false, du);
            }
            case CONFIRM -> {
                if (containsAny(norm, "confirmar", "confirmo", "si", "ok", "dale", "listo", "correcto", "mandelo")) {
                    return new AssistantDecision("¡Pedido confirmado!", CheckoutStep.IDLE, c.productSku, false, false,
                            true, null);
                }
                if (containsAny(norm, "modificar", "cambiar direccion", "direccion")) {
                    return new AssistantDecision("Por favor indícanos la nueva dirección completa de entrega:",
                            CheckoutStep.ADDRESS, c.productSku, false, false, false, null);
                }
                return new AssistantDecision(
                        "Tu pedido para *" + c.productName
                                + "* sigue listo. Escribe *Confirmar* para despacharlo o *Cancelar* si deseas anularlo.",
                        CheckoutStep.CONFIRM, c.productSku, false, false, false, null);
            }
            default -> {
                return new AssistantDecision("¿En qué te podemos colaborar hoy?", CheckoutStep.IDLE,
                        session.getSelectedSku(), false, false, false, null);
            }
        }
    }

    private String buildCheckoutResumePrompt(ChatSession session) {
        CheckoutDraft c = session.getCheckout();
        if (c == null)
            return "";
        return switch (session.getStep()) {
            case NAME -> "Para continuar con tu pedido de *" + c.productName + "*, ¿a qué nombre lo registramos?";
            case QUANTITY ->
                "Ya tenemos tu nombre (" + c.name + "). ¿Cuántas unidades de *" + c.productName + "* deseas ordenar?";
            case ADDRESS ->
                "Solo nos falta tu *dirección exacta* (Ciudad, Colonia y referencia) para programar tu envío gratis con Cargo Expreso:";
            case PHONE -> "Solo nos falta tu *número telefónico* de 8 dígitos para llamadas de Cargo Expreso:";
            case REQUIRES_INVOICE -> "¿Requieres factura con RTN para tu pedido? (Responde *Sí* o *No*):";
            case CONFIRM ->
                "Escribe *Confirmar* cuando estés listo para finalizar tu pedido de *" + c.productName + "*.";
            default -> "";
        };
    }

    private boolean isInformationalQuestion(String norm) {
        return containsAny(norm, "precio", "cuesta", "vale", "color", "colores", "verde", "azul", "rojo", "medida",
                "medidas",
                "mide", "dimension", "peso", "soporta", "aguanta", "foto", "fotos", "garantia", "tarjeta",
                "transferencia",
                "roatan", "utila", "isla", "forza");
    }

    private boolean isPurchaseIntent(String norm) {
        if (containsAny(norm, "quiero saber", "quiero ver", "que productos", "catalogo"))
            return false;
        return containsAny(norm, "comprar", "quiero pedir", "quiero ordenar", "hacer pedido", "lo quiero", "la quiero",
                "me lo llevo", "me la llevo", "apartar", "quiero 1", "quiero 2", "quiero 3", "dame 1", "dame 2",
                "quiero una", "quiero uno", "kiero una", "kiero uno", "quiero esta", "kiero esta", "quiero este", "kiero este",
                "me interesa", "ordenar", "pedir");
    }

    private Optional<Product> matchProductFromCatalog(String norm, List<Product> catalog) {
        if (norm.isBlank())
            return Optional.empty();
        Product best = null;
        int bestScore = 0;
        for (Product p : catalog) {
            int score = 0;
            String pSku = normalize(p.sku());
            String pName = normalize(p.name());
            if (!pSku.isBlank() && norm.contains(pSku))
                score += 100;
            for (String token : pName.split("\\s+")) {
                if (token.length() >= 4 && norm.contains(token))
                    score += 15;
            }
            if (p.keywords() != null) {
                for (String kw : p.keywords()) {
                    String nkw = normalize(kw);
                    if (!nkw.isBlank() && norm.contains(nkw))
                        score += 25;
                }
            }
            if (score > bestScore) {
                bestScore = score;
                best = p;
            }
        }
        return bestScore >= 15 ? Optional.of(best) : Optional.empty();
    }

    private Product findAlternativeProduct(ChatSession session, List<Product> catalog) {
        String currentSku = session.getSelectedSku();
        for (Product p : catalog) {
            if (p.inStock() && !p.sku().equalsIgnoreCase(currentSku) && !session.getOfferedSkus().contains(p.sku())) {
                return p;
            }
        }
        return catalog.stream().filter(p -> p.inStock() && !p.sku().equalsIgnoreCase(currentSku)).findFirst()
                .orElse(null);
    }

    private Product resolveBySku(String sku, List<Product> catalog) {
        if (sku == null || sku.isBlank())
            return null;
        return catalog.stream().filter(p -> sku.equalsIgnoreCase(p.sku())).findFirst().orElse(null);
    }

    private int extractQuantity(String norm, int defaultVal) {
        var matcher = java.util.regex.Pattern.compile("\\b(\\d+)\\b").matcher(norm);
        if (matcher.find()) {
            try {
                int v = Integer.parseInt(matcher.group(1));
                if (v > 0 && v <= 100)
                    return v;
            } catch (NumberFormatException ignored) {
            }
        }
        if (containsAny(norm, "dos"))
            return 2;
        if (containsAny(norm, "tres"))
            return 3;
        if (containsAny(norm, "cuatro"))
            return 4;
        if (containsAny(norm, "un", "uno", "una"))
            return 1;
        return defaultVal;
    }

    private static String normalize(String input) {
        if (input == null)
            return "";
        String n = Normalizer.normalize(input, Normalizer.Form.NFD).replaceAll("\\p{M}+", "");
        return n.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9\\s-]", " ").replaceAll("\\s+", " ").trim();
    }

    private static boolean containsAny(String text, String... terms) {
        for (String t : terms) {
            if (text.contains(t))
                return true;
        }
        return false;
    }
}
