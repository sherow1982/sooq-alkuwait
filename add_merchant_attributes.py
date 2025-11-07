#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🏪 إضافة سمات Google Merchant Center لجميع المنتجات
- availability: in stock
- condition: new
"""

import os
import re

print("🏪 بدء إضافة سمات Google Merchant Center...")
print("=" * 80)

products_dir = "products-pages"

if not os.path.exists(products_dir):
    print(f"❌ خطأ: مجلد {products_dir} غير موجود!")
    exit(1)

html_files = [f for f in os.listdir(products_dir) if f.startswith('product-') and f.endswith('.html')]

print(f"📊 عدد الملفات: {len(html_files)}")
print("-" * 80)

updated_count = 0
skipped_count = 0

for filename in html_files:
    filepath = os.path.join(products_dir, filename)
<<<<<<< HEAD

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        modified = False

        # 1. إضافة availability في Schema.org
        if '"availability":' in content:
            # موجود مسبقاً - تحديثه
=======
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        modified = False
        
        # 1. إضافة availability في Schema.org
        if '"availability":' in content:
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
            if 'InStock' not in content and 'in stock' not in content.lower():
                content = re.sub(
                    r'"availability"\s*:\s*"[^"]*"',
                    '"availability": "https://schema.org/InStock"',
                    content
                )
                modified = True
        else:
<<<<<<< HEAD
            # إضافة جديد في Schema.org
=======
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
            content = re.sub(
                r'("itemCondition"\s*:\s*"[^"]*")',
                r'\1,\n            "availability": "https://schema.org/InStock"',
                content
            )
            modified = True
<<<<<<< HEAD

=======
        
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
        # 2. التأكد من condition = NewCondition
        if '"itemCondition":' in content:
            if 'NewCondition' not in content:
                content = re.sub(
                    r'"itemCondition"\s*:\s*"[^"]*"',
                    '"itemCondition": "https://schema.org/NewCondition"',
                    content
                )
                modified = True
        else:
<<<<<<< HEAD
            # إضافة condition
=======
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
            content = re.sub(
                r'("price"\s*:\s*"[^"]*")',
                r'\1,\n            "itemCondition": "https://schema.org/NewCondition"',
                content
            )
            modified = True
<<<<<<< HEAD

=======
        
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
        # 3. إضافة meta tags
        if '<meta property="product:availability"' not in content:
            meta_availability = '    <meta property="product:availability" content="in stock">\n'
            meta_condition = '    <meta property="product:condition" content="new">\n'
<<<<<<< HEAD

            # إضافة قبل </head>
            if '</head>' in content:
                content = content.replace('</head>', meta_availability + meta_condition + '</head>')
                modified = True

        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

            updated_count += 1

=======
            
            if '</head>' in content:
                content = content.replace('</head>', meta_availability + meta_condition + '</head>')
                modified = True
        
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            updated_count += 1
            
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
            if updated_count % 100 == 0:
                print(f"✓ تم تحديث {updated_count} ملف...")
        else:
            skipped_count += 1
<<<<<<< HEAD

=======
    
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
    except Exception as e:
        print(f"❌ خطأ في {filename}: {e}")
        skipped_count += 1

print("\n" + "=" * 80)
print("✅ تم إضافة سمات Google Merchant!")
print("=" * 80)
print(f"📊 ملفات محدّثة: {updated_count}")
print(f"⏭️  ملفات متخطاة: {skipped_count}")
print(f"📈 النسبة: {updated_count/len(html_files)*100:.1f}%")
print("=" * 80)
print("\n🎯 السمات المضافة:")
print("   ✓ availability: in stock (Schema.org)")
print("   ✓ condition: new (Schema.org)")
print("   ✓ meta tags للـ availability و condition")
<<<<<<< HEAD
print("\n🚀 الخطوة التالية:")
print("   python generate_seo_files.py")
print("   git add products-pages/")
print("   git commit -m 'Add Google Merchant attributes'")
print("   git push origin main")
=======
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
print("")
