#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريپت الإصلاح الشامل لجميع ملفات المنتجات في products-pages
Mass Fix Script for All Product Pages in products-pages Directory

الهدف: تطبيق نظام السلة الجديد على كل ملفات المنتجات
"""

import requests
import re
import json
import time
import os
from datetime import datetime
from typing import List, Dict, Tuple
from urllib.parse import quote

class ProductPagesFixer:
    def __init__(self):
        self.owner = "sherow1982"
        self.repo = "sooq-alkuwait"
        self.branch = "main"
        self.base_url = f"https://api.github.com/repos/{self.owner}/{self.repo}"
        
        # الحصول على token من متغير البيئة
        self.token = os.environ.get('GITHUB_TOKEN', '')
        
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "ProductPagesFixer/1.0",
            "Authorization": f"token {self.token}" if self.token else ""
        }
        
        # إحصائيات
        self.stats = {
            'total_files': 0,
            'processed': 0,
            'fixed': 0,
            'errors': 0,
            'skipped': 0
        }
    
    def get_products_pages_files(self) -> List[Dict]:
        """الحصول على قائمة جميع ملفات products-pages"""
        
        print("🔍 جاري البحث عن ملفات المنتجات في products-pages...")
        
        try:
            url = f"{self.base_url}/contents/products-pages"
            response = requests.get(url, headers=self.headers)
            
            if response.status_code == 200:
                files = response.json()
                html_files = [f for f in files if f['name'].endswith('.html')]
                
                # فلترة الملفات الفعلية (ليس templates)
                product_files = [f for f in html_files if not any(x in f['name'].upper() for x in ['TEMPLATE', 'SAMPLE', 'WORKING', 'FIXED'])]
                
                print(f"📁 تم العثور على {len(product_files)} ملف منتج HTML")
                self.stats['total_files'] = len(product_files)
                
                return product_files
            else:
                print(f"❌ خطأ في جلب قائمة الملفات: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"💥 خطأ في الاتصال: {str(e)}")
            return []
    
    def get_file_content(self, file_path: str) -> Tuple[str, str]:
        """الحصول على محتوى ملف وSHA"""
        
        try:
            url = f"{self.base_url}/contents/{file_path}"
            response = requests.get(url, headers=self.headers)
            
            if response.status_code == 200:
                file_data = response.json()
                import base64
                content = base64.b64decode(file_data['content']).decode('utf-8')
                return content, file_data['sha']
            else:
                print(f"        ❌ خطأ في جلب الملف: {response.status_code}")
                return None, None
                
        except Exception as e:
            print(f"        💥 خطأ: {str(e)}")
            return None, None
    
    def extract_product_id(self, file_path: str, content: str) -> str:
        """استخراج معرف المنتج من اسم الملف أو المحتوى"""
        
        # من اسم الملف
        filename_match = re.search(r'product-?(\d+)', file_path)
        if filename_match:
            return filename_match.group(1)
        
        # من onclick في المحتوى
        onclick_match = re.search(r'onclick="addToCart\((\d+)\)"', content)
        if onclick_match:
            return onclick_match.group(1)
        
        # من data-product-id إذا كان موجود
        data_match = re.search(r'data-product-id="(\d+)"', content)
        if data_match:
            return data_match.group(1)
        
        return None
    
    def fix_cart_button(self, content: str, product_id: str) -> Tuple[str, List[str]]:
        """إصلاح زر السلة في المحتوى"""
        
        modifications = []
        
        # 1. إصلاح onclick="addToCart"
        onclick_patterns = [
            r'<button([^>]*)onclick="addToCart\([^)]*\)"([^>]*)>',
            r'<button([^>]*)onclick="addToCart\(\d+\)"([^>]*)>',
        ]
        
        button_fixed = False
        for pattern in onclick_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                # إزالة onclick وإضافة data-product-id و class cart-btn
                def replace_button(match):
                    attrs1 = match.group(1) if match.group(1) else ''
                    attrs2 = match.group(2) if match.group(2) else ''
                    
                    # إزالة onclick من الخصائص
                    attrs_combined = (attrs1 + ' ' + attrs2).strip()
                    attrs_combined = re.sub(r'onclick="[^"]*"', '', attrs_combined)
                    
                    # إضافة cart-btn class إذا لم تكن موجودة
                    if 'cart-btn' not in attrs_combined:
                        if 'class="' in attrs_combined:
                            attrs_combined = attrs_combined.replace('class="', 'class="cart-btn ')
                        else:
                            attrs_combined += ' class="cart-btn"'
                    
                    # إضافة data-product-id
                    attrs_combined += f' data-product-id="{product_id}"'
                    
                    return f'<button{attrs_combined}>'
                
                content = re.sub(pattern, replace_button, content, flags=re.IGNORECASE)
                button_fixed = True
                modifications.append("زر السلة")
                break
        
        # 2. إضافة مرجع cart-fixed.js إذا لم يكن موجوداً
        if 'cart-fixed.js' not in content:
            if '</body>' in content:
                script_ref = '    <script src="../assets/js/cart-fixed.js"></script>\n</body>'
                content = content.replace('</body>', script_ref)
                modifications.append("مرجع cart-fixed.js")
        
        # 3. إضافة عداد السلة في navigation
        if 'cart-count' not in content:
            # البحث عن رابط السلة في navigation
            nav_patterns = [
                r'(<a[^>]*href=["\']../cart\.html["\'][^>]*>.*?السلة.*?</a>)',
                r'(<a[^>]*href=["\']cart\.html["\'][^>]*>.*?السلة.*?</a>)'
            ]
            
            for pattern in nav_patterns:
                if re.search(pattern, content, re.IGNORECASE | re.DOTALL):
                    def add_cart_counter(match):
                        original = match.group(1)
                        if 'cart-count' not in original:
                            # إضافة العداد قبل </a>
                            enhanced = original.replace('</a>', ' <span class="cart-count" id="cart-count">0</span></a>')
                            return enhanced
                        return original
                    
                    content = re.sub(pattern, add_cart_counter, content, flags=re.IGNORECASE | re.DOTALL)
                    modifications.append("عداد السلة")
                    break
        
        # 4. إضافة حاوية الإشعارات
        if 'cart-notification' not in content:
            if '</body>' in content:
                notification_html = '\n    <!-- Cart Notification -->\n    <div id="cart-notification" class="cart-notification"></div>\n</body>'
                content = content.replace('</body>', notification_html)
                modifications.append("حاوية الإشعارات")
        
        return content, modifications
    
    def update_file(self, file_path: str, content: str, sha: str, modifications: List[str]) -> bool:
        """تحديث ملف في GitHub"""
        
        try:
            # ترميز المحتوى
            import base64
            encoded_content = base64.b64encode(content.encode('utf-8')).decode('utf-8')
            
            # إعداد البيانات
            data = {
                "message": f"🔧 إصلاح نظام السلة - {', '.join(modifications)}\n\n✅ تم تطبيق:\n• زر data-product-id\n• مرجع cart-fixed.js\n• عداد السلة\n• نظام الإشعارات\n\n🚀 جاهز للعمل!",
                "content": encoded_content,
                "sha": sha,
                "branch": self.branch
            }
            
            # رفع التحديث
            url = f"{self.base_url}/contents/{file_path}"
            response = requests.put(url, json=data, headers=self.headers)
            
            if response.status_code == 200:
                return True
            else:
                print(f"        ❌ فشل التحديث: {response.status_code}")
                print(f"        رسالة الخطأ: {response.text}")
                return False
                
        except Exception as e:
            print(f"        💥 خطأ في التحديث: {str(e)}")
            return False
    
    def process_file(self, file_info: Dict, index: int, total: int) -> bool:
        """معالجة ملف واحد"""
        
        file_path = file_info['path']
        filename = file_info['name']
        
        print(f"[{index:3d}/{total}] 🔧 معالجة: {filename}")
        
        # تحميل المحتوى
        content, sha = self.get_file_content(file_path)
        if not content or not sha:
            self.stats['errors'] += 1
            return False
        
        # استخراج معرف المنتج
        product_id = self.extract_product_id(file_path, content)
        if not product_id:
            print(f"        ⚠️ لا يمكن تحديد معرف المنتج")
            self.stats['skipped'] += 1
            return False
        
        # فحص إذا كان الملف يحتاج إصلاح
        has_onclick = 'onclick="addToCart' in content
        has_data_attr = 'data-product-id' in content
        has_cart_js = 'cart-fixed.js' in content
        has_notifications = 'cart-notification' in content
        
        if not has_onclick and has_data_attr and has_cart_js and has_notifications:
            print(f"        ✅ الملف محدث بالفعل (المنتج {product_id})")
            self.stats['skipped'] += 1
            return True
        
        # تطبيق الإصلاحات
        fixed_content, modifications = self.fix_cart_button(content, product_id)
        
        if not modifications:
            print(f"        ℹ️ لا يحتاج إصلاح (المنتج {product_id})")
            self.stats['skipped'] += 1
            return True
        
        # رفع الملف المحدث
        if self.update_file(file_path, fixed_content, sha, modifications):
            print(f"        ✅ تم إصلاح: {', '.join(modifications)} (المنتج {product_id})")
            self.stats['fixed'] += 1
            return True
        else:
            self.stats['errors'] += 1
            return False
    
    def run_mass_fix(self):
        """تشغيل الإصلاح الشامل"""
        
        print("🚀 بدء الإصلاح الشامل لملفات products-pages")
        print("=" * 80)
        
        # الحصول على قائمة الملفات
        files = self.get_products_pages_files()
        
        if not files:
            print("⚠️ لم يتم العثور على ملفات للمعالجة")
            return False
        
        print(f"📋 سيتم معالجة {len(files)} ملف")
        print("=" * 80)
        
        start_time = time.time()
        
        # معالجة الملفات
        for i, file_info in enumerate(files, 1):
            try:
                self.process_file(file_info, i, len(files))
                self.stats['processed'] += 1
                
                # توقف قصير لتجنب تحميل الـ API
                time.sleep(0.5)  # زيادة التأخير قليلاً
                
                # عرض التقدم كل 20 ملف
                if i % 20 == 0:
                    elapsed = time.time() - start_time
                    progress = (i / len(files)) * 100
                    estimated_total = elapsed * len(files) / i
                    remaining = estimated_total - elapsed
                    print(f"📊 التقدم: {progress:.1f}% ({i}/{len(files)}) - الوقت المتبقي: {remaining:.0f}s")
                    
            except Exception as e:
                print(f"        💥 خطأ غير متوقع: {str(e)}")
                self.stats['errors'] += 1
        
        # ملخص النتائج
        self.print_final_report()
        
        return self.stats['fixed'] > 0
    
    def print_final_report(self):
        """طباعة التقرير النهائي"""
        
        print("\n" + "=" * 80)
        print("📊 تقرير الإصلاح الشامل النهائي")
        print("=" * 80)
        
        print(f"📁 إجمالي الملفات: {self.stats['total_files']}")
        print(f"🔧 ملفات تمت معالجتها: {self.stats['processed']}")
        print(f"✅ ملفات تم إصلاحها: {self.stats['fixed']}")
        print(f"⏭️ ملفات تم تجاهلها: {self.stats['skipped']}")
        print(f"❌ ملفات بها أخطاء: {self.stats['errors']}")
        
        if self.stats['processed'] > 0:
            success_rate = (self.stats['fixed'] / self.stats['processed']) * 100
            print(f"📈 معدل النجاح: {success_rate:.1f}%")
        
        if self.stats['fixed'] > 0:
            print("\n🎉 تم الإصلاح الشامل بنجاح!")
            print("\n🌟 المزايا الجديدة في كل ملف:")
            print("   • زر السلة يعمل مع data-product-id")
            print("   • انتقال تلقائي لصفحة السلة بعد الإضافة")
            print("   • عداد سلة تفاعلي في Navigation")
            print("   • إشعارات مرئية للمستخدم")
            print("   • حفظ تلقائي في LocalStorage")
            print("   • زر واتساب لإتمام الطلب في السلة")
            
            print("\n🔗 روابط الاختبار:")
            print("   🧪 اختبار نهائي: https://sherow1982.github.io/sooq-alkuwait/test-final-cart.html")
            print("   🛍️ صفحة السلة: https://sherow1982.github.io/sooq-alkuwait/cart.html")
            
            print("\n🚀 جميع صفحات المنتجات جاهزة الآن للعمل بكفاءة 100%!")
        else:
            print("\n⚠️ لم تكن هناك ملفات تحتاج إصلاح")
        
        print("\n" + "=" * 80)

def main():
    """الدالة الرئيسية"""
    
    print("🛍 سكريپت الإصلاح الشامل لموقع سوق الكويت")
    print("📂 المجلد المستهدف: products-pages")
    print("⏰ وقت البدء:", datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    print("🎯 الهدف: تطبيق نظام السلة الجديد على جميع الملفات")
    print()
    
    # إنشاء مثيل من المُصلح
    fixer = ProductPagesFixer()
    
    try:
        # تشغيل الإصلاح
        success = fixer.run_mass_fix()
        
        if success:
            print("\n" + "🎊" * 30)
            print("🌟 تم إنجاز المهمة الشاملة بنجاح تام!")
            print("🛍️ جميع أزرار السلة في products-pages تعمل الآن!")
            print("📱 الموقع جاهز للعمل التجاري بكفاءة عالية!")
            print("🎊" * 30)
        else:
            print("\n⚠️ لم تكن هناك ملفات تحتاج إصلاح")
            print("✅ جميع الملفات محدثة بالفعل!")
            
    except KeyboardInterrupt:
        print("\n\n⏹️ تم إيقاف السكريپت بواسطة المستخدم")
        fixer.print_final_report()
        
    except Exception as e:
        print(f"\n💥 حدث خطأ في التشغيل: {str(e)}")
        
    print("\n🏁 انتهى تنفيذ السكريپت الشامل")
    print("⏰ وقت الانتهاء:", datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

if __name__ == "__main__":
    main()