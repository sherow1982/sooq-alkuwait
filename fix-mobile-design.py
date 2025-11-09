#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
إصلاح شامل: إزالة الشريط الأبيض + تحسين الموبايل
"""

import json
from pathlib import Path

print("🔧 بدء الإصلاحات الشاملة...")

# تحميل بيانات المنتجات
with open('products_data.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# قالب HTML محسّن بدون شريط أبيض
PRODUCT_PAGE_HTML = '''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loading... | سوق الكويت</title>
    <meta name="description" content="منتج أصلي بأفضل سعر">
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../site-components.css">
    <style>
        *{margin:0;padding:0;box-sizing:border-box}html,body{margin:0;padding:0;overflow-x:hidden}body{font-family:Tajawal,sans-serif;background:linear-gradient(135deg,#f5f7fa 0%,#e3edf7 100%);color:#111827;line-height:1.6;padding-top:70px}@media (max-width:768px){body{padding-top:60px}}.container{max-width:1400px;margin:0 auto;padding:0 1rem}.breadcrumb{background:#fff;padding:1rem;border-radius:.75rem;margin:1.5rem 0;box-shadow:0 2px 4px rgba(0,0,0,.05);display:flex;gap:.5rem;flex-wrap:wrap;align-items:center;font-size:.9rem}.breadcrumb a{color:#667eea;text-decoration:none}.product-container{background:#fff;border-radius:1.5rem;box-shadow:0 20px 40px rgba(0,0,0,.1);padding:2.5rem;margin-bottom:2rem}@media (max-width:768px){.product-container{padding:1.5rem;border-radius:1rem}}.product-grid{display:grid;grid-template-columns:1fr 1fr;gap:3rem;margin-bottom:2rem}@media (max-width:768px){.product-grid{grid-template-columns:1fr;gap:1.5rem}}.image-gallery{position:sticky;top:90px}@media (max-width:768px){.image-gallery{position:static}}.main-image-wrapper{position:relative;border-radius:1rem;overflow:hidden;background:#f9fafb;box-shadow:0 10px 25px rgba(0,0,0,.1)}.main-image{width:100%;height:auto;max-height:600px;object-fit:contain}@media (max-width:768px){.main-image{max-height:400px}}.image-badge{position:absolute;top:1rem;right:1rem;background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;padding:.5rem 1.5rem;border-radius:50px;font-weight:700;font-size:.9rem;box-shadow:0 4px 15px rgba(239,68,68,.4);animation:pulse 2s infinite}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}.product-category{display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:.5rem 1.5rem;border-radius:50px;font-size:.85rem;font-weight:600;margin-bottom:1rem}.product-title{font-size:2.5rem;font-weight:900;margin-bottom:1rem;line-height:1.3}@media (max-width:768px){.product-title{font-size:1.6rem}}.rating-section{display:flex;align-items:center;gap:1rem;margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:2px solid #f3f4f6;flex-wrap:wrap}.stars{color:#fbbf24;font-size:1.5rem}@media (max-width:768px){.stars{font-size:1.2rem}}.rating-text{font-size:1.1rem;font-weight:600}@media (max-width:768px){.rating-text{font-size:1rem}}.rating-count{color:#667eea;font-weight:600;font-size:1rem}@media (max-width:768px){.rating-count{font-size:.9rem}}.price-section{background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);padding:2rem;border-radius:1rem;margin-bottom:2rem;border:2px solid #667eea}@media (max-width:768px){.price-section{padding:1.5rem}}.price-wrapper{display:flex;align-items:baseline;gap:1rem;margin-bottom:1rem;flex-wrap:wrap}.current-price{font-size:3.5rem;font-weight:900;color:#667eea}@media (max-width:768px){.current-price{font-size:2.5rem}}.old-price{font-size:1.8rem;color:#6b7280;text-decoration:line-through;opacity:.7}@media (max-width:768px){.old-price{font-size:1.3rem}}.savings-text{color:#10b981;font-weight:700;font-size:1.2rem}@media (max-width:768px){.savings-text{font-size:1rem}}.features-list{list-style:none;margin-bottom:2rem}.features-list li{padding:1rem;background:#f9fafb;margin-bottom:.5rem;border-radius:.75rem;display:flex;align-items:center;gap:1rem;transition:all .3s}@media (max-width:768px){.features-list li{padding:.75rem;font-size:.9rem}}.features-list li:hover{background:#f3f4f6;transform:translateX(-5px)}.feature-icon{width:50px;height:50px;background:#fff;border-radius:.75rem;display:flex;align-items:center;justify-content:center;color:#667eea;font-size:1.5rem;box-shadow:0 2px 8px rgba(0,0,0,.1)}@media (max-width:768px){.feature-icon{width:40px;height:40px;font-size:1.2rem}}.trust-badges{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem}@media (max-width:768px){.trust-badges{grid-template-columns:1fr;gap:.75rem}}.trust-badge{text-align:center;padding:1.5rem;background:#f9fafb;border-radius:1rem;transition:all .3s}@media (max-width:768px){.trust-badge{padding:1rem}}.trust-badge:hover{background:#667eea;color:#fff;transform:translateY(-5px)}.trust-badge i{font-size:2.5rem;margin-bottom:.5rem;display:block}@media (max-width:768px){.trust-badge i{font-size:2rem}}.cta-section{background:linear-gradient(135deg,#667eea,#764ba2);padding:2.5rem;border-radius:1.5rem;text-align:center;box-shadow:0 15px 35px rgba(102,126,234,.3);margin-bottom:2rem}@media (max-width:768px){.cta-section{padding:1.5rem;border-radius:1rem}}.whatsapp-btn{width:100%;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;padding:2rem;border:0;border-radius:1rem;font-size:1.8rem;font-weight:900;cursor:pointer;box-shadow:0 10px 30px rgba(37,211,102,.4);transition:all .3s;text-decoration:none;display:block;font-family:Tajawal}@media (max-width:768px){.whatsapp-btn{padding:1.3rem;font-size:1.3rem}}.whatsapp-btn:hover{transform:translateY(-5px);color:#fff}.urgency-text{color:#fff;font-weight:700;margin-top:1rem;font-size:1.1rem}@media (max-width:768px){.urgency-text{font-size:1rem}}.description-section,.reviews-section{background:#fff;padding:2.5rem;border-radius:1.5rem;margin-bottom:2rem;box-shadow:0 10px 25px rgba(0,0,0,.05)}@media (max-width:768px){.description-section,.reviews-section{padding:1.5rem;border-radius:1rem}}.section-title{font-size:2rem;font-weight:700;margin-bottom:1.5rem;display:flex;align-items:center;gap:1rem}@media (max-width:768px){.section-title{font-size:1.5rem}}.description-text{font-size:1.15rem;line-height:2;color:#374151}@media (max-width:768px){.description-text{font-size:1rem;line-height:1.8}}.rating-overview{display:grid;grid-template-columns:200px 1fr;gap:2rem;margin-bottom:2rem;padding-bottom:2rem;border-bottom:2px solid #f3f4f6}@media (max-width:768px){.rating-overview{grid-template-columns:1fr;gap:1.5rem}}.rating-summary{text-align:center}.rating-number{font-size:4rem;font-weight:900;color:#667eea;line-height:1}@media (max-width:768px){.rating-number{font-size:3rem}}.rating-stars-big{color:#fbbf24;font-size:2rem;margin:1rem 0}@media (max-width:768px){.rating-stars-big{font-size:1.5rem}}.rating-total{color:#6b7280;font-size:1rem}@media (max-width:768px){.rating-total{font-size:.9rem}}.rating-bar-row{display:flex;align-items:center;gap:1rem;margin-bottom:.75rem}.rating-bar-label{min-width:60px;font-size:.9rem;color:#6b7280}@media (max-width:768px){.rating-bar-label{min-width:50px;font-size:.8rem}}.rating-bar-bg{flex:1;height:8px;background:#f3f4f6;border-radius:10px;overflow:hidden}.rating-bar-fill{height:100%;background:linear-gradient(90deg,#fbbf24,#f59e0b);border-radius:10px;transition:width .5s}.rating-bar-count{min-width:50px;text-align:right;font-size:.9rem;color:#6b7280}@media (max-width:768px){.rating-bar-count{font-size:.8rem}}.review-card{background:#f9fafb;padding:1.5rem;border-radius:1rem;margin-bottom:1rem;border-left:4px solid #667eea}@media (max-width:768px){.review-card{padding:1rem}}.review-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:.5rem}.review-author{font-weight:700;color:#111827}@media (max-width:768px){.review-author{font-size:.9rem}}.verified-badge{background:#10b981;color:#fff;padding:.25rem .75rem;border-radius:50px;font-size:.75rem;font-weight:600}.review-stars{color:#fbbf24;font-size:1.1rem;margin-bottom:.5rem}@media (max-width:768px){.review-stars{font-size:1rem}}.review-text{color:#374151;line-height:1.8;margin-bottom:.75rem}@media (max-width:768px){.review-text{font-size:.9rem;line-height:1.6}}.review-date{color:#9ca3af;font-size:.85rem}@media (max-width:768px){.review-date{font-size:.8rem}}.floating-whatsapp{position:fixed;bottom:30px;left:30px;width:70px;height:70px;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2.5rem;box-shadow:0 10px 30px rgba(37,211,102,.5);z-index:1000;animation:float 3s ease-in-out infinite;text-decoration:none}@media (max-width:768px){.floating-whatsapp{width:60px;height:60px;font-size:2rem;bottom:20px;left:20px}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    </style>
</head>
<body>
    <div id="site-header"></div>
    <div class="container">
        <nav class="breadcrumb">
            <a href="/">🏠 الرئيسية</a><span>/</span>
            <a href="/products-catalog.html">المنتجات</a><span>/</span>
            <span id="breadcrumb-product">...</span>
        </nav>
        <div class="product-container">
            <div class="product-grid">
                <div class="image-gallery">
                    <div class="main-image-wrapper">
                        <div class="image-badge" id="discount-badge" style="display:none">وفّر 0%</div>
                        <img class="main-image" src="" alt="منتج" id="main-product-image">
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category" id="product-category">...</div>
                    <h1 class="product-title" id="product-title">جاري التحميل...</h1>
                    <div class="rating-section">
                        <div class="stars" id="product-stars">★★★★★</div>
                        <span class="rating-text" id="rating-value">0.0</span>
                        <span class="rating-count" id="rating-count">(0 تقييم)</span>
                    </div>
                    <div class="price-section">
                        <div class="price-wrapper">
                            <div class="current-price" id="current-price">0.00 د.ك</div>
                            <div class="old-price" id="old-price" style="display:none">0.00 د.ك</div>
                        </div>
                        <div class="savings-text" id="savings-text" style="display:none"></div>
                    </div>
                    <ul class="features-list">
                        <li><div class="feature-icon">✓</div><div><strong>منتج أصلي 100%</strong><br><small>ضمان الجودة</small></div></li>
                        <li><div class="feature-icon">🚚</div><div><strong>شحن مجاني</strong><br><small>لجميع الكويت</small></div></li>
                        <li><div class="feature-icon">↩</div><div><strong>إرجاع مجاني</strong><br><small>خلال 14 يوم</small></div></li>
                        <li><div class="feature-icon">📞</div><div><strong>دعم 24/7</strong><br><small>رد فوري</small></div></li>
                    </ul>
                    <div class="trust-badges">
                        <div class="trust-badge"><i class="fas fa-truck" style="color:#10b981"></i><div><strong>توصيل سريع</strong></div><small>1-3 أيام</small></div>
                        <div class="trust-badge"><i class="fas fa-shield-alt" style="color:#667eea"></i><div><strong>ضمان شامل</strong></div><small>100% آمن</small></div>
                        <div class="trust-badge"><i class="fas fa-exchange-alt" style="color:#f59e0b"></i><div><strong>إرجاع سهل</strong></div><small>بدون تعقيد</small></div>
                    </div>
                    <div class="cta-section">
                        <a href="#" class="whatsapp-btn" id="whatsapp-btn"><i class="fab fa-whatsapp"></i> اطلب عبر واتساب</a>
                        <div class="urgency-text">⚡ احجز الآن - الكمية محدودة!</div>
                    </div>
                </div>
            </div>
            <div class="description-section" id="description-section" style="display:none">
                <h2 class="section-title"><i class="fas fa-info-circle"></i> وصف المنتج</h2>
                <div class="description-text" id="product-description"></div>
            </div>
            <div class="reviews-section" id="reviews-section"></div>
        </div>
    </div>
    <a href="#" class="floating-whatsapp" id="floating-whatsapp"><i class="fab fa-whatsapp"></i></a>
    <div id="site-footer"></div>
    <script src="../site-header.js"></script>
    <script src="../site-footer.js"></script>
    <script src="product-loader-reviews.js"></script>
</body>
</html>'''

# تحديث CSS الكتالوج - إصلاح الموبايل
CATALOG_CSS = ''':root{--primary:#667eea;--secondary:#764ba2;--success:#10b981;--gray-50:#f9fafb;--gray-100:#f3f4f6;--gray-700:#374151;--gray-900:#111827}*{margin:0;padding:0;box-sizing:border-box}html,body{margin:0;padding:0;overflow-x:hidden}body{font-family:Tajawal,sans-serif;background:linear-gradient(135deg,#f5f7fa 0%,#e3edf7 100%);color:var(--gray-900);line-height:1.6;padding-top:70px}@media (max-width:768px){body{padding-top:60px}}.top-search-bar{position:fixed;top:0;left:0;right:0;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.1);z-index:1000;padding:1rem 0}@media (max-width:768px){.top-search-bar{padding:.75rem 0}}.top-search-wrapper{max-width:1400px;margin:0 auto;padding:0 1rem;display:flex;align-items:center;gap:1rem}.site-logo{font-size:1.5rem;font-weight:900;background:linear-gradient(135deg,var(--primary),var(--secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;white-space:nowrap}@media (max-width:768px){.site-logo{font-size:1.1rem}}.global-search{flex:1;position:relative}.global-search input{width:100%;padding:.75rem 3rem .75rem 1rem;border:2px solid var(--gray-200);border-radius:50px;font-size:1rem;font-family:Tajawal;transition:all .3s}@media (max-width:768px){.global-search input{padding:.6rem 2.5rem .6rem .75rem;font-size:.9rem}}.global-search input:focus{outline:0;border-color:var(--primary);box-shadow:0 0 0 3px rgba(102,126,234,.1)}.global-search-icon{position:absolute;right:1rem;top:50%;transform:translateY(-50%);color:var(--gray-700);font-size:1.2rem;pointer-events:none}@media (max-width:768px){.global-search-icon{right:.75rem;font-size:1rem}}.hero{background:linear-gradient(135deg,var(--primary) 0%,var(--secondary) 100%);color:#fff;padding:2rem 1rem;text-align:center;margin-bottom:2rem;margin-top:0}@media (max-width:768px){.hero{padding:1.5rem 1rem}}.hero h1{font-size:2rem;font-weight:900;margin-bottom:.5rem}@media (max-width:768px){.hero h1{font-size:1.4rem}}.hero-stats{display:flex;justify-content:center;gap:2rem;flex-wrap:wrap;margin-top:1.5rem}@media (max-width:768px){.hero-stats{gap:1rem}}.stat-item{text-align:center}.stat-number{font-size:1.5rem;font-weight:700;display:block}@media (max-width:768px){.stat-number{font-size:1.2rem}}.container{max-width:1400px;margin:0 auto;padding:0 1rem}.filter-bar{background:#fff;border-radius:1rem;padding:1rem;box-shadow:0 4px 6px rgba(0,0,0,.1);margin-bottom:2rem;position:sticky;top:80px;z-index:100}@media (max-width:768px){.filter-bar{top:70px;padding:.75rem;border-radius:.75rem}}.categories-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:.5rem}@media (max-width:768px){.categories-grid{grid-template-columns:repeat(2,1fr);gap:.4rem}}.category-btn{background:var(--gray-100);border:2px solid transparent;padding:.75rem 1rem;border-radius:.75rem;font-size:.9rem;font-weight:600;cursor:pointer;transition:all .3s;font-family:Tajawal;white-space:nowrap;text-align:center;overflow:hidden;text-overflow:ellipsis}@media (max-width:768px){.category-btn{padding:.6rem .5rem;font-size:.75rem;line-height:1.3}}.category-btn:hover{background:var(--gray-700);color:#fff;transform:translateY(-2px)}.category-btn.active{background:linear-gradient(135deg,var(--primary),var(--secondary));color:#fff;box-shadow:0 4px 6px rgba(0,0,0,.2)}.toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;flex-wrap:wrap;gap:1rem}.results-count{font-size:1.125rem;font-weight:600}@media (max-width:768px){.results-count{font-size:1rem}}.results-count span{color:var(--primary);font-weight:700}.sort-select{padding:.5rem 1.5rem;border:2px solid var(--gray-100);border-radius:.5rem;font-family:Tajawal;font-size:1rem;background:#fff;cursor:pointer}@media (max-width:768px){.sort-select{padding:.4rem 1rem;font-size:.9rem}}.products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:2rem;margin-bottom:3rem}@media (max-width:768px){.products-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1rem}}.product-card{background:#fff;border-radius:1rem;overflow:hidden;box-shadow:0 4px 6px -1px rgb(0 0 0/.1);transition:all .3s;display:flex;flex-direction:column}@media (max-width:768px){.product-card{border-radius:.75rem}}.product-card:hover{transform:translateY(-8px);box-shadow:0 25px 50px -12px rgb(0 0 0/.25)}.product-badge{position:absolute;top:1rem;right:1rem;background:#ef4444;color:#fff;padding:.25rem 1rem;border-radius:9999px;font-size:.75rem;font-weight:700;z-index:10}@media (max-width:768px){.product-badge{padding:.2rem .75rem;font-size:.7rem}}.product-image-wrapper{position:relative;overflow:hidden;background:var(--gray-50);padding-top:100%}.product-image{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;transition:transform .5s}.product-card:hover .product-image{transform:scale(1.1)}.product-info{padding:1.5rem;flex-grow:1;display:flex;flex-direction:column}@media (max-width:768px){.product-info{padding:1rem}}.product-category{font-size:.75rem;color:var(--primary);font-weight:600;margin-bottom:.5rem}@media (max-width:768px){.product-category{font-size:.7rem}}.product-title{font-size:1rem;font-weight:700;margin-bottom:.5rem;line-height:1.4;min-height:2.8em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}@media (max-width:768px){.product-title{font-size:.85rem;min-height:2.4em}}.product-rating{display:flex;align-items:center;gap:.5rem;margin-bottom:1rem}@media (max-width:768px){.product-rating{gap:.3rem;margin-bottom:.75rem}}.stars{color:#fbbf24;font-size:.875rem}@media (max-width:768px){.stars{font-size:.75rem}}.product-price{display:flex;align-items:baseline;gap:.5rem;margin-bottom:1rem;flex-wrap:wrap}@media (max-width:768px){.product-price{gap:.3rem;margin-bottom:.75rem}}.current-price{font-size:1.5rem;font-weight:900;color:var(--primary)}@media (max-width:768px){.current-price{font-size:1.1rem}}.old-price{font-size:1rem;color:#9ca3af;text-decoration:line-through}@media (max-width:768px){.old-price{font-size:.8rem}}.product-footer{padding:0 1.5rem 1.5rem;margin-top:auto}@media (max-width:768px){.product-footer{padding:0 1rem 1rem}}.add-to-cart-btn{width:100%;padding:1rem;background:linear-gradient(135deg,var(--primary),var(--secondary));color:#fff;border:0;border-radius:.75rem;font-size:1rem;font-weight:700;cursor:pointer;transition:all .3s;font-family:Tajawal;text-align:center}@media (max-width:768px){.add-to-cart-btn{padding:.75rem;font-size:.85rem}}.add-to-cart-btn:hover{transform:translateY(-2px);box-shadow:0 10px 20px rgba(0,0,0,.2)}.loading{text-align:center;padding:3rem}@media (max-width:768px){.loading{padding:2rem}}.spinner{width:50px;height:50px;margin:0 auto 1rem;border:4px solid var(--gray-100);border-top-color:var(--primary);border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.empty-state{text-align:center;padding:3rem}@media (max-width:768px){.empty-state{padding:2rem}}.empty-icon{font-size:5rem;color:var(--gray-100);margin-bottom:1.5rem}@media (max-width:768px){.empty-icon{font-size:3rem}}.pagination{display:flex;justify-content:center;gap:.5rem;margin:3rem 0}@media (max-width:768px){.pagination{margin:2rem 0;gap:.3rem}}.page-btn{min-width:44px;height:44px;padding:0 1rem;border:2px solid var(--gray-100);background:#fff;border-radius:.5rem;cursor:pointer;transition:all .3s;font-weight:600}@media (max-width:768px){.page-btn{min-width:36px;height:36px;padding:0 .75rem;font-size:.85rem}}.page-btn:hover,.page-btn.active{background:var(--primary);color:#fff;border-color:var(--primary)}.back-to-top{position:fixed;bottom:30px;left:30px;width:50px;height:50px;background:var(--primary);color:#fff;border:0;border-radius:50%;cursor:pointer;opacity:0;visibility:hidden;transition:all .3s;z-index:1000}@media (max-width:768px){.back-to-top{width:45px;height:45px;bottom:20px;left:20px;font-size:.9rem}}.back-to-top.show{opacity:1;visibility:visible}.back-to-top:hover{background:#5568d3;transform:translateY(-5px)}'''

# تطبيق التحديثات
products_dir = Path('products-pages')
products_dir.mkdir(exist_ok=True)

print(f"📄 تحديث {len(products)} صفحة منتج...")

success = 0
for i, product in enumerate(products, 1):
    try:
        file_path = products_dir / product['filename']
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(PRODUCT_PAGE_HTML)
        success += 1
        
        if i % 200 == 0:
            print(f"✅ {i} صفحة")
    except Exception as e:
        print(f"❌ خطأ: {e}")

# حفظ CSS الكتالوج المحدث
with open('catalog-styles.css', 'w', encoding='utf-8') as f:
    f.write(CATALOG_CSS)

print(f"\n✨ اكتمل!")
print(f"📊 {success} صفحة منتج محدثة")
print(f"🎨 ملف CSS محدث")
print("\n🔧 الإصلاحات:")
print("  ✓ إزالة الشريط الأبيض")
print("  ✓ إصلاح الفئات على الموبايل")
print("  ✓ تحسينات شاملة للموبايل")
print("  ✓ تصميم احترافي 100%")
