# 🛠️ مجلد أدوات التطوير والتوليد

يحتوي هذا المجلد على جميع السكريبتات والأدوات المساعدة في التطوير وإدارة المحتوى.

## 📝 الملفات المتوفرة

### 🏭 مولدات صفحات المنتجات
- `generate-products-script.js` - مولد JavaScript لصفحات المنتجات
- `generate-all-product-pages.js` - مولد شامل لجميع الصفحات
- `auto_generate_pages.py` - مولد Python تلقائي
- `generate_site_complete.py` - مولد الموقع بالكامل

### 🚀 مولدات الدفعات الضخمة
- `instant_bulk_generator.py` - مولد دفعات فوري
- `complete_bulk_generator.py` - مولد دفعات شامل
- `mass-update-script.py` - سكريبت تحديث جماعي

## 🔧 طريقة الاستخدام

### لتوليد جميع صفحات المنتجات:
```bash
cd scripts/
node generate-all-product-pages.js
```

### لتوليد دفعة فورية:
```bash
cd scripts/
python instant_bulk_generator.py
```

### لتحديث جماعي:
```bash
cd scripts/
python mass-update-script.py
```

## ⚠️ ملاحظات مهمة
- تأكد من وجود `products_data.json` في جذر المشروع
- تأكد من وجود مجلد `products-pages/` 
- اعمل نسخة احتياطية قبل التشغيل

---
**آخر تحديث:** 05 نوفمبر 2025