#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
تحسين Footer ليكون في صف واحد أفقي (متوسط العرض)
"""

from pathlib import Path
import re

PRODUCTS_DIR = Path("products-pages")
INDEX_FILE = Path("index.html")

footer_css = '''
<style>
/* Footer محسّن - تصميم أفقي */
.footer-content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 20px;
}

.footer-section {
    text-align: right;
}

.footer-section h3 {
    font-size: 1.2rem;
    margin-bottom: 20px;
    font-weight: 700;
}

.footer-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-section ul li {
    margin-bottom: 12px;
}

.footer-section ul li a {
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;
}

.footer-section ul li a:hover {
    transform: translateX(-5px);
    opacity: 0.8;
}

.social-links a:hover {
    transform: scale(1.2);
}

/* Responsive للجوال */
@media (max-width: 992px) {
    .footer-content {
        grid-template-columns: repeat(2, 1fr);
        gap: 25px;
    }
}

@media (max-width: 576px) {
    .footer-content {
        grid-template-columns: 1fr;
        gap: 20px;
    }
}
</style>
'''

fixed_count = 0

# تحديث صفحات المنتجات
for html_file in PRODUCTS_DIR.glob('*.html'):
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            html = f.read()
        
        original = html
        
        # إزالة أي CSS قديم للـ footer
        html = re.sub(
            r'<style>.*?/\* Footer.*?</style>',
            '',
            html,
            flags=re.DOTALL
        )
        
        # إضافة CSS الجديد قبل </head>
        if footer_css not in html:
            html = html.replace('</head>', f'{footer_css}\n</head>')
        
        # حفظ
        if html != original:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(html)
            fixed_count += 1
    
    except Exception as e:
        print(f"⚠️ خطأ في {html_file.name}: {e}")

# تحديث الصفحة الرئيسية
if INDEX_FILE.exists():
    try:
        with open(INDEX_FILE, 'r', encoding='utf-8') as f:
            html = f.read()
        
        original = html
        
        # إزالة CSS قديم
        html = re.sub(
            r'<style>.*?/\* Footer.*?</style>',
            '',
            html,
            flags=re.DOTALL
        )
        
        # إضافة CSS جديد
        if footer_css not in html:
            html = html.replace('</head>', f'{footer_css}\n</head>')
        
        if html != original:
            with open(INDEX_FILE, 'w', encoding='utf-8') as f:
                f.write(html)
            fixed_count += 1
            print("✅ تم تحديث index.html")
    
    except Exception as e:
        print(f"⚠️ خطأ في index.html: {e}")

print("\n" + "="*60)
print("✅ اكتمل تحسين تصميم Footer!")
print("="*60)
print(f"\n📊 الإحصائيات:")
print(f"  ✅ تم التحديث: {fixed_count} صفحة")
print(f"\n🎯 التحسينات:")
print(f"  ✅ Footer في صف واحد أفقي (4 أعمدة)")
print(f"  ✅ تصميم متوسط العرض (max-width: 1400px)")
print(f"  ✅ Responsive: 2 أعمدة على التابلت، عمود واحد على الجوال")
print(f"  ✅ تأثيرات hover احترافية")
print(f"  ✅ مسافات متناسقة\n")
