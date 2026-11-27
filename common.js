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

if (typeof module !== 'undefined') module.exports = { parseContact };

if (typeof document !== 'undefined') {
  // <template data-list="cars"> → по копии на каждый элемент SIA.cars.
  // data-f="поле" ставит текст, {поле} в любом атрибуте подставляется ({i} — номер с 1).
  document.querySelectorAll('template[data-list]').forEach((tpl) => {
    const frag = document.createDocumentFragment();
    (window.SIA[tpl.dataset.list] || []).forEach((item, i) => {
      const node = tpl.content.cloneNode(true);
      const fields = { ...item, i: i + 1 };
      if (tpl.dataset.list === 'cars') {
        fields.botSource = ('site_' + item.name + '_' + item.year).replace(/[^A-Za-z0-9_-]+/g, '_').slice(0, 64);
      }
      const fill = (s) => s.replace(/\{(\w+)\}/g, (_, k) => fields[k] ?? '');
      node.querySelectorAll('[data-f]').forEach((el) => { el.textContent = fill('{' + el.dataset.f + '}'); });
      node.querySelectorAll('*').forEach((el) => {
        [...el.attributes].forEach((a) => { if (a.value.includes('{')) a.value = fill(a.value); });
      });
      frag.append(node);
    });
    tpl.replaceWith(frag);
  });

  // В предпросмотре проверяем поля локально. Реальную заявку принимает бот.
  document.querySelectorAll('form[data-lead][data-preview]').forEach((form) => {
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
      status.innerHTML = 'В предпросмотре данные остаются в браузере.'
        + '<span class="lead__go"><a href="https://t.me/SIAMOTORS_agent?start=site_form">Оставить заявку в боте</a></span>';
      status.querySelector('a').focus();
    });
    form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid') === 'true') setErr(e.target, ''); });
    form.querySelector('[type="submit"]').disabled = false;
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

  // Вопросы: <details> открывается рывком, поэтому высоту ведём сами; без JS и при «уменьшить движение» работает обычное открытие.
  document.querySelectorAll('details.qa').forEach((qa) => {
    const summary = qa.querySelector('summary');
    let anim = null;
    summary.addEventListener('click', (e) => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      e.preventDefault();
      const willOpen = !qa.open || qa.classList.contains('is-closing');
      const from = qa.offsetHeight;
      anim?.cancel();
      qa.open = true;
      qa.classList.toggle('is-closing', !willOpen);
      const to = willOpen ? qa.offsetHeight : summary.offsetHeight + qa.offsetHeight - qa.clientHeight;
      qa.style.overflow = 'hidden';
      anim = qa.animate({ height: [from + 'px', to + 'px'] }, { duration: 350, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      anim.onfinish = () => {
        qa.open = willOpen;
        qa.classList.remove('is-closing');
        qa.style.overflow = '';
        anim = null;
      };
    });
  });

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Яндекс.Метрика старого сайта — только на боевом домене, чтобы просмотры макетов не портили статистику.
  if (/(^|\.)siamotors\.ru$/.test(location.hostname)) {
    (function (m, e, t, r, i, k, a) { m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); }; m[i].l = 1 * new Date(); k = e.createElement(t); a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r; a.parentNode.insertBefore(k, a); })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    window.ym(102415136, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
  }
}
