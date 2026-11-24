// مدونة علي وليشو — نسخ البرومتات (كل المقالات) + البحث والتصنيفات (صفحة المدونة)
(function () {
  function copyText(txt) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(txt);
    return new Promise(function (ok, fail) {
      var ta = document.createElement('textarea');
      ta.value = txt; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? ok() : fail(); } catch (e) { fail(e); }
      ta.remove();
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button.copy');
    if (!b) return;
    var pre = document.getElementById(b.getAttribute('data-copy'));
    if (!pre) return;
    var label = b.getAttribute('data-label') || b.textContent;
    b.setAttribute('data-label', label);
    copyText(pre.textContent).then(function () {
      b.textContent = 'تم النسخ ✓'; b.classList.add('done');
    }, function () {
      var r = document.createRange(); r.selectNodeContents(pre);
      var s = getSelection(); s.removeAllRanges(); s.addRange(r);
      b.textContent = 'تحدد — انسخه';
    }).then(function () {
      setTimeout(function () { b.textContent = label; b.classList.remove('done'); }, 1600);
    });
  });

  // صفحة القائمة فقط
  var list = document.getElementById('posts');
  if (!list) return;
  var cards = [].slice.call(list.querySelectorAll('.post-card'));
  var input = document.getElementById('q');
  var chips = [].slice.call(document.querySelectorAll('.chip'));
  var count = document.getElementById('count');
  var empty = document.getElementById('empty');
  // نفس تطبيع بحث الصفحة الرئيسية: يتسامح مع الهمزات والتاء المربوطة والتشكيل وگ/ق
  function norm(t) {
    return String(t || '').toLowerCase().replace(/[ً-ْٰـ]/g, '').replace(/[أإآٱ]/g, 'ا')
      .replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/گ/g, 'ق')
      .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }
  var hay = cards.map(function (c) { return norm(c.textContent + ' ' + (c.getAttribute('data-keywords') || '')); });
  var tag = '';
  function run() {
    var words = norm(input.value).split(' ').filter(Boolean);
    var shown = 0;
    cards.forEach(function (c, i) {
      var tags = (c.getAttribute('data-tags') || '').split('|');
      var ok = (!tag || tags.indexOf(tag) > -1) && words.every(function (w) { return hay[i].indexOf(w) > -1; });
      c.hidden = !ok; if (ok) shown++;
      c.classList.toggle('featured', !words.length && !tag && i === 0);
    });
    chips.forEach(function (ch) { ch.setAttribute('aria-pressed', String((ch.getAttribute('data-tag') || '') === tag)); });
    empty.hidden = shown > 0;
    count.textContent = (words.length || tag) ? (shown ? (shown === 1 ? 'لقينا مقال واحد 👇' : 'لقينا ' + shown + ' مقالات 👇') : '') : '';
    try {
      var u = new URL(location.href);
      words.length ? u.searchParams.set('q', input.value.trim()) : u.searchParams.delete('q');
      tag ? u.searchParams.set('tag', tag) : u.searchParams.delete('tag');
      history.replaceState(null, '', u.pathname + u.search + u.hash);
    } catch (e) { /* file:// أو متصفح قديم */ }
  }
  input.addEventListener('input', run);
  chips.forEach(function (ch) {
    ch.addEventListener('click', function () { tag = ch.getAttribute('data-tag') || ''; run(); });
  });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a.tag[data-tag]');
    if (!a || !list.contains(a)) return;
    e.preventDefault(); tag = a.getAttribute('data-tag'); run();
    document.getElementById('filters').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  var p = new URLSearchParams(location.search);
  if (p.get('q')) input.value = p.get('q');
  if (p.get('tag') && chips.some(function (ch) { return ch.getAttribute('data-tag') === p.get('tag'); })) tag = p.get('tag');
  if (p.get('q') || p.get('tag')) run();
})();
