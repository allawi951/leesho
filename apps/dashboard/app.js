/* دفتر مقهى زاوية البُن — منطق اللوحة (نموذج تجريبي، كل البيانات وهمية ومحلية) */
(function () {
  'use strict';

  // ---------- الأصناف ----------
  var CATS = {
    in: [
      { id: 'coffee', name: 'قهوة مختصة', ico: '☕' },
      { id: 'cold', name: 'مشروبات باردة', ico: '🧊' },
      { id: 'sweets', name: 'حلا ومخبوزات', ico: '🥐' },
      { id: 'food', name: 'فطور وساندويتشات', ico: '🥪' },
      { id: 'delivery', name: 'طلبات التوصيل', ico: '🛵' },
      { id: 'beans', name: 'بيع بن وأدوات', ico: '🫘' }
    ],
    out: [
      { id: 'raw', name: 'مواد خام', ico: '🥛' },
      { id: 'salaries', name: 'رواتب', ico: '👥' },
      { id: 'rent', name: 'إيجار', ico: '🏠' },
      { id: 'bills', name: 'كهرباء وماء', ico: '💡' },
      { id: 'marketing', name: 'تسويق', ico: '📣' },
      { id: 'maint', name: 'صيانة', ico: '🔧' },
      { id: 'apps', name: 'عمولة التطبيقات', ico: '📱' }
    ]
  };
  var CAT_BY = {};
  ['in', 'out'].forEach(function (t) { CATS[t].forEach(function (c) { c.type = t; CAT_BY[c.id] = c; }); });

  var MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  var DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  var KEY = 'lw-dash-v1', THEME_KEY = 'lw-dash-theme', SAMPLE_KEY = 'lw-dash-sample-x';

  // ---------- أدوات التاريخ (مكوّنات محلية فقط، بدون toISOString) ----------
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function keyOf(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parse(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2], 12); }
  function addDays(k, n) { var d = parse(k); d.setDate(d.getDate() + n); return keyOf(d); }
  function diffDays(a, b) { return Math.round((parse(b) - parse(a)) / 864e5); }
  function todayKey() { var d = new Date(); return keyOf(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12)); }
  function isKey(k) { return /^\d{4}-\d{2}-\d{2}$/.test(k || '') && !isNaN(parse(k)); }
  function dayLabel(k, withDay) { var d = parse(k); return (withDay ? DAYS[d.getDay()] + ' ' : '') + d.getDate() + ' ' + MONTHS[d.getMonth()]; }
  function shortLabel(k) { var d = parse(k); return d.getDate() + ' ' + MONTHS[d.getMonth()]; }

  // ---------- أدوات الأرقام ----------
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }
  function compact(n) {
    n = Math.abs(n);
    if (n >= 1000) { var v = n / 1000; return (v >= 100 ? Math.round(v) : (Math.round(v * 10) / 10)) + 'k'; }
    return String(Math.round(n));
  }
  function sar(n) { return fmt(n) + '<small>ر.س</small>'; }
  function signed(n) { return (n > 0 ? '+' : n < 0 ? '−' : '') + fmt(Math.abs(n)); }
  function toLatin(s) { return String(s || '').replace(/[٠-٩]/g, function (c) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(c); }).replace(/[۰-۹]/g, function (c) { return '۰۱۲۳۴۵۶۷۸۹'.indexOf(c); }).replace(/[٬,\s]/g, '').replace('٫', '.'); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // ---------- بيانات وهمية ثابتة البذرة ----------
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  function seedData() {
    var r = rng(20261124), out = [], id = 1, today = todayKey(), DAYS_BACK = 61;
    var start = addDays(today, -DAYS_BACK);
    var BASE = { coffee: 1020, cold: 540, sweets: 390, food: 360, delivery: 470 };
    var NOTES = {
      coffee: ['مبيعات الكاشير', 'مبيعات الكاشير', 'مبيعات الكاشير — فترة الصباح والمساء'],
      cold: ['مبيعات الكاشير', 'آيس لاتيه وسبانش لاتيه'],
      sweets: ['كوكيز وكرواسون', 'مبيعات الكاشير', 'كيكة اليوم'],
      food: ['فطور الصباح', 'ساندويتشات', 'مبيعات الكاشير'],
      delivery: ['طلبات تطبيقات التوصيل', 'طلبات التوصيل']
    };
    var RAW = ['طلبية حليب وكريمة', 'بن مختص من المحمصة', 'مخبوزات من المورّد', 'أكواب وأغطية', 'خضار وأجبان للساندويتشات', 'شوكولاتة وصوصات'];
    var MKT = ['إعلان سناب شات', 'تصوير منيو جديد', 'مشهور محلي — زيارة', 'طباعة بطاقات ولاء'];
    var MNT = ['صيانة مكينة الإسبريسو', 'تغيير فلتر الماء', 'صيانة المكيف', 'صيانة الطاحونة'];
    var weekDelivery = 0;
    for (var i = 0; i <= DAYS_BACK; i++) {
      var k = addDays(start, i), d = parse(k), wd = d.getDay(), dom = d.getDate();
      var wf = [0.92, 0.86, 0.9, 0.96, 1.28, 1.22, 1.1][wd];
      var trend = 0.9 + 0.18 * (i / DAYS_BACK);
      var partial = k === today ? 0.55 : 1;
      if (r() < 0.04) wf *= 1.35; // يوم مميز (مناسبة/زحمة)
      Object.keys(BASE).forEach(function (c) {
        var noise = 0.82 + r() * 0.36;
        var amt = Math.round(BASE[c] * wf * trend * noise * partial);
        if (c === 'delivery') weekDelivery += amt;
        var ns = NOTES[c];
        out.push({ id: id++, date: k, type: 'in', cat: c, amount: amt, note: ns[Math.floor(r() * ns.length)] });
      });
      if (r() < 0.3) out.push({ id: id++, date: k, type: 'in', cat: 'beans', amount: Math.round((140 + r() * 520) / 5) * 5, note: r() < 0.5 ? 'أكياس بن ٢٥٠ جرام' : 'أداة تقطير V60' });
      // مصروفات
      if (k !== today || r() < 0.5) out.push({ id: id++, date: k, type: 'out', cat: 'raw', amount: Math.round((680 + r() * 520) * (wf > 1.1 ? 1.15 : 1)), note: RAW[Math.floor(r() * RAW.length)] });
      if (dom === 1) out.push({ id: id++, date: k, type: 'out', cat: 'rent', amount: 14000, note: 'إيجار المحل الشهري' });
      if (dom === 27) out.push({ id: id++, date: k, type: 'out', cat: 'salaries', amount: 24500, note: 'رواتب ٦ موظفين' });
      if (dom === 10) out.push({ id: id++, date: k, type: 'out', cat: 'bills', amount: Math.round(1150 + r() * 420), note: 'فاتورة الكهرباء' });
      if (dom === 13) out.push({ id: id++, date: k, type: 'out', cat: 'bills', amount: Math.round(170 + r() * 110), note: 'فاتورة المياه' });
      if (dom % 9 === 4) out.push({ id: id++, date: k, type: 'out', cat: 'marketing', amount: Math.round((300 + r() * 700) / 10) * 10, note: MKT[Math.floor(r() * MKT.length)] });
      if (r() < 0.07) out.push({ id: id++, date: k, type: 'out', cat: 'maint', amount: Math.round((150 + r() * 550) / 10) * 10, note: MNT[Math.floor(r() * MNT.length)] });
      if (wd === 0 && weekDelivery > 0) { out.push({ id: id++, date: k, type: 'out', cat: 'apps', amount: Math.round(weekDelivery * 0.18), note: 'عمولة تطبيقات التوصيل للأسبوع' }); weekDelivery = 0; }
    }
    return { v: 1, seedDay: today, dirty: false, nextId: id, entries: out };
  }

  // ---------- التخزين ----------
  var db;
  function load() {
    try { db = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { db = null; }
    if (!db || db.v !== 1 || !Array.isArray(db.entries) || (!db.dirty && db.seedDay !== todayKey())) { db = seedData(); save(); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* التخزين غير متاح */ } }

  // ---------- الحالة ----------
  var $ = function (id) { return document.getElementById(id); };
  var F = { from: '', to: '', type: 'all', cat: 'all', range: '30' };
  var cal = { y: 0, m: 0 };
  var catMode = 'in';
  var listLimit = 12;
  var lastSavedId = null;

  function applyRange(key) {
    var t = todayKey(), d = parse(t);
    F.range = key;
    if (key === '7') { F.from = addDays(t, -6); F.to = t; }
    else if (key === '30') { F.from = addDays(t, -29); F.to = t; }
    else if (key === 'month') { F.from = keyOf(new Date(d.getFullYear(), d.getMonth(), 1, 12)); F.to = t; }
    else if (key === 'prev') { F.from = keyOf(new Date(d.getFullYear(), d.getMonth() - 1, 1, 12)); F.to = keyOf(new Date(d.getFullYear(), d.getMonth(), 0, 12)); }
    else { F.from = ''; F.to = ''; }
    var anchor = parse(F.to || t);
    cal.y = anchor.getFullYear(); cal.m = anchor.getMonth();
  }

  function bounds() {
    var ks = db.entries.map(function (e) { return e.date; }).sort();
    var t = todayKey();
    return { min: ks[0] || t, max: ks[ks.length - 1] > t ? ks[ks.length - 1] : t };
  }
  function effFrom() { return F.from || bounds().min; }
  function effTo() { return F.to || bounds().max; }

  function matchTC(e) { return (F.type === 'all' || e.type === F.type) && (F.cat === 'all' || e.cat === F.cat); }
  function inRange(k, from, to) { return (!from || k >= from) && (!to || k <= to); }
  function filtered(from, to) {
    from = from === undefined ? F.from : from; to = to === undefined ? F.to : to;
    return db.entries.filter(function (e) { return matchTC(e) && inRange(e.date, from, to); });
  }
  function totals(list) {
    var s = { in: 0, out: 0 };
    list.forEach(function (e) { s[e.type] += e.amount; });
    s.net = s.in - s.out; return s;
  }

  // ---------- الفلاتر ----------
  function buildCatSelect(sel, type, withAll) {
    var h = withAll ? '<option value="all">كل الأصناف</option>' : '';
    ['in', 'out'].forEach(function (t) {
      if (type !== 'all' && type !== t) return;
      var g = CATS[t].map(function (c) { return '<option value="' + c.id + '">' + c.ico + ' ' + c.name + '</option>'; }).join('');
      h += withAll && type === 'all' ? '<optgroup label="' + (t === 'in' ? 'الدخل' : 'المصروفات') + '">' + g + '</optgroup>' : g;
    });
    sel.innerHTML = h;
  }
  function syncFilterUI() {
    document.querySelectorAll('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.range === F.range)); });
    $('fFrom').value = F.from; $('fTo').value = F.to;
    $('fType').querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-checked', String(b.dataset.type === F.type)); });
    buildCatSelect($('fCat'), F.type, true);
    $('fCat').value = F.cat;
  }

  // ---------- العرض ----------
  function render() {
    syncFilterUI();
    var list = filtered();
    var tot = totals(list);
    var from = effFrom(), to = effTo();
    var parts = [];
    if (F.type !== 'all') parts.push(F.type === 'in' ? 'الدخل فقط' : 'المصروف فقط');
    if (F.cat !== 'all') parts.push(CAT_BY[F.cat].name);
    $('filterSum').innerHTML = 'يعرض <b>' + list.length + '</b> قيد · من <b>' + shortLabel(from) + '</b> إلى <b>' + shortLabel(to) + '</b>' + (parts.length ? ' · ' + parts.join(' · ') : '');
    renderKpis(list, tot, from, to);
    renderCal();
    renderTrend(list, from, to);
    renderBars(list);
    renderList(list);
  }

  function deltaHtml(cur, prev, goodUp) {
    if (!prev) return '<span class="muted">لا توجد فترة سابقة للمقارنة</span>';
    var p = (cur - prev) / Math.abs(prev) * 100;
    var up = p >= 0, good = goodUp ? up : !up;
    var txt = (up ? '▲ ' : '▼ ') + Math.abs(p).toFixed(Math.abs(p) < 10 ? 1 : 0) + '%';
    return '<span class="delta ' + (Math.abs(p) < 0.05 ? '' : good ? 'up' : 'down') + '">' + txt + '</span> عن الفترة السابقة';
  }

  function renderKpis(list, tot, from, to) {
    var len = diffDays(from, to) + 1;
    var pTo = addDays(from, -1), pFrom = addDays(from, -len);
    // ما نقارن بفترة سابقة إلا لو البيانات تغطيها كاملة
    var prev = pFrom >= bounds().min ? totals(filtered(pFrom, pTo)) : { in: 0, out: 0, net: 0 };
    var showIn = F.type !== 'out', showOut = F.type !== 'in';
    var off = '<span class="muted">غير مشمول بالفلتر</span>';
    $('kIn').innerHTML = showIn ? sar(tot.in) : '—';
    $('kInD').innerHTML = showIn ? deltaHtml(tot.in, prev.in, true) : off;
    $('kOut').innerHTML = showOut ? sar(tot.out) : '—';
    $('kOutD').innerHTML = showOut ? deltaHtml(tot.out, prev.out, false) : off;
    var netEl = $('kNet');
    netEl.innerHTML = '<span dir="ltr">' + signed(tot.net) + '</span><small>ر.س</small>';
    netEl.classList.toggle('neg', tot.net < 0);
    var margin = tot.in ? Math.round(tot.net / tot.in * 100) : null;
    $('kNetD').innerHTML = F.type === 'all' && margin !== null ? 'هامش الربح <b class="' + (margin >= 0 ? 'up' : 'down') + '" dir="ltr">' + margin + '%</b> · متوسط يومي ' + fmt(tot.net / len) : deltaHtml(tot.net, prev.net, true);
    // أقوى صنف
    var t = F.type === 'out' ? 'out' : 'in';
    var sums = {};
    list.forEach(function (e) { if (e.type === t) sums[e.cat] = (sums[e.cat] || 0) + e.amount; });
    var best = Object.keys(sums).sort(function (a, b) { return sums[b] - sums[a]; })[0];
    document.querySelector('.kpi-best h2').textContent = t === 'out' ? 'أكبر بند مصروف' : 'أقوى صنف';
    if (best) {
      var c = CAT_BY[best], all = t === 'out' ? tot.out : tot.in;
      $('kBest').textContent = c.ico + ' ' + c.name;
      $('kBestD').innerHTML = fmt(sums[best]) + ' ر.س · <b>' + Math.round(sums[best] / all * 100) + '%</b> من ' + (t === 'out' ? 'المصروف' : 'الدخل');
    } else { $('kBest').textContent = '—'; $('kBestD').textContent = 'لا توجد قيود'; }
  }

  // ----- التقويم -----
  function dayTotals(k) {
    var s = { in: 0, out: 0, n: 0 };
    db.entries.forEach(function (e) { if (e.date === k && matchTC(e)) { s[e.type] += e.amount; s.n++; } });
    s.net = s.in - s.out; return s;
  }
  function renderCal() {
    var y = cal.y, m = cal.m, first = new Date(y, m, 1, 12), days = new Date(y, m + 1, 0).getDate();
    var t = todayKey();
    $('calMonth').textContent = MONTHS[m] + ' ' + y;
    var cells = [], maxAbs = 1, mTot = { in: 0, out: 0 }, data = [];
    for (var d = 1; d <= days; d++) {
      var k = keyOf(new Date(y, m, d, 12)), s = dayTotals(k), inR = inRange(k, F.from, F.to);
      data.push({ k: k, s: s, inR: inR });
      if (inR) { maxAbs = Math.max(maxAbs, Math.abs(s.net)); mTot.in += s.in; mTot.out += s.out; }
    }
    for (var p = 0; p < first.getDay(); p++) cells.push('<div class="cal-day pad" aria-hidden="true"></div>');
    data.forEach(function (o, i) {
      var s = o.s, cls = ['cal-day'], dnum = i + 1, body = '';
      if (o.k === t) cls.push('today');
      if (o.k > t) cls.push('future');
      if (!o.inR) cls.push('out-range');
      var has = s.n > 0 && o.inR;
      if (has) {
        cls.push(s.net >= 0 ? 'pos' : 'neg');
        if (F.type !== 'out' && s.in) body += '<b><span class="f">+' + fmt(s.in) + '</span><span class="s">+' + compact(s.in) + '</span></b>';
        if (F.type !== 'in' && s.out) body += '<i><span class="f">−' + fmt(s.out) + '</span><span class="s">−' + compact(s.out) + '</span></i>';
        if (F.type === 'all') body += '<span class="n">صافي <bdi dir="ltr">' + signed(s.net) + '</bdi></span>';
      } else if (o.inR && o.k <= t) cls.push('empty');
      var h = has ? Math.sqrt(Math.abs(s.net) / maxAbs).toFixed(3) : 0;
      var label = dayLabel(o.k, true) + (has ? '، دخل ' + fmt(s.in) + '، مصروف ' + fmt(s.out) + '، صافي ' + signed(s.net) + ' ريال' : '، لا توجد قيود');
      cells.push('<button type="button" role="gridcell" class="' + cls.join(' ') + '" style="--h:' + h + '" data-day="' + o.k + '" aria-label="' + label + '"><span class="d">' + dnum + '</span>' + body + '</button>');
    });
    $('cal').innerHTML = cells.join('');
    var net = mTot.in - mTot.out;
    $('calFoot').innerHTML = '<span>دخل الشهر <b>' + fmt(mTot.in) + '</b></span><span>مصروفه <b>' + fmt(mTot.out) + '</b></span><span>الصافي <b dir="ltr" class="' + (net >= 0 ? 'up' : 'down') + '">' + signed(net) + '</b> ر.س</span>';
  }

  // ----- الرسم الزمني -----
  var trendState = null;
  function renderTrend(list, from, to) {
    var box = $('trend');
    var n = diffDays(from, to) + 1;
    var weekly = n > 92;
    var buckets = [], idx = {};
    for (var i = 0; i < n; i++) {
      var k = addDays(from, i), bi = weekly ? Math.floor(i / 7) : i;
      if (!buckets[bi]) buckets[bi] = { k: k, end: k, in: 0, out: 0 };
      buckets[bi].end = k; idx[k] = bi;
    }
    list.forEach(function (e) { var b = buckets[idx[e.date]]; if (b) b[e.type] += e.amount; });
    var showIn = F.type !== 'out', showOut = F.type !== 'in';
    var W = box.clientWidth || 320, H = box.clientHeight || 220;
    if (!list.length) { box.innerHTML = '<div class="chart-empty">لا توجد قيود ضمن الفلتر الحالي</div>'; trendState = null; return; }
    // سقف ذكي: الأيام الاستثنائية (رواتب/إيجار) ما تسحق بقية الخط؛ تُرسم عند السقف مع وسم بقيمتها
    var vals = [], maxIn = 0, max = 0;
    buckets.forEach(function (b) { if (showIn) { vals.push(b.in); maxIn = Math.max(maxIn, b.in); } if (showOut) vals.push(b.out); });
    vals.sort(function (a, b) { return a - b; });
    max = vals[vals.length - 1] || 0;
    var p90 = vals[Math.floor(vals.length * 0.9)] || 0;
    var cap = Math.max(maxIn * 1.12, p90 * 1.6);
    var capped = max > cap * 1.15;
    var lim = capped ? cap : max;
    var step = niceStep(lim / 4), top = Math.max(step * 4, step * Math.ceil(lim / step));
    if (capped && top < cap) top += step;
    var padR = 44, padL = 8, padT = capped ? 24 : 12, padB = 26;
    var iw = W - padL - padR, ih = H - padT - padB;
    var X = function (i) { return padL + (buckets.length === 1 ? iw / 2 : iw * i / (buckets.length - 1)); };
    var Y = function (v) { return padT + ih - (Math.min(v, top) / top) * ih; };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="رسم الدخل والمصروف اليومي ضمن الفلتر"><defs><linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--in)" stop-opacity=".28"/><stop offset="1" stop-color="var(--in)" stop-opacity="0"/></linearGradient></defs>';
    for (var g = 0; g <= top / step; g++) {
      var gy = Y(g * step);
      s += '<line class="grid-l" x1="' + padL + '" x2="' + (W - padR) + '" y1="' + gy + '" y2="' + gy + '"' + (g ? ' stroke-dasharray="2 4"' : '') + '/>';
      s += '<text class="ax" x="' + (W - padR + 8) + '" y="' + (gy + 3.5) + '" text-anchor="start">' + compact(g * step) + '</text>';
    }
    var ticks = Math.min(buckets.length, W < 420 ? 4 : 6);
    for (var t = 0; t < ticks; t++) {
      var ti = ticks === 1 ? 0 : Math.round(t * (buckets.length - 1) / (ticks - 1));
      var anchor = t === 0 ? 'start' : t === ticks - 1 ? 'end' : 'middle';
      s += '<text class="ax" x="' + X(ti) + '" y="' + (H - 6) + '" text-anchor="' + anchor + '">' + shortLabel(buckets[ti].k) + '</text>';
    }
    function path(key) { return buckets.map(function (b, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(b[key]).toFixed(1); }).join(''); }
    if (showIn) {
      s += '<path class="a-in" d="' + path('in') + 'L' + X(buckets.length - 1).toFixed(1) + ' ' + Y(0) + 'L' + X(0).toFixed(1) + ' ' + Y(0) + 'Z"/>';
      s += '<path class="l-in" d="' + path('in') + '"/>';
    }
    if (showOut) s += '<path class="l-out" d="' + path('out') + '"/>';
    if (capped) buckets.forEach(function (b, i) {
      ['in', 'out'].forEach(function (k) {
        if ((k === 'in' ? !showIn : !showOut) || b[k] <= top) return;
        var x = X(i), lx = Math.max(padL + 16, Math.min(W - padR - 16, x));
        s += '<path class="spike ' + k + '" d="M' + (x - 4) + ' ' + (padT + 5) + 'L' + x + ' ' + (padT - 1) + 'L' + (x + 4) + ' ' + (padT + 5) + 'Z"/>';
        s += '<text class="lbl spike-t ' + k + '" x="' + lx + '" y="' + (padT - 5) + '" text-anchor="middle">' + compact(b[k]) + '</text>';
      });
    });
    s += '<g id="xh" style="display:none"><line class="xh" y1="' + padT + '" y2="' + (padT + ih) + '"/>' + (showIn ? '<circle class="dot-in" r="4.5"/>' : '') + (showOut ? '<circle class="dot-out" r="4.5"/>' : '') + '</g>';
    s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" fill="transparent" id="hit"/></svg>';
    box.innerHTML = s;
    trendState = { buckets: buckets, X: X, Y: Y, padL: padL, iw: iw, weekly: weekly, showIn: showIn, showOut: showOut };
    var hit = box.querySelector('#hit');
    hit.addEventListener('pointermove', trendHover);
    hit.addEventListener('pointerdown', trendHover);
    hit.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hideTip(); });
  }
  function niceStep(v) {
    if (v <= 0) return 100;
    var p = Math.pow(10, Math.floor(Math.log10(v))), f = v / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  }
  function trendHover(e) {
    var st = trendState; if (!st) return;
    var svg = e.currentTarget.ownerSVGElement, r = svg.getBoundingClientRect();
    var scale = r.width / svg.viewBox.baseVal.width;
    var x = (e.clientX - r.left) / scale;
    var n = st.buckets.length;
    var i = n === 1 ? 0 : Math.round((x - st.padL) / st.iw * (n - 1));
    i = Math.max(0, Math.min(n - 1, i));
    var b = st.buckets[i], g = svg.querySelector('#xh'), px = st.X(i);
    g.style.display = '';
    g.querySelector('line').setAttribute('x1', px); g.querySelector('line').setAttribute('x2', px);
    var ci = g.querySelector('.dot-in'), co = g.querySelector('.dot-out');
    if (ci) { ci.setAttribute('cx', px); ci.setAttribute('cy', st.Y(b.in)); }
    if (co) { co.setAttribute('cx', px); co.setAttribute('cy', st.Y(b.out)); }
    var h = '<h4>' + (st.weekly ? 'أسبوع ' + shortLabel(b.k) + ' – ' + shortLabel(b.end) : dayLabel(b.k, true)) + '</h4>';
    if (st.showIn) h += '<p><span><i style="background:var(--in)"></i>دخل</span><b>' + fmt(b.in) + '</b></p>';
    if (st.showOut) h += '<p><span><i style="background:var(--out)"></i>مصروف</span><b>' + fmt(b.out) + '</b></p>';
    if (st.showIn && st.showOut) h += '<hr><p><span>الصافي</span><b dir="ltr" class="' + (b.in - b.out >= 0 ? 'up' : 'down') + '">' + signed(b.in - b.out) + '</b></p>';
    showTip(h, r.left + px * scale, r.top + Math.min(st.Y(st.showIn ? b.in : b.out), st.showOut ? st.Y(b.out) : 1e9) * scale);
  }
  function showTip(html, x, y) {
    var tip = $('tip'); tip.innerHTML = html; tip.hidden = false;
    var w = tip.offsetWidth, hgt = tip.offsetHeight;
    x = Math.max(w / 2 + 8, Math.min(window.innerWidth - w / 2 - 8, x));
    y = Math.max(hgt + 20, y);
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }
  function hideTip() { $('tip').hidden = true; var g = document.querySelector('#xh'); if (g) g.style.display = 'none'; }

  // ----- أشرطة الأصناف -----
  function renderBars(list) {
    if (F.type !== 'all') catMode = F.type;
    $('catMode').querySelectorAll('button').forEach(function (b) {
      b.setAttribute('aria-checked', String(b.dataset.mode === catMode));
      b.disabled = F.type !== 'all' && b.dataset.mode !== F.type;
    });
    var sums = {}, total = 0;
    list.forEach(function (e) { if (e.type === catMode) { sums[e.cat] = (sums[e.cat] || 0) + e.amount; total += e.amount; } });
    var ids = Object.keys(sums).sort(function (a, b) { return sums[b] - sums[a]; });
    if (!ids.length) { $('bars').innerHTML = '<li><span class="none">لا توجد قيود ' + (catMode === 'in' ? 'دخل' : 'مصروف') + ' ضمن الفلتر</span></li>'; return; }
    var max = sums[ids[0]];
    $('bars').innerHTML = ids.map(function (id, i) {
      var c = CAT_BY[id], pct = Math.round(sums[id] / total * 100);
      return '<li class="' + (i === 0 && ids.length > 1 ? 'best' : '') + '"><button type="button" class="bar-btn" data-cat="' + id + '" aria-label="فلترة على ' + c.name + '، ' + fmt(sums[id]) + ' ريال، ' + pct + '٪"></button>' +
        '<span class="nm"><span class="ico" aria-hidden="true">' + c.ico + '</span><span>' + c.name + '</span></span>' +
        '<span class="v"><bdi>' + fmt(sums[id]) + '</bdi><small><bdi>' + pct + '%</bdi></small></span>' +
        '<span class="track"><span class="fill" style="--c:var(--' + catMode + ')" data-w="' + (sums[id] / max * 100).toFixed(1) + '"></span></span></li>';
    }).join('');
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      $('bars').querySelectorAll('.fill').forEach(function (f) { f.style.width = f.dataset.w + '%'; });
    }); });
  }

  // ----- القائمة -----
  function rowHtml(e) {
    var c = CAT_BY[e.cat];
    return '<button type="button" role="listitem" class="row ' + e.type + (e.id === lastSavedId ? ' flash' : '') + '" data-id="' + e.id + '" aria-label="تعديل: ' + c.name + ' ' + fmt(e.amount) + ' ريال، ' + dayLabel(e.date, true) + '">' +
      '<span class="ico" aria-hidden="true">' + c.ico + '</span>' +
      '<span class="meta"><b>' + c.name + '</b><small>' + dayLabel(e.date, true) + (e.note ? ' · ' + esc(e.note) : '') + '</small></span>' +
      '<span class="amt">' + (e.type === 'in' ? '+' : '−') + fmt(e.amount) + '</span></button>';
  }
  function sortDesc(a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : b.id - a.id; }
  function renderList(list) {
    var sorted = list.slice().sort(sortDesc);
    $('listCount').textContent = sorted.length ? sorted.length + ' قيد' : '';
    $('list').innerHTML = sorted.length ? sorted.slice(0, listLimit).map(rowHtml).join('') : '<p class="none">لا توجد قيود ضمن الفلتر — جرّب توسّع الفترة</p>';
    var more = $('moreBtn');
    more.hidden = sorted.length <= listLimit;
    more.textContent = 'عرض المزيد (' + Math.max(0, sorted.length - listLimit) + ' متبقي)';
  }

  // ---------- النوافذ ----------
  var lastFocus = null, openDay = null, returnToDay = null;
  function openOv(id) {
    lastFocus = document.activeElement;
    var ov = $(id); ov.hidden = false;
    document.body.style.overflow = 'hidden';
    var f = ov.querySelector('input:not([type=hidden]),button.btn-primary,[data-close]');
    setTimeout(function () { (f || ov).focus(); }, 30);
  }
  function closeOv(id, keepFocus) {
    $(id).hidden = true;
    if ($('dayOv').hidden && $('formOv').hidden) document.body.style.overflow = '';
    if (id === 'dayOv') openDay = null;
    if (!keepFocus && lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  function showDay(k) {
    openDay = k;
    var items = db.entries.filter(function (e) { return e.date === k && matchTC(e); }).sort(sortDesc);
    var s = totals(items);
    $('dayTitle').textContent = dayLabel(k, true) + ' ' + parse(k).getFullYear();
    var note = [];
    if (F.type !== 'all') note.push(F.type === 'in' ? 'الدخل فقط' : 'المصروف فقط');
    if (F.cat !== 'all') note.push(CAT_BY[F.cat].name);
    $('daySub').textContent = items.length + ' قيد' + (note.length ? ' · حسب الفلتر: ' + note.join('، ') : '');
    $('daySum').innerHTML = '<div class="s-in"><span>الدخل</span><b>' + fmt(s.in) + '</b></div><div class="s-out"><span>المصروف</span><b>' + fmt(s.out) + '</b></div><div><span>الصافي</span><b class="' + (s.net >= 0 ? 'up' : 'down') + '">' + signed(s.net) + '</b></div>';
    $('dayList').innerHTML = items.length ? items.map(rowHtml).join('') : '<p class="none">ما فيه قيود لهذا اليوم</p>';
    if ($('dayOv').hidden) openOv('dayOv');
  }

  var editing = null, formType = 'in';
  function setFormType(t, keepCat) {
    formType = t;
    $('eType').querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-checked', String(b.dataset.type === t)); });
    var cur = $('eCat').value;
    buildCatSelect($('eCat'), t, false);
    if (keepCat && CAT_BY[cur] && CAT_BY[cur].type === t) $('eCat').value = cur;
  }
  function openForm(entry, presetDate) {
    editing = entry || null;
    returnToDay = openDay;
    if (openDay) closeOv('dayOv', true);
    $('formTitle').textContent = entry ? 'تعديل القيد' : 'قيد جديد';
    $('eDelete').hidden = !entry;
    $('eSave').textContent = entry ? 'حفظ التعديل' : 'حفظ القيد';
    var t = entry ? entry.type : (F.type !== 'all' ? F.type : 'in');
    setFormType(t);
    if (entry) $('eCat').value = entry.cat; else if (F.cat !== 'all' && CAT_BY[F.cat].type === t) $('eCat').value = F.cat;
    $('eAmount').value = entry ? String(entry.amount) : '';
    $('eDate').value = entry ? entry.date : (presetDate || todayKey());
    $('eNote').value = entry ? entry.note || '' : '';
    clearErr();
    openOv('formOv');
  }
  function clearErr() { ['eAmount', 'eDate'].forEach(function (id) { $(id).removeAttribute('aria-invalid'); $(id + 'Err').textContent = ''; }); }
  function closeForm() {
    closeOv('formOv', !!returnToDay);
    if (returnToDay) { var k = returnToDay; returnToDay = null; showDay(k); }
  }
  function submitForm(ev) {
    ev.preventDefault(); clearErr();
    var amt = parseFloat(toLatin($('eAmount').value)), date = $('eDate').value, ok = true;
    if (!(amt > 0)) { $('eAmount').setAttribute('aria-invalid', 'true'); $('eAmountErr').textContent = 'اكتب مبلغ أكبر من صفر'; ok = false; }
    else if (amt > 10000000) { $('eAmount').setAttribute('aria-invalid', 'true'); $('eAmountErr').textContent = 'المبلغ كبير مرة، تأكد منه'; ok = false; }
    if (!isKey(date)) { $('eDate').setAttribute('aria-invalid', 'true'); $('eDateErr').textContent = 'اختر التاريخ'; ok = false; }
    if (!ok) { (document.querySelector('#form [aria-invalid="true"]')).focus(); return; }
    var data = { date: date, type: formType, cat: $('eCat').value, amount: Math.round(amt * 100) / 100, note: $('eNote').value.trim().slice(0, 80) };
    if (editing) { Object.assign(editing, data); lastSavedId = editing.id; }
    else { data.id = db.nextId++; db.entries.push(data); lastSavedId = data.id; }
    db.dirty = true; save();
    var wasEdit = !!editing;
    // خلّ القيد ظاهر: لو برا الفلتر، نوسّع الفلتر
    if (!inRange(date, F.from, F.to) || !matchTC(data)) {
      if (!inRange(date, F.from, F.to)) applyRange('all');
      if (!matchTC(data)) { F.type = 'all'; F.cat = 'all'; }
      var d = parse(date); cal.y = d.getFullYear(); cal.m = d.getMonth();
    }
    if (returnToDay && returnToDay !== date) returnToDay = date;
    render();
    closeForm();
    toast(wasEdit ? 'انحفظ التعديل' : 'انضاف القيد ✓');
    setTimeout(function () { lastSavedId = null; }, 1500);
  }
  function deleteEditing() {
    if (!editing) return;
    var e = editing, i = db.entries.indexOf(e);
    if (i < 0) return;
    db.entries.splice(i, 1); db.dirty = true; save();
    editing = null;
    render(); closeForm();
    toast('انحذف القيد', function () { db.entries.push(e); save(); render(); if (openDay) showDay(openDay); toast('رجّعنا القيد'); });
  }

  var toastT;
  function toast(msg, undo) {
    clearTimeout(toastT);
    var t = $('toast'); $('toastTxt').textContent = msg;
    var a = $('toastAct'); a.hidden = !undo;
    a.onclick = undo ? function () { t.hidden = true; undo(); } : null;
    t.hidden = false;
    toastT = setTimeout(function () { t.hidden = true; }, undo ? 6000 : 2600);
  }

  // ---------- الثيم ----------
  function curTheme() { return document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); }
  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem(THEME_KEY, t); } catch (e) { }
    var m = document.querySelector('meta[name=theme-color]'); if (m) m.content = t === 'light' ? '#f5f3ee' : '#0e1014';
  }

  // ---------- الأحداث ----------
  function bind() {
    document.querySelectorAll('.chip').forEach(function (b) { b.addEventListener('click', function () { applyRange(b.dataset.range); listLimit = 12; render(); }); });
    function dateChange() {
      var a = $('fFrom').value, b = $('fTo').value;
      if (a && b && a > b) { var x = a; a = b; b = x; }
      F.from = isKey(a) ? a : ''; F.to = isKey(b) ? b : ''; F.range = 'custom';
      var anc = parse(F.to || F.from || todayKey()); cal.y = anc.getFullYear(); cal.m = anc.getMonth();
      listLimit = 12; render();
    }
    $('fFrom').addEventListener('change', dateChange);
    $('fTo').addEventListener('change', dateChange);
    $('fType').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      F.type = b.dataset.type;
      if (F.cat !== 'all' && F.type !== 'all' && CAT_BY[F.cat].type !== F.type) F.cat = 'all';
      listLimit = 12; render();
    });
    $('fCat').addEventListener('change', function () {
      F.cat = this.value;
      if (F.cat !== 'all' && F.type !== 'all' && CAT_BY[F.cat].type !== F.type) F.type = CAT_BY[F.cat].type;
      if (F.cat !== 'all' && F.type === 'all') catMode = CAT_BY[F.cat].type;
      listLimit = 12; render();
    });
    $('clearF').addEventListener('click', function () { F.type = 'all'; F.cat = 'all'; applyRange('30'); listLimit = 12; render(); });
    $('catMode').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b || b.disabled) return; catMode = b.dataset.mode; renderBars(filtered()); });
    $('bars').addEventListener('click', function (e) {
      var b = e.target.closest('.bar-btn'); if (!b) return;
      F.cat = F.cat === b.dataset.cat ? 'all' : b.dataset.cat;
      listLimit = 12; render();
      toast(F.cat === 'all' ? 'رجعنا لكل الأصناف' : 'فلترنا على: ' + CAT_BY[F.cat].name);
    });
    $('calPrev').addEventListener('click', function () { cal.m--; if (cal.m < 0) { cal.m = 11; cal.y--; } renderCal(); });
    $('calNext').addEventListener('click', function () { cal.m++; if (cal.m > 11) { cal.m = 0; cal.y++; } renderCal(); });
    $('cal').addEventListener('click', function (e) { var b = e.target.closest('[data-day]'); if (b) showDay(b.dataset.day); });
    function rowClick(e) {
      var r = e.target.closest('.row'); if (!r) return;
      var ent = db.entries.filter(function (x) { return x.id === +r.dataset.id; })[0];
      if (ent) openForm(ent);
    }
    $('list').addEventListener('click', rowClick);
    $('dayList').addEventListener('click', rowClick);
    $('moreBtn').addEventListener('click', function () { listLimit += 20; renderList(filtered()); });
    $('addBtn').addEventListener('click', function () { openForm(null); });
    $('dayAdd').addEventListener('click', function () { openForm(null, openDay); });
    $('eType').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setFormType(b.dataset.type, true); });
    $('form').addEventListener('submit', submitForm);
    $('eDelete').addEventListener('click', deleteEditing);
    $('eAmount').addEventListener('input', function () { this.removeAttribute('aria-invalid'); $('eAmountErr').textContent = ''; });
    document.querySelectorAll('[data-close]').forEach(function (b) {
      b.addEventListener('click', function () { if (b.closest('#formOv')) closeForm(); else closeOv('dayOv'); });
    });
    ['dayOv', 'formOv'].forEach(function (id) {
      $(id).addEventListener('click', function (e) { if (e.target === this) { if (id === 'formOv') closeForm(); else closeOv('dayOv'); } });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (!$('formOv').hidden) closeForm(); else if (!$('dayOv').hidden) closeOv('dayOv');
      hideTip();
    });
    document.addEventListener('pointerdown', function (e) { if (!e.target.closest('#trend')) hideTip(); });
    $('themeBtn').addEventListener('click', function () { setTheme(curTheme() === 'light' ? 'dark' : 'light'); });
    $('sampleX').addEventListener('click', function () { $('sample').hidden = true; try { localStorage.setItem(SAMPLE_KEY, '1'); } catch (e) { } });
    var armed = null;
    $('resetBtn').addEventListener('click', function () {
      var b = this;
      if (!armed) { b.textContent = 'متأكد؟ اضغط مرة ثانية للتأكيد'; armed = setTimeout(function () { armed = null; b.textContent = 'إعادة ضبط النموذج'; }, 3500); return; }
      clearTimeout(armed); armed = null; b.textContent = 'إعادة ضبط النموذج';
      db = seedData(); save();
      try { localStorage.removeItem(SAMPLE_KEY); localStorage.removeItem(THEME_KEY); } catch (e) { }
      delete document.documentElement.dataset.theme;
      $('sample').hidden = false;
      F.type = 'all'; F.cat = 'all'; catMode = 'in'; listLimit = 12; applyRange('30'); render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast('رجع النموذج لبياناته الأصلية');
    });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { hideTip(); renderTrend(filtered(), effFrom(), effTo()); }, 120); });
  }

  // ---------- الإقلاع ----------
  load();
  try { if (localStorage.getItem(SAMPLE_KEY)) $('sample').hidden = true; } catch (e) { }
  applyRange('30');
  bind();
  render();
})();
