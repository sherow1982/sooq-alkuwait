// سكريبت لإزالة المواصفات الثابتة من جميع صفحات المنتجات
// يتم تشغيله في المتصفح على أي صفحة منتج

// المواصفات الثابتة التي يجب إزالتها
const FIXED_SPECS_TO_REMOVE = [
    'العلامة التجارية', 
    'بلد الصنع',
    'ضمان المنتج',
    'حالة المنتج',
    'المواد',
    'الاستخدام',
    'المتانة',
    'التصميم'
];

// دالة لإزالة المواصفات الثابتة
function removeFixedSpecs() {
    console.log('🛠️ بدء إزالة المواصفات الثابتة...');
    
    // العثور على جميع عناصر المواصفات
    const specItems = document.querySelectorAll('.spec-item');
    let removedCount = 0;
    
    specItems.forEach(item => {
        const specLabel = item.querySelector('.fw-bold');
        if (specLabel) {
            const labelText = specLabel.textContent.trim();
            
            // فحص إذا كان هذا المواصفة من المواصفات الثابتة
            const shouldRemove = FIXED_SPECS_TO_REMOVE.some(fixedSpec => 
                labelText.includes(fixedSpec)
            );
            
            // إزالة المواصفات العامة أيضاً
            const isGeneric = [
                'عالية الجودة',
                'سهل ومريح', 
                'طويلة الأمد',
                'عصري وأنيق'
            ].some(generic => item.textContent.includes(generic));
            
            if (shouldRemove || isGeneric) {
                console.log(`❌ إزالة: ${labelText}`);
                item.remove();
                removedCount++;
            }
        }
    });
    
    console.log(`✅ تم إزالة ${removedCount} مواصفة ثابتة`);
    
    // إضافة رقم المنتج فقط إذا لم يكن موجوداً
    const specsContainer = document.querySelector('.specifications');
    if (specsContainer && !document.querySelector('[data-spec="product-id"]')) {
        // استخراج رقم المنتج من URL
        const urlParts = window.location.pathname.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const productIdMatch = fileName.match(/product-(\d+)-/);
        const productId = productIdMatch ? productIdMatch[1].padStart(4, '0') : '0001';
        
        // إضافة رقم المنتج في البداية
        const productIdSpec = document.createElement('div');
        productIdSpec.className = 'spec-item';
        productIdSpec.setAttribute('data-spec', 'product-id');
        productIdSpec.innerHTML = `<span class="fw-bold">رقم المنتج</span><span>SOOQ-${productId}</span>`;
        
        const firstChild = specsContainer.querySelector('.spec-item');
        if (firstChild) {
            specsContainer.insertBefore(productIdSpec, firstChild);
        } else {
            specsContainer.appendChild(productIdSpec);
        }
        
        console.log(`✅ تم إضافة رقم المنتج: SOOQ-${productId}`);
    }
}

// تشغيل السكريبت عند تحميل الصفحة
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('💬 تم تحميل الصفحة، جاري إزالة المواصفات الثابتة...');
        removeFixedSpecs();
    });
}

// تصدير الدالة لاستخدامها في Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { removeFixedSpecs, FIXED_SPECS_TO_REMOVE };
}