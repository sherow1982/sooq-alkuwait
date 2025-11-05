/**
 * مكون الرأس المحسن (Header) - سوق الكويت
 * إدارة شريط التنقل المضغوط والمتجاوب مع الأجهزة المختلفة
 */

class HeaderComponent {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.createHeaderHTML();
        this.addCompactStyles();
        this.bindEvents();
        this.updateCartCount();
    }

    createHeaderHTML() {
        const headerContainer = document.getElementById('site-header');
        if (!headerContainer) return;

        headerContainer.innerHTML = `
            <header class="header compact-header">
                <div class="container">
                    <div class="nav-wrapper">
                        <div class="logo compact-logo">
                            <h1><span class="flag-icon">🇰🇼</span><span class="site-name">سوق الكويت</span></h1>
                        </div>
                        
                        <nav class="nav compact-nav">
                            <ul>
                                <li><a href="#home">الرئيسية</a></li>
                                <li><a href="#products">المنتجات</a></li>
                                <li><a href="about.html">من نحن</a></li>
                                <li><a href="contact.html">اتصل بنا</a></li>
                            </ul>
                        </nav>
                        
                        <div class="header-actions compact-actions">
                            <button class="cart-icon compact-cart" onclick="window.location.href='cart.html'" title="السلة">
                                <i class="fas fa-shopping-cart"></i>
                                <span class="cart-count" id="cart-count">0</span>
                            </button>
                            
                            <button class="mobile-menu-btn compact-menu-btn" onclick="headerComponent.toggleMobileMenu()" title="القائمة">
                                <i class="fas fa-bars"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- قائمة الهاتف المحمول المحسنة -->
                <div class="mobile-menu enhanced-mobile-menu" id="mobile-menu">
                    <div class="mobile-menu-header">
                        <div class="mobile-logo">
                            <span class="flag-icon">🇰🇼</span> سوق الكويت
                        </div>
                        <button class="mobile-menu-close" onclick="headerComponent.closeMobileMenu()" title="إغلاق">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <nav class="mobile-nav">
                        <ul>
                            <li><a href="#home" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-home"></i> الرئيسية</a></li>
                            <li><a href="#products" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-shopping-bag"></i> المنتجات</a></li>
                            <li><a href="about.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-info-circle"></i> من نحن</a></li>
                            <li><a href="contact.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-phone"></i> اتصل بنا</a></li>
                            <li><a href="cart.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-shopping-cart"></i> السلة</a></li>
                            <li class="menu-divider"></li>
                            <li><a href="shipping.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-truck"></i> الشحن والتوصيل</a></li>
                            <li><a href="privacy.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-shield-alt"></i> سياسة الخصوصية</a></li>
                            <li><a href="terms.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-file-contract"></i> الشروط والأحكام</a></li>
                            <li><a href="refund.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-undo"></i> سياسة الاسترجاع</a></li>
                        </ul>
                        <div class="mobile-contact">
                            <a href="https://wa.me/201110760081" class="whatsapp-btn" target="_blank">
                                <i class="fab fa-whatsapp"></i> تواصل معنا
                            </a>
                        </div>
                    </nav>
                </div>
            </header>
        `;
    }

    addCompactStyles() {
        const style = document.createElement('style');
        style.id = 'compact-header-styles';
        style.textContent = `
            /* الهيدر المضغوط */
            .compact-header {
                padding: 0.5rem 0 !important;
                min-height: auto !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .compact-header .container {
                padding: 0 1rem;
            }
            
            .compact-header .nav-wrapper {
                align-items: center;
                gap: 1rem;
            }
            
            /* الشعار المضغوط */
            .compact-logo h1 {
                font-size: clamp(1.2rem, 3vw, 1.5rem) !important;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .flag-icon {
                font-size: 1.2em;
                filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.3));
            }
            
            .site-name {
                font-weight: 800;
            }
            
            /* التنقل المضغوط */
            .compact-nav ul {
                gap: 1rem;
            }
            
            .compact-nav a {
                padding: 0.4rem 0.8rem !important;
                font-size: 0.9rem;
                border-radius: 8px;
            }
            
            /* الإجراءات المضغوطة */
            .compact-actions {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .compact-cart {
                width: 40px !important;
                height: 40px !important;
                font-size: 1rem !important;
                position: relative;
            }
            
            .compact-cart .cart-count {
                width: 18px !important;
                height: 18px !important;
                font-size: 0.7rem !important;
                top: -6px !important;
                right: -6px !important;
            }
            
            .compact-menu-btn {
                display: none;
                background: var(--kuwait-green);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1rem;
            }
            
            .compact-menu-btn:hover {
                background: var(--kuwait-green-dark);
                transform: scale(1.05);
            }
            
            /* القائمة المحمولة المحسنة */
            .enhanced-mobile-menu {
                width: min(320px, 85vw);
                right: -100%;
                background: linear-gradient(135deg, var(--kuwait-green), #00a651, var(--kuwait-green-dark));
                backdrop-filter: blur(20px);
                box-shadow: -10px 0 30px rgba(0,0,0,0.3);
                border-radius: 20px 0 0 20px;
                overflow: hidden;
            }
            
            .enhanced-mobile-menu.active {
                right: 0;
                animation: slideInFromRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .mobile-menu-header {
                background: rgba(0,0,0,0.2);
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .mobile-logo {
                color: var(--gold-kuwait);
                font-weight: 800;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .mobile-menu-close {
                background: rgba(255,255,255,0.1);
                border: none;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .mobile-menu-close:hover {
                background: rgba(255,255,255,0.2);
                transform: rotate(90deg);
            }
            
            .mobile-nav {
                padding: 1rem 0;
            }
            
            .mobile-nav ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .mobile-nav li {
                margin: 0;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .mobile-nav li:last-child {
                border-bottom: none;
            }
            
            .mobile-nav a {
                display: flex;
                align-items: center;
                gap: 0.8rem;
                color: white;
                text-decoration: none;
                padding: 0.8rem 1rem;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .mobile-nav a:hover {
                background: rgba(255,255,255,0.1);
                color: var(--gold-kuwait);
                transform: translateX(-5px);
            }
            
            .mobile-nav i {
                width: 20px;
                text-align: center;
                opacity: 0.8;
            }
            
            .menu-divider {
                height: 1px;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                margin: 0.5rem 0;
                border: none;
            }
            
            .mobile-contact {
                padding: 1rem;
                border-top: 1px solid rgba(255,255,255,0.1);
            }
            
            .whatsapp-btn {
                background: #25d366;
                color: white;
                text-decoration: none;
                padding: 0.8rem 1rem;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                font-weight: 700;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
            }
            
            .whatsapp-btn:hover {
                background: #128c7e;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
            }
            
            @keyframes slideInFromRight {
                from {
                    right: -100%;
                    opacity: 0;
                }
                to {
                    right: 0;
                    opacity: 1;
                }
            }
            
            /* الحالة المدمجة عند التمرير */
            .compact-header.scrolled {
                background: rgba(0, 166, 81, 0.98) !important;
                backdrop-filter: blur(15px);
                padding: 0.3rem 0 !important;
                box-shadow: 0 4px 20px rgba(0,166,81,0.3);
            }
            
            .compact-header.scrolled .compact-logo h1 {
                font-size: 1.1rem !important;
            }
            
            /* تصميم متجاوب للأجهزة */
            @media (max-width: 768px) {
                .compact-nav {
                    display: none;
                }
                
                .compact-menu-btn {
                    display: flex !important;
                }
                
                .compact-header .nav-wrapper {
                    justify-content: space-between;
                }
                
                .compact-logo h1 {
                    font-size: 1.1rem !important;
                }
            }
            
            @media (max-width: 480px) {
                .compact-header {
                    padding: 0.3rem 0 !important;
                }
                
                .compact-header .container {
                    padding: 0 0.5rem;
                }
                
                .compact-logo h1 {
                    font-size: 1rem !important;
                }
                
                .site-name {
                    display: none;
                }
                
                .enhanced-mobile-menu {
                    width: 90vw;
                }
            }
            
            /* تحسينات إضافية للأداء */
            .compact-header * {
                will-change: auto;
            }
            
            .compact-header.scrolled * {
                will-change: transform, opacity;
            }
        `;
        
        // إزالة الستايل القديم إن وجد
        const oldStyle = document.getElementById('compact-header-styles');
        if (oldStyle) oldStyle.remove();
        
        document.head.appendChild(style);
    }

    bindEvents() {
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', (e) => {
            const mobileMenu = document.getElementById('mobile-menu');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            
            if (this.isMenuOpen && mobileMenu && !mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // إغلاق القائمة عند الضغط على ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // تحديث مظهر الهيدر عند التمرير
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        const updateHeader = () => {
            const header = document.querySelector('.header');
            if (!header) return;

            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // إخفاء الهيدر عند التمرير لأسفل بسرعة
            if (currentScrollY > lastScrollY && currentScrollY > 150 && !this.isMenuOpen) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu) return;

        this.isMenuOpen = !this.isMenuOpen;
        mobileMenu.classList.toggle('active', this.isMenuOpen);
        
        // منع التمرير عند فتح القائمة
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
        
        // تأكد من ظهور الهيدر عند فتح القائمة
        if (this.isMenuOpen) {
            const header = document.querySelector('.header');
            if (header) {
                header.style.transform = 'translateY(0)';
            }
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu) return;

        this.isMenuOpen = false;
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateCartCount() {
        // التحديث المؤجل لتجنب المشاكل عند التحميل
        setTimeout(() => {
            if (typeof cartManager !== 'undefined' && cartManager.getCartItemCount) {
                const count = cartManager.getCartItemCount();
                const cartCountEl = document.getElementById('cart-count');
                if (cartCountEl) {
                    cartCountEl.textContent = count;
                    cartCountEl.style.display = count > 0 ? 'flex' : 'none';
                }
            }
        }, 100);
    }
}

// تصدير المكون
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderComponent;
} else {
    window.HeaderComponent = HeaderComponent;
}