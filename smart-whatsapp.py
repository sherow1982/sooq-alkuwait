#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
تحديث زر الواتساب ليكون ذكي مع معلومات المنتج ونموذج طلب
"""

from pathlib import Path
import re
from urllib.parse import quote

SITE_URL = "https://sooq-alkuwait.arabsad.com"
WHATSAPP_NUMBER = "201110760081"
PRODUCTS_DIR = Path("products-pages")

fixed_count = 0

for html_file in PRODUCTS_DIR.glob('*.html'):
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            html = f.read()
        
        original = html
        
        # استخراج معلومات المنتج
        # 1. العنوان
        title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', html)
        product_title = title_match.group(1).strip() if title_match else "منتج"
        
        # 2. السعر
        price_match = re.search(r'<span class="sale-price">([0-9.]+)\s*د\.ك</span>', html)
        product_price = price_match.group(1) + " د.ك" if price_match else "السعر غير متوفر"
        
        # 3. رابط المنتج
        filename = quote(html_file.name)
        product_url = f"{SITE_URL}/products-pages/{filename}"
        
        # 4. بناء رسالة الواتساب
        whatsapp_message = f"""مرحباً! 👋

أرغب بطلب المنتج التالي:
━━━━━━━━━━━━━━━
📦 *المنتج:* {product_title}
💰 *السعر:* {product_price}
🔗 *الرابط:* {product_url}
━━━━━━━━━━━━━━━

برجاء إرسال البيانات التالية لإتمام الطلب:
✅ اسمك:
✅ عنوانك:
✅ عدد القطع المطلوبة:
✅ رقم هاتف آخر (إن وجد):

شكراً لكم 🌟"""
        
        # ترميز الرسالة لـ URL
        encoded_message = quote(whatsapp_message)
        whatsapp_url = f"https://wa.me/{WHATSAPP_NUMBER}?text={encoded_message}"
        
        # 5. إنشاء زر الواتساب الجديد
        new_whatsapp_btn = f'''
<div class="whatsapp-order-section" style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%); border-radius: 15px; text-align: center;">
    <h3 style="color: #2c3e50; font-size: 1.3rem; margin-bottom: 15px; font-weight: 700;">🛒 جاهز للطلب؟</h3>
    <p style="color: #666; margin-bottom: 20px; font-size: 1rem;">اضغط الزر وأرسل طلبك الآن مع بياناتك</p>
    <a href="{whatsapp_url}" target="_blank" rel="noopener noreferrer" class="whatsapp-smart-btn" style="display: inline-block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; font-size: 1.4rem; font-weight: 700; padding: 18px 45px; border-radius: 50px; text-decoration: none; box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4); transition: all 0.3s ease;">
        <i class="fab fa-whatsapp" style="margin-left: 10px; font-size: 1.3em;"></i>
        اطلب الآن عبر واتساب - شحن مجاني 🚚
    </a>
    <p style="margin-top: 15px; color: #666; font-size: 0.9rem;">
        ✅ ضمان الجودة | ⚡ رد فوري | 🚚 توصيل سريع
    </p>
</div>

<style>
.whatsapp-smart-btn:hover {{
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(37, 211, 102, 0.5);
}}
</style>
'''
        
        # 6. إزالة زر الواتساب القديم
        html = re.sub(
            r'<div class="whatsapp-cta-section".*?</div>\s*<style>.*?</style>',
            '',
            html,
            flags=re.DOTALL
        )
        
        # 7. إضافة الزر الجديد مباشرة بعد وصف المنتج
        # البحث عن نهاية وصف المنتج
        if '<div class="product-description">' in html:
            # إضافة بعد نهاية div الوصف
            html = re.sub(
                r'(</div>)(\s*)(<!--[^>]*-->)?\s*(</div>)?\s*(</main>|<footer|<div class="reviews)',
                rf'{new_whatsapp_btn}\1\2\3\4\5',
                html,
                count=1
            )
        elif '<div class="description">' in html:
            html = re.sub(
                r'(</div>)(\s*)(</main>|<footer|<div class="reviews)',
                rf'{new_whatsapp_btn}\1\2\3',
                html,
                count=1
            )
        else:
            # إذا لم يوجد وصف، أضفه بعد السعر
            if '<div class="price-section">' in html:
                html = re.sub(
                    r'(<div class="price-section">.*?</div>)',
                    rf'\1{new_whatsapp_btn}',
                    html,
                    flags=re.DOTALL,
                    count=1
                )
            elif '<footer' in html:
                html = re.sub(r'(<footer)', rf'{new_whatsapp_btn}\1', html, count=1)
            else:
                html = html.replace('</body>', f'{new_whatsapp_btn}</body>')
        
        # حفظ التغييرات
        if html != original:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(html)
            fixed_count += 1
    
    except Exception as e:
        print(f"⚠️ خطأ في {html_file.name}: {e}")

print("\n" + "="*60)
print("✅ اكتمل تحديث أزرار الواتساب الذكية!")
print("="*60)
print(f"\n📊 الإحصائيات:")
print(f"  ✅ تم التحديث: {fixed_count} صفحة")
print(f"\n🎯 التحسينات:")
print(f"  ✅ زر الواتساب تحت وصف المنتج مباشرة")
print(f"  ✅ رسالة تحتوي على: اسم المنتج، السعر، الرابط")
print(f"  ✅ نموذج طلب بيانات العميل تلقائي")
print(f"  ✅ تصميم احترافي وجذاب")
print(f"\n💬 محتوى الرسالة:")
print(f"  📦 اسم المنتج")
print(f"  💰 السعر")
print(f"  🔗 رابط المنتج")
print(f"  ✅ نموذج: الاسم، العنوان، العدد، رقم بديل\n")
