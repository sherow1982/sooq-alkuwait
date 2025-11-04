// Global variables
let products = [];
let filteredProducts = [];
let cart = [];
let currentPage = 1;
const productsPerPage = 12;
const WHATSAPP_NUMBER = "201110760081";

// Advanced Arabic Router - يحل مشكلة عرض المنتجات
class SmartArabicRouter {
    constructor() {
        this.products = [];
        this.initRouter();
    }

    async initRouter() {
        await this.loadProducts();
        const currentPath = this.getCurrentPath();
        
        if (this.isProductPath(currentPath)) {
            console.log('🔍 البحث عن منتج للرابط:', currentPath);
            const product = this.findProductByPath(currentPath);
            
            if (product) {
                console.log('✅ تم العثور على المنتج:', product.title);
                this.renderProductPage(product);
            } else {
                console.log('❌ لم يتم العثور على المنتج');
                this.renderNotFound();
            }
        }
    }

    async loadProducts() {
        try {
            // مصدر واحد مبسّط لتجنب 404
            const res = await fetch('/products-comprehensive.json?v=' + Date.now(), { cache: 'no-store' });
            const data = await res.json();
            this.products = Array.isArray(data) ? data : [];
            console.log(`📦 تم تحميل ${this.products.length} منتج للراوتر من الملف الشامل`);
        } catch (error) {
            console.error('❌ خطأ تحميل المنتجات:', error);
            this.products = [];
        }
    }

    getCurrentPath() {
        const params = new URLSearchParams(window.location.search);
        return params.get('path') || window.location.pathname;
    }

    isProductPath(path) {
        const productPaths = ['/اطفال/', '/مطبخ/', '/ملابس/', '/الكترونيات/', '/تجميل/', '/منتجات/'];
        return productPaths.some(p => path.startsWith(p));
    }

    findProductByPath(targetPath) {
        let product = this.products.find(p => p.seo_url === targetPath);
        if (!product) {
            product = this.products.find(p => targetPath.startsWith(p.seo_url) || p.seo_url.startsWith(targetPath));
        }
        if (!product) {
            const idMatch = targetPath.match(/\d+/);
            if (idMatch) {
                const id = parseInt(idMatch[0]);
                product = this.products.find(p => p.id === id);
            }
        }
        return product;
    }

    renderProductPage(product) {
        const discount = Math.round(((product.price - product.sale_price) / product.price) * 100);
        document.title = `${product.title} - سوق الكويت`;
        const productHTML = `
            <div class="container" style="margin-top: 120px; padding: 2rem 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start;">
                    <div class="product-image-detail">
                        <img src="${product.image}" alt="${product.title}" 
                             style="width: 100%; border-radius: 20px; box-shadow: 0 15px 40px rgba(0,0,0,0.15);"
                             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQ2Fpcm8sQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7Yp9mE2LXZiNix2Kkg2LrZitixINmF2KrYp9it2Kk8L3RleHQ+PC9zdmc+'">
                    </div>
                    <div class="product-info-detail">
                        <div style="background: var(--soft-gray); padding: 1.5rem; border-radius: 15px; margin-bottom: 1rem;">
                            <span style="background: var(--kuwait-green); color: white; padding: 0.3rem 1rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">${product.category}</span>
                        </div>
                        
                        <h1 style="font-size: 1.8rem; margin-bottom: 1.5rem; color: var(--kuwait-black); line-height: 1.3;">${product.title}</h1>
                        
                        <div style="background: linear-gradient(135deg, var(--kuwait-green), #00a651); color: white; padding: 2rem; border-radius: 20px; margin: 2rem 0; text-align: center;">
                            <div style="font-size: 2.5rem; font-weight: 900; margin-bottom: 0.5rem;">${product.sale_price} د.ك</div>
                            ${product.price > product.sale_price ? `
                                <div style="opacity: 0.9; font-size: 1.2rem;">
                                    <span style="text-decoration: line-through;">${product.price} د.ك</span>
                                    <span style="background: var(--kuwait-red); padding: 0.2rem 0.8rem; border-radius: 10px; margin-right: 1rem; font-weight: 700;">وفّر ${discount}%</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div style="background: white; padding: 2rem; border-radius: 15px; margin: 2rem 0; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                            <div style="line-height: 1.8; white-space: pre-line; color: var(--dark-gray);">${product.description || ''}</div>
                        </div>
                        
                        <div style="display: flex; gap: 1rem; margin: 2rem 0;">
                            <button onclick="addToCartProduct(${product.id})" 
                                    style="flex: 1; background: linear-gradient(135deg, var(--kuwait-green), #008a44); color: white; border: none; padding: 1.2rem 2rem; border-radius: 15px; font-weight: 700; font-size: 1.2rem; cursor: pointer; box-shadow: 0 6px 20px rgba(0,166,81,0.3);">
                                <i class="fas fa-shopping-cart"></i> أضف للسلة واطلب الآن
                            </button>
                            <button onclick="contactWhatsAppProduct(${product.id})" 
                                    style="flex: 1; background: #25D366; color: white; border: none; padding: 1.2rem 2rem; border-radius: 15px; font-weight: 700; font-size: 1.2rem; cursor: pointer; box-shadow: 0 6px 20px rgba(37,211,102,0.3);">
                                <i class="fab fa-whatsapp"></i> اسأل عبر واتساب
                            </button>
                        </div>
                        
                        <div style="text-align: center; margin: 2rem 0;">
                            <a href="/" style="background: var(--dark-gray); color: white; padding: 1rem 2rem; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block;">
                                <i class="fas fa-arrow-right"></i> العودة للمتجر
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const main = document.querySelector('main') || document.querySelector('.products-section') || document.querySelector('.hero');
        if (main) {
            main.innerHTML = productHTML;
        } else {
            document.body.innerHTML = productHTML;
            this.addBasicHeader();
        }
        localStorage.setItem('currentViewedProduct', JSON.stringify(product));
    }

    renderNotFound() {
        const notFoundHTML = `
            <div class="container" style="margin-top: 120px; text-align: center; padding: 4rem 0;">
                <div style="background: white; padding: 3rem; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                    <h1 style="font-size: 4rem; color: var(--kuwait-red); margin-bottom: 1rem;">404</h1>
                    <h2 style="margin-bottom: 2rem; color: var(--kuwait-black);">المنتج غير موجود</h2>
                    <p style="margin-bottom: 3rem; color: #666; font-size: 1.1rem;">عذراً، المنتج المطلوب غير متاح حالياً أو تم نقله</p>
                    <a href="/" style="background: linear-gradient(135deg, var(--kuwait-green), #008a44); color: white; padding: 1.2rem 3rem; border-radius: 25px; text-decoration: none; font-weight: 700; font-size: 1.1rem; display: inline-block; box-shadow: 0 6px 20px rgba(0,166,81,0.3);">
                        <i class="fas fa-home"></i> العودة للرئيسية
                    </a>
                </div>
            </div>
        `;
        const main = document.querySelector('main') || document.querySelector('.products-section');
        if (main) {
            main.innerHTML = notFoundHTML;
        }
    }

    addBasicHeader() {
        const header = `
            <header class="header">
                <div class="container">
                    <div class="nav-wrapper">
                        <div class="logo">
                            <h1><a href="/" style="color: var(--luxury-gold); text-decoration: none;"><i class="fas fa-shopping-bag"></i> سوق الكويت</a></h1>
                        </div>
                    </div>
                </div>
            </header>
        `;
        document.body.insertAdjacentHTML('afterbegin', header);
    }
}

// Load products data for homepage
async function loadProducts() {
    try {
        const res = await fetch('/products-comprehensive.json?v=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        products = Array.isArray(data) ? data : [];
        filteredProducts = products;
        displayProducts();
        updateCartUI();
        console.log(`✅ تم تحميل ${products.length} منتج من الملف الشامل`);
    } catch (error) {
        console.error('❌ خطأ في تحميل المنتجات:', error);
    }
}

// باقي الملف بدون تغيير ...
