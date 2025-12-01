#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
بوت تويتر تلقائي لنشر منتجات سوق الكويت
"""

import os
import json
import random
import sys
import re
from io import BytesIO
import tweepy
import requests
from PIL import Image


POSTED_PRODUCTS_FILE = '.github/data/posted_products.json'


def load_products():
    """ تحميل قائمة المنتجات """
    try:
        with open('products_data.json', 'r', encoding='utf-8') as f:
            products = json.load(f)
        return products
    except Exception as e:
        print(f"خطأ في تحميل المنتجات: {e}")
        sys.exit(1)


def load_posted_products():
    """ تحميل قائمة المنتجات المنشورة """
    try:
        if os.path.exists(POSTED_PRODUCTS_FILE):
            with open(POSTED_PRODUCTS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('posted_ids', [])
        return []
    except Exception as e:
        print(f"تحذير: خطأ في تحميل قائمة المنشورة: {e}")
        return []


def save_posted_products(posted_ids):
    """ حفظ قائمة المنتجات المنشورة """
    try:
        os.makedirs(os.path.dirname(POSTED_PRODUCTS_FILE), exist_ok=True)
        with open(POSTED_PRODUCTS_FILE, 'w', encoding='utf-8') as f:
            json.dump({'posted_ids': posted_ids}, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"تحذير: خطأ في حفظ قائمة المنشورة: {e}")


def get_next_product(products, posted_ids):
    """ اختيار المنتج التالي (غير منشور) """
    # استخراج IDs كل المنتجات
    all_product_ids = [p.get('id') for p in products if p.get('id')]
    
    # المنتجات الغير منشورة
    unposted_ids = [pid for pid in all_product_ids if pid not in posted_ids]
    
    # لو كل المنتجات اتنشرت، نعيد الدورة
    if not unposted_ids:
        print("\n🔄 تم نشر كل المنتجات! إعادة الدورة من البداية...")
        posted_ids.clear()
        unposted_ids = all_product_ids
    
    # اختيار منتج عشوائي من الغير منشورة
    selected_id = random.choice(unposted_ids)
    selected_product = next(p for p in products if p.get('id') == selected_id)
    
    # إضافة للمنشورة
    posted_ids.append(selected_id)
    
    print(f"\n📊 الإحصائيات:")
    print(f"   - إجمالي المنتجات: {len(all_product_ids)}")
    print(f"   - تم نشرها: {len(posted_ids)}")
    print(f"   - المتبقية: {len(all_product_ids) - len(posted_ids)}")
    
    return selected_product, posted_ids


def download_image(url):
    """ تحميل صورة من رابط """
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content))
        
        # تحسين جودة الصورة لتويتر
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # تصغير للحد الأقصى 5MB
        output = BytesIO()
        img.save(output, format='JPEG', quality=85, optimize=True)
        output.seek(0)
        return output
    except Exception as e:
        print(f"خطأ في تحميل الصورة: {e}")
        return None


def create_product_hashtag(title):
    """ إنشاء هاشتاج من اسم المنتج """
    # تنظيف العنوان من الرموز والأرقام
    clean_title = re.sub(r'[^\w\s\u0600-\u06FF]', '', title)
    # أخذ أول 3-4 كلمات
    words = clean_title.split()[:4]
    # دمج بـ underscore
    hashtag = '_'.join(words)
    return f"#{hashtag}"


def create_tweet_text(product):
    """ إنشاء نص التغريدة """
    title = product.get('title', '')
    price = product.get('sale_price', product.get('price', 0))
    old_price = product.get('price', 0)
    link = f"https://sooq-alkuwait.arabsad.com/{product.get('product_link', '')}"
    whatsapp = "https://wa.me/201110760081"
    
    # حساب نسبة التخفيض
    discount = 0
    if price < old_price and old_price > 0:
        discount = int(((old_price - price) / old_price) * 100)
    
    # هاشتاج المنتج
    product_hashtag = create_product_hashtag(title)
    
    # محافظات الكويت
    governorates = "#الكويت #حولي #الفروانية #الجهراء #الأحمدي #مبارك_الكبير"
    
    # نص التغريدة
    tweet = f"🔥 {title}\n\n"
    
    if discount > 0:
        tweet += f"⚡ خصم {discount}%\n"
        tweet += f"❌ السعر القديم: {old_price} KWD\n"
    
    tweet += f"✅ السعر الآن: {price} KWD\n\n"
    tweet += f"📱 واتساب: {whatsapp}\n"
    tweet += f"🛍️ اطلب الآن: {link}\n\n"
    tweet += f"{product_hashtag}\n"
    tweet += f"#سوق_الكويت #عروض_اليوم #تسوق_اونلاين\n"
    tweet += governorates
    
    # التأكد من طول التغريدة (280 حرف)
    if len(tweet) > 280:
        # نسخة مختصرة
        max_title_len = 40
        short_title = title[:max_title_len] + '...' if len(title) > max_title_len else title
        
        tweet = f"🔥 {short_title}\n\n"
        if discount > 0:
            tweet += f"⚡ خصم {discount}%\n"
        tweet += f"✅ {price} KWD\n\n"
        tweet += f"📱 {whatsapp}\n"
        tweet += f"🛍️ {link}\n\n"
        tweet += f"{product_hashtag} #سوق_الكويت\n"
        tweet += "#الكويت #حولي #الفروانية"
    
    return tweet


def post_to_twitter(product):
    """ نشر منتج على تويتر """
    try:
        # Twitter API Credentials
        api_key = os.getenv('TWITTER_API_KEY')
        api_secret = os.getenv('TWITTER_API_SECRET')
        access_token = os.getenv('TWITTER_ACCESS_TOKEN')
        access_secret = os.getenv('TWITTER_ACCESS_SECRET')
        
        if not all([api_key, api_secret, access_token, access_secret]):
            print("خطأ: مفاتيح Twitter API غير موجودة!")
            sys.exit(1)
        
        # إنشاء Tweepy Client
        client = tweepy.Client(
            consumer_key=api_key,
            consumer_secret=api_secret,
            access_token=access_token,
            access_token_secret=access_secret
        )
        
        # للرفع الصور نحتاج API v1.1
        auth = tweepy.OAuth1UserHandler(
            api_key, api_secret, access_token, access_secret
        )
        api = tweepy.API(auth)
        
        # تحميل الصورة
        image_url = product.get('image_link')
        media_id = None
        
        if image_url:
            print(f"تحميل الصورة من: {image_url}")
            image_data = download_image(image_url)
            if image_data:
                media = api.media_upload(filename="product.jpg", file=image_data)
                media_id = media.media_id
                print("تم رفع الصورة بنجاح!")
        
        # إنشاء نص التغريدة
        tweet_text = create_tweet_text(product)
        print(f"\nنص التغريدة:\n{tweet_text}\n")
        print(f"طول التغريدة: {len(tweet_text)} حرف\n")
        
        # نشر التغريدة
        response = client.create_tweet(
            text=tweet_text,
            media_ids=[media_id] if media_id else None
        )
        
        tweet_id = response.data['id']
        tweet_url = f"https://twitter.com/user/status/{tweet_id}"
        
        print(f"\n✅ تم النشر بنجاح!")
        print(f"🔗 رابط التغريدة: {tweet_url}")
        
    except tweepy.TweepyException as e:
        print(f"خطأ Tweepy: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"خطأ غير متوقع: {e}")
        sys.exit(1)


def main():
    """ الدالة الرئيسية """
    print("🤖 بدء بوت تويتر سوق الكويت...\n")
    
    # تحميل المنتجات
    products = load_products()
    print(f"✅ تم تحميل {len(products)} منتج")
    
    # تحميل قائمة المنشورة
    posted_ids = load_posted_products()
    print(f"📝 المنتجات المنشورة سابقاً: {len(posted_ids)}")
    
    # اختيار منتج غير منشور
    product, posted_ids = get_next_product(products, posted_ids)
    print(f"\n🎯 منتج مختار: {product.get('title')}")
    print(f"   ID: {product.get('id')}")
    
    # نشر على تويتر
    post_to_twitter(product)
    
    # حفظ القائمة المحدثة
    save_posted_products(posted_ids)
    print("\n💾 تم حفظ حالة البوت")
    
    print("\n✅ اكتمل البوت بنجاح!")


if __name__ == '__main__':
    main()
