// تشغيل سريع ومباشر
const fs = require('fs');
const path = require('path');

// قراءة ملف البيانات
const productsData = JSON.parse(fs.readFileSync('./products_data.json', 'utf8'));

console.log(`🚀 بدء توليد ${productsData.length} صفحة منتج...`);

// تشغيل المولد
const { main } = require('./generate_products.js');

// تنفيذ فوري
(async () => {
    try {
        const results = await main();
        if (results) {
            console.log('✅ تم النشر والتوليد بنجاح!');
            process.exit(0);
        } else {
            console.error('❌ فشل في العملية');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ خطأ:', error);
        process.exit(1);
    }
})();