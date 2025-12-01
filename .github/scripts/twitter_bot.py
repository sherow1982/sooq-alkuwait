#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
بوت تويتر تلقائي لنشر منتجات سوق الكويت
"""

import os
import json
import random
import sys
from io import BytesIO
import tweepy
import requests
from PIL import Image


def load_products():
    """ تحميل قائمة المنتجات """
    try:
        with open('products_data.json', 'r', encoding='utf-8') as f:
            products = json.load(f)
        return products
    except Exception as e:
        print(f"خطأ في تحميل المنتجات: {e}")
        sys.exit(1)


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


def create_tweet_text(product):
    """ إنشاء نص التغريدة """
    title = product.get('title', '')
    price = product.get('sale_price', product.get('price', 0))
    old_price = product.get('price', 0)
    link = f"https://sooqalkuwait.com/{product.get('product_link', '')}"
    
    # حساب نسبة التخفيض
    discount = 0
    if price < old_price and old_price > 0:
        discount = int(((old_price - price) / old_price) * 100)
    
    # نص جذاب
    tweet = f"🔥 {title}\n\n"
    
    if discount > 0:
        tweet += f"⚡ خصم {discount}%\n"
        tweet += f"❌ السعر القديم: {old_price} KWD\n"
    
    tweet += f"✅ السعر الآن: {price} KWD\n\n"
    tweet += f"🛍️ اطلب الآن: {link}\n\n"
    tweet += "#سوق_الكويت #عروض_اليوم #تسوق_اونلاين #الكويت"
    
    # التأكد من طول التغريدة (280 حرف)
    if len(tweet) > 280:
        # قص العنوان
        max_title_len = 50
        if len(title) > max_title_len:
            title = title[:max_title_len] + '...'
        tweet = f"🔥 {title}\n\n"
        if discount > 0:
            tweet += f"⚡ خصم {discount}%\n"
        tweet += f"✅ {price} KWD\n\n"
        tweet += f"🛍️ {link}\n\n"
        tweet += "#سوق_الكويت #عروض"
    
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
    
    # اختيار منتج عشوائي
    product = random.choice(products)
    print(f"\n🎯 منتج مختار: {product.get('title')}")
    
    # نشر على تويتر
    post_to_twitter(product)
    
    print("\n✅ اكتمل البوت بنجاح!")


if __name__ == '__main__':
    main()
