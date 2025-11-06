const fs = require('fs');
const path = require('path');

// قراءة ملف البيانات
const productsData = JSON.parse(fs.readFileSync('./products_data.json', 'utf8'));

// دالة لتشفير النصوص العربية في URL
function encodeArabic(text) {
    return encodeURIComponent(text).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
}

// دالة لتوليد اسم الملف الآمن
function generateSafeFilename(productId, title) {
    const safeTitle = title
        .replace(/[^\u0600-\u06FF\s\w-]/g, '')  // السماح فقط بالحروف العربية والإنجليزية والأرقام
        .trim()
        .substring(0, 50)  // الحد من طول النص
        .replace(/\s+/g, '-');  // استبدال المسافات بشرطات
    
    return `product-${productId}-${encodeArabic(safeTitle)}.html`;
}

// قالب صفحة المنتج
function generateProductHTML(product) {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.title} - سوق الكويت</title>
    <meta name="description" content="${product.description}">
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content="${product.title} - سوق الكويت">
    <meta property="og:description" content="${product.description}">
    <meta property="og:image" content="${product.image_link}">
    <meta property="og:type" content="product">
    <meta property="og:price:amount" content="${product.sale_price}">
    <meta property="og:price:currency" content="KWD">
    
    <!-- Schema.org Product Markup -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "${product.title}",
        "image": "${product.image_link}",
        "description": "${product.description}",
        "offers": {
            "@type": "Offer",
            "price": "${product.sale_price}",
            "priceCurrency": "KWD",
            "availability": "https://schema.org/InStock"
        },
        "brand": {
            "@type": "Brand",
            "name": "سوق الكويت"
        }
    }
    </script>
    
    <!-- Styles -->
    <link rel="stylesheet" href="../../style.css">
    <style>
        .product-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            align-items: start;
        }
        
        .product-image {
            width: 100%;
            max-width: 500px;
            height: auto;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }
        
        .product-info {
            padding: 20px;
        }
        
        .product-title {
            font-size: 2.5rem;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 20px;
            line-height: 1.3;
        }
        
        .price-section {
            margin: 30px 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            color: white;
        }
        
        .original-price {
            font-size: 1.2rem;
            text-decoration: line-through;
            opacity: 0.8;
            margin-left: 15px;
        }
        
        .sale-price {
            font-size: 2.5rem;
            font-weight: bold;
        }
        
        .savings {
            font-size: 1.1rem;
            opacity: 0.9;
            margin-top: 8px;
        }
        
        .product-description {
            font-size: 1.2rem;
            line-height: 1.8;
            color: #555;
            margin: 30px 0;
        }
        
        .add-to-cart {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            border: none;
            padding: 20px 40px;
            font-size: 1.5rem;
            font-weight: bold;
            border-radius: 50px;
            cursor: pointer;
            transition: transform 0.3s ease;
            box-shadow: 0 6px 20px rgba(17, 153, 142, 0.4);
            width: 100%;
            margin: 20px 0;
        }
        
        .add-to-cart:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(17, 153, 142, 0.6);
        }
        
        .features {
            margin: 30px 0;
        }
        
        .feature-tag {
            display: inline-block;
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            padding: 8px 16px;
            margin: 5px;
            border-radius: 25px;
            font-weight: 500;
            color: #495057;
        }
        
        @media (max-width: 768px) {
            .product-container {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .product-title {
                font-size: 1.8rem;
            }
            
            .sale-price {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="../../index.html">🛒 سوق الكويت</a>
            </div>
            <ul class="nav-menu">
                <li><a href="../../index.html">الرئيسية</a></li>
                <li><a href="../../categories.html">التصنيفات</a></li>
                <li><a href="../../cart.html" id="cart-link">🛒 السلة <span id="cart-count">0</span></a></li>
            </ul>
        </div>
    </nav>

    <!-- Product Section -->
    <main>
        <div class="product-container">
            <div class="image-section">
                <img src="${product.image_link}" alt="${product.title}" class="product-image">
            </div>
            
            <div class="product-info">
                <h1 class="product-title">${product.title}</h1>
                
                <div class="price-section">
                    <div>
                        ${product.price > product.sale_price ? 
                            `<span class="original-price">${product.price} د.ك</span>` : 
                            ''}
                        <span class="sale-price">${product.sale_price} د.ك</span>
                    </div>
                    ${product.price > product.sale_price ? 
                        `<div class="savings">توفر ${(product.price - product.sale_price).toFixed(2)} د.ك</div>` : 
                        ''}
                </div>
                
                <div class="product-description">
                    <p>${product.description}</p>
                </div>
                
                <div class="features">
                    <span class="feature-tag">✅ ضمان الجودة</span>
                    <span class="feature-tag">🚚 توصيل سريع</span>
                    <span class="feature-tag">💰 أفضل سعر</span>
                    <span class="feature-tag">🇰🇼 متوفر في الكويت</span>
                </div>
                
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    🛒 إضافة إلى السلة
                </button>
                
                <div class="shipping-info">
                    <p>🚚 <strong>التوصيل:</strong> خلال 24-48 ساعة داخل الكويت</p>
                    <p>💳 <strong>الدفع:</strong> نقداً عند التسليم أو بطاقة ائتمان</p>
                    <p>↩️ <strong>الاستبدال:</strong> خلال 7 أيام من تاريخ التسليم</p>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer>
        <div class="footer-content">
            <p>&copy; 2024 سوق الكويت - جميع الحقوق محفوظة</p>
            <div class="footer-links">
                <a href="../../privacy.html">سياسة الخصوصية</a>
                <a href="../../terms.html">شروط الاستخدام</a>
                <a href="../../contact.html">اتصل بنا</a>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="../../script.js"></script>
    <script>
        // تحديث وظائف السلة للمنتج الحالي
        function addToCart(productId) {
            const product = {
                id: ${product.id},
                title: "${product.title}",
                price: ${product.sale_price},
                image: "${product.image_link}"
            };
            
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({...product, quantity: 1});
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // إشعار النجاح
            alert('✅ تم إضافة المنتج إلى السلة بنجاح!');
            
            // إعادة توجيه إلى صفحة السلة
            setTimeout(() => {
                window.location.href = '../../cart.html';
            }, 1000);
        }
        
        // تحديث عداد السلة
        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const cartCount = document.getElementById('cart-count');
            if (cartCount) {
                cartCount.textContent = totalItems;
            }
        }
        
        // تشغيل تحديث العداد عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', updateCartCount);
    </script>
</body>
</html>`;
}

// توليد صفحات المنتجات
function generateAllProducts() {
    const productsDir = './products-pages';
    
    // إنشاء مجلد المنتجات إذا لم يكن موجوداً
    if (!fs.existsSync(productsDir)) {
        fs.mkdirSync(productsDir, { recursive: true });
    }
    
    console.log(`🚀 بدء توليد ${productsData.length} صفحة منتج...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    productsData.forEach((product, index) => {
        try {
            const filename = generateSafeFilename(product.id, product.title);
            const filepath = path.join(productsDir, filename);
            const html = generateProductHTML(product);
            
            fs.writeFileSync(filepath, html, 'utf8');
            
            successCount++;
            
            // طباعة التقدم كل 100 منتج
            if ((index + 1) % 100 === 0 || index === productsData.length - 1) {
                console.log(`✅ تم توليد ${index + 1}/${productsData.length} صفحة`);
            }
            
        } catch (error) {
            console.error(`❌ خطأ في المنتج ${product.id}: ${error.message}`);
            errorCount++;
        }
    });
    
    console.log(`\n📊 تقرير النتائج:`);
    console.log(`✅ نجح: ${successCount} صفحة`);
    console.log(`❌ فشل: ${errorCount} صفحة`);
    console.log(`📁 المجلد: ${productsDir}`);
    
    return { successCount, errorCount, totalCount: productsData.length };
}

// توليد ملف sitemap.xml
function generateSitemap() {
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://sooq-alkuwait.arabsad.com/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
`;

    productsData.forEach(product => {
        const filename = generateSafeFilename(product.id, product.title);
        sitemap += `    <url>
        <loc>https://sooq-alkuwait.arabsad.com/products-pages/${filename}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
`;
    });

    sitemap += '</urlset>';
    
    fs.writeFileSync('./sitemap.xml', sitemap, 'utf8');
    console.log('✅ تم توليد sitemap.xml');
}

// توليد ملف feed للمنتجات (Google Merchant)
function generateProductFeed() {
    let feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
    <title>سوق الكويت - منتجات عالية الجودة</title>
    <link>https://sooq-alkuwait.arabsad.com</link>
    <description>أفضل المنتجات بأسعار مناسبة في الكويت</description>
`;

    productsData.forEach(product => {
        const filename = generateSafeFilename(product.id, product.title);
        const productUrl = `https://sooq-alkuwait.arabsad.com/products-pages/${filename}`;
        
        feed += `    <item>
        <g:id>${product.id}</g:id>
        <g:title><![CDATA[${product.title}]]></g:title>
        <g:description><![CDATA[${product.description}]]></g:description>
        <g:link>${productUrl}</g:link>
        <g:image_link>${product.image_link}</g:image_link>
        <g:availability>in_stock</g:availability>
        <g:price>${product.sale_price} KWD</g:price>
        ${product.price > product.sale_price ? 
            `<g:sale_price>${product.sale_price} KWD</g:sale_price>` : ''}
        <g:brand>سوق الكويت</g:brand>
        <g:condition>new</g:condition>
        <g:shipping>
            <g:country>KW</g:country>
            <g:service>Standard</g:service>
            <g:price>0 KWD</g:price>
        </g:shipping>
    </item>
`;
    });

    feed += `</channel>
</rss>`;
    
    fs.writeFileSync('./product-feed.xml', feed, 'utf8');
    console.log('✅ تم توليد product-feed.xml');
}

// تشغيل العملية الكاملة
async function main() {
    console.log('🌟 مولد صفحات المنتجات - سوق الكويت');
    console.log('='.repeat(50));
    
    try {
        // توليد صفحات المنتجات
        const results = generateAllProducts();
        
        // توليد خريطة الموقع
        generateSitemap();
        
        // توليد فيد المنتجات
        generateProductFeed();
        
        console.log('\n🎉 اكتملت العملية بنجاح!');
        console.log(`📄 ${results.successCount} صفحة منتج`);
        console.log(`🗺️ 1 خريطة موقع`);
        console.log(`📡 1 فيد منتجات`);
        
        return results;
        
    } catch (error) {
        console.error('❌ حدث خطأ:', error);
        return null;
    }
}

// تشغيل السكريپت إذا تم استدعاؤه مباشرة
if (require.main === module) {
    main();
}

module.exports = { generateAllProducts, generateSitemap, generateProductFeed, main };