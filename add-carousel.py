#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
إضافة قسم منتجات مقترحة احترافي مع Carousel تلقائي
Add Professional Suggested Products Carousel with Auto-Scroll
"""

from pathlib import Path
import re
import random
from urllib.parse import quote

class SuggestedProductsCarousel:
    def __init__(self):
        self.site_url = "https://sooq-alkuwait.arabsad.com"
        self.products_dir = Path("products-pages")
        self.max_suggestions = 8  # عدد المنتجات المقترحة
        self.fixed_count = 0
        
    def extract_product_info(self, html_file):
        """استخراج معلومات المنتج"""
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                html = f.read()
            
            # استخراج العنوان
            title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', html)
            title = title_match.group(1).strip() if title_match else html_file.stem
            
            # استخراج السعر
            price_match = re.search(r'<span class="sale-price">([0-9.]+)\s*د\.ك</span>', html)
            price = price_match.group(1) if price_match else "0.00"
            
            # استخراج الصورة
            img_match = re.search(r'<img[^>]*src="([^"]+)"[^>]*class="[^"]*product-image[^"]*"', html)
            if not img_match:
                img_match = re.search(r'<meta property="og:image" content="([^"]+)"', html)
            image = img_match.group(1) if img_match else ""
            
            filename = quote(html_file.name)
            url = f"{self.site_url}/products-pages/{filename}"
            
            return {
                'title': title,
                'price': price,
                'image': image,
                'url': url,
                'file': html_file
            }
        except:
            return None
    
    def create_carousel_html(self, products):
        """إنشاء HTML للـ Carousel"""
        
        # بناء بطاقات المنتجات
        cards_html = ""
        for product in products:
            cards_html += f'''
        <div class="product-card">
            <a href="{product['url']}" class="product-card-link">
                <div class="product-image-container">
                    <img src="{product['image']}" alt="{product['title']}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-title">{product['title']}</h3>
                    <div class="product-price">{product['price']} د.ك</div>
                </div>
            </a>
        </div>
'''
        
        carousel_html = f'''
<!-- قسم المنتجات المقترحة -->
<section class="suggested-products-section">
    <div class="section-header">
        <h2>🌟 منتجات قد تعجبك</h2>
        <p>اكتشف المزيد من المنتجات المميزة</p>
    </div>
    
    <div class="carousel-container">
        <button class="carousel-btn prev-btn" onclick="moveCarousel(-1)">❮</button>
        <div class="carousel-track" id="carouselTrack">
{cards_html}
        </div>
        <button class="carousel-btn next-btn" onclick="moveCarousel(1)">❯</button>
    </div>
</section>

<style>
/* قسم المنتجات المقترحة */
.suggested-products-section {{
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 50px 20px;
    margin: 40px 0 0 0;
    border-radius: 20px 20px 0 0;
}}

.section-header {{
    text-align: center;
    margin-bottom: 35px;
}}

.section-header h2 {{
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 10px;
}}

.section-header p {{
    color: #7f8c8d;
    font-size: 1.1rem;
}}

/* Carousel Container */
.carousel-container {{
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 50px;
}}

.carousel-track {{
    display: flex;
    gap: 20px;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 10px 5px;
    scrollbar-width: none;
    -ms-overflow-style: none;
}}

.carousel-track::-webkit-scrollbar {{
    display: none;
}}

/* بطاقة المنتج */
.product-card {{
    min-width: 250px;
    max-width: 250px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    overflow: hidden;
}}

.product-card:hover {{
    transform: translateY(-8px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}}

.product-card-link {{
    text-decoration: none;
    color: inherit;
    display: block;
}}

.product-image-container {{
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: #f8f9fa;
}}

.product-image-container img {{
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}}

.product-card:hover .product-image-container img {{
    transform: scale(1.1);
}}

.product-info {{
    padding: 15px;
}}

.product-title {{
    font-size: 1rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 10px 0;
    line-height: 1.4;
    height: 2.8em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}}

.product-price {{
    font-size: 1.3rem;
    font-weight: 700;
    color: #27ae60;
    margin: 0;
}}

/* أزرار التنقل */
.carousel-btn {{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    border: none;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    z-index: 10;
    color: #2c3e50;
}}

.carousel-btn:hover {{
    background: #25D366;
    color: white;
    transform: translateY(-50%) scale(1.1);
}}

.prev-btn {{
    left: 0;
}}

.next-btn {{
    right: 0;
}}

/* Responsive */
@media (max-width: 768px) {{
    .carousel-container {{
        padding: 0 40px;
    }}
    
    .product-card {{
        min-width: 200px;
        max-width: 200px;
    }}
    
    .product-image-container {{
        height: 160px;
    }}
    
    .carousel-btn {{
        width: 35px;
        height: 35px;
        font-size: 1.2rem;
    }}
    
    .section-header h2 {{
        font-size: 1.5rem;
    }}
}}
</style>

<script>
// التمرير التلقائي كل 3 ثواني
let autoScrollInterval;
let currentPosition = 0;
const track = document.getElementById('carouselTrack');

function moveCarousel(direction) {{
    const cardWidth = 270; // 250px + 20px gap
    const trackWidth = track.scrollWidth;
    const containerWidth = track.offsetWidth;
    
    currentPosition += direction * cardWidth;
    
    // التحقق من الحدود
    if (currentPosition < 0) {{
        currentPosition = 0;
    }} else if (currentPosition > trackWidth - containerWidth) {{
        currentPosition = trackWidth - containerWidth;
    }}
    
    track.scrollLeft = currentPosition;
    
    // إعادة تشغيل التمرير التلقائي
    resetAutoScroll();
}}

function autoScroll() {{
    const cardWidth = 270;
    const trackWidth = track.scrollWidth;
    const containerWidth = track.offsetWidth;
    
    currentPosition += cardWidth;
    
    // العودة للبداية عند الوصول للنهاية
    if (currentPosition >= trackWidth - containerWidth) {{
        currentPosition = 0;
    }}
    
    track.scrollLeft = currentPosition;
}}

function resetAutoScroll() {{
    clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(autoScroll, 3000);
}}

// بدء التمرير التلقائي
autoScrollInterval = setInterval(autoScroll, 3000);

// إيقاف التمرير عند التفاعل اليدوي
track.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
track.addEventListener('mouseleave', resetAutoScroll);
</script>
'''
        
        return carousel_html
    
    def add_carousel_to_page(self, html_file, all_products):
        """إضافة الـ Carousel لصفحة المنتج"""
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                html = f.read()
            
            original_html = html
            
            # إزالة أي carousel قديم
            html = re.sub(
                r'<!-- قسم المنتجات المقترحة -->.*?</script>',
                '',
                html,
                flags=re.DOTALL
            )
            
            # اختيار منتجات عشوائية (ما عدا المنتج الحالي)
            current_file = html_file.name
            suggestions = [p for p in all_products if p['file'].name != current_file]
            random.shuffle(suggestions)
            suggestions = suggestions[:self.max_suggestions]
            
            if not suggestions:
                return False
            
            # إنشاء HTML للـ Carousel
            carousel_html = self.create_carousel_html(suggestions)
            
            # إضافة الـ Carousel قبل Footer أو قبل نهاية body
            if '<footer' in html:
                html = re.sub(
                    r'(<footer)',
                    f'{carousel_html}\\1',
                    html,
                    count=1
                )
            else:
                html = html.replace('</body>', f'{carousel_html}</body>')
            
            # حفظ التغييرات
            if html != original_html:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(html)
                self.fixed_count += 1
                return True
            
            return False
            
        except Exception as e:
            print(f"⚠️ خطأ في {html_file.name}: {e}")
            return False
    
    def run(self):
        """تشغيل إضافة الـ Carousels"""
        print("\n" + "="*60)
        print("🎨 إضافة قسم المنتجات المقترحة الاحترافي")
        print("="*60 + "\n")
        
        # جمع معلومات جميع المنتجات
        print("📦 جاري جمع معلومات المنتجات...")
        all_products = []
        for html_file in self.products_dir.glob('*.html'):
            product_info = self.extract_product_info(html_file)
            if product_info:
                all_products.append(product_info)
        
        print(f"✅ تم جمع {len(all_products)} منتج\n")
        
        # إضافة Carousel لكل صفحة
        print("🎠 جاري إضافة Carousel للصفحات...")
        for idx, product in enumerate(all_products, 1):
            self.add_carousel_to_page(product['file'], all_products)
            
            if idx % 100 == 0:
                print(f"⏳ تمت معالجة {idx}/{len(all_products)} صفحة...")
        
        print("\n" + "="*60)
        print("✅ اكتمل إضافة المنتجات المقترحة!")
        print("="*60)
        print(f"\n📊 الإحصائيات:")
        print(f"  ✅ تم التحديث: {self.fixed_count} صفحة")
        print(f"  📦 الإجمالي: {len(all_products)} منتج")
        
        print(f"\n🎯 المميزات:")
        print(f"  ✅ بطاقات منتجات احترافية")
        print(f"  ✅ تمرير تلقائي كل 3 ثواني")
        print(f"  ✅ تصميم Responsive")
        print(f"  ✅ تأثيرات Hover جميلة")
        print(f"  ✅ أزرار تنقل يدوية")
        print(f"  ✅ {self.max_suggestions} منتجات مقترحة لكل صفحة\n")

if __name__ == '__main__':
    carousel = SuggestedProductsCarousel()
    carousel.run()
