#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Google Analytics Injection Script
===================================
يحقن كود Google Analytics G-YQW5LL476X في جميع صفحات HTML دفعة واحدة
"""

import os
import re
from pathlib import Path

# كود Google Analytics المراد حقنه
GA_CODE = """    <!-- Google tag (gtag.js) - Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-YQW5LL476X"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-YQW5LL476X');
    </script>

"""

def inject_ga_to_file(file_path):
    """حقن Google Analytics في ملف HTML واحد"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # التحقق من عدم وجود الكود مسبقاً
        if 'G-YQW5LL476X' in content:
            print(f"⏭️  تخطي {file_path.name} - الكود موجود مسبقاً")
            return False

        # البحث عن <head> وحقن الكود مباشرة بعده
        if '<head>' in content:
            # حقن الكود بعد <head> مباشرة
            new_content = content.replace('<head>', f'<head>\n{GA_CODE}', 1)

            # حفظ الملف المعدل
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

            print(f"✅ تم حقن GA في {file_path.name}")
            return True
        else:
            print(f"⚠️  {file_path.name} - لا يحتوي على <head> tag")
            return False

    except Exception as e:
        print(f"❌ خطأ في {file_path.name}: {str(e)}")
        return False

def main():
    """الدالة الرئيسية"""
    print("=" * 60)
    print("🚀 Google Analytics Injection Script")
    print("=" * 60)

    # المسار الحالي (مسار الريبو)
    repo_path = Path.cwd()

    # قائمة الصفحات الأساسية
    main_pages = [
        '404.html', 'about.html', 'cart.html', 'categories.html',
        'checkout.html', 'contact.html', 'cookies.html', 'delivery.html',
        'offers.html', 'privacy-policy.html', 'products-catalog.html',
        'refund.html', 'return-policy.html', 'returns.html',
        'shipping-policy.html', 'shipping.html', 'terms-conditions.html',
        'terms.html', 'warranty-policy.html'
    ]

    # عداد الملفات المحدثة
    updated_count = 0
    skipped_count = 0

    # 1. حقن GA في الصفحات الأساسية
    print("\n📄 معالجة الصفحات الأساسية...")
    for page_name in main_pages:
        page_path = repo_path / page_name
        if page_path.exists():
            if inject_ga_to_file(page_path):
                updated_count += 1
            else:
                skipped_count += 1
        else:
            print(f"⚠️  {page_name} غير موجود")

    # 2. حقن GA في صفحات المنتجات
    products_dir = repo_path / 'products-pages'
    if products_dir.exists() and products_dir.is_dir():
        print("\n📦 معالجة صفحات المنتجات...")
        product_files = list(products_dir.glob('product-*.html'))

        total_products = len(product_files)
        print(f"إجمالي صفحات المنتجات: {total_products}")

        for i, product_file in enumerate(product_files, 1):
            if inject_ga_to_file(product_file):
                updated_count += 1
            else:
                skipped_count += 1

            # طباعة التقدم كل 100 ملف
            if i % 100 == 0:
                print(f"⏳ تقدم: {i}/{total_products} ({(i/total_products)*100:.1f}%)")

    # النتيجة النهائية
    print("\n" + "=" * 60)
    print("📊 ملخص النتائج:")
    print(f"   ✅ تم تحديث: {updated_count} ملف")
    print(f"   ⏭️  تم تخطي: {skipped_count} ملف")
    print(f"   📝 إجمالي: {updated_count + skipped_count} ملف")
    print("=" * 60)

    print("\n💡 الخطوات التالية:")
    print("   1. git add .")
    print('   2. git commit -m "Add Google Analytics to all pages"')
    print("   3. git push origin main")
    print("\n✅ تم الانتهاء!")

if __name__ == "__main__":
    main()
