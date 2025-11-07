#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
from datetime import datetime

print("=" * 80)
print("🌐 إنشاء ملفات SEO")
print("=" * 80)

print("\n📦 قراءة البيانات...")

try:
    with open('products_data.json', 'r', encoding='utf-8') as f:
        products = json.load(f)
    print(f"✅ {len(products)} منتج")
except Exception as e:
    print(f"❌ خطأ: {e}")
    exit(1)

base_url = "https://sherow1982.github.io/sooq-alkuwait"
current_date = datetime.now().strftime('%Y-%m-%d')

# ==========================================
# Sitemap الرئيسي
# ==========================================

print("\n🗺️  إنشاء sitemap.xml...")

sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
sitemap += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n'

# الصفحات الأساسية
pages = [
    ('index.html', '1.0', 'daily'),
    ('products-catalog.html', '0.9', 'daily'),
    ('cart.html', '0.7', 'weekly')
]

for page, priority, changefreq in pages:
    sitemap += f'    <url>\n'
    sitemap += f'        <loc>{base_url}/{page}</loc>\n'
    sitemap += f'        <lastmod>{current_date}</lastmod>\n'
    sitemap += f'        <changefreq>{changefreq}</changefreq>\n'
    sitemap += f'        <priority>{priority}</priority>\n'
    sitemap += f'    </url>\n\n'

# المنتجات
for product in products:
    product_url = base_url + '/' + product.get('product_link', '')
    sitemap += f'    <url>\n'
    sitemap += f'        <loc>{product_url}</loc>\n'
    sitemap += f'        <lastmod>{current_date}</lastmod>\n'
    sitemap += f'        <priority>0.8</priority>\n'

    if product.get('image_link'):
        sitemap += f'        <image:image>\n'
        sitemap += f'            <image:loc>{product["image_link"]}</image:loc>\n'
        sitemap += f'            <image:title>{product.get("title", "منتج")}</image:title>\n'
        sitemap += f'        </image:image>\n'

    sitemap += f'    </url>\n\n'

sitemap += '</urlset>'

with open('sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(sitemap)

print(f"✅ sitemap.xml ({len(products) + 3} صفحة)")

# ==========================================
# Product Sitemap
# ==========================================

print("\n🛍️  إنشاء product-sitemap.xml...")

product_sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
product_sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
product_sitemap += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n'

for product in products:
    product_url = base_url + '/' + product.get('product_link', '')
    product_sitemap += f'    <url>\n'
    product_sitemap += f'        <loc>{product_url}</loc>\n'
    product_sitemap += f'        <lastmod>{current_date}</lastmod>\n'

    if product.get('image_link'):
        desc = product.get('description', '')[:150]
        product_sitemap += f'        <image:image>\n'
        product_sitemap += f'            <image:loc>{product["image_link"]}</image:loc>\n'
        product_sitemap += f'            <image:title>{product.get("title", "منتج")}</image:title>\n'
        product_sitemap += f'            <image:caption>{desc}</image:caption>\n'
        product_sitemap += f'        </image:image>\n'

    product_sitemap += f'    </url>\n\n'

product_sitemap += '</urlset>'

with open('product-sitemap.xml', 'w', encoding='utf-8') as f:
    f.write(product_sitemap)

print(f"✅ product-sitemap.xml ({len(products)} منتج)")

# ==========================================
# Google Merchant Feed
# ==========================================

print("\n🏪 إنشاء google-merchant-feed.xml...")

feed = '<?xml version="1.0" encoding="UTF-8"?>\n'
feed += '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n'
feed += '    <channel>\n'
feed += '        <title>سوق الكويت - منتجات عالية الجودة</title>\n'
feed += f'        <link>{base_url}</link>\n'
feed += '        <description>متجر إلكتروني متخصص في توفير منتجات عالية الجودة بأسعار تنافسية</description>\n\n'

for product in products:
    product_url = base_url + '/' + product.get('product_link', '')
    title = product.get('title', 'منتج')
    description = product.get('description', title)[:5000]
    price = float(product.get('sale_price', product.get('price', 0)))
    original_price = float(product.get('price', price))
    image = product.get('image_link', '')
    product_id = product.get('id', '')

    feed += f'        <item>\n'
    feed += f'            <g:id>{product_id}</g:id>\n'
    feed += f'            <g:title>{title}</g:title>\n'
    feed += f'            <g:description>{description}</g:description>\n'
    feed += f'            <g:link>{product_url}</g:link>\n'
    feed += f'            <g:image_link>{image}</g:image_link>\n'
    feed += f'            <g:condition>new</g:condition>\n'
    feed += f'            <g:availability>in stock</g:availability>\n'
    feed += f'            <g:price>{price:.2f} KWD</g:price>\n'

    if original_price > price:
        feed += f'            <g:sale_price>{price:.2f} KWD</g:sale_price>\n'

    feed += f'            <g:brand>سوق الكويت</g:brand>\n'
    feed += f'            <g:shipping>\n'
    feed += f'                <g:country>KW</g:country>\n'
    feed += f'                <g:service>شحن مجاني</g:service>\n'
    feed += f'                <g:price>0 KWD</g:price>\n'
    feed += f'            </g:shipping>\n'
    feed += f'            <g:google_product_category>تسوق</g:google_product_category>\n'
    feed += f'        </item>\n\n'

feed += '    </channel>\n'
feed += '</rss>'

with open('google-merchant-feed.xml', 'w', encoding='utf-8') as f:
    f.write(feed)

print(f"✅ google-merchant-feed.xml ({len(products)} منتج)")

# ==========================================
# robots.txt
# ==========================================

print("\n🤖 إنشاء robots.txt...")

robots = f'''User-agent: *
Allow: /

Sitemap: {base_url}/sitemap.xml
Sitemap: {base_url}/product-sitemap.xml
'''

with open('robots.txt', 'w', encoding='utf-8') as f:
    f.write(robots)

print("✅ robots.txt")

# ==========================================
# التقرير النهائي
# ==========================================

print("\n" + "=" * 80)
print("🎉 تم إنشاء جميع ملفات SEO!")
print("=" * 80)

print("\n📋 الملفات:")
print(f"   ✅ sitemap.xml")
print(f"   ✅ product-sitemap.xml")
print(f"   ✅ google-merchant-feed.xml")
print(f"   ✅ robots.txt")

print("\n🎯 الإحصائيات:")
print(f"   📊 عدد الصفحات: {len(products) + 3}")
print(f"   🛍️ عدد المنتجات: {len(products)}")
print(f"   🖼️ المنتجات بصور: {sum(1 for p in products if p.get('image_link'))}")

print("\n🚀 الخطوة التالية:")
print("   git add *.xml robots.txt")
print("   git commit -m 'Add SEO files'")
print("   git push origin main")

print("\n📊 الروابط:")
print(f"   {base_url}/sitemap.xml")
print(f"   {base_url}/google-merchant-feed.xml")
print("=" * 80)
