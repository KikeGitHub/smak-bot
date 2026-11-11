package com.smakbot.core.application.service;

import com.fasterxml.jackson.databind.ObjectMapper;
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

        // Paso 5: Proporcionar Teléfono
        BotReply r5 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, customerId, "9988-7766", null
        ));
        assertEquals(CheckoutStep.REQUIRES_INVOICE, r5.step());

        // Paso 6: Consumidor final sin RTN
        BotReply r6 = salesEngine.process(new IncomingMessage(
                "tenant-hn-muebles", Channel.WEB, customerId, "Consumidor final, no necesito RTN", null
        ));
        assertEquals(CheckoutStep.CONFIRM, r6.step());

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
        assertNotNull(rSwitch.product());
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
}
