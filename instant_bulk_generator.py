#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
اسكربت تنفيذ فوري لتوليد جميع صفحات المنتجات (1977 صفحة) دفعة واحدة
يتضمن عداد تنازلي، مواصفات، وتحسين SEO كامل
"""

import json
import os
import re
from datetime import datetime
from pathlib import Path

def create_sample_products():
    """إنشاء بيانات منتجات متنوعة"""
    base_products = [
        {
            "title": "حصالة صراف آلي أوتوماتيكية بتصميم كرتوني",
            "category": "ألعاب ولوازم الأطفال",
            "base_price": 18,
            "base_sale_price": 13,
            "image": "https://ecomerg.com/uploads/products_images/3711/VGYHOWKJV1B2EQDm1AbQxrUkvYMQQdpzpbSxaIdC.jpg",
            "description": "لعبة تعليمية وترفيهية آمنة للأطفال"
        },
        {
            "title": "صفاية سلطة دوّارة متعددة الوظائف",
            "category": "المنزل والمطبخ",
            "base_price": 18,
            "base_sale_price": 13,
            "image": "https://ecomerg.com/uploads/products_images/3710/Wb0quKAvoB677UBgtCjZiyrSBPEbi3vJQIgo2usj.jpg",
            "description": "منتج عالي الجودة يتميز بالتصميم المتطور"
        },
        {
            "title": "شورت نسائي لشد الجسم وتحديد القوام",
            "category": "الملابس والاكسسوارات",
            "base_price": 20,
            "base_sale_price": 15,
            "image": "https://ecomerg.com/uploads/products_images/3709/1a7mTVkaKmAoEwCH8xKScYqiEqI2PGkVdNoxwsdC.jpg",
            "description": "شورت عالي الجودة مصمم للراحة والأناقة"
        },
        {
            "title": "محول كهرباء 220 فولت إلى 12 فولت",
            "category": "السيارات واكسسواراتها",
            "base_price": 25,
            "base_sale_price": 18,
            "image": "https://ecomerg.com/uploads/products_images/3707/dn7pad0vVoy7IWU2SR44OV23VAge2fpMFIjVsoto.jpg",
            "description": "محول كهرباء عالي الجودة لأجهزة السيارات"
        },
        {
            "title": "شامبو صلب طبيعي للعناية بالشعر",
            "category": "العناية الشخصية",
            "base_price": 22,
            "base_sale_price": 16,
            "image": "https://ecomerg.com/uploads/products_images/3706/9OXos2uBDi3ppfQTkYK7kto3ctR0xQ3wGaCpiwJT.jpg",
            "description": "شامبو طبيعي 100% للعناية بالشعر وفروة الرأس"
        },
        {
            "title": "سيروم الأرز والهيالورونيك أسيد",
            "category": "العناية الشخصية",
            "base_price": 28,
            "base_sale_price": 20,
            "image": "https://ecomerg.com/uploads/products_images/3700/LjlQjSyR8qdpjsOyvWxGo5VPLJUXzGBDrxFnCvDl.jpg",
            "description": "سيروم متطور للعناية بالبشرة ومكافحة الشيخوخة"
        },
        {
            "title": "جهاز تنظيف السجاد المحمول",
            "category": "المنزل والمطبخ",
            "base_price": 45,
            "base_sale_price": 35,
            "image": "https://ecomerg.com/uploads/products_images/3699/KJYO8WjQgK0XH4DrsKG6WPj2qXVtxNv0ZbIfCYvb.jpg",
            "description": "جهاز تنظيف فعال وآمن للسجاد والمفروشات"
        },
        {
            "title": "صانعة القهوة التركية الكهربائية",
            "category": "المنزل والمطبخ",
            "base_price": 50,
            "base_sale_price": 38,
            "image": "https://ecomerg.com/uploads/products_images/3698/nMFRdBWdC8Z1ALEXbM5iBZ5wl8RNXca9FgjOYCFu.jpg",
            "description": "صانعة قهوة تركية كهربائية عالية الجودة"
        },
        {
            "title": "روبوت كهربائي للحيوانات الأليفة",
            "category": "ألعاب ولوازم الأطفال",
            "base_price": 32,
            "base_sale_price": 24,
            "image": "https://ecomerg.com/uploads/products_images/3697/bY4I5rg81UW2x1sANRVweB5O6CwD4PrvUPU7Qo5f.jpg",
            "description": "روبوت ذكي للحيوانات الأليفة بجهاز تحكم"
        },
        {
            "title": "مكواة ملابس بخارية محمولة",
            "category": "المنزل والمطبخ",
            "base_price": 35,
            "base_sale_price": 26,
            "image": "https://via.placeholder.com/400x400?text=Steam+Iron",
            "description": "مكواة بخارية عملية وسهلة الاستخدام"
        }
    ]
    
    products = []
    variations = ["الأزرق", "الأحمر", "الأسود", "الأبيض", "الذهبي", "الفضي", "البنفسجي", "الوردي"]
    sizes = ["صغير", "متوسط", "كبير", "ممتاز"]
    brands = ["سوبر", "ديلوكس", "بريمير", "ماستر", "برو", "إليت"]
    
    for i in range(1977):
        base_product = base_products[i % len(base_products)]
        
        # تنويع العناوين
        if i % 4 == 0:
            title = f"{base_product['title']} {variations[i % len(variations)]}"
        elif i % 4 == 1:
            title = f"{base_product['title']} {sizes[i % len(sizes)]}"
        elif i % 4 == 2:
            title = f"{base_product['title']} {brands[i % len(brands)]}"
        else:
            title = f"{base_product['title']} موديل {(i % 20) + 1}"
        
        # تنويع الأسعار
        price = base_product['base_price'] + (i % 25)
        sale_price = base_product['base_sale_price'] + (i % 20)
        
        products.append({
            "id": i + 1,
            "title": title,
            "price": price,
            "sale_price": sale_price,
            "image_link": base_product['image'],
            "description": f"{base_product['description']} متوفر بأفضل جودة في الكويت. منتج رقم {i+1}.",
            "category": base_product['category']
        })
    
    return products

def generate_seo_url(title, product_id):
    """توليد URL محسن"""
    clean_title = re.sub(r'عرض قطعتين من ', '', title)
    clean_title = re.sub(r' من ', ' ', clean_title)
    clean_title = re.sub(r' للأطفال', '', clean_title)
    
    words = clean_title.split()[:4]
    seo_url = '-'.join(words) + f'-{product_id}'
    seo_url = re.sub(r'[^\u0600-\u06FF\u0750-\u077F\w\-]', '', seo_url)
    return seo_url.lower()

def create_html_page(product):
    """إنشاء صفحة HTML محسنة"""
    product_id = product['id']
    title = product['title']
    price = product['price']
    sale_price = product['sale_price']
    image_link = product['image_link']
    description = product['description']
    category = product.get('category', 'منتجات عامة')
    
    discount = int(((price - sale_price) / price) * 100) if price > sale_price else 0
    seo_url = generate_seo_url(title, product_id)
    
    return f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - سوق الكويت | توصيل مجاني</title>
    <meta name="description" content="{description[:155]} - متوفر بأفضل الأسعار مع التوصيل المجاني">
    <meta name="keywords" content="{title}, الكويت, توصيل مجاني, {category}">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description[:200]}">
    <meta property="og:image" content="{image_link}">
    <meta property="og:url" content="https://sooq-alkuwait.com/products-pages/{seo_url}.html">
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
        }}
    }}
    </script>
    <style>
        *{{margin:0;padding:0;box-sizing:border-box}}
        body{{font-family:Arial,sans-serif;background:#f8f9fa;direction:rtl;padding:15px}}
        .container{{max-width:1100px;margin:0 auto;background:white;border-radius:15px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1)}}
        .header{{background:linear-gradient(135deg,#3498db,#2980b9);color:white;padding:25px;text-align:center}}
        .product-grid{{display:grid;grid-template-columns:1fr 1fr;gap:30px;padding:30px}}
        .product-image img{{width:100%;max-width:350px;border-radius:10px;box-shadow:0 4px 10px rgba(0,0,0,0.1)}}
        .product-info h1{{color:#2c3e50;font-size:24px;margin-bottom:20px;line-height:1.3}}
        .price-box{{background:#e74c3c;color:white;padding:20px;border-radius:12px;text-align:center;margin:15px 0}}
        .current-price{{font-size:32px;font-weight:bold}}
        .original-price{{font-size:18px;text-decoration:line-through;opacity:0.8;margin-left:10px}}
        .discount-badge{{background:#27ae60;padding:8px 15px;border-radius:20px;font-size:14px;margin-top:10px;display:inline-block}}
        .countdown{{background:#e67e22;color:white;padding:20px;border-radius:12px;text-align:center;margin:15px 0;animation:pulse 2s infinite}}
        @keyframes pulse{{0%{{transform:scale(1)}}50%{{transform:scale(1.02)}}100%{{transform:scale(1)}}}}
        .timer{{font-size:28px;font-weight:bold;font-family:monospace;letter-spacing:2px}}
        .order-btn{{background:#27ae60;color:white;padding:18px 35px;border:none;border-radius:25px;font-size:20px;font-weight:bold;text-decoration:none;display:block;text-align:center;margin:20px 0;transition:all 0.3s ease}}
        .order-btn:hover{{transform:translateY(-2px);box-shadow:0 5px 15px rgba(39,174,96,0.3)}}
        .info-section{{padding:0 30px 30px}}
        .specs{{background:#f8f9fa;padding:20px;border-radius:10px;margin:20px 0}}
        .contact{{background:#34495e;color:white;padding:25px;text-align:center}}
        @media(max-width:768px){{.product-grid{{grid-template-columns:1fr;gap:20px}}.container{{margin:10px}}}}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="font-size:28px;margin-bottom:10px">🎆 عرض خاص محدود!</h1>
            <p>توصيل مجاني لجميع مناطق الكويت</p>
        </div>
        
        <div class="product-grid">
            <div class="product-image">
                <img src="{image_link}" alt="{title}" loading="lazy">
            </div>
            <div class="product-info">
                <h1>{title}</h1>
                
                <div class="price-box">
                    <span class="original-price">{price} د.ك</span>
                    <span class="current-price">{sale_price} د.ك</span>
                    <div class="discount-badge">وفر {discount}% 🔥</div>
                </div>
                
                <div class="countdown">
                    <div style="margin-bottom:10px">⏰ العرض ينتهي خلال:</div>
                    <div class="timer" id="timer-{product_id}">23:59:45</div>
                </div>
                
                <div style="background:#ecf0f1;padding:15px;border-radius:8px;margin:15px 0">
                    <p><strong>🏷️ الفئة:</strong> {category}</p>
                    <p><strong>🔖 رقم المنتج:</strong> SOOQ-{product_id:04d}</p>
                    <p><strong>🚚 التوصيل:</strong> 24-48 ساعة مجاناً</p>
                </div>
                
                <a href="tel:+96590000000" class="order-btn">
                    🛒 اطلب الآن - توصيل مجاني!
                </a>
            </div>
        </div>
        
        <div class="info-section">
            <h2 style="color:#2c3e50;margin-bottom:15px">وصف المنتج</h2>
            <p style="font-size:16px;line-height:1.6;color:#555">{description}</p>
            
            <div class="specs">
                <h3 style="color:#2c3e50;margin-bottom:15px">المميزات الرئيسية:</h3>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px">
                    <div>✓ جودة عالية مضمونة</div>
                    <div>✓ ضمان رسمي شامل</div>
                    <div>✓ خدمة عملاء 24/7</div>
                    <div>✓ إمكانية استبدال 14 يوم</div>
                </div>
            </div>
        </div>
        
        <div class="contact">
            <h3 style="margin-bottom:15px">📞 اتصل بنا الآن للطلب:</h3>
            <p style="font-size:20px;font-weight:bold">+965 9000 0000</p>
            <p>متاح 24 ساعة - 7 أيام في الأسبوع</p>
        </div>
    </div>
    
    <script>
        function updateTimer(){{
            const now=new Date();
            const tomorrow=new Date(now.getTime()+24*60*60*1000);
            tomorrow.setHours(0,0,0,0);
            const diff=tomorrow-now;
            const hours=Math.floor(diff/3600000);
            const minutes=Math.floor((diff%3600000)/60000);
            const seconds=Math.floor((diff%60000)/1000);
            const timer=document.getElementById('timer-{product_id}');
            if(timer && diff>0){{
                timer.textContent=String(hours).padStart(2,'0')+':'+String(minutes).padStart(2,'0')+':'+String(seconds).padStart(2,'0');
            }}
        }}
        setInterval(updateTimer,1000);
        updateTimer();
    </script>
</body>
</html>'''

def main():
    """الدالة الرئيسية"""
    print('🚀 بدء المعالجة الجماعية الفورية لـ 1977 منتج...')
    
    # إعداد البيانات
    try:
        with open('products_data.json', 'r', encoding='utf-8') as f:
            products = json.load(f)
        print(f'✅ تم تحميل {len(products)} منتج من الملف الأصلي')
    except:
        print('⚠️ لم يتم العثور على الملف الأصلي - سيتم إنشاء 1977 منتج تلقائياً')
        products = create_sample_products()
    
    # إنشاء المجلد
    output_dir = Path('products-pages')
    output_dir.mkdir(exist_ok=True)
    
    # معالجة جماعية سريعة
    success_count = 0
    error_count = 0
    
    for i, product in enumerate(products[:1977], 1):
        try:
            # إضافة ID إذا لم يوجد
            if 'id' not in product:
                product['id'] = i
            
            # توليد HTML
            html_content = create_html_page(product)
            seo_url = generate_seo_url(product['title'], product['id'])
            
            # حفظ الملف
            filename = output_dir / f'{seo_url}.html'
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            success_count += 1
            
            # عرض التقدم كل 100 منتج
            if i % 100 == 0:
                print(f'⚡ تم معالجة {i}/1977 منتج ({(i/1977)*100:.1f}%)')
                
        except Exception as e:
            error_count += 1
            if error_count <= 5:  # عرض أول 5 أخطاء فقط
                print(f'❌ خطأ في المنتج {i}: {str(e)[:50]}...')
    
    # إنشاء فهرس شامل
    create_comprehensive_index(products[:success_count], success_count, error_count)
    
    print(f'\n🎉 انتهى التوليد الجماعي بنجاح!')
    print(f'✅ نجح: {success_count} صفحة')
    print(f'❌ فشل: {error_count} صفحة')
    print(f'📊 معدل النجاح: {(success_count/(success_count+error_count))*100:.1f}%')
    print(f'📁 جميع الصفحات في: {output_dir.absolute()}')
    print(f'🌍 متاحة على: https://sherow1982.github.io/sooq-alkuwait/products-pages/')

def create_comprehensive_index(products, success_count, error_count):
    """إنشاء فهرس شامل"""
    index_content = f'''# 📚 فهرس صفحات المنتجات - سوق الكويت

تم توليد **{success_count:,}** صفحة منتج بنجاح!

## 📈 إحصائيات:
- 🏆 صفحات ناجحة: **{success_count:,}**
- ❌ أخطاء: **{error_count}**
- 📅 وقت التوليد: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
- 📊 معدل النجاح: {(success_count/(success_count+error_count))*100:.1f}%

## 🌟 مميزات الصفحات:
✅ عد تنازلي تفاعلي 24 ساعة  
✅ تحسين كامل لمحركات البحث (SEO)  
✅ بيانات منظمة Schema.org كاملة  
✅ تصميم متجاوب لجميع الشاشات  
✅ روابط عربية صديقة لمحركات البحث  
✅ Open Graph للمشاركة على وسائل التواصل  

## 🔗 عينة من الصفحات:

'''
    
    # عرض أول 50 صفحة فقط في الفهرس
    for product in products[:50]:
        seo_url = generate_seo_url(product['title'], product.get('id', 1))
        index_content += f"- [{product['title']}]({seo_url}.html) - {product.get('sale_price', 15)} د.ك\n"
    
    if len(products) > 50:
        index_content += f"\n**... و {len(products) - 50:,} صفحة أخرى**\n"
    
    index_content += f'''
---

### 📞 اتصل بنا:
**هاتف:** +965 9000 0000  
**البريد:** info@sooq-alkuwait.com  
**الموقع:** [sooq-alkuwait.com](https://sooq-alkuwait.com)  

**سوق الكويت** - وجهتك الأولى للتسوق الإلكتروني في دولة الكويت
'''
    
    with open('products-pages/README.md', 'w', encoding='utf-8') as f:
        f.write(index_content)
    
    print('✅ تم إنشاء فهرس شامل للصفحات')

if __name__ == '__main__':
    main()