export const TENANTS = [
  {
    id: "smak", name: "SMAK Muebles", category: "Muebles y hogar", initials: "S",
    accent: "#0e7a62", product: { id:"estante", name:"Estante Organizador", regularPrice:1200, salePrice:1050, stock:18, dimensions:"120 × 60 × 30 cm", weightLimit:"150 lbs", images:["https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg","https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=85"], keywords:["estante","organizador","repisa"] },
    faqs: { shipping:"Envío gratis con Cargo Expreso en compras seleccionadas. Entrega estimada de 1 a 2 días.", payment:"Puedes pagar en efectivo contra entrega.", location:"Visítanos en Plaza Krisale.", islands:"Para Roatán e Islas de la Bahía solicitamos transferencia previa. Entregamos en el muelle de La Ceiba." },
    synonyms: { precio:["presio","rebaja","cuánto cuesta","cuanto vale"], peso:["cuánto aguanta","cuanto soporta","resistencia"], dimensiones:["medidas","tamaño"], fotos:["fotos reales","imágenes","imagenes"] }
  },
  {
    id: "calzado", name: "Calzado Express", category: "Calzado", initials: "C",
    accent: "#6155c8", product: { id:"tenis", name:"Tenis Urban Flex", regularPrice:980, salePrice:850, stock:24, dimensions:"Tallas 36–44", weightLimit:"Uso diario", images:["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"], keywords:["tenis","zapatos","calzado"] },
    faqs: { shipping:"Envíos con Cargo Expreso en 1 a 2 días.", payment:"Pago contra entrega disponible en efectivo.", location:"Punto de entrega: Plaza Krisale.", islands:"Para Roatán e Islas de la Bahía coordinamos transferencia previa y entrega en el muelle de La Ceiba." },
    synonyms: { precio:["presio","rebaja","cuánto cuesta"], peso:["resistencia"], dimensiones:["talla","medidas"], fotos:["fotos reales","imágenes"] }
  }
];
export const STORAGE_KEY = "smakbot-demo-v1";
