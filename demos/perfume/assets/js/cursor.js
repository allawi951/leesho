/* ═══════════════════════════════════════════════════════════════════════════
   cursor — مؤشّر قارورة العطر ورشّته.

   هذا الموقع بلا خطوة بناء (لا webpack ولا وحدات ES)، فالملفّ مكتوبٌ
   دالّةً منفّذة ذاتيًّا تعمل بوسمٍ عاديّ ولا تستورد شيئًا.

   ولا GSAP هنا رغم توفّرها في الصفحة: الحركة استيفاءٌ خطّيّ وفيزياء جسيمات
   على canvas، وحلقة rAF واحدة تكفيها — فلا داعي لربطها بمكتبة.

   الصوت مُصنَّع بـ Web Audio لا ملفًّا: صفر بايت تُحمَّل، ولا طلب شبكة،
   ولا مسألة رخصة. ويُنشَأ سياق الصوت عند أول نقرة احترامًا لسياسة التشغيل
   التلقائي في المتصفّحات.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* كان يتوقف كليًّا مع «تقليل الحركة» في ويندوز أو مع الشاشات اللمسية، فما يطلع لا مؤشر ولا صوت.
     الحين: القارورة تطلع لأي فأرة (حتى في لابتوب لمسي)، واللمس يرش ويطلع الصوت بدون القارورة،
     و«تقليل الحركة» يخفّف الرذاذ بس. */
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var W = 42, H = 58, AX = 4, AY = 5;
  var SOUND_ON = true;                    // بدّلها إلى false لإسكات الرشّة

  var SVG = `
      <defs><linearGradient id="flaconGlass" x1="10" y1="16" x2="34" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#F8F0E9" stop-opacity=".20"/>
        <stop offset=".5" stop-color="#C9A15A" stop-opacity=".10"/>
        <stop offset="1" stop-color="#C9A15A" stop-opacity=".30"/></linearGradient></defs>
      <path d="M4.6 5h8.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
      <circle cx="4.5" cy="5" r="1.6" fill="currentColor"/>
      <path d="M14.5 1.6h11.2l1.5 2v3.2l-1.5 2H14.5l-1.4-2V3.6z" fill="currentColor" opacity=".9"/>
      <path d="M17.4 8.8h6.8v4.6h-6.8z" fill="currentColor" opacity=".5"/>
      <path d="M15.8 13.4h10v2.2h-10z" fill="currentColor" opacity=".75"/>
      <path d="M15.6 15.6h10.8l6.4 5.4 1.2 4.6v20.6l-1.2 4.6-3.6 5.2H13.4l-3.6-5.2-1.2-4.6V25.6l1.2-4.6z"
            fill="url(#flaconGlass)" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M9 34h24.8v11.8l-1.1 4.4-3.4 4.9H13.5l-3.4-4.9L9 45.8z" fill="currentColor" opacity=".3"/>
      <path d="M14 21.6v29M28.4 21.6v29" stroke="currentColor" stroke-width=".85" opacity=".45"/>
      <path d="M11.6 26.5v18" stroke="#F8F0E9" stroke-width="1.5" stroke-linecap="round" opacity=".45"/>`;

  var MAX_PARTICLES = 420;
  var GOLD = [201, 161, 90];
  var CREAM = [248, 240, 233];

  let actx = null;
  function playSpray() {
    if (!SOUND_ON) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      actx = actx || new AC();
      if (actx.state === 'suspended') actx.resume();

      const t0 = actx.currentTime;
      const dur = 0.42;
      const out = actx.createGain();
      out.gain.value = 0.9;
      out.connect(actx.destination);

      /* ضوضاء مشتركة بين الطبقتين — أرخص من توليد مخزنين */
      const noise = actx.createBuffer(1, Math.ceil(actx.sampleRate * dur), actx.sampleRate);
      const nd = noise.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

      /* ── ١) نقرة الصمّام: طقّة قصيرة جدًّا تسبق الهواء ──
         بدونها تبدأ الرشّة «ناعمة» فتُسمع كتنفّس لا كضغطٍ على مضخّة. */
      const click = actx.createBufferSource(); click.buffer = noise;
      const clickBand = actx.createBiquadFilter();
      clickBand.type = 'bandpass'; clickBand.frequency.value = 2400; clickBand.Q.value = 1.4;
      const clickGain = actx.createGain();
      clickGain.gain.setValueAtTime(0.0001, t0);
      clickGain.gain.exponentialRampToValueAtTime(0.16, t0 + 0.004);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.045);
      click.connect(clickBand); clickBand.connect(clickGain); clickGain.connect(out);

      /* ── ٢) اندفاع الهواء: النطاق يهبط ثم يتّسع فيتحوّل الصفير إلى رذاذ ──
         ‎Q‎ عالية أوّلًا (صفير مضغوط من فتحةٍ ضيّقة) ثم تنخفض (انتشار الرذاذ). */
      const air = actx.createBufferSource(); air.buffer = noise;
      const band = actx.createBiquadFilter();
      band.type = 'bandpass';
      band.frequency.setValueAtTime(7200, t0 + 0.005);
      band.frequency.exponentialRampToValueAtTime(2600, t0 + 0.09);
      band.frequency.exponentialRampToValueAtTime(900, t0 + dur);
      band.Q.setValueAtTime(2.6, t0 + 0.005);
      band.Q.exponentialRampToValueAtTime(0.5, t0 + 0.16);

      /* قاطعٌ عالٍ يزيل الطنين، وقاطعٌ منخفض يقصّ الحدّة المزعجة في الأذن */
      const hp = actx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 620;
      const lp = actx.createBiquadFilter(); lp.type = 'lowpass';
      lp.frequency.setValueAtTime(11000, t0);
      lp.frequency.exponentialRampToValueAtTime(3200, t0 + dur);     // «ترطيب» الذيل

      const airGain = actx.createGain();
      airGain.gain.setValueAtTime(0.0001, t0 + 0.004);
      airGain.gain.exponentialRampToValueAtTime(0.26, t0 + 0.03);    // ذروة بعد الطقّة
      airGain.gain.exponentialRampToValueAtTime(0.06, t0 + 0.17);    // هبوط سريع
      airGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);   // ذيلٌ يتلاشى

      air.connect(band); band.connect(hp); hp.connect(lp); lp.connect(airGain); airGain.connect(out);

      click.start(t0); click.stop(t0 + 0.06);
      air.start(t0 + 0.004); air.stop(t0 + dur);
    } catch { /* الصوت زينة: أي إخفاق يُتجاهَل بلا أثر على المؤشّر */ }
  }

  function init() {
    const root = document.documentElement;

    const shape = document.createElement('div');
    shape.className = 'cursor-flacon';
    shape.innerHTML = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" fill="none" aria-hidden="true">' + SVG + '</svg>';
    shape.style.setProperty('--anchor-x', (-AX) + 'px');
    shape.style.setProperty('--anchor-y', (-AY) + 'px');

    const canvas = document.createElement('canvas');
    canvas.className = 'cursor-fx';
    const ctx = canvas.getContext('2d');

    document.body.append(canvas, shape);   // has-flacon (إخفاء مؤشّر النظام) يُضاف أول ما تتحرك فأرة

    let dpr = 1;
    const resize = () => {
    
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener('resize', resize, { passive: true });

    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const at = { x: target.x, y: target.y };
    const vel = { x: 0, y: 0 };
    let tilt = 0, squeeze = 0, awake = false, overText = false;

    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      target.x = e.clientX; target.y = e.clientY;
      if (!root.classList.contains('has-flacon')) root.classList.add('has-flacon');
      if (!awake) { awake = true; at.x = target.x; at.y = target.y; shape.classList.add('is-on'); }
    }, { passive: true });
    addEventListener('mouseleave', () => shape.classList.remove('is-on'), { passive: true });
    addEventListener('mouseenter', () => awake && shape.classList.add('is-on'), { passive: true });

    const TEXTY = 'input:not([type=checkbox]):not([type=radio]):not([type=submit]),textarea,[contenteditable]';
    const HOT = 'a,button,[role=button],salla-add-product-button,.card,summary,label,select';

    addEventListener('mouseover', (e) => {
      const t = e.target;
      overText = !!(t.closest && t.closest(TEXTY));
      root.classList.toggle('flacon-off', overText);
      shape.classList.toggle('is-hot', !overText && !!(t.closest && t.closest(HOT)));
    }, { passive: true });

    /* ── الرذاذ ── */
    const mist = [];
    function burst(x, y) {
      const base = Math.atan2(-0.55 + vel.y * 0.05, -0.85 + vel.x * 0.05);
      for (let i = 0, n = REDUCED ? 18 : 46; i < n && mist.length < MAX_PARTICLES; i++) {
        const a = base + (Math.random() - 0.5) * 0.75;
        const sp = 1.4 + Math.random() * 5.4;
        mist.push({
          x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          r: 0.6 + Math.random() * 2.1, life: 0, max: 40 + Math.random() * 44,
          c: Math.random() < 0.72 ? GOLD : CREAM,
        });
      }
    }

    addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      if (e.pointerType === 'mouse' && overText) return;
      if (e.pointerType !== 'mouse' && e.target.closest && e.target.closest(TEXTY)) return;
      squeeze = 1;
      shape.classList.add('is-pressing');
      setTimeout(() => shape.classList.remove('is-pressing'), 260);
      burst(e.clientX, e.clientY);
      playSpray();
    }, { passive: true });

    let raf = 0;
    function frame() {
      const dx = target.x - at.x, dy = target.y - at.y;
      at.x += dx * 0.22; at.y += dy * 0.22;
      vel.x = dx; vel.y = dy;

      const want = Math.max(-16, Math.min(16, dx * 0.55));
      tilt += (want - tilt) * 0.12;
      squeeze += (0 - squeeze) * 0.14;

      shape.style.transform =
        `translate3d(${at.x}px, ${at.y}px, 0) rotate(${tilt.toFixed(2)}deg) scale(${(1 - squeeze * 0.12).toFixed(3)})`;

      {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        if (mist.length) {
          ctx.globalCompositeOperation = 'lighter';
          for (let i = mist.length - 1; i >= 0; i--) {
            const p = mist[i];
            if (++p.life >= p.max) { mist.splice(i, 1); continue; }
            p.vx *= 0.955; p.vy *= 0.955;
            p.vy += p.life < 14 ? -0.030 : 0.024;   // يرتفع لحظةً ثم يستقرّ
            p.vx += (Math.random() - 0.5) * 0.14;
            p.vy += (Math.random() - 0.5) * 0.14;
            p.x += p.vx; p.y += p.vy;

            const t = p.life / p.max;
            const alpha = (1 - t) * (1 - t) * 0.58;
            const rad = p.r * (1 + t * 2.2);
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
            g.addColorStop(0, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${alpha})`);
            g.addColorStop(1, `rgba(${p.c[0]},${p.c[1]},${p.c[2]},0)`);
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2); ctx.fill();
          }
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else if (!raf) raf = requestAnimationFrame(frame);
    });
  }

  init();
}());
