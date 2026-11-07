package com.smakbot.core.application.engine;

import java.util.List;
import java.util.regex.Pattern;

/**
 * Detección de intenciones. Port de los métodos {@code _is*Intent} del Oráculo con sus mismas listas de frases.
 * (Los sinónimos configurables por tenant del Oráculo quedan como GAP para una tabla futura.)
 */
public final class IntentDetector {

    private static final Pattern QUESTION_START = Pattern.compile(
            "^(?:puedo|como|c[oó]mo|cu[aá]ndo|cuando|cu[aá]nto|cuanto|d[oó]nde|donde|qu[eé]|que|por qu[eé]|por que|aceptan|tienen|hay)\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern OK_SI = Pattern.compile(
            "^(?:si|ok|listo|dale|adelante|claro)\\b\\s*(?:por favor|amigo|amiga|gracias|esta bien|proceda|mandelo|envielo|confirmado)?$",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern AGENCY_QUESTION_START = Pattern.compile(
            "^(?:tienen|donde|d[oó]nde|cu[aá]l|cual|cu[aá]ndo|cuando|a qu[eé]|a que|horario|qu[eé]|que)\\b",
            Pattern.CASE_INSENSITIVE);
    public static final Pattern TRACKING_CODE = Pattern.compile("(?:[a-z]{2,6}-ord-\\d+|caex-[a-z0-9-]+)", Pattern.CASE_INSENSITIVE);

    private IntentDetector() {
    }

    public static boolean isColor(MessageText m) {
        if (m.token("color", "colores", "tono", "tonos", "acabado", "acabados", "presentacion", "presentaciones")) return true;
        if (m.hasAny("que colores hay", "que colores tienen", "en que colores viene", "en que color viene",
                "que color viene", "de que color es", "que color es", "colores disponibles",
                "otros colores", "mas colores", "otro color", "que tonos hay", "cuales colores hay",
                "hay otros colores", "tienen mas colores", "que colores manejan", "tienen en color",
                "viene en color", "que color tiene", "tienen colores")) return true;
        boolean hasColorWord = m.token("blanco", "blanca", "negro", "negra", "marron", "cafe", "gris", "rosa", "rosado",
                "rojo", "roja", "azul", "verde", "amarillo", "dorado", "plateado", "inox", "madera");
        if (hasColorWord) {
            return m.hasAny("tienen", "hay", "viene", "la tienen", "lo tienen", "la hay", "lo hay", "color", "tono",
                    "en", "acabado", "busco", "quiero") || m.tokens().size() <= 3;
        }
        return false;
    }

    public static boolean isPrice(MessageText m) {
        if (m.hasAny("costo de envio", "precio del envio", "cuanto vale el envio", "cobran envio", "cobran el envio",
                "costo de flete", "precio de flete")) return false;
        if (m.hasAny("cuanto es lo menos", "lo menos", "mejor precio", "precio por mayor", "precio por mayoreo",
                "descuento", "descuentos", "rebaja", "rebajas", "si compro varios", "precio para distribuidores")) return false;
        if (m.hasAny("cuanto cuesta", "cuanto vale", "a cuanto sale", "a cuanto esta",
                "cual es el precio", "cual es el valor", "a como sale", "en cuanto sale",
                "en cuanto me lo dejan", "a como me lo deja", "que precio tiene", "precio de",
                "cuanto es", "que cuesta", "a como lo dan", "a cuanto lo dan", "precio final", "ultimo precio",
                "cuanto sale", "que vale", "valor de", "costo de", "en cuanto me sale", "a como sale la")) return true;
        return m.token("precio", "precios", "costo", "valor", "tarifa");
    }

    public static boolean isWeight(MessageText m) {
        if (m.hasAny("cuanto peso aguanta", "cuanto peso soporta", "cual es el peso maximo",
                "peso maximo", "soporte de peso", "que peso aguanta", "que peso soporta",
                "cuanto aguanta", "cuanto soporta")) return true;
        return m.token("resistencia", "soporta", "aguanta", "kilos", "libras", "resiste", "peso") && !m.has("transferencia");
    }

    public static boolean isGratitude(MessageText m) {
        if (m.hasAny("muchas gracias", "mil gracias", "te lo agradezco", "muy amable", "ok gracias", "vale gracias")) return true;
        return m.token("gracias") && m.tokens().size() <= 4;
    }

    public static boolean isDimension(MessageText m) {
        if (m.token("dimension", "dimensiones", "dimencion", "dimenciones", "medida", "medidas", "mide", "miden", "medir",
                "tamano", "altura", "alto", "ancho", "anchura", "largo", "longitud", "profundidad", "fondo", "cm",
                "centimetros", "metros")) return true;
        return m.hasAny("cuanto mide", "cuanto miden", "que medida", "que medidas",
                "cuales son las medidas", "cuales son las dimensiones", "cuales son las dimenciones",
                "medidas de", "medida de", "dimensiones de", "dimenciones de",
                "dimension de", "dimencion de", "que tamano tiene", "tamano del", "tamano de la");
    }

    public static boolean isMaterial(MessageText m) {
        if (m.token("material", "materiales", "madera", "hierro", "acero", "aluminio", "marmol", "nylon",
                "armado", "armada", "desarmado", "desarmada", "herramientas", "llaves", "tornillos", "manual")) return true;
        return m.hasAny("de que material es", "que material es", "de que esta hecho", "de que esta fabricado",
                "es de madera", "es de metal", "es de plastico", "es de hierro", "es de acero",
                "viene armado", "viene armada", "viene desarmado", "viene desarmada", "viene en caja",
                "trae herramientas", "trae llaves", "trae tornillos", "incluye herramientas",
                "es facil de armar", "como se arma", "requiere armado", "manual de armado");
    }

    public static boolean isScheduleDelivery(MessageText m) {
        if (m.hasAny("horario especifico", "hora especifica", "hora exacta", "horario exacto",
                "a que hora", "que hora", "a que horas", "que horas",
                "pueden entregar a las", "puedo pedir horario", "puedo pedir hora", "pueden venir a las",
                "en la tarde", "en la manana", "por la tarde", "por la manana",
                "despues de las", "antes de las", "medio dia",
                "dia especifico", "que dia", "puedo elegir dia", "puedo escoger dia",
                "sabado", "sabados")) return true;
        boolean timeWord = m.token("horario", "hora", "horas", "sabado", "sabados");
        boolean deliveryCtx = m.hasAny("especific", "entrega", "venir", "llegar", "tarde", "medio dia");
        return timeWord && deliveryCtx;
    }

    public static boolean isAgencyPickupQuery(MessageText m) {
        return m.hasAny("recoger en agencia", "retirar en agencia", "pasar a recoger", "pasar a traer",
                "recoger en oficina", "retirar en oficina", "oficinas de cargo", "agencias de cargo",
                "agencia de cargo", "oficina de cargo", "mandar a agencia", "mandar a oficina",
                "enviar a agencia", "enviar a oficina", "agencias de delivery", "agencia de delivery",
                "oficina cargo expreso", "agencia cargo expreso", "ocurre", "sucursal cargo expreso");
    }

    /** ¿El texto es una dirección de agencia Cargo Expreso (ocurre) en vez de una pregunta? */
    public static boolean isAgencyAddress(String rawText) {
        if (rawText == null || rawText.isBlank()) return false;
        if (rawText.contains("?") || rawText.contains("¿")) return false;
        String text = TextNormalizer.clean(rawText);
        if (AGENCY_QUESTION_START.matcher(text).find()) return false;
        boolean agencyTerm = TextNormalizer.containsAny(text, "agencia", "oficina", "sucursal", "ocurre", "bodega",
                "punto caex", "retirar en agencia", "recoger en agencia", "retiro en agencia",
                "reclamar en agencia", "reclamar en oficina", "retirar en oficina", "recoger en oficina");
        if (!agencyTerm) return false;
        boolean carrierOrPlace = TextNormalizer.containsAny(text, "cargo", "expreso", "caex", "paqueteria", "delivery",
                "encomienda", "tegucigalpa", "san pedro", "sps", "ceiba", "choluteca", "comayagua",
                "danli", "juticalpa", "progreso", "puerto cortes", "siguatepeque", "santa rosa",
                "la granja", "kennedy", "los andes", "centro", "circunvalacion", "toncontin");
        return carrierOrPlace || text.length() >= 10;
    }

    public static boolean isConfirm(MessageText m) {
        String c = m.clean();
        boolean isQuestion = m.isQuestion() || QUESTION_START.matcher(c).find();
        if (isQuestion) return false;
        if (m.hasAny("confirmar", "confirmo", "proceder", "cerrar pedido", "cerrar compra", "comprar ahora",
                "si deseo comprar", "adelante con el pedido", "hagan el envio", "hacer el envio",
                "mandelo", "mandemelo", "envielo", "envienlo", "dale viaje", "todo correcto", "todo bien", "esta perfecto",
                "lo quiero", "la quiero")) return true;
        List<String> exact = List.of("si", "ok", "listo", "correcto", "dale", "adelante", "comprar", "proceder", "de acuerdo",
                "perfecto", "va", "esta bien", "todo bien", "todo correcto", "mandelo", "envielo", "claro",
                "por favor", "si claro", "si gracias", "si por favor");
        return exact.contains(c) || OK_SI.matcher(c).matches();
    }

    public static final Pattern PURCHASE_QUANTITY_PREFIX = Pattern.compile(
            "\\b(?:quiero|kiero|ocupo|necesito|dame|mandame|envíame|enviame|llevo|me llevo|ordenar|pedir|comprar)\\s+(?:\\d+|una?|dos|tres|cuatro|cinco|seis|diez|docena)\\b",
            Pattern.CASE_INSENSITIVE
    );

    public static final Pattern SHORT_PURCHASE = Pattern.compile(
            "\\b(?:(?:lo|la)\\s+quiero|(?:me\\s+lo|me\\s+la)\\s+llevo|(?:lo|la)\\s+compro|me\\s+quedo\\s+con|aparta(?:me)?(?:lo|la)?|hacer\\s+(?:el\\s+)?pedido|quiero\\s+(?:pedir|ordenar|comprar|uno|una)|deseo\\s+(?:comprar|ordenar)|me\\s+interesa\\s+comprar)\\b",
            Pattern.CASE_INSENSITIVE
    );

    public static boolean isCancellation(MessageText m) {
        if (m.token("cancelar", "cancela", "cancelacion", "cancelado")) return true;
        return m.hasAny("cancelar pedido", "cancela la orden", "cancelar orden", "ya no quiero", "ya no",
                "no quiero comprar", "salir", "dejalo asi", "dejarlo asi", "olvidalo", "no gracias ya no");
    }

    public static boolean isResetOrMenu(MessageText m) {
        if (m.token("reiniciar", "reset", "resetear", "menu", "inicio", "empezar", "borrar")) return true;
        return m.hasAny("reiniciar conversacion", "reiniciar chat", "empezar de nuevo", "volver a empezar",
                "volver al inicio", "volver al menu", "menu principal", "nuevo chat", "nueva consulta");
    }

    public static boolean isPurchase(MessageText m) {
        // Exclusión inmediata: Consultas informativas con 'quiero ...' o preguntas de catálogo
        if (m.hasAny("quiero saber", "quiero ver", "quiero conocer", "quiero preguntar", "quiero informacion",
                "quiero consultar", "quiero revisar", "quiero cotizar", "que productos tienes", "que productos tienen",
                "que productos hay", "que modelos tienen", "que tienen", "ver fotos", "ver modelos", "fotos", "catalogo")) {
            return false;
        }

        // Si es una pregunta de cómo o dónde comprar, es consulta informativa
        if (m.isQuestion() && m.hasAny("como", "donde", "cuando", "puedo")) {
            return false;
        }

        String c = m.clean().trim();
        if (isCancellation(m)) return false;

        if (PURCHASE_QUANTITY_PREFIX.matcher(c).find()) return true;
        if (SHORT_PURCHASE.matcher(c).find()) return true;

        if (m.token("comprar", "ordenar") && !m.isQuestion()) return true;

        if (c.matches("^(?:quiero|kiero|comprar|ordenar|hacer pedido|apartar)\\b.*") && !m.hasAny("saber", "ver", "conocer", "preguntar", "informacion")) {
            return true;
        }

        if (c.matches("^(?:\\d+|dos|tres|cuatro|cinco)\\s+(?:piezas?|unidades?|muebles?|sillas?|taburetes?)$")) {
            return true;
        }
        return false;
    }

    public static boolean isTracking(MessageText m) {
        if (TRACKING_CODE.matcher(m.raw()).find()) return true;
        if (m.token("rastreo", "rastrear", "guia", "tracking", "paquete")) return true;
        if (m.hasAny("rastrear", "rastreo", "tracking", "guia de envio", "numero de guia")) return true;
        return m.hasAny("mi pedido", "mi paquete", "mi compra", "mi orden")
                && m.hasAny("donde", "estado", "como va", "numero", "cuando llega", "estatus", "rastrear");
    }

    public static boolean isHumanRequest(MessageText m) {
        return m.token("asesor", "humano", "persona", "operador", "agente", "ejecutivo");
    }

    public static boolean isTransferQuery(MessageText m) {
        return m.hasAny("transferencia", "transfer")
                || (m.has("cuenta") && m.hasAny("banco", "transferir", "depositar"));
    }

    public static boolean isPhotoQuery(MessageText m) {
        return m.token("foto", "fotos", "imagen", "imagenes", "verlo");
    }

    public static boolean isShippingQuery(MessageText m) {
        return m.token("envio", "envios", "entrega", "entregas", "tardan", "tarda", "tiempo", "domicilio", "casa", "dias")
                || m.hasAny("venir a dejar", "venirme a dejar", "cuanto tiempo");
    }

    public static boolean isStockQuery(MessageText m) {
        return m.token("stock", "disponible", "disponibilidad", "quedan", "hay", "existencia", "inventario", "tienen")
                || m.hasAny("la tienen", "lo tienen", "la hay", "lo hay", "aun tienen", "todavia tienen");
    }

    public static boolean isCatalogQuery(MessageText m) {
        return m.token("catalogo", "productos", "modelos", "articulos", "mercaderia")
                || m.hasAny("que venden", "ver catalogo", "que tienen", "que productos tienes", "que productos tienen", "que productos hay", "mostrar productos", "que cosas tienen", "que muebles tienen");
    }

    public static boolean isGreeting(MessageText m) {
        return m.token("hola", "buenas", "buen", "dia", "tardes", "noches", "saludos", "alero", "compa", "que tal", "epale", "onda");
    }

    public static boolean isMoreOptionsQuery(MessageText m) {
        if (m.hasAny("tienes mas", "tienen mas", "tienes otro", "tienen otro", "tienes otros", "tienen otros",
                "otro modelo", "otros modelos", "otra opcion", "otras opciones", "otro estilo", "otros estilos",
                "otra alternativa", "otras alternativas", "que mas tienen", "que mas hay", "que mas tiene",
                "cuales otros", "cuales mas", "muestrame mas", "muestrame otro", "muestrame otros",
                "mostrame mas", "mostrame otro", "mostrame otros", "ver mas", "ver otro", "ver otros",
                "algo mas", "algun otro", "alguna otra", "que otro", "que otros", "que otra", "que otras",
                "hay mas", "hay otro", "hay otros", "tienen alguna otra", "tienen algun otro",
                "otra silla", "otras sillas", "otro sillon", "otros sillones", "otro escritorio",
                "otra mesa", "otro taburete", "otra pileta", "otro grifo", "tienen mas modelos",
                "tienes mas modelos", "otro diseno", "otros disenos")) {
            return true;
        }
        String c = m.clean().trim();
        return c.equals("mas") || c.equals("otro") || c.equals("otra") || c.equals("otros") || c.equals("otras")
                || c.equals("mas opciones") || c.equals("otros modelos") || c.equals("mas modelos")
                || c.equals("otro mas") || c.equals("otra mas");
    }
}
