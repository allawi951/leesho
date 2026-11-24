// شريط «نموذج من علي وليشو» يظهر أسفل كل ديمو (لعبة، تطبيق، موقع نموذج).
// الاستخدام: <script src="../../assets/demo-bar.js" data-service="لعبة" data-back="../" data-what="لعبة مثلها لمطعمك" defer></script>
// data-service لازم يطابق اسم خدمة في app/src/site-requests.js (SITE_SERVICES.label) عشان ضياء تتعرف عليها.
(function () {
  var s = document.currentScript;
  var service = (s && s.dataset.service) || 'طلب خاص';
  var back = (s && s.dataset.back) || '../';
  var what = (s && s.dataset.what) || 'واحد مثله لشغلك';
  var demo = (s && s.dataset.demo) || document.title;
  var text = 'السلام عليكم ضياء 👋\nأبي أطلب خدمة: ' + service + '\n(شفت نموذج «' + demo + '» من موقع علي وليشو)';
  var wa = 'https://wa.me/966505573933?text=' + encodeURIComponent(text);
  var css = '.lw-bar{position:fixed;inset-inline:0;bottom:0;z-index:2147483000;display:flex;gap:8px;align-items:center;justify-content:space-between;' +
    'padding:8px 12px calc(8px + env(safe-area-inset-bottom));background:rgba(29,31,36,.94);backdrop-filter:blur(8px);color:#f6ead7;' +
    'font:700 13px/1.4 Cairo,Tajawal,system-ui,sans-serif;direction:rtl;border-top:1px solid #353943}' +
    '.lw-bar a{color:inherit;text-decoration:none}.lw-bar .lw-tag{opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.lw-bar .lw-tag b{color:#ff7a1a}.lw-bar .lw-go{flex:none;background:#25d366;color:#0b2914;padding:8px 14px;border-radius:999px;font-weight:900}' +
    '.lw-bar .lw-x{flex:none;background:none;border:0;color:#a9a49b;font:inherit;cursor:pointer;padding:4px 6px}' +
    'body{padding-bottom:58px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var bar = document.createElement('div'); bar.className = 'lw-bar'; bar.setAttribute('role', 'complementary');
  bar.innerHTML = '<a class="lw-tag" href="' + back + '">نموذج من <b>علي وليشو</b> ↩</a>' +
    '<a class="lw-go" target="_blank" rel="noopener" href="' + wa + '">أبي ' + what.replace(/</g, '&lt;') + '</a>' +
    '<button class="lw-x" aria-label="إخفاء الشريط">✕</button>';
  bar.querySelector('.lw-x').onclick = function () { bar.remove(); document.body.style.paddingBottom = '0'; };
  function add() { document.body.appendChild(bar); }
  if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
})();
