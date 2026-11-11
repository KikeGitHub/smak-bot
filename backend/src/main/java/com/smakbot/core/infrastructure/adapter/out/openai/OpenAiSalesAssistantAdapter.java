package com.smakbot.core.infrastructure.adapter.out.openai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smakbot.core.application.engine.HondurasOrderValidator;
import com.smakbot.core.application.engine.Money;
import com.smakbot.core.domain.model.ChatSession;
import com.smakbot.core.domain.model.CheckoutDraft;
import com.smakbot.core.domain.model.CheckoutStep;
import com.smakbot.core.domain.model.ConversationTurn;
import com.smakbot.core.domain.model.IncomingMessage;
import com.smakbot.core.domain.model.Order;
import com.smakbot.core.domain.model.OrderStatus;
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

        String raw = incomingMessage.text() != null ? incomingMessage.text() : "";
        String norm = normalize(raw);

        // Guardrail determinista: rechazar temas claramente ajenos al negocio (programación, tareas, etc.)
        if (!session.inCheckout() && isOutOfScopeQuery(norm)) {
            String reply = "¡Hola! Con mucho gusto te atiendo, pero soy el asesor virtual de " + tenant.name()
                    + " y únicamente puedo ayudarte con consultas sobre nuestro catálogo de muebles, productos para el hogar y pedidos en Honduras 😊 ¿Te gustaría ver nuestros modelos disponibles o cotizar algún producto?";
            return new AssistantDecision(reply, session.getStep(), null, false, false, false, null);
        }

        if (!isConfigured()) {
            log.debug("OPENAI_API_KEY no configurada; utilizando motor conversacional integrado de respaldo.");
            return fallbackDecision(tenant, catalog, rules, customerOrders, session, incomingMessage);
        }

        try {
            String systemPrompt = buildSystemPrompt(tenant, catalog, rules, campaigns, customerOrders, session);
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
            requestBody.put("temperature", 0.2);
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
            ChatSession session) {

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
            sb.append("=== REGLAS, HORARIOS, PAGOS, ENVÍOS Y PREGUNTAS FRECUENTES (CONSULTADOS DE BD) ===\n");
            for (RuleContext r : rules) {
                String resp = r.response();
                if (resp != null && !resp.isBlank()) {
                    sb.append("• [").append(r.category()).append(" - ").append(r.name()).append("]: ")
                            .append(resp.replace("\n", " ")).append("\n");
                }
            }
            sb.append("\n");
        }

        sb.append("=== CATÁLOGO OFICIAL EN TIEMPO REAL DESDE BD (ÚNICA FUENTE DE VERDAD) ===\n");
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
            sb.append("=== CAMPAÑAS Y ANUNCIOS DE REDES SOCIALES (BD) ===\n");
            for (CampaignContext c : campaigns) {
                sb.append("- URL: ").append(c.url()).append(" -> SKU: ").append(c.sku())
                        .append(" (").append(c.headline()).append(")\n");
            }
            sb.append("\n");
        }

        if (customerOrders != null && !customerOrders.isEmpty()) {
            sb.append("=== PEDIDOS Y RASTREO EN BD PERTENECIENTES A ESTE CLIENTE ===\n");
            for (Order o : customerOrders) {
                sb.append("- Orden: ").append(o.orderNumber())
                        .append(" | Estado: ").append(o.status() != null ? o.status().label() : "En proceso")
                        .append(" | Producto: ").append(o.quantity()).append("x ").append(o.productName())
                        .append(" | Total: ").append(Money.lempiras(o.total()))
                        .append(" | Cliente: ").append(o.customerName())
                        .append(" | Teléfono: ").append(o.customerPhone())
                        .append(" | Dirección: ").append(o.deliveryAddress())
                        .append(" | Guía: ")
                        .append(o.trackingNumber() != null && !o.trackingNumber().isBlank()
                                ? o.trackingNumber() + " (" + o.trackingCarrier() + ")"
                                : "En preparación para despacho en bodega");
                if (o.status() == OrderStatus.CANCELADO && o.cancellationReason() != null) {
                    sb.append(" | Motivo cancelación: ").append(o.cancellationReason());
                }
                sb.append("\n");
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
            String invState = !d.invoiceAnswered
                    ? "PENDIENTE (Debe responder Sí o No)"
                    : (d.requiresInvoice
                    ? "SÍ (RTN: " + (d.rtn != null ? d.rtn : "PENDIENTE") + ", Razón Social: "
                    + (d.businessName != null ? d.businessName : "PENDIENTE") + ")"
                    : "NO (Consumidor Final)");
            sb.append("- Borrador de pedido activo:\n")
                    .append("  * SKU: ").append(d.productSku).append(" (").append(d.productName).append(")\n")
                    .append("  * Cantidad: ").append(d.quantityConfirmed ? d.quantity + " (Confirmada)" : d.quantity + " (PENDIENTE de confirmar con el cliente)").append("\n")
                    .append("  * Nombre completo (con apellido): ").append(HondurasOrderValidator.isValidFullName(d.name) ? d.name : "PENDIENTE").append("\n")
                    .append("  * Dirección entrega Honduras: ").append(HondurasOrderValidator.isValidHondurasAddress(d.address, d.location) ? d.address : "PENDIENTE").append("\n")
                    .append("  * Teléfono Honduras (8 dígitos, llamadas): ").append(HondurasOrderValidator.isValidHondurasPhone(d.phone) ? d.phone : "PENDIENTE").append("\n")
                    .append("  * Facturación RTN: ").append(invState).append("\n");
        } else {
            sb.append("- Borrador de pedido activo: Ninguno\n");
        }
        sb.append("\n");

        sb.append(
                """
                        === REGLAS SUPREMAS DE CONVERSACIÓN, TONO Y VENTAS ===
                        0. LÍMITE ESTRICTO DE NEGOCIO Y GUARDRAIL (TOTALMENTE PROHIBIDO SALIRSE DEL GIRO):
                           - Eres EXCLUSIVAMENTE el asesor de ventas y atención al cliente de SMAK en Honduras.
                           - Tu ÚNICO propósito es atender consultas sobre nuestro catálogo de muebles/artículos, horarios, políticas, envíos por Cargo Expreso, rastreo de guías y pedidos en Honduras.
                           - ESTÁ TOTALMENTE PROHIBIDO responder preguntas de programación, software, tareas escolares, historia, política, clima o temas personales.
                           - Si preguntan algo ajeno, declina amablemente en 1-2 líneas y reconduce al catálogo (`nextStep` = "IDLE", `selectedSku` = null).

                        1. TONO ULTRA DIRECTO, CONCISO Y HUMANO (ESTILO WHATSAPP):
                           - Mensajes breves y claros (2 a 4 líneas máximo). Directo al grano, amable, sin rodeos ni párrafos pesados.
                           - PROHIBIDO enviar listas numeradas pidiendo varios datos de golpe. Pide ÚNICAMENTE 1 dato por turno.
                           - Si el cliente envía una imagen o pregunta por un producto disponible ("kiero esta", "quiero una", "precio"):
                             Confirma disponibilidad de inmediato + Precio real del catálogo con envío gratis + pregunta su nombre completo para iniciar el pedido.
                           - PROHIBIDO sonar a robot ("Lamentablemente...", "Como modelo de lenguaje...", "Disculpe las molestias...").

                        2. CATÁLOGO REAL Y COHERENCIA ESTRICTA DE CATEGORÍA (MUY IMPORTANTE):
                           - Todo producto, precio, horario, pago y FAQ debe salir EXCLUSIVAMENTE de la información de BD proporcionada arriba.
                           - COHERENCIA ESTRICTA DE TIPO DE PRODUCTO: Si el cliente pide "qué otros modelos de silla tienes", "otras sillas", "otros escritorios", "otras mesas", etc., FILTRA Y SUGIERE ÚNICAMENTE productos en stock de ESE MISMO TIPO o categoría (por ejemplo, si pidió SILLAS, muestra solo SILLAS disponibles en catálogo).
                           - TERMINANTEMENTE PROHIBIDO sugerir una hamaca, escalera, grifo o carrito si el cliente preguntó por sillas (o viceversa).
                           - Cuando pida "otros modelos de [tipo]" en plural, enumera de forma concisa 3 o 4 opciones disponibles de ese mismo tipo con su precio en Lempiras y pregúntale cuál le interesa ver (pon `cancelCheckout = true`, `nextStep = "IDLE"` y `selectedSku = null`).
                           - Si un producto no existe en el catálogo real de BD (por ejemplo bicicletas o sofás), indícalo con calidez en 2 líneas y pregunta qué artículo del catálogo busca.

                        3. FOTOS DEL PRODUCTO:
                           - Al presentar por primera vez un producto específico o si el cliente elige uno nuevo, pon `sendProductPhotos = true` y `sendAllPhotos = false`.
                           - Si pide expresamente más fotos/galería, pon `sendAllPhotos = true` y `sendProductPhotos = true`.
                           - Al listar varios modelos a elegir o pedir datos de envío (`NAME`, `ADDRESS`, `PHONE`, etc.), pon `sendProductPhotos = false` y `sendAllPhotos = false`.

                        4. FLUJO ESTRICTO DATO POR DATO PARA HONDURAS (PROHIBIDO SALTAR PASOS):
                           Recopila y valida OBLIGATORIAMENTE en este orden exacto, 1 dato por turno:
                           1) `NAME`: Nombre completo (**nombre y al menos un apellido**, ej. "Carlos Mendoza"). Si solo da un nombre, vuelve a pedirlo con apellido.
                           2) `QUANTITY`: Cantidad de unidades (si no la confirmó explícitamente). Validar siempre contra el stock real.
                           3) `ADDRESS`: Dirección completa en Honduras:
                              • Ciudad / Municipio
                              • Colonia, barrio o residencial
                              • Calle, casa y referencia (o Agencia Cargo Expreso con ciudad, o ubicación GPS 📍).
                              Si solo dice una ciudad sin detalles, pide los datos faltantes.
                           4) `PHONE`: **Número de teléfono en Honduras de 8 dígitos (que reciba llamadas directas de Cargo Expreso)**, ej. 9800-8559. PROHIBIDO saltar este paso o asumir el número del chat.
                           5) `REQUIRES_INVOICE`: Pregunta directa de **Sí o No**: "¿Requieres factura con RTN para tu pedido? (Responde *Sí* o *No*)".
                           6) Si responde **Sí**:
                              • `INVOICE_RTN`: Pedir **RTN de Honduras (14 dígitos numéricos**, ej. 08011990123456).
                              • `INVOICE_BUSINESS_NAME`: Pedir **Nombre o Razón Social** de la empresa.
                           7) `CONFIRM`: Solo cuando TODOS los datos anteriores estén validados, muestra resumen breve y pide confirmar (*"Confirmar"*).

                        5. VALIDACIÓN ESTRICTA DE INVENTARIO:
                           - Nunca confirmes un pedido ni avances con una cantidad mayor al stock disponible en catálogo o si el stock es 0.

                        6. RASTREO DE PEDIDOS Y CONSULTAS DESDE BD:
                           - Si pregunta por su pedido o guía de rastreo, consulta los datos de "PEDIDOS Y RASTREO EN BD PERTENECIENTES A ESTE CLIENTE" e informa el estado exacto, guía CAEX (si ya fue asignada manualmente) o motivo de cancelación.
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
    // MOTOR INTEGRADO DE RESPALDO (CONSULTANDO ESTRICTAMENTE REGLAS Y DATOS DE BD)
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

        // 1. Solicitud explícita de humano (evitar colisión con "Sillón/Escritorio Ejecutivo")
        if (containsAny(norm, "asesor", "asesora", "humano", "humana", "hablar con alguien",
                "con una persona", "persona real", "un ejecutivo", "ejecutivo de ventas", "ejecutivo comercial",
                "agente humano", "operador")) {
            String text = "Para brindarte una mejor atención, voy a transferir tu consulta directamente con un ejecutivo comercial de *"
                    + tenant.name()
                    + "* por este mismo chat. Un miembro del equipo te responderá en breve. ¡Gracias por tu paciencia! 🙌";
            return new AssistantDecision(text, CheckoutStep.HUMAN, session.getSelectedSku(), false, false, false, null);
        }

        // 2. Detectar producto mencionado en el mensaje o mantener el actual de la sesión
        Product matchedProduct = matchProductFromCatalog(norm, catalog).orElse(null);
        Product activeProduct = matchedProduct != null ? matchedProduct
                : resolveBySku(session.getSelectedSku(), catalog);

        // 3. Solicitud de "otros modelos" / "qué más sillas tienes" (COHERENCIA ESTRICTA DE CATEGORÍA)
        if (isAlternativeModelsQuery(norm)) {
            return handleAlternativeModelsQuery(norm, session, catalog, activeProduct);
        }

        // 4. Cancelación durante checkout ("mejor no", "cancelar", "ya no quiero")
        if (containsAny(norm, "mejor no", "cancelar", "cancela", "ya no quiero", "salir", "olvidalo")) {
            return new AssistantDecision(
                    "Entendido, he cancelado la orden actual. 😊 Si deseas consultar cualquier otro modelo o ver nuestro catálogo, dime con confianza.",
                    CheckoutStep.IDLE, null, false, true, false, null);
        }

        // 5. Si está en medio del checkout y no hace una pregunta informativa ni consulta de FAQ en BD
        if (session.inCheckout() && !isInformationalOrFaqQuestion(norm, rules)) {
            return handleFallbackCheckoutStep(session, raw, norm, incomingMessage, activeProduct, rules, catalog);
        }

        // 6. Rastreo de pedido / guía Cargo Expreso consultando exclusivamente customerOrders de BD
        if (containsAny(norm, "rastrear", "rastreo", "mi pedido", "mi orden", "guia", "estatus", "estado del pedido", "smak-ord", "calz-ord", "caex")) {
            if (customerOrders != null && !customerOrders.isEmpty()) {
                Order o = customerOrders.get(0);
                String status = o.status() != null ? o.status().label() : "En proceso";
                String guia = (o.trackingNumber() != null && !o.trackingNumber().isBlank())
                        ? "• Guía de rastreo: *" + o.trackingNumber() + "* (" + o.trackingCarrier() + ")"
                        : "• Guía: *En preparación para despacho en bodega*";
                String cancelNote = (o.status() == OrderStatus.CANCELADO && o.cancellationReason() != null)
                        ? "\n• Motivo cancelación: _" + o.cancellationReason() + "_"
                        : "";
                String reply = "📦 *Estatus de tu Pedido (" + o.orderNumber() + ")*:\n\n"
                        + "• Estado: *" + status + "*\n"
                        + "• Cliente: " + o.customerName() + " (Tel: " + o.customerPhone() + ")\n"
                        + "• Producto: " + o.quantity() + "x " + o.productName() + "\n"
                        + "• Total contra entrega: *" + Money.lempiras(o.total()) + "*\n"
                        + guia + cancelNote;
                CheckoutStep stepKeep = session.inCheckout() ? session.getStep() : CheckoutStep.IDLE;
                return new AssistantDecision(reply, stepKeep, session.getSelectedSku(), false, false, false, null);
            }
            return new AssistantDecision(
                    "No encontré ningún pedido con ese código en nuestra base de datos. 😊 Compárteme tu *número de pedido* (ej. *SMAK-ORD-1005*) o *guía Cargo Expreso* para consultarlo de inmediato.",
                    session.inCheckout() ? session.getStep() : CheckoutStep.IDLE,
                    session.getSelectedSku(), false, false, false, null);
        }

        // 7. Ubicación GPS fuera de checkout
        if (incomingMessage.location() != null && incomingMessage.location().lat() != null) {
            String locName = incomingMessage.location().resolvedAddress();
            String reply = "¡Ubicación detectada! 📍 Veo que te encuentras en *" + locName + "*.\n\n"
                    + "🚚 ¡Sí tenemos cobertura a domicilio en esa zona vía Cargo Expreso con envío GRATIS y pago al recibir! ¿Qué producto te gustaría ordenar?";
            return new AssistantDecision(reply, session.getStep(), session.getSelectedSku(), false, false, false, null);
        }

        // 8. Intención de compra directa
        if (isPurchaseIntent(norm) && activeProduct != null) {
            if (!activeProduct.inStock()) {
                return new AssistantDecision(
                        "El modelo *" + activeProduct.name() + "* (SKU: " + activeProduct.sku()
                                + ") se encuentra temporalmente *agotado* 📦. ¿Te gustaría ver otro modelo similar disponible?",
                        CheckoutStep.IDLE, activeProduct.sku(), false, false, false, null);
            }
            int qty = extractQuantity(norm, 1);
            if (qty > activeProduct.stock()) {
                DraftUpdate du = new DraftUpdate(activeProduct.sku(), activeProduct.stock(), null, null, null, null, null, null, null);
                String txt = "Fíjate que de momento solo nos quedan *" + activeProduct.stock()
                        + (activeProduct.stock() == 1 ? " unidad disponible*" : " unidades disponibles*")
                        + " de *" + activeProduct.name() + "* (oferta *" + Money.lempiras(activeProduct.salePrice())
                        + "* con envío gratis) 📦.\n\n¿Te apartamos las *" + activeProduct.stock()
                        + "* disponibles? Si es así, compárteme tu *nombre completo* (con apellido):";
                return new AssistantDecision(txt, CheckoutStep.NAME, activeProduct.sku(), false, false, false, du);
            }
            DraftUpdate du = new DraftUpdate(activeProduct.sku(), qty, null, null, null, null, null, null, null);
            String txt = "¡Sí, la tenemos disponible! 🎉 Su precio de oferta es de *"
                    + Money.lempiras(activeProduct.salePrice())
                    + "* con envío gratis y pagas al recibir.\n\nPara apartar la tuya, ¿cuál es tu *nombre completo* (nombre y apellido)?";
            return new AssistantDecision(txt, CheckoutStep.NAME, activeProduct.sku(), false, false, false, du);
        }

        // 9. Consultas sobre el producto activo (colores, medidas, peso, precio, fotos, stock)
        if (activeProduct != null) {
            String resumeSuffix = session.inCheckout() ? "\n\n" + buildCheckoutResumePrompt(session) : "";
            CheckoutStep stepToKeep = session.inCheckout() ? session.getStep() : CheckoutStep.IDLE;

            if (containsAny(norm, "color", "colores", "tono", "verde", "azul", "rojo", "negro", "blanco", "cafe",
                    "marron", "gris", "rosa")) {
                String colors = activeProduct.colors() != null ? activeProduct.colors() : "su presentación estándar";
                String reply = "🎨 El modelo *" + activeProduct.name() + "* lo tenemos disponible en color: *"
                        + colors + "*. 🚚 Envío gratis por Cargo Expreso y pagas al recibir."
                        + (session.inCheckout() ? resumeSuffix : " ¿Te gustaría ordenarlo?");
                return new AssistantDecision(reply, stepToKeep, activeProduct.sku(), false, false, false, null);
            }
            if (containsAny(norm, "medida", "medidas", "dimension", "dimensiones", "mide", "tamano", "alto", "ancho")) {
                String dims = activeProduct.dimensions() != null ? activeProduct.dimensions()
                        : "medidas estándar de fábrica";
                String reply = "📏 Las medidas exactas de *" + activeProduct.name() + "* son: *" + dims + "*."
                        + (activeProduct.weightLimit() != null
                                ? " Soporte: *" + activeProduct.weightLimit() + "*."
                                : "")
                        + (session.inCheckout() ? resumeSuffix : " ¿Te gustaría hacer tu pedido?");
                return new AssistantDecision(reply, stepToKeep, activeProduct.sku(), false, false, false, null);
            }
            if (containsAny(norm, "peso", "soporta", "aguanta", "resistencia", "kilos", "libras")) {
                String weight = activeProduct.weightLimit() != null ? activeProduct.weightLimit()
                        : "alta resistencia estructural";
                String reply = "💪 El modelo *" + activeProduct.name() + "* soporta hasta *" + weight + "*."
                        + (session.inCheckout() ? resumeSuffix : " ¿Te gustaría ordenarlo?");
                return new AssistantDecision(reply, stepToKeep, activeProduct.sku(), false, false, false, null);
            }
            if (containsAny(norm, "mas fotos", "más fotos", "todas las fotos", "galeria", "galería", "otras fotos")) {
                String reply = "📸 ¡Con mucho gusto! Aquí tienes la galería con más fotos de *"
                        + activeProduct.name() + "*."
                        + (session.inCheckout() ? resumeSuffix : " ¿Te gustaría ordenarlo?");
                return new AssistantDecision(reply, stepToKeep, activeProduct.sku(), true, true, false, false, null);
            }
            if (containsAny(norm, "foto", "fotos", "imagen", "imagenes")) {
                String reply = "📸 Aquí tienes la foto de *" + activeProduct.name() + "* (*"
                        + Money.lempiras(activeProduct.salePrice()) + "* con envío gratis)."
                        + (session.inCheckout() ? resumeSuffix : " ¿Te gustaría ordenarlo?");
                return new AssistantDecision(reply, stepToKeep, activeProduct.sku(), true, false, false, false, null);
            }
            if (matchedProduct != null
                    || containsAny(norm, "precio", "cuesta", "vale", "stock", "disponible", "tienen", "hay")) {
                if (!activeProduct.inStock()) {
                    String reply = "El modelo *" + activeProduct.name() + "* (SKU: "
                            + activeProduct.sku() + ") se encuentra temporalmente *agotado* 📦.";
                    return new AssistantDecision(reply, stepToKeep, activeProduct.sku(), false, false, false, null);
                }
                String reply = "¡Sí, lo tenemos disponible! 🎉 *" + activeProduct.name() + "* (SKU: " + activeProduct.sku() + ") — *"
                        + Money.lempiras(activeProduct.salePrice()) + "* (" + activeProduct.stock() + " disp., envío gratis)."
                        + (session.inCheckout() ? resumeSuffix : " ¿Deseas ordenarlo ahora?");
                return new AssistantDecision(reply, stepToKeep, activeProduct.sku(), matchedProduct != null, false,
                        false, null);
            }
        }

        // 10. Consultar Reglas, Horarios, Envíos, Ubicación y Preguntas Frecuentes DIRECTO DE BD (bot_rules + tenants.scope_policy)
        Optional<String> dbFaqReply = matchRuleFromDb(norm, rules, activeProduct, catalog);
        if (dbFaqReply.isPresent()) {
            String reply = dbFaqReply.get();
            if (session.inCheckout()) {
                reply += "\n\n" + buildCheckoutResumePrompt(session);
            }
            return new AssistantDecision(reply, session.getStep(), session.getSelectedSku(), false, false, false, null);
        }

        Optional<String> scopeReply = matchTenantScopeFallback(norm, tenant);
        if (scopeReply.isPresent()) {
            String reply = scopeReply.get();
            if (session.inCheckout()) {
                reply += "\n\n" + buildCheckoutResumePrompt(session);
            }
            return new AssistantDecision(reply, session.getStep(), session.getSelectedSku(), false, false, false, null);
        }

        // 11. Consulta por categoría o catálogo general directamente desde BD (products)
        String requestedFamily = detectProductFamily(norm);
        if (requestedFamily != null || containsAny(norm, "hola", "buenas", "buenos dias", "buenas tardes", "buenas noches",
                "catalogo", "productos", "muebles", "que tienen", "que venden")) {
            List<Product> filtered = requestedFamily != null
                    ? filterProductsByFamily(requestedFamily, catalog, null, session)
                    : catalog.stream().filter(Product::inStock).limit(5).toList();
            if (filtered.isEmpty() && requestedFamily != null) {
                return new AssistantDecision(
                        "Fíjate que de momento no manejamos *" + requestedFamily + "* en nuestro catálogo 😊 ¿Te gustaría ver nuestras sillas, escritorios o artículos para el hogar disponibles?",
                        CheckoutStep.IDLE, session.getSelectedSku(), false, false, false, null);
            }
            StringBuilder list = new StringBuilder();
            filtered.stream().limit(5).forEach(p -> list.append("• *").append(p.name())
                    .append("* — *").append(Money.lempiras(p.salePrice())).append("*\n"));
            String header = requestedFamily != null
                    ? "¡Con gusto! Estos son nuestros modelos disponibles:\n\n"
                    : "¡Hola! 👋 Bienvenido a *" + tenant.name() + "*. Algunos de nuestros modelos disponibles:\n\n";
            String reply = header + list + "\n🚚 Envío gratis a toda Honduras. ¿Cuál te gustaría ver en detalle o pedir?";
            return new AssistantDecision(reply, CheckoutStep.IDLE, session.getSelectedSku(), false, false, false, null);
        }

        // 12. No entendido
        String fallback = "Disculpa, no logré entender bien tu mensajito. 😊 ¿Me indicas qué producto o mueble estás buscando? Con gusto te comparto precios y fotos.";
        return new AssistantDecision(fallback, session.getStep(), session.getSelectedSku(), false, false, false, null);
    }

    private AssistantDecision handleAlternativeModelsQuery(
            String norm,
            ChatSession session,
            List<Product> catalog,
            Product activeProduct) {

        String explicitFamily = detectProductFamily(norm);
        List<Product> matches = filterProductsByFamily(explicitFamily, catalog, activeProduct, session);

        if (matches.isEmpty()) {
            String targetName = explicitFamily != null ? explicitFamily
                    : (activeProduct != null ? activeProduct.category() : "ese tipo de producto");
            return new AssistantDecision(
                    "Por el momento no nos quedan otros modelos disponibles en la línea de *" + targetName
                            + "* 📦. ¿Te gustaría apartar el disponible o consultar otra categoría?",
                    CheckoutStep.IDLE,
                    activeProduct != null ? activeProduct.sku() : null,
                    false, false, false, null);
        }

        boolean wantsList = matches.size() > 1 && containsAny(norm, "otros modelos", "mas modelos", "más modelos",
                "que otros", "qué otros", "otras opciones", "tienes mas", "tienen mas", "otras sillas", "mas sillas", "otros tipos");
        if (wantsList) {
            StringBuilder sb = new StringBuilder();
            String familyLabel = explicitFamily != null ? explicitFamily + "s" : "modelos disponibles";
            sb.append("¡Con gusto! Aquí tienes nuestras opciones de *").append(familyLabel).append("* disponibles en tienda:\n\n");
            int count = 0;
            for (Product p : matches) {
                if (count >= 4) break;
                sb.append("• *").append(p.name()).append("* — *").append(Money.lempiras(p.salePrice())).append("*")
                        .append(" (").append(p.stock()).append(" disp.")
                        .append(p.colors() != null ? ", " + p.colors() : "").append(")\n");
                session.addOfferedSku(p.sku());
                count++;
            }
            sb.append("\n¿Cuál de estos modelos te gustaría ver o apartar? 😊");
            return new AssistantDecision(sb.toString(), CheckoutStep.IDLE, null, false, false, true, false, null);
        }

        Product alt = matches.get(0);
        session.addOfferedSku(alt.sku());
        String txt = "¡Claro! También tenemos disponible en esa misma línea:\n\n"
                + "• *" + alt.name() + "* — *" + Money.lempiras(alt.salePrice()) + "* (" + alt.stock() + " disp.)\n"
                + (alt.colors() != null ? "• Colores: " + alt.colors() + "\n" : "")
                + "\n🚚 Envío gratis a todo el país y pagas al recibir. ¿Te gustaría pedir este modelo?";
        return new AssistantDecision(txt, CheckoutStep.IDLE, alt.sku(), true, false, true, false, null);
    }

    private AssistantDecision handleFallbackCheckoutStep(
            ChatSession session,
            String raw,
            String norm,
            IncomingMessage incomingMessage,
            Product activeProduct,
            List<RuleContext> rules,
            List<Product> catalog) {

        CheckoutDraft c = session.getCheckout();
        CheckoutStep step = session.getStep();

        switch (step) {
            case NAME -> {
                if (!HondurasOrderValidator.isValidFullName(raw)) {
                    return new AssistantDecision(
                            "Para registrar tu guía necesito tu **nombre completo** (nombre y al menos un apellido, ej: *Carlos Mendoza*), por favor 😊:",
                            CheckoutStep.NAME, c.productSku, false, false, false, null);
                }
                String cleanName = HondurasOrderValidator.extractCleanFullName(raw);
                DraftUpdate du = new DraftUpdate(c.productSku, null, cleanName, null, null, null, null, null, null);
                if (c.quantityConfirmed) {
                    return new AssistantDecision(
                            "¡Gracias, *" + cleanName + "*! Anotamos *" + c.effectiveQuantityLabel()
                                    + "*.\n\n🚚 ¿A qué **dirección en Honduras** te lo enviamos?\n• Ciudad / Municipio\n• Colonia, barrio o residencial\n• Calle, casa y referencia *(o Agencia Cargo Expreso / ubicación 📍)*:",
                            CheckoutStep.ADDRESS, c.productSku, false, false, false, du);
                }
                return new AssistantDecision(
                        "Gracias, *" + cleanName + "*. ¿Cuántas unidades deseas ordenar? (Ejemplo: *1*, *2*):",
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
                if (activeProduct != null && q > activeProduct.stock()) {
                    if (activeProduct.stock() <= 0) {
                        return new AssistantDecision(
                                "El modelo *" + activeProduct.name() + "* se encuentra temporalmente *agotado* 📦. ¿Te gustaría ver otro modelo similar disponible?",
                                CheckoutStep.IDLE, activeProduct.sku(), false, false, true, false, null);
                    }
                    DraftUpdate du = new DraftUpdate(c.productSku, activeProduct.stock(), null, null, null, null, null, null, null);
                    return new AssistantDecision(
                            "Fíjate que de momento solo nos quedan *" + activeProduct.stock()
                                    + (activeProduct.stock() == 1 ? " unidad disponible*" : " unidades disponibles*")
                                    + " de *" + activeProduct.name() + "* 📦.\n\n¿Te apartamos las *" + activeProduct.stock()
                                    + "* disponibles?",
                            CheckoutStep.QUANTITY, c.productSku, false, false, false, du);
                }
                DraftUpdate du = new DraftUpdate(c.productSku, q, null, null, null, null, null, null, null);
                return new AssistantDecision(
                        "¡Anotado! *" + q + (q == 1 ? " unidad*" : " unidades*.")
                                + "\n\n🚚 ¿A qué **dirección en Honduras** te lo enviamos?\n• Ciudad / Municipio\n• Colonia, barrio o residencial\n• Calle, casa y referencia *(o Agencia Cargo Expreso / ubicación 📍)*:",
                        CheckoutStep.ADDRESS, c.productSku, false, false, false, du);
            }
            case ADDRESS -> {
                String addr = (incomingMessage.location() != null && incomingMessage.location().lat() != null)
                        ? incomingMessage.location().resolvedAddress()
                        : raw;
                if (!HondurasOrderValidator.isValidHondurasAddress(addr, incomingMessage.location())) {
                    return new AssistantDecision(
                            "Para que Cargo Expreso entregue sin retrasos, por favor compártenos tu dirección completa en Honduras:\n• **Ciudad / Municipio**\n• **Colonia o barrio**\n• **Calle, casa y referencia**\n*(O indícanos la agencia Cargo Expreso donde deseas retirar, o envía tu ubicación 📍)*:",
                            CheckoutStep.ADDRESS, c.productSku, false, false, false, null);
                }
                boolean isAgency = HondurasOrderValidator.isAgencyAddress(addr);
                DraftUpdate du = new DraftUpdate(c.productSku, null, null, addr, isAgency, null, null, null, null);
                return new AssistantDecision(
                        "¡Dirección registrada! 📦\n\n📞 ¿A qué **número telefónico de 8 dígitos en Honduras (que reciba llamadas directas)** te contactará el repartidor de Cargo Expreso?",
                        CheckoutStep.PHONE, c.productSku, false, false, false, du);
            }
            case PHONE -> {
                Optional<String> validPhone = HondurasOrderValidator.normalizeAndValidatePhone(raw);
                if (validPhone.isEmpty()) {
                    return new AssistantDecision(
                            "Por favor compártenos un **número telefónico válido en Honduras de 8 dígitos** que reciba llamadas directas (ejemplo: *9800-8559*):",
                            CheckoutStep.PHONE, c.productSku, false, false, false, null);
                }
                DraftUpdate du = new DraftUpdate(c.productSku, null, null, null, null, validPhone.get(), null, null, null);
                return new AssistantDecision(
                        "Teléfono registrado para llamadas: *" + validPhone.get()
                                + "* 📞.\n\n🧾 ¿Requieres **factura con RTN** para tu pedido? (Responde *Sí* o *No*):",
                        CheckoutStep.REQUIRES_INVOICE, c.productSku, false, false, false, du);
            }
            case REQUIRES_INVOICE -> {
                Optional<Boolean> invDecision = HondurasOrderValidator.parseInvoiceDecision(raw);
                if (invDecision.isEmpty()) {
                    return new AssistantDecision(
                            "Por favor indícanos *Sí* o *No*: ¿deseas **factura con RTN** para tu pedido?",
                            CheckoutStep.REQUIRES_INVOICE, c.productSku, false, false, false, null);
                }
                if (Boolean.TRUE.equals(invDecision.get())) {
                    DraftUpdate du = new DraftUpdate(c.productSku, null, null, null, null, null, true, null, null);
                    return new AssistantDecision(
                            "Por favor indícanos tu número de **RTN de Honduras** (14 dígitos numéricos, ejemplo: *08011990123456*):",
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
                Optional<String> validRtn = HondurasOrderValidator.normalizeAndValidateRtn(raw);
                if (validRtn.isEmpty()) {
                    return new AssistantDecision(
                            "El **RTN en Honduras** debe tener exactamente **14 dígitos numéricos** (ejemplo: *08011990123456*). ¿Me lo compartes completo?",
                            CheckoutStep.INVOICE_RTN, c.productSku, false, false, false, null);
                }
                DraftUpdate du = new DraftUpdate(c.productSku, null, null, null, null, null, true, validRtn.get(), null);
                return new AssistantDecision(
                        "RTN registrado (*" + validRtn.get() + "*). ¿Cuál es el **Nombre o Razón Social** de la empresa para tu factura?",
                        CheckoutStep.INVOICE_BUSINESS_NAME, c.productSku, false, false, false, du);
            }
            case INVOICE_BUSINESS_NAME -> {
                if (!HondurasOrderValidator.isValidBusinessName(raw)) {
                    return new AssistantDecision(
                            "Por favor indícanos el **Nombre o Razón Social** completo para emitir la factura con RTN:",
                            CheckoutStep.INVOICE_BUSINESS_NAME, c.productSku, false, false, false, null);
                }
                String cleanBiz = HondurasOrderValidator.extractCleanBusinessName(raw);
                DraftUpdate du = new DraftUpdate(c.productSku, null, null, null, null, null, true, c.rtn, cleanBiz);
                return new AssistantDecision(
                        "📋 *Resumen de tu pedido listo para confirmar*:\n"
                                + "• Producto: *" + c.productName + "*\n"
                                + "• Cantidad: *" + c.quantity + " unid.*\n"
                                + "• Total: *" + Money.lempiras(c.total) + "*\n"
                                + "• Cliente: " + c.name + "\n"
                                + "• Entrega: " + c.address + "\n"
                                + "• Teléfono: " + c.phone + "\n"
                                + "• Factura RTN: " + c.rtn + " (" + cleanBiz + ")\n\n"
                                + "Escribe *Confirmar* (o presiona el botón ✅) para registrar tu pedido.",
                        CheckoutStep.CONFIRM, c.productSku, false, false, false, du);
            }
            case CONFIRM -> {
                if (containsAny(norm, "confirmar", "confirmo", "si", "ok", "dale", "listo", "correcto", "mandelo")) {
                    return new AssistantDecision("¡Pedido confirmado!", CheckoutStep.IDLE, c.productSku, false, false,
                            true, null);
                }
                if (containsAny(norm, "modificar", "cambiar direccion", "direccion")) {
                    return new AssistantDecision("Por favor indícanos la nueva dirección completa de entrega en Honduras:",
                            CheckoutStep.ADDRESS, c.productSku, false, false, false, null);
                }
                return new AssistantDecision(
                        "Tu pedido para *" + c.productName
                                + "* sigue listo. Escribe *Confirmar* para registrarlo o *Cancelar* si deseas anularlo.",
                        CheckoutStep.CONFIRM, c.productSku, false, false, false, null);
            }
            default -> {
                return new AssistantDecision("¿En qué te podemos colaborar hoy?", CheckoutStep.IDLE,
                        session.getSelectedSku(), false, false, false, null);
            }
        }
    }

    private Optional<String> matchRuleFromDb(String norm, List<RuleContext> rules, Product activeProduct, List<Product> catalog) {
        if (rules == null || rules.isEmpty() || norm.isBlank()) {
            return Optional.empty();
        }
        RuleContext best = null;
        int bestScore = 0;
        for (RuleContext r : rules) {
            if ("Ver Catálogo de Productos".equalsIgnoreCase(r.name())
                    || "Sinónimos y Términos Equivalentes".equalsIgnoreCase(r.category())) {
                continue;
            }
            int score = 0;
            if (r.trainingPhrases() != null) {
                for (String phrase : r.trainingPhrases()) {
                    String np = normalize(phrase).replace("{sku}", "").trim();
                    if (np.length() >= 4 && norm.contains(np)) {
                        score += 45;
                    } else {
                        for (String tok : np.split("\\s+")) {
                            if (tok.length() >= 4 && norm.contains(tok)) {
                                score += 10;
                            }
                        }
                    }
                }
            }
            String rName = normalize(r.name());
            for (String tok : rName.split("\\s+")) {
                if (tok.length() >= 4 && norm.contains(tok)) {
                    score += 8;
                }
            }
            if (score > bestScore) {
                bestScore = score;
                best = r;
            }
        }
        if (best == null || bestScore < 12) {
            return Optional.empty();
        }
        if (best.response() != null && !best.response().isBlank()) {
            return Optional.of(best.response());
        }
        if (activeProduct != null && best.responseInStock() != null) {
            String tpl = activeProduct.inStock() ? best.responseInStock() : best.responseOutOfStock();
            if (tpl != null) {
                return Optional.of(tpl
                        .replace("{sku}", activeProduct.sku())
                        .replace("{name}", activeProduct.name())
                        .replace("{stock}", String.valueOf(activeProduct.stock()))
                        .replace("{salePrice}", activeProduct.salePrice().toPlainString()));
            }
        }
        return Optional.empty();
    }

    private Optional<String> matchTenantScopeFallback(String norm, Tenant tenant) {
        if (tenant == null || tenant.scopePolicy() == null || tenant.scopePolicy().isBlank()) {
            return Optional.empty();
        }
        if (containsAny(norm, "envio", "flete", "entrega", "cargo expreso", "san pedro", "tegucigalpa",
                "domicilio", "tardan", "horario", "agencia", "roatan", "utila", "isla", "forza",
                "pago", "transferencia", "tarjeta", "garantia", "ubicacion", "donde estan")) {
            return Optional.of("📋 *" + tenant.name() + ":* " + tenant.scopePolicy().trim());
        }
        return Optional.empty();
    }

    private String detectProductFamily(String norm) {
        if (norm == null || norm.isBlank()) return null;
        if (containsAny(norm, "taburete", "banco alto", "bancos")) return "taburete";
        if (containsAny(norm, "silla", "sillas")) return "silla";
        if (containsAny(norm, "sillon", "reclinable")) return "sillon";
        if (containsAny(norm, "escritorio")) return "escritorio";
        if (containsAny(norm, "mesa", "mesas", "comedor")) return "mesa";
        if (containsAny(norm, "fregadero", "pileta", "lavatrastos")) return "fregadero";
        if (containsAny(norm, "grifo", "llave", "monocomando", "ducha", "barral")) return "grifo";
        if (containsAny(norm, "hamaca")) return "hamaca";
        if (containsAny(norm, "escalera")) return "escalera";
        if (containsAny(norm, "closet", "perchero")) return "closet";
        if (containsAny(norm, "carrito", "diablo", "carro")) return "carro";
        if (containsAny(norm, "ruedas", "plegable")) return "silla";
        return null;
    }

    private List<Product> filterProductsByFamily(
            String explicitFamily,
            List<Product> catalog,
            Product currentProduct,
            ChatSession session) {

        String currentSku = currentProduct != null ? currentProduct.sku() : session.getSelectedSku();
        String family = explicitFamily;
        if (family == null && currentProduct != null) {
            family = detectProductFamily(normalize(currentProduct.name()));
        }
        final String targetFamily = family;
        final String targetCategory = currentProduct != null ? currentProduct.category() : session.getActiveCategory();

        List<Product> candidates = new ArrayList<>();
        for (Product p : catalog) {
            if (!p.inStock()) continue;
            if (currentSku != null && p.sku().equalsIgnoreCase(currentSku)) continue;
            if (targetFamily != null && matchesFamily(p, targetFamily)) {
                candidates.add(p);
            }
        }
        if (!candidates.isEmpty() || explicitFamily != null) {
            return candidates;
        }
        // Solo si no se pidió un tipo específico ("otro modelo"), buscar por misma categoría exacta
        if (targetCategory != null && !targetCategory.isBlank()) {
            for (Product p : catalog) {
                if (!p.inStock()) continue;
                if (currentSku != null && p.sku().equalsIgnoreCase(currentSku)) continue;
                if (targetCategory.equalsIgnoreCase(p.category())) {
                    candidates.add(p);
                }
            }
        }
        return candidates;
    }

    private boolean matchesFamily(Product p, String family) {
        String pName = normalize(p.name());
        StringBuilder kws = new StringBuilder(pName);
        if (p.keywords() != null) {
            for (String k : p.keywords()) kws.append(" ").append(normalize(k));
        }
        String haystack = kws.toString();
        return switch (family) {
            case "silla" -> haystack.contains("silla") && !pName.contains("ruedas") && !pName.contains("hamaca");
            case "taburete" -> haystack.contains("taburete") || (pName.contains("banco") && !pName.contains("trabajo"));
            case "mesa" -> haystack.contains("mesa");
            case "escritorio" -> haystack.contains("escritorio");
            case "sillon" -> haystack.contains("sillon") || haystack.contains("reclinable");
            case "fregadero" -> haystack.contains("fregadero") || haystack.contains("pileta") || haystack.contains("lavatrastos");
            case "grifo" -> haystack.contains("grifo") || haystack.contains("monocomando") || haystack.contains("ducha");
            case "closet" -> haystack.contains("closet") || haystack.contains("perchero");
            default -> haystack.contains(family);
        };
    }

    private boolean isAlternativeModelsQuery(String norm) {
        return containsAny(norm, "otro modelo", "otros modelos", "otra opcion", "otras opciones",
                "que otros", "qué otros", "tienes mas", "tienen mas", "otras sillas", "mas sillas", "otros tipos");
    }

    private String buildCheckoutResumePrompt(ChatSession session) {
        CheckoutDraft c = session.getCheckout();
        if (c == null) return "";
        return switch (session.getStep()) {
            case NAME -> "Para continuar con tu pedido de *" + c.productName + "*, ¿cuál es tu **nombre completo** (con apellido)?";
            case QUANTITY -> "Ya tenemos tu nombre (" + c.name + "). ¿Cuántas unidades de *" + c.productName + "* deseas ordenar?";
            case ADDRESS -> "Para enviártelo gratis por Cargo Expreso, ¿cuál es tu **dirección en Honduras** (Ciudad, Colonia/Barrio, Calle/Referencia o Agencia CAEX)?";
            case PHONE -> "Solo nos falta tu **número telefónico de 8 dígitos** que reciba llamadas directas de Cargo Expreso:";
            case REQUIRES_INVOICE -> "¿Requieres **factura con RTN** para tu pedido? (Responde *Sí* o *No*):";
            case INVOICE_RTN -> "Compárteme por favor tu **RTN de Honduras** (14 dígitos numéricos):";
            case INVOICE_BUSINESS_NAME -> "RTN registrado (" + c.rtn + "). ¿Cuál es el **Nombre o Razón Social** de la empresa?";
            case CONFIRM -> "Escribe *Confirmar* cuando estés listo para finalizar tu pedido de *" + c.productName + "*.";
            default -> "";
        };
    }

    private boolean isOutOfScopeQuery(String norm) {
        if (norm == null || norm.isBlank()) {
            return false;
        }
        if (containsAny(norm, "silla", "sillon", "banco", "taburete", "mesa", "escritorio", "mueble", "fregadero",
                "pileta", "lavatrastos", "grifo", "llave", "monocomando", "closet", "perchero", "escalera",
                "hamaca", "carro", "diablo", "bici", "bicicleta", "ruedas", "precio", "cuanto vale", "envio",
                "cargo expreso", "pago", "contra entrega", "transferencia", "roatan", "guia", "pedido", "orden",
                "comprar", "apartar", "catalogo", "smak", "garantia", "cuanto mide", "dimension", "colores", "foto",
                "horario", "horarios", "tienda", "ubicados", "ducha", "carrito")) {
            return false;
        }
        return containsAny(norm,
                "python", "javascript", "typescript", "c++", "java spring", "html", "css", "sql injection",
                "programacion", "programar", "codigo fuente", "software", "framework", "algoritmo",
                "definicion de", "que significa", "que es un ", "que es una ", "quien fue", "quien es el",
                "tarea de", "matematicas", "ecuacion", "raiz cuadrada", "hazme un poema", "cuentame un chiste",
                "receta de", "pronostico del tiempo", "clima en", "chatgpt", "openai");
    }

    private boolean isInformationalOrFaqQuestion(String norm, List<RuleContext> rules) {
        if (containsAny(norm, "precio", "cuesta", "vale", "color", "colores", "verde", "azul", "rojo", "medida",
                "medidas", "mide", "dimension", "peso", "soporta", "aguanta", "foto", "fotos", "garantia", "tarjeta",
                "transferencia", "roatan", "utila", "isla", "forza", "horario", "horarios", "envio", "flete")) {
            return true;
        }
        if (rules != null) {
            for (RuleContext r : rules) {
                if ("Sinónimos y Términos Equivalentes".equalsIgnoreCase(r.category())) continue;
                if (r.trainingPhrases() != null) {
                    for (String ph : r.trainingPhrases()) {
                        String nph = normalize(ph).replace("{sku}", "").trim();
                        if (nph.length() >= 6 && norm.contains(nph)) return true;
                    }
                }
            }
        }
        return false;
    }

    private boolean isPurchaseIntent(String norm) {
        if (containsAny(norm, "quiero saber", "quiero ver", "que productos", "catalogo", "otros modelos", "que otros"))
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

    private Product resolveBySku(String sku, List<Product> catalog) {
        if (sku == null || sku.isBlank())
            return null;
        String cleanSku = sku.trim();
        return catalog.stream()
                .filter(p -> cleanSku.equalsIgnoreCase(p.sku()))
                .findFirst()
                .orElseGet(() -> catalog.stream()
                        .filter(p -> p.keywords() != null && p.keywords().stream()
                                .anyMatch(kw -> kw != null && kw.equalsIgnoreCase(cleanSku)))
                        .findFirst()
                        .orElse(null));
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
