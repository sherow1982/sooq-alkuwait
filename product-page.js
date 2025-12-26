// product-page.js

const STORE_CONFIG = {
    whatsappNumber: "201110760081",
    currency: "KWD",
    storeName: "سوق الكويت",
    storeUrl: window.location.origin + window.location.pathname.replace('product.html', '')
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

        // تنظيف البيانات وتحويلها
        const product = {
            id: rawProduct.id,
            name: rawProduct.title,
            description: rawProduct.description,
            category: rawProduct.category || 'عام',
            image: rawProduct.media?.main_image || 'https://via.placeholder.com/600',
            images: [
                (rawProduct.media?.main_image || 'https://via.placeholder.com/600'),
                ...(rawProduct.media?.gallery || [])
            ].filter(Boolean), // إزالة أي روابط فارغة
            regular_price: parseFloat(rawProduct.pricing?.regular || 0),
            sale_price: parseFloat(rawProduct.pricing?.sale || 0),
            availability: rawProduct.stock && rawProduct.stock !== '0' ? 'InStock' : 'OutOfStock',
            sku: rawProduct.id
        };

        // تحديث العنوان والسكيما
        document.title = `${product.name} | ${STORE_CONFIG.storeName}`;
        if(breadcrumbTitle) breadcrumbTitle.textContent = product.name;
        injectSchema(product);
        
        renderProductDetails(product, container);

    } catch (error) {
        if(container) {
            container.innerHTML = `
                <div class="col-span-full text-center py-20">
                    <div class="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6">
                        <i class="fa-solid fa-triangle-exclamation text-3xl text-red-500"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">عذراً، حدث خطأ</h2>
                    <p class="text-gray-500 mb-8">${error.message}</p>
                    <a href="index.html" class="bg-primary text-white px-8 py-3 rounded-xl hover:bg-blue-800 transition shadow-lg">
                        العودة للصفحة الرئيسية
                    </a>
                </div>
            `;
        }
    }
}

function renderProductDetails(product, container) {
    const hasDiscount = product.sale_price > 0 && product.sale_price < product.regular_price;
    const price = hasDiscount ? product.sale_price : product.regular_price;
    const discountPercent = hasDiscount ? Math.round(((product.regular_price - product.sale_price) / product.regular_price) * 100) : 0;
    
    // إزالة التكرار من الصور
    const uniqueImages = [...new Set(product.images)];

    // HTML المعرض
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
        <!-- قسم الصور -->
        <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
                <div class="relative aspect-square rounded-xl overflow-hidden bg-white mb-4 group cursor-zoom-in" onmousemove="zoomImage(event)" onmouseleave="resetZoom(event)">
                    <img id="main-image" src="${product.image}" alt="${product.name}" class="w-full h-full object-contain transition-transform duration-200 origin-center">
                    
                    ${hasDiscount ? `<span class="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm z-10">خصم ${discountPercent}%</span>` : ''}
                </div>
                ${galleryHTML}
            </div>
        </div>

        <!-- قسم التفاصيل -->
        <div class="lg:col-span-1 flex flex-col justify-start py-2">
            <div class="mb-4">
                <span class="inline-block bg-blue-50 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3 border border-blue-100">
                    ${product.category}
                </span>
                <h1 class="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">${product.name}</h1>
                
                <div class="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
                    <div class="flex items-baseline gap-2">
                        <span class="text-4xl font-bold text-primary">${price.toFixed(2)}</span>
                        <span class="text-xl font-medium text-gray-600">${STORE_CONFIG.currency}</span>
                    </div>
                    ${hasDiscount ? `
                        <div class="flex flex-col text-sm">
                            <span class="text-gray-400 line-through decoration-red-400 decoration-2">${product.regular_price.toFixed(2)} ${STORE_CONFIG.currency}</span>
                            <span class="text-green-600 font-bold">وفرت ${(product.regular_price - product.sale_price).toFixed(2)} ${STORE_CONFIG.currency}</span>
                        </div>
                    ` : ''}
                </div>
            </div>

            <!-- الوصف -->
            <div class="prose prose-lg text-gray-600 max-w-none mb-8 leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100">
                <h3 class="text-gray-900 font-bold text-lg mb-3 flex items-center gap-2">
                    <i class="fa-solid fa-circle-info text-secondary"></i> تفاصيل المنتج
                </h3>
                <div dir="auto" class="text-base whitespace-pre-line">
                    ${(product.description || 'لا يوجد وصف متاح حالياً.').replace(/\n/g, '<br>')}
                </div>
            </div>

            <!-- أزرار الإجراءات -->
            <div class="mt-auto space-y-4">
                <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(`مرحباً، أرغب بشراء المنتج:\n*${product.name}*\nالسعر: ${price.toFixed(2)} ${STORE_CONFIG.currency}`)}" 
                   target="_blank" 
                   class="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-green-200 transition transform hover:-translate-y-1 flex items-center justify-center gap-3">
                    <i class="fa-brands fa-whatsapp text-2xl"></i>
                    <span>اطلب الآن عبر واتساب</span>
                </a>
                
                <div class="flex gap-4 text-sm text-gray-500 justify-center pt-4 border-t border-gray-100">
                    <span class="flex items-center gap-1"><i class="fa-solid fa-shield-halved text-primary"></i> دفع آمن</span>
                    <span class="flex items-center gap-1"><i class="fa-solid fa-truck-fast text-primary"></i> توصيل سريع</span>
                    <span class="flex items-center gap-1"><i class="fa-solid fa-rotate text-primary"></i> استرجاع سهل</span>
                </div>
            </div>
        </div>
    `;
}

// وظائف الصور (Zoom & Gallery)
window.changeImage = function(src, btn) {
    const mainImg = document.getElementById('main-image');
    // تأثير تلاشي بسيط
    mainImg.style.opacity = '0.5';
    setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = '1';
    }, 150);

    // تحديث الإطار النشط
    document.querySelectorAll('#product-details-container button').forEach(b => {
        b.classList.remove('border-primary');
        b.classList.add('border-transparent');
    });
    btn.classList.remove('border-transparent');
    btn.classList.add('border-primary');
};

window.zoomImage = function(e) {
    const img = e.target;
    const container = img.parentElement;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    img.style.transformOrigin = `${x}px ${y}px`;
    img.style.transform = "scale(1.8)"; // قوة التكبير
};

window.resetZoom = function(e) {
    const img = e.target.querySelector('img') || e.target; // التعامل مع الحاوية أو الصورة
    if(img.tagName === 'IMG') {
        img.style.transformOrigin = "center center";
        img.style.transform = "scale(1)";
    }
};

// حقن السكيما (SEO)
function injectSchema(product) {
    const price = product.sale_price > 0 ? product.sale_price : product.regular_price;
    
    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images,
        "description": product.description ? product.description.substring(0, 160) : product.name,
        "sku": product.sku,
        "brand": {
            "@type": "Brand",
            "name": "Generic"
        },
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": STORE_CONFIG.currency,
            "price": price.toFixed(2),
            "availability": `https://schema.org/${product.availability}`,
            "itemCondition": "https://schema.org/NewCondition"
        }
    };

    const script = document.getElementById('product-schema');
    if (script) {
        script.textContent = JSON.stringify(schema, null, 2);
    }
}
