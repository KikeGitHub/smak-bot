# ADR-007: Ciclo de Vida de Fotos, Despacho Multimedia y Resolución Resiliente de Catálogo

- **Estado:** Aceptado e Implementado
- **Fecha:** 2026-11-14
- **Autor:** Arquitecto de Software Principal & Senior Lead Engineer (SyborX / SDOP Framework)
- **Contexto:** Motor Conversacional Comercial SMAKBOT (Módulo de Medios y Adaptador WhatsApp/Web)

---

## 1. Contexto y Planteamiento del Problema

1. **Falso Mensaje de Entrega de Foto ("Aquí tienes la foto..."):**
   - En conversaciones de WhatsApp, cuando un cliente solicitaba ver una foto diciendo *"Mande foto"*, el bot respondía textualmente: *"Aquí tienes la foto de la Mesa Auxiliar de Arrime..."*, pero **no adjuntaba ninguna imagen**.
   - **Causas raíz identificadas:**
     a) *Conflicto de banderas en OpenAI:* El prompt instruía que al solicitar datos de checkout (ej. `NAME`: *"indícame tu nombre completo"*), se debía poner `sendProductPhotos = false`. OpenAI obedecía la regla de checkout pero generaba el texto anunciando la foto.
     b) *Falta de metadatos de fotos en el catálogo de OpenAI:* El prompt entregaba a la IA el nombre, precio, stock y medidas, pero **no le indicaba si el producto tenía fotos registradas en BD ni cuántas**. Ante la falta de información, el modelo asumía que no había fotos o se contradecía.
     c) *Detección restringida en el backend:* El parser backend solo escuchaba cadenas como `"más fotos"` o `"galería"`, ignorando `"mande foto"`, `"manda foto"`, etc.
     d) *Pérdida de contexto del SKU:* En el segundo turno, si el cliente enviaba solo *"Mande foto"*, OpenAI en ocasiones omitía el campo `selectedSku` en el JSON estructurado. Al ser `null`, el backend perdía la referencia del producto y vaciaba la lista de imágenes a enviar.
2. **Productos sin Fotos:**
   - Si un producto hipotético no contaba con fotografías en base de datos, el bot prometía la foto o dejaba al cliente sin respuesta visual sin dar explicaciones.

---

## 2. Decisiones de Arquitectura y Negocio

### 2.1. Inyección Explícita de Disponibilidad de Fotos en Catálogo IA
En [OpenAiSalesAssistantAdapter.java](file:///c:/Users/kike2/OneDrive/Escritorio/SWAP/SMAK_chat-bot/smakbot-demo/backend/src/main/java/com/smakbot/core/infrastructure/adapter/out/openai/OpenAiSalesAssistantAdapter.java#L198-L203), la lista de productos inyectada en el prompt del sistema ahora incluye de forma explícita el recuento de imágenes de BD:
```text
| Fotos en BD: 4 fotos disponibles
// O bien:
| Fotos en BD: SIN FOTOS (0)
```
Esto permite al LLM saber con precisión binaria si puede ofrecer y enviar fotografías reales o si debe comunicar la ausencia de imágenes.

### 2.2. Guardrail Determinista de Entrega Multimedia
En [SalesEngineService.java](file:///c:/Users/kike2/OneDrive/Escritorio/SWAP/SMAK_chat-bot/smakbot-demo/backend/src/main/java/com/smakbot/core/application/service/SalesEngineService.java#L440-L460):
- **Si el cliente pide fotos (`clientAskedForPhotos`) y el producto TIENE fotos:**
  - Se adjunta deterministamente `selectedProduct.firstImages(1)` (o hasta 5 si solicita plural o galería).
  - Si la IA por alguna anomalía generó un texto diciendo que no hay fotos, el sanitizador reescribe la introducción: *"Con gusto te comparto la foto de [Producto]."*
- **Si el producto NO TIENE fotos registradas (`!hasImages`):**
  - Se garantiza que `imagesToSend` sea una lista vacía.
  - Se erradica cualquier promesa como *"Aquí tienes la foto..."* o *"Te comparto la foto..."* y se sustituye por:
    > *"De momento no contamos con fotos disponibles de [Producto], pero viene con sus especificaciones de fábrica garantizadas..."*

### 2.3. Resolución Resiliente de Producto en Historial Conversacional
Si en el turno actual el LLM omite el campo `selectedSku`, el motor ejecuta una cascada de resolución en 6 niveles:
1. SKU explícito devuelto en `decision.selectedSku()`.
2. SKU activo guardado en sesión `session.getSelectedSku()`.
3. SKU presente en el borrador de compra `session.getCheckout().productSku`.
4. Coincidencia difusa (*fuzzy matching*) del texto del cliente contra el catálogo (`matchProductFromCatalog(normText, catalog)`).
5. Coincidencia difusa del texto de respuesta generado por el asistente contra el catálogo.
6. Inspección en reversa del historial de turnos conversacionales (`session.getHistory()`) para capturar el último producto mencionado por el asistente.

### 2.4. Protocolo de Envío en WhatsApp Webhook
En [WhatsAppWebhookController.java](file:///c:/Users/kike2/OneDrive/Escritorio/SWAP/SMAK_chat-bot/smakbot-demo/backend/src/main/java/com/smakbot/core/infrastructure/adapter/in/web/WhatsAppWebhookController.java):
- **1 sola foto:** Se envía directamente como mensaje multimedia con el texto de la respuesta como *caption*, garantizando una sola burbuja limpia para el cliente.
- **2 a 5 fotos:** Se envía el texto conversacional primero, seguido de las imágenes secuenciales en formato álbum.
- **0 fotos:** Se envía únicamente el texto informativo sin attachments vacíos ni errores en la Graph API de Meta.

---

## 3. Consecuencias y Beneficios

### Positivas:
- **Cero Respuestas Rotas:** Se elimina por completo el defecto de prometer una foto que no llega.
- **Robustez Conversacional:** Aunque el usuario responda con mensajes cortos como *"Mande foto"*, *"fotos"* o *"la imagen"*, el bot nunca pierde el producto de referencia.
- **Transparencia Comercial:** Si un producto no tiene fotos, el cliente es notificado con claridad sin falsas expectativas.
- **Desempeño en WhatsApp:** El uso de *caption* en imagen única reduce el número de llamadas a la API de WhatsApp y mejora la experiencia en redes móviles lentas.
