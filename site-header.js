// 📋 Header Component - يستخدم في جميع صفحات الموقع

function renderHeader() {
    const headerHTML = `
    <nav class="site-header">
        <div class="header-container">
            <div class="logo">
                <a href="/index.html">
                    <i class="fas fa-store"></i>
                    <span>سوق الكويت</span>
                </a>
            </div>
            
            <ul class="main-nav">
                <li><a href="/index.html"><i class="fas fa-home"></i> الرئيسية</a></li>
                <li><a href="/products-catalog.html"><i class="fas fa-shopping-bag"></i> المنتجات</a></li>
                <li><a href="/about.html"><i class="fas fa-info-circle"></i> من نحن</a></li>
                <li><a href="/privacy-policy.html"><i class="fas fa-shield-alt"></i> الخصوصية</a></li>
                <li><a href="/return-policy.html"><i class="fas fa-undo"></i> الاسترجاع</a></li>
                <li><a href="/shipping-policy.html"><i class="fas fa-shipping-fast"></i> الشحن</a></li>
                <li><a href="/terms-conditions.html"><i class="fas fa-file-contract"></i> الشروط</a></li>
                <li><a href="/contact.html"><i class="fas fa-envelope"></i> اتصل بنا</a></li>
            </ul>
            
            <div class="header-actions">
                <a href="https://wa.me/201110760081" target="_blank" class="btn-whatsapp-header">
                    <i class="fab fa-whatsapp"></i>
                    <span>واتساب</span>
                </a>
            </div>
            
            <button class="mobile-menu-btn" onclick="toggleMobileMenu()">
                <i class="fas fa-bars"></i>
            </button>
        </div>
        
        <div class="mobile-nav" id="mobile-nav">
            <a href="/index.html"><i class="fas fa-home"></i> الرئيسية</a>
            <a href="/products-catalog.html"><i class="fas fa-shopping-bag"></i> المنتجات</a>
            <a href="/about.html"><i class="fas fa-info-circle"></i> من نحن</a>
            <a href="/privacy-policy.html"><i class="fas fa-shield-alt"></i> الخصوصية</a>
            <a href="/return-policy.html"><i class="fas fa-undo"></i> الاسترجاع</a>
            <a href="/shipping-policy.html"><i class="fas fa-shipping-fast"></i> الشحن</a>
            <a href="/terms-conditions.html"><i class="fas fa-file-contract"></i> الشروط</a>
            <a href="/contact.html"><i class="fas fa-envelope"></i> اتصل بنا</a>
            <a href="https://wa.me/201110760081" target="_blank"><i class="fab fa-whatsapp"></i> واتساب</a>
        </div>
    </nav>
    `;
    
    const headerPlaceholder = document.getElementById('site-header');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }
}

function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) {
        mobileNav.classList.toggle('show');
    }
}

document.addEventListener('DOMContentLoaded', renderHeader);
