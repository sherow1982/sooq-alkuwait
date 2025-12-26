// script.js

const STORE_CONFIG = {
    whatsappNumber: "201110760081",
    currency: "KWD"
};

let allProducts = [];
let cart = [];
let currentFilteredProducts = [];
let displayedCount = 0;
const ITEMS_PER_PAGE = 12;

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    loadCart();
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterProducts(e.target.value);
        });
    }
});

async function fetchProducts() {
    try {
        const response = await fetch('products_data_cleaned.json');
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const rawData = await response.json();
        
        allProducts = rawData.map(item => {
            return {
                id: String(item.id),
                name: item.title, 
                description: item.description,
                image: (item.media && item.media.main_image) ? item.media.main_image : 'https://via.placeholder.com/300',
                regular_price: parseFloat(item.pricing?.regular || 0),
                sale_price: parseFloat(item.pricing?.sale || 0),
                category: item.category || 'عام', 
                slug: item.id 
            };
        });
        
        setupCategories();
        renderProducts(allProducts);
        
    } catch (error) {
        console.error('Error loading products:', error);
        const grid = document.getElementById('products-grid');
        if(grid) {
            grid.innerHTML = `
                <div class="col-span-full text-center text-red-500 py-10">
                    <p>عذراً، حدث خطأ أثناء تحميل المنتجات.</p>
                    <p class="text-sm text-gray-500">تأكد أن ملف البيانات موجود</p>
                </div>
            `;
        }
    }
}

function renderProducts(products) {
    currentFilteredProducts = products;
    displayedCount = 0;
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-20 flex flex-col items-center"><i class="fa-solid fa-box-open text-4xl mb-4 text-gray-300"></i><p>لا توجد منتجات تطابق بحثك.</p></div>';
        updateLoadMoreButton();
        return;
    }

    appendProducts();
}

function appendProducts() {
    const grid = document.getElementById('products-grid');
    const nextBatch = currentFilteredProducts.slice(displayedCount, displayedCount + ITEMS_PER_PAGE);

    nextBatch.forEach(product => {
        const hasDiscount = product.sale_price > 0 && product.sale_price < product.regular_price;
        const displayPrice = hasDiscount ? product.sale_price : product.regular_price;

        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl overflow-hidden group relative border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col h-full';
        
        card.innerHTML = `
            <div class="relative aspect-square overflow-hidden bg-gray-50">
                <a href="product.html?id=${product.id}" class="block w-full h-full">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 mix-blend-multiply" loading="lazy">
                </a>
                ${hasDiscount ? `<span class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-10">خصم</span>` : ''}
                
                <button onclick="addToCart(event, '${product.id}')" class="absolute bottom-3 right-3 w-10 h-10 bg-white text-primary rounded-full shadow-lg flex items-center justify-center transform translate-y-14 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20 hover:bg-primary hover:text-white">
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
                        <span class="text-lg font-extrabold text-primary">${displayPrice} ${STORE_CONFIG.currency}</span>
                        ${hasDiscount ? `<span class="text-xs text-gray-400 line-through">${product.regular_price} ${STORE_CONFIG.currency}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    displayedCount += nextBatch.length;
    updateLoadMoreButton();
}

function updateLoadMoreButton() {
    const btn = document.getElementById('load-more-btn');
    if (btn) {
        if (displayedCount >= currentFilteredProducts.length || currentFilteredProducts.length === 0) {
            btn.style.display = 'none';
        } else {
            btn.style.display = 'block';
        }
    }
}

function setupCategories() {
    const categories = ['all', ...new Set(allProducts.map(p => p.category))];
    const container = document.getElementById('category-filters');
    if (!container) return;
    
    container.innerHTML = '';

    const getIcon = (cat) => {
        if(cat.includes('إلكترونيات') || cat.includes('هاتف')) return 'fa-mobile-screen-button';
        if(cat.includes('منزل') || cat.includes('أثاث')) return 'fa-couch';
        if(cat.includes('ملابس') || cat.includes('موضة')) return 'fa-shirt';
        if(cat.includes('جمال') || cat.includes('عناية')) return 'fa-spray-can-sparkles';
        if(cat.includes('ألعاب')) return 'fa-gamepad';
        if(cat.includes('مطبخ')) return 'fa-kitchen-set';
        if(cat.includes('سيار')) return 'fa-car';
        if(cat.includes('حيوان')) return 'fa-paw';
        return 'fa-layer-group';
    };

    categories.forEach(cat => {
        const isAll = cat === 'all';
        const label = isAll ? 'الكل' : cat;
        const iconClass = isAll ? 'fa-border-all' : getIcon(cat);
        
        const btn = document.createElement('button');
        btn.className = `filter-btn group min-w-[100px] flex flex-col items-center gap-3 p-3 rounded-2xl border transition-all duration-300 ${isAll ? 'active bg-white border-primary shadow-md' : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'}`;
        
        btn.innerHTML = `
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors ${isAll ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500 group-hover:bg-blue-50 group-hover:text-primary'}">
                <i class="fa-solid ${iconClass}"></i>
            </div>
            <span class="font-bold text-xs text-center ${isAll ? 'text-primary' : 'text-gray-600 group-hover:text-gray-900'}">${label}</span>
        `;
        
        btn.onclick = () => filterByCategory(cat);
        container.appendChild(btn);
    });
}

function filterByCategory(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const btnLabel = btn.querySelector('span').textContent;
        const isSelected = btnLabel === category || (category === 'all' && btnLabel === 'الكل');
        const iconDiv = btn.querySelector('div');
        const labelSpan = btn.querySelector('span');

        if (isSelected) {
            btn.classList.add('active', 'border-primary', 'shadow-md');
            btn.classList.remove('border-gray-100');
            iconDiv.classList.add('bg-primary', 'text-white');
            iconDiv.classList.remove('bg-gray-50', 'text-gray-500', 'group-hover:bg-blue-50', 'group-hover:text-primary');
            labelSpan.classList.add('text-primary');
            labelSpan.classList.remove('text-gray-600');
        } else {
            btn.classList.remove('active', 'border-primary', 'shadow-md');
            btn.classList.add('border-gray-100');
            iconDiv.classList.remove('bg-primary', 'text-white');
            iconDiv.classList.add('bg-gray-50', 'text-gray-500', 'group-hover:bg-blue-50', 'group-hover:text-primary');
            labelSpan.classList.remove('text-primary');
            labelSpan.classList.add('text-gray-600');
        }
    });

    if (category === 'all') {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

function filterProducts(searchTerm) {
    const term = searchTerm.toLowerCase();
    const filtered = allProducts.filter(p => 
        String(p.name).toLowerCase().includes(term) || 
        (p.description && String(p.description).toLowerCase().includes(term))
    );
    renderProducts(filtered);
}

// Cart Logic
function addToCart(event, productId) {
    event.preventDefault();
    event.stopPropagation();
    
    const product = allProducts.find(p => String(p.id) === String(productId));
    if (!product) return;
    
    const existingItem = cart.find(item => String(item.id) === String(productId));

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
    saveCart();
    
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.classList.add('bg-green-500', 'text-white');
    btn.classList.remove('bg-white', 'text-primary');
    
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('bg-green-500', 'text-white');
        btn.classList.add('bg-white', 'text-primary');
    }, 1000);
}

function removeFromCart(productId) {
    cart = cart.filter(item => String(item.id) !== String(productId));
    updateCartUI();
    saveCart();
}

function updateQty(productId, change) {
    const item = cart.find(item => String(item.id) === String(productId));
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCart();
        }
    }
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items');
    const countBadge = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    if (countBadge) {
        countBadge.textContent = totalCount;
        countBadge.style.transform = totalCount > 0 ? 'scale(1)' : 'scale(0)';
    }

    if (!cartContainer) return;

    cartContainer.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-64 text-gray-300">
                <i class="fa-solid fa-basket-shopping text-6xl mb-4 opacity-50"></i>
                <p>سلة المشتريات فارغة</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const hasDiscount = item.sale_price > 0 && item.sale_price < item.regular_price;
            const price = hasDiscount ? item.sale_price : item.regular_price;
            
            const itemTotal = price * item.qty;
            totalPrice += itemTotal;

            cartContainer.innerHTML += `
                <div class="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 mb-3 shadow-sm">
                    <img src="${item.image}" class="w-16 h-16 object-cover rounded-lg bg-gray-50" alt="${item.name}">
                    <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-bold text-gray-800 line-clamp-1 mb-1">${item.name}</h4>
                        <div class="text-primary font-bold text-sm mb-2">${price} ${STORE_CONFIG.currency}</div>
                        
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1 border border-gray-100">
                                <button onclick="updateQty('${item.id}', -1)" class="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-red-500 transition">-</button>
                                <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
                                <button onclick="updateQty('${item.id}', 1)" class="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-green-500 transition">+</button>
                            </div>
                            <button onclick="removeFromCart('${item.id}')" class="text-gray-400 hover:text-red-500 transition p-1">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    if (totalEl) {
        totalEl.textContent = totalPrice.toFixed(2) + ' ' + STORE_CONFIG.currency;
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    
    if (!sidebar) return;

    if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden');
        overlay.classList.remove('hidden');
        // Trigger animations
        setTimeout(() => {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.remove('opacity-0');
        }, 10);
    } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('opacity-0');
        
        setTimeout(() => {
            sidebar.classList.add('hidden');
            overlay.classList.add('hidden');
        }, 300);
    }
}

function saveCart() {
    localStorage.setItem('souq_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('souq_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

function checkoutWhatsApp() {
    if (cart.length === 0) return;

    let message = "*مرحباً، أود طلب المنتجات التالية:*\n\n";
    let total = 0;

    cart.forEach(item => {
        const hasDiscount = item.sale_price > 0 && item.sale_price < item.regular_price;
        const price = hasDiscount ? item.sale_price : item.regular_price;
        
        const subtotal = price * item.qty;
        total += subtotal;
        message += `▪️ ${item.name}\n   الكمية: ${item.qty} | السعر: ${price} ${STORE_CONFIG.currency}\n`;
    });

    message += `\n*الإجمالي الكلي: ${total.toFixed(2)} ${STORE_CONFIG.currency}*\n`;
    message += "\n------------------\n";
    message += "يرجى تأكيد الطلب.";

    const url = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}
