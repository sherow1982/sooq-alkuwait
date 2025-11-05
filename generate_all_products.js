#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const productsData = JSON.parse(fs.readFileSync('products_data.json','utf-8'));
const outDir = 'products-pages';

if(!fs.existsSync(outDir)) fs.mkdirSync(outDir);

function translateToSeoUrl(title, id){
  const trans = {'حصالة':'piggy-bank','صراف':'atm','أوتوماتيكية':'automatic','صفاية':'strainer','سلطة':'salad','دوارة':'rotating','شورت':'shorts','نسائي':'women','شد':'shape','الجسم':'body','محول':'converter','كهرباء':'electric','فولت':'volt','شامبو':'shampoo','زيت':'oil','طبيعي':'natural','سيروم':'serum','أرز':'rice','روبوت':'robot','قهوة':'coffee','تركية':'turkish'};
  const clean = title.replace(/[^\w\s\u0600-\u06FF]/g,' ').trim().split(/\s+/).slice(0,4);
  const en = [];
  clean.forEach(w=>{for(const [ar,enw] of Object.entries(trans)){if(w.includes(ar)){en.push(enw);break;}}});
  const slug = (en.length? en.join('-'):'product')+'-'+id;
  return slug.toLowerCase().replace(/[^a-z0-9\-]/g,'');
}

function page(product){
  const slug = translateToSeoUrl(product.title, product.id);
  const discount = product.price>product.sale_price? Math.round(((product.price-product.sale_price)/product.price)*100):0;
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
  <title>${product.title} | ${product.sale_price} د.ك | سوق الكويت</title>
  <meta name="description" content="${product.title} متوفر في الكويت بسعر ${product.sale_price} د.ك. شحن مجاني فوق 100 د.ك، دفع عند الاستلام، توصيل سريع." />
  <link rel="canonical" href="https://sooq-alkuwait.arabsad.com/products-pages/${slug}.html" />
  <meta property="og:title" content="${product.title} | ${product.sale_price} د.ك | سوق الكويت" />
  <meta property="og:description" content="${product.title} متوفر الآن في الكويت" />
  <meta property="og:image" content="${product.image_link}" />
  <meta property="og:url" content="https://sooq-alkuwait.arabsad.com/products-pages/${slug}.html" />
  <script type="application/ld+json">{"@context":"https://schema.org/","@type":"Product","name":"${product.title}","image":"${product.image_link}","offers":{"@type":"Offer","priceCurrency":"KWD","price":"${product.sale_price}","availability":"https://schema.org/InStock"}}</script>
  <style>
    :root{--g:#007A3D;--r:#CE1126}
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Cairo','Segoe UI',sans-serif;background:linear-gradient(135deg,#f1f5f9,#e2e8f0);color:#111827}
    .fab{position:fixed;right:16px;bottom:16px;z-index:1000;width:62px;height:62px;border-radius:50%;border:none;background:linear-gradient(135deg,var(--g),#00a651);color:#fff;font-size:22px;box-shadow:0 12px 30px rgba(0,122,61,.35)}
    .badge{position:absolute;top:-6px;right:-6px;background:var(--r);color:#fff;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900}
    header{background:linear-gradient(135deg,var(--g),#00a651);color:#fff;text-align:center;padding:20px 12px}
    .container{max-width:1100px;margin:0 auto;padding:16px}
    .card{background:#fff;border-radius:18px;box-shadow:0 10px 30px rgba(0,0,0,.08);overflow:hidden;margin-bottom:18px}
    .grid{display:grid;grid-template-columns:1fr;gap:0}
    .img{width:100%;max-width:min(90vw,420px);height:clamp(240px,58vw,420px);object-fit:cover;border-radius:16px;margin:18px auto}
    .badge-sale{position:absolute;top:16px;right:16px;background:var(--r);color:#fff;padding:10px 14px;border-radius:14px;font-weight:800}
    .p-20{padding:18px}
    .title{font-size:clamp(18px,4.5vw,28px);font-weight:900;margin:8px 0 12px}
    .price{background:linear-gradient(135deg,#dcfce7,#bbf7d0);border:2px solid var(--g);border-radius:14px;padding:14px;margin:12px 0}
    .price-now{font-size:clamp(26px,6vw,40px);color:var(--g);font-weight:900}
    .price-old{text-decoration:line-through;color:#9ca3af;margin-top:6px}
    .row{display:grid;grid-template-columns:2fr 1fr;gap:10px;margin-top:14px}
    .btn{border:none;border-radius:14px;padding:14px 16px;font-weight:800;font-size:clamp(14px,4vw,16px);display:flex;align-items:center;justify-content:center;gap:8px}
    .btn-buy{background:linear-gradient(135deg,var(--g),#00a651);color:#fff}
    .btn-wa{background:linear-gradient(135deg,#25d366,#128c7e);color:#fff}
    @media(min-width:640px){.grid{grid-template-columns:1fr 1fr}.container{padding:24px}}
  </style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
</head>
<body>
  <button class="fab" onclick="location.href='/cart.html'">🛒<span id="c" class="badge" style="display:none">0</span></button>
  <header><h1>🇰🇼 سوق الكويت</h1><p>أفضل الأسعار • توصيل سريع</p></header>
  <main class="container">
    <article class="card">
      <div class="grid">
        <div style="position:relative">
          <img class="img" src="${product.image_link}" alt="${product.title}">
          ${discount>0?`<div class="badge-sale">خصم ${discount}%</div>`:''}
        </div>
        <div class="p-20">
          <h1 class="title">${product.title}</h1>
          <div class="price">
            <div class="price-now">${product.sale_price} د.ك</div>
            ${product.price>product.sale_price?`<div class="price-old">${product.price} د.ك</div>`:''}
          </div>
          <div class="row">
            <button class="btn btn-buy" onclick="buy(${product.id})">🛒 اشتري الآن</button>
            <a class="btn btn-wa" target="_blank" href="https://wa.me/201110760081?text=${encodeURIComponent('مرحباً! أريد الاستفسار عن: '+product.title+' - السعر: '+product.sale_price+' د.ك')}">📱 واتساب</a>
          </div>
        </div>
      </div>
    </article>
  </main>
  <script>
    const P=${JSON.stringify({id:'${product.id}',title:'${product.title}'.replace(/`/g,'\`'),price:'${product.price}',sale_price:'${product.sale_price}',image:'${product.image_link}'})};
    function buy(id){let cart=JSON.parse(localStorage.getItem('cart')||'[]');const e=cart.find(i=>i.id==id);if(e)e.quantity++;else cart.push({...P, id: id, quantity:1});localStorage.setItem('cart',JSON.stringify(cart));updateC();setTimeout(()=>location.href='/cart.html',1200)}
    function updateC(){const c=JSON.parse(localStorage.getItem('cart')||'[]').reduce((s,i)=>s+i.quantity,0);const b=document.getElementById('c');b.style.display=c?'flex':'none';b.textContent=c}
    document.addEventListener('DOMContentLoaded',updateC);
  </script>
</body>
</html>`;
}

const updated = [];
productsData.forEach((p, idx)=>{
  const html = page(p);
  const slug = translateToSeoUrl(p.title, p.id);
  fs.writeFileSync(path.join(outDir, `${slug}.html`), html, 'utf-8');
  updated.push({id:p.id,title:p.title,description:`${p.title} متوفر في الكويت بسعر ${p.sale_price} د.ك`,price:p.price,sale_price:p.sale_price,image:p.image_link,seo_url:`/products-pages/${slug}.html`});
  if((idx+1)%300===0) console.log(`✅ تم إنشاء ${idx+1} صفحة...`);
});

fs.writeFileSync('products.json', JSON.stringify(updated,null,2),'utf-8');

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://sooq-alkuwait.arabsad.com/</loc><priority>1.0</priority></url>\n  <url><loc>https://sooq-alkuwait.arabsad.com/cart.html</loc><priority>0.6</priority></url>`;
updated.forEach(p=>{sitemap+=`\n  <url><loc>https://sooq-alkuwait.arabsad.com${p.seo_url}</loc><priority>0.8</priority></url>`});
sitemap+='\n</urlset>';
fs.writeFileSync('sitemap.xml', sitemap, 'utf-8');

console.log('🎉 اكتمل إنشاء جميع الصفحات داخل products-pages/ وتم تحديث products.json و sitemap.xml');
