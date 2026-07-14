// ============================================
// Google Apps Script — Свадебная анкета
// ============================================
// Как использовать:
// 1. Откройте Google Таблицу
// 2. Расширения → Apps Script
// 3. Вставьте этот код
// 4. Нажмите "Деплой" → "Новое деплоивание"
// 5. Тип: Веб-приложение, Доступ: Все, Кто: Все
// 6. Скопируйте URL и вставьте в script.js на сайте
// ============================================

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Если первый запуск — создаём заголовки
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Дата заполнения',
        'Имя',
        'Телефон',
        'Участие',
        'Кол-во гостей',
        'Способ связи',
        'Аллергии',
        'Дети',
        'Пожелания'
      ]);
      // Форматируем заголовки
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#ac884e');
      headerRange.setFontColor('#ffffff');
      sheet.setColumnWidth(1, 160);
      sheet.setColumnWidth(2, 180);
      sheet.setColumnWidth(3, 160);
      sheet.setColumnWidth(4, 200);
      sheet.setColumnWidth(5, 120);
      sheet.setColumnWidth(6, 160);
      sheet.setColumnWidth(7, 250);
      sheet.setColumnWidth(8, 80);
      sheet.setColumnWidth(9, 350);
    }
    
    // Записываем данные
    var now = new Date();
    var timestamp = Utilities.formatDate(now, 'Europe/Moscow', 'dd.MM.yyyy HH:mm:ss');
    
    sheet.appendRow([
      timestamp,
      data['Имя'] || '',
      data['Телефон'] || '',
      data['Участие'] || '',
      data['Кол-во гостей'] || '',
      data['Способ связи'] || '',
      data['Аллергии'] || '',
      data['Дети'] || '',
      data['Пожелания'] || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Данные сохранены' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET-запрос (для проверки что скрипт работает)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Свадебная анкета работает' }))
    .setMimeType(ContentService.MimeType.JSON);
}
