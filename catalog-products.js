// ═══════════════════════════════════════════════════════════════════
// 🚀 Advanced Catalog System - Better than WooCommerce
// Premium Features: Instant Search, Smart Filters, Lazy Loading, SEO
// ═══════════════════════════════════════════════════════════════════

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 24;
let currentCategory = 'all';
let currentSort = 'default';
let searchTimeout;

// ═══════════════ Initialize ═══════════════
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    renderCategories();
    setupEventListeners();
    setupBackToTop();
});

// ═══════════════ Load Products ═══════════════
async function loadProducts() {
    try {
        const response = await fetch('products_data.json');
        if (!response.ok) throw new Error('Failed to load products');
        
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        
        console.log(`✅ Loaded ${allProducts.length} products`);
        
        updateCounts();
        renderProducts();
        
    } catch (error) {
        console.error('❌ Error loading products:', error);
        showError();
    }
}

// ═══════════════ Render Categories ═══════════════
function renderCategories() {
    const categoriesContainer = document.getElementById('categories');
    
    // Extract unique categories
    const categories = ['all', ...new Set(allProducts.map(p => p.category))];
    
    const categoryButtons = categories.map(cat => {
        const count = cat === 'all' 
            ? allProducts.length 
            : allProducts.filter(p => p.category === cat).length;
            
        const displayName = cat === 'all' ? 'جميع المنتجات' : cat;
        const isActive = cat === currentCategory ? 'active' : '';
        
        return `
            <button 
                class="category-btn ${isActive}" 
                onclick="filterByCategory('${cat}')"
                data-category="${cat}"
            >
                ${displayName} (${count})
            </button>
        `;
    }).join('');
    
    categoriesContainer.innerHTML = categoryButtons;
}

// ═══════════════ Filter by Category ═══════════════
function filterByCategory(category) {
    currentCategory = category;
    currentPage = 1;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    applyFilters();
}

// ═══════════════ Search Products ═══════════════
function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchProducts(e.target.value);
        }, 300); // Debounce
    });
}

function searchProducts(query) {
    currentPage = 1;
    applyFilters(query);
}

// ═══════════════ Apply All Filters ═══════════════
function applyFilters(searchQuery = '') {
    const query = searchQuery || document.getElementById('search-input').value;
    
    // Filter by category
    let results = currentCategory === 'all' 
        ? [...allProducts] 
        : allProducts.filter(p => p.category === currentCategory);
    
    // Filter by search query
    if (query.trim()) {
        results = results.filter(p => 
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    filteredProducts = results;
    updateCounts();
    sortProducts();
}

// ═══════════════ Sort Products ═══════════════
function sortProducts() {
    const sortValue = document.getElementById('sort-select')?.value || currentSort;
    currentSort = sortValue;
    
    switch(sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.sale_price - b.sale_price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.sale_price - a.sale_price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.title.localeCompare(a.title, 'ar'));
            break;
        default:
            // Keep original order
            break;
    }
    
    renderProducts();
}

// ═══════════════ Render Products ═══════════════
function renderProducts() {
    const container = document.getElementById('products-container');
    const loading = document.getElementById('loading');
    
    if (loading) loading.remove();
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3 class="empty-title">لم يتم العثور على منتجات</h3>
                <p class="empty-message">جرب البحث بكلمات مختلفة أو تصفح فئة أخرى</p>
            </div>
        `;
        return;
    }
    
    // Pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Render products with premium card design
    const productsHTML = pageProducts.map(product => createProductCard(product)).join('');
    container.innerHTML = productsHTML;
    
    // Render pagination
    renderPagination();
    
    // Update showing count
    document.getElementById('showing-count').textContent = pageProducts.length;
    
    // Lazy load images
    lazyLoadImages();
}

// ═══════════════ Create Product Card - Premium Design ═══════════════
function createProductCard(product) {
    const discountPercent = Math.round(((product.price - product.sale_price) / product.price) * 100);
    const hasDiscount = product.price !== product.sale_price;
    
    return `
        <article class="product-card" itemscope itemtype="https://schema.org/Product">
            ${hasDiscount ? `<div class="product-badge">وفّر ${discountPercent}%</div>` : ''}
            
            <div class="product-image-wrapper">
                <img 
                    class="product-image lazy" 
                    data-src="${product.image_link}" 
                    alt="${product.title}" 
                    itemprop="image"
                    loading="lazy"
                >
                <div class="quick-actions">
                    <button class="quick-btn" title="عرض سريع" onclick="quickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="quick-btn" title="إضافة للمفضلة">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="quick-btn" title="مقارنة">
                        <i class="fas fa-exchange-alt"></i>
                    </button>
                </div>
            </div>
            
            <div class="product-info">
                <div class="product-category" itemprop="category">${product.category}</div>
                
                <h3 class="product-title" itemprop="name">
                    <a href="products-pages/${product.filename}" style="color: inherit; text-decoration: none;">
                        ${product.title}
                    </a>
                </h3>
                
                <div class="product-rating">
                    <div class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                    </div>
                    <span class="rating-count">(4.9 - 127 تقييم)</span>
                </div>
                
                <div class="product-price" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                    <span class="current-price" itemprop="price" content="${product.sale_price}">
                        ${product.sale_price.toFixed(2)} د.ك
                    </span>
                    ${hasDiscount ? `<span class="old-price">${product.price.toFixed(2)} د.ك</span>` : ''}
                    <meta itemprop="priceCurrency" content="KWD">
                    <meta itemprop="availability" content="https://schema.org/InStock">
                </div>
                
                <ul class="product-features">
                    <li>شحن مجاني لجميع الكويت</li>
                    <li>ضمان أصلي 100%</li>
                    <li>إرجاع مجاني خلال 14 يوم</li>
                </ul>
            </div>
            
            <div class="product-footer">
                <a href="products-pages/${product.filename}" class="add-to-cart-btn">
                    <i class="fas fa-shopping-cart"></i>
                    اطلب عبر واتساب
                </a>
            </div>
        </article>
    `;
}

// ═══════════════ Pagination ═══════════════
function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginationContainer = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button 
            class="page-btn" 
            onclick="changePage(${currentPage - 1})"
            ${currentPage === 1 ? 'disabled' : ''}
        >
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    // Page numbers
    const maxPages = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    if (endPage - startPage < maxPages - 1) {
        startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="changePage(1)">1</button>`;
        if (startPage > 2) paginationHTML += `<span style="padding: 0 0.5rem">...</span>`;
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button 
                class="page-btn ${i === currentPage ? 'active' : ''}" 
                onclick="changePage(${i})"
            >
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) paginationHTML += `<span style="padding: 0 0.5rem">...</span>`;
        paginationHTML += `<button class="page-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
        <button 
            class="page-btn" 
            onclick="changePage(${currentPage + 1})"
            ${currentPage === totalPages ? 'disabled' : ''}
        >
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderProducts();
    scrollToTop();
}

// ═══════════════ View Options ═══════════════
function setGridView() {
    const container = document.getElementById('products-container');
    container.classList.remove('list-view');
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.view-btn').classList.add('active');
}

function setListView() {
    const container = document.getElementById('products-container');
    container.classList.add('list-view');
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.view-btn').classList.add('active');
}

// ═══════════════ Lazy Load Images ═══════════════
function lazyLoadImages() {
    const images = document.querySelectorAll('img.lazy');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ═══════════════ Quick View ═══════════════
function quickView(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Create modal (simplified version)
    alert(`Quick View: ${product.title}\nسيتم فتح نافذة عرض سريع قريباً`);
    
    // TODO: Implement full quick view modal
}

// ═══════════════ Update Counts ═══════════════
function updateCounts() {
    document.getElementById('total-count').textContent = filteredProducts.length;
    document.getElementById('total-products').textContent = allProducts.length;
}

// ═══════════════ Back to Top ═══════════════
function setupBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ═══════════════ Error State ═══════════════
function showError() {
    const container = document.getElementById('products-container');
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">⚠️</div>
            <h3 class="empty-title">حدث خطأ</h3>
            <p class="empty-message">عذراً، حدث خطأ في تحميل المنتجات. يرجى المحاولة مرة أخرى.</p>
            <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.75rem 2rem; background: var(--primary); color: white; border: none; border-radius: var(--radius-lg); cursor: pointer;">
                إعادة المحاولة
            </button>
        </div>
    `;
}

// ═══════════════ Performance Monitoring ═══════════════
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`⚡ Page Load: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
    });
}
