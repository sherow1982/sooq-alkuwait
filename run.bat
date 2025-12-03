@echo off
chcp 65001 > nul
echo ========================================
echo   إصلاح صفحات منتجات سوق الكويت
echo ========================================
echo.

:: التحقق من تثبيت بايثون
python --version > nul 2>&1
if errorlevel 1 (
    echo ❌ بايثون غير مثبت على النظام!
    echo يرجى تثبيت Python 3.8 أو أعلى من:
    echo https://www.python.org/downloads/
    pause
    exit /b 1
)

:: تشغيل السكريبت
echo 🚀 بدء عملية الإصلاح...
python fix_products.py

echo.
echo ✅ تم الانتهاء من الإصلاح!
echo.
pause