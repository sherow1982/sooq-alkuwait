/**
 * مكون التذييل (Footer) - سوق الكويت
 * إدارة التذييل مع الروابط والمعلومات
 */

class FooterComponent {
    constructor() {
        this.init();
    }

    init() {
        this.createFooterHTML();
        this.bindEvents();
    }

    createFooterHTML() {
        const footerContainer = document.getElementById('site-footer');
        if (!footerContainer) return;

        const currentYear = new Date().getFullYear();

        footerContainer.innerHTML = `
            <footer class="footer">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-section">
                            <h3>🇰🇼 سوق الكويت</h3>
                            <p>متجرك الإلكتروني الموثوق للمنتجات عالية الجودة</p>
                            <div class="social-links">
                                <a href="#" aria-label="فيسبوك">
                                    <i class="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" aria-label="إنستغرام">
                                    <i class="fab fa-instagram"></i>
                                </a>
                                <a href="https://wa.me/201110760081" target="_blank" aria-label="واتساب">
                                    <i class="fab fa-whatsapp"></i>
                                </a>
                                <a href="#" aria-label="تيك توك">
                                    <i class="fab fa-tiktok"></i>
                                </a>
                            </div>
                        </div>
                        
                        <div class="footer-section">
                            <h3>روابط سريعة</h3>
                            <ul>
                                <li><a href="#home">الرئيسية</a></li>
                                <li><a href="#products">المنتجات</a></li>
                                <li><a href="about.html">من نحن</a></li>
                                <li><a href="contact.html">اتصل بنا</a></li>
                                <li><a href="cart.html">السلة</a></li>
                            </ul>
                        </div>
                        
                        <div class="footer-section">
                            <h3>خدمة العملاء</h3>
                            <ul>
                                <li><a href="shipping.html">الشحن والتوصيل</a></li>
                                <li><a href="refund.html">سياسة الارتجاع</a></li>
                                <li><a href="terms.html">شروط الاستخدام</a></li>
                                <li><a href="privacy.html">سياسة الخصوصية</a></li>
                                <li><a href="#" onclick="footerComponent.showSupport()">الدعم الفني</a></li>
                            </ul>
                        </div>
                        
                        <div class="footer-section">
                            <h3>تواصل معنا</h3>
                            <div class="contact-info">
                                <div class="contact-item">
                                    <i class="fas fa-phone"></i>
                                    <a href="tel:+201110760081" dir="ltr">+20 111 076 0081</a>
                                </div>
                                <div class="contact-item">
                                    <i class="fas fa-envelope"></i>
                                    <a href="mailto:support@sooq-alkuwait.com">support@sooq-alkuwait.com</a>
                                </div>
                                <div class="contact-item">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span>الكويت</span>
                                </div>
                                <div class="contact-item">
                                    <i class="fas fa-clock"></i>
                                    <span>متاح طوال الأسبوع 24/7</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- معلومات الدفع والأمان -->
                    <div class="footer-features">
                        <div class="feature-item">
                            <i class="fas fa-shield-alt"></i>
                            <span>مدفوعات آمنة</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-truck"></i>
                            <span>توصيل مجاني</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-undo"></i>
                            <span>ارتجاع مجاني</span>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-headset"></i>
                            <span>دعم 24/7</span>
                        </div>
                    </div>
                    
                    <div class="footer-bottom">
                        <div class="footer-bottom-content">
                            <p>&copy; ${currentYear} سوق الكويت. جميع الحقوق محفوظة.</p>
                            <div class="footer-links">
                                <a href="sitemap.xml">خريطة الموقع</a>
                                <span>|</span>
                                <a href="robots.txt">Robots.txt</a>
                                <span>|</span>
                                <button onclick="footerComponent.scrollToTop()" class="scroll-top-btn">
                                    <i class="fas fa-arrow-up"></i> أعلى
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }

    bindEvents() {
        // إضافة أنيميشن للروابط الاجتماعية
        const socialLinks = document.querySelectorAll('.social-links a');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-3px) scale(1.1)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) scale(1)';
            });
        });

        // مراقبة التمرير لإظهار زر العودة لأعلى
        this.setupScrollToTop();
        
        // إضافة الأنيميشن عند ظهور التذييل
        this.setupScrollAnimation();
    }

    setupScrollToTop() {
        let scrollTopBtn = document.querySelector('.scroll-top-btn');
        if (!scrollTopBtn) return;

        // مراقبة التمرير
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.pointerEvents = 'auto';
            } else {
                scrollTopBtn.style.opacity = '0.7';
                scrollTopBtn.style.pointerEvents = 'auto';
            }
        });
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    setupScrollAnimation() {
        const footer = document.querySelector('.footer');
        if (!footer) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        observer.observe(footer);

        // إضافة CSS للأنيميشن
        const style = document.createElement('style');
        style.textContent = `
            .footer {
                opacity: 0;
                transform: translateY(50px);
                transition: all 0.8s ease;
            }
            
            .footer.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .footer-section {
                transition: all 0.3s ease;
            }
            
            .footer-section:hover {
                transform: translateY(-5px);
            }
            
            .social-links a {
                transition: all 0.3s ease;
                display: inline-block;
            }
            
            .footer-features {
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;
                gap: 1rem;
                padding: 2rem 0;
                border-top: 1px solid #333;
                border-bottom: 1px solid #333;
                margin: 2rem 0;
            }
            
            .feature-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--kuwait-white);
                font-size: 0.9rem;
                opacity: 0.9;
            }
            
            .feature-item i {
                color: var(--luxury-gold);
                font-size: 1.1rem;
            }
            
            .contact-info {
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
            }
            
            .contact-item {
                display: flex;
                align-items: center;
                gap: 0.8rem;
                color: #ddd;
                font-size: 0.9rem;
            }
            
            .contact-item i {
                color: var(--kuwait-green);
                width: 16px;
                text-align: center;
            }
            
            .contact-item a {
                color: #ddd;
                text-decoration: none;
                transition: color 0.3s ease;
            }
            
            .contact-item a:hover {
                color: var(--luxury-gold);
            }
            
            .footer-bottom {
                text-align: center;
                padding-top: 1.5rem;
            }
            
            .footer-bottom-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;
            }
            
            .footer-links {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .footer-links a,
            .scroll-top-btn {
                color: #aaa;
                text-decoration: none;
                background: none;
                border: none;
                cursor: pointer;
                transition: color 0.3s ease;
                font-size: 0.9rem;
            }
            
            .footer-links a:hover,
            .scroll-top-btn:hover {
                color: var(--luxury-gold);
            }
            
            .scroll-top-btn {
                opacity: 0.7;
                transition: all 0.3s ease;
            }
            
            .scroll-top-btn:hover {
                opacity: 1;
                transform: translateY(-2px);
            }
            
            @media (max-width: 768px) {
                .footer-content {
                    grid-template-columns: 1fr;
                    text-align: center;
                    gap: 2rem;
                }
                
                .footer-features {
                    justify-content: center;
                    text-align: center;
                }
                
                .feature-item {
                    flex-direction: column;
                    text-align: center;
                }
                
                .footer-bottom-content {
                    flex-direction: column;
                    text-align: center;
                }
                
                .contact-info {
                    align-items: center;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    showSupport() {
        const supportModal = document.createElement('div');
        supportModal.className = 'support-modal';
        supportModal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <button class="modal-close" onclick="this.closest('.support-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                    <h3>طرق التواصل مع الدعم الفني</h3>
                    <div class="support-options">
                        <a href="https://wa.me/201110760081?text=${encodeURIComponent('مرحباً! أحتاج مساعدة في الدعم الفني')}" target="_blank" class="support-option">
                            <i class="fab fa-whatsapp"></i>
                            <span>واتساب</span>
                        </a>
                        <a href="tel:+201110760081" class="support-option">
                            <i class="fas fa-phone"></i>
                            <span>اتصال</span>
                        </a>
                        <a href="mailto:support@sooq-alkuwait.com" class="support-option">
                            <i class="fas fa-envelope"></i>
                            <span>إيميل</span>
                        </a>
                    </div>
                </div>
            </div>
        `;

        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            .support-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
            }
            
            .modal-content {
                background: white;
                padding: 2rem;
                border-radius: 15px;
                max-width: 400px;
                width: 100%;
                position: relative;
                text-align: center;
                animation: slideUp 0.3s ease;
            }
            
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: #666;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                background: #f0f0f0;
                color: #333;
            }
            
            .support-options {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 1.5rem;
            }
            
            .support-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                padding: 1rem;
                background: var(--kuwait-green);
                color: white;
                text-decoration: none;
                border-radius: 10px;
                transition: all 0.3s ease;
                min-width: 80px;
            }
            
            .support-option:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0,166,81,0.3);
            }
            
            .support-option i {
                font-size: 1.5rem;
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;

        document.head.appendChild(modalStyle);
        document.body.appendChild(supportModal);
        
        // إزالة الستايل بعد إغلاق المودال
        supportModal.addEventListener('remove', () => {
            modalStyle.remove();
        });
    }

    // تحديث معلومات الاتصال
    updateContactInfo(info) {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        
        if (info.phone) {
            phoneLinks.forEach(link => {
                link.href = `tel:${info.phone}`;
                link.textContent = info.phone;
            });
        }
        
        if (info.email) {
            emailLinks.forEach(link => {
                link.href = `mailto:${info.email}`;
                link.textContent = info.email;
            });
        }
        
        if (info.whatsapp) {
            whatsappLinks.forEach(link => {
                const currentMessage = link.href.split('text=')[1];
                link.href = `https://wa.me/${info.whatsapp}${currentMessage ? '?text=' + currentMessage : ''}`;
            });
        }
    }
}

// تصدير المكون
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FooterComponent;
} else {
    window.FooterComponent = FooterComponent;
}