package com.smakbot.core.application.service;

import com.smakbot.core.domain.model.*;
import com.smakbot.core.domain.ports.out.*;
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

        sessionStore = new HashMap<>();

        lenient().when(tenantRepo.findById("tenant-hn-muebles")).thenReturn(Optional.of(testTenant));
        lenient().when(productRepo.findActiveByTenant("tenant-hn-muebles")).thenReturn(List.of(wynnChair));

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
}
