import os
import re

# كود Google Ads اللي هنضيفه
GTAG_CODE = '''    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17756342539"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-17756342539');
    </script>
'''

def inject_gtag_to_product_pages():
    """يضيف كود Google Ads لكل صفحات المنتجات"""
    
    products_dir = 'products-pages'
    
    if not os.path.exists(products_dir):
        print(f"❌ المجلد {products_dir} مش موجود!")
        return
    
    files = [f for f in os.listdir(products_dir) if f.endswith('.html')]
    
    if not files:
        print(f"❌ مفيش ملفات HTML في {products_dir}")
        return
    
    print(f"🔍 لقيت {len(files)} ملف منتج")
    
    updated_count = 0
    skipped_count = 0
    
    for filename in files:
        filepath = os.path.join(products_dir, filename)
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # تحقق إن الكود مش موجود أصلاً
            if 'gtag/js?id=AW-17756342539' in content or 'AW-17756342539' in content:
                skipped_count += 1
                continue
            
            # ابحث عن </head> وحط الكود قبلها
            if '</head>' in content:
                # نضيف الكود قبل </head> مباشرة
                content = content.replace('</head>', GTAG_CODE + '\n</head>')
                
                # احفظ الملف
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                updated_count += 1
                print(f"✅ تم تحديث: {filename}")
            else:
                print(f"⚠️  مفيش </head> في: {filename}")
                
        except Exception as e:
            print(f"❌ خطأ في {filename}: {str(e)}")
    
    print("\n" + "="*50)
    print(f"✨ انتهى التحديث!")
    print(f"📊 تم تحديث: {updated_count} ملف")
    print(f"⏭️  تم تجاهل: {skipped_count} ملف (الكود موجود أصلاً)")
    print("="*50)

if __name__ == "__main__":
    print("🚀 بدء إضافة Google Ads gtag لصفحات المنتجات...")
    inject_gtag_to_product_pages()
