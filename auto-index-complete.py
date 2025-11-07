#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت فهرسة تلقائي كامل مع رفع تلقائي للمفتاح
Complete Auto Indexing with Automatic Key Upload
"""

import requests
import subprocess
import time
from pathlib import Path
from urllib.parse import quote
import json

class AutoIndexer:
    def __init__(self):
        self.site_url = "https://sooq-alkuwait.arabsad.com"
        self.products_dir = Path("products-pages")
        self.key_file = "indexnow-key.txt"
        self.indexnow_api = "https://api.indexnow.org/indexnow"
        
    def get_or_create_key(self):
        """الحصول على مفتاح ثابت"""
        key_path = Path(self.key_file)
        
        if key_path.exists():
            with open(key_path, 'r', encoding='utf-8') as f:
                key = f.read().strip()
            print(f"✅ مفتاح موجود: {key}")
            return key
        
        import secrets
        key = secrets.token_hex(16)
        
        with open(key_path, 'w', encoding='utf-8') as f:
            f.write(key)
        
        print(f"✅ مفتاح جديد: {key}")
        return key
    
    def upload_key_to_repo(self, key):
        """رفع ملف المفتاح للريبو تلقائياً"""
        print(f"\n📤 جاري رفع ملف المفتاح للريبو...")
        
        key_filename = f"{key}.txt"
        
        # إنشاء ملف المفتاح
        with open(key_filename, 'w', encoding='utf-8') as f:
            f.write(key)
        
        try:
            # Git add
            subprocess.run(['git', 'add', key_filename], check=True)
            
            # Git commit
            subprocess.run(
                ['git', 'commit', '-m', f'Add IndexNow key: {key_filename}'],
                check=True
            )
            
            # Git push
            subprocess.run(['git', 'push', 'origin', 'main'], check=True)
            
            print(f"✅ تم رفع الملف بنجاح!")
            print(f"⏳ انتظر 60 ثانية لنشر الملف...")
            
            # انتظار نشر الملف
            for i in range(60, 0, -10):
                print(f"   ⏳ {i} ثانية متبقية...")
                time.sleep(10)
            
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"⚠️ خطأ في Git: {e}")
            print("📌 قد يكون الملف موجود بالفعل")
            return False
    
    def ping_search_engines(self):
        """إرسال ping لمحركات البحث"""
        print("\n📡 Pinging محركات البحث...")
        
        sitemap_url = f"{self.site_url}/sitemap.xml"
        
        try:
            requests.get(f"http://www.google.com/ping?sitemap={sitemap_url}", timeout=10)
            print("✅ Google pinged")
        except:
            print("⚠️ Google ping failed")
        
        try:
            requests.get(f"http://www.bing.com/webmaster/ping.aspx?siteMap={sitemap_url}", timeout=10)
            print("✅ Bing pinged")
        except:
            print("⚠️ Bing ping failed")
    
    def get_all_urls(self):
        """جمع جميع الروابط"""
        urls = [f"{self.site_url}/", f"{self.site_url}/index.html"]
        
        for html_file in sorted(self.products_dir.glob('*.html')):
            filename = quote(html_file.name)
            urls.append(f"{self.site_url}/products-pages/{filename}")
        
        return urls
    
    def submit_to_indexnow(self, key, urls):
        """إرسال الروابط لـ IndexNow"""
        print(f"\n🚀 إرسال {len(urls)} رابط لـ IndexNow...")
        
        # تقسيم لدفعات (100 URL لكل دفعة)
        batch_size = 100
        batches = [urls[i:i+batch_size] for i in range(0, len(urls), batch_size)]
        
        success = 0
        failed = 0
        
        for idx, batch in enumerate(batches, 1):
            print(f"\n📦 دفعة {idx}/{len(batches)} ({len(batch)} رابط)...")
            
            payload = {
                "host": "sooq-alkuwait.arabsad.com",
                "key": key,
                "keyLocation": f"{self.site_url}/{key}.txt",
                "urlList": batch
            }
            
            try:
                response = requests.post(
                    self.indexnow_api,
                    json=payload,
                    headers={"Content-Type": "application/json; charset=utf-8"},
                    timeout=30
                )
                
                if response.status_code in [200, 202]:
                    print(f"   ✅ نجح! ({response.status_code})")
                    success += len(batch)
                else:
                    print(f"   ⚠️ فشل ({response.status_code}): {response.text[:100]}")
                    failed += len(batch)
                
                time.sleep(2)
                
            except Exception as e:
                print(f"   ❌ خطأ: {e}")
                failed += len(batch)
        
        print(f"\n📊 النتائج: ✅ {success} | ❌ {failed} | 📊 {len(urls)}")
    
    def run(self):
        """تشغيل كامل"""
        print("\n" + "="*60)
        print("🚀 فهرسة تلقائية لموقع سوق الكويت")
        print("="*60)
        
        # 1. Ping
        self.ping_search_engines()
        
        # 2. المفتاح
        key = self.get_or_create_key()
        
        # 3. رفع المفتاح
        key_uploaded = self.upload_key_to_repo(key)
        
        # 4. جمع الروابط
        print(f"\n📦 جمع الروابط...")
        urls = self.get_all_urls()
        print(f"✅ {len(urls)} رابط")
        
        # 5. إرسال
        self.submit_to_indexnow(key, urls)
        
        print("\n" + "="*60)
        print("✨ انتهى!")
        print("="*60)
        print("\n🔗 تحقق من:")
        print(f"  • {self.site_url}/{key}.txt")
        print(f"  • Google Search Console")
        print(f"  • Bing Webmaster Tools")

if __name__ == '__main__':
    indexer = AutoIndexer()
    indexer.run()
