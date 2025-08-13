
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
  { id: "p1", name: "Laptop Dell Latitude 7300", category: "laptops", price: 16999, stock: 3, image: "assets/latitude7300.jpg", features: ["Core i7 8th Gen","RAM 16GB","SSD 512GB","Teclado retroiluminado","Windows 11"] },
  { id: "p2", name: "Samsung Galaxy S22 Ultra 12/256GB", category: "celulares", price: 18499, stock: 2, image: "assets/latitude3310.jpg", features: ["Pantalla 6.8","108MP","Batería 5000mAh","Android"] },
  { id: "p3", name: "Router Wi-Fi 6 AX3000", category: "redes", price: 4599, stock: 8, features: ["Doble banda","OFDMA","MU-MIMO"] },
  { id: "p4", name: "Headset USB con micrófono", category: "accesorios", price: 999, stock: 15, features: ["Cancelación de ruido","Ligero","Ajustable"] },
  { id: "p5", name: "Licencia Office 365 Personal (1 año)", category: "software", price: 2299, stock: 20, features: ["Word, Excel, PowerPoint","1TB OneDrive"] },
  { id: "p6", name: "iPhone 13 128GB (Libre)", category: "celulares", price: 14290, stock: 5, features: ["Pantalla 6.1","Cámara dual 12MP","iOS"] },
  { id: "p7", name: "Mouse inalámbrico 2.4G", category: "accesorios", price: 399, stock: 30, features: ["1200 DPI","USB Nano","Bajo consumo"] },
  { id: "p8", name: "SSD NVMe 1TB (PCIe 3.0)", category: "accesorios", price: 2490, stock: 12, features: ["Lectura 3500MB/s","Escritura 3000MB/s"] },

  // Nuevos (p9 - p15)
  { id: "p9",  name: "Dell Latitude 3310 2-in-1", category: "laptops",    price: 12990, stock: 2,  features: ["Core i5 8th Gen","RAM 8GB","SSD 256GB","Pantalla táctil 13.3″"] },
  { id: "p10", name: "HP Pavilion 15",             category: "laptops",    price: 17500, stock: 4, image: "assets/Latitude5400.png",  features: ["Ryzen 5 5500U","RAM 16GB","SSD 512GB","15.6″ FHD"] },
  { id: "p11", name: "Xiaomi Redmi Note 12 4/128", category: "celulares",  price: 5990,  stock: 10, features: ["6.67″ AMOLED","Cámara 50MP","Batería 5000 mAh"] },
  { id: "p12", name: "Samsung Galaxy A54 5G 8/256",category: "celulares",  price: 10500, stock: 6,  features: ["6.4″ Super AMOLED","50MP OIS","IP67"] },
  { id: "p13", name: "Teclado mecánico RGB",       category: "accesorios", price: 1490,  stock: 12, features: ["Switches azules","Anti-ghosting","Iluminación RGB"] },
  { id: "p14", name: "Monitor 24″ FHD 75Hz",       category: "accesorios", price: 3990,  stock: 7,  features: ["Panel IPS 24″","75 Hz","HDMI/DP"] },
  { id: "p15", name: "Switch Gigabit 8 puertos",   category: "redes",      price: 2390,  stock: 9,  features: ["8× RJ45 10/100/1000","Chasis metálico","Fanless"] }
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
  const imgSrc = (p.image && p.image.trim()) ? p.image : "./assets/placeholder.svg";

  return el("div", {class:"card"}, [
    el("div", {class:"img"}, [
      el("img", {
        src: imgSrc,
        alt: p.name,
        loading: "lazy",
        style: "max-width:100%;max-height:100%;object-fit:contain"
      })
    ]),
    el("h3", {}, [p.name]),
    el("div", {class:"flex space-between"}, [
      el("span", {class:"price"}, [price]),
      el("span", {class:stockClass}, [stockTxt])
    ]),
    el("div", {class:"tags"}, (p.features || []).slice(0,3).map(tag)),
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
