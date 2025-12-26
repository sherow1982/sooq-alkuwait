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
        // تم التعديل للبحث بـ 'id' أو 'product' لدعم الروابط القديمة والجديدة
        const productId = urlParams.get('id') || urlParams.get('product');

        if (!productId) {
            throw new Error('لم يتم العثور على المنتج.');
        }

        const response = await fetch('products_data_cleaned.json');
        if (!response.ok) {
            throw new Error('فشل تحميل بيانات المنتجات.');
        }
        
        const allProducts = await response.json();

        // 1. البحث باستخدام ID (مع تحويل النوع لـ String للمقارنة الآمنة)
        const rawProduct = allProducts.find(p => String(p.id) === String(productId));

        if (!rawProduct) {
            throw new Error('المنتج المطلوب غير موجود.');
        }

        // 2. ترجمة البيانات (Mapping) لتناسب دالة العرض
        // هذا هو الجزء الحاسم لربط ملف JSON المعقد بالكود البسيط
        const cleanProduct = {
            id: rawProduct.id,
            name: rawProduct.title,
            description: rawProduct.description,
            category: rawProduct.category || 'عام',
            // استخراج الصور
            image: rawProduct.media?.main_image || 'https://via.placeholder.com/400',
            images: [
                (rawProduct.media?.main_image || 'https://via.placeholder.com/400'),
                ...(rawProduct.media?.gallery || [])
            ],
            // استخراج الأسعار كأرقام
            regular_price: parseFloat(rawProduct.pricing?.regular || 0),
            sale_price: parseFloat(rawProduct.pricing?.sale || 0)
        };

        renderProductDetails(cleanProduct, container);
        
        document.title = `${cleanProduct.name} | سوق الكويت`;

    } catch (error) {
        if(container) {
            container.innerHTML = `
                <div class="text-center py-20 text-red-500">
                    <i class="fa-solid fa-exclamation-triangle text-4xl mb-4"></i>
                    <h2 class="text-2xl font-bold">خطأ</h2>
                    <p class="mt-2">${error.message}</p>
                    <a href="index.html" class="mt-6 inline-block bg-primary text-white px-6 py-2 rounded-full">العودة للصفحة الرئيسية</a>
                </div>
            `;
        }
        console.error('Error loading product:', error);
    }
}

function renderProductDetails(product, container) {
    if(!container) return;

    // تحديد السعر الفعلي للعرض
    const hasDiscount = product.sale_price > 0 && product.sale_price < product.regular_price;
    const price = hasDiscount ? product.sale_price : product.regular_price;

    // بناء معرض الصور (Gallery)
    let imageGalleryHTML = '';
    // نتأكد أن المصفوفة فريدة (Unique) ولا نكرر الصورة الرئيسية إذا كانت موجودة أصلاً في القائمة
    const uniqueImages = [...new Set(product.images)]; 
    
    if (uniqueImages.length > 1) {
        imageGalleryHTML = `
            <div class="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                ${uniqueImages.map((img, index) => `
                    <img 
                        src="${img}" 
                        alt="صورة ${index + 1}" 
                        class="w-20 h-20 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-primary transition" 
                        onclick="document.getElementById('main-product-image').src='${img}'"
                    >
                `).join('')}
            </div>
        `;
    }

    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-sm">
            <!-- قسم الصور -->
            <div class="md:col-span-1">
                <div class="flex items-center justify-center bg-gray-50 rounded-lg p-4 border border-gray-100 overflow-hidden relative">
                    <img id="main-product-image" src="${product.image}" alt="${product.name}" class="max-h-[450px] w-full object-contain transition-transform hover:scale-105 duration-500">
                    ${hasDiscount ? '<span class="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow">خصم خاص</span>' : ''}
                </div>
                ${imageGalleryHTML}
            </div>

            <!-- قسم التفاصيل -->
            <div class="md:col-span-1 flex flex-col">
                <div class="text-sm text-gray-500 font-medium mb-2 bg-gray-100 w-fit px-3 py-1 rounded-full">${product.category}</div>
                
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">${product.name}</h1>
                
                <div class="flex items-baseline gap-3 mb-6 border-b border-gray-100 pb-6">
                    <span class="text-3xl font-bold text-primary">${price.toFixed(2)} ${STORE_CONFIG.currency}</span>
                    ${hasDiscount ? `<span class="text-lg text-gray-400 line-through decoration-red-400">${product.regular_price.toFixed(2)} ${STORE_CONFIG.currency}</span>` : ''}
                </div>
                
                <div class="prose prose-sm text-gray-600 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar" dir="auto">
                    <h3 class="text-gray-900 font-bold mb-2 text-lg">تفاصيل المنتج:</h3>
                    ${(product.description || 'لا يوجد وصف متاح.').replace(/\n/g, '<br>')}
                </div>
                
                <div class="mt-auto flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                    <a href="https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(`مرحباً، أود طلب المنتج:\n*${product.name}*\nالسعر: ${price.toFixed(2)} ${STORE_CONFIG.currency}`)}" 
                       target="_blank" 
                       class="flex-1 bg-[#25D366] text-white py-3.5 rounded-xl font-bold hover:bg-[#20bd5a] transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
                        <i class="fa-brands fa-whatsapp text-2xl"></i>
                        <span>اطلب الآن عبر واتساب</span>
                    </a>
                    
                    <a href="index.html" class="px-6 py-3.5 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition font-medium text-center">
                        متابعة التسوق
                    </a>
                </div>
            </div>
        </div>
    `;
}
