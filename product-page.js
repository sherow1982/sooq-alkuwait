// product-page.js

const STORE_CONFIG = {
    whatsappNumber: "201110760081",
    currency: "KWD"
};

document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
});

async function loadProductDetails() {
    const container = document.getElementById('product-details-container');
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productSlug = urlParams.get('product');

        if (!productSlug) {
            throw new Error('لم يتم العثور على المنتج.');
        }

        const response = await fetch('products_data_cleaned.json');
        if (!response.ok) {
            throw new Error('فشل تحميل بيانات المنتجات.');
        }
        const allProducts = await response.json();

        const product = allProducts.find(p => p.slug === productSlug);

        if (!product) {
            throw new Error('المنتج المطلوب غير موجود.');
        }

        renderProductDetails(product, container);
        // Update page title
        document.title = `${product.name} | سوق الكويت`;

    } catch (error) {
        container.innerHTML = `
            <div class="text-center py-20 text-red-500">
                <i class="fa-solid fa-exclamation-triangle text-4xl mb-4"></i>
                <h2 class="text-2xl font-bold">خطأ</h2>
                <p class="mt-2">${error.message}</p>
                <a href="index.html" class="mt-6 inline-block bg-primary text-white px-6 py-2 rounded-full">العودة للصفحة الرئيسية</a>
            </div>
        `;
        console.error('Error loading product:', error);
    }
}

function renderProductDetails(product, container) {
    const price = product.sale_price > 0 ? product.sale_price : product.regular_price;
    const hasDiscount = product.sale_price > 0 && product.sale_price < product.regular_price;

    // Image gallery
    let imageGalleryHTML = '';
    if (product.images && product.images.length > 0) {
        const allImages = [product.image, ...product.images.filter(img => img !== product.image)];
        imageGalleryHTML = `
            <div class="flex gap-2 mt-4 overflow-x-auto pb-2">
                ${allImages.map(img => `
                    <img src="${img || 'https://via.placeholder.com/300'}" alt="صورة إضافية" class="w-20 h-20 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-primary transition" onclick="document.getElementById('main-product-image').src='${img}'">
                `).join('')}
            </div>
        `;
    }

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="md:col-span-1">
                <div class="flex items-center justify-center bg-gray-100 rounded-lg p-4">
                    <img id="main-product-image" src="${product.image || 'https://via.placeholder.com/400'}" alt="${product.name}" class="max-h-[450px] object-contain">
                </div>
                ${imageGalleryHTML}
            </div>
            <div class="md:col-span-1 flex flex-col">
                <div class="text-sm text-primary font-bold mb-2">${product.category}</div>
                <h1 class="text-3xl font-bold text-gray-900 mb-4">${product.name}</h1>
                <div class="flex items-baseline gap-3 mb-6">
                    <span class="text-3xl font-bold text-primary">${price.toFixed(2)} ${STORE_CONFIG.currency}</span>
                    ${hasDiscount ? `<span class="text-lg text-gray-400 line-through">${product.regular_price.toFixed(2)} ${STORE_CONFIG.currency}</span>` : ''}
                </div>
                <div class="prose text-gray-700 mb-8 max-h-60 overflow-y-auto" dir="auto">
                    ${(product.description || '').replace(/\n/g, '<br>')}
                </div>
                <div class="mt-auto flex gap-4">
                    <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(`مرحباً، أود طلب المنتج: ${product.name} - ${price.toFixed(2)} ${STORE_CONFIG.currency}`)}" target="_blank" class="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-lg">
                        <i class="fa-brands fa-whatsapp text-xl"></i>
                        اطلب الآن عبر واتساب
                    </a>
                    <a href="index.html" class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                        متابعة التسوق
                    </a>
                </div>
            </div>
        </div>
    `;
}