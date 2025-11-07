#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔍 مولد ملفات SEO و Google Merchant Center
"""

import json
import os
from datetime import datetime
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom

print("🔍 بدء إنشاء ملفات SEO...")
print("=" * 80)

if not os.path.exists('products_data.json'):
    print("❌ خطأ: ملف products_data.json غير موجود!")
    exit(1)

with open('products_data.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"✅ تم تحميل {len(products)} منتج")

BASE_URL = "https://sherow1982.github.io/sooq-alkuwait"
today = datetime.now().strftime("%Y-%m-%d")

# Product Sitemap
print("\n📦 إنشاء product-sitemap.xml...")

urlset = Element('urlset')
urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
urlset.set('xmlns:image', 'http://www.google.com/schemas/sitemap-image/1.1')

for product in products:
    url = SubElement(urlset, 'url')
    SubElement(url, 'loc').text = f"{BASE_URL}/{product['product_link']}"
    SubElement(url, 'lastmod').text = today
    SubElement(url, 'changefreq').text = 'weekly'
    SubElement(url, 'priority').text = '0.7'
    
    if product.get('image_link'):
        image = SubElement(url, 'image:image')
        SubElement(image, 'image:loc').text = product['image_link']
        SubElement(image, 'image:title').text = product['title']

xml_str = minidom.parseString(tostring(urlset, encoding='utf-8')).toprettyxml(indent="  ", encoding='utf-8')
with open('product-sitemap.xml', 'wb') as f:
    f.write(xml_str)

print(f"✅ product-sitemap.xml ({len(products)} منتج)")

# Google Merchant Feed
print("\n🛍️ إنشاء google-merchant-feed.xml...")

rss = Element('rss')
rss.set('version', '2.0')
rss.set('xmlns:g', 'http://base.google.com/ns/1.0')

channel = SubElement(rss, 'channel')
SubElement(channel, 'title').text = 'سوق الكويت'
SubElement(channel, 'link').text = BASE_URL
SubElement(channel, 'description').text = 'أفضل المنتجات - شحن مجاني'

for product in products:
    item = SubElement(channel, 'item')
    
    SubElement(item, 'g:id').text = str(product['id'])
    SubElement(item, 'g:title').text = product['title'][:150]
    SubElement(item, 'g:description').text = product.get('description', product['title'])[:5000]
    SubElement(item, 'g:link').text = f"{BASE_URL}/{product['product_link']}"
    
    if product.get('image_link'):
        SubElement(item, 'g:image_link').text = product['image_link']
    
    SubElement(item, 'g:price').text = f"{product['sale_price']:.2f} KWD"
    SubElement(item, 'g:availability').text = product.get('availability', 'in stock')
    SubElement(item, 'g:condition').text = 'new'
    SubElement(item, 'g:brand').text = 'سوق الكويت'
    
    shipping = SubElement(item, 'g:shipping')
    SubElement(shipping, 'g:country').text = 'KW'
    SubElement(shipping, 'g:service').text = 'Standard'
    SubElement(shipping, 'g:price').text = '0.00 KWD'

xml_str = minidom.parseString(tostring(rss, encoding='utf-8')).toprettyxml(indent="  ", encoding='utf-8')
with open('google-merchant-feed.xml', 'wb') as f:
    f.write(xml_str)

print(f"✅ google-merchant-feed.xml ({len(products)} منتج)")
print("\n" + "=" * 80)
print("✅ تم إنشاء جميع ملفات SEO!")
print("")
