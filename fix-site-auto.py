#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت تصحيح تلقائي كامل لموقع سوق الكويت
Auto-Fix Script for sooq-alkuwait Website
Domain: https://sooq-alkuwait.arabsad.com
"""

import os
import re
import glob
from pathlib import Path
from datetime import datetime
from urllib.parse import quote

class SiteAutoFixer:
    def __init__(self, base_dir='.'):
        self.base_dir = Path(base_dir)
        self.products_dir = self.base_dir / 'products-pages'
        self.whatsapp_number = '201110760081'
        self.base_url = 'https://sooq-alkuwait.arabsad.com'
        self.changes_made = []
        
    def fix_cart_to_whatsapp(self):
        """إزالة السلة واستبدالها بزر واتساب"""
        print("🔧 جاري إزالة السلة واستبدالها بواتساب...")
        
        html_files = list(self.products_dir.glob('*.html'))
        fixed_count = 0
        
        for html_file in html_files:
            try:
                with open(html_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # إزالة زر "اشتري الآن" واستبداله بزر واتساب
                cart_button_pattern = r'<button[^>]*class="buy-button"[^>]*onclick="addToCart[^"]*"[^>]*>.*?</button>'
                
                def replace_with_whatsapp(match):
                    return f'''<a href="https://wa.me/{self.whatsapp_number}" target="_blank" class="buy-button text-decoration-none d-block text-center" style="background: linear-gradient(45deg, #25D366, #128C7E); border: none; padding: 18px 40px; font-size: 1.3em; font-weight: 600; border-radius: 50px; color: white; width: 100%; margin: 25px 0; box-shadow: 0 5px 20px rgba(37, 211, 102, 0.3);">
                    <i class="fab fa-whatsapp me-2"></i>اطلب عبر واتساب - شحن مجاني
                </a>'''
                
                content = re.sub(cart_button_pattern, replace_with_whatsapp, content, flags=re.DOTALL)
                
                # إزالة روابط السلة من القائمة
                content = re.sub(
                    r'<li class="nav-item"><a class="nav-link" href="[^"]*cart\.html">.*?</a></li>',
                    '',
                    content,
                    flags=re.DOTALL
                )
                
                # إزالة سكريبت addToCart
                content = re.sub(
                    r'function addToCart\([^)]*\)\s*\{[^}]*\}',
                    '',
                    content,
                    flags=re.DOTALL
                )
                
                if content != original_content:
                    with open(html_file, 'w', encoding='utf-8') as f:
                        f.write(content)
                    fixed_count += 1
                    
            except Exception as e:
                print(f"⚠️  خطأ في {html_file.name}: {e}")
        
        self.changes_made.append(f"✅ Fixed {fixed_count} product files")
        print(f"✅ تم تصحيح {fixed_count} ملف")
    
    def generate_sitemap(self):
        """إنشاء sitemap.xml كامل"""
        print("🗺️ جاري إنشاء sitemap.xml...")
        
        html_files = sorted(list(self.products_dir.glob('*.html')))
        today = datetime.now().strftime('%Y-%m-%d')
        
        sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'
        sitemap += ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
        
        # الصفحة الرئيسية
        sitemap += f'''  <url>
    <loc>{self.base_url}/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>{self.base_url}/index.html</loc>
    <lastmod>{today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
'''
        
        # صفحات المنتجات
        for html_file in html_files:
            # URL encode للأسماء العربية
            filename = quote(html_file.name)
            
            sitemap += f'''  <url>
    <loc>{self.base_url}/products-pages/{filename}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
'''
        
        sitemap += '</urlset>'
        
        sitemap_file = self.base_dir / 'sitemap.xml'
        with open(sitemap_file, 'w', encoding='utf-8') as f:
            f.write(sitemap)
        
        self.changes_made.append(f"✅ Created sitemap.xml with {len(html_files)} products")
        print(f"✅ تم إنشاء sitemap.xml مع {len(html_files)} منتج")
    
    def update_robots_txt(self):
        """تحديث robots.txt"""
        print("🤖 جاري تحديث robots.txt...")
        
        robots_content = f'''# Robots.txt for سوق الكويت
User-agent: *
Allow: /

# Sitemaps
Sitemap: {self.base_url}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Allow all search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

# Disallow admin and temp areas
User-agent: *
Disallow: /admin/
Disallow: /temp/
Disallow: /*.json$
Disallow: /*.py$
Disallow: /*.js$
'''
        
        robots_file = self.base_dir / 'robots.txt'
        with open(robots_file, 'w', encoding='utf-8') as f:
            f.write(robots_content)
        
        self.changes_made.append("✅ Updated robots.txt")
        print("✅ تم تحديث robots.txt")
    
    def add_seo_meta_tags(self):
        """إضافة/تحسين meta tags للـ SEO"""
        print("🎯 جاري تحسين meta tags...")
        
        html_files = list(self.products_dir.glob('*.html'))
        updated_count = 0
        
        for html_file in html_files:
            try:
                with open(html_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # إضافة canonical URL إذا لم يكن موجود
                if '<link rel="canonical"' not in content:
                    filename = quote(html_file.name)
                    canonical_url = f'{self.base_url}/products-pages/{filename}'
                    
                    canonical_tag = f'    <link rel="canonical" href="{canonical_url}">\n'
                    content = content.replace('</head>', f'{canonical_tag}</head>')
                    updated_count += 1
                    
                    with open(html_file, 'w', encoding='utf-8') as f:
                        f.write(content)
                        
            except Exception as e:
                print(f"⚠️  خطأ في {html_file.name}: {e}")
        
        self.changes_made.append(f"✅ Added SEO meta tags to {updated_count} files")
        print(f"✅ تم تحسين meta tags لـ {updated_count} ملف")
    
    def run_all_fixes(self):
        """تشغيل جميع الإصلاحات"""
        print("\n" + "="*60)
        print("🚀 بدء التصحيح التلقائي لموقع سوق الكويت")
        print(f"🌐 Domain: {self.base_url}")
        print("="*60 + "\n")
        
        self.fix_cart_to_whatsapp()
        print()
        self.generate_sitemap()
        print()
        self.update_robots_txt()
        print()
        self.add_seo_meta_tags()
        
        print("\n" + "="*60)
        print("✅ تمت جميع الإصلاحات بنجاح!")
        print("="*60)
        
        print("\n📋 ملخص التغييرات:")
        for change in self.changes_made:
            print(f"  {change}")
        
        print(f"\n🔗 روابط مهمة:")
        print(f"  • الموقع: {self.base_url}/")
        print(f"  • Sitemap: {self.base_url}/sitemap.xml")
        print(f"  • Robots.txt: {self.base_url}/robots.txt")
        print(f"  • WhatsApp: https://wa.me/{self.whatsapp_number}")
        
if __name__ == '__main__':
    fixer = SiteAutoFixer()
    fixer.run_all_fixes()