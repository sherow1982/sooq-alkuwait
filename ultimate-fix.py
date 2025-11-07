#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔥 السكريبت الشامل - يحل كل المشاكل
✅ إصلاح زر الشراء (addToCart)
✅ إضافة زر السلة العائم
✅ إضافة سمات Google Merchant
"""

import os
import re

print("=" * 80)
print("🚀 السكريبت الشامل - إصلاح كل شيء")
print("=" * 80)

products_dir = "products-pages"

if not os.path.exists(products_dir):
    print(f"❌ خطأ: مجلد {products_dir} غير موجود!")
    exit(1)

html_files = [f for f in os.listdir(products_dir) if f.startswith('product-') and f.endswith('.html')]
print(f"\n📦 معالجة {len(html_files)} صفحة منتج...")
print("-" * 80)

floating_elements = '''\n    <!-- زر السلة العائم + زر العودة للأعلى -->\n    <link rel="stylesheet" href="../floating-cart.css">\n    <script src="../floating-cart.js"></script>\n    \n    <button id="back-to-top" onclick="scrollToTop()" style="position: fixed; bottom: 30px; left: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; width: 50px; height: 50px; border-radius: 50%; border: none; font-size: 1.5em; cursor: pointer; box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4); transition: all 0.3s; z-index: 999; display: none; align-items: center; justify-content: center;">\n        <i class="fas fa-arrow-up"></i>\n    </button>\n    \n    <script>\n        window.addEventListener(\'scroll\', function() {\n            const backToTop = document.getElementById(\'back-to-top\');\n            if (backToTop && window.pageYOffset > 300) {\n                backToTop.style.display = \'flex\';\n            } else if (backToTop) {\n                backToTop.style.display = \'none\';\n            }\n        });\n        \n        function scrollToTop() {\n            window.scrollTo({ top: 0, behavior: \'smooth\' });\n        }\n    </script>\n'''

updated_count = 0

for filename in html_files:
    filepath = os.path.join(products_dir, filename)
    id_match = re.match(r'product-(\d+)', filename)
    if not id_match:
        continue
    
    product_id = id_match.group(1)
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        modified = False
        
        # إضافة onclick للزر
        if 'class="buy-button"' in content and 'onclick="addToCart(' not in content:
            content = re.sub(
                r'(<button[^>]*class="buy-button"[^>]*)(>)',
                rf'\1 onclick="addToCart({product_id})"\2',
                content,
                count=1
            )
            modified = True
        
        # إضافة زر السلة
        if 'floating-cart.js' not in content and '</body>' in content:
            content = content.replace('</body>', floating_elements + '</body>')
            modified = True
        
        # سمات Google Merchant
        if '<meta property="product:availability"' not in content and '</head>' in content:
            meta_tags = '    <meta property="product:availability" content="in stock">\n    <meta property="product:condition" content="new">\n'
            content = content.replace('</head>', meta_tags + '</head>')
            modified = True
        
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            updated_count += 1
            
            if updated_count % 100 == 0:
                print(f"   ✓ {updated_count} ملف...")
    
    except Exception as e:
        print(f"   ❌ {filename}: {e}")

print(f"\n✅ تم تحديث {updated_count} صفحة منتج")
print("=" * 80)
print("\n🚀 الخطوة التالية:")
print("   git add .")
print("   git commit -m 'Fix all products'")
print("   git push origin main")
print("")
