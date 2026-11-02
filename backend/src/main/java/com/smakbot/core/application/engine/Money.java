package com.smakbot.core.application.engine;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

/** Formato monetario equivalente a {@code toLocaleString("es-HN")} del Oráculo: L.2,950 */
public final class Money {

    private Money() {
    }

    public static String format(BigDecimal amount) {
        DecimalFormat df = new DecimalFormat("#,##0.##", DecimalFormatSymbols.getInstance(Locale.US));
        return df.format(amount == null ? BigDecimal.ZERO : amount);
    }

    public static String lempiras(BigDecimal amount) {
        return "L." + format(amount);
    }
}
