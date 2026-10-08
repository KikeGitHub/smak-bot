import { StorageFacade } from "./storage-facade.js";

const clean = s => s.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[¿?¡!.,]/g,"");
const matches = (message, words) => words.some(word => clean(message).includes(clean(word)));
export class BotEngine {
  constructor() { this.voicePreferred = false; this.human = false; this.checkout = null; }
  reset() { this.voicePreferred = false; this.human = false; this.checkout = null; }
  startCheckout() { this.checkout = { step: "name", name: "", address: "", phone: "" }; return { text:"¡Perfecto! Te ayudo con tu pedido. ¿Cuál es tu nombre?" }; }
  async reply(message, { audio = false } = {}) {
    const text = message.trim();
    if (audio || matches(text, ["no se leer","audio","nota de voz"])) {
      this.voicePreferred = true;
      return { text:"¡Con gusto! Te responderé también con una nota de voz para que sea más fácil.", audio:true };
    }
    if (this.human) return { text:"Tu conversación está con un asesor. En breve te atenderá una persona del equipo.", human:true };
    if (this.checkout) {
      const c = this.checkout;
      if (c.step === "name") { c.name=text; c.step="address"; return { text:"Gracias, "+text+". ¿A qué dirección hacemos la entrega?" }; }
      if (c.step === "address") { c.address=text; c.step="phone"; return { text:"Anotado. ¿Cuál es tu número de teléfono de contacto?" }; }
      c.phone=text; c.step="confirm";
      const product=StorageFacade.getTenant().product;
      return { text:`Resumen del pedido: ${product.name} · L.${Number(product.salePrice).toLocaleString("es-HN")}. Confirma para guardar tu compra.`, order:{...c,productName:product.name,total:Number(product.salePrice)} };
    }
    const tenant=StorageFacade.getTenant(), p=tenant.product, faq=tenant.faqs, syn=tenant.synonyms;
    if (matches(text, ["asesor","persona","operador","humano"])) { this.human=true; return { text:"Te transfiero con un asesor comercial. El bot queda en pausa para esta conversación.", human:true }; }
    if (matches(text, ["roatan","roatán","islas de la bahia","islas de la bahía","ceiba","muelle"])) return { text:faq.islands };
    if (matches(text, syn.precio) || matches(text, ["precio","cuesta","oferta"])) return { text:`${p.name}: precio regular L.${Number(p.regularPrice).toLocaleString("es-HN")} y hoy L.${Number(p.salePrice).toLocaleString("es-HN")}.` };
    if (matches(text, syn.dimensiones) || matches(text, ["dimensiones","talla"])) return { text:`${p.name}: ${p.dimensions}.` };
    if (matches(text, syn.peso) || matches(text, ["peso","aguanta","soporta"])) return { text:`${p.name}: ${p.weightLimit}.` };
    if (matches(text, syn.fotos) || matches(text, ["foto","fotos","imagen"])) return { text:`¡Claro! Aquí tienes fotos reales de ${p.name}.`, images:p.images };
    if (matches(text, ["disponible","hay stock","existencia","inventario"])) return { text:p.stock > 0 ? `Sí, tenemos ${p.stock} unidades disponibles de ${p.name}.` : `Por ahora ${p.name} está agotado. Escríbenos para confirmar reposición.` };
    if (matches(text, ["envio","envío","entrega","cargo expreso"])) return { text:faq.shipping };
    if (matches(text, ["pago","efectivo","contra entrega"])) return { text:faq.payment };
    if (matches(text, ["donde","ubicacion","ubicación","dirección"])) return { text:faq.location };
    if (matches(text, ["comprar","pedido","quiero uno","lo quiero","orden"])) return this.startCheckout();
    if (matches(text, ["hola","buenas","buenos dias","buenas tardes"])) return { text:`¡Hola! 👋 Soy el asistente de ${tenant.name}. Puedo ayudarte con ${p.name}. ¿Qué te gustaría saber?` };
    return { text:`Puedo contarte el precio, medidas, disponibilidad, fotos y envío de ${p.name}. También puedo ayudarte a comprar.` };
  }
  confirmOrder() {
    const c=this.checkout;
    if (!c || c.step!=="confirm") return null;
    const saved=StorageFacade.saveOrder({...c, productName:StorageFacade.getTenant().product.name, total:Number(StorageFacade.getTenant().product.salePrice)});
    this.checkout=null;
    return saved;
  }
}
