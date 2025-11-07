#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
تحديث تصميم الصفحة الرئيسية والكتالوج للموبايل
"""

from pathlib import Path
import re

INDEX_FILE = Path("index.html")
CATALOG_FILE = Path("products-catalog.html")

# CSS موحد للموبايل
mobile_css = '''
<style>
/* تحسينات الموبايل الشاملة */
@media (max-width: 768px) {
    /* الصور */
    img {
        max-width: 100% !important;
        max-height: 300px !important;
        object-fit: contain !important;
    }
    
    /* بطاقات المنتجات - واحدة في الصف */
    .product-card,
    .catalog-item,
    .col-6,
    .col-md-4,
    .col-md-6,
    .col-lg-3,
    .col-lg-4 {
        width: 100% !important;
        max-width: 100% !important;
        flex: 0 0 100% !important;
        margin-bottom: 20px !important;
    }
    
    /* Grid يصبح Column */
    .products-grid,
    .row {
        display: flex !important;
        flex-direction: column !important;
    }
    
    /* الأزرار */
    .btn, button {
        width: 100% !important;
        font-size: 1.1rem !important;
        padding: 15px !important;
    }
    
    /* العناوين */
    h1 { font-size: 1.6rem !important; }
    h2 { font-size: 1.4rem !important; }
    h3 { font-size: 1.2rem !important; }
    
    /* Container */
    .container {
        padding: 15px !important;
    }
    
    /* Navbar */
    .navbar-brand {
        font-size: 1.3rem !important;
    }
    
    /* No horizontal scroll */
    body {
        overflow-x: hidden !important;
    }
}
</style>
'''

# تحديث index.html
if INDEX_FILE.exists():
    print("\n🏠 تحديث الصفحة الرئيسية...")
    try:
        with open(INDEX_FILE, 'r', encoding='utf-8') as f:
            html = f.read()
        
        # إزالة CSS قديم
        html = re.sub(r'<style>.*?@media.*?max-width.*?768px.*?</style>', '', html, flags=re.DOTALL)
        
        # إضافة CSS جديد
        if mobile_css not in html:
            html = html.replace('</head>', f'{mobile_css}\n</head>')
        
        # viewport
        if '<meta name="viewport"' not in html:
            html = html.replace('</head>', '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n</head>')
        
        with open(INDEX_FILE, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print("✅ index.html محدّث\n")
    except Exception as e:
        print(f"⚠️ خطأ: {e}\n")

# تحديث products-catalog.html
if CATALOG_FILE.exists():
    print("📚 تحديث صفحة الكتالوج...")
    try:
        with open(CATALOG_FILE, 'r', encoding='utf-8') as f:
            html = f.read()
        
        html = re.sub(r'<style>.*?@media.*?max-width.*?768px.*?</style>', '', html, flags=re.DOTALL)
        
        if mobile_css not in html:
            html = html.replace('</head>', f'{mobile_css}\n</head>')
        
        if '<meta name="viewport"' not in html:
            html = html.replace('</head>', '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n</head>')
        
        with open(CATALOG_FILE, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print("✅ products-catalog.html محدّث\n")
    except Exception as e:
        print(f"⚠️ خطأ: {e}\n")

print("="*60)
print("✅ اكتمل تحديث الصفحة الرئيسية والكتالوج!")
print("="*60)
print(f"\n🎯 التحسينات:")
print(f"  ✅ بطاقة واحدة في الصف على الجوال")
print(f"  ✅ صور بحجم مناسب")
print(f"  ✅ عناوين واضحة")
print(f"  ✅ أزرار كبيرة")
print(f"  ✅ لا scroll أفقي\n")
