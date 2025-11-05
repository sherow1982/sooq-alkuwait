// وظائف السلة موحدة وإضافة زر "أضف إلى السلة" لكل الصفحات
(function(){
  const CART_KEY = 'cart';

  function getCart(){
    try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }catch(_){ return []; }
  }
  function setCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }

  function addToCart(item){
    const cart = getCart();
    const idx = cart.findIndex(p => p.id === item.id);
    if(idx >= 0){ cart[idx].quantity += item.quantity || 1; }
    else { cart.push({...item, quantity: item.quantity || 1}); }
    setCart(cart);
    // حدث مخصص لتحديث العداد في الهيدر
    window.dispatchEvent(new CustomEvent('cart:updated'));
  }

  // تحديث عداد السلة عند كل تغيير
  window.addEventListener('cart:updated', () => {
    const cart = getCart();
    const totalItems = cart.reduce((s,i)=>s+i.quantity,0);
    const el = document.getElementById('cart-count');
    if(el) el.textContent = totalItems;
  });

  // تهيئة أزرار الإضافة للسلة
  function initAddToCartButtons(){
    document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        const payload = {
          id: Number(btn.dataset.id),
          title: btn.dataset.title,
          price: Number(btn.dataset.price),
          image: btn.dataset.image
        };
        addToCart(payload);
        // إشعار بسيط بدون تغيير الاستايل
        const note = document.createElement('div');
        note.className = 'cart-toast';
        note.textContent = 'تم إضافة المنتج إلى السلة';
        document.body.appendChild(note);
        setTimeout(()=> note.remove(), 1500);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initAddToCartButtons);
  document.addEventListener('DOMContentLoaded', () => window.dispatchEvent(new Event('cart:updated')));

  // كشف عام
  window.SooqCart = { addToCart, getCart };
})();
