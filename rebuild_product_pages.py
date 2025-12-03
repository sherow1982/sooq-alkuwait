#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكربت إعادة هيكلة صفحات المنتجات بتصميم احترافي حديث
متوافق 100% مع Google Merchant Center + نظام التقييمات
- يسحب التقييمات من reviews-data.json فقط
- بانر احترافي تحت الهيدر
- معلومات سريعة تحت الصورة (بدون "منتج أصلي")
- متوافق تماماً مع الجوال
- Schema.org دقيق ومحسّن
"""

import json
from pathlib import Path
from urllib.parse import quote


def load_reviews(product_id):
    """قراءة التقييمات من reviews-data.json فقط - لا اختراع"""
    try:
        reviews_file = Path('reviews-data.json')
        if reviews_file.exists():
            with open(reviews_file, 'r', encoding='utf-8') as f:
                all_reviews = json.load(f)
            
            # البحث عن تقييمات المنتج المحدد
            product_reviews = all_reviews.get(str(product_id), {})
            
            return {
                'average_rating': str(product_reviews.get('average_rating', '0')),
                'total_reviews': str(product_reviews.get('total_reviews', '0')),
                'reviews': product_reviews.get('reviews', [])
            }
        else:
            # لا يوجد ملف تقييمات - لا تقييمات
            return {
                'average_rating': '0',
                'total_reviews': '0',
                'reviews': []
            }
    except Exception as e:
        print(f"⚠️ تحذير: خطأ في قراءة التقييمات للمنتج {product_id}: {e}")
        return {
            'average_rating': '0',
            'total_reviews': '0',
            'reviews': []
        }


def generate_reviews_html(reviews):
    """إنشاء HTML لقسم التقييمات"""
    if not reviews:
        return (
            '<p style="text-align: center; color: #6b7280; padding: 2rem;">'
            'لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!'
            '</p>'
        )
    
    html_parts = []
    for review in reviews:
        try:
            name = review.get('name', 'عميل')
            date = review.get('date', '')
            rating = int(review.get('rating', 5))
            comment = review.get('comment', '')
            
            stars_filled = '★' * rating
            stars_empty = '☆' * (5 - rating)
            stars = stars_filled + stars_empty
            
            review_html = f"""
            <div class="review-card">
                <div class="review-header">
                    <span class="review-author">{name}</span>
                    <span class="review-date">{date}</span>
                </div>
                <div class="review-stars">{stars}</div>
                <div class="review-text">{comment}</div>
            </div>
            """
            html_parts.append(review_html)
        except Exception as e:
            print(f"⚠️ تحذير: خطأ في معالجة تقييم: {e}")
            continue
    
    return "\n".join(html_parts)


def build_reviews_schema(reviews_list):
    """بناء جزء review في Schema.org JSON-LD"""
    if not reviews_list:
        return ""
    
    schema_reviews = []
    for rev in reviews_list[:3]:  # أول 3 تقييمات فقط
        try:
            review_item = {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": rev.get("name", "عميل")
                },
                "datePublished": rev.get("date", "2025-01-01"),
                "reviewBody": rev.get("comment", ""),
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": str(rev.get("rating", 5)),
                    "bestRating": "5",
                    "worstRating": "1"
                }
            }
            schema_reviews.append(review_item)
        except Exception:
            continue
    
    if not schema_reviews:
        return ""
    
    # تحويل لـ JSON string
    reviews_json = json.dumps(schema_reviews, ensure_ascii=False, indent=8)
    return f'"review": {reviews_json},'


def create_modern_product_page(product, index=1):
    """إنشاء صفحة منتج بتصميم احترافي حديث"""
    
    # استخراج البيانات من products_data.json
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
    
    # قراءة التقييمات من reviews-data.json (لا اختراع)
    reviews_data = load_reviews(product_id)
    rating = reviews_data['average_rating']
    reviews_count = reviews_data['total_reviews']
    reviews_list = reviews_data['reviews']
    
    # إذا لا توجد تقييمات، عرض 0 بدلاً من رقم افتراضي
    if rating == '0' or reviews_count == '0':
        rating_display = "لا تقييمات بعد"
        rating_stars = "☆☆☆☆☆"
    else:
        rating_display = f"{rating} ({reviews_count} تقييم)"
        rating_float = float(rating)
        full_stars = int(rating_float)
        rating_stars = "★" * full_stars + "☆" * (5 - full_stars)
    
    # حساب التخفيض
    savings = ''
    discount_percent = ''
    if old_price and float(old_price) > float(price):
        savings_amount = float(old_price) - float(price)
        discount = int((savings_amount / float(old_price)) * 100)
        savings = f"{savings_amount:.2f}"
        discount_percent = f"{discount}%"
    
    # بناء رابط المنتج
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
    
    # بناء reviews schema
    reviews_schema = build_reviews_schema(reviews_list)
    
    # بناء aggregateRating فقط إذا كانت هناك تقييمات
    aggregate_rating_schema = ""
    if rating != '0' and reviews_count != '0':
        aggregate_rating_schema = f""""aggregateRating": {{
            "@type": "AggregateRating",
            "ratingValue": "{rating}",
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": "{reviews_count}"
        }},"""
    
    # توليد HTML للتقييمات
    reviews_html = generate_reviews_html(reviews_list)
    
    # بناء HTML الكامل
    html = f"""<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} | سوق الكويت</title>
    <meta name="description" content="{description[:150]}">
    
    <!-- Open Graph -->
    <meta property="og:type" content="product">
    <meta property="og:title" content="{name}">
    <meta property="og:description" content="{description[:150]}">
    <meta property="og:image" content="{image}">
    <meta property="og:url" content="{product_link}">
    <meta property="og:site_name" content="سوق الكويت">
    <meta property="product:price:amount" content="{price}">
    <meta property="product:price:currency" content="{currency}">
    
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
        
        /* Banner */
        .banner-container {{
            width: 100%;
            max-width: 1200px;
            margin: 1rem auto;
            padding: 0 1rem;
        }}
        
        .banner-container img {{
            width: 100%;
            height: auto;
            border-radius: 1rem;
            box-shadow: var(--shadow);
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
            flex-wrap: wrap;
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
        
        /* Quick Info تحت الصورة */
        .quick-info {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.75rem;
            margin-top: 1rem;
        }}
        
        @media (max-width: 768px) {{
            .quick-info {{
                grid-template-columns: 1fr;
            }}
        }}
        
        .quick-info-item {{
            background: var(--bg);
            padding: 0.75rem;
            border-radius: 0.5rem;
            text-align: center;
            border: 1px solid var(--border);
            transition: all 0.3s;
        }}
        
        .quick-info-item:hover {{
            background: #eff6ff;
            border-color: var(--primary);
            transform: translateY(-2px);
        }}
        
        .quick-info-item i {{
            font-size: 1.5rem;
            display: block;
            margin-bottom: 0.25rem;
            color: var(--primary);
        }}
        
        .quick-info-item strong {{
            display: block;
            font-size: 0.85rem;
            color: var(--text);
        }}
        
        .quick-info-item small {{
            font-size: 0.75rem;
            color: var(--text-light);
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
            flex-wrap: wrap;
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
        
        /* CTA Section */
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
        
        /* Reviews Section */
        .reviews-section {{
            background: var(--white);
            padding: 2rem;
            border-radius: 1rem;
            margin-bottom: 2rem;
            box-shadow: var(--shadow);
        }}
        
        .review-card {{
            background: var(--bg);
            padding: 1.5rem;
            border-radius: 0.75rem;
            margin-bottom: 1rem;
            border-right: 3px solid var(--primary);
        }}
        
        .review-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
            flex-wrap: wrap;
            gap: 0.5rem;
        }}
        
        .review-author {{
            font-weight: 700;
            color: var(--text);
        }}
        
        .review-date {{
            font-size: 0.85rem;
            color: var(--text-light);
        }}
        
        .review-stars {{
            color: #fbbf24;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }}
        
        .review-text {{
            color: var(--text-light);
            line-height: 1.6;
        }}
        
        /* Add Review Form */
        .add-review-btn {{
            width: 100%;
            background: var(--primary);
            color: var(--white);
            padding: 1rem;
            border: none;
            border-radius: 0.75rem;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            margin-bottom: 1.5rem;
            transition: all 0.3s;
        }}
        
        .add-review-btn:hover {{
            background: var(--primary-dark);
            transform: translateY(-2px);
        }}
        
        .review-form {{
            display: none;
            background: #f0f9ff;
            padding: 2rem;
            border-radius: 0.75rem;
            margin-bottom: 2rem;
            border: 2px solid var(--primary);
        }}
        
        .review-form.show {{
            display: block;
        }}
        
        .form-group {{
            margin-bottom: 1.5rem;
        }}
        
        .form-group label {{
            display: block;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--text);
        }}
        
        .form-group input,
        .form-group textarea {{
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--border);
            border-radius: 0.5rem;
            font-family: 'Tajawal', sans-serif;
            font-size: 1rem;
        }}
        
        .form-group textarea {{
            min-height: 120px;
            resize: vertical;
        }}
        
        .rating-input {{
            display: flex;
            gap: 0.5rem;
            flex-direction: row-reverse;
            justify-content: flex-end;
        }}
        
        .rating-input input[type="radio"] {{
            display: none;
        }}
        
        .rating-input label {{
            cursor: pointer;
            font-size: 2rem;
            color: #d1d5db;
            transition: color 0.2s;
        }}
        
        .rating-input input[type="radio"]:checked ~ label,
        .rating-input label:hover,
        .rating-input label:hover ~ label {{
            color: #fbbf24;
        }}
        
        .submit-review-btn {{
            width: 100%;
            background: var(--success);
            color: var(--white);
            padding: 1rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
        }}
        
        .submit-review-btn:hover {{
            background: #059669;
            transform: translateY(-2px);
        }}
        
        .thank-you-message {{
            display: none;
            background: #d1fae5;
            color: var(--success);
            padding: 2rem;
            border-radius: 0.75rem;
            text-align: center;
            margin-bottom: 2rem;
            border: 2px solid var(--success);
        }}
        
        .thank-you-message.show {{
            display: block;
        }}
        
        .thank-you-message i {{
            font-size: 3rem;
            display: block;
            margin-bottom: 1rem;
        }}
        
        /* Floating Buttons */
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
        {aggregate_rating_schema}
        {reviews_schema}
        "category": "{category}"
    }}
    </script>
</head>
<body>
    <!-- Banner تحت الهيدر مباشرة -->
    <div class="banner-container">
        <img src="../banner.jpg" alt="سوق الكويت - عروض حصرية">
    </div>
    
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
                    
                    <!-- Quick Info تحت الصورة - بدون "منتج أصلي" -->
                    <div class="quick-info">
                        <div class="quick-info-item">
                            <i class="fas fa-shipping-fast"></i>
                            <strong>شحن مجاني</strong>
                            <small>لجميع مناطق الكويت</small>
                        </div>
                        <div class="quick-info-item">
                            <i class="fas fa-undo-alt"></i>
                            <strong>إرجاع مجاني</strong>
                            <small>خلال 14 يوم</small>
                        </div>
                        <div class="quick-info-item">
                            <i class="fas fa-headset"></i>
                            <strong>دعم 24/7</strong>
                            <small>رد فوري على واتساب</small>
                        </div>
                    </div>
                </div>
                
                <!-- Info -->
                <div class="product-info">
                    <span class="category-tag">{category}</span>
                    <h1 class="product-title">{name}</h1>
                    
                    <!-- Rating -->
                    <div class="rating">
                        <div class="stars">{rating_stars}</div>
                        <span class="rating-value">{rating_display}</span>
                    </div>
                    
                    <!-- Price -->
                    <div class="price-box">
                        <div class="price-row">
                            <div class="current-price">{price} {currency}</div>
                            {f'<div class="old-price">{old_price} {currency}</div>' if old_price and float(old_price) > float(price) else ''}
                        </div>
                        {f'<div class="savings">🎉 وفّر {savings} {currency} ({discount_percent})</div>' if savings else ''}
                    </div>
                    
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
        
        <!-- Reviews Section -->
        <div class="reviews-section">
            <h2 class="section-title">
                <i class="fas fa-star"></i>
                تقييمات العملاء
            </h2>
            
            <button class="add-review-btn" onclick="toggleReviewForm()">
                <i class="fas fa-plus"></i> إضافة تقييم
            </button>
            
            <div class="thank-you-message" id="thankYouMessage">
                <i class="fas fa-check-circle"></i>
                <h3>شكراً لك!</h3>
                <p>تلقينا تقييمك وسيتم نشره بعد المراجعة</p>
            </div>
            
            <div class="review-form" id="reviewForm">
                <h3 style="margin-bottom: 1.5rem;">اترك تقييمك</h3>
                <form onsubmit="submitReview(event)">
                    <div class="form-group">
                        <label>التقييم</label>
                        <div class="rating-input">
                            <input type="radio" name="rating" value="5" id="star5" required>
                            <label for="star5">★</label>
                            <input type="radio" name="rating" value="4" id="star4">
                            <label for="star4">★</label>
                            <input type="radio" name="rating" value="3" id="star3">
                            <label for="star3">★</label>
                            <input type="radio" name="rating" value="2" id="star2">
                            <label for="star2">★</label>
                            <input type="radio" name="rating" value="1" id="star1">
                            <label for="star1">★</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>الاسم</label>
                        <input type="text" name="name" required placeholder="اسمك">
                    </div>
                    <div class="form-group">
                        <label>التعليق</label>
                        <textarea name="comment" required placeholder="اكتب تقييمك هنا..."></textarea>
                    </div>
                    <button type="submit" class="submit-review-btn">
                        <i class="fas fa-paper-plane"></i> إرسال التقييم
                    </button>
                </form>
            </div>
            
            <div class="reviews-list">
                {reviews_html}
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
        const productData = {{
            id: '{product_id}',
            title: '{name}',
            price: '{price}',
            image: '{image}',
            link: '{filename}',
            quantity: 1
        }};
        
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
        
        function toggleReviewForm() {{
            const form = document.getElementById('reviewForm');
            form.classList.toggle('show');
        }}
        
        function submitReview(event) {{
            event.preventDefault();
            
            const form = event.target;
            const formData = new FormData(form);
            
            document.getElementById('reviewForm').classList.remove('show');
            document.getElementById('thankYouMessage').classList.add('show');
            
            setTimeout(() => {{
                document.getElementById('thankYouMessage').classList.remove('show');
            }}, 5000);
            
            form.reset();
            
            console.log('تم إرسال التقييم:', {{
                rating: formData.get('rating'),
                name: formData.get('name'),
                comment: formData.get('comment'),
                product_id: '{product_id}'
            }});
        }}
        
        document.addEventListener('DOMContentLoaded', updateCartBadge);
    </script>
</body>
</html>"""
    
    return html


def main():
    """معالجة جميع المنتجات"""
    
    print("🚀 بدء إعادة هيكلة صفحات المنتجات...")
    print("✨ نسخة محدثة: متوافقة مع الجوال + نظام التقييمات (من reviews-data.json)")
    
    # قراءة بيانات المنتجات
    json_file = Path('products_data.json')
    if not json_file.exists():
        print(f"❌ خطأ: ملف {json_file} غير موجود!")
        return
    
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # معالجة كلا الحالتين
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
            filename = product.get('filename', '')
            
            if not filename:
                product_id = product.get('id', idx)
                name = product.get('title', 'product')
                name_slug = name.replace(' ', '-')
                filename = f"product-{product_id}-{name_slug}.html"
            
            html_content = create_modern_product_page(product, idx)
            
            output_file = output_dir / filename
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            success_count += 1
            print(f"✅ [{idx}/{len(products)}] تم إنشاء: {filename}")
            
        except Exception as e:
            print(f"❌ خطأ في معالجة المنتج {idx}: {str(e)}")
    
    print(f"\n{'='*70}")
    print(f"✨ اكتمل العمل بنجاح!")
    print(f"📊 تم إنشاء {success_count} من {len(products)} صفحة")
    print(f"📁 الموقع: {output_dir.absolute()}")
    print(f"\n🎯 المميزات:")
    print(f"   ✅ بانر احترافي (banner.jpg) تحت الهيدر")
    print(f"   ✅ معلومات سريعة تحت الصورة (بدون 'منتج أصلي')")
    print(f"   ✅ نظام تقييمات من reviews-data.json (لا اختراع)")
    print(f"   ✅ نموذج إضافة تقييم للعملاء")
    print(f"   ✅ متوافق 100% مع الجوال")
    print(f"   ✅ Schema.org محسّن ودقيق")
    print(f"   ✅ إزالة الخط الزائد فوق الصفحة")
    print(f"{'='*70}")


if __name__ == '__main__':
    main()
