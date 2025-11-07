#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت حذف قسم المواصفات التفصيلية كاملاً
من جميع صفحات المنتجات
يشمل: العلامة التجارية، بلد الصنع، المواد، الأبعاد، إلخ.
التاريخ: 2025-11-07
"""

import os
import re
from pathlib import Path

def remove_specifications():
    """حذف قسم المواصفات التفصيلية كاملاً"""
    
    products_dir = Path("products-pages")
    
    if not products_dir.exists():
        print("❌ خطأ: مجلد products-pages غير موجود")
        return
    
    total_files = 0
    updated_files = 0
    errors = 0
    
    print("🗑️  بدء حذف قسم المواصفات التفصيلية...")
    print("=" * 70)
    
    for html_file in products_dir.glob("*.html"):
        total_files += 1
        
        try:
            # قراءة المحتوى
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # ==================================================
            # الطريقة 1: حذف القسم كاملاً بالبحث عن class="specifications"
            # ==================================================
            pattern1 = r'<div class="specifications">.*?</div>\s*<div class="reviews-section">'
            content = re.sub(
                pattern1, 
                '<div class="reviews-section">',
                content, 
                flags=re.DOTALL
            )
            
            # ==================================================
            # الطريقة 2: حذف القسم بالبحث عن العنوان
            # ==================================================
            pattern2 = r'<div class="specifications">.*?<h3>.*?المواصفات التفصيلية.*?</h3>.*?</div>\s*(?=<div)'
            content = re.sub(pattern2, '', content, flags=re.DOTALL)
            
            # ==================================================
            # الطريقة 3: حذف أي div يحتوي على "المواصفات التفصيلية"
            # ==================================================
            if 'المواصفات التفصيلية' in content:
                lines = content.split('\n')
                new_lines = []
                skip = False
                div_count = 0
                
                for line in lines:
                    # بداية قسم المواصفات
                    if 'class="specifications"' in line or 'المواصفات التفصيلية' in line:
                        skip = True
                        div_count = 0
                    
                    if skip:
                        # حساب عمق الـ divs
                        div_count += line.count('<div')
                        div_count -= line.count('</div>')
                        
                        # إذا وصلنا لنهاية القسم
                        if div_count <= 0 and '</div>' in line:
                            skip = False
                            continue
                    
                    if not skip:
                        new_lines.append(line)
                
                content = '\n'.join(new_lines)
            
            # ==================================================
            # حذف أي عناصر spec-item متبقية
            # ==================================================
            content = re.sub(
                r'<div class="spec-item">.*?</div>',
                '',
                content,
                flags=re.DOTALL
            )
            
            # ==================================================
            # حذف نصوص محددة (إذا كانت متبقية)
            # ==================================================
            texts_to_remove = [
                'بلد الصنع',
                'الصين/تركيا',
                'ضمان المنتج',
                'سنة واحدة',
                'ستانلس ستيل',
                'قابلة للغسيل',
                'مقاومة الصدأ',
                'الأبعاد',
                'الوزن',
                'السعة'
            ]
            
            for text in texts_to_remove:
                content = re.sub(rf'<[^>]*>{text}[^<]*</[^>]*>', '', content)
            
            # التحقق من التغيير
            if content != original_content:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                updated_files += 1
                
                # عرض التقدم
                if updated_files <= 20:
                    print(f"✅ {updated_files}. {html_file.name}")
                elif updated_files % 100 == 0:
                    print(f"✅ تم معالجة {updated_files} ملف...")
        
        except Exception as e:
            errors += 1
            print(f"❌ خطأ في: {html_file.name} - {str(e)}")
    
    # التقرير النهائي
    print("=" * 70)
    print(f"\n📊 تقرير العملية:")
    print(f"   📁 إجمالي الملفات: {total_files}")
    print(f"   ✅ تم الحذف: {updated_files}")
    print(f"   ⏭️  لم يتغير: {total_files - updated_files - errors}")
    print(f"   ❌ أخطاء: {errors}")
    print(f"\n{'='*70}")
    
    if updated_files > 0:
        print(f"✅ تم حذف قسم المواصفات من {updated_files} صفحة")
        print(f"{'='*70}\n")
        print("🚀 الخطوة التالية:")
        print("   git add .")
        print('   git commit -m "حذف قسم المواصفات التفصيلية"')
        print("   git push origin main --force")
    else:
        print("⚠️  لم يتم العثور على قسم المواصفات")

if __name__ == "__main__":
    remove_specifications()
