// مولد مخطط المنتج الديناميكي من بيانات products.json
(function() {
  async function generateProductSchema() {
    try {
      // الحصول على معرف المنتج من الـ meta tag
      const productIdMeta = document.querySelector('meta[name="product-id"]');
      if (!productIdMeta) return;
      
      const productId = parseInt(productIdMeta.getAttribute('content'));
      
      // تحميل بيانات المنتجات
      const response = await fetch('../products.json');
      if (!response.ok) return;
      
      const products = await response.json();
      const product = products.find(p => p.id === productId);
      
      if (!product) return;
      
      // إنشاء مخطط المنتج الديناميكي
      const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "image": product.image,
        "description": `${product.title} في الكويت بأفضل سعر ${product.sale_price} د.ك شحن مجاني فوق 100 د.ك`,
        "brand": {
          "@type": "Brand",
          "name": product.brand || "سوق الكويت"
        },
        "category": product.category,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "KWD",
          "price": product.sale_price.toString(),
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "سوق الكويت"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating.toString(),
          "reviewCount": product.reviews.toString()
        }
      };
      
      // البحث عن مخطط موجود وتحديثه أو إنشاء جديد
      let existingSchema = document.querySelector('script[type="application/ld+json"]');
      if (existingSchema) {
        existingSchema.textContent = JSON.stringify(schema);
      } else {
        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        schemaScript.textContent = JSON.stringify(schema);
        document.head.appendChild(schemaScript);
      }
      
      console.log(`Dynamic schema loaded for product: ${product.title}`);
      
    } catch (error) {
      console.log('Schema generation error:', error);
    }
  }

  // تشغيل عند تحميل الصفحة
  document.addEventListener('DOMContentLoaded', generateProductSchema);
})();