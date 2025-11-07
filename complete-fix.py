#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت إصلاح شامل لصفحات المنتجات
- إزالة الهاتف القديم (+965)
- إزالة قسم الروابط الداخلية القديم (internal-links-seo)
- إضافة زر واتساب واحد فقط (201110760081)
- تحسين UI/UX احترافي
- تحسين SEO
"""

from pathlib import Path
import re
from urllib.parse import quote

class CompleteFixer:
    def __init__(self):
        self.site_url = "https://sooq-alkuwait.arabsad.com"
        self.products_dir = Path("products-pages")
        self.whatsapp_number = "201110760081"
        self.fixed_count = 0
        
    def fix_product_page(self, html_file):
        """إصلاح صفحة منتج واحدة بالكامل"""
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                html = f.read()
            
            original_html = html
            
            # 1. إزالة رقم الهاتف القديم (+965)
            html = re.sub(r'\+965\s*\d+\s*\d+\s*\d+', '', html)
            html = re.sub(r'<a[^>]*href="tel:\+965[^"]*"[^>]*>.*?</a>', '', html, flags=re.DOTALL)
            
            # 2. إزالة قسم الروابط الداخلية القديم بالكامل
            html = re.sub(
                r'<section class="internal-links-seo"[^>]*>.*?</section>',
                '',
                html,
                flags=re.DOTALL
            )
            
            # 3. إزالة جميع أزرار الواتساب الموجودة
            html = re.sub(
                r'<a[^>]*href="https://wa\.me/\d+"[^>]*>.*?</a>',
                '',
                html,
                flags=re.DOTALL
            )
            
            # 4. إضافة زر واتساب واحد احترافي فقط
            whatsapp_button = f'''
<!-- زر الواتساب الاحترافي الوحيد -->
<div class="whatsapp-cta-section" style="text-align: center; margin: 40px auto; padding: 30px 20px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 20px; max-width: 600px;">
    <h3 style="color: #2c3e50; font-size: 1.5rem; margin-bottom: 15px; font-weight: 700;">🛒 جاهز للطلب؟</h3>
    <p style="color: #7f8c8d; margin-bottom: 25px; font-size: 1.1rem;">تواصل معنا مباشرة عبر الواتساب للحصول على أفضل الأسعار</p>
    <a href="https://wa.me/{self.whatsapp_number}" 
       target="_blank"
       rel="noopener noreferrer"
       class="whatsapp-order-btn"
       style="display: inline-block;
              background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
              color: white;
              font-size: 1.4rem;
              font-weight: 700;
              padding: 20px 50px;
              border-radius: 50px;
              text-decoration: none;
              box-shadow: 0 8px 25px rgba(37, 211, 102, 0.35);
              transition: all 0.3s ease;
              border: none;">
        <i class="fab fa-whatsapp" style="font-size: 1.3em; margin-left: 10px;"></i>
        اطلب الآن عبر واتساب - شحن مجاني
    </a>
    <p style="margin-top: 20px; color: #666; font-size: 0.95rem;">
        ✅ ضمان الجودة | 🚚 شحن سريع | 💯 منتجات أصلية
    </p>
</div>

<style>
.whatsapp-order-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(37, 211, 102, 0.45);
}
</style>
'''
            
            # إضافة الزر بعد وصف المنتج أو قبل نهاية المحتوى الرئيسي
            if '</main>' in html:
                html = html.replace('</main>', f'{whatsapp_button}</main>')
            elif '<footer' in html:
                html = re.sub(r'(<footer)', f'{whatsapp_button}\\1', html, count=1)
            else:
                html = html.replace('</body>', f'{whatsapp_button}</body>')
            
            # 5. تحسين SEO tags
            title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', html)
            page_title = title_match.group(1).strip() if title_match else "منتج"
            
            # تحسين page title
            if '<title>' in html:
                html = re.sub(
                    r'<title>.*?</title>',
                    f'<title>{page_title} | سوق الكويت - شحن مجاني</title>',
                    html
                )
            
            # تحسين meta description
            description = f"{page_title}، متوفر الآن في سوق الكويت مع شحن سريع مجاني. اطلب عبر الواتساب الآن!"
            if '<meta name="description"' in html:
                html = re.sub(
                    r'<meta name="description" content="[^"]*"',
                    f'<meta name="description" content="{description}"',
                    html
                )
            else:
                html = html.replace('</head>', f'    <meta name="description" content="{description}">\n</head>')
            
            # إضافة canonical URL
            filename = quote(html_file.name)
            canonical_url = f'{self.site_url}/products-pages/{filename}'
            if 'rel="canonical"' not in html:
                html = html.replace('</head>', f'    <link rel="canonical" href="{canonical_url}">\n</head>')
            
            # 6. إضافة تنسيقات احترافية
            if 'Tajawal' not in html:
                fonts_link = '    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">\n'
                html = html.replace('</head>', f'{fonts_link}</head>')
            
            professional_css = '''
<style>
/* تحسينات احترافية */
body {
    font-family: 'Tajawal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #f8f9fa;
    line-height: 1.6;
}

.product-image {
    border-radius: 15px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    transition: transform 0.3s ease;
}

.product-image:hover {
    transform: scale(1.02);
}

h1 {
    color: #2c3e50;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.4;
    margin-bottom: 20px;
}

.price-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 25px;
    border-radius: 15px;
    text-align: center;
    margin: 25px 0;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.sale-price {
    font-size: 2.5rem;
    font-weight: 700;
}

.product-description {
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    margin: 30px 0;
    line-height: 1.8;
}

@media (max-width: 768px) {
    h1 {
        font-size: 1.5rem;
    }
    .whatsapp-order-btn {
        font-size: 1.2rem !important;
        padding: 18px 35px !important;
    }
}
</style>
'''
            
            if 'product-image {' not in html:
                html = html.replace('</head>', f'{professional_css}</head>')
            
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
        """تشغيل الإصلاح الشامل"""
        print("\n" + "="*60)
        print("🔧 بدء الإصلاح الشامل لصفحات المنتجات")
        print("="*60 + "\n")
        
        html_files = list(self.products_dir.glob('*.html'))
        total = len(html_files)
        
        print(f"📦 إجمالي الملفات: {total}\n")
        print("🔨 جاري الإصلاح...")
        
        for idx, html_file in enumerate(html_files, 1):
            self.fix_product_page(html_file)
            
            if idx % 100 == 0:
                print(f"⏳ تمت معالجة {idx}/{total} صفحة...")
        
        print("\n" + "="*60)
        print("✅ اكتمل الإصلاح الشامل!")
        print("="*60)
        print(f"\n📊 الإحصائيات:")
        print(f"  ✅ تم إصلاح: {self.fixed_count} صفحة")
        print(f"  📦 الإجمالي: {total} صفحة")
        
        print(f"\n🎯 التحسينات المطبقة:")
        print(f"  ✅ إزالة رقم الهاتف القديم (+965)")
        print(f"  ✅ إزالة قسم الروابط الداخلية القديم")
        print(f"  ✅ زر واتساب واحد احترافي ({self.whatsapp_number})")
        print(f"  ✅ تحسين SEO (title, description, canonical)")
        print(f"  ✅ تصميم UI احترافي")
        print(f"  ✅ خطوط Google Fonts")
        print(f"  ✅ Responsive للجوال\n")

if __name__ == '__main__':
    fixer = CompleteFixer()
    fixer.run()
