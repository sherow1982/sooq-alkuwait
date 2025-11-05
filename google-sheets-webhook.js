// سكريبت تكامل Google Sheets لحفظ وإدارة طلبات العملاء
// لاستخدام هذا السكريبت:
// 1. انشئ Google Sheets جديد
// 2. اذهب لـ Tools > Script Editor
// 3. انسخ هذا الكود واحفظه
// 4. اضغط Deploy > New Deployment > Web app
// 5. انسخ رابط الـ Web App في checkout-webhook.js

function doPost(e) {
  try {
    // فتح الجدول النشط (أو بالـ ID المحدد)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // إذا كان الجدول فارغ، أضف رؤوس الأعمدة
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'تاريخ الطلب',
        'الوقت',
        'الاسم',
        'رقم الهاتف',
        'المحافظة',
        'العنوان',
        'تفاصيل الطلب',
        'الإجمالي (د.ك)',
        'حالة الطلب',
        'ملاحظات'
      ]);
      
      // تنسيق رأس الجدول
      const headerRange = sheet.getRange(1, 1, 1, 10);
      headerRange.setBackground('#007A3D');
      headerRange.setFontColor('#FFFFFF');
      headerRange.setFontWeight('bold');
      headerRange.setFontSize(12);
    }
    
    // استخراج بيانات الطلب
    const data = JSON.parse(e.postData.contents);
    const orderDate = new Date(data.timestamp);
    const formattedDate = Utilities.formatDate(orderDate, 'Asia/Kuwait', 'yyyy-MM-dd');
    const formattedTime = Utilities.formatDate(orderDate, 'Asia/Kuwait', 'HH:mm:ss');
    
    // تجهيز تفاصيل الطلب
    let orderDetails = '';
    data.items.forEach((item, index) => {
      orderDetails += `${index + 1}. ${item.title} - الكمية: ${item.quantity || 1} - السعر: ${item.sale_price || item.price} د.ك\n`;
    });
    
    // إضافة الطلب إلى الجدول
    sheet.appendRow([
      formattedDate,
      formattedTime,
      data.customer.name,
      data.customer.phone,
      data.customer.governorate,
      data.customer.address,
      orderDetails.trim(),
      data.total.toFixed(2),
      'جديد',
      'طلب من الموقع'
    ]);
    
    // تنسيق الصف الجديد
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow, 1, 1, 10);
    range.setBorder(true, true, true, true, true, true);
    
    // لون مختلف للطلبات الجديدة
    range.setBackground('#f0f9ff');
    
    // تنسيق الإجمالي باللون الأخضر
    sheet.getRange(lastRow, 8).setFontWeight('bold').setFontColor('#007A3D');
    
    // إرسال إشعار بريد إلكتروني (اختياري)
    try {
      const emailBody = `
        طلب جديد من سوق الكويت
        
        العميل: ${data.customer.name}
        الهاتف: ${data.customer.phone}
        المحافظة: ${data.customer.governorate}
        العنوان: ${data.customer.address}
        
        تفاصيل الطلب:
        ${orderDetails}
        
        الإجمالي: ${data.total.toFixed(2)} د.ك
      `;
      
      MailApp.sendEmail({
        to: 'your-email@example.com', // غيّر هذا لبريدك
        subject: `🎆 طلب جديد #${lastRow} من ${data.customer.name}`,
        body: emailBody
      });
    } catch (emailError) {
      console.log('خطأ في إرسال البريد:', emailError);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'تم حفظ الطلب بنجاح',
        orderNumber: lastRow,
        timestamp: orderDate.toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.log('خطأ في معالجة الطلب:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// اختبار الوظيفة
function testWebhook() {
  const testData = {
    timestamp: new Date().toISOString(),
    customer: {
      name: 'أحمح الصباح',
      phone: '+96555123456',
      governorate: 'حولي',
      address: 'قطعة 4، شارع القاهرة، بيت 15'
    },
    items: [
      {
        id: 1,
        title: 'حصالة صراف آلي',
        quantity: 1,
        sale_price: 13
      }
    ],
    total: 13
  };
  
  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  return doPost(e);
}