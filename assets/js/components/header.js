/**
 * مكون رأس مبسّط: إزالة قائمة الروابط من الهيدر على جميع المقاسات
 * وإبقاء زر السلة فقط + زر الهامبرجر للموبايل (القائمة الجانبية فقط)
 */
class HeaderComponent{
  constructor(){this.isMenuOpen=false;this.init();}
  init(){this.render();this.injectStyles();this.bind();this.updateCartCount();}
  render(){const root=document.getElementById('site-header');if(!root)return;root.innerHTML=`
  <header class="header compact-header no-desktop-nav" role="banner">
    <div class="container">
      <div class="nav-wrapper">
        <div class="logo compact-logo">
          <h1><span class="flag-icon">🇰🇼</span><span class="site-name">سوق الكويت</span></h1>
        </div>
        <!-- تمت إزالة قائمة الروابط من الهيدر -->
        <div class="header-actions compact-actions">
          <button class="cart-icon compact-cart" onclick="location.href='cart.html'" title="السلة">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count" id="cart-count">0</span>
          </button>
          <button class="mobile-menu-btn compact-menu-btn" onclick="headerComponent.toggleMobileMenu()" title="القائمة">
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </div>
    <!-- القائمة الجانبية للموبايل فقط -->
    <div class="mobile-menu enhanced-mobile-menu" id="mobile-menu" aria-hidden="true">
      <div class="mobile-menu-header">
        <div class="mobile-logo"><span class="flag-icon">🇰🇼</span> سوق الكويت</div>
        <button class="mobile-menu-close" onclick="headerComponent.closeMobileMenu()" title="إغلاق"><i class="fas fa-times"></i></button>
      </div>
      <nav class="mobile-nav" aria-label="قائمة الجوال">
        <ul>
          <li><a href="#home" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-home"></i> الرئيسية</a></li>
          <li><a href="#products" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-shopping-bag"></i> المنتجات</a></li>
          <li><a href="about.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-info-circle"></i> من نحن</a></li>
          <li><a href="contact.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-phone"></i> اتصل بنا</a></li>
          <li class="menu-divider"></li>
          <li><a href="cart.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-shopping-cart"></i> السلة</a></li>
          <li><a href="shipping.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-truck"></i> الشحن والتوصيل</a></li>
          <li><a href="privacy.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-shield-alt"></i> سياسة الخصوصية</a></li>
          <li><a href="terms.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-file-contract"></i> الشروط والأحكام</a></li>
          <li><a href="refund.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-undo"></i> سياسة الاسترجاع</a></li>
        </ul>
      </nav>
    </div>
  </header>`}
  injectStyles(){const s=document.createElement('style');s.id='header-trim-styles';s.textContent=`
    /* تصغير الهيدر وتثبيته دون تغيير الاستايل العام */
    .header.compact-header{padding:6px 0 !important;min-height:auto !important;transition:all .25s ease;}
    .header.compact-header .container{padding:0 12px;}
    .compact-logo h1{font-size:clamp(1rem,2.6vw,1.4rem);margin:0;display:flex;gap:.4rem;align-items:center;}
    .site-name{font-weight:800}
    .flag-icon{font-size:1.1em}
    .compact-actions{display:flex;gap:.4rem;align-items:center}
    .compact-cart{width:40px;height:40px;font-size:1rem;border-radius:10px}
    .compact-cart .cart-count{width:18px;height:18px;font-size:.7rem;top:-6px;right:-6px}
    .compact-menu-btn{display:flex;width:40px;height:40px;border-radius:10px;background:var(--kuwait-green);color:#fff;border:none}
    /* إزالة أي بقايا لقائمة الديسكتوب */
    .nav,.compact-nav{display:none !important}
    /* حالة التمرير: مزيد من التصغير */
    .header.compact-header.scrolled{padding:4px 0 !important;box-shadow:0 4px 18px rgba(0,0,0,.15);backdrop-filter:blur(10px)}
    /* الموبايل: القائمة الجانبية تبقى */
    @media(min-width:769px){.mobile-menu-btn{display:none !important}}
  `;const old=document.getElementById('header-trim-styles');if(old)old.remove();document.head.appendChild(s);}
  bind(){let last=window.scrollY,ticking=false;const run=()=>{const h=document.querySelector('.header');if(!h)return;const y=window.scrollY;h.classList.toggle('scrolled',y>40);if(y>last&&y>140&&!this.isMenuOpen){h.style.transform='translateY(-100%)'}else{h.style.transform='translateY(0)'}last=y;ticking=false};window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(run);ticking=true}}, {passive:true});document.addEventListener('click',e=>{const m=document.getElementById('mobile-menu');const b=document.querySelector('.mobile-menu-btn');if(this.isMenuOpen&&m&&!m.contains(e.target)&&!b.contains(e.target))this.closeMobileMenu();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&this.isMenuOpen)this.closeMobileMenu();});}
  toggleMobileMenu(){const m=document.getElementById('mobile-menu');if(!m)return;this.isMenuOpen=!this.isMenuOpen;m.classList.toggle('active',this.isMenuOpen);m.setAttribute('aria-hidden',(!this.isMenuOpen).toString());document.body.style.overflow=this.isMenuOpen?'hidden':'';}
  closeMobileMenu(){const m=document.getElementById('mobile-menu');if(!m)return;this.isMenuOpen=false;m.classList.remove('active');m.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  updateCartCount(){setTimeout(()=>{if(typeof cartManager!=='undefined'&&cartManager.getCartItemCount){const n=cartManager.getCartItemCount();const el=document.getElementById('cart-count');if(el){el.textContent=n;el.style.display=n>0?'flex':'none';}}},120)}
}
if(typeof module!=='undefined'&&module.exports){module.exports=HeaderComponent}else{window.HeaderComponent=HeaderComponent}
