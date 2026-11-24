/* ═══════════════════════════════════════════════════════════════
   عطورات ليشو — منطق الواجهة: اللغة، الحقيبة، الطلب، النوافذ.
   متجر نموذجي بالكامل: لا شبكة، لا خادم، لا دفع. الحالة في localStorage فقط.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const PRODUCTS = window.LP_PRODUCTS;
  const I18N = window.LP_I18N;
  const STORE_KEY = 'leesho-parfums.v1';

  const state = {
    lang: 'ar',
    cart: [],   // [{ id, qty }]
  };

  /* ── الحفظ والاسترجاع ── */
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ lang: state.lang, cart: state.cart })); }
    catch { /* وضع التصفح الخاص — نتجاهل بصمت */ }
  }
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      if (raw.lang && I18N[raw.lang]) state.lang = raw.lang;
      if (Array.isArray(raw.cart)) {
        state.cart = raw.cart.filter((l) => PRODUCTS.some((p) => p.id === l.id) && l.qty > 0);
      }
    } catch { /* بيانات تالفة — نبدأ نظيفًا */ }
  }

  /* ── مساعدات ── */
  const t = (key) => I18N[state.lang][key] ?? key;
  const product = (id) => PRODUCTS.find((p) => p.id === id);
  const loc = (p) => p[state.lang];
  const money = (n) => `${n.toLocaleString(state.lang === 'ar' ? 'ar-EG' : 'en-US')} ${t('sar')}`;
  const count = () => state.cart.reduce((s, l) => s + l.qty, 0);
  const total = () => state.cart.reduce((s, l) => s + product(l.id).price * l.qty, 0);

  /* ═══════════ اللغة ═══════════ */
  function applyLang() {
    const cfg = I18N[state.lang];
    document.documentElement.lang = cfg.htmlLang;
    document.documentElement.dir = cfg.dir;

    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });

    // اسم العلامة اللاتيني حرفًا حرفًا — حركة الظهور تحتاج عناصر مستقلة.
    // (العربية لا تُقسَّم حروفًا: ذلك يكسر التشكيل والوصل، فتبقى نصًّا حيًّا في hero__sub)
    const word = $('#heroWord');
    if (word && !word.childElementCount) {
      word.innerHTML = [...'LEESHO'].map((ch) => `<span>${ch}</span>`).join('');
    }

    renderProducts();
    renderCart();
    document.dispatchEvent(new CustomEvent('lp:lang'));
    save();
  }

  /* ═══════════ المجموعة ═══════════ */
  function renderProducts() {
    const track = $('#collTrack');
    if (!track) return;
    track.innerHTML = PRODUCTS.map((p) => {
      const l = loc(p);
      return `
      <article class="card" data-id="${p.id}">
        <div class="card__media">
          <img src="${p.img}" alt="${l.name}" loading="lazy">
          <div class="card__tone" style="background:${p.tone}"></div>
          <div class="card__actions">
            <button class="btn" data-add="${p.id}">${t('coll.add')}</button>
            <button class="btn" data-view="${p.id}">${t('coll.view')}</button>
          </div>
        </div>
        <div class="card__body">
          <div>
            <h3 class="card__name">${l.name}</h3>
            <p class="card__tag">${l.family}</p>
          </div>
          <p class="card__price">${money(p.price)}</p>
        </div>
      </article>`;
    }).join('');
  }

  /* ═══════════ الحقيبة ═══════════ */
  function addToCart(id, qty = 1) {
    const line = state.cart.find((l) => l.id === id);
    if (line) line.qty += qty;
    else state.cart.push({ id, qty });
    save(); renderCart(); bumpBadge();
    toast(`${loc(product(id)).name} — ${t('coll.added')}`);
  }
  function setQty(id, qty) {
    const line = state.cart.find((l) => l.id === id);
    if (!line) return;
    line.qty = qty;
    if (line.qty <= 0) state.cart = state.cart.filter((l) => l.id !== id);
    save(); renderCart();
  }

  function renderCart() {
    const body = $('#cartBody'), foot = $('#cartFoot'), badge = $('#cartBadge');
    if (!body) return;

    const n = count();
    badge.textContent = n;
    badge.classList.toggle('is-on', n > 0);

    if (!state.cart.length) {
      foot.hidden = true;
      body.innerHTML = `
        <div class="empty">
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>
          </svg>
          <p>${t('cart.empty')}</p>
          <button class="btn" data-close data-goto="#collection">${t('cart.emptyCta')}</button>
        </div>`;
      return;
    }

    foot.hidden = false;
    body.innerHTML = state.cart.map((line) => {
      const p = product(line.id), l = loc(p);
      return `
      <div class="ci">
        <div class="ci__img"><img src="${p.img}" alt="${l.name}"></div>
        <div>
          <p class="ci__name">${l.name}</p>
          <p class="ci__meta">${t('pd.size')} · ${l.family}</p>
          <div class="ci__qty">
            <button data-qty="${p.id}" data-delta="-1" aria-label="-">−</button>
            <span>${line.qty}</span>
            <button data-qty="${p.id}" data-delta="1" aria-label="+">+</button>
          </div>
          <button class="ci__rm" data-rm="${p.id}">${t('cart.remove')}</button>
        </div>
        <p class="ci__price">${money(p.price * line.qty)}</p>
      </div>`;
    }).join('');

    $('#cartSub').textContent = money(total());
  }

  function bumpBadge() {
    const b = $('#cartBadge');
    b.classList.remove('is-bump');
    void b.offsetWidth;               // إعادة تشغيل الحركة
    b.classList.add('is-bump');
  }

  /* ═══════════ النوافذ والدرج ═══════════ */
  let openLayer = null;

  function openDrawer() { open($('#drawer')); }
  function open(el) {
    closeAll(true);
    openLayer = el;
    el.classList.add('is-on');
    el.setAttribute('aria-hidden', 'false');
    if (el.id === 'mobileMenu') $('#menuBtn')?.setAttribute('aria-expanded', 'true');
    $('#scrim').classList.add('is-on');
    document.body.classList.add('is-locked');
  }
  function closeAll(silent) {
    ['#drawer', '#coModal', '#pdModal', '#mobileMenu'].forEach((s) => {
      const el = $(s);
      el.classList.remove('is-on');
      el.setAttribute('aria-hidden', 'true');
    });
    $('#menuBtn')?.setAttribute('aria-expanded', 'false');
    openLayer = null;
    if (silent) return;
    $('#scrim').classList.remove('is-on');
    document.body.classList.remove('is-locked');
  }

  /* ═══════════ تفاصيل المنتج ═══════════ */
  function openProduct(id) {
    const p = product(id), l = loc(p);
    const keys = ['notes.top.k', 'notes.heart.k', 'notes.base.k'];
    $('#pdBody').innerHTML = `
      <div class="pd__media"><img src="${p.img}" alt="${l.name}"></div>
      <div class="pd__body">
        <p class="eyebrow">${l.tag}</p>
        <h2 class="pd__name">${l.name}</h2>
        <p class="lede">${l.desc}</p>
        <div class="pd__notes">
          ${l.notes.map((n, i) => `<p class="pd__note"><b>${t(keys[i])}</b> ${n}</p>`).join('')}
        </div>
        <p class="pd__price">${money(p.price)} <span style="font-size:.8rem;color:var(--muted)">· ${t('pd.size')}</span></p>
        <button class="btn btn--solid" data-add="${p.id}">${t('coll.add')}</button>
      </div>`;
    open($('#pdModal'));
  }

  /* ═══════════ إتمام الطلب — ٤ خطوات، بلا أي إرسال ═══════════ */
  let step = 1;

  function openCheckout() {
    if (!state.cart.length) return;
    step = 1;
    renderStep();
    open($('#coModal'));
  }

  function renderStep() {
    $$('#coSteps i').forEach((el, i) => el.classList.toggle('is-done', i < step));
    const body = $('#coBody');

    if (step === 1) {
      body.innerHTML = `
        <h2>${t('co.s1')}</h2>
        ${state.cart.map((line) => {
          const p = product(line.id), l = loc(p);
          return `<div class="line" style="padding-block:.6rem;border-bottom:1px solid var(--line)">
                    <span>${l.name} <span style="color:var(--muted)">× ${line.qty}</span></span>
                    <span>${money(p.price * line.qty)}</span>
                  </div>`;
        }).join('')}
        <div class="line" style="padding-top:1rem"><span>${t('cart.subtotal')}</span><span>${money(total())}</span></div>
        <div class="line" style="padding-top:.4rem"><span>${t('co.shipping')}</span><span style="color:var(--accent)">${t('co.free')}</span></div>
        <div class="line line--total" style="padding-top:1rem"><span>${t('co.total')}</span><span>${money(total())}</span></div>
        <div class="co__nav"><button class="btn btn--solid" data-costep="2">${t('co.next')}</button></div>`;
    }

    if (step === 2) {
      body.innerHTML = `
        <h2>${t('co.s2')}</h2>
        <div class="co__grid">
          ${field('co.name', 'text', t('co.phName'))}
          ${field('co.phone', 'tel', t('co.phPhone'))}
          ${field('co.city', 'text', t('co.phCity'))}
          ${field('co.addr', 'text', t('co.phAddr'))}
        </div>
        <p class="demo-note">${t('co.demoNote')}</p>
        <div class="co__nav">
          <button class="btn" data-costep="1">${t('co.back')}</button>
          <button class="btn btn--solid" data-costep="3">${t('co.next')}</button>
        </div>`;
    }

    // الدفع: لا خانات بطاقة إطلاقًا — لوحة واضحة بأن الدفع غير مفعّل في النموذج،
    // وطرق الدفع معروضة كشارات معطّلة فقط لتوضيح شكل المتجر الحقيقي.
    if (step === 3) {
      const methods = ['co.payMada', 'co.payApple', 'co.payCard', 'co.payTabby'];
      body.innerHTML = `
        <h2>${t('co.s3')}</h2>
        <div class="paylock" role="note">
          <div class="paylock__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
          </div>
          <div>
            <p class="paylock__title">${t('co.payLock')}</p>
            <p class="paylock__desc">${t('co.payDesc')}</p>
          </div>
        </div>
        <ul class="paylock__methods">
          ${methods.map((k) => `<li aria-disabled="true"><span>${t(k)}</span><small>${t('co.payOff')}</small></li>`).join('')}
        </ul>
        <div class="line line--total" style="padding-top:1.4rem"><span>${t('co.total')}</span><span>${money(total())}</span></div>
        <div class="co__nav">
          <button class="btn" data-costep="2">${t('co.back')}</button>
          <button class="btn btn--solid" data-costep="4">${t('co.pay')}</button>
        </div>`;
    }

    if (step === 4) {
      const no = 'LP-DEMO-' + String(Math.floor(Math.random() * 9000) + 1000);
      body.innerHTML = `
        <div class="done">
          <div class="done__tick">
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5 9.5 18 20 7"/></svg>
          </div>
          <h2 style="margin:0">${t('co.done')}</h2>
          <p class="done__no">${t('co.order')} · ${no}</p>
          <p class="lede" style="text-align:center">${t('co.doneDesc')}</p>
          <button class="btn" data-close>${t('co.close')}</button>
        </div>`;
      state.cart = [];
      save(); renderCart();
    }
  }

  const field = (key, type, ph) => `
    <div class="field">
      <label>${t(key)}</label>
      <input type="${type}" placeholder="${ph}" autocomplete="off">
    </div>`;

  /* ═══════════ الإشعار ═══════════ */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-on'), 2600);
  }

  /* ═══════════ الأحداث ═══════════ */
  document.addEventListener('click', (e) => {
    const hit = (sel) => e.target.closest(sel);

    if (hit('#langBtn')) { state.lang = state.lang === 'ar' ? 'en' : 'ar'; applyLang(); return; }
    if (hit('#cartBtn')) { openDrawer(); return; }
    if (hit('#menuBtn')) { open($('#mobileMenu')); return; }
    if (hit('#checkoutBtn')) { openCheckout(); return; }

    const add = hit('[data-add]');
    if (add) { addToCart(add.dataset.add); return; }

    const view = hit('[data-view]');
    if (view) { openProduct(view.dataset.view); return; }

    const qty = hit('[data-qty]');
    if (qty) {
      const line = state.cart.find((l) => l.id === qty.dataset.qty);
      setQty(qty.dataset.qty, line.qty + Number(qty.dataset.delta));
      return;
    }

    const rm = hit('[data-rm]');
    if (rm) { setQty(rm.dataset.rm, 0); return; }

    // data-costep وليس data-step: الأخير مستخدم لخطوات هرم الرائحة في الصفحة
    const goStep = hit('[data-costep]');
    if (goStep) { step = Number(goStep.dataset.costep); renderStep(); return; }

    if (hit('[data-demo]')) { toast(t('foot.demo')); return; }

    const closer = hit('[data-close]');
    if (closer || e.target.id === 'scrim') {
      const goto = closer?.dataset.goto;
      closeAll();
      if (goto) setTimeout(() => document.querySelector(goto)?.scrollIntoView({ behavior: 'smooth' }), 200);
      return;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openLayer) closeAll();
  });

  /* ═══════════ الإقلاع ═══════════ */
  load();
  $('#year').textContent = new Date().getFullYear();

  // ننسخ الشعار من البطل إلى الشريط والذيل بدل تكرار المسارات في HTML
  const mark = $('#heroMark');
  $$('[data-mark]').forEach((slot) => {
    const clone = mark.cloneNode(true);
    clone.removeAttribute('id');
    clone.removeAttribute('class');
    clone.removeAttribute('aria-label');
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('.ln-draw').forEach((p) => {
      p.classList.remove('ln-draw');
      // في المقاسات الصغيرة (46px) يذوب خط 1.4 من مربّع 400 — نثبّت سماكته بالبكسل
      p.setAttribute('vector-effect', 'non-scaling-stroke');
    });
    slot.appendChild(clone);
  });

  applyLang();

  window.LP = { state, addToCart, openDrawer, toast };
})();
