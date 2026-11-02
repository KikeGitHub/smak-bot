-- =====================================================================
-- V4: Esquema y Seeds para Módulos Administrativos del Bot (SDOP Framework)
-- Módulos: Bot Rules, Diccionario de Sinónimos y Mapeo de Redes Sociales
-- =====================================================================

CREATE TABLE IF NOT EXISTS bot_rules (
    id VARCHAR(100) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    training_phrases JSONB NOT NULL DEFAULT '[]'::jsonb,
    response TEXT,
    response_in_stock TEXT,
    response_out_of_stock TEXT,
    response_not_found TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_bot_rules_tenant ON bot_rules(tenant_id);

CREATE TABLE IF NOT EXISTS synonyms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(50) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    concept VARCHAR(100) NOT NULL,
    words JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_concept UNIQUE (tenant_id, concept)
);
CREATE INDEX IF NOT EXISTS idx_synonyms_tenant ON synonyms(tenant_id);

CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(100) PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    channel VARCHAR(100),
    type VARCHAR(50),
    source_id VARCHAR(100),
    url TEXT NOT NULL,
    headline VARCHAR(255) NOT NULL,
    body TEXT,
    sku VARCHAR(60) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_campaigns_tenant ON campaigns(tenant_id);

-- ---------------------------------------------------------------------
-- SEED DATA: TENANT 'smak' Y ALIAS 'tenant-hn-muebles'
-- ---------------------------------------------------------------------
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('rule-stock-sku', 'smak', 'Consulta de Stock por SKU', 'Inventario', 'parametric', true, '["tienen stock para el sku {sku}","hay stock del sku {sku}","tienen stock de {sku}","hay stock para el sku {sku}","disponibilidad del sku {sku}","stock de {sku}","tienen {sku}","hay {sku}","tienen disponible {sku}","inventario de {sku}"]'::jsonb, NULL, '¡Sí, tenemos disponible! Del SKU **{sku}** ({name}) nos quedan **{stock} unidades** a precio de oferta L.{salePrice}. ¿Deseas hacer tu pedido ahora?', 'El producto **{name}** (SKU: {sku}) se encuentra actualmente **agotado**. 📦 Si gustas te anotamos para avisarte en la próxima reposición.', 'No encontré ningún producto con el SKU **{sku}** en nuestro inventario. Escribe *''ver catálogo''* para conocer nuestros códigos activos.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('tenant-hn-muebles-rule-stock-sku', 'tenant-hn-muebles', 'Consulta de Stock por SKU', 'Inventario', 'parametric', true, '["tienen stock para el sku {sku}","hay stock del sku {sku}","tienen stock de {sku}","hay stock para el sku {sku}","disponibilidad del sku {sku}","stock de {sku}","tienen {sku}","hay {sku}","tienen disponible {sku}","inventario de {sku}"]'::jsonb, NULL, '¡Sí, tenemos disponible! Del SKU **{sku}** ({name}) nos quedan **{stock} unidades** a precio de oferta L.{salePrice}. ¿Deseas hacer tu pedido ahora?', 'El producto **{name}** (SKU: {sku}) se encuentra actualmente **agotado**. 📦 Si gustas te anotamos para avisarte en la próxima reposición.', 'No encontré ningún producto con el SKU **{sku}** en nuestro inventario. Escribe *''ver catálogo''* para conocer nuestros códigos activos.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('rule-catalogo', 'smak', 'Ver Catálogo de Productos', 'Catálogo', 'static', true, '["ver catalogo","que productos tienen","cuales son los productos","muestrame que venden","lista de articulos","catalogo completo","que tienen en venta","mostrar muebles","lista de precios","que articulos tienen","que venden","ver muebles","catalogo de productos","cuales son sus productos","catalogo de sillas","muestrame el catalogo"]'::jsonb, 'Actualmente tenemos estos productos en catálogo:', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('tenant-hn-muebles-rule-catalogo', 'tenant-hn-muebles', 'Ver Catálogo de Productos', 'Catálogo', 'static', true, '["ver catalogo","que productos tienen","cuales son los productos","muestrame que venden","lista de articulos","catalogo completo","que tienen en venta","mostrar muebles","lista de precios","que articulos tienen","que venden","ver muebles","catalogo de productos","cuales son sus productos","catalogo de sillas","muestrame el catalogo"]'::jsonb, 'Actualmente tenemos estos productos en catálogo:', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('rule-envios', 'smak', 'Tiempos de Entrega a Domicilio', 'Envíos', 'static', true, '["como hacen los envios","cuanto tarda el envio","hacen entregas a domicilio","tiempo de entrega","cuanto se tardan en llegar","envian a domicilio","cuanto tiempo se tardan en venir a dejar","cuanto tardan en traerlo a la casa","a como me lo vienen a dejar","cuando me lo traen","cuantos dias se tardan","entrega a domicilio","hacen envios a todo honduras","cobertura nacional","llegan hasta mi casa","llega hoy","llega manana","cuando me llega","cuanto tardan en entregar"]'::jsonb, '🚚 **Tiempos de Entrega:** Tenemos envío a todos los lugares del país y realizamos la entrega entre 1 y 2 días posteriores a tu confirmación de pedido a través de Cargo Expreso con pago en efectivo contra entrega.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('tenant-hn-muebles-rule-envios', 'tenant-hn-muebles', 'Tiempos de Entrega a Domicilio', 'Envíos', 'static', true, '["como hacen los envios","cuanto tarda el envio","hacen entregas a domicilio","tiempo de entrega","cuanto se tardan en llegar","envian a domicilio","cuanto tiempo se tardan en venir a dejar","cuanto tardan en traerlo a la casa","a como me lo vienen a dejar","cuando me lo traen","cuantos dias se tardan","entrega a domicilio","hacen envios a todo honduras","cobertura nacional","llegan hasta mi casa","llega hoy","llega manana","cuando me llega","cuanto tardan en entregar"]'::jsonb, '🚚 **Tiempos de Entrega:** Tenemos envío a todos los lugares del país y realizamos la entrega entre 1 y 2 días posteriores a tu confirmación de pedido a través de Cargo Expreso con pago en efectivo contra entrega.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('rule-costo-envio', 'smak', 'Costo de Envío Gratis', 'Envíos', 'static', true, '["cuanto cuesta el envio","cuanto cobran de envio","costo de envio","precio del envio","cobran el flete","el envio es gratis","cuanto vale el flete","el flete es gratis","cuanto cobran de flete","cobran envio","cuanto cobran por mandarlo","hay que pagar envio","el envio tiene algun costo","cuanto se paga de flete","es gratis el envio"]'::jsonb, '🚚 **Costo de Envío:** ¡El envío es **completamente gratuito** a cualquier parte del país! Solo cancelas el valor del producto al recibirlo en efectivo.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('tenant-hn-muebles-rule-costo-envio', 'tenant-hn-muebles', 'Costo de Envío Gratis', 'Envíos', 'static', true, '["cuanto cuesta el envio","cuanto cobran de envio","costo de envio","precio del envio","cobran el flete","el envio es gratis","cuanto vale el flete","el flete es gratis","cuanto cobran de flete","cobran envio","cuanto cobran por mandarlo","hay que pagar envio","el envio tiene algun costo","cuanto se paga de flete","es gratis el envio"]'::jsonb, '🚚 **Costo de Envío:** ¡El envío es **completamente gratuito** a cualquier parte del país! Solo cancelas el valor del producto al recibirlo en efectivo.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('rule-forza', 'smak', 'Envíos por Forza u otra Paquetería', 'Envíos', 'static', true, '["haces envios por forza","hacen envios por forza","envian por forza","mandan por forza","otra paqueteria","haces envios por forza u otra paqueteria","pueden mandar por forza","usan forza","mandan por otra paqueteria","envian por caex o forza","usan fedex","trabajan con otra paqueteria","usan dhl"]'::jsonb, '📦 **Transportadora:** No, únicamente realizamos entregas a través de **Cargo Expreso**.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('tenant-hn-muebles-rule-forza', 'tenant-hn-muebles', 'Envíos por Forza u otra Paquetería', 'Envíos', 'static', true, '["haces envios por forza","hacen envios por forza","envian por forza","mandan por forza","otra paqueteria","haces envios por forza u otra paqueteria","pueden mandar por forza","usan forza","mandan por otra paqueteria","envian por caex o forza","usan fedex","trabajan con otra paqueteria","usan dhl"]'::jsonb, '📦 **Transportadora:** No, únicamente realizamos entregas a través de **Cargo Expreso**.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('rule-islands', 'smak', 'Entregas en Roatán, Útila e Islas de la Bahía', 'Envíos', 'static', true, '["envian a roatan","islas de la bahia","envios a ceiba","entregan en el muelle","hacen envios a guanaja","utila","roatan","entregas en roatan utila o isla de la bahia","muelle de cabotaje","ferry galaxy","utila dream","cuanto a roatan","envian a islas de la bahia","ferry galaxy wave","muelle de la ceiba","envios a islas"]'::jsonb, '🏝️ **Entregas en Roatán, Útila o Islas de la Bahía:**
Para Roatán o Útila, solo hacemos envíos con **transferencia previa**.
Una vez nos hace llegar el comprobante de transferencia bancaria, nosotros enviamos el producto hacia el **muelle de cabotaje de La Ceiba** con la indicación de subir el paquete al ferry que usted diga (Utila Dream, Galaxy Wave, etc.).
⚠️ **Nota:** No cubrimos el costo del ferry (corre por cuenta del cliente).', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('tenant-hn-muebles-rule-islands', 'tenant-hn-muebles', 'Entregas en Roatán, Útila e Islas de la Bahía', 'Envíos', 'static', true, '["envian a roatan","islas de la bahia","envios a ceiba","entregan en el muelle","hacen envios a guanaja","utila","roatan","entregas en roatan utila o isla de la bahia","muelle de cabotaje","ferry galaxy","utila dream","cuanto a roatan","envian a islas de la bahia","ferry galaxy wave","muelle de la ceiba","envios a islas"]'::jsonb, '🏝️ **Entregas en Roatán, Útila o Islas de la Bahía:**
Para Roatán o Útila, solo hacemos envíos con **transferencia previa**.
Una vez nos hace llegar el comprobante de transferencia bancaria, nosotros enviamos el producto hacia el **muelle de cabotaje de La Ceiba** con la indicación de subir el paquete al ferry que usted diga (Utila Dream, Galaxy Wave, etc.).
⚠️ **Nota:** No cubrimos el costo del ferry (corre por cuenta del cliente).', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('rule-tarjetas', 'smak', 'Pago con Tarjeta de Crédito / Débito', 'Pagos', 'static', true, '["aceptan tarjeta","aceptan tarjeta de credito","se puede pagar con tarjeta","pago con tarjeta","puedo pagar con tarjeta","tarjeta de debito","pago con tarjeta de debito","se puede con tarjeta","tienen terminal o pos","aceptan credomatic","tienen link de pago","aceptan visa","aceptan mastercard","tienen pos para pagar con tarjeta"]'::jsonb, '💳 **Forma de Pago con Tarjeta:** No aceptamos pagos con tarjeta, solo pago en efectivo contra entrega y se le paga al operador de Cargo Expreso o por transferencia electrónica previa, pero la transferencia debe confirmarse antes de realizar el envío.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('tenant-hn-muebles-rule-tarjetas', 'tenant-hn-muebles', 'Pago con Tarjeta de Crédito / Débito', 'Pagos', 'static', true, '["aceptan tarjeta","aceptan tarjeta de credito","se puede pagar con tarjeta","pago con tarjeta","puedo pagar con tarjeta","tarjeta de debito","pago con tarjeta de debito","se puede con tarjeta","tienen terminal o pos","aceptan credomatic","tienen link de pago","aceptan visa","aceptan mastercard","tienen pos para pagar con tarjeta"]'::jsonb, '💳 **Forma de Pago con Tarjeta:** No aceptamos pagos con tarjeta, solo pago en efectivo contra entrega y se le paga al operador de Cargo Expreso o por transferencia electrónica previa, pero la transferencia debe confirmarse antes de realizar el envío.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('rule-transferencia', 'smak', 'Pago con Transferencia Bancaria', 'Pagos', 'static', true, '["puedo pagar con transferencia","puedo pagar por transferencia","aceptan transferencia","pago con transferencia","transferencia bancaria","cuentas para transferir","datos de transferencia","cuenta de banco","como puedo transferir","a que cuenta transfiero","banco atlantida","bac credomatic","banco ficohsa","banpais","puedo transferir antes","pago por transferencia bancaria","tienen numero de cuenta","donde les puedo transferir"]'::jsonb, '🏦 **Pago con Transferencia:** Sí aceptamos pagos con transferencia pero se tendría que realizar previo al envío del paquete.

Cuentas empresariales oficiales a nombre de **SMAK Honduras S. de R.L.** (RTN: 08011990123456):
• BAC Credomatic (Cheques): 742-108-951
• Banco Ficohsa (Cheques): 2000-098-432
• Banco Atlántida (Ahorros): 110-045-892
• Banpaís (Cheques): 01-501-002345

Una vez realizado el depósito o transferencia, nos compartes el comprobante por este chat para proceder con el despacho inmediato.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('tenant-hn-muebles-rule-transferencia', 'tenant-hn-muebles', 'Pago con Transferencia Bancaria', 'Pagos', 'static', true, '["puedo pagar con transferencia","puedo pagar por transferencia","aceptan transferencia","pago con transferencia","transferencia bancaria","cuentas para transferir","datos de transferencia","cuenta de banco","como puedo transferir","a que cuenta transfiero","banco atlantida","bac credomatic","banco ficohsa","banpais","puedo transferir antes","pago por transferencia bancaria","tienen numero de cuenta","donde les puedo transferir"]'::jsonb, '🏦 **Pago con Transferencia:** Sí aceptamos pagos con transferencia pero se tendría que realizar previo al envío del paquete.

Cuentas empresariales oficiales a nombre de **SMAK Honduras S. de R.L.** (RTN: 08011990123456):
• BAC Credomatic (Cheques): 742-108-951
• Banco Ficohsa (Cheques): 2000-098-432
• Banco Atlántida (Ahorros): 110-045-892
• Banpaís (Cheques): 01-501-002345

Una vez realizado el depósito o transferencia, nos compartes el comprobante por este chat para proceder con el despacho inmediato.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('rule-pagos', 'smak', 'Métodos y Formas de Pago', 'Pagos', 'static', true, '["como puedo pagar","formas de pago","metodos de pago","aceptan pago contra entrega","puedo pagar en efectivo","como se paga","como es la forma de pago","puedo pagar en efectivo al recibir","se paga al recibir","pago contra entrega en efectivo","como seria el pago","le pago al que entrega","pago al recibir mi pedido"]'::jsonb, 'Aceptamos dos formas de pago:
1. **Efectivo contra entrega:** Le pagas directamente al motorista de Cargo Expreso al recibir en tu puerta.
2. **Transferencia bancaria electrónica previa:** Confirmada antes de despachar el paquete.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('tenant-hn-muebles-rule-pagos', 'tenant-hn-muebles', 'Métodos y Formas de Pago', 'Pagos', 'static', true, '["como puedo pagar","formas de pago","metodos de pago","aceptan pago contra entrega","puedo pagar en efectivo","como se paga","como es la forma de pago","puedo pagar en efectivo al recibir","se paga al recibir","pago contra entrega en efectivo","como seria el pago","le pago al que entrega","pago al recibir mi pedido"]'::jsonb, 'Aceptamos dos formas de pago:
1. **Efectivo contra entrega:** Le pagas directamente al motorista de Cargo Expreso al recibir en tu puerta.
2. **Transferencia bancaria electrónica previa:** Confirmada antes de despachar el paquete.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('rule-nuevas', 'smak', 'Condición: ¿Son nuevas?', 'Políticas', 'static', true, '["son nuevas","son nuevos","los muebles son nuevos","los productos son nuevos","es nuevo o de segunda","venden cosas usadas","los articulos son nuevos","vienen en caja sellada","son de segunda mano","son usados o nuevos","estado del producto","son 100% nuevos"]'::jsonb, '✨ **Condición del Producto:** Sí, todos nuestros productos son nuevos 100% de fábrica en su caja original sellada.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('tenant-hn-muebles-rule-nuevas', 'tenant-hn-muebles', 'Condición: ¿Son nuevas?', 'Políticas', 'static', true, '["son nuevas","son nuevos","los muebles son nuevos","los productos son nuevos","es nuevo o de segunda","venden cosas usadas","los articulos son nuevos","vienen en caja sellada","son de segunda mano","son usados o nuevos","estado del producto","son 100% nuevos"]'::jsonb, '✨ **Condición del Producto:** Sí, todos nuestros productos son nuevos 100% de fábrica en su caja original sellada.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('rule-garantia', 'smak', 'Garantía de Productos', 'Políticas', 'static', true, '["tienen garantia","cuanto tiempo de garantia","garantia","que garantia tienen","si viene quebrado","si sale defectuoso","que pasa si viene con defecto","si viene malo","tienen cambio o devolucion","respaldo de garantia","garantia de fabrica","si sale con falla"]'::jsonb, '🛡️ **Garantía:** Cuentan con garantía únicamente contra defectos de fabricación.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('tenant-hn-muebles-rule-garantia', 'tenant-hn-muebles', 'Garantía de Productos', 'Políticas', 'static', true, '["tienen garantia","cuanto tiempo de garantia","garantia","que garantia tienen","si viene quebrado","si sale defectuoso","que pasa si viene con defecto","si viene malo","tienen cambio o devolucion","respaldo de garantia","garantia de fabrica","si sale con falla"]'::jsonb, '🛡️ **Garantía:** Cuentan con garantía únicamente contra defectos de fabricación.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('rule-mejor-precio', 'smak', 'Mejor Precio / Descuento por Volumen', 'Precios', 'static', true, '["mejor precio","cual es el mejor precio","me dan descuento","hacen descuento","precio si compro varios","precio por mayor","rebaja","cuanto es lo menos","en cuanto me lo deja","rebaja si compro varios","precio especial de mayoreo","hacen descuento por volumen","precio para distribuidores","a como me lo deja si llevo dos"]'::jsonb, '🏷️ **Mejor Precio:** El precio especial sería equivalente a la cantidad de piezas solicitadas por el cliente. Si necesitas ordenar varias piezas o mayoreo, indícanos cuántas unidades deseas y con gusto te cotizamos.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('tenant-hn-muebles-rule-mejor-precio', 'tenant-hn-muebles', 'Mejor Precio / Descuento por Volumen', 'Precios', 'static', true, '["mejor precio","cual es el mejor precio","me dan descuento","hacen descuento","precio si compro varios","precio por mayor","rebaja","cuanto es lo menos","en cuanto me lo deja","rebaja si compro varios","precio especial de mayoreo","hacen descuento por volumen","precio para distribuidores","a como me lo deja si llevo dos"]'::jsonb, '🏷️ **Mejor Precio:** El precio especial sería equivalente a la cantidad de piezas solicitadas por el cliente. Si necesitas ordenar varias piezas o mayoreo, indícanos cuántas unidades deseas y con gusto te cotizamos.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('rule-ubicacion', 'smak', '¿Dónde se encuentran ubicados?', 'Ubicación', 'static', true, '["donde se encuentran ubicados","donde estan ubicados","direccion de la tienda","tienen tienda fisica","ubicacion de la tienda","donde queda el local","donde estan","puerto cortes","tienen sala de ventas","donde queda su tienda","direccion en puerto cortes","tienen tienda en tegucigalpa","tienen tienda en san pedro sula"]'::jsonb, '📍 **Ubicación Física:** Nos encontramos ubicados en **Plaza Krisale, Puerto Cortés, Honduras**.

¡Realizamos envíos gratuitos a domicilio a cualquier parte del país vía Cargo Expreso!', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('tenant-hn-muebles-rule-ubicacion', 'tenant-hn-muebles', '¿Dónde se encuentran ubicados?', 'Ubicación', 'static', true, '["donde se encuentran ubicados","donde estan ubicados","direccion de la tienda","tienen tienda fisica","ubicacion de la tienda","donde queda el local","donde estan","puerto cortes","tienen sala de ventas","donde queda su tienda","direccion en puerto cortes","tienen tienda en tegucigalpa","tienen tienda en san pedro sula"]'::jsonb, '📍 **Ubicación Física:** Nos encontramos ubicados en **Plaza Krisale, Puerto Cortés, Honduras**.

¡Realizamos envíos gratuitos a domicilio a cualquier parte del país vía Cargo Expreso!', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('rule-horarios-agencias', 'smak', 'Horarios de Entrega y Agencias Cargo Expreso', 'Envíos', 'static', true, '["a que hora llega mi paquete","en que horario me entregan","a que hora vienen","entregan en sabado","entregan los sabados","puedo recoger en agencia","retiro en agencia cargo expreso","entregan sabado por la tarde","puedo retirar en agencia","recoger en oficina de cargo expreso","horario de entrega de cargo expreso","a que hora pasa el repartidor","trabajan los sabados","agencia cargo expreso"]'::jsonb, '🚚 **Horarios y Agencias:** El repartidor de Cargo Expreso se pondrá en contacto contigo por llamada telefónica para coordinar el horario de entrega en tu domicilio (Lunes a Viernes de 8am a 5pm, Sábados medio día hasta las 12pm). Si necesitas horario específico, puedes solicitar retiro en cualquier oficina o agencia de Cargo Expreso de tu ciudad.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO bot_rules (id, tenant_id, name, category, type, enabled, training_phrases, response, response_in_stock, response_out_of_stock, response_not_found)
VALUES ('tenant-hn-muebles-rule-horarios-agencias', 'tenant-hn-muebles', 'Horarios de Entrega y Agencias Cargo Expreso', 'Envíos', 'static', true, '["a que hora llega mi paquete","en que horario me entregan","a que hora vienen","entregan en sabado","entregan los sabados","puedo recoger en agencia","retiro en agencia cargo expreso","entregan sabado por la tarde","puedo retirar en agencia","recoger en oficina de cargo expreso","horario de entrega de cargo expreso","a que hora pasa el repartidor","trabajan los sabados","agencia cargo expreso"]'::jsonb, '🚚 **Horarios y Agencias:** El repartidor de Cargo Expreso se pondrá en contacto contigo por llamada telefónica para coordinar el horario de entrega en tu domicilio (Lunes a Viernes de 8am a 5pm, Sábados medio día hasta las 12pm). Si necesitas horario específico, puedes solicitar retiro en cualquier oficina o agencia de Cargo Expreso de tu ciudad.', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  type = EXCLUDED.type,
  enabled = EXCLUDED.enabled,
  training_phrases = EXCLUDED.training_phrases,
  response = EXCLUDED.response,
  response_in_stock = EXCLUDED.response_in_stock,
  response_out_of_stock = EXCLUDED.response_out_of_stock,
  response_not_found = EXCLUDED.response_not_found;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('smak', 'precio', '["presio","rebaja","cuanto cuesta","cuanto vale","costo","valor","cotizacion","precio final","tarifa","descuento","a como sale","en cuanto sale","en cuanto me sale","que cuesta","cuanto es","que precio tiene","a como me lo deja","a como lo dan","a como esta","ultimo precio","precio neto","promocion","oferta","ofertas","lo menos","cuanto es lo menos","descuentos","rebajas","precio especial","precio por mayor","precio por mayoreo","si compro varios","precio de oferta"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('tenant-hn-muebles', 'precio', '["presio","rebaja","cuanto cuesta","cuanto vale","costo","valor","cotizacion","precio final","tarifa","descuento","a como sale","en cuanto sale","en cuanto me sale","que cuesta","cuanto es","que precio tiene","a como me lo deja","a como lo dan","a como esta","ultimo precio","precio neto","promocion","oferta","ofertas","lo menos","cuanto es lo menos","descuentos","rebajas","precio especial","precio por mayor","precio por mayoreo","si compro varios","precio de oferta"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('smak', 'stock', '["disponible","disponibilidad","existencia","inventario","unidades","quedan","hay","tienen","piezas","existencias","todavia tienen","aun tienen","les queda","en stock","stock real","tienen en existencia","tienen disponible","cuantas piezas quedan","cuantas unidades hay","tienen en bodega","hay disponible"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('tenant-hn-muebles', 'stock', '["disponible","disponibilidad","existencia","inventario","unidades","quedan","hay","tienen","piezas","existencias","todavia tienen","aun tienen","les queda","en stock","stock real","tienen en existencia","tienen disponible","cuantas piezas quedan","cuantas unidades hay","tienen en bodega","hay disponible"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('smak', 'dimensiones', '["dimenciones","dimencion","dimension","dimensiones","medidas","medida","mide","miden","medir","cuanto mide","cuanto miden","tamano","tamaño","talla","tallas","alto","altura","ancho","anchura","largo","longitud","profundidad","fondo","centimetros","metros","cm","mts","especificaciones","ficha tecnica"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('tenant-hn-muebles', 'dimensiones', '["dimenciones","dimencion","dimension","dimensiones","medidas","medida","mide","miden","medir","cuanto mide","cuanto miden","tamano","tamaño","talla","tallas","alto","altura","ancho","anchura","largo","longitud","profundidad","fondo","centimetros","metros","cm","mts","especificaciones","ficha tecnica"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('smak', 'peso', '["cuanto aguanta","cuanto soporta","resistencia","capacidad","soporta","kilos","libras","peso maximo","carga","peso soporta","que peso aguanta","soporte de peso","resiste","firmeza","capacidad de peso"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('tenant-hn-muebles', 'peso', '["cuanto aguanta","cuanto soporta","resistencia","capacidad","soporta","kilos","libras","peso maximo","carga","peso soporta","que peso aguanta","soporte de peso","resiste","firmeza","capacidad de peso"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('smak', 'fotos', '["fotos reales","imagenes","fotografias","galeria","mostrar fotos","ver","foto","ver catalogo con fotos","imagenes reales","foto real","fotos del producto","tienen fotos","mas fotos","mandame fotos","mostrar imagenes"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('tenant-hn-muebles', 'fotos', '["fotos reales","imagenes","fotografias","galeria","mostrar fotos","ver","foto","ver catalogo con fotos","imagenes reales","foto real","fotos del producto","tienen fotos","mas fotos","mandame fotos","mostrar imagenes"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('smak', 'envio', '["entrega","despacho","flete","cargo expreso","encomienda","paqueteria","domicilio","reparto","envios","entregas","cuanto tardan","cuando llega","tiempo de entrega","cobertura","a mi casa","a mi puerta","cuanto tiempo tarda","envian a","entregan en","envio gratis","flete gratis","venir a dejar","venirme a dejar","cuanto cobran de envio","precio de envio","costo de envio","envian a todo el pais"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('tenant-hn-muebles', 'envio', '["entrega","despacho","flete","cargo expreso","encomienda","paqueteria","domicilio","reparto","envios","entregas","cuanto tardan","cuando llega","tiempo de entrega","cobertura","a mi casa","a mi puerta","cuanto tiempo tarda","envian a","entregan en","envio gratis","flete gratis","venir a dejar","venirme a dejar","cuanto cobran de envio","precio de envio","costo de envio","envian a todo el pais"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('smak', 'pago', '["efectivo","transferencia","tarjeta","contra entrega","deposito","forma de pago","metodo de pago","cuotas","pagar","pagos","pagar al recibir","contraentrega","al recibir","le pago al motorista","como se paga","como puedo pagar","transfer","pago contra entrega","puedo transferir","transferencia bancaria","cuentas de banco","bac","ficohsa","atlantida","banpais","link de pago","tarjeta de credito","tarjeta de debito","efectivo al recibir"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('tenant-hn-muebles', 'pago', '["efectivo","transferencia","tarjeta","contra entrega","deposito","forma de pago","metodo de pago","cuotas","pagar","pagos","pagar al recibir","contraentrega","al recibir","le pago al motorista","como se paga","como puedo pagar","transfer","pago contra entrega","puedo transferir","transferencia bancaria","cuentas de banco","bac","ficohsa","atlantida","banpais","link de pago","tarjeta de credito","tarjeta de debito","efectivo al recibir"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('smak', 'direccion', '["direccion","direcciones","ubicacion","ubicaciones","donde entregar","donde enviar","lugar de entrega","destino","calle","colonia","barrio","avenida","bloque","casa","residencial","sector","gps","coordenadas","mapa","agencia","sucursal cargo expreso","oficina cargo expreso","recoger en agencia","retiro en agencia","ocurre","punto caex","retirar en oficina","pasar a recoger","pasar a traer"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('tenant-hn-muebles', 'direccion', '["direccion","direcciones","ubicacion","ubicaciones","donde entregar","donde enviar","lugar de entrega","destino","calle","colonia","barrio","avenida","bloque","casa","residencial","sector","gps","coordenadas","mapa","agencia","sucursal cargo expreso","oficina cargo expreso","recoger en agencia","retiro en agencia","ocurre","punto caex","retirar en oficina","pasar a recoger","pasar a traer"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('smak', 'asesor', '["humano","persona","operador","atencion al cliente","vendedor","agente","ejecutivo","alguien real","hablar con una persona","asesor de ventas","quiero hablar con un humano","representante","contacto directo"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('tenant-hn-muebles', 'asesor', '["humano","persona","operador","atencion al cliente","vendedor","agente","ejecutivo","alguien real","hablar con una persona","asesor de ventas","quiero hablar con un humano","representante","contacto directo"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('smak', 'garantia', '["garantía","seguro","defecto","falla","cobertura","reclamo","garantizado","si viene roto","si sale malo","si viene defectuoso","cambio","devolucion","respaldo","si sale con falla","garantia de fabrica"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('tenant-hn-muebles', 'garantia', '["garantía","seguro","defecto","falla","cobertura","reclamo","garantizado","si viene roto","si sale malo","si viene defectuoso","cambio","devolucion","respaldo","si sale con falla","garantia de fabrica"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('smak', 'horario', '["horarios","a que hora abren","cuando atienden","atencion","horario de atencion","abierto","a que hora entregan","a que hora vienen","horario de entrega","sabado","sabados","medio dia","por la tarde","por la manana"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('tenant-hn-muebles', 'horario', '["horarios","a que hora abren","cuando atienden","atencion","horario de atencion","abierto","a que hora entregan","a que hora vienen","horario de entrega","sabado","sabados","medio dia","por la tarde","por la manana"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('smak', 'factura', '["facturacion","rtn","cai","fiscal","comprobante","recibo","a nombre de empresa","con sar","razon social","factura con rtn","ocupo factura","dan factura","factura legal"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('tenant-hn-muebles', 'factura', '["facturacion","rtn","cai","fiscal","comprobante","recibo","a nombre de empresa","con sar","razon social","factura con rtn","ocupo factura","dan factura","factura legal"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('smak', 'colores', '["color","colores","tono","tonos","acabado","acabados","presentacion","presentaciones","en que color viene","en que colores viene","que colores hay","que colores tienen","otros colores","mas colores","otro color","blanco","blanca","negro","negra","cafe","marron","gris","rosa","rosado","rojo","roja","azul","dorado","plateado","inox","madera"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('tenant-hn-muebles', 'colores', '["color","colores","tono","tonos","acabado","acabados","presentacion","presentaciones","en que color viene","en que colores viene","que colores hay","que colores tienen","otros colores","mas colores","otro color","blanco","blanca","negro","negra","cafe","marron","gris","rosa","rosado","rojo","roja","azul","dorado","plateado","inox","madera"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('smak', 'materiales', '["material","materiales","de que material es","de que esta hecho","armado","armada","desarmado","desarmada","herramientas","llaves","tornillos","manual","facil de armar","viene armado","viene armada","ensamble","como se arma","calidad","acero","hierro","aluminio","madera","melamina","malla","cuero","pino"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('tenant-hn-muebles', 'materiales', '["material","materiales","de que material es","de que esta hecho","armado","armada","desarmado","desarmada","herramientas","llaves","tornillos","manual","facil de armar","viene armado","viene armada","ensamble","como se arma","calidad","acero","hierro","aluminio","madera","melamina","malla","cuero","pino"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('smak', 'compra', '["comprar","pedido","ordenar","orden","quiero comprar","hacer pedido","hacer el pedido","quiero pedir","quiero ordenar","me interesa comprar","lo quiero","la quiero","lo compro","la compro","quiero uno","quiero una","me lo llevo","me la llevo","apartar","mandar pedido","deseo comprar","confirmar","confirmar pedido","confirmo","confirmo pedido","dale viaje","adelante con el pedido"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO synonyms (tenant_id, concept, words)
VALUES ('tenant-hn-muebles', 'compra', '["comprar","pedido","ordenar","orden","quiero comprar","hacer pedido","hacer el pedido","quiero pedir","quiero ordenar","me interesa comprar","lo quiero","la quiero","lo compro","la compro","quiero uno","quiero una","me lo llevo","me la llevo","apartar","mandar pedido","deseo comprar","confirmar","confirmar pedido","confirmo","confirmo pedido","dale viaje","adelante con el pedido"]'::jsonb)
ON CONFLICT (tenant_id, concept) DO UPDATE SET words = EXCLUDED.words;
INSERT INTO campaigns (id, tenant_id, platform, channel, type, source_id, url, headline, body, sku, description)
VALUES ('camp-fb-ad-silla-gamer', 'smak', 'facebook', 'Facebook Ads (CTWA)', 'ad', '12020584738290123', 'https://www.facebook.com/share/p/196jarUnqz/?mibextid=wwXIfr', 'Silla Gamer Rom CA Negro/Negro', 'Hola, tenemos la Silla Gamer Rom CA Negro/Negro. ¿Te interesa saber más?', 'SKM-955-CA-NE', 'Anuncio de Meta Ads (Facebook/Instagram) - Click to WhatsApp')
ON CONFLICT (id) DO UPDATE SET
  platform = EXCLUDED.platform,
  channel = EXCLUDED.channel,
  url = EXCLUDED.url,
  headline = EXCLUDED.headline,
  sku = EXCLUDED.sku;
INSERT INTO campaigns (id, tenant_id, platform, channel, type, source_id, url, headline, body, sku, description)
VALUES ('tenant-hn-muebles-camp-fb-ad-silla-gamer', 'tenant-hn-muebles', 'facebook', 'Facebook Ads (CTWA)', 'ad', '12020584738290123', 'https://www.facebook.com/share/p/196jarUnqz/?mibextid=wwXIfr', 'Silla Gamer Rom CA Negro/Negro', 'Hola, tenemos la Silla Gamer Rom CA Negro/Negro. ¿Te interesa saber más?', 'SKM-955-CA-NE', 'Anuncio de Meta Ads (Facebook/Instagram) - Click to WhatsApp')
ON CONFLICT (id) DO UPDATE SET
  platform = EXCLUDED.platform,
  channel = EXCLUDED.channel,
  url = EXCLUDED.url,
  headline = EXCLUDED.headline,
  sku = EXCLUDED.sku;
INSERT INTO campaigns (id, tenant_id, platform, channel, type, source_id, url, headline, body, sku, description)
VALUES ('camp-fb-post-estante', 'smak', 'facebook', 'Facebook Post Orgánico', 'post', '196jarUnqz', 'https://www.facebook.com/share/p/196jarUnqz/?mibextid=wwXIfr', 'Publicación: Estantería de Metal y Madera 120x30x180cm', '¡Nuevo ingreso! Estantería 120x30x180 cm pino y metal en oferta especial.', 'ZGS-946-120x30x180', 'Enlace compartido de post en Facebook')
ON CONFLICT (id) DO UPDATE SET
  platform = EXCLUDED.platform,
  channel = EXCLUDED.channel,
  url = EXCLUDED.url,
  headline = EXCLUDED.headline,
  sku = EXCLUDED.sku;
INSERT INTO campaigns (id, tenant_id, platform, channel, type, source_id, url, headline, body, sku, description)
VALUES ('tenant-hn-muebles-camp-fb-post-estante', 'tenant-hn-muebles', 'facebook', 'Facebook Post Orgánico', 'post', '196jarUnqz', 'https://www.facebook.com/share/p/196jarUnqz/?mibextid=wwXIfr', 'Publicación: Estantería de Metal y Madera 120x30x180cm', '¡Nuevo ingreso! Estantería 120x30x180 cm pino y metal en oferta especial.', 'ZGS-946-120x30x180', 'Enlace compartido de post en Facebook')
ON CONFLICT (id) DO UPDATE SET
  platform = EXCLUDED.platform,
  channel = EXCLUDED.channel,
  url = EXCLUDED.url,
  headline = EXCLUDED.headline,
  sku = EXCLUDED.sku;
INSERT INTO campaigns (id, tenant_id, platform, channel, type, source_id, url, headline, body, sku, description)
VALUES ('camp-ig-escritorio', 'smak', 'instagram', 'Instagram Reel', 'ad', '12020993847291100', 'https://www.instagram.com/reel/C3x918LqZ/', 'Escritorio de Madera y Hierro 120x60cm', 'Transforma tu espacio de trabajo con nuestro escritorio de madera y hierro.', 'ZGS-943-120x60x75', 'Campaña Instagram Reels - Click to WhatsApp')
ON CONFLICT (id) DO UPDATE SET
  platform = EXCLUDED.platform,
  channel = EXCLUDED.channel,
  url = EXCLUDED.url,
  headline = EXCLUDED.headline,
  sku = EXCLUDED.sku;
INSERT INTO campaigns (id, tenant_id, platform, channel, type, source_id, url, headline, body, sku, description)
VALUES ('tenant-hn-muebles-camp-ig-escritorio', 'tenant-hn-muebles', 'instagram', 'Instagram Reel', 'ad', '12020993847291100', 'https://www.instagram.com/reel/C3x918LqZ/', 'Escritorio de Madera y Hierro 120x60cm', 'Transforma tu espacio de trabajo con nuestro escritorio de madera y hierro.', 'ZGS-943-120x60x75', 'Campaña Instagram Reels - Click to WhatsApp')
ON CONFLICT (id) DO UPDATE SET
  platform = EXCLUDED.platform,
  channel = EXCLUDED.channel,
  url = EXCLUDED.url,
  headline = EXCLUDED.headline,
  sku = EXCLUDED.sku;
