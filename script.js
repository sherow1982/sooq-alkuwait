// script.js

const STORE_CONFIG = {
    whatsappNumber: "201110760081",
    currency: "KWD"
};

// 1. تهيئة السلة فوراً عند تحميل الملف من التخزين المحلي
let cart = JSON.parse(localStorage.getItem('souq_cart') || '[]');

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(); // تحديث العداد في النافبار فوراً

    // التحقق من الصفحة الحالية وتشغيل الوظائف المناسبة
    if (document.getElementById('products-grid')) {
        // نحن في الصفحة الرئيسية
        fetchProducts(); 
        setupSearch();
    } else if (document.getElementById('cart-page-items')) {
        // نحن في صفحة السلة
        renderCartPage();
    } else if (document.getElementById('checkout-summary')) {
        // نحن في صفحة إتمام الطلب
        setupCheckout();
    }
});

// --- الوظيفة العامة للإضافة للسلة (Core Function) ---
window.addToCartGlobal = function(productData) {
    if (!productData || !productData.id) {
        console.error("بيانات المنتج غير صحيحة");
        return;
    }

    const pId = String(productData.id); // توحيد النوع كنص
    const existingItem = cart.find(item => String(item.id) === pId);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            id: pId,
            name: productData.name,
            image: productData.image,
            sale_price: parseFloat(productData.price) || 0,
            regular_price: parseFloat(productData.regular_price) || 0,
            qty: 1
        });
    }

    localStorage.setItem('souq_cart', JSON.stringify(cart));
    updateCartCount();
    
    // إشعار بصري بسيط
    showNotification();
};

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = total;
        el.classList.remove('hidden');
        if (total === 0) el.classList.add('hidden');
    });
}

function showNotification() {
    // وميض بسيط لأيقونة السلة
    const icons = document.querySelectorAll('.fa-cart-shopping');
    icons.forEach(icon => {
        icon.classList.add('text-green-500', 'scale-125');
        setTimeout(() => icon.classList.remove('text-green-500', 'scale-125'), 300);
    });
}

// --- وظائف الصفحة الرئيسية (Home Page Logic) ---
let allProducts = [];

async function fetchProducts() {
    try {
        const response = await fetch('products_data_cleaned.json');
        if (!response.ok) throw new Error('Failed to load data');
        const rawData = await response.json();
        
        // تحويل البيانات للشكل الموحد
        allProducts = rawData.map(item => ({
            id: String(item.id),
            name: item.title,
            description: item.description,
            image: (item.media && item.media.main_image) ? item.media.main_image : 'https://via.placeholder.com/300',
            regular_price: parseFloat(item.pricing?.regular || 0),
            sale_price: parseFloat(item.pricing?.sale || 0),
            category: item.category || 'عام'
        }));
        
        setupCategories();
        renderProducts(allProducts);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('products-grid').innerHTML = '<p class="col-span-full text-center text-red-500">فشل تحميل المنتجات</p>';
    }
}

function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if(!grid) return;
    
    if(products.length === 0) {
        grid.innerHTML = '<p class="col-span-full text-center text-gray-500">لا توجد منتجات.</p>';
        return;
    }

    grid.innerHTML = products.map(product => {
        const hasDiscount = product.sale_price > 0 && product.sale_price < product.regular_price;
        const displayPrice = hasDiscount ? product.sale_price : product.regular_price;
        
        return `
        <div class="bg-white rounded-2xl overflow-hidden group border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <div class="relative aspect-square overflow-hidden bg-gray-50">
                <a href="product.html?id=${product.id}" class="block w-full h-full">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy">
                </a>
                ${hasDiscount ? `<span class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-10">خصم</span>` : ''}
                
                <button onclick="addToCartFromHome('${product.id}')" class="absolute bottom-3 right-3 w-10 h-10 bg-white text-primary rounded-full shadow-lg flex items-center justify-center transform translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20 hover:bg-primary hover:text-white">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
            
            <div class="p-4 flex flex-col flex-grow">
                <div class="text-xs text-gray-500 mb-1 font-medium bg-gray-50 w-fit px-2 py-0.5 rounded">${product.category}</div>
                <a href="product.html?id=${product.id}" class="block group-hover:text-primary transition-colors">
                    <h3 class="font-bold text-gray-800 mb-2 line-clamp-2 text-sm leading-relaxed min-h-[2.5rem]">${product.name}</h3>
                </a>
                
                <div class="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
                    <div class="flex flex-col">
                        <span class="text-lg font-extrabold text-primary">${displayPrice.toFixed(2)} ${STORE_CONFIG.currency}</span>
                        ${hasDiscount ? `<span class="text-xs text-gray-400 line-through">${product.regular_price.toFixed(2)}</span>` : ''}
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// دالة مساعدة للإضافة من الصفحة الرئيسية
window.addToCartFromHome = function(id) {
    const product = allProducts.find(p => p.id === String(id));
    if(product) {
        const price = product.sale_price > 0 ? product.sale_price : product.regular_price;
        window.addToCartGlobal({
            id: product.id,
            name: product.name,
            image: product.image,
            price: price,
            regular_price: product.regular_price
        });
    }
};

function setupCategories() {
    const categories = ['all', ...new Set(allProducts.map(p => p.category))];
    const container = document.getElementById('category-filters');
    if (!container) return;
    
    container.innerHTML = categories.map(cat => {
        const label = cat === 'all' ? 'الكل' : cat;
        return `<button onclick="filterByCategory('${cat}')" class="filter-btn min-w-[80px] px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 whitespace-nowrap text-sm ${cat==='all'?'bg-primary text-white border-primary':''}">${label}</button>`;
    }).join('');
}

window.filterByCategory = function(category) {
    // تحديث الستايل
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        if((category === 'all' && btn.innerText === 'الكل') || btn.innerText === category) {
            btn.className = "filter-btn min-w-[80px] px-4 py-2 rounded-full border border-primary bg-primary text-white whitespace-nowrap text-sm";
        } else {
            btn.className = "filter-btn min-w-[80px] px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 whitespace-nowrap text-sm";
        }
    });

    if (category === 'all') renderProducts(allProducts);
    else renderProducts(allProducts.filter(p => p.category === category));
};

function setupSearch() {
    const input = document.getElementById('search-input');
    if(!input) return;
    input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        renderProducts(allProducts.filter(p => p.name.toLowerCase().includes(term)));
    });
}

// --- وظائف صفحة السلة (Cart Page Logic) ---
function renderCartPage() {
    const container = document.getElementById('cart-page-items');
    const totalEl = document.getElementById('cart-page-total');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<div class="text-center py-20 text-gray-500"><i class="fa-solid fa-basket-shopping text-4xl mb-4 text-gray-300"></i><p>السلة فارغة</p></div>';
        if (totalEl) totalEl.textContent = '0.00 ' + STORE_CONFIG.currency;
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.sale_price * item.qty;
        total += itemTotal;
        return `
            <div class="flex gap-4 border-b border-gray-100 pb-4 mb-4 items-center last:border-0 last:mb-0 last:pb-0">
                <img src="${item.image}" class="w-20 h-20 object-cover rounded-lg border border-gray-100">
                <div class="flex-1">
                    <h3 class="font-bold text-sm text-gray-800 line-clamp-1">${item.name}</h3>
                    <div class="text-primary font-bold text-sm mt-1">${item.sale_price.toFixed(2)} ${STORE_CONFIG.currency}</div>
                </div>
                <div class="flex items-center gap-2 bg-gray-50 rounded-lg px-2 border border-gray-200">
                    <button onclick="updateQty('${item.id}', -1)" class="px-2 py-1 text-gray-600 hover:text-red-500">-</button>
                    <span class="font-bold text-sm min-w-[20px] text-center">${item.qty}</span>
                    <button onclick="updateQty('${item.id}', 1)" class="px-2 py-1 text-gray-600 hover:text-green-500">+</button>
                </div>
                <button onclick="removeFromCart('${item.id}')" class="text-red-400 hover:text-red-600 px-2"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    }).join('');

    if (totalEl) totalEl.textContent = total.toFixed(2) + ' ' + STORE_CONFIG.currency;
}

window.updateQty = function(id, change) {
    const item = cart.find(i => String(i.id) === String(id));
    if (item) {
        item.qty += change;
        if (item.qty <= 0) removeFromCart(id);
        else {
            localStorage.setItem('souq_cart', JSON.stringify(cart));
            renderCartPage();
            updateCartCount();
        }
    }
};

window.removeFromCart = function(id) {
    cart = cart.filter(i => String(i.id) !== String(id));
    localStorage.setItem('souq_cart', JSON.stringify(cart));
    renderCartPage();
    updateCartCount();
};

// --- وظائف صفحة إتمام الطلب (Checkout Logic) ---
function setupCheckout() {
    const summary = document.getElementById('checkout-summary');
    if(!summary) return;

    if(cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.sale_price * item.qty), 0);
    summary.innerHTML = `
        <div class="flex justify-between mb-2 text-sm"><span>عدد المنتجات:</span> <span class="font-bold text-gray-900">${cart.length}</span></div>
        <div class="flex justify-between text-lg font-bold text-primary border-t pt-2 mt-2"><span>الإجمالي:</span> <span>${total.toFixed(2)} ${STORE_CONFIG.currency}</span></div>
    `;
}

window.processCheckout = function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const customer = { name: formData.get('name'), phone: formData.get('phone'), address: formData.get('address') };

    let message = `*طلب جديد من الموقع* 🛍️\n\n👤 *العميل:* ${customer.name}\n📱 *الهاتف:* ${customer.phone}\n📍 *العنوان:* ${customer.address}\n\n*المنتجات:*\n`;
    let total = 0;
    
    cart.forEach(item => {
        total += item.sale_price * item.qty;
        message += `▪️ ${item.name} (x${item.qty}) - ${item.sale_price} KWD\n`;
    });

    message += `\n*💰 الإجمالي: ${total.toFixed(2)} KWD*\n------------------\nيرجى تأكيد الاستلام.`;

    localStorage.removeItem('souq_cart');
    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    window.location.href = 'thank-you.html';
};
