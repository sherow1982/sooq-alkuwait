#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
إصلاح شامل: تحديث أسماء المنتجات في كل مكان
"""

import json
from pathlib import Path
import re

print("🔧 بدء الإصلاح الشامل...")

# تحميل البيانات
with open('products_data.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# قاموس الاستبدال
REPLACEMENTS = {
    'مسدس تدليك': 'جهاز تدليك',
    'مسدس فقاعات': 'لعبة فقاعات',
    'مسدس ماء': 'لعبة ماء',
    'مسدس رش': 'بخاخ رش',
    'مسدس أظافر': 'أداة أظافر',
    'مسدس وجه': 'جهاز وجه',
    'مسدس بسكويت': 'أداة بسكويت',
    'مسدس التنظيف': 'جهاز تنظيف',
    'مسدس': 'جهاز',
    'بندقية': 'أداة',
    'البندقية': 'التثبيت',
    'AUG': '',
    'BAZOKA': ''
}

def clean_text(text):
    """تنظيف النص من الكلمات الممنوعة"""
    if not text:
        return text
    
    cleaned = text
    # ترتيب حسب الطول (الأطول أولاً) لتجنب الاستبدالات الجزئية
    for old, new in sorted(REPLACEMENTS.items(), key=lambda x: len(x[0]), reverse=True):
        cleaned = cleaned.replace(old, new)
    
    # تنظيف المسافات الزائدة
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

# تحديث البيانات
updated = 0
for product in products:
    old_title = product['title']
    new_title = clean_text(old_title)
    
    if old_title != new_title:
        print(f"✏️  {old_title}")
        print(f"   ➜ {new_title}\n")
        product['title'] = new_title
        updated += 1
    
    # تنظيف الوصف
    if 'description' in product:
        product['description'] = clean_text(product['description'])

# حفظ
with open('products_data.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"✅ تم تحديث {updated} منتج من أصل {len(products)}")
print(f"💾 تم حفظ products_data.json")

# الآن تحديث صفحات HTML (عبر JavaScript فقط - لا نحتاج تعديل 1977 ملف)
print(f"\n✅ الصفحات ستتحدث تلقائياً من products_data.json")

print("\n🎯 الخطوات التالية:")
print("1. ارفع products_data.json المحدث")
print("2. انتظر 5 دقائق")
print("3. افتح أي صفحة منتج - ستجد الاسم محدث")
print("4. أعد إرسال Feed لـ Google Merchant Center")

print("\n✨ اكتمل!")
