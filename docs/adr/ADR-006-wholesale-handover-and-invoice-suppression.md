# ADR-006: Protocolo de Escalación a Mayoreo y Supresión Proactiva de Facturación Fiscal

- **Estado:** Aceptado e Implementado
- **Fecha:** 2026-11-14
- **Autor:** Arquitecto de Software Principal & Senior Lead Engineer (SyborX / SDOP Framework)
- **Contexto:** Motor Conversacional Comercial SMAKBOT (Módulo de Checkout y Handover Humano)

---

## 1. Contexto y Planteamiento del Problema

1. **Fricción innecesaria por Facturación Proactiva:**
   - En la versión original de la máquina de estados, el bot preguntaba obligatoriamente a todo comprador: *"¿Deseas factura fiscal con RTN o consumidor final?"*.
   - La gran mayoría de clientes finales compran artículos de hogar para uso particular y no requieren RTN; la pregunta generaba dudas, frenaba el impulso de compra y aumentaba el abandono del carrito.
2. **Transferencias prematuras a asesor humano:**
   - La regla previa transfería a soporte humano cualquier pedido de 2 o más unidades bajo el mensaje: *"Para [Producto], el pedido de 2 unidades requiere que te transfiera a un asesor humano, ya que se supera el límite de 2 unidades..."*.
   - Esto resultaba contraproducente:
     - Un cliente que quería comprar 2, 3 o 4 sillas individuales era expulsado del bot a una cola humana, perdiendo la automatización.
     - Frases como *"asesor humano"* o *"se supera el límite"* provocaban desconfianza en el comprador, haciendo sentir que había un problema o una restricción con su orden.
3. **Distinción entre Productos Individuales vs. Líneas SET:**
   - Los productos tipo **SET** (ej. Set de 4 Sillas Tolix) ya representan paquetes de volumen (4 unidades por set). Pedir 2 sets implica 8 sillas, lo que califica como volumen mayoreo.
   - En cambio, comprar 2 sillas individuales de oficina no es mayoreo y debe ser procesado de manera 100% automatizada por el bot.

---

## 2. Decisiones de Arquitectura y Negocio

### 2.1. Supresión Proactiva de Factura / RTN
- **Flujo Estándar:** La máquina de estados transiciona directamente del paso de teléfono (`PHONE`) al resumen de confirmación (`CONFIRM`).
- **Activación On-Demand:** Únicamente si el cliente solicita explícitamente factura fiscal o menciona *"RTN"*, *"factura"* o *"empresa"* por iniciativa propia (`HondurasOrderValidator.explicitInvoiceRequested`), se activan los pasos secundarios `INVOICE_RTN` (14 dígitos) e `INVOICE_BUSINESS_NAME`.
- Si el cliente no lo solicita, la orden se emite como **Consumidor Final**.

### 2.2. Umbrales Diferenciados de Escalación a Mayoreo
Se desacopla la política de volumen en dos reglas claras evaluadas en [HondurasDeliveryPolicy.java](file:///c:/Users/kike2/OneDrive/Escritorio/SWAP/SMAK_chat-bot/smakbot-demo/backend/src/main/java/com/smakbot/core/application/engine/HondurasDeliveryPolicy.java):
1. **Línea de Productos SET (`isSetOrDualIndividualProduct`):**
   - Aplica a productos cuyo SKU contiene `"SET"` o cuyo nombre/categoría indica conjunto (ej. Set de 4 Sillas Tolix).
   - Umbral de transferencia: **2 o más unidades (2 sets o más)**.
   - Al pedir 2 sets, se traslada a mayoreo.
2. **Productos Individuales (Resto del Catálogo):**
   - Aplica a sillas individuales, escritorios, piletas, etc.
   - Capacidad del bot: **Vende y procesa automáticamente pedidos de 1 a 5 unidades**.
   - Umbral de transferencia: **Más de 5 unidades (6 o más)**.
   - Pedidos de 2, 3, 4 y 5 unidades continúan el checkout normal sin interrupciones.

### 2.3. Erradicación Léxica y Rebranding: "Especialista de Mayoreo"
- **Términos Prohibidos:** Queda estrictamente vetado usar *"asesor humano"*, *"agente humano"* o *"se supera el límite"*.
- **Nuevo Vocabulario Oficial:** Se utiliza exclusivamente **"especialista de mayoreo"** con un tono comercial positivo y orientado a beneficios:
  > *"Con gusto te ayudamos con tu pedido de [Cantidad] unidades de [Producto]. Por tratarse de esa cantidad, voy a comunicarte directamente con un especialista de mayoreo por este mismo chat para coordinar todos los detalles contigo. En breve te responderán."*
- **Sanitización de Respaldo:** El método `HondurasDeliveryPolicy.sanitizeCustomerReply` intercepta cualquier mensaje remanente con menciones a *"asesor humano"* o *"límite"* y lo reescribe con la plantilla de especialista de mayoreo.

---

## 3. Consecuencias y Beneficios

### Positivas:
- **Reducción del Churn en Checkout:** La eliminación de la pregunta proactiva del RTN acorta el embudo de compra en 1 turno conversacional crítico.
- **Mayor Autonomía del Bot:** Hasta 5 unidades de productos individuales se cierran de forma automática sin intervención humana.
- **Percepción de Servicio VIP:** El cliente siente que recibe atención preferencial de un experto en volumen, no que chocó contra una barrera técnica del bot.
