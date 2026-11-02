# SMAKBOT · Ecosistema Fullstack & Chatbot Omnicanal (SDOP Framework)

Sistema comercial omnicanal con integración a **WhatsApp Business Cloud API**, **Frontend Angular 20**, **Backend Spring Boot 3 (Java 17)** y **Base de Datos PostgreSQL 17**.

> 📖 **[Ver Guía Maestra de Validación y Operación (Paso a Paso)](./GUIA_VALIDACION_Y_OPERACION.md)**  
> Contiene instrucciones completas para validar:
> 1. **Webhook de WhatsApp:** Sandbox local, conexión a Meta Developers (Sandbox) y cuenta Real.
> 2. **Chatbot Web (SPA / SWAP):** Dual Bridge, catálogo, checkout y rastreo de envíos.
> 3. **Panel Administrativo (SaaS Backoffice):** Acceso con usuario y contraseña, Kanban de pedidos y despacho CAEX.
> 4. **Transcripción y Audio:** Notas de voz con Whisper STT y reproductor de audio interactivo estilo WhatsApp (TTS).

---

## 🚀 Inicio Rápido de Servicios

```bash
# 1. Backend Spring Boot (Puerto 8080)
cd backend
mvn spring-boot:run

# 2. Frontend Angular (Puerto 4200)
cd frontend
npm run dev

# 3. Base de Datos PostgreSQL (Puerto 5432)
# Base de datos: smakbot_db (Flyway ejecuta las migraciones automáticamente)
```

---

## 🛠 Módulos Implementados

### 1. Panel de Administración de Negocio (`admin.html` / `app-admin.js`)
* **Catálogo Multi-Producto con SKU:**
  * Alta, edición, borrado y visualización tabular de productos.
  * Atributos soportados: `sku`, `name`, `regularPrice`, `salePrice`, `stock`, `dimensions`, `weightLimit`, `keywords`, `images`.
  * Estados visuales de stock: unidades disponibles vs. agotado.
* **Base de Preguntas, Respuestas y Reglas (Q&A):**
  * Alta y edición de preguntas con *n* frases disparadoras (*training phrases*).
  * **Tipología de Reglas:**
    * **Paramétricas por SKU:** Resuelve automáticamente disponibilidad consultando el inventario (`{sku}`, `{name}`, `{stock}`, `{salePrice}`).
    * **FAQs Estáticas:** Respuestas informativas generales (tiempos de entrega, políticas, métodos de pago).
    * **Restricciones (Guardrails):** Delimita lo que el bot **NO** debe responder o negociar (ej. descuentos no autorizados) y ofrece escalamiento a humano.
  * Switch On/Off para activar o pausar reglas en caliente.
  * Filtros por categoría (`Inventario`, `Catálogo`, `Envíos`, `Pagos`, `Políticas`, `Restricciones`).
* **Diccionario de Sinónimos Dinámico:**
  * Soporte para crear cualquier grupo de concepto y asociar *n* palabras o modismos.
  * Adición y eliminación rápida de palabras con chips interactivos.
* **Mapeo de Redes Sociales y Campañas (Facebook / Instagram / TikTok):**
  * Vinculación de URLs compartidas (`facebook.com/share/p/...`), anuncios de Meta Ads (`source_id`) y enlaces de Instagram con SKUs del catálogo.
  * Generador integrado de Enlaces Inteligentes `wa.me` con mensaje y SKU pre-cargado.
* **Simulador / Tester en Vivo Integrado:**
  * Sandbox para probar preguntas o enlaces de redes sociales en el propio panel y visualizar qué regla y SKU fueron detectados.
* **Gestión de Pedidos:**
  * Listado de ventas cerradas desde el chat con detalle de cliente, SKU, total y fecha.

### 2. Motor Conversacional (`js/bot-engine.js`)
* Normalización léxica (limpieza de tildes, mayúsculas y puntuación).
* **Extractor de entidades SKU y Atribución Social:**
  * Soporte de objetos `referral` de anuncios Meta Ads (Click-to-WhatsApp CTWA).
  * Extracción y resolución de Post IDs en URLs de Facebook (`facebook.com/share/p/...`) e Instagram.
  * Detección de SKUs en enlaces profundos (`[SKU: XXX]`).
  * Matching semántico por nombre de catálogo, palabras clave y expresiones regulares.
* Resolución condicional de stock (Stock disponible vs. Agotado vs. SKU no registrado).
* Expansión semántica mediante diccionario de sinónimos.
* Priorización de reglas de restricción (seguridad conversacional).
* **Respuestas Automatizadas en Audio (Voz TTS):**
  * Detección automática cuando el usuario envía una nota de voz.
  * Generación y reproducción de notas de voz de respuesta del bot con reproductor interactivo estilo WhatsApp (onda visual animada, contador de duración y selector de velocidad 1x / 1.5x / 2x).
  * Salida combinada: audio de respuesta + transcripción escrita y tarjetas de producto.
* **Reconocimiento de Ubicación GPS y Google Maps en Checkout:**
  * Detección de mensajes de ubicación de WhatsApp (`type: "location"`), enlaces de Google Maps y coordenadas directas.
  * Geocodificación inversa (Reverse Geocoding) automática para traducir coordenadas a direcciones legibles de entrega (colonia, calle, ciudad).
  * Tarjetas interactivas de mapa en el chat y enlaces directos a Google Maps para el repartidor en el panel de pedidos.
* Flujo guiado de checkout conversacional (nombre -> dirección / ubicación GPS -> teléfono -> confirmación).
* Escalamiento a asesor humano y soporte de consultas por notas de voz.

---

## 📁 Estructura del Proyecto

```
smakbot-demo/
├── index.html            # Simulador de chat comercial (estilo WhatsApp Web con soporte GPS y Audio)
├── admin.html            # Panel de negocio, gestión de reglas y pedidos con GPS
├── app-chat.js           # Controlador del simulador de chat y reproductores multimedia
├── app-admin.js          # Controlador del panel de administración
├── js/
│   ├── seed-data.js             # Datos iniciales (tenants, productos con SKU, reglas, sinónimos)
│   ├── storage-facade.js        # Capa de persistencia (Fachada de Storage)
│   ├── bot-engine.js            # Motor de inferencia y coincidencia de intenciones
│   ├── speech-service.js        # Servicio de síntesis de voz (TTS) y reproductor WhatsApp
│   ├── location-service.js      # Servicio de geolocalización GPS y enlaces Google Maps
│   └── transcription-service.js # Servicio de transcripción Whisper sincrónico
└── README.md             # Documentación técnica
```

