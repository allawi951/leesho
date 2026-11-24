# مدونة علي وليشو

https://allawi951.github.io/leesho/blog/

كل مقال صفحة HTML ثابتة (`blog/<slug>/index.html`) عشان محركات البحث وأدوات الذكاء الاصطناعي تقراها بدون جافاسكربت.
الملفات المشتركة: `blog.css` (الشكل) و`blog.js` (زر نسخ البرومتات + البحث والتصنيفات في صفحة المدونة).

## إضافة مقال جديد

1. **انسخ مجلد مقال** قريب من فكرتك وسمّه بالـslug الجديد (إنجليزي صغير وشرطات، مثل `my-new-guide`).
2. **عدّل `index.html` داخل المجلد الجديد:**
   - `<title>` و`<meta name="description">` و`<h1>` ونص المقدمة.
   - الرابط القانوني: `<link rel="canonical" href="https://allawi951.github.io/leesho/blog/<slug>/">` وكذلك `og:url`.
   - `og:title` و`og:description` و`article:published_time` و`article:tag`.
   - كتلة `application/ld+json` (BlogPosting): `headline`، `description`، `datePublished`، `dateModified`، `url`، `mainEntityOfPage`، `relatedLink` (رابط الحلقة + `https://allawi951.github.io/leesho/#<id الحلقة>`)، وBreadcrumbList.
   - `<time datetime="YYYY-MM-DD">` ووقت القراءة.
   - زرّي «شاهد الحلقة» (رابط يوتيوب) و«كل روابط الحلقة» (`https://allawi951.github.io/leesho/#<id الحلقة>`) — فوق وتحت.
   - الأقسام وفهرس «في هالمقال» (كل `<h2 id>` له سطر في الفهرس بنفس الـid).
   - كل برومت: `<pre id="p-<id>-<رقم>">` فريد + زر `<button class="copy" data-copy="نفس الـid">`. البرومت الإنجليزي أو الكود حطه `dir="ltr"`، والعربي `dir="rtl"`. وتأكد إن `<` و`&` مكتوبة `&lt;` و`&amp;`.
   - خلّ صندوق «تبي نسوي لك موقع أو مدونة مثل هذي؟» آخر المقال مثل ما هو.
3. **أضف بطاقة في `blog/index.html`:** انسخ أول `<article class="post-card">` وحطه أول القائمة (الأحدث أولًا)، وعدّل الرابط والعنوان والوصف والتاريخ و`data-tags` (التصنيفات مفصولة بـ`|`). أول بطاقة تاخذ `featured`، فشيلها من البطاقة اللي صارت ثانية. لو فيه تصنيف جديد أضف له زر `chip` في شريط التصنيفات.
4. **حدّث `blog/posts.json`:** أضف عنصر أول القائمة:
   ```json
   { "slug": "my-new-guide", "title": "…", "description": "…", "date": "YYYY-MM-DD", "tags": ["…"], "episodeId": "<id من episodes.js>" }
   ```
   الصفحة الرئيسية تقرأ هالملف في البحث.
5. حدّث «مقالات ثانية» في مقال أو اثنين عشان يربطون بالمقال الجديد، وأضف الرابط في `sitemap.xml` بجذر الموقع.

## قواعد المحتوى

- المقال مبني على عناصر الحلقة في `episodes.js` بس (الأدوات والروابط والبرومتات والملاحظات) — لا نضيف مزايا أو أسعار ما ذكرناها.
- البرومتات تنسخ حرفيًا من `episodes.js`.
- ما فيه أي طلب خارجي غير خط Cairo من Google Fonts (لا تضمين يوتيوب ولا صور من مواقع ثانية).
