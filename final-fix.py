#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
إصلاح شامل نهائي لصفحات المنتجات - بدون أخطاء
"""

from pathlib import Path
import re
from urllib.parse import quote

SITE_URL = "https://sooq-alkuwait.arabsad.com"
WHATSAPP_NUMBER = "201110760081"
PRODUCTS_DIR = Path("products-pages")

fixed_count = 0
total_files = 0

for html_file in PRODUCTS_DIR.glob('*.html'):
    total_files += 1
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            html = f.read()
        
        original = html
        
        # 1. إزالة رقم الهاتف القديم
        html = re.sub(r'\+965[\s\d]+', '', html)
        html = re.sub(r'<a[^>]*href="tel:\+965[^"]*"[^>]*>.*?</a>', '', html, flags=re.DOTALL)
        
        # 2. إزالة قسم الروابط الداخلية القديم
        html = re.sub(r'<section class="internal-links-seo".*?</section>', '', html, flags=re.DOTALL)
        
        # 3. إزالة جميع أزرار الواتساب القديمة
        html = re.sub(r'<a[^>]*href="https://wa\.me/\d+"[^>]*>.*?</a>', '', html, flags=re.DOTALL)
        
        # 4. إضافة زر واتساب واحد جديد
        whatsapp_btn = f'''
<div style="text-align:center;margin:40px auto;max-width:600px;padding:30px 20px;background:linear-gradient(135deg,#f5f7fa,#c3cfe2);border-radius:20px">
<h3 style="color:#2c3e50;font-size:1.5rem;margin-bottom:15px;font-weight:700">🛒 جاهز للطلب؟</h3>
<p style="color:#7f8c8d;margin-bottom:25px;font-size:1.1rem">تواصل معنا مباشرة عبر الواتساب</p>
<a href="https://wa.me/{WHATSAPP_NUMBER}" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#25D366,#128C7E);color:white;font-size:1.4rem;font-weight:700;padding:20px 50px;border-radius:50px;text-decoration:none;box-shadow:0 8px 25px rgba(37,211,102,0.35)">
<i class="fab fa-whatsapp" style="margin-left:10px"></i>اطلب الآن - شحن مجاني
</a>
<p style="margin-top:20px;color:#666;font-size:0.95rem">✅ ضمان الجودة | 🚚 شحن سريع | 💯 منتجات أصلية</p>
</div>
'''
        
        # إضافة الزر قبل Footer أو قبل </body>
        if '<footer' in html:
            html = re.sub(r'(<footer)', whatsapp_btn + r'\1', html, count=1)
        else:
            html = html.replace('</body>', whatsapp_btn + '</body>')
        
        # 5. تحسين SEO
        title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', html)
        if title_match:
            page_title = title_match.group(1).strip()
            
            # تحسين title
            html = re.sub(r'<title>.*?</title>', f'<title>{page_title} | سوق الكويت - شحن مجاني</title>', html)
            
            # تحسين description
            desc = f"{page_title}، متوفر الآن في سوق الكويت مع شحن سريع مجاني"
            if '<meta name="description"' in html:
                html = re.sub(r'<meta name="description" content="[^"]*"', f'<meta name="description" content="{desc}"', html)
            else:
                html = html.replace('</head>', f'<meta name="description" content="{desc}">\n</head>')
            
            # إضافة canonical
            filename = quote(html_file.name)
            canonical = f'{SITE_URL}/products-pages/{filename}'
            if 'rel="canonical"' not in html:
                html = html.replace('</head>', f'<link rel="canonical" href="{canonical}">\n</head>')
        
        # 6. إضافة خطوط Google
        if 'Tajawal' not in html:
            html = html.replace('</head>', '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">\n</head>')
        
        # حفظ إذا تغير
        if html != original:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(html)
            fixed_count += 1
    
    except Exception as e:
        print(f"⚠️ خطأ في {html_file.name}: {e}")

print("\n" + "="*60)
print("✅ اكتمل الإصلاح!")
print("="*60)
print(f"\n📊 الإحصائيات:")
print(f"  ✅ تم إصلاح: {fixed_count} صفحة")
print(f"  📦 الإجمالي: {total_files} صفحة")
print(f"\n🎯 التحسينات:")
print(f"  ✅ إزالة +965")
print(f"  ✅ إزالة الروابط القديمة")
print(f"  ✅ زر واتساب واحد ({WHATSAPP_NUMBER})")
print(f"  ✅ تحسين SEO")
print(f"  ✅ خطوط احترافية\n")
