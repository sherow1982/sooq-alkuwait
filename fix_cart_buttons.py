#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت إصلاح أزرار السلة في صفحات المنتجات - سوق الكويت
يقوم بإضافة نظام السلة المحسن لجميع صفحات المنتجات تلقائياً
بدون تغيير أي محتوى أو بيانات المنتجات
"""

import os
import re
from datetime import datetime

def fix_product_page(file_path):
    """إصلاح ملف منتج واحد"""
    try:
        print(f"🔧 معالجة: {os.path.basename(file_path)}")
        
        # قراءة الملف
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = []
        
        # 1. إضافة مرجع لملف JavaScript المحسن قبل </body>
        if '../assets/js/cart-fixed.js' not in content and 'assets/js/cart-fixed.js' not in content:
            cart_script = '    <!-- تحميل نظام السلة المحسن -->\n    <script src="../assets/js/cart-fixed.js"></script>'
            content = content.replace('</body>', f'{cart_script}\n</body>')
            changes_made.append("إضافة مرجع السلة المحسن")
        
        # 2. إصلاح أزرار onclick="addToCart(ID)" لتصبح data-product-id
        onclick_pattern = r'onclick="addToCart\((\d+)\)"'
        if re.search(onclick_pattern, content):
            content = re.sub(onclick_pattern, r'data-product-id="\1" type="button"', content)
            changes_made.append("تحويل onclick إلى data-product-id")
        
        onclick_semicolon_pattern = r'onclick="addToCart\((\d+)\);"'
        if re.search(onclick_semicolon_pattern, content):
            content = re.sub(onclick_semicolon_pattern, r'data-product-id="\1" type="button"', content)
            changes_made.append("تحويل onclick مع semicolon")
        
        # 3. البحث عن أزرار الشراء وإضافة class="buy-button"
        button_patterns = [
            (r'<button([^>]*?)(?:اشتري|شراء|أضف للسلة|اطلب)([^>]*?)>', 'زر شراء عام'),
            (r'<button([^>]*?)data-product-id="(\d+)"([^>]*?)>', 'زر مع معرف المنتج'),
        ]
        
        for pattern, desc in button_patterns:
            buttons = re.findall(pattern, content, re.IGNORECASE)
            if buttons:
                # إضافة class="buy-button" إذا لم يكن موجوداً
                def add_buy_button_class(match):
                    full_match = match.group(0)
                    if 'class=' in full_match:
                        if 'buy-button' not in full_match:
                            # إضافة buy-button للـ class الموجود
                            return re.sub(r'class="([^"]*)"', r'class="\1 buy-button"', full_match)
                    else:
                        # إضافة class="buy-button" جديد
                        return full_match.replace('>', ' class="buy-button">')
                    return full_match
                
                content = re.sub(pattern, add_buy_button_class, content, flags=re.IGNORECASE)
                if pattern in content:
                    changes_made.append(f"تحسين {desc}")
        
        # 4. التأكد من وجود عداد السلة في navbar
        if 'cart-count' not in content and 'السلة' in content:
            # إضافة عداد السلة لروابط السلة
            cart_link_pattern = r'(<a[^>]*href="[^"]*cart\.html"[^>]*>.*?السلة.*?</a>)'
            def add_cart_counter(match):
                link = match.group(1)
                if 'cart-count' not in link:
                    return link.replace('السلة', 'السلة <span class="badge bg-danger cart-count" id="cart-count" style="display: none;">0</span>')
                return link
            
            if re.search(cart_link_pattern, content, re.DOTALL):
                content = re.sub(cart_link_pattern, add_cart_counter, content, flags=re.DOTALL)
                changes_made.append("إضافة عداد السلة")
        
        # حفظ الملف إذا تغير المحتوى
        if content != original_content and changes_made:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✅ التحسينات: {', '.join(changes_made)}")
            return True
        else:
            print(f"  ⚪ لا يحتاج إصلاح")
            return False
            
    except Exception as e:
        print(f"  ❌ خطأ في معالجة {file_path}: {e}")
        return False

def fix_all_product_pages():
    """إصلاح جميع صفحات المنتجات"""
    products_dir = 'products-pages'
    
    print("🛒 بدء إصلاح أزرار السلة في جميع صفحات المنتجات")
    print(f"📂 المجلد المستهدف: {products_dir}")
    print("=" * 60)
    
    if not os.path.exists(products_dir):
        print(f"❌ مجلد {products_dir} غير موجود!")
        return
    
    fixed_count = 0
    total_count = 0
    skipped_files = []
    
    # معالجة جميع ملفات HTML
    for filename in sorted(os.listdir(products_dir)):
        if filename.endswith('.html') and not filename.startswith('.'):
            # تجاهل الملفات المساعدة
            if any(skip in filename.lower() for skip in ['template', 'sample', 'working', 'fixed']):
                skipped_files.append(filename)
                continue
                
            file_path = os.path.join(products_dir, filename)
            total_count += 1
            
            if fix_product_page(file_path):
                fixed_count += 1
    
    print("=" * 60)
    print(f"📊 النتائج النهائية:")
    print(f"📦 إجمالي صفحات المنتجات المعالجة: {total_count}")
    print(f"✅ الصفحات التي تم تحسينها: {fixed_count}")
    print(f"⚪ الصفحات السليمة مسبقاً: {total_count - fixed_count}")
    
    if skipped_files:
        print(f"🔄 الملفات المتجاهلة (قوالب/عينات): {len(skipped_files)}")
        for f in skipped_files[:5]:  # عرض أول 5 فقط
            print(f"   - {f}")
        if len(skipped_files) > 5:
            print(f"   ... و {len(skipped_files) - 5} ملف آخر")
    
    print(f"\n🎉 تم الانتهاء من إصلاح أزرار السلة!")
    print(f"📅 الوقت: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"\n💡 ملاحظة: تم الحفاظ على جميع بيانات المنتجات الأصلية")
    print(f"🔗 يمكنك الآن اختبار أي صفحة منتج - زر السلة سيعمل تلقائياً")

if __name__ == "__main__":
    fix_all_product_pages()