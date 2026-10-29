// Общая механика: списки из data.js, форма заявки, видеоотзывы, Метрика.

// Телефон РФ (10–11 цифр) или ник Telegram (5–32 символа: буквы, цифры, _). Возвращает {type, value} или null.
function parseContact(raw) {
  const v = String(raw || '').trim();
  const nick = v.replace(/^@/, '').replace(/^(https?:\/\/)?t\.me\//i, '');
  if (/^[a-z][a-z0-9_]{4,31}$/i.test(nick)) return { type: 'telegram', value: '@' + nick };
  if (/[^\d\s()+-]/.test(v)) return null;
  let d = v.replace(/\D/g, '');
  if (d.length === 11 && (d[0] === '7' || d[0] === '8')) d = d.slice(1);
  if (d.length === 10) return { type: 'phone', value: '+7' + d };
  return null;
}

// Текст заявки, который уйдёт менеджеру в мессенджер; пустую «машину» не пишем.
function leadMessage({ name, contact, car }) {
  return ['Здравствуйте! Заявка с сайта.', 'Имя: ' + name, 'Контакт: ' + contact, car ? 'Ищу: ' + car : ''].filter(Boolean).join('\n');
}

if (typeof module !== 'undefined') module.exports = { parseContact, leadMessage };

if (typeof document !== 'undefined') {
  // <template data-list="cars"> → по копии на каждый элемент SIA.cars.
  // data-f="поле" ставит текст, {поле} в любом атрибуте подставляется ({i} — номер с 1).
  document.querySelectorAll('template[data-list]').forEach((tpl) => {
    const frag = document.createDocumentFragment();
    (window.SIA[tpl.dataset.list] || []).forEach((item, i) => {
      const node = tpl.content.cloneNode(true);
      const fill = (s) => s.replace(/\{(\w+)\}/g, (_, k) => (k === 'i' ? i + 1 : item[k] ?? ''));
      node.querySelectorAll('[data-f]').forEach((el) => { el.textContent = fill('{' + el.dataset.f + '}'); });
      node.querySelectorAll('*').forEach((el) => {
        [...el.attributes].forEach((a) => { if (a.value.includes('{')) a.value = fill(a.value); });
      });
      frag.append(node);
    });
    tpl.replaceWith(frag);
  });

  // Форма: проверка на месте, затем заявка уходит менеджеру через мессенджер с уже набранным текстом.
  // shortcut: без сервера заявка доходит, только если человек нажмёт «Отправить» в мессенджере; при переносе на Tilda — её формы (Telegram + почта).
  document.querySelectorAll('form[data-lead]').forEach((form) => {
    const status = form.querySelector('.lead__status');
    const setErr = (input, msg) => {
      const err = document.getElementById(input.getAttribute('aria-describedby'));
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg || '';
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.elements.name, contact = form.elements.contact, consent = form.elements.consent;
      let first = null;
      const check = (input, msg) => { setErr(input, msg); if (msg && !first) first = input; };
      check(name, name.value.trim().length < 2 ? 'Напишите, как к вам обращаться' : '');
      check(contact, parseContact(contact.value) ? '' : 'Нужен телефон (+7 999 123-45-67) или ник в Telegram (@username)');
      check(consent, consent.checked ? '' : 'Без согласия мы не можем принять заявку');
      if (first) { first.focus(); return; }
      const text = encodeURIComponent(leadMessage({ name: name.value.trim(), contact: parseContact(contact.value).value, car: form.elements.car?.value.trim() }));
      status.innerHTML = 'Заявка готова. Выберите мессенджер — сообщение уже набрано, останется нажать «Отправить».'
        + `<span class="lead__go"><a href="https://t.me/SIAMOTORSmng?text=${text}" target="_blank" rel="noopener">Отправить в Telegram</a>`
        + `<a href="https://wa.me/79958664002?text=${text}" target="_blank" rel="noopener">Отправить в WhatsApp</a></span>`;
      status.querySelector('a').focus();
    });
    form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') setErr(e.target, ''); });
  });

  // Видеоотзывы: кнопка с data-video открывает плеер.
  const player = document.querySelector('dialog.player');
  if (player) {
    const video = player.querySelector('video');
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-video]');
      if (!btn) return;
      video.poster = btn.querySelector('img')?.src || '';
      video.src = btn.dataset.video;
      player.showModal();
      video.play().catch(() => {});
    });
    player.addEventListener('close', () => { video.pause(); video.removeAttribute('src'); video.load(); });
    player.addEventListener('click', (e) => { if (e.target === player) player.close(); });
  }

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Яндекс.Метрика старого сайта — только на боевом домене, чтобы просмотры макетов не портили статистику.
  if (/(^|\.)siamotors\.ru$/.test(location.hostname)) {
    (function (m, e, t, r, i, k, a) { m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); }; m[i].l = 1 * new Date(); k = e.createElement(t); a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r; a.parentNode.insertBefore(k, a); })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    window.ym(102415136, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
  }
}
