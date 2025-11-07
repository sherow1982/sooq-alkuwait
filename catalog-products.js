// 🔥 نظام كاتالوج المنتجات - النسخة المصلحة بالكامل

let allProducts = [];
let displayedProducts = [];
let currentPage = 1;
const productsPerPage = 24;

async function loadProductsData() {
    try {
        const response = await fetch('products_data.json');
        const data = await response.json();
        allProducts = data;
        
        console.log('✅ تم تحميل ' + allProducts.length + ' منتج');
        displayProducts(allProducts, 1);
        updateLoadMoreButton();
        
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        document.getElementById('products-container').innerHTML = 
            '<div style="text-align:center;padding:40px;color:#dc3545;font-size:1.2em;">❌ خطأ في تحميل المنتجات. يرجى تحديث الصفحة.</div>';
    }
}

function displayProducts(products, page = 1, append = false) {
    const container = document.getElementById('products-container');
    if (!container) {
        console.error('❌ products-container غير موجود');
        return;
    }
    
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = products.slice(startIndex, endIndex);
    
    const productsHTML = productsToShow.map(product => {
        const imageUrl = product.image_link && product.image_link.trim() !== '' 
            ? product.image_link 
            : 'https://via.placeholder.com/400x300/667eea/ffffff?text=منتج';
        
        const originalPrice = parseFloat(product.price) || 0;
        const salePrice = parseFloat(product.sale_price) || originalPrice;
        const discountPercent = originalPrice > salePrice 
            ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
            : 0;
        
        const title = product.title || 'منتج ' + product.id;
        const description = product.description || title;
        
        return `
        <div class="product-card" 
             data-id="${product.id}" 
             onclick="window.open('${product.product_link}', '_blank', 'noopener,noreferrer')" 
             style="cursor: pointer; transition: transform 0.3s;">
            
            <div class="product-image" style="position: relative; width: 100%; height: 250px; overflow: hidden; background: #f8f9fa; display: flex; align-items: center; justify-content: center;">
                <img src="${imageUrl}" 
                     alt="${title}" 
                     loading="lazy"
                     style="width: 100%; height: 100%; object-fit: contain; padding: 10px;"
                     onerror="this.src='https://via.placeholder.com/400x300/667eea/ffffff?text=منتج'; this.style.objectFit='cover';">
                
                ${discountPercent > 0 ? `
                <span class="discount-badge" style="position: absolute; top: 10px; right: 10px; background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%); color: white; padding: 6px 12px; border-radius: 20px; font-size: 0.85em; font-weight: bold; z-index: 10;">
                    خصم ${discountPercent}%
                </span>` : ''}
                
                ${product.availability === 'in stock' ? `
                <span class="stock-badge" style="position: absolute; top: 10px; left: 10px; background: #28a745; color: white; padding: 5px 12px; border-radius: 15px; font-size: 0.8em; font-weight: bold; z-index: 10;">
                    متوفر
                </span>` : ''}
            </div>
            
            <div class="product-info" style="padding: 15px; flex: 1; display: flex; flex-direction: column;">
                <h3 class="product-title" style="font-size: 1em; color: #333; margin-bottom: 8px; min-height: 44px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${title}
                </h3>
                
                <p class="product-description" style="color: #666; font-size: 0.85em; margin-bottom: 10px; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${description}
                </p>
                
                <div class="product-price" style="display: flex; align-items: center; gap: 8px; margin-top: auto; flex-wrap: wrap;">
                    ${originalPrice > salePrice ? `
                    <span class="price-old" style="text-decoration: line-through; color: #999; font-size: 0.9em;">
                        ${originalPrice.toFixed(2)} د.ك
                    </span>` : ''}
                    <span class="price-current" style="color: #667eea; font-size: 1.2em; font-weight: bold;">
                        ${salePrice.toFixed(2)} د.ك
                    </span>
                </div>
            </div>
            
            <div class="product-actions" 
                 onclick="event.stopPropagation();" 
                 style="display: flex; gap: 8px; padding: 10px; background: #f8f9fa;">
                <button class="btn-view-details" 
                        onclick="window.open('${product.product_link}', '_blank', 'noopener,noreferrer')"
                        style="flex: 1; background: #667eea; color: white; border: none; padding: 10px; font-size: 0.9em; font-weight: 600; border-radius: 8px; cursor: pointer; transition: all 0.3s;">
                    <i class="fas fa-eye"></i> شاهد التفاصيل
                </button>
                <button class="btn-whatsapp" 
                        onclick="orderViaWhatsApp(${product.id})"
                        style="flex: 1; background: #25D366; color: white; border: none; padding: 10px; font-size: 0.9em; font-weight: 600; cursor: pointer; border-radius: 8px; transition: all 0.3s;">
                    <i class="fab fa-whatsapp"></i> واتساب
                </button>
            </div>
        </div>
        `;
    }).join('');
    
    if (append) {
        container.innerHTML += productsHTML;
    } else {
        container.innerHTML = productsHTML;
    }
    
    displayedProducts = append ? [...displayedProducts, ...productsToShow] : productsToShow;
    console.log('✅ تم عرض ' + displayedProducts.length + ' منتج');
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;
    
    const totalProducts = allProducts.length;
    const displayedCount = currentPage * productsPerPage;
    
    if (displayedCount >= totalProducts) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
        const remaining = totalProducts - displayedCount;
        loadMoreBtn.innerHTML = '<i class="fas fa-plus-circle"></i> تحميل المزيد (' + remaining + ' منتج)';
    }
    
    const counterEl = document.getElementById('products-counter');
    if (counterEl) {
        counterEl.textContent = 'عرض ' + Math.min(displayedCount, totalProducts) + ' من ' + totalProducts + ' منتج';
    }
}

function loadMoreProducts() {
    currentPage++;
    displayProducts(allProducts, currentPage, true);
    updateLoadMoreButton();
}

function searchProducts(query) {
    const searchTerm = query.toLowerCase().trim();
    currentPage = 1;
    
    if (!searchTerm) {
        displayProducts(allProducts, 1);
        updateLoadMoreButton();
        return;
    }
    
    const filtered = allProducts.filter(product => 
        (product.title && product.title.toLowerCase().includes(searchTerm)) ||
        (product.description && product.description.toLowerCase().includes(searchTerm)) ||
        (product.id && product.id.toString().includes(searchTerm))
    );
    
    displayProducts(filtered, 1);
    
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    
    const counterEl = document.getElementById('products-counter');
    if (counterEl) counterEl.textContent = 'نتائج البحث: ' + filtered.length + ' منتج';
}

function filterByCategory(category) {
    currentPage = 1;
    
    if (!category || category === 'all') {
        displayProducts(allProducts, 1);
        updateLoadMoreButton();
        return;
    }
    
    const filtered = allProducts.filter(product => 
        product.category && product.category.toLowerCase().includes(category.toLowerCase())
    );
    
    displayProducts(filtered, 1);
    
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    
    const counterEl = document.getElementById('products-counter');
    if (counterEl) counterEl.textContent = category + ': ' + filtered.length + ' منتج';
}

function setActiveBtn(btn) {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function orderViaWhatsApp(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
        alert('❌ خطأ: المنتج غير موجود!');
        return;
    }
    
    const message = `🛒 *طلب منتج جديد*

📦 *المنتج:* ${product.title}
🆔 *رقم المنتج:* ${product.id}
💰 *السعر:* ${parseFloat(product.sale_price).toFixed(2)} د.ك
🔗 *الرابط:* ${window.location.origin}/${product.product_link}

---
👤 *بيانات المشتري:*
الاسم: 
العنوان: 
الهاتف: 
الكمية: `;
    
    const whatsappLink = 'https://wa.me/201110760081?text=' + encodeURIComponent(message);
    window.open(whatsappLink, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 بدء تحميل المنتجات...');
    loadProductsData();
    
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadMoreProducts);
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.addEventListener('input', (e) => searchProducts(e.target.value));
});
