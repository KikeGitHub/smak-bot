# SMAKBOT · Demo & Fuente de Verdad para Desarrollo Fullstack

Prototipo interactivo de alta fidelidad para chatbot comercial omnicanal (WhatsApp Web) y panel de control administrativo de negocio, diseñado con arquitectura modular en JavaScript ES6, Tailwind CSS y almacenamiento sincronizado.

Esta demo sirve como **fuente de verdad funcional y de datos** para migrar posteriormente hacia una aplicación fullstack completa (Backend Node.js/Python, Base de Datos PostgreSQL/MongoDB y Frontend React/Next.js/Vue).

---

## 🚀 Cómo ejecutar la demo localmente

Debido al uso de módulos JavaScript nativos (`type="module"`), se recomienda servir la carpeta con un servidor web local:

1. **Con Python:**
   ```bash
   python -m http.server 8000
   ```
   Abrir: [http://localhost:8000](http://localhost:8000)

2. **Con VS Code:**
   Instalar la extensión *Live Server* y presionar **Go Live** sobre `index.html`.

Abre `index.html` en una pestaña y `admin.html` en otra; ambas ventanas se sincronizan en tiempo real mediante eventos de almacenamiento local (`storage` / `CustomEvent`).

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
* **Simulador / Tester en Vivo Integrado:**
  * Sandbox para probar preguntas en el propio panel y visualizar qué regla y SKU fueron detectados.
* **Gestión de Pedidos:**
  * Listado de ventas cerradas desde el chat con detalle de cliente, SKU, total y fecha.

### 2. Motor Conversacional (`js/bot-engine.js`)
* Normalización léxica (limpieza de tildes, mayúsculas y puntuación).
* Extractor de entidades SKU (vía expresiones regulares y matching en catálogo).
* Resolución condicional de stock (Stock disponible vs. Agotado vs. SKU no registrado).
* Expansión semántica mediante diccionario de sinónimos.
* Priorización de reglas de restricción (seguridad conversacional).
* Flujo guiado de checkout conversacional (nombre -> dirección -> teléfono -> confirmación).
* Escalamiento a asesor humano y soporte de consultas simuladas por audio.

---

## 📁 Estructura del Proyecto

```
smakbot-demo/
├── index.html            # Simulador de chat comercial (estilo WhatsApp Web)
├── admin.html            # Panel de negocio y administración de reglas
├── app-chat.js           # Controlador del simulador de chat
├── app-admin.js          # Controlador del panel de administración
├── js/
│   ├── seed-data.js      # Datos iniciales (tenants, productos con SKU, reglas, sinónimos)
│   ├── storage-facade.js # Capa de persistencia (Fachada de Storage)
│   └── bot-engine.js     # Motor de inferencia y coincidencia de intenciones
└── README.md             # Documentación técnica
```
