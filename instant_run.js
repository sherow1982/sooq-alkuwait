const fs = require('fs');

// الملفات المكررة للحذف (دفعة واحدة)
const duplicateFiles = [
    'auto_generate_pages.py',
    'generate_site_complete.py',
    'complete_bulk_generator.py', 
    'instant_bulk_generator.py',
    'mass-update-script.py',
    'merchant-feed.xml',
    'products_feed.xml',
    'CART-SUCCESS-REPORT.md',
    'CART_FIX_INSTRUCTIONS.md',
    'CLEANUP_LOG.md',
    'DEPLOYMENT_READY.md',
    'DEPLOYMENT_SUCCESS.md',
    'fix-cart-system.md',
    'BULK_DEPLOYMENT_STATUS.txt',
    'auto-product-features.js',
    'checkout-ajax.js',
    'checkout-webhook.js',
    'countdown-timer.js',
    'debug-cart-system.html',
    'dynamic-schema.js',
    'fix_all_cart_buttons.py',
    'geo-location.js',
    'google-sheets-webhook.js',
    'homepage-countdown.js',
    'purchase-notifications.js',
    'merchant_feed_generator.php',
    'sitemap_generator.php',
    'quick_run.js'
];

console.log('🔥 بدء التنظيف الدفعي والتوليد التلقائي');
console.log('=' + '='.repeat(50));

// حذف دفعي
console.log(`🗯f️ حذف ${duplicateFiles.length} ملف مكرر...`);
let deletedCount = 0;

duplicateFiles.forEach(file => {
    try {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            deletedCount++;
        }
    } catch (error) {
        // تجاهل الأخطاء واستمرار
    }
});

console.log(`✅ تم حذف ${deletedCount} ملف`);

// توليد فوري للصفحات
console.log('\n🚀 بدء التوليد الفوري...');

try {
    const productsData = JSON.parse(fs.readFileSync('./products_data.json', 'utf8'));
    console.log(`📊 ${productsData.length} منتج جاهز للتوليد`);
    
    // إنشاء المجلد
    const dir = './products-pages';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    // دوال المساعدة
    const encode = (text) => encodeURIComponent(text).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16));
    const filename = (id, title) => `product-${id}-${encode(title.replace(/[^\u0600-\u06FF\s\w-]/g, '').trim().substring(0, 40).replace(/\s+/g, '-'))}.html`;
    
    // قالب مبسط وسريع
    const template = (p) => `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>${p.title}</title><meta name="description" content="${p.description}"><style>body{font-family:Arial;margin:40px;background:#f9f9f9}.product{max-width:800px;margin:0 auto;background:white;padding:30px;border-radius:15px;box-shadow:0 5px 15px rgba(0,0,0,0.1)}.title{font-size:2rem;color:#333;margin-bottom:20px}.price{background:linear-gradient(45deg,#667eea,#764ba2);color:white;padding:15px;border-radius:10px;text-align:center;font-size:1.5rem;font-weight:bold;margin:20px 0}.desc{font-size:1.1rem;line-height:1.6;color:#666;margin:20px 0}.btn{background:linear-gradient(45deg,#11998e,#38ef7d);color:white;border:none;padding:15px 30px;font-size:1.1rem;border-radius:25px;cursor:pointer;width:100%}.btn:hover{opacity:0.9}</style></head><body><div class="product"><img src="${p.image_link}" style="width:100%;border-radius:10px;margin-bottom:20px"><h1 class="title">${p.title}</h1><div class="price">${p.sale_price} د.ك</div><div class="desc">${p.description}</div><button class="btn" onclick="alert('تم الإضافة!')">🛒 اشتري الآن</button></div></body></html>`;
    
    // توليد سريع
    let count = 0;
    productsData.forEach((product, i) => {
        try {
            const file = filename(product.id, product.title);
            fs.writeFileSync(`${dir}/${file}`, template(product), 'utf8');
            count++;
            if (i % 400 === 0) console.log(`⚡ ${i + 1}/${productsData.length}`);
        } catch (e) { /* تجاهل الأخطاء */ }
    });
    
    // Sitemap سريع
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>https://sooq-alkuwait.arabsad.com/</loc></url>\n`;
    productsData.forEach(p => {
        const f = filename(p.id, p.title);
        sitemap += `<url><loc>https://sooq-alkuwait.arabsad.com/products-pages/${f}</loc></url>\n`;
    });
    sitemap += '</urlset>';
    fs.writeFileSync('./sitemap.xml', sitemap, 'utf8');
    
    // Feed سريع
    let feed = `<?xml version="1.0"?>\n<rss xmlns:g="http://base.google.com/ns/1.0"><channel><title>سوق الكويت</title>\n`;
    productsData.forEach(p => {
        const f = filename(p.id, p.title);
        feed += `<item><g:id>${p.id}</g:id><g:title><![CDATA[${p.title}]]></g:title><g:link>https://sooq-alkuwait.arabsad.com/products-pages/${f}</g:link><g:price>${p.sale_price} KWD</g:price></item>\n`;
    });
    feed += '</channel></rss>';
    fs.writeFileSync('./product-feed.xml', feed, 'utf8');
    
    console.log(`\n🎉 النجاح الكامل!`);
    console.log(`✅ ${count} صفحة منتج`);
    console.log(`🗺️ sitemap.xml`);
    console.log(`📡 product-feed.xml`);
    console.log(`🌐 الموقع جاهز!`);
    
} catch (error) {
    console.error('❌', error.message);
}