(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var THEMES = window.FW_THEMES || [];
  var KEY_MUTE = 'leesho-forbidden-word-mute';
  var SKIPS = 3, COLORS = ['#ff7a1a', '#4db8ff'];
  var RING = 106.8;

  /* ---------- صوت + اهتزاز ---------- */
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
      g.gain.setValueAtTime(vol || 0.1, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + d + 0.02);
    } catch (e) {}
  }
  var SFX = {
    ok: function () { tone(660, 0.1, 'square', 0.07); tone(990, 0.16, 'square', 0.07, 0.08); },
    bad: function () { tone(180, 0.3, 'sawtooth', 0.12); },
    skip: function () { tone(400, 0.08, 'triangle', 0.09); },
    tick: function () { tone(1000, 0.05, 'square', 0.05); },
    go: function () { tone(880, 0.25, 'triangle', 0.12); },
    cd: function () { tone(520, 0.15, 'triangle', 0.1); },
    end: function () { [784, 659, 523].forEach(function (f, i) { tone(f, 0.22, 'triangle', 0.12, i * 0.14); }); },
    win: function () { [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, 0.22, 'triangle', 0.12, i * 0.11); }); }
  };
  function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
  function refreshMute() { $('b-mute').textContent = muted ? '🔇' : '🔊'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- إعدادات ---------- */
  var opt = { time: 60, rounds: 3, themes: {} };
  THEMES.forEach(function (t) { opt.themes[t.id] = true; });
  function seg(id, vals, key, fmt) {
    var h = '';
    vals.forEach(function (v) { h += '<button class="sg' + (opt[key] === v ? ' on' : '') + '" data-v="' + v + '">' + fmt(v) + '</button>'; });
    $(id).innerHTML = h;
  }
  function renderOpts() {
    seg('o-time', [45, 60, 90], 'time', function (v) { return v + ' ثانية'; });
    seg('o-rounds', [2, 3, 4], 'rounds', function (v) { return v + ' أدوار'; });
    var h = '';
    THEMES.forEach(function (t) { h += '<button class="sg' + (opt.themes[t.id] ? ' on' : '') + '" data-t="' + t.id + '">' + t.icon + ' ' + t.name + '</button>'; });
    $('o-themes').innerHTML = h;
  }
  function themeCount() { return THEMES.filter(function (t) { return opt.themes[t.id]; }).length; }

  /* ---------- حالة ---------- */
  var teams = [], turn = 0, totalTurns = 0, deck = [], cur = null, results = [], skips = 0, tleft = 0, tscore = 0;
  var mode = 'setup', rafId = 0, last = 0, lastSec = 0, cdT = 0;

  function show(id) {
    ['s-setup', 's-hand', 's-play', 's-sum', 's-pause', 's-win'].forEach(function (s) { $(s).classList.remove('active'); });
    $(id).classList.add('active');
    if (id === 's-pause') $('s-play').classList.add('active');
    if (id === 's-win') $('s-sum').classList.add('active');
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function buildDeck() {
    var a = [];
    THEMES.forEach(function (t) { if (opt.themes[t.id]) t.cards.forEach(function (c) { a.push({ w: c[0], f: c[1], t: t }); }); });
    return shuffle(a);
  }
  function drawCard() {
    if (!deck.length) deck = buildDeck();
    cur = deck.pop();
    $('c-theme').textContent = cur.t.icon + ' ' + cur.t.name;
    $('c-word').textContent = cur.w;
    var h = ''; cur.f.forEach(function (x) { h += '<li>' + esc(x) + '</li>'; });
    $('c-forb').innerHTML = h;
    var c = $('card'); c.classList.remove('in', 'ok', 'no'); void c.offsetWidth; c.classList.add('in');
  }
  function board(id, winner) {
    $(id).innerHTML = teams.map(function (t, i) {
      return '<div class="sb' + (winner === i ? ' win' : '') + '" style="--c:' + COLORS[i] + '"><span>' + esc(t.name) + '</span><b>' + t.score + '</b></div>';
    }).join('');
  }

  function startMatch() {
    ensureAudio();
    if (!themeCount()) { THEMES.forEach(function (t) { opt.themes[t.id] = true; }); }
    var n1 = $('t1').value.trim() || 'الفريق ١', n2 = $('t2').value.trim() || 'الفريق ٢';
    if (n1 === n2) n2 += ' ٢';
    teams = [{ name: n1, score: 0 }, { name: n2, score: 0 }];
    turn = 0; totalTurns = opt.rounds * 2; deck = buildDeck();
    showHand();
  }
  function showHand() {
    mode = 'hand';
    var ti = turn % 2;
    $('h-round').textContent = 'الجولة ' + (Math.floor(turn / 2) + 1) + ' من ' + opt.rounds;
    $('h-team').textContent = teams[ti].name;
    $('s-hand').style.setProperty('--tc', COLORS[ti]);
    board('h-board'); show('s-hand');
  }
  function countdown() {
    ensureAudio(); mode = 'count';
    var n = 3, el = $('count');
    $('s-play').style.setProperty('--tc', COLORS[turn % 2]);
    $('p-team').textContent = teams[turn % 2].name;
    $('card').style.borderTopColor = COLORS[turn % 2];
    $('c-word').textContent = '…'; $('c-forb').innerHTML = ''; $('c-theme').textContent = '';
    show('s-play'); el.classList.add('on');
    (function step() {
      if (n === 0) { el.classList.remove('on'); beginTurn(); return; }
      el.innerHTML = '<span>' + n + '</span>'; SFX.cd(); buzz(20); n--; cdT = setTimeout(step, 750);
    })();
  }
  function beginTurn() {
    mode = 'play'; results = []; skips = SKIPS; tleft = opt.time; tscore = 0; lastSec = -1;
    SFX.go(); drawCard(); renderPlay();
    last = performance.now(); cancelAnimationFrame(rafId); rafId = requestAnimationFrame(frame);
  }
  function renderPlay() {
    $('p-score').textContent = tscore; $('skipn').textContent = skips;
    $('b-skip').disabled = skips <= 0;
    var s = Math.ceil(Math.max(0, tleft));
    $('p-sec').textContent = s;
    $('p-ring').style.strokeDashoffset = String(RING * (1 - Math.max(0, tleft) / opt.time));
    $('p-timer').classList.toggle('low', tleft <= 10);
  }
  function frame(now) {
    if (mode !== 'play') return;
    var dt = Math.min(0.25, (now - last) / 1000); last = now;
    tleft -= dt;
    var s = Math.ceil(Math.max(0, tleft));
    if (s !== lastSec) { lastSec = s; if (s <= 5 && s > 0) { SFX.tick(); buzz(10); } }
    renderPlay();
    if (tleft <= 0) { endTurn(); return; }
    rafId = requestAnimationFrame(frame);
  }
  function mark(kind) {
    if (mode !== 'play' || !cur) return;
    ensureAudio();
    var c = $('card');
    if (kind === 3) { if (skips <= 0) return; skips--; SFX.skip(); buzz(10); }
    else if (kind === 1) { tscore++; SFX.ok(); buzz(20); c.classList.remove('in'); c.classList.add('ok'); }
    else { tscore--; SFX.bad(); buzz([60, 30, 60]); c.classList.remove('in'); c.classList.add('no'); }
    results.push({ w: cur.w, r: kind });
    renderPlay();
    var delay = kind === 1 ? 220 : kind === 2 ? 260 : 0;
    cur = null;
    setTimeout(function () { if (mode === 'play') drawCard(); }, delay);
  }
  function endTurn() {
    mode = 'sum'; cancelAnimationFrame(rafId);
    var ti = turn % 2; teams[ti].score += tscore;
    SFX.end(); buzz([100, 50, 100]);
    $('u-score').textContent = (tscore > 0 ? '+' : '') + tscore; $('u-team').textContent = teams[ti].name;
    var lab = { 1: '✅', 2: '🚫', 3: '⏭' }, h = '';
    results.forEach(function (r) { h += '<li class="r' + r.r + '"><span>' + esc(r.w) + '</span><span>' + lab[r.r] + '</span></li>'; });
    $('u-list').innerHTML = h || '<li class="r3"><span>ما لعبتوا ولا بطاقة!</span><span>😅</span></li>';
    board('u-board');
    $('b-next').textContent = turn + 1 >= totalTurns ? 'شوف النتيجة 🏆' : 'التالي';
    show('s-sum');
  }
  function next() {
    turn++;
    if (turn >= totalTurns) return win();
    showHand();
  }
  function win() {
    mode = 'win';
    var a = teams[0].score, b = teams[1].score, w = a === b ? -1 : a > b ? 0 : 1;
    $('w-title').textContent = w < 0 ? 'تعادل! 🤝 الله يعطيكم العافية' : teams[w].name + ' فازوا! 🎉';
    board('w-board', w); show('s-win'); SFX.win(); buzz([60, 40, 60, 40, 150]);
    var cf = $('confetti'), h = '', em = ['🎉', '🍔', '⭐', '🍕', '🎊', '☕', '🌯'];
    for (var i = 0; i < 28; i++) h += '<i style="left:' + Math.round(Math.random() * 96) + '%;animation-duration:' + (2 + Math.random() * 2.5).toFixed(1) + 's;animation-delay:' + (Math.random() * 1.2).toFixed(1) + 's">' + em[i % em.length] + '</i>';
    cf.innerHTML = h;
  }
  function pause() { if (mode !== 'play') return; mode = 'pause'; cancelAnimationFrame(rafId); show('s-pause'); }
  function resume() { if (mode !== 'pause') return; mode = 'play'; show('s-play'); last = performance.now(); rafId = requestAnimationFrame(frame); }
  function toSetup() { mode = 'setup'; cancelAnimationFrame(rafId); clearTimeout(cdT); $('count').classList.remove('on'); show('s-setup'); renderOpts(); }

  /* ---------- أحداث ---------- */
  renderOpts(); refreshMute();
  $('o-time').addEventListener('click', function (e) { var b = e.target.closest('.sg'); if (!b) return; opt.time = +b.dataset.v; renderOpts(); ensureAudio(); SFX.skip(); });
  $('o-rounds').addEventListener('click', function (e) { var b = e.target.closest('.sg'); if (!b) return; opt.rounds = +b.dataset.v; renderOpts(); ensureAudio(); SFX.skip(); });
  $('o-themes').addEventListener('click', function (e) {
    var b = e.target.closest('.sg'); if (!b) return;
    var id = b.dataset.t; if (opt.themes[id] && themeCount() === 1) return;
    opt.themes[id] = !opt.themes[id]; renderOpts(); ensureAudio(); SFX.skip();
  });
  $('b-start').addEventListener('click', startMatch);
  $('b-ready').addEventListener('click', countdown);
  $('b-ok').addEventListener('click', function () { mark(1); });
  $('b-bad').addEventListener('click', function () { mark(2); });
  $('b-skip').addEventListener('click', function () { mark(3); });
  $('b-pause').addEventListener('click', pause);
  $('b-resume').addEventListener('click', resume);
  $('b-quit').addEventListener('click', toSetup);
  $('b-next').addEventListener('click', next);
  $('b-again').addEventListener('click', startMatch);
  $('b-home').addEventListener('click', toSetup);
  $('b-mute').addEventListener('click', function () {
    ensureAudio(); muted = !muted; try { localStorage.setItem(KEY_MUTE, muted ? '1' : '0'); } catch (e) {}
    refreshMute(); if (!muted) SFX.skip();
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); });
  document.addEventListener('keydown', function (e) {
    if (mode !== 'play' || e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight' || e.key === 'Enter') mark(1);
    else if (e.key === 'ArrowLeft' || e.key === 'Backspace') mark(2);
    else if (e.key === 's' || e.key === ' ') { e.preventDefault(); mark(3); }
  });
  window.__fw = { get deck() { return deck; }, themes: THEMES };
})();
