/**
 * مكون الرأس (Header) - سوق الكويت
 * إدارة شريط التنقل والقائمة المحمولة
 */

class HeaderComponent {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.createHeaderHTML();
        this.bindEvents();
        this.updateCartCount();
    }

    createHeaderHTML() {
        const headerContainer = document.getElementById('site-header');
        if (!headerContainer) return;

        headerContainer.innerHTML = `
            <header class="header">
                <div class="container">
                    <div class="nav-wrapper">
                        <div class="logo">
                            <h1>🇰🇼 سوق الكويت</h1>
                        </div>
                        
                        <nav class="nav">
                            <ul>
                                <li><a href="#home">الرئيسية</a></li>
                                <li><a href="#products">المنتجات</a></li>
                                <li><a href="about.html">من نحن</a></li>
                                <li><a href="contact.html">اتصل بنا</a></li>
                                <li><a href="cart.html">السلة</a></li>
                            </ul>
                        </nav>
                        
                        <div class="header-actions">
                            <button class="cart-icon" onclick="window.location.href='cart.html'">
                                <i class="fas fa-shopping-cart"></i>
                                <span class="cart-count" id="cart-count">0</span>
                            </button>
                            
                            <button class="mobile-menu-btn" onclick="headerComponent.toggleMobileMenu()">
                                <i class="fas fa-bars"></i>
                                <span>القائمة</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- قائمة الهاتف المحمول -->
                <div class="mobile-menu" id="mobile-menu">
                    <button class="mobile-menu-close" onclick="headerComponent.closeMobileMenu()">
                        <i class="fas fa-times"></i>
                    </button>
                    <nav>
                        <ul>
                            <li><a href="#home" onclick="headerComponent.closeMobileMenu()">الرئيسية</a></li>
                            <li><a href="#products" onclick="headerComponent.closeMobileMenu()">المنتجات</a></li>
                            <li><a href="about.html" onclick="headerComponent.closeMobileMenu()">من نحن</a></li>
                            <li><a href="contact.html" onclick="headerComponent.closeMobileMenu()">اتصل بنا</a></li>
                            <li><a href="cart.html" onclick="headerComponent.closeMobileMenu()">السلة</a></li>
                            <li><a href="shipping.html" onclick="headerComponent.closeMobileMenu()">الشحن والتوصيل</a></li>
                            <li><a href="privacy.html" onclick="headerComponent.closeMobileMenu()">سياسة الخصوصية</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        `;
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
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (!header) return;

            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // إخفاء الهيدر عند التمرير لأسفل، إظهاره عند التمرير لأعلى
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu) return;

        this.isMenuOpen = !this.isMenuOpen;
        mobileMenu.classList.toggle('active', this.isMenuOpen);
        
        // منع التمرير عند فتح القائمة
        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu) return;

        this.isMenuOpen = false;
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateCartCount() {
        if (typeof cartManager !== 'undefined') {
            const count = cartManager.getCartItemCount();
            const cartCountEl = document.getElementById('cart-count');
            if (cartCountEl) {
                cartCountEl.textContent = count;
                cartCountEl.style.display = count > 0 ? 'flex' : 'none';
            }
        }
    }

    // إضافة تأثيرات الرسوم المتحركة للرأس
    addScrollEffects() {
        const header = document.querySelector('.header');
        if (!header) return;

        const style = document.createElement('style');
        style.textContent = `
            .header {
                transition: all 0.3s ease;
            }
            
            .header.scrolled {
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            }
            
            .mobile-menu {
                backdrop-filter: blur(10px);
            }
            
            .mobile-menu.active {
                animation: slideInRight 0.3s ease-out;
            }
            
            @keyframes slideInRight {
                from {
                    right: -300px;
                    opacity: 0;
                }
                to {
                    right: 0;
                    opacity: 1;
                }
            }
            
            .cart-icon {
                transition: all 0.3s ease;
            }
            
            .cart-icon:active {
                transform: scale(0.95);
            }
        `;
        
        document.head.appendChild(style);
    }

    // إضافة مؤشرات التنقل النشطة
    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav a[href^="#"]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${entry.target.id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
}

// تصدير المكون
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderComponent;
} else {
    window.HeaderComponent = HeaderComponent;
}