// script.js - (محدث: إصلاح الأقسام، زر الواتساب، والسلة)

const STORE_CONFIG = {
    whatsappNumber: "201110760081",
    currency: "KWD"
};

// ================= إدارة البيانات والمنتجات =================
let allProducts = [];
let activeCategory = 'all';

document.addEventListener('DOMContentLoaded', () => {
    // تحديد الصفحة الحالية لتشغيل الكود المناسب
    if (document.getElementById('products-grid')) {
        loadProducts(); // نحن في الرئيسية
    }
    updateCartCount(); // تحديث السلة في كل الصفحات
});

// جلب المنتجات
async function loadProducts() {
    const grid = document.getElementById('products-grid');
    const filtersContainer = document.getElementById('category-filters');

    try {
        const response = await fetch('products_data_cleaned.json');
        if (!response.ok) throw new Error("فشل تحميل المنتجات");
        
        allProducts = await response.json();
        
        // استخراج الأقسام
        const categories = ['all', ...new Set(allProducts.map(p => p.category))];
        renderCategories(categories, filtersContainer);
        
        // عرض المنتجات
        window.renderProducts(allProducts); // نستخدم الدالة الموجودة في index.html

    } catch (error) {
        if(grid) grid.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">حدث خطأ: ${error.message}</div>`;
    }
}

// --- تصحيح الأقسام (المشكلة كانت هنا) ---
function renderCategories(categories, container) {
    if (!container) return;
    
    // تنظيف الحاوية
    container.innerHTML = '';
    
    // إضافة كلاسات للحاوية لضمان التمرير السلس
    container.className = "flex gap-3 overflow-x-auto hide-scrollbar pb-2 px-1 w-full";

    categories.forEach(cat => {
        const isAll = cat === 'all';
        const label = isAll ? 'الكل' : cat;
        
        const btn = document.createElement('button');
        
        // ✅ التصحيح: إضافة whitespace-nowrap و flex-shrink-0 لمنع التداخل
        btn.className = `
            whitespace-nowrap flex-shrink-0 min-w-fit
            px-6 py-3 rounded-full text-sm font-bold border transition-all duration-300
            ${activeCategory === cat 
                ? 'bg-primary text-white border-primary shadow-md transform scale-105' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'}
        `;
        
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
        const btnText = btn.textContent;
        const isSelected = (category === 'all' && btnText === 'الكل') || btnText === category;
        
        if (isSelected) {
            btn.className = "whitespace-nowrap flex-shrink-0 min-w-fit px-6 py-3 rounded-full text-sm font-bold border transition-all duration-300 bg-primary text-white border-primary shadow-md transform scale-105";
        } else {
            btn.className = "whitespace-nowrap flex-shrink-0 min-w-fit px-6 py-3 rounded-full text-sm font-bold border transition-all duration-300 bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary";
        }
    });

    // تصفية المنتجات
    const filtered = category === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.category === category);
    
    // إعادة تعيين Pagination في الصفحة الرئيسية
    if (window.renderProducts) {
        // نغير المتغيرات العالمية في index.html
        if(typeof currentDisplayCount !== 'undefined') currentDisplayCount = 12; 
        window.renderProducts(filtered);
    }
}

// ================= إدارة السلة (Cart Logic) =================
// إضافة للسلة من الرئيسية
window.addToCartFromHome = function(id) {
    const product = allProducts.find(p => String(p.id) === String(id));
    if (!product) return;
    
    const price = parseFloat(product.pricing?.sale || product.pricing?.regular || 0);
    const regular = parseFloat(product.pricing?.regular || 0);
    
    addToCartGlobal({
        id: product.id,
        name: product.title,
        image: product.media?.main_image,
        price: price,
        regular_price: regular
    });
    
    // تأثير بصري بسيط
    const btn = event.currentTarget;
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.classList.add('bg-green-500', 'text-white');
    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.classList.remove('bg-green-500', 'text-white');
    }, 1500);
};

// الدالة العامة للإضافة للسلة
window.addToCartGlobal = function(product) {
    let cart = JSON.parse(localStorage.getItem('cart_v1') || '[]');
    const existingItem = cart.find(item => String(item.id) === String(product.id));

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            regular_price: product.regular_price,
            quantity: 1
        });
    }

    localStorage.setItem('cart_v1', JSON.stringify(cart));
    updateCartCount();
    showToast("تمت الإضافة للسلة بنجاح");
};

// تحديث أيقونة السلة
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart_v1') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // نحدث كل العدادات في الصفحة (الموبايل والديسك توب)
    const badges = document.querySelectorAll('#cart-count');
    badges.forEach(badge => {
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });

    // إذا كنا في صفحة السلة، نحدث المحتوى أيضاً
    if (document.getElementById('cart-page-items')) {
        renderCartPageItems();
    }
}

// عرض عناصر السلة (في صفحة cart.html)
function renderCartPageItems() {
    const container = document.getElementById('cart-page-items');
    const totalEl = document.getElementById('cart-page-total');
    if (!container) return;

    const cart = JSON.parse(localStorage.getItem('cart_v1') || '[]');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-10">
                <i class="fa-solid fa-basket-shopping text-6xl text-gray-200 mb-4"></i>
                <p class="text-gray-500 font-bold">سلة المشتريات فارغة</p>
                <a href="index.html" class="mt-4 inline-block text-primary underline">تصفح المنتجات</a>
            </div>`;
        if(totalEl) totalEl.textContent = "0.00 KWD";
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
        <div class="flex items-center gap-4 border-b border-gray-50 py-4 last:border-0">
            <img src="${item.image}" class="w-20 h-20 object-cover rounded-lg border border-gray-100">
            <div class="flex-grow">
                <h3 class="font-bold text-sm md:text-base text-gray-800 mb-1">${item.name}</h3>
                <div class="text-primary font-bold">${item.price.toFixed(2)} KWD</div>
            </div>
            <div class="flex flex-col items-end gap-2">
                <div class="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                    <button onclick="updateItemQty('${item.id}', -1)" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-500">-</button>
                    <span class="w-8 text-center text-sm font-bold">${item.quantity}</span>
                    <button onclick="updateItemQty('${item.id}', 1)" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-green-500">+</button>
                </div>
                <button onclick="removeFromCart('${item.id}')" class="text-xs text-red-400 hover:text-red-600 underline">حذف</button>
            </div>
        </div>
        `;
    }).join('');

    if(totalEl) totalEl.textContent = `${total.toFixed(2)} KWD`;
}

// تحديث الكمية
window.updateItemQty = function(id, change) {
    let cart = JSON.parse(localStorage.getItem('cart_v1') || '[]');
    const item = cart.find(i => String(i.id) === String(id));
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => String(i.id) !== String(id));
        }
        localStorage.setItem('cart_v1', JSON.stringify(cart));
        updateCartCount();
    }
};

// حذف عنصر
window.removeFromCart = function(id) {
    let cart = JSON.parse(localStorage.getItem('cart_v1') || '[]');
    cart = cart.filter(i => String(i.id) !== String(id));
    localStorage.setItem('cart_v1', JSON.stringify(cart));
    updateCartCount();
};

// إشعار صغير (Toast)
function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = "fixed bottom-4 left-4 bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl z-[9999] text-sm font-bold transform translate-y-20 opacity-0 transition-all duration-300 flex items-center gap-2";
    toast.innerHTML = `<i class="fa-solid fa-check-circle text-green-400"></i> ${msg}`;
    document.body.appendChild(toast);
    
    // Show
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-20', 'opacity-0');
    });

    // Hide
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}
