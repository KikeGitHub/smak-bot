package com.smakbot.core.application.engine;

import com.smakbot.core.domain.model.Product;
import com.smakbot.core.domain.model.Tenant;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.smakbot.core.application.engine.Money.lempiras;
import static com.smakbot.core.application.engine.TextNormalizer.clean;

/**
 * Asesoría de catálogo: líneas de producto, cotización por volumen y respuestas de atributos
 * (precio, colores, medidas, materiales, peso, fotos, envío, stock, catálogo).
 *
 * <p>Diferencia deliberada vs. Oráculo: las líneas de producto se construyen DINÁMICAMENTE desde el catálogo del
 * tenant (agrupando variantes por familia de SKU) en lugar de textos con SKUs fijos, para que el motor sea
 * multitenant. Los encabezados y cierres se conservan del Oráculo.</p>
 */
public class CatalogAdvisor {

    private static final Pattern QTY_NUM = Pattern.compile("\\b([2-9]|1\\d|20)\\b");
    private static final Map<String, Integer> QTY_WORDS = Map.of("dos", 2, "tres", 3, "cuatro", 4, "cinco", 5, "seis", 6, "diez", 10, "docena", 12);
    private static final List<String> SPECIFIC_MODELS = List.of("wynn", "miles", "ezri", "savadir", "todd", "doncaster", "elam", "kira", "nobby", "bicicleta", "hamaca");
    private static final String[] QUERY_WORDS = {"que", "cuales", "tienen", "hay", "venden", "muestrame", "recomiendan", "recomienda", "busco", "opciones", "modelos", "catalogo", "ver", "linea", "tipos"};

    private record ProductLine(String key, String header, String intro, String closing, List<String> triggers,
                               List<String> pluralSignals, Predicate<String> productFilter) {
    }

    private static final List<ProductLine> LINES = List.of(
            new ProductLine("sillas", "🪑 **Línea de Sillas y Sillones Disponibles en %s:**",
                    "Contamos con modelos prémium diseñados para confort postural, trabajo intensivo de oficina y gaming:",
                    "🚚 **Beneficio:** ¡Todas incluyen **envío 100% GRATIS** a todo el país vía Cargo Expreso y pago en efectivo contra entrega!\n\n¿Cuál de estas opciones te gustaría revisar a detalle (medidas, colores) o deseas preparar tu pedido?",
                    List.of("silla", "sillas", "sillon", "sillones", "ergonomica", "ergonomicas", "gamer", "oficina", "ejecutiva", "ejecutivas", "despacho", "trabajar", "home office", "estar sentado", "pasar sentado"),
                    List.of("sillas", "sillones", "para trabajar", "home office", "para oficina", "de oficina"),
                    n -> (n.contains("silla") || n.contains("sillon")) && !n.contains("ruedas") && !n.contains("sofa")),
            new ProductLine("taburetes", "🍸 **Línea de Taburetes y Bancos para Barra %s:**",
                    "Nuestra línea estilo industrial Tolix está fabricada en acero al carbono forjado con pintura electrostática anticorrosiva horneada:",
                    "🚚 ¡Envíos **GRATIS** a toda Honduras con pago contra entrega!\n\n¿Cuántas piezas necesitas para tu barra o te gustaría ver fotografías reales?",
                    List.of("taburete", "taburetes", "banco", "bancos", "tolix", "barra", "desayunador", "altos", "para barra"),
                    List.of("taburetes", "bancos", "para barra", "tolix"),
                    n -> n.contains("taburete") || n.contains("banco")),
            new ProductLine("muebles", "🪵 **Línea de Escritorios, Mesas y Organización %s:**",
                    "Fabricados en combinación de madera melamínica de alta densidad y bastidores estructurales de hierro industrial:",
                    "🚚 Vienen en caja sellada con manual gráfico y herramientas incluidas. ¡Envío gratis a todo el país!\n\n¿Por cuál de estos muebles deseas consultar medidas o hacer tu pedido?",
                    List.of("escritorio", "escritorios", "estanteria", "estanterias", "estante", "estantes", "mesa", "mesas", "comedor", "organizacion", "muebles", "mueble", "repisa", "repisas"),
                    List.of("escritorios", "estanterias", "mesas", "muebles", "de oficina"),
                    n -> n.contains("escritorio") || n.contains("mesa") || n.contains("estanter") || n.contains("repisa")),
            new ProductLine("cocina_bano", "🚿 **Línea de Grifería, Piletas y Baño %s:**",
                    "Cuerpo 100% en Acero Inoxidable 304 quirúrgico con cartuchos cerámicos anti-fuga:",
                    "🚚 ¡Envío gratis a domicilio con pago contra entrega!\n\n¿Deseas ver fotografías o consultar instalación?",
                    List.of("cocina", "bano", "regadera", "regaderas", "ducha", "duchas", "monocomando", "monocomandos", "grifo", "grifos", "griferia", "fregadero", "fregaderos", "pileta", "piletas"),
                    List.of("duchas", "regaderas", "monocomandos", "piletas", "cocina", "bano"),
                    n -> n.contains("pileta") || n.contains("monocomando") || n.contains("ducha") || n.contains("grifo") || n.contains("regadera")),
            new ProductLine("escaleras", "🪜 **Línea de Escaleras y Equipamiento de Carga %s:**",
                    "Equipamiento de aluminio y acero para el hogar y el trabajo:",
                    "🚚 ¡Envíos gratis a todo el país vía Cargo Expreso con pago al recibir!",
                    List.of("escalera", "escaleras", "andamio", "andamios", "carro de carga", "carretilla", "carga"),
                    List.of("escaleras", "andamios"),
                    n -> n.contains("escalera") || n.contains("carro") || n.contains("carga"))
    );

    /** Asesoría por línea de producto ("¿Qué sillas tienen?"). Vacío si el mensaje apunta a un modelo/SKU concreto. */
    public Optional<Answer> categoryAdvisory(MessageText m, List<Product> products, Tenant tenant) {
        if (ProductMatcher.hasExplicitSkuPattern(m.raw()) || ProductMatcher.mentionsRegisteredSku(m.raw(), products)) {
            return Optional.empty();
        }
        if (m.hasAny(SPECIFIC_MODELS)) return Optional.empty();

        for (ProductLine line : LINES) {
            boolean triggered = m.hasAny(line.triggers()) && (m.token(QUERY_WORDS) || m.hasAny(line.pluralSignals()));
            if (!triggered) continue;

            List<Product> lineProducts = dedupeByFamily(products.stream()
                    .filter(p -> line.productFilter().test(clean(p.name() + " " + nullToEmpty(p.category()))))
                    .toList(), 4);
            if (lineProducts.isEmpty()) continue;

            String items = lineProducts.stream()
                    .map(p -> "• **" + p.name() + "** (SKU: " + p.sku() + ") — **" + lempiras(p.salePrice()) + "**"
                            + (detailOf(p).isEmpty() ? "" : "\n  *" + detailOf(p) + "*"))
                    .collect(Collectors.joining("\n\n"));
            String text = String.format(line.header(), tenant.name()) + "\n\n" + line.intro() + "\n\n" + items + "\n\n" + line.closing();
            List<String> images = lineProducts.stream().flatMap(p -> p.firstImages(1).stream()).toList();
            return Optional.of(Answer.withImages(text, null, images));
        }
        return Optional.empty();
    }

    /** Cotización por volumen ("¿Si compro 3 sillas cuánto me saldría?"). */
    public Optional<Answer> volumeQuote(MessageText m, Product currentProduct, List<Product> products) {
        Integer qty = null;
        Matcher num = QTY_NUM.matcher(m.raw());
        if (num.find()) {
            qty = Integer.parseInt(num.group(1));
        } else {
            for (Map.Entry<String, Integer> e : QTY_WORDS.entrySet()) {
                if (m.tokens().contains(e.getKey())) {
                    qty = e.getValue();
                    break;
                }
            }
        }
        boolean quoteIntent = m.hasAny("cuanto me sale", "cuanto sale", "cuanto seria", "cuanto cuesta", "cuanto es",
                "en cuanto me sale", "en cuanto sale", "precio por", "total por", "si compro", "si llevo",
                "si pido", "si ordeno", "por mayor", "mayoreo", "por cantidad", "cuanto saldria");
        if (qty == null || !quoteIntent) return Optional.empty();

        Product prod = currentProduct;
        if (prod == null && !products.isEmpty()) {
            Predicate<String> filter = null;
            if (m.hasAny("silla", "sillon")) filter = LINES.get(0).productFilter();
            else if (m.hasAny("taburete", "banco")) filter = LINES.get(1).productFilter();
            else if (m.has("escritorio")) filter = n -> n.contains("escritorio");
            if (filter != null) {
                Predicate<String> f = filter;
                prod = products.stream().filter(p -> f.test(clean(p.name()))).findFirst().orElse(null);
            }
        }
        if (prod == null) return Optional.empty();

        BigDecimal unit = prod.salePrice();
        BigDecimal total = unit.multiply(BigDecimal.valueOf(qty));
        String text = "🏷️ **Cotización por Volumen (" + qty + " " + (qty == 1 ? "unidad" : "unidades") + "):**\n\n"
                + "• Producto: **" + prod.name() + "** (SKU: " + prod.sku() + ")\n"
                + "• Precio regular unitario: " + lempiras(prod.effectiveRegularPrice()) + "\n"
                + "• **Precio especial de oferta:** **" + lempiras(unit) + "** c/u\n"
                + "• **Total a pagar:** **" + lempiras(total) + "**\n"
                + "• 🚚 **Costo de envío:** ¡Completamente **GRATIS** a cualquier parte de Honduras vía Cargo Expreso!\n"
                + "• 💵 **Forma de pago:** Efectivo contra entrega al recibir en tu puerta (o transferencia bancaria previa).\n"
                + "• 🎁 **Beneficio por Mayoreo:** Al ordenar " + (qty >= 3 ? "3 o más unidades" : "en volumen")
                + ", coordinamos con supervisión de ventas para incluirte una atención o regalía especial en tu factura.\n\n"
                + "¿Deseas que preparemos tu pedido para apartar las " + qty + " unidades en inventario?";
        return Optional.of(Answer.withImages(text, prod, prod.firstImages(2)));
    }

    public Answer price(Product p, Tenant tenant, List<Product> products) {
        if (p == null) {
            BigDecimal min = products.stream().map(Product::salePrice).min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
            BigDecimal max = products.stream().map(Product::salePrice).max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
            return Answer.of("🏷️ **Precios en " + tenant.name() + ":**\n\nNuestros precios van desde **" + lempiras(min) + "** hasta **"
                    + lempiras(max) + "**.\n\n¡Todos incluyen **envío gratuito** a nivel nacional y pago en efectivo contra entrega!\n\n¿Por el precio de qué artículo en específico deseas consultar?");
        }
        return Answer.of("🏷️ **Precio de " + p.name() + " (SKU: " + p.sku() + "):**\n\n• **Precio de oferta especial:** **" + lempiras(p.salePrice())
                + "** *(Precio regular: " + lempiras(p.effectiveRegularPrice()) + ")*\n• 🎨 **Color registrado:** **" + colorsOf(p)
                + "**\n• 🚚 **Costo de envío:** ¡Completamente **GRATIS** a cualquier parte de Honduras vía Cargo Expreso!\n• 💵 **Forma de pago:** Pagas en efectivo **contra entrega** al recibir en tu puerta (o transferencia bancaria previa).\n\n¿Deseas que preparemos tu pedido o tienes alguna duda de colores o medidas?", p);
    }

    public Answer colors(MessageText m, Product p, List<Product> products, Tenant tenant) {
        Map<String, List<String>> colorForms = new LinkedHashMap<>();
        colorForms.put("blanco", List.of("blanco", "blanca", "white"));
        colorForms.put("negro", List.of("negro", "negra", "black"));
        colorForms.put("cafe", List.of("cafe", "marron", "brown"));
        colorForms.put("gris", List.of("gris", "grises", "grey", "gray"));
        colorForms.put("rosa", List.of("rosa", "rosado", "rosada", "pink"));
        colorForms.put("rojo", List.of("rojo", "roja", "red"));
        colorForms.put("azul", List.of("azul", "azules", "blue"));
        colorForms.put("verde", List.of("verde", "verdes", "green"));
        colorForms.put("dorado", List.of("dorado", "dorada", "oro", "gold"));
        colorForms.put("inox", List.of("inox", "inoxidable", "acero"));
        colorForms.put("madera", List.of("madera", "pino", "natural", "wood"));

        List<String> detected = new ArrayList<>();
        colorForms.forEach((key, forms) -> {
            if (m.hasAny(forms)) detected.add(key);
        });

        if (p != null) {
            String prodColors = clean(colorsOf(p));
            if (!detected.isEmpty()) {
                boolean matches = detected.stream().anyMatch(k -> colorForms.get(k).stream().anyMatch(prodColors::contains));
                if (matches) {
                    return Answer.withImages("🎨 **¡Sí, disponible!**\n\nEl producto **" + p.name() + "** (SKU: " + p.sku()
                            + ") cuenta en nuestro catálogo con el acabado oficial en: **" + colorsOf(p) + "**.\n\n• 🏷️ **Precio:** "
                            + lempiras(p.salePrice()) + "\n• 📏 **Medidas:** " + orDefault(p.dimensions(), "Estándar")
                            + "\n• 🚚 **Envío:** ¡Totalmente GRATIS a todo el país vía Cargo Expreso!\n• 💵 **Pago:** En efectivo contra entrega al recibir en tu puerta.\n\n¿Deseas que preparemos tu pedido o tienes alguna otra duda?", p, p.firstImages(2));
                }
                String key = detected.get(0);
                Optional<Product> alt = products.stream()
                        .filter(o -> !o.sku().equals(p.sku()) && clean(nullToEmpty(o.colors())).contains(key))
                        .findFirst();
                String altText = alt.map(a -> "\n\n💡 **Variante disponible en ese color:** Contamos con **" + a.name() + "** (SKU: " + a.sku()
                        + ") que viene en acabado **" + a.colors() + "** a precio especial de **" + lempiras(a.salePrice()) + "**.").orElse("");
                return Answer.of("🎨 Para el modelo **" + p.name() + "** (SKU: " + p.sku() + "), el acabado registrado en fábrica es únicamente: **"
                        + colorsOf(p) + "** (no viene en " + String.join(" / ", detected) + ")." + altText
                        + "\n\nSi necesitas un modelo o color personalizado, puedo comunicarte con un ejecutivo comercial.", p);
            }
            return Answer.withImages("🎨 **Colores disponibles para " + p.name() + " (SKU: " + p.sku() + "):**\n\nEn nuestro catálogo de fábrica, este modelo viene en acabado oficial: **"
                    + colorsOf(p) + "**.\n\n• 🏷️ **Precio:** " + lempiras(p.salePrice()) + "\n• 📏 **Dimensiones:** " + orDefault(p.dimensions(), "Estándar")
                    + "\n• 📦 **Disponibilidad:** " + (p.inStock() ? "✅ ¡" + p.stock() + " en stock!" : "⚠️ Agotado")
                    + "\n\n¿Deseas conocer las medidas, fotografías reales o preparar tu pedido?", p, p.firstImages(2));
        }

        for (ProductLine line : LINES) {
            if (!m.hasAny(line.triggers())) continue;
            List<Product> filtered = products.stream().filter(o -> line.productFilter().test(clean(o.name()))).limit(5).toList();
            if (filtered.isEmpty()) continue;
            String list = filtered.stream().map(o -> "• **" + o.name() + "** (" + o.sku() + "): Acabado **" + colorsOf(o) + "**").collect(Collectors.joining("\n"));
            return Answer.of("🎨 **Colores disponibles en la línea seleccionada:**\n\n" + list + "\n\n¿Por qué modelo en específico te gustaría consultar?");
        }
        String top = products.stream().limit(6).map(o -> "• **" + o.name() + "** (" + o.sku() + "): **" + colorsOf(o) + "**").collect(Collectors.joining("\n"));
        return Answer.of("🎨 **Guía de Colores y Acabados de " + tenant.name() + ":**\n\n" + top + "\n\n¿Por qué producto en específico deseas consultar sus colores?");
    }

    public Answer dimensions(Product p, List<Product> products, Tenant tenant) {
        if (p == null) {
            String items = products.stream().limit(6)
                    .map(o -> "• **" + o.name() + "** (" + o.sku() + "): **" + orDefault(o.dimensions(), "Estándar") + "** *(Capacidad: " + orDefault(o.weightLimit(), "Estándar") + ")*")
                    .collect(Collectors.joining("\n"));
            return Answer.of("📏 **Guía de Medidas y Dimensiones de " + tenant.name() + ":**\n\nAquí tienes las dimensiones exactas de nuestros productos más destacados:\n\n"
                    + items + "\n\n¿Por las medidas o especificaciones de qué producto en específico deseas consultar?");
        }
        return Answer.withImages("📏 **Medidas y Especificaciones de " + p.name() + " (SKU: " + p.sku() + "):**\n\n• 📐 **Medidas del producto armado:** **"
                + orDefault(p.dimensions(), "Estándar según especificación técnica") + "**\n• 💪 **Peso máximo soportado (resistencia):** "
                + orDefault(p.weightLimit(), "150 kg / Alta resistencia") + "\n• 🎨 **Color registrado:** **" + colorsOf(p)
                + "**\n• 🏷️ **Precio de oferta (mejor precio):** **" + lempiras(p.salePrice()) + "** *(Precio regular: " + lempiras(p.effectiveRegularPrice()) + ")*"
                + "\n• 📦 **Stock disponible:** "
                + (p.inStock() ? "✅ ¡" + p.stock() + " unidades en stock!" : "⚠️ Agotado temporalmente")
                + "\n\n¿Deseas que preparemos tu pedido contra entrega o prefieres consultar algo más?", p, p.firstImages(2));
    }

    public Answer material(Product p) {
        if (p == null) {
            return Answer.of("📦 **Materiales y Ensamble:**\n\n• Todos nuestros productos son **100% nuevos de paquete** y vienen en su caja sellada con empaque reforzado.\n• **Materiales de alta durabilidad:** Estructuras de acero al carbono, pintura electrostática horneada anticorrosiva, acero inoxidable 304, madera tratada y aleación de aluminio aeroespacial.\n• **Armado sencillo:** Vienen listos para ensamblar con su **manual gráfico paso a paso y kit de herramientas (llaves Allen y tornillos)** incluidas.\n\n¿Por el material de qué producto en específico deseas consultar?");
        }
        String n = clean(p.name() + " " + nullToEmpty(p.category()));
        String detail = "Estructura de alta resistencia y acabados prémium.";
        if (n.contains("gamer") || n.contains("sillon") || n.contains("silla")) {
            detail = "Estructura interna de acero tubular reforzado, pistón hidráulico clase 4 certificado, tapizado en PU prémium / malla de nylon de alta tenacidad y base reforzada con ruedas silenciosas 360°.";
        } else if (n.contains("tolix") || n.contains("taburete") || n.contains("banco")) {
            detail = "Acero al carbono forjado con pintura electrostática anticorrosiva horneada, y asiento reforzado (en modelos con madera, pino natural tratado de alta densidad).";
        } else if (n.contains("estanteria") || n.contains("estante") || n.contains("escritorio") || n.contains("mesa")) {
            detail = "Bastidor estructural de hierro industrial con pintura electrostática mate y superficie de madera melamínica de alta densidad resistente al agua y peso (o mármol sintético en mesas auxiliares).";
        } else if (n.contains("ducha") || n.contains("pileta") || n.contains("monocomando")) {
            detail = "Cuerpo en Acero Inoxidable 304 quirúrgico anticorrosivo con acabado negro mate o cepillado inox, cartucho cerámico anti-fugas y boquillas de silicona anticalcárea.";
        } else if (n.contains("escalera")) {
            detail = "Aleación de aluminio estructural de grado aeroespacial, bisagras automáticas de bloqueo de seguridad y zapatas de goma antideslizantes.";
        }
        return Answer.of("📦 **Materiales y Ensamble de " + p.name() + " (" + p.sku() + "):**\n\n• **Materiales:** " + detail
                + "\n• **Condición:** 100% nuevo de fábrica en caja original sellada.\n• **Armado fácil:** Viene desarmado para protección durante el envío e incluye su **manual gráfico paso a paso** y el **kit completo de herramientas (llaves Allen y tornillería)**. Se arma en pocos minutos sin herramientas adicionales.\n\n¿Te gustaría ordenar el tuyo o consultar alguna otra característica?", p);
    }

    public Answer weight(Product p) {
        if (p == null) {
            return Answer.of("💪 Todos nuestros productos de mobiliario y equipamiento cuentan con estándares de alta resistencia para uso comercial y residencial intensivo. ¿Por qué artículo en particular deseas consultar su capacidad?");
        }
        return Answer.of("💪 **Capacidad y Resistencia de " + p.name() + " (" + p.sku() + "):**\n\n• 🏋️ **Peso máximo soportado (resistencia):** **"
                + orDefault(p.weightLimit(), "150 kg / Uso comercial y residencial de alta resistencia")
                + "**\n• 📐 **Medidas del producto armado:** " + orDefault(p.dimensions(), "Estándar según ficha técnica")
                + "\n• 🛠️ **Estructura:** Diseñada con estándares de máxima durabilidad y estabilidad.\n\n¿Deseas consultar medidas, colores o hacer tu pedido?", p);
    }

    public Answer photos(Product p) {
        return Answer.withImages("¡Claro! Aquí tienes fotografías reales del producto armado **" + p.name() + "** (" + p.sku() + "):\n\n🏷️ **Precio de oferta:** " + lempiras(p.salePrice())
                + "\n📐 **Medidas del producto armado:** " + orDefault(p.dimensions(), "Estándar")
                + "\n💪 **Peso máximo soportado:** " + orDefault(p.weightLimit(), "Estándar")
                + "\n🎨 **Color:** " + colorsOf(p)
                + "\n\n✅ **Stock disponible:** " + (p.inStock() ? p.stock() + " unidades en inventario" : "Agotado") + ". ¿Deseas hacer tu pedido?", p, p.images());
    }

    public Answer shipping(Product p) {
        return Answer.withImages("¡Hola! Con gusto te informamos sobre el **" + p.name() + " (SKU: " + p.sku() + ")**:\n\n🚚 **Tiempo de entrega:** Nuestro tiempo estimado de entrega a domicilio es de **1 a 2 días hábiles** a todo el país vía Cargo Expreso (en Tegucigalpa y San Pedro Sula podemos coordinar entrega el mismo día si realizas tu pedido temprano).\n\n💵 **Pago seguro:** Pagas en efectivo **contra entrega** al recibir el paquete en la puerta de tu casa.\n\n✅ Tenemos **"
                + p.stock() + " unidades en stock** a precio de oferta **" + lempiras(p.salePrice()) + "**. ¿A qué ciudad y colonia sería tu entrega?", p, p.firstImages(1));
    }

    public Answer stock(Product p) {
        if (!p.inStock()) {
            return Answer.withImages("El producto **" + p.name() + "** (SKU: " + p.sku() + ") se encuentra actualmente **agotado**.", p, p.firstImages(2));
        }
        return Answer.withImages("¡Sí, tenemos disponible! Del SKU **" + p.sku() + "** (" + p.name() + ") nos quedan **" + p.stock() + " unidades** a "
                + lempiras(p.salePrice()) + ".\n\n🎨 **Color:** " + colorsOf(p) + "\n📏 **Medidas:** " + orDefault(p.dimensions(), "Estándar")
                + "\n\n¿Deseas que preparemos tu pedido o tienes alguna duda?", p, p.firstImages(2));
    }

    public Answer catalog(List<Product> products, Tenant tenant) {
        String items = products.stream()
                .map(p -> "• **" + p.sku() + "** · " + p.name() + " — *" + lempiras(p.salePrice()) + "* (" + (p.inStock() ? p.stock() + " en stock" : "Agotado") + ")")
                .collect(Collectors.joining("\n"));
        return Answer.of("📦 **Catálogo de " + tenant.name() + "**:\n\n" + items
                + "\n\nPuedes preguntarme por cualquiera de ellos (por ejemplo: *\"¿Tienen stock para la Silla Gamer?\"* o *\"¿En qué colores viene el sillón ejecutivo?\"*).");
    }

    // ---- utilidades ----

    static List<Product> dedupeByFamily(List<Product> list, int limit) {
        Map<String, Product> byFamily = new LinkedHashMap<>();
        for (Product p : list) {
            byFamily.putIfAbsent(p.familyKey(), p);
        }
        return byFamily.values().stream().limit(limit).toList();
    }

    private static String detailOf(Product p) {
        if (p.weightLimit() != null && !p.weightLimit().isBlank()) return "Soporte: " + p.weightLimit();
        if (p.dimensions() != null && !p.dimensions().isBlank()) return "Medidas: " + p.dimensions();
        return "";
    }

    static String colorsOf(Product p) {
        return orDefault(p.colors(), "Negro");
    }

    static String orDefault(String v, String def) {
        return v == null || v.isBlank() ? def : v;
    }

    private static String nullToEmpty(String s) {
        return s == null ? "" : s;
    }
}
