-- ============================================================================
-- V15: Reglas de entrega Cargo Expreso (2-3 días / 1-2 ciudades específicas),
-- sábados/fechas exactas, precios fijos sin rebajas y tono limpio (sin emojis ni negritas)
-- ============================================================================

-- 1. Política obligatoria del negocio en BD (tenants) para 'smak' y 'tenant-hn-muebles'
UPDATE tenants
SET scope_policy = 'POLÍTICAS OBLIGATORIAS DEL NEGOCIO (TEXTO PLANO SIN EMOJIS NI NEGRITAS):
1. CATÁLOGO REAL Y PRECIOS FIJOS: Todos los productos activos en catálogo tienen envío gratis en Honduras con Cargo Expreso. Los precios son fijos y finales; nunca se bajan ni se aplican descuentos, ni se muestran precios anteriores tachados ni códigos SKU al cliente.
2. TIEMPOS DE ENTREGA CON CARGO EXPRESO:
   - Tiempo general en todo Honduras: entre 2 y 3 días hábiles, lo más seguro.
   - ÚNICAS ciudades con entrega entre 1 y 2 días hábiles, lo más seguro: El Progreso (Yoro), San Pedro Sula (Cortés), Santa Rosa de Copán, Tegucigalpa (Francisco Morazán), La Ceiba (Atlántida) y Choloma (Cortés).
   - Fechas específicas: nunca garantizamos al 100% un día exacto porque depende de Cargo Expreso; solo damos fechas aproximadas.
3. SÁBADOS Y RECEPCIÓN: Cargo Expreso trabaja los sábados solo por un rato (medio día), por lo que no se puede asegurar que llegue ese día exacto. Si el cliente lo necesita exclusivamente para sábado, ofrecer envío a agencia Cargo Expreso para retiro (aclarando que no en todos los lugares hay agencias, sino en lugares específicos) y preguntar si tiene pareja o alguien en casa que pueda recibir y pagar contra entrega otro día.
4. TRASLADO A ASESOR POR CANTIDAD: Más de 2 unidades (3 o más) se traslada con un asesor humano. Para productos en formato set e individual (línea Tolix y sets), se traslada a partir de 5 unidades.
5. FACTURACIÓN RTN: No preguntar ni ofrecer factura proactivamente; emitir factura con RTN únicamente cuando el cliente la solicite.
6. FORMAS DE PAGO: Efectivo contra entrega al motorista de Cargo Expreso o transferencia bancaria previa a SMAK Honduras S. de R.L. (BAC Credomatic: 742-108-951, Banco Ficohsa: 2000-098-432, Banco Atlántida: 110-045-892, Banpaís: 01-501-002345). No aceptamos tarjetas ni links de pago.
7. ISLAS (Roatán, Útila, Guanaja): Despacho sin costo hasta el muelle de cabotaje de La Ceiba con transferencia previa; el cliente cubre el ferry.',
    bot_persona = 'Asesor comercial amable, claro y directo de SMAK Muebles en Honduras. Responde sin emojis, sin asteriscos ni negritas, sin usar "Fíjate que" y sin mostrar SKUs internos.'
WHERE id IN ('smak', 'tenant-hn-muebles');

-- 2. Actualizar reglas específicas de envío, horarios/sábados, stock y precios fijos
UPDATE bot_rules
SET response = 'Tenemos envío gratis a domicilio en todo el país con Cargo Expreso y pago contra entrega. El tiempo estimado es entre 2 y 3 días hábiles, lo más seguro. Para El Progreso (Yoro), San Pedro Sula (Cortés), Santa Rosa de Copán, Tegucigalpa (Francisco Morazán), La Ceiba (Atlántida) y Choloma (Cortés), suele llegar entre 1 y 2 días hábiles, lo más seguro. Ten en cuenta que son fechas aproximadas sujetas a la ruta de Cargo Expreso, por lo que no podemos comprometernos al 100% con un día exacto.',
    updated_at = CURRENT_TIMESTAMP
WHERE id IN ('rule-envios', 'tenant-hn-muebles-rule-envios');

UPDATE bot_rules
SET response = 'Cargo Expreso trabaja de lunes a viernes de 8 am a 5 pm y los sábados únicamente por un rato (medio día), por lo que no podemos asegurarte al 100% la entrega en una fecha exacta ni específicamente en sábado. Si necesitas recibirlo exclusivamente el sábado, podemos enviarlo a una agencia de Cargo Expreso para que pases a retirarlo (toma en cuenta que no en todos los lugares hay agencias, sino en ciudades específicas). Además, ¿tienes pareja o vives con algún familiar o persona de confianza que pueda estar en casa para recibir y pagar contra entrega en caso de que pase otro día?',
    training_phrases = '["a que hora llega mi paquete","en que horario me entregan","a que hora vienen","entregan en sabado","entregan los sabados","puedo recoger en agencia","retiro en agencia cargo expreso","entregan sabado por la tarde","puedo retirar en agencia","recoger en oficina de cargo expreso","horario de entrega de cargo expreso","a que hora pasa el repartidor","trabajan los sabados","agencia cargo expreso","horario","horarios","horario de atencion","a que hora atienden","a que hora abren","para el sabado","llega el sabado","lo necesito para el sabado","fecha exacta","dia especifico","entrega el sabado"]'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE id IN ('rule-horarios-agencias', 'tenant-hn-muebles-rule-horarios-agencias');

UPDATE bot_rules
SET response = 'Los precios publicados en nuestro catálogo son fijos y finales; no realizamos rebajas ni descuentos adicionales. Todos incluyen envío gratis en Honduras.',
    updated_at = CURRENT_TIMESTAMP
WHERE id IN ('rule-mejor-precio', 'tenant-hn-muebles-rule-mejor-precio');

UPDATE bot_rules
SET response_in_stock = 'Sí, tenemos disponible {name} ({stock} unidades disponibles) a L.{salePrice} con envío gratis. Si deseas pedirlo, compárteme tu nombre completo (nombre y apellido).',
    response_out_of_stock = 'El producto {name} se encuentra temporalmente agotado. Si gustas te muestro otro modelo similar disponible.',
    response_not_found = 'No encontré ese producto en nuestro catálogo activo. Dime qué mueble buscas y con gusto te muestro las opciones disponibles.',
    updated_at = CURRENT_TIMESTAMP
WHERE id IN ('rule-stock-sku', 'tenant-hn-muebles-rule-stock-sku');

-- 3. Limpiar emojis y negritas de todas las reglas activas de 'smak' y 'tenant-hn-muebles'
UPDATE bot_rules
SET response = trim(regexp_replace(
        replace(
            replace(
                replace(
                    replace(
                        replace(
                            replace(
                                replace(
                                    replace(
                                        replace(
                                            replace(
                                                replace(
                                                    replace(response, '**', ''),
                                                '*', ''),
                                            '🚚 ', ''),
                                        '📦 ', ''),
                                    '🏝️ ', ''),
                                '⚠️ ', ''),
                            '💳 ', ''),
                        '🏦 ', ''),
                    '✨ ', ''),
                '🛡️ ', ''),
            '🏷️ ', ''),
        '📍 ', ''),
    '\s+\n', E'\n', 'g')),
    updated_at = CURRENT_TIMESTAMP
WHERE tenant_id IN ('smak', 'tenant-hn-muebles')
  AND response IS NOT NULL;
