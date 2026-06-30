const RECIPIENT = 'suhan@visionaryone.co.kr';
const SHEET_NAME = '문의';

function doGet() {
  return ContentService
    .createTextOutput('Visionary One inquiry endpoint is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.appendRow([
        '접수일시',
        '회사명',
        '부서',
        '이름',
        '연락처',
        '이메일',
        '문의 내용',
        '접수 경로',
      ]);
    }

    const submittedAt = data.submittedAt ? new Date(data.submittedAt) : new Date();
    sheet.appendRow([
      submittedAt,
      data.company || '',
      data.department || '',
      data.name || '',
      data.phone || '',
      data.email || '',
      data.message || '',
      data.source || 'visionaryone-homepage',
    ]);

    const subject = `[비저너리원 홈페이지 문의] ${data.company || '회사명 미기재'} / ${data.name || '이름 미기재'}`;
    const body = [
      '비저너리원 홈페이지 문의가 접수되었습니다.',
      '',
      `회사명: ${data.company || ''}`,
      `부서: ${data.department || ''}`,
      `이름: ${data.name || ''}`,
      `연락처: ${data.phone || ''}`,
      `이메일: ${data.email || ''}`,
      '',
      '문의 내용:',
      data.message || '',
    ].join('\n');

    MailApp.sendEmail(RECIPIENT, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
