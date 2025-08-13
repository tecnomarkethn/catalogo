
const WHATSAPP_NUMBER = "+50496988240";

const CATEGORIES = [
  { id: "todo", name: "Todos" },
  { id: "laptops", name: "Laptops" },
  { id: "celulares", name: "Celulares" },
  { id: "accesorios", name: "Accesorios" },
  { id: "redes", name: "Redes" },
  { id: "software", name: "Software" },
];

const PRODUCTS = [
  { 	id: "p1", 
	name: "Laptop Dell Latitude 7300", 
	category: "laptops", 
	price: 16999, 
	stock: 3, 
	image: "assets/Latitude7300.jpg", 
	features: ["Core i7 8th Gen","RAM 16GB","SSD 512GB","Teclado retroiluminado","Windows 11"] 
  },

  { id: "p2", name: "Samsung Galaxy S22 Ultra 12/256GB", category: "celulares", price: 18499, stock: 2, features: ["Pantalla 6.8","108MP","Batería 5000mAh","Android"] },
  { id: "p3", name: "Router Wi‑Fi 6 AX3000", category: "redes", price: 4599, stock: 8, features: ["Doble banda","OFDMA","MU‑MIMO"] },
  { id: "p4", name: "Headset USB con micrófono", category: "accesorios", price: 999, stock: 15, features: ["Cancelación de ruido","Ligero","Ajustable"] },
  { id: "p5", name: "Licencia Office 365 Personal (1 año)", category: "software", price: 2299, stock: 20, features: ["Word, Excel, PowerPoint","1TB OneDrive"] },
  { id: "p6", name: "iPhone 13 128GB (Libre)", category: "celulares", price: 14290, stock: 5, features: ["Pantalla 6.1","Cámara dual 12MP","iOS"] },
  { id: "p7", name: "Mouse inalámbrico 2.4G", category: "accesorios", price: 399, stock: 30, features: ["1200 DPI","USB Nano","Bajo consumo"] },
  { id: "p8", name: "SSD NVMe 1TB (PCIe 3.0)", category: "accesorios", price: 2490, stock: 12, features: ["Lectura 3500MB/s","Escritura 3000MB/s"] }
];

const currency = new Intl.NumberFormat("es-HN", { style: "currency", currency: "HNL" });

let state = {
  category: "todo",
  query: ""
};

function openWhatsApp(product, extraMessage = ""){
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  const text = [
    `Hola TecnoMarketHN 👋`,
    product ? `Me interesa el producto: ${product.name}` : "",
    product ? `Precio publicado: ${currency.format(product.price)}` : "",
    extraMessage ? `Mensaje: ${extraMessage}` : ""
  ].filter(Boolean).join("\n");
  const url = `${base}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

function el(tag, attrs = {}, children = []){
  const node = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)){
    if (k === "class") node.className = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === "html") node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  for (const c of children){
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return node;
}

function tag(txt){ return el("span", {class:"tag"}, [txt]); }

function card(p){
  const price = currency.format(p.price);
  const stockTxt = p.stock > 0 ? `${p.stock} en stock` : "Agotado";
  const stockClass = p.stock > 0 ? "stock ok" : "stock bad";
  return el("div", {class:"card"}, [
    el("div", {class:"img"}, [el("img", {src:"./assets/placeholder.svg", alt:p.name, style:"height:40px;opacity:.6"})]),
    el("h3", {}, [p.name]),
    el("div", {class:"flex space-between"}, [
      el("span", {class:"price"}, [price]),
      el("span", {class:stockClass}, [stockTxt])
    ]),
    el("div", {class:"tags"}, p.features.slice(0,3).map(tag)),
    el("div", {class:"actions"}, [
      el("button", {class:"btn", onClick:()=>openModal(p)}, ["Consultar"]),
      el("button", {class:"btn btn-outline", onClick:()=>openWhatsApp(p)}, ["WhatsApp"]),
    ])
  ]);
}

function renderProducts(){
  const grid = document.getElementById("products");
  grid.innerHTML = "";
  const q = state.query.trim().toLowerCase();
  const list = PRODUCTS.filter(p => (state.category === "todo" || p.category === state.category) && (!q || (p.name + " " + p.features.join(" ")).toLowerCase().includes(q)));
  if (list.length === 0){
    grid.appendChild(el("div", {class:"center-empty"}, ["No se encontraron productos que coincidan con tu búsqueda."]));
  } else {
    for (const p of list) grid.appendChild(card(p));
  }
}

function renderCategories(){
  const pills = document.getElementById("pills");
  pills.innerHTML = "";
  for (const c of CATEGORIES){
    const b = el("button", {class: `pill ${state.category === c.id ? "active":""}`, onClick: ()=>{state.category = c.id; renderProducts();}}, [c.name]);
    pills.appendChild(b);
  }
}

function openModal(product){
  const overlay = document.getElementById("modal-overlay");
  overlay.style.display = "grid";
  overlay.dataset.pid = product.id;
  document.getElementById("modal-product").textContent = product.name;
  document.getElementById("name").value = "";
  document.getElementById("contact").value = "";
  document.getElementById("message").value = "";
  document.getElementById("name").focus();
}

function closeModal(){
  const overlay = document.getElementById("modal-overlay");
  overlay.style.display = "none";
}

function sendInquiry(){
  const pid = document.getElementById("modal-overlay").dataset.pid;
  const product = PRODUCTS.find(p => p.id === pid);
  const nombre = document.getElementById("name").value.trim();
  const contacto = document.getElementById("contact").value.trim();
  const mensaje = document.getElementById("message").value.trim();
  const extra = `${nombre ? `Soy ${nombre}. ` : ""}${contacto ? `Contacto: ${contacto}. ` : ""}${mensaje}`;
  openWhatsApp(product, extra);
  closeModal();
}

function goToContact(){
  document.getElementById("contacto").scrollIntoView({behavior:"smooth"});
}

window.addEventListener("DOMContentLoaded", ()=>{
  renderCategories();
  renderProducts();
  document.getElementById("search").addEventListener("input", (e)=>{ state.query = e.target.value; renderProducts(); });
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("cancel").addEventListener("click", closeModal);
  document.getElementById("send").addEventListener("click", sendInquiry);
  document.getElementById("btn-contact").addEventListener("click", goToContact);
  document.getElementById("btn-whats").addEventListener("click", ()=>openWhatsApp(null, "Hola, tengo una consulta general."));
  document.getElementById("btn-cta-whats").addEventListener("click", ()=>openWhatsApp(null, "Hola, deseo una cotización personalizada."));
});
