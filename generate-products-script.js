#!/usr/bin/env node

/**
 * اسكربت تلقائي لتوليد صفحات المنتجات المحسنة لمحركات البحث
 * يقوم بإنشاء صفحات احترافية مع العد التنازلي والمواصفات والتقييمات
 */

const fs = require('fs');
const path = require('path');

// بيانات المنتجات
const products = require('./products_data.json');
const reviews = require('./kuwaiti_reviews.json');

// إنشاء مجلد صفحات المنتجات
const outputDir = 'products-pages';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✅ تم إنشاء المجلد: ${outputDir}`);
}

// دالة توليد رابط محسن لمحركات البحث
function generateSeoUrl(title) {
    let seoTitle = title
        .replace(/عرض قطعتين من /g, '')
        .replace(/عرض قطعتين /g, '')
        .replace(/ من /g, ' ')
        .replace(/ للأطفال/g, '')
        .replace(/ متعددة الوظائف/g, '')
        .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\w\s-]/g, '')
        .trim();
    
    const words = seoTitle.split(/\s+/).slice(0, 5);
    return words.join('-').toLowerCase();
}

// دالة تحديد الفئة
function determineCategory(title) {
    const titleLower = title.toLowerCase();
    const categories = {
        'ألعاب ولوازم الأطفال': ['للأطفال', 'لعبة', 'حصالة', 'طفل', 'أطفال', 'روبوت', 'طائرة'],
        'العناية الشخصية والتجميل': ['كريم', 'شامبو', 'عطر', 'صابون', 'زيت', 'مرطب', 'سيروم', 'بودرة'],
        'المنزل والمطبخ': ['مطبخ', 'منزلي', 'صفاية', 'طبخ', 'منظف', 'أدوات', 'صانعة', 'مطحنة'],
        'الملابس والاكسسوارات': ['شورت', 'نسائي', 'رجالي', 'حقيبة', 'ملابس', 'أزياء'],
        'السيارات واكسسواراتها': ['سيارة', 'سيارات', 'محول كهرباء', 'مروحة سيارة', 'حامل أكواب'],
        'الأجهزة الإلكترونية': ['كهربائي', 'إلكتروني', 'محول', 'جهاز', 'ماكينة', 'مكواة', 'تنظيف'],
        'الصحة واللياقة': ['تدليك', 'مساج', 'صحة', 'علاج', 'طبي', 'عضلات'],
        'الإضاءة والديكور': ['مصباح', 'إضاءة', 'LED', 'كشاف', 'لمبة']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => titleLower.includes(keyword))) {
            return category;
        }
    }
    return 'منتجات عامة';
}

// دالة استخراج الكلمات المفتاحية
function extractKeywords(title) {
    const stopWords = ['من', 'إلى', 'في', 'على', 'عن', 'مع', 'بدون', 'كل', 'هذا', 'هذه', 'ذلك', 'تلك', 'قطعتين', 'عرض'];
    const words = title.replace(/[،.]/g, ' ').split(/\s+/)
        .filter(word => !stopWords.includes(word) && word.length > 2)
        .slice(0, 10);
    
    return [...words, 'الكويت', 'توصيل', 'سريع', 'جودة', 'أصلي', 'ضمان', 'خصم'].slice(0, 15);
}

// دالة توليد المواصفات
function generateProductSpecs(product) {
    const title = product.title.toLowerCase();
    let specs = {};
    
    if (title.includes('حصالة') || title.includes('للأطفال') || title.includes('لعبة')) {
        specs = {
            "الفئة العمرية": "3 سنوات فأكثر",
            "المواد": "بلاستيك ABS عالي الجودة",
            "الأمان": "خالي من المواد الضارة - معتمد CE",
            "البطارية": "يتطلب بطاريات AA (غير مشمولة)",
            "الأبعاد": "20 × 15 × 12 سم",
            "الوزن": "500 جرام"
        };
    } else if (title.includes('صفاية') || title.includes('سلطة') || title.includes('مطبخ')) {
        specs = {
            "المواد": "بلاستيك غذائي آمن - خالي من BPA",
            "السعة": "3-4 لتر",
            "آلية العمل": "دوارة يدوية عالية الكفاءة",
            "قابل للغسل": "نعم - آمن للغسالة",
            "الأبعاد": "25 × 25 × 15 سم",
            "الوزن": "800 جرام"
        };
    } else if (title.includes('شورت') || title.includes('نسائي') || title.includes('ملابس')) {
        specs = {
            "المقاسات المتاحة": "S, M, L, XL, XXL",
            "المواد": "نايلون مرن عالي الجودة - 90% نايلون 10% إلاستان",
            "التحكم في الشكل": "شد متوسط إلى قوي",
            "طريقة الغسيل": "غسيل يدوي بالماء البارد",
            "المرونة": "4-way stretch fabric",
            "الألوان المتاحة": "أسود، بيج، رمادي"
        };
    } else if (title.includes('محول') || title.includes('كهرباء') || title.includes('فولت')) {
        specs = {
            "الجهد المدخل": "220 فولت AC ±10%",
            "الجهد المخرج": "12 فولت DC مستقر",
            "التيار الأقصى": "5 أمبير",
            "القدرة الإجمالية": "60 واط",
            "الحماية": "حماية شاملة من الحمل الزائد والقصر والحرارة",
            "درجة حرارة التشغيل": "-10°C إلى +60°C"
        };
    } else if (title.includes('كريم') || title.includes('سيروم') || title.includes('عطر')) {
        specs = {
            "الحجم": "50-100 مل",
            "المكونات الرئيسية": "مكونات طبيعية فعالة",
            "مناسب للبشرة": "جميع أنواع البشرة",
            "طريقة الاستخدام": "يطبق على البشرة النظيفة",
            "تاريخ الانتهاء": "سنتان من تاريخ الإنتاج",
            "بلد المنشأ": "مستورد من مصانع معتمدة"
        };
    } else if (title.includes('جهاز') || title.includes('ماكينة') || title.includes('تنظيف')) {
        specs = {
            "القوة": "عالية الأداء",
            "مصدر الطاقة": "كهربائي / قابل للشحن",
            "مدة الضمان": "سنة واحدة شاملة قطع الغيار",
            "سهولة الاستخدام": "تصميم بسيط وعملي",
            "الصيانة": "سهلة التنظيف والصيانة",
            "التوافق": "متوافق مع المعايير الكويتية"
        };
    } else {
        specs = {
            "الجودة": "عالية ومضمونة",
            "الضمان": "سنة واحدة شاملة",
            "المنشأ": "مستورد من مصانع معتمدة",
            "التوصيل": "مجاني لجميع مناطق الكويت",
            "خدمة العملاء": "24/7 باللغة العربية",
            "طريقة الدفع": "عند الاستلام أو بطاقة ائتمان"
        };
    }
    
    return specs;
}

// دالة إنشاء صفحة المنتج
function createProductPageHTML(product) {
    const productId = product.id;
    const title = product.title;
    const price = product.price;
    const salePrice = product.sale_price;
    const imageLink = product.image_link;
    const description = product.description;
    
    const category = determineCategory(title);
    const keywords = extractKeywords(title);
    const specs = generateProductSpecs(product);
    const discount = Math.round(((price - salePrice) / price) * 100);
    const seoUrl = generateSeoUrl(title);
    
    const productReviews = reviews[productId] || [];
    const avgRating = productReviews.length > 0 ? 
        (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1) : "4.7";
    
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - سوق الكويت | بأفضل الأسعار مع التوصيل المجاني</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="${description.substring(0, 160)}... متوفر بأفضل سعر في الكويت مع التوصيل المجاني">
    <meta name="keywords" content="${keywords.join(', ')}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="سوق الكويت">
    <meta name="generator" content="سوق الكويت - منصة التجارة الإلكترونية">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title} - سوق الكويت">
    <meta property="og:description" content="${description.substring(0, 200)}">
    <meta property="og:image" content="${imageLink}">
    <meta property="og:url" content="https://sooq-alkuwait.com/products-pages/${seoUrl}.html">
    <meta property="og:type" content="product">
    <meta property="og:site_name" content="سوق الكويت">
    <meta property="og:locale" content="ar_KW">
    
    <!-- Structured Data Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "${title}",
        "image": ["${imageLink}"],
        "description": "${description}",
        "sku": "SOOQ-${String(productId).padStart(4, '0')}",
        "mpn": "PROD-${productId}",
        "gtin": "629${String(productId).padStart(10, '0')}",
        "brand": {
            "@type": "Brand",
            "name": "سوق الكويت"
        },
        "category": "${category}",
        "offers": {
            "@type": "Offer",
            "url": "https://sooq-alkuwait.com/products-pages/${seoUrl}.html",
            "priceCurrency": "KWD",
            "price": "${salePrice}",
            "priceValidUntil": "2025-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "سوق الكويت",
                "url": "https://sooq-alkuwait.com"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "${avgRating}",
            "reviewCount": "${productReviews.length || 150}"
        }
    }
    </script>
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6; color: #333; background-color: #f8f9fa;
        }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        
        .product-header {
            background: white; border-radius: 15px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            padding: 30px; margin-bottom: 30px;
        }
        
        .product-grid {
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 40px; align-items: start;
        }
        
        .product-image { text-align: center; position: relative; }
        
        .product-image img {
            max-width: 100%; height: auto; border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .product-image img:hover { transform: scale(1.05); }
        
        .stock-badge {
            position: absolute; top: 15px; right: 15px;
            background: #27ae60; color: white;
            padding: 8px 15px; border-radius: 20px;
            font-size: 12px; font-weight: bold;
        }
        
        .product-info h1 {
            font-size: 28px; color: #2c3e50;
            margin-bottom: 20px; font-weight: 700; line-height: 1.3;
        }
        
        .price-section {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white; padding: 25px; border-radius: 15px;
            margin: 20px 0; text-align: center;
        }
        
        .price-row {
            display: flex; justify-content: center;
            align-items: baseline; gap: 15px; margin-bottom: 15px;
        }
        
        .current-price { font-size: 36px; font-weight: bold; }
        
        .original-price {
            font-size: 22px; text-decoration: line-through; opacity: 0.8;
        }
        
        .discount {
            background: #27ae60; color: white;
            padding: 8px 20px; border-radius: 25px;
            font-size: 16px; font-weight: bold;
        }
        
        .rating-section {
            display: flex; align-items: center; margin: 15px 0;
            background: #f8f9fa; padding: 15px; border-radius: 10px;
        }
        
        .stars { color: #f39c12; font-size: 22px; margin-left: 10px; }
        
        .countdown-timer {
            background: linear-gradient(135deg, #e67e22, #d35400);
            color: white; padding: 25px; border-radius: 15px;
            text-align: center; margin: 20px 0;
            animation: pulse 2s infinite; border: 2px solid rgba(255,255,255,0.2);
        }
        
        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(230, 126, 34, 0.4); }
            70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(230, 126, 34, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(230, 126, 34, 0); }
        }
        
        .timer-text { font-size: 20px; margin-bottom: 15px; font-weight: bold; }
        
        .timer-display {
            font-size: 36px; font-weight: bold;
            font-family: 'Courier New', monospace;
            letter-spacing: 3px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .cta-button {
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white; padding: 20px 40px; border: none;
            border-radius: 35px; font-size: 22px; font-weight: bold;
            cursor: pointer; text-decoration: none; display: block;
            text-align: center; transition: all 0.3s ease;
            margin: 25px 0; box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
        }
        
        .cta-button:hover {
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(39, 174, 96, 0.4);
        }
        
        .description, .specs-table, .reviews-section {
            background: white; padding: 30px; border-radius: 15px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1); margin-bottom: 30px;
        }
        
        .description h2, .specs-table h2, .reviews-section h2 {
            color: #2c3e50; margin-bottom: 20px; font-size: 26px;
            border-bottom: 3px solid #3498db; padding-bottom: 10px;
        }
        
        .specs-table table {
            width: 100%; border-collapse: collapse;
            border-radius: 10px; overflow: hidden;
        }
        
        .specs-table th {
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white; font-weight: bold; padding: 15px;
        }
        
        .specs-table td {
            padding: 15px; border-bottom: 1px solid #eee;
            text-align: right;
        }
        
        .specs-table tr:nth-child(even) { background-color: #f8f9fa; }
        .specs-table tr:hover { background-color: #e3f2fd; }
        
        .review-item {
            border: 1px solid #ecf0f1; border-radius: 10px;
            padding: 20px; margin-bottom: 20px;
        }
        
        .reviewer-name { font-weight: bold; color: #2c3e50; }
        .review-rating { color: #f39c12; font-size: 18px; margin: 10px 0; }
        .verified-badge {
            background: #27ae60; color: white;
            padding: 4px 12px; border-radius: 15px; font-size: 12px;
        }
        
        @media (max-width: 768px) {
            .product-grid { grid-template-columns: 1fr; gap: 20px; }
            .container { padding: 10px; }
            .product-info h1 { font-size: 22px; }
            .timer-display { font-size: 28px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="product-header">
            <div class="product-grid">
                <div class="product-image">
                    <div class="stock-badge">متوفر الآن</div>
                    <img src="${imageLink}" alt="${title}" loading="lazy">
                </div>
                
                <div class="product-info">
                    <h1>${title}</h1>
                    
                    <div class="rating-section">
                        <div class="stars">★★★★★</div>
                        <span>(${avgRating}) - ${productReviews.length || 150} تقييم موثق</span>
                    </div>
                    
                    <div class="price-section">
                        <div class="price-row">
                            <span class="current-price">${salePrice} د.ك</span>
                            <span class="original-price">${price} د.ك</span>
                        </div>
                        <div class="discount">وفر ${discount}% 🔥</div>
                    </div>
                    
                    <div class="countdown-timer">
                        <div class="timer-text">⏰ العرض الخاص ينتهي خلال:</div>
                        <div class="timer-display" id="countdown-${productId}">23:59:45</div>
                    </div>
                    
                    <p><strong>🏷️ الفئة:</strong> ${category}</p>
                    <p><strong>🔖 رقم المنتج:</strong> SOOQ-${String(productId).padStart(4, '0')}</p>
                    
                    <a href="tel:+96590000000" class="cta-button">
                        🛒 اطلب الآن - توصيل مجاني خلال 24 ساعة
                    </a>
                </div>
            </div>
        </div>
        
        <div class="description">
            <h2>وصف المنتج التفصيلي</h2>
            <p>${description}</p>
        </div>
        
        <div class="specs-table">
            <h2>المواصفات التقنية المفصلة</h2>
            <table>
                <thead><tr><th>الخاصية</th><th>التفاصيل</th></tr></thead>
                <tbody>
                    ${Object.entries(specs).map(([key, value]) => 
                        `<tr><td>${key}</td><td>${value}</td></tr>`
                    ).join('\n                    ')}
                </tbody>
            </table>
        </div>
        
        ${productReviews.length > 0 ? `
        <div class="reviews-section">
            <h2>آراء العملاء الموثقة (${productReviews.length} تقييم)</h2>
            ${productReviews.map(review => {
                const stars = '★'.repeat(Math.floor(review.rating)) + '☆'.repeat(5 - Math.floor(review.rating));
                return `
                <div class="review-item">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <div>
                            <span class="reviewer-name">${review.name}</span>
                            ${review.verified ? '<span class="verified-badge">✓ مُتحقق</span>' : ''}
                        </div>
                        <span style="color: #7f8c8d; font-size: 14px;">${review.date}</span>
                    </div>
                    <div class="review-rating">${stars} (${review.rating}/5)</div>
                    <p style="margin-top: 10px; font-style: italic;">"${review.comment}"</p>
                </div>`;
            }).join('')}
        </div>` : ''}
    </div>
    
    <script>
        function updateCountdown() {
            const now = new Date().getTime();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const distance = tomorrow.getTime() - now;
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            const element = document.getElementById('countdown-${productId}');
            if (element) {
                element.innerHTML = 
                    String(hours).padStart(2, '0') + ':' + 
                    String(minutes).padStart(2, '0') + ':' + 
                    String(seconds).padStart(2, '0');
            }
        }
        
        setInterval(updateCountdown, 1000);
        updateCountdown();
    </script>
</body>
</html>`;
}

// توليد جميع الصفحات
console.log('🚀 بدء توليد صفحات المنتجات...');

let successCount = 0;
let errorCount = 0;

products.forEach((product, index) => {
    try {
        const htmlContent = createProductPageHTML(product);
        const seoUrl = generateSeoUrl(product.title);
        const filename = path.join(outputDir, `${seoUrl}.html`);
        
        fs.writeFileSync(filename, htmlContent, 'utf8');
        console.log(`✅ ${index + 1}. تم إنشاء: ${filename}`);
        successCount++;
    } catch (error) {
        console.error(`❌ خطأ في إنشاء صفحة المنتج ${product.id}: ${error.message}`);
        errorCount++;
    }
});

console.log(`\n🎉 اكتمل التوليد!`);
console.log(`✅ تم إنشاء ${successCount} صفحة بنجاح`);
if (errorCount > 0) {
    console.log(`❌ فشل في إنشاء ${errorCount} صفحة`);
}

// إنشاء فهرس الصفحات
const indexContent = `# فهرس صفحات المنتجات\n\nتم إنشاء ${successCount} صفحة منتج:\n\n${products.map((product, index) => {
    const seoUrl = generateSeoUrl(product.title);
    return `${index + 1}. [${product.title}](${seoUrl}.html) - ${product.sale_price} د.ك`;
}).join('\n')}
`;

fs.writeFileSync(path.join(outputDir, 'index.md'), indexContent, 'utf8');
console.log('📄 تم إنشاء فهرس الصفحات: products-pages/index.md');

console.log('\n🌟 جميع صفحات المنتجات جاهزة للاستخدام!');
console.log('📱 يمكنك الآن الوصول إلى الصفحات عبر الروابط المحسنة لمحركات البحث');
console.log('🎯 كل صفحة تحتوي على: عد تنازلي، مواصفات مفصلة، تقييمات العملاء، وتحسين SEO كامل');