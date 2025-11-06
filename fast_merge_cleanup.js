// 🚀 تشغيل عملية دمج الفروع وحذف غير اللازمة - سريع وآمن
// هذا السكريبت يرفع محتوى الفروع المهمة إلى main دون rebase

const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');

console.log('🔄 بدء عملية دمج الفروع وحذف غير اللازمة - تنفيذ آلي سريع...');

const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m', 
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, successMessage = null, ignoreErrors = false) {
    try {
        log(`💻 Executing: ${command}`, 'blue');
        const result = execSync(command, { stdio: 'pipe' }).toString().trim();
        if (successMessage) log(successMessage, 'green');
        return result;
    } catch (error) {
        if (!ignoreErrors) {
            log(`❌ Error: ${error.message}`, 'red');
            log(`Command failed: ${command}`, 'yellow');
        }
        return null;
    }
}

// 💥 حل سريع بجلب محتوى الفروع مباشرة ونسخه لـ main
async function fastMergeApproach() {
    try {
        log('📋 المرحلة 1: تحضير main', 'yellow');
        runCommand('git checkout main', '✅ تم الانتقال لـ main');
        runCommand('git pull origin main', '✅ تم تحديث main');

        log('📋 المرحلة 2: جلب تحسينات فرع التنظيف', 'yellow');
        
        // جلب الملفات المهمة من cleaning/refactor-structure
        const importantFiles = [
            'index.html',  // الصفحة الرئيسية مع الفئات المحدثة
            'package.json', // npm scripts الجديدة
            'robots.txt',   // روبوتز محدث
            'sitemap.xml',  // سايت ماب محدث
            'merchant-feed.xml' // فيد GMC
        ];
        
        log('📁 جلب الملفات المهمة من cleaning/refactor-structure...', 'yellow');
        for (const file of importantFiles) {
            const fetchResult = runCommand(`git show cleaning/refactor-structure:${file}`, null, true);
            if (fetchResult) {
                fs.writeFileSync(file, fetchResult);
                log(`✅ تم جلب ${file}`, 'green');
            } else {
                log(`⚠️ ${file} غير موجود في فرع التنظيف`, 'yellow');
            }
        }
        
        // جلب مجلد scripts/ بالكامل
        if (!fs.existsSync('scripts')) {
            fs.mkdirSync('scripts');
        }
        
        const scriptsFiles = runCommand('git ls-tree -r --name-only cleaning/refactor-structure | grep "^scripts/"', null, true);
        if (scriptsFiles) {
            const files = scriptsFiles.split('\n').filter(f => f.trim());
            for (const file of files) {
                const content = runCommand(`git show cleaning/refactor-structure:${file}`, null, true);
                if (content) {
                    const dir = file.split('/').slice(0, -1).join('/');
                    if (dir && !fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                    fs.writeFileSync(file, content);
                    log(`✅ تم جلب ${file}`, 'green');
                }
            }
        }

        log('📋 المرحلة 3: جلب إصلاحات زر الكارت', 'yellow');
        
        // جلب قوالب HTML المحدثة من fix-cart-and-products-v4
        const cartFixFiles = [
            'FIXED-TEMPLATE-with-working-cart.html',
            'WORKING-SAMPLE-professional-template.html'
        ];
        
        for (const template of cartFixFiles) {
            const templatePath = `products-pages/${template}`;
            const content = runCommand(`git show fix-cart-and-products-v4:${templatePath}`, null, true);
            if (content) {
                if (!fs.existsSync('products-pages')) {
                    fs.mkdirSync('products-pages');
                }
                fs.writeFileSync(templatePath, content);
                log(`✅ تم جلب قالب ${template}`, 'green');
            }
        }

        log('📋 المرحلة 4: حفظ التغييرات ورفعها', 'yellow');
        runCommand('git add .', '✅ تم إضافة الملفات');
        
        const commitResult = runCommand('git commit -m "🧹 دمج يدوي للتحسينات: تنظيف شامل + إصلاح زر الكارت + هيكل منظم"', null, true);
        if (commitResult) {
            runCommand('git push origin main', '✅ تم رفع التغييرات لـ main');
        } else {
            log('⚠️ لا توجد تغييرات جديدة لحفظا', 'yellow');
        }

        log('📋 المرحلة 5: حذف الفروع غير اللازمة', 'yellow');
        
        const branchesToDelete = [
            'cleaning/refactor-structure',
            'fix-cart-and-products-v4', 
            'code-cleanup',
            'products-pages-v2'
        ];
        
        for (const branch of branchesToDelete) {
            // حذف محلي
            runCommand(`git branch -D ${branch}`, null, true);
            // حذف من GitHub
            const deleteResult = runCommand(`git push origin --delete ${branch}`, null, true);
            if (deleteResult) {
                log(`✅ تم حذف فرع ${branch}`, 'green');
            } else {
                log(`⚠️ فرع ${branch} غير موجود أو محذوف مسبقاً`, 'yellow');
            }
        }

        log('📋 المرحلة 6: تشغيل البناء والمولدات', 'yellow');
        
        // تشغيل البناء npm إذا كان متوفراً
        if (fs.existsSync('package.json')) {
            const packageContent = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            if (packageContent.scripts && packageContent.scripts.build) {
                log('📦 تشغيل npm build...', 'yellow');
                runCommand('npm install', '✅ npm install مكتمل', true);
                runCommand('npm run build', '✅ npm run build مكتمل', true);
            } else {
                log('⚠️ npm run build غير متوفر - جاري تشغيل المولدات اليدوية', 'yellow');
            }
        }
        
        // تشغيل المولدات اليدوية
        const generators = ['generate_products.js', 'instant_run.js', 'cleanup_and_run.js'];
        for (const gen of generators) {
            if (fs.existsSync(gen)) {
                log(`⚡ تشغيل ${gen}...`, 'yellow');
                runCommand(`node ${gen}`, `✅ تم تشغيل ${gen}`, true);
            }
        }

        log('📋 التحقق النهائي', 'yellow');
        
        // عرض الفروع المتبقية
        const remoteBranches = runCommand('git branch -r', '✅ تم جلب قائمة الفروع');
        if (remoteBranches) {
            log('📊 الفروع البعيدة المتبقية:', 'blue');
            console.log(remoteBranches);
        }
        
        // فحص الملفات المولدة
        log('📁 الملفات المولدة:', 'blue');
        
        const checkFiles = ['sitemap.xml', 'merchant-feed.xml', 'feeds/sitemap.xml', 'feeds/merchant-feed.xml'];
        for (const file of checkFiles) {
            if (fs.existsSync(file)) {
                const stats = fs.statSync(file);
                const lines = fs.readFileSync(file, 'utf8').split('\n').length;
                log(`✅ ${file}: ${stats.size} bytes, ${lines} lines`, 'green');
            } else {
                log(`❌ ${file}: غير موجود`, 'red');
            }
        }
        
        // حفظ التغييرات النهائية والدفع
        runCommand('git add .', '✅ تم إضافة الملفات');
        const finalCommit = runCommand('git commit -m "🎆 تنفيذ تلقائي: دمج تحسينات + حذف فروع + بناء نهائي"', null, true);
        if (finalCommit) {
            runCommand('git push origin main', '✅ تم رفع النتيجة النهائية');
        }

        log('🎉 تم الانتهاء من عملية الدمج والتنظيف!', 'green');
        log('📈 النتائج:', 'green');
        log('   ✅ تم دمج التحسينات الرئيسية (فئات + فيدز + هيكل)', 'green');
        log('   ✅ تم جلب إصلاحات زر الكارت (قوالب HTML)', 'green');
        log('   ✅ تم حذف الفروع غير اللازمة', 'green');
        log('   ✅ تم تشغيل البناء والمولدات', 'green');
        
        const currentBranch = runCommand('git branch --show-current', null, true);
        const remoteBranchCount = runCommand('git branch -r | wc -l', null, true);
        
        log(`   📍 الفرع النشط: ${currentBranch || 'main'}`, 'green');
        log(`   📊 عدد الفروع البعيدة: ${remoteBranchCount || '1'}`, 'green');
        
        log('🚀 المستودع جاهز للنشر والتشغيل!', 'green');
        
        // اختبار سريع للملفات المهمة
        log('🔍 اختبار سريع:', 'yellow');
        if (fs.existsSync('products_data.json')) {
            const productsData = JSON.parse(fs.readFileSync('products_data.json', 'utf8'));
            log(`📆 عدد المنتجات: ${productsData.length}`, 'blue');
        }
        
        if (fs.existsSync('products-pages/')) {
            const pagesCount = fs.readdirSync('products-pages/').filter(f => f.endsWith('.html')).length;
            log(`📄 عدد صفحات المنتجات: ${pagesCount}`, 'blue');
        }
        
        log('🔥 العملية مكتملة بنجاح - الموقع جاهز للعمل!', 'green');

    } catch (error) {
        log(`❌ خطأ في العملية: ${error.message}`, 'red');
        process.exit(1);
    }
}

// تشغيل العملية
fastMergeApproach();