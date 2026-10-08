# SMAKBOT · Demo interactiva

Prototipo de chat comercial y panel de administración, implementado con HTML, Tailwind CSS CDN y módulos JavaScript nativos. Los datos se guardan en localStorage del navegador; no se necesita backend.

## Abrir la demo

Los módulos ES no suelen ejecutarse al abrir un HTML con doble clic (file://). Sirve esta carpeta desde un servidor local, por ejemplo con Live Server en VS Code, y abre index.html. También puedes iniciar un servidor estático con python -m http.server 8000 y visitar http://localhost:8000.

Abre admin.html en otra pestaña del mismo navegador para editar el negocio. Los cambios y pedidos se sincronizan entre pestañas del mismo origen. Los tenants iniciales son SMAK Muebles y Calzado Express.

## Flujos incluidos

- Consulta de precio, medidas, peso/resistencia, disponibilidad, fotos, envío y políticas para Roatán.
- Preferencia de voz y reproductor HTML5 de audio simulado.
- Captura de nombre, dirección y teléfono, más confirmación de compra.
- Transferencia simulada a asesor humano.
- Edición de catálogo, imágenes, FAQs y sinónimos; vista de pedidos recientes.
- Botón para cargar seis pedidos ficticios de prueba entre los dos negocios.

Las imágenes de archivos locales se conservan como datos locales en el navegador. No se cargan a Cloudinary; para la demo puedes pegar una URL de imagen en el catálogo.


