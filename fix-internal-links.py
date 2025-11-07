#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
إصلاح تنسيق الروابط الداخلية - تصميم احترافي متناسق
Fix Internal Links Styling - Professional Design
"""

from pathlib import Path
import re

class InternalLinksStyleFixer:
    def __init__(self):
        self.products_dir = Path("products-pages")
        self.fixed_count = 0
        
    def fix_internal_links_styling(self, html_file):
        """إصلاح تنسيق الروابط الداخلية"""
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                html = f.read()
            
            original_html = html
            
            # إزالة قسم الروابط الداخلية القديم (غير المنسّق)
            pattern = r'<!-- روابط داخلية تلقائية SEO -->.*?</section>'
            html = re.sub(pattern, '', html, flags=re.DOTALL)
            
            # حفظ التغييرات
            if html != original_html:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(html)
                self.fixed_count += 1
                return True
            
            return False
            
        except Exception as e:
            print(f"⚠️ خطأ في {html_file.name}: {e}")
            return False
    
    def run(self):
        """تشغيل الإصلاح"""
        print("\n" + "="*60)
        print("🔧 إصلاح تنسيق الروابط الداخلية")
        print("="*60 + "\n")
        
        html_files = list(self.products_dir.glob('*.html'))
        total = len(html_files)
        
        print(f"📦 إجمالي الملفات: {total}\n")
        
        for idx, html_file in enumerate(html_files, 1):
            if self.fix_internal_links_styling(html_file):
                if idx % 100 == 0:
                    print(f"⏳ تمت معالجة {idx}/{total} ملف...")
        
        print("\n" + "="*60)
        print("✅ اكتمل الإصلاح!")
        print("="*60)
        print(f"\n📊 الإحصائيات:")
        print(f"  ✅ تم إصلاح: {self.fixed_count} ملف")
        print(f"  📦 الإجمالي: {total} ملف")
        print(f"\n💡 ملاحظة: تم إزالة الروابط الداخلية القديمة")
        print(f"   يمكنك إعادة إضافتها بتصميم أفضل لاحقاً\n")

if __name__ == '__main__':
    fixer = InternalLinksStyleFixer()
    fixer.run()
