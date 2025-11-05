/**
 * مكون التذييل المحسن (Footer) - سوق الكويت
 * تصميم موحد واحترافي مع ألوان علم الكويت
 */

class FooterComponent {
    constructor() {
        this.init();
    }

    init() {
        this.createFooterHTML();
        this.addFooterStyles();
        this.bindEvents();
    }

    createFooterHTML() {
        const footerContainer = document.getElementById('site-footer');
        if (!footerContainer) return;

        const currentYear = new Date().getFullYear();

        footerContainer.innerHTML = `
            <footer class="footer enhanced-footer">
                <div class="container">
                    <!-- محتوى التذييل الرئيسي -->
                    <div class="footer-main">
                        <div class="footer-content">
                            <!-- عن المتجر -->
                            <div class="footer-section brand-section">
                                <div class="footer-logo">
                                    <h3><span class="kuwait-flag">🇰🇼</span> سوق الكويت</h3>
                                </div>
                                <p class="brand-description">
                                    متجرك الإلكتروني الموثوق للمنتجات عالية الجودة. نخدم عملاءنا بشغف وحب منذ عام 2024.
                                </p>
                                <div class="social-links-enhanced">
                                    <a href="#" aria-label="فيسبوك" class="social-btn facebook">
                                        <i class="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="#" aria-label="إنستغرام" class="social-btn instagram">
                                        <i class="fab fa-instagram"></i>
                                    </a>
                                    <a href="https://wa.me/201110760081" target="_blank" aria-label="واتساب" class="social-btn whatsapp">
                                        <i class="fab fa-whatsapp"></i>
                                    </a>
                                    <a href="#" aria-label="تيك توك" class="social-btn tiktok">
                                        <i class="fab fa-tiktok"></i>
                                    </a>
                                </div>
                            </div>
                            
                            <!-- روابط سريعة -->
                            <div class="footer-section">
                                <h4>روابط سريعة</h4>
                                <ul class="footer-links">
                                    <li><a href="index.html"><i class="fas fa-home"></i> الرئيسية</a></li>
                                    <li><a href="#products"><i class="fas fa-shopping-bag"></i> المنتجات</a></li>
                                    <li><a href="cart.html"><i class="fas fa-shopping-cart"></i> السلة</a></li>
                                    <li><a href="checkout.html"><i class="fas fa-credit-card"></i> إتمام الطلب</a></li>
                                </ul>
                            </div>
                            
                            <!-- الصفحات القانونية -->
                            <div class="footer-section">
                                <h4>الصفحات القانونية</h4>
                                <ul class="footer-links">
                                    <li><a href="about.html"><i class="fas fa-info-circle"></i> من نحن</a></li>
                                    <li><a href="privacy.html"><i class="fas fa-shield-alt"></i> سياسة الخصوصية</a></li>
                                    <li><a href="terms.html"><i class="fas fa-file-contract"></i> الشروط والأحكام</a></li>
                                    <li><a href="refund.html"><i class="fas fa-undo"></i> سياسة الاسترجاع</a></li>
                                    <li><a href="shipping.html"><i class="fas fa-truck"></i> الشحن والتوصيل</a></li>
                                </ul>
                            </div>
                            
                            <!-- معلومات الاتصال -->
                            <div class="footer-section contact-section">
                                <h4>تواصل معنا</h4>
                                <div class="contact-info-enhanced">
                                    <a href="tel:+201110760081" class="contact-item">
                                        <i class="fas fa-phone"></i>
                                        <div class="contact-details">
                                            <span class="contact-label">هاتف</span>
                                            <span class="contact-value" dir="ltr">+20 111 076 0081</span>
                                        </div>
                                    </a>
                                    
                                    <a href="https://wa.me/201110760081" target="_blank" class="contact-item whatsapp-item">
                                        <i class="fab fa-whatsapp"></i>
                                        <div class="contact-details">
                                            <span class="contact-label">واتساب</span>
                                            <span class="contact-value">اتصل الآن</span>
                                        </div>
                                    </a>
                                    
                                    <a href="mailto:support@sooq-alkuwait.com" class="contact-item">
                                        <i class="fas fa-envelope"></i>
                                        <div class="contact-details">
                                            <span class="contact-label">إيميل</span>
                                            <span class="contact-value">support@sooq-alkuwait.com</span>
                                        </div>
                                    </a>
                                    
                                    <div class="contact-item">
                                        <i class="fas fa-clock"></i>
                                        <div class="contact-details">
                                            <span class="contact-label">ساعات العمل</span>
                                            <span class="contact-value">24/7 طوال الأسبوع</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ميزات المتجر -->
                    <div class="footer-features-bar">
                        <div class="feature-highlight">
                            <i class="fas fa-shield-alt"></i>
                            <span>مدفوعات آمنة</span>
                        </div>
                        <div class="feature-highlight">
                            <i class="fas fa-truck"></i>
                            <span>توصيل مجاني</span>
                        </div>
                        <div class="feature-highlight">
                            <i class="fas fa-undo"></i>
                            <span>ارتجاع مجاني</span>
                        </div>
                        <div class="feature-highlight">
                            <i class="fas fa-headset"></i>
                            <span>دعم 24/7</span>
                        </div>
                        <div class="feature-highlight">
                            <i class="fas fa-certificate"></i>
                            <span>منتجات أصلية</span>
                        </div>
                    </div>
                    
                    <!-- التذييل السفلي -->
                    <div class="footer-bottom">
                        <div class="footer-bottom-content">
                            <div class="copyright">
                                <p>&copy; ${currentYear} سوق الكويت. جميع الحقوق محفوظة.</p>
                                <p class="made-in-kuwait">🇰🇼 صنع بحب في الكويت</p>
                            </div>
                            
                            <div class="footer-actions">
                                <div class="footer-links-inline">
                                    <a href="sitemap.xml" class="footer-link-btn">خريطة الموقع</a>
                                    <a href="robots.txt" class="footer-link-btn">Robots.txt</a>
                                </div>
                                
                                <button onclick="footerComponent.scrollToTop()" class="scroll-top-btn enhanced-scroll-btn" title="العودة لأعلى">
                                    <i class="fas fa-rocket"></i>
                                    <span class="scroll-text">أعلى</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- خلفية متحركة خفيفة -->
                <div class="footer-background-animation"></div>
            </footer>
        `;
    }

    addFooterStyles() {
        const style = document.createElement('style');
        style.id = 'enhanced-footer-styles';
        style.textContent = `
            /* التذييل المحسن */
            .enhanced-footer {
                background: linear-gradient(135deg, 
                    var(--kuwait-black) 0%, 
                    #1a1a1a 20%, 
                    var(--kuwait-green) 80%, 
                    var(--kuwait-green-dark) 100%);
                color: var(--kuwait-white);
                position: relative;
                overflow: hidden;
                margin-top: 4rem;
            }
            
            .footer-background-animation {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: 
                    radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.05), transparent),
                    radial-gradient(circle at 80% 70%, rgba(206, 17, 38, 0.05), transparent);
                animation: footerGlow 6s ease-in-out infinite alternate;
                z-index: 1;
            }
            
            @keyframes footerGlow {
                0% { opacity: 0.3; }
                100% { opacity: 0.8; }
            }
            
            .enhanced-footer > .container {
                position: relative;
                z-index: 2;
            }
            
            /* المحتوى الرئيسي */
            .footer-main {
                padding: 3rem 0 2rem;
            }
            
            .footer-content {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr 1.5fr;
                gap: 2.5rem;
                align-items: start;
            }
            
            /* قسم العلامة التجارية */
            .brand-section {
                max-width: 300px;
            }
            
            .footer-logo h3 {
                font-size: 1.8rem;
                font-weight: 900;
                margin-bottom: 1rem;
                background: var(--gradient-gold);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
            }
            
            .kuwait-flag {
                font-size: 1.2em;
                filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
            }
            
            .brand-description {
                color: #e5e7eb;
                line-height: 1.6;
                margin-bottom: 1.5rem;
                font-size: 0.95rem;
            }
            
            /* روابط اجتماعية محسنة */
            .social-links-enhanced {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .social-btn {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: 2px solid transparent;
                font-size: 1.2rem;
                position: relative;
                overflow: hidden;
            }
            
            .social-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle, rgba(255,255,255,0.2), transparent);
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            .social-btn:hover::before {
                opacity: 1;
            }
            
            .facebook { background: #1877f2; color: white; }
            .instagram { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: white; }
            .whatsapp { background: #25d366; color: white; }
            .tiktok { background: #000; color: white; }
            
            .social-btn:hover {
                transform: translateY(-5px) scale(1.1);
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                border-color: var(--gold-kuwait);
            }
            
            /* الأقسام الفرعية */
            .footer-section h4 {
                color: var(--gold-kuwait);
                margin-bottom: 1.5rem;
                font-size: 1.2rem;
                font-weight: 700;
                position: relative;
                padding-bottom: 0.5rem;
            }
            
            .footer-section h4::after {
                content: '';
                position: absolute;
                bottom: 0;
                right: 0;
                width: 30px;
                height: 2px;
                background: var(--gold-kuwait);
                border-radius: 2px;
            }
            
            .footer-links {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .footer-links li {
                margin-bottom: 0.8rem;
            }
            
            .footer-links a {
                color: #d1d5db;
                text-decoration: none;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.3rem 0;
                border-radius: 6px;
                font-size: 0.9rem;
            }
            
            .footer-links a:hover {
                color: var(--gold-kuwait);
                transform: translateX(-5px);
                background: rgba(255, 215, 0, 0.1);
                padding-right: 0.5rem;
            }
            
            .footer-links i {
                width: 16px;
                text-align: center;
                opacity: 0.7;
            }
            
            /* معلومات الاتصال المحسنة */
            .contact-info-enhanced {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .contact-item {
                display: flex;
                align-items: center;
                gap: 0.8rem;
                color: #d1d5db;
                text-decoration: none;
                padding: 0.8rem;
                border-radius: 10px;
                transition: all 0.3s ease;
                border: 1px solid rgba(255,255,255,0.1);
                background: rgba(255,255,255,0.03);
            }
            
            .contact-item:hover {
                background: rgba(255, 215, 0, 0.1);
                border-color: var(--gold-kuwait);
                transform: scale(1.02);
                color: var(--gold-kuwait);
            }
            
            .contact-item i {
                font-size: 1.1rem;
                color: var(--kuwait-green);
                width: 20px;
                text-align: center;
            }
            
            .contact-details {
                display: flex;
                flex-direction: column;
                gap: 0.2rem;
            }
            
            .contact-label {
                font-size: 0.8rem;
                opacity: 0.8;
                font-weight: 600;
            }
            
            .contact-value {
                font-weight: 600;
                font-size: 0.9rem;
            }
            
            .whatsapp-item:hover i {
                color: #25d366;
                animation: whatsappPulse 1s infinite;
            }
            
            @keyframes whatsappPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            /* شريط الميزات */
            .footer-features-bar {
                display: flex;
                justify-content: space-around;
                align-items: center;
                background: rgba(0,0,0,0.3);
                padding: 1.5rem 0;
                margin: 2rem 0;
                border-radius: 15px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 215, 0, 0.2);
                flex-wrap: wrap;
                gap: 1rem;
            }
            
            .feature-highlight {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                color: var(--kuwait-white);
                font-size: 0.9rem;
                font-weight: 600;
                text-align: center;
                transition: all 0.3s ease;
            }
            
            .feature-highlight:hover {
                color: var(--gold-kuwait);
                transform: translateY(-3px);
            }
            
            .feature-highlight i {
                font-size: 1.5rem;
                color: var(--gold-kuwait);
                margin-bottom: 0.3rem;
                transition: all 0.3s ease;
            }
            
            .feature-highlight:hover i {
                transform: scale(1.2);
                filter: drop-shadow(0 0 8px var(--gold-kuwait));
            }
            
            /* التذييل السفلي */
            .footer-bottom {
                border-top: 1px solid rgba(255, 215, 0, 0.2);
                padding: 1.5rem 0;
                background: rgba(0,0,0,0.2);
                backdrop-filter: blur(5px);
            }
            
            .footer-bottom-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;
            }
            
            .copyright {
                text-align: center;
            }
            
            .copyright p {
                margin: 0.3rem 0;
                color: #d1d5db;
            }
            
            .made-in-kuwait {
                color: var(--gold-kuwait) !important;
                font-weight: 700;
                font-size: 0.9rem;
            }
            
            .footer-actions {
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }
            
            .footer-links-inline {
                display: flex;
                gap: 1rem;
            }
            
            .footer-link-btn {
                color: #9ca3af;
                text-decoration: none;
                font-size: 0.85rem;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                transition: all 0.3s ease;
                border: 1px solid rgba(255,255,255,0.1);
            }
            
            .footer-link-btn:hover {
                color: var(--gold-kuwait);
                background: rgba(255, 215, 0, 0.1);
                border-color: var(--gold-kuwait);
            }
            
            /* زر العودة لأعلى المحسن */
            .enhanced-scroll-btn {
                background: var(--gradient-gold);
                color: var(--kuwait-black);
                border: none;
                width: 55px;
                height: 55px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: var(--shadow-gold);
                border: 2px solid transparent;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 0.2rem;
                font-weight: 700;
                position: relative;
                overflow: hidden;
            }
            
            .enhanced-scroll-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(circle, rgba(255,255,255,0.3), transparent);
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            .enhanced-scroll-btn:hover::before {
                opacity: 1;
            }
            
            .enhanced-scroll-btn:hover {
                transform: translateY(-8px) scale(1.1);
                box-shadow: var(--shadow-glow);
                border-color: var(--kuwait-white);
            }
            
            .enhanced-scroll-btn i {
                font-size: 1.2rem;
                animation: rocketFloat 2s ease-in-out infinite alternate;
            }
            
            .scroll-text {
                font-size: 0.7rem;
                margin-top: 0.2rem;
            }
            
            @keyframes rocketFloat {
                0% { transform: translateY(0px); }
                100% { transform: translateY(-3px); }
            }
            
            /* تصميم متجاوب للتذييل */
            @media (max-width: 1024px) {
                .footer-content {
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }
            }
            
            @media (max-width: 768px) {
                .footer-main {
                    padding: 2rem 0 1.5rem;
                }
                
                .footer-content {
                    grid-template-columns: 1fr;
                    gap: 2rem;
                    text-align: center;
                }
                
                .brand-section {
                    max-width: none;
                }
                
                .footer-features-bar {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    text-align: center;
                }
                
                .footer-bottom-content {
                    flex-direction: column;
                    text-align: center;
                    gap: 1.5rem;
                }
                
                .footer-actions {
                    flex-direction: column;
                    align-items: center;
                }
            }
            
            @media (max-width: 480px) {
                .footer-features-bar {
                    grid-template-columns: 1fr;
                    padding: 1rem;
                }
                
                .feature-highlight {
                    flex-direction: row;
                    justify-content: center;
                    gap: 0.8rem;
                }
                
                .feature-highlight i {
                    margin-bottom: 0;
                }
                
                .social-links-enhanced {
                    justify-content: center;
                }
                
                .contact-info-enhanced {
                    max-width: 280px;
                    margin: 0 auto;
                }
            }
            
            /* تحسينات الأداء */
            .enhanced-footer * {
                will-change: auto;
            }
            
            .enhanced-footer:hover * {
                will-change: transform, opacity;
            }
        `;
        
        // إزالة الستايل القديم إن وجد
        const oldStyle = document.getElementById('enhanced-footer-styles');
        if (oldStyle) oldStyle.remove();
        
        document.head.appendChild(style);
    }

    bindEvents() {
        // مراقبة التمرير لإظهار زر العودة لأعلى
        this.setupScrollToTop();
        
        // إضافة الأنيميشن عند ظهور التذييل
        this.setupScrollAnimation();
        
        // تحسين الروابط الاجتماعية
        this.enhanceSocialLinks();
    }

    setupScrollToTop() {
        let scrollTopBtn = document.querySelector('.enhanced-scroll-btn');
        if (!scrollTopBtn) return;

        let visible = false;
        
        window.addEventListener('scroll', () => {
            const shouldShow = window.scrollY > 300;
            
            if (shouldShow && !visible) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.pointerEvents = 'auto';
                scrollTopBtn.style.transform = 'scale(1)';
                visible = true;
            } else if (!shouldShow && visible) {
                scrollTopBtn.style.opacity = '0.7';
                scrollTopBtn.style.transform = 'scale(0.9)';
                visible = false;
            }
        }, { passive: true });
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // تأثير مرئي عند الضغط
        const btn = document.querySelector('.enhanced-scroll-btn');
        if (btn) {
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        }
    }

    setupScrollAnimation() {
        const footer = document.querySelector('.enhanced-footer');
        if (!footer) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('footer-animate-in');
                    
                    // أنيميشن تدريجية للعناصر
                    const sections = entry.target.querySelectorAll('.footer-section');
                    sections.forEach((section, index) => {
                        setTimeout(() => {
                            section.style.animation = 'slideInUp 0.6s ease-out';
                        }, index * 200);
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        observer.observe(footer);

        // إضافة CSS للأنيميشن
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            .enhanced-footer {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.8s ease;
            }
            
            .enhanced-footer.footer-animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        
        document.head.appendChild(animationStyle);
    }

    enhanceSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-btn');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                // تأثير اهتزاز خفيف
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            });
        });
    }

    // تحديث معلومات الاتصال ديناميكياً
    updateContactInfo(info) {
        if (info.phone) {
            document.querySelectorAll('a[href^="tel:"]').forEach(link => {
                link.href = `tel:${info.phone}`;
                link.querySelector('.contact-value').textContent = info.phone;
            });
        }
        
        if (info.email) {
            document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
                link.href = `mailto:${info.email}`;
                link.querySelector('.contact-value').textContent = info.email;
            });
        }
        
        if (info.whatsapp) {
            document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
                const currentMessage = link.href.split('text=')[1];
                link.href = `https://wa.me/${info.whatsapp}${currentMessage ? '?text=' + currentMessage : ''}`;
            });
        }
    }

    // إضافة إحصائيات بسيطة (اختياري)
    addFooterStats() {
        const stats = {
            visitors: Math.floor(Math.random() * 10000) + 50000,
            products: 1000,
            customers: Math.floor(Math.random() * 5000) + 15000
        };
        
        // يمكن إضافتها لاحقاً في منطقة مخصصة
        return stats;
    }
}

// تصدير المكون
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FooterComponent;
} else {
    window.FooterComponent = FooterComponent;
}