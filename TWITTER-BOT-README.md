# 🤖 بوت تويتر التلقائي - سوق الكويت

بوت ذكي ينشر منتجات على تويتر بشكل تلقائي كل 8 ساعات

## ✨ الميزات

- 🔄 نشر تلقائي كل 8 ساعات
- 🎲 اختيار عشوائي للمنتجات
- 📸 رفع صور عالية الجودة
- 💰 عرض الأسعار والخصومات
- 🔗 روابط مباشرة للمنتجات
- #️⃣ هاشتاجات ذكية

## 🛠️ الإعداد

### 1. الحصول على Twitter API Keys

1. اذهب إلى [Twitter Developer Portal](https://developer.twitter.com/)
2. أنشئ **Standalone App** جديد
3. في **User authentication settings**:
   - فعّل **OAuth 1.0a**
   - App permissions: **Read and Write**
   - Type of App: **Web App**
   - Callback URL: `https://sooqalkuwait.com`
4. في تبويب **Keys and tokens**:
   - انسخ **API Key** و **API Secret**
   - ولّد **Access Token** و **Access Token Secret**

### 2. إضافة Secrets في GitHub

اذهب إلى إعدادات الريبو:

```
Settings > Secrets and variables > Actions > New repository secret
```

أضف المفاتيح التالية:

| Secret Name | القيمة |
|-------------|------|
| `TWITTER_API_KEY` | API Key من Twitter |
| `TWITTER_API_SECRET` | API Secret من Twitter |
| `TWITTER_ACCESS_TOKEN` | Access Token من Twitter |
| `TWITTER_ACCESS_SECRET` | Access Token Secret من Twitter |

### 3. تفعيل GitHub Actions

1. اذهب إلى تبويب **Actions** في الريبو
2. فعّل **Workflows** إذا كانت معطلة
3. ستجد workflow باسم **Twitter Auto Post Bot**

## 🚀 الاستخدام

### نشر تلقائي (الوضع الافتراضي)

- يعمل تلقائيًا كل 8 ساعات
- يبدأ في الساعة 00:00, 08:00, 16:00 UTC

### نشر يدوي

1. اذهب إلى **Actions** > **Twitter Auto Post Bot**
2. اضغط على **Run workflow**
3. اختر branch: **main**
4. اضغط **Run workflow** الأخضر

## 📝 شكل التغريدة

مثال على التغريدة المنشورة:

```
🔥 حصالة صراف آلي أوتوماتيكية بتصميم كرتوني للأطفال

⚡ خصم 28%
❌ السعر القديم: 18 KWD
✅ السعر الآن: 13 KWD

🛍️ اطلب الآن: https://sooqalkuwait.com/products-pages/product-1-...

#سوق_الكويت #عروض_اليوم #تسوق_اونلاين #الكويت
```

## 🔧 الملفات

```
.github/
├── workflows/
│   └── twitter-bot.yml          # GitHub Actions workflow
└── scripts/
    └── twitter_bot.py           # سكريبت البوت بايثون
```

## 📈 الإحصائيات

- **تردد النشر**: 3 بوستات/يوم (~95 بوست/شهر)
- **توقيت النشر**: 00:00, 08:00, 16:00 UTC
- **عدد المنتجات**: 86 منتج

## ✅ متطلبات المكتبات

```python
tweepy>=4.14.0      # Twitter API wrapper
requests>=2.31.0    # HTTP requests
Pillow>=10.0.0      # Image processing
```

## 🐛 استكشاف الأخطاء

### لو في مشكلة في النشر:

1. تأكد من صحة Secrets في GitHub
2. افحص Logs في Actions tab
3. تأكد من أن Twitter App permissions = **Read and Write**
4. تأكد من تفعيل OAuth 1.0a

### رسائل خطأ شائعة:

| الخطأ | الحل |
|-------|------|
| `403 Forbidden` | تأكد من permissions: Read and Write |
| `401 Unauthorized` | راجع API Keys و Tokens |
| `Image too large` | يتم ضغطها تلقائيًا (لو المشكلة مستمرة اتصل) |
| `No module named tweepy` | مشكلة بالتنصيب (مفترض تتحل تلقائيًا) |

## 💡 نصائح

1. **لو عايز تغير التردد**:
   - في ملف `.github/workflows/twitter-bot.yml`
   - غير `cron: '0 */8 * * *'`
   - مثال: `0 */6 * * *` = كل 6 ساعات

2. **لو عايز تغير نص التغريدة**:
   - عدل في دالة `create_tweet_text()` في `twitter_bot.py`

3. **لو عايز تفلتر منتجات معينة**:
   - عدل في دالة `load_products()` لفلترة حسب category أو price

## 🔒 الأمان

- 🔐 كل API Keys مشفرة في GitHub Secrets
- 🚫 ماتحطش مفاتيح في الكود مباشرة
- 🔄 لو حصل leak للمفاتيح، ولّدهم فورًا من Twitter Portal

## 📞 الدعم

لو عندك أي مشكلة أو استفسار، افتح issue في الريبو!

---

**تم التطوير بواسطة** ❤️ لـ سوق الكويت
