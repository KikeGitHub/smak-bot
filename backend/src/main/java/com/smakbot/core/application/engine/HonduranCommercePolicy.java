package com.smakbot.core.application.engine;

import com.smakbot.core.domain.model.Product;
import com.smakbot.core.domain.model.Tenant;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

/**
 * Políticas comerciales y logísticas para comercios en Honduras (Cargo Expreso, pago contra entrega, RTN).
 * Port de {@code _getPolicyResponse}, {@code _getScheduleAndAgencyExplanation} y textos de transferencia del Oráculo.
 *
 * <p>NOTA (GAP registrado): los textos aún son de alcance país/SMAK. El SDD v2 debe mover estas políticas a una
 * tabla por tenant para que cada negocio configure las suyas.</p>
 */
public class HonduranCommercePolicy {

    private record City(String name, List<String> keys) {
    }

    private static final List<City> CITIES = List.of(
            new City("San Pedro Sula", List.of("san pedro sula", "san pedro", "sps")),
            new City("Tegucigalpa", List.of("tegucigalpa", "tgu", "teguz", "comayaguela")),
            new City("La Ceiba", List.of("la ceiba", "ceiba")),
            new City("Choluteca", List.of("choluteca")),
            new City("Comayagua", List.of("comayagua")),
            new City("Danlí", List.of("danli")),
            new City("El Progreso", List.of("el progreso", "progreso yoro")),
            new City("Puerto Cortés", List.of("puerto cortes", "pt cortes")),
            new City("Siguatepeque", List.of("siguatepeque")),
            new City("Juticalpa", List.of("juticalpa")),
            new City("Catacamas", List.of("catacamas")),
            new City("Santa Rosa de Copán", List.of("santa rosa de copan", "copan", "santa rosa")),
            new City("Tela", List.of("tela")),
            new City("Villanueva", List.of("villanueva")),
            new City("Choloma", List.of("choloma")),
            new City("Santa Bárbara", List.of("santa barbara")),
            new City("Tocoa", List.of("tocoa", "colon"))
    );

    private final CatalogAdvisor catalogAdvisor;

    public HonduranCommercePolicy(CatalogAdvisor catalogAdvisor) {
        this.catalogAdvisor = catalogAdvisor;
    }

    public Optional<String> policyResponse(MessageText m, Product currentProduct, List<Product> products) {
        if (m.hasAny("roatan", "utila", "guanaja", "islas de la bahia", "isla de la bahia", "islas bahia", "ferry",
                "galaxy wave", "utila dream", "muelle de cabotaje", "cabotaje")) {
            return Optional.of("🚢 **Entregas en Roatán, Útila o Islas de la Bahía:**\n\n"
                    + "Para Islas de la Bahía (Roatán, Útila, Guanaja) **no aplica pago contra entrega ni envío gratis regular**.\n"
                    + "• **Forma de pago:** Requiere **transferencia bancaria previa** del valor del producto.\n"
                    + "• **Despacho:** Al compartirnos tu comprobante por este chat, despachamos el paquete hacia el **muelle de cabotaje en La Ceiba** para subirlo al ferry que nos indiques (Utila Dream, Galaxy Wave, etc.).\n"
                    + "• ⚠️ **Flete marítimo:** El cliente cubre directamente el costo del ferry.");
        }
        if (m.hasAny("forza", "otra paqueteria", "otras paqueterias", "otra empresa", "otra agencia", "fedex", "dhl", "rapido cargo")) {
            return Optional.of("📦 **Transportadora:** No, únicamente realizamos entregas a través de **Cargo Expreso**.");
        }
        if (m.hasAny("tarjeta", "tarjetas", "visa", "mastercard", "datafast", "link de pago", "credomatic", "terminal") || m.token("pos")) {
            return Optional.of("💳 **Forma de Pago con Tarjeta:** No aceptamos pagos con tarjeta, solo pago en efectivo contra entrega y se le paga al operador de Cargo Expreso o por transferencia electrónica previa, pero la transferencia debe confirmarse antes de realizar el envío.");
        }
        boolean locationWord = m.hasAny("donde", "ubicacion", "sucursal", "tienda fisica", "local", "sala de ventas");
        boolean storeWord = m.hasAny("estan", "encuentran", "queda", "tienda", "puerto cortes", "local", "sala");
        if (locationWord && storeWord && !m.has("direccion de entrega")) {
            return Optional.of("📍 **Ubicación Física:** Nos encontramos ubicados en **Plaza Krisale, Puerto Cortés, Honduras**.\n\n¡Realizamos envíos gratuitos a domicilio a cualquier parte del país vía Cargo Expreso!");
        }

        Optional<City> city = CITIES.stream().filter(c -> m.hasAny(c.keys())).findFirst();
        boolean deliveryCtx = m.hasAny("envio", "envios", "entrega", "entregas", "cobertura", "llegan", "mandan", "vienen",
                "hacen envios", "a domicilio", "hasta") || m.clean().startsWith("a ") || m.has(" en ");
        if (city.isPresent() && deliveryCtx) {
            String n = city.get().name();
            return Optional.of("🚚 **Cobertura de Envíos en " + n + ":**\n\n¡Sí! Realizamos envíos directos a domicilio a **" + n
                    + "** y sus alrededores a través de **Cargo Expreso**.\n\n• 🆓 **Costo de envío:** ¡Completamente **GRATIS** a cualquier parte de Honduras!\n• ⏱️ **Tiempo de entrega:** 1 a 2 días hábiles (en Tegucigalpa y San Pedro Sula podemos coordinar entrega el mismo día si confirmas temprano; el motorista siempre te llamará antes de llegar).\n• 💵 **Pago seguro:** Cancelas en efectivo **contra entrega** al recibir tu paquete en la puerta de tu casa o negocio (o retiro en la agencia de Cargo Expreso de "
                    + n + " si lo prefieres).\n\n¿Por qué producto deseas consultar o preparar tu pedido?");
        }

        if (m.hasAny("costo de envio", "cuanto cobran", "cuanto vale el envio", "precio del envio", "cobran envio",
                "cobran el envio", "el envio es gratis", "flete", "cobran por traerlo", "hay que pagar envio", "el envio tiene costo")) {
            return Optional.of("🚚 **Costo de Envío:** ¡El envío es **completamente gratuito** a cualquier parte del país! Solo cancelas el valor del producto al recibirlo en efectivo contra entrega.");
        }
        if (m.hasAny("garantia", "garantias", "defecto", "desperfecto", "si viene roto", "si sale malo", "si viene quebrado",
                "falla de fabrica", "si sale con falla")) {
            return Optional.of("🛡️ **Garantía:** Cuentan con garantía únicamente contra **defectos de fabricación**.");
        }
        if (m.hasAny("son nuevas", "son nuevos", "muebles nuevos", "productos nuevos", "es nuevo", "usado", "de segunda",
                "de paquete", "sellado", "sellados")) {
            return Optional.of("✨ **Condición del Producto:** Sí, todos nuestros productos son **100% nuevos de fábrica** en su caja original sellada.");
        }
        if (m.hasAny("mejor precio", "descuento", "descuentos", "rebaja", "rebajas", "cuanto es lo menos", "lo menos",
                "mayoreo", "por mayor", "en cuanto me lo deja", "si compro varios", "precio especial")) {
            return Optional.of(catalogAdvisor.volumeQuote(m, currentProduct, products)
                    .map(r -> r.text())
                    .orElse("🏷️ **Mejor Precio:** El precio especial sería equivalente a la cantidad de piezas solicitadas por el cliente. Si necesitas ordenar varias piezas o mayoreo, indícanos cuántas unidades deseas y con gusto te cotizamos."));
        }
        if (m.hasAny("viene armado", "viene armada", "vienen armados", "vienen armadas", "como se arma", "trae herramientas",
                "trae llaves", "facil de armar", "manual de armado", "herramientas para armar", "requiere herramientas")) {
            return Optional.of("📦 **Condición, Ensamble y Herramientas en SMAK Honduras:**\n\n• **Condición:** 100% nuevo de fábrica en caja sellada con empaque protector anti-impactos.\n• **Armado sencillo:** Para garantizar su óptima protección en transporte, vienen desarmados e incluyen su **manual gráfico ilustrado paso a paso** y el **kit completo de herramientas (llaves Allen y tornillería métrica)**.\n• **Tiempo estimado:** Se ensamblan en **10 a 15 minutos** de forma muy intuitiva sin necesidad de taladro ni herramientas especiales.\n\n¿Deseas conocer más detalles de algún producto o que preparemos tu pedido?");
        }
        return Optional.empty();
    }

    public String scheduleAndAgencyExplanation() {
        return "🚚 **Información sobre Horarios y Entregas de Cargo Expreso:**\n\n• **Coordinación previa:** El repartidor de Cargo Expreso se contacta telefónicamente o por WhatsApp antes de la entrega para coordinar el horario de llegada a tu domicilio.\n• **Ruta a domicilio:** Las entregas se realizan de Lunes a Viernes de 8:00 AM a 5:00 PM, y los **Sábados únicamente medio día** (hasta las 12:00 PM).\n• **Dependencia de ruta logística:** Como las entregas se coordinan mediante Cargo Expreso a nivel nacional, las rutas dependen de su logística diaria. Por ello, no se programa una hora exacta cerrada, pero el repartidor siempre te contacta antes.\n\n💡 **Recomendación (Retiro en Agencia):** Si necesitas un horario muy específico o no estás seguro de estar en casa, **te sugerimos solicitar el paquete para retiro en una agencia u oficina de Cargo Expreso** en tu ciudad. Tu paquete te esperará en ventanilla para recogerlo a tu conveniencia (ten presente que los sábados también atienden medio día).";
    }

    public String shortTransferText() {
        return "¡Sí, aceptamos transferencia bancaria y efectivo contra entrega! 🏦";
    }

    public String checkoutTransferText() {
        return "¡Sí, aceptamos transferencia bancaria y efectivo contra entrega! 🏦\n\nCuentas oficiales (SMAK Honduras S. de R.L.):\n• BAC: 742-108-951 · Ficohsa: 2000-098-432 · Atlántida: 110-045-892";
    }

    public String fullTransferText(Product activeProduct) {
        return "¡Sí, aceptamos transferencia bancaria! 🏦\n\nPuedes realizar tu pago a cualquiera de nuestras cuentas oficiales a nombre de **SMAK Honduras S. de R.L.** (RTN: 08011990123456):\n\n• **BAC Credomatic (Cheques):** 742-108-951\n• **Banco Ficohsa (Cheques):** 2000-098-432\n• **Banco Atlántida (Ahorros):** 110-045-892\n• **Banpaís (Cheques):** 01-501-002345\n\nPuedes pagar vía transferencia bancaria y compartirnos tu comprobante por este chat, o si prefieres también puedes pagar en efectivo contra entrega al recibir tu producto en la puerta de tu casa.\n\n¿Deseas que preparemos tu pedido"
                + (activeProduct != null ? " para **" + activeProduct.name() + "**" : "") + "?";
    }

    public String humanHandoverText(Tenant tenant) {
        String msg = URLEncoder.encode("Hola " + tenant.name() + ", deseo hablar con un asesor comercial", StandardCharsets.UTF_8).replace("+", "%20");
        return "Te transfiero de inmediato con un asesor humano. El asistente automático ha quedado en pausa.\n\n📲 **WhatsApp Directo:**\n["
                + tenant.phoneContact() + "](https://wa.me/" + tenant.phoneDigits() + "?text=" + msg + ")";
    }

    public String fallbackExecutiveText(Tenant tenant, String rawText) {
        String msg = URLEncoder.encode("Hola " + tenant.name() + ", requiero asistencia de un ejecutivo comercial sobre: \"" + rawText + "\"", StandardCharsets.UTF_8).replace("+", "%20");
        return "No cuento con esa información específica en mi catálogo automatizado.\n\nPara responderte con exactitud y ofrecerte una atención personalizada, **te comunico de inmediato con un ejecutivo comercial de "
                + tenant.name() + "** 👤:\n\n📲 **Contactar a Ejecutivo Comercial:**\n[" + tenant.phoneContact() + "](https://wa.me/"
                + tenant.phoneDigits() + "?text=" + msg + ")\n\n*(Un asesor humano de nuestro equipo continuará tu conversación en breve)*";
    }
}
