#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
إضافة Meta Tags لإصلاح مشكلة Desktop في جميع صفحات HTML
"""

from pathlib import Path
import re

print("🔧 إضافة Meta Tags لإصلاح Desktop...")

# الكود المراد إضافته
META_TAGS = '''
<!-- Google Merchant Center Desktop Fix -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
<meta name="mobile-web-app-capable" content="yes">
<style>
html,body{margin:0;padding:0;min-width:320px;max-width:100%;overflow-x:hidden}
@media (min-width:1024px){body{min-width:1024px;max-width:1920px;margin:0 auto}}
@media (min-width:768px) and (max-width:1023px){body{min-width:768px}}
@media (max-width:767px){body{min-width:320px}}
</style>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "سوق الكويت",
  "url": "https://sooq-alkuwait.arabsad.com",
  "telephone": "+201110760081",
  "email": "sherow1982@gmail.com",
  "address": {"@type": "PostalAddress","addressCountry": "KW"}
}
</script>
'''

def add_meta_tags(file_path):
    """إضافة Meta Tags إلى ملف HTML"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # تحقق إذا كان الكود موجود بالفعل
        if 'Google Merchant Center Desktop Fix' in content:
            return False
        
        # البحث عن </head>
        if '</head>' in content:
            # إضافة الكود قبل </head>
            content = content.replace('</head>', META_TAGS + '\n</head>')
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        else:
            print(f"⚠️  لم يتم العثور على </head> في: {file_path}")
            return False
    except Exception as e:
        print(f"❌ خطأ في {file_path}: {e}")
        return False

# قائمة الملفات المراد تحديثها
files_to_update = [
    'index.html',
    'products-catalog.html',
    'categories.html',
    'offers.html',
    'return-policy.html',
    'shipping-policy.html',
    'warranty-policy.html'
]

# تحديث الملفات الرئيسية
updated = 0
for filename in files_to_update:
    file_path = Path(filename)
    if file_path.exists():
        if add_meta_tags(file_path):
            print(f"✅ {filename}")
            updated += 1
        else:
            print(f"⏭️  {filename} (موجود بالفعل)")
    else:
        print(f"⚠️  {filename} غير موجود")

# تحديث صفحات المنتجات
products_dir = Path('products-pages')
if products_dir.exists():
    print(f"\n📁 تحديث صفحات المنتجات...")
    product_files = list(products_dir.glob('*.html'))
    
    print(f"   عدد الصفحات: {len(product_files)}")
    
    products_updated = 0
    for i, file_path in enumerate(product_files, 1):
        if add_meta_tags(file_path):
            products_updated += 1
        
        if i % 200 == 0:
            print(f"   ✅ {i} صفحة...")
    
    print(f"   ✅ تم تحديث {products_updated} صفحة منتج")
    updated += products_updated
else:
    print(f"\n⚠️  مجلد products-pages غير موجود")

print(f"\n✨ اكتمل!")
print(f"📊 إجمالي الملفات المحدثة: {updated}")
print(f"\n🎯 الخطوة التالية: ارفع التحديثات إلى GitHub")
