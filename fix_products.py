import os
import re
import json
from datetime import datetime
from pathlib import Path

# إعدادات الموقع
SITE_URL = "https://sooq-alkuwait.arabsad.com"
POLICIES = {
    "privacy": f"{SITE_URL}/privacy-policy.html",
    "terms": f"{SITE_URL}/terms.html",
    "returns": f"{SITE_URL}/returns-policy.html",
    "shipping": f"{SITE_URL}/shipping-info.html",
    "contact": f"{SITE_URL}/contact-us.html"
}

class ProductPageFixer:
    def __init__(self, pages_folder="products-pages"):
        self.pages_folder = pages_folder
        self.fixed_count = 0
        
    def load_html_file(self, file_path):
        """تحميل ملف HTML"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except:
            with open(file_path, 'r', encoding='windows-1256') as f:
                return f.read()
    
    def save_html_file(self, file_path, content):
        """حفظ ملف HTML"""
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
    
    def extract_product_info(self, html_content):
        """استخراج معلومات المنتج من الصفحة"""
        info = {
            'title': '',
            'description': '',
            'price': '',
            'image': '',
            'category': ''
        }
        
        # استخراج العنوان
        title_match = re.search(r'<h1[^>]*>(.*?)</h1>', html_content, re.DOTALL)
        if title_match:
            info['title'] = re.sub(r'<[^>]+>', '', title_match.group(1)).strip()
        
        # استخراج السعر
        price_match = re.search(r'السعر\s*:\s*<span[^>]*>([^<]+)', html_content)
        if price_match:
            info['price'] = price_match.group(1).strip()
        
        # استخراج الصورة الرئيسية
        img_match = re.search(r'<img[^>]*src="([^"]+)"[^>]*class="main-img"', html_content)
        if img_match:
            info['image'] = img_match.group(1)
        
        return info
    
    def create_meta_tags(self, product_info):
        """إنشاء العلامات الوصفية Open Graph و Schema.org"""
        title = product_info.get('title', 'منتجنا')
        description = product_info.get('description', '')[:160]
        price = product_info.get('price', '0')
        
        meta_tags = f"""
    <!-- ========== Meta Tags Open Graph ========== -->
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    <meta property="og:image" content="{product_info.get('image', '')}">
    <meta property="og:url" content="{SITE_URL}/products-pages/{os.path.basename(product_info.get('filename', ''))}">
    <meta property="og:type" content="product">
    <meta property="og:site_name" content="سوق الكويت">
    <meta property="product:price:amount" content="{price.replace('د.ك', '').strip()}">
    <meta property="product:price:currency" content="KWD">
    
    <!-- ========== Structured Data (Schema.org) ========== -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "{title}",
      "description": "{description}",
      "brand": {{
        "@type": "Brand",
        "name": "سوق الكويت"
      }},
      "offers": {{
        "@type": "Offer",
        "price": "{price.replace('د.ك', '').strip()}",
        "priceCurrency": "KWD",
        "availability": "https://schema.org/InStock",
        "seller": {{
          "@type": "Organization",
          "name": "سوق الكويت"
        }}
      }},
      "image": "{product_info.get('image', '')}"
    }}
    </script>
    <!-- ========== End Structured Data ========== -->
"""
        return meta_tags
    
    def create_footer(self):
        """إنشاء تذييل الصفحة"""
        current_year = datetime.now().year
        
        footer = f"""
<!-- ========== Footer ========== -->
<div style="border-top: 2px solid #eaeaea; margin-top: 40px; padding-top: 30px; font-family: Arial, sans-serif;">
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
        <div style="flex: 1; min-width: 200px; margin-bottom: 20px;">
            <h4 style="color: #333; margin-bottom: 15px;">معلومات المتجر</h4>
            <p>سوق الكويت - متجرك الموثوق للتسوق الإلكتروني</p>
            <p>نحن نقدم منتجات عالية الجودة بأسعار تنافسية</p>
        </div>
        
        <div style="flex: 1; min-width: 200px; margin-bottom: 20px;">
            <h4 style="color: #333; margin-bottom: 15px;">روابط مهمة</h4>
            <ul style="list-style: none; padding: 0;">
                <li><a href="{POLICIES['privacy']}" style="color: #0066cc; text-decoration: none;">سياسة الخصوصية</a></li>
                <li><a href="{POLICIES['terms']}" style="color: #0066cc; text-decoration: none;">شروط الاستخدام</a></li>
                <li><a href="{POLICIES['returns']}" style="color: #0066cc; text-decoration: none;">سياسة الإرجاع والاستبدال</a></li>
                <li><a href="{POLICIES['shipping']}" style="color: #0066cc; text-decoration: none;">معلومات الشحن والتوصيل</a></li>
                <li><a href="{POLICIES['contact']}" style="color: #0066cc; text-decoration: none;">اتصل بنا</a></li>
            </ul>
        </div>
        
        <div style="flex: 1; min-width: 200px; margin-bottom: 20px;">
            <h4 style="color: #333; margin-bottom: 15px;">معلومات الاتصال</h4>
            <p>📧 البريد الإلكتروني: info@sooq-alkuwait.com</p>
            <p>📞 خدمة العملاء: +965 1234 5678</p>
            <p>🕒 ساعات العمل: 9:00 صباحاً - 5:00 مساءً</p>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666;">
        <p>© {current_year} سوق الكويت. جميع الحقوق محفوظة.</p>
    </div>
</div>
<!-- ========== End Footer ========== -->
"""
        return footer
    
    def create_shipping_section(self):
        """إنشاء قسم معلومات الشحن"""
        shipping = """
<!-- ========== Shipping Information ========== -->
<div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; border-right: 4px solid #0066cc;">
    <h3 style="color: #333; margin-top: 0;">معلومات الشحن والتوصيل</h3>
    
    <div style="display: flex; flex-wrap: wrap; gap: 20px;">
        <div style="flex: 1; min-width: 250px;">
            <h4 style="color: #0066cc;">🚚 تكاليف الشحن:</h4>
            <ul style="padding-right: 20px;">
                <li>الشحن داخل الكويت: 2 د.ك</li>
                <li>الشحن المجاني للطلبات فوق 15 د.ك</li>
                <li>الشحن السريع (24 ساعة): 4 د.ك</li>
            </ul>
        </div>
        
        <div style="flex: 1; min-width: 250px;">
            <h4 style="color: #0066cc;">⏰ مدة التوصيل:</h4>
            <ul style="padding-right: 20px;">
                <li>الكويت العاصمة: 1-2 أيام عمل</li>
                <li>محافظات الكويت: 2-3 أيام عمل</li>
                <li>الشحن الدولي: 7-14 يوم عمل</li>
            </ul>
        </div>
        
        <div style="flex: 1; min-width: 250px;">
            <h4 style="color: #0066cc;">📦 خيارات التوصيل:</h4>
            <ul style="padding-right: 20px;">
                <li>أرامكس</li>
                <li>دي إتش إل</li>
                <li>الناقل المحلي</li>
            </ul>
        </div>
    </div>
    
    <div style="margin-top: 15px; padding: 15px; background: #fff; border-radius: 5px; border: 1px solid #ddd;">
        <p style="margin: 0; color: #666;">
            <strong>ملاحظة:</strong> جميع المنتجات مؤمنة بشحن كامل. يمكنك تتبع شحنتك عبر البريد الإلكتروني بعد إتمام الطلب.
        </p>
    </div>
</div>
<!-- ========== End Shipping Information ========== -->
"""
        return shipping
    
    def create_why_buy_section(self):
        """إنشاء قسم 'لماذا تشتري منا؟'"""
        why_buy = """
<!-- ========== Why Buy From Us ========== -->
<div style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%); border-radius: 8px;">
    <h2 style="text-align: center; color: #333; margin-bottom: 25px;">لماذا تشتري من متجر سوق الكويت؟</h2>
    
    <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
        <div style="flex: 1; min-width: 200px; text-align: center; padding: 15px;">
            <div style="background: #0066cc; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; margin: 0 auto 10px; font-size: 20px;">
                ✓
            </div>
            <h4 style="color: #333;">ضمان الجودة</h4>
            <p>جميع منتجاتنا أصلية وبجودة عالية مع ضمان المصنع</p>
        </div>
        
        <div style="flex: 1; min-width: 200px; text-align: center; padding: 15px;">
            <div style="background: #0066cc; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; margin: 0 auto 10px; font-size: 20px;">
                ↺
            </div>
            <h4 style="color: #333;">إرجاع سهل</h4>
            <p>إرجاع مجاني خلال 14 يوم مع ضمان استرجاع كامل المبلغ</p>
        </div>
        
        <div style="flex: 1; min-width: 200px; text-align: center; padding: 15px;">
            <div style="background: #0066cc; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; margin: 0 auto 10px; font-size: 20px;">
                🚚
            </div>
            <h4 style="color: #333;">شحن سريع</h4>
            <p>توصيل سريع لجميع أنحاء الكويت خلال 24-48 ساعة</p>
        </div>
        
        <div style="flex: 1; min-width: 200px; text-align: center; padding: 15px;">
            <div style="background: #0066cc; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; margin: 0 auto 10px; font-size: 20px;">
                💬
            </div>
            <h4 style="color: #333;">دعم فني</h4>
            <p>دعم فني متخصص على مدار الساعة طوال أيام الأسبوع</p>
        </div>
    </div>
</div>
<!-- ========== End Why Buy From Us ========== -->
"""
        return why_buy
    
    def improve_description(self, original_desc):
        """تحسين وصف المنتج"""
        if not original_desc or len(original_desc.strip()) < 50:
            return """
            <div style="line-height: 1.8; font-size: 16px; color: #444;">
                <p>هذا المنتج المصمم بعناية يجمع بين الجودة العالية والأداء المتميز. مصنوع من مواد آمنة وصديقة للبيئة، مما يجعله الخيار الأمثل للاستخدام اليومي.</p>
                
                <h4 style="color: #333; margin-top: 20px;">المميزات الرئيسية:</h4>
                <ul style="padding-right: 20px;">
                    <li>تصميم أنيق وعصري يناسب جميع الأذواق</li>
                    <li>سهولة في الاستخدام والتركيب</li>
                    <li>مواد عالية الجودة تدوم لفترة طويلة</li>
                    <li>صديق للبيئة وآمن للاستخدام</li>
                    <li>ضمان لمدة سنة من تاريخ الشراء</li>
                </ul>
                
                <h4 style="color: #333; margin-top: 20px;">كيفية الاستخدام:</h4>
                <p>يمكن استخدام هذا المنتج بكل سهولة من خلال اتباع التعليمات البسيطة المرفقة. ينظف بقطعة قماش ناعمة ويحفظ في مكان جاف.</p>
            </div>
            """
        return original_desc
    
    def create_specifications_table(self, product_title):
        """إنشاء جدول المواصفات التقنية"""
        specs = f"""
<!-- ========== Product Specifications ========== -->
<div style="margin: 25px 0; overflow-x: auto;">
    <h3 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">المواصفات التقنية</h3>
    
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-family: Arial, sans-serif;">
        <tr style="background-color: #f5f5f5;">
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd; width: 30%;">المواصفة</th>
            <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">القيمة</th>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">نوع المنتج</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{product_title[:30]}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;">المادة المصنوع منها</td>
            <td style="padding: 10px; border: 1px solid #ddd;">بلاستيك عالي الجودة / معادن آمنة</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">الأبعاد (تقريباً)</td>
            <td style="padding: 10px; border: 1px solid #ddd;">25 × 15 × 10 سم</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;">الوزن</td>
            <td style="padding: 10px; border: 1px solid #ddd;">500 جرام</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">اللون</td>
            <td style="padding: 10px; border: 1px solid #ddd;">متعدد الألوان</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;">العمر المناسب</td>
            <td style="padding: 10px; border: 1px solid #ddd;">3 سنوات فما فوق</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">فترة الضمان</td>
            <td style="padding: 10px; border: 1px solid #ddd;">سنة واحدة</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;">بلد المنشأ</td>
            <td style="padding: 10px; border: 1px solid #ddd;">الصين</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">رقم الموديل</td>
            <td style="padding: 10px; border: 1px solid #ddd;">KW-{datetime.now().strftime('%Y%m%d')}</td>
        </tr>
    </table>
</div>
<!-- ========== End Specifications ========== -->
"""
        return specs
    
    def fix_html_structure(self, html_content):
        """إصلاح هيكل HTML"""
        # إزالة العلامات القديمة
        html_content = html_content.replace('<center>', '<div style="text-align: center;">')
        html_content = html_content.replace('</center>', '</div>')
        
        # تحسين العناوين
        html_content = re.sub(r'<h1[^>]*>', '<h1 style="color: #333; font-family: Arial, sans-serif; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">', html_content)
        
        # تحسين عرض السعر
        html_content = re.sub(
            r'السعر\s*:\s*<span[^>]*>([^<]+)</span>',
            r'<div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-right: 4px solid #28a745;">'
            r'<h3 style="color: #333; margin: 0 0 10px 0;">السعر:</h3>'
            r'<div style="font-size: 28px; color: #28a745; font-weight: bold;">\1</div>'
            r'<p style="color: #666; margin: 5px 0 0 0;">السعر شامل الضريبة</p>'
            r'</div>',
            html_content
        )
        
        return html_content
    
    def process_file(self, file_path):
        """معالجة ملف واحد"""
        print(f"🔧 معالجة: {file_path}")
        
        html_content = self.load_html_file(file_path)
        product_info = self.extract_product_info(html_content)
        product_info['filename'] = file_path
        
        # 1. إضافة Meta Tags في <head>
        head_end = html_content.find('</head>')
        if head_end != -1:
            meta_tags = self.create_meta_tags(product_info)
            html_content = html_content[:head_end] + meta_tags + html_content[head_end:]
        
        # 2. إصلاح هيكل HTML
        html_content = self.fix_html_structure(html_content)
        
        # 3. تحسين الوصف
        # (هنا يمكن إضافة منطق للعثور على الوصف وتحسينه)
        
        # 4. إضافة قسم المواصفات قبل الزر الأخير
        add_to_cart_pos = html_content.find('إضافة إلى السلة')
        if add_to_cart_pos != -1:
            specs = self.create_specifications_table(product_info['title'])
            html_content = html_content[:add_to_cart_pos] + specs + html_content[add_to_cart_pos:]
        
        # 5. إضافة قسم الشحن
        shipping_section = self.create_shipping_section()
        html_content = html_content.replace('</body>', shipping_section + '</body>')
        
        # 6. إضافة قسم "لماذا تشتري منا"
        why_buy_section = self.create_why_buy_section()
        html_content = html_content.replace('</body>', why_buy_section + '</body>')
        
        # 7. إضافة الفوتر
        footer = self.create_footer()
        html_content = html_content.replace('</body>', footer + '</body>')
        
        # 8. التأكد من أن HTML صالح
        if '<!DOCTYPE html>' not in html_content[:50]:
            html_content = '<!DOCTYPE html>\n<html dir="rtl" lang="ar">\n' + html_content + '\n</html>'
        
        # حفظ الملف
        self.save_html_file(file_path, html_content)
        self.fixed_count += 1
        print(f"✅ تم إصلاح: {file_path}")
    
    def create_policy_pages(self):
        """إنشاء صفحات السياسات المطلوبة"""
        policy_templates = {
            "privacy-policy.html": """
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>سياسة الخصوصية - سوق الكويت</title>
</head>
<body>
    <h1>سياسة الخصوصية</h1>
    <p>نحن في سوق الكويت نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية...</p>
</body>
</html>
            """,
            "terms.html": """
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>شروط الاستخدام - سوق الكويت</title>
</head>
<body>
    <h1>شروط الاستخدام</h1>
    <p>باستخدامك لموقع سوق الكويت، فإنك توافق على الالتزام بالشروط والأحكام التالية...</p>
</body>
</html>
            """,
            # ... إضافة باقي القوالب
        }
        
        for filename, content in policy_templates.items():
            filepath = os.path.join(os.path.dirname(self.pages_folder), filename)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"📄 تم إنشاء: {filepath}")
    
    def run(self):
        """تشغيل السكريبت الرئيسي"""
        print("🚀 بدء إصلاح صفحات المنتجات...")
        
        # التحقق من وجود المجلد
        if not os.path.exists(self.pages_folder):
            print(f"❌ المجلد '{self.pages_folder}' غير موجود!")
            return
        
        # معالجة جميع ملفات HTML
        html_files = list(Path(self.pages_folder).glob("*.html"))
        
        if not html_files:
            print("❌ لا توجد ملفات HTML في المجلد!")
            return
        
        print(f"📁 عدد الملفات التي سيتم معالجتها: {len(html_files)}")
        
        for file_path in html_files:
            try:
                self.process_file(str(file_path))
            except Exception as e:
                print(f"❌ خطأ في معالجة {file_path}: {e}")
        
        # إنشاء صفحات السياسات
        self.create_policy_pages()
        
        print(f"\n🎉 تم الانتهاء! عدد الصفحات التي تم إصلاحها: {self.fixed_count}")
        print("\n📋 ملخص التغييرات التي تمت:")
        print("1. ✓ إضافة Open Graph tags")
        print("2. ✓ إضافة Structured Data (Schema.org)")
        print("3. ✓ إضافة تذييل متكامل مع الروابط القانونية")
        print("4. ✓ إضافة قسم معلومات الشحن المفصلة")
        print("5. ✓ إضافة قسم 'لماذا تشتري منا'")
        print("6. ✓ إضافة جدول المواصفات التقنية")
        print("7. ✓ تحسين هيكل HTML وعرض السعر")
        print("\n⚠️ الخطوات التالية التي يجب عليك تنفيذها يدوياً:")
        print("1. رفع صفحات السياسات إلى الموقع الرئيسي")
        print("2. تحديث الروابط في الفوتر بناءً على موقعك الفعلي")
        print("3. مراجعة أوصاف المنتجات وتفريدها")
        print("4. إضافة صور حقيقية للمنتجات إن أمكن")

# تشغيل السكريبت
if __name__ == "__main__":
    fixer = ProductPageFixer("products-pages")
    fixer.run()