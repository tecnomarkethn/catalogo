# TecnoMarketHN — Catálogo estático

Sitio estático listo para publicar en cualquier hosting o GitHub Pages. Incluye categorías, buscador, tarjetas de producto y consultas por WhatsApp vinculadas al **(+504) 9698-8240**.

## Estructura
```
tecnomarkethn-catalogo/
├─ index.html
├─ css/styles.css
├─ js/app.js
└─ assets/placeholder.svg
```

## Editar productos
Abre `js/app.js` y modifica el arreglo `PRODUCTS`. Los precios se muestran en **Lempiras (HNL)**.

## Publicar en GitHub Pages
1. Crea un repositorio, por ejemplo `tecnomarkethn-catalogo`.
2. Sube estos archivos a la rama `main`.
3. En **Settings → Pages**, selecciona **Deploy from a branch** y fuente **main / root**.
4. Guarda. Tu sitio quedará disponible en `https://<tu-usuario>.github.io/tecnomarkethn-catalogo/`.

## Publicar en otros hosts (hub.com u otro)
- Sube la carpeta completa al servicio de tu preferencia (Netlify, Cloudflare Pages, Vercel Static, cPanel, etc.).
- El documento de entrada es `index.html`.

## Cambiar WhatsApp
Busca `WHATSAPP_NUMBER` en `js/app.js` y actualiza el número.

---
© TecnoMarketHN
