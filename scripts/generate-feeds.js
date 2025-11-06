const fs = require('fs');
const path = require('path');

// قراءة بيانات المنتجات
function loadProducts() {
    try {
        const data = fs.readFileSync('./products_data.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('خطأ في قراءة ملف المنتجات:', error);
        return [];
    }
}

// إنشاء Sitemap XML
function generateSitemap(products) {
    const baseUrl = 'https://sooq-alkuwait.arabsad.com';
    const now = new Date().toISOString();
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- الصفحات الأساسية -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/products-catalog.html</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/cart.html</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/about.html</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/delivery.html</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy.html</loc>
    <lastmod>${now}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms.html</loc>
    <lastmod>${now}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/refund.html</loc>
    <lastmod>${now}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.4</priority>
  </url>
`;

    // إضافة صفحات المنتجات
    products.forEach(product => {
        const slug = createProductSlug(product.title);
        sitemap += `  <url>
    <loc>${baseUrl}/products-pages/product-${product.id}-${slug}.html</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    sitemap += `</urlset>`;
    return sitemap;
}

// إنشاء Merchant Feed للمنتجات
function generateMerchantFeed(products) {
    const baseUrl = 'https://sooq-alkuwait.arabsad.com';
    const now = new Date().toISOString();
    
    let feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>سوق الكويت - منتجات عالية الجودة</title>
  <link>${baseUrl}/</link>
  <description>كتالوج شامل لأفضل المنتجات في الكويت بأسعار تنافسية وتوصيل مجاني</description>
  <lastBuildDate>${now}</lastBuildDate>
`;

    products.forEach(product => {
        const slug = createProductSlug(product.title);
        const category = categorizeProduct(product.title, product.description);
        const productUrl = `${baseUrl}/products-pages/product-${product.id}-${slug}.html`;
        
        feed += `  <item>
    <g:id>SOOQ-${String(product.id).padStart(4, '0')}</g:id>
    <g:title><![CDATA[${product.title}]]></g:title>
    <g:description><![CDATA[${product.description || 'منتج عالي الجودة متوفر في الكويت بأفضل سعر مع التوصيل المجاني'}]]></g:description>
    <g:link>${productUrl}</g:link>
    <g:image_link>${product.image_link}</g:image_link>
    <g:condition>new</g:condition>
    <g:availability>in stock</g:availability>
    <g:price>${product.sale_price} KWD</g:price>
    <g:brand>سوق الكويت</g:brand>
    <g:product_type>${category}</g:product_type>
    <g:google_product_category>${getGoogleCategory(category)}</g:google_product_category>
    <g:shipping>
      <g:country>KW</g:country>
      <g:service>Free Shipping</g:service>
      <g:price>0 KWD</g:price>
    </g:shipping>
  </item>
`;
    });

    feed += `</channel>
</rss>`;
    return feed;
}

// دالة إنشاء slug للمنتج
function createProductSlug(title) {
    return title
        .replace(/[\s\u00A0]+/g, '-')
        .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// دالة تصنيف المنتج
function categorizeProduct(title, description) {
    const text = (title + ' ' + (description || '')).toLowerCase();
    const map = {
        'الأطفال': ['طفل', 'أطفال', 'لعب', 'لعبة', 'حصالة', 'روبوت', 'تعليمية', 'ترفيهية', 'كرتوني', 'فقاعات', 'مسدس'],
        'المطبخ': ['مطبخ', 'صانعة', 'قهوة', 'صفاية', 'طعام', 'خلاط', 'ميزان', 'مقطعة', 'عصارة', 'سكاكين', 'طبخ', 'غلاية', 'فراير', 'طاحونة', 'كسارة'],
        'الملابس': ['شورت', 'ملابس', 'حقيبة', 'نسائي', 'رجالي', 'سروال', 'قبعة', 'حقائب', 'ظهر', 'يد', 'سفر', 'جلدية', 'مقاومة للماء'],
        'السيارات': ['سيارة', 'السيارة', 'محول', 'كهرباء', '220 فولت', '12 فولت', 'حامل هاتف', 'مغناطيسي', 'مرآة', 'زجاج', 'بطارية السيارة', 'شاحن بطارية', 'مسّاحة', 'منظف زجاج'],
        'العناية': ['شامبو', 'سيروم', 'كريم', 'عناية', 'شعر', 'بشرة', 'تجميل', 'جمال', 'عطر', 'مشط', 'ماكينة حلاقة', 'أظافر', 'لحية', 'تنعيم', 'تفتيح']
    };
    
    for (const [cat, keys] of Object.entries(map)) {
        if (keys.some(k => text.includes(k.toLowerCase()))) return cat;
    }
    return 'عام';
}

// دالة تحويل الفئة إلى Google Category
function getGoogleCategory(category) {
    const googleCategoryMap = {
        'الأطفال': 'Toys & Games',
        'المطبخ': 'Home & Garden > Kitchen & Dining',
        'الملابس': 'Apparel & Accessories',
        'السيارات': 'Vehicles & Parts > Vehicle Parts & Accessories',
        'العناية': 'Health & Beauty',
        'عام': 'Home & Garden'
    };
    return googleCategoryMap[category] || 'Home & Garden';
}

// الدالة الرئيسية
function main() {
    console.log('🚀 بدء عملية إنشاء ملفات الفيد والسايت ماب...');
    
    // تحميل المنتجات
    const products = loadProducts();
    console.log(`📦 تم تحميل ${products.length} منتج`);
    
    // التأكد من وجود مجلد feeds
    const feedsDir = './feeds';
    if (!fs.existsSync(feedsDir)) {
        fs.mkdirSync(feedsDir);
        console.log('📁 تم إنشاء مجلد feeds');
    }
    
    // إنشاء السايت ماب
    const sitemap = generateSitemap(products);
    fs.writeFileSync(path.join(feedsDir, 'sitemap.xml'), sitemap, 'utf8');
    console.log('✅ تم إنشاء sitemap.xml بنجاح');
    
    // إنشاء المرشنت فيد
    const merchantFeed = generateMerchantFeed(products);
    fs.writeFileSync(path.join(feedsDir, 'merchant-feed.xml'), merchantFeed, 'utf8');
    console.log('✅ تم إنشاء merchant-feed.xml بنجاح');
    
    console.log(`
🎉 اكتملت العملية بنجاح!
📊 إحصائيات:
   • عدد المنتجات: ${products.length}
   • ملف السايت ماب: feeds/sitemap.xml
   • ملف المرشنت فيد: feeds/merchant-feed.xml
`);
}

// تشغيل السكريبت
if (require.main === module) {
    main();
}

module.exports = { generateSitemap, generateMerchantFeed, loadProducts };