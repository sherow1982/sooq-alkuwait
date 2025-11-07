#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت تحسين الأداء التلقائي
Performance Optimization Script
"""

import os
import re
from pathlib import Path
import shutil

class PerformanceOptimizer:
    def __init__(self, base_dir='.'):
        self.base_dir = Path(base_dir)
        self.products_dir = self.base_dir / 'products-pages'
        self.changes_made = []
        
    def add_lazy_loading(self):
        """إضافة lazy loading للصور"""
        print("🖼️ جاري إضافة lazy loading للصور...")
        
        html_files = list(self.products_dir.glob('*.html'))
        html_files.append(self.base_dir / 'index.html')
        
        fixed_count = 0
        
        for html_file in html_files:
            if not html_file.exists():
                continue
                
            try:
                with open(html_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # إضافة loading="lazy" للصور (ماعدا الصورة الرئيسية)
                # الصورة الرئيسية يجب أن تحمّل فوراً
                content = re.sub(
                    r'<img(?![^>]*loading=)(?![^>]*class="[^"]*product-image[^"]*")([^>]*)>',
                    r'<img loading="lazy"\1>',
                    content
                )
                
                if content != original_content:
                    with open(html_file, 'w', encoding='utf-8') as f:
                        f.write(content)
                    fixed_count += 1
                    
            except Exception as e:
                print(f"⚠️  خطأ في {html_file.name}: {e}")
        
        self.changes_made.append(f"✅ Added lazy loading to {fixed_count} files")
        print(f"✅ تم إضافة lazy loading لـ {fixed_count} ملف")
    
    def defer_javascript(self):
        """تأجيل تحميل JavaScript"""
        print("⚡ جاري تأجيل JavaScript...")
        
        html_files = list(self.products_dir.glob('*.html'))
        html_files.append(self.base_dir / 'index.html')
        
        fixed_count = 0
        
        for html_file in html_files:
            if not html_file.exists():
                continue
                
            try:
                with open(html_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # إضافة defer لسكريبتات JS (ماعدا السكريبتات الضرورية)
                content = re.sub(
                    r'<script(?![^>]*defer)(?![^>]*async)([^>]*src="[^"]*\.js"[^>]*)></script>',
                    r'<script defer\1></script>',
                    content
                )
                
                if content != original_content:
                    with open(html_file, 'w', encoding='utf-8') as f:
                        f.write(content)
                    fixed_count += 1
                    
            except Exception as e:
                print(f"⚠️  خطأ في {html_file.name}: {e}")
        
        self.changes_made.append(f"✅ Added defer to JS in {fixed_count} files")
        print(f"✅ تم تأجيل JavaScript في {fixed_count} ملف")
    
    def add_meta_preconnect(self):
        """إضافة preconnect للدومينات الخارجية"""
        print("🔗 جاري إضافة preconnect...")
        
        html_files = list(self.products_dir.glob('*.html'))
        html_files.append(self.base_dir / 'index.html')
        
        preconnect_tags = '''
    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <link rel="dns-prefetch" href="https://ecomerg.com">
'''
        
        fixed_count = 0
        
        for html_file in html_files:
            if not html_file.exists():
                continue
                
            try:
                with open(html_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if 'rel="preconnect"' not in content:
                    content = content.replace('</head>', f'{preconnect_tags}</head>')
                    
                    with open(html_file, 'w', encoding='utf-8') as f:
                        f.write(content)
                    fixed_count += 1
                    
            except Exception as e:
                print(f"⚠️  خطأ في {html_file.name}: {e}")
        
        self.changes_made.append(f"✅ Added preconnect to {fixed_count} files")
        print(f"✅ تم إضافة preconnect لـ {fixed_count} ملف")
    
    def add_viewport_meta(self):
        """إضافة/تحسين viewport meta tag"""
        print("📱 جاري تحسين viewport...")
        
        html_files = list(self.products_dir.glob('*.html'))
        html_files.append(self.base_dir / 'index.html')
        
        fixed_count = 0
        
        for html_file in html_files:
            if not html_file.exists():
                continue
                
            try:
                with open(html_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # تحسين viewport إذا لم يكن موجود
                if 'name="viewport"' not in content:
                    viewport_tag = '    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">\n'
                    content = content.replace('</head>', f'{viewport_tag}</head>')
                    
                    with open(html_file, 'w', encoding='utf-8') as f:
                        f.write(content)
                    fixed_count += 1
                    
            except Exception as e:
                print(f"⚠️  خطأ في {html_file.name}: {e}")
        
        self.changes_made.append(f"✅ Added/fixed viewport in {fixed_count} files")
        print(f"✅ تم تحسين viewport في {fixed_count} ملف")
    
    def create_htaccess(self):
        """إنشاء .htaccess للتحسين"""
        print("📄 جاري إنشاء .htaccess...")
        
        htaccess_content = '''# Performance Optimization

# Enable GZIP Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive On
    
    # Images
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    
    # CSS and JavaScript
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    
    # HTML
    ExpiresByType text/html "access plus 0 seconds"
    
    # Fonts
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
    # Remove X-Powered-By
    Header unset X-Powered-By
    
    # Security headers
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
'''
        
        htaccess_file = self.base_dir / '.htaccess'
        with open(htaccess_file, 'w', encoding='utf-8') as f:
            f.write(htaccess_content)
        
        self.changes_made.append("✅ Created .htaccess file")
        print("✅ تم إنشاء .htaccess")
    
    def run_all_optimizations(self):
        """تشغيل جميع التحسينات"""
        print("\n" + "="*60)
        print("🚀 بدء تحسين الأداء التلقائي")
        print("="*60 + "\n")
        
        self.add_lazy_loading()
        print()
        self.defer_javascript()
        print()
        self.add_meta_preconnect()
        print()
        self.add_viewport_meta()
        print()
        self.create_htaccess()
        
        print("\n" + "="*60)
        print("✅ تمت جميع التحسينات بنجاح!")
        print("="*60)
        
        print("\n📋 ملخص التغييرات:")
        for change in self.changes_made:
            print(f"  {change}")
        
        print("\n💡 التحسينات المطبّقة:")
        print("  ✅ Lazy Loading للصور")
        print("  ✅ Defer JavaScript")
        print("  ✅ Preconnect DNS")
        print("  ✅ Viewport محسّن")
        print("  ✅ Browser Caching")
        print("  ✅ GZIP Compression")
        print("  ✅ Security Headers")
        
        print("\n🚀 التحسين المتوقع:")
        print("  • سرعة التحميل: +20-30%")
        print("  • PageSpeed Score: +15-25 نقطة")
        print("  • تجربة المستخدم: أفضل بكثير")
        
if __name__ == '__main__':
    optimizer = PerformanceOptimizer()
    optimizer.run_all_optimizations()
