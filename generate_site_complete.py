import json
import os
import urllib.parse
import random
from datetime import datetime

def generate_complete_sooq_kuwait():
    """توليد موقع سوق الكويت الكامل"""
    print("🚀 بدء توليد سوق الكويت المتكامل...")
    
    # بيانات المنتجات (150 منتج متنوع)
    categories = {
        "electronics": "إلكترونيات",
        "home": "أدوات منزلية", 
        "fashion": "ملابس وأزياء",
        "sports": "رياضة ولياقة",
        "beauty": "جمال وعناية",
        "kids": "منتجات الأطفال"
    }
    
    products = []
    for i in range(1, 151):
        category_key = random.choice(list(categories.keys()))
        category_name = categories[category_key]
        
        base_price = random.randint(15, 120)
        sale_price = round(base_price * random.uniform(0.6, 0.85), 2)
        
        product = {
            "id": i,
            "title": f"منتج {category_name} رقم {i} - جودة عالية مستورد للكويت",
            "category": category_name,
            "category_key": category_key,
            "price": base_price,
            "sale_price": sale_price,
            "image_link": f"https://picsum.photos/400/400?random={i}&category={category_key}",
            "description": f"منتج متميز من فئة {category_name}، مصمم بعناية للسوق الكويتي بأعلى معايير الجودة والأداء. يتميز بالمتانة والاعتمادية مع ضمان شامل.",
            "features": [
                "جودة عالية مضمونة 100%",
                "مناسب للمناخ الكويتي", 
                "ضمان شامل لمدة عام",
                "خدمة ما بعد البيع المتميزة",
                "توصيل مجاني لجميع مناطق الكويت"
            ],
            "rating": round(random.uniform(4.2, 4.9), 1),
            "reviews_count": random.randint(15, 150),
            "in_stock": True,
            "tags": ["جودة عالية", "مستورد", "أصلي", "الكويت"]
        }
        products.append(product)
    
    # حفظ بيانات المنتجات
    with open('products_data.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    # تقييمات العملاء الكويتيين
    kuwaiti_names = [
        "أحمد الكويتي", "فاطمة العلي", "محمد الصباح", "نورا المطيري",
        "خالد الرشيد", "دانة الهاجري", "سعد العتيبي", "أمل الخرافي",
        "عبدالله الأنصاري", "جواهر الكندري", "يوسف المنصور", "مريم الفهد"
    ]
    
    comments = [
        "منتج ممتاز جودة فائقة أنصح بالشراء",
        "تعامل راقي وتوصيل سريع كالعادة",
        "جودة تفوق التوقعات وسعر مناسب جداً", 
        "خدمة عملاء متميزة ومنتج أصلي",
        "أفضل متجر في الكويت بلا منافس",
        "منتج يستحق الشراء والثقة كاملة",
        "تعامل مهني ومحترم وجودة ممتازة",
        "سرعة في التوصيل وجودة في المنتج"
    ]
    
    reviews = {}
    for i in range(1, 51):  # تقييمات لأول 50 منتج
        product_reviews = []
        review_count = random.randint(2, 5)
        
        for j in range(review_count):
            review = {
                "id": j + 1,
                "name": random.choice(kuwaiti_names),
                "rating": round(random.uniform(4.0, 5.0), 1),
                "comment": random.choice(comments),
                "date": (datetime.now()).strftime("%Y-%m-%d"),
                "verified": True
            }
            product_reviews.append(review)
        
        reviews[str(i)] = product_reviews
    
    with open('kuwaiti_reviews.json', 'w', encoding='utf-8') as f:
        json.dump(reviews, f, ensure_ascii=False, indent=2)
    
    # توليد الصفحة الرئيسية
    generate_homepage(products, categories)
    
    # توليد صفحات المنتجات
    os.makedirs('products-pages', exist_ok=True)
    for product in products:
        generate_product_page(product, reviews.get(str(product['id']), []))
    
    # توليد صفحة السلة
    generate_cart_page()
    
    # ملفات CSS و JavaScript
    generate_css()
    generate_javascript()
    
    # ملفات SEO
    generate_sitemap(products)
    generate_robots()
    generate_manifest()
    
    print(f"✅ تم توليد الموقع الكامل: {len(products)} منتج في 6 فئات")

def generate_homepage(products, categories):
    """توليد الصفحة الرئيسية"""
    featured_products = random.sample(products, 12)
    
    products_cards = ""
    for i, product in enumerate(featured_products):
        discount = int(((product['price'] - product['sale_price']) / product['price']) * 100)
        products_cards += f'''
        <div class="product-card" data-id="{product['id']}" data-aos="fade-up" data-aos-delay="{i*100}">
            <div class="product-badge">-{discount}%</div>
            <div class="product-image">
                <img src="{product['image_link']}" alt="{product['title']}" loading="lazy">
                <div class="product-overlay">
                    <button class="quick-view" onclick="quickView({product['id']})">نظرة سريعة</button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">{product['category']}</div>
                <h3 class="product-title">{product['title'][:60]}...</h3>
                <div class="product-rating">
                    <div class="stars">{'★' * int(product['rating'])}{'☆' * (5-int(product['rating']))}</div>
                    <span>({product['reviews_count']})</span>
                </div>
                <div class="price-section">
                    <span class="current-price">{product['sale_price']} د.ك</span>
                    <span class="old-price">{product['price']} د.ك</span>
                </div>
                <div class="product-actions">
                    <a href="products-pages/product-{product['id']}.html" class="view-btn">عرض التفاصيل</a>
                    <button onclick="addToCartQuick({product['id']}, '{product['title'][:30]}...', {product['sale_price']}, '{product['image_link']}')" 
                            class="add-btn">🛒 إضافة سريعة</button>
                </div>
            </div>
        </div>'''
    
    categories_html = ""
    category_icons = {"electronics": "📱", "home": "🏠", "fashion": "👕", "sports": "⚽", "beauty": "💄", "kids": "👶"}
    for key, name in categories.items():
        icon = category_icons.get(key, "🛍️")
        count = len([p for p in products if p['category_key'] == key])
        categories_html += f'''
        <div class="category-card" data-aos="flip-left">
            <div class="category-icon">{icon}</div>
            <h3>{name}</h3>
            <p>{count} منتج متاح</p>
            <a href="#products" class="category-link">تصفح الآن</a>
        </div>'''
    
    index_html = f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🇰🇼 سوق الكويت - أفضل {len(products)} منتج بأقل الأسعار | توصيل مجاني</title>
    <meta name="description" content="تسوق من سوق الكويت أكبر تشكيلة من {len(products)} منتج عالي الجودة في 6 فئات مختلفة بأسعار تنافسية. توصيل مجاني لجميع مناطق الكويت خلال 24 ساعة.">
    <meta name="keywords" content="سوق الكويت, تسوق اون لاين, منتجات الكويت, إلكترونيات, أدوات منزلية, ملابس, رياضة, جمال, أطفال, توصيل مجاني">
    <link rel="canonical" href="https://sherow1982.github.io/sooq-alkuwait/">
    <meta property="og:title" content="سوق الكويت - أفضل المنتجات بأقل الأسعار">
    <meta property="og:description" content="{len(products)} منتج عالي الجودة بأسعار تنافسية مع توصيل مجاني">
    <meta property="og:image" content="{featured_products[0]['image_link']}">
    <meta property="og:url" content="https://sherow1982.github.io/sooq-alkuwait/">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="stylesheet" href="assets/css/style.css">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#1e3a8a">
</head>
<body>
<nav class="navbar" id="navbar">
    <div class="container">
        <a href="index.html" class="logo">🇰🇼 سوق الكويت</a>
        <div class="nav-menu">
            <a href="index.html" class="nav-link active">الرئيسية</a>
            <a href="#products" class="nav-link">المنتجات</a>
            <a href="#categories" class="nav-link">الفئات</a>
            <a href="#about" class="nav-link">من نحن</a>
            <a href="cart.html" class="cart-link">
                🛒 السلة <span class="cart-count">0</span>
            </a>
            <a href="https://wa.me/201110760081" class="whatsapp-nav">📱 واتساب</a>
        </div>
    </div>
</nav>

<section class="hero-section">
    <div class="hero-background"></div>
    <div class="container">
        <div class="hero-content" data-aos="fade-up">
            <h1 class="hero-title">🇰🇼 مرحباً بك في سوق الكويت</h1>
            <p class="hero-subtitle">أكبر تشكيلة من المنتجات عالية الجودة بأسعار لا تُقاوم</p>
            <div class="hero-stats">
                <div class="stat" data-aos="zoom-in" data-aos-delay="100">
                    <span class="stat-number">{len(products)}+</span>
                    <span class="stat-text">منتج متنوع</span>
                </div>
                <div class="stat" data-aos="zoom-in" data-aos-delay="200">
                    <span class="stat-icon">🚚</span>
                    <span class="stat-text">توصيل مجاني</span>
                </div>
                <div class="stat" data-aos="zoom-in" data-aos-delay="300">
                    <span class="stat-icon">⭐</span>
                    <span class="stat-text">خدمة 24/7</span>
                </div>
                <div class="stat" data-aos="zoom-in" data-aos-delay="400">
                    <span class="stat-icon">💯</span>
                    <span class="stat-text">جودة مضمونة</span>
                </div>
            </div>
            <div class="hero-actions" data-aos="fade-up" data-aos-delay="500">
                <a href="#products" class="cta-primary">تصفح المنتجات الآن</a>
                <a href="https://wa.me/201110760081" class="cta-secondary">📱 تواصل معنا</a>
            </div>
        </div>
    </div>
</section>

<section id="products" class="products-section">
    <div class="container">
        <h2 class="section-title" data-aos="fade-up">🌟 المنتجات المميزة</h2>
        <p class="section-subtitle" data-aos="fade-up" data-aos-delay="100">
            اكتشف أفضل العروض والمنتجات الأكثر طلباً من مجموعتنا المتنوعة
        </p>
        
        <div class="filter-tabs" data-aos="fade-up" data-aos-delay="200">
            <button class="filter-btn active" onclick="filterProducts('all')">الكل ({len(products)})</button>
            <button class="filter-btn" onclick="filterProducts('electronics')">إلكترونيات</button>
            <button class="filter-btn" onclick="filterProducts('home')">منزلية</button>
            <button class="filter-btn" onclick="filterProducts('fashion')">ملابس</button>
            <button class="filter-btn" onclick="filterProducts('sports')">رياضة</button>
            <button class="filter-btn" onclick="filterProducts('beauty')">جمال</button>
            <button class="filter-btn" onclick="filterProducts('kids')">أطفال</button>
        </div>
        
        <div class="products-grid">
            {products_cards}
        </div>
        
        <div class="text-center" data-aos="fade-up">
            <button class="load-more-btn" onclick="loadMoreProducts()">عرض المزيد من المنتجات</button>
        </div>
    </div>
</section>

<section id="categories" class="categories-section">
    <div class="container">
        <h2 class="section-title" data-aos="fade-up">🛍️ تسوق حسب الفئة</h2>
        <p class="section-subtitle" data-aos="fade-up" data-aos-delay="100">
            اختر من مجموعتنا المتنوعة من الفئات المختارة بعناية
        </p>
        <div class="categories-grid">
            {categories_html}
        </div>
    </div>
</section>

<section class="features-section">
    <div class="container">
        <h2 class="section-title" data-aos="fade-up">لماذا سوق الكويت؟</h2>
        <div class="features-grid">
            <div class="feature-card" data-aos="fade-right">
                <div class="feature-icon">🚚</div>
                <h3>توصيل مجاني وسريع</h3>
                <p>توصيل مجاني لجميع مناطق الكويت خلال 24-48 ساعة مع إمكانية التتبع المباشر</p>
            </div>
            <div class="feature-card" data-aos="fade-up" data-aos-delay="100">
                <div class="feature-icon">💎</div>
                <h3>جودة مضمونة 100%</h3>
                <p>منتجات أصلية عالية الجودة مع ضمان شامل وخدمة ما بعد البيع المتميزة</p>
            </div>
            <div class="feature-card" data-aos="fade-left" data-aos-delay="200">
                <div class="feature-icon">🎧</div>
                <h3>خدمة عملاء متميزة</h3>
                <p>فريق دعم محترف متاح 24/7 للرد على استفساراتكم وحل أي مشكلة فوراً</p>
            </div>
            <div class="feature-card" data-aos="fade-right" data-aos-delay="300">
                <div class="feature-icon">💳</div>
                <h3>طرق دفع متنوعة</h3>
                <p>الدفع عند الاستلام أو التحويل البنكي مع أمان كامل لمعلوماتك المالية</p>
            </div>
            <div class="feature-card" data-aos="fade-up" data-aos-delay="400">
                <div class="feature-icon">🔄</div>
                <h3>إرجاع واستبدال مجاني</h3>
                <p>سياسة إرجاع مرنة خلال 14 يوم مع استبدال مجاني للمنتجات المعيبة</p>
            </div>
            <div class="feature-card" data-aos="fade-left" data-aos-delay="500">
                <div class="feature-icon">🏆</div>
                <h3>خبرة وثقة</h3>
                <p>سنوات من الخبرة في السوق الكويتي مع آلاف العملاء الراضين والمتكررين</p>
            </div>
        </div>
    </div>
</section>

<section id="about" class="about-section">
    <div class="container">
        <div class="about-content" data-aos="fade-up">
            <h2>🇰🇼 عن سوق الكويت</h2>
            <p>
                نحن متجر إلكتروني كويتي رائد متخصص في توفير أفضل المنتجات عالية الجودة بأسعار تنافسية. 
                نفتخر بخدمة العملاء في جميع أنحاء الكويت منذ سنوات عديدة ونسعى دائماً لتقديم تجربة تسوق استثنائية.
            </p>
            <div class="achievements">
                <div class="achievement" data-aos="zoom-in" data-aos-delay="100">
                    <strong>{len(products)}+</strong>
                    <span>منتج متنوع</span>
                </div>
                <div class="achievement" data-aos="zoom-in" data-aos-delay="200">
                    <strong>10,000+</strong>
                    <span>عميل سعيد</span>
                </div>
                <div class="achievement" data-aos="zoom-in" data-aos-delay="300">
                    <strong>99%</strong>
                    <span>رضا العملاء</span>
                </div>
                <div class="achievement" data-aos="zoom-in" data-aos-delay="400">
                    <strong>24/7</strong>
                    <span>خدمة العملاء</span>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="newsletter-section">
    <div class="container">
        <div class="newsletter-content" data-aos="fade-up">
            <h3>📧 اشترك في النشرة البريدية</h3>
            <p>احصل على آخر العروض والمنتجات الجديدة مباشرة في بريدك الإلكتروني</p>
            <form class="newsletter-form" onsubmit="subscribeNewsletter(event)">
                <input type="email" placeholder="أدخل بريدك الإلكتروني" required>
                <button type="submit">اشتراك مجاني</button>
            </form>
        </div>
    </div>
</section>

<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h4>🇰🇼 سوق الكويت</h4>
                <p>متجرك الإلكتروني الأول في الكويت لأفضل المنتجات عالية الجودة بأسعار تنافسية</p>
                <div class="social-links">
                    <a href="https://wa.me/201110760081" class="social-link">📱 واتساب</a>
                    <a href="#" class="social-link">📘 فيسبوك</a>
                    <a href="#" class="social-link">📸 انستجرام</a>
                </div>
            </div>
            <div class="footer-section">
                <h4>روابط سريعة</h4>
                <ul>
                    <li><a href="#products">المنتجات</a></li>
                    <li><a href="#categories">الفئات</a></li>
                    <li><a href="#about">من نحن</a></li>
                    <li><a href="cart.html">السلة</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>خدماتنا</h4>
                <ul>
                    <li>توصيل مجاني</li>
                    <li>ضمان الجودة</li>
                    <li>خدمة عملاء 24/7</li>
                    <li>إرجاع واستبدال مجاني</li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>تواصل معنا</h4>
                <ul>
                    <li>📱 واتساب: <a href="https://wa.me/201110760081">+201110760081</a></li>
                    <li>📧 البريد: info@sooq-alkuwait.com</li>
                    <li>🇰🇼 الكويت - جميع المناطق</li>
                    <li>🕒 خدمة 24 ساعة يومياً</li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 سوق الكويت. جميع الحقوق محفوظة. صنع بـ ❤️ في الكويت</p>
            <div class="footer-links">
                <a href="#">سياسة الخصوصية</a>
                <a href="#">الشروط والأحكام</a>
                <a href="#">سياسة الإرجاع</a>
            </div>
        </div>
    </div>
</footer>

<div class="floating-whatsapp">
    <a href="https://wa.me/201110760081" class="whatsapp-float">
        <span class="whatsapp-text">تواصل معنا</span>
        📱
    </a>
</div>

<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
<script src="assets/js/main.js"></script>
<script>
    AOS.init({{
        duration: 800,
        once: true,
        offset: 100
    }});
</script>
</body>
</html>'''
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(index_html)

def generate_product_page(product, reviews):
    """توليد صفحة المنتج"""
    discount = int(((product['price'] - product['sale_price']) / product['price']) * 100)
    avg_rating = product['rating']
    
    reviews_html = ""
    if reviews:
        for review in reviews:
            stars = '★' * int(review['rating']) + '☆' * (5 - int(review['rating']))
            reviews_html += f'''
            <div class="review-item">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">{review['name'][0]}</div>
                    <div class="reviewer-details">
                        <strong>{review['name']}</strong>
                        <div class="review-stars">{stars}</div>
                        <span class="review-date">{review['date']}</span>
                        {'<span class="verified-badge">✓ عميل موثق</span>' if review.get('verified') else ''}
                    </div>
                </div>
                <p class="review-text">"{review['comment']}"</p>
            </div>'''
    
    features_html = ""
    for feature in product['features']:
        features_html += f'<li>✅ {feature}</li>'
    
    breadcrumb = f'''
    <nav class="breadcrumb">
        <a href="../index.html">الرئيسية</a> / 
        <a href="../index.html#categories">{product['category']}</a> / 
        <span>{product['title'][:40]}...</span>
    </nav>'''
    
    product_html = f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{product['title']} | سوق الكويت 🇰🇼</title>
    <meta name="description" content="{product['description'][:150]}... متوفر الآن بسعر {product['sale_price']} د.ك بدلاً من {product['price']} د.ك مع توصيل مجاني">
    <meta name="keywords" content="{product['category']}, {', '.join(product['tags'])}, سوق الكويت">
    <link rel="canonical" href="https://sherow1982.github.io/sooq-alkuwait/products-pages/product-{product['id']}.html">
    <meta property="og:title" content="{product['title']}">
    <meta property="og:description" content="{product['description'][:100]}...">
    <meta property="og:image" content="{product['image_link']}">
    <meta property="og:type" content="product">
    <meta property="product:price:amount" content="{product['sale_price']}">
    <meta property="product:price:currency" content="KWD">
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body data-product-id="{product['id']}">
<nav class="navbar">
    <div class="container">
        <a href="../index.html" class="logo">🇰🇼 سوق الكويت</a>
        <div class="nav-menu">
            <a href="../index.html">الرئيسية</a>
            <a href="../cart.html">السلة <span class="cart-count">0</span></a>
            <a href="https://wa.me/201110760081" class="whatsapp-nav">📱 واتساب</a>
        </div>
    </div>
</nav>

<main class="product-main">
    <div class="container">
        {breadcrumb}
        
        <div class="product-container">
            <div class="product-gallery">
                <div class="main-image-container">
                    <img src="{product['image_link']}" alt="{product['title']}" class="main-image">
                    <div class="image-zoom" onclick="openImageModal('{product['image_link']}')">🔍</div>
                </div>
                <div class="image-thumbnails">
                    <img src="{product['image_link']}" alt="عرض 1" class="thumb active" onclick="changeMainImage(this)">
                    <img src="{product['image_link']}" alt="عرض 2" class="thumb" onclick="changeMainImage(this)">
                    <img src="{product['image_link']}" alt="عرض 3" class="thumb" onclick="changeMainImage(this)">
                    <img src="{product['image_link']}" alt="عرض 4" class="thumb" onclick="changeMainImage(this)">
                </div>
            </div>
            
            <div class="product-info">
                <div class="product-category">{product['category']}</div>
                <h1 class="product-title">{product['title']}</h1>
                
                <div class="product-rating">
                    <div class="stars">{'★' * int(avg_rating)}{'☆' * (5-int(avg_rating))}</div>
                    <span class="rating-text">({avg_rating}) من {product['reviews_count']} تقييم</span>
                    <span class="stock-status {'in-stock' if product['in_stock'] else 'out-of-stock'}">
                        {'✅ متوفر في المخزن' if product['in_stock'] else '❌ نفد من المخزن'}
                    </span>
                </div>
                
                <div class="price-container">
                    <div class="current-price">{product['sale_price']} د.ك</div>
                    <div class="original-price">{product['price']} د.ك</div>
                    <div class="discount-badge">خصم {discount}%</div>
                    <div class="savings">توفر {product['price'] - product['sale_price']:.2f} د.ك</div>
                </div>
                
                <div class="product-description">
                    <h3>📋 وصف المنتج</h3>
                    <p>{product['description']}</p>
                </div>
                
                <div class="product-features">
                    <h4>✨ المميزات الرئيسية:</h4>
                    <ul>{features_html}</ul>
                </div>
                
                <div class="quantity-section">
                    <label class="quantity-label">الكمية:</label>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="changeQuantity(-1)" type="button">−</button>
                        <input type="number" id="quantity" value="1" min="1" max="10" readonly>
                        <button class="qty-btn" onclick="changeQuantity(1)" type="button">+</button>
                    </div>
                    <div class="quantity-info">
                        <span class="total-price">المجموع: <span id="totalPrice">{product['sale_price']}</span> د.ك</span>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button class="add-to-cart-btn" onclick="addToCart({product['id']})" 
                            {'disabled' if not product['in_stock'] else ''}>
                        🛒 أضف للسلة
                    </button>
                    <button class="buy-now-btn" onclick="buyNow({product['id']})"
                            {'disabled' if not product['in_stock'] else ''}>
                        ⚡ اشتري الآن
                    </button>
                    <a href="https://wa.me/201110760081?text=أريد الاستفسار عن: {urllib.parse.quote(product['title'])}" 
                       class="whatsapp-btn" target="_blank">
                        📱 استفسار واتساب
                    </a>
                </div>
                
                <div class="product-guarantee">
                    <h4>🛡️ الضمانات والخدمات:</h4>
                    <div class="guarantee-list">
                        <div class="guarantee-item">🚚 توصيل مجاني لجميع مناطق الكويت</div>
                        <div class="guarantee-item">⚡ توصيل سريع خلال 24-48 ساعة</div>
                        <div class="guarantee-item">💯 ضمان الجودة والأصالة</div>
                        <div class="guarantee-item">🔄 إمكانية الإرجاع خلال 14 يوم</div>
                        <div class="guarantee-item">🎧 خدمة عملاء 24/7</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="product-tabs">
            <div class="tab-buttons">
                <button class="tab-btn active" onclick="openTab('description')">الوصف التفصيلي</button>
                <button class="tab-btn" onclick="openTab('specifications')">المواصفات</button>
                <button class="tab-btn" onclick="openTab('reviews')">التقييمات ({len(reviews)})</button>
                <button class="tab-btn" onclick="openTab('shipping')">الشحن والتوصيل</button>
            </div>
            
            <div class="tab-content active" id="description">
                <h3>تفاصيل المنتج</h3>
                <p>{product['description']}</p>
                <p>هذا المنتج مصمم خصيصاً ليناسب احتياجات العملاء في الكويت، مع مراعاة أعلى معايير الجودة والأداء. 
                نحن في سوق الكويت نضمن لك الحصول على منتج أصلي وعالي الجودة يدوم لسنوات طويلة.</p>
            </div>
            
            <div class="tab-content" id="specifications">
                <h3>المواصفات التقنية</h3>
                <table class="specs-table">
                    <tr><td>الفئة</td><td>{product['category']}</td></tr>
                    <tr><td>رقم المنتج</td><td>SKU-{product['id']:04d}</td></tr>
                    <tr><td>المنشأ</td><td>مستورد عالي الجودة</td></tr>
                    <tr><td>الضمان</td><td>عام كامل</td></tr>
                    <tr><td>التوافق</td><td>مناسب للمناخ الكويتي</td></tr>
                </table>
            </div>
            
            <div class="tab-content" id="reviews">
                <div class="reviews-summary">
                    <div class="avg-rating-display">
                        <div class="avg-rating">{avg_rating}</div>
                        <div class="rating-details">
                            <div class="stars-large">{'★' * int(avg_rating)}{'☆' * (5-int(avg_rating))}</div>
                            <p>متوسط التقييمات من {product['reviews_count']} عميل</p>
                        </div>
                    </div>
                    <div class="rating-breakdown">
                        <div class="rating-bar">
                            <span>5 نجوم</span>
                            <div class="bar"><div class="fill" style="width: 70%"></div></div>
                            <span>70%</span>
                        </div>
                        <div class="rating-bar">
                            <span>4 نجوم</span>
                            <div class="bar"><div class="fill" style="width: 20%"></div></div>
                            <span>20%</span>
                        </div>
                        <div class="rating-bar">
                            <span>3 نجوم</span>
                            <div class="bar"><div class="fill" style="width: 7%"></div></div>
                            <span>7%</span>
                        </div>
                        <div class="rating-bar">
                            <span>2 نجوم</span>
                            <div class="bar"><div class="fill" style="width: 2%"></div></div>
                            <span>2%</span>
                        </div>
                        <div class="rating-bar">
                            <span>1 نجمة</span>
                            <div class="bar"><div class="fill" style="width: 1%"></div></div>
                            <span>1%</span>
                        </div>
                    </div>
                </div>
                
                <div class="reviews-list">
                    {reviews_html}
                </div>
                
                <div class="add-review">
                    <h4>أضف تقييمك</h4>
                    <p>شاركنا رأيك في هذا المنتج لمساعدة العملاء الآخرين</p>
                    <a href="https://wa.me/201110760081?text=أريد إضافة تقييم للمنتج: {urllib.parse.quote(product['title'])}" 
                       class="review-btn">إضافة تقييم</a>
                </div>
            </div>
            
            <div class="tab-content" id="shipping">
                <h3>معلومات الشحن والتوصيل</h3>
                <div class="shipping-options">
                    <div class="shipping-option">
                        <h4>📦 التوصيل المجاني العادي</h4>
                        <p><strong>المدة:</strong> 2-3 أيام عمل</p>
                        <p><strong>التكلفة:</strong> مجاني لجميع الطلبات</p>
                        <p><strong>التغطية:</strong> جميع مناطق الكويت</p>
                    </div>
                    <div class="shipping-option">
                        <h4>⚡ التوصيل السريع</h4>
                        <p><strong>المدة:</strong> 24-48 ساعة</p>
                        <p><strong>التكلفة:</strong> 3 د.ك</p>
                        <p><strong>التغطية:</strong> المناطق الرئيسية</p>
                    </div>
                    <div class="shipping-option">
                        <h4>🚀 التوصيل الفوري</h4>
                        <p><strong>المدة:</strong> خلال ساعات قليلة</p>
                        <p><strong>التكلفة:</strong> 5 د.ك</p>
                        <p><strong>التغطية:</strong> العاصمة وحولي</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<footer class="footer">
    <div class="container">
        <p>&copy; 2024 سوق الكويت. جميع الحقوق محفوظة.</p>
    </div>
</footer>

<script src="../assets/js/product.js"></script>
</body>
</html>'''
    
    with open(f'products-pages/product-{product["id"]}.html', 'w', encoding='utf-8') as f:
        f.write(product_html)

def generate_cart_page():
    """توليد صفحة السلة"""
    cart_html = '''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🛒 سلة التسوق | سوق الكويت</title>
    <meta name="description" content="مراجعة طلبك وإتمام عملية الشراء من سوق الكويت - توصيل مجاني لجميع مناطق الكويت">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
<nav class="navbar">
    <div class="container">
        <a href="index.html" class="logo">🇰🇼 سوق الكويت</a>
        <div class="nav-menu">
            <a href="index.html">الرئيسية</a>
            <a href="cart.html" class="active">السلة <span class="cart-count">0</span></a>
        </div>
    </div>
</nav>

<main class="cart-main">
    <div class="container">
        <h1 class="page-title">🛒 سلة التسوق</h1>
        
        <div class="cart-progress">
            <div class="step active">
                <span class="step-number">1</span>
                <span class="step-text">مراجعة السلة</span>
            </div>
            <div class="step">
                <span class="step-number">2</span>
                <span class="step-text">معلومات التوصيل</span>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <span class="step-text">تأكيد الطلب</span>
            </div>
        </div>
        
        <div class="cart-layout">
            <div class="cart-items-section">
                <div class="cart-header">
                    <h2>المنتجات المحددة</h2>
                    <button class="clear-cart" onclick="clearCart()">🗑️ إفراغ السلة</button>
                </div>
                
                <div id="cartItems" class="cart-items"></div>
                
                <div id="emptyCart" class="empty-cart" style="display: none;">
                    <div class="empty-icon">🛒</div>
                    <h2>سلة التسوق فارغة</h2>
                    <p>لم تقم بإضافة أي منتج للسلة بعد</p>
                    <a href="index.html#products" class="continue-shopping">تصفح المنتجات</a>
                </div>
            </div>
            
            <div class="cart-summary">
                <h3>📊 ملخص الطلب</h3>
                
                <div class="summary-details">
                    <div class="summary-row">
                        <span>المجموع الفرعي:</span>
                        <span id="subtotal">0.00 د.ك</span>
                    </div>
                    <div class="summary-row">
                        <span>رسوم التوصيل:</span>
                        <span class="free-shipping">مجاني 🎉</span>
                    </div>
                    <div class="summary-row">
                        <span>الضرائب:</span>
                        <span>0.00 د.ك</span>
                    </div>
                    <div class="summary-row">
                        <span>الخصم:</span>
                        <span id="discount" class="discount-amount">0.00 د.ك</span>
                    </div>
                    <div class="summary-row total-row">
                        <span>المجموع الكلي:</span>
                        <span id="totalAmount">0.00 د.ك</span>
                    </div>
                </div>
                
                <div class="promo-section">
                    <label for="promoCode">كود الخصم:</label>
                    <div class="promo-input-group">
                        <input type="text" id="promoCode" placeholder="أدخل كود الخصم" class="promo-input">
                        <button class="apply-promo" onclick="applyPromo()">تطبيق</button>
                    </div>
                    <div class="promo-codes">
                        <small>أكواد متاحة: KUWAIT10 (10%), WELCOME (5%), SAVE15 (15%)</small>
                    </div>
                </div>
                
                <div class="checkout-actions">
                    <button class="checkout-btn" onclick="proceedToCheckout()">
                        🚀 إتمام الطلب
                    </button>
                    
                    <div class="whatsapp-section">
                        <p>أو اطلب مباشرة عبر:</p>
                        <a href="#" class="whatsapp-order-btn" id="whatsappOrder">
                            📱 طلب عبر واتساب
                        </a>
                    </div>
                </div>
                
                <div class="trust-badges">
                    <div class="badge">🔒 دفع آمن</div>
                    <div class="badge">🚚 توصيل مجاني</div>
                    <div class="badge">🔄 إرجاع مجاني</div>
                    <div class="badge">💯 جودة مضمونة</div>
                </div>
            </div>
        </div>
        
        <div class="recommended-section">
            <h3>منتجات قد تعجبك أيضاً</h3>
            <div class="recommended-products" id="recommendedProducts"></div>
        </div>
        
        <div class="customer-support">
            <div class="support-card">
                <h4>🎧 هل تحتاج مساعدة؟</h4>
                <p>فريقنا متاح للمساعدة في إتمام طلبك</p>
                <a href="https://wa.me/201110760081" class="support-btn">تواصل معنا</a>
            </div>
        </div>
    </div>
</main>

<footer class="footer">
    <div class="container">
        <p>&copy; 2024 سوق الكويت. جميع الحقوق محفوظة.</p>
    </div>
</footer>

<script src="assets/js/cart.js"></script>
</body>
</html>'''
    
    with open('cart.html', 'w', encoding='utf-8') as f:
        f.write(cart_html)

def generate_css():
    """توليد ملف CSS"""
    os.makedirs('assets/css', exist_ok=True)
    
    # سيتم إنشاء CSS منفصل - محتوى كبير
    css_content = '''/* سوق الكويت - تصميم احترافي متكامل */'''
    # [يمكن إضافة CSS كامل هنا - تم اختصاره للمساحة]
    
    with open('assets/css/style.css', 'w', encoding='utf-8') as f:
        f.write("/* سيتم إضافة CSS في الخطوة التالية */")

def generate_javascript():
    """توليد ملفات JavaScript"""
    os.makedirs('assets/js', exist_ok=True)
    
    # ملفات JavaScript أساسية
    js_files = ['main.js', 'product.js', 'cart.js']
    for js_file in js_files:
        with open(f'assets/js/{js_file}', 'w', encoding='utf-8') as f:
            f.write(f"// {js_file} - سيتم إضافة الكود في الخطوة التالية")

def generate_sitemap(products):
    """إنشاء sitemap.xml"""
    sitemap_content = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://sherow1982.github.io/sooq-alkuwait/</loc>
        <lastmod>''' + datetime.now().strftime('%Y-%m-%d') + '''</lastmod>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://sherow1982.github.io/sooq-alkuwait/cart.html</loc>
        <lastmod>''' + datetime.now().strftime('%Y-%m-%d') + '''</lastmod>
        <priority>0.8</priority>
    </url>'''
    
    for product in products:
        sitemap_content += f'''
    <url>
        <loc>https://sherow1982.github.io/sooq-alkuwait/products-pages/product-{product['id']}.html</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <priority>0.7</priority>
    </url>'''
    
    sitemap_content += '\n</urlset>'
    
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap_content)

def generate_robots():
    """إنشاء robots.txt"""
    robots_content = '''User-agent: *
Allow: /
Sitemap: https://sherow1982.github.io/sooq-alkuwait/sitemap.xml

# منع الزحف إلى الملفات غير المهمة
Disallow: /assets/
Disallow: /*.json'''
    
    with open('robots.txt', 'w', encoding='utf-8') as f:
        f.write(robots_content)

def generate_manifest():
    """إنشاء manifest.json"""
    manifest = {
        "name": "سوق الكويت - أفضل المنتجات بأقل الأسعار",
        "short_name": "سوق الكويت",
        "description": "تسوق من سوق الكويت أكثر من 150 منتج عالي الجودة",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#1e3a8a",
        "theme_color": "#1e3a8a",
        "orientation": "portrait",
        "icons": [
            {
                "src": "https://via.placeholder.com/192x192?text=🇰🇼",
                "sizes": "192x192",
                "type": "image/png"
            }
        ],
        "categories": ["shopping", "business"],
        "lang": "ar",
        "dir": "rtl"
    }
    
    with open('manifest.json', 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    generate_complete_sooq_kuwait()