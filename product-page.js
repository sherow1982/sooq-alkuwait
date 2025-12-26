// product-page.js

const STORE_CONFIG = {
    whatsappNumber: "201110760081",
    currency: "KWD",
    storeName: "سوق الكويت"
};

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

        const product = {
            id: rawProduct.id,
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

        document.title = `${product.name} | ${STORE_CONFIG.storeName}`;
        if(breadcrumbTitle) breadcrumbTitle.textContent = product.name;
        
        // تحميل التقييمات أولاً لحساب المتوسط للسكيما
        const reviews = JSON.parse(localStorage.getItem(`reviews_${product.id}`) || '[]');
        injectSchema(product, reviews);
        
        renderProductDetails(product, container);
        renderReviews(reviews); // عرض التقييمات

    } catch (error) {
        if(container) {
            container.innerHTML = `
                <div class="col-span-full text-center py-20">
                    <i class="fa-solid fa-triangle-exclamation text-3xl text-red-500 mb-4"></i>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">عذراً، حدث خطأ</h2>
                    <p class="text-gray-500 mb-8">${error.message}</p>
                    <a href="index.html" class="bg-primary text-white px-8 py-3 rounded-xl">العودة للرئيسية</a>
                </div>
            `;
        }
    }
}

function renderProductDetails(product, container) {
    const hasDiscount = product.sale_price > 0 && product.sale_price < product.regular_price;
    const price = hasDiscount ? product.sale_price : product.regular_price;
    const uniqueImages = [...new Set(product.images)];

    const galleryHTML = uniqueImages.length > 1 ? `
        <div class="flex gap-3 mt-4 overflow-x-auto hide-scrollbar pb-2">
            ${uniqueImages.map((img, idx) => `
                <button onclick="changeImage('${img}', this)" class="flex-shrink-0 w-20 h-20 rounded-lg border-2 ${idx === 0 ? 'border-primary' : 'border-transparent'} overflow-hidden hover:border-primary transition focus:outline-none bg-gray-50">
                    <img src="${img}" class="w-full h-full object-cover" alt="عرض ${idx + 1}">
                </button>
            `).join('')}
        </div>
    ` : '';

    container.innerHTML = `
        <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
                <div class="relative aspect-square rounded-xl overflow-hidden bg-white mb-4 group cursor-zoom-in" onmousemove="zoomImage(event)" onmouseleave="resetZoom(event)">
                    <img id="main-image" src="${product.image}" alt="${product.name}" class="w-full h-full object-contain transition-transform duration-200 origin-center">
                    ${hasDiscount ? `<span class="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm z-10">خصم</span>` : ''}
                </div>
                ${galleryHTML}
            </div>
        </div>

        <div class="lg:col-span-1 flex flex-col justify-start py-2">
            <div class="mb-4">
                <span class="inline-block bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3 border border-blue-100">${product.category}</span>
                <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4">${product.name}</h1>
                <div class="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
                    <div class="flex items-baseline gap-2">
                        <span class="text-4xl font-bold text-primary">${price.toFixed(2)}</span>
                        <span class="text-xl font-medium text-gray-600">${STORE_CONFIG.currency}</span>
                    </div>
                    ${hasDiscount ? `<span class="text-gray-400 line-through decoration-red-400 decoration-2">${product.regular_price.toFixed(2)} ${STORE_CONFIG.currency}</span>` : ''}
                </div>
            </div>

            <div class="prose text-gray-600 max-w-none mb-8 leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 class="text-gray-900 font-bold text-lg mb-3">تفاصيل المنتج</h3>
                <div dir="auto" class="text-base whitespace-pre-line">${(product.description || 'لا يوجد وصف متاح.').replace(/\n/g, '<br>')}</div>
            </div>

            <div class="mt-auto space-y-4">
                <button onclick="addToCartAndRedirect('${product.id}')" class="w-full bg-primary text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:bg-blue-800 transition flex items-center justify-center gap-3">
                    <i class="fa-solid fa-cart-plus"></i> أضف للسلة
                </button>
                <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(`مرحباً، أرغب بشراء المنتج:\n*${product.name}*\nالسعر: ${price.toFixed(2)} ${STORE_CONFIG.currency}`)}" target="_blank" class="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-lg font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-3">
                    <i class="fa-brands fa-whatsapp text-2xl"></i> طلب سريع بالواتساب
                </a>
            </div>
        </div>
    `;
}

// دالة إضافة سريعة للسلة
function addToCartAndRedirect(productId) {
    // محاكاة لدالة الإضافة للسلة الموجودة في script.js
    // يجب دمج هذا الملف مع script.js أو تحميل script.js قبله
    let cart = JSON.parse(localStorage.getItem('souq_cart') || '[]');
    // ... منطق الإضافة (يمكن تكراره هنا للأمان أو الاعتماد على دالة عامة)
    // للتسهيل، سنوجه لصفحة السلة مباشرة
    window.location.href = 'cart.html'; 
}

// وظائف الصور
window.changeImage = function(src, btn) {
    const mainImg = document.getElementById('main-image');
    mainImg.style.opacity = '0.5';
    setTimeout(() => { mainImg.src = src; mainImg.style.opacity = '1'; }, 150);
    document.querySelectorAll('#product-details-container button').forEach(b => b.classList.replace('border-primary', 'border-transparent'));
    btn.classList.replace('border-transparent', 'border-primary');
};

window.zoomImage = function(e) {
    const img = e.target;
    const rect = img.parentElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    img.style.transformOrigin = `${x}px ${y}px`;
    img.style.transform = "scale(1.8)";
};

window.resetZoom = function(e) {
    const img = e.target.querySelector('img') || e.target;
    if(img.tagName === 'IMG') { img.style.transform = "scale(1)"; }
};

// وظائف التقييمات
window.submitReview = function(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if(!productId) return;

    const newReview = {
        id: Date.now(),
        name: formData.get('name'),
        rating: parseInt(formData.get('rating')),
        comment: formData.get('comment'),
        date: new Date().toLocaleDateString('ar-KW')
    };

    const reviews = JSON.parse(localStorage.getItem(`reviews_${productId}`) || '[]');
    reviews.unshift(newReview);
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));

    renderReviews(reviews);
    form.reset();
    form.classList.add('hidden');
    
    // تحديث الصفحة لإعادة حقن السكيما (اختياري)
    location.reload(); 
};

window.renderReviews = function(reviews) {
    const list = document.getElementById('reviews-list');
    const avgDisplay = document.getElementById('avg-rating-display');
    const countDisplay = document.getElementById('review-count-display');
    const starsDisplay = document.getElementById('avg-stars-display');

    if (reviews.length === 0) {
        list.innerHTML = '<p class="text-gray-400 text-center py-4">لا توجد تقييمات بعد.</p>';
        return;
    }

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = (total / reviews.length).toFixed(1);

    avgDisplay.textContent = avg;
    countDisplay.textContent = `بناءً على ${reviews.length} تقييم`;
    starsDisplay.innerHTML = generateStars(Math.round(avg));

    list.innerHTML = reviews.map(r => `
        <div class="border-b border-gray-100 last:border-0 pb-4 mb-4">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <span class="font-bold text-sm block text-gray-900">${r.name}</span>
                    <div class="text-secondary text-xs mt-1">${generateStars(r.rating)}</div>
                </div>
                <span class="text-xs text-gray-400">${r.date}</span>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed">${r.comment}</p>
        </div>
    `).join('');
};

function generateStars(count) {
    return '<i class="fa-solid fa-star"></i>'.repeat(count) + '<i class="fa-regular fa-star"></i>'.repeat(5 - count);
}

// السكيما
function injectSchema(product, reviews) {
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    
    // حساب التقييم الفعلي من المراجعات المخزنة
    let reviewCount = reviews.length;
    let ratingValue = 5;
    
    if (reviewCount > 0) {
        const total = reviews.reduce((sum, r) => sum + r.rating, 0);
        ratingValue = (total / reviewCount).toFixed(1);
    }

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
            "priceCurrency": STORE_CONFIG.currency,
            "price": (product.sale_price > 0 ? product.sale_price : product.regular_price).toFixed(2),
            "priceValidUntil": validUntil.toISOString().split('T')[0],
            "availability": `https://schema.org/${product.availability}`,
            "itemCondition": "https://schema.org/NewCondition"
        }
    };

    // إضافة بيانات التقييم إذا وجدت
    if (reviewCount > 0) {
        schema.aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": ratingValue,
            "reviewCount": reviewCount,
            "bestRating": "5",
            "worstRating": "1"
        };
        // إضافة أحدث مراجعة
        schema.review = {
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": reviews[0].rating.toString(),
                "bestRating": "5"
            },
            "author": {
                "@type": "Person",
                "name": reviews[0].name
            },
            "datePublished": "2024-01-01" // يمكن تحسين هذا بحفظ تاريخ بصيغة ISO
        };
    }

    const script = document.getElementById('product-schema');
    if (script) script.textContent = JSON.stringify(schema, null, 2);
}
