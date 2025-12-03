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
            
            <div class="header-search">
                <input type="search" id="header-search-input" placeholder="ابحث عن منتج..." autocomplete="off">
                <button type="button" class="search-btn"><i class="fas fa-search"></i></button>
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
            <div class="mobile-search">
                <input type="search" id="mobile-search-input" placeholder="ابحث عن منتج..." autocomplete="off">
                <button type="button" class="search-btn"><i class="fas fa-search"></i></button>
            </div>
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
    
    <style>
    .header-search { 
        flex: 1; 
        max-width: 500px; 
        margin: 0 2rem; 
        display: flex; 
        gap: 0.5rem;
    }
    .header-search input { 
        flex: 1; 
        padding: 0.7rem 1rem; 
        border: 1px solid #ddd; 
        border-radius: 8px; 
        font-size: 0.95rem;
        font-family: 'Tajawal', sans-serif;
    }
    .header-search .search-btn,
    .mobile-search .search-btn { 
        padding: 0.7rem 1.5rem; 
        background: #667eea; 
        color: white; 
        border: none; 
        border-radius: 8px; 
        cursor: pointer;
    }
    .mobile-search { 
        display: flex; 
        gap: 0.5rem; 
        padding: 1rem; 
        border-bottom: 1px solid #eee;
    }
    .mobile-search input { 
        flex: 1; 
        padding: 0.7rem 1rem; 
        border: 1px solid #ddd; 
        border-radius: 8px;
        font-family: 'Tajawal', sans-serif;
    }
    @media (max-width: 768px) {
        .header-search { display: none; }
    }
    </style>
    `;
    
    const headerPlaceholder = document.getElementById('site-header');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }
    
    // Search functionality
    setTimeout(() => {
        const searchInputs = [document.getElementById('header-search-input'), document.getElementById('mobile-search-input')];
        searchInputs.forEach(input => {
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const query = input.value.trim();
                        if (query) {
                            window.location.href = `/products-catalog.html?q=${encodeURIComponent(query)}`;
                        }
                    }
                });
            }
        });
        
        const searchBtns = document.querySelectorAll('.search-btn');
        searchBtns.forEach((btn, idx) => {
            btn.addEventListener('click', () => {
                const input = searchInputs[idx];
                if (input) {
                    const query = input.value.trim();
                    if (query) {
                        window.location.href = `/products-catalog.html?q=${encodeURIComponent(query)}`;
                    }
                }
            });
        });
    }, 100);
}

function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) {
        mobileNav.classList.toggle('show');
    }
}

document.addEventListener('DOMContentLoaded', renderHeader);
