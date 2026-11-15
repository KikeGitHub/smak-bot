# ADR-005: Gobernanza de Tono Plano, Sanitización Léxica y Políticas Logísticas de Honduras

- **Estado:** Aceptado e Implementado
- **Fecha:** 2026-11-14
- **Autor:** Arquitecto de Software Principal & Senior Lead Engineer (SyborX / SDOP Framework)
- **Contexto:** Motor Conversacional Comercial SMAKBOT (Canales WhatsApp Cloud API y Web Widget)

---

## 1. Contexto y Planteamiento del Problema

Durante la fase de pruebas y despliegue en producción con clientes reales en Honduras, el usuario comercial identificó fricciones conversacionales y logísticas críticas:
1. **Contaminación visual y modismos inadecuados:**
   - Respuestas saturadas de emojis infantiles o informales que restaban seriedad a la marca.
   - Uso excesivo de texto en negrita (`*texto*`, `**texto**`), que en WhatsApp generaba ruido visual y aspecto sobrecargado.
   - Uso de muletillas coloquiales como *"Fíjate que..."*, percibidas como poco directas o no asertivas.
   - Exposición de códigos SKU internos al cliente (ej. *"ZGM-030-NE-NE"*), confusos para el comprador final.
   - Mensajes finales redundantes o ambiguos como *"muchas gracias si la quiero"*.
2. **Petición de rebajas o mención de precios anteriores:**
   - La IA tendía a negociar o mencionar precios de lista anteriores (*"Antes: L. 3,400, ahora L. 2,950"*), lo que invitaba al cliente a regatear. La política de la empresa es **precio fijo no negociable**.
3. **Desalineación logística con Cargo Expreso:**
   - Promesas imprecisas de entrega inmediata que generaban quejas de clientes cuando Cargo Expreso sufría demoras.
   - Falta de un protocolo claro para pedidos solicitados con entrega en **sábado** (día en que Cargo Expreso labora media jornada).
   - Clientes solicitando entregas en fechas o días específicos en los que la empresa no puede comprometerse al 100%.

---

## 2. Decisiones de Arquitectura y Negocio

### 2.1. Erradicación Determinista de Emojis, Negritas, SKU y Muletillas
Se implementa una política dual (Prompt IA + Sanitizador Determinista en Backend):
- **Prompt OpenAI (`OpenAiSalesAssistantAdapter`):**
  - Prohibición estricta de emojis de cualquier tipo.
  - Prohibición estricta de asteriscos o negritas.
  - Prohibición de la frase *"Fíjate que"*.
  - Prohibición de exponer SKUs al cliente en el texto de respuesta.
- **Sanitizador Determinista (`HondurasDeliveryPolicy.sanitizeCustomerReply`):**
  - Todo mensaje generado por la IA o por plantillas pasa por un filtro de expresiones regulares que erradica:
    - Emojis Unicode (rangos de emoticonos, símbolos misceláneos, transporte y pictogramas).
    - Asteriscos y formateo de negrita/cursiva (`*` y `**`).
    - Patrones de SKU (`[A-Z]{2,4}-\d{2,4}-[A-Z0-9-]+`).
    - Frases como *"Fíjate que..."* y derivados.
    - Corrección de mensajes mal formateados de confirmación (*"muchas gracias si la quiero"*).

### 2.2. Política de Precios Fijos
- El bot presenta **únicamente el precio actual fijo** con envío gratis incluido.
- Queda prohibido mencionar precios tachados, descuentos temporales o aceptar regateos: *"Los precios son fijos y ya incluyen el envío gratis por Cargo Expreso a nivel nacional"*.

### 2.3. Ventanas de Entrega Realistas con Cargo Expreso
Para mitigar quejas por demoras de la paquetería:
1. **Regla General Nacional:**
   - Tiempo de entrega estándar: **"entre 2 y 3 días hábiles, lo más seguro"**.
   - Se utiliza la frase *"lo más seguro"* para calibrar expectativas realistas sin asegurar infalibilidad.
2. **Excepción de 6 Ciudades Prioritarias:**
   - Únicamente para direcciones ubicadas en:
     1. **El Progreso (Yoro)**
     2. **San Pedro Sula (Cortés)**
     3. **Santa Rosa de Copán**
     4. **Tegucigalpa (Francisco Morazán)**
     5. **La Ceiba (Atlántida)**
     6. **Choloma (Cortés)**
   - Se permite comunicar: **"entre 1 y 2 días hábiles, lo más seguro"**.
3. **Fechas Específicas:**
   - Si el cliente solicita entrega en un día o fecha concreta, se aclara que no es posible comprometerse al 100% en fecha fija porque la ruta depende de la logística de Cargo Expreso y la empresa solo maneja fechas estimadas.
4. **Protocolo para Sábados:**
   - Si el cliente solicita entrega en sábado:
     a) Se explica que Cargo Expreso solo labora medio turno ese día, por lo que es difícil garantizar llegada en esa fecha concreta.
     b) Se ofrece la opción de envío a **Agencia de Cargo Expreso** de su ciudad para retiro directo (aclarando que no en todas las localidades hay agencia).
     c) Se consulta amablemente si vive con su pareja, familiar o alguien de confianza que pueda estar en casa entre semana para recibir y pagar contra entrega.

---

## 3. Consecuencias y Beneficios

### Positivas:
- **Profesionalismo y Legibilidad:** Mensajes limpios, elegantes y directos en texto plano tanto en WhatsApp como en el widget web.
- **Reducción de Reclamos Operativos:** Las expectativas de entrega se alinean exactamente con el rendimiento de Cargo Expreso.
- **Cero Negociaciones Infructuosas:** Los clientes conocen el precio final neto de inmediato sin regateos.
- **Resiliencia Operativa:** Si el LLM genera por error un emoji o un asterisco, el sanitizador determinista de Java lo elimina antes de que toque la red o el chat del cliente.

### Neutras/Monitoreo:
- El clasificador geográfico debe mantenerse actualizado con las variantes ortográficas y abreviaturas de las 6 ciudades prioritarias de Honduras.
