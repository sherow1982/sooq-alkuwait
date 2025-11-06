// سكريبت لنسخ جميع صفحات المنتجات من products-pages إلى pages
// وإصلاح روابط الكتالوج

const fs = require('fs');
const path = require('path');

// قائمة ملفات المنتجات الموجودة في products-pages
const productFiles = [
    "-ماكينة-قص-الشعر-الاحترافية-1702.html",
    "0حامل-هاتف-كليب-1398.html",
    "100-بطانة-ورقية-تستخدم-لمرة-واحدة-للمقلاة-الهوائية-1147.html",
    "100-قطعة-من-مسامير-البندقية-الأساسية-1031.html",
    "12-قطعة-من-منظف-أقراص-فوار-1698.html",
    "12-قطعة-منظف-غسلات-1269.html",
    "12-مصباح-يدوي-1028.html",
    "2-سلندر-ضاغط-901.html",
    "2-في-1-قاتل-البعوض-890.html",
    "3-في-1-شاحن-لاسلكي-952.html",
    "3-في-1-فرشاة-تصفيف-الشعر-بمجفف-الشعر-1674.html",
    "3-قطع-كشاف-على-شكل-كاميرا-1154.html",
    "3-قطعه-زجاجة-مياه-الشرب-الرياضيه-1351.html",
    "3-لوح-تقطيع-من-خشب-1704.html",
    "4-5-111-1255.html",
    "4-قطعمجموعة-حقائب-مدرسية-883.html",
    "50-مجموعة-من-أدوات-التثبيت-824.html",
    "6-شاحن-لاسلكي-للسيارة-بمستشعر-ذكي-906.html",
    "6-قطعمجموعة-حقائب-السفر-1415.html",
    "6-مل-مرطب-شفاه-قوي-ثلاثي-الأبعاد-832.html"
    // وهكذا لكل المنتجات...
];

// دالة لاستخراج ID من اسم الملف
function extractIdFromFilename(filename) {
    const match = filename.match(/-([0-9]+)\.html$/);
    return match ? parseInt(match[1]) : null;
}

// دالة لنسخ الملفات وتحديث الروابط
function copyAndFixFiles() {
    const sourceDir = 'products-pages';
    const targetDir = 'pages';
    
    // إنشاء مجلد pages إذا لم يكن موجوداً
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    
    productFiles.forEach(filename => {
        const sourcePath = path.join(sourceDir, filename);
        const targetPath = path.join(targetDir, filename);
        
        if (fs.existsSync(sourcePath)) {
            let content = fs.readFileSync(sourcePath, 'utf8');
            
            // تحديث الروابط الكنسية والصور
            content = content.replace(
                /https:\/\/sherow1982\.github\.io\/sooq-alkuwait\/pages\//g,
                'https://sherow1982.github.io/sooq-alkuwait/pages/'
            );
            
            // تحديث روابط التنقل
            content = content.replace(
                'href="https://sherow1982.github.io/sooq-alkuwait/index-products.html"',
                'href="https://sherow1982.github.io/sooq-alkuwait/products-catalog.html"'
            );
            
            fs.writeFileSync(targetPath, content);
            console.log(`تم نسخ: ${filename}`);
        }
    });
}

console.log('بدء عملية النسخ والإصلاح...');
copyAndFixFiles();
console.log('تمت العملية بنجاح!');
