#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
إزالة زر الواتساب القديم ونقل الزر الذكي تحت صناديق المميزات
"""

from pathlib import Path
import re

PRODUCTS_DIR = Path("products-pages")
fixed_count = 0

for html_file in PRODUCTS_DIR.glob('*.html'):
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            html = f.read()
        
        original = html
        
        # 1. إزالة زر الواتساب القديم (البسيط)
        old_btn_pattern = r'<div style="text-align:center;margin:40px auto;max-width:600px;padding:30px 20px;background:linear-gradient\(135deg,#f5f7fa,#c3cfe2\);border-radius:20px">.*?</div>'
        html = re.sub(old_btn_pattern, '', html, flags=re.DOTALL)
        
        # 2. البحث عن زر الواتساب الذكي وحفظه
        smart_btn_pattern = r'(<div class="whatsapp-order-section".*?</div>\s*<style>.*?</style>)'
        smart_btn_match = re.search(smart_btn_pattern, html, flags=re.DOTALL)
        
        if smart_btn_match:
            smart_btn_code = smart_btn_match.group(1)
            
            # إزالة الزر من موقعه الحالي
            html = re.sub(smart_btn_pattern, '', html, flags=re.DOTALL)
            
            # 3. البحث عن صناديق المميزات وإضافة الزر بعدها مباشرة
            features_pattern = r'(<div class="row mt-4">.*?<div class="col-md-4 mb-3">.*?<div class="feature-box">.*?</div>.*?</div>.*?<div class="col-md-4 mb-3">.*?<div class="feature-box">.*?</div>.*?</div>.*?<div class="col-md-4 mb-3">.*?<div class="feature-box">.*?</div>.*?</div>.*?</div>)'
            
            if re.search(features_pattern, html, flags=re.DOTALL):
                # إضافة الزر الذكي مباشرة بعد صناديق المميزات
                html = re.sub(
                    features_pattern,
                    rf'\1\n\n{smart_btn_code}',
                    html,
                    flags=re.DOTALL,
                    count=1
                )
            else:
                # إذا لم توجد صناديق المميزات، أضف الزر قبل Footer
                if '<footer' in html:
                    html = re.sub(r'(<footer)', rf'{smart_btn_code}\n\1', html, count=1)
                else:
                    html = html.replace('</body>', f'{smart_btn_code}\n</body>')
        
        # حفظ التغييرات
        if html != original:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(html)
            fixed_count += 1
    
    except Exception as e:
        print(f"⚠️ خطأ في {html_file.name}: {e}")

print("\n" + "="*60)
print("✅ اكتمل نقل زر الواتساب الذكي!")
print("="*60)
print(f"\n📊 الإحصائيات:")
print(f"  ✅ تم التحديث: {fixed_count} صفحة")
print(f"\n🎯 التحسينات:")
print(f"  ✅ إزالة زر الواتساب القديم (البسيط)")
print(f"  ✅ نقل زر الواتساب الذكي")
print(f"  ✅ الموضع الجديد: مباشرة تحت صناديق المميزات")
print(f"  ✅ الزر يحتوي على: اسم المنتج، السعر، الرابط، نموذج الطلب\n")
