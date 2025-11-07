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
                <li><a href="/categories.html"><i class="fas fa-tags"></i> الفئات</a></li>
                <li><a href="/offers.html"><i class="fas fa-fire"></i> العروض</a></li>
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
            <a href="/categories.html"><i class="fas fa-tags"></i> الفئات</a>
            <a href="/offers.html"><i class="fas fa-fire"></i> العروض</a>
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
