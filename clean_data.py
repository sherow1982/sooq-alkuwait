import json
import re
import xml.etree.ElementTree as ET
from xml.dom import minidom

def get_category(name, description):
    """
    تحديد فئة المنتج بناءً على كلمات مفتاحية في الاسم والوصف
    """
    text = (str(name) + " " + str(description)).lower()
    
    categories = {
        "إلكترونيات": ["سماعة", "شاحن", "كابل", "باور", "موبايل", "هاتف", "كاميرا", "لابتوب", "تابلت", "ساعة ذكية", "مكبر صوت", "راديو", "ماوس", "كيبورد", "usb", "بلوتوث", "سلك", "بطارية", "تلفزيون", "شاشة", "سلكي", "لاسلكي", "ميكروفون", "فلاش", "ليد", "مصباح", "كشاف", "إضاءة"],
        "المنزل والمطبخ": ["مطبخ", "طهي", "قدر", "مقلاة", "سكين", "ملعقة", "شوكة", "خلاط", "عصارة", "مفرمة", "قطاعة", "غلاية", "فرن", "ميكروويف", "منظم", "رف", "حمام", "منشفة", "ممسحة", "تنظيف", "صنبور", "كوب", "زجاجة", "ترمس", "حافظة", "صندوق", "وسادة", "لحاف", "سرير", "أريكة", "كرسي", "طاولة", "مبخرة", "بخور", "خزانة", "ديكور"],
        "الصحة والجمال": ["شعر", "بشرة", "وجه", "جسم", "كريم", "زيت", "مكياج", "عطر", "حلاقة", "تشذيب", "مساج", "تدليك", "أسنان", "فرشاة", "مجفف", "سيروم", "تبييض", "عناية", "صحة", "طبي", "ركبة", "ظهر", "مشد", "عدسات", "اظافر", "أظافر", "تجميل"],
        "إكسسوارات السيارات": ["سيارة", "مركبة", "إطار", "ضاغط", "منفاخ", "مكنسة سيارة", "حامل موبايل", "مظلة سيارة", "تابلوه", "مقعد سيارة", "شاحن سيارة"],
        "الأزياء والموضة": ["ملابس", "قميص", "بنطلون", "حذاء", "جورب", "حقيبة", "محفظة", "ساعة", "نظارة", "قبعة", "شال", "سلسلة", "خاتم", "سوار", "مجوهرات"],
        "ألعاب وأطفال": ["لعبة", "طفل", "رضيع", "مدرسة", "تعليمي", "سبورة", "رسم", "طائرة", "سيارة تحكم", "دمية", "أطفال"],
        "أدوات وتحسينات المنزل": ["مفك", "دريل", "شريط", "غراء", "سلم", "عدة", "أدوات", "لحام", "دهان", "اصلاح", "مطرقة", "لاصق"]
    }
    
    for category, keywords in categories.items():
        for keyword in keywords:
            if keyword in text:
                return category
    
    return "عام"

def get_google_category_id(local_category):
    """
    ربط الفئات المحلية بأرقام فئات جوجل
    """
    mapping = {
        "إلكترونيات": 222, # Electronics > Audio
        "المنزل والمطبخ": 632, # Home & Garden > Kitchen & Dining
        "الصحة والجمال": 473, # Health & Beauty
        "إكسسوارات السيارات": 5612, # Vehicles & Parts > Vehicle Parts & Accessories
        "الأزياء والموضة": 166, # Apparel & Accessories
        "ألعاب وأطفال": 1239, # Toys & Games
        "أدوات وتحسينات المنزل": 63, # Home & Garden
        "عام": 1 # Animals & Pet Supplies (Default fallback)
    }
    return mapping.get(local_category, 1)

def safe_float(value, default=0.0):
    try:
        if value is None or str(value).strip() == "":
            return default
        return float(value)
    except (ValueError, TypeError):
        return default

def safe_int(value, default=0):
    try:
        if value is None or str(value).strip() == "":
            return default
        return int(float(value))
    except (ValueError, TypeError):
        return default

def create_slug(name):
    s = str(name).strip()
    s = re.sub(r'[^\w\s]', ' ', s)
    s = re.sub(r'\s+', '-', s)
    return s.strip('-')

def clean_products_data(input_file, output_file, feed_file, domain="https://sooq-alkuwait.arabsad.com"):
    """
    Cleans and restructures the products JSON data.
    """
    try:
        # Step 1: Read the original JSON file
        with open(input_file, 'r', encoding='utf-8') as f:
            products = json.load(f)

        cleaned_products = []
        
        # إعداد ملف XML لجوجل
        rss = ET.Element("rss", version="2.0", **{"xmlns:g": "http://base.google.com/ns/1.0"})
        channel = ET.SubElement(rss, "channel")
        ET.SubElement(channel, "title").text = "سوق الكويت"
        ET.SubElement(channel, "link").text = domain
        ET.SubElement(channel, "description").text = "أفضل المنتجات بأسعار لا تقبل المنافسة"

        # Step 2: Iterate over each product and clean it
        for product in products:
            cleaned_product = {}

            # --- Data Type Conversion and Cleaning ---
            try:
                cleaned_product['id'] = safe_int(product.get('id'), 0)
                cleaned_product['name'] = str(product.get('name', '')).strip()
                cleaned_product['slug'] = create_slug(cleaned_product['name'])

                # Clean description
                description = product.get('description', '')
                if description is None: description = ""
                # Remove the specific word "الوصف" and strip leading/trailing whitespace
                cleaned_description = description.replace('الوصف', '').strip()
                # Optional: Clean up excessive internal whitespace/newlines
                cleaned_description = re.sub(r'\s*\n\s*', '\n', cleaned_description).strip()
                cleaned_product['description'] = cleaned_description

                cleaned_product['seo_title'] = product.get('seo_title', '').strip()
                cleaned_product['seo_description'] = product.get('seo_description', '').strip()
                
                cleaned_product['quantity'] = safe_int(product.get('quantity'), 0)

                # Convert prices to float and round to 2 decimal places
                cleaned_product['regular_price'] = round(safe_float(product.get('regular_price')), 2)
                cleaned_product['sale_price'] = round(safe_float(product.get('sale_price')), 2)
                
                cleaned_product['currency'] = product.get('currency', 'KWD')

                # Correct image paths for the web app by removing any leading slash
                image_path = product.get('image')
                cleaned_product['image'] = image_path[1:] if image_path and image_path.startswith('/') else image_path

                images_list = product.get('images', [])
                cleaned_images = [img[1:] if img and img.startswith('/') else img for img in images_list]
                cleaned_product['images'] = cleaned_images

                # التصنيف التلقائي
                cleaned_product['category'] = get_category(cleaned_product['name'], cleaned_product['description'])
                cleaned_product['availability'] = product.get('availability', 'InStock')

                cleaned_products.append(cleaned_product)
                
                # --- إضافة المنتج لملف جوجل XML ---
                item = ET.SubElement(channel, "item")
                ET.SubElement(item, "g:id").text = str(cleaned_product['id'])
                ET.SubElement(item, "g:title").text = cleaned_product['name']
                ET.SubElement(item, "g:description").text = cleaned_product['description']
                # رابط المنتج المباشر (Deep Link)
                ET.SubElement(item, "g:link").text = f"{domain}/index.html?product={cleaned_product['slug']}"
                
                # إصلاح رابط الصورة
                img_link = product.get('image') # Use original path to prepend domain correctly
                if img_link and not img_link.startswith('http'):
                     img_link = f"{domain}{img_link}"
                if img_link:
                    ET.SubElement(item, "g:image_link").text = img_link
                
                ET.SubElement(item, "g:condition").text = "new"
                ET.SubElement(item, "g:availability").text = "in_stock"
                ET.SubElement(item, "g:price").text = f"{cleaned_product['regular_price']} {cleaned_product['currency']}"
                
                if cleaned_product['sale_price'] > 0 and cleaned_product['sale_price'] < cleaned_product['regular_price']:
                    ET.SubElement(item, "g:sale_price").text = f"{cleaned_product['sale_price']} {cleaned_product['currency']}"
                
                ET.SubElement(item, "g:brand").text = "Generic" 
                ET.SubElement(item, "g:google_product_category").text = str(get_google_category_id(cleaned_product['category']))
                ET.SubElement(item, "g:identifier_exists").text = "no"

            except (ValueError, TypeError) as e:
                print(f"Skipping product due to data error (ID: {product.get('id')}): {e}")
                continue

        # Step 3: Save the cleaned data to a new file
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(cleaned_products, f, ensure_ascii=False, indent=4)

        # حفظ ملف XML
        xml_str = minidom.parseString(ET.tostring(rss)).toprettyxml(indent="   ")
        with open(feed_file, "w", encoding="utf-8") as f:
            f.write(xml_str)

        print(f"Successfully cleaned the data and saved it to '{output_file}'")
        print(f"Google Feed generated at '{feed_file}'")

    except FileNotFoundError:
        print(f"Error: The file '{input_file}' was not found.")
    except json.JSONDecodeError:
        print(f"Error: The file '{input_file}' is not a valid JSON file.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# --- Main Execution ---
if __name__ == "__main__":
    input_json_file = 'products_data.json'
    output_json_file = 'products_data_cleaned.json'
    feed_xml_file = 'google_feed.xml'
    # هام: قم بتغيير هذا الرابط إلى رابط موقعك الحقيقي
    MY_DOMAIN = "https://sooq-alkuwait.arabsad.com" 
    clean_products_data(input_json_file, output_json_file, feed_xml_file, MY_DOMAIN)