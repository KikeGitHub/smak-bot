package com.smakbot.core.application.service;

import com.smakbot.core.domain.model.*;
import com.smakbot.core.domain.ports.out.*;
import com.smakbot.core.application.engine.MessageText;
import com.smakbot.core.application.engine.IntentDetector;
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

    private Tenant testTenant;
    private Product wynnChair;
    private Map<String, ChatSession> sessionStore;

    @BeforeEach
    void setUp() {
        salesEngine = new SalesEngineService(tenantRepo, productRepo, orderRepo, sessionRepo);

        testTenant = new Tenant(
                "tenant-hn-muebles",
                "Muebles Elegancia HN",
                "HN",
                "L.",
                "+504 9999-0000",
                true
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
                "Negra",
                "Sillas y Bancos",
                List.of("silla gamer", "gamer", "rom", "sia gamer", "cia gamer", "asiento gamer", "butaca gamer", "skm-955-ca-ne", "955"),
                List.of("https://images.unsplash.com/photo-1598550476439-6847785fcea6"),
                true
        );

        Product milesChair = new Product(
                UUID.randomUUID(),
                "tenant-hn-muebles",
                "SKM-959-CA-NE",
                "Sillón Ejecutivo Miles Negro con Apoyapiés",
                "Sillón ejecutivo reclinable con apoyapiés integrado y base cromada",
                new BigDecimal("3800.00"),
                new BigDecimal("3390.00"),
                15,
                "110 x 55 cm",
                "160 kg",
                "Negro",
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

        // Mock stateful session repository in memory
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
    @DisplayName("Debe informar precio y descuento de producto cuando se consulta por SKU o nombre")
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
        assertTrue(reply.text().contains("Cargo Expreso") || reply.text().contains("CAEX") || reply.text().contains("San Pedro Sula"),
                "Debe explicar la logística de CAEX para Honduras");
    }

    @Test
    @DisplayName("Flujo Completo de Checkout: Debe guiar al comprador por los 7 pasos y persistir la orden")
    void testFull7StepCheckoutJourney() {
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
        assertTrue(r2.text().toLowerCase().contains("cuántas") || r2.text().toLowerCase().contains("cantidad"));

        // Paso 3: Proporcionar Cantidad (2 unidades)
        BotReply r3 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, customerId, "Quiero 2 sillas", null
        ));
        assertEquals(CheckoutStep.ADDRESS, r3.step());
        assertTrue(r3.text().contains("5,900") || r3.text().toLowerCase().contains("dirección"));

        // Paso 4: Proporcionar Dirección
        BotReply r4 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, customerId, "Colonia Palmira, casa 402, Tegucigalpa", null
        ));
        assertEquals(CheckoutStep.PHONE, r4.step());
        assertTrue(r4.text().toLowerCase().contains("telefón") || r4.text().toLowerCase().contains("llamadas") || r4.text().toLowerCase().contains("número"));

        // Paso 5: Proporcionar Teléfono
        BotReply r5 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, customerId, "9988-7766", null
        ));
        assertEquals(CheckoutStep.REQUIRES_INVOICE, r5.step());
        assertTrue(r5.text().toLowerCase().contains("factura") || r5.text().contains("RTN"));

        // Paso 6: Consumidor final sin RTN
        BotReply r6 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, customerId, "Consumidor final, no necesito RTN", null
        ));
        assertEquals(CheckoutStep.CONFIRM, r6.step());
        assertTrue(r6.text().contains("5,900"));
        assertTrue(r6.text().toLowerCase().contains("confirmo") || r6.text().toLowerCase().contains("resumen"));

        // Paso 7: Confirmación Definitiva
        BotReply r7 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, customerId, "¡Sí, confirmo el pedido!", null
        ));
        assertEquals(CheckoutStep.IDLE, r7.step(), "Al completar el pedido, el bot retorna a IDLE");
        assertNotNull(r7.confirmedOrder());
        assertTrue(r7.confirmedOrder().orderNumber().startsWith("SMAK-ORD-"));
        assertEquals("Carlos Mendoza", r7.confirmedOrder().customerName());
        assertEquals(2, r7.confirmedOrder().quantity());
        assertEquals(new BigDecimal("5900.00"), r7.confirmedOrder().total());
        assertNull(r7.confirmedOrder().trackingNumber(), "El número de guía se asigna en despacho administrativo");
        assertEquals("Cargo Expreso", r7.confirmedOrder().trackingCarrier());

        // Verificar que la orden fue persistida en base de datos
        verify(orderRepo, times(1)).save(any(Order.class));

        // Verificar que la sesión conversacional se reinició a IDLE y sin borrador pendiente
        ChatSession savedSession = sessionStore.get(expectedSessionId);
        assertNotNull(savedSession);
        assertEquals(CheckoutStep.IDLE, savedSession.getStep());
        assertNull(savedSession.getCheckout());
    }

    @Test
    @DisplayName("Regla de Oro de Blindaje (Backtracking): Debe responder dudas técnicas y preservar datos de orden")
    void testBacktrackingRuleDuringCheckout() {
        String client = "client-backtrack-001";

        // 1. Iniciar compra
        salesEngine.process(new IncomingMessage("tenant-hn-muebles", Channel.WEB, client, "Quiero la silla Wynn", null));

        // 2. Dar nombre
        salesEngine.process(new IncomingMessage("tenant-hn-muebles", Channel.WEB, client, "Kike Martinez", null));

        // 3. Dar cantidad
        BotReply rQty = salesEngine.process(new IncomingMessage("tenant-hn-muebles", Channel.WEB, client, "1", null));
        assertEquals(CheckoutStep.ADDRESS, rQty.step());

        // 4. Interrupción en ADDRESS: Pregunta técnica de medidas y resistencia
        BotReply rDoubt = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, client, "¿Cuánto peso aguanta y cuánto mide armada?", null
        ));
        assertEquals(CheckoutStep.ADDRESS, rDoubt.step(), "El paso debe permanecer en ADDRESS");
        assertTrue(rDoubt.text().contains("150 kg") || rDoubt.text().contains("Soporte") || rDoubt.text().contains("Peso"));
        assertTrue(rDoubt.text().contains("Kike Martinez"), "Debe preservar el nombre ya capturado");
        assertTrue(rDoubt.text().toLowerCase().contains("dirección"), "Debe reanudar pidiendo la dirección de entrega");

        // 5. El usuario responde con su dirección
        BotReply rAddr = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, client, "Colonia Miramontes, calle 3, Tegucigalpa", null
        ));
        assertEquals(CheckoutStep.PHONE, rAddr.step(), "Debe avanzar a PHONE tras recibir la dirección");

        // 6. Interrupción en PHONE: Pregunta por envíos a Roatán (política)
        BotReply rPolicy = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, client, "¿Hacen envíos a Roatán o Islas de la Bahía?", null
        ));
        assertEquals(CheckoutStep.PHONE, rPolicy.step(), "El paso debe permanecer en PHONE");
        assertTrue(rPolicy.text().contains("Roatán") || rPolicy.text().contains("cabotaje") || rPolicy.text().contains("ferry"));
        assertTrue(rPolicy.text().contains("Miramontes"), "Debe preservar la dirección ya capturada");
        assertTrue(rPolicy.text().toLowerCase().contains("teléfon") || rPolicy.text().toLowerCase().contains("llamadas"),
                "Debe reanudar pidiendo el número telefónico");

        // 7. El usuario proporciona su teléfono
        BotReply rPhone = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, client, "9876-5432", null
        ));
        assertEquals(CheckoutStep.REQUIRES_INVOICE, rPhone.step());
    }

    @Test
    @DisplayName("Escenario 3A: Cambio de producto a mitad de orden")
    void testProductSwitchMidwayDuringCheckout() {
        String client = "client-switch-001";

        // Iniciar con la silla Wynn
        salesEngine.process(new IncomingMessage("tenant-hn-muebles", Channel.WEB, client, "Comprar silla Wynn", null));
        salesEngine.process(new IncomingMessage("tenant-hn-muebles", Channel.WEB, client, "Ana Lopez", null));

        // En paso QUANTITY, menciona el escritorio
        BotReply rMention = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, client, "¿Y el escritorio ejecutivo cuánto cuesta?", null
        ));
        assertEquals(CheckoutStep.QUANTITY, rMention.step());
        assertTrue(rMention.text().contains("3,450"));
        assertTrue(rMention.text().contains("cambiar") && rMention.text().contains("ambos"),
                "Debe preguntar si desea cambiar al nuevo producto o agregar ambos");

        // El usuario confirma que desea cambiar al nuevo producto
        BotReply rConfirmSwitch = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, client, "Deseo cambiar al nuevo", null
        ));
        assertEquals(CheckoutStep.QUANTITY, rConfirmSwitch.step());
        assertTrue(rConfirmSwitch.text().contains("Escritorio Ejecutivo Industrial L-Shape") || rConfirmSwitch.text().contains("actualizado"));
        assertTrue(rConfirmSwitch.text().contains("Ana Lopez"), "Debe preservar el nombre capturado");
    }

    @Test
    @DisplayName("Escenario 3C: Tolerancia a errores de ortografía y fonética")
    void testTypoTolerance() {
        IncomingMessage msg = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WEB,
                "sess-typo",
                "cual es el presio con envio gartis y cuamto resistensia aguanta",
                null
        );

        BotReply reply = salesEngine.process(msg);
        assertNotNull(reply);
        assertTrue(reply.text().contains("2,950") || reply.text().contains("150 kg") || reply.text().contains("GRATIS"),
                "Debe resolver la intención a pesar de los errores de ortografía ('presio', 'gartis', 'cuamto', 'resistensia')");
    }

    @Test
    @DisplayName("Hondureñismos: 'Tiene Sia Gamer?' debe identificar Silla Gamer Rom (SKM-955)")
    void testHonduranPhoneticSiaGamer() {
        IncomingMessage msg = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                "sess-hn-01",
                "Tiene Sia Gamer?",
                null
        );

        BotReply reply = salesEngine.process(msg);
        assertNotNull(reply);
        assertFalse(reply.human(), "No debe transferir a humano");
        assertNotNull(reply.product(), "Debe identificar el producto Gamer");
        assertEquals("SKM-955-CA-NE", reply.product().sku());
        assertTrue(reply.text().contains("Silla Gamer") || reply.text().contains("3,190"));
    }

    @Test
    @DisplayName("Hondureñismos: 'Q Prezio la cia' debe brindar la asesoría de precios de la línea de sillas")
    void testHonduranPhoneticQPrezioLaCia() {
        IncomingMessage msg = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                "sess-hn-02",
                "Q Prezio la cia",
                null
        );

        BotReply reply = salesEngine.process(msg);
        assertNotNull(reply);
        assertFalse(reply.human(), "No debe transferir a humano");
        assertTrue(reply.text().contains("Sillas") || reply.text().contains("Línea de Sillas"),
                "Debe asesorar sobre la línea de sillas");
        assertTrue(reply.text().contains("L.") || reply.text().contains("3,190") || reply.text().contains("2,950"),
                "Debe contener precios");
    }

    @Test
    @DisplayName("Hondureñismos: 'Sia Ejecutiva' debe identificar Sillón Ejecutivo Miles (SKM-959)")
    void testHonduranPhoneticSiaEjecutiva() {
        IncomingMessage msg = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                "sess-hn-03",
                "Sia Ejecutiva",
                null
        );

        BotReply reply = salesEngine.process(msg);
        assertNotNull(reply);
        assertFalse(reply.human(), "No debe transferir a humano");
        assertNotNull(reply.product(), "Debe identificar el producto Ejecutivo");
        assertEquals("SKM-959-CA-NE", reply.product().sku());
        assertTrue(reply.text().contains("Miles") || reply.text().contains("3,390"));
    }

    @Test
    @DisplayName("Hondureñismos: 'A ke precio el lavaplato' debe identificar Pileta Savadir (ZGB-148-NM)")
    void testHonduranPhoneticAKePrecioElLavaplato() {
        IncomingMessage msg = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                "sess-hn-04",
                "A ke precio el lavaplato",
                null
        );

        BotReply reply = salesEngine.process(msg);
        assertNotNull(reply);
        assertFalse(reply.human(), "No debe transferir a humano");
        assertNotNull(reply.product(), "Debe identificar la Pileta de cocina/lavatrastos");
        assertEquals("ZGB-148-NM", reply.product().sku());
        assertTrue(reply.text().contains("3,990") || reply.text().contains("Savadir") || reply.text().contains("Pileta"));
    }

    @Test
    @DisplayName("Autoservicio: Opción '1' debe desplegar la línea de sillas de inmediato")
    void testNumericOptionSelection() {
        IncomingMessage msg = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                "sess-hn-05",
                "1",
                null
        );

        BotReply reply = salesEngine.process(msg);
        assertNotNull(reply);
        assertFalse(reply.human());
        assertTrue(reply.text().contains("Sillas y Sillones"), "Debe mostrar la línea de sillas");
    }

    @Test
    @DisplayName("Fase 1 Memoria: Al preguntar 'Tienes sillas gamer?' y luego 'Tienes más?', debe ofrecer modelos distintos sin perder el contexto")
    void testConversationalMemoryMoreModelsContinuity() {
        String sessionId = "sess-mem-01";

        // Turno 1: Cliente pregunta por sillas gamer
        IncomingMessage msg1 = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "Tiene Sia Gamer?",
                null
        );
        BotReply r1 = salesEngine.process(msg1);
        assertNotNull(r1);
        assertNotNull(r1.product());
        assertEquals("SKM-955-CA-NE", r1.product().sku(), "Turno 1 debe identificar la Silla Gamer");

        // Turno 2: Cliente pregunta elípticamente 'Tienes más?' (sin repetir la palabra silla ni gamer)
        IncomingMessage msg2 = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "Tienes mas?",
                null
        );
        BotReply r2 = salesEngine.process(msg2);
        assertNotNull(r2);
        assertFalse(r2.human(), "No debe transferir a humano ni quedar en punto ciego");
        assertNotNull(r2.product(), "Debe identificar un nuevo modelo de la misma línea");
        assertNotEquals("SKM-955-CA-NE", r2.product().sku(), "No debe repetir el producto ya ofrecido en el Turno 1");
        assertTrue(r2.text().contains("Miles") || r2.text().contains("Wynn"), "Debe ofrecer una alternativa de silla");

        // Turno 3: Cliente pide 'otro modelo'
        IncomingMessage msg3 = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "Tienes otro modelo?",
                null
        );
        BotReply r3 = salesEngine.process(msg3);
        assertNotNull(r3);
        assertNotNull(r3.product());
        assertNotEquals(r1.product().sku(), r3.product().sku(), "No debe repetir el producto del Turno 1");
        assertNotEquals(r2.product().sku(), r3.product().sku(), "No debe repetir el producto del Turno 2");

        // Turno 4: Pregunta por precio en contexto ('¿Y cuánto cuesta?')
        IncomingMessage msg4 = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "¿Y cuánto cuesta?",
                null
        );
        BotReply r4 = salesEngine.process(msg4);
        assertNotNull(r4);
    }

    @Test
    @DisplayName("Debe interpretar 'kiero 2' con producto en contexto, iniciar checkout con cantidad 2 y no saludar ni enviar links de whatsapp")
    void testDirectPurchaseQuantityWithSlang() {
        String sessionId = "whatsapp-slang-purchase-" + UUID.randomUUID();

        // 1. Mostrar producto en contexto (Silla Gamer)
        IncomingMessage msg1 = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "Tiene Sia Gamer?",
                null
        );
        BotReply r1 = salesEngine.process(msg1);
        assertNotNull(r1);
        assertNotNull(r1.product());

        // 2. Cliente responde con modismo 'kiero 2'
        IncomingMessage msg2 = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "kiero 2",
                null
        );
        BotReply r2 = salesEngine.process(msg2);
        assertNotNull(r2);
        assertFalse(r2.text().startsWith("¡Hola! Con mucho gusto te ayudo"), "No debe reiniciar con saludo genérico");
        assertFalse(r2.text().contains("wa.me"), "No debe incluir enlaces wa.me dentro de WhatsApp");
        assertTrue(r2.text().contains("2"), "Debe confirmar la cantidad de 2 unidades");
        assertTrue(r2.text().toLowerCase().contains("nombre"), "Debe pedir el nombre para el pedido");

        // 3. Proporciona nombre -> Debe saltar directamente a dirección sin volver a preguntar cantidad
        IncomingMessage msg3 = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "Carlos Perez",
                null
        );
        BotReply r3 = salesEngine.process(msg3);
        assertNotNull(r3);
        assertTrue(r3.text().toLowerCase().contains("dirección") || r3.text().toLowerCase().contains("ciudad"),
                "Al tener ya la cantidad 2, debe avanzar directo a pedir dirección");
    }

    @Test
    @DisplayName("Fallback de 2 intentos: intento 1 es aclaración amable y el intento 2 consecutivo transfiere a ejecutivo")
    void testTwoTierFriendlyFallbackAndHumanHandover() {
        String sessionId = "whatsapp-fallback-" + UUID.randomUUID();

        // Intento 1 con mensaje ininteligible
        IncomingMessage msg1 = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "zzzzz no se que es esto 999",
                null
        );
        BotReply r1 = salesEngine.process(msg1);
        assertNotNull(r1);
        assertFalse(r1.human(), "El primer fallo no debe transferir a humano todavía");
        assertTrue(r1.text().contains("no logré entender bien tu mensajito"), "Debe pedir aclaración amable en el intento 1");
        assertFalse(r1.text().contains("wa.me"), "No debe tener enlaces wa.me");

        // Intento 2 consecutivo ininteligible -> Debe transferir a humano
        IncomingMessage msg2 = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "otra cosa rara que nadie entiende",
                null
        );
        BotReply r2 = salesEngine.process(msg2);
        assertNotNull(r2);
        assertTrue(r2.human(), "El segundo fallo consecutivo debe transferir a asesor humano");
        assertTrue(r2.text().contains("ejecutivo") || r2.text().contains("asesor"), "Debe indicar transferencia a ejecutivo o asesor");
        assertFalse(r2.text().contains("wa.me"), "No debe tener enlaces wa.me");
    }

    @Test
    @DisplayName("Informativo: 'hola quiero saber que productos tienes' debe mostrar catálogo y NO iniciar orden ni checkout")
    void testCatalogInquiryNotPurchase() {
        MessageText m = MessageText.of("hola quiero saber que productos tienes");
        assertFalse(IntentDetector.isPurchase(m), "No debe ser interpretado como compra");
        assertTrue(IntentDetector.isCatalogQuery(m), "Debe ser consulta de catálogo");

        IncomingMessage msg1 = new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                "sess-info-01",
                "hola quiero saber que productos tienes",
                null
        );
        BotReply r = salesEngine.process(msg1);
        assertEquals(CheckoutStep.IDLE, r.step());
        assertNull(r.orderDraft());
        assertTrue(r.text().contains("Modelos disponibles") || r.text().contains("disponible"),
                "Debe desplegar el catálogo de opciones");
    }

    @Test
    @DisplayName("Checkout: Preguntas como 'tienes otras sillas similares' no deben tomarse como cantidad y deben ofrecer opciones")
    void testCheckoutWithQuestionsAndCancellation() {
        String sessionId = "sess-flow-ux-" + UUID.randomUUID();

        // 1. Mostrar producto en contexto
        salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "Tiene Sia Gamer?",
                null
        ));

        // 2. Iniciar checkout
        BotReply r1 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "comprar",
                null
        ));
        assertEquals(CheckoutStep.NAME, r1.step());

        // 3. Responder nombre
        BotReply r2 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "Marlon",
                null
        ));
        assertEquals(CheckoutStep.QUANTITY, r2.step());

        // 4. En vez de dar cantidad, pregunta por otras sillas ('tienes otras sillas similares')
        BotReply r3 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "tienes otras sillas similares",
                null
        ));
        assertNotEquals(CheckoutStep.ADDRESS, r3.step(), "NO debe avanzar a dirección tomando la pregunta como cantidad");
        assertFalse(r3.text().contains("tienes otras sillas similares"), "NO debe poner la pregunta como label de cantidad");
        assertTrue(r3.text().contains("Wynn") || r3.text().contains("modelos") || r3.text().contains("cambiar"),
                "Debe responder la consulta de modelos alternativos");

        // 5. El cliente decide cancelar la orden ('cancelar')
        BotReply r4 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles",
                Channel.WHATSAPP,
                sessionId,
                "cancelar",
                null
        ));
        assertEquals(CheckoutStep.IDLE, r4.step());
        assertTrue(r4.text().toLowerCase().contains("cancelad"), "Debe confirmar que la orden fue cancelada");
    }
}

