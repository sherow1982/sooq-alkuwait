// ═══════════════════════════════════════════════════════════════════
// 📦 نظام تحميل بيانات المنتجات الديناميكي
// يقوم بسحب البيانات من products_data.json وملء الصفحة تلقائياً
// ═══════════════════════════════════════════════════════════════════

// تحميل بيانات المنتجات من ملف JSON
async function loadProductData() {
    try {
        // الحصول على معرف المنتج من اسم الملف الحالي
        const currentPage = window.location.pathname;
        const match = currentPage.match(/product-(\d+)-/);
        
        if (!match) {
            console.error('❌ لم يتم العثور على معرف المنتج في URL');
            return;
        }
        
        const productId = parseInt(match[1]);
        console.log(`🔍 جاري تحميل المنتج رقم: ${productId}`);
        
        // تحميل بيانات JSON
        const response = await fetch('../products_data.json');
        
        if (!response.ok) {
            throw new Error('فشل تحميل ملف البيانات');
        }
        
        const products = await response.json();
        console.log(`✅ تم تحميل ${products.length} منتج`);
        
        // البحث عن المنتج المطابق
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            console.error(`❌ المنتج رقم ${productId} غير موجود`);
            return;
        }
        
        console.log(`✅ تم العثور على المنتج:`, product.title);
        
        // تحديث بيانات الصفحة
        updatePageData(product);
        
    } catch (error) {
        console.error('❌ خطأ في تحميل بيانات المنتج:', error);
    }
}

// تحديث جميع بيانات الصفحة
function updatePageData(product) {
    console.log('🔄 جاري تحديث بيانات الصفحة...');
    
    // حساب نسبة الخصم
    const discountPercent = Math.round(((product.price - product.sale_price) / product.price) * 100);
    
    // ═══════════════ تحديث Meta Tags ═══════════════
    
    // تحديث عنوان الصفحة
    document.title = `${product.title} | سوق الكويت`;
    
    // تحديث Description Meta
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.content = `${product.title}، متوفر الآن في سوق الكويت مع شحن مجاني`;
    }
    
    // تحديث Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
        canonical.href = window.location.href;
    }
    
    // تحديث Open Graph Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = product.title;
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = `${product.title}، متوفر الآن في سوق الكويت`;
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.content = product.image_link;
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = window.location.href;
    
    // ═══════════════ تحديث محتوى الصفحة ═══════════════
    
    // تحديث صورة المنتج
    const productImage = document.querySelector('.product-image-container img');
    if (productImage) {
        productImage.src = product.image_link;
        productImage.alt = product.title;
        console.log('✅ تم تحديث الصورة');
    }
    
    // تحديث عنوان المنتج
    const productTitle = document.querySelector('.product-title');
    if (productTitle) {
        productTitle.textContent = product.title;
        console.log('✅ تم تحديث العنوان');
    }
    
    // ═══════════════ تحديث السعر ═══════════════
    
    const priceBox = document.querySelector('.price-box');
    const newPrice = document.querySelector('.new-price');
    
    if (newPrice) {
        newPrice.textContent = `${product.sale_price.toFixed(2)} د.ك`;
    }
    
    // إضافة السعر القديم وشارة الخصم إذا كان هناك خصم
    if (priceBox && product.price !== product.sale_price) {
        // التحقق من عدم وجود السعر القديم مسبقاً
        if (!priceBox.querySelector('.old-price')) {
            const oldPriceDiv = document.createElement('div');
            oldPriceDiv.className = 'old-price';
            oldPriceDiv.textContent = `${product.price.toFixed(2)} د.ك`;
            priceBox.insertBefore(oldPriceDiv, newPrice);
            
            const discountBadge = document.createElement('div');
            discountBadge.className = 'discount-badge';
            discountBadge.textContent = `وفّر ${discountPercent}%`;
            priceBox.appendChild(discountBadge);
            
            console.log(`✅ تم إضافة الخصم: ${discountPercent}%`);
        }
    }
    
    // ═══════════════ تحديث الوصف ═══════════════
    
    if (product.description && product.description.trim() !== '') {
        let descriptionBox = document.querySelector('.description-box');
        
        if (!descriptionBox) {
            // إنشاء صندوق الوصف إذا لم يكن موجوداً
            descriptionBox = document.createElement('div');
            descriptionBox.className = 'description-box';
            
            const heading = document.createElement('h4');
            heading.textContent = '📋 وصف المنتج';
            heading.style.marginBottom = '15px';
            heading.style.fontWeight = '700';
            heading.style.color = '#2c3e50';
            
            const descText = document.createElement('p');
            descText.textContent = product.description;
            descText.style.margin = '0';
            descText.style.color = '#555';
            descText.style.lineHeight = '1.8';
            
            descriptionBox.appendChild(heading);
            descriptionBox.appendChild(descText);
            
            // إدراجه قبل قسم الواتساب
            const whatsappSection = document.querySelector('.whatsapp-section');
            if (whatsappSection) {
                whatsappSection.parentNode.insertBefore(descriptionBox, whatsappSection);
                console.log('✅ تم إضافة الوصف');
            }
        }
    }
    
    // ═══════════════ تحديث روابط الواتساب ═══════════════
    
    const productUrl = window.location.href;
    const whatsappText = encodeURIComponent(
        `مرحباً! 👋\n\n` +
        `أرغب بطلب المنتج التالي:\n` +
        `━━━━━━━━━━━━━━━\n` +
        `📦 المنتج: ${product.title}\n` +
        `💰 السعر: ${product.sale_price.toFixed(2)} د.ك\n` +
        `🔗 الرابط: ${productUrl}\n` +
        `━━━━━━━━━━━━━━━\n\n` +
        `برجاء إرسال البيانات لإتمام الطلب:\n` +
        `✅ اسمك:\n` +
        `✅ عنوانك:\n` +
        `✅ عدد القطع:\n` +
        `✅ رقم هاتف آخر (إن وجد):\n\n` +
        `شكراً 🌟`
    );
    
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href="#"]');
    whatsappLinks.forEach(link => {
        link.href = `https://wa.me/201110760081?text=${whatsappText}`;
    });
    
    console.log('✅ تم تحديث روابط الواتساب');
    
    // ═══════════════ تحديث شارة الفئة ═══════════════
    
    const ratingBadge = document.querySelector('.rating-badge');
    if (ratingBadge && product.category) {
        ratingBadge.innerHTML = `⭐ 4.9 (5 تقييم) - ${product.category}`;
        console.log('✅ تم تحديث الفئة');
    }
    
    console.log('✨ اكتمل تحميل بيانات المنتج بنجاح!');
}

// ═══════════════ تشغيل عند تحميل الصفحة ═══════════════
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تحميل بيانات المنتج...');
    loadProductData();
});

// ═══════════════ معالجة الأخطاء العامة ═══════════════
window.addEventListener('error', function(e) {
    console.error('❌ خطأ في الصفحة:', e.message);
});
