#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 التنظيف والتشغيل التلقائي الشامل');
console.log('=' + '='.repeat(55));

// ملفات للحذف (المكررة وغير الضرورية)
const filesToDelete = [
    'generate-all-product-pages.js',
    'generate-products-script.js', 
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
    'quick_run.js',
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
    'sitemap_generator.php'
];

// 1. تنظيف الملفات غير الضرورية
console.log('\n🧹 بدء تنظيف الملفات المكررة...');
let deletedCount = 0;

filesToDelete.forEach(fileName => {
    try {
        if (fs.existsSync(fileName)) {
            fs.unlinkSync(fileName);
            console.log(`   ❌ حذف: ${fileName}`);
            deletedCount++;
        }
    } catch (error) {
        console.log(`   ⚠️ خطأ في حذف ${fileName}: ${error.message}`);
    }
});

console.log(`✅ تم حذف ${deletedCount} ملف غير ضروري`);

// 2. التأكد من وجود الملفات الأساسية
const requiredFiles = ['products_data.json', 'generate_products.js'];
console.log('\n📋 التحقق من الملفات الأساسية...');

for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
        console.log(`   ✅ ${file} موجود`);
    } else {
        console.error(`   ❌ ${file} مفقود!`);
        process.exit(1);
    }
}

// 3. تحميل وتشغيل المولد
console.log('\n🚀 بدء توليد صفحات المنتجات...');

try {
    // قراءة البيانات
    const productsData = JSON.parse(fs.readFileSync('./products_data.json', 'utf8'));
    console.log(`📊 تم تحميل ${productsData.length} منتج`);
    
    // إنشاء مجلد المنتجات
    const productsDir = './products-pages';
    if (!fs.existsSync(productsDir)) {
        fs.mkdirSync(productsDir, { recursive: true });
    }
    
    // دالة تشفير العربية
    function encodeArabic(text) {
        return encodeURIComponent(text).replace(/[!'()*]/g, function(c) {
            return '%' + c.charCodeAt(0).toString(16);
        });
    }
    
    // دالة اسم الملف الآمن
    function generateSafeFilename(productId, title) {
        const safeTitle = title
            .replace(/[^\u0600-\u06FF\s\w-]/g, '')
            .trim()
            .substring(0, 50)
            .replace(/\s+/g, '-');
        return `product-${productId}-${encodeArabic(safeTitle)}.html`;
    }
    
    // قالب HTML
    function generateHTML(product) {
        return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.title} - سوق الكويت</title>
    <meta name="description" content="${product.description}">
    <meta property="og:title" content="${product.title}">
    <meta property="og:description" content="${product.description}">
    <meta property="og:image" content="${product.image_link}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .product-image { width: 100%; border-radius: 12px; }
        .product-title { font-size: 2rem; color: #333; margin-bottom: 20px; }
        .price-box { background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
        .sale-price { font-size: 2rem; font-weight: bold; }
        .original-price { text-decoration: line-through; opacity: 0.8; }
        .description { font-size: 1.1rem; line-height: 1.6; color: #666; margin: 20px 0; }
        .buy-btn { background: linear-gradient(45deg, #11998e, #38ef7d); color: white; border: none; padding: 15px 30px; font-size: 1.2rem; border-radius: 50px; cursor: pointer; width: 100%; margin: 20px 0; }
        .buy-btn:hover { transform: translateY(-2px); }
        .features { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
        .tag { background: #e3f2fd; padding: 5px 15px; border-radius: 20px; font-size: 0.9rem; }
        @media (max-width: 768px) { .product-grid { grid-template-columns: 1fr; } .product-title { font-size: 1.5rem; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="product-grid">
            <div>
                <img src="${product.image_link}" alt="${product.title}" class="product-image">
            </div>
            <div>
                <h1 class="product-title">${product.title}</h1>
                <div class="price-box">
                    ${product.price > product.sale_price ? 
                        `<span class="original-price">${product.price} د.ك</span><br>` : ''}
                    <span class="sale-price">${product.sale_price} د.ك</span>
                </div>
                <div class="description">${product.description}</div>
                <div class="features">
                    <span class="tag">✅ ضمان الجودة</span>
                    <span class="tag">🚚 توصيل سريع</span>
                    <span class="tag">🇰🇼 الكويت</span>
                </div>
                <button class="buy-btn" onclick="addToCart(${product.id})">
                    🛒 اشتري الآن - ${product.sale_price} د.ك
                </button>
            </div>
        </div>
    </div>
    <script>
        function addToCart(id) {
            alert('✅ تم إضافة المنتج للسلة!');
            window.location.href = '../../cart.html';
        }
    </script>
</body>
</html>`;
    }
    
    // 4. توليد جميع الصفحات
    let successCount = 0;
    const startTime = Date.now();
    
    console.log(`\n⚡ توليد ${productsData.length} صفحة...`);
    
    productsData.forEach((product, index) => {
        try {
            const filename = generateSafeFilename(product.id, product.title);
            const html = generateHTML(product);
            const filepath = path.join(productsDir, filename);
            
            fs.writeFileSync(filepath, html, 'utf8');
            successCount++;
            
            // تقرير التقدم
            if ((index + 1) % 500 === 0 || index === productsData.length - 1) {
                const progress = ((index + 1) / productsData.length * 100).toFixed(1);
                console.log(`   📈 ${progress}% (${index + 1}/${productsData.length})`);
            }
            
        } catch (error) {
            console.error(`❌ خطأ في المنتج ${product.id}`);
        }
    });
    
    // 5. توليد Sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    sitemap += `<url><loc>https://sooq-alkuwait.arabsad.com/</loc><priority>1.0</priority></url>\n`;
    
    productsData.forEach(product => {
        const filename = generateSafeFilename(product.id, product.title);
        sitemap += `<url><loc>https://sooq-alkuwait.arabsad.com/products-pages/${filename}</loc><priority>0.8</priority></url>\n`;
    });
    sitemap += '</urlset>';
    
    fs.writeFileSync('./sitemap.xml', sitemap, 'utf8');
    
    // 6. توليد Product Feed
    let feed = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n<channel>\n`;
    feed += `<title>سوق الكويت</title>\n<link>https://sooq-alkuwait.arabsad.com</link>\n`;
    
    productsData.forEach(product => {
        const filename = generateSafeFilename(product.id, product.title);
        feed += `<item>\n<g:id>${product.id}</g:id>\n<g:title><![CDATA[${product.title}]]></g:title>\n`;
        feed += `<g:link>https://sooq-alkuwait.arabsad.com/products-pages/${filename}</g:link>\n`;
        feed += `<g:image_link>${product.image_link}</g:image_link>\n<g:price>${product.sale_price} KWD</g:price>\n`;
        feed += `<g:availability>in_stock</g:availability>\n</item>\n`;
    });
    feed += '</channel>\n</rss>';
    
    fs.writeFileSync('./product-feed.xml', feed, 'utf8');
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    // تقرير النهاية
    console.log(`\n🎉 **اكتملت العملية بنجاح!**`);
    console.log(`✅ ${successCount} صفحة منتج`);
    console.log(`🗺️ sitemap.xml (${productsData.length} رابط)`);
    console.log(`📡 product-feed.xml جاهز`);
    console.log(`⏱️ المدة: ${duration} ثانية`);
    console.log(`🌐 الموقع جاهز للنشر!`);
    
} catch (error) {
    console.error('❌ خطأ:', error.message);
    process.exit(1);
}