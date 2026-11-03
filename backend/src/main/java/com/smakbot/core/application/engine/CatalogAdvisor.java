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
    private static final String[] QUERY_WORDS = {"que", "cuales", "tienen", "hay", "venden", "muestrame", "recomiendan", "recomienda", "busco", "opciones", "modelos", "catalogo", "ver", "linea", "tipos", "precio", "precios", "cuanto", "costo", "valor", "vale", "sale"};

    record ProductLine(String key, String header, String intro, String closing, List<String> triggers,
                       List<String> pluralSignals, Predicate<String> productFilter) {
    }

    static final List<ProductLine> LINES = List.of(
            new ProductLine("sillas", "🪑 **Modelos de Sillas y Sillones Disponibles en %s:**",
                    "Te comparto las opciones que tenemos listas para entrega inmediata:",
                    "🚚 ¡Todas incluyen **envío 100% GRATIS** a todo el país y pagas en **efectivo al recibir** en tu puerta!\n\n¿Cuál de estos modelos te gusta más o de cuál te gustaría ver fotos reales y medidas?",
                    List.of("silla", "sillas", "sillon", "sillones", "ergonomica", "ergonomicas", "gamer", "oficina", "ejecutiva", "ejecutivas", "despacho", "trabajar", "home office", "estar sentado", "pasar sentado"),
                    List.of("sillas", "sillones", "para trabajar", "home office", "para oficina", "de oficina"),
                    n -> (n.contains("silla") || n.contains("sillon")) && !n.contains("ruedas") && !n.contains("sofa")),
            new ProductLine("taburetes", "🍸 **Línea de Taburetes y Bancos para Barra %s:**",
                    "Te comparto los modelos estilo industrial Tolix en acero forjado que tenemos disponibles:",
                    "🚚 ¡Envíos **GRATIS** a toda Honduras con pago contra entrega!\n\n¿Cuántas piezas necesitas para tu barra o te gustaría ver fotos reales y medidas?",
                    List.of("taburete", "taburetes", "banco", "bancos", "tolix", "barra", "desayunador", "altos", "para barra"),
                    List.of("taburetes", "bancos", "para barra", "tolix"),
                    n -> n.contains("taburete") || n.contains("banco")),
            new ProductLine("muebles", "🪵 **Línea de Escritorios, Mesas y Organización %s:**",
                    "Te comparto las opciones en madera de alta densidad y bastidores de hierro que tenemos:",
                    "🚚 Vienen sellados de fábrica con manual y herramientas incluidas. ¡Envío 100% gratis a todo el país!\n\n¿De cuál te gustaría consultar las medidas para tu espacio o a qué ciudad te lo enviaríamos?",
                    List.of("escritorio", "escritorios", "estanteria", "estanterias", "estante", "estantes", "mesa", "mesas", "comedor", "organizacion", "muebles", "mueble", "repisa", "repisas"),
                    List.of("escritorios", "estanterias", "mesas", "muebles", "de oficina"),
                    n -> n.contains("escritorio") || n.contains("mesa") || n.contains("estanter") || n.contains("repisa")),
            new ProductLine("cocina_bano", "🚿 **Línea de Grifería, Piletas y Lavatrastos %s:**",
                    "Te muestro nuestras piletas y grifos en Acero Inoxidable 304 quirúrgico:",
                    "🚚 ¡Envío gratis a todo el país y pagas al recibir en tu puerta!\n\n¿Te gustaría ver fotos reales de cómo luce instalado o deseas consultar sus medidas?",
                    List.of("cocina", "bano", "regadera", "regaderas", "ducha", "duchas", "monocomando", "monocomandos", "grifo", "grifos", "griferia", "fregadero", "fregaderos", "pileta", "piletas"),
                    List.of("duchas", "regaderas", "monocomandos", "piletas", "cocina", "bano"),
                    n -> n.contains("pileta") || n.contains("monocomando") || n.contains("ducha") || n.contains("grifo") || n.contains("regadera")),
            new ProductLine("escaleras", "🪜 **Línea de Escaleras y Equipamiento %s:**",
                    "Equipamiento de aluminio y acero para el hogar y trabajo:",
                    "🚚 ¡Envío gratis a todo el país vía Cargo Expreso y pagas al recibir!\n\n¿Para qué tipo de trabajo o altura la necesitas, o a qué ciudad sería tu entrega?",
                    List.of("escalera", "escaleras", "andamio", "andamios", "carro de carga", "carretilla", "carga"),
                    List.of("escaleras", "andamios"),
                    n -> n.contains("escalera") || n.contains("carro") || n.contains("carga"))
    );

    public String detectCategoryKey(Product p) {
        if (p == null) return null;
        String pName = clean(p.name() + " " + nullToEmpty(p.category()));
        for (ProductLine line : LINES) {
            if (line.productFilter().test(pName)) {
                return line.key();
            }
        }
        return null;
    }

    /** Asesoría por línea de producto ("¿Qué sillas tienen?"). Vacío si el mensaje apunta a un modelo/SKU concreto. */
    public Optional<Answer> categoryAdvisory(MessageText m, List<Product> products, Tenant tenant) {
        return categoryAdvisory(m, products, tenant, null);
    }

    public Optional<Answer> categoryAdvisory(MessageText m, List<Product> products, Tenant tenant, com.smakbot.core.domain.model.ChatSession session) {
        if (ProductMatcher.hasExplicitSkuPattern(m.raw()) || ProductMatcher.mentionsRegisteredSku(m.raw(), products)) {
            return Optional.empty();
        }
        if (m.hasAny(SPECIFIC_MODELS)) return Optional.empty();

        // Soporte directo para selección numérica de opciones ("1", "2", "3", "4", "5") o palabras clave directas
        String cleanSingle = m.clean().trim();
        int directIdx = -1;
        if (cleanSingle.equals("1") || cleanSingle.equals("opcion 1") || cleanSingle.equals("1.")) directIdx = 0;
        else if (cleanSingle.equals("2") || cleanSingle.equals("opcion 2") || cleanSingle.equals("2.")) directIdx = 1;
        else if (cleanSingle.equals("3") || cleanSingle.equals("opcion 3") || cleanSingle.equals("3.")) directIdx = 2;
        else if (cleanSingle.equals("4") || cleanSingle.equals("opcion 4") || cleanSingle.equals("4.")) directIdx = 3;
        else if (cleanSingle.equals("5") || cleanSingle.equals("opcion 5") || cleanSingle.equals("5.")) directIdx = 4;

        if (directIdx >= 0 && directIdx < LINES.size()) {
            ProductLine line = LINES.get(directIdx);
            List<Product> lineProducts = dedupeByFamily(products.stream()
                    .filter(p -> line.productFilter().test(clean(p.name() + " " + nullToEmpty(p.category()))))
                    .toList(), 4);
            if (!lineProducts.isEmpty()) {
                if (session != null) {
                    session.setActiveCategory(line.key());
                    session.addOfferedSkus(lineProducts.stream().map(Product::sku).toList());
                    session.setSelectedSku(lineProducts.get(0).sku());
                }
                String items = lineProducts.stream()
                        .map(p -> "• **" + p.name() + "** — **" + lempiras(p.salePrice()) + "**"
                                + (detailOf(p).isEmpty() ? "" : "\n  *" + detailOf(p) + "*"))
                        .collect(Collectors.joining("\n\n"));
                String text = String.format(line.header(), tenant.name()) + "\n\n" + line.intro() + "\n\n" + items + "\n\n" + line.closing();
                List<String> images = lineProducts.stream().flatMap(p -> p.firstImages(1).stream()).toList();
                return Optional.of(Answer.withImages(text, null, images));
            }
        }

        for (ProductLine line : LINES) {
            boolean triggered = m.hasAny(line.triggers()) && (m.token(QUERY_WORDS) || m.hasAny(line.pluralSignals()));
            if (!triggered) continue;

            List<Product> lineProducts = dedupeByFamily(products.stream()
                    .filter(p -> line.productFilter().test(clean(p.name() + " " + nullToEmpty(p.category()))))
                    .toList(), 4);
            if (lineProducts.isEmpty()) continue;

            if (session != null) {
                session.setActiveCategory(line.key());
                session.addOfferedSkus(lineProducts.stream().map(Product::sku).toList());
                session.setSelectedSku(lineProducts.get(0).sku());
            }

            String items = lineProducts.stream()
                    .map(p -> "• **" + p.name() + "** — **" + lempiras(p.salePrice()) + "**"
                            + (detailOf(p).isEmpty() ? "" : "\n  *" + detailOf(p) + "*"))
                    .collect(Collectors.joining("\n\n"));
            String text = String.format(line.header(), tenant.name()) + "\n\n" + line.intro() + "\n\n" + items + "\n\n" + line.closing();
            List<String> images = lineProducts.stream().flatMap(p -> p.firstImages(1).stream()).toList();
            return Optional.of(Answer.withImages(text, null, images));
        }
        return Optional.empty();
    }

    /**
     * Continuidad conversacional ("¿Tienes más?", "¿Otro modelo?", "¿Tienes otra opción?").
     * Resuelve anáforas y elipsis consultando la categoría activa y excluyendo los SKUs ya mostrados.
     */
    public Answer moreOptions(com.smakbot.core.domain.model.ChatSession session, Product currentProduct, List<Product> catalog, Tenant tenant) {
        String activeCat = session != null ? session.getActiveCategory() : null;
        ProductLine targetLine = null;

        if (activeCat != null) {
            for (ProductLine line : LINES) {
                if (line.key().equalsIgnoreCase(activeCat)) {
                    targetLine = line;
                    break;
                }
            }
        }

        // Si no hay categoría activa pero hay un producto actual, deducir su línea
        if (targetLine == null && currentProduct != null) {
            String pName = clean(currentProduct.name() + " " + nullToEmpty(currentProduct.category()));
            for (ProductLine line : LINES) {
                if (line.productFilter().test(pName)) {
                    targetLine = line;
                    if (session != null) session.setActiveCategory(line.key());
                    break;
                }
            }
        }

        Predicate<String> filter;
        if (targetLine != null) {
            filter = targetLine.productFilter();
        } else if (currentProduct != null) {
            String pName = clean(currentProduct.name()).split(" ")[0];
            filter = n -> n.contains(pName);
        } else {
            filter = n -> true;
        }

        List<String> offered = session != null ? session.getOfferedSkus() : List.of();

        // Buscar productos disponibles que coincidan con la línea y NO hayan sido ofrecidos
        List<Product> remaining = catalog.stream()
                .filter(Product::inStock)
                .filter(p -> filter.test(clean(p.name() + " " + nullToEmpty(p.category()))))
                .filter(p -> !offered.contains(p.sku()))
                .toList();

        if (!remaining.isEmpty()) {
            List<Product> nextBatch = dedupeByFamily(remaining, 1);
            Product next = nextBatch.get(0);
            StringBuilder sb = new StringBuilder();
            sb.append("¡Claro con gusto! También tenemos este otro modelo disponible en tienda:\n\n");
            sb.append("• **").append(next.name()).append("** — **").append(lempiras(next.salePrice())).append("**\n");
            String detail = detailOf(next);
            if (!detail.isEmpty()) {
                sb.append("  *").append(detail).append("*\n");
            }
            sb.append("  *Colores:* ").append(colorsOf(next)).append("\n\n");
            sb.append("🚚 ¡Todos con **envío gratis** a todo el país y pagas en efectivo al recibir en tu puerta!\n\n")
              .append("¿Qué te parece este modelo o te gustaría conocer sus medidas y fotos reales?");

            if (session != null) {
                session.setSelectedSku(next.sku());
                session.addOfferedSku(next.sku());
            }
            return Answer.withImages(sb.toString(), next, next.firstImages(1));
        }

        // Si ya se mostraron todos los modelos de esa línea
        String lineName = targetLine != null ? targetLine.key() : "esta categoría";
        String altMsg = "En la línea de " + lineName + " ya te compartí los modelos principales que nos quedan para entrega inmediata en bodega. 😊\n\n"
                + "🚚 ¡Recuerda que todos cuentan con **envío 100% GRATIS** a todo el país y pagas al recibir!\n\n"
                + "¿Te gustaría ver fotos reales o conocer las medidas de alguno de los que vimos, o prefieres que busquemos otra línea de muebles?";
        return Answer.of(altMsg, currentProduct);
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
                + "• Producto: **" + prod.name() + "**\n"
                + "• Precio regular unitario: " + lempiras(prod.effectiveRegularPrice()) + "\n"
                + "• **Precio especial de oferta:** **" + lempiras(unit) + "** c/u\n"
                + "• **Total a pagar:** **" + lempiras(total) + "**\n"
                + "• 🚚 **Costo de envío:** ¡Completamente **GRATIS** a cualquier parte de Honduras vía Cargo Expreso!\n"
                + "• 💵 **Forma de pago:** Efectivo contra entrega al recibir en tu puerta (o transferencia bancaria previa).\n"
                + "• 🎁 **Beneficio por Mayoreo:** Al ordenar " + (qty >= 3 ? "3 o más unidades" : "en volumen")
                + ", coordinamos con supervisión de ventas para incluirte una atención o regalía especial en tu factura.\n\n"
                + "¿Te gustaría que te tome los datos para apartar las " + qty + " unidades con este precio especial o a qué ciudad sería la entrega?";
        return Optional.of(Answer.withImages(text, prod, prod.firstImages(2)));
    }

    public Answer price(Product p, Tenant tenant, List<Product> products) {
        if (p == null) {
            BigDecimal min = products.stream().map(Product::salePrice).min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
            BigDecimal max = products.stream().map(Product::salePrice).max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
            return Answer.of("¡Con gusto! En **" + tenant.name() + "** nuestros precios van desde **" + lempiras(min) + "** hasta **"
                    + lempiras(max) + "**.\n\n🚚 ¡Todos incluyen **envío 100% GRATIS** a todo el país y pagas al recibir en tu puerta!\n\n¿Por qué mueble en particular te gustaría consultar o a qué ciudad sería tu entrega?");
        }
        return Answer.of("¡Con gusto! El precio de la **" + p.name() + "** es de **" + lempiras(p.salePrice())
                + "** *(precio normal: " + lempiras(p.effectiveRegularPrice()) + ")*.\n\n• 🎨 **Colores:** " + colorsOf(p)
                + "\n• 🚚 **Envío:** ¡Completamente **GRATIS** a todo el país vía Cargo Expreso!\n• 💵 **Pago:** Pagas en efectivo **al recibir en tu puerta**.\n\n🚚 ¿A qué ciudad te la enviaríamos o te gustaría ver fotos reales de cómo luce armada?", p);
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
                    return Answer.withImages("🎨 **¡Sí, disponible!**\n\nEl modelo **" + p.name()
                            + "** viene disponible en: **" + colorsOf(p) + "**.\n\n• 🏷️ **Precio:** "
                            + lempiras(p.salePrice()) + "\n• 📏 **Medidas:** " + orDefault(p.dimensions(), "Estándar")
                            + "\n• 🚚 **Envío:** ¡Totalmente GRATIS a todo el país vía Cargo Expreso!\n• 💵 **Pago:** En efectivo contra entrega al recibir en tu puerta.\n\n🚚 ¿Te gustaría que te tome los datos para apartar la tuya o deseas consultar sus medidas?", p, p.firstImages(2));
                }
                String key = detected.get(0);
                Optional<Product> alt = products.stream()
                        .filter(o -> !o.sku().equals(p.sku()) && clean(nullToEmpty(o.colors())).contains(key))
                        .findFirst();
                String altText = alt.map(a -> "\n\n💡 **Variante disponible en ese color:** Contamos con **" + a.name()
                        + "** que viene en acabado **" + a.colors() + "** a precio especial de **" + lempiras(a.salePrice()) + "**.").orElse("");
                return Answer.of("🎨 Para el modelo **" + p.name() + "**, lo tenemos disponible en: **"
                        + colorsOf(p) + "** (no viene en " + String.join(" / ", detected) + ")." + altText
                        + "\n\n🚚 ¡Todos incluyen envío gratis y pagas al recibir!\n¿Te gustaría que te comparta fotos reales de este modelo o a qué ciudad sería tu entrega?", p);
            }
            return Answer.withImages("🎨 **Colores disponibles para " + p.name() + ":**\n\nEste modelo viene en acabado: **"
                    + colorsOf(p) + "**.\n\n• 🏷️ **Precio:** " + lempiras(p.salePrice()) + "\n• 📏 **Dimensiones:** " + orDefault(p.dimensions(), "Estándar")
                    + "\n• 📦 **Disponibilidad:** " + (p.inStock() ? "✅ ¡" + p.stock() + " en stock!" : "⚠️ Agotado")
                    + "\n\n🚚 ¡Incluye envío gratis a todo el país y pagas al recibir!\n¿Te gustaría apartarla en este color o deseas que te comparta fotos reales de cómo luce armada?", p, p.firstImages(2));
        }

        for (ProductLine line : LINES) {
            if (!m.hasAny(line.triggers())) continue;
            List<Product> filtered = products.stream().filter(o -> line.productFilter().test(clean(o.name()))).limit(5).toList();
            if (filtered.isEmpty()) continue;
            String list = filtered.stream().map(o -> "• **" + o.name() + "**: Acabado **" + colorsOf(o) + "**").collect(Collectors.joining("\n"));
            return Answer.of("🎨 **Colores disponibles en la línea seleccionada:**\n\n" + list + "\n\n🚚 ¡Todos con envío gratis a todo el país y pagas al recibir!\n\n¿Por qué modelo en específico te gustaría consultar o ver fotos reales?");
        }
        String top = products.stream().limit(6).map(o -> "• **" + o.name() + "**: **" + colorsOf(o) + "**").collect(Collectors.joining("\n"));
        return Answer.of("🎨 **Colores disponibles en tienda:**\n\n" + top + "\n\n🚚 ¡Todos con envío gratis y pagas al recibir en tu puerta!\n\n¿Por qué producto en específico deseas consultar sus medidas o colores?");
    }

    public Answer dimensions(Product p, List<Product> products, Tenant tenant) {
        if (p == null) {
            String items = products.stream().limit(6)
                    .map(o -> "• **" + o.name() + "**: **" + orDefault(o.dimensions(), "Estándar") + "** *(Soporta: " + orDefault(o.weightLimit(), "Estándar") + ")*")
                    .collect(Collectors.joining("\n"));
            return Answer.of("¡Claro! Te comparto las medidas de nuestros muebles principales:\n\n"
                    + items + "\n\n🚚 ¡Todos con envío gratis y pagas al recibir!\n\n¿De cuál en específico te gustaría ver fotos reales o conocer disponibilidad para tu ciudad?");
        }
        return Answer.withImages("📏 Las medidas de la **" + p.name() + "** son:\n\n• 📐 **Dimensiones:** **"
                + orDefault(p.dimensions(), "Estándar") + "**\n• 💪 **Peso máximo soportado:** "
                + orDefault(p.weightLimit(), "150 kg") + "\n• 🎨 **Colores:** " + colorsOf(p)
                + "\n• 🏷️ **Precio:** **" + lempiras(p.salePrice()) + "** *(normal: " + lempiras(p.effectiveRegularPrice()) + ")*"
                + "\n\n🚚 ¡Queda perfecta para espacios de hogar u oficina! ¿Te gustaría que te tome los datos para apartar la tuya o a qué ciudad sería tu entrega?", p, p.firstImages(2));
    }

    public Answer material(Product p) {
        if (p == null) {
            return Answer.of("📦 **Materiales y Ensamble:**\n\n• Todos nuestros productos son **100% nuevos de paquete** y vienen en su caja sellada con empaque reforzado.\n• **Materiales:** Estructuras de acero al carbono, pintura horneada anticorrosiva, acero inoxidable 304, madera tratada y aleación de aluminio.\n• **Armado sencillo:** Vienen listos para ensamblar con su manual gráfico paso a paso y kit de herramientas (llaves y tornillos).\n\n🚚 ¡Todos con envío gratis a todo el país!\n\n¿Por el material de qué mueble en particular deseas consultar o a qué ciudad sería tu entrega?");
        }
        String n = clean(p.name() + " " + nullToEmpty(p.category()));
        String detail = "Estructura de alta resistencia y acabados prémium.";
        if (n.contains("gamer") || n.contains("sillon") || n.contains("silla")) {
            detail = "Estructura interna de acero tubular reforzado, pistón hidráulico clase 4 certificado, tapizado en PU prémium / malla de nylon de alta tenacidad y base con ruedas silenciosas 360°.";
        } else if (n.contains("tolix") || n.contains("taburete") || n.contains("banco")) {
            detail = "Acero al carbono forjado con pintura electrostática horneada, y asiento reforzado (en modelos con madera, pino natural tratado).";
        } else if (n.contains("estanteria") || n.contains("estante") || n.contains("escritorio") || n.contains("mesa")) {
            detail = "Bastidor estructural de hierro industrial con pintura mate y superficie de madera melamínica de alta densidad resistente al agua y peso.";
        } else if (n.contains("ducha") || n.contains("pileta") || n.contains("monocomando")) {
            detail = "Cuerpo en Acero Inoxidable 304 quirúrgico con acabado negro mate o inox cepillado, y cartucho cerámico anti-fugas.";
        } else if (n.contains("escalera")) {
            detail = "Aleación de aluminio de alta resistencia con bisagras automáticas de seguridad y zapatas de goma antideslizantes.";
        }
        return Answer.of("📦 **Materiales de " + p.name() + ":**\n\n• " + detail
                + "\n\n• Viene 100% nuevo de fábrica en caja original sellada e incluye su manual ilustrado y kit de herramientas (llaves y tornillos). Se arma en pocos minutos sin herramientas adicionales.\n\n🚚 ¿Te gustaría que preparemos tu envío o a qué ciudad te la mandaríamos?", p);
    }

    public Answer weight(Product p) {
        if (p == null) {
            return Answer.of("💪 Todos nuestros muebles cuentan con estándares de alta resistencia para uso diario intensivo.\n\n¿Por qué artículo en particular deseas consultar su capacidad o a qué ciudad sería tu entrega?");
        }
        return Answer.of("💪 **Capacidad y Resistencia de " + p.name() + ":**\n\n• 🏋️ **Peso máximo soportado:** **"
                + orDefault(p.weightLimit(), "150 kg / Alta resistencia")
                + "**\n• 📐 **Medidas:** " + orDefault(p.dimensions(), "Estándar")
                + "\n\n🚚 Cuenta con estructura reforzada garantizada. ¿Te gustaría apartar la tuya aprovechando el envío gratis o prefieres ver fotos reales?", p);
    }

    public Answer photos(Product p) {
        return Answer.withImages("¡Claro! Aquí te comparto fotos reales de la **" + p.name() + "**:\n\n• 🏷️ **Precio:** " + lempiras(p.salePrice())
                + "\n• 📐 **Medidas:** " + orDefault(p.dimensions(), "Estándar")
                + "\n• 💪 **Peso soportado:** " + orDefault(p.weightLimit(), "Estándar")
                + "\n• 🎨 **Color:** " + colorsOf(p)
                + "\n\n🚚 ¡Todos con envío gratis y pagas al recibir en tu puerta! ¿Qué te parece cómo luce, te gustaría que tomemos tus datos para apartarla o a qué ciudad te la enviamos?", p, p.images());
    }

    public Answer shipping(Product p) {
        return Answer.withImages("¡Con gusto! De la **" + p.name() + "**:\n\n🚚 **Tiempo de entrega:** 1 a 2 días hábiles a todo el país vía Cargo Expreso (en Tegucigalpa y San Pedro Sula podemos coordinar entrega el mismo día si pides temprano).\n\n💵 **Pago seguro:** Cancelas en efectivo al recibir en la puerta de tu casa.\n\nEl precio de oferta con envío gratis es de **"
                + lempiras(p.salePrice()) + "**. ¿A qué ciudad y colonia te la enviaríamos para coordinar el despacho?", p, p.firstImages(1));
    }

    public Answer stock(Product p) {
        if (!p.inStock()) {
            return Answer.withImages("La **" + p.name() + "** está temporalmente agotada, pero te puedo mostrar opciones similares si gustas.", p, p.firstImages(2));
        }
        return Answer.withImages("¡Sí, tenemos disponible! De la **" + p.name() + "** nos quedan **" + p.stock() + " unidades** a **"
                + lempiras(p.salePrice()) + "**.\n\n• 🎨 **Color:** " + colorsOf(p) + "\n• 📏 **Medidas:** " + orDefault(p.dimensions(), "Estándar")
                + "\n\n🚚 ¡Incluye envío gratis a todo el país y pagas al recibir! ¿Deseas que te tome los datos para apartar la tuya antes de que se agote o a qué ciudad sería tu entrega?", p, p.firstImages(2));
    }

    public Answer catalog(List<Product> products, Tenant tenant) {
        String items = products.stream()
                .map(p -> "• **" + p.name() + "** — *" + lempiras(p.salePrice()) + "* (" + (p.inStock() ? p.stock() + " en stock" : "Agotado") + ")")
                .collect(Collectors.joining("\n"));
        return Answer.of("📦 **Modelos disponibles en " + tenant.name() + ":**\n\n" + items
                + "\n\n🚚 ¡Todos incluyen envío gratis y pagas al recibir en tu puerta!\n\n¿Cuál de estos modelos te llama más la atención o de cuál te gustaría conocer medidas, colores y fotos reales?");
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
