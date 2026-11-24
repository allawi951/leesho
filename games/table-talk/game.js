(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var CATS = window.TT_CATS || [];
  var KEY_MUTE = 'leesho-table-talk-mute';
  var MAX_PLAYERS = 10;

  /* ---------- صوت + اهتزاز ---------- */
  var actx = null, muted = false;
  try { muted = localStorage.getItem(KEY_MUTE) === '1'; } catch (e) {}
  function ensureAudio() {
    if (!actx) { try { var AC = window.AudioContext || window.webkitAudioContext; if (AC) actx = new AC(); } catch (e) {} }
    if (actx && actx.state === 'suspended') actx.resume();
  }
  function tone(f, d, type, vol, delay, f2) {
    if (muted || !actx) return;
    try {
      var t = actx.currentTime + (delay || 0), o = actx.createOscillator(), g = actx.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
      g.gain.setValueAtTime(vol || 0.1, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + d + 0.02);
    } catch (e) {}
  }
  var SFX = {
    flip: function () { tone(300, 0.25, 'triangle', 0.1, 0, 900); tone(1200, 0.1, 'sine', 0.05, 0.22); },
    back: function () { tone(800, 0.2, 'triangle', 0.08, 0, 300); },
    pass: function () { tone(523, 0.1, 'square', 0.06); tone(784, 0.14, 'square', 0.06, 0.1); },
    tap: function () { tone(500, 0.06, 'triangle', 0.08); }
  };
  function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
  function refreshMute() { $('b-mute').textContent = muted ? '🔇' : '🔊'; }

  /* ---------- حالة ---------- */
  var players = [], active = {}, pile = [], total = 0, drawn = 0, rounds = 1, turn = 0, phase = 'idle', busy = false, cur = null, bannerT = 0;
  CATS.forEach(function (c) { active[c.id] = true; });
  var inGame = false;

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function screen(id) {
    ['s-setup', 's-play', 's-menu'].forEach(function (s) { $(s).classList.remove('active'); });
    $(id).classList.add('active');
    if (id === 's-menu') $('s-play').classList.add('active');
  }

  /* ---------- الإعداد ---------- */
  function renderCats() {
    var h = '';
    CATS.forEach(function (c) {
      h += '<button class="catb' + (active[c.id] ? ' on' : '') + '" data-c="' + c.id + '" style="--cc:' + c.color + '"><span>' + c.icon + '</span>' + c.name + '</button>';
    });
    $('cats').innerHTML = h;
  }
  function renderNames() {
    var h = '';
    players.forEach(function (n, i) { h += '<span class="chip">' + esc(n) + '<button data-i="' + i + '" aria-label="حذف">✕</button></span>'; });
    $('names').innerHTML = h;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function addName() {
    var v = $('nameinp').value.trim();
    if (v && players.length < MAX_PLAYERS && players.indexOf(v) < 0) { players.push(v); renderNames(); SFX.tap(); }
    $('nameinp').value = '';
  }
  function selectedCount() { return CATS.filter(function (c) { return active[c.id]; }).length; }

  function buildPile() {
    var a = [];
    CATS.forEach(function (c) { if (active[c.id]) c.cards.forEach(function (t) { a.push({ cat: c, t: t }); }); });
    return shuffle(a);
  }
  function startGame() {
    if (!selectedCount()) { CATS.forEach(function (c) { active[c.id] = true; }); renderCats(); }
    addName();
    pile = buildPile(); total = pile.length; drawn = 0; rounds = 1; turn = 0; phase = 'down'; busy = false; cur = null; inGame = true;
    $('card').classList.remove('flip');
    renderTurn(false); renderLeft(); setMain();
    screen('s-play'); $('card').classList.add('drop');
    setTimeout(function () { $('card').classList.remove('drop'); }, 520);
  }

  /* ---------- اللعب ---------- */
  function who() { return players.length ? players[turn % players.length] : null; }
  function renderTurn(bump) {
    var w = who();
    $('turn').textContent = w ? '🎤 دور: ' + w : '🎤 مرّروا الجوال على الطاولة';
    if (bump) { $('turn').classList.remove('bump'); void $('turn').offsetWidth; $('turn').classList.add('bump'); }
  }
  function renderLeft() { $('left').textContent = 'تبقى ' + pile.length + ' من ' + total + ' بطاقة' + (rounds > 1 ? ' (الدورة ' + rounds + ')' : ''); }
  function setMain() {
    var up = phase === 'up';
    $('b-main').textContent = up ? 'تمام — مرّر الجوال ➡️' : 'اسحب بطاقة 🎴';
    $('b-skip').disabled = !up;
    $('hint').textContent = up ? 'ما ناسبتك؟ اضغط «تخطي» وخذ بطاقة ثانية' : 'اضغط على البطاقة أو اسحبها';
  }
  function banner(t, ms) {
    var b = $('banner'); b.textContent = t; b.classList.add('on');
    clearTimeout(bannerT); bannerT = setTimeout(function () { b.classList.remove('on'); }, ms || 1300);
  }
  function setCard(item) {
    cur = item;
    var f = $('front'); f.style.setProperty('--cc', item.cat.color);
    $('c-cat').textContent = item.cat.icon + ' ' + item.cat.name;
    $('c-txt').textContent = item.t; $('c-ico').textContent = item.cat.icon;
  }
  function draw() {
    if (!pile.length) { pile = buildPile(); rounds++; banner('خلصت كل البطاقات! نبدأ دورة جديدة 🔄', 1800); }
    setCard(pile.pop()); drawn++;
    renderLeft();
    $('card').classList.add('flip'); phase = 'up'; setMain(); SFX.flip(); buzz(15);
  }
  function primary() {
    if (busy || !inGame) return;
    ensureAudio();
    if (phase === 'down') { busy = true; draw(); setTimeout(function () { busy = false; }, 500); }
    else if (phase === 'up') { next(); }
  }
  function next() {
    busy = true; $('card').classList.remove('flip'); phase = 'down'; SFX.back();
    turn++; setMain(); renderTurn(true);
    var w = who(); banner(w ? 'مرّر الجوال لـ ' + w + ' 📱' : 'مرّر الجوال للي بجنبك 📱', 1200); SFX.pass(); buzz([20, 30, 20]);
    setTimeout(function () { busy = false; }, 650);
  }
  function skip() {
    if (busy || phase !== 'up') return;
    ensureAudio(); busy = true; $('card').classList.remove('flip'); SFX.back();
    setTimeout(function () { draw(); setTimeout(function () { busy = false; }, 450); }, 450);
  }
  function openMenu(final) {
    $('m-stats').textContent = 'سحبتوا ' + drawn + ' بطاقة' + (rounds > 1 ? ' في ' + rounds + ' دورات' : '') + ' — الله يعطيكم العافية على السوالف!';
    screen('s-menu');
  }

  /* ---------- أحداث ---------- */
  renderCats(); renderNames(); refreshMute();
  $('cats').addEventListener('click', function (e) {
    var b = e.target.closest('.catb'); if (!b) return;
    var id = b.dataset.c;
    if (active[id] && selectedCount() === 1) return;
    active[id] = !active[id]; renderCats(); ensureAudio(); SFX.tap();
  });
  $('nameform').addEventListener('submit', function (e) { e.preventDefault(); ensureAudio(); addName(); });
  $('names').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    players.splice(+b.dataset.i, 1); renderNames();
  });
  $('b-start').addEventListener('click', function () { ensureAudio(); SFX.pass(); startGame(); });
  $('b-main').addEventListener('click', primary);
  $('b-skip').addEventListener('click', skip);
  $('b-menu').addEventListener('click', function () { ensureAudio(); openMenu(); });
  $('b-resume').addEventListener('click', function () { screen('s-play'); });
  $('b-restart').addEventListener('click', function () { startGame(); });
  $('b-setup').addEventListener('click', function () { inGame = false; screen('s-setup'); renderNames(); });
  $('b-mute').addEventListener('click', function () {
    ensureAudio(); muted = !muted; try { localStorage.setItem(KEY_MUTE, muted ? '1' : '0'); } catch (e) {}
    refreshMute(); if (!muted) SFX.tap();
  });

  // لمس/سحب على البطاقة
  var sx = 0, sy = 0, down = false;
  var stage = $('stage');
  stage.addEventListener('pointerdown', function (e) { if (!e.target.closest('#card')) return; down = true; sx = e.clientX; sy = e.clientY; });
  stage.addEventListener('pointerup', function (e) {
    if (!down) return; down = false;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) { primary(); return; }
    if (Math.abs(dx) > 50 || dy < -50) primary();
  });
  stage.addEventListener('pointercancel', function () { down = false; });
  document.addEventListener('keydown', function (e) {
    if (!$('s-play').classList.contains('active') || $('s-menu').classList.contains('active') || /BUTTON|INPUT/.test(e.target.tagName)) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); primary(); }
    else if (e.key === 's' || e.key === 'ArrowLeft') skip();
  });
  window.__tableTalk = { get pile() { return pile; }, get cats() { return CATS; } };
})();
