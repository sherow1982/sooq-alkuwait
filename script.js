// script.js - Updated & Fixed

const STORE_CONFIG = {
    whatsappNumber: "201110760081",
    currency: "KWD"
};

// تهيئة المتغيرات العامة
let allProducts = [];
let cart = [];

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // 1. تحميل السلة فوراً عند بدء التطبيق
    loadCart();
    
    // 2. تحديث العداد في النافبار
    updateCartCount();

    // 3. تحديد الصفحة الحالية لتشغيل الكود المناسب لها
    if (document.getElementById('products-grid')) {
        // نحن في الصفحة الرئيسية
        fetchProducts();
        setupSearch();
    } else if (document.getElementById('cart-page-items')) {
        // نحن في صفحة السلة
        renderCartPage();
    } else if (document.getElementById('checkout-summary')) {
        // نحن في صفحة الدفع
        setupCheckout();
    }
});

// --- إدارة البيانات (Data Management) ---

async function fetchProducts() {
    try {
        const response = await fetch('products_data_cleaned.json');
        if (!response.ok) throw new Error('Failed to load data');
        const rawData = await response.json();
        
        allProducts = rawData.map(transformProductData);
        
        // عرض المنتجات والفئات
        setupCategories();
        renderProducts(allProducts);
        
    } catch (error) {
        console.error('Error:', error);
    }
}

function transformProductData(item) {
    return {
        id: String(item.id),
        name: item.title,
        description: item.description,
        image: (item.media && item.media.main_image) ? item.media.main_image : 'https://via.placeholder.com/300',
        regular_price: parseFloat(item.pricing?.regular || 0),
        sale_price: parseFloat(item.pricing?.sale || 0),
        category: item.category || 'عام'
    };
}

// --- وظائف السلة (Cart Functions) ---

// دالة عامة لإضافة منتج للسلة (تستخدم في كل الصفحات)
function addToCart(productId, quantity = 1, redirect = false) {
    // تأكد من تحميل السلة الأحدث
    loadCart();

    // في الصفحة الرئيسية، نحتاج للبحث في allProducts
    // في صفحة المنتج، قد لا تكون allProducts محملة، لذا نعتمد على البيانات الممررة أو نعيد تحميلها
    // للتبسيط هنا: سنفترض وجود المنتج في allProducts أو نجلبه
    
    let product = allProducts.find(p => p.id === String(productId));
    
    // إذا لم نجد المنتج (مثلاً نحن في صفحة المنتج ولم نحمل القائمة الكاملة)
    // سنحاول جلبه من التخزين المحلي المؤقت أو الاعتماد على البيانات الموجودة في الصفحة
    if (!product) {
        // محاولة طارئة: هل نحن في صفحة المنتج؟
        const titleEl = document.querySelector('h1');
        if(titleEl) {
             // بناء كائن منتج مؤقت من بيانات الصفحة الحالية
             // هذا حل سريع للصفحات المنفصلة
             const priceEl = document.querySelector('.text-4xl.font-bold.text-primary');
             const imgEl = document.getElementById('main-image');
             
             product = {
                 id: String(productId),
                 name: titleEl.textContent,
                 image: imgEl ? imgEl.src : '',
                 regular_price: parseFloat(priceEl ? priceEl.textContent : 0),
                 sale_price: 0, // للتبسيط
                 qty: 0
             };
        }
    }

    if (!product) {
        console.error("Product not found");
        return;
    }

    const existingItem = cart.find(item => item.id === String(productId));

    if (existingItem) {
        existingItem.qty += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            image: product.image,
            regular_price: product.regular_price,
            sale_price: product.sale_price,
            qty: quantity
        });
    }

    saveCart();
    updateCartCount();

    if (redirect) {
        window.location.href = 'cart.html';
    } else {
        // Feedback visual (إشعار بسيط)
        alert('تمت الإضافة للسلة بنجاح');
    }
}

// إزالة من السلة
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== String(productId));
    saveCart();
    updateCartCount();
    
    // إعادة رسم الصفحة إذا كنا في صفحة السلة
    if (document.getElementById('cart-page-items')) {
        renderCartPage();
    }
}

// تحديث الكمية
function updateQty(productId, change) {
    const item = cart.find(item => item.id === String(productId));
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartCount();
            if (document.getElementById('cart-page-items')) {
                renderCartPage();
            }
        }
    }
}

// حفظ وقراءة السلة
function saveCart() {
    localStorage.setItem('souq_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('souq_cart');
    cart = saved ? JSON.parse(saved) : [];
}

function updateCartCount() {
    const countElements = document.querySelectorAll('#cart-count'); // قد يكون هناك أكثر من عداد (موبايل/ديسكتوب)
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    
    countElements.forEach(el => {
        el.textContent = total;
        el.classList.remove('scale-0');
        if(total === 0) el.classList.add('scale-0');
    });
}

// --- وظائف الصفحة الرئيسية (Home Page) ---

function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if(!grid) return;
    
    grid.innerHTML = products.map(product => {
        const hasDiscount = product.sale_price > 0 && product.sale_price < product.regular_price;
        const displayPrice = hasDiscount ? product.sale_price : product.regular_price;
        
        return `
        <div class="bg-white rounded-2xl overflow-hidden group border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col">
            <div class="relative aspect-square overflow-hidden bg-gray-50">
                <a href="product.html?id=${product.id}" class="block w-full h-full">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                </a>
                ${hasDiscount ? `<span class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">خصم</span>` : ''}
            </div>
            
            <div class="p-4 flex flex-col flex-grow">
                <div class="text-xs text-gray-500 mb-1 bg-gray-50 w-fit px-2 rounded">${product.category}</div>
                <h3 class="font-bold text-gray-800 mb-2 line-clamp-2 text-sm min-h-[2.5rem]">${product.name}</h3>
                
                <div class="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
                    <div>
                        <span class="text-lg font-extrabold text-primary">${displayPrice} ${STORE_CONFIG.currency}</span>
                        ${hasDiscount ? `<span class="text-xs text-gray-400 line-through block">${product.regular_price}</span>` : ''}
                    </div>
                    <button onclick="addToCart('${product.id}')" class="w-10 h-10 rounded-full bg-gray-100 text-primary hover:bg-primary hover:text-white transition flex items-center justify-center">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function setupCategories() {
    // ... (نفس كود الفئات السابق)
}

function setupSearch() {
    const input = document.getElementById('search-input');
    if(!input) return;
    input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(term));
        renderProducts(filtered);
    });
}

// --- وظائف صفحة السلة (Cart Page) ---

function renderCartPage() {
    const container = document.getElementById('cart-page-items');
    const totalEl = document.getElementById('cart-page-total');
    if(!container) return;

    if(cart.length === 0) {
        container.innerHTML = '<div class="text-center py-10"><i class="fa-solid fa-basket-shopping text-6xl text-gray-200 mb-4"></i><p class="text-gray-500">السلة فارغة</p></div>';
        if(totalEl) totalEl.textContent = '0.00 ' + STORE_CONFIG.currency;
        return;
    }
    
    let total = 0;
    container.innerHTML = cart.map(item => {
        const price = item.sale_price > 0 ? item.sale_price : item.regular_price;
        total += price * item.qty;
        
        return `
            <div class="flex gap-4 border-b border-gray-100 last:border-0 pb-4 mb-4 items-center">
                <img src="${item.image}" class="w-20 h-20 object-cover rounded-lg bg-gray-50">
                <div class="flex-1">
                    <h3 class="font-bold text-gray-800 text-sm md:text-base">${item.name}</h3>
                    <div class="text-primary font-bold">${price.toFixed(2)} ${STORE_CONFIG.currency}</div>
                </div>
                <div class="flex items-center gap-2 bg-gray-50 rounded-lg px-2 h-fit">
                    <button onclick="updateQty('${item.id}', -1)" class="p-2 text-gray-500 hover:text-red-500">-</button>
                    <span class="font-bold w-6 text-center text-sm">${item.qty}</span>
                    <button onclick="updateQty('${item.id}', 1)" class="p-2 text-gray-500 hover:text-green-500">+</button>
                </div>
                <button onclick="removeFromCart('${item.id}')" class="text-red-400 hover:text-red-600 px-2"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    }).join('');
    
    if(totalEl) totalEl.textContent = total.toFixed(2) + ' ' + STORE_CONFIG.currency;
}

// --- وظائف صفحة الدفع (Checkout) ---

function setupCheckout() {
    const summary = document.getElementById('checkout-summary');
    if(!summary) return;

    if(cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }

    const total = cart.reduce((sum, item) => {
        const price = item.sale_price > 0 ? item.sale_price : item.regular_price;
        return sum + (price * item.qty);
    }, 0);

    summary.innerHTML = `
        <div class="flex justify-between mb-2"><span>عدد المنتجات:</span> <span class="font-bold text-gray-900">${cart.length}</span></div>
        <div class="flex justify-between text-lg font-bold text-primary border-t pt-2 mt-2"><span>الإجمالي:</span> <span>${total.toFixed(2)} ${STORE_CONFIG.currency}</span></div>
    `;
}

// تصدير دالة addToCartAndRedirect لاستخدامها في product-page.js
window.addToCartAndRedirect = function(productId) {
    addToCart(productId, 1, true);
};
