#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
إلغاء جميع التحديثات الأخيرة والرجوع لحالة مستقرة
"""

from pathlib import Path
import re

PRODUCTS_DIR = Path("products-pages")
INDEX_FILE = Path("index.html")

fixed_count = 0

print("\n" + "="*60)
print("🔄 إلغاء التحديثات الأخيرة...")
print("="*60 + "\n")

# إزالة جميع الإضافات الأخيرة من صفحات المنتجات
for html_file in PRODUCTS_DIR.glob('*.html'):
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            html = f.read()
        
        original = html
        
        # 1. إزالة Hero Carousel
        html = re.sub(
            r'<!-- Hero Carousel.*?</script>',
            '',
            html,
            flags=re.DOTALL
        )
        
        # 2. إزالة قسم المنتجات المقترحة
        html = re.sub(
            r'<!-- قسم المنتجات المقترحة -->.*?</script>',
            '',
            html,
            flags=re.DOTALL
        )
        
        # 3. إزالة CSS تحسينات الجوال الأخيرة
        html = re.sub(
            r'<style>.*?/\* تحسينات الجوال.*?</style>',
            '',
            html,
            flags=re.DOTALL
        )
        
        # 4. إزالة Cache Buster Meta
        html = re.sub(
            r'<!-- Cache Buster Meta -->.*?<meta name="version"[^>]*>',
            '',
            html,
            flags=re.DOTALL
        )
        
        # 5. إزالة version parameters من CSS/JS
        html = re.sub(r'\?v=\d+', '', html)
        
        # 6. إزالة whatsapp-order-section المكررة
        html = re.sub(
            r'<div class="whatsapp-order-section".*?</style>',
            '',
            html,
            flags=re.DOTALL
        )
        
        # حفظ
        if html != original:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(html)
            fixed_count += 1
    
    except Exception as e:
        print(f"⚠️ {html_file.name}: {e}")

print(f"✅ تم إلغاء التحديثات من {fixed_count} صفحة منتج\n")

# تنظيف index.html
if INDEX_FILE.exists():
    try:
        with open(INDEX_FILE, 'r', encoding='utf-8') as f:
            html = f.read()
        
        original = html
        
        # إزالة Hero Carousel
        html = re.sub(
            r'<!-- Hero Carousel.*?</script>',
            '',
            html,
            flags=re.DOTALL
        )
        
        # إزالة CSS/Meta إضافية
        html = re.sub(r'<style>.*?/\* تحسينات الجوال.*?</style>', '', html, flags=re.DOTALL)
        html = re.sub(r'<!-- Cache Buster.*?<meta name="version"[^>]*>', '', html, flags=re.DOTALL)
        html = re.sub(r'\?v=\d+', '', html)
        
        if html != original:
            with open(INDEX_FILE, 'w', encoding='utf-8') as f:
                f.write(html)
            print("✅ تم تنظيف index.html\n")
    
    except Exception as e:
        print(f"⚠️ index.html: {e}")

print("="*60)
print("✅ اكتمل الإلغاء!")
print("="*60)
print(f"\n📊 النتيجة:")
print(f"  ✅ تم تنظيف: {fixed_count + 1} صفحة")
print(f"\n🎯 ما تم إلغاؤه:")
print(f"  ❌ Hero Carousel")
print(f"  ❌ المنتجات المقترحة")
print(f"  ❌ CSS الجوال الإضافي")
print(f"  ❌ Cache Busters")
print(f"\n✅ الموقع رجع لحالة مستقرة!")
print(f"\n💡 الآن يمكنك:")
print(f"  1. تجربة الموقع على الجوال")
print(f"  2. إضافة التحسينات تدريجياً")
print(f"  3. اختبار كل تحديث قبل التالي\n")
