import json
import pandas as pd
import os
from urllib.parse import urlparse

def to_relative_path(url):
    """Converts a full URL to a relative path by removing the scheme and netloc."""
    if not isinstance(url, str) or not url.startswith('http'):
        # If it's not a string or not a full URL, assume it's already relative or invalid
        # Also, strip any leading slash to make it a pure relative path for web use
        return str(url).lstrip('/')
    try:
        parsed_url = urlparse(url)
        # We want the path part, and we remove any leading slash to make it a relative path
        # e.g., /uploads/image.jpg -> uploads/image.jpg
        return parsed_url.path.lstrip('/')
    except Exception:
        # In case of a parsing error, return the original URL stripped
        return url.lstrip('/')

def update_images_from_excel():
    excel_file = 'سكراب الكويت بالكامل.xlsx'
    json_file = 'products_data.json'

    # التحقق من وجود الملفات
    if not os.path.exists(excel_file):
        print(f"خطأ: ملف الإكسل '{excel_file}' غير موجود في المجلد الحالي.")
        return
    if not os.path.exists(json_file):
        print(f"خطأ: ملف البيانات '{json_file}' غير موجود.")
        return

    print("جاري قراءة ملف Excel...")
    try:
        # قراءة ملف الإكسل
        df = pd.read_excel(excel_file)
        # إزالة المسافات الزائدة من أسماء الأعمدة
        df.columns = df.columns.str.strip()
        # طباعة أسماء الأعمدة للمساعدة في التشخيص
        print(f"INFO: أعمدة ملف الإكسل التي تم العثور عليها: {df.columns.tolist()}")
    except Exception as e:
        print(f"حدث خطأ أثناء قراءة ملف Excel: {e}")
        return

    print("جاري قراءة ملف JSON...")
    try:
        # قراءة ملف JSON
        with open(json_file, 'r', encoding='utf-8') as f:
            products = json.load(f)
    except Exception as e:
        print(f"حدث خطأ أثناء قراءة ملف JSON: {e}")
        return

    # تحويل بيانات الإكسل إلى قاموس لسهولة البحث
    # المفتاح هو اسم المنتج (Title) والقيمة هي روابط الصور
    excel_data_map = {}
    
    # التأكد من وجود عمود 'Title'
    if 'Title' not in df.columns:
        print("\nخطأ فادح: لم يتم العثور على عمود 'Title' في ملف الإكسل.")
        print("يرجى التأكد من أن اسم العمود هو 'Title' بالضبط (بدون مسافات إضافية وبنفس حالة الأحرف).")
        return

    print("جاري معالجة بيانات الصور...")
    empty_title_count = 0
    for index, row in df.iterrows():
        title = str(row.get('Title', '')).strip()
        if not title or title.lower() == 'nan':
            empty_title_count += 1
            continue

        # الصورة الرئيسية
        main_image_url = str(row.get('Images', '')).strip()
        main_image = to_relative_path(main_image_url) if main_image_url and main_image_url.lower() != 'nan' else ""

        # الصور الإضافية
        variant_images = []
        for col in ['Variant Image', 'Variant Image2', 'Variant Image3']:
            img_url = str(row.get(col, '')).strip()
            if img_url and img_url.lower() != 'nan':
                variant_images.append(to_relative_path(img_url))

        excel_data_map[title] = {
            'main': main_image,
            'variants': variant_images
        }

    if empty_title_count > 0:
        print(f"INFO: تم تخطي {empty_title_count} صفًا بسبب عدم وجود عنوان (Title).")

    print(f"تم العثور على {len(excel_data_map)} منتج في ملف Excel.")

    # تحديث بيانات JSON
    updated_count = 0
    unmatched_products = []
    for product in products:
        name = product.get('name', '').strip()
        
        if name in excel_data_map:
            new_data = excel_data_map[name]
            
            # تحديث الصورة الرئيسية إذا وجدت في الإكسل
            if new_data['main']:
                product['image'] = new_data['main']
            
            # تحديث الصور الإضافية إذا وجدت في الإكسل
            if new_data['variants']:
                product['images'] = new_data['variants']
            
            updated_count += 1
        else:
            unmatched_products.append(name)

    print(f"تم تحديث صور {updated_count} منتج بنجاح.")
    if len(unmatched_products) > 0 and updated_count < len(products):
        print(f"INFO: لم يتم العثور على تطابق في ملف Excel لـ {len(unmatched_products)} منتج من ملف JSON.")
        # print("مثال على المنتجات التي لم يتم العثور عليها:", unmatched_products[:5]) # Optional: show examples

    # حفظ الملف المحدث
    try:
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=4)
        print(f"تم حفظ التعديلات في '{json_file}'.")
    except Exception as e:
        print(f"حدث خطأ أثناء حفظ ملف JSON: {e}")

if __name__ == "__main__":
    update_images_from_excel()