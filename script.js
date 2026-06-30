const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  observer.observe(element);
});

const inquiryModal = document.querySelector('#inquiry-modal');
const inquiryForm = document.querySelector('#inquiry-form');
const inquiryStatus = document.querySelector('#inquiry-status');
const openInquiryButtons = document.querySelectorAll('.js-open-inquiry');
const closeInquiryButtons = document.querySelectorAll('[data-close-inquiry]');
const inquiryEndpoint = 'https://script.google.com/macros/s/AKfycbwad1kBtqraZSeKyuTeRDCglOHSgUeG--n_xbKgttdfoZUzn4RR-K2ZZHKo2JnFB67WKQ/exec';

const openInquiryModal = () => {
  inquiryModal.classList.add('open');
  inquiryModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  inquiryStatus.textContent = '';
  inquiryStatus.className = 'form-status';
  inquiryForm.querySelector('input[name="company"]').focus();
};

const closeInquiryModal = () => {
  inquiryModal.classList.remove('open');
  inquiryModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};

openInquiryButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    openInquiryModal();
  });
});

closeInquiryButtons.forEach((button) => {
  button.addEventListener('click', closeInquiryModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && inquiryModal.classList.contains('open')) {
    closeInquiryModal();
  }
});

inquiryForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!inquiryForm.reportValidity()) {
    return;
  }

  const formData = new FormData(inquiryForm);
  const company = formData.get('company').trim();
  const department = formData.get('department').trim();
  const name = formData.get('name').trim();
  const phone = formData.get('phone').trim();
  const email = formData.get('email').trim() || '미기재';
  const message = formData.get('message').trim();
  const submitButton = inquiryForm.querySelector('button[type="submit"]');

  const inquiry = {
    company,
    department,
    name,
    phone,
    email,
    message,
    source: 'visionaryone-homepage',
    submittedAt: new Date().toISOString(),
  };

  submitButton.disabled = true;
  submitButton.innerHTML = '접수 중... <span>↗</span>';
  inquiryStatus.textContent = '';
  inquiryStatus.className = 'form-status';

  if (inquiryEndpoint.includes('YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID')) {
    inquiryStatus.textContent = '문의 접수 서버 URL이 아직 설정되지 않았습니다. GitHub 배포 전 접수 서버 URL을 연결해주세요.';
    inquiryStatus.classList.add('error');
    submitButton.disabled = false;
    submitButton.innerHTML = '문의하기 <span>↗</span>';
    return;
  }

  fetch(inquiryEndpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(inquiry),
  })
    .then(() => {
      inquiryForm.reset();
      inquiryStatus.textContent = '문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.';
      inquiryStatus.classList.add('success');
    })
    .catch(() => {
      inquiryStatus.textContent = '문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
      inquiryStatus.classList.add('error');
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.innerHTML = '문의하기 <span>↗</span>';
    });
});
