# 🔧 دليل حل المشاكل - GitHub Actions

## 🚨 مشكلة صلاحيات الكتابة

### الخطأ الذي تواجهه:
```
remote: Permission to sherow1982/sooq-alkuwait.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/sherow1982/sooq-alkuwait/': The requested URL returned error: 403
Error: Process completed with exit code 128.
```

## ✅ الحل السريع (5 خطوات فقط):

### 🔐 تفعيل صلاحيات الكتابة:

**1.** اذهب إلى: https://github.com/sherow1982/sooq-alkuwait

**2.** اضغط على تبويب **"Settings"** (في أعلى يمين الصفحة)

**3.** من القائمة الجانبية، اضغط على **"Actions"** ← **"General"**

**4.** ابحث عن قسم **"Workflow permissions"** واختر:
   - ✅ **"Read and write permissions"**
   - ✅ ضع علامة على **"Allow GitHub Actions to create and approve pull requests"**

**5.** اضغط **"Save"** في أسفل الصفحة

---

## 🚀 اختبار الحل:

### بعد تطبيق الحل:
1. اذهب إلى تبويب **"Actions"**
2. اضغط على **"🚀 توليد صفحات المنتجات التلقائي"**
3. اضغط على **"Run workflow"**
4. اضغط على الزر الأخضر **"Run workflow"**

### النتيجة المتوقعة:
```
✅ GitHub Actions يعمل بنجاح
✅ تم إنشاء مجلد products-pages
✅ تم توليد 164 صفحة منتج
✅ تم رفع الصفحات تلقائياً
✅ الموقع جاهز للعمل
```

---

## 🔄 حل بديل: استخدام Personal Access Token

### إذا لم ينجح الحل الأول:

**1.** اذهب إلى إعدادات GitHub الشخصية:
   - https://github.com/settings/tokens

**2.** اضغط **"Generate new token (classic)"**

**3.** اختر الصلاحيات:
   - ✅ **repo** (كامل)
   - ✅ **workflow**
   - ✅ **write:packages**

**4.** انسخ الـ Token المُنشأ

**5.** ارجع إلى الريبو:
   - Settings → Secrets and variables → Actions
   - اضغط **"New repository secret"**
   - Name: `PAT_TOKEN`
   - Secret: الـ token المنسوخ
   - اضغط **"Add secret"**

**6.** عدّل ملف الـ workflow لاستخدام الـ Token الجديد

---

## 🎯 التأكد من نجاح الحل:

### علامات النجاح:
✅ **لا يوجد خطأ 403**
✅ **ظهور رسالة "تم رفع الصفحات بنجاح"**
✅ **إنشاء مجلد products-pages في الريبو**
✅ **ظهور 164+ ملف HTML**
✅ **عمل الروابط بشكل صحيح**

### كيفية التحقق:
```bash
# في سجل GitHub Actions ستجد:
🚀 التقدم: |████████████████████████████| 164/164 (100.0%) منتج
✅ product-1-حصالة-صراف-آلي....html - ألعاب الأطفال
✅ product-2-صفاية-سلطة-دوّارة....html - أدوات المطبخ
...
🎉 اكتمال العملية بنجاح!
📁 مجلد الحفظ: products-pages/
🌐 الصفحات متوفرة الآن على: https://sooq-alkuwait.com
```

---

## 🛠️ مشاكل إضافية محتملة وحلولها:

### مشكلة: ملفات JSON غير صحيحة
**الخطأ:**
```
❌ خطأ: ملف products_data.json غير صحيح
```
**الحل:**
- تحقق من صحة ملف JSON باستخدام jsonlint.com
- تأكد من عدم وجود فواصل زائدة أو أقواس مفقودة

### مشكلة: GitHub Pages غير مفعل
**الخطأ:** الروابط لا تعمل رغم نجاح Actions
**الحل:**
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: / (root)
5. Save

### مشكلة: الروابط معطلة
**الخطأ:** 404 عند فتح صفحات المنتجات
**الحل:**
- تأكد من أن مجلد products-pages موجود في الريبو
- تحقق من أسماء الملفات (يجب أن تكون بصيغة .html)
- تأكد من ربط الصفحة الرئيسية بصفحات المنتجات

---

## 📞 إذا استمرت المشاكل:

### خطوات التشخيص:
1. **تحقق من سجل Actions** - ابحث عن رسائل الخطأ الحمراء
2. **تحقق من صلاحيات الريبو** - Settings → Actions → General
3. **تحقق من ملفات JSON** - تأكد من صحتها
4. **تحقق من GitHub Pages** - Settings → Pages

### معلومات مفيدة للدعم:
- **الريبو**: `sherow1982/sooq-alkuwait`
- **الفرع**: `main`
- **الملفات المطلوبة**: `products_data.json`, `kuwaiti_reviews.json`
- **المجلد المطلوب**: `products-pages/`
- **عدد الملفات المتوقع**: 164 صفحة HTML

---

## 🎉 بعد الحل:

**ستحصل على:**
- ✅ **164 صفحة منتج احترافية**
- ✅ **تحديث تلقائي عند إضافة منتجات**
- ✅ **عروض متجددة يومياً**
- ✅ **موقع محسن لمحركات البحث**
- ✅ **تصميم متجاوب وحديث**

**🚀 متجرك الإلكتروني سيكون جاهزاً ويعمل بكفاءة عالية!**

---

## 📋 قائمة مراجعة سريعة:

- [ ] تم تفعيل "Read and write permissions" في Settings → Actions
- [ ] تم تفعيل "Allow GitHub Actions to create and approve pull requests"
- [ ] تم تشغيل GitHub Action من تبويب Actions
- [ ] ظهرت رسالة نجاح وليس خطأ 403
- [ ] تم إنشاء مجلد products-pages في الريبو
- [ ] تم إنشاء 164+ ملف HTML
- [ ] تم تفعيل GitHub Pages من Settings → Pages
- [ ] الروابط تعمل بشكل صحيح

**✨ إذا تحققت جميع العلامات، فمبروك! متجرك جاهز للعمل!**