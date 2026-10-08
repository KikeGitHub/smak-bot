import { StorageFacade } from "./js/storage-facade.js";
import { BotEngine } from "./js/bot-engine.js";

const $ = (s) => document.querySelector(s);
const thread=$("#messages"), engine=new BotEngine();
let contextAudioUrl=null;
function bubble(text, own=false, extra={}) {
  const row=document.createElement("div"); row.className=`flex ${own?"justify-end":"justify-start"}`;
  const box=document.createElement("div"); box.className=`max-w-[84%] rounded-2xl px-4 py-3 shadow-sm ${own?"bg-[#d9fdd3] rounded-tr-sm":"bg-white rounded-tl-sm"}`;
  const body=document.createElement("p"); body.className="whitespace-pre-wrap text-sm leading-6 text-slate-800"; body.textContent=text; box.append(body);
  if (extra.images?.length) {
    const gallery=document.createElement("div"); gallery.className="mt-3 grid grid-cols-2 gap-2";
    extra.images.forEach(src=>{const img=document.createElement("img"); img.src=src; img.alt="Foto del producto"; img.className="h-28 w-full rounded-lg object-cover"; gallery.append(img);}); box.append(gallery);
  }
  if (extra.audio) { const audio=document.createElement("audio"); audio.controls=true; audio.src=contextAudioUrl; audio.className="mt-2 w-full"; box.append(audio); }
  if (extra.order) {
    const summary=document.createElement("div"); summary.className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs leading-5 text-slate-700";
    summary.textContent=`Cliente: ${extra.order.name} · Entrega: ${extra.order.address} · Tel: ${extra.order.phone}`; box.append(summary);
    const confirm=document.createElement("button"); confirm.type="button"; confirm.className="mt-3 w-full rounded-xl bg-[#087e67] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#066a58]"; confirm.textContent="Confirmar compra";
    confirm.addEventListener("click",()=>{const saved=engine.confirmOrder(); confirm.disabled=true; confirm.textContent="✓ Compra confirmada"; bubble(`¡Gracias, ${saved.name}! Tu pedido quedó registrado. Un asesor te contactará para coordinar la entrega.`);}); box.append(confirm);
  }
  const meta=document.createElement("div"); meta.className=`mt-1 text-right text-[10px] text-slate-400 ${own?"":"text-left"}`; meta.textContent=own?"Ahora · ✓✓":"SMAK Bot · ahora"; box.append(meta); row.append(box); thread.append(row); thread.scrollTop=thread.scrollHeight;
}
async function send(text, opts={}) {
  if (!text.trim()) return;
  bubble(opts.audio?"🎙️ Audio enviado":text,true); $("#message").value="";
  const answer=await engine.reply(text,opts);
  window.setTimeout(()=>bubble(answer.text,false,answer),260);
}
function updateTenant() {
  const t=StorageFacade.getTenant(); $("#brand-name").textContent=t.name; $("#chat-avatar").textContent=t.initials; $("#online-label").textContent=t.name+" · en línea"; $("#tenant-label").textContent=t.name;
}
$("#composer").addEventListener("submit",e=>{e.preventDefault();send($("#message").value);});
$("#audio-button").addEventListener("click",async()=>{
  if (!contextAudioUrl) {
    const sampleRate=8000, length=sampleRate*1.1, bytes=new Uint8Array(44+length);
    const view=new DataView(bytes.buffer); const write=(offset,s)=>[...s].forEach((c,i)=>view.setUint8(offset+i,c.charCodeAt(0)));
    write(0,"RIFF");view.setUint32(4,36+length,true);write(8,"WAVE");write(12,"fmt ");view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate,true);view.setUint16(32,1,true);view.setUint16(34,8,true);write(36,"data");view.setUint32(40,length,true);bytes.fill(128,44);contextAudioUrl=URL.createObjectURL(new Blob([bytes],{type:"audio/wav"}));
  }
  await send("Audio del cliente",{audio:true});
});
document.querySelectorAll("[data-scenario]").forEach(btn=>btn.addEventListener("click",()=>{
  engine.reset(); const text=btn.dataset.scenario;
  if (text==="__checkout") { bubble("Quiero hacer un pedido",true); const answer=engine.startCheckout(); setTimeout(()=>bubble(answer.text),220); return; }
  send(text,{audio:text==="__audio"});
}));
$("#human-button").addEventListener("click",()=>send("Quiero hablar con un asesor"));
$("#clear-button").addEventListener("click",()=>{thread.replaceChildren();engine.reset();bubble("¡Hola! 👋 ¿Qué te gustaría consultar?");});
window.addEventListener("smakbot:data-changed",updateTenant);
window.addEventListener("storage",updateTenant);
updateTenant();
bubble(`¡Hola! 👋 Soy el asistente de ${StorageFacade.getTenant().name}. Pregúntame por el producto, sus medidas o el envío.`);

