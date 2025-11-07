#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
<<<<<<< HEAD
🛒 إضافة زر السلة العائم لجميع صفحات المنتجات
=======
🛍️ إضافة زر السلة العائم لجميع صفحات المنتجات
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
"""

import os
import re

<<<<<<< HEAD
print("🛒 بدء إضافة زر السلة العائم لصفحات المنتجات...")
=======
print("🛍️ بدء إضافة زر السلة العائم لصفحات المنتجات...")
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
print("=" * 80)

products_dir = "products-pages"

if not os.path.exists(products_dir):
    print(f"❌ خطأ: مجلد {products_dir} غير موجود!")
    exit(1)

html_files = [f for f in os.listdir(products_dir) if f.startswith('product-') and f.endswith('.html')]

print(f"📊 عدد الملفات: {len(html_files)}")
print("-" * 80)

<<<<<<< HEAD
# الكود المطلوب إضافته قبل </body>
floating_cart_code = """
    <!-- زر السلة العائم + زر العودة للأعلى -->
    <link rel="stylesheet" href="../floating-cart.css">
    <script src="../floating-cart.js"></script>

    <!-- زر العودة للأعلى -->
    <button id="back-to-top" onclick="scrollToTop()" style="position: fixed; bottom: 30px; left: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; width: 50px; height: 50px; border-radius: 50%; border: none; font-size: 1.5em; cursor: pointer; box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4); transition: all 0.3s; z-index: 999; display: none;">
        <i class="fas fa-arrow-up"></i>
    </button>

    <script>
        // زر العودة للأعلى
=======
floating_cart_code = '''
    <!-- زر السلة العائم + زر العودة للأعلى -->
    <link rel="stylesheet" href="../floating-cart.css">
    <script src="../floating-cart.js"></script>
    
    <!-- زر العودة للأعلى -->
    <button id="back-to-top" onclick="scrollToTop()" style="position: fixed; bottom: 30px; left: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; width: 50px; height: 50px; border-radius: 50%; border: none; font-size: 1.5em; cursor: pointer; box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4); transition: all 0.3s; z-index: 999; display: none; align-items: center; justify-content: center;">
        <i class="fas fa-arrow-up"></i>
    </button>
    
    <script>
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
        window.addEventListener('scroll', function() {
            const backToTop = document.getElementById('back-to-top');
            if (backToTop && window.pageYOffset > 300) {
                backToTop.style.display = 'flex';
<<<<<<< HEAD
                backToTop.style.alignItems = 'center';
                backToTop.style.justifyContent = 'center';
=======
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
            } else if (backToTop) {
                backToTop.style.display = 'none';
            }
        });
<<<<<<< HEAD

=======
        
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    </script>
<<<<<<< HEAD
"""
=======
'''
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43

updated_count = 0
skipped_count = 0

for filename in html_files:
    filepath = os.path.join(products_dir, filename)
<<<<<<< HEAD

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # فحص إذا كان الزر موجود مسبقاً
        if 'floating-cart.css' in content or 'floating-cart.js' in content:
            skipped_count += 1
            continue

        # إضافة الكود قبل </body>
        if '</body>' in content:
            updated_content = content.replace('</body>', floating_cart_code + '\n</body>')

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(updated_content)

            updated_count += 1

=======
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'floating-cart.css' in content or 'floating-cart.js' in content:
            skipped_count += 1
            continue
        
        if '</body>' in content:
            updated_content = content.replace('</body>', floating_cart_code + '\n</body>')
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            
            updated_count += 1
            
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
            if updated_count % 100 == 0:
                print(f"✓ تم تحديث {updated_count} ملف...")
        else:
            print(f"⚠️ {filename}: لا يحتوي على </body>")
            skipped_count += 1
<<<<<<< HEAD

=======
    
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
    except Exception as e:
        print(f"❌ خطأ في {filename}: {e}")
        skipped_count += 1

print("\n" + "=" * 80)
print("✅ تم إضافة زر السلة العائم!")
print("=" * 80)
print(f"📊 ملفات محدّثة: {updated_count}")
print(f"⏭️  ملفات متخطاة: {skipped_count}")
print(f"📈 النسبة: {updated_count/len(html_files)*100:.1f}%")
print("=" * 80)
print("\n🚀 الخطوة التالية:")
print("   git add products-pages/")
print("   git commit -m 'Add floating cart to all product pages'")
print("   git push origin main")
print("")
