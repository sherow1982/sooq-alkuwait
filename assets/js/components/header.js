/**
 * مكون الرأس المحسن (Header) - عرض قائمة التنقل على الموبايل فقط
 */
class HeaderComponent {
  constructor(){this.isMenuOpen=false;this.init();}
  init(){this.createHeaderHTML();this.addStyles();this.bindEvents();this.updateCartCount();}
  createHeaderHTML(){const c=document.getElementById('site-header');if(!c)return;c.innerHTML=`
  <header class="header compact-header">
    <div class="container">
      <div class="nav-wrapper">
        <div class="logo compact-logo">
          <h1><span class="flag-icon">🇰🇼</span><span class="site-name">سوق الكويت</span></h1>
        </div>
        <nav class="nav compact-nav" aria-label="القائمة الرئيسية">
          <ul>
            <li><a href="#home">الرئيسية</a></li>
            <li><a href="#products">المنتجات</a></li>
            <li><a href="about.html">من نحن</a></li>
            <li><a href="contact.html">اتصل بنا</a></li>
          </ul>
        </nav>
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
          <li><a href="shipping.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-truck"></i> الشحن والتوصيل</a></li>
          <li><a href="privacy.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-shield-alt"></i> سياسة الخصوصية</a></li>
          <li><a href="terms.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-file-contract"></i> الشروط والأحكام</a></li>
          <li><a href="refund.html" onclick="headerComponent.closeMobileMenu()"><i class="fas fa-undo"></i> سياسة الاسترجاع</a></li>
        </ul>
      </nav>
    </div>
  </header>`}
  addStyles(){const s=document.createElement('style');s.id='only-mobile-nav';s.textContent=`
    /* إخفاء قائمة الهيدر على الشاشات المتوسطة والكبيرة */
    .compact-nav{display:none !important;}
    .compact-menu-btn{display:flex !important;}
    /* إظهار القائمة الأفقية فقط عندما يكون العرض أكبر من 1200px إذا رغبت لاحقاً */
    @media(min-width:1200px){.compact-nav{display:none !important}}
    /* على الموبايل تبقى القائمة عبر زر الهامبورجر */
  `;const old=document.getElementById('only-mobile-nav');if(old)old.remove();document.head.appendChild(s);}
  bindEvents(){document.addEventListener('click',e=>{const m=document.getElementById('mobile-menu');const b=document.querySelector('.mobile-menu-btn');if(this.isMenuOpen&&m&&!m.contains(e.target)&&!b.contains(e.target))this.closeMobileMenu();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&this.isMenuOpen)this.closeMobileMenu();});}
  toggleMobileMenu(){const m=document.getElementById('mobile-menu');if(!m)return;this.isMenuOpen=!this.isMenuOpen;m.classList.toggle('active',this.isMenuOpen);m.setAttribute('aria-hidden',(!this.isMenuOpen).toString());document.body.style.overflow=this.isMenuOpen?'hidden':'';}
  closeMobileMenu(){const m=document.getElementById('mobile-menu');if(!m)return;this.isMenuOpen=false;m.classList.remove('active');m.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  updateCartCount(){setTimeout(()=>{if(typeof cartManager!=='undefined'&&cartManager.getCartItemCount){const c=cartManager.getCartItemCount();const el=document.getElementById('cart-count');if(el){el.textContent=c;el.style.display=c>0?'flex':'none';}}},100);}
}
if(typeof module!=='undefined'&&module.exports){module.exports=HeaderComponent;}else{window.HeaderComponent=HeaderComponent;}
