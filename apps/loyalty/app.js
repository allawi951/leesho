/* بطاقة ولاء قهوة مِرسال — نموذج تجريبي محلي بالكامل */
(function () {
  'use strict';

  var GOAL = 6, PIN = '2580', KEY = 'lw-loyalty-v1';
  var DRINKS = [
    { id: 'latte', name: 'لاتيه', ico: '☕', p: 18 },
    { id: 'cortado', name: 'كورتادو', ico: '🥛', p: 16 },
    { id: 'v60', name: 'V60', ico: '🫖', p: 22 },
    { id: 'spanish', name: 'سبانش لاتيه', ico: '🧋', p: 19 },
    { id: 'mocha', name: 'موكا', ico: '🍫', p: 20 },
    { id: 'karak', name: 'شاي كرك', ico: '🍵', p: 9 }
  ];
  var DR = {}; DRINKS.forEach(function (d) { DR[d.id] = d; });
  var CUP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9h11v5a5.5 5.5 0 0 1-11 0Z" fill="currentColor"/><path d="M16 10.5h1.5a2.3 2.3 0 0 1 0 4.6H16" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 3.5c-.9 1.2.9 1.8 0 3M11.5 3c-.9 1.2.9 1.8 0 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var ROT = [-12, 6, -4, 10, -8, 3];

  var $ = function (id) { return document.getElementById(id); };
  function ar(n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fresh() {
    var now = Date.now(), D = 864e5, H = 36e5;
    var h = [
      { t: 'stamp', d: 'latte', at: now - 26 * D }, { t: 'stamp', d: 'v60', at: now - 23 * D }, { t: 'stamp', d: 'latte', at: now - 20 * D },
      { t: 'stamp', d: 'spanish', at: now - 17 * D }, { t: 'stamp', d: 'cortado', at: now - 15 * D }, { t: 'stamp', d: 'latte', at: now - 12 * D },
      { t: 'redeem', d: 'mocha', at: now - 9 * D },
      { t: 'stamp', d: 'karak', at: now - 7 * D }, { t: 'stamp', d: 'latte', at: now - 4 * D }, { t: 'stamp', d: 'spanish', at: now - 2 * D }, { t: 'stamp', d: 'v60', at: now - 3 * H }
    ];
    return { v: 1, name: 'ضيف مِرسال', stamps: 4, hist: h };
  }
  var S;
  try { S = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { S = null; }
  if (!S || S.v !== 1 || !Array.isArray(S.hist)) S = fresh();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  var unlocked = false, drink = 'latte', justStamped = -1;

  function stats() {
    var v = 0, r = 0, saved = 0;
    S.hist.forEach(function (x) { if (x.t === 'stamp') v++; if (x.t === 'redeem') { r++; saved += DR[x.d].p; } });
    return { visits: v, redeemed: r, saved: saved };
  }
  function when(ms) {
    var d = new Date(ms), now = new Date(), t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var h = d.getHours(), m = d.getMinutes(), tm = ar((h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m) + (h < 12 ? ' ص' : ' م');
    if (ms >= t0) return 'اليوم ' + tm;
    if (ms >= t0 - 864e5) return 'أمس ' + tm;
    var days = Math.ceil((t0 - ms) / 864e5);
    return days <= 10 ? 'قبل ' + ar(days) + ' أيام' : ar(d.getDate()) + '/' + ar(d.getMonth() + 1);
  }

  // ---------- العرض ----------
  function renderCard() {
    var h = '';
    for (var i = 0; i < GOAL; i++) {
      var on = i < S.stamps;
      h += '<li class="st' + (i === justStamped ? ' new' : '') + '" aria-label="ختم ' + ar(i + 1) + (on ? ' — مختوم' : ' — فاضي') + '">' + (on ? '<span class="ink" style="--rot:' + ROT[i] + 'deg">' + CUP + '</span>' : ar(i + 1)) + '</li>';
    }
    var ready = S.stamps >= GOAL;
    h += '<li class="st gift' + (ready ? ' ready' : '') + '" aria-label="المشروب السابع ' + (ready ? '— جاهز مجانًا' : 'مجاني') + '">🎁</li>';
    $('stamps').innerHTML = h;
    $('lcard').classList.toggle('full', ready);
    $('holder').textContent = S.name;
    $('csName').textContent = S.name;
    var st = stats();
    $('tier').textContent = st.visits >= 10 ? 'عضو ذهبي ✦' : 'عضو';
    var left = GOAL - S.stamps;
    $('progress').innerHTML = (ready ? '🎉 اكتملت بطاقتك — المشروب السابع علينا!' : left === 1 ? 'باقي لك ختم واحد بس وتصير القهوة السابعة علينا ☕' : 'باقي لك ' + ar(left) + ' أختام وتصير القهوة السابعة علينا') +
      '<span class="bar" aria-hidden="true"><i style="width:' + (Math.min(S.stamps, GOAL) / GOAL * 100) + '%"></i></span>';
    $('reward').hidden = !ready;
    $('stats').innerHTML = '<div class="stat">الزيارات<b>' + ar(st.visits) + '</b></div><div class="stat">مشروبات مجانية<b>' + ar(st.redeemed) + '</b></div><div class="stat">وفّرت<b>' + ar(st.saved) + ' <small>ر.س</small></b></div>';
    renderHist();
    renderCashier();
  }
  function renderHist() {
    var list = S.hist.slice().sort(function (a, b) { return b.at - a.at; }).slice(0, 8);
    $('hist').innerHTML = list.length ? list.map(function (x, i) {
      var d = DR[x.d], rw = x.t === 'redeem';
      return '<li class="' + (rw ? 'rw' : '') + (i === 0 && x.fresh ? ' new' : '') + '"><span class="hi" aria-hidden="true">' + (rw ? '🎁' : d.ico) + '</span><span>' + (rw ? 'مشروب مجاني: ' + d.name : 'ختم جديد · ' + d.name) + '<small>' + (rw ? 'مكافأة البطاقة — وفّرت ' + ar(d.p) + ' ر.س' : 'فرع العليا') + '</small></span><span class="when">' + when(x.at) + '</span></li>';
    }).join('') : '<li>ما فيه زيارات بعد</li>';
  }
  function renderCashier() {
    $('lock').hidden = unlocked; $('cashier').hidden = !unlocked;
    if (!unlocked) return;
    $('drinks').innerHTML = DRINKS.map(function (d) { return '<button type="button" role="radio" data-d="' + d.id + '" aria-checked="' + (d.id === drink) + '"><span aria-hidden="true">' + d.ico + '</span>' + d.name + '<small>' + ar(d.p) + ' ر.س</small></button>'; }).join('');
    var ready = S.stamps >= GOAL;
    $('stampBtn').disabled = ready;
    $('redeemBtn').hidden = !ready;
    $('drinkLbl').textContent = ready ? 'وش المشروب المجاني اللي اختاره العميل؟' : 'وش طلب العميل؟';
    $('csHint').textContent = ready ? 'البطاقة مكتملة — اصرف المشروب المجاني عشان تبدأ بطاقة جديدة.' : 'كل مشروب = ختم. عند ' + ar(GOAL) + ' أختام يصير السابع مجاني.';
  }
  function qr() {
    var N = 29, r = 4821937, h = '';
    function rnd() { r = (r * 1103515245 + 12345) & 0x7fffffff; return r / 0x7fffffff; }
    function finder(x, y) { return '<rect x="' + x + '" y="' + y + '" width="7" height="7" fill="#0d3b36"/><rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="5" height="5" fill="#fffdf9"/><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" fill="#0d3b36"/>'; }
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var inF = (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
      if (!inF && rnd() < 0.5) h += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
    }
    $('qr').innerHTML = '<g fill="#0d3b36">' + h + '</g>' + finder(0, 0) + finder(N - 7, 0) + finder(0, N - 7) + '<rect x="11" y="11" width="7" height="7" rx="2" fill="#e9c27a"/>';
  }

  // ---------- مؤثرات ----------
  var fx = $('fx'), ctx = fx.getContext('2d'), parts = [], raf = 0;
  function confetti(n) {
    if (reduce) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    fx.width = innerWidth * dpr; fx.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var r = $('lcard').getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var C = ['#e9c27a', '#c9993f', '#f8f0de', '#14564e', '#5fb3a3'];
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 7;
      parts.push({ x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 5, w: 5 + Math.random() * 6, h: 3 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: C[i % C.length], life: 0 });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(function (p) { return p.life < 140 && p.y < innerHeight + 20; });
    parts.forEach(function (p) {
      p.life++; p.vy += 0.22; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.globalAlpha = Math.max(0, 1 - p.life / 140); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    });
    raf = parts.length ? requestAnimationFrame(tick) : 0;
    if (!raf) ctx.clearRect(0, 0, innerWidth, innerHeight);
  }
  function shine() { var c = $('lcard'); c.classList.remove('shine'); void c.offsetWidth; c.classList.add('shine'); }
  function showCard() {
    var r = $('lcard').getBoundingClientRect();
    if (r.top < 0 || r.bottom > innerHeight - 60) $('lcard').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }

  // ---------- أفعال ----------
  function addStamp() {
    if (S.stamps >= GOAL) { toast('البطاقة مكتملة — اصرف المكافأة أول'); return; }
    S.hist.forEach(function (x) { delete x.fresh; });
    S.hist.push({ t: 'stamp', d: drink, at: Date.now(), fresh: true });
    justStamped = S.stamps; S.stamps++; save();
    showCard();
    renderCard(); shine();
    if (navigator.vibrate) try { navigator.vibrate(30); } catch (e) { }
    if (S.stamps >= GOAL) { setTimeout(function () { confetti(140); }, 350); toast('🎉 اكتملت البطاقة! السابع علينا'); }
    else toast('انضاف الختم ✓ (' + ar(S.stamps) + ' من ' + ar(GOAL) + ')');
    justStamped = -1;
  }
  function redeem() {
    if (S.stamps < GOAL) return;
    S.hist.forEach(function (x) { delete x.fresh; });
    S.hist.push({ t: 'redeem', d: drink, at: Date.now(), fresh: true });
    S.stamps = 0; save();
    showCard(); renderCard(); shine(); confetti(70);
    toast('انصرف ' + DR[drink].name + ' مجانًا — بدأت بطاقة جديدة');
  }

  // PIN
  var pin = '';
  function renderPad() {
    var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clr', '0', 'del'];
    $('pad').innerHTML = keys.map(function (k) {
      if (k === 'clr') return '<button type="button" class="fn" data-k="clr" aria-label="مسح الكل">مسح</button>';
      if (k === 'del') return '<button type="button" class="fn" data-k="del" aria-label="حذف رقم">⌫</button>';
      return '<button type="button" data-k="' + k + '" aria-label="' + k + '">' + k + '</button>';
    }).join('');
  }
  function dots() { Array.prototype.forEach.call($('pinDots').children, function (d, i) { d.classList.toggle('on', i < pin.length); }); }
  function press(k) {
    if (k === 'clr') pin = ''; else if (k === 'del') pin = pin.slice(0, -1); else if (pin.length < 4) pin += k;
    dots();
    if (pin.length === 4) {
      if (pin === PIN) { unlocked = true; pin = ''; dots(); renderCashier(); $('pinLive').textContent = 'تم الدخول'; toast('أهلًا مها 👋 وضع الكاشير مفتوح'); setTimeout(function () { $('stampBtn').focus(); }, 50); }
      else { var d = $('pinDots'); d.classList.remove('bad'); void d.offsetWidth; d.classList.add('bad'); $('pinLive').textContent = 'رمز غلط، جرّب مرة ثانية'; setTimeout(function () { pin = ''; dots(); d.classList.remove('bad'); }, 450); }
    }
  }

  var tt;
  function toast(m) { var t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 2400); }
  function setView(v) {
    var me = v === 'me';
    $('tabMe').setAttribute('aria-selected', String(me)); $('tabCash').setAttribute('aria-selected', String(!me));
    $('viewMe').hidden = !me; $('viewCash').hidden = me;
    renderCashier();
  }

  // ---------- الأحداث ----------
  $('tabMe').addEventListener('click', function () { setView('me'); });
  $('tabCash').addEventListener('click', function () { setView('cash'); });
  $('pad').addEventListener('click', function (e) { var b = e.target.closest('[data-k]'); if (b) press(b.dataset.k); });
  document.addEventListener('keydown', function (e) {
    if (!$('viewCash').hidden && !unlocked && $('nameOv').hidden) {
      if (/^[0-9]$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('del');
    }
    if (e.key === 'Escape' && !$('nameOv').hidden) closeName();
  });
  $('drinks').addEventListener('click', function (e) { var b = e.target.closest('[data-d]'); if (!b) return; drink = b.dataset.d; renderCashier(); });
  $('stampBtn').addEventListener('click', addStamp);
  $('redeemBtn').addEventListener('click', redeem);
  $('lockBtn').addEventListener('click', function () { unlocked = false; renderCashier(); toast('انقفل وضع الكاشير'); });
  $('shareBtn').addEventListener('click', function () {
    var txt = 'بطاقتي في قهوة مِرسال: ' + ar(S.stamps) + ' من ' + ar(GOAL) + ' أختام ☕ — السابع علينا!';
    if (navigator.share) { navigator.share({ title: 'بطاقة ولاء مِرسال', text: txt }).catch(function () { }); return; }
    var ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) { } ta.remove();
    toast(ok ? 'انتسخ نص المشاركة ✓' : txt);
  });
  var lastF;
  function closeName() { $('nameOv').hidden = true; if (lastF) lastF.focus(); }
  $('nameBtn').addEventListener('click', function () { lastF = this; $('nameIn').value = S.name === 'ضيف مِرسال' ? '' : S.name; $('nameOv').hidden = false; setTimeout(function () { $('nameIn').focus(); }, 30); });
  $('nameForm').addEventListener('submit', function (e) { e.preventDefault(); var v = $('nameIn').value.trim(); S.name = v || 'ضيف مِرسال'; save(); renderCard(); closeName(); toast('انحفظ الاسم'); });
  document.querySelector('#nameOv [data-close]').addEventListener('click', closeName);
  $('nameOv').addEventListener('click', function (e) { if (e.target === this) closeName(); });
  var armed = null;
  $('resetBtn').addEventListener('click', function () {
    var b = this;
    if (!armed) { b.textContent = 'متأكد؟ اضغط مرة ثانية'; armed = setTimeout(function () { armed = null; b.textContent = 'إعادة ضبط النموذج'; }, 3500); return; }
    clearTimeout(armed); armed = null; b.textContent = 'إعادة ضبط النموذج';
    try { localStorage.removeItem(KEY); } catch (e) { }
    S = fresh(); unlocked = false; drink = 'latte'; pin = ''; dots(); setView('me'); renderCard();
    window.scrollTo({ top: 0, behavior: 'smooth' }); toast('رجع النموذج لوضعه الأصلي');
  });
  window.addEventListener('resize', function () { if (!raf) { fx.width = 0; fx.height = 0; } });

  qr(); renderPad(); renderCard();
})();
