# SMAK Honduras — Showroom Web App (SWAP)

Aplicación web vitrina comercial (Single Page Web App - SWAP) para **SMAK Honduras**, diseñada con una estética prémium *Warm Minimalist & Industrial Chic* para mobiliario contemporáneo, sillas Tolix, sillas ejecutivas y accesorios del hogar y oficina.

## 🚀 Características Principales

* **Identidad de Marca Prémium**: Paleta sobria (Deep Slate, Warm Amber, Blanco cálido) y tipografía moderna (*Outfit* y *Plus Jakarta Sans*).
* **Catálogo Desacoplado (`js/products.js`)**: Facilidad total para agregar, editar o remover productos sin tocar la estructura HTML/CSS.
* **Integración Directa con WhatsApp**: Cada producto cuenta con un botón directo a WhatsApp (`+504 9800-8559`) con un mensaje automático pre-llenado indicando el nombre exacto del artículo.
* **Cero Fricción de Compra**: Sin precios visibles ni carritos complejos; enfocado 100% en contacto directo y cotización inmediata.
* **Filtros Dinámicos e Instantáneos**: Navegación por categorías con conteo de existencias en tiempo real.
* **Buscador en Vivo**: Filtro predictivo por nombre, categoría y características.
* **Modal de Vista Rápida (*Quick View*)**: Galería de fotos con selector de miniaturas y detalles técnicos.
* **SEO & Accesibilidad**: Semántica HTML5, metadatos OpenGraph, Twitter Cards y Schema.org JSON-LD (`FurnitureStore`).
* **100% Responsive**: Diseñado con enfoque móvil, tablet y monitores de alta resolución.

## 📁 Estructura del Proyecto

```
SWAP_smak/
├── index.html              # Estructura semántica, SEO y componentes principales
├── css/
│   ├── main.css            # Sistema de diseño, tokens, componentes y animaciones
│   └── responsive.css      # Adaptabilidad para smartphones y tablets
├── js/
│   ├── products.js         # CATÁLOGO DE PRODUCTOS & CONFIGURACIÓN
│   └── app.js              # Lógica de la SWAP (filtros, buscador, modal y WhatsApp)
├── assets/
│   ├── logo.svg            # Isotipo y logotipo oficial vectorial de SMAK
│   ├── favicon.svg         # Favicon institucional
│   └── showroom.jpg        # Fotografía arquitectónica en alta definición
└── products_catalog.json   # Base de datos original en JSON
```

## 🛠️ Cómo Administrar el Catálogo

Toda la información de productos se gestiona desde `js/products.js`. 

### Agregar un nuevo producto:
Añade un objeto dentro del arreglo `SMAK_PRODUCTS`:
```javascript
{
  id: "nuevo-modelo-1",
  name: "Nombre del Producto",
  category: "Sillas y Bancos", // Opciones: "Sillas y Bancos", "Muebles y Organización", "Cocina y Baño", "Escaleras", "Salud y Cuidado"
  badge: "",
  inStock: true,
  image: "https://enlace-a-foto.jpg",
  gallery: [
    "https://enlace-a-foto.jpg",
    "https://enlace-a-foto-2.jpg"
  ],
  description: "Descripción detallada del artículo...",
  features: [
    "Materiales de alta durabilidad",
    "Garantía directa de SMAK Honduras",
    "Envíos disponibles a toda Honduras"
  ]
}
```

---
© 2026 SMAK Honduras. Todos los derechos reservados.
