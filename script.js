const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav-links');
const form = document.querySelector('#consultation');
const topic = document.querySelector('#topic');
const status = document.querySelector('#form-status');
const submit = form.querySelector('button[type="submit"]');

function toggleMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
}

menu.hidden = false;
nav.classList.add('enhanced');
menu.addEventListener('click', () => toggleMenu(menu.getAttribute('aria-expanded') === 'false'));
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) toggleMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    toggleMenu(false);
    menu.focus();
  }
});

document.querySelectorAll('[data-topic]').forEach((link) => {
  link.addEventListener('click', () => {
    topic.value = link.dataset.topic;
  });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submit.disabled = true;
  status.className = 'form-status';
  status.textContent = '正在送出諮詢…';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(12000)
    });

    if (!response.ok) throw new Error('Form submission failed');
    form.reset();
    status.classList.add('success');
    status.textContent = '已收到你的諮詢，谷谷資訊會依你留下的聯絡方式回覆。';
  } catch {
    status.classList.add('error');
    status.textContent = '目前無法確認是否送出，資料仍保留在表單中。你可以重試，或透過電子郵件或 LINE 聯絡我們。';
  } finally {
    submit.disabled = false;
  }
});
