#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت إنشاء Google Merchant Feed كامل
يقرأ من sitemap.xml وينشئ merchant feed متطابق
"""

import os
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import unquote
from datetime import datetime

class MerchantFeedGenerator:
    def __init__(self, base_dir='.'):
        self.base_dir = Path(base_dir)
        self.products_dir = self.base_dir / 'products-pages'
        self.base_url = 'https://sooq-alkuwait.arabsad.com'
        
    def extract_product_info(self, html_file):
        """استخراج معلومات المنتج من ملف HTML"""
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # استخراج العنوان
            title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', content)
            title = title_match.group(1).strip() if title_match else 'منتج'
            
            # استخراج الوصف
            desc_match = re.search(r'<meta name="description" content="([^"]+)"', content)
            description = desc_match.group(1).strip() if desc_match else title
            
            # استخراج السعر
            price_match = re.search(r'<span class="sale-price">([0-9.]+)\s*د\.ك</span>', content)
            price = price_match.group(1) if price_match else '0.00'
            
            # استخراج السعر الأصلي
            orig_price_match = re.search(r'<span class="original-price">([0-9.]+)\s*د\.ك</span>', content)
            original_price = orig_price_match.group(1) if orig_price_match else price
            
            # استخراج الصورة
            img_match = re.search(r'<img[^>]*src="([^"]+)"[^>]*class="product-image"', content)
            if not img_match:
                img_match = re.search(r'<meta property="og:image" content="([^"]+)"', content)
            image_url = img_match.group(1) if img_match else ''
            
            return {
                'title': title,
                'description': description,
                'price': price,
                'original_price': original_price,
                'image_url': image_url
            }
            
        except Exception as e:
            print(f"⚠️ خطأ في قراءة {html_file.name}: {e}")
            return None
    
    def generate_feed(self):
        """إنشاء Google Merchant Feed كامل"""
        print("🛍️ جاري إنشاء Google Merchant Feed...\n")
        
        html_files = sorted(list(self.products_dir.glob('*.html')))
        
        from urllib.parse import quote
        
        # إنشاء XML header
        feed = '<?xml version="1.0" encoding="UTF-8"?>\n'
        feed += '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n'
        feed += '  <channel>\n'
        feed += f'    <title>سوق الكويت - منتجات عالية الجودة</title>\n'
        feed += f'    <link>{self.base_url}</link>\n'
        feed += f'    <description>متجر إلكتروني متخصص في توفير منتجات عالية الجودة بأسعار تنافسية في الكويت</description>\n\n'
        
        # إضافة المنتجات
        for idx, html_file in enumerate(html_files, 1):
            product_info = self.extract_product_info(html_file)
            
            if product_info:
                filename = quote(html_file.name)
                product_url = f"{self.base_url}/products-pages/{filename}"
                
                feed += f'    <item>\n'
                feed += f'      <g:id>{idx}</g:id>\n'
                feed += f'      <g:title><![CDATA[{product_info["title"]}]]></g:title>\n'
                feed += f'      <g:description><![CDATA[{product_info["description"]}]]></g:description>\n'
                feed += f'      <g:link>{product_url}</g:link>\n'
                
                if product_info['image_url']:
                    feed += f'      <g:image_link>{product_info["image_url"]}</g:image_link>\n'
                
                feed += f'      <g:condition>new</g:condition>\n'
                feed += f'      <g:availability>in stock</g:availability>\n'
                feed += f'      <g:price>{product_info["price"]} KWD</g:price>\n'
                
                if product_info['original_price'] != product_info['price']:
                    feed += f'      <g:sale_price>{product_info["price"]} KWD</g:sale_price>\n'
                
                feed += f'      <g:brand>سوق الكويت</g:brand>\n'
                feed += f'      <g:shipping>\n'
                feed += f'        <g:country>KW</g:country>\n'
                feed += f'        <g:service>شحن مجاني</g:service>\n'
                feed += f'        <g:price>0 KWD</g:price>\n'
                feed += f'      </g:shipping>\n'
                feed += f'      <g:google_product_category>تسوق</g:google_product_category>\n'
                feed += f'    </item>\n\n'
            
            if idx % 100 == 0:
                print(f"⏳ تمت معالجة {idx} منتج...")
        
        feed += '  </channel>\n'
        feed += '</rss>'
        
        # حفظ الملف
        feed_file = self.base_dir / 'google-merchant-feed.xml'
        with open(feed_file, 'w', encoding='utf-8') as f:
            f.write(feed)
        
        print(f"\n✅ تم إنشاء google-merchant-feed.xml مع {len(html_files)} منتج")
        print(f"📁 الملف: {feed_file}")
        print(f"🔗 الرابط: {self.base_url}/google-merchant-feed.xml")

if __name__ == '__main__':
    print("="*60)
    print("🛍️ Google Merchant Feed Generator")
    print("="*60 + "\n")
    
    generator = MerchantFeedGenerator()
    generator.generate_feed()
    
    print("\n" + "="*60)
    print("✅ اكتمل!")
    print("="*60)
