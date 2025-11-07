#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت ضبط شامل للموبايل - تحسين تجربة المستخدم
يعمل على جميع صفحات الموقع
التاريخ: 2025-11-07
"""

import os
import re
from pathlib import Path

def optimize_mobile():
    """تحسين الموقع للموبايل"""
    
    # قراءة ملف mobile-fix.css وتحسينه
    css_file = Path("css/mobile-fix.css")
    
    if not css_file.exists():
        print("⚠️  ملف mobile-fix.css غير موجود، سأنشئه...")
        css_file.parent.mkdir(parents=True, exist_ok=True)
    
    # CSS محسّن للموبايل
    mobile_css = """/**
 * 📱 تحسينات شاملة للموبايل - سوق الكويت
 * التاريخ: 2025-11-07
 */

/* ============================================
   إصلاحات عامة للموبايل
   ============================================ */
@media (max-width: 768px) {
    
    /* منع التمرير الأفقي */
    body {
        overflow-x: hidden !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    
    * {
        box-sizing: border-box;
    }
    
    /* Container */
    .container {
        max-width: 100% !important;
        padding-left: 10px !important;
        padding-right: 10px !important;
    }
    
    /* ============================================
       بطاقات المنتجات
       ============================================ */
    .products-grid-pro {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 10px !important;
        padding: 10px !important;
    }
    
    .product-card-pro {
        padding: 10px !important;
        border-radius: 12px !important;
    }
    
    .product-image-pro {
        height: 140px !important;
        border-radius: 8px !important;
    }
    
    .product-title-pro {
        font-size: 0.85rem !important;
        line-height: 1.3 !important;
        min-height: 40px !important;
        max-height: 45px !important;
        overflow: hidden !important;
    }
    
    .price-current-pro {
        font-size: 1.1rem !important;
    }
    
    .price-old-pro {
        font-size: 0.85rem !important;
    }
    
    /* ============================================
       أزرار الموبايل
       ============================================ */
    .btn-view-pro,
    .btn-buy-pro,
    .buy-button {
        padding: 10px 15px !important;
        font-size: 0.9rem !important;
        border-radius: 8px !important;
    }
    
    /* زر طلب فوري */
    .whatsapp-product-btn-pro {
        padding: 12px 20px !important;
        font-size: 1rem !important;
        border-radius: 25px !important;
    }
    
    /* ============================================
       Action Bar السفلي
       ============================================ */
    .mobile-action-bar-pro {
        display: flex !important;
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        background: linear-gradient(135deg, #000000, #007A3D) !important;
        border-top: 3px solid #FFD700 !important;
        padding: 10px 5px !important;
        gap: 8px !important;
        z-index: 9999 !important;
        box-shadow: 0 -5px 20px rgba(0,0,0,0.3) !important;
    }
    
    .mobile-action-btn-pro {
        flex: 1 !important;
        padding: 12px 8px !important;
        font-size: 0.85rem !important;
        border-radius: 10px !important;
        font-weight: bold !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 5px !important;
        border: none !important;
        cursor: pointer !important;
        transition: 0.3s !important;
    }
    
    .mobile-action-btn-pro i {
        font-size: 1.3rem !important;
    }
    
    .mobile-btn-cart-pro {
        background: linear-gradient(45deg, #007A3D, #00a651) !important;
        color: white !important;
    }
    
    .mobile-btn-whatsapp-pro {
        background: linear-gradient(45deg, #25D366, #128C7E) !important;
        color: white !important;
    }
    
    .mobile-btn-call-pro {
        background: linear-gradient(45deg, #CE1126, #ff4757) !important;
        color: white !important;
    }
    
    .mobile-action-btn-pro:active {
        transform: scale(0.95) !important;
    }
    
    /* ============================================
       Hero Section
       ============================================ */
    section[style*="padding: 5rem"] {
        padding: 2rem 0 !important;
    }
    
    h1 {
        font-size: 1.8rem !important;
    }
    
    h2 {
        font-size: 1.5rem !important;
    }
    
    p {
        font-size: 1rem !important;
    }
    
    /* ============================================
       Navbar
       ============================================ */
    .navbar-pro {
        padding: 8px 0 !important;
    }
    
    .navbar-brand-pro {
        font-size: 1.2rem !important;
    }
    
    .search-box-pro {
        width: 100% !important;
        margin: 8px 0 !important;
    }
    
    .search-input-pro {
        font-size: 0.9rem !important;
        padding: 8px 15px !important;
    }
    
    /* ============================================
       Footer
       ============================================ */
    footer {
        padding: 2rem 0 6rem !important;
        margin-bottom: 70px !important;
    }
    
    /* ============================================
       إخفاء زر واتساب العائم (لصالح Action Bar)
       ============================================ */
    .whatsapp-float-pro {
        display: none !important;
    }
    
    /* ============================================
       مسافة سفلية للمحتوى (لتجنب تداخل Action Bar)
       ============================================ */
    body {
        padding-bottom: 80px !important;
    }
    
    /* ============================================
       تحسين الصور
       ============================================ */
    img {
        max-width: 100% !important;
        height: auto !important;
    }
    
    /* ============================================
       Feature Boxes
       ============================================ */
    .feature-box {
        padding: 15px !important;
        margin-bottom: 10px !important;
    }
    
    .feature-box i {
        font-size: 2rem !important;
    }
    
    /* ============================================
       Breadcrumb
       ============================================ */
    .breadcrumb,
    .breadcrumb-pro {
        padding: 8px !important;
        font-size: 0.75rem !important;
        flex-wrap: wrap !important;
    }
}

/* ============================================
   شاشات صغيرة جداً (< 360px)
   ============================================ */
@media (max-width: 360px) {
    .products-grid-pro {
        grid-template-columns: 1fr !important;
    }
    
    .product-title-pro {
        font-size: 0.8rem !important;
    }
    
    .mobile-action-btn-pro {
        font-size: 0.75rem !important;
        padding: 10px 5px !important;
    }
}

/* نهاية الملف */
"""
    
    # كتابة ملف CSS
    with open(css_file, 'w', encoding='utf-8') as f:
        f.write(mobile_css)
    
    print("✅ تم تحديث ملف mobile-fix.css")
    
    # ==================================================
    # التأكد من إضافة الملف لجميع صفحات HTML
    # ==================================================
    total_files = 0
    updated_files = 0
    
    print("\n📱 إضافة mobile-fix.css لجميع الصفحات...")
    print("=" * 70)
    
    for html_file in Path(".").rglob("*.html"):
        # تجاهل بعض المجلدات
        if any(x in str(html_file) for x in ['.git', 'node_modules', '__pycache__']):
            continue
        
        total_files += 1
        
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # التحقق من عدم وجود الرابط مسبقاً
            if 'mobile-fix.css' not in content and '</head>' in content:
                # إضافة الرابط قبل </head>
                css_link = '    <link href="css/mobile-fix.css" rel="stylesheet">\n</head>'
                
                # تحديد المسار الصحيح حسب موقع الملف
                if 'products-pages' in str(html_file):
                    css_link = '    <link href="../css/mobile-fix.css" rel="stylesheet">\n</head>'
                elif 'categories' in str(html_file):
                    css_link = '    <link href="../css/mobile-fix.css" rel="stylesheet">\n</head>'
                
                content = content.replace('</head>', css_link)
                
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                updated_files += 1
                
                if updated_files <= 10:
                    print(f"✅ {updated_files}. {html_file.name}")
        
        except Exception as e:
            print(f"❌ خطأ في {html_file}: {str(e)}")
    
    # التقرير
    print("=" * 70)
    print(f"\n📊 التقرير:")
    print(f"   📁 الملفات: {total_files}")
    print(f"   ✅ تم التحديث: {updated_files}")
    print(f"\n{'='*70}")
    print("✅ تم ضبط الموقع للموبايل بنجاح!")
    print("=" * 70)
    print("\n🚀 الخطوة التالية:")
    print("   git add .")
    print('   git commit -m "تحسين شامل لعرض الموبايل"')
    print("   git push origin main --force")

if __name__ == "__main__":
    optimize_mobile()
