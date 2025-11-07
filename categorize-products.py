#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
إنشاء نظام فئات دقيق للمنتجات بالذكاء الاصطناعي
"""

from pathlib import Path
import re
from collections import defaultdict
import json

PRODUCTS_DIR = Path("products-pages")
SITE_URL = "https://sooq-alkuwait.arabsad.com"

# قاموس الفئات والكلمات المفتاحية
CATEGORIES = {
    "الإلكترونيات": ["سماعات", "شاحن", "كابل", "باور بانك", "كاميرا", "مايك", "موبايل", "تابلت"],
    "المطبخ والأواني": ["طقم", "قدر", "مقلاة", "سكاكين", "أواني", "طبخ", "مطبخ", "كاسات", "أكواب"],
    "الجمال والعناية": ["كريم", "سيروم", "ماسك", "شامبو", "عطر", "مكياج", "بشرة", "شعر"],
    "المنزل والديكور": ["رف", "منظم", "حامل", "مصباح", "ستارة", "وسادة", "سجادة"],
    "الملابس والإكسسوارات": ["حقيبة", "محفظة", "ساعة", "قبعة", "حزام", "شنطة"],
    "الأطفال والألعاب": ["لعبة", "أطفال", "طفل", "طفولة", "حصالة", "كرتون"],
    "الرياضة واللياقة": ["رياضة", "لياقة", "تمارين", "دامبل", "ميزان", "جري"],
    "السيارات والإكسسوارات": ["سيارة", "كار", "حامل موبايل", "عطر سيارة", "مساحات"],
    "الصحة والعافية": ["صحة", "طبي", "علاج", "فيتامين", "مساج", "ضغط"],
    "الحيوانات الأليفة": ["قطط", "كلاب", "حيوان", "أليف", "pet"],
}

# تحليل المنتجات وتصنيفها
categorized = defaultdict(list)
uncategorized = []

for html_file in PRODUCTS_DIR.glob('*.html'):
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            html = f.read()
        
        title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', html)
        title = title_match.group(1).strip() if title_match else html_file.stem
        title_lower = title.lower()
        
        price_match = re.search(r'<span class="sale-price">([0-9.]+)', html)
        price = price_match.group(1) if price_match else "0"
        
        img_match = re.search(r'<meta property="og:image" content="([^"]+)"', html)
        if not img_match:
            img_match = re.search(r'<img[^>]*src="([^"]+)"', html)
        image = img_match.group(1) if img_match else ""
        
        from urllib.parse import quote
        filename = quote(html_file.name)
        url = f"{SITE_URL}/products-pages/{filename}"
        
        product_info = {
            'title': title,
            'price': price,
            'image': image,
            'url': url,
            'file': html_file.name
        }
        
        # البحث عن الفئة المناسبة
        matched = False
        for category, keywords in CATEGORIES.items():
            if any(keyword in title_lower for keyword in keywords):
                categorized[category].append(product_info)
                matched = True
                break
        
        if not matched:
            uncategorized.append(product_info)
    
    except Exception as e:
        print(f"⚠️ {html_file.name}: {e}")

# حفظ النتائج
categories_data = {
    'categories': dict(categorized),
    'uncategorized': uncategorized
}

with open('categories-data.json', 'w', encoding='utf-8') as f:
    json.dump(categories_data, f, ensure_ascii=False, indent=2)

# طباعة الإحصائيات
print("\n" + "="*60)
print("✅ اكتمل تصنيف المنتجات!")
print("="*60)
print(f"\n📊 إحصائيات التصنيف:\n")

total = 0
for category, products in sorted(categorized.items(), key=lambda x: len(x[1]), reverse=True):
    count = len(products)
    total += count
    print(f"  📁 {category}: {count} منتج")

print(f"\n  ❓ غير مصنّف: {len(uncategorized)} منتج")
print(f"  📦 الإجمالي: {total + len(uncategorized)} منتج")

print(f"\n💾 تم حفظ البيانات في: categories-data.json")
print(f"\n💡 الخطوة التالية:")
print(f"   استخدم هذه البيانات لإنشاء:")
print(f"   • صفحات الفئات")
print(f"   • قائمة تصفح حسب الفئة")
print(f"   • فلترة المنتجات\n")
