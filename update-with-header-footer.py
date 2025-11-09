import json
from pathlib import Path

with open('products_data.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

html = '''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5">
<title>Loading | سوق الكويت</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="../site-components.css">
<style>body{font-family:Tajawal,sans-serif;background:linear-gradient(135deg,#f5f7fa,#e3edf7);padding-top:140px}.container{max-width:1400px;margin:0 auto;padding:0 1rem}.product-container{background:#fff;border-radius:1.5rem;padding:2rem;margin:2rem 0;box-shadow:0 20px 25px -5px rgba(0,0,0,.1)}.product-grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem}.main-image{width:100%;max-height:600px;object-fit:contain;border-radius:1rem}.product-title{font-size:2rem;font-weight:900;margin:1rem 0}.current-price{font-size:3rem;font-weight:900;color:#667eea}.whatsapp-btn{width:100%;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;padding:2rem;border:0;border-radius:1rem;font-size:1.5rem;font-weight:900;text-decoration:none;display:block;text-align:center;margin:2rem 0}.whatsapp-btn:hover{color:#fff}@media(max-width:768px){.product-grid{grid-template-columns:1fr}}</style>
</head>
<body>
<div id="site-header"></div>
<div class="container">
<div class="product-container">
<div class="product-grid">
<div><img class="main-image" src="" id="main-product-image" alt="منتج"></div>
<div>
<h1 class="product-title" id="product-title">جاري التحميل...</h1>
<div class="current-price" id="current-price">0.00 د.ك</div>
<div id="old-price" style="display:none"></div>
<a href="#" class="whatsapp-btn" id="whatsapp-btn">🛒 اطلب عبر واتساب</a>
</div>
</div>
</div>
</div>
<div id="site-footer"></div>
<script src="../site-header.js"></script>
<script src="../site-footer.js"></script>
<script src="product-loader.js"></script>
</body>
</html>'''

products_dir = Path('products-pages')
for i, p in enumerate(products, 1):
    (products_dir / p['filename']).write_text(html, encoding='utf-8')
    if i % 100 == 0: print(f'{i} صفحة')
print(f'✅ {len(products)} صفحة')
