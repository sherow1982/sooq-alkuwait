#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت لإنشاء ملفات SEO (Sitemap, Google Merchant Feed, Robots.txt)
من ملفات المنتجات الموجودة في مجلد products-pages

الاستخدام:
    python generate_seo_files.py
"""

import os
import re
from datetime import datetime
from pathlib import Path

def clean_xml_text(text):
    """تنظيف النص من الرموز الخاصة في XML"""
    if text is None:
        return ""
    text = str(text)
    # استبدال الرموز الخاصة بالترتيب الصحيح (& أولاً ثم الباقي)
    text = text.replace("&", "&amp;")
    text = text.replace("<", "&lt;")
    text = text.replace(">", "&gt;")
    text = text.replace('"', "&quot;")
    text = text.replace("'", "&apos;")
    return text

def extract_product_info(html_file):
    """استخراج معلومات المنتج من ملف HTML"""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # استخراج العنوان
        title_match = re.search(r'<title>(.*?)</title>', content)
        title = title_match.group(1) if title_match else "منتج"

        # استخراج الوصف
        desc_match = re.search(r'<meta name="description" content="(.*?)"', content)
        description = desc_match.group(1) if desc_match else "منتج عالي الجودة"

        # استخراج السعر
        price_match = re.search(r'<span class="price[^"]*"[^>]*>([\d.]+)\s*KWD</span>', content)
        price = price_match.group(1) if price_match else "13.00"

        # استخراج رابط الصورة
        img_match = re.search(r'<img[^>]+src="([^"]+)"[^>]*class="product-image', content)
        image = img_match.group(1) if img_match else ""

        return {
            'title': title.replace(' - سوق الكويت', ''),
            'description': description[:500],  # أول 500 حرف
            'price': price,
            'image': image
        }
    except Exception as e:
        print(f"خطأ في قراءة {html_file}: {e}")
        return None

def create_sitemap(products_dir="products-pages", base_url="https://sherow1982.github.io/sooq-alkuwait"):
    """إنشاء ملف sitemap.xml"""
    print("🔨 إنشاء sitemap.xml...")

    sitemap = ['<?xml version="1.0" encoding="UTF-8"?>']
    sitemap.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
    sitemap.append('        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">')

    # الصفحات الرئيسية
    today = datetime.now().strftime("%Y-%m-%d")

    main_pages = [
        (f"{base_url}/", "daily", "1.0"),
        (f"{base_url}/index.html", "daily", "1.0"),
        (f"{base_url}/products-catalog.html", "daily", "0.9"),
        (f"{base_url}/cart.html", "weekly", "0.7"),
    ]

    for url, changefreq, priority in main_pages:
        sitemap.append('    <url>')
        sitemap.append(f'        <loc>{clean_xml_text(url)}</loc>')
        sitemap.append(f'        <lastmod>{today}</lastmod>')
        sitemap.append(f'        <changefreq>{changefreq}</changefreq>')
        sitemap.append(f'        <priority>{priority}</priority>')
        sitemap.append('    </url>')

    # صفحات المنتجات
    if os.path.exists(products_dir):
        product_files = sorted([f for f in os.listdir(products_dir) if f.endswith('.html')])
        print(f"✅ تم العثور على {len(product_files)} منتج")

        for product_file in product_files:
            product_url = f"{base_url}/{products_dir}/{product_file}"
            product_path = os.path.join(products_dir, product_file)

            # استخراج معلومات المنتج
            info = extract_product_info(product_path)

            sitemap.append('    <url>')
            sitemap.append(f'        <loc>{clean_xml_text(product_url)}</loc>')
            sitemap.append(f'        <lastmod>{today}</lastmod>')
            sitemap.append('        <changefreq>weekly</changefreq>')
            sitemap.append('        <priority>0.8</priority>')

            # إضافة الصورة إن وجدت
            if info and info.get('image'):
                sitemap.append('        <image:image>')
                sitemap.append(f'            <image:loc>{clean_xml_text(info["image"])}</image:loc>')
                sitemap.append(f'            <image:title>{clean_xml_text(info["title"])}</image:title>')
                sitemap.append('        </image:image>')

            sitemap.append('    </url>')

    sitemap.append('</urlset>')

    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write('\n'.join(sitemap))

    print(f"✅ تم إنشاء sitemap.xml ({len(product_files) + len(main_pages)} صفحة)")

def create_merchant_feed(products_dir="products-pages", base_url="https://sherow1982.github.io/sooq-alkuwait"):
    """إنشاء ملف google-merchant-feed.xml"""
    print("🔨 إنشاء google-merchant-feed.xml...")

    feed = ['<?xml version="1.0" encoding="UTF-8"?>']
    feed.append('<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">')
    feed.append('    <channel>')
    feed.append('        <title>سوق الكويت - منتجات عالية الجودة</title>')
    feed.append(f'        <link>{base_url}</link>')
    feed.append('        <description>متجر إلكتروني متخصص في توفير منتجات عالية الجودة بأسعار تنافسية</description>')

    # المنتجات
    if os.path.exists(products_dir):
        product_files = sorted([f for f in os.listdir(products_dir) if f.endswith('.html')])

        for idx, product_file in enumerate(product_files, 1):
            product_url = f"{base_url}/{products_dir}/{product_file}"
            product_path = os.path.join(products_dir, product_file)

            # استخراج معلومات المنتج
            info = extract_product_info(product_path)

            if info:
                feed.append('        <item>')
                feed.append(f'            <g:id>{idx}</g:id>')
                feed.append(f'            <g:title>{clean_xml_text(info["title"])}</g:title>')
                feed.append(f'            <g:description>{clean_xml_text(info["description"])}</g:description>')
                feed.append(f'            <g:link>{clean_xml_text(product_url)}</g:link>')
                feed.append(f'            <g:image_link>{clean_xml_text(info["image"])}</g:image_link>')
                feed.append('            <g:condition>new</g:condition>')
                feed.append('            <g:availability>in stock</g:availability>')
                feed.append(f'            <g:price>{info["price"]} KWD</g:price>')
                feed.append(f'            <g:sale_price>{info["price"]} KWD</g:sale_price>')
                feed.append('            <g:brand>سوق الكويت</g:brand>')
                feed.append('            <g:shipping>')
                feed.append('                <g:country>KW</g:country>')
                feed.append('                <g:service>شحن مجاني</g:service>')
                feed.append('                <g:price>0 KWD</g:price>')
                feed.append('            </g:shipping>')
                feed.append('            <g:google_product_category>تسوق</g:google_product_category>')
                feed.append('        </item>')

    feed.append('    </channel>')
    feed.append('</rss>')

    with open('google-merchant-feed.xml', 'w', encoding='utf-8') as f:
        f.write('\n'.join(feed))

    print(f"✅ تم إنشاء google-merchant-feed.xml ({len(product_files)} منتج)")

def create_robots(base_url="https://sherow1982.github.io/sooq-alkuwait"):
    """إنشاء ملف robots.txt"""
    print("🔨 إنشاء robots.txt...")

    robots = f"""# Robots.txt for سوق الكويت
User-agent: *
Allow: /

# Sitemaps
Sitemap: {base_url}/sitemap.xml
Sitemap: {base_url}/google-merchant-feed.xml

# Crawl-delay
Crawl-delay: 1

# Allow all search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Disallow admin areas (if any)
User-agent: *
Disallow: /admin/
Disallow: /temp/
"""

    with open('robots.txt', 'w', encoding='utf-8') as f:
        f.write(robots)

    print("✅ تم إنشاء robots.txt")

def main():
    """الدالة الرئيسية"""
    print("=" * 60)
    print("🚀 بدء إنشاء ملفات SEO لسوق الكويت")
    print("=" * 60)

    # التحقق من وجود مجلد المنتجات
    if not os.path.exists("products-pages"):
        print("❌ خطأ: لم يتم العثور على مجلد products-pages")
        print("💡 تأكد من تشغيل السكريبت في المجلد الرئيسي للمشروع")
        return

    # إنشاء الملفات
    create_sitemap()
    create_merchant_feed()
    create_robots()

    print("=" * 60)
    print("✅ تم إنشاء جميع الملفات بنجاح!")
    print("=" * 60)
    print("\n📁 الملفات المُنشأة:")
    print("  - sitemap.xml")
    print("  - google-merchant-feed.xml")
    print("  - robots.txt")
    print("\n🔗 الخطوة التالية:")
    print("  git add sitemap.xml google-merchant-feed.xml robots.txt")
    print("  git commit -m \"update: SEO files with all products\"")
    print("  git push origin main")

if __name__ == "__main__":
    main()
