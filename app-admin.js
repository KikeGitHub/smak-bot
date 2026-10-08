import { StorageFacade } from "./js/storage-facade.js";
const $=s=>document.querySelector(s), form=$("#product-form"), faqForm=$("#faq-form"), synonymsForm=$("#synonyms-form");
const money=n=>Number(n||0).toLocaleString("es-HN");
function renderTenantOptions(){const select=$("#tenant-select");select.innerHTML="";StorageFacade.getTenants().forEach(t=>{const o=document.createElement("option");o.value=t.id;o.textContent=t.name;select.append(o);});select.value=StorageFacade.getActiveTenantId();}
function render(){
 const tenant=StorageFacade.getTenant(), product=tenant.product;
 $("#tenant-title").textContent=tenant.name;$("#tenant-category").textContent=tenant.category;
 $("#product-name").value=product.name;$("#regular-price").value=product.regularPrice;$("#sale-price").value=product.salePrice;$("#stock").value=product.stock;$("#dimensions").value=product.dimensions;$("#weight-limit").value=product.weightLimit;$("#keywords").value=(product.keywords||[]).join(", ");$("#image-urls").value=product.images.join("\n");
 for(const key of ["shipping","payment","location","islands"]) $(`#faq-${key}`).value=tenant.faqs[key]||"";
 for(const key of ["precio","peso","dimensiones","fotos"]) $(`#syn-${key}`).value=(tenant.synonyms[key]||[]).join(", ");
 $("#image-preview").innerHTML=product.images.map(src=>`<img src="${src}" class="h-16 w-16 rounded-xl border object-cover" alt="Vista previa">`).join("");
 renderOrders();
}
function renderOrders(){
 const orders=StorageFacade.getOrders(), tbody=$("#orders");
 $("#order-count").textContent=orders.length;
 if(!orders.length){tbody.innerHTML='<tr><td colspan="5" class="px-4 py-10 text-center text-sm text-slate-400">Todavía no hay pedidos. Confirma una compra desde el chat para verla aquí.</td></tr>';return;}
 tbody.innerHTML=orders.map(o=>`<tr class="border-t border-slate-100"><td class="px-4 py-3 font-semibold">${escapeHtml(o.name)}</td><td class="px-4 py-3">${escapeHtml(o.productName)}</td><td class="px-4 py-3">${escapeHtml(o.phone)}</td><td class="px-4 py-3 font-semibold">L.${money(o.total)}</td><td class="px-4 py-3 text-slate-500">${new Date(o.createdAt).toLocaleString("es-HN",{dateStyle:"short",timeStyle:"short"})}</td></tr>`).join("");
}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("#tenant-select").addEventListener("change",e=>{StorageFacade.setActiveTenantId(e.target.value);render();});
form.addEventListener("submit",e=>{e.preventDefault();const tenant=StorageFacade.getTenant();StorageFacade.saveProduct({...tenant.product,name:$("#product-name").value,regularPrice:Number($("#regular-price").value),salePrice:Number($("#sale-price").value),stock:Number($("#stock").value),dimensions:$("#dimensions").value,weightLimit:$("#weight-limit").value,keywords:$("#keywords").value.split(",").map(s=>s.trim()).filter(Boolean),images:$("#image-urls").value.split("\n").map(s=>s.trim()).filter(Boolean)});notify("Catálogo actualizado.");render();});
faqForm.addEventListener("submit",e=>{e.preventDefault();const faqs={};for(const key of ["shipping","payment","location","islands"])faqs[key]=$(`#faq-${key}`).value;StorageFacade.saveFAQs(faqs);notify("Políticas actualizadas.");});
synonymsForm.addEventListener("submit",e=>{e.preventDefault();const synonyms={};for(const key of ["precio","peso","dimensiones","fotos"])synonyms[key]=$(`#syn-${key}`).value.split(",").map(s=>s.trim()).filter(Boolean);StorageFacade.saveSynonyms(synonyms);notify("Sinónimos actualizados.");});
$("#image-file").addEventListener("change",e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{const input=$("#image-urls");input.value=[input.value.trim(),reader.result].filter(Boolean).join("\n");const img=document.createElement("img");img.src=reader.result;img.className="h-16 w-16 rounded-xl border object-cover";$("#image-preview").append(img);notify("Imagen agregada al catálogo local.");};reader.readAsDataURL(file);});
$("#image-urls").addEventListener("input",()=>{$("#image-preview").innerHTML=$("#image-urls").value.split("\n").filter(Boolean).map(src=>`<img src="${escapeHtml(src)}" class="h-16 w-16 rounded-xl border object-cover" alt="Vista previa">`).join("");});
function notify(message){const n=$("#notice");n.textContent=message;n.classList.remove("hidden");setTimeout(()=>n.classList.add("hidden"),2400);}
$("#seed-orders").addEventListener("click",()=>{const added=StorageFacade.seedDemoOrders();notify(added?`Se agregaron ${added} pedidos de ejemplo.`:"Los pedidos de ejemplo ya están cargados.");});
window.addEventListener("smakbot:data-changed",()=>{renderTenantOptions();render();});window.addEventListener("storage",()=>{renderTenantOptions();render();});
renderTenantOptions();render();

