@echo off
REM ========================================
REM   الأوامر الكاملة لتطبيق جميع التحديثات
REM   سوق الكويت - نظام الكاتالوج الذكي
REM ========================================

echo.
echo ========================================
echo   بدء تطبيق التحديثات الشاملة
echo ========================================
echo.

REM 1. سحب آخر نسخة من GitHub
<<<<<<< HEAD
echo [1/7] سحب آخر تحديثات من GitHub...
=======
echo [1/8] سحب آخر تحديثات من GitHub...
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
git pull origin main --rebase
if %errorlevel% neq 0 (
    echo تحذير: قد يكون هناك تعارضات
    git pull origin main
)

echo.
echo [نجح] تم سحب آخر نسخة
echo.

REM 2. حذف الملفات المؤقتة
<<<<<<< HEAD
echo [2/7] حذف الملفات المكررة والمؤقتة...
=======
echo [2/8] حذف الملفات المكررة...
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
del /F /Q "catalog-images-fix.css" 2>nul
del /F /Q "catalog-products (1).js" 2>nul
del /F /Q "catalog-products-enhanced.js" 2>nul
del /F /Q "catalog-products-fixed.js" 2>nul
del /F /Q "products-catalog-updated.html" 2>nul

echo [نجح] تم حذف الملفات المؤقتة
echo.

<<<<<<< HEAD
REM 3. إنشاء ملف JSON مع استخراج الصور المحسّن
echo [3/7] إنشاء products_data.json...
=======
REM 3. إنشاء JSON
echo [3/8] إنشاء products_data.json...
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
python create_products_json.py
if %errorlevel% neq 0 (
    echo خطأ في إنشاء JSON
    pause
    exit /b 1
)

echo [نجح] تم إنشاء products_data.json
echo.

<<<<<<< HEAD
REM 4. إنشاء ملفات SEO
echo [4/7] إنشاء ملفات SEO...
python generate_seo_files.py
if %errorlevel% neq 0 (
    echo خطأ في إنشاء ملفات SEO
=======
REM 4. إضافة سمات Google Merchant
echo [4/8] إضافة سمات Google Merchant Center...
python add_merchant_attributes.py
if %errorlevel% neq 0 (
    echo خطأ في إضافة السمات
    pause
    exit /b 1
)

echo [نجح] تم إضافة سمات Google Merchant
echo.

REM 5. إنشاء SEO
echo [5/8] إنشاء ملفات SEO...
python generate_seo_files.py
if %errorlevel% neq 0 (
    echo خطأ في إنشاء SEO
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
    pause
    exit /b 1
)

echo [نجح] تم إنشاء ملفات SEO
echo.

<<<<<<< HEAD
REM 5. إضافة زر السلة العائم لجميع صفحات المنتجات
echo [5/7] إضافة زر السلة العائم لصفحات المنتجات...
python add_floating_cart_to_products.py
if %errorlevel% neq 0 (
    echo خطأ في إضافة زر السلة
=======
REM 6. إضافة زر السلة
echo [6/8] إضافة زر السلة العائم...
python add_floating_cart_to_products.py
if %errorlevel% neq 0 (
    echo خطأ في إضافة السلة
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
    pause
    exit /b 1
)

<<<<<<< HEAD
echo [نجح] تم إضافة زر السلة لجميع الصفحات
echo.

REM 6. إضافة جميع الملفات المحدثة
echo [6/7] إضافة الملفات للـ Git...
=======
echo [نجح] تم إضافة السلة لجميع الصفحات
echo.

REM 7. إضافة الملفات
echo [7/8] إضافة الملفات للـ Git...
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
git add products_data.json
git add product-sitemap.xml
git add google-merchant-feed.xml
git add products-pages/
git add floating-cart.css
git add floating-cart.js
git add catalog-products.js
git add products-catalog.html

echo [نجح] تم إضافة الملفات
echo.

<<<<<<< HEAD
REM 7. رفع التحديثات
echo [7/7] رفع التحديثات لـ GitHub...
git commit -m "✨ Complete update: floating cart, improved images, SEO optimization"
=======
REM 8. رفع التحديثات
echo [8/8] رفع التحديثات لـ GitHub...
git commit -m "✨ Complete: clickable cards + floating cart + Google Merchant attrs"
>>>>>>> 7151e3ef4b780b1f63fa32b9c845e268bafb6f43
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ✅ تم رفع جميع التحديثات بنجاح!
    echo ========================================
    echo.
    echo الموقع محدّث على:
    echo https://sherow1982.github.io/sooq-alkuwait/products-catalog.html
    echo.
) else (
    echo.
    echo ========================================
    echo   ❌ حدث خطأ في رفع التحديثات
    echo ========================================
    echo.
)

pause
