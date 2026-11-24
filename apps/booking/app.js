/* مركز لمعة — نموذج حجز مواعيد: لا يرسل أي شيء، يعرض شكل الرسالة ولوحة المحل */
(function () {
  'use strict';

  var IC = {
    drop: '<path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11Z"/><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5"/>',
    car: '<path d="M4 15.5 5.8 10a2.5 2.5 0 0 1 2.4-1.7h7.6A2.5 2.5 0 0 1 18.2 10L20 15.5"/><rect x="3" y="15" width="18" height="4.5" rx="1.6"/><path d="M7 19.5v1.5M17 19.5v1.5M11 4l1 2 1-2"/>',
    steam: '<path d="M5 20h14M7 20v-6a5 5 0 0 1 10 0v6"/><path d="M9 7c-1-1.3 1-2 0-3.5M12 7c-1-1.3 1-2 0-3.5M15 7c-1-1.3 1-2 0-3.5"/>',
    shine: '<path d="M12 3l1.8 4.6L18.5 9l-4.7 1.6L12 15l-1.8-4.4L5.5 9l4.7-1.4Z"/><path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z"/><path d="M5 16l.6 1.4L7 18l-1.4.6L5 20l-.6-1.4L3 18l1.4-.6Z"/>',
    shield: '<path d="M12 3 19 6v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6Z"/><path d="m9 12 2 2 4-4"/>',
    engine: '<path d="M4 10h3l2-2h5l2 2h2v3h2v-2h1v6h-1v-2h-2v3h-3l-2 2H8v-4H4Z"/>'
  };
  var SVCS = [
    { id: 'ext', name: 'غسيل خارجي', desc: 'غسيل يدوي بالرغوة وتنشيف بالمايكروفايبر.', dur: 30, price: 35, ic: 'drop', w: 26 },
    { id: 'full', name: 'غسيل شامل', desc: 'خارجي + داخلي: كنس، تلميع طبلون، وزجاج.', dur: 60, price: 79, ic: 'car', w: 34, tag: 'الأكثر طلبًا' },
    { id: 'steam', name: 'تنظيف داخلي بالبخار', desc: 'مراتب وفرش وسقف، يشيل البقع والروايح.', dur: 90, price: 149, ic: 'steam', w: 14 },
    { id: 'polish', name: 'تلميع وإزالة خدوش', desc: 'بولش على مرحلتين يرجّع لمعة الصبغ.', dur: 120, price: 249, ic: 'shine', w: 9 },
    { id: 'nano', name: 'حماية نانو سيراميك', desc: 'طبقة حماية تدوم لين سنة، مع تلميع قبلها.', dur: 180, price: 899, ic: 'shield', w: 5 },
    { id: 'engine', name: 'غسيل مكينة', desc: 'تنظيف آمن لغرفة المكينة بمواد مخصصة.', dur: 30, price: 45, ic: 'engine', w: 12 }
  ];
  var SV = {}; SVCS.forEach(function (s) { SV[s.id] = s; });
  var DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  var DSHORT = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  var MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  var NAMES = ['أبو خالد', 'سارة م.', 'عبدالله ع.', 'أبو ريان', 'نوف س.', 'فيصل ح.', 'أبو نايف', 'ريم ق.', 'تركي د.', 'مشاعل ب.', 'أبو عمر', 'سلطان ف.', 'هيا ر.', 'ماجد ش.'];
  var CARS = ['كامري أبيض', 'تاهو أسود', 'إلنترا فضي', 'لاندكروزر', 'سوناتا رصاصي', 'يوكن', 'أكورد', 'باترول أبيض', 'كورولا', 'رينج روفر', 'جيلي كولراي', 'هايلكس'];
  var KEY = 'lw-booking-v1', STEP = 30, LEAD = 20;

  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function keyOf(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2], 12); }
  function addDays(k, n) { var d = parse(k); d.setDate(d.getDate() + n); return keyOf(d); }
  function today() { return keyOf(new Date()); }
  function nowMin() { var d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
  function dayName(k) { var d = parse(k); return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()]; }
  function tm(m) { var h = Math.floor(m / 60), mm = m % 60; return (h % 12 || 12) + ':' + pad(mm) + (h < 12 ? ' ص' : ' م'); }
  function tmShort(m) { var h = Math.floor(m / 60), mm = m % 60; return (h % 12 || 12) + ':' + pad(mm); }
  function toLatin(s) { return String(s || '').replace(/[٠-٩]/g, function (c) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(c); }).replace(/\s|-/g, ''); }
  function hours(k) { return parse(k).getDay() === 5 ? [16 * 60, 22 * 60] : [9 * 60, 22 * 60]; }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  // ---------- الحالة ----------
  function fresh() { return { v: 1, mine: [], status: {}, unseen: 0, counter: 2400 }; }
  var S;
  try { S = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { S = null; }
  if (!S || S.v !== 1) S = fresh();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }

  // حجوزات وهمية ثابتة لكل يوم (نفس اليوم = نفس الحجوزات دائمًا)
  var seedCache = {};
  function seeded(k) {
    if (seedCache[k]) return seedCache[k];
    var r = rng(hash('lamaa' + k)), h = hours(k), t = h[0], out = [], wd = parse(k).getDay();
    var busy = wd === 4 || wd === 5 || wd === 6 ? 0.58 : 0.42;
    var wsum = SVCS.reduce(function (a, s) { return a + s.w; }, 0);
    while (t < h[1]) {
      if (r() < busy) {
        var x = r() * wsum, s = SVCS[0];
        for (var i = 0; i < SVCS.length; i++) { x -= SVCS[i].w; if (x <= 0) { s = SVCS[i]; break; } }
        if (t + s.dur <= h[1]) {
          out.push({ id: k + '@' + t, date: k, start: t, svc: s.id, name: NAMES[Math.floor(r() * NAMES.length)], phone: '05•• ••• ' + (100 + Math.floor(r() * 900)), car: CARS[Math.floor(r() * CARS.length)], seeded: true });
          t += s.dur; continue;
        }
      }
      t += STEP * (1 + Math.floor(r() * 2));
    }
    return (seedCache[k] = out);
  }
  function statusOf(b) {
    if (S.status[b.id]) return S.status[b.id];
    var t = today(), end = b.start + SV[b.svc].dur;
    if (b.date < t) return 'done';
    if (b.date === t && b.seeded) { var n = nowMin(); if (end <= n) return 'done'; if (b.start <= n) return 'here'; }
    return 'ok';
  }
  function bookingsOf(k, includeCancelled) {
    return seeded(k).concat(S.mine.filter(function (b) { return b.date === k; }))
      .filter(function (b) { return includeCancelled || statusOf(b) !== 'cancel'; })
      .sort(function (a, b) { return a.start - b.start; });
  }
  function freeSlots(k, dur) {
    var h = hours(k), bs = bookingsOf(k), out = [], isToday = k === today(), n = nowMin();
    for (var t = h[0]; t + STEP <= h[1]; t += STEP) {
      var ok = t + dur <= h[1] && !(isToday && t < n + LEAD);
      if (ok) for (var i = 0; i < bs.length; i++) { var b = bs[i], be = b.start + SV[b.svc].dur; if (t < be && b.start < t + dur) { ok = false; break; } }
      out.push({ t: t, ok: ok, past: isToday && t < n + LEAD });
    }
    return out;
  }

  // ---------- واجهة العميل ----------
  var sel = { svc: null, date: null, t: null }, step = 1;
  var days = []; for (var i = 0; i < 14; i++) days.push(addDays(today(), i));

  function renderServices() {
    $('services').innerHTML = SVCS.map(function (s) {
      return '<button type="button" role="radio" class="svc" data-svc="' + s.id + '" aria-checked="' + (sel.svc === s.id) + '">' +
        (s.tag ? '<span class="tagx">' + s.tag + '</span>' : '') +
        '<span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24">' + IC[s.ic] + '</svg></span>' +
        '<span><h3>' + s.name + '</h3><p>' + s.desc + '</p><span class="dur">⏱ ' + durTxt(s.dur) + '</span></span>' +
        '<span class="pr">' + s.price + '<small>ر.س</small></span></button>';
    }).join('');
  }
  function durTxt(d) { return d < 60 ? d + ' دقيقة' : d === 60 ? 'ساعة' : d === 90 ? 'ساعة ونص' : d === 120 ? 'ساعتين' : (d / 60) + ' ساعات'; }

  function stripHtml(list, selected, withAvail) {
    return list.map(function (k, i) {
      var d = parse(k), av = '', dis = false, lbl = i === 0 ? 'اليوم' : i === 1 ? 'بكرة' : MONTHS[d.getMonth()];
      if (withAvail) {
        var c = freeSlots(k, SV[sel.svc] ? SV[sel.svc].dur : STEP).filter(function (s) { return s.ok; }).length;
        av = '<span class="av ' + (c === 0 ? 'none' : c < 6 ? 'low' : '') + '" aria-hidden="true"></span>';
        dis = c === 0;
      }
      var aria = dayName(k) + (withAvail ? (dis ? '، مكتمل' : '') : '');
      return '<button type="button" role="radio" class="day" data-day="' + k + '" aria-checked="' + (selected === k) + '" aria-label="' + aria + '"' + (dis ? ' disabled' : '') + '><small>' + DSHORT[d.getDay()] + '</small><b>' + d.getDate() + '</b><i>' + lbl + '</i>' + av + '</button>';
    }).join('');
  }
  function renderDate() {
    if (!sel.date || freeSlots(sel.date, SV[sel.svc].dur).every(function (s) { return !s.ok; })) {
      sel.date = days.filter(function (k) { return freeSlots(k, SV[sel.svc].dur).some(function (s) { return s.ok; }); })[0] || days[0];
    }
    $('strip').innerHTML = stripHtml(days, sel.date, true);
    var slots = freeSlots(sel.date, SV[sel.svc].dur).filter(function (s) { return !s.past; });
    if (sel.t !== null && !slots.some(function (s) { return s.t === sel.t && s.ok; })) sel.t = null;
    var groups = [['الصباح', '☀️', 0, 720], ['الظهر والعصر', '🌤️', 720, 1020], ['المساء', '🌙', 1020, 1440]];
    var h = '<div class="slot-legend" aria-hidden="true"><span><i></i>متاح</span><span><i class="x"></i>محجوز</span><span>المدة: ' + durTxt(SV[sel.svc].dur) + '</span></div>';
    var any = false;
    groups.forEach(function (g) {
      var gs = slots.filter(function (s) { return s.t >= g[2] && s.t < g[3]; });
      if (!gs.length) return; any = true;
      h += '<div class="slot-g"><h3><span aria-hidden="true">' + g[1] + '</span>' + g[0] + '</h3><div class="slot-grid" role="radiogroup" aria-label="' + g[0] + '">' +
        gs.map(function (s) { return '<button type="button" role="radio" class="slot" data-t="' + s.t + '" aria-checked="' + (sel.t === s.t) + '"' + (s.ok ? '' : ' disabled') + ' aria-label="' + tm(s.t) + (s.ok ? '' : '، محجوز') + '">' + tmShort(s.t) + '</button>'; }).join('') + '</div></div>';
    });
    if (!any) h = '<div class="no-slots">انتهت مواعيد اليوم — اختر يوم ثاني 🙏</div>';
    $('slots').innerHTML = h;
  }
  function renderSummary() {
    var s = SV[sel.svc];
    $('summary').innerHTML = '<dt>الخدمة</dt><dd>' + s.name + '</dd><dt>الموعد</dt><dd>' + dayName(sel.date) + '</dd><dt>الوقت</dt><dd>' + tm(sel.t) + ' – ' + tm(sel.t + s.dur) + '</dd><dt>السعر</dt><dd>' + s.price + ' ر.س <span class="muted">· الدفع في المركز</span></dd>';
  }
  function renderBar() {
    var s = SV[sel.svc], info = '', can = false, label = 'التالي';
    if (step === 1) { info = s ? '<b>' + s.name + '</b>' + durTxt(s.dur) + ' · ' + s.price + ' ر.س' : 'اختر خدمة عشان نكمل'; can = !!s; label = 'اختر الموعد'; }
    if (step === 2) { info = sel.t !== null ? '<b>' + dayName(sel.date) + '</b>الساعة ' + tm(sel.t) : '<b>' + s.name + '</b>اختر وقت متاح'; can = sel.t !== null; label = 'التالي'; }
    if (step === 3) { info = '<b>' + s.price + ' ر.س</b>' + tm(sel.t) + ' · ' + DSHORT[parse(sel.date).getDay()]; can = true; label = 'أكّد الحجز'; }
    $('abInfo').innerHTML = info;
    $('nextBtn').disabled = !can; $('nextBtn').textContent = label;
    $('backBtn').hidden = step === 1;
  }
  function go(n) {
    step = n;
    [1, 2, 3].forEach(function (i) { $('s' + i).hidden = i !== n; });
    document.querySelectorAll('.steps li').forEach(function (li) { var s = +li.dataset.s; li.className = s === n ? 'on' : s < n ? 'done' : ''; if (s === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
    if (n === 2) renderDate();
    if (n === 3) renderSummary();
    renderBar();
    var top = document.querySelector('.steps').getBoundingClientRect().top + scrollY - 12;
    if (scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
    if (n === 3) setTimeout(function () { $('fName').focus({ preventScroll: true }); }, 50);
  }
  function confirmBooking() {
    var name = $('fName').value.trim(), phone = toLatin($('fPhone').value), ok = true;
    [['fName', ''], ['fPhone', '']].forEach(function (x) { $(x[0]).removeAttribute('aria-invalid'); $(x[0] + 'Err').textContent = ''; });
    if (name.length < 2) { $('fName').setAttribute('aria-invalid', 'true'); $('fNameErr').textContent = 'اكتب اسمك'; ok = false; }
    if (!/^05\d{8}$/.test(phone)) { $('fPhone').setAttribute('aria-invalid', 'true'); $('fPhoneErr').textContent = 'الرقم لازم يبدأ بـ05 ويكون 10 أرقام'; ok = false; }
    if (!ok) { document.querySelector('#form [aria-invalid="true"]').focus(); return; }
    // تأكد إن الموعد ما زال متاح
    if (!freeSlots(sel.date, SV[sel.svc].dur).some(function (s) { return s.t === sel.t && s.ok; })) { toast('للأسف الموعد انحجز توّه — اختر وقت ثاني'); go(2); return; }
    S.counter++;
    var b = { id: 'LM-' + S.counter, date: sel.date, start: sel.t, svc: sel.svc, name: name, phone: phone, car: $('fCar').value.trim(), note: $('fNote').value.trim(), mine: true, at: Date.now() };
    S.mine.push(b); S.unseen++; save();
    lastBooking = b;
    var s = SV[b.svc], L = [];
    L.push('📅 *حجز جديد رقم ' + b.id + '*');
    L.push('🧽 الخدمة: ' + s.name + ' (' + durTxt(s.dur) + ')');
    L.push('🗓️ اليوم: ' + dayName(b.date));
    L.push('⏰ الوقت: ' + tm(b.start) + ' – ' + tm(b.start + s.dur));
    L.push('👤 الاسم: ' + b.name);
    L.push('📱 الجوال: ⁦' + b.phone + '⁩');
    if (b.car) L.push('🚗 السيارة: ' + b.car);
    if (b.note) L.push('📝 ملاحظات: ' + b.note);
    L.push('💰 السعر: *' + s.price + ' ر.س* — الدفع في المركز');
    L.push('');
    L.push('_وصل من صفحة الحجز_');
    $('waMsg').innerHTML = esc(L.join('\n')).replace(/\*([^*\n]+)\*/g, '<b>$1</b>').replace(/_([^_\n]+)_/g, '<i>$1</i>') + '<span class="tmx">' + tm(nowMin()) + ' ✓✓</span>';
    $('doneSub').textContent = s.name + ' · ' + dayName(b.date) + ' · ' + tm(b.start);
    renderBadge();
    openOv('doneOv');
  }
  var lastBooking = null;

  // ---------- لوحة المحل ----------
  var oDay = today(), highlight = null;
  var ST = { ok: ['مؤكد', ''], here: ['العميل وصل', 'here'], done: ['خلص', 'done'], cancel: ['ملغي', 'cancel'] };
  function renderOwner() {
    S.unseen = 0; save(); renderBadge();
    $('oStrip').innerHTML = stripHtml(days, oDay, false);
    var all = bookingsOf(oDay, true), live = all.filter(function (b) { return statusOf(b) !== 'cancel'; });
    var h = hours(oDay), open = h[1] - h[0], used = 0, rev = 0;
    live.forEach(function (b) { used += SV[b.svc].dur; rev += SV[b.svc].price; });
    $('oTitle').textContent = oDay === today() ? 'حجوزات اليوم' : 'حجوزات ' + DAYS[parse(oDay).getDay()];
    $('oSub').textContent = dayName(oDay) + ' · الدوام ' + tm(h[0]) + ' – ' + tm(h[1]);
    var mineN = live.filter(function (b) { return b.mine; }).length;
    $('oKpis').innerHTML = '<div class="kpi"><span>الحجوزات</span><b>' + live.length + '</b></div>' +
      '<div class="kpi"><span>الدخل المتوقع</span><b>' + rev.toLocaleString('en-US') + '<small>ر.س</small></b></div>' +
      '<div class="kpi"><span>الإشغال</span><b>' + Math.round(used / open * 100) + '<small>%</small></b></div>';
    // شريط الإشغال (من ٩ ص إلى ١٠ م)
    var A = 9 * 60, Z = 22 * 60, W = Z - A;
    var segs = '';
    if (h[0] > A) segs += '<span class="occ-seg done" style="right:0;width:' + ((h[0] - A) / W * 100) + '%;opacity:.35" title="مقفل"></span>';
    live.forEach(function (b) { var st = statusOf(b); segs += '<span class="occ-seg' + (b.mine ? ' new' : st === 'done' ? ' done' : '') + '" style="right:' + ((b.start - A) / W * 100) + '%;width:calc(' + (SV[b.svc].dur / W * 100) + '% - 2px)"></span>'; });
    if (oDay === today()) { var n = nowMin(); if (n > A && n < Z) segs += '<span class="occ-now" style="right:' + ((n - A) / W * 100) + '%"></span>'; }
    $('occ').innerHTML = '<h3><span>خط الخدمة</span><span>' + (mineN ? '🟧 حجوزات من الموقع: ' + mineN : '') + '</span></h3><div class="occ-track">' + segs + '</div><div class="occ-ax"><span>9ص</span><span>12م</span><span>3م</span><span>6م</span><span>10م</span></div>';
    if (!all.length) { $('agenda').innerHTML = '<li class="none">ما فيه حجوزات لهذا اليوم بعد</li>'; return; }
    $('agenda').innerHTML = all.map(function (b) {
      var s = SV[b.svc], st = statusOf(b), sd = ST[st];
      var acts = '';
      if (st === 'ok') acts = '<button type="button" class="go" data-act="here" data-id="' + b.id + '">✓ العميل وصل</button><button type="button" data-act="cancel" data-id="' + b.id + '">إلغاء</button>';
      else if (st === 'here') acts = '<button type="button" class="go" data-act="done" data-id="' + b.id + '">✓ خلصنا</button>';
      else if (st === 'cancel') acts = '<button type="button" data-act="ok" data-id="' + b.id + '">استرجاع الحجز</button>';
      return '<li class="bk st-' + st + (b.mine ? ' is-new' : '') + '" id="bk-' + b.id.replace(/[^\w-]/g, '_') + '">' +
        '<div class="tm">' + tmShort(b.start) + '<small>' + (b.start < 720 ? 'ص' : 'م') + ' · ' + durTxt(s.dur) + '</small></div>' +
        '<div><h3>' + esc(b.name) + ' <span class="pill ' + sd[1] + '">' + sd[0] + '</span>' + (b.mine ? '<span class="pill new">جديد من الموقع</span>' : '') + '</h3>' +
        '<p>' + s.name + ' · ' + s.price + ' ر.س' + (b.car ? ' · 🚗 ' + esc(b.car) : '') + '</p>' +
        '<p>📱 <span class="ph">' + esc(b.phone) + '</span>' + (b.note ? ' · 📝 ' + esc(b.note) : '') + '</p>' +
        (acts ? '<div class="bk-act">' + acts + '</div>' : '') + '</div></li>';
    }).join('');
    if (highlight) {
      var el = document.getElementById('bk-' + highlight.replace(/[^\w-]/g, '_'));
      highlight = null;
      if (el) setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 80);
    }
  }
  function renderBadge() { var b = $('newBadge'); b.hidden = !S.unseen; b.textContent = S.unseen; }
  function setView(v) {
    var c = v === 'c';
    $('tabC').setAttribute('aria-selected', String(c)); $('tabO').setAttribute('aria-selected', String(!c));
    $('viewC').hidden = !c; $('viewO').hidden = c;
    if (!c) renderOwner(); else if (step === 2) renderDate();
  }

  // ---------- عام ----------
  var lastFocus;
  function openOv(id) { lastFocus = document.activeElement; $(id).hidden = false; document.body.style.overflow = 'hidden'; setTimeout(function () { $('seeOwner').focus(); }, 60); }
  function closeOv(id) { $(id).hidden = true; document.body.style.overflow = ''; if (lastFocus && document.contains(lastFocus)) lastFocus.focus(); }
  var tt;
  function toast(m) { var t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 2600); }

  $('services').addEventListener('click', function (e) { var b = e.target.closest('.svc'); if (!b) return; sel.svc = b.dataset.svc; sel.t = null; renderServices(); renderBar(); });
  $('strip').addEventListener('click', function (e) { var b = e.target.closest('.day'); if (!b || b.disabled) return; sel.date = b.dataset.day; sel.t = null; renderDate(); renderBar(); });
  $('slots').addEventListener('click', function (e) { var b = e.target.closest('.slot'); if (!b || b.disabled) return; sel.t = +b.dataset.t; renderDate(); renderBar(); });
  $('nextBtn').addEventListener('click', function () { if (step < 3) go(step + 1); else confirmBooking(); });
  $('backBtn').addEventListener('click', function () { go(step - 1); });
  $('form').addEventListener('submit', function (e) { e.preventDefault(); confirmBooking(); });
  ['fName', 'fPhone'].forEach(function (id) { $(id).addEventListener('input', function () { this.removeAttribute('aria-invalid'); $(id + 'Err').textContent = ''; }); });
  $('tabC').addEventListener('click', function () { setView('c'); });
  $('tabO').addEventListener('click', function () { setView('o'); });
  $('oStrip').addEventListener('click', function (e) { var b = e.target.closest('.day'); if (!b) return; oDay = b.dataset.day; renderOwner(); });
  $('agenda').addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    S.status[b.dataset.id] = b.dataset.act; save(); renderOwner();
    toast({ here: 'تم: العميل وصل', done: 'تم: الخدمة خلصت 👍', cancel: 'انلغى الحجز وانفتح الوقت', ok: 'رجع الحجز' }[b.dataset.act]);
  });
  $('seeOwner').addEventListener('click', function () { closeOv('doneOv'); oDay = lastBooking.date; highlight = lastBooking.id; resetFlow(); setView('o'); window.scrollTo({ top: 0 }); });
  $('againBtn').addEventListener('click', function () { closeOv('doneOv'); resetFlow(); });
  $('doneOv').addEventListener('click', function (e) { if (e.target === this) { closeOv('doneOv'); resetFlow(); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('doneOv').hidden) { closeOv('doneOv'); resetFlow(); } });
  function resetFlow() { sel = { svc: null, date: null, t: null }; $('form').reset(); renderServices(); go(1); }
  var armed = null;
  $('resetBtn').addEventListener('click', function () {
    var b = this;
    if (!armed) { b.textContent = 'متأكد؟ اضغط مرة ثانية'; armed = setTimeout(function () { armed = null; b.textContent = 'إعادة ضبط النموذج'; }, 3500); return; }
    clearTimeout(armed); armed = null; b.textContent = 'إعادة ضبط النموذج';
    try { localStorage.removeItem(KEY); } catch (e) { }
    S = fresh(); oDay = today(); renderBadge(); resetFlow(); setView('c'); window.scrollTo({ top: 0, behavior: 'smooth' }); toast('رجع النموذج لوضعه الأصلي');
  });

  renderServices(); renderBadge(); go(1);
})();
