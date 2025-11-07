#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت فهرسة فورية محسّن - IndexNow + Google/Bing Ping
Instant Indexing Script - Optimized
"""

import requests
from pathlib import Path
from urllib.parse import quote
import json
import time

class InstantIndexer:
    def __init__(self):
        self.site_url = "https://sooq-alkuwait.arabsad.com"
        self.products_dir = Path("products-pages")
        self.key_file = "indexnow-key.txt"
        self.indexnow_api = "https://api.indexnow.org/indexnow"
        
    def get_or_create_key(self):
        """الحصول على المفتاح الموجود أو إنشاء واحد جديد"""
        key_path = Path(self.key_file)
        
        if key_path.exists():
            with open(key_path, 'r', encoding='utf-8') as f:
                key = f.read().strip()
            print(f"✅ استخدام المفتاح الموجود: {key}")
            return key
        
        # إنشاء مفتاح جديد فقط إذا لم يكن موجود
        import secrets
        key = secrets.token_hex(16)
        
        with open(key_path, 'w', encoding='utf-8') as f:
            f.write(key)
        
        print(f"✅ تم إنشاء مفتاح جديد: {key}")
        print(f"⚠️ يجب رفع الملف: {key}.txt للموقع")
        
        return key
    
    def ping_search_engines(self):
        """إرسال ping لـ Google و Bing"""
        print("\n" + "="*60)
        print("📡 إرسال Sitemap لمحركات البحث")
        print("="*60)
        
        sitemap_url = f"{self.site_url}/sitemap.xml"
        
        # Ping Google
        print("\n🔗 Pinging Google...")
        try:
            google_ping = f"http://www.google.com/ping?sitemap={sitemap_url}"
            response = requests.get(google_ping, timeout=10)
            print(f"✅ Google: {response.status_code}")
        except Exception as e:
            print(f"⚠️ خطأ في Google ping: {e}")
        
        # Ping Bing
        print("🔗 Pinging Bing...")
        try:
            bing_ping = f"http://www.bing.com/webmaster/ping.aspx?siteMap={sitemap_url}"
            response = requests.get(bing_ping, timeout=10)
            print(f"✅ Bing: {response.status_code}")
        except Exception as e:
            print(f"⚠️ خطأ في Bing ping: {e}")
    
    def create_key_file_for_upload(self, key):
        """إنشاء ملف المفتاح للرفع"""
        key_filename = f"{key}.txt"
        
        with open(key_filename, 'w', encoding='utf-8') as f:
            f.write(key)
        
        print(f"\n📄 تم إنشاء ملف المفتاح: {key_filename}")
        print(f"🔗 يجب رفعه على: {self.site_url}/{key_filename}")
        
        return key_filename
    
    def get_all_product_urls(self):
        """الحصول على جميع روابط المنتجات"""
        urls = []
        
        # الصفحة الرئيسية
        urls.append(f"{self.site_url}/")
        urls.append(f"{self.site_url}/index.html")
        
        # صفحات المنتجات
        for html_file in sorted(self.products_dir.glob('*.html')):
            filename = quote(html_file.name)
            url = f"{self.site_url}/products-pages/{filename}"
            urls.append(url)
        
        return urls
    
    def submit_to_indexnow(self, key, urls, batch_size=100):
        """إرسال الروابط لـ IndexNow بدفعات"""
        print("\n" + "="*60)
        print("🚀 إرسال الروابط لـ IndexNow")
        print("="*60)
        
        total_urls = len(urls)
        print(f"\n📊 إجمالي الروابط: {total_urls}")
        
        # تقسيم الروابط لدفعات (IndexNow يقبل 10000 URL بحد أقصى، لكن نستخدم دفعات صغيرة)
        batches = [urls[i:i+batch_size] for i in range(0, len(urls), batch_size)]
        
        print(f"📦 عدد الدفعات: {len(batches)}")
        
        success_count = 0
        failed_count = 0
        
        for idx, batch in enumerate(batches, 1):
            print(f"\n📤 إرسال دفعة {idx}/{len(batches)} ({len(batch)} رابط)...")
            
            payload = {
                "host": "sooq-alkuwait.arabsad.com",
                "key": key,
                "keyLocation": f"{self.site_url}/{key}.txt",
                "urlList": batch
            }
            
            try:
                headers = {
                    "Content-Type": "application/json; charset=utf-8"
                }
                
                response = requests.post(
                    self.indexnow_api,
                    json=payload,
                    headers=headers,
                    timeout=30
                )
                
                print(f"   الحالة: {response.status_code}")
                
                if response.status_code in [200, 202]:
                    print(f"   ✅ نجح! تم قبول {len(batch)} رابط")
                    success_count += len(batch)
                else:
                    print(f"   ⚠️ {response.text}")
                    failed_count += len(batch)
                
                # انتظار بسيط بين الدفعات
                if idx < len(batches):
                    time.sleep(2)
                    
            except Exception as e:
                print(f"   ❌ خطأ: {e}")
                failed_count += len(batch)
        
        print("\n" + "="*60)
        print("📊 ملخص النتائج")
        print("="*60)
        print(f"✅ نجح: {success_count} رابط")
        print(f"❌ فشل: {failed_count} رابط")
        print(f"📊 الإجمالي: {total_urls} رابط")
    
    def run(self):
        """تشغيل عملية الفهرسة الكاملة"""
        print("\n" + "="*60)
        print("🚀 بدء الفهرسة الفورية لموقع سوق الكويت")
        print("="*60)
        
        # 1. Ping محركات البحث
        self.ping_search_engines()
        
        # 2. الحصول على المفتاح
        key = self.get_or_create_key()
        
        # 3. إنشاء ملف المفتاح للرفع
        key_filename = self.create_key_file_for_upload(key)
        
        # 4. التحقق من رفع الملف
        key_url = f"{self.site_url}/{key}.txt"
        print(f"\n⚠️ تأكد من رفع الملف: {key_filename}")
        print(f"🔗 على الرابط: {key_url}")
        print(f"📝 يجب أن يعرض فقط: {key}")
        
        input("\n⏸️ اضغط Enter بعد التأكد من رفع الملف ونشره...")
        
        # 5. التحقق من توفر الملف
        print(f"\n🔍 جاري التحقق من الملف...")
        try:
            response = requests.get(key_url, timeout=10)
            if response.status_code == 200 and response.text.strip() == key:
                print("✅ الملف موجود ومتحقق منه!")
            else:
                print(f"⚠️ الملف موجود لكن المحتوى غير صحيح: {response.text[:100]}")
        except Exception as e:
            print(f"❌ لا يمكن الوصول للملف: {e}")
            print("⚠️ سنحاول الإرسال على أي حال...")
        
        # 6. جمع جميع الروابط
        print(f"\n📦 جاري جمع جميع روابط الموقع...")
        urls = self.get_all_product_urls()
        print(f"✅ تم جمع {len(urls)} رابط")
        
        # 7. إرسال لـ IndexNow
        self.submit_to_indexnow(key, urls)
        
        print("\n" + "="*60)
        print("✨ انتهت عملية الفهرسة!")
        print("="*60)
        print("\n💡 النصائح:")
        print("  • تحقق من Google Search Console بعد 24 ساعة")
        print("  • راجع Bing Webmaster Tools بعد 48 ساعة")
        print("  • أعد تشغيل السكريبت أسبوعياً للروابط الجديدة")
        print(f"\n🔗 الموقع: {self.site_url}")

if __name__ == '__main__':
    indexer = InstantIndexer()
    indexer.run()
