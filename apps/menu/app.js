/* منيو سُفرة الحارة — نموذج تجريبي: لا يرسل أي شيء، فقط يعرض شكل الرسالة */
(function () {
  'use strict';

  var CATS = [
    { id: 'pop', name: 'الأكثر طلبًا', ico: '🔥' },
    { id: 'main', name: 'الأطباق الرئيسية', ico: '🍛' },
    { id: 'sand', name: 'ساندويتشات', ico: '🌯' },
    { id: 'starter', name: 'مقبلات', ico: '🥗' },
    { id: 'drink', name: 'مشروبات', ico: '🥤' },
    { id: 'sweet', name: 'حلا', ico: '🍮' }
  ];
  var SIZE_RICE = { id: 'size', label: 'الحجم', type: 'one', choices: [{ label: 'نص', add: 0 }, { label: 'كامل يكفي ٣ إلى ٤', add: 40 }] };
  var RICE_EXTRA = { id: 'ext', label: 'إضافات', type: 'many', choices: [{ label: 'لبن', add: 4 }, { label: 'دقوس زيادة', add: 2 }, { label: 'سلطة خضراء', add: 9 }] };
  var DRINK_SIZE = { id: 'size', label: 'الحجم', type: 'one', choices: [{ label: 'وسط', add: 0 }, { label: 'كبير', add: 4 }] };
  var ITEMS = [
    { id: 'kabsa', cat: 'main', name: 'كبسة لحم', desc: 'لحم حاشي مطهو على مهل مع رز بشاور وبهارات الكبسة والمكسرات المحمصة.', ico: '🍖', h: 28, price: 45, pop: 1, badges: [['الأكثر طلبًا', '']], opts: [SIZE_RICE, RICE_EXTRA] },
    { id: 'mandi', cat: 'main', name: 'مندي دجاج', desc: 'دجاج مدخّن بالفحم على رز مندي أصفر، يجيك معه دقوس وسلطة.', ico: '🍗', h: 38, price: 28, pop: 1, opts: [{ id: 'size', label: 'الحجم', type: 'one', choices: [{ label: 'ربع', add: 0 }, { label: 'نص', add: 10 }, { label: 'حبة كاملة', add: 32 }] }, RICE_EXTRA] },
    { id: 'madhbi', cat: 'main', name: 'مظبي دجاج', desc: 'دجاج مشوي على الحجر بتتبيلة الحارة الخاصة.', ico: '🔥', h: 14, price: 32, badges: [['حار', 'h']], opts: [{ id: 'spice', label: 'درجة الحرارة', type: 'one', choices: [{ label: 'عادي', add: 0 }, { label: 'حار', add: 0 }, { label: 'حار مرة 🌶️', add: 0 }] }] },
    { id: 'marqooq', cat: 'main', name: 'مرقوق', desc: 'عجينة رقيقة مطبوخة في مرق الخضار واللحم، دفا بيوت زمان.', ico: '🥘', h: 22, price: 30, badges: [['أكل بيت', 'g']] },
    { id: 'jareesh', cat: 'main', name: 'جريش', desc: 'جريش ناعم بالدجاج والبصل المحمّر والسمن البري.', ico: '🥣', h: 45, price: 22 },
    { id: 'saleeg', cat: 'main', name: 'سليق', desc: 'رز مطبوخ بالحليب والمرق مع دجاج محمّر بالفرن.', ico: '🍚', h: 50, price: 26 },
    { id: 'burger', cat: 'sand', name: 'برجر لحم', desc: 'لحم بلدي مفروم، جبنة شيدر، بصل مكرمل وصوص البيت.', ico: '🍔', h: 32, price: 26, pop: 1, badges: [['جديد', 'g']], opts: [{ id: 'combo', label: 'تبيه وجبة؟', type: 'one', choices: [{ label: 'ساندويتش بس', add: 0 }, { label: 'وجبة (بطاطس + مشروب)', add: 9 }] }] },
    { id: 'shawarma', cat: 'sand', name: 'شاورما دجاج', desc: 'شاورما على الفحم بالثوم والمخلل، في صاج أو صامولي.', ico: '🌯', h: 40, price: 14, pop: 1, opts: [{ id: 'bread', label: 'نوع الخبز', type: 'one', choices: [{ label: 'صاج', add: 0 }, { label: 'صامولي', add: 0 }, { label: 'عربي (صحن)', add: 6 }] }] },
    { id: 'mutabbaq', cat: 'sand', name: 'مطبق لحم', desc: 'مطبق مقرمش محشي لحم وبيض وكراث، مع صوص حار.', ico: '🫓', h: 36, price: 18 },
    { id: 'falafel', cat: 'sand', name: 'فلافل', desc: 'فلافل طازجة بالطحينة والخضار في خبز صامولي.', ico: '🧆', h: 70, price: 10 },
    { id: 'sambosa', cat: 'starter', name: 'سمبوسة (٦ حبات)', desc: 'سمبوسة مقرمشة: لحم، جبن، أو خضار.', ico: '🥟', h: 42, price: 12, pop: 1, opts: [{ id: 'fill', label: 'الحشوة', type: 'one', choices: [{ label: 'لحم', add: 0 }, { label: 'جبن', add: 0 }, { label: 'خضار', add: 0 }, { label: 'مشكّل', add: 2 }] }] },
    { id: 'salad', cat: 'starter', name: 'سلطة خضراء', desc: 'خيار، طماطم، خس وجرجير بصوص الليمون وزيت الزيتون.', ico: '🥗', h: 95, price: 14 },
    { id: 'hummus', cat: 'starter', name: 'حمص بالطحينة', desc: 'حمص ناعم بزيت الزيتون والكمون، مع خبز حار.', ico: '🫘', h: 46, price: 13 },
    { id: 'fries', cat: 'starter', name: 'بطاطس مقلية', desc: 'بطاطس مقرمشة ببهارات البيت.', ico: '🍟', h: 48, price: 10 },
    { id: 'laban', cat: 'drink', name: 'لبن', desc: 'لبن بارد، يمشي مع الكبسة والمندي.', ico: '🥛', h: 200, price: 4 },
    { id: 'orange', cat: 'drink', name: 'عصير برتقال طازج', desc: 'يتعصر قدامك، بدون سكر مضاف.', ico: '🍊', h: 32, price: 12, opts: [DRINK_SIZE] },
    { id: 'tea', cat: 'drink', name: 'شاي بالنعناع', desc: 'براد شاي أحمر بالنعناع الطازج.', ico: '🍵', h: 110, price: 6 },
    { id: 'gahwa', cat: 'drink', name: 'دلّة قهوة عربية', desc: 'قهوة شقراء بالهيل والزعفران مع تمر سكري.', ico: '☕', h: 34, price: 18, badges: [['للضيافة', 'g']] },
    { id: 'mojito', cat: 'drink', name: 'موهيتو', desc: 'ليمون ونعناع وصودا، بنكهات: فراولة، رمان، أو كلاسيك.', ico: '🍹', h: 150, price: 16, opts: [{ id: 'flavor', label: 'النكهة', type: 'one', choices: [{ label: 'كلاسيك', add: 0 }, { label: 'فراولة', add: 0 }, { label: 'رمان', add: 0 }] }, DRINK_SIZE] },
    { id: 'water', cat: 'drink', name: 'مويه', desc: 'قارورة صغيرة.', ico: '💧', h: 200, price: 2 },
    { id: 'kunafa', cat: 'sweet', name: 'كنافة بالجبن', desc: 'كنافة نابلسية ساخنة بالقطر والفستق.', ico: '🧀', h: 40, price: 19, pop: 1 },
    { id: 'luqaimat', cat: 'sweet', name: 'لقيمات', desc: 'لقيمات مقرمشة بدبس التمر والسمسم.', ico: '🍯', h: 36, price: 15 },
    { id: 'muhallabia', cat: 'sweet', name: 'مهلبية', desc: 'مهلبية بماء الورد والفستق الحلبي.', ico: '🍮', h: 30, price: 11 }
  ];
  var BY = {}; ITEMS.forEach(function (i) { BY[i.id] = i; });
  var KEY = 'lw-menu-v1';

  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ar(n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); }

  // ---------- الحالة ----------
  var urlTable = parseInt(new URLSearchParams(location.search).get('t') || new URLSearchParams(location.search).get('table'), 10);
  function fresh() { return { cart: [], mode: 'table', table: urlTable >= 1 && urlTable <= 24 ? urlTable : 7, pName: '', pT: 0, gNote: '', orderNo: 1047 }; }
  var S;
  try { S = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { S = null; }
  if (!S || !Array.isArray(S.cart)) S = fresh();
  S.cart = S.cart.filter(function (l) { return BY[l.id] && l.qty > 0; });
  if (urlTable >= 1 && urlTable <= 24) S.table = urlTable;
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }

  function unitPrice(item, opts) {
    var p = item.price;
    (item.opts || []).forEach(function (o) {
      var v = opts && opts[o.id];
      if (o.type === 'one') p += o.choices[v || 0].add;
      else (v || []).forEach(function (i) { p += o.choices[i].add; });
    });
    return p;
  }
  function optText(item, opts) {
    var out = [];
    (item.opts || []).forEach(function (o) {
      var v = opts && opts[o.id];
      if (o.type === 'one') out.push(o.choices[v || 0].label);
      else if (v && v.length) out.push('مع ' + v.map(function (i) { return o.choices[i].label; }).join(' و'));
    });
    return out.join(' · ');
  }
  function lineKey(id, opts, note) { return id + '|' + JSON.stringify(opts || {}) + '|' + (note || ''); }
  function totals() {
    var q = 0, t = 0;
    S.cart.forEach(function (l) { q += l.qty; t += l.qty * unitPrice(BY[l.id], l.opts); });
    return { qty: q, total: t };
  }
  function plainQty(id) {
    var l = S.cart.filter(function (x) { return x.key === lineKey(id, {}, ''); })[0];
    return l ? l.qty : 0;
  }
  function itemQty(id) { return S.cart.reduce(function (a, l) { return a + (l.id === id ? l.qty : 0); }, 0); }
  function addLine(id, opts, note, qty) {
    var k = lineKey(id, opts, note);
    var l = S.cart.filter(function (x) { return x.key === k; })[0];
    if (l) l.qty = Math.min(50, l.qty + qty);
    else S.cart.push({ key: k, id: id, opts: opts || {}, note: note || '', qty: qty });
    save(); refresh(true);
  }
  function changeLine(k, d) {
    var l = S.cart.filter(function (x) { return x.key === k; })[0]; if (!l) return;
    l.qty += d;
    if (l.qty <= 0) S.cart.splice(S.cart.indexOf(l), 1);
    l.qty = Math.min(50, l.qty);
    save(); refresh(d > 0);
  }

  // ---------- المنيو ----------
  function cardHtml(it) {
    var b = (it.badges || []).map(function (x) { return '<span class="badge ' + x[1] + '">' + x[0] + '</span>'; }).join('');
    var hasOpts = it.opts && it.opts.length;
    var from = hasOpts && it.opts.some(function (o) { return o.choices.some(function (c) { return c.add > 0; }) && o.type === 'one'; });
    var q = plainQty(it.id), total = itemQty(it.id);
    var ctrl = (!hasOpts && q > 0)
      ? '<div class="mini" role="group" aria-label="كمية ' + it.name + '"><button type="button" data-dec="' + it.id + '" aria-label="أنقص ' + it.name + '">−</button><output>' + ar(q) + '</output><button type="button" data-inc="' + it.id + '" aria-label="زد ' + it.name + '">+</button></div>'
      : '<button type="button" class="add" data-add="' + it.id + '" aria-label="أضف ' + it.name + ' للسلة">+</button>';
    if (hasOpts && total) b += '<span class="badge g">في السلة ×' + ar(total) + '</span>';
    return '<article class="item" data-id="' + it.id + '">' +
      '<button type="button" class="item-open" data-open="' + it.id + '" aria-label="تفاصيل ' + it.name + '"></button>' +
      '<div class="art" style="--h:' + it.h + '" aria-hidden="true"><span>' + it.ico + '</span></div>' +
      '<div class="info">' + (b ? '<div class="badges">' + b + '</div>' : '') + '<h3>' + it.name + '</h3><p>' + it.desc + '</p>' +
      '<div class="row"><span class="price">' + (from ? '<span class="from">من</span>' : '') + ar(it.price) + '<small>ر.س</small></span>' + ctrl + '</div></div></article>';
  }
  function renderMenu() {
    var q = $('q').value.trim();
    var html = '', any = false;
    CATS.forEach(function (c) {
      if (c.id === 'pop' && q) return;
      var list = ITEMS.filter(function (i) { return (c.id === 'pop' ? i.pop : i.cat === c.id) && (!q || (i.name + ' ' + i.desc).indexOf(q) >= 0); });
      if (!list.length) return;
      any = true;
      html += '<section id="sec-' + c.id + '" aria-labelledby="h-' + c.id + '"><h2 id="h-' + c.id + '"><span aria-hidden="true">' + c.ico + '</span>' + c.name + ' <small>' + ar(list.length) + ' أصناف</small></h2><div class="items">' + list.map(cardHtml).join('') + '</div></section>';
    });
    $('menu').innerHTML = html;
    $('empty').hidden = any;
    $('tabs').innerHTML = CATS.filter(function (c) { return document.getElementById('sec-' + c.id); }).map(function (c) {
      return '<a href="#sec-' + c.id + '" data-sec="' + c.id + '"><span aria-hidden="true">' + c.ico + '</span>' + c.name + '</a>';
    }).join('');
    spy();
  }
  var spyObs;
  function spy() {
    if (spyObs) spyObs.disconnect();
    if (!('IntersectionObserver' in window)) return;
    var vis = {};
    spyObs = new IntersectionObserver(function (es) {
      es.forEach(function (e) { vis[e.target.id] = e.isIntersecting ? e.boundingClientRect.top : null; });
      var best = null, bt = Infinity;
      Object.keys(vis).forEach(function (id) { if (vis[id] !== null && vis[id] < bt) { bt = vis[id]; best = id; } });
      if (best) setTab(best.slice(4));
    }, { rootMargin: '-70px 0px -55% 0px' });
    document.querySelectorAll('.menu section').forEach(function (s) { spyObs.observe(s); });
  }
  function setTab(id) {
    document.querySelectorAll('#tabs a').forEach(function (a) {
      var on = a.dataset.sec === id;
      a.setAttribute('aria-current', String(on));
      if (on) { var t = $('tabs'); var r = a.offsetLeft - t.clientWidth / 2 + a.clientWidth / 2; t.scrollTo({ left: r, behavior: 'smooth' }); }
    });
  }

  function renderMode() {
    [$('modeSeg'), $('modeSeg2')].forEach(function (seg) { seg.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-checked', String(b.dataset.mode === S.mode)); }); });
    if (S.mode === 'table') $('modeNote').innerHTML = 'طلبك بيوصل إلى <b>طاولة ' + ar(S.table) + '</b><span class="muted">رقم الطاولة من الـQR — تقدر تغيّره من السلة</span>';
    else $('modeNote').innerHTML = '<b>استلام من الكاشير</b><span class="muted">نجهّز طلبك ونناديك باسمك</span>';
    $('tableFields').hidden = S.mode !== 'table';
    $('pickupFields').hidden = S.mode !== 'pickup';
  }

  function refresh(bump) {
    renderMenu();
    var t = totals(), bar = $('cartBar');
    bar.hidden = t.qty === 0;
    $('cbCount').textContent = ar(t.qty);
    $('cbTotal').textContent = ar(t.total) + ' ر.س';
    if (bump && t.qty) { bar.classList.remove('bump'); void bar.offsetWidth; bar.classList.add('bump'); }
    if (!$('cartOv').hidden) renderCart();
  }

  // ---------- نوافذ ----------
  var lastFocus = null;
  function openOv(id) {
    lastFocus = document.activeElement;
    $(id).hidden = false; document.body.style.overflow = 'hidden';
    var f = $(id).querySelector('[data-close]'); setTimeout(function () { f && f.focus(); }, 30);
  }
  function closeOv(id) {
    $(id).hidden = true;
    if ($('itemOv').hidden && $('cartOv').hidden && $('waOv').hidden) document.body.style.overflow = '';
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  // ----- تفاصيل الصنف -----
  var cur = null;
  function openItem(id) {
    var it = BY[id]; cur = { it: it, qty: 1, opts: {} };
    $('itArt').style.setProperty('--h', it.h);
    $('itArt').innerHTML = '<span>' + it.ico + '</span>';
    $('itTitle').textContent = it.name;
    $('itDesc').textContent = it.desc;
    $('itNote').value = '';
    $('itOpts').innerHTML = (it.opts || []).map(function (o) {
      return '<fieldset class="opt"><legend>' + o.label + ' <small>' + (o.type === 'one' ? 'اختر واحد' : 'اختياري') + '</small></legend>' +
        o.choices.map(function (c, i) {
          return '<label class="choice"><input type="' + (o.type === 'one' ? 'radio' : 'checkbox') + '" name="o-' + o.id + '" value="' + i + '"' + (o.type === 'one' && i === 0 ? ' checked' : '') + '><span>' + c.label + '</span><b>' + (c.add ? '+' + ar(c.add) + ' ر.س' : '') + '</b></label>';
        }).join('') + '</fieldset>';
    }).join('');
    updItem();
    openOv('itemOv');
  }
  function readOpts() {
    var o = {};
    (cur.it.opts || []).forEach(function (op) {
      var ins = $('itOpts').querySelectorAll('input[name="o-' + op.id + '"]:checked');
      if (op.type === 'one') { var v = ins[0] ? +ins[0].value : 0; if (v) o[op.id] = v; }
      else { var arr = Array.prototype.map.call(ins, function (x) { return +x.value; }); if (arr.length) o[op.id] = arr; }
    });
    return o;
  }
  function updItem() {
    cur.opts = readOpts();
    $('itQty').textContent = ar(cur.qty);
    $('itMinus').disabled = cur.qty <= 1;
    $('itPrice').textContent = ar(unitPrice(cur.it, cur.opts) * cur.qty) + ' ر.س';
  }

  // ----- السلة -----
  function renderCart() {
    var t = totals();
    if (!S.cart.length) {
      $('lines').innerHTML = '<li class="cart-empty"><span aria-hidden="true">🧺</span>سلتك فاضية — اختر شي يفتح النفس</li>';
    } else {
      $('lines').innerHTML = S.cart.map(function (l) {
        var it = BY[l.id], ot = optText(it, l.opts);
        return '<li class="line"><div class="art" style="--h:' + it.h + '" aria-hidden="true"><span>' + it.ico + '</span></div>' +
          '<div><h3>' + it.name + '</h3>' + (ot ? '<p>' + esc(ot) + '</p>' : '') + (l.note ? '<p>📝 ' + esc(l.note) + '</p>' : '') + '</div>' +
          '<div class="side"><span class="lp">' + ar(unitPrice(it, l.opts) * l.qty) + ' ر.س</span><div class="mini" role="group" aria-label="كمية ' + it.name + '">' +
          '<button type="button" data-lk="' + esc(l.key) + '" data-d="-1" aria-label="أنقص ' + it.name + '">' + (l.qty === 1 ? '🗑' : '−') + '</button><output>' + ar(l.qty) + '</output>' +
          '<button type="button" data-lk="' + esc(l.key) + '" data-d="1" aria-label="زد ' + it.name + '">+</button></div></div></li>';
      }).join('');
    }
    var tbl = $('tableNo');
    if (!tbl.options.length) { var h = ''; for (var i = 1; i <= 24; i++) h += '<option value="' + i + '">طاولة ' + ar(i) + '</option>'; tbl.innerHTML = h; }
    tbl.value = S.table;
    $('pName').value = S.pName; $('gNote').value = S.gNote;
    $('pTime').querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-checked', String(+b.dataset.t === S.pT)); });
    var vat = t.total - t.total / 1.15;
    $('sum').innerHTML = '<dt>عدد الأصناف</dt><dd>' + ar(t.qty) + '</dd><dt>منها ضريبة ١٥٪</dt><dd>' + ar(vat.toFixed(2)) + ' ر.س</dd><dt class="tot">الإجمالي</dt><dd class="tot">' + ar(t.total) + ' ر.س</dd>';
    $('sendBtn').disabled = !S.cart.length;
    renderMode();
  }

  // ----- الرسالة -----
  function timeStr(d) {
    var h = d.getHours(), m = d.getMinutes();
    return ar((h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m) + (h < 12 ? ' ص' : ' م');
  }
  function buildMsg() {
    var t = totals(), now = new Date(), L = [];
    L.push('🧾 *طلب جديد رقم ' + ar(S.orderNo) + '*');
    if (S.mode === 'table') L.push('🪑 *داخل المطعم — طاولة ' + ar(S.table) + '*');
    else {
      var when = S.pT ? 'بعد ' + ar(S.pT) + ' دقيقة (' + timeStr(new Date(now.getTime() + S.pT * 6e4)) + ')' : 'أسرع وقت';
      L.push('🛍️ *استلام — ' + S.pName + '*');
      L.push('⏰ وقت الاستلام: ' + when);
    }
    L.push('┈┈┈┈┈┈┈┈┈┈┈┈');
    S.cart.forEach(function (l) {
      var it = BY[l.id], ot = optText(it, l.opts);
      L.push('▫️ ' + ar(l.qty) + '× ' + it.name + ' — ' + ar(unitPrice(it, l.opts) * l.qty) + ' ر.س');
      if (ot) L.push('      ↳ ' + ot);
      if (l.note) L.push('      ↳ ملاحظة: ' + l.note);
    });
    L.push('┈┈┈┈┈┈┈┈┈┈┈┈');
    L.push('💰 *الإجمالي: ' + ar(t.total) + ' ر.س* (شامل الضريبة)');
    L.push('💳 الدفع: ' + (S.mode === 'table' ? 'على الطاولة' : 'عند الاستلام'));
    if (S.gNote) L.push('📝 ملاحظة للمطبخ: ' + S.gNote);
    L.push('');
    L.push('_وصل من المنيو الرقمي_');
    return L.join('\n');
  }
  function msgHtml(txt) {
    return esc(txt).replace(/\*([^*\n]+)\*/g, '<b>$1</b>').replace(/_([^_\n]+)_/g, '<i>$1</i>') + '<span class="tm">' + timeStr(new Date()) + ' ✓✓</span>';
  }
  var lastMsg = '';
  function send() {
    if (!S.cart.length) return;
    if (S.mode === 'pickup') {
      S.pName = $('pName').value.trim();
      if (!S.pName) { $('pName').setAttribute('aria-invalid', 'true'); $('pNameErr').textContent = 'اكتب اسمك عشان نناديك'; $('pName').focus(); return; }
    }
    S.gNote = $('gNote').value.trim();
    lastMsg = buildMsg();
    $('waMsg').innerHTML = msgHtml(lastMsg);
    S.orderNo++; save();
    $('cartOv').hidden = true;
    openOv('waOv');
  }
  function copy(txt) {
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { }
      ta.remove(); toast(ok ? 'انتسخ نص الرسالة ✓' : 'ما قدرنا ننسخ — جرّب يدويًا');
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(function () { toast('انتسخ نص الرسالة ✓'); }, fallback);
    else fallback();
  }
  var tt;
  function toast(m) { var t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 2200); }

  // ---------- الأحداث ----------
  $('menu').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.open) return openItem(b.dataset.open);
    var id = b.dataset.add || b.dataset.inc;
    if (id) {
      var it = BY[id];
      if (it.opts && it.opts.length) return openItem(id);
      addLine(id, {}, '', 1);
      toast('انضاف ' + it.name + ' للسلة');
      var nb = document.querySelector('.item[data-id="' + id + '"] [data-inc]'); if (nb) nb.focus();
      return;
    }
    if (b.dataset.dec) {
      changeLine(lineKey(b.dataset.dec, {}, ''), -1);
      var nb2 = document.querySelector('.item[data-id="' + b.dataset.dec + '"] [data-dec], .item[data-id="' + b.dataset.dec + '"] [data-add]'); if (nb2) nb2.focus();
    }
  });
  $('q').addEventListener('input', renderMenu);
  $('tabs').addEventListener('click', function (e) {
    var a = e.target.closest('a'); if (!a) return; e.preventDefault();
    var s = document.getElementById('sec-' + a.dataset.sec);
    if (s) { s.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); setTab(a.dataset.sec); }
  });
  function modeClick(e) { var b = e.target.closest('button'); if (!b) return; S.mode = b.dataset.mode; save(); renderMode(); }
  $('modeSeg').addEventListener('click', modeClick);
  $('modeSeg2').addEventListener('click', modeClick);
  $('itOpts').addEventListener('change', updItem);
  $('itMinus').addEventListener('click', function () { if (cur.qty > 1) { cur.qty--; updItem(); } });
  $('itPlus').addEventListener('click', function () { if (cur.qty < 50) { cur.qty++; updItem(); } });
  $('itAdd').addEventListener('click', function () {
    var note = $('itNote').value.trim().slice(0, 80);
    addLine(cur.it.id, readOpts(), note, cur.qty);
    closeOv('itemOv');
    toast('انضاف ' + ar(cur.qty) + '× ' + cur.it.name + ' للسلة');
  });
  $('cartBar').addEventListener('click', function () { renderCart(); openOv('cartOv'); });
  $('lines').addEventListener('click', function (e) { var b = e.target.closest('[data-lk]'); if (b) changeLine(b.dataset.lk, +b.dataset.d); });
  $('tableNo').addEventListener('change', function () { S.table = +this.value; save(); renderMode(); });
  $('pName').addEventListener('input', function () { S.pName = this.value; this.removeAttribute('aria-invalid'); $('pNameErr').textContent = ''; save(); });
  $('gNote').addEventListener('input', function () { S.gNote = this.value; save(); });
  $('pTime').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; S.pT = +b.dataset.t; save(); renderCart(); });
  $('sendBtn').addEventListener('click', send);
  $('copyBtn').addEventListener('click', function () { copy(lastMsg); });
  $('newOrder').addEventListener('click', function () { S.cart = []; S.gNote = ''; save(); closeOv('waOv'); refresh(); window.scrollTo({ top: 0, behavior: 'smooth' }); toast('جاهزين لطلبك الجاي 👌'); });
  document.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { closeOv(b.closest('.ov').id); }); });
  document.querySelectorAll('.ov').forEach(function (o) { o.addEventListener('click', function (e) { if (e.target === o) closeOv(o.id); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = ['waOv', 'itemOv', 'cartOv'].filter(function (id) { return !$(id).hidden; })[0];
    if (open) closeOv(open);
  });
  var armed = null;
  $('resetBtn').addEventListener('click', function () {
    var b = this;
    if (!armed) { b.textContent = 'متأكد؟ اضغط مرة ثانية'; armed = setTimeout(function () { armed = null; b.textContent = 'إعادة ضبط النموذج'; }, 3500); return; }
    clearTimeout(armed); armed = null; b.textContent = 'إعادة ضبط النموذج';
    try { localStorage.removeItem(KEY); } catch (e) { }
    S = fresh(); $('q').value = ''; renderMode(); refresh();
    window.scrollTo({ top: 0, behavior: 'smooth' }); toast('رجع النموذج لوضعه الأصلي');
  });

  renderMode();
  refresh();
})();
