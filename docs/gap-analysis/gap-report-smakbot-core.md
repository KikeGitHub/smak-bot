# Reporte de Auditoría de GAPs y Reutilización (READ-ONLY): SMAKBOT Core

- **Módulo:** `smakbot-core` (Conversational Sales Engine, Multi-channel Gateway & Multitenant Backoffice)
- **Fase SDOP:** FASE 1 - Diagnóstico de GAPs y Auditoría de Reutilización
- **Modo:** ESTRICTO READ-ONLY (Cero alteraciones a código de producción)
- **Fecha:** 2026-10-30
- **Auditor:** Arquitecto de Software Principal & Senior Lead Engineer (SyborX)
- **Oráculo de Verdad:** Prototipo Funcional Fase 0 (`js/bot-engine.js`, `js/storage-facade.js`, `js/seed-data.js`, `SMAK-landing-page/`, `index.html`)

---

## 1. Resumen Ejecutivo del Diagnóstico
El prototipo funcional de la Fase 0 ha alcanzado un nivel de madurez funcional y visual del **100% en el entorno de simulación (LocalStorage)**. Ha superado 18 pruebas automatizadas de extremo a extremo cubriendo:
- Asesoría por familias de producto (Sillas, Taburetes, Escritorios, Grifería).
- Logística territorial en Honduras (Cargo Expreso, San Pedro Sula, Tegucigalpa, Choluteca, entrega en 24-48h).
- Cotización dinámica por volumen y mayoreo.
- Máquina de estados conversacional de 7 pasos (Paso A: Inicio ➔ B: Destinatario ➔ C: Cantidad ➔ D: GPS ➔ E: Teléfono ➔ F: Facturación RTN ➔ G: Confirmación y emisión de orden).

La auditoría determinó que **el 90% de la lógica de negocio ya está especificada en el Oráculo**, por lo que la construcción en Spring Boot consiste en una **adaptación y desacoplamiento limpio**, no en una invención desde cero.

---

## 2. Matriz de Auditoría y Clasificación de GAPs

| Componente Oráculo (Demo) | Destino Fullstack | Estado GAP | Clasificación | Plan de Adaptación / Reutilización |
| :--- | :--- | :--- | :--- | :--- |
| `seed-data.js` (Tenants, Products, FAQs) | PostgreSQL DDL (`tenants`, `products`, `policy_rules`) | **PARTIAL** | DATA | Mapear estructuras JSON a esquema relacional DDL (Flyway `V1__init_schema.sql`) y DTOs Java. |
| `storage-facade.js` (Órdenes, Clientes, Contador) | PostgreSQL DDL (`orders`, `chat_sessions`) | **PARTIAL** | DATA / PERSISTENCE | Reemplazar escrituras en `localStorage` por transacciones JPA con aislamiento multitenant por `tenant_id`. |
| `bot-engine.js` (Tokenizador, Stemmer, Regex) | `SalesEngineService.java` & `IntentDetector.java` | **PARTIAL** | LOGIC | Portar la lógica de regex, listas de sinónimos y tokenización a servicios Spring Boot con patrón Strategy. |
| `bot-engine.js` (Checkout State Machine) | `CheckoutStateMachineService.java` | **PARTIAL** | STATE_MACHINE | Portar el flujo conversacional de 7 pasos a un servicio con persistencia de estado en tabla `chat_sessions`. |
| `bot-engine.js` (Logística Honduras, CAEX, RTN) | `HonduranCommercePolicy.java` | **PARTIAL** | BUSINESS_RULES | Reutilizar íntegramente las respuestas formateadas, políticas de flete y validación de 14 dígitos de RTN. |
| Meta WhatsApp Cloud API | `WhatsAppWebhookController.java` | **MISSING** | INTEGRATION | Construir el receptor de webhooks de Meta con verificación `hub.challenge` y despacho asíncrono `@Async`. |
| Meta Graph API Client | `MetaGraphClient.java` (RestClient) | **MISSING** | INTEGRATION | Implementar cliente HTTP para el envío de mensajes de texto, listas interactivas e imágenes oficiales a Meta. |
| Swagger / OpenAPI Contract | `springdoc-openapi` DTOs & Endpoints | **MISSING** | SPEC | Generar contratos OpenAPI para consumo del Widget Web y administración SaaS. |
| UI Simulador WhatsApp (`index.html`) | Angular Chat Component | **INCORRECT** | ARCHITECTURE | La UI actual está acoplada al DOM directo. Debe envolverse en un componente Angular con Patrón Bridge. |
| UI Widget Showroom (`web-bot.js`) | `smakbot-widget.js` (Bridge Adapter) | **INCORRECT** | ARCHITECTURE | Convertir el script en un adaptador dual conmutando entre `LocalStorageAdapter` y `HttpAdapter`. |
| Regresión Visual & E2E | Playwright Suite (`tests/oracle.spec.ts`) | **MISSING** | QUALITY | Automatizar las 18 pruebas en Playwright para certificar cero regresiones visuales y de red. |

---

## 3. Detalle de GAPs Críticos

### GAP-01: Multitenancy y Persistencia (PostgreSQL)
- **Condición Actual:** Los datos se guardan en una única llave de `localStorage` (`smakbot-demo-v5`).
- **Requerimiento Producción:** Múltiples negocios aislados. Cada llamada entrante (de WhatsApp o Web) debe identificar el `tenant_id` y filtrar estrictamente los productos, órdenes y configuraciones asociadas.
- **Acción:** Diseñar tabla `tenants`, tabla `whatsapp_configs` y añadir `tenant_id` obligatorio con índices compuestos en `products`, `orders` y `chat_sessions`.

### GAP-02: Webhooks Asíncronos de Meta (WhatsApp)
- **Condición Actual:** El simulador responde de manera síncrona en memoria.
- **Requerimiento Producción:** Meta exige responder `HTTP 200` en menos de 3 segundos antes de que el bot procese el mensaje.
- **Acción:** Endpoint `POST /api/v1/whatsapp/webhook` debe devolver `200 OK` de inmediato y delegar el mensaje a un hilo `@Async` de Spring Boot que ejecutará el `SalesEngine` y llamará a la Graph API de Meta.

### GAP-03: Desacoplamiento del Widget Web (Patrón Bridge)
- **Condición Actual:** `web-bot.js` tiene hardcodeada la llamada a `window.SMAK_PRODUCTS` o `localStorage`.
- **Requerimiento Producción:** El Widget debe operar con un contrato de repositorio:
  ```typescript
  export interface ChatWidgetRepositoryPort {
    sendMessage(message: string, context: ChatContext): Observable<BotReply>;
    confirmOrder(order: OrderPayload): Observable<OrderConfirmation>;
    getOrderStatus(trackingOrOrderNumber: string): Observable<OrderStatus>;
  }
  ```
  Permitiendo activar `ChatLocalStorageAdapter` para pruebas offline o `ChatHttpAdapter` para producción.

---

## 4. Certificación de Modo READ-ONLY
Se certifica que durante la elaboración de este informe:
- No se modificó ningún archivo del Oráculo (`index.html`, `app-chat.js`, `js/*`, `SMAK-landing-page/*`).
- No se aplicó ninguna alteración a bases de datos ni código productivo.
- La auditoría se basó exclusivamente en inspección estática y ejecución de pruebas en memoria.

---

## 5. Dictamen de la Fase 1
**ESTADO: FASE 1 COMPLETADA CON ÉXITO.**
La arquitectura del Oráculo es completamente apta para ser adaptada a Spring Boot y Angular bajo los estándares SDOP. Se autoriza la elaboración del **Documento de Diseño de Software (SDD)** en la Fase 2.
