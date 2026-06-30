# GitHub Pages 문의 접수 설정 안내

이 홈페이지는 GitHub Pages처럼 정적 사이트로 운영되므로, 브라우저만으로는 문의 내용을 서버에 저장하거나 메일을 발송할 수 없습니다.

권장 구성은 아래와 같습니다.

1. 홈페이지: GitHub Pages
2. 문의 저장 서버: Google Apps Script Web App
3. 저장 위치: Google Sheets
4. 알림 메일 수신자: `suhan@visionaryone.co.kr`

## 1. Google Sheet 만들기

Google Drive에서 새 스프레드시트를 만들고 첫 번째 시트 이름을 `문의`로 변경합니다.

첫 행에는 아래 헤더를 넣습니다.

```text
접수일시 | 회사명 | 부서 | 이름 | 연락처 | 이메일 | 문의내용 | 접수경로
```

## 2. Apps Script 만들기

스프레드시트에서 `확장 프로그램 > Apps Script`를 열고 아래 코드를 붙여 넣습니다.

```javascript
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
```

## 3. Web App으로 배포

Apps Script에서 `배포 > 새 배포`를 선택합니다.

설정값:

- 유형: 웹 앱
- 실행 사용자: 나
- 액세스 권한: 모든 사용자

배포 후 생성되는 Web App URL을 복사합니다.

## 4. 홈페이지에 접수 서버 URL 연결

`script.js`에서 아래 값을 복사한 Web App URL로 교체합니다.

```javascript
const inquiryEndpoint = 'https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID/exec';
```

예:

```javascript
const inquiryEndpoint = 'https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxx/exec';
```

이후 GitHub에 push하면 `문의하기` 제출 시 Google Sheet에 저장되고, `suhan@visionaryone.co.kr`로 접수 알림 메일이 발송됩니다.

## 동작 방식

현재 홈페이지의 문의 양식은 `mailto`를 사용하지 않습니다.

폼 제출 시:

1. 사용자가 문의 양식 입력
2. 브라우저가 Google Apps Script Web App으로 데이터 전송
3. Apps Script가 Google Sheets에 저장
4. Apps Script가 담당자에게 메일 알림 발송
5. 홈페이지에는 접수 완료 메시지 표시
