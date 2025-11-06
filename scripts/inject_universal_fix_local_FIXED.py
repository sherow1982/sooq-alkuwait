#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريپت الحقن المحلي المحسن - إصدار آمن
inject_universal_fix_local_FIXED.py
يتعامل مع أسماء الملفات العربية والمُرمزة بشكل صحيح
"""

import os
import io
import urllib.parse
from pathlib import Path

def main():
    # تحديد المسار الصحيح
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    pages_dir = repo_root / "products-pages"
    
    print(f"📂 مجلد المنتجات: {pages_dir}")
    print(f"✅ المجلد موجود: {pages_dir.exists()}")
    
    if not pages_dir.exists():
        print("❌ مجلد products-pages غير موجود!")
        return
    
    # نص الحقن
    injection = '<script src="../assets/js/universal-cart-fix.js"></script>'
    skip_tokens = ('TEMPLATE', 'SAMPLE', 'WORKING', 'FIXED', 'TEST')
    
    stats = {'total': 0, 'processed': 0, 'injected': 0, 'skipped': 0, 'errors': 0}
    
    print("\n🚀 بدء عملية الحقن...")
    print("=" * 60)
    
    try:
        # قراءة جميع الملفات
        all_files = list(pages_dir.glob("*.html"))
        
        for file_path in all_files:
            filename = file_path.name
            
            # تجاهل ملفات القوالب
            if any(token in filename.upper() for token in skip_tokens):
                continue
                
            stats['total'] += 1
            print(f"[{stats['total']:3d}] 🔍 فحص: {filename}")
            
            try:
                # قراءة المحتوى
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # فحص الحاجة للحقن
                if 'universal-cart-fix.js' not in content:
                    # تطبيق الحقن
                    if '</body>' in content:
                        new_content = content.replace('</body>', f'    {injection}\\n</body>')
                    else:
                        new_content = content + '\\n' + injection + '\\n'
                    
                    # كتابة الملف الجديد
                    with open(file_path, 'w', encoding='utf-8', newline='') as f:
                        f.write(new_content)
                    
                    stats['injected'] += 1
                    stats['processed'] += 1
                    print(f"     ✅ تم الحقن بنجاح")
                    
                else:
                    stats['skipped'] += 1
                    stats['processed'] += 1
                    print(f"     ⏭️ تجاوز (يحتوي على السكريپت مسبقاً)")
                    
            except Exception as e:
                stats['errors'] += 1
                print(f"     ❌ خطأ: {str(e)}")
                
        # النتائج النهائية
        print("\\n" + "=" * 60)
        print("📊 ملخص العملية:")
        print("=" * 60)
        print(f"📄 إجمالي الملفات: {stats['total']}")
        print(f"🔄 تمت معالجتها: {stats['processed']}")
        print(f"✅ تم حقنها: {stats['injected']}")
        print(f"⏭️ تم تجاهلها: {stats['skipped']}")
        print(f"❌ أخطاء: {stats['errors']}")
        
        if stats['injected'] > 0:
            print(f"\\n🎉 تم حقن {injection} بنجاح في {stats['injected']} ملف!")
            print("\\n📝 الخطوات التالية:")
            print("1. git add -A")
            print("2. git commit -m 'Inject universal-cart-fix.js in all product pages'")
            print("3. git push origin main  (أو الفرع الحالي)")
        else:
            print("\\n✅ جميع الملفات محدثة بالفعل!")
            
    except Exception as e:
        print(f"💥 خطأ عام: {str(e)}")

if __name__ == '__main__':
    main()