// ملف واتساب لسوق الكويت - إرسال مباشر
function orderViaWhatsApp(productId, title, price, salePrice) {
  const discount = price - salePrice;
  const discountPercent = Math.round((discount / price) * 100);
  const message = `🛍️ أريد طلب هذا المنتج من سوق الكويت:\n\n📦 المنتج: ${title}\n💰 السعر: ${salePrice} د.ك (بدلاً من ${price} د.ك)\n🔥 الوفير: ${discount} د.ك (${discountPercent}% خصم)\n🆔 رقم المنتج: SOOQ-${productId.toString().padStart(4, '0')}\n\nيرجى تأكيد الطلب وإرسال تفاصيل الشحن 📱`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/201110760081?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', function() {
  const phoneElements = document.querySelectorAll('[href*="tel:"]');
  phoneElements.forEach(el => { el.href = 'tel:+201110760081'; });
  const whatsappElements = document.querySelectorAll('[href*="wa.me"]');
  whatsappElements.forEach(el => { if (!el.href.includes('text=')) el.href = 'https://wa.me/201110760081'; });
});