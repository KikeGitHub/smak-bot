-- ============================================================================
-- V17: Canalización de soporte de garantía y armado a Moisés (+504 3306-2631)
-- y ajuste de límite de mayoreo a partir de 5 unidades para productos individuales
-- (mismo precio fijo hasta 4 piezas para productos individuales)
-- ============================================================================

-- 1. Actualizar scope_policy en tenants
UPDATE tenants
SET scope_policy = 'POLÍTICAS OBLIGATORIAS DEL NEGOCIO (TEXTO PLANO SIN EMOJIS NI NEGRITAS):
1. CATÁLOGO REAL Y PRECIOS FIJOS HASTA 4 PIEZAS: Todos los productos activos en catálogo tienen envío gratis en Honduras con Cargo Expreso y pago contra entrega. Para productos individuales que no sean SET, el precio es estrictamente fijo y final de 1 a 4 piezas. PROHIBIDO ofrecer rebajas, descuentos o sugerir especialista de mayoreo para pedidos de 1 a 4 piezas.
2. TIEMPOS DE ENTREGA CON CARGO EXPRESO:
   - Tiempo general en todo Honduras: entre 2 y 3 días hábiles, lo más seguro.
   - ÚNICAS ciudades con entrega entre 1 y 2 días hábiles, lo más seguro: El Progreso (Yoro), San Pedro Sula (Cortés), Santa Rosa de Copán, Tegucigalpa (Francisco Morazán), La Ceiba (Atlántida) y Choloma (Cortés).
   - Fechas específicas: nunca garantizamos al 100% un día exacto porque depende de Cargo Expreso; solo damos fechas aproximadas.
3. SÁBADOS Y RECEPCIÓN: Cargo Expreso trabaja los sábados solo por un rato (medio día), por lo que no se puede asegurar que llegue ese día exacto. Si el cliente lo necesita exclusivamente para sábado, ofrecer envío a agencia Cargo Expreso para retiro (aclarando que no en todos los lugares hay agencias, sino en lugares específicos) y preguntar si tiene pareja o alguien en casa que pueda recibir y pagar contra entrega otro día.
4. TRASLADO A ESPECIALISTA DE MAYOREO POR CANTIDAD:
   - Para productos SET (aquellos cuyo SKU contiene SET o su nombre indica Set): a partir de 2 unidades (2 sets o más) se traslada con un especialista de mayoreo.
   - Para productos individuales (cualquier SKU que no incluya la palabra SET): venta regular al mismo precio fijo hasta 4 piezas. A partir de 5 piezas (5 sillas o más), se traslada con un especialista de mayoreo.
   - PROHIBIDO utilizar la frase "asesor humano" o decir que "se supera un límite". Usar siempre "especialista de mayoreo".
5. SOPORTE DE GARANTÍAS Y ARMADO (MOISÉS):
   - Para atención de garantías por piezas rotas, dañadas o faltantes.
   - Para dudas de armado de productos, instructivos o indicaciones de ensamble.
   - Direccionar directamente con Moisés al teléfono +504 3306-2631 (https://wa.me/50433062631).
6. FACTURACIÓN RTN: No preguntar ni ofrecer factura proactivamente; emitir factura con RTN únicamente cuando el cliente la solicite.
7. FORMAS DE PAGO: Efectivo contra entrega al motorista de Cargo Expreso o transferencia bancaria previa a SMAK Honduras S. de R.L. (BAC Credomatic: 742-108-951, Banco Ficohsa: 2000-098-432, Banco Atlántida: 110-045-892, Banpaís: 01-501-002345). No aceptamos tarjetas ni links de pago.
8. ISLAS (Roatán, Útila, Guanaja): Despacho sin costo hasta el muelle de cabotaje de La Ceiba con transferencia previa; el cliente cubre el ferry.',
    updated_at = CURRENT_TIMESTAMP
WHERE id IN ('smak', 'tenant-hn-muebles');

-- 2. Actualizar bot_rules de mejor precio / descuentos
UPDATE bot_rules
SET response = 'Los precios publicados en nuestro catálogo son fijos y finales para pedidos de hasta 4 piezas; no realizamos rebajas ni descuentos adicionales. Todos nuestros modelos incluyen envío gratis por Cargo Expreso y pago contra entrega en todo Honduras.',
    training_phrases = '["descuento","rebaja","mejor precio","por mayor","mayoreo","lo menos","ultimo precio","mejoras precio","no mejoras precio","mejora precio","rebajas","descuentos","menos precio"]'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE id IN ('rule-mejor-precio', 'tenant-hn-muebles-rule-mejor-precio');

-- 3. Crear / actualizar regla de soporte para garantías y armado direccionando a Moisés
INSERT INTO bot_rules (id, tenant_id, category, training_phrases, response, is_active, created_at, updated_at)
VALUES 
    ('rule-garantia-armado', 'smak', 'soporte', 
     '["garantia","garantía","pieza rota","piezas rotas","pieza danada","piezas dañadas","pieza dañada","piezas danadas","pieza faltante","piezas faltantes","falta una pieza","faltan piezas","vino quebrado","vino rota","vino roto","vino defectuoso","defecto de fabrica","repuesto","reclamo","armado","como se arma","instructivo","manual","indicaciones de armado","dudas de armado","como armar","ensamble","ensamblado","instrucciones de armado"]'::jsonb,
     'Para atención de garantías por piezas rotas, dañadas o faltantes, así como dudas de armado de productos, instructivos o indicaciones de ensamble, por favor comunícate directamente con nuestro encargado de soporte y armado, Moisés, al +504 3306-2631 (https://wa.me/50433062631). Con gusto te atenderá para resolver cualquier detalle de inmediato.',
     true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('tenant-hn-muebles-rule-garantia-armado', 'tenant-hn-muebles', 'soporte', 
     '["garantia","garantía","pieza rota","piezas rotas","pieza danada","piezas dañadas","pieza dañada","piezas danadas","pieza faltante","piezas faltantes","falta una pieza","faltan piezas","vino quebrado","vino rota","vino roto","vino defectuoso","defecto de fabrica","repuesto","reclamo","armado","como se arma","instructivo","manual","indicaciones de armado","dudas de armado","como armar","ensamble","ensamblado","instrucciones de armado"]'::jsonb,
     'Para atención de garantías por piezas rotas, dañadas o faltantes, así como dudas de armado de productos, instructivos o indicaciones de ensamble, por favor comunícate directamente con nuestro encargado de soporte y armado, Moisés, al +504 3306-2631 (https://wa.me/50433062631). Con gusto te atenderá para resolver cualquier detalle de inmediato.',
     true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO UPDATE
SET response = EXCLUDED.response,
    training_phrases = EXCLUDED.training_phrases,
    updated_at = CURRENT_TIMESTAMP;
