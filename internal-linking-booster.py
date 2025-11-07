#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت لإضافة روابط داخلية تلقائية بين المنتجات
Internal Linking Booster for SEO
"""

from pathlib import Path
from urllib.parse import quote
import random
import re

SITE_URL = "https://sooq-alkuwait.arabsad.com"
PRODUCTS_DIR = Path("products-pages")

MAX_LINKS_PER_PAGE = 12   # عدد الروابط الداخلية داخل كل منتج

# جمع عناوين وروابط كل المنتجات
all_products = []
for html_file in PRODUCTS_DIR.glob('*.html'):
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        # استخراج العنوان
        title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', content)
        title = title_match.group(1).strip() if title_match else html_file.name
        filename = quote(html_file.name)
        url = f"{SITE_URL}/products-pages/{filename}"
        all_products.append({"file": html_file, "title": title, "url": url})
    except Exception:
        continue

print(f"📦 جمع {len(all_products)} منتج بنجاح\n")

for idx, product in enumerate(all_products):
    # اختيار عشوائي منتجات أخرى للربط معها
    candidates = [p for i, p in enumerate(all_products) if i != idx]
    random.shuffle(candidates)
    links = candidates[:MAX_LINKS_PER_PAGE]

    # بناء كود الروابط
    internal_links_html = '\n'.join([f'<li><a href="{p["url"]}" title="{p["title"]}">{p["title"]}</a></li>' for p in links])
    internal_links_block = f'''\n<!-- روابط داخلية تلقائية SEO -->\n<section class="internal-links-seo" style="padding:14px 0 10px 0">\n  <strong>منتجات مقترحة قد تعجبك:</strong>\n  <ul style="list-style:square inside;column-count:2;font-size:1em;">\n{internal_links_html}\n  </ul>\n</section>\n'''

    # تحميل الملف وإضافة البلوك قبل </body>
    try:
        with open(product["file"], 'r', encoding='utf-8') as f:
            html = f.read()
        # حذف أي بلوك قديم داخلي من نفس النمط
        html = re.sub(r'<!-- روابط داخلية تلقائية SEO -->(.|\n)*?</section>', '', html, flags=re.MULTILINE)
        # إضافته قبل </body>
        if '</body>' in html:
            html = html.replace('</body>', f'{internal_links_block}\n</body>')
        else:
            html += internal_links_block
        with open(product["file"], 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"✅ {product["title"]} - روابط داخلية مضافة")
    except Exception as e:
        print(f"⚠️ خطأ في {product["file"].name}: {e}")

print("\n🎯 تمَّت إضافة الروابط الداخلية لكل المنتجات!")
