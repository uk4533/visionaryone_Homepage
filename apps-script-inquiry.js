const RECIPIENT = 'suhan@visionaryone.co.kr';
const SHEET_NAME = '문의';

function doPost(e) {
  const data = JSON.parse(e.postData.contents || '{}');
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  const submittedAt = data.submittedAt ? new Date(data.submittedAt) : new Date();
  const row = [
    submittedAt,
    data.company || '',
    data.department || '',
    data.name || '',
    data.phone || '',
    data.email || '',
    data.message || '',
    data.source || 'visionaryone-homepage',
  ];

  sheet.appendRow(row);

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
}
