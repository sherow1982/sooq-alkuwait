#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت فهرسة فورية لموقع سوق الكويت عبر IndexNow وPing Google + Bing
"""

import requests
from pathlib import Path
from urllib.parse import quote
import json

SITE_URL = "https://sooq-alkuwait.arabsad.com"
PRODUCTS_DIR = Path("products-pages")
SITEMAP = f"{SITE_URL}/sitemap.xml"
INDEXNOW_API = "https://api.indexnow.org/indexnow"
PING_GOOGLE = f"http://www.google.com/ping?sitemap={SITEMAP}"
PING_BING = f"http://www.bing.com/webmaster/ping.aspx?siteMap={SITEMAP}"
KEY_FILE = "indexnow-key.txt"

# 1. إرسال Sitemap لـ Google وBing (Ping)
def ping_search_engines():
    print("🔗 Pinging Google...")
    requests.get(PING_GOOGLE)
    print(f"✅ PING sent to Google: {PING_GOOGLE}")
    print("🔗 Pinging Bing...")
    requests.get(PING_BING)
    print(f"✅ PING sent to Bing: {PING_BING}")

# 2. إنشاء API KEY واختبار IndexNow
def create_indexnow_key():
    import secrets
    key = secrets.token_hex(16)
    with open(KEY_FILE, "w", encoding="utf-8") as f:
        f.write(key)
    print(f"✅ Created IndexNow key: {key}")
    # التعليمات: ضع هذا المفتاح public في جذر الموقع ملف نصي باسم نفسه
    return key

# 3. فهرسة روابط المنتجات تلقائياً عبر IndexNow
def index_urls_indexnow(key, limit=2000):
    urls = []
    count = 0
    for html_file in PRODUCTS_DIR.glob("*.html"):
        url = f"{SITE_URL}/products-pages/{quote(html_file.name)}"
        urls.append(url)
        count += 1
        if count >= limit:
            break
    payload = {
        "host": "sooq-alkuwait.arabsad.com",
        "key": key,
        "keyLocation": f"{SITE_URL}/{key}.txt",
        "urlList": urls
    }
    print(f"🔔 Sending {len(urls)} URLs to IndexNow...")
    res = requests.post(INDEXNOW_API, data=json.dumps(payload))
    print("✅ Response:", res.status_code, res.text)

if __name__ == "__main__":
    ping_search_engines()
    key = create_indexnow_key()
    print(f"⚠️ الآن انسخ الملف {KEY_FILE} وضعه public في جذر الموقع وادخل الرابط: {SITE_URL}/{key}.txt")
    input("اضغط Enter بعد تحميل الملف...")
    index_urls_indexnow(key)