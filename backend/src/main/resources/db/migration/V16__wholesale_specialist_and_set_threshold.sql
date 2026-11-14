-- ============================================================================
-- V16: Ajuste de política de mayoreo por cantidad y eliminación de "asesor humano"
-- Para SET (SKU contiene SET): transferir a partir de 2 unidades a especialista de mayoreo.
-- Para individuales: transferir únicamente a partir de más de 5 unidades (6+) a especialista de mayoreo.
-- ============================================================================

UPDATE tenants
SET scope_policy = 'POLÍTICAS OBLIGATORIAS DEL NEGOCIO (TEXTO PLANO SIN EMOJIS NI NEGRITAS):
1. CATÁLOGO REAL Y PRECIOS FIJOS: Todos los productos activos en catálogo tienen envío gratis en Honduras con Cargo Expreso. Los precios son fijos y finales; nunca se bajan ni se aplican descuentos, ni se muestran precios anteriores tachados ni códigos SKU al cliente.
2. TIEMPOS DE ENTREGA CON CARGO EXPRESO:
   - Tiempo general en todo Honduras: entre 2 y 3 días hábiles, lo más seguro.
   - ÚNICAS ciudades con entrega entre 1 y 2 días hábiles, lo más seguro: El Progreso (Yoro), San Pedro Sula (Cortés), Santa Rosa de Copán, Tegucigalpa (Francisco Morazán), La Ceiba (Atlántida) y Choloma (Cortés).
   - Fechas específicas: nunca garantizamos al 100% un día exacto porque depende de Cargo Expreso; solo damos fechas aproximadas.
3. SÁBADOS Y RECEPCIÓN: Cargo Expreso trabaja los sábados solo por un rato (medio día), por lo que no se puede asegurar que llegue ese día exacto. Si el cliente lo necesita exclusivamente para sábado, ofrecer envío a agencia Cargo Expreso para retiro (aclarando que no en todos los lugares hay agencias, sino en lugares específicos) y preguntar si tiene pareja o alguien en casa que pueda recibir y pagar contra entrega otro día.
4. TRASLADO A ESPECIALISTA DE MAYOREO POR CANTIDAD:
   - Para productos SET (aquellos cuyo SKU contiene SET o su nombre indica Set): a partir de 2 unidades (2 sets o más) se traslada con un especialista de mayoreo.
   - Para productos individuales: el bot procesa ventas normales de 1 a 5 unidades. Únicamente si el cliente pide más de 5 unidades (6 o más), se traslada con un especialista de mayoreo.
   - En ningún caso se utiliza la frase "asesor humano" ni se menciona que "se supera un límite".
5. FACTURACIÓN RTN: No preguntar ni ofrecer factura proactivamente; emitir factura con RTN únicamente cuando el cliente la solicite.
6. FORMAS DE PAGO: Efectivo contra entrega al motorista de Cargo Expreso o transferencia bancaria previa a SMAK Honduras S. de R.L. (BAC Credomatic: 742-108-951, Banco Ficohsa: 2000-098-432, Banco Atlántida: 110-045-892, Banpaís: 01-501-002345). No aceptamos tarjetas ni links de pago.
7. ISLAS (Roatán, Útila, Guanaja): Despacho sin costo hasta el muelle de cabotaje de La Ceiba con transferencia previa; el cliente cubre el ferry.',
    updated_at = CURRENT_TIMESTAMP
WHERE id IN ('smak', 'tenant-hn-muebles');

