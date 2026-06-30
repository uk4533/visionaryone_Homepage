const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? '硫붾돱 ?リ린' : '硫붾돱 ?닿린');
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
const inquiryEndpoint = 'https://script.google.com/macros/s/AKfycbw5V1fVBShvGJ-1LTscIqTqKxF_1c-FEwk7xpvrRVUB09lrkqekQSL3UKTN1jQl6MORVw/exec';

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
  const email = formData.get('email').trim() || '誘멸린??;
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
  submitButton.innerHTML = '?묒닔 以?.. <span>??/span>';
  inquiryStatus.textContent = '';
  inquiryStatus.className = 'form-status';

  if (inquiryEndpoint.includes('YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_ID')) {
    inquiryStatus.textContent = '臾몄쓽 ?묒닔 ?쒕쾭 URL???꾩쭅 ?ㅼ젙?섏? ?딆븯?듬땲?? GitHub 諛고룷 ???묒닔 ?쒕쾭 URL???곌껐?댁＜?몄슂.';
    inquiryStatus.classList.add('error');
    submitButton.disabled = false;
    submitButton.innerHTML = '臾몄쓽?섍린 <span>??/span>';
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
      inquiryStatus.textContent = '臾몄쓽媛 ?묒닔?섏뿀?듬땲?? ?대떦?먭? ?뺤씤 ???곕씫?쒕━寃좎뒿?덈떎.';
      inquiryStatus.classList.add('success');
    })
    .catch(() => {
      inquiryStatus.textContent = '臾몄쓽 ?묒닔 以?臾몄젣媛 諛쒖깮?덉뒿?덈떎. ?좎떆 ???ㅼ떆 ?쒕룄?댁＜?몄슂.';
      inquiryStatus.classList.add('error');
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.innerHTML = '臾몄쓽?섍린 <span>??/span>';
    });
});

