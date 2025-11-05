#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
اسكربت تلقائي لتوليد جميع صفحات المنتجات المحسنة لمحركات البحث
يتضمن عد تنازلي، مواصفات مفصلة، وتقييمات العملاء
"""

import json
import os
import re
from pathlib import Path

def load_data():
    """تحميل بيانات المنتجات والمراجعات"""
    try:
        with open('products_data.json', 'r', encoding='utf-8') as f:
            products = json.load(f)
        
        with open('kuwaiti_reviews.json', 'r', encoding='utf-8') as f:
            reviews = json.load(f)
        
        return products, reviews
    except Exception as e:
        print(f"❌ خطأ في تحميل البيانات: {e}")
        return [], {}

def generate_seo_url(title):
    """توليد رابط محسن لمحركات البحث"""
    # إزالة العبارات الزائدة
    clean_title = title.replace('عرض قطعتين من ', '')
    clean_title = clean_title.replace(' من ', ' ')
    clean_title = clean_title.replace(' للأطفال', '')
    clean_title = clean_title.replace(' متعددة الوظائف', '')
    
    # أخذ أول 5 كلمات
    words = clean_title.split()[:5]
    seo_url = '-'.join(words)
    
    # تنظيف الرابط
    seo_url = re.sub(r'[^\u0600-\u06FF\u0750-\u077F\w\-]', '', seo_url)
    return seo_url.lower()

def determine_category(title):
    """تحديد فئة المنتج"""
    title_lower = title.lower()
    categories = {
        'ألعاب ولوازم الأطفال': ['للأطفال', 'لعبة', 'حصالة', 'طفل', 'أطفال', 'روبوت', 'طائرة'],
        'العناية الشخصية والتجميل': ['كريم', 'شامبو', 'عطر', 'صابون', 'زيت', 'مرطب', 'سيروم', 'بودرة'],
        'المنزل والمطبخ': ['مطبخ', 'منزلي', 'صفاية', 'طبخ', 'منظف', 'أدوات', 'صانعة'],
        'الملابس والاكسسوارات': ['شورت', 'نسائي', 'رجالي', 'حقيبة', 'ملابس'],
        'السيارات واكسسواراتها': ['سيارة', 'سيارات', 'محول كهرباء', 'حامل'],
        'الأجهزة الإلكترونية': ['كهربائي', 'إلكتروني', 'محول', 'جهاز', 'ماكينة']
    }
    
    for category, keywords in categories.items():
        if any(keyword in title_lower for keyword in keywords):
            return category
    return 'منتجات عامة'

def extract_keywords(title):
    """استخراج الكلمات المفتاحية"""
    stop_words = ['من', 'إلى', 'في', 'على', 'عن', 'مع', 'بدون', 'عرض', 'قطعتين']
    words = re.sub(r'[،.]', ' ', title).split()
    keywords = [w for w in words if w not in stop_words and len(w) > 2][:10]
    keywords.extend(['الكويت', 'توصيل', 'سريع', 'جودة', 'أصلي', 'ضمان'])
    return keywords[:15]

def generate_specs(product):
    """توليد مواصفات المنتج"""
    title = product['title'].lower()
    
    if 'حصالة' in title or 'للأطفال' in title:
        return {
            "الفئة العمرية": "3 سنوات فأكثر",
            "المواد": "بلاستيك ABS عالي الجودة",
            "الأمان": "خالي من المواد الضارة",
            "الوزن": "500 جرام",
            "الضمان": "سنة واحدة شاملة"
        }
    elif 'صفاية' in title or 'مطبخ' in title:
        return {
            "المواد": "بلاستيك غذائي آمن",
            "السعة": "3-4 لتر",
            "آلية العمل": "يدوية",
            "قابل للغسل": "نعم",
            "الضمان": "سنة واحدة"
        }
    elif 'شورت' in title or 'نسائي' in title:
        return {
            "المقاسات": "S, M, L, XL, XXL",
            "المواد": "نايلون عالي الجودة",
            "المرونة": "4-way stretch",
            "الغسيل": "يدوي بماء بارد",
            "الضمان": "6 أشهر"
        }
    elif 'محول' in title or 'كهرباء' in title:
        return {
            "الجهد المدخل": "220 فولت AC",
            "الجهد المخرج": "12 فولت DC",
            "التيار": "5 أمبير",
            "الحماية": "شاملة",
            "الضمان": "سنة واحدة"
        }
    else:
        return {
            "الجودة": "عالية",
            "الضمان": "سنة واحدة",
            "التوصيل": "مجاني",
            "الدفع": "عند الاستلام",
            "خدمة العملاء": "24/7"
        }

def create_product_html(product, product_reviews):
    """إنشاء صفحة HTML للمنتج"""
    
    # بيانات أساسية
    product_id = product['id']
    title = product['title']
    price = product['price']
    sale_price = product['sale_price']
    image_link = product['image_link']
    description = product['description']
    
    # بيانات محسنة
    category = determine_category(title)
    keywords = extract_keywords(title)
    specs = generate_specs(product)
    discount = int(((price - sale_price) / price) * 100)
    seo_url = generate_seo_url(title)
    
    # حساب متوسط التقييم
    avg_rating = sum(r['rating'] for r in product_reviews) / len(product_reviews) if product_reviews else 4.7
    
    html_template = f'''
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - سوق الكويت | بأفضل الأسعار وتوصيل مجاني</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="{description[:160]}... متوفر بأفضل الأسعار في الكويت مع التوصيل المجاني">
    <meta name="keywords" content="{', '.join(keywords)}">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:title" content="{title} - سوق الكويت">
    <meta property="og:description" content="{description[:200]}">
    <meta property="og:image" content="{image_link}">
    <meta property="og:url" content="https://sooq-alkuwait.com/products-pages/{seo_url}.html">
    
    <!-- Schema.org -->
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "{title}",
        "image": "{image_link}",
        "description": "{description}",
        "sku": "SOOQ-{product_id:04d}",
        "category": "{category}",
        "offers": {{
            "@type": "Offer",
            "price": "{sale_price}",
            "priceCurrency": "KWD",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
        }},
        "aggregateRating": {{
            "@type": "AggregateRating",
            "ratingValue": "{avg_rating:.1f}",
            "reviewCount": "{len(product_reviews) or 150}"
        }}
    }}
    </script>
    
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }}
        .container {{ max-width: 1200px; margin: 0 auto; padding: 20px; }}
        .product-card {{ background: white; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); padding: 30px; margin-bottom: 30px; }}
        .product-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }}
        .product-image img {{ width: 100%; max-width: 400px; border-radius: 10px; }}
        h1 {{ color: #2c3e50; font-size: 28px; margin-bottom: 20px; }}
        .price-section {{ background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }}
        .current-price {{ font-size: 32px; font-weight: bold; }}
        .original-price {{ font-size: 18px; text-decoration: line-through; opacity: 0.7; margin-right: 10px; }}
        .discount {{ background: #27ae60; padding: 5px 15px; border-radius: 20px; font-size: 14px; margin-top: 10px; display: inline-block; }}
        .countdown-timer {{ background: linear-gradient(135deg, #e67e22, #d35400); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; animation: pulse 2s infinite; }}
        @keyframes pulse {{ 0% {{ transform: scale(1); }} 50% {{ transform: scale(1.02); }} 100% {{ transform: scale(1); }} }}
        .timer-display {{ font-size: 28px; font-weight: bold; font-family: monospace; }}
        .cta-button {{ background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; padding: 15px 30px; border: none; border-radius: 25px; font-size: 18px; font-weight: bold; text-decoration: none; display: block; text-align: center; margin: 20px 0; transition: all 0.3s ease; }}
        .cta-button:hover {{ transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }}
        .specs-table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
        .specs-table th {{ background: #3498db; color: white; padding: 12px; }}
        .specs-table td {{ padding: 12px; border-bottom: 1px solid #eee; }}
        .review-item {{ background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px; }}
        .rating {{ color: #f39c12; }}
        @media (max-width: 768px) {{ .product-grid {{ grid-template-columns: 1fr; }} }}
    </style>
</head>
<body>
    <div class="container">
        <div class="product-card">
            <div class="product-grid">
                <div class="product-image">
                    <img src="{image_link}" alt="{title}" loading="lazy">
                </div>
                <div class="product-info">
                    <h1>{title}</h1>
                    
                    <div class="price-section">
                        <div>
                            <span class="original-price">{price} د.ك</span>
                            <span class="current-price">{sale_price} د.ك</span>
                        </div>
                        <div class="discount">خصم {discount}%</div>
                    </div>
                    
                    <div class="countdown-timer">
                        <div>⏰ العرض ينتهي خلال:</div>
                        <div class="timer-display" id="timer-{product_id}">23:59:45</div>
                    </div>
                    
                    <p><strong>الفئة:</strong> {category}</p>
                    <p><strong>رقم المنتج:</strong> SOOQ-{product_id:04d}</p>
                    
                    <a href="tel:+96590000000" class="cta-button">
                        🛒 اطلب الآن - توصيل مجاني
                    </a>
                </div>
            </div>
        </div>
        
        <div class="product-card">
            <h2>وصل المنتج</h2>
            <p>{description}</p>
            
            <h3>المواصفات التقنية:</h3>
            <table class="specs-table">
                <thead><tr><th>الخاصية</th><th>التفاصيل</th></tr></thead>
                <tbody>
'''
    
    # إضافة المواصفات
    for spec_name, spec_value in specs.items():
        html_template += f'                    <tr><td>{spec_name}</td><td>{spec_value}</td></tr>\n'
    
    html_template += '                </tbody>\n            </table>\n        </div>\n'
    
    # إضافة المراجعات
    if product_reviews:
        html_template += f'''        
        <div class="product-card">
            <h2>آراء العملاء ({len(product_reviews)} تقييم)</h2>
'''
        for review in product_reviews:
            stars = '★' * int(review['rating']) + '☆' * (5 - int(review['rating']))
            html_template += f'''
            <div class="review-item">
                <strong>{review['name']}</strong> 
                <span class="rating">{stars} ({review['rating']}/5)</span>
                <p>"{review['comment']}"</p>
                <small>{review['date']}</small>
            </div>'''
        
        html_template += '\n        </div>\n'
    
    # إنهاء الصفحة
    html_template += f'''
    </div>
    
    <script>
        function updateTimer() {{
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24*60*60*1000);
            tomorrow.setHours(0,0,0,0);
            
            const diff = tomorrow - now;
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            
            const timer = document.getElementById('timer-{product_id}');
            if (timer) {{
                timer.textContent = 
                    String(hours).padStart(2, '0') + ':' +
                    String(minutes).padStart(2, '0') + ':' +
                    String(seconds).padStart(2, '0');
            }}
        }}
        
        setInterval(updateTimer, 1000);
        updateTimer();
    </script>
</body>
</html>'''
    
    return html_template

def main():
    """الدالة الرئيسية"""
    print('🚀 بدء توليد جميع صفحات المنتجات...')
    
    # تحميل البيانات
    products, reviews = load_data()
    
    if not products:
        print('❌ لا توجد بيانات منتجات')
        return
    
    # إنشاء مجلد المنتجات
    output_dir = Path('products-pages')
    output_dir.mkdir(exist_ok=True)
    
    success_count = 0
    error_count = 0
    
    # توليد كل صفحة
    for i, product in enumerate(products, 1):
        try:
            product_id = str(product['id'])
            product_reviews = reviews.get(product_id, [])
            
            html_content = create_product_html(product, product_reviews)
            seo_url = generate_seo_url(product['title'])
            
            filename = output_dir / f'{seo_url}.html'
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            print(f'✅ {i:3d}. {product["title"][:60]}...')
            success_count += 1
            
        except Exception as e:
            print(f'❌ {i:3d}. خطأ: {product.get("title", "Unknown")[:40]}... - {str(e)[:50]}')
            error_count += 1
    
    # إنشاء فهرس الصفحات
    index_content = f'''
# فهرس صفحات المنتجات

تم إنشاء {success_count} صفحة منتج بنجاح:

'''
    
    for product in products:
        seo_url = generate_seo_url(product['title'])
        index_content += f"- [{product['title']}]({seo_url}.html) - {product['sale_price']} د.ك\n"
    
    with open(output_dir / 'README.md', 'w', encoding='utf-8') as f:
        f.write(index_content)
    
    print(f'\n🎉 اكتمل التوليد!')
    print(f'✅ صفحات ناجحة: {success_count}')
    if error_count > 0:
        print(f'❌ أخطاء: {error_count}')
    print(f'📁 تم حفظ الصفحات في: {output_dir.absolute()}')
    print('🌐 جميع الصفحات محسنة لمحركات البحث وجوجل')

if __name__ == '__main__':
    main()