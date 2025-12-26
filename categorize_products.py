import json
import re

# 1. قائمة مبسطة لتصنيفات جوجل (Google Product Taxonomy 2025 - Top Level & Common)
# يمكنك توسيع هذه القائمة حسب نوع منتجاتك بدقة
GOOGLE_TAXONOMY = {
    "المنزل والحديقة": ["أثاث", "ديكور", "سرير", "كرسي", "طاولة", "كنبة", "لمبة", "مطبخ", "قدور", "صحون", "لحاف", "مخدة", "تنظيف", "حديقة"],
    "إلكترونيات": ["هاتف", "جوال", "شاحن", "سماعة", "كيبل", "كاميرا", "لابتوب", "كمبيوتر", "شاشة", "تلفزيون", "بطارية", "ساعة ذكية", "تابلت"],
    "ملابس وإكسسوارات": ["قميص", "بنطلون", "فستان", "حذاء", "جزمة", "شنطة", "حقيبة", "نظارة", "ساعة", "مجوهرات", "خاتم", "سلسال", "عباية", "طرحة"],
    "الصحة والجمال": ["مكياج", "عطر", "بخور", "كريم", "شامبو", "صابون", "تجميل", "عناية", "شعر", "بشرة", "عدسات"],
    "ألعاب وهوايات": ["لعبة", "دمية", "سيارة أطفال", "سكوتر", "رسم", "موسيقى", "كرة", "سباحة"],
    "مستلزمات الحيوانات الأليفة": ["قطة", "كلب", "طعام حيوانات", "رمل قطط", "قفص"],
    "أجهزة منزلية": ["خلاط", "فرن", "مكواة", "غسالة", "ثلاجة", "مكيف", "مكنسة", "قلاية"],
    "معدات وأدوات": ["دريل", "مفك", "منشار", "عدة", "صيانة", "سيارة", "إطارات"],
}

DEFAULT_CATEGORY = "Arts & Entertainment > Hobbies & Creative Arts" # تصنيف عام للاحتياط

def get_google_category(title, description):
    # دمج العنوان والوصف للبحث
    text = (str(title) + " " + str(description)).lower()
    
    best_match = None
    max_score = 0
    
    for category, keywords in GOOGLE_TAXONOMY.items():
        score = 0
        for keyword in keywords:
            if keyword in text:
                score += 1
        
        if score > max_score:
            max_score = score
            best_match = category
            
    # إذا لم نجد تطابق، نعيد تصنيف عام أو "عام"
    return best_match if best_match else "عام"

def process_file():
    input_file = 'products_data_cleaned.json'
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            products = json.load(f)
            
        updated_count = 0
        for product in products:
            # نتأكد من وجود العنوان والوصف
            title = product.get('title', '')
            desc = product.get('description', '')
            
            # تحديد التصنيف
            cat = get_google_category(title, desc)
            
            # تحديث المنتج
            product['google_product_category'] = cat
            product['category'] = cat # تحديث التصنيف الداخلي أيضاً
            updated_count += 1
            
        # حفظ الملف
        with open(input_file, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
            
        print(f"تم تحديث تصنيفات {updated_count} منتج بنجاح.")
        
    except FileNotFoundError:
        print("الملف products_data_cleaned.json غير موجود!")
    except Exception as e:
        print(f"حدث خطأ: {e}")

if __name__ == "__main__":
    process_file()
