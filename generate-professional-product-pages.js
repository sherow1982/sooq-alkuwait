/**
 * سكريپت توليد صفحات المنتجات الاحترافية
 * محسّن لجوجل مرشنت سنتر والسيو في الكويت
 * تشغيل: node generate-professional-product-pages.js
 */

const fs = require('fs').promises;
const path = require('path');

// بيانات كلمات البحث الكويتية بحسب الفئة
const kuwaitSearchKeywords = {
    'أجهزة': ['أجهزة ذكية الكويت', 'تكنولوجيا الكويت', 'أفضل منتجات إلكترونية', 'تقنية حديثة', 'أجهزة منزلية'],
    'عناية': ['منتجات عناية البشرة', 'جمال طبيعي', 'كريمات فعّالة', 'عناية الوجه', 'عناية يومية'],
    'شعر': ['عناية الشعر الطبيعي', 'شعر صحي', 'علاج تساقط الشعر', 'شامبو طبيعي', 'زيوت للشعر'],
    'منزل': ['أدوات منزلية عملية', 'تنظم وترتيب', 'مطبخ عملي', 'تنظيف فعّال', 'معدات منزلية'],
    'ملابس': ['اكسسوارات عصرية', 'حقائب أنيقة', 'محافظ عملية', 'اكسسوارات رجالي', 'اكسسوارات نسائية'],
    'رياضة': ['لياقة بدنية عالية', 'معدات رياضية', 'تمارين منزلية', 'جيم منزلي', 'ادوات رياضية'],
    'اطفال': ['ألعاب أطفال تعليمية', 'منتجات اطفال آمنة', 'ألعاب تنمية مهارات', 'ألعاب تفاعلية', 'منتجات طفلية'],
    'صحة': ['منتجات صحية طبيعية', 'علاج بديل', 'صحة عامة', 'منتجات عضوية', 'شفاء طبيعي'],
    'عطور': ['عطور طبيعية فاخرة', 'عطر شرقي', 'روائح مميزة', 'عطور رجالي', 'عطور نسائية'],
    'سيارة': ['منتجات السيارات', 'عناية وصيانة', 'اكسسوارات مركبة', 'أدوات قيادة', 'معدات العناية']
};

// أسماء عملاء كويتيين للمراجعات
const kuwaitCustomerNames = [
    'محمد العتيبي', 'فاطمة الزهراني', 'عبدالله المطيري', 'مريم الشمري', 'خالد العجمي',
    'عايشة الكندري', 'سعد الراشد', 'نوره المحمد', 'يوسف العياف', 'رهف السبيعي',
    'زينب العوضي', 'عبدالرحمن الفهد', 'ليالي العنزي', 'صالح الخضر', 'دانه القحطاني',
    'عبدالعزيز الراجحي', 'هدى العتيبي', 'طلال العجمي', 'لطيفة الخالد', 'فيصل الحبين
];

// نصوص مراجعات إيجابية كويتية
const kuwaitReviewTexts = [
    'منتج ممتاز وبسعر معقول. التوصيل كان سريع جداً والخدمة ممتازة. أنصح بالشراء من سوق الكويت',
    'مشاء الله جودة عالية والسعر أرخص من المحلات. الحمد لله وصل بحالة ممتازة',
    'أفضل متجر إلكتروني في الكويت! جربت عدة مواقع وهذا الأفضل. الخدمة ممتازة',
    'المنتج أحسن من المتوقع. جودة ممتازة والتعبئة احترافية. بارك الله فيكم',
    'سرعة في التوصيل والمنتج بحالته الأصلية. ما شاء الله خدمة راقية',
    'الحمد لله على هذا المنتج الرائع. يستحق فعلاً أكثر من 5 نجوم. أنصح بشدة!',
    'تجربة تسوق مميزة من البداية للنهاية. التعامل مهني جداً والمنتج بجودة عالية',
    'استلمت المنتج في نفس اليوم! هذه السرعة في التوصيل مبهرة. شكراً سوق الكويت',
    'صراحة من أفضل التجارب اللي جربتها. متجر موثوق جداً والمنتجات بجودة عالية',
    'ماشاء الله تبارك الرحمن! المنتج بحالة ممتازة والسعر معقول جداً',
    'متجر موثوق 100% والمنتجات أصلية. الحمد لله على هذه الخدمة المميزة',
    'الله يعطيكم العافية! المنتج فاق التوقعات والأسعار منافسة',
    'خدمة عملاء ممتازة والمنتج بجودة عالية. أنصح بشدة بالتعامل مع سوق الكويت',
    'تم التوصيل في أقل من 24 ساعة! هذا هو الخدمة الاحترافية. بارك الله فيكم',
    'المنتج يستحق الثناء بجدارة. جودة عالية وسعر منافس. شركة جديرة بالثقة',
    'هذا المتجر من أفضل ما جربت في الكويت. ردود الخدمة سريعة والعملاء محترمين'
];

// توليد مراجعة عشوائية لمنتج
function generateRandomReview() {
    const name = kuwaitCustomerNames[Math.floor(Math.random() * kuwaitCustomerNames.length)];
    const text = kuwaitReviewTexts[Math.floor(Math.random() * kuwaitReviewTexts.length)];
    const rating = Math.random() < 0.85 ? 5 : 4; // 85% خمس نجوم، 15% أربع
    
    // تاريخ عشوائي من 2018-2024
    const startDate = new Date('2018-01-01');
    const endDate = new Date('2024-12-31');
    const reviewDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    
    return {
        name,
        text,
        rating,
        date: reviewDate.toISOString().split('T')[0]
    };
}

// توليد مراجعات لمنتج
function generateProductReviews(productTitle, count = 15) {
    const reviews = [];
    for (let i = 0; i < count; i++) {
        reviews.push(generateRandomReview());
    }
    return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// إنشاء slug لاسم الملف
function createSlug(title, id) {
    const cleanTitle = title
        .replace(/[\s\-\+\(\)\[\]\{\}\|\\\/:*?"<>]/g, '-')
        .replace(/\-+/g, '-')
        .replace(/^\-|\-$/g, '')
        .substring(0, 50); // حدد طول URL
        
    return `${cleanTitle}-${id}.html`;
}

// توليد كلمات بحث محسّنة للسيو
function generateSEOKeywords(product) {
    const keywords = [];
    
    // كلمات من العنوان
    const titleWords = product.title.split(' ').filter(word => word.length > 2);
    keywords.push(...titleWords);
    
    // كلمات حسب الفئة
    for (const [category, categoryKeywords] of Object.entries(kuwaitSearchKeywords)) {
        if (product.title.includes(category) || product.description.includes(category)) {
            keywords.push(...categoryKeywords);
            break;
        }
    }
    
    // كلمات عامة للسيو
    keywords.push('اشتري اونلاين الكويت', 'أفضل أسعار', 'توصيل مجاني', 'دفع عند الاستلام');
    
    return [...new Set(keywords)].join(', '); // إزالة التكرار
}

// توليد ميزات المنتج
function generateProductFeatures(product) {
    const features = [
        'ضمان الجودة والأصالة',
        'توصيل مجاني لجميع محافظات الكويت',
        'خدمة عملاء مميزة 24/7',
        'دفع آمن عند الاستلام',
        'سهولة الإرجاع والاستبدال'
    ];
    
    // ميزات خاصة حسب نوع المنتج
    const title = product.title.toLowerCase();
    if (title.includes('جهاز') || title.includes('إلكتروني')) {
        features.push('ضمان شركة لمدة عام كامل', 'رقم سيريال عالمي أصلي');
    } else if (title.includes('عناية') || title.includes('جمال')) {
        features.push('منتجات طبيعية 100%', 'آمن على البشرة الحساسة', 'معتمد من هيئات عالمية');
    } else if (title.includes('منزل') || title.includes('مطبخ')) {
        features.push('مقاوم للاستعمال اليومي', 'سهل التنظيف والصيانة', 'مواد عالية الجودة');
    }
    
    return features.slice(0, 7).map(feature => `<li>${feature}</li>`).join('\n                            ');
}

// معالجة بيانات المنتج للقالب
async function processProductTemplate(product, template, reviews) {
    const hasDiscount = product.price && product.sale_price && product.price > product.sale_price;
    const discountPercent = hasDiscount ? Math.round(((product.price - product.sale_price) / product.price) * 100) : 0;
    
    // إعداد المتغيرات
    const replacements = {
        'PRODUCT_ID': product.id,
        'PRODUCT_TITLE': product.title,
        'PRODUCT_DESCRIPTION': product.description.length > 160 ? 
            product.description.substring(0, 157) + '...' : product.description,
        'PRODUCT_PRICE': (product.sale_price || product.price).toFixed(3),
        'PRODUCT_SALE_PRICE': (product.sale_price || product.price).toFixed(3),
        'PRODUCT_IMAGE': product.image_link,
        'PRODUCT_SLUG': createSlug(product.title, product.id),
        'PRODUCT_KEYWORDS': generateSEOKeywords(product),
        'PRODUCT_FEATURES': generateProductFeatures(product),
        'WHATSAPP_PRODUCT_TITLE': encodeURIComponent(product.title),
        'REVIEWS_COUNT': reviews.length,
        
        // متغيرات الخصم
        'DISCOUNT_BADGE': hasDiscount ? 
            `<div class="discount-badge">-${discountPercent}% خصم خاص!</div>` : '',
        'ORIGINAL_PRICE_HTML': hasDiscount ? 
            `<div class="original-price">${product.price.toFixed(3)} د.ك</div>` : '',
        'SAVINGS_HTML': hasDiscount ? 
            `<div class="savings">✨ وفر ${(product.price - product.sale_price).toFixed(3)} د.ك!</div>` : '',
        
        // مراجعات HTML
        'REVIEWS_HTML': reviews.map(review => `
                <div class="review-item">
                    <div class="review-header">
                        <span class="reviewer-name">${review.name}</span>
                        <span class="review-date">${new Date(review.date).toLocaleDateString('ar-KW')}</span>
                    </div>
                    <div class="review-stars">${'⭐'.repeat(review.rating)}</div>
                    <div class="review-text">${review.text}</div>
                </div>`).join(''),
        
        // مراجعات JSON لـ Schema.org
        'REVIEWS_JSON': reviews.map(review => `
            {
                "@type": "Review",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "${review.rating}",
                    "bestRating": "5"
                },
                "author": {
                    "@type": "Person",
                    "name": "${review.name}"
                },
                "reviewBody": "${review.text.replace(/"/g, '\\\\"')}",
                "datePublished": "${review.date}"
            }`).join(',')
    };
    
    // استبدال جميع المتغيرات في القالب
    let processedTemplate = template;
    for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        processedTemplate = processedTemplate.replace(regex, value);
    }
    
    return processedTemplate;
}

// الدالة الرئيسية
async function generateAllProductPages() {
    try {
        console.log('🚀 بدء توليد صفحات المنتجات الاحترافية...');
        
        // تحميل القالب
        const templatePath = path.join(__dirname, 'product-template.html');
        const template = await fs.readFile(templatePath, 'utf8');
        
        // تحميل بيانات المنتجات
        const productsDataPath = path.join(__dirname, 'products_data.json');
        const productsData = JSON.parse(await fs.readFile(productsDataPath, 'utf8'));
        
        console.log(`✅ تم تحميل ${productsData.length} منتج`);
        
        // إنشاء مجلد صفحات المنتجات
        const outputDir = path.join(__dirname, 'products-pages');
        try {
            await fs.access(outputDir);
        } catch {
            await fs.mkdir(outputDir, { recursive: true });
            console.log('✅ تم إنشاء مجلد products-pages');
        }
        
        let generatedCount = 0;
        const totalProducts = productsData.length;
        
        // توليد صفحة لكل منتج
        for (const product of productsData) {
            try {
                // توليد مراجعات عشوائية
                const reviews = generateProductReviews(product.title, Math.floor(Math.random() * 8) + 15); // 15-22 مراجعة
                
                // معالجة القالب
                const processedPage = await processProductTemplate(product, template, reviews);
                
                // حفظ الملف
                const fileName = createSlug(product.title, product.id);
                const filePath = path.join(outputDir, fileName);
                await fs.writeFile(filePath, processedPage, 'utf8');
                
                generatedCount++;
                
                // عرض التقدم
                if (generatedCount % 50 === 0 || generatedCount === totalProducts) {
                    console.log(`⏳ تم توليد ${generatedCount}/${totalProducts} صفحة (${Math.round(generatedCount/totalProducts*100)}%)`);
                }
                
            } catch (error) {
                console.error(`❌ خطأ في توليد صفحة المنتج ${product.title}:`, error.message);
            }
        }
        
        console.log(`\n✅ تم الانتهاء بنجاح!`);
        console.log(`📊 تم توليد ${generatedCount} صفحة منتج احترافية`);
        console.log(`🇰🇼 محسّنة للسيو ومحركات البحث العربية`);
        console.log(`💱 محسّنة للجوال وGoogle Merchant Center`);
        console.log(`\n🔗 يمكنك الآن فتح الروابط من الكتالوج`);
        
        // إنشاء فهرس الملفات المولدة
        const indexContent = `# فهرس صفحات المنتجات \u0627\u0644\u0645\u0648\u0644\u064f\u062f\u0629

تم توليد ${generatedCount} صفحة منتج احترافية بتاريخ: ${new Date().toLocaleString('ar-KW')}

## ميزات الصفحات المولدة:
- ✅ تصميم مثل WooCommerce
- ✅ محسّنة لجوجل مرشنت سنتر
- ✅ Schema.org JSON-LD متكامل
- ✅ محسّنة للجوال (Mobile-First)
- ✅ هوية كويتية احترافية
- ✅ 15-22 مراجعة ايجابية لكل منتج
- ✅ كلمات بحث عربية محسّنة
- ✅ زر واتساب فوري لكل منتج

## طريقة الوصول:
يمكن الوصول للصفحات من خلال:
1. النقر على اي منتج في كتالوج المنتجات
2. فتح الرابط المباشر: https://sherow1982.github.io/sooq-alkuwait/products-pages/FILENAME

تم التوليد بتاريخ ${new Date().toISOString()}
`;
        
        await fs.writeFile(path.join(__dirname, 'PRODUCTS_PAGES_INDEX.md'), indexContent, 'utf8');
        console.log('✅ تم إنشاء فهرس الملفات');
        
    } catch (error) {
        console.error('❌ خطأ في توليد صفحات المنتجات:', error);
        process.exit(1);
    }
}

// تشغيل السكريپت
if (require.main === module) {
    generateAllProductPages();
}