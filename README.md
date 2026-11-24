# علي وليشو — الموقع (خدمات + نماذج + مدونة + روابط الحلقات)

https://allawi951.github.io/leesho/ — GitHub Pages من فرع main (أي push = نشر مباشر).

## البنية
- `index.html` (الرئيسية) و`<خدمة>/index.html` (motion, editing, websites, apps, games, ai, hikayah) و`sitemap.xml` و`assets/search-index.js`
  **مولّدة** من `tools/build_site.py`: عدّل هناك ثم شغّل `python tools/build_site.py`.
- `episodes.js`: روابط الحلقات (مهام النشر تضيف هنا، الأحدث أولًا). الرابط المباشر `#<id>`، والبحث `?q=`.
- `blog/`: المدونة (مقال لكل حلقة). مقال جديد: انسخ مجلد مقال، عدّل `blog/posts.json`، ثم شغّل البناء (يدخل البحث وsitemap).
- `games/`, `apps/` (نماذج)، `demos/perfume` و`demos/landing` (علامات خيالية، noindex وخارج sitemap).
- `media/`: فيديوهات الإعلانات المضغوطة. `assets/demo-bar.js`: شريط «أبي واحد مثله» أسفل كل نموذج.

## الواتساب وضياء
كل زر يفتح واتساب الخط التجاري برسالة «أبي أطلب خدمة: <الخدمة> (من موقع علي وليشو)».
ضياء تتعرف عليها في `D:\Projects\Dhiaa\app\src\site-requests.js` — أسماء الخدمات (`label` و`data-service`) لازم تطابق `SITE_SERVICES` هناك.

## SEO
عناوين ووصف وschema.org لكل صفحة، `sitemap.xml`، `llms.txt`. robots.txt هنا ما يشتغل إلا مع دومين خاص.
بعد النشر: سجّل الموقع وارفع sitemap في Google Search Console وBing Webmaster Tools.

## الحلقات وصور بُن ليشو
- صفحة `episodes/` تنبني من `tools/videos.json`. لتحديثها بعد حلقة جديدة: `python tools/fetch_videos.py` ثم `python tools/build_site.py`.
- صور بُن ليشو: حط `bag.webp` و`cup.webp` و`bean.webp` (بدون خلفية) في `demos/landing/img/`، والبرومتات في `demos/landing/img/PROMPTS.md`. إذا ما وُجدت تبقى الرسمة.
