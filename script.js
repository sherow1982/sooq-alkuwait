// script.js - (محدث: منطق البحث)

// ... (نفس المتغيرات والثوابت السابقة) ...
const STORE_CONFIG = {
    whatsappNumber: "201110760081",
    currency: "KWD"
};

let allProducts = [];
let activeCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('products-grid')) {
        loadProducts();
    }
    updateCartCount();
});

async function loadProducts() {
    // ... (نفس كود جلب المنتجات السابق) ...
    const grid = document.getElementById('products-grid');
    const filtersContainer = document.getElementById('category-filters');

    try {
        const response = await fetch('products_data_cleaned.json');
        if (!response.ok) throw new Error("فشل تحميل المنتجات");
        
        allProducts = await response.json();
        
        const categories = ['all', ...new Set(allProducts.map(p => p.category))];
        renderCategories(categories, filtersContainer);
        
        // ✅ التحقق هل يوجد بحث في الرابط؟ (للقادمين من صفحات أخرى)
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');

        if (searchQuery) {
            // إذا وجد بحث، نفلتر فوراً
            document.getElementById('search-input').value = searchQuery; // تعبئة بحث الهيرو
            // تعبئة البحث في النافبار (بعد قليل من الوقت ليتم تحميل layout.js)
            setTimeout(() => {
                const navInput = document.getElementById('global-search-desktop');
                if(navInput) navInput.value = searchQuery;
            }, 500);
            
            filterProductsBySearch(searchQuery);
            // إزالة البارامتر من الرابط لشكل أنظف
            window.history.replaceState({}, document.title, "index.html");
        } else {
            window.renderProducts(allProducts);
        }

    } catch (error) {
        if(grid) grid.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">حدث خطأ: ${error.message}</div>`;
    }
}

// ... (دالة renderCategories كما هي) ...
function renderCategories(categories, container) {
    if (!container) return;
    container.innerHTML = '';
    container.className = "flex gap-3 overflow-x-auto hide-scrollbar pb-2 px-1 w-full";

    categories.forEach(cat => {
        const isAll = cat === 'all';
        const label = isAll ? 'الكل' : cat;
        const btn = document.createElement('button');
        btn.className = `whitespace-nowrap flex-shrink-0 min-w-fit px-6 py-3 rounded-full text-sm font-bold border transition-all duration-300 ${activeCategory === cat ? 'bg-primary text-white border-primary shadow-md transform scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'}`;
        btn.textContent = label;
        btn.onclick = () => filterProducts(cat);
        container.appendChild(btn);
    });
}

function filterProducts(category) {
    activeCategory = category;
    // تحديث شكل الأزرار
    const buttons = document.querySelectorAll('#category-filters button');
    buttons.forEach(btn => {
        const isSelected = (category === 'all' && btn.textContent === 'الكل') || btn.textContent === category;
        btn.className = isSelected 
            ? "whitespace-nowrap flex-shrink-0 min-w-fit px-6 py-3 rounded-full text-sm font-bold border transition-all duration-300 bg-primary text-white border-primary shadow-md transform scale-105"
            : "whitespace-nowrap flex-shrink-0 min-w-fit px-6 py-3 rounded-full text-sm font-bold border transition-all duration-300 bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary";
    });

    const filtered = category === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.category === category);
    
    if (window.renderProducts) {
        if(typeof currentDisplayCount !== 'undefined') currentDisplayCount = 12; 
        window.renderProducts(filtered);
    }
}

// ✅ دالة البحث الجديدة (تستخدم في كل مكان)
window.filterProductsBySearch = function(query) {
    if (!query) {
        filterProducts('all');
        return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = allProducts.filter(p => 
        (p.title && p.title.toLowerCase().includes(lowerQuery)) ||
        (p.description && p.description.toLowerCase().includes(lowerQuery))
    );
    
    // إعادة تعيين الفلتر النشط
    activeCategory = 'all'; 
    renderCategories(['all', ...new Set(allProducts.map(p => p.category))], document.getElementById('category-filters'));

    if (window.renderProducts) {
        if(typeof currentDisplayCount !== 'undefined') currentDisplayCount = 12; 
        window.renderProducts(filtered);
    }
};

// ... (باقي دوال السلة addToCartFromHome, addToCartGlobal, updateCartCount... كما هي في الملف السابق) ...
// تأكد من نسخ باقي الدوال من ردودي السابقة لضمان عمل السلة
window.addToCartFromHome = function(id) { /* ... نفس الكود السابق ... */ 
    const product = allProducts.find(p => String(p.id) === String(id));
    if (!product) return;
    const price = parseFloat(product.pricing?.sale || product.pricing?.regular || 0);
    const regular = parseFloat(product.pricing?.regular || 0);
    addToCartGlobal({id: product.id, name: product.title, image: product.media?.main_image, price: price, regular_price: regular});
    const btn = event.currentTarget;
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.classList.add('bg-green-500', 'text-white');
    setTimeout(() => { btn.innerHTML = originalContent; btn.classList.remove('bg-green-500', 'text-white'); }, 1500);
};

window.addToCartGlobal = function(product) { /* ... نفس الكود السابق ... */
    let cart = JSON.parse(localStorage.getItem('cart_v1') || '[]');
    const existingItem = cart.find(item => String(item.id) === String(product.id));
    if (existingItem) { existingItem.quantity += 1; } else { cart.push({...product, quantity: 1}); }
    localStorage.setItem('cart_v1', JSON.stringify(cart));
    updateCartCount();
    showToast("تمت الإضافة للسلة بنجاح");
};

function updateCartCount() { /* ... نفس الكود السابق ... */
    const cart = JSON.parse(localStorage.getItem('cart_v1') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(badge => {
        if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); } else { badge.classList.add('hidden'); }
    });
    if (document.getElementById('cart-page-items')) renderCartPageItems();
}

function renderCartPageItems() { /* ... نفس الكود السابق ... */ 
    const container = document.getElementById('cart-page-items');
    const totalEl = document.getElementById('cart-page-total');
    if (!container) return;
    const cart = JSON.parse(localStorage.getItem('cart_v1') || '[]');
    if (cart.length === 0) {
        container.innerHTML = `<div class="text-center py-10"><i class="fa-solid fa-basket-shopping text-6xl text-gray-200 mb-4"></i><p class="text-gray-500 font-bold">سلة المشتريات فارغة</p><a href="index.html" class="mt-4 inline-block text-primary underline">تصفح المنتجات</a></div>`;
        if(totalEl) totalEl.textContent = "0.00 KWD";
        return;
    }
    let total = 0;
    container.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `<div class="flex items-center gap-4 border-b border-gray-50 py-4 last:border-0"><img src="${item.image}" class="w-20 h-20 object-cover rounded-lg border border-gray-100"><div class="flex-grow"><h3 class="font-bold text-sm md:text-base text-gray-800 mb-1">${item.name}</h3><div class="text-primary font-bold">${item.price.toFixed(2)} KWD</div></div><div class="flex flex-col items-end gap-2"><div class="flex items-center bg-gray-50 rounded-lg border border-gray-200"><button onclick="updateItemQty('${item.id}', -1)" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-500">-</button><span class="w-8 text-center text-sm font-bold">${item.quantity}</span><button onclick="updateItemQty('${item.id}', 1)" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-green-500">+</button></div><button onclick="removeFromCart('${item.id}')" class="text-xs text-red-400 hover:text-red-600 underline">حذف</button></div></div>`;
    }).join('');
    if(totalEl) totalEl.textContent = `${total.toFixed(2)} KWD`;
}

window.updateItemQty = function(id, change) { /* ... نفس الكود السابق ... */
    let cart = JSON.parse(localStorage.getItem('cart_v1') || '[]');
    const item = cart.find(i => String(i.id) === String(id));
    if (item) { item.quantity += change; if (item.quantity <= 0) cart = cart.filter(i => String(i.id) !== String(id)); localStorage.setItem('cart_v1', JSON.stringify(cart)); updateCartCount(); }
};

window.removeFromCart = function(id) { /* ... نفس الكود السابق ... */
    let cart = JSON.parse(localStorage.getItem('cart_v1') || '[]');
    cart = cart.filter(i => String(i.id) !== String(id));
    localStorage.setItem('cart_v1', JSON.stringify(cart));
    updateCartCount();
};

function showToast(msg) { /* ... نفس الكود السابق ... */
    const toast = document.createElement('div');
    toast.className = "fixed bottom-4 left-4 bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl z-[9999] text-sm font-bold transform translate-y-20 opacity-0 transition-all duration-300 flex items-center gap-2";
    toast.innerHTML = `<i class="fa-solid fa-check-circle text-green-400"></i> ${msg}`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove('translate-y-20', 'opacity-0'));
    setTimeout(() => { toast.classList.add('translate-y-20', 'opacity-0'); setTimeout(() => toast.remove(), 300); }, 2000);
}
