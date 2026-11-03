# Documento de Diseño de Software (SDD): SMAKBOT Core Platform

- **Documento:** `/docs/sdd/sdd-smakbot-core.md`
- **Módulo:** `smakbot-core`
- **Fase SDOP:** FASE 3 - Construcción e Integración Fullstack
- **Fecha:** 2026-10-30 (Actualizado: 2026-11-02)
- **Autor:** Arquitecto de Software Principal & Senior Lead Engineer (SyborX)
- **Estado:** APROBADO Y CERTIFICADO EN PRODUCCIÓN (GATE #1 y GATE #2 COMPLETADOS)

---

## 1. Arquitectura Hexagonal del Backend (Spring Boot 3 + Java 17)

```
com.smakbot.core
├── domain/                               # LÓGICA DE DOMINIO PURA (Sin dependencias de frameworks)
│   ├── model/                            # Entidades de Dominio
│   │   ├── Tenant.java                   # Comercio / Negocio
│   │   ├── Product.java                  # Producto del catálogo
│   │   ├── Order.java                    # Pedido confirmado
│   │   ├── ChatSession.java              # Estado conversacional
│   │   └── MessagePayload.java           # Mensaje agnóstico de canal
│   └── ports/
│       ├── in/                           # PUERTOS DE ENTRADA (Casos de Uso)
│       │   ├── ProcessMessageUseCase.java
│       │   ├── ManageOrderUseCase.java
│       │   └── CatalogQueryUseCase.java
│       └── out/                          # PUERTOS DE SALIDA (SPI)
│           ├── TenantRepositoryPort.java
│           ├── ProductRepositoryPort.java
│           ├── OrderRepositoryPort.java
│           ├── ChatSessionRepositoryPort.java
│           └── NotificationSenderPort.java (Meta Graph API / WebSocket)
│
├── application/                          # CAPA DE APLICACIÓN
│   └── service/
│       ├── SalesEngineService.java       # Orquestador comercial (Adaptado del Oráculo)
│       ├── IntentDetectorService.java    # Detección de intenciones (Precio, Stock, Medidas)
│       ├── HonduranLogisticsPolicy.java  # Reglas de Honduras, CAEX, RTN, Llaves Allen
│       └── CheckoutStateMachine.java     # Máquina de estados conversacional (A -> G)
│
└── infrastructure/                       # ADAPTADORES DE INFRAESTRUCTURA
    ├── adapter/
    │   ├── in/web/                       # REST Controllers
    │   │   ├── WhatsAppWebhookController.java # Webhooks Meta Cloud API
    │   │   ├── WebChatController.java         # API para el Widget Web
    │   │   ├── AdminCatalogController.java    # CRUD Productos SaaS
    │   │   └── AdminOrderController.java      # Dashboard Pedidos SaaS
    │   ├── out/persistence/              # Persistencia PostgreSQL (JPA + Flyway)
    │   │   ├── entity/                   # Entidades JPA
    │   │   ├── repository/               # Spring Data JPA Repositories
    │   │   └── adapter/                  # Implementación de Repositorios Ports
    │   └── out/meta/                     # Cliente Meta Graph API (RestClient)
    │       └── MetaGraphClientAdapter.java
    └── config/                           # Seguridad, Swagger, Virtual Threads, CORS
        ├── OpenApiConfig.java
        └── AsyncExecutorConfig.java
```

---

## 2. Especificación DDL de Migración de Base de Datos (Flyway)

Archivo: `backend/src/main/resources/db/migration/V1__init_multitenant_schema.sql`

```sql
-- 1. Tabla de Tenants (Negocios / Comercios)
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    country VARCHAR(10) DEFAULT 'HN',
    currency VARCHAR(10) DEFAULT 'L.',
    phone_contact VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Credenciales y Configuración de WhatsApp Meta por Tenant
CREATE TABLE IF NOT EXISTS whatsapp_configs (
    tenant_id VARCHAR(50) PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
    phone_number_id VARCHAR(50) NOT NULL UNIQUE,
    waba_id VARCHAR(50),
    access_token TEXT NOT NULL,
    verify_token VARCHAR(100) NOT NULL,
    app_secret VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Catálogo de Productos Multitenant
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    sku VARCHAR(60) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    regular_price NUMERIC(12, 2),
    sale_price NUMERIC(12, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    dimensions VARCHAR(120),
    weight_limit VARCHAR(120),
    colors VARCHAR(120),
    category VARCHAR(100),
    keywords JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_sku UNIQUE (tenant_id, sku)
);
CREATE INDEX IF NOT EXISTS idx_products_tenant ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- 4. Sesiones Conversacionales y Memoria de Checkout
CREATE TABLE IF NOT EXISTS chat_sessions (
    id VARCHAR(100) PRIMARY KEY, -- Para WA: "50499998888", Para Web: "session-{uuid}"
    tenant_id VARCHAR(50) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    channel VARCHAR(20) NOT NULL, -- 'WHATSAPP' | 'WEB'
    current_step VARCHAR(40) DEFAULT 'IDLE',
    session_data JSONB DEFAULT '{}'::jsonb,
    last_interaction TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_tenant ON chat_sessions(tenant_id);

-- 5. Órdenes / Pedidos Comerciales
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_number VARCHAR(60) NOT NULL UNIQUE, -- 'SMAK-ORD-1001'
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    delivery_address TEXT NOT NULL,
    gps_latitude DOUBLE PRECISION,
    gps_longitude DOUBLE PRECISION,
    gps_map_url TEXT,
    product_sku VARCHAR(60) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    total NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO'
    requires_invoice BOOLEAN DEFAULT FALSE,
    rtn VARCHAR(30),
    business_name VARCHAR(150),
    tracking_number VARCHAR(100),
    tracking_carrier VARCHAR(80) DEFAULT 'Cargo Expreso',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_orders_tenant ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_tracking ON orders(tracking_number);
```

---

## 3. Contratos de Integración y Endpoints REST (OpenAPI 3.0)

### 3.1. Webhook de WhatsApp Meta Cloud API
* **`GET /api/v1/whatsapp/webhook`**:
  * **Propósito:** Handshake y validación inicial requerida por Meta.
  * **Parámetros Query:** `hub.mode`, `hub.verify_token`, `hub.challenge`.
  * **Respuesta:** Devuelve `hub.challenge` plano (HTTP 200) si `hub.verify_token` coincide con la configuración del tenant.
* **`POST /api/v1/whatsapp/webhook`**:
  * **Propósito:** Recepción de eventos de mensajes, ubicaciones GPS, botones y medios entrantes.
  * **Comportamiento:**
    1. Valida firma `X-Hub-Signature-256`.
    2. Retorna inmediatamente `HTTP 200 OK` a Meta (en < 500 ms).
    3. Despacha el payload a un Worker asíncrono (`@Async`).
    4. El Worker extrae el `phone_number_id`, resuelve el `tenant_id`, invoca `SalesEngineService` y responde al usuario vía llamada `POST` a `graph.facebook.com/v20.0/{phone-number-id}/messages`.

### 3.2. Endpoints para el Widget Web (Scope 2)
* **`POST /api/v1/chat/message`**:
  * **Headers:** `X-Tenant-ID: {id}`, `X-Session-ID: {uuid}`
  * **Request Body:**
    ```json
    {
      "message": "Quiero comprar 2 sillas Wynn",
      "location": {
        "lat": 14.1025,
        "lng": -87.1950,
        "address": "Colonia Palmira, Tegucigalpa"
      }
    }
    ```
  * **Response Body (HTTP 200):**
    ```json
    {
      "text": "¡Perfecto! Continuemos con el pedido...",
      "step": "CHECKOUT_NAME",
      "product": { "sku": "SKM-956-CA-NE", "name": "Silla Ergonómica Wynn..." },
      "order": null,
      "buttons": []
    }
    ```
* **`GET /api/v1/chat/tracking/{code}`**:
  * **Propósito:** Consulta en tiempo real de estatus de orden y guía de Cargo Expreso (`SMAK-ORD-XXXX` o `CAEX-XXXX`).

### 3.3. Endpoints de Administración SaaS (Scope 3)
* **`GET /api/v1/admin/products`** (Filtro por `tenant_id`)
* **`POST /api/v1/admin/products`**
* **`GET /api/v1/admin/orders`** (Kanban de pedidos)
* **`PATCH /api/v1/admin/orders/{id}/status`** (Asignación de guía CAEX)

---

## 4. Patrón Bridge y Adaptadores Duales en Frontend (Angular)

El módulo de chat de Angular implementa desacoplamiento estricto:

```typescript
// Puerto Abstracto
export interface ChatWidgetRepositoryPort {
  sendMessage(tenantId: string, sessionId: string, message: string, location?: LocationPayload): Observable<BotResponseDTO>;
  getOrderStatus(tenantId: string, trackingCode: string): Observable<OrderDTO>;
  confirmOrder(tenantId: string, orderPayload: ConfirmOrderDTO): Observable<OrderDTO>;
}

export const CHAT_WIDGET_REPOSITORY_PORT = new InjectionToken<ChatWidgetRepositoryPort>('CHAT_WIDGET_REPOSITORY_PORT');
```

* **`ChatLocalStorageAdapter`:** Utiliza `StorageFacade` y el motor local en memoria para demos offline (Fase 0).
* **`ChatHttpAdapter`:** Consume `HttpClient` de Angular apuntando a `/api/v1/chat/*` con interceptores de tenant y sesión.
* **Provider de Conmutación (Feature Flag):**
  ```typescript
  {
    provide: CHAT_WIDGET_REPOSITORY_PORT,
    useFactory: (http: HttpClient) => {
      return environment.useMockData 
        ? new ChatLocalStorageAdapter() 
        : new ChatHttpAdapter(http, environment.apiBaseUrl);
    },
    deps: [HttpClient]
  }
  ```

---

## 5. Máquina de Estados del Checkout (7 Pasos del Oráculo)

Se preserva el 100% de la lógica validada en el demo:

| Paso | Código de Estado | Entrada Esperada | Salida / Acción |
| :--- | :--- | :--- | :--- |
| **Inicio** | `IDLE` ➔ `NAME` | "Quiero comprar X" | Inicia checkout, guarda producto y solicita nombre completo. |
| **Paso B** | `NAME` ➔ `QUANTITY` | Texto libre ("Carlos Mendoza") | Registra destinatario y solicita cantidad o confirma si ya venía dicha. |
| **Paso C** | `QUANTITY` ➔ `ADDRESS` | Número o texto ("2 sillas") | Recalcula total (unidades × precio) y solicita dirección completa o GPS 📍. |
| **Paso D** | `ADDRESS` ➔ `PHONE` | Dirección textual o Pin GPS | Registra georreferenciación y solicita teléfono con recepción de llamadas para CAEX. |
| **Paso E** | `PHONE` ➔ `REQUIRES_INVOICE` | Número telefónico (+504...) | Valida formato y pregunta si requiere factura con RTN o consumidor final. |
| **Paso F** | `REQUIRES_INVOICE` ➔ `CONFIRM` | "No" / RTN de 14 dígitos | Genera resumen formal de orden con botón interactivo o palabra clave de confirmación. |
| **Paso G** | `CONFIRM` ➔ `COMPLETED` | "¡Sí, confirmo el pedido!" | Persiste en tabla `orders`, emite código `SMAK-ORD-XXXX` y limpia sesión conversacional. |

---

## 6. Plan de Inspección Playwright (Oráculo de Calidad)

Se ejecutará la suite `tests/e2e/sales-flow-oracle.spec.ts`:
1. **Prueba de Red:** Monitorea que `/api/v1/chat/message` responda HTTP 200 en < 800ms.
2. **Prueba de Consola:** Cero excepciones no capturadas (`pageerror`) y cero advertencias de red (`failed`).
3. **Prueba de Flujo Completo:** Reproducción paso a paso de la Demo Maestra de 14 turnos.
4. **Regresión Visual:** Comparación pixel a pixel de las tarjetas de producto y de confirmación contra la Demo Fase 0 con tolerancia `maxDiffPixelRatio <= 0.01`.

---

## 7. Declaración de Cumplimiento de Principios SDOP
- [x] **Audit-First:** 100% de entidades y reglas derivadas del Oráculo existente.
- [x] **Bridge Pattern:** Desacoplamiento total de UI mediante `ChatWidgetRepositoryPort`.
- [x] **Hexagonal Backend:** Puertos y adaptadores independientes de frameworks.
- [x] **Zero Regressions:** Contratos idénticos a los validados en la Fase 0.

---

🛑 **PUNTO DE CONTROL HUMANO #1 (GATE DE APROBACIÓN DEL SDD):**
El Arquitecto Humano debe revisar este diseño inmutable en `/docs/sdd/sdd-smakbot-core.md` y emitir su autorización formal para proceder con la **Fase 3 (Construcción e Integración Fullstack)**.
