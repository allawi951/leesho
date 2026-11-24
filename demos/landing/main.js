// بُن ليشو — حركات الظهور، الزر الثابت، ونافذة «هذا نموذج» (ما تجمع أي بيانات)
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ظهور الأقسام مع التمرير
  var items = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !reduce) {
    doc.classList.add('js');
    // تأخير متدرّج للعناصر المتجاورة
    items.forEach(function (el) {
      var sib = el.parentElement ? [].slice.call(el.parentElement.children).filter(function (c) { return c.classList.contains('reveal'); }) : [];
      var i = sib.indexOf(el);
      if (i > 0) el.style.setProperty('--d', Math.min(i, 5) * 0.09 + 's');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  // حدود الشريط العلوي عند التمرير + إظهار الزر الثابت بعد الهيرو وإخفاؤه عند الدعوة الأخيرة
  var nav = document.querySelector('.nav');
  var sticky = document.getElementById('stickyCta');
  var hero = document.querySelector('.hero');
  var final = document.querySelector('.final');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var y = window.scrollY;
    nav.classList.toggle('scrolled', y > 10);
    var pastHero = hero.getBoundingClientRect().bottom < 0;
    var atFinal = final.getBoundingClientRect().top < window.innerHeight * 0.85;
    sticky.classList.toggle('show', pastHero && !atFinal);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // ارتفاع شريط «نموذج من علي وليشو» — عشان الزر الثابت يبقى فوقه، وينزل لو المستخدم قفل الشريط
  function syncBar() {
    var bar = document.querySelector('.lw-bar');
    doc.style.setProperty('--bar', (bar ? bar.offsetHeight : 0) + 'px');
  }
  new MutationObserver(syncBar).observe(document.body, { childList: true });
  window.addEventListener('resize', syncBar);
  window.addEventListener('load', syncBar);

  // نافذة «هذا نموذج» — كل أزرار الاشتراك تفتحها، وما فيه أي نموذج أو إدخال بيانات
  var modal = document.getElementById('demoModal');
  var lastFocus = null;
  function open() {
    lastFocus = document.activeElement;
    if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
    var b = modal.querySelector('[data-close]'); if (b) b.focus();
  }
  function close() {
    if (typeof modal.close === 'function') modal.close(); else modal.removeAttribute('open');
  }
  modal.addEventListener('close', function () { if (lastFocus) lastFocus.focus(); });
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-demo]')) { e.preventDefault(); open(); return; }
    if (e.target.closest('[data-close]')) { close(); return; }
    if (e.target === modal) close(); // ضغطة على الخلفية
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.hasAttribute('open')) close(); });
})();
