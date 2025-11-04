// Router عربي لمعالجة الروابط العربية الجميلة
class ArabicRouter {
    constructor() {
        this.products = [];
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.handleRoute();
        window.addEventListener('popstate', () => this.handleRoute());
    }

    async loadProducts() {
        try {
            const response = await fetch('/products.json');
            this.products = await response.json();
            console.log(`Router: تم تحميل ${this.products.length} منتج`);
        } catch (error) {
            console.error('خطأ في تحميل المنتجات للروتر:', error);
        }
    }

    handleRoute() {
        const path = window.location.pathname;
        const params = new URLSearchParams(window.location.search);
        const pathFromQuery = params.get('path');
        
        // استخدام path من query إذا كان موجود، وإلا استخدام pathname الحالي
        const targetPath = pathFromQuery || path;
        
        // إذا كان المسار الرئيسي، لا نفعل شيء
        if (targetPath === '/' || targetPath === '/index.html') {
            return;
        }
        
        // البحث عن المنتج بالرابط العربي
        const product = this.products.find(p => p.seo_url === targetPath);
        
        if (product) {
            this.displayProduct(product);
        } else {
            this.display404();
        }
    }

    displayProduct(product) {
        const discount = Math.round(((product.price - product.sale_price) / product.price) * 100);
        
        document.title = `${product.title} - سوق الكويت`;
        
        const productHTML = `
            <div class="container" style="margin-top: 100px; padding: 2rem 0;">
                <div class="product-detail" style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start;">
                    <div class="product-detail-image">
                        <img src="${product.image}" alt="${product.title}" style="width: 100%; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div style="display: none; height: 300px; background: #f0f0f0; border-radius: 15px; align-items: center; justify-content: center; color: #666;">الصورة غير متاحة</div>
                    </div>
                    <div class="product-detail-info">
                        <h1 style="font-size: 1.8rem; margin-bottom: 1rem; color: var(--kuwait-black);">${product.title}</h1>
                        <div class="product-price" style="margin: 2rem 0;">
                            <span class="current-price" style="font-size: 2rem; font-weight: 900; color: var(--kuwait-green);">${product.sale_price} د.ك</span>
                            <span class="original-price" style="font-size: 1.2rem; color: #999; text-decoration: line-through; margin-right: 1rem;">${product.price} د.ك</span>
                            <span class="discount" style="background: var(--kuwait-red); color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-weight: 700;">وفّر ${discount}%</span>
                        </div>
                        <div class="product-description" style="margin: 2rem 0; line-height: 1.8; white-space: pre-line;">${product.description}</div>
                        <div class="product-actions" style="display: flex; gap: 1rem; margin: 2rem 0;">
                            <button onclick="addToCartAndGo(${product.id})" style="flex: 1; background: var(--kuwait-green); color: white; border: none; padding: 1rem 2rem; border-radius: 15px; font-weight: 700; font-size: 1.1rem; cursor: pointer;">
                                <i class="fas fa-shopping-cart"></i> أضف للسلة واطلب
                            </button>
                            <button onclick="contactWhatsApp(${product.id})" style="flex: 1; background: #25D366; color: white; border: none; padding: 1rem 2rem; border-radius: 15px; font-weight: 700; font-size: 1.1rem; cursor: pointer;">
                                <i class="fab fa-whatsapp"></i> اسأل عبر واتساب
                            </button>
                        </div>
                        <div style="text-align: center; margin: 2rem 0;">
                            <a href="/" style="background: var(--dark-gray); color: white; padding: 0.8rem 2rem; border-radius: 10px; text-decoration: none; font-weight: 600;">
                                <i class="fas fa-arrow-right"></i> العودة للمتجر
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.innerHTML = productHTML;
        
        // إضافة الهيدر والفوتر
        this.addHeaderFooter();
    }

    display404() {
        document.title = "المنتج غير موجود - سوق الكويت";
        
        const notFoundHTML = `
            <div class="container" style="margin-top: 100px; text-align: center; padding: 4rem 0;">
                <h1 style="font-size: 3rem; color: var(--kuwait-red); margin-bottom: 1rem;">404</h1>
                <h2 style="margin-bottom: 2rem;">المنتج غير موجود</h2>
                <p style="margin-bottom: 2rem; color: #666;">عذراً، المنتج المطلوب غير متاح حالياً</p>
                <a href="/" style="background: var(--kuwait-green); color: white; padding: 1rem 2rem; border-radius: 25px; text-decoration: none; font-weight: 700;">
                    <i class="fas fa-home"></i> العودة للرئيسية
                </a>
            </div>
        `;
        
        document.body.innerHTML = notFoundHTML;
        this.addHeaderFooter();
    }

    addHeaderFooter() {
        // إضافة هيدر مبسط
        const header = `
            <header class="header">
                <div class="container">
                    <div class="nav-wrapper">
                        <div class="logo">
                            <h1><a href="/" style="color: var(--luxury-gold); text-decoration: none;">🛍️ سوق الكويت</a></h1>
                        </div>
                        <nav class="nav">
                            <ul>
                                <li><a href="/">الرئيسية</a></li>
                                <li><a href="/#products">المنتجات</a></li>
                                <li><a href="/cart.html">سلة التسوق</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', header);
    }
}

// تشغيل Router عند تحميل الصفحة
if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
    new ArabicRouter();
}