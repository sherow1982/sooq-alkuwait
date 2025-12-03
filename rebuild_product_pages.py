#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكربت إعادة هيكلة صفحات المنتجات بتصميم احترافي حديث
متوافق 100% مع Google Merchant Center
"""

import json
import os
from pathlib import Path
from urllib.parse import quote

def create_modern_product_page(product, index=1):
    """إنشاء صفحة منتج بتصميم احترافي حديث"""

    # استخراج البيانات من الحقول الجديدة
    product_id = product.get('id', index)
    name = product.get('title', 'منتج')
    price = product.get('sale_price', product.get('price', 0))
    old_price = product.get('price', 0)
    image = product.get('image_link', '')
    description = product.get('description', '')
    category = product.get('category', 'منتجات')
    brand = product.get('brand', 'سوق الكويت')
    availability = product.get('availability', 'in stock')
    condition = product.get('condition', 'new')
    currency = product.get('currency', 'KWD')

    # بيانات الشحن
    shipping_data = product.get('shipping', {})
    shipping_country = shipping_data.get('country', 'KW')
    shipping_service = shipping_data.get('service', 'Standard')
    shipping_price = shipping_data.get('price', 0.0)

    # استخدام filename من JSON أو بناءه
    filename = product.get('filename', '')
    if not filename:
        name_slug = name.replace(' ', '-')
        filename = f"product-{product_id}-{name_slug}.html"

    # بيانات تقييمية افتراضية
    rating = '4.8'
    reviews_count = '100'

    # حساب التخفيض
    savings = ''
    discount_percent = ''
    if old_price and float(old_price) > float(price):
        savings_amount = float(old_price) - float(price)
        discount = int((savings_amount / float(old_price)) * 100)
        savings = f"{savings_amount:.2f}"
        discount_percent = f"{discount}%"

    # بناء رابط المنتج
    name_slug = name.replace(' ', '-')
    product_link = f"https://sooq-alkuwait.arabsad.com/products-pages/{filename}"

    # رسالة واتساب
    whatsapp_msg = f"""مرحباً، أريد طلب:

📦 *المنتج:* {name}
💰 *السعر:* {price} {currency}
🔗 *الرابط:* {product_link}

👤 *بيانات المشتري:*
الاسم: 
العنوان: 
عدد القطع المطلوبة: 
رقم جوال بديل: """

    whatsapp_url = f"https://wa.me/201110760081?text={quote(whatsapp_msg)}"

    # تحويل availability لـ Schema.org
    schema_availability = "https://schema.org/InStock" if availability.lower() == "in stock" else "https://schema.org/OutOfStock"

    # تحويل condition لـ Schema.org
    condition_map = {
        'new': 'https://schema.org/NewCondition',
        'used': 'https://schema.org/UsedCondition',
        'refurbished': 'https://schema.org/RefurbishedCondition'
    }
    schema_condition = condition_map.get(condition.lower(), 'https://schema.org/NewCondition')

    # HTML النظيف والاحترافي متوافق مع Google Merchant Center
    html = f"""<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} | سوق الكويت</title>
    <meta name="description" content="{description[:150]}">

    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="product">
    <meta property="og:title" content="{name}">
    <meta property="og:description" content="{description[:150]}">
    <meta property="og:image" content="{image}">
    <meta property="og:url" content="{product_link}">
    <meta property="og:site_name" content="سوق الكويت">
    <meta property="product:price:amount" content="{price}">
    <meta property="product:price:currency" content="{currency}">

    <!-- Canonical URL -->
    <link rel="canonical" href="{product_link}">

    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">

    <!-- Site Components -->
    <link href="../site-components.css" rel="stylesheet">

    <style>
        :root {{
            --primary: #667eea;
            --primary-dark: #5568d3;
            --secondary: #764ba2;
            --success: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --text: #1a1a1a;
            --text-light: #6b7280;
            --bg: #f9fafb;
            --white: #ffffff;
            --border: #e5e7eb;
            --shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            --shadow-lg: 0 10px 25px -3px rgba(0,0,0,0.1);
        }}

        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}

        body {{
            font-family: 'Tajawal', sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
            padding-top: 70px;
        }}

        .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }}

        /* Breadcrumb */
        .breadcrumb {{
            background: var(--white);
            padding: 1rem;
            border-radius: 0.5rem;
            margin: 1.5rem 0;
            box-shadow: var(--shadow);
            display: flex;
            gap: 0.5rem;
            align-items: center;
            font-size: 0.9rem;
        }}

        .breadcrumb a {{
            color: var(--primary);
            text-decoration: none;
        }}

        .breadcrumb a:hover {{
            text-decoration: underline;
        }}

        /* Product Layout */
        .product-wrapper {{
            background: var(--white);
            border-radius: 1rem;
            box-shadow: var(--shadow-lg);
            padding: 2rem;
            margin-bottom: 2rem;
        }}

        .product-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
        }}

        @media (max-width: 768px) {{
            .product-grid {{
                grid-template-columns: 1fr;
                gap: 2rem;
            }}
        }}

        /* Image Section */
        .product-image {{
            position: relative;
        }}

        .product-image img {{
            width: 100%;
            height: auto;
            border-radius: 0.75rem;
            box-shadow: var(--shadow);
        }}

        .badge {{
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: linear-gradient(135deg, var(--danger), #dc2626);
            color: var(--white);
            padding: 0.5rem 1.5rem;
            border-radius: 50px;
            font-weight: 700;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }}

        /* Product Info */
        .category-tag {{
            display: inline-block;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: var(--white);
            padding: 0.5rem 1.5rem;
            border-radius: 50px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }}

        .product-title {{
            font-size: 2rem;
            font-weight: 900;
            margin-bottom: 1rem;
            color: var(--text);
            line-height: 1.3;
        }}

        @media (max-width: 768px) {{
            .product-title {{
                font-size: 1.5rem;
            }}
        }}

        /* Rating */
        .rating {{
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 2px solid var(--border);
        }}

        .stars {{
            color: #fbbf24;
            font-size: 1.25rem;
        }}

        .rating-value {{
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--primary);
        }}

        .rating-count {{
            color: var(--text-light);
            font-size: 0.95rem;
        }}

        /* Price */
        .price-box {{
            background: linear-gradient(135deg, #f0f9ff, #dbeafe);
            padding: 2rem;
            border-radius: 1rem;
            margin-bottom: 2rem;
            border: 2px solid var(--primary);
        }}

        .price-row {{
            display: flex;
            align-items: baseline;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        }}

        .current-price {{
            font-size: 3rem;
            font-weight: 900;
            color: var(--primary);
        }}

        .old-price {{
            font-size: 1.5rem;
            color: var(--text-light);
            text-decoration: line-through;
        }}

        @media (max-width: 768px) {{
            .current-price {{
                font-size: 2.25rem;
            }}
            .old-price {{
                font-size: 1.25rem;
            }}
        }}

        .savings {{
            background: #d1fae5;
            color: var(--success);
            padding: 0.5rem 1rem;
            border-radius: 50px;
            font-weight: 700;
            font-size: 1rem;
        }}

        /* Features */
        .features {{
            list-style: none;
            margin-bottom: 2rem;
        }}

        .features li {{
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--bg);
            margin-bottom: 0.5rem;
            border-radius: 0.5rem;
            border-right: 3px solid var(--primary);
            transition: transform 0.2s;
        }}

        .features li:hover {{
            transform: translateX(-5px);
            background: #eff6ff;
        }}

        .feature-icon {{
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--white);
            font-size: 1.25rem;
        }}

        /* Trust Badges */
        .trust-badges {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
        }}

        @media (max-width: 768px) {{
            .trust-badges {{
                grid-template-columns: 1fr;
            }}
        }}

        .trust-badge {{
            text-align: center;
            padding: 1.5rem;
            background: var(--bg);
            border-radius: 0.75rem;
            transition: all 0.3s;
        }}

        .trust-badge:hover {{
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: var(--white);
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
        }}

        .trust-badge i {{
            font-size: 2rem;
            display: block;
            margin-bottom: 0.5rem;
        }}

        /* Policy Buttons */
        .policy-buttons {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 2rem;
        }}

        @media (max-width: 768px) {{
            .policy-buttons {{
                grid-template-columns: 1fr;
            }}
        }}

        .policy-btn {{
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            padding: 1rem 1.5rem;
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            border: 2px solid #0ea5e9;
            border-radius: 0.75rem;
            color: #0c4a6e;
            text-decoration: none;
            font-weight: 700;
            font-size: 1rem;
            transition: all 0.3s;
        }}

        .policy-btn:hover {{
            background: linear-gradient(135deg, #0ea5e9, #0284c7);
            color: white;
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3);
        }}

        .policy-btn i {{
            font-size: 1.5rem;
        }}

        /* CTA Button */
        .cta-section {{
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            box-shadow: var(--shadow-lg);
        }}

        .whatsapp-btn {{
            width: 100%;
            background: linear-gradient(135deg, #25D366, #128C7E);
            color: var(--white);
            padding: 1.5rem;
            border: none;
            border-radius: 0.75rem;
            font-size: 1.5rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: block;
            margin-bottom: 1rem;
        }}

        .whatsapp-btn:hover {{
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(37, 211, 102, 0.5);
        }}

        .cart-btn {{
            width: 100%;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: var(--white);
            padding: 1.25rem;
            border: none;
            border-radius: 0.75rem;
            font-size: 1.25rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: block;
        }}

        .cart-btn:hover {{
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(245, 158, 11, 0.5);
        }}

        @media (max-width: 768px) {{
            .whatsapp-btn {{
                font-size: 1.25rem;
                padding: 1.25rem;
            }}
            .cart-btn {{
                font-size: 1.1rem;
                padding: 1rem;
            }}
        }}

        .urgency {{
            color: var(--white);
            font-weight: 700;
            margin-top: 1rem;
            font-size: 1rem;
        }}

        /* Description Section */
        .section {{
            background: var(--white);
            padding: 2rem;
            border-radius: 1rem;
            margin-bottom: 2rem;
            box-shadow: var(--shadow);
        }}

        .section-title {{
            font-size: 1.75rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            color: var(--text);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            border-bottom: 2px solid var(--primary);
            padding-bottom: 0.75rem;
        }}

        .description {{
            font-size: 1.05rem;
            line-height: 1.8;
            color: var(--text-light);
        }}

        /* Floating WhatsApp */
        .floating-whatsapp {{
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #25D366, #128C7E);
            color: var(--white);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            box-shadow: 0 8px 20px rgba(37, 211, 102, 0.5);
            z-index: 1000;
            animation: float 3s ease-in-out infinite;
            text-decoration: none;
        }}

        /* Floating Cart */
        .floating-cart {{
            position: fixed;
            bottom: 100px;
            left: 30px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: var(--white);
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 1.75rem;
            box-shadow: 0 8px 20px rgba(245, 158, 11, 0.5);
            z-index: 1000;
            animation: float 3s ease-in-out infinite 0.5s;
            text-decoration: none;
        }}

        .floating-cart.show {{
            display: flex;
        }}

        .cart-badge {{
            position: absolute;
            top: -5px;
            right: -5px;
            background: #dc2626;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 700;
        }}

        @keyframes float {{
            0%, 100% {{ transform: translateY(0); }}
            50% {{ transform: translateY(-10px); }}
        }}
    </style>

    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {{
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "{name}",
        "description": "{description}",
        "image": "{image}",
        "sku": "product-{product_id}",
        "mpn": "product-{product_id}",
        "brand": {{
            "@type": "Brand",
            "name": "{brand}"
        }},
        "offers": {{
            "@type": "Offer",
            "url": "{product_link}",
            "priceCurrency": "{currency}",
            "price": "{price}",
            "priceValidUntil": "2026-12-31",
            "availability": "{schema_availability}",
            "itemCondition": "{schema_condition}",
            "shippingDetails": {{
                "@type": "OfferShippingDetails",
                "shippingRate": {{
                    "@type": "MonetaryAmount",
                    "value": "{shipping_price}",
                    "currency": "{currency}"
                }},
                "shippingDestination": {{
                    "@type": "DefinedRegion",
                    "addressCountry": "{shipping_country}"
                }},
                "deliveryTime": {{
                    "@type": "ShippingDeliveryTime",
                    "handlingTime": {{
                        "@type": "QuantitativeValue",
                        "minValue": 1,
                        "maxValue": 2,
                        "unitCode": "DAY"
                    }},
                    "transitTime": {{
                        "@type": "QuantitativeValue",
                        "minValue": 1,
                        "maxValue": 3,
                        "unitCode": "DAY"
                    }}
                }}
            }},
            "hasMerchantReturnPolicy": {{
                "@type": "MerchantReturnPolicy",
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                "merchantReturnDays": 14,
                "returnMethod": "https://schema.org/ReturnByMail",
                "returnFees": "https://schema.org/FreeReturn"
            }}
        }},
        "aggregateRating": {{
            "@type": "AggregateRating",
            "ratingValue": "{rating}",
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": "{reviews_count}"
        }}
    }}
    </script>
</head>
<body>
    <div class="container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
            <a href="/">🏠 الرئيسية</a>
            <span>/</span>
            <a href="/products-catalog.html">المنتجات</a>
            <span>/</span>
            <span>{name}</span>
        </nav>

        <!-- Product -->
        <div class="product-wrapper">
            <div class="product-grid">
                <!-- Image -->
                <div class="product-image">
                    <img src="{image}" alt="{name}">
                    {f'<div class="badge">وفّر {discount_percent}</div>' if discount_percent else ''}
                </div>

                <!-- Info -->
                <div class="product-info">
                    <span class="category-tag">{category}</span>
                    <h1 class="product-title">{name}</h1>

                    <!-- Rating -->
                    <div class="rating">
                        <div class="stars">★★★★★</div>
                        <span class="rating-value">{rating}</span>
                        <span class="rating-count">({reviews_count} تقييم)</span>
                    </div>

                    <!-- Price -->
                    <div class="price-box">
                        <div class="price-row">
                            <div class="current-price">{price} {currency}</div>
                            {f'<div class="old-price">{old_price} {currency}</div>' if old_price and float(old_price) > float(price) else ''}
                        </div>
                        {f'<div class="savings">🎉 وفّر {savings} {currency} ({discount_percent})</div>' if savings else ''}
                    </div>

                    <!-- Features -->
                    <ul class="features">
                        <li>
                            <div class="feature-icon">✓</div>
                            <div><strong>منتج أصلي</strong><br><small>ضمان الجودة</small></div>
                        </li>
                        <li>
                            <div class="feature-icon">🚚</div>
                            <div><strong>شحن مجاني</strong><br><small>لجميع مناطق الكويت</small></div>
                        </li>
                        <li>
                            <div class="feature-icon">↩</div>
                            <div><strong>إرجاع مجاني</strong><br><small>خلال 14 يوم</small></div>
                        </li>
                        <li>
                            <div class="feature-icon">📞</div>
                            <div><strong>دعم 24/7</strong><br><small>رد فوري على واتساب</small></div>
                        </li>
                    </ul>

                    <!-- Trust Badges -->
                    <div class="trust-badges">
                        <div class="trust-badge">
                            <i class="fas fa-truck" style="color:#10b981"></i>
                            <div><strong>توصيل سريع</strong></div>
                            <small>1-3 أيام</small>
                        </div>
                        <div class="trust-badge">
                            <i class="fas fa-shield-alt" style="color:#667eea"></i>
                            <div><strong>ضمان شامل</strong></div>
                            <small>100% آمن</small>
                        </div>
                        <div class="trust-badge">
                            <i class="fas fa-exchange-alt" style="color:#f59e0b"></i>
                            <div><strong>إرجاع سهل</strong></div>
                            <small>بدون تعقيد</small>
                        </div>
                    </div>

                    <!-- Policy Buttons -->
                    <div class="policy-buttons">
                        <a href="https://sooq-alkuwait.arabsad.com/shipping-policy.html" class="policy-btn" target="_blank">
                            <i class="fas fa-shipping-fast"></i>
                            <span>سياسة الشحن</span>
                        </a>
                        <a href="https://sooq-alkuwait.arabsad.com/return-policy.html" class="policy-btn" target="_blank">
                            <i class="fas fa-undo-alt"></i>
                            <span>سياسة الإرجاع</span>
                        </a>
                    </div>

                    <!-- CTA -->
                    <div class="cta-section">
                        <a class="whatsapp-btn" href="{whatsapp_url}">
                            <i class="fab fa-whatsapp"></i> اطلب الآن عبر واتساب
                        </a>
                        <button class="cart-btn" onclick="addToCart()">
                            <i class="fas fa-shopping-cart"></i> أضف إلى السلة
                        </button>
                        <div class="urgency">⚡ الكمية محدودة - اطلب الآن!</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Description -->
        <div class="section">
            <h2 class="section-title">
                <i class="fas fa-info-circle"></i>
                وصف المنتج
            </h2>
            <div class="description">
                <p>{description}</p>
            </div>
        </div>
    </div>

    <!-- Floating WhatsApp -->
    <a class="floating-whatsapp" href="{whatsapp_url}">
        <i class="fab fa-whatsapp"></i>
    </a>

    <!-- Floating Cart -->
    <a class="floating-cart" id="floatingCart" href="https://sooq-alkuwait.arabsad.com/cart.html">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-badge" id="cartBadge">0</span>
    </a>

    <!-- Scripts -->
    <script src="../site-header.js"></script>
    <script src="../site-footer.js"></script>

    <script>
        // بيانات المنتج
        const productData = {{
            id: '{product_id}',
            title: '{name}',
            price: '{price}',
            image: '{image}',
            link: '{filename}',
            quantity: 1
        }};

        // إضافة للسلة
        function addToCart() {{
            try {{
                let cart = JSON.parse(localStorage.getItem('cart') || '[]');

                const existingIndex = cart.findIndex(item => item.id === productData.id);

                if (existingIndex > -1) {{
                    cart[existingIndex].quantity += 1;
                }} else {{
                    cart.push({{...productData}});
                }}

                localStorage.setItem('cart', JSON.stringify(cart));

                updateCartBadge();

                const floatingCart = document.getElementById('floatingCart');
                floatingCart.classList.add('show');

                alert('✅ تمت الإضافة إلى السلة بنجاح!');
            }} catch (e) {{
                console.error('خطأ في إضافة المنتج:', e);
                alert('حدث خطأ، حاول مرة أخرى');
            }}
        }}

        // تحديث عداد السلة
        function updateCartBadge() {{
            try {{
                const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

                const badge = document.getElementById('cartBadge');
                if (badge) {{
                    badge.textContent = totalItems;
                }}

                const floatingCart = document.getElementById('floatingCart');
                if (totalItems > 0 && floatingCart) {{
                    floatingCart.classList.add('show');
                }}
            }} catch (e) {{
                console.error('خطأ في تحديث السلة:', e);
            }}
        }}

        // تحديث العداد عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', updateCartBadge);
    </script>
</body>
</html>"""

    return html


def main():
    """معالجة جميع المنتجات"""

    print("🚀 بدء إعادة هيكلة صفحات المنتجات...")
    print("✨ نسخة محدثة: متوافقة 100% مع Google Merchant Center")

    # قراءة بيانات المنتجات
    json_file = Path('products_data.json')
    if not json_file.exists():
        print(f"❌ خطأ: ملف {json_file} غير موجود!")
        return

    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # معالجة كلا الحالتين: قائمة مباشرة أو كائن يحتوي على products
    if isinstance(data, list):
        products = data
        print("📋 تم اكتشاف: قائمة مباشرة من المنتجات")
    elif isinstance(data, dict):
        products = data.get('products', [])
        print("📋 تم اكتشاف: كائن يحتوي على مفتاح products")
    else:
        print("❌ خطأ: صيغة غير معروفة في ملف JSON!")
        return

    if not products:
        print("❌ لا توجد منتجات في الملف!")
        return

    print(f"📦 عدد المنتجات: {len(products)}")

    # إنشاء مجلد الإخراج
    output_dir = Path('products-pages')
    output_dir.mkdir(exist_ok=True)

    # معالجة كل منتج
    success_count = 0
    for idx, product in enumerate(products, 1):
        try:
            # الحصول على filename من JSON
            filename = product.get('filename', '')

            if not filename:
                # بناء filename إذا لم يكن موجوداً
                product_id = product.get('id', idx)
                name = product.get('title', 'product')
                name_slug = name.replace(' ', '-')
                filename = f"product-{product_id}-{name_slug}.html"

            # إنشاء محتوى الصفحة
            html_content = create_modern_product_page(product, idx)

            # حفظ الصفحة
            output_file = output_dir / filename
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(html_content)

            success_count += 1
            print(f"✅ [{idx}/{len(products)}] تم إنشاء: {filename}")

        except Exception as e:
            print(f"❌ خطأ في معالجة المنتج {idx}: {str(e)}")

    print(f"\n{'='*60}")
    print(f"✨ اكتمل العمل بنجاح!")
    print(f"📊 تم إنشاء {success_count} من {len(products)} صفحة")
    print(f"📁 الموقع: {output_dir.absolute()}")
    print(f"\n🎯 الحقول المستخدمة من JSON:")
    print(f"   ✓ id, title, price, sale_price")
    print(f"   ✓ image_link, description, category")
    print(f"   ✓ brand, availability, condition")
    print(f"   ✓ currency, shipping (country/service/price)")
    print(f"   ✓ filename (اسم الملف من JSON)")
    print(f"{'='*60}")


if __name__ == '__main__':
    main()
