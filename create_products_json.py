#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
📦 سكريبت محسّن لإنشاء products_data.json
✅ استخراج متعدد للصور من مصادر مختلفة
"""

import os
import re
import json

print("🔧 بدء إنشاء ملف products_data.json المحسّن...")
print("=" * 80)

products_dir = "products-pages"

if not os.path.exists(products_dir):
    print(f"❌ خطأ: مجلد {products_dir} غير موجود!")
    exit(1)

products_data = []
html_files = [f for f in os.listdir(products_dir) if f.startswith('product-') and f.endswith('.html')]

print(f"📊 عدد الملفات: {len(html_files)}")
print("-" * 80)

product_files = []
for filename in html_files:
    match = re.match(r'product-(\d+)', filename)
    if match:
        product_id = int(match.group(1))
        product_files.append({'id': product_id, 'filename': filename})

product_files.sort(key=lambda x: x['id'])

print(f"✅ تم العثور على {len(product_files)} منتج")
print(f"📊 النطاق: {product_files[0]['id']} - {product_files[-1]['id']}")
print("-" * 80)
print("\n📦 جاري معالجة المنتجات...\n")

for idx, item in enumerate(product_files, 1):
    product_id = item['id']
    filename = item['filename']
    filepath = os.path.join(products_dir, filename)

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
<<<<<<< HEAD

            # استخراج العنوان
            title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', content)
            title = title_match.group(1).strip() if title_match else f"منتج {product_id}"

            # استخراج السعر بعد الخصم
            sale_price_match = re.search(r'<span class="price-current-pro">([\d.]+)', content)
            sale_price = float(sale_price_match.group(1)) if sale_price_match else 10.00

            # استخراج السعر الأصلي
            original_price_match = re.search(r'<span class="price-old-pro">([\d.]+)', content)
            original_price = float(original_price_match.group(1)) if original_price_match else sale_price * 1.3

            # استخراج رابط الصورة
            image_match = re.search(r'<img[^>]+src="([^"]+)"[^>]*class="product-image-main-pro"', content)
            image_link = image_match.group(1) if image_match else ""

            # استخراج الوصف
=======
            
            # العنوان
            title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', content)
            title = title_match.group(1).strip() if title_match else f"منتج {product_id}"
            
            # السعر
            sale_price_match = re.search(r'<span class="(?:sale-price|price-current-pro)">([\d.]+)', content)
            sale_price = float(sale_price_match.group(1)) if sale_price_match else 10.00
            
            original_price_match = re.search(r'<span class="(?:original-price|price-old-pro)">([\d.]+)', content)
            original_price = float(original_price_match.group(1)) if original_price_match else sale_price * 1.3
            
            # 🔍 استخراج الصورة من مصادر متعددة
            image_link = ""
            
            # 1. class="product-image-main-pro"
            image_match1 = re.search(r'<img[^>]+src="([^"]+)"[^>]*class="product-image-main-pro"', content)
            if image_match1:
                image_link = image_match1.group(1)
            
            # 2. class="product-image"
            if not image_link:
                image_match2 = re.search(r'<img[^>]+class="product-image"[^>]+src="([^"]+)"', content)
                if image_match2:
                    image_link = image_match2.group(1)
            
            # 3. og:image
            if not image_link:
                og_image_match = re.search(r'<meta property="og:image" content="([^"]+)"', content)
                if og_image_match:
                    image_link = og_image_match.group(1)
            
            # 4. Schema.org
            if not image_link:
                schema_image_match = re.search(r'"image"\s*:\s*"([^"]+)"', content)
                if schema_image_match:
                    image_link = schema_image_match.group(1)
            
            # 5. أي img src في المحتوى
            if not image_link:
                any_image_match = re.search(r'<img[^>]+src="(https://[^"]+)"', content)
                if any_image_match:
                    image_link = any_image_match.group(1)
            
            # الوصف
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
            desc_match = re.search(r'<div class="product-description-pro">\s*<p>([^<]+)</p>', content)
            if not desc_match:
                desc_match = re.search(r'<meta name="description" content="([^"]+)"', content)
            description = desc_match.group(1).strip() if desc_match else title
<<<<<<< HEAD

            # إضافة البيانات مع اسم الملف الحقيقي
=======
            
            # الفئة
            category = ""
            category_match = re.search(r'href="[^"]*categories/([^"]+)\.html"', content)
            if category_match:
                category = category_match.group(1).replace('-', ' ')
            
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
            products_data.append({
                "id": product_id,
                "title": title,
                "price": round(original_price, 2),
                "sale_price": round(sale_price, 2),
                "image_link": image_link,
                "product_link": f"products-pages/{filename}",
                "filename": filename,
                "description": description[:500],
                "availability": "in stock",
                "condition": "new",
                "brand": "سوق الكويت",
                "category": category if category else "منتجات عامة",
                "currency": "KWD",
                "shipping": {
                    "country": "KW",
                    "service": "Standard",
                    "price": 0.00
                }
            })
<<<<<<< HEAD

            # عرض التقدم
=======
            
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
            if idx % 100 == 0:
                print(f"✓ معالجة {idx}/{len(product_files)} منتج...")

    except Exception as e:
        print(f"❌ خطأ في {filename}: {e}")

print("\n💾 حفظ البيانات...")

with open('products_data.json', 'w', encoding='utf-8') as f:
    json.dump(products_data, f, ensure_ascii=False, indent=2)

# إحصائيات
images_found = sum(1 for p in products_data if p['image_link'])
images_missing = len(products_data) - images_found

print("-" * 80)
print(f"✅ تم إنشاء products_data.json بنجاح!")
print(f"📊 عدد المنتجات: {len(products_data)}")
print(f"🖼️  صور موجودة: {images_found} ({images_found/len(products_data)*100:.1f}%)")
print(f"⚠️  صور مفقودة: {images_missing} ({images_missing/len(products_data)*100:.1f}%)")
print(f"💾 حجم الملف: {os.path.getsize('products_data.json') / 1024:.2f} KB")
print("=" * 80)

if images_missing > 0:
    print(f"\n⚠️  تحذير: {images_missing} منتج بدون صورة")
    print("   سيتم عرض placeholder بديل لها")

print("\n🚀 الخطوة التالية: python generate_seo_files.py")
print("")
