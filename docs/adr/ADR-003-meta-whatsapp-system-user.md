# ADR-003: Integración de Meta Graph API con Token Permanente de System User y Pipeline de Audio Multimodal

- **Estado:** Aceptado
- **Fecha:** 2026-11-02
- **Autor:** Arquitecto de Software Principal & Senior Lead Engineer (SyborX / SDOP Framework)
- **Contexto:** Plataforma comercial omnicanal SMAKBOT (WhatsApp Business Meta Cloud API v20.0)

---

## 1. Contexto del Problema

1. **Expiración de Tokens Temporales:** Los tokens de prueba generados en el Meta Graph API Explorer tienen una caducidad de 24 horas (`subcode: 463`), provocando la interrupción repentina del canal WhatsApp (`HTTP 401 Unauthorized`).
2. **SLA Estricto de Webhook (< 3000 ms):** Meta impone un tiempo límite de respuesta HTTP para los webhooks entrantes. Si el servidor procesa el mensaje de forma síncrona o descarga notas de voz antes de responder, Meta marca la llamada como fallida y reintenta múltiples veces.
3. **Consumo de Mensajes de Voz:** Una proporción considerable de clientes en Honduras prefiere enviar notas de voz por WhatsApp en lugar de escribir texto.

---

## 2. Decisión Tomada

### 2.1. Token Permanente vía System User en Meta Business Manager
- Se crea y asocia un **Usuario del Sistema (System User)** con rol de Empleado o Administrador en la cuenta comercial oficial de Meta (`business_id: 1877513676762398`).
- Se le asignan los permisos permanentes `whatsapp_business_messaging` y `whatsapp_business_management` sobre la aplicación (`App ID: 1793782118598993`).
- El token emitido tiene expiración permanente (`data_access_expires_at: 0`) y se almacena encriptado/persistido en la tabla `whatsapp_configs` de PostgreSQL.
- Se implementa verificación programática de salud mediante el endpoint `GET /debug_token`.

### 2.2. Apretón de Manos Asíncrono (Immediate 200 ACK)
- En [WhatsAppWebhookController](file:///c:/Users/kike2/OneDrive/Escritorio/SWAP/SMAK_chat-bot/smakbot-demo/backend/src/main/java/com/smakbot/core/infrastructure/adapter/in/web/WhatsAppWebhookController.java), el método `@PostMapping("/webhook")` retorna inmediatamente `HTTP 200 ("EVENT_RECEIVED")` en menos de 50 ms.
- El procesamiento del payload se delega al pool de hilos virtuales/asíncronos mediante `@Async("whatsappTaskExecutor")`.

### 2.3. Pipeline Multimodal de Audio (Whisper & TTS)
- Si el mensaje entrante es de tipo `audio` o `voice`:
  1. Se descarga el archivo `.ogg/.mp4` de Meta Graph API mediante [MetaGraphClientAdapter](file:///c:/Users/kike2/OneDrive/Escritorio/SWAP/SMAK_chat-bot/smakbot-demo/backend/src/main/java/com/smakbot/core/infrastructure/adapter/out/meta/MetaGraphClientAdapter.java).
  2. Se envía al microservicio de transcripción Whisper (`/v1/transcribe/sync`).
  3. El texto resultante se procesa a través del [SalesEngineService](file:///c:/Users/kike2/OneDrive/Escritorio/SWAP/SMAK_chat-bot/smakbot-demo/backend/src/main/java/com/smakbot/core/application/service/SalesEngineService.java) exactamente igual que un mensaje de texto.
  4. Opcionalmente, se sintetiza una nota de voz de respuesta mediante TTS.

---

## 3. Consecuencias y Reglas para Futuras Modificaciones

- **Prohibición de Tokens Temporales:** Queda estrictamente prohibido configurar tokens de prueba de usuario temporal en entornos de integración o producción. Todo tenant debe tener un token de System User.
- **Validación de Número Oficial:** El `phone_number_id` y `waba_id` deben corresponder exactamente a la línea de WhatsApp Cloud API registrada en Meta Business Manager.
- **Aislamiento Multitenant:** Cada mensaje entrante debe resolver su configuración por `phone_number_id` para garantizar que las respuestas salientes provengan de la línea correcta.
