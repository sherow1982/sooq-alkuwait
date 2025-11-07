#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
إصلاح شامل لعرض الموبايل - صفحة رئيسية + كتالوج + صفحات المنتجات
"""

from pathlib import Path
import re

PRODUCTS_DIR = Path("products-pages")
INDEX_FILE = Path("index.html")
CATALOG_FILE = Path("products-catalog.html")

# CSS شامل لإصلاح الموبايل
mobile_fix_css = '''
<style>
/* إصلاح شامل للموبايل */
@media (max-width: 768px) {
    /* إصلاح الصور - أهم شيء */
    img, .product-image, .product-image img {
        max-width: 100% !important;
        max-height: 350px !important;
        width: auto !important;
        height: auto !important;
        object-fit: contain !important;
        margin: 0 auto !important;
        display: block !important;
    }
    
    /* إصلاح العناوين */
    h1, h2, h3 {
        font-size: 1.3rem !important;
        line-height: 1.5 !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
    }
    
    /* إصلاح بطاقات المنتجات - بطاقة واحدة في الصف */
    .product-card,
    .catalog-item,
    .grid-item,
    .col-6,
    .col-md-4,
    .col-md-6,
    .col-lg-3,
    .col-lg-4 {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 100% !important;
        flex: 0 0 100% !important;
        margin: 0 0 20px 0 !important;
    }
    
    /* إصلاح Grid */
    .products-grid,
    .catalog-grid,
    .row {
        display: flex !important;
        flex-direction: column !important;
        gap: 20px !important;
    }
    
    /* إصلاح الأزرار */
    .btn,
    button,
    .whatsapp-btn,
    a.button {
        width: 100% !important;
        max-width: 100% !important;
        font-size: 1.1rem !important;
        padding: 15px 20px !important;
        margin: 10px 0 !important;
    }
    
    /* إصلاح الأسعار */
    .price-section,
    .sale-price {
        font-size: 1.8rem !important;
    }
    
    /* إصلاح Container العام */
    .container,
    .product-container {
        padding: 15px !important;
        max-width: 100% !important;
    }
    
    /* إصلاح الوصف */
    .product-description {
        padding: 20px !important;
        font-size: 1rem !important;
        line-height: 1.7 !important;
    }
    
    /* إصلاح Header/Navbar */
    nav, header {
        padding: 10px !important;
    }
    
    .navbar-brand {
        font-size: 1.2rem !important;
    }
    
    /* إصلاح Footer */
    footer {
        padding: 20px 15px !important;
    }
    
    .footer-section {
        margin-bottom: 20px !important;
    }
    
    /* إزالة Overflow المزعج */
    body {
        overflow-x: hidden !important;
    }
    
    * {
        max-width: 100vw !important;
    }
}
</style>
'''

fixed_count = 0
total = 0

print("\n" + "="*60)
print("📱 بدء إصلاح شامل للموبايل")
print("="*60 + "\n")

# 1. إصلاح صفحات المنتجات
print("📦 إصلاح صفحات المنتجات...")
for html_file in PRODUCTS_DIR.glob('*.html'):
    total += 1
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            html = f.read()
        
        original = html
        
        # إزالة أي CSS جوال قديم
        html = re.sub(
            r'<style>.*?@media.*?max-width.*?768px.*?</style>',
            '',
            html,
            flags=re.DOTALL
        )
        
        # إضافة CSS الجديد
        if mobile_fix_css not in html:
            html = html.replace('</head>', f'{mobile_fix_css}\n</head>')
        
        # إصلاح viewport meta
        if '<meta name="viewport"' not in html:
            html = html.replace(
                '</head>',
                '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">\n</head>'
            )
        
        if html != original:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(html)
            fixed_count += 1
        
        if total % 200 == 0:
            print(f"  ⏳ {total} صفحة...")
    
    except Exception as e:
        print(f"  ⚠️ {html_file.name}: {e}")

print(f"✅ تم إصلاح {fixed_count} صفحة منتج\n")

# 2. إصلاح index.html
print("🏠 إصلاح الصفحة الرئيسية...")
if INDEX_FILE.exists():
    try:
        with open(INDEX_FILE, 'r', encoding='utf-8') as f:
            html = f.read()
        
        original = html
        
        html = re.sub(r'<style>.*?@media.*?max-width.*?768px.*?</style>', '', html, flags=re.DOTALL)
        
        if mobile_fix_css not in html:
            html = html.replace('</head>', f'{mobile_fix_css}\n</head>')
        
        if '<meta name="viewport"' not in html:
            html = html.replace(
                '</head>',
                '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">\n</head>'
            )
        
        if html != original:
            with open(INDEX_FILE, 'w', encoding='utf-8') as f:
                f.write(html)
            print("✅ index.html محدّث\n")
    
    except Exception as e:
        print(f"⚠️ index.html: {e}\n")

# 3. إصلاح products-catalog.html
print("📚 إصلاح صفحة الكتالوج...")
if CATALOG_FILE.exists():
    try:
        with open(CATALOG_FILE, 'r', encoding='utf-8') as f:
            html = f.read()
        
        original = html
        
        html = re.sub(r'<style>.*?@media.*?max-width.*?768px.*?</style>', '', html, flags=re.DOTALL)
        
        if mobile_fix_css not in html:
            html = html.replace('</head>', f'{mobile_fix_css}\n</head>')
        
        if '<meta name="viewport"' not in html:
            html = html.replace(
                '</head>',
                '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">\n</head>'
            )
        
        if html != original:
            with open(CATALOG_FILE, 'w', encoding='utf-8') as f:
                f.write(html)
            print("✅ products-catalog.html محدّث\n")
    
    except Exception as e:
        print(f"⚠️ products-catalog.html: {e}\n")

print("="*60)
print("✅ اكتمل الإصلاح الشامل للموبايل!")
print("="*60)
print(f"\n📊 الإحصائيات:")
print(f"  ✅ صفحات المنتجات: {fixed_count}")
print(f"  ✅ الصفحة الرئيسية: محدّثة")
print(f"  ✅ الكتالوج: محدّث")
print(f"\n🎯 التحسينات:")
print(f"  ✅ صور بحجم مناسب (max 350px)")
print(f"  ✅ بطاقة واحدة في الصف")
print(f"  ✅ عناوين واضحة غير مقطوعة")
print(f"  ✅ أزرار كبيرة سهلة الضغط")
print(f"  ✅ لا overflow أفقي")
print(f"  ✅ viewport صحيح")
print(f"\n💡 بعد التحديث:")
print(f"  1. امسح كاش الموبايل")
print(f"  2. افتح الموقع في Incognito")
print(f"  3. التغييرات ستظهر فوراً!\n")
