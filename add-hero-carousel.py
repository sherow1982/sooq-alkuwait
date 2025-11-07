#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
إضافة Carousel مبهر للصفحة الرئيسية مع منتجات عشوائية
"""

from pathlib import Path
import re
import random
from urllib.parse import quote

SITE_URL = "https://sooq-alkuwait.arabsad.com"
PRODUCTS_DIR = Path("products-pages")
INDEX_FILE = Path("index.html")

# جمع معلومات المنتجات
products = []
for html_file in list(PRODUCTS_DIR.glob('*.html'))[:50]:  # أول 50 منتج
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            html = f.read()
        
        title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', html)
        title = title_match.group(1).strip() if title_match else ""
        
        price_match = re.search(r'<span class="sale-price">([0-9.]+)', html)
        price = price_match.group(1) if price_match else "0"
        
        img_match = re.search(r'<meta property="og:image" content="([^"]+)"', html)
        if not img_match:
            img_match = re.search(r'<img[^>]*src="([^"]+)"', html)
        image = img_match.group(1) if img_match else ""
        
        if title and image:
            filename = quote(html_file.name)
            url = f"{SITE_URL}/products-pages/{filename}"
            products.append({'title': title, 'price': price, 'image': image, 'url': url})
    except:
        continue

# اختيار 12 منتج عشوائي
random.shuffle(products)
featured = products[:12]

# بناء HTML للـ Carousel
cards_html = ""
for p in featured:
    cards_html += f'''
        <div class="hero-product-card">
            <a href="{p['url']}" class="card-link">
                <div class="card-image">
                    <img src="{p['image']}" alt="{p['title']}" loading="lazy">
                </div>
                <div class="card-body">
                    <h3>{p['title']}</h3>
                    <div class="price">{p['price']} د.ك</div>
                </div>
            </a>
        </div>
'''

carousel_section = f'''
<!-- Hero Carousel للمنتجات المميزة -->
<section class="hero-carousel-section">
    <div class="section-header">
        <h2>✨ منتجات مميزة لك</h2>
        <p>اكتشف أفضل العروض والمنتجات الحصرية</p>
    </div>
    
    <div class="hero-carousel-container">
        <button class="carousel-nav prev" onclick="moveHeroCarousel(-1)">❮</button>
        <div class="hero-carousel-track" id="heroCarousel">
{cards_html}
        </div>
        <button class="carousel-nav next" onclick="moveHeroCarousel(1)">❯</button>
    </div>
</section>

<style>
/* Hero Carousel للصفحة الرئيسية */
.hero-carousel-section {{
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 60px 20px;
    margin: 0 0 40px 0;
}}

.section-header {{
    text-align: center;
    color: white;
    margin-bottom: 40px;
}}

.section-header h2 {{
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 10px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}}

.section-header p {{
    font-size: 1.2rem;
    opacity: 0.9;
}}

.hero-carousel-container {{
    position: relative;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 60px;
}}

.hero-carousel-track {{
    display: flex;
    gap: 25px;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 20px 5px;
    scrollbar-width: none;
}}

.hero-carousel-track::-webkit-scrollbar {{
    display: none;
}}

.hero-product-card {{
    min-width: 280px;
    max-width: 280px;
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    transition: all 0.4s ease;
}}

.hero-product-card:hover {{
    transform: translateY(-12px) scale(1.03);
    box-shadow: 0 15px 50px rgba(0,0,0,0.3);
}}

.card-link {{
    text-decoration: none;
    color: inherit;
    display: block;
}}

.card-image {{
    width: 100%;
    height: 250px;
    background: #f8f9fa;
    overflow: hidden;
}}

.card-image img {{
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}}

.hero-product-card:hover .card-image img {{
    transform: scale(1.15);
}}

.card-body {{
    padding: 20px;
}}

.card-body h3 {{
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 12px 0;
    line-height: 1.4;
    height: 2.8em;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}}

.card-body .price {{
    font-size: 1.5rem;
    font-weight: 700;
    color: #27ae60;
}}

.carousel-nav {{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 1.8rem;
    cursor: pointer;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
    z-index: 10;
    color: #667eea;
}}

.carousel-nav:hover {{
    background: #25D366;
    color: white;
    transform: translateY(-50%) scale(1.15);
}}

.carousel-nav.prev {{
    left: 5px;
}}

.carousel-nav.next {{
    right: 5px;
}}

/* Responsive للجوال */
@media (max-width: 768px) {{
    .hero-carousel-container {{
        padding: 0 50px;
    }}
    
    .hero-product-card {{
        min-width: 85%;
        max-width: 85%;
    }}
    
    .section-header h2 {{
        font-size: 1.8rem;
    }}
    
    .carousel-nav {{
        width: 40px;
        height: 40px;
        font-size: 1.4rem;
    }}
}}
</style>

<script>
let heroPosition = 0;

function moveHeroCarousel(direction) {{
    const track = document.getElementById('heroCarousel');
    const cardWidth = 305; // 280 + 25 gap
    const trackWidth = track.scrollWidth;
    const containerWidth = track.offsetWidth;
    
    heroPosition += direction * cardWidth;
    
    if (heroPosition < 0) heroPosition = 0;
    if (heroPosition > trackWidth - containerWidth) heroPosition = trackWidth - containerWidth;
    
    track.scrollLeft = heroPosition;
}}

// تمرير تلقائي كل 4 ثواني
setInterval(() => {{
    const track = document.getElementById('heroCarousel');
    const trackWidth = track.scrollWidth;
    const containerWidth = track.offsetWidth;
    
    heroPosition += 305;
    if (heroPosition >= trackWidth - containerWidth) heroPosition = 0;
    
    track.scrollLeft = heroPosition;
}}, 4000);
</script>
'''

# تحديث index.html
if INDEX_FILE.exists():
    try:
        with open(INDEX_FILE, 'r', encoding='utf-8') as f:
            html = f.read()
        
        # إزالة carousel قديم إن وجد
        html = re.sub(
            r'<!-- Hero Carousel.*?</script>',
            '',
            html,
            flags=re.DOTALL
        )
        
        # إضافة الـ Carousel بعد header/navbar أو في بداية main
        if '<main' in html:
            html = re.sub(r'(<main[^>]*>)', rf'\1\n{carousel_section}', html, count=1)
        elif '<body' in html:
            html = re.sub(r'(<body[^>]*>.*?</nav>)', rf'\1\n{carousel_section}', html, flags=re.DOTALL, count=1)
        else:
            html = html.replace('<body>', f'<body>\n{carousel_section}')
        
        with open(INDEX_FILE, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print("✅ تم إضافة Hero Carousel للصفحة الرئيسية!")
        print(f"   📦 {len(featured)} منتج مميز")
        print(f"   🎨 تصميم gradient مبهر")
        print(f"   ⏱️ تمرير تلقائي كل 4 ثواني\n")
    
    except Exception as e:
        print(f"⚠️ خطأ في index.html: {e}")
else:
    print("⚠️ index.html غير موجود!")
