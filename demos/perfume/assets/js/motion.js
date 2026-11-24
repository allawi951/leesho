/* ═══════════════════════════════════════════════════════════════
   عطورات ليشو — طبقة الحركة: سكرول ناعم، رسم الشعار، تثبيت، سكرول أفقي.
   كل حركة تُبنى بـ gsap.from() عشان الحالة النهائية = حالة CSS:
   لو تعطّل JS يبقى المحتوى ظاهرًا وسليمًا.
   ═══════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COARSE  = matchMedia('(hover: none), (pointer: coarse)').matches;

  gsap.registerPlugin(ScrollTrigger);

  /* ═══════════ ١) السكرول الناعم ═══════════ */
  let lenis = null;
  if (!REDUCED) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, touchMultiplier: 1.6 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // الروابط الداخلية تمر عبر Lenis وإلا قفزت فوق السكرول الناعم
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -70, duration: 1.4 });
    });
  }

  /* ═══════════ ٢) ماء البطل (canvas) ═══════════ */
  function water() {
    const c = $('#waterCanvas');
    if (!c || REDUCED) return;
    const ctx = c.getContext('2d');
    let w, h, raf, running = true;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = c.width = c.offsetWidth * dpr;
      h = c.height = c.offsetHeight * dpr;
      ctx.scale(1, 1);
    };
    resize();
    addEventListener('resize', resize, { passive: true });

    // نوقف الرسم حين يخرج البطل من الشاشة — لا نحرق إطارات بلا فائدة
    new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) draw();
    }).observe(c);

    const LINES = 26;
    let tick = 0;

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      tick += 0.006;

      for (let i = 0; i < LINES; i++) {
        const p = i / LINES;
        const y = h * (0.12 + p * 0.9);
        const amp = 5 + p * 26;
        const speed = 0.5 + p * 1.4;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= w; x += 14) {
          const yy = y
            + Math.sin(x * 0.0032 + tick * speed + i * 0.55) * amp
            + Math.sin(x * 0.0009 - tick * speed * 0.7) * amp * 0.5;
          ctx.lineTo(x, yy);
        }
        ctx.strokeStyle = `rgba(201,161,90,${0.03 + p * 0.09})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    addEventListener('pagehide', () => cancelAnimationFrame(raf));
  }

  /* ═══════════ ٣) الفصل ٠ — دخول البطل ═══════════ */
  function heroIntro() {
    // الشعار: ليشو مرسومًا بخطّ قلمٍ واحد السماكة. كل مساراته بلا تعبئة،
    // وتُرسم بحركة stroke-dashoffset بترتيب الرسم: الإطار، الرأس والأذنان،
    // الملامح، ثم القارورة وأثر الرائحة.
    const paths = $$('#heroMark .ln-draw');

    if (REDUCED) { gsap.set(paths, { opacity: 1, strokeDashoffset: 0 }); return; }

    paths.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.from('#heroEyebrow', { opacity: 0, y: 14, duration: 1 }, 0)
      // تدرّج يجعل القلم «يتنقّل» بين الأجزاء بترتيبها في الـ SVG
      .to(paths, {
        strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut',
        stagger: Math.min(0.07, 1.6 / paths.length),
      }, 0.25)
      .from('#heroWord span', { opacity: 0, y: 22, duration: .9, stagger: .07, ease: 'power3.out' }, '-=0.9')
      .from('#heroSub',  { opacity: 0, y: 16, duration: .9 }, '-=0.5')
      .from('#heroLine', { opacity: 0, y: 16, duration: .9 }, '-=0.7')
      .from('#heroCue',  { opacity: 0, duration: .9 }, '-=0.5');
  }

  /* ═══════════ ٤) الشريط + شريط التقدّم ═══════════ */
  function chrome() {
    ScrollTrigger.create({
      start: 'top -60',
      onUpdate: (self) => $('#nav').classList.toggle('is-stuck', self.scroll() > 60),
    });

    gsap.to('#progress', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    });
  }

  /* ═══════════ ٥) الفصل ١ — هرم الرائحة (مثبّت) ═══════════ */
  function notes() {
    const pin = $('#notesPin');
    const steps = $$('.notes__step');
    const imgs  = $$('.notes__img');
    const bar   = $('#notesBar');
    if (!pin) return;

    const setActive = (i) => {
      steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
      imgs.forEach((s, k) => s.classList.toggle('is-on', k === i));
    };
    setActive(0);

    if (REDUCED) { steps.forEach((s) => s.classList.add('is-on')); imgs[0].classList.add('is-on'); return; }

    // الجوال: لا تثبيت — الصورة لاصقة أعلى الشاشة وكل خطوة تفعّل نفسها عند مرورها.
    // التثبيت على شاشة قصيرة يقصّ المحتوى فلا تظهر الصورة إطلاقًا.
    if (innerWidth < 900) {
      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step, start: 'top 60%', end: 'bottom 40%',
          onEnter: () => setActive(i), onEnterBack: () => setActive(i),
        });
      });
      ScrollTrigger.create({
        trigger: '#notes', start: 'top top', end: 'bottom bottom',
        onUpdate: (self) => { bar.style.width = `${self.progress * 100}%`; },
      });
      return;
    }

    ScrollTrigger.create({
      trigger: '#notes',
      start: 'top top',
      end: '+=280%',
      pin: pin,
      pinSpacing: true,
      onUpdate: (self) => {
        const i = Math.min(2, Math.floor(self.progress * 3.0001));
        setActive(i);
        bar.style.width = `${self.progress * 100}%`;
      },
    });
  }

  /* ═══════════ ٦) الفصل ٢ — سكرول أفقي ═══════════ */
  function collection() {
    const pin = $('#collPin'), track = $('#collTrack');
    if (!pin || !track) return;

    if (REDUCED || innerWidth < 700) {
      // على الشاشات الصغيرة: تمرير أفقي يدوي بدل التثبيت (أخف وأصدق للمس)
      pin.style.height = 'auto';
      track.style.overflowX = 'auto';
      pin.style.overflowX = 'auto';
      return;
    }

    // نقيس الامتداد من التخطيط لا من scrollWidth: في RTL يفيض المحتوى يسارًا
    // فلا يرصده scrollWidth أصلًا. offsetWidth لا يتأثر بالتحويل الجاري.
    const span = () => {
      const cs = getComputedStyle(track);
      const gap = parseFloat(cs.columnGap || cs.gap) || 0;
      const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const cards = [...track.children];
      return cards.reduce((s, el) => s + el.offsetWidth, 0)
        + gap * Math.max(0, cards.length - 1) + pad;
    };
    const distance = () => Math.max(0, span() - innerWidth);
    const dir = () => (document.documentElement.dir === 'rtl' ? 1 : -1);

    gsap.to(track, {
      x: () => dir() * distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    // البطاقات تصعد قليلًا عند دخولها الإطار
    gsap.from('#collTrack .card', {
      y: 60, opacity: 0, duration: 1, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: pin, start: 'top 70%' },
    });
  }

  /* ═══════════ ٧) الفصل ٣ — الحكاية ═══════════ */
  function story() {
    if (REDUCED) return;

    $$('.story__row').forEach((row) => {
      const media = $('.story__media', row);
      const text  = $('.story__text', row);

      // قناع يكشف الصورة من الأعلى للأسفل
      gsap.fromTo(media, { clipPath: 'inset(0 0 100% 0)' }, {
        clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: row, start: 'top 78%' },
      });

      gsap.from(text.children, {
        y: 34, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: row, start: 'top 72%' },
      });
    });

    // بارالاكس لكل صورة معلّمة
    $$('[data-parallax]').forEach((img) => {
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    // صورة البطل تنزل ببطء مع السكرول
    gsap.to('#heroImg', {
      yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  /* ═══════════ ٨) تبديل جلد الأقسام مع السكرول ═══════════ */
  function skins() {
    const SKINS = [
      { sel: '#hero',       bg: '#0F1726', fg: '#F7F1E6' },
      { sel: '#notes',      bg: '#152036', fg: '#F7F1E6' },
      { sel: '#collection', bg: '#1E2A40', fg: '#F7F1E6' },
      { sel: '#story',      bg: '#EDE2CF', fg: '#18202E' },
      { sel: '#visit',      bg: '#0F1726', fg: '#F7F1E6' },
    ];

    SKINS.forEach((s) => {
      const el = $(s.sel);
      if (!el) return;
      const apply = () => {
        document.documentElement.style.setProperty('--bg', s.bg);
        document.documentElement.style.setProperty('--fg', s.fg);
        const dark = s.fg !== '#18202E';
        document.documentElement.style.setProperty('--muted', dark ? 'rgba(247,241,230,.6)' : 'rgba(24,32,46,.64)');
        document.documentElement.style.setProperty('--line',  dark ? 'rgba(247,241,230,.16)' : 'rgba(24,32,46,.16)');
        document.documentElement.style.setProperty('--accent', dark ? '#C9A15A' : '#9C6F2A');
      };
      ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 45%', onEnter: apply, onEnterBack: apply });
    });
  }

  /* ═══════════ ٩) الأزرار المغناطيسية ═══════════ */
  function pointer() {
    if (COARSE || REDUCED) return;

    /* المؤشّر المخصّص انتقل إلى assets/js/cursor.js — صار قارورة عطر
       ورذاذًا وصوتًا عند النقر. هنا يبقى الانجذاب المغناطيسي وحده. */

    // الانجذاب المغناطيسي
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * 0.28,
          y: (e.clientY - r.top - r.height / 2) * 0.4,
          duration: .5, ease: 'power3.out',
        });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' }));
    });
  }

  /* ═══════════ ١٠) ظهور عام للعناوين ═══════════ */
  function reveal() {
    if (REDUCED) return;
    $$('.coll__head > *, .visit__in > *').forEach((el, i) => {
      gsap.from(el, {
        y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: (i % 4) * 0.06,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });
  }

  /* ═══════════ الإقلاع ═══════════ */
  function boot() {
    water(); heroIntro(); chrome(); notes(); collection(); story(); skins(); pointer(); reveal();
    ScrollTrigger.refresh();
  }

  if (document.readyState === 'complete') boot();
  else addEventListener('load', boot);

  // تغيّر اللغة يعيد بناء البطاقات → القياسات تتغيّر، فنطلب إعادة حساب
  document.addEventListener('lp:lang', () => {
    // تبديل اللغة يقلب اتجاه التمرير الأفقي — نصفّر الإزاحة قبل إعادة الحساب
    // وإلا بقيت البطاقات على إزاحة الاتجاه القديم.
    const track = $('#collTrack');
    if (track) gsap.set(track, { x: 0 });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });

  addEventListener('resize', () => ScrollTrigger.refresh(), { passive: true });
})();
