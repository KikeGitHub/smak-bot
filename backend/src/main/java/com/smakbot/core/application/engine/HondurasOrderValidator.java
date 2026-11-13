package com.smakbot.core.application.engine;

import com.smakbot.core.domain.model.GeoLocation;

import java.text.Normalizer;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Validaciones deterministas estrictas para datos de pedidos y facturación en Honduras.
 */
public final class HondurasOrderValidator {

    private static final Pattern ALPHA_WORD = Pattern.compile(".*\\p{L}{2,}.*");
    private static final Pattern CONTAINS_DIGIT = Pattern.compile(".*\\d.*");
    private static final Pattern HN_PHONE_PREFIX = Pattern.compile("^[23789]\\d{7}$");
    private static final Pattern REPEATED_DIGITS = Pattern.compile("^(\\d)\\1+$");
    private static final Pattern RTN_14_DIGITS = Pattern.compile("^\\d{14}$");

    private static final Set<String> NON_NAME_WORDS = Set.of(
            "hola", "buenas", "si", "no", "ok", "okay", "dale", "listo", "claro",
            "quiero", "kiero", "precio", "cuanto", "confirmar", "cancelar", "gracias",
            "menu", "reiniciar", "nombre", "yo", "consumidor", "final", "factura"
    );

    private static final Set<String> VAGUE_ADDRESSES = Set.of(
            "tegucigalpa", "san pedro sula", "sps", "la ceiba", "choluteca", "comayagua",
            "puerto cortes", "danli", "progreso", "el progreso", "honduras", "mi casa",
            "casa", "aqui", "mi trabajo", "trabajo", "oficina", "agencia", "cargo expreso",
            "no se", "pendiente"
    );

    private HondurasOrderValidator() {}

    public static String extractCleanFullName(String raw) {
        if (raw == null) return "";
        String cleaned = raw.trim()
                .replaceAll("^(?i)(mi nombre es|me llamo|soy|nombre completo[:\\s]*|nombre[:\\s]*|destinatario[:\\s]*)\\s+", "")
                .replaceAll("\\s+", " ")
                .trim();
        return cleaned;
    }

    public static boolean isValidFullName(String raw) {
        String clean = extractCleanFullName(raw);
        if (clean.length() < 5 || clean.length() > 120) return false;
        if (CONTAINS_DIGIT.matcher(clean).matches()) return false;
        if (clean.contains("?") || clean.contains("¿") || clean.contains("http")) return false;

        String norm = normalize(clean);
        if (NON_NAME_WORDS.contains(norm)) return false;

        String[] parts = clean.split("\\s+");
        if (parts.length < 2) return false;

        int validParts = 0;
        for (String p : parts) {
            String stripped = p.replaceAll("[^\\p{L}]", "");
            if (stripped.length() >= 2 && ALPHA_WORD.matcher(stripped).matches()) {
                validParts++;
            }
        }
        return validParts >= 2;
    }

    public static boolean isAgencyAddress(String raw) {
        if (raw == null) return false;
        String norm = normalize(raw);
        return norm.contains("agencia") || norm.contains("sucursal") || norm.contains("oficina")
                || norm.contains("ocurre") || norm.contains("punto caex") || norm.contains("cargo expreso");
    }

    public static boolean isValidHondurasAddress(String raw, GeoLocation loc) {
        if (loc != null && loc.lat() != null && loc.lng() != null) {
            return true;
        }
        if (raw == null || raw.isBlank()) return false;
        String trimmed = raw.trim();
        if (trimmed.contains("?") || trimmed.contains("¿")) return false;

        String lower = trimmed.toLowerCase(Locale.ROOT);
        if (lower.contains("maps.google") || lower.contains("maps.app.goo.gl") || lower.contains("goo.gl/maps")) {
            return true;
        }

        String norm = normalize(trimmed);
        if (VAGUE_ADDRESSES.contains(norm)) return false;
        if (containsQuestionKeyword(norm)) return false;

        String[] words = trimmed.split("\\s+");
        if (isAgencyAddress(trimmed)) {
            return trimmed.length() >= 12 && words.length >= 2;
        }

        // Dirección domiciliaria Honduras: requiere al menos 12 chars y 3 palabras reales (ciudad + colonia/barrio + calle/casa/referencia)
        return trimmed.length() >= 12 && words.length >= 3;
    }

    public static Optional<String> normalizeAndValidatePhone(String raw) {
        if (raw == null || raw.isBlank()) return Optional.empty();
        String digits = raw.replaceAll("\\D", "");
        if (digits.length() == 11 && digits.startsWith("504")) {
            digits = digits.substring(3);
        }
        if (!HN_PHONE_PREFIX.matcher(digits).matches()) {
            return Optional.empty();
        }
        if (REPEATED_DIGITS.matcher(digits).matches() || "12345678".equals(digits) || "87654321".equals(digits)) {
            return Optional.empty();
        }
        return Optional.of(digits.substring(0, 4) + "-" + digits.substring(4));
    }

    public static boolean isValidHondurasPhone(String raw) {
        return normalizeAndValidatePhone(raw).isPresent();
    }

    public static Optional<Boolean> parseInvoiceDecision(String raw) {
        if (raw == null || raw.isBlank()) return Optional.empty();
        String norm = normalize(raw);
        if (norm.isBlank()) return Optional.empty();

        // Evaluar primero rechazo explícito ("Consumidor final, no necesito RTN")
        if (norm.equals("no")
                || norm.startsWith("no ")
                || norm.contains(" no ")
                || norm.contains("sin factura")
                || norm.contains("consumidor final")
                || norm.contains("no necesito")
                || norm.contains("no quiero")
                || norm.contains("no ocupo")
                || norm.contains("no gracias")
                || norm.contains("particular")) {
            return Optional.of(Boolean.FALSE);
        }

        if (norm.equals("si")
                || norm.startsWith("si ")
                || norm.contains(" si ")
                || norm.contains("claro")
                || norm.contains("por supuesto")
                || norm.contains("quiero factura")
                || norm.contains("con factura")
                || norm.contains("con rtn")
                || norm.contains("ocupo factura")
                || norm.contains("necesito factura")
                || norm.contains("requiero factura")
                || norm.equals("factura")
                || norm.equals("rtn")) {
            return Optional.of(Boolean.TRUE);
        }
        return Optional.empty();
    }

    /**
     * Detecta si el cliente solicitó explícitamente factura con RTN por iniciativa propia.
     * Si la niega ("sin factura", "consumidor final"), retorna false.
     */
    public static boolean explicitInvoiceRequested(String raw) {
        if (raw == null || raw.isBlank()) return false;
        String norm = normalize(raw);
        if (norm.isBlank()) return false;
        if (norm.contains("sin factura")
                || norm.contains("no quiero factura")
                || norm.contains("no necesito factura")
                || norm.contains("no ocupo factura")
                || norm.contains("no requiero factura")
                || norm.contains("consumidor final")) {
            return false;
        }
        return norm.contains("factura")
                || norm.contains("rtn")
                || norm.contains("credito fiscal")
                || norm.contains("comprobante fiscal");
    }

    public static Optional<String> normalizeAndValidateRtn(String raw) {
        if (raw == null || raw.isBlank()) return Optional.empty();
        String stripped = raw.replaceAll("[\\s-]", "").trim();
        Matcher m = Pattern.compile("(\\d{14})").matcher(stripped);
        if (!RTN_14_DIGITS.matcher(stripped).matches()) {
            // Permitir extraer 14 dígitos si escribió "Mi RTN es 08011990123456", siempre que no contenga basura mezclada
            if (stripped.matches("(?i)(?:mirtnes|rtn|es|:)*(\\d{14})") && m.find()) {
                stripped = m.group(1);
            } else {
                return Optional.empty();
            }
        }
        if ("00000000000000".equals(stripped)) {
            return Optional.empty();
        }
        return Optional.of(stripped);
    }

    public static boolean isValidHondurasRtn(String raw) {
        return normalizeAndValidateRtn(raw).isPresent();
    }

    public static String extractCleanBusinessName(String raw) {
        if (raw == null) return "";
        return raw.trim()
                .replaceAll("^(?i)(raz[oó]n social[:\\s]*|empresa[:\\s]*|nombre comercial[:\\s]*|a nombre de[:\\s]*)\\s*", "")
                .replaceAll("\\s+", " ")
                .trim();
    }

    public static boolean isValidBusinessName(String raw) {
        String clean = extractCleanBusinessName(raw);
        if (clean.length() < 3 || clean.length() > 150) return false;
        if (clean.contains("?") || clean.contains("¿")) return false;
        if (clean.matches("^\\d+$")) return false;
        String norm = normalize(clean);
        return !NON_NAME_WORDS.contains(norm) && !"na".equals(norm) && !"n a".equals(norm) && ALPHA_WORD.matcher(clean).matches();
    }

    public static boolean isValidCancellationReason(String raw) {
        if (raw == null || raw.isBlank()) return false;
        String trimmed = raw.trim();
        if (trimmed.length() < 4) return false;
        String norm = normalize(trimmed);
        if (Set.of("cancelar", "cancelar pedido", "cancela", "si", "no", "ok", "nada").contains(norm)) {
            return false;
        }
        return ALPHA_WORD.matcher(trimmed).matches();
    }

    private static boolean containsQuestionKeyword(String norm) {
        return norm.contains("cuanto vale") || norm.contains("cuanto cuesta") || norm.contains("precio")
                || norm.contains("envio gratis") || norm.contains("horario") || norm.contains("tienen stock");
    }

    public static String normalize(String input) {
        if (input == null) return "";
        String n = Normalizer.normalize(input, Normalizer.Form.NFD).replaceAll("\\p{M}+", "");
        return n.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9\\s]", " ").replaceAll("\\s+", " ").trim();
    }
}

