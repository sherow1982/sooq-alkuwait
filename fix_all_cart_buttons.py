#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت شامل لإصلاح نظام السلة في موقع سوق الكويت
يقوم بتطبيق التحديثات على جميع صفحات المنتجات تلقائياً
"""

import os
import re
import glob
from pathlib import Path
from datetime import datetime

def fix_cart_system():
    """تطبيق الإصلاحات على جميع ملفات المنتجات"""
    
    print("🚀 بدء إصلاح نظام السلة الشامل...")
    print("=" * 60)
    
    # البحث عن جميع ملفات HTML في مجلد products-pages
    html_files = []
    
    # قائمة المجلدات المحتملة
    possible_paths = [
        'products-pages/*.html',
        './products-pages/*.html',
        '../products-pages/*.html',
        'products-pages/**/*.html'
    ]
    
    for pattern in possible_paths:
        html_files.extend(glob.glob(pattern, recursive=True))
    
    # إزالة التكرارات وترتيب القائمة
    html_files = list(set(html_files))
    html_files.sort()
    
    print(f"📁 تم العثور على {len(html_files)} ملف منتج")
    
    if not html_files:
        print("⚠️ لم يتم العثور على ملفات المنتجات!")
        print("🔍 تأكد من وجود مجلد products-pages")
        return False
    
    fixed_count = 0
    error_count = 0
    
    for file_path in html_files:
        try:
            print(f"🔧 معالجة: {os.path.basename(file_path)}")
            
            # قراءة محتوى الملف
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # حفظ المحتوى الأصلي للمقارنة
            original_content = content
            
            # 1. إصلاح زر السلة من onclick إلى data-product-id
            content = fix_cart_button(content, file_path)
            
            # 2. إضافة مرجع cart-fixed.js إذا لم يكن موجوداً
            content = add_cart_script_reference(content)
            
            # 3. إضافة عداد السلة في navigation إذا لم يكن موجوداً
            content = add_cart_counter(content)
            
            # 4. التأكد من وجود cart container
            content = ensure_cart_container(content)
            
            # حفظ الملف إذا تم تعديله
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                fixed_count += 1
                print(f"   ✅ تم إصلاح الملف بنجاح")
            else:
                print(f"   ℹ️ الملف محدث بالفعل")
                
        except Exception as e:
            error_count += 1
            print(f"   ❌ خطأ في معالجة الملف: {str(e)}")
    
    print("=" * 60)
    print(f"📊 ملخص العملية:")
    print(f"   ✅ ملفات تم إصلاحها: {fixed_count}")
    print(f"   ℹ️ ملفات بدون تغيير: {len(html_files) - fixed_count - error_count}")
    print(f"   ❌ ملفات بها أخطاء: {error_count}")
    print(f"   📁 إجمالي الملفات: {len(html_files)}")
    
    if fixed_count > 0:
        print("\n🎉 تم إصلاح نظام السلة بنجاح!")
        print("💡 النظام الجديد يشمل:")
        print("   • أزرار سلة محسنة مع data-product-id")
        print("   • عدادات سلة تفاعلية")
        print("   • حفظ المنتجات في LocalStorage")
        print("   • نظام إشعارات محسن")
        print("\n🚀 قم بتحديث الصفحة لرؤية النتائج!")
    
    return fixed_count > 0

def fix_cart_button(content, file_path):
    """إصلاح زر السلة واستخراج معرف المنتج"""
    
    # استخراج معرف المنتج من اسم الملف
    filename = os.path.basename(file_path)
    product_id_match = re.search(r'product-(\d+)-', filename)
    
    if not product_id_match:
        print(f"   ⚠️ لا يمكن استخراج معرف المنتج من: {filename}")
        return content
    
    product_id = product_id_match.group(1)
    
    # البحث عن أزرار السلة القديمة وإصلاحها
    old_patterns = [
        r'<button[^>]*onclick="addToCart\([^)]*\)"[^>]*>([^<]*<i[^>]*></i>[^<]*)</button>',
        r'<button[^>]*onclick="addToCart\([^)]*\)"[^>]*>([^<]*)</button>',
        r'<button[^>]*class="buy-button"[^>]*onclick="addToCart\([^)]*\)"[^>]*>([^<]*)</button>'
    ]
    
    button_fixed = False
    
    for pattern in old_patterns:
        if re.search(pattern, content, re.IGNORECASE | re.DOTALL):
            new_button = '<button class="buy-button cart-btn" data-product-id="' + product_id + '">\n                    <i class="fas fa-shopping-cart me-2"></i>اشتري الآن - شحن مجاني\n                </button>'
            
            content = re.sub(pattern, new_button, content, flags=re.IGNORECASE | re.DOTALL)
            button_fixed = True
            print(f"   🔄 تم إصلاح زر السلة للمنتج {product_id}")
            break
    
    if not button_fixed:
        print(f"   ℹ️ لم يتم العثور على أزرار تحتاج إصلاح في {filename}")
    
    return content

def add_cart_script_reference(content):
    """إضافة مرجع cart-fixed.js إذا لم يكن موجوداً"""
    
    if 'cart-fixed.js' in content:
        return content
    
    # البحث عن </body> وإضافة السكريبت قبلها
    if '</body>' in content:
        script_tag = '    <script src="../assets/js/cart-fixed.js"></script>\n</body>'
        content = content.replace('</body>', script_tag)
        print(f"   📜 تم إضافة مرجع cart-fixed.js")
    
    return content

def add_cart_counter(content):
    """إضافة عداد السلة في navigation إذا لم يكن موجوداً"""
    
    if 'cart-count' in content:
        return content
    
    # البحث عن navigation وإضافة عداد السلة
    nav_patterns = [
        r'(<a[^>]*href=["\'']../cart\.html["\''][^>]*>.*?</a>)',
        r'(<li[^>]*><a[^>]*href=["\'']../cart\.html["\''][^>]*>.*?</a></li>)'
    ]
    
    for pattern in nav_patterns:
        if re.search(pattern, content, re.IGNORECASE | re.DOTALL):
            def replace_cart_link(match):
                original = match.group(1)
                if 'cart-count' not in original:
                    # إضافة عداد السلة
                    enhanced = re.sub(
                        r'(السلة|سلة التسوق|Cart)',
                        r'\1 <span class="cart-count" id="cart-count">0</span>',
                        original
                    )
                    return enhanced
                return original
            
            content = re.sub(pattern, replace_cart_link, content, flags=re.IGNORECASE | re.DOTALL)
            print(f"   🔢 تم إضافة عداد السلة")
            break
    
    return content

def ensure_cart_container(content):
    """التأكد من وجود cart container للإشعارات"""
    
    if 'id="cart-notification"' in content:
        return content
    
    # إضافة cart notification container قبل </body>
    if '</body>' in content:
        notification_html = '\n    <!-- Cart Notification -->\n    <div id="cart-notification" class="cart-notification"></div>\n    \n</body>'
        content = content.replace('</body>', notification_html)
        print(f"   📢 تم إضافة حاوية الإشعارات")
    
    return content

if __name__ == "__main__":
    print("🛒 سكريبت إصلاح نظام السلة الشامل")
    print("📍 موقع سوق الكويت")
    print("⏰ " + str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
    print()
    
    try:
        success = fix_cart_system()
        if success:
            print("\n🌟 تم إنجاز جميع الإصلاحات بنجاح!")
            print("🔗 الموقع جاهز للاستخدام مع النظام الجديد")
        else:
            print("\n⚠️ لم يتم إجراء أي تغييرات")
    
    except Exception as e:
        print(f"\n💥 حدث خطأ عام: {str(e)}")
        
    print("\n" + "="*60)
    print("انتهى السكريبت")