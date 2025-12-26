// product-page.js

let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
});

async function loadProductDetails() {
    const container = document.getElementById('product-details-container');
    const breadcrumbTitle = document.getElementById('breadcrumb-title');
    
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id') || urlParams.get('product');

        if (!productId) throw new Error('لم يتم تحديد منتج.');

        const response = await fetch('products_data_cleaned.json');
        if (!response.ok) throw new Error('فشل تحميل البيانات.');
        
        const allProducts = await response.json();
        const rawProduct = allProducts.find(p => String(p.id) === String(productId));

        if (!rawProduct) throw new Error('المنتج غير موجود.');

        // تجهيز البيانات
        currentProduct = {
            id: String(rawProduct.id),
            name: rawProduct.title,
            description: rawProduct.description,
            category: rawProduct.category || 'عام',
            image: rawProduct.media?.main_image || 'https://via.placeholder.com/600',
            images: [
                (rawProduct.media?.main_image || 'https://via.placeholder.com/600'),
                ...(rawProduct.media?.gallery || [])
            ].filter(Boolean),
            regular_price: parseFloat(rawProduct.pricing?.regular || 0),
            sale_price: parseFloat(rawProduct.pricing?.sale || 0),
            availability: rawProduct.stock && rawProduct.stock !== '0' ? 'InStock' : 'OutOfStock',
            sku: rawProduct.id
        };

        // تحديث العنوان
        document.title = `${currentProduct.name} | سوق الكويت`;
        if(breadcrumbTitle) breadcrumbTitle.textContent = currentProduct.name;
        
        // تحميل التقييمات
        const reviews = JSON.parse(localStorage.getItem(`reviews_${currentProduct.id}`) || '[]');
        
        // **حقن السكيما الكاملة**
        injectSchema(currentProduct, reviews);
        
        renderProductDetails(currentProduct, container);
        renderReviews(reviews);

    } catch (error) {
        if(container) container.innerHTML = `<div class="col-span-2 text-center py-20 text-red-500">${error.message} <br> <a href="index.html" class="underline">عودة للرئيسية</a></div>`;
    }
}

function renderProductDetails(product, container) {
    const hasDiscount = product.sale_price > 0 && product.sale_price < product.regular_price;
    const price = hasDiscount ? product.sale_price : product.regular_price;
    
    const uniqueImages = [...new Set(product.images)];
    const galleryHTML = uniqueImages.length > 1 ? `
        <div class="flex gap-2 mt-4 overflow-x-auto hide-scrollbar pb-2">
            ${uniqueImages.map((img, idx) => `
                <button onclick="changeImage('${img}', this)" class="w-16 h-16 rounded border-2 ${idx === 0 ? 'border-primary' : 'border-transparent'} overflow-hidden"><img src="${img}" class="w-full h-full object-cover"></button>
            `).join('')}
        </div>` : '';

    container.innerHTML = `
        <div class="lg:col-span-1">
            <div class="bg-white rounded-xl border border-gray-100 p-4 sticky top-24">
                <div class="aspect-square relative overflow-hidden rounded-lg mb-2">
                    <img id="main-image" src="${product.image}" class="w-full h-full object-contain">
                    ${hasDiscount ? '<span class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">خصم</span>' : ''}
                </div>
                ${galleryHTML}
            </div>
        </div>
        <div class="lg:col-span-1 py-2">
            <div class="mb-4">
                <span class="bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full border border-blue-100">${product.category}</span>
            </div>
            <h1 class="text-2xl md:text-3xl font-bold mb-4 text-gray-900">${product.name}</h1>
            <div class="flex items-center gap-3 mb-6 border-b border-gray-100 pb-6">
                <span class="text-3xl font-bold text-primary">${price.toFixed(2)} KWD</span>
                ${hasDiscount ? `<span class="text-gray-400 line-through text-lg">${product.regular_price.toFixed(2)} KWD</span>` : ''}
            </div>
            
            <div class="prose text-gray-600 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100 text-sm leading-relaxed">
                <h3 class="font-bold text-gray-900 mb-2">التفاصيل:</h3>
                ${(product.description || 'لا يوجد وصف.').replace(/\n/g, '<br>')}
            </div>
            
            <button onclick="handleAddToCartClick()" class="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-800 transition flex items-center justify-center gap-2 mb-3">
                <i class="fa-solid fa-cart-plus"></i> أضف للسلة
            </button>
            <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(`مرحباً، أرغب بشراء المنتج:\n*${product.name}*\nالسعر: ${price.toFixed(2)} KWD`)}" target="_blank" class="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#20bd5a] transition flex items-center justify-center gap-2">
                <i class="fa-brands fa-whatsapp text-xl"></i> طلب سريع واتساب
            </a>
        </div>
    `;
}

// دالة الربط مع script.js
window.handleAddToCartClick = function() {
    if (!currentProduct) return;
    const price = currentProduct.sale_price > 0 ? currentProduct.sale_price : currentProduct.regular_price;
    
    if (window.addToCartGlobal) {
        window.addToCartGlobal({
            id: currentProduct.id,
            name: currentProduct.name,
            image: currentProduct.image,
            price: price,
            regular_price: currentProduct.regular_price
        });
        window.location.href = 'cart.html';
    } else {
        alert("خطأ: يرجى تحديث الصفحة");
    }
};

// --- السكيما الديناميكية ---
function injectSchema(product, reviews) {
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    const price = product.sale_price > 0 ? product.sale_price : product.regular_price;

    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images,
        "description": product.description ? product.description.substring(0, 160) : product.name,
        "sku": product.sku,
        "brand": { "@type": "Brand", "name": "Generic" },
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "KWD",
            "price": price.toFixed(2),
            "priceValidUntil": validUntil.toISOString().split('T')[0],
            "availability": `https://schema.org/${product.availability}`,
            "itemCondition": "https://schema.org/NewCondition"
        }
    };

    // إضافة التقييمات إذا وجدت
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
        const avgRating = (totalRating / reviews.length).toFixed(1);

        schema.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": avgRating,
            "reviewCount": reviews.length,
            "bestRating": "5",
            "worstRating": "1"
        };
        schema.review = {
            "@type": "Review",
            "reviewRating": { "@type": "Rating", "ratingValue": reviews[0].rating.toString() },
            "author": { "@type": "Person", "name": reviews[0].name },
            "datePublished": "2024-01-01"
        };
    }

    const script = document.getElementById('product-schema');
    if (script) script.textContent = JSON.stringify(schema, null, 2);
}

// Helper functions for UI
window.changeImage = function(src, btn) {
    document.getElementById('main-image').src = src;
    btn.parentElement.querySelectorAll('button').forEach(b => b.className = b.className.replace('border-primary', 'border-transparent'));
    btn.className = btn.className.replace('border-transparent', 'border-primary');
};

window.submitReview = function(e) {
    e.preventDefault();
    if (!currentProduct) return;
    const formData = new FormData(e.target);
    const newReview = {
        name: formData.get('name'),
        rating: parseInt(formData.get('rating')),
        comment: formData.get('comment'),
        date: new Date().toLocaleDateString('ar-KW')
    };
    
    const reviews = JSON.parse(localStorage.getItem(`reviews_${currentProduct.id}`) || '[]');
    reviews.unshift(newReview);
    localStorage.setItem(`reviews_${currentProduct.id}`, JSON.stringify(reviews));
    window.location.reload();
};

window.renderReviews = function(reviews) {
    const list = document.getElementById('reviews-list');
    const avgDisplay = document.getElementById('avg-rating-display');
    const countDisplay = document.getElementById('review-count-display');
    const starsDisplay = document.getElementById('avg-stars-display');

    if (reviews.length === 0) {
        if(list) list.innerHTML = '<p class="text-gray-400 text-center py-4">لا توجد تقييمات بعد.</p>';
        return;
    }

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = (total / reviews.length).toFixed(1);

    if(avgDisplay) avgDisplay.textContent = avg;
    if(countDisplay) countDisplay.textContent = `${reviews.length} تقييم`;
    if(starsDisplay) starsDisplay.innerHTML = '<i class="fa-solid fa-star"></i>'.repeat(Math.round(avg)) + '<i class="fa-regular fa-star"></i>'.repeat(5 - Math.round(avg));

    if(list) {
        list.innerHTML = reviews.map(r => `
            <div class="border-b border-gray-100 last:border-0 pb-4 mb-4">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <span class="font-bold text-sm block">${r.name}</span>
                        <div class="text-secondary text-xs">${'<i class="fa-solid fa-star"></i>'.repeat(r.rating)}</div>
                    </div>
                </div>
                <p class="text-gray-600 text-sm">${r.comment}</p>
            </div>
        `).join('');
    }
};
