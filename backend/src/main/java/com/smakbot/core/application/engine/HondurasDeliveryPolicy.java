package com.smakbot.core.application.engine;

import com.smakbot.core.domain.model.Product;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Reglas comerciales de entrega, cobertura, sábados, umbrales de transferencia
 * a asesor y sanitización estricta de tono para SMAK en Honduras.
 */
public final class HondurasDeliveryPolicy {

    /**
     * Ciudades específicas donde la entrega con Cargo Expreso tarda entre 1 y 2 días hábiles, lo más seguro.
     * Cualquier otro destino en Honduras maneja entre 2 y 3 días hábiles, lo más seguro.
     */
    private static final List<String> FAST_CITIES_1_2_DAYS = List.of(
            "el progreso",
            "san pedro sula",
            "sps",
            "santa rosa de copan",
            "santa rosa copan",
            "tegucigalpa",
            "tgu",
            "la ceiba",
            "ceiba",
            "choloma"
    );

    private static final Set<String> SATURDAY_TERMS = Set.of(
            "sabado", "sabados", "fin de semana"
    );

    private static final Pattern SPECIFIC_DAY_OR_DATE = Pattern.compile(
            "\\b(lunes|martes|miercoles|jueves|viernes|sabado|sabados|domingo|manana|pasado manana|fecha exacta|dia exacto|dia concreto|ese mismo dia|para el \\d{1,2}|el \\d{1,2} de)\\b"
    );

    private static final Pattern SURROGATE_OR_SYMBOL_EMOJI = Pattern.compile(
            "[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\u2600-\\u27BF\\u23E9-\\u23FA\\u25AA-\\u25FE\\u2B05-\\u2B55\\uFE00-\\uFE0F\\u200D]"
    );

    private static final Pattern SENTENCE_START_FIJATE = Pattern.compile(
            "(?iu)(^|[.!?\\n]\\s*)f[ií]jate\\s+que\\s*,?\\s*([a-záéíóúüñ])"
    );

    private static final Pattern ANY_FIJATE = Pattern.compile("(?iu)\\bf[ií]jate\\s+que\\s*,?\\s*");

    private static final Pattern SKU_LABEL_PATTERN = Pattern.compile(
            "(?i)\\s*[\\(\\[]?\\bsku\\b\\s*:?\\s*(?=[a-z0-9-]*\\d)[a-z0-9-]+\\s*[\\)\\]]?|\\s*[\\(\\[](?:skm|zgb|zgs|zgm|zgf)-[a-z0-9x-]+\\s*[\\)\\]]|\\b(?:skm|zgb|zgs|zgm|zgf)-[a-z0-9x-]+\\b"
    );

    private static final Pattern OLD_PRICE_PATTERN = Pattern.compile(
            "(?i)\\s*\\((?:antes|precio regular|regular)\\s*:?\\s*~*L?\\.?\\s*[\\d,]+(?:\\.\\d{1,2})?~*\\)"
    );

    private static final Pattern MORE_PHOTOS_HINT_PATTERN = Pattern.compile(
            "(?iu)\\s*\\(?\\s*(?:tenemos|hay)\\s+\\d+\\s+fotos?\\s+m[aá]s\\b[^\\n)]*\\)?(?:\\s*si\\s+deseas?\\s+verlas?[^\\n]*)?",
            Pattern.MULTILINE
    );

    private HondurasDeliveryPolicy() {}

    public static boolean isFastDeliveryCity(String text) {
        if (text == null || text.isBlank()) {
            return false;
        }
        String norm = " " + normalize(text) + " ";
        for (String city : FAST_CITIES_1_2_DAYS) {
            if (norm.contains(" " + city + " ")) {
                return true;
            }
        }
        return false;
    }

    public static String estimateDeliveryWindow(String addressOrCityText) {
        return isFastDeliveryCity(addressOrCityText)
                ? "entre 1 y 2 días hábiles, lo más seguro"
                : "entre 2 y 3 días hábiles, lo más seguro";
    }

    public static boolean mentionsSaturday(String normText) {
        if (normText == null || normText.isBlank()) {
            return false;
        }
        String padded = " " + normText + " ";
        for (String term : SATURDAY_TERMS) {
            if (padded.contains(" " + term + " ")) {
                return true;
            }
        }
        return false;
    }

    public static boolean mentionsSpecificDate(String normText) {
        if (normText == null || normText.isBlank()) {
            return false;
        }
        return mentionsSaturday(normText) || SPECIFIC_DAY_OR_DATE.matcher(normText).find();
    }

    public static String buildSaturdayReply(String cityOrAddressText) {
        String window = estimateDeliveryWindow(cityOrAddressText);
        return "Con gusto te explico cómo funcionan las entregas en sábado. Cargo Expreso trabaja los sábados solo por un rato (medio día), "
                + "por lo que no podemos asegurarte al 100% que el pedido llegue exactamente ese día, ya que depende directamente de la ruta de la transportadora y manejamos fechas aproximadas ("
                + window + ").\n\n"
                + "Si lo necesitas exclusivamente para el sábado, lo más recomendable es enviarlo a una agencia de Cargo Expreso para que puedas pasar a retirarlo "
                + "(toma en cuenta que no en todos los lugares hay agencias, sino en ciudades específicas con sucursal).\n\n"
                + "Además, ¿tienes pareja o vives con algún familiar o persona de confianza que pueda quedarse en casa para recibir y realizar el pago contra entrega en caso de que el repartidor pase otro día?";
    }

    public static String buildSpecificDateReply(String cityOrAddressText) {
        String window = estimateDeliveryWindow(cityOrAddressText);
        return "Te aclaro con total transparencia: al depender de las rutas de Cargo Expreso no podemos comprometernos en un 100% a entregar en una fecha o día exacto, "
                + "únicamente damos fechas aproximadas. Para tu referencia, el tiempo estimado es de " + window
                + ", y el motorista siempre llama antes de llegar.";
    }

    /**
     * Regla de negocio por cantidad:
     * - Productos vendidos en formato Set e Individual (línea Tolix y sets con par -4): pasar a asesor desde 5 unidades.
     * - Resto del catálogo: más de 2 unidades (a partir de 3) pasa a asesor humano.
     */
    public static int humanHandoverThreshold(Product product, List<Product> catalog) {
        return isSetOrDualIndividualProduct(product, catalog) ? 5 : 3;
    }

    public static boolean isSetOrDualIndividualProduct(Product product, List<Product> catalog) {
        if (product == null) {
            return false;
        }
        String normName = normalize(product.name());
        String upperSku = product.sku() != null ? product.sku().toUpperCase(Locale.ROOT).trim() : "";
        if (normName.contains("tolix")
                || normName.startsWith("set ")
                || normName.contains(" set ")
                || normName.startsWith("kit ")
                || upperSku.endsWith("-4")) {
            return true;
        }
        if (catalog != null && !upperSku.isBlank()) {
            String pairedSetSku = upperSku + "-4";
            for (Product p : catalog) {
                if (p != null && p.sku() != null && pairedSetSku.equalsIgnoreCase(p.sku().trim())) {
                    return true;
                }
            }
        }
        return false;
    }

    public static String buildHumanHandoverForQuantityReply(Product product, int requestedQty) {
        String prodName = product != null ? product.name() : "este producto";
        return "Con gusto te ayudamos con tu pedido de " + requestedQty + " unidades de " + prodName + ". "
                + "Por tratarse de esa cantidad, voy a trasladar tu conversación directamente con un asesor de nuestro equipo por este mismo chat para coordinar todos los detalles contigo. "
                + "En breve te responderán.";
    }

    public static String buildFinalOrderConfirmation(
            String recipientName,
            String orderNumber,
            String quantityLabel,
            String productName,
            BigDecimal total,
            String deliveryAddress,
            String customerPhone
    ) {
        String window = estimateDeliveryWindow(deliveryAddress);
        return "Listo, " + recipientName + ". Tu pedido " + orderNumber
                + " (" + quantityLabel + " de " + productName + " por " + Money.lempiras(total)
                + ") quedó confirmado y ya lo estamos preparando para envío gratis con Cargo Expreso.\n\n"
                + "El tiempo estimado de entrega en tu zona es " + window
                + " (ten en cuenta que es una fecha aproximada sujeta a la ruta de Cargo Expreso, por lo que no se garantiza un día exacto). "
                + "El repartidor te llamará al " + customerPhone + " antes de llegar.\n\n"
                + "Quedamos a tu entera disposición ante cualquier duda.";
    }

    /**
     * Limpia de forma determinista emojis, asteriscos de negrita, "Fíjate que", SKUs internos
     * y precios anteriores antes de entregar cualquier mensaje al cliente.
     */
    public static String sanitizeCustomerReply(String rawText) {
        if (rawText == null || rawText.isBlank()) {
            return "";
        }
        String text = rawText;

        // 1. Eliminar emojis y símbolos decorativos manteniendo caracteres del español y viñetas normales
        text = SURROGATE_OR_SYMBOL_EMOJI.matcher(text).replaceAll("");

        // 2. Convertir viñetas markdown '* item' en '- item' y retirar negritas/cursivas '**' y '*'
        text = text.replaceAll("(?m)^[ \\t]*\\*[ \\t]+", "- ");
        text = text.replaceAll("\\*\\*([^*\\r\\n]+)\\*\\*", "$1");
        text = text.replaceAll("\\*([^*\\r\\n]+)\\*", "$1");
        text = text.replaceAll("~~([^~\\r\\n]+)~~", "$1");
        text = text.replace("*", "");

        // 3. Eliminar "Fíjate que" cuidando mayúscula inicial tras signo o inicio de frase
        Matcher m = SENTENCE_START_FIJATE.matcher(text);
        StringBuffer sb = new StringBuffer();
        while (m.find()) {
            m.appendReplacement(sb, Matcher.quoteReplacement(m.group(1) + m.group(2).toUpperCase(Locale.ROOT)));
        }
        m.appendTail(sb);
        text = ANY_FIJATE.matcher(sb.toString()).replaceAll("");

        // 4. Ocultar códigos SKU internos, precios anteriores y avisos no solicitados de fotos extra
        text = SKU_LABEL_PATTERN.matcher(text).replaceAll("");
        text = OLD_PRICE_PATTERN.matcher(text).replaceAll("");
        text = MORE_PHOTOS_HINT_PATTERN.matcher(text).replaceAll("");

        // 5. Normalizar espacios huérfanos por la limpieza sin destruir saltos de línea
        text = text.replaceAll("[ \\t]{2,}", " ");
        text = text.replaceAll(" +([.,!?:;])", "$1");
        text = text.replaceAll("(?m)^[ \\t]+|[ \\t]+$", "");
        text = text.replaceAll("\\n{3,}", "\n\n");
        return text.trim();
    }

    public static String normalize(String input) {
        if (input == null) {
            return "";
        }
        String n = Normalizer.normalize(input, Normalizer.Form.NFD).replaceAll("\\p{M}+", "");
        return n.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9\\s]", " ").replaceAll("\\s+", " ").trim();
    }
}
