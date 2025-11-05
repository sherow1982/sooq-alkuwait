/* تحسينات Checkout عبر AJAX دون تغيير الاستايل */
(function(){
  async function postJSON(url, data){
    const res = await fetch(url, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
    if(!res.ok) throw new Error('Network');
    return res.json();
  }

  function serializeForm(form){
    const data = {};
    new FormData(form).forEach((v,k)=>{ data[k]=v; });
    return data;
  }

  function showInlineNotice(target, msg, type='success'){
    const box = document.createElement('div');
    box.className = 'checkout-note ' + type;
    box.textContent = msg;
    target.prepend(box);
    setTimeout(()=> box.remove(), 3000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#checkout-form');
    if(!form) return;

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const submitBtn = form.querySelector('[type=submit]');
      const original = submitBtn.textContent;
      submitBtn.disabled = true; submitBtn.textContent = '... جاري المعالجة';
      try{
        const payload = serializeForm(form);
        payload.items = (JSON.parse(localStorage.getItem('cart'))||[]);
        // مثال: إرسال الطلب إلى خدمة خارجية لاحقا
        const result = await postJSON('https://httpbin.org/post', payload);
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cart:updated'));
        showInlineNotice(form, 'تم استلام طلبك بنجاح. سنقوم بالتواصل لتأكيد الشحن.');
        // توجيه أو عرض ملخص
        // window.location.href = 'thank-you.html';
      }catch(err){
        showInlineNotice(form, 'حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى', 'error');
      }finally{
        submitBtn.disabled = false; submitBtn.textContent = original;
      }
    });
  });
})();
