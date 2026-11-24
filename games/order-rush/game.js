(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var ROUND = 75, STEP = 1 / 60;
  var KEY_BEST = 'leesho-order-rush-best', KEY_MUTE = 'leesho-order-rush-mute';

  var THEMES = {
    burger: { name: 'برجر', icon: '🍔', desc: 'طبقات وجبن', ings: [
      { id: 'patty', e: '🥩', n: 'لحم' }, { id: 'cheese', e: '🧀', n: 'جبن' }, { id: 'lettuce', e: '🥬', n: 'خس' },
      { id: 'tomato', e: '🍅', n: 'طماطم' }, { id: 'pickle', e: '🥒', n: 'مخلل' }, { id: 'onion', e: '🧅', n: 'بصل' }] },
    shawarma: { name: 'شاورما', icon: '🌯', desc: 'لفّة وثوم', ings: [
      { id: 'chicken', e: '🍗', n: 'دجاج' }, { id: 'fries', e: '🍟', n: 'بطاطس' }, { id: 'pickle', e: '🥒', n: 'مخلل' },
      { id: 'tomato', e: '🍅', n: 'طماطم' }, { id: 'garlic', e: '🧄', n: 'ثوم' }, { id: 'pepper', e: '🌶️', n: 'حار' }] },
    pizza: { name: 'بيتزا', icon: '🍕', desc: 'جبن ممطوط', ings: [
      { id: 'sauce', e: '🥫', n: 'صلصة' }, { id: 'cheese', e: '🧀', n: 'جبن' }, { id: 'mush', e: '🍄', n: 'فطر' },
      { id: 'olive', e: '🫒', n: 'زيتون' }, { id: 'pepper', e: '🫑', n: 'فلفل' }, { id: 'bacon', e: '🥓', n: 'لحم' }] },
    coffee: { name: 'قهوة', icon: '☕', desc: 'سخن وطيب', ings: [
      { id: 'bean', e: '🫘', n: 'بن' }, { id: 'milk', e: '🥛', n: 'حليب' }, { id: 'sugar', e: '🍯', n: 'عسل' },
      { id: 'ice', e: '🧊', n: 'ثلج' }, { id: 'choc', e: '🍫', n: 'شوكولاتة' }, { id: 'cardamom', e: '🌿', n: 'هيل' }] }
  };
  var PERSONAS = [
    { h: '😄', m: '😐', a: '😡', c: '#ffd9a0' }, { h: '😊', m: '😒', a: '🤬', c: '#f3b98a' },
    { h: '😋', m: '🙄', a: '😤', c: '#c98f62' }, { h: '🥰', m: '😑', a: '😠', c: '#e8c39b' },
    { h: '😎', m: '😕', a: '👿', c: '#a8d5ff' }
  ];
  var ANGRY_LINES = ['طوّلت علينا!', 'وين طلبي؟!', 'أنا جوعان!', 'استعجلوا يا شباب!', 'الله يهديكم!', 'ذبلت وانا انتظر!'];
  var LEAVE_LINES = ['خلاص مشيت!', 'بروح مطعم ثاني!', 'مع السلامة 😤'];

  /* ---------- أدوات: صوت + اهتزاز ---------- */
  var actx = null, muted = false;
  try { muted = localStorage.getItem(KEY_MUTE) === '1'; } catch (e) {}
  function ensureAudio() {
    if (!actx) { try { var AC = window.AudioContext || window.webkitAudioContext; if (AC) actx = new AC(); } catch (e) {} }
    if (actx && actx.state === 'suspended') actx.resume();
  }
  function tone(f, d, type, vol, delay) {
    if (muted || !actx) return;
    try {
      var t = actx.currentTime + (delay || 0), o = actx.createOscillator(), g = actx.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(vol || 0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + d + 0.02);
    } catch (e) {}
  }
  var SFX = {
    tap: function (i) { tone(440 + i * 70, 0.09, 'triangle'); },
    bad: function () { tone(160, 0.25, 'sawtooth', 0.15); tone(120, 0.25, 'sawtooth', 0.15, 0.12); },
    serve: function () { tone(660, 0.1, 'square', 0.08); tone(880, 0.1, 'square', 0.08, 0.09); tone(1175, 0.18, 'square', 0.08, 0.18); },
    angry: function () { tone(240, 0.18, 'square', 0.07); },
    leave: function () { tone(300, 0.2, 'sine', 0.12); tone(200, 0.3, 'sine', 0.12, 0.15); },
    end: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.2, 'triangle', 0.12, i * 0.12); }); }
  };
  function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
  function refreshMute() { $('b-mute').textContent = muted ? '🔇' : '🔊'; }

  /* ---------- حالة ---------- */
  var S = null, theme = null, mode = 'menu';
  var best = 0;
  try { best = +localStorage.getItem(KEY_BEST) || 0; } catch (e) {}
  var els = {};
  var rafId = 0, last = 0, acc = 0, toastT = 0;

  function show(id) {
    ['s-start', 's-game', 's-pause', 's-end'].forEach(function (s) {
      var on = s === id || (s === 's-game' && (id === 's-pause' || id === 's-end'));
      $(s).classList.toggle('active', on || s === id);
    });
  }
  function rnd(n) { return Math.floor(Math.random() * n); }

  function buildThemes() {
    var h = '';
    Object.keys(THEMES).forEach(function (k) {
      var t = THEMES[k];
      h += '<button class="theme" data-t="' + k + '"><span class="big">' + t.icon + '</span>' + t.name + '<small>' + t.desc + '</small></button>';
    });
    $('themes').innerHTML = h;
    $('themes').addEventListener('click', function (e) {
      var b = e.target.closest('.theme'); if (!b) return;
      ensureAudio(); startGame(b.dataset.t);
    });
    $('best-start').textContent = best;
  }

  function startGame(key) {
    theme = THEMES[key];
    S = { time: ROUND, elapsed: 0, score: 0, combo: 0, tips: 0, served: 0, lost: 0, cust: [null, null, null], sel: -1, built: [], spawnIn: 0.6, uid: 0 };
    var ih = '';
    theme.ings.forEach(function (g, i) { ih += '<button class="ing" data-i="' + i + '" aria-label="' + g.n + '">' + g.e + '<small>' + g.n + '</small></button>'; });
    $('ings').innerHTML = ih;
    var ch = '';
    for (var i = 0; i < 3; i++) ch += '<div class="cust empty" data-s="' + i + '">🪑</div>';
    $('custs').innerHTML = ch;
    els.slots = document.querySelectorAll('.cust');
    $('fx').innerHTML = '';
    mode = 'play'; show('s-game'); $('s-pause').classList.remove('active'); $('s-end').classList.remove('active');
    renderBuild(); renderHud();
    last = performance.now(); acc = 0;
    cancelAnimationFrame(rafId); rafId = requestAnimationFrame(frame);
  }

  /* ---------- زبائن ---------- */
  function maxSlots() { return S.elapsed < 15 ? 2 : 3; }
  function spawn() {
    var free = [];
    for (var i = 0; i < maxSlots(); i++) if (!S.cust[i]) free.push(i);
    if (!free.length) return false;
    var si = free[rnd(free.length)];
    var len = 2 + rnd(Math.min(2 + Math.floor(S.elapsed / 22), 4)); // 2..5
    len = Math.min(len, 5);
    var order = [];
    for (var k = 0; k < len; k++) order.push(rnd(theme.ings.length));
    var pat = (9 + len * 4) * Math.max(0.72, 1 - S.elapsed / 220);
    var c = { id: ++S.uid, slot: si, order: order, pat: pat, max: pat, mood: 'happy', p: PERSONAS[rnd(PERSONAS.length)], el: null, bubbleT: 0 };
    S.cust[si] = c;
    var el = els.slots[si];
    el.className = 'cust enter m-happy'; el.removeAttribute('style');
    var t = '';
    order.forEach(function (ix, n) { t += '<span data-n="' + n + '">' + theme.ings[ix].e + '</span>'; });
    el.innerHTML = '<div class="face" style="--c:' + c.p.c + '"><span class="fe">' + c.p.h + '</span><span class="steam l">💨</span><span class="steam r">💨</span></div>' +
      '<div class="tk">' + t + '</div><div class="pat"><i></i></div>';
    c.el = el; c.fe = el.querySelector('.fe'); c.bar = el.querySelector('.pat i'); c.tk = el.querySelectorAll('.tk span');
    if (S.sel < 0) select(si);
    return true;
  }
  function select(i) {
    if (!S.cust[i]) return;
    if (S.sel !== i) { S.built = []; }
    S.sel = i; renderBuild();
    for (var k = 0; k < 3; k++) els.slots[k].classList.toggle('sel', k === i);
  }
  function autoSelect() {
    var pick = -1, oldest = 1e9;
    for (var i = 0; i < 3; i++) if (S.cust[i] && S.cust[i].id < oldest) { oldest = S.cust[i].id; pick = i; }
    S.sel = -1; S.built = [];
    if (pick >= 0) select(pick); else renderBuild();
    for (var k = 0; k < 3; k++) els.slots[k].classList.toggle('sel', k === S.sel);
  }
  function say(c, txt) {
    var old = c.el.querySelector('.bubble'); if (old) old.remove();
    var b = document.createElement('div'); b.className = 'bubble'; b.textContent = txt; c.el.appendChild(b);
    setTimeout(function () { if (b.parentNode) b.remove(); }, 2200);
  }
  function setMood(c, m) {
    if (c.mood === m) return;
    c.mood = m;
    c.el.classList.remove('m-happy', 'm-meh', 'm-angry'); c.el.classList.add('m-' + m);
    c.fe.textContent = m === 'happy' ? c.p.h : m === 'meh' ? c.p.m : c.p.a;
    if (m === 'angry') { say(c, ANGRY_LINES[rnd(ANGRY_LINES.length)]); SFX.angry(); buzz(30); }
    else if (m === 'meh') { say(c, 'ممكن تستعجل؟'); }
  }
  function leave(c) {
    S.cust[c.slot] = null; S.lost++; S.combo = 0;
    var el = c.el; say(c, LEAVE_LINES[rnd(LEAVE_LINES.length)]);
    el.classList.remove('enter'); el.classList.add('leave'); SFX.leave(); buzz([60, 40, 60]);
    setTimeout(function () { if (!S.cust[c.slot]) { el.className = 'cust empty'; el.innerHTML = '🪑'; } }, 520);
    if (S.sel === c.slot) autoSelect();
    renderHud();
  }

  /* ---------- بناء الطلب ---------- */
  function renderBuild() {
    var c = S && S.sel >= 0 ? S.cust[S.sel] : null, h = '';
    if (!c) { $('slots').innerHTML = '<span style="color:var(--mut)">بانتظار الزبون…</span>'; $('b-serve').classList.remove('ready'); return; }
    for (var i = 0; i < c.order.length; i++) {
      h += i < S.built.length ? '<div class="slot f">' + theme.ings[S.built[i]].e + '</div>' : '<div class="slot">' + (i + 1) + '</div>';
    }
    $('slots').innerHTML = h;
    $('b-serve').classList.toggle('ready', S.built.length === c.order.length);
    for (var j = 0; j < 3; j++) {
      var o = S.cust[j]; if (!o) continue;
      for (var k = 0; k < o.tk.length; k++) o.tk[k].classList.toggle('done', o === c && k < S.built.length);
    }
  }
  function toast(t) {
    var el = $('toast'); el.textContent = t; el.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 1200);
  }
  function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
  function tapIng(i) {
    if (mode !== 'play') return;
    var c = S.sel >= 0 ? S.cust[S.sel] : null;
    if (!c) { toast('ما فيه زبون للحين'); return; }
    if (S.built.length >= c.order.length) { toast('الطلب كامل — اضغط قدّم'); SFX.bad(); return; }
    if (c.order[S.built.length] !== i) {
      S.built = []; S.combo = 0; renderHud();
      SFX.bad(); buzz([80, 30, 80]); shake($('slots')); toast('غلط! عيدها من الأول');
      $('slots').parentNode.classList.add('bad'); setTimeout(function () { $('slots').parentNode.classList.remove('bad'); }, 350);
      renderBuild(); return;
    }
    S.built.push(i); SFX.tap(S.built.length); buzz(12); renderBuild();
  }
  function floatText(txt, el) {
    var r = el.getBoundingClientRect(), fr = $('fx').getBoundingClientRect();
    var f = document.createElement('div'); f.className = 'float'; f.textContent = txt;
    f.style.left = (r.left - fr.left + r.width / 2 - 30) + 'px'; f.style.top = (r.top - fr.top) + 'px';
    $('fx').appendChild(f); setTimeout(function () { f.remove(); }, 1000);
  }
  function serve() {
    if (mode !== 'play') return;
    var c = S.sel >= 0 ? S.cust[S.sel] : null;
    if (!c) return;
    if (S.built.length !== c.order.length) { shake($('b-serve')); SFX.bad(); toast('كمّل الطلب أول'); return; }
    var ratio = Math.max(0, c.pat / c.max);
    var base = c.order.length * 10, tip = Math.round(ratio * 15), cb = Math.min(S.combo, 5) * 3;
    S.combo++; S.served++; S.tips += tip; S.score += base + tip + cb;
    floatText('+' + (base + tip + cb) + (tip ? ' 💰' : ''), c.el);
    c.fe.textContent = '🤩'; c.el.classList.remove('enter'); c.el.classList.add('served');
    S.cust[c.slot] = null; var el = c.el;
    setTimeout(function () { if (!S.cust[c.slot]) { el.className = 'cust empty'; el.innerHTML = '🪑'; } }, 520);
    SFX.serve(); buzz([20, 30, 40]);
    S.built = []; S.sel = -1; autoSelect(); renderHud();
  }

  function renderHud() {
    $('h-score').textContent = S.score; $('h-combo').textContent = 'x' + S.combo; $('h-tips').textContent = S.tips;
  }

  /* ---------- الحلقة ---------- */
  function update(dt) {
    S.time -= dt; S.elapsed += dt;
    S.spawnIn -= dt;
    if (S.spawnIn <= 0 && S.time > 4) {
      if (spawn()) S.spawnIn = Math.max(2.4, 5.2 - S.elapsed / 28) + Math.random() * 1.5; else S.spawnIn = 0.8;
    }
    for (var i = 0; i < 3; i++) {
      var c = S.cust[i]; if (!c) continue;
      c.pat -= dt;
      var r = c.pat / c.max;
      setMood(c, r > 0.55 ? 'happy' : r > 0.28 ? 'meh' : 'angry');
      if (c.pat <= 0) leave(c);
    }
    if (S.time <= 0) endGame();
  }
  function render() {
    var f = Math.max(0, S.time / ROUND);
    $('timefill').style.transform = 'scaleX(' + f + ')';
    $('timetxt').textContent = Math.ceil(Math.max(0, S.time));
    $('timefill').parentNode.classList.toggle('low', S.time < 10);
    for (var i = 0; i < 3; i++) { var c = S.cust[i]; if (c && c.bar) c.bar.style.transform = 'scaleX(' + Math.max(0, c.pat / c.max) + ')'; }
  }
  function frame(now) {
    if (mode !== 'play') return;
    var dt = Math.min(0.25, (now - last) / 1000); last = now; acc += dt;
    while (acc >= STEP && mode === 'play') { update(STEP); acc -= STEP; }
    if (mode === 'play') { render(); rafId = requestAnimationFrame(frame); }
  }

  function pause() {
    if (mode !== 'play') return;
    mode = 'pause'; $('s-pause').classList.add('active');
  }
  function resume() {
    if (mode !== 'pause') return;
    $('s-pause').classList.remove('active'); mode = 'play'; last = performance.now(); rafId = requestAnimationFrame(frame);
  }
  function endGame() {
    mode = 'end'; cancelAnimationFrame(rafId);
    var isNew = S.score > best;
    if (isNew) { best = S.score; try { localStorage.setItem(KEY_BEST, String(best)); } catch (e) {} }
    $('e-score').textContent = S.score; $('e-best').textContent = best; $('e-served').textContent = S.served;
    $('e-tips').textContent = S.tips; $('e-lost').textContent = S.lost; $('e-new').hidden = !isNew;
    $('e-title').textContent = S.score >= 250 ? 'شغل معلّم! 🔥' : S.score >= 120 ? 'حلو الشغل 👏' : 'خلص الوقت!';
    $('best-start').textContent = best;
    $('s-end').classList.add('active'); SFX.end(); buzz([50, 50, 120]);
  }
  function toMenu() {
    mode = 'menu'; cancelAnimationFrame(rafId);
    $('s-pause').classList.remove('active'); $('s-end').classList.remove('active');
    $('s-game').classList.remove('active'); $('s-start').classList.add('active');
    $('best-start').textContent = best;
  }

  /* ---------- ربط الأحداث ---------- */
  buildThemes(); refreshMute();
  $('ings').addEventListener('pointerdown', function (e) {
    var b = e.target.closest('.ing'); if (!b) return;
    ensureAudio(); e.preventDefault(); tapIng(+b.dataset.i);
  });
  $('custs').addEventListener('pointerdown', function (e) {
    var c = e.target.closest('.cust'); if (!c || mode !== 'play') return;
    ensureAudio(); var i = +c.dataset.s; if (S.cust[i]) { select(i); SFX.tap(0); }
  });
  $('b-serve').addEventListener('click', function () { ensureAudio(); serve(); });
  $('b-clear').addEventListener('click', function () { if (mode === 'play') { S.built = []; renderBuild(); } });
  $('b-pause').addEventListener('click', pause);
  $('b-resume').addEventListener('click', resume);
  $('b-quit').addEventListener('click', toMenu);
  $('b-again').addEventListener('click', function () { ensureAudio(); startGame(Object.keys(THEMES).filter(function (k) { return THEMES[k] === theme; })[0]); });
  $('b-menu').addEventListener('click', toMenu);
  $('b-mute').addEventListener('click', function () {
    ensureAudio(); muted = !muted; try { localStorage.setItem(KEY_MUTE, muted ? '1' : '0'); } catch (e) {}
    refreshMute(); if (!muted) SFX.tap(2);
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); });
  document.addEventListener('keydown', function (e) {
    if (mode !== 'play') return;
    if (e.key >= '1' && e.key <= '6') tapIng(+e.key - 1);
    else if (e.key === 'Enter') serve();
    else if (e.key === 'Backspace') { S.built = []; renderBuild(); }
    else if (e.key === 'Escape' || e.key === 'p') pause();
  });
  window.__orderRush = { get state() { return S; }, start: startGame };
})();
