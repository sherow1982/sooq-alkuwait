/**
 * سكريبت توليد جميع صفحات المنتجات دفعة واحدة
 * مع المواصفات التفصيلية وتحسين السيو (SEO)
 * لاستخدام هذا السكريبت: node generate-all-product-pages.js
 */

const fs = require('fs');
const path = require('path');

// قراءة بيانات المنتجات
let productsData;
try {
    const rawData = fs.readFileSync('products_data.json', 'utf8');
    productsData = JSON.parse(rawData);
    console.log(`📦 تم تحميل ${productsData.length} منتج`);
} catch (error) {
    console.error('❌ خطأ في قراءة ملف products_data.json:', error.message);
    process.exit(1);
}

// إعداد مجلد products-pages
const pagesDir = 'products-pages';
if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
    console.log(`📁 تم إنشاء مجلد ${pagesDir}`);
}

// دالة تنظيف عنوان المنتج لعمل slug
function createSlug(title) {
    return title
        .replace(/[\s\u00A0]+/g, '-')  // استبدال المسافات بشرطات
        .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\-]/g, '')  // إزالة الرموز غير المرغوبة
        .replace(/-+/g, '-')  // دمج الشرطات المتعددة
        .replace(/^-|-$/g, '')  // إزالة الشرطات من البداية والنهاية
        .toLowerCase();
}

// دالة تصنيف المنتجات
function categorizeProduct(title, description = '') {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('طفل') || text.includes('لعب') || text.includes('أطفال') || text.includes('حصالة') || text.includes('روبوت') || text.includes('لعبة')) {
        return 'ألعاب الأطفال';
    } else if (text.includes('مطبخ') || text.includes('صانعة') || text.includes('قهوة') || text.includes('طبخ') || text.includes('صفاية') || text.includes('طعام') || text.includes('أدوات')) {
        return 'المطبخ والمنزل';
    } else if (text.includes('شورت') || text.includes('ملابس') || text.includes('حقيبة') || text.includes('قميص') || text.includes('بنطال')) {
        return 'الملابس والاكسسوارات';
    } else if (text.includes('سيارة') || text.includes('محول') || text.includes('كهرباء') || text.includes('سيارات') || text.includes('مركبة')) {
        return 'السيارات واكسسواراتها';
    } else if (text.includes('شامبو') || text.includes('سيروم') || text.includes('كريم') || text.includes('عناية') || text.includes('بشرة') || text.includes('شعر') || text.includes('جمال')) {
        return 'العناية الشخصية';
    } else {
        return 'منتجات متنوعة';
    }
}

// دالة توليد مواصفات المنتج
function generateProductSpecs(product, category) {
    const countries = ['الصين', 'تركيا', 'الصين/تركيا'];
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    
    return {
        'العلامة التجارية': 'سوق الكويت',
        'بلد الصنع': randomCountry,
        'ضمان المنتج': 'سنة واحدة',
        'حالة المنتج': 'جديد',
        'الشحن': 'مجاني لجميع أنحاء الكويت',
        'المواد': 'عالية الجودة',
        'الاستخدام': 'سهل ومريح',
        'المتانة': 'طويلة الأمد',
        'التصميم': 'عصري وأنيق'
    };
}

// دالة توليد HTML لصفحة المنتج
function generateProductPageHTML(product) {
    const category = categorizeProduct(product.title, product.description);
    const specs = generateProductSpecs(product, category);
    const discount = Math.round(((product.price - product.sale_price) / product.price) * 100);
    const description = product.description || `منتج عالي الجودة من سوق الكويت بأفضل الأسعار وضمان شامل.`;
    
    // توليد HTML للمواصفات
    let specsHTML = '';
    Object.entries(specs).forEach(([key, value]) => {
        specsHTML += `
            <div class="spec-item">
                <span class="spec-label">${key}:</span>
                <span class="spec-value">${value}</span>
            </div>
        `;
    });
    
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.title} - سوق الكويت | أفضل الأسعار</title>
    <meta name="description" content="${description} متوفر بسعر ${product.sale_price} د.ك بدلاً من ${product.price} د.ك - خصم ${discount}%">
    <meta name="keywords" content="${product.title}, سوق الكويت, ${category}, خصم ${discount}%, أفضل الأسعار, توصيل مجاني">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${product.title} - سوق الكويت">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${product.image_link}">
    <meta property="og:type" content="product">
    <meta property="product:price:amount" content="${product.sale_price}">
    <meta property="product:price:currency" content="KWD">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${product.title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${product.image_link}">
    
    <!-- Structured Data for SEO -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "${product.title}",
        "image": ["${product.image_link}"],
        "description": "${description}",
        "sku": "SOOQ-${product.id.toString().padStart(4, '0')}",
        "mpn": "SOOQ-${product.id.toString().padStart(4, '0')}",
        "brand": {
            "@type": "Brand",
            "name": "سوق الكويت"
        },
        "category": "${category}",
        "offers": {
            "@type": "Offer",
            "url": "https://sherow1982.github.io/sooq-alkuwait/products-pages/${createSlug(product.title)}.html",
            "priceCurrency": "KWD",
            "price": "${product.sale_price}",
            "priceValidUntil": "2025-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "سوق الكويت"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.5",
            "reviewCount": "${Math.floor(Math.random() * 50) + 10}"
        }
    }
    </script>
    
    <link rel="stylesheet" href="../assets/css/kuwait-modern.css">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
    
    <style>
        .product-page {
            padding-top: 100px;
            min-height: 100vh;
        }
        
        .breadcrumb {
            background: #f8f9fa;
            padding: 15px 0;
            margin-bottom: 30px;
        }
        
        .breadcrumb-nav {
            font-size: 14px;
            color: #666;
        }
        
        .breadcrumb-nav a {
            color: var(--ku-green);
            text-decoration: none;
        }
        
        .breadcrumb-nav a:hover {
            text-decoration: underline;
        }
        
        .product-container {
            max-width: 1000px;
            margin: 0 auto;
        }
        
        .product-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            align-items: start;
        }
        
        .product-image-section img {
            width: 100%;
            height: 500px;
            object-fit: cover;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .product-info {
            padding: 20px;
        }
        
        .product-title {
            color: var(--ku-green);
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 20px;
            line-height: 1.3;
        }
        
        .product-description {
            color: #666;
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 25px;
        }
        
        .countdown-timer {
            background: linear-gradient(135deg, #e67e22, #d35400);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            margin: 25px 0;
            font-size: 18px;
            font-weight: bold;
        }
        
        .price-section {
            background: linear-gradient(135deg, var(--ku-red), #e74c3c);
            color: white;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            margin: 30px 0;
        }
        
        .original-price {
            font-size: 20px;
            opacity: 0.8;
            text-decoration: line-through;
            margin-bottom: 10px;
        }
        
        .current-price {
            font-size: 40px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .discount-badge {
            background: var(--ku-gold);
            color: var(--ku-black);
            padding: 10px 20px;
            border-radius: 15px;
            font-size: 16px;
            font-weight: bold;
            display: inline-block;
        }
        
        .specifications {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 20px;
            margin: 30px 0;
        }
        
        .spec-title {
            color: var(--ku-green);
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .spec-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .spec-item {
            padding: 15px;
            background: white;
            border-radius: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .spec-label {
            font-weight: bold;
            color: #666;
        }
        
        .spec-value {
            color: var(--ku-green);
            font-weight: bold;
        }
        
        .action-buttons {
            display: flex;
            gap: 15px;
            margin: 30px 0;
            flex-wrap: wrap;
        }
        
        .whatsapp-btn {
            background: linear-gradient(135deg, #25d366, #128c7e);
            color: white;
            padding: 20px 40px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: bold;
            font-size: 18px;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3);
            flex: 1;
            text-align: center;
            min-width: 200px;
        }
        
        .whatsapp-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
        }
        
        .call-btn {
            background: linear-gradient(135deg, var(--ku-green), #27ae60);
            color: white;
            padding: 20px 40px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: bold;
            font-size: 18px;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(39, 174, 96, 0.3);
            flex: 1;
            text-align: center;
            min-width: 200px;
        }
        
        .call-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(39, 174, 96, 0.4);
        }
        
        .product-details {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 15px;
            margin-top: 30px;
        }
        
        .details-title {
            color: var(--ku-green);
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .details-list {
            font-size: 16px;
            color: #666;
            line-height: 2;
        }
        
        @media (max-width: 768px) {
            .product-grid {
                grid-template-columns: 1fr;
                gap: 30px;
            }
            
            .product-title {
                font-size: 24px;
            }
            
            .current-price {
                font-size: 30px;
            }
            
            .spec-grid {
                grid-template-columns: 1fr;
            }
            
            .action-buttons {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container nav">
            <a class="logo" href="../index.html">
                <span class="logo-badge"></span>
                <span>سوق الكويت</span>
            </a>
            <nav class="menu">
                <a href="../index.html">الرئيسية</a>
                <a href="../products-catalog.html">المنتجات</a>
                <a href="../about.html">من نحن</a>
                <a href="../contact.html">اتصل بنا</a>
            </nav>
            <a class="cta" href="tel:+201110760081">اطلب الآن</a>
        </div>
    </header>
    
    <!-- Breadcrumb -->
    <section class="breadcrumb">
        <div class="container">
            <nav class="breadcrumb-nav">
                <a href="../index.html">الرئيسية</a> » 
                <a href="../products-catalog.html">المنتجات</a> » 
                <a href="../products-catalog.html?category=${encodeURIComponent(category)}">${category}</a> » 
                <span style="color: var(--ku-green);">${product.title}</span>
            </nav>
        </div>
    </section>
    
    <!-- Product Page -->
    <main class="product-page">
        <div class="container">
            <div class="product-container">
                <div class="product-grid">
                    <!-- Product Image -->
                    <div class="product-image-section">
                        <img src="${product.image_link}" alt="${product.title}" 
                             onerror="this.src='https://via.placeholder.com/500x500/2d5230/ffffff?text=منتج+سوق+الكويت'">
                    </div>
                    
                    <!-- Product Info -->
                    <div class="product-info">
                        <h1 class="product-title">${product.title}</h1>
                        <p class="product-description">${description}</p>
                        
                        <!-- Countdown Timer -->
                        <div class="countdown-timer">
                            ⏰ العرض ينتهي خلال: <span id="countdown-timer">23:59:45</span>
                        </div>
                        
                        <!-- Price Section -->
                        <div class="price-section">
                            <div class="original-price">${product.price} د.ك</div>
                            <div class="current-price">${product.sale_price} د.ك</div>
                            <div class="discount-badge">خصم ${discount}%</div>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="action-buttons">
                            <a href="https://wa.me/201110760081?text=مرحباً، أريد طلب: ${encodeURIComponent(product.title)} - السعر: ${product.sale_price} د.ك - رقم المنتج: SOOQ-${product.id.toString().padStart(4, '0')}" 
                               class="whatsapp-btn" target="_blank">
                                💬 طلب عبر واتساب
                            </a>
                            <a href="tel:+201110760081" class="call-btn">
                                📞 اتصل بنا الآن
                            </a>
                        </div>
                        
                        <!-- Product Details -->
                        <div class="product-details">
                            <h3 class="details-title">📋 تفاصيل المنتج</h3>
                            <div class="details-list">
                                📂 الفئة: ${category}<br>
                                🏷️ رقم المنتج: SOOQ-${product.id.toString().padStart(4, '0')}<br>
                                🚚 توصيل مجاني لجميع مناطق الكويت<br>
                                ⏰ خدمة عملاء 24/7<br>
                                💰 دفع عند الاستلام متاح<br>
                                ✅ ضمان الجودة مدى الحياة
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Specifications Section -->
                <div class="specifications">
                    <h2 class="spec-title">📋 المواصفات التفصيلية</h2>
                    <div class="spec-grid">
                        ${specsHTML}
                    </div>
                </div>
            </div>
        </div>
    </main>
    
    <!-- Footer -->
    <footer class="footer">
        <div class="container cols">
            <div>
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
                    <span class="logo-badge"></span>
                    <strong style="font-size:20px">سوق الكويت</strong>
                </div>
                <p>تجربة تسوّق حديثة بألوان العلم.</p>
            </div>
            <div>
                <h4 style="color:#c9d1d9;margin-bottom:12px">تواصل مباشر</h4>
                <p style="color:#8b949e;line-height:1.8">📱 الهاتف: +201110760081</p>
                <p style="color:#8b949e;line-height:1.8">📧 البريد: sooqalkuwait2010@gmail.com</p>
            </div>
        </div>
        <div class="copy">
            <div class="container" style="text-align:center">
                <p>© 2025 سوق الكويت | جميع الحقوق محفوظة 🇰🇼</p>
            </div>
        </div>
    </footer>
    
    <script>
        // Countdown timer
        function updateCountdown() {
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24*60*60*1000);
            tomorrow.setHours(0,0,0,0);
            
            const diff = tomorrow - now;
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            
            const timeString = hours.toString().padStart(2, '0') + ':' + 
                             minutes.toString().padStart(2, '0') + ':' + 
                             seconds.toString().padStart(2, '0');
            
            const timerEl = document.getElementById('countdown-timer');
            if (timerEl && diff > 0) {
                timerEl.textContent = timeString;
            }
        }
        
        setInterval(updateCountdown, 1000);
        updateCountdown();
    </script>
</body>
</html>`;
}

// معالجة جميع المنتجات وتوليد صفحاتها
let generatedPages = 0;
let errorCount = 0;

console.log('🚀 بدء توليد صفحات المنتجات...');

productsData.forEach((product, index) => {
    try {
        // إنشاء slug للمنتج
        const slug = createSlug(product.title);
        if (!slug) {
            console.warn(`⚠️  تخطي منتج ${product.id}: لا يمكن إنشاء slug من "${product.title}"`);
            errorCount++;
            return;
        }
        
        // توليد HTML
        const pageHTML = generateProductPageHTML(product);
        
        // كتابة الملف
        const fileName = `${slug}.html`;
        const filePath = path.join(pagesDir, fileName);
        
        fs.writeFileSync(filePath, pageHTML, 'utf8');
        generatedPages++;
        
        // إظهار التقدم كل 50 صفحة
        if (generatedPages % 50 === 0) {
            console.log(`✅ تم توليد ${generatedPages} صفحة...`);
        }
        
    } catch (error) {
        console.error(`❌ خطأ في توليد صفحة للمنتج ${product.id}:`, error.message);
        errorCount++;
    }
});

// إنشاء sitemap.xml للمنتجات
const sitemapEntries = productsData.map(product => {
    const slug = createSlug(product.title);
    return `  <url>
    <loc>https://sherow1982.github.io/sooq-alkuwait/products-pages/${slug}.html</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sherow1982.github.io/sooq-alkuwait/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://sherow1982.github.io/sooq-alkuwait/products-catalog.html</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
${sitemapEntries}
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemap, 'utf8');

// نتائج التوليد
console.log('\n🎉 انتهى توليد صفحات المنتجات!');
console.log(`✅ تم توليد ${generatedPages} صفحة بنجاح`);
if (errorCount > 0) {
    console.log(`⚠️  عدد الأخطاء: ${errorCount}`);
}
console.log(`🗺️ تم إنشاء sitemap.xml بـ ${productsData.length + 2} رابط`);
console.log('\nلتشغيل السكريبت مرة أخرى: node generate-all-product-pages.js');
console.log('للوصول إلى الصفحات: http://localhost:3000/products-pages/');

process.exit(0);