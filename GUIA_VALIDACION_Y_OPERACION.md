# 📘 Guía Maestra de Validación y Operación · SMAKBOT Core

Este documento contiene las instrucciones detalladas paso a paso para probar, validar y operar todos los módulos del sistema **SMAKBOT**:
1. [Webhook de WhatsApp Business (Simulación Local, Sandbox Meta y Cuenta Real)](#1-webhook-de-whatsapp-business-cloud-api)
2. [Validación del Chatbot en una SWAP / SPA (Web Chat con Dual Bridge)](#2-validación-del-chatbot-en-una-swap--spa)
3. [Panel Administrativo con Usuario y Contraseña (SaaS Backoffice)](#3-panel-administrativo-saas-backoffice-con-usuario-y-contraseña)
4. [Transcripción y Respuestas en Audio (STT Whisper & TTS WhatsApp Waveform)](#4-transcripción-y-respuestas-en-audio-stt--tts)

---

## 1. Webhook de WhatsApp Business (Cloud API)

El sistema soporta de forma nativa la API oficial de **Meta WhatsApp Cloud API**, incluyendo:
- **Apretón de manos (`GET /api/v1/whatsapp/webhook`):** Validación de token y devolución de `hub.challenge`.
- **Ingesta de eventos (`POST /api/v1/whatsapp/webhook`):** Recepción de mensajes de texto, notas de voz, ubicaciones GPS y clics de botones interactivos (< 300ms SLA).
- **Modo Sandbox Saliente:** Cuando no se configuran credenciales de Meta, el backend imprime la respuesta en consola simulando la entrega al cliente sin incurrir en costos ni errores de red.

---

### A. Cómo validar localmente SIN conectar a Meta (100% Offline / Sandbox)

El backend de Spring Boot incluye un perfil `dev` con configuración de sandbox pre-cargada (`verify_token: smakbot-verify-dev`).

#### 1. Ejecutar la Suite de Pruebas Automatizadas
Hemos preparado un script en Node.js que simula los 5 eventos oficiales de WhatsApp en 1 segundo:
```bash
node scratch/test-wa-full-simulation.mjs
```

**Resultado esperado en consola:**
```text
==================================================================
 SIMULADOR DE WEBHOOK META WHATSAPP BUSINESS - MODO LOCAL / SANDBOX
==================================================================

1. TEST: Handshake de Verificación (GET /api/v1/whatsapp/webhook)
   -> HTTP Status: 200
   -> Retorno Challenge: 9876543210_CHALLENGE
   -> ¿Aprobado por Meta?: ✅ SÍ

TEST: 2. Recepción de Mensaje de Texto (Consulta Silla Wynn)
   -> Respuesta HTTP Meta Inmediata (<300ms SLA): 200 [EVENT_RECEIVED]
TEST: 3. Recepción de Nota de Voz de Audio (Media audio_perchero)
   -> Respuesta HTTP Meta Inmediata (<300ms SLA): 200 [EVENT_RECEIVED]
TEST: 4. Recepción de Ubicación GPS de WhatsApp
   -> Respuesta HTTP Meta Inmediata (<300ms SLA): 200 [EVENT_RECEIVED]
TEST: 5. Recepción de Clic de Botón Interactivo
   -> Respuesta HTTP Meta Inmediata (<300ms SLA): 200 [EVENT_RECEIVED]
```

**Respuesta interna procesada por el motor conversacional (verificable en los logs del backend):**
```text
[SANDBOX META WA IMAGE] -> Para: 50499887766 | URL: https://images.unsplash.com/...
¡Sí, tenemos disponible! Del SKU SKM-959-CA-NE (Sillón Ejecutivo Miles) nos quedan 179 unidades a L.3,390.

[SANDBOX META WA] -> Para: 50499887766 | Mensaje:
¡Ubicación detectada! 📍 Veo que te encuentras en Frente a Embajada Americana, Tegucigalpa, Honduras.
✅ Cobertura de Entrega: ¡Sí, tenemos cobertura completa a domicilio con Cargo Expreso!
```

#### 2. Probar mediante Swagger UI (Desde el Navegador)
1. Abre tu navegador en: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
2. Busca la sección **WhatsApp Cloud API Webhook**:
   - `GET /api/v1/whatsapp/webhook`:
     - Pulsa **Try it out**.
     - `hub.mode`: `subscribe`
     - `hub.verify_token`: `smakbot-verify-dev`
     - `hub.challenge`: `12345`
     - Pulsa **Execute** -> Retornará `200 OK` con cuerpo `12345`.
   - `POST /api/v1/whatsapp/webhook`:
     - Pega el JSON del evento y ejecuta para recibir `200 OK EVENT_RECEIVED`.

#### 3. Probar a mano con cURL o PowerShell
```powershell
# Probar Handshake GET
curl -i "http://localhost:8080/api/v1/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=smakbot-verify-dev&hub.challenge=887766"

# Probar Mensaje POST
curl -i -X POST "http://localhost:8080/api/v1/whatsapp/webhook" `
  -H "Content-Type: application/json" `
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "id": "SANDBOX_WABA_ID",
      "changes": [{
        "field": "messages",
        "value": {
          "messaging_product": "whatsapp",
          "metadata": { "phone_number_id": "SANDBOX_PHONE_NUMBER_ID" },
          "contacts": [{ "profile": { "name": "Prueba Local" } }],
          "messages": [{
            "from": "50499887766",
            "id": "wamid.001",
            "type": "text",
            "text": { "body": "Hola, ¿cuánto cuesta el sillón ejecutivo?" }
          }]
        }
      }]
    }]
  }'
```

---

### B. Paso a Paso: Cómo conectar una cuenta SANDBOX de Meta (Test Number)

Meta for Developers ofrece un número de teléfono de prueba gratuito para desarrolladores.

1. **Crear App en Meta Developers:**
   - Ingresa a [developers.facebook.com](https://developers.facebook.com) e inicia sesión.
   - Ve a **Mis Apps > Crear App**.
   - Selecciona **Otro > Empresa (Business)**.
   - Agrega el producto **WhatsApp** a tu app.
2. **Obtener las Credenciales de Prueba:**
   - En el menú lateral, ve a **WhatsApp > Configuración de la API (API Setup)**.
   - Copia los siguientes valores:
     - **Identificador de número de teléfono (Phone Number ID)** (ej: `105938472910482`).
     - **Identificador de cuenta de WhatsApp Business (WABA ID)** (ej: `102938475610293`).
     - **Token de acceso temporal (Temporary Access Token)** (caduca a las 24 horas).
3. **Exponer tu puerto 8080 a Internet con HTTPS (Ngrok):**
   Meta exige que el webhook sea `https://` público:
   ```bash
   ngrok http 8080
   ```
   Copia la URL pública generada (ej: `https://a1b2-c3d4.ngrok-free.app`).
4. **Configurar el Webhook en el portal de Meta:**
   - En Meta Developers, ve a **WhatsApp > Configuración**.
   - En la sección **Webhook**, pulsa **Editar**:
     - **URL de devolución de llamada (Callback URL):**  
       `https://a1b2-c3d4.ngrok-free.app/api/v1/whatsapp/webhook`
     - **Token de verificación (Verify Token):**  
       `smakbot-verify-dev`
   - Pulsa **Verificar y Guardar**. Meta enviará el `GET` de comprobación y aparecerá una tilde verde ✅.
   - En la tabla de campos, pulsa **Administrar** y suscríbete al evento `messages`.
5. **Vincular el Phone Number ID en tu Base de Datos PostgreSQL:**
   Ejecuta en tu base de datos `smakbot_db`:
   ```sql
   INSERT INTO whatsapp_configs (tenant_id, phone_number_id, waba_id, access_token, verify_token)
   VALUES ('tenant-hn-muebles', 'TU_PHONE_NUMBER_ID', 'TU_WABA_ID', 'TU_ACCESS_TOKEN_TEMPORAL', 'smakbot-verify-dev')
   ON CONFLICT (tenant_id) 
   DO UPDATE SET phone_number_id = EXCLUDED.phone_number_id, access_token = EXCLUDED.access_token;
   ```
6. **Activar envíos salientes reales en Spring Boot:**
   En `backend/src/main/resources/application.yml`:
   ```yaml
   smakbot:
     meta:
       outbound-enabled: true # Cambiar a true para despachar a los servidores de Meta
   ```
7. **Probar desde tu WhatsApp:**
   - En el panel de Meta, en el campo **"Para"**, agrega tu número de WhatsApp personal para recibir mensajes de prueba.
   - Envía un mensaje desde tu WhatsApp al número de prueba de Meta. El bot responderá en tu teléfono automáticamente.

---

### C. Paso a Paso: Cómo conectar una cuenta REAL de WhatsApp en Producción

Para operar con tu número telefónico oficial en vivo:

1. **Requisitos Previos de Meta:**
   - Cuenta de **Meta Business Manager** verificada con razón social y RTN de tu empresa.
   - Número de teléfono exclusivo para el bot (no debe estar registrado en WhatsApp Messenger ni WhatsApp Business móvil; si lo está, debes eliminar la cuenta desde los ajustes de WhatsApp en el celular antes de asociarlo a Cloud API).
2. **Asociar el Número Oficial:**
   - En Meta Business Manager, ve a **Cuentas de WhatsApp > Números de teléfono > Agregar número**.
   - Ingresa el nombre para mostrar (ej: *SMAK Muebles*) y verifica el número mediante SMS o llamada.
3. **Generar un Token de Acceso Permanente (System User Token):**
   - No uses el token de 24 horas en producción.
   - En Meta Business Manager > **Usuarios del sistema (System Users)**:
     - Crea un usuario de sistema con rol **Administrador**.
     - Asigna el activo de la cuenta de WhatsApp con control total.
     - Haz clic en **Generar nuevo token**:
       - Expiración: **Nunca (Never)**.
       - Permisos: `whatsapp_business_messaging` y `whatsapp_business_management`.
     - Guarda el token de forma segura.
4. **Despliegue del Backend:**
   - Despliega el backend en tu servidor de producción (VPS, AWS, DigitalOcean, Hetzner, etc.) con dominio propio y certificado SSL (ej: `https://api.tudominio.com`).
5. **Configurar el Webhook en Producción:**
   - Callback URL: `https://api.tudominio.com/api/v1/whatsapp/webhook`
   - Verify Token: Genera un token seguro y confidencial (ej: `prod-smak-token-2026-xyz`).
6. **Insertar Configuración en PostgreSQL:**
   ```sql
   INSERT INTO whatsapp_configs (tenant_id, phone_number_id, waba_id, access_token, verify_token)
   VALUES ('tenant-hn-muebles', 'PHONE_ID_PRODUCCION', 'WABA_ID_PRODUCCION', 'TOKEN_PERMANENTE_PRODUCCION', 'prod-smak-token-2026-xyz');
   ```

---

## 2. Validación del Chatbot en una SWAP / SPA

El sistema incluye una **SPA (Single Web Application)** desarrollada en **Angular 20**, dotada del **Patrón Dual Bridge** de SyborX.

### A. ¿Qué es el Patrón Dual Bridge y cómo alternarlo?

El widget puede operar en dos modos mediante inyección de dependencias en `frontend/src/app/app.config.ts`:

1. **Modo 1: HTTP Real (Spring Boot + PostgreSQL)** - *Configuración por defecto*
   ```typescript
   { provide: CHAT_WIDGET_REPOSITORY_PORT, useClass: ChatHttpAdapter }
   ```
   Se comunica vía REST con `http://localhost:8080/api/v1/chat/message`. Las órdenes se guardan en la tabla `orders` de PostgreSQL.
2. **Modo 2: Local / Oráculo (Offline)**
   ```typescript
   { provide: CHAT_WIDGET_REPOSITORY_PORT, useClass: ChatLocalStorageAdapter }
   ```
   Opera 100% en el navegador utilizando `localStorage`. Ideal para demostraciones sin backend ni conexión a internet.

---

### B. Cómo levantar y abrir la aplicación

1. **Asegúrate de que el Backend esté corriendo:**
   - Spring Boot corre en `http://localhost:8080`.
   - Verifica su estado con: `curl http://localhost:8080/actuator/health` (debe responder `{"status":"UP"}`).
2. **Iniciar el servidor de desarrollo de Angular:**
   ```bash
   cd frontend
   npm run dev
   ```
3. **Abrir el Chatbot:**
   Ingresa a: [http://localhost:4200/chat](http://localhost:4200/chat) (o [http://localhost:8000/index.html](http://localhost:8000/index.html) para la landing page).

---

### C. Flujo de Prueba Paso a Paso (Embudo de Ventas Completo)

1. **Consulta Inicial y Catálogo:**
   - Haz clic en la sugerencia rápida: `"Quiero comprar la silla Wynn"` o escribe: *"¿Qué precio tiene la silla Wynn?"*.
   - El bot consulta el inventario en PostgreSQL y responde con:
     - Nombre oficial: **Silla Ergonómica Wynn con Apoyapiés**
     - SKU: `SKM-956-CA-NE`
     - Precio: `L. 2,950`
     - Stock en tiempo real y fotografía del producto.
2. **Iniciar Checkout:**
   - Escribe: *"Quiero comprarla"* o haz clic en el botón *"Comprar Ahora"*.
   - El bot te preguntará: *"¿A qué nombre registramos tu pedido?"*.
3. **Registro de Nombre:**
   - Escribe tu nombre: *"María José Rodríguez"*.
   - El bot solicitará tu dirección de entrega o ubicación GPS.
4. **Validación de Cobertura y Dirección (o GPS):**
   - Escribe: *"Colonia Florencia Sur, calle principal casa 4, Tegucigalpa"*.
   - El bot detecta la cobertura con **Cargo Expreso** y solicita tu número de teléfono de contacto.
5. **Teléfono y Generación de Orden:**
   - Escribe: *"9988-7766"*.
   - El bot emite la orden de compra formal con formato `SMAK-ORD-XXXX`, confirmando:
     - Pago en efectivo contra entrega.
     - Producto y monto total en Lempiras.
   - Esta orden queda guardada en PostgreSQL y visible de inmediato en el panel administrativo.

---

## 3. Panel Administrativo (SaaS Backoffice) con Usuario y Contraseña

El panel administrativo permite gestionar los pedidos de todos los comercios registrados (*Multitenant*), asignar guías de despacho de Cargo Expreso y administrar el catálogo.

### A. Acceso y Autenticación (Login Gate)

1. Abre tu navegador en: [http://localhost:4200/admin](http://localhost:4200/admin) (o [http://localhost:8000/admin.html](http://localhost:8000/admin.html)).
2. El sistema presentará la pantalla de inicio de sesión protegida:
   - **Usuario / Correo:** `admin` (o `admin@smakbot.com`)
   - **Contraseña:** `admin123` (o `smak2026`)
3. **Prueba de Validación de Credenciales:**
   - Ingresa una contraseña incorrecta y pulsa *Ingresar al Panel*.
   - Aparecerá la alerta: `⚠️ Credenciales incorrectas. Verifique usuario o contraseña.`
   - Ingresa la clave correcta `admin123`. El panel se desbloqueará y guardará tu sesión en `localStorage`.
   - Para cerrar sesión en cualquier momento, pulsa el botón rojo **🚪 Salir** en la esquina superior derecha.

---

### B. Funcionalidades del Backoffice

#### 1. Conmutador Multitenant (Comercio Activo)
En la barra superior puedes alternar entre comercios:
- **Muebles Elegancia HN 🛋️** (`tenant-hn-muebles`)
- **Calzado y Moda HN 👟** (`tenant-hn-calzado`)
Al cambiar de comercio, tanto el tablero Kanban de pedidos como el catálogo se filtran automáticamente en base al tenant seleccionado.

#### 2. Tablero Kanban de Pedidos
El tablero organiza las compras en 3 columnas:
- **⏳ Pendientes por Despacho:**
  - Contiene los pedidos recién creados por los clientes desde el Web Chat o WhatsApp.
  - Muestra el código de orden, nombre del cliente, teléfono, dirección, SKU y monto total en Lempiras.
  - **Acción:** Pulsa el botón azul **🚚 Despachar Pedido**.
- **Modal de Despacho y Guía de Rastreo:**
  - Se genera automáticamente el número de guía de **Cargo Expreso** (ej: `CAEX-HN-849201`).
  - Estado: `EN_CAMINO`.
  - Pulsa **Confirmar Despacho**. La orden se actualiza en PostgreSQL mediante `PATCH /api/v1/admin/orders/{id}/status`.
- **🚚 En Camino:**
  - Muestra los pedidos despachados con su transportista y código de seguimiento visible.
- **✅ Entregados:**
  - Histórico de pedidos finalizados con éxito.

#### 3. Pestaña de Catálogo de Productos
- Cambia a la pestaña **🏷️ Catálogo de Productos**.
- Muestra el listado de productos sincronizado con la base de datos PostgreSQL:
  - SKU, Nombre, Categoría, Stock actual, Precio Normal y Precio de Venta.

---

## 4. Transcripción y Respuestas en Audio (STT & TTS)

SMAKBOT cuenta con capacidades omnicanal de audio completas:
1. **STT (Speech-to-Text):** Transcripción automática de notas de voz enviadas por el usuario mediante **Whisper**.
2. **TTS (Text-to-Speech):** Síntesis de voz con reproductor interactivo estilo WhatsApp para las respuestas del bot.

---

### A. Cómo Probar la Transcripción de Audio del Usuario (STT)

Existen dos maneras de probarlo en el Chat Widget ([http://localhost:4200/chat](http://localhost:4200/chat)):

#### Opción 1: Con Micrófono Real del Navegador
1. En la barra inferior del chat, haz clic en el botón circular verde del micrófono `🎙️`.
2. El navegador solicitará permisos de micrófono. Selecciona **Permitir**.
3. El botón cambiará a un indicador rojo parpadeante `⏹️ Detener Grabación`.
4. Habla por tu micrófono:
   > *"Hola buenas tardes, me gustaría saber si tienen disponible la silla rom gamer y qué colores tienen."*
5. Haz clic nuevamente en `⏹️ Detener Grabación`.
6. En la pantalla verás la tarjeta de audio del usuario con el mensaje animado:  
   `🎙️ Transcribiendo audio con Whisper...`
7. Al completar la transcripción, el texto reconocido se enviará automáticamente al bot, quien responderá con la información del producto.

#### Opción 2: Con Audios Pregrabados de Prueba (Sin Micrófono)
Para validar el pipeline aunque no tengas micrófono disponible, en la parte inferior del chat se incluyen botones de muestra:
- Pulsa **`🎙️ Probar Audio: Perchero`**
  - Se simula la nota de voz: *"Hola buenas tardes, quería consultar si tienen el perchero disponible y cuánto tiempo se tardan en venir a dejarlo a la casa"*.
  - El bot responderá con la disponibilidad y tiempo de entrega de Cargo Expreso.
- Pulsa **`🎙️ Probar Audio: Regadera`**
  - Se simula la nota de voz de consulta sobre regaderas y drenajes lineales.

---

### B. Cómo Probar la Respuesta en Audio del Bot (TTS & WhatsApp Waveform)

Cuando el bot responde a una consulta, genera un **reproductor de nota de voz interactivo estilo WhatsApp**:

1. **Elementos del Reproductor:**
   - **Botón Play / Pause circular verde (`▶` / `⏸`):** Inicia o pausa la reproducción del mensaje.
   - **Onda Sonora Interactiva (Waveform):** 26 barras de audio que reflejan la forma de onda acústica. Las barras ya escuchadas se tiñen de verde esmeralda y las pendientes permanecen en gris.
   - **Temporizador Dinámico:** Muestra el tiempo transcurrido y la duración total estimada (`0:00 / 0:08`).
   - **Selector de Velocidad de Reproducción:** Botón interactivo que conmuta entre `1.0x`, `1.5x` y `2.0x`.
2. **Pasos para Validarlo:**
   - Haz clic en `▶` en cualquier mensaje del bot.
   - Escucharás la voz sintetizada en español neutro leyendo el mensaje.
   - Observa cómo la barra de progreso avanza sincronizada con el audio.
   - Haz clic en el botón `1.0x`: cambiará a `1.5x` y el ritmo de voz aumentará de inmediato.
   - Vuelve a hacer clic para probar `2.0x`.
   - Haz clic en `⏸` para pausar la reproducción en cualquier segundo.

---

## 5. Resumen de Puertos y URLs del Ecosistema

| Servicio | URL / Endpoint | Función Principal |
| :--- | :--- | :--- |
| **Frontend Angular (SPA)** | [http://localhost:4200](http://localhost:4200) | Chatbot de cliente (`/chat`) y Backoffice SaaS (`/admin`) |
| **Backend Spring Boot** | [http://localhost:8080](http://localhost:8080) | API REST multitenant y Webhook de Meta |
| **Documentación Swagger** | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) | Pruebas interactivas de endpoints y webhook |
| **Landing Page Demo (Python)** | [http://localhost:8000/index.html](http://localhost:8000/index.html) | Prototipo / Oráculo de fidelidad visual |
| **Base de Datos PostgreSQL** | `localhost:5432/smakbot_db` | Persistencia de tenants, productos, órdenes y configs |
| **Webhook WhatsApp** | `/api/v1/whatsapp/webhook` | Recepción de eventos y handshake con Meta Cloud API |
