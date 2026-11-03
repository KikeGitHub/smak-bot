# ADR-002: Integración de Redis para Caché L2, Idempotencia de Webhooks, Sesiones Conversacionales Resilientes y Seguridad JWT

- **Estado:** Aceptado
- **Fecha:** 2026-11-02
- **Autor:** Arquitecto de Software Principal & Senior Lead Engineer (SyborX / SDOP Framework)
- **Contexto:** Plataforma comercial omnicanal SMAKBOT (WhatsApp Business + Web Chatbot + Backoffice SaaS Multitenant)

---

## 1. Contexto del Problema

En la operación continua de SMAKBOT atendiendo WhatsApp Business y el widget web, se identificaron cuatro cuellos de botella críticos:
1. **Sobrecarga de Base de Datos:** Cada interacción del usuario consultaba repetidamente el catálogo completo de productos (`findActiveByTenant`) en PostgreSQL, degradando tiempos de respuesta con concurrencia.
2. **Duplicidad de Mensajes en Webhooks de Meta:** Si el procesamiento de un mensaje de audio o consulta compleja excede los 3000 ms, Meta reintenta enviar el mismo webhook HTTP POST, provocando respuestas duplicadas al cliente.
3. **Fuga de Memoria Conversacional (State Leakage):** Las sesiones conversacionales almacenadas indefinidamente en PostgreSQL provocaban que, si un cliente escribía días después un simple "hola", el bot asumiera compras del producto consultado en el pasado.
4. **Vulnerabilidad en Logout de JWT:** Los tokens JWT emitidos no contaban con un mecanismo distribuido de revocación inmediata al cerrar sesión en el panel administrativo.

---

## 2. Decisión Tomada

Se decide integrar **Redis 7+/8+** como capa de memoria ultrarrápida y alta disponibilidad, estructurada bajo los siguientes patrones:

### 2.1. Caché L2 de Catálogo Multitenant
- **Clave:** `smakbot:catalog:{tenantId}`
- **TTL:** 60 minutos.
- **Estrategia:** Cache-Aside con invalidación reactiva inmediata en métodos `save()` y `deleteById()` de [ProductJpaAdapter](file:///c:/Users/kike2/OneDrive/Escritorio/SWAP/SMAK_chat-bot/smakbot-demo/backend/src/main/java/com/smakbot/core/infrastructure/persistence/adapter/ProductJpaAdapter.java).

### 2.2. Idempotencia Atómica para Meta Webhook
- **Clave:** `smakbot:meta:msg:{messageId}` (donde `messageId` es el `wamid` de Meta).
- **Operación:** Atómica `SETNX` (`setIfAbsent`) con TTL de 5 minutos (300 segundos).
- **Comportamiento:** Si la clave ya existe, el mensaje se descarta de inmediato, impidiendo procesamiento y respuestas duplicadas.

### 2.3. Sesiones Conversacionales con TTL Inteligente (Ventana de Venta)
- **Clave:** `smakbot:session:{tenantId}:{channel}:{customerId}`
- **TTL Dinámico:**
  - **45 minutos:** Para conversaciones en exploración o estado `IDLE`. Si transcurren 45 minutos de inactividad, la memoria conversacional de productos expira naturalmente.
  - **24 horas:** Si el cliente se encuentra en un checkout activo (`inCheckout()`), preservando su borrador de compra si responde más tarde en el día.
- **Implementación:** [ChatSessionCachingAdapter](file:///c:/Users/kike2/OneDrive/Escritorio/SWAP/SMAK_chat-bot/smakbot-demo/backend/src/main/java/com/smakbot/core/infrastructure/persistence/adapter/ChatSessionCachingAdapter.java) como `@Primary` decorador sobre [ChatSessionJpaAdapter](file:///c:/Users/kike2/OneDrive/Escritorio/SWAP/SMAK_chat-bot/smakbot-demo/backend/src/main/java/com/smakbot/core/infrastructure/persistence/adapter/ChatSessionJpaAdapter.java).

### 2.4. Blacklist Distribuida de JWT en Logout
- **Clave:** `smakbot:jwt:blacklist:{sha256(token)}`
- **TTL:** Equivalente al tiempo exacto que le reste de vigencia al token (`expiration - now`).
- **Verificación:** Evaluada en [JwtAuthenticationFilter](file:///c:/Users/kike2/OneDrive/Escritorio/SWAP/SMAK_chat-bot/smakbot-demo/backend/src/main/java/com/smakbot/core/infrastructure/config/security/JwtAuthenticationFilter.java). Si el token está revocado, se rechaza la petición con `HTTP 401 Unauthorized`.

### 2.5. Resiliencia Hexagonal (Graceful Degradation)
- **Principio Inmutable:** Si el servidor Redis sufre una caída o corte de red, el sistema **NUNCA** debe responder con error 500 al cliente.
- En [RedisConfig](file:///c:/Users/kike2/OneDrive/Escritorio/SWAP/SMAK_chat-bot/smakbot-demo/backend/src/main/java/com/smakbot/core/infrastructure/config/redis/RedisConfig.java) y los adaptadores, todas las llamadas a Redis están encapsuladas con bloques de captura de excepción y fallback directo a PostgreSQL.

---

## 3. Consecuencias y Reglas para Futuras Modificaciones

- **Inmutabilidad de Fallback:** Queda estrictamente prohibido remover las cláusulas de fallback a PostgreSQL en los adaptadores de Redis.
- **Moneda y Datos:** Toda información de productos en Redis debe reflejar los precios oficiales en **Lempiras (L.)** para comercios de Honduras.
- **Pruebas:** Cada cambio en adaptadores de sesión o catálogo debe incluir pruebas unitarias con simulación de falla de Redis (`RedisConnectionFailureException`) para certificar que el sistema sigue operativo.
