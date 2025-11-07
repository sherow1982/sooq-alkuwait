#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت إعادة تصميم صفحات المنتجات - UI احترافي + SEO + زر واحد للواتساب
Redesign Product Pages - Professional UI + SEO + Single WhatsApp Button
"""

from pathlib import Path
import re
import random
from urllib.parse import quote

class ProductRedesigner:
    def __init__(self):
        self.site_url = "https://sooq-alkuwait.arabsad.com"
        self.products_dir = Path("products-pages")
        self.whatsapp_number = "201110760081"
        self.fixed_count = 0
        
    def extract_product_title(self, html):
        """استخراج عنوان المنتج"""
        title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', html)
        return title_match.group(1).strip() if title_match else "منتج"
    
    def remove_duplicate_whatsapp_buttons(self, html):
        """إزالة جميع أزرار الواتساب المكررة"""
        # إزالة جميع أزرار الواتساب
        pattern = r'<a[^>]*href="https://wa\.me/\d+"[^>]*class="[^"]*buy-button[^"]*"[^>]*>.*?</a>'
        html = re.sub(pattern, '', html, flags=re.DOTALL)
        
        return html
    
    def add_single_whatsapp_button(self, html):
        """إضافة زر واتساب واحد احترافي"""
        button_html = f'''
<!-- زر الواتساب الاحترافي -->
<div class="whatsapp-cta-container" style="text-align: center; margin: 40px 0 30px 0;">
    <a href="https://wa.me/{self.whatsapp_number}" 
       target="_blank" 
       class="whatsapp-cta-button"
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
              border: none;
              cursor: pointer;
              max-width: 500px;
              width: 90%;">
        <i class="fab fa-whatsapp" style="font-size: 1.3em; margin-left: 10px;"></i>
        اطلب عبر واتساب - شحن مجاني 🚚
    </a>
    <p style="margin-top: 15px; color: #666; font-size: 0.95rem;">
        📞 استفسر واطلب مباشرة | ⚡ رد فوري | ✅ ضمان الجودة
    </p>
</div>

<style>
.whatsapp-cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(37, 211, 102, 0.45);
}
</style>
'''
        
        # إضافة الزر بعد وصف المنتج أو بعد السعر
        if '<div class="product-description">' in html:
            html = html.replace(
                '<div class="product-description">',
                f'{button_html}<div class="product-description">'
            )
        elif '<div class="price-section">' in html:
            html = re.sub(
                r'(<div class="price-section">.*?</div>)',
                f'\\1{button_html}',
                html,
                flags=re.DOTALL
            )
        else:
            # إضافة قبل نهاية body
            html = html.replace('</body>', f'{button_html}</body>')
        
        return html
    
    def enhance_seo_tags(self, html, filename):
        """تحسين SEO tags"""
        title = self.extract_product_title(html)
        
        # تحسين page title
        html = re.sub(
            r'<title>.*?</title>',
            f'<title>{title} | سوق الكويت - شحن مجاني</title>',
            html
        )
        
        # تحسين meta description
        description = f"{title}، متوفر الآن في سوق الكويت مع شحن سريع وضمان أصلي. اكتشف الآن التفاصيل والسعر وأطلب عبر الواتساب!"
        
        if '<meta name="description"' in html:
            html = re.sub(
                r'<meta name="description" content="[^"]*"',
                f'<meta name="description" content="{description}"',
                html
            )
        else:
            html = html.replace(
                '</head>',
                f'    <meta name="description" content="{description}">\n</head>'
            )
        
        # إضافة canonical URL
        canonical_url = f'{self.site_url}/products-pages/{quote(filename)}'
        if 'rel="canonical"' not in html:
            html = html.replace(
                '</head>',
                f'    <link rel="canonical" href="{canonical_url}">\n</head>'
            )
        
        # تحسين Open Graph tags
        og_tags = f'''
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    <meta property="og:url" content="{canonical_url}">
    <meta property="og:type" content="product">
    <meta property="og:site_name" content="سوق الكويت">
'''
        
        if 'og:title' not in html:
            html = html.replace('</head>', f'{og_tags}</head>')
        
        return html
    
    def add_professional_styling(self, html):
        """إضافة تنسيق احترافي"""
        
        # إضافة Google Fonts إذا لم تكن موجودة
        if 'fonts.googleapis.com' not in html:
            fonts_link = '<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">\n'
            html = html.replace('</head>', f'    {fonts_link}</head>')
        
        # إضافة CSS محسّن
        enhanced_css = '''
<style>
/* تحسينات احترافية للمنتج */
body {
    font-family: 'Tajawal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #f8f9fa;
}

.product-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.product-image {
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.12);
    transition: transform 0.3s ease;
}

.product-image:hover {
    transform: scale(1.02);
}

h1 {
    color: #2c3e50;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 20px;
    line-height: 1.4;
}

.price-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 25px;
    border-radius: 15px;
    margin: 25px 0;
    text-align: center;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.sale-price {
    font-size: 2.5rem;
    font-weight: 700;
}

.original-price {
    text-decoration: line-through;
    opacity: 0.7;
    font-size: 1.3rem;
}

.product-description {
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    margin: 30px 0;
    line-height: 1.8;
    font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
    h1 {
        font-size: 1.5rem;
    }
    
    .sale-price {
        font-size: 2rem;
    }
    
    .whatsapp-cta-button {
        font-size: 1.2rem !important;
        padding: 18px 35px !important;
    }
}
</style>
'''
        
        if '<style>' not in html or 'product-container' not in html:
            html = html.replace('</head>', f'{enhanced_css}</head>')
        
        return html
    
    def redesign_product_page(self, html_file):
        """إعادة تصميم صفحة منتج واحدة"""
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                html = f.read()
            
            original_html = html
            
            # 1. إزالة أزرار واتساب المكررة
            html = self.remove_duplicate_whatsapp_buttons(html)
            
            # 2. إضافة زر واتساب واحد احترافي
            html = self.add_single_whatsapp_button(html)
            
            # 3. تحسين SEO tags
            html = self.enhance_seo_tags(html, html_file.name)
            
            # 4. إضافة تنسيق احترافي
            html = self.add_professional_styling(html)
            
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
        """تشغيل إعادة التصميم لجميع المنتجات"""
        print("\n" + "="*60)
        print("🎨 بدء إعادة تصميم صفحات المنتجات")
        print("="*60 + "\n")
        
        html_files = list(self.products_dir.glob('*.html'))
        total = len(html_files)
        
        print(f"📦 إجمالي المنتجات: {total}\n")
        
        for idx, html_file in enumerate(html_files, 1):
            if self.redesign_product_page(html_file):
                if idx % 100 == 0:
                    print(f"⏳ تمت معالجة {idx}/{total} منتج...")
        
        print("\n" + "="*60)
        print("✅ اكتمل إعادة التصميم!")
        print("="*60)
        print(f"\n📊 الإحصائيات:")
        print(f"  ✅ تم تحديث: {self.fixed_count} ملف")
        print(f"  📦 الإجمالي: {total} منتج")
        
        print(f"\n🎯 التحسينات المطبقة:")
        print(f"  ✅ زر واتساب واحد احترافي لكل صفحة")
        print(f"  ✅ تحسين SEO (title, description, canonical)")
        print(f"  ✅ تصميم UI عصري وجذاب")
        print(f"  ✅ Responsive للجوال والكمبيوتر")
        print(f"  ✅ Google Fonts للخطوط الجميلة")
        
        print(f"\n🔗 الموقع: {self.site_url}")
        print(f"📱 واتساب: https://wa.me/{self.whatsapp_number}\n")

if __name__ == '__main__':
    redesigner = ProductRedesigner()
    redesigner.run()
