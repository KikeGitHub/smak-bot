package com.smakbot.core.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smakbot.core.application.engine.HondurasDeliveryPolicy;
import com.smakbot.core.domain.model.*;
import com.smakbot.core.domain.ports.out.*;
import com.smakbot.core.infrastructure.adapter.out.openai.OpenAiSalesAssistantAdapter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SalesEngineServiceTest {

    @Mock
    private TenantRepositoryPort tenantRepo;
    @Mock
    private ProductRepositoryPort productRepo;
    @Mock
    private OrderRepositoryPort orderRepo;
    @Mock
    private ChatSessionRepositoryPort sessionRepo;

    private SalesEngineService salesEngine;
    private AiSalesAssistantPort aiAssistant;

    private Tenant testTenant;
    private Product wynnChair;
    private Map<String, ChatSession> sessionStore;

    @BeforeEach
    void setUp() {
        aiAssistant = new OpenAiSalesAssistantAdapter("", "gpt-4o-mini", "https://api.openai.com/v1", new ObjectMapper());
        salesEngine = new SalesEngineService(tenantRepo, productRepo, orderRepo, sessionRepo, aiAssistant);

        testTenant = new Tenant(
                "tenant-hn-muebles",
                "Muebles Elegancia HN",
                "HN",
                "L.",
                "+504 9999-0000",
                true,
                "Venta en línea de muebles en Honduras",
                "Asesor experto en muebles y sillas ergonómicas en Honduras.",
                "Atiende consultas de muebles, sillas, envíos por Cargo Expreso y pedidos en Honduras.",
                "SMAK-ORD"
        );

        wynnChair = new Product(
                UUID.randomUUID(),
                "tenant-hn-muebles",
                "SKM-956-CA-NE",
                "Silla Ergonómica Wynn con Cabecera",
                "Silla ejecutiva de alto rendimiento con soporte lumbar ajustable 3D",
                new BigDecimal("3400.00"),
                new BigDecimal("2950.00"),
                18,
                "65 x 65 x 115-125 cm",
                "150 kg",
                "Negro carbón, Gris ceniza",
                "sillas-ergonomicas",
                List.of("silla", "ergonomica", "wynn", "oficina"),
                List.of("https://images.unsplash.com/photo-1580481077195-c22ae2499175"),
                true
        );

        Product deskProduct = new Product(
                UUID.randomUUID(),
                "tenant-hn-muebles",
                "SKM-412-ES-RO",
                "Escritorio Ejecutivo Industrial L-Shape",
                "Escritorio esquinero de madera tratada con estructura de acero",
                new BigDecimal("4200.00"),
                new BigDecimal("3450.00"),
                10,
                "140 x 120 x 75 cm",
                "120 kg",
                "Roble oscuro y negro mate",
                "escritorios",
                List.of("escritorio", "industrial", "mesa", "oficina"),
                List.of("https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd"),
                true
        );

        Product gamerChair = new Product(
                UUID.randomUUID(),
                "tenant-hn-muebles",
                "SKM-955-CA-NE",
                "Silla Gamer Rom CA Negro/Negro",
                "Silla gamer reclinable 135 grados con soporte de acero",
                new BigDecimal("3600.00"),
                new BigDecimal("3190.00"),
                20,
                "130 x 52 cm",
                "160 kg",
                "Rosa con Blanco y Negra",
                "Sillas y Bancos",
                List.of("silla gamer", "gamer", "rom", "sia gamer", "cia gamer", "asiento gamer", "butaca gamer", "skm-955-ca-ne", "955"),
                List.of("https://images.unsplash.com/photo-1598550476439-6847785fcea6"),
                true
        );

        Product milesChair = new Product(
                UUID.randomUUID(),
                "tenant-hn-muebles",
                "SKM-959-CA-NE",
                "Sillón Ejecutivo Miles Marrón con Apoyapiés",
                "Sillón ejecutivo reclinable con apoyapiés integrado y base cromada",
                new BigDecimal("3800.00"),
                new BigDecimal("3390.00"),
                15,
                "110 x 55 cm",
                "160 kg",
                "Negro y Café",
                "Sillas y Bancos",
                List.of("silla ejecutiva", "sillon", "miles", "sia ejecutiva", "cia ejecutiva", "sillon ejecutivo", "oficina", "skm-959-ca-ne", "959"),
                List.of("https://images.unsplash.com/photo-1505797149-43b0069ec26b"),
                true
        );

        Product sinkProduct = new Product(
                UUID.randomUUID(),
                "tenant-hn-muebles",
                "ZGB-148-NM",
                "Pileta de Cocina Multifuncional Negro Mate Savadir",
                "Pileta de acero nano negro mate con accesorios incluidos",
                new BigDecimal("4600.00"),
                new BigDecimal("3990.00"),
                25,
                "75 x 45 cm",
                "Acero inoxidable 304",
                "Negro mate",
                "Cocina y Baño",
                List.of("pileta", "lavatrastos", "fregadero", "lavaplato", "lavaplatos", "fregador", "tarja", "poceta", "savadir", "zgb-148", "148"),
                List.of("https://images.unsplash.com/photo-1584622650111-993a426fbf0a"),
                true
        );

        sessionStore = new HashMap<>();

        lenient().when(tenantRepo.findById("tenant-hn-muebles")).thenReturn(Optional.of(testTenant));
        lenient().when(productRepo.findActiveByTenant("tenant-hn-muebles")).thenReturn(List.of(wynnChair, deskProduct, gamerChair, milesChair, sinkProduct));

        lenient().when(sessionRepo.findById(anyString())).thenAnswer(inv -> {
            String id = inv.getArgument(0);
            return Optional.ofNullable(sessionStore.get(id));
        });
        lenient().when(sessionRepo.save(any(ChatSession.class))).thenAnswer(inv -> {
            ChatSession s = inv.getArgument(0);
            sessionStore.put(s.getId(), s);
            return s;
        });
        lenient().doAnswer(inv -> {
            String id = inv.getArgument(0);
            sessionStore.remove(id);
            return null;
        }).when(sessionRepo).deleteById(anyString());

        lenient().when(orderRepo.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    @DisplayName("Debe responder a saludo inicial y presentar opciones del catálogo")
    void testGreeting() {
        IncomingMessage msg = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WEB,
                "sess-001",
                "¡Hola! buenas tardes",
                null
        );

        BotReply reply = salesEngine.process(msg);

        assertNotNull(reply);
        assertNotNull(reply.text());
        assertTrue(reply.text().contains("¡Hola!") || reply.text().contains("Bienvenido") || reply.text().contains("Muebles"),
                "Debe saludar cortésmente");
        assertEquals(CheckoutStep.IDLE, reply.step());
    }

    @Test
    @DisplayName("Debe informar precio de producto cuando se consulta por SKU o nombre")
    void testPriceInquiry() {
        IncomingMessage msg = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WEB,
                "sess-002",
                "¿Cuánto cuesta la silla Wynn?",
                null
        );

        BotReply reply = salesEngine.process(msg);

        assertNotNull(reply);
        assertTrue(reply.text().contains("2,950") || reply.text().contains("L."),
                "Debe mencionar el precio de venta en Lempiras");
    }

    @Test
    @DisplayName("Debe responder sobre envíos y política de Cargo Expreso a Honduras")
    void testShippingPolicy() {
        IncomingMessage msg = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WEB,
                "sess-003",
                "¿Hacen envíos a San Pedro Sula y cuánto tardan?",
                null
        );

        BotReply reply = salesEngine.process(msg);

        assertNotNull(reply);
        assertTrue(reply.text().contains("Cargo Expreso"),
                "Debe explicar la logística de Cargo Expreso para Honduras");
    }

    @Test
    @DisplayName("Flujo Completo de Checkout: Debe guiar al comprador, calcular total desde BD y persistir la orden")
    void testFullCheckoutJourney() {
        String customerId = "client-full-001";
        String expectedSessionId = "tenant-hn-muebles:WEB:" + customerId;

        // Paso 1: Inicio de compra
        BotReply r1 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, customerId, "Quiero comprar la silla Wynn", null
        ));
        assertEquals(CheckoutStep.NAME, r1.step());
        assertTrue(r1.text().toLowerCase().contains("nombre"));

        // Paso 2: Proporcionar Nombre
        BotReply r2 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, customerId, "Carlos Mendoza", null
        ));
        assertEquals(CheckoutStep.QUANTITY, r2.step());

        // Paso 3: Proporcionar Cantidad (2 unidades)
        BotReply r3 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, customerId, "Quiero 2 sillas", null
        ));
        assertEquals(CheckoutStep.ADDRESS, r3.step());

        // Paso 4: Proporcionar Dirección
        BotReply r4 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, customerId, "Colonia Palmira, casa 402, Tegucigalpa", null
        ));
        assertEquals(CheckoutStep.PHONE, r4.step());

        // Paso 5: Proporcionar Teléfono -> pasa directo a CONFIRM sin ofrecer factura proactivamente
        BotReply r5 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, customerId, "9988-7766", null
        ));
        assertEquals(CheckoutStep.CONFIRM, r5.step());
        assertFalse(r5.text().toLowerCase().contains("requieres factura"), "No debe ofrecer factura proactivamente");

        // Paso 6: Confirmación Definitiva (Consumidor Final por defecto)
        BotReply r7 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, customerId, "¡Sí, confirmo el pedido!", null
        ));
        assertEquals(CheckoutStep.IDLE, r7.step(), "Al completar el pedido, el bot retorna a IDLE");
        assertNotNull(r7.confirmedOrder());
        assertTrue(r7.confirmedOrder().orderNumber().startsWith("SMAK-ORD-"));
        assertEquals("Carlos Mendoza", r7.confirmedOrder().customerName());
        assertEquals(2, r7.confirmedOrder().quantity());
        assertEquals(new BigDecimal("5900.00"), r7.confirmedOrder().total());
        assertTrue(r7.text().contains("entre 1 y 2 días hábiles, lo más seguro"), "Tegucigalpa usa ventana 1-2 días lo más seguro");
        assertFalse(r7.text().contains("*"), "Sin negritas ni asteriscos");

        verify(orderRepo, times(1)).save(any(Order.class));

        ChatSession savedSession = sessionStore.get(expectedSessionId);
        assertNotNull(savedSession);
        assertEquals(CheckoutStep.IDLE, savedSession.getStep());
        assertNull(savedSession.getCheckout());
        assertFalse(savedSession.getHistory().isEmpty(), "Debe guardar el historial conversacional");
    }

    @Test
    @DisplayName("Coherencia de contexto: si el cliente pide 'mejor no, quiero otro modelo' y pregunta 'ese lo tiene color verde', responde del nuevo modelo y no del anterior")
    void testSwitchModelAndAskColorCoherence() {
        String customerId = "client-coherence-001";

        // 1. El cliente inicia viendo o comprando el Sillón Ejecutivo Miles
        salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, customerId, "Quiero comprar el Sillón Ejecutivo Miles", null
        ));

        // 2. El cliente se arrepiente y dice "mejor no , quiero otro modelo"
        BotReply rSwitch = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, customerId, "mejor no , quiero otro modelo", null
        ));
        assertEquals(CheckoutStep.IDLE, rSwitch.step(), "Debe cancelar el checkout anterior");
        assertNotNull(rSwitch.product(), "Debe proponer el nuevo producto alternativo");
        assertNotEquals("SKM-959-CA-NE", rSwitch.product().sku(), "Debe cambiar el producto activo a otro modelo");
        String newProductName = rSwitch.product().name();

        // 3. El cliente pregunta "ese lo tiene color verde"
        BotReply rColor = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, customerId, "ese lo tiene color verde", null
        ));
        assertEquals(rSwitch.product().sku(), rColor.product().sku(), "Debe responder sobre el nuevo modelo y NO volver al Sillón Miles");
        assertTrue(rColor.text().contains(newProductName), "La respuesta de colores debe ser del modelo actual en conversación");
        assertFalse(rColor.text().contains("Sillón Ejecutivo Miles"), "No debe responder colores del producto descartado");
    }

    @Test
    @DisplayName("Comandos globales: 'reiniciar', 'cancelar' y 'menu' deben reiniciar la conversación en cualquier estado")
    void testGlobalResetCancelAndMenuCommands() {
        String sessionId = "sess-reset-cmd-" + UUID.randomUUID();

        // 1. Escribir 'reiniciar'
        BotReply r1 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "reiniciar",
                null
        ));
        assertEquals(CheckoutStep.IDLE, r1.step());
        assertFalse(r1.human());
        assertTrue(r1.text().contains("Conversación reiniciada") || r1.text().contains("Bienvenido"),
                "Debe dar bienvenida al reiniciar");

        // 2. Escribir 'cancelar' fuera de checkout
        BotReply r2 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "cancelar",
                null
        ));
        assertEquals(CheckoutStep.IDLE, r2.step());
        assertFalse(r2.human());
        assertFalse(r2.text().contains("no logré entender"), "No debe caer en fallback al escribir cancelar");

        // 3. Escribir 'menu'
        BotReply r3 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "menu",
                null
        ));
        assertEquals(CheckoutStep.IDLE, r3.step());
        assertFalse(r3.human());
        assertTrue(r3.text().contains("Bienvenido") || r3.text().contains("modelos"),
                "Debe mostrar el menú de bienvenida al escribir menu");
    }

    @Test
    @DisplayName("Debe resolver SKU promocional/variante mediante keywords (ej. EZRY123 -> SKM-935-NE)")
    void testAliasSkuResolutionThroughKeywords() {
        Product ezriChair = new Product(
                UUID.randomUUID(),
                "tenant-hn-muebles",
                "SKM-935-NE",
                "Silla Ejecutiva Ezri Smak Office",
                "Silla ejecutiva de malla transpirable",
                new BigDecimal("2100.00"),
                new BigDecimal("1790.00"),
                80,
                "47 × 92 cm",
                "120 kg",
                "Negro",
                "Sillas y Bancos",
                List.of("silla", "ezri", "ezry123", "skm-935-ne"),
                List.of("https://static.wixstatic.com/media/f6ccd1_e2137f01d32144a9bb12852795b7166c~mv2.png"),
                true
        );
        when(productRepo.findActiveByTenant("tenant-hn-muebles")).thenReturn(List.of(ezriChair));

        BotReply reply = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                "sess-alias-ezry-" + UUID.randomUUID(),
                "Quiero esta EZRY123",
                null
        ));

        assertNotNull(reply.product());
        assertEquals("SKM-935-NE", reply.product().sku());
        assertEquals(CheckoutStep.NAME, reply.step());
    }

    @Test
    @DisplayName("Coherencia de categoría: si piden otros modelos de silla, JAMÁS debe mostrar una hamaca")
    void testAlternativeChairModelsNeverShowsHammock() {
        Product hammock = new Product(
                UUID.randomUUID(),
                "tenant-hn-muebles",
                "ZGB-210-NE",
                "Hamaca de Jardín con Toldo Smak | Soporta hasta 260 kg",
                "Hamaca exterior",
                new BigDecimal("4200.00"),
                new BigDecimal("3650.00"),
                15,
                "170 × 110 × 153 cm",
                "260 kg",
                "Negro",
                "Jardín y Exterior",
                List.of("hamaca", "jardin", "toldo"),
                List.of("https://static.wixstatic.com/media/f6ccd1_342210b9a8cc491dbf83f06c20a5de8d~mv2.webp"),
                true
        );
        Product ezriChair = new Product(
                UUID.randomUUID(),
                "tenant-hn-muebles",
                "SKM-935-NE",
                "Silla Ejecutiva Ezri Smak Office",
                "Silla ejecutiva de malla",
                new BigDecimal("2100.00"),
                new BigDecimal("1790.00"),
                1,
                "47 × 92 cm",
                "120 kg",
                "Negro",
                "Sillas y Bancos",
                List.of("silla", "ezri", "ezry123"),
                List.of("https://static.wixstatic.com/media/f6ccd1_e2137f01d32144a9bb12852795b7166c~mv2.png"),
                true
        );
        // Hammock colocada primero en el catálogo a propósito para reproducir el bug
        when(productRepo.findActiveByTenant("tenant-hn-muebles"))
                .thenReturn(List.of(hammock, ezriChair, wynnChair));

        String cid = "client-sillas-" + UUID.randomUUID();
        salesEngine.process(new IncomingMessage("tenant-hn-muebles", Channel.WHATSAPP, cid, "Quiero 2 sillas Ezri EZRY123", null));

        BotReply reply = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "que otros modelos de silla tienes", null
        ));

        assertFalse(reply.text().toLowerCase().contains("hamaca"),
                "Jamás debe mostrar una hamaca cuando piden otros modelos de silla: " + reply.text());
        assertTrue(reply.text().contains("Wynn") || reply.text().toLowerCase().contains("silla"),
                "Debe ofrecer modelos reales de sillas");
    }

    @Test
    @DisplayName("Validación estricta Honduras: rechaza nombre sin apellido, dirección vaga, teléfono inválido y RTN no numérico")
    void testStrictHondurasValidationAndPhoneNeverSkipped() {
        String cid = "client-hn-val-" + UUID.randomUUID();

        // 1. Iniciar compra
        BotReply r1 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "Quiero comprar la silla Wynn", null
        ));
        assertEquals(CheckoutStep.NAME, r1.step());

        // 2. Nombre sin apellido ("Enrique") -> debe rechazar y permanecer en NAME
        BotReply rNameBad = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "Enrique", null
        ));
        assertEquals(CheckoutStep.NAME, rNameBad.step(), "Debe exigir nombre y al menos un apellido");

        // 3. Nombre completo válido
        BotReply rNameOk = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "Carlos Mendoza", null
        ));
        assertEquals(CheckoutStep.QUANTITY, rNameOk.step());

        // 4. Cantidad válida
        BotReply rQtyOk = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "1", null
        ));
        assertEquals(CheckoutStep.ADDRESS, rQtyOk.step());

        // 5. Dirección vaga ("Tegucigalpa") -> debe rechazar y permanecer en ADDRESS
        BotReply rAddrBad = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "Tegucigalpa", null
        ));
        assertEquals(CheckoutStep.ADDRESS, rAddrBad.step(), "Debe rechazar dirección incompleta sin colonia ni referencia");

        // 6. Dirección Honduras completa
        BotReply rAddrOk = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "Col. Miramontes, calle principal casa 15, Tegucigalpa", null
        ));
        assertEquals(CheckoutStep.PHONE, rAddrOk.step());

        // 7. Teléfono inválido (12 dígitos) -> debe quedarse en PHONE y NO saltar a factura
        BotReply rPhoneBad = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "678678887787", null
        ));
        assertEquals(CheckoutStep.PHONE, rPhoneBad.step(), "Debe rechazar teléfono inválido en Honduras");

        // 8. Teléfono válido de 8 dígitos Honduras -> va directo a CONFIRM (no pregunta factura proactivamente)
        BotReply rPhoneOk = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "9988-7766", null
        ));
        assertEquals(CheckoutStep.CONFIRM, rPhoneOk.step());

        // 9. Cliente solicita factura por iniciativa propia -> debe pedir RTN de 14 dígitos
        BotReply rInvYes = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "Sí quiero factura", null
        ));
        assertEquals(CheckoutStep.INVOICE_RTN, rInvYes.step());

        // 10. RTN con letras basura ("987hksjfh98hj") -> debe rechazar
        BotReply rRtnBad = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "987hksjfh98hj", null
        ));
        assertEquals(CheckoutStep.INVOICE_RTN, rRtnBad.step(), "Debe exigir RTN numérico de 14 dígitos");

        // 11. RTN válido de 14 dígitos
        BotReply rRtnOk = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "0801-1990-123456", null
        ));
        assertEquals(CheckoutStep.INVOICE_BUSINESS_NAME, rRtnOk.step());

        // 12. Razón social válida -> CONFIRM
        BotReply rBizOk = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "Electroventas Honduras S.A.", null
        ));
        assertEquals(CheckoutStep.CONFIRM, rBizOk.step());

        // 13. Confirmar -> persiste orden completa con teléfono, RTN y auditoría
        BotReply rConf = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "Confirmar", null
        ));
        assertEquals(CheckoutStep.IDLE, rConf.step());
        assertNotNull(rConf.confirmedOrder());
        assertEquals("9988-7766", rConf.confirmedOrder().customerPhone());
        assertEquals("08011990123456", rConf.confirmedOrder().rtn());
        assertFalse(rConf.confirmedOrder().auditHistory().isEmpty());
    }

    @Test
    @DisplayName("Guardrail backend: bloquea al LLM si intenta saltar el teléfono o confirmar pedido incompleto")
    void testGuardrailBlocksLlmFromSkippingPhoneStep() {
        AiSalesAssistantPort rogueAi = (tenant, catalog, rules, campaigns, orders, session, msg) -> {
            // Simula un LLM intentando confirmar o saltar a factura sin tener teléfono
            return new AiSalesAssistantPort.AssistantDecision(
                    "¿Requieres factura con RTN?",
                    CheckoutStep.REQUIRES_INVOICE,
                    "SKM-956-CA-NE",
                    false, false, true,
                    new AiSalesAssistantPort.DraftUpdate("SKM-956-CA-NE", 2, "Carlos Mendoza",
                            "Col. Palmira, calle 4 casa 12, Tegucigalpa", false, null, false, null, null)
            );
        };
        SalesEngineService strictEngine = new SalesEngineService(tenantRepo, productRepo, orderRepo, sessionRepo, rogueAi);

        String cid = "client-guard-" + UUID.randomUUID();
        ChatSession s = new ChatSession(
                ChatSession.buildId("tenant-hn-muebles", Channel.WHATSAPP, cid),
                "tenant-hn-muebles", Channel.WHATSAPP
        );
        CheckoutDraft d = CheckoutDraft.start(wynnChair, 2, "SMAK-ORD-9999", true);
        d.name = "Carlos Mendoza";
        d.address = "Col. Palmira, calle 4 casa 12, Tegucigalpa";
        s.setCheckout(d);
        s.setStep(CheckoutStep.ADDRESS);
        sessionStore.put(s.getId(), s);

        BotReply reply = strictEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "Col. Palmira, calle 4 casa 12, Tegucigalpa", null
        ));

        assertEquals(CheckoutStep.PHONE, reply.step(), "El guardrail debe frenar el salto a factura/confirmación y exigir PHONE");
        assertNull(reply.confirmedOrder(), "No debe crear ninguna orden sin teléfono válido");
        verify(orderRepo, never()).save(any());
    }

    @Test
    @DisplayName("Cancelación de pedido por cliente: solicita motivo, guarda CANCELADO con motivo en BD y repone stock")
    void testCustomerOrderCancellationSavesReasonAndRestoresStock() {
        Order existingOrder = new Order(
                UUID.randomUUID(), "tenant-hn-muebles", "SMAK-ORD-1005",
                "Carlos Mendoza", "9988-7766", "Col. Palmira, Tegucigalpa",
                null, null, null,
                "SKM-956-CA-NE", wynnChair.name(), 2,
                wynnChair.salePrice(), wynnChair.salePrice().multiply(new BigDecimal("2")),
                OrderStatus.PENDIENTE, false, "Consumidor Final (Sin RTN)", null,
                null, "Cargo Expreso", java.time.OffsetDateTime.now(),
                "WHATSAPP", "50499887766", "Meta WhatsApp Cloud API",
                null, null, null, List.of()
        );
        when(orderRepo.findByNumberOrTracking("tenant-hn-muebles", "SMAK-ORD-1005"))
                .thenReturn(Optional.of(existingOrder));
        when(productRepo.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        String cid = "client-cancel-" + UUID.randomUUID();
        BotReply r1 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "Quiero cancelar mi pedido SMAK-ORD-1005", null
        ));
        assertEquals(CheckoutStep.CANCEL_REASON, r1.step(), "Debe pedir el motivo de cancelación");

        BotReply r2 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "Me equivoqué de modelo de silla", null
        ));
        assertEquals(CheckoutStep.IDLE, r2.step());
        assertNotNull(r2.confirmedOrder());
        assertEquals(OrderStatus.CANCELADO, r2.confirmedOrder().status());
        assertEquals("Me equivoqué de modelo de silla", r2.confirmedOrder().cancellationReason());
        assertFalse(r2.confirmedOrder().auditHistory().isEmpty());

        verify(productRepo, times(1)).save(argThat(p -> "SKM-956-CA-NE".equals(p.sku()) && p.stock() == 20));
    }

    @Test
    @DisplayName("Imágenes: no mostrar aviso automático de 'Tenemos X fotos más'; enviar galería solo si el cliente pide más fotos")
    void testNoUnsolicitedMorePhotosHintSent() {
        Product multiImgChair = new Product(
                UUID.randomUUID(),
                "tenant-hn-muebles",
                "SKM-935-NE",
                "Silla Ejecutiva Ezri Smak Office",
                "Silla ergonómica ejecutiva en color negro",
                new BigDecimal("2200.00"),
                new BigDecimal("1790.00"),
                10,
                "100 x 55 cm",
                "130 kg",
                "Negro",
                "Sillas y Bancos",
                List.of("silla", "ezry", "ezri", "skm-935-ne"),
                List.of(
                        "https://img.example.com/ezri-1.jpg",
                        "https://img.example.com/ezri-2.jpg",
                        "https://img.example.com/ezri-3.jpg"
                ),
                true
        );
        when(productRepo.findActiveByTenant("tenant-hn-muebles")).thenReturn(List.of(multiImgChair));

        String cid = "client-photos-" + UUID.randomUUID();
        BotReply r1 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "Precio de la silla Ezri", null
        ));

        assertEquals(1, r1.images().size(), "Debe enviar la foto principal del producto");
        assertFalse(r1.text().toLowerCase().contains("fotos más"), "No debe mostrar aviso automático de fotos extra");
        assertFalse(r1.text().toLowerCase().contains("solo dime"), "No debe pedir que escriba 'más fotos'");

        BotReply r2 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cid, "más fotos", null
        ));
        assertEquals(3, r2.images().size(), "Solo cuando el cliente pide explícitamente más fotos debe enviar la galería");
    }

    @Test
    @DisplayName("Tono limpio y precios fijos: sin emojis, sin negritas, sin 'Fíjate que', sin SKU ni rebajas")
    void testPlainToneNoEmojisBoldSkuOrPriceDrop() {
        Product ezriChair = new Product(
                UUID.randomUUID(), "tenant-hn-muebles", "SKM-935-NE",
                "Silla Ejecutiva Ezri Smak Office", "Silla ergonómica negra",
                new BigDecimal("2100.00"), new BigDecimal("1790.00"), 80,
                "47 × 92 cm", "120 kg", "Negro", "Sillas y Bancos",
                List.of("silla", "ezri", "skm-935-ne"),
                List.of("https://img.example.com/ezri-1.jpg"), true
        );
        when(productRepo.findActiveByTenant("tenant-hn-muebles")).thenReturn(List.of(ezriChair));

        String cid = "client-clean-" + UUID.randomUUID();
        BotReply r1 = salesEngine.process(new IncomingMessage("tenant-hn-muebles", Channel.WHATSAPP, cid, "¿Cuánto cuesta la silla Ezri?", null));
        BotReply rDiscount = salesEngine.process(new IncomingMessage("tenant-hn-muebles", Channel.WHATSAPP, cid, "¿Me hacen descuento o mejor precio?", null));

        for (BotReply r : List.of(r1, rDiscount)) {
            assertFalse(r.text().contains("*"), "No debe contener asteriscos ni negritas: " + r.text());
            assertFalse(r.text().toLowerCase().contains("fíjate"), "No debe contener 'Fíjate que': " + r.text());
            assertFalse(r.text().toLowerCase().contains("fijate"), "No debe contener 'Fijate que': " + r.text());
            assertFalse(r.text().contains("SKM-935-NE"), "No debe mostrar código SKU al cliente: " + r.text());
            assertFalse(r.text().contains("2,100") || r.text().contains("2100"), "Solo mostrar precio actual: " + r.text());
            assertFalse(r.text().codePoints().anyMatch(cp -> cp >= 0x1F300 || (cp >= 0x2600 && cp <= 0x27BF)),
                    "No debe contener emojis: " + r.text());
        }
        assertTrue(rDiscount.text().toLowerCase().contains("fijo") || rDiscount.text().toLowerCase().contains("descuento"),
                "Debe aclarar que los precios son fijos sin rebajas: " + rDiscount.text());

        String rawWithMorePhotos = "Aquí tienes la información.\n\n📷 *(Tenemos 2 fotos más con más detalles de este modelo. Si deseas verlas, solo dime *más fotos)*";
        String cleaned = HondurasDeliveryPolicy.sanitizeCustomerReply(rawWithMorePhotos);
        assertFalse(cleaned.contains("fotos más"), "Debe erradicar aviso de fotos más: " + cleaned);
        assertFalse(cleaned.contains("solo dime"), "Debe erradicar aviso de solo dime: " + cleaned);
        assertFalse(cleaned.contains("Tenemos"), "Debe erradicar Tenemos: " + cleaned);
    }

    @Test
    @DisplayName("Logística HN: 2-3 días por defecto, 1-2 en las 6 ciudades, fechas aproximadas y protocolo de sábados")
    void testDeliveryWindowsByCitySpecificDateAndSaturday() {
        String cidGeneral = "client-city-comayagua";
        BotReply rComayagua = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, cidGeneral, "¿Cuánto tarda el envío a Comayagua?", null
        ));
        assertTrue(rComayagua.text().contains("entre 2 y 3 días hábiles, lo más seguro"), rComayagua.text());
        assertFalse(rComayagua.text().contains("1 y 2 días"), rComayagua.text());

        for (String city : List.of("El Progreso Yoro", "San Pedro Sula", "Santa Rosa de Copán", "Tegucigalpa", "La Ceiba", "Choloma")) {
            BotReply rCity = salesEngine.process(new IncomingMessage(
                    "tenant-hn-muebles", Channel.WEB, "client-fast-" + city, "¿Cuánto tarda el envío a " + city + "?", null
            ));
            assertTrue(rCity.text().contains("entre 1 y 2 días hábiles, lo más seguro"),
                    "Ciudad rápida " + city + " falló: " + rCity.text());
        }

        BotReply rDate = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, "client-date-001", "Lo necesito para el viernes exactamente", null
        ));
        assertTrue(rDate.text().contains("100%") && rDate.text().toLowerCase().contains("aproximadas"),
                "Debe aclarar que no se compromete 100% a una fecha exacta: " + rDate.text());

        BotReply rSab = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, "client-sab-001", "¿Me lo pueden entregar el sábado?", null
        ));
        String low = rSab.text().toLowerCase();
        assertTrue(low.contains("agencia") && low.contains("no en todos los lugares"), "Debe sugerir agencia y aclarar cobertura limitada: " + rSab.text());
        assertTrue(low.contains("pareja") || low.contains("alguien"), "Debe preguntar si vive con alguien que reciba y pague: " + rSab.text());
    }

    @Test
    @DisplayName("Umbral por cantidad: >2 unidades general pasa a humano; línea Set/Individual Tolix pasa desde 5 unidades y sin rebaja")
    void testQuantityHumanHandoverGeneralVsSetTolix() {
        Product tolixSingle = new Product(
                UUID.randomUUID(), "tenant-hn-muebles", "SKM-941-NE",
                "Silla Metálica Estilo Tolix Smak - Negro Mate", "Silla Tolix",
                new BigDecimal("1100.00"), new BigDecimal("890.00"), 60,
                "45 x 85 cm", "150 kg", "Negro Mate", "Sillas y Bancos",
                List.of("silla tolix", "tolix", "skm-941-ne"),
                List.of("https://img.example.com/tolix.jpg"), true
        );
        Product tolixSet = new Product(
                UUID.randomUUID(), "tenant-hn-muebles", "SKM-941-NE-4",
                "Set de 4 Sillas Metálicas Estilo Tolix Smak - Negro Mate", "Set 4 sillas Tolix",
                new BigDecimal("3900.00"), new BigDecimal("3490.00"), 25,
                "45 x 85 cm", "150 kg", "Negro Mate", "Sillas y Bancos",
                List.of("set 4 sillas tolix", "set tolix", "skm-941-ne-4"),
                List.of("https://img.example.com/tolix-set.jpg"), true
        );
        when(productRepo.findActiveByTenant("tenant-hn-muebles"))
                .thenReturn(List.of(wynnChair, tolixSingle, tolixSet));

        // 1. Producto general (Silla Wynn, stock 18): pedir 3 unidades traslada a asesor humano
        BotReply rGeneral3 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, "client-qty-gen3", "Quiero comprar 3 sillas Wynn", null
        ));
        assertEquals(CheckoutStep.HUMAN, rGeneral3.step());
        assertTrue(rGeneral3.human());

        // 2. Línea Set/Individual Tolix (SKM-941-NE con par -4): pedir 4 unidades NO traslada a humano ni baja precio
        String cidTolix4 = "client-qty-tolix4";
        BotReply rTolix4 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, cidTolix4, "Quiero 4 sillas tolix SKM-941-NE", null
        ));
        assertEquals(CheckoutStep.NAME, rTolix4.step());
        assertFalse(rTolix4.human());
        assertNotNull(rTolix4.orderDraft());
        assertEquals(new BigDecimal("3560.00"), rTolix4.orderDraft().total, "No debe aplicar 5% descuento: 4 x 890 = 3560");

        // 3. Línea Set/Individual Tolix: pedir 5 unidades sí traslada a asesor humano
        BotReply rTolix5 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WHATSAPP, "client-qty-tolix5", "Quiero 5 sillas tolix SKM-941-NE", null
        ));
        assertEquals(CheckoutStep.HUMAN, rTolix5.step());
        assertTrue(rTolix5.human());
    }
}
