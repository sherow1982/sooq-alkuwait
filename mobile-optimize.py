#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
حل مشكلة الكاش + تحسين عرض الجوال (بطاقة واحدة فقط)
"""

from pathlib import Path
import re
import time

PRODUCTS_DIR = Path("products-pages")
INDEX_FILE = Path("index.html")

# إضافة version parameter لجميع CSS/JS لكسر الكاش
cache_buster = str(int(time.time()))

mobile_optimization_css = f'''
<style>
/* تحسينات الجوال - بطاقة واحدة في الصف */
@media (max-width: 768px) {{
    .product-card,
    .catalog-item,
    .grid-item {{
        width: 100% !important;
        max-width: 100% !important;
        min-width: 100% !important;
        margin: 0 auto 20px auto !important;
    }}
    
    .products-grid,
    .catalog-grid {{
        grid-template-columns: 1fr !important;
        gap: 20px !important;
    }}
    
    .row .col-6,
    .row .col-md-4,
    .row .col-md-6,
    .row .col-lg-3,
    .row .col-lg-4 {{
        flex: 0 0 100% !important;
        max-width: 100% !important;
    }}
    
    /* Carousel على الجوال */
    .carousel-track .product-card {{
        min-width: 85% !important;
        max-width: 85% !important;
    }}
    
    .product-image img {{
        max-height: 300px !important;
        object-fit: contain !important;
    }}
}}

/* إضافة meta cache control */
</style>

<!-- Cache Buster Meta -->
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<meta name="version" content="{cache_buster}">
'''

fixed_count = 0

# تحديث صفحات المنتجات
for html_file in PRODUCTS_DIR.glob('*.html'):
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            html = f.read()
        
        original = html
        
        # إزالة CSS قديم للجوال
        html = re.sub(
            r'<style>.*?/\* تحسينات الجوال.*?</style>',
            '',
            html,
            flags=re.DOTALL
        )
        
        # إضافة CSS جديد
        if mobile_optimization_css not in html:
            html = html.replace('</head>', f'{mobile_optimization_css}\n</head>')
        
        # إضافة version لـ CSS/JS links
        html = re.sub(
            r'(<link[^>]*href="[^"]+\.css")>',
            rf'\1?v={cache_buster}>',
            html
        )
        html = re.sub(
            r'(<script[^>]*src="[^"]+\.js")>',
            rf'\1?v={cache_buster}>',
            html
        )
        
        if html != original:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(html)
            fixed_count += 1
    
    except Exception as e:
        print(f"⚠️ {html_file.name}: {e}")

# تحديث index.html
if INDEX_FILE.exists():
    try:
        with open(INDEX_FILE, 'r', encoding='utf-8') as f:
            html = f.read()
        
        original = html
        
        html = re.sub(
            r'<style>.*?/\* تحسينات الجوال.*?</style>',
            '',
            html,
            flags=re.DOTALL
        )
        
        if mobile_optimization_css not in html:
            html = html.replace('</head>', f'{mobile_optimization_css}\n</head>')
        
        html = re.sub(r'(<link[^>]*href="[^"]+\.css")>', rf'\1?v={cache_buster}>', html)
        html = re.sub(r'(<script[^>]*src="[^"]+\.js")>', rf'\1?v={cache_buster}>', html)
        
        if html != original:
            with open(INDEX_FILE, 'w', encoding='utf-8') as f:
                f.write(html)
            fixed_count += 1
            print("✅ index.html محدّث")
    
    except Exception as e:
        print(f"⚠️ index.html: {e}")

print("\n" + "="*60)
print("✅ اكتمل تحسين عرض الجوال!")
print("="*60)
print(f"\n📊 الإحصائيات:")
print(f"  ✅ تم التحديث: {fixed_count} صفحة")
print(f"\n🎯 التحسينات:")
print(f"  ✅ بطاقة واحدة فقط على الجوال")
print(f"  ✅ Cache Buster مضاف (v={cache_buster})")
print(f"  ✅ Meta tags لكسر الكاش")
print(f"  ✅ عرض احترافي على الجوال")
print(f"\n💡 ملاحظة:")
print(f"  • امسح كاش المتصفح على الجوال")
print(f"  • أو افتح الموقع في وضع Incognito\n")
