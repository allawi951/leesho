# يبني صفحات موقع «علي وليشو»: الرئيسية (بحث فوق + الخدمات + روابط الحلقات) + صفحة لكل خدمة + sitemap.
# التشغيل:  python tools/build_site.py   (من جذر المستودع). يعيد كتابة: index.html, <خدمة>/index.html, sitemap.xml, assets/search-index.js
# episodes.js ما يلمسه (تحدّثه مهام نشر الحلقات) — الرئيسية تقراه وقت التشغيل.
# blog/posts.json (إن وجد) يدخل في البحث وفي sitemap وفي «آخر المقالات».
import json, html, urllib.parse, pathlib, datetime

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = 'https://allawi951.github.io/leesho/'
WA = '966505573933'  # الخط التجاري (ضياء) — لا رقم علي الشخصي أبدًا
TODAY = datetime.date.today().isoformat()
e = html.escape

def wa(label, extra=''):
    text = f'السلام عليكم ضياء 👋\nأبي أطلب خدمة: {label}\n(من موقع علي وليشو{extra})'
    return f'https://wa.me/{WA}?text=' + urllib.parse.quote(text)

def load_posts():
    p = ROOT / 'blog' / 'posts.json'
    if not p.exists(): return []
    try:
        posts = json.loads(p.read_text(encoding='utf-8'))
        return sorted(posts, key=lambda x: x.get('date', ''), reverse=True)
    except Exception as ex:
        print('posts.json unreadable:', ex); return []

POSTS = load_posts()

MOTION_PRICES = [('إعلان عام 15 ثانية (موشن + شعارك)', '99', '250'),
                 ('إعلان مخصص من صورك، لمطعمك أو أي مشروع ثاني (15 ثانية لين دقيقتين)', '199', '450'),
                 ('الباقة الشهرية: 6 إعلانات مخصصة', '999 / شهر', '2,700')]
PRICE_NOTE = 'تعديلين · التسليم خلال 3 أيام من استلام الصور'
OFFER_BANNER = '🔥 أسعار التأسيس لعدد محدد من العملاء بس، لا تفوّت العرض'

def video(src, title, note=''):
    return (f'<figure class="vid"><video controls preload="none" playsinline poster="../media/{src}.jpg">'
            f'<source src="../media/{src}.mp4" type="video/mp4"></video>'
            f'<figcaption><b>{e(title)}</b>{(" — " + e(note)) if note else ""}</figcaption></figure>')

def yt(vid, title):
    return (f'<a class="yt" href="https://youtu.be/{vid}" target="_blank" rel="noopener">'
            f'<img loading="lazy" src="https://i.ytimg.com/vi/{vid}/hqdefault.jpg" alt="{e(title)}" width="480" height="360">'
            f'<span class="play" aria-hidden="true">▶</span><b>{e(title)}</b></a>')

def demo(href, icon, title, desc, cta='جرّبه'):
    ext = href.startswith('http')
    tgt = ' target="_blank" rel="noopener"' if ext else ''
    return (f'<a class="demo" href="{e(href)}"{tgt}><span class="di" aria-hidden="true">{icon}</span>'
            f'<b>{e(title)}</b><span>{e(desc)}</span><em>{e(cta)} ←</em></a>')

# ---------- الخدمات ----------
# label لازم يطابق SITE_SERVICES في D:\Projects\Dhiaa\app\src\site-requests.js
SERVICES = [
  dict(slug='motion', icon='🎬', label='موشن جرافيك', title='موشن جرافيك للإعلانات',
       h1='إعلانات موشن جرافيك بالعربي لنشاطك',
       short='فيديو موشن بالعربي لنشاطك: إعلان، تعريف، شرح منتج، ومحتوى للسوشال. نحرّك صورك وشعارك، لمطعمك أو أي مشروع ثاني.',
       meta='إعلانات موشن جرافيك بالعربي للمطاعم والكافيهات والعقار والمتاجر في السعودية. إعلان 15 ثانية من 99 ريال، إعلان مخصص 199، وباقة شهرية 6 إعلانات 999 ريال.',
       examples_title='إعلانات سويناها',
       examples=lambda: '<div class="vids">' + ''.join([
           video('seven-ads', '7 إعلانات في دقيقة', 'تحدي: مطعم، كافيه، عطور، عقار، شرح، تراث، وأرقام'),
           video('nuwaiser-spy', 'إعلان «الجاسوس»', 'قصة تمثيلية كوميدية لمطعم برجر'),
           video('burger-leesho', 'برجر ليشو', 'إعلان منتج قصير 15 ثانية'),
       ]) + '</div><p class="muted">كل الإعلانات هنا نماذج سويناها لقناتنا، مو لعملاء حقيقيين.</p>',
       prices=True,
       bullets=['إعلان قصير للسوشال (ريلز، تيك توك، سناب، ستوري)', 'إعلان من صورك الحقيقية، لمطعم أو أي مشروع ثاني، نحسّنها بدون ما نغيّر شكل المنتج',
                'فيديو تعريف بالنشاط أو شرح خدمة', 'باقة شهرية تنزّل فيها محتوى ثابت طول الشهر'],
       faq=[('كم سعر الإعلان؟', 'الإعلان العام 15 ثانية بـ99 ريال بدل 250، والمخصص من صورك بـ199 بدل 450 (من 15 ثانية لين دقيقتين)، والباقة الشهرية 6 إعلانات بـ999 بدل 2,700. عرض تأسيس لعدد محدود.'),
            ('كم ياخذ وقت؟', 'التسليم خلال 3 أيام من استلام الصور والمنيو، ومعك تعديلين.'),
            ('وش أحتاج أرسل؟', 'شعارك وصور منتجاتك أو المنيو، وفكرة بسيطة عن اللي تبي توصله. وإذا ما عندك فكرة نقترح عليك.')]),
  dict(slug='editing', icon='✂️', label='مونتاج فيديو', title='مونتاج فيديو',
       h1='مونتاج فيديو احترافي ليوتيوب والريلز والإعلانات',
       short='مونتاج ليوتيوب والريلز والتيك توك والإعلانات والمناسبات: إيقاع، كابشن عربي متحرك، تنقلات، صوت وموسيقى.',
       meta='مونتاج فيديو بالعربي: يوتيوب، ريلز، تيك توك، إعلانات ومناسبات. كابشن عربي متحرك وتنقلات وإيقاع. اطلب عبر واتساب.',
       examples_title='من مونتاج قنواتنا',
       examples=lambda: '<div class="yts">' + ''.join([
           yt('Hh-gWmV9zPE', 'ليشو يدوّر وظيفة: وظيفة وهمية ولا شركة حقيقية؟'),
           yt('XmqbQn11xx8', 'الرجل اللي باع برج إيفل… مرتين!'),
           yt('yjqbaIiUgdQ', 'الماتريكس… ما فهمناه صح!'),
           yt('MkR3foa3pzU', 'عالم ليشو: يوم صحيت في جسم واحد ثاني'),
       ]) + '</div><p class="muted">من قناتي «علي وليشو» و«عالم ليشو»، والمونتاج كله من شغلنا. ونقدر نسوي أي أسلوب تبيه.</p>'
          '<p><a class="btn ghost" href="../episodes/">شوف كل الحلقات</a></p>',
       bullets=['قص وترتيب وإيقاع يمسك المشاهد', 'كابشن عربي متحرك بخط واضح', 'تنقلات ومؤثرات وصوت وموسيقى',
                'تقطيع الفيديو الطويل لمقاطع قصيرة (شورتس وريلز)', 'مقاسات كل المنصات: عمودي ومربع وعرضي'],
       faq=[('كم سعر المونتاج؟', 'يعتمد على عدد المقاطع ومدتها والأسلوب. ضياء تجمع تفاصيلك وعلي يرسل لك العرض.'),
            ('عندي تصوير خام، تقدرون تشتغلون عليه؟', 'إيه، ترسل لنا التصوير ونرتبه ونطلعه بالشكل اللي تبيه.'),
            ('تسوون مونتاج لقناة يوتيوب بشكل مستمر؟', 'إيه، نتفق على عدد الحلقات بالشهر وأسلوب ثابت لقناتك.')]),
  dict(slug='websites', icon='🌐', label='إنشاء موقع', title='إنشاء موقع أو متجر',
       h1='مواقع ومتاجر وصفحات هبوط سريعة وجذابة',
       short='موقع تعريفي، متجر، صفحة هبوط لمنتج، أو مدونة. سريع على الجوال ومجهّز لمحركات البحث.',
       meta='تصميم مواقع ومتاجر وصفحات هبوط ومدونات بالعربي، سريعة على الجوال ومجهزة لمحركات البحث. شوف نماذجنا واطلب عبر واتساب.',
       examples_title='نماذج تقدر تفتحها وتجربها',
       examples=lambda: '<div class="demos">' + ''.join([
           demo('../demos/perfume/', '🧴', 'متجر «عطورات ليشو»', 'متجر عطور فاخر بحركة وسلة ودفع شكلي، عربي وإنجليزي.'),
           demo('../demos/landing/', '☕', 'صفحة هبوط «بُن ليشو»', 'صفحة منتج واحد: مزايا، باقات، أسئلة، وزر طلب ثابت.'),
           demo('../blog/', '📰', 'مدونة «علي وليشو»', 'مدونة حقيقية بمقالات من حلقاتنا، مجهزة لقوقل.', 'اقرأها'),
           demo('https://rayan6.netlify.app', '📖', 'كتاب «حكاية» التفاعلي', 'قصة أطفال تتصفحها وتسمعها من الجوال.', 'افتحه'),
           demo('../', '🏠', 'هالموقع نفسه', 'خدمات وأمثلة وطلب مباشر على الواتساب.', 'الرئيسية'),
       ]) + '</div><p class="muted">العلامات والمنتجات في النماذج خيالية.</p>',
       bullets=['موقع تعريفي لنشاطك أو شركتك', 'متجر إلكتروني أو ثيم لمتجرك على سلة', 'صفحة هبوط لحملة أو منتج',
                'مدونة أو صفحة روابط', 'تجهيز لمحركات البحث وأدوات الذكاء الاصطناعي، وربط الواتساب'],
       faq=[('كم سعر الموقع؟', 'حسب نوعه وعدد صفحاته. ضياء تسألك عن نشاطك واللي تبيه، وعلي يرسل لك العرض.'),
            ('ما عندي دومين ولا استضافة، عادي؟', 'عادي، نرتب لك الدومين والاستضافة أو ننشره لك على استضافة مجانية إذا يناسب.'),
            ('يطلع موقعي في قوقل؟', 'نجهّزه لمحركات البحث من البداية (العناوين والوصف والبيانات المنظمة وخريطة الموقع)، والترتيب يتحسن مع الوقت.')]),
  dict(slug='apps', icon='📱', label='برنامج أو تطبيق', title='برامج وتطبيقات',
       h1='برامج وتطبيقات على مقاس شغلك',
       short='منيو رقمي بطلب واتساب، حجوزات، بطاقة ولاء، لوحة مبيعات ومصروفات. كلها تنفصّل على احتياجك.',
       meta='برامج وتطبيقات ويب مخصصة: لوحة مبيعات ومصروفات، منيو QR بطلب واتساب، نظام حجز مواعيد، بطاقة ولاء رقمية. جرّب النماذج واطلب نسختك.',
       examples_title='جرّب النماذج (تشتغل فعليًا)',
       examples=lambda: '<div class="demos">' + ''.join([
           demo('../apps/dashboard/', '📊', 'لوحة المبيعات والمصروفات', 'إيرادات ومصروفات يومية بالأصناف، تقويم لكل يوم، فلاتر ورسوم.'),
           demo('../apps/menu/', '🍔', 'منيو QR بطلب واتساب', 'الزبون يختار ويضيف للسلة، والطلب يوصل واتساب المطعم.'),
           demo('../apps/booking/', '📅', 'حجز مواعيد', 'يختار الخدمة واليوم والوقت، والحجز يوصل لك.'),
           demo('../apps/loyalty/', '⭐', 'بطاقة ولاء رقمية', 'اشترِ 6 والسابع علينا، بدون بطاقات ورق.'),
       ]) + '<p class="muted">النماذج محدودة وببيانات تجريبية. الفكرة: نسوي لك تطبيق مثلها، مفصّل على طلبك واحتياجك.</p>',
       bullets=['أداة داخلية لشغلك تختصر الورق والإكسل', 'تطبيق ويب يشتغل من الجوال بدون تحميل من المتجر',
                'ربط مع الواتساب', 'لوحات متابعة وتقارير'],
       faq=[('أقدر أطلب تطبيق مختلف عن النماذج؟', 'أكيد، النماذج أمثلة بس. قل لضياء وش المشكلة اللي تبي تحلها ونفصّل لك الحل.'),
            ('يشتغل على الآيفون والأندرويد؟', 'تطبيقات الويب تشتغل على أي جوال أو كمبيوتر من المتصفح، وتقدر تضيفها للشاشة الرئيسية مثل التطبيق.'),
            ('كم السعر؟', 'حسب المزايا. ضياء تجمع طلبك وعلي يرسل لك العرض.')]),
  dict(slug='games', icon='🎮', label='لعبة', title='ألعاب للمطاعم والأنشطة',
       h1='ألعاب تسلّي زباينك وتجمعهم على طاولة وحدة',
       short='ألعاب انتظار وألعاب جماعية للمطاعم والكافيهات، بشعار محلك وعرضك، أو لعبتك الخاصة من الصفر.',
       meta='ألعاب HTML للمطاعم والكافيهات: ألعاب جماعية للطاولة وألعاب انتظار بشعار المحل. العب النماذج الحين واطلب لعبة لمحلك عبر واتساب.',
       examples_title='العبها الحين من جوالك',
       examples=lambda: '<div class="demos">' + ''.join([
           demo('../games/order-rush/', '🍔', 'ركّب الطلب', 'الزباين يطلبون من المنيو وأنت تجهّز، واللي يتأخر يعصّب!', 'العب'),
           demo('../games/table-talk/', '💬', 'سوالف الطاولة', 'بطاقات سوالف للطاولة كلها على جوال واحد، بدل ما كل واحد على جواله.', 'العب'),
           demo('../games/forbidden-word/', '🤐', 'الكلمة الممنوعة', 'فريقين: وصّف الكلمة بدون ما تقول الكلمات الممنوعة.', 'العب'),
       ]) + '<p class="muted">نحط شعار مطعمك وألوانه والمنيو، ونقدر نضيف خصم للي يجيب أعلى نتيجة.</p>',
       bullets=['ألعاب انتظار لين يوصل الطلب', 'ألعاب جماعية تجمع العائلة والشلة', 'شعارك والمنيو داخل اللعبة',
                'كود QR على الطاولة يفتحها على طول', 'ألعاب تعليمية للأطفال'],
       faq=[('الزبون يحتاج يحمّل شي؟', 'لا، يمسح QR على الطاولة وتفتح اللعبة في المتصفح على طول.'),
            ('تقدرون تسوون لعبة بفكرتي؟', 'إيه، اكتب فكرتك لضياء وعلي يدرسها ويرسل لك العرض.'),
            ('كم السعر؟', 'حسب اللعبة والتخصيص. ضياء تجمع طلبك وعلي يرسل لك العرض.')]),
  dict(slug='ai', icon='🤖', label='حلول ذكاء اصطناعي', title='حلول الذكاء الاصطناعي',
       h1='نختصر شغلك بأدوات الذكاء الاصطناعي',
       short='رد آلي على عملائك في الواتساب، أتمتة المهام المتكررة، صور وفيديو بالذكاء الاصطناعي، وتحليل بياناتك.',
       meta='حلول ذكاء اصطناعي للأنشطة: رد آلي على العملاء في واتساب، أتمتة المهام، صور وفيديو بالذكاء الاصطناعي، وتحليل البيانات. اطلب عبر واتساب.',
       examples_title='أمثلة من شغلنا',
       examples=lambda: '<div class="demos">' + ''.join([
           demo('../motion/', '🎥', 'إعلانات بالذكاء الاصطناعي', 'إعلانات منتجات سويناها بأدوات الذكاء الاصطناعي، شوفها بصفحة الموشن.', 'شوفها'),
           demo('../apps/dashboard/', '📊', 'لوحة بيانات', 'مثال لأداة تجمع أرقامك وتطلع لك الصورة كاملة.'),
           demo('../blog/', '🧠', 'شروحات أدوات الذكاء الاصطناعي', 'مقالات من حلقاتنا عن أدوات تقدر تستخدمها اليوم.', 'اقرأ'),
       ]) + '</div>',
       bullets=['رد آلي على عملائك في الواتساب يرد بأسلوبك ويحوّل لك اللي يحتاجك', 'أتمتة المهام المتكررة (تقارير، متابعات، تذكيرات)',
                'صور وفيديو إعلانية بالذكاء الاصطناعي', 'تحليل بياناتك ومبيعاتك', 'تدريبك وفريقك على الأدوات'],
       faq=[('وش أقدر أسوي بالذكاء الاصطناعي في شغلي؟', 'قل لضياء وش أكثر شي ياخذ وقتك، وعلي يقترح عليك الحل المناسب.'),
            ('أحتاج خبرة تقنية؟', 'لا، نجهّز لك كل شي ونعلمك عليه.'),
            ('كم السعر؟', 'حسب الحل. ضياء تجمع طلبك وعلي يرسل لك العرض.')]),
  dict(slug='hikayah', icon='📚', label='قصة حكاية مخصصة لطفل', title='«حكاية» — قصة مخصصة يكون طفلك بطلها',
       h1='«حكاية»: قصة مصوّرة يكون فيها الطفل هو البطل',
       short='قصة مصوّرة مخصصة للطفل، هو بطلها باسمه وشكله، وفيها قيمة تربوية. للأهالي والروضات والمدارس.',
       meta='«حكاية» من علي وليشو: قصة مصوّرة مخصصة يكون فيها الطفل البطل باسمه وشكله، هدية من الأهل أو لكل أطفال الروضة والمدرسة، مع نسخة تتصفحها وتسمعها من الجوال.',
       examples_title='نماذج من «حكاية»',
       examples=lambda: '<figure class="img"><img loading="lazy" src="../media/hikayah-covers.jpg" alt="أغلفة قصص حكاية" width="1000" height="948"></figure>'
          '<div class="demos">' + demo('https://rayan6.netlify.app', '📖', 'قصة ريان كاملة', 'تتصفحها وتسمعها من الجوال.', 'افتحها') + '</div>',
       bullets=['قصة مخصصة للطفل باسمه وشكله، وهو بطلها', 'هدية من الأهل لطفلهم، أو قصة لكل طفل في الروضة أو المدرسة', 'قيمة تربوية: النظام، المشاركة، الصدق، الثقة بالنفس، أول يوم بالروضة أو المدرسة',
                'نسخة تتصفحها وتسمعها من الجوال', 'ملف جاهز للطباعة'],
       faq=[('لمين الخدمة؟', 'للأهالي اللي يبون قصة لطفلهم، وللروضات والحضانات والمدارس اللي تبي قصة لكل طفل في الفصل.'),
            ('كم السعر؟', 'ضياء تعطيك الأسعار كاملة على الواتساب.')]),
]

OTHER_LABEL = 'طلب خاص'

FAQ_HOME = [
  ('كيف أطلب خدمة؟', 'اضغط زر الخدمة اللي تبيها، ويفتح لك الواتساب برسالة جاهزة لضياء، مساعدة علي. أرسلها، وضياء تسألك عن التفاصيل وتوصل طلبك لعلي.'),
  ('كم سعر إعلان الموشن جرافيك؟', 'بعرض التأسيس: الإعلان العام 15 ثانية بـ99 ريال بدل 250، والإعلان المخصص من صورك بـ199 ريال بدل 450، والباقة الشهرية 6 إعلانات مخصصة بـ999 ريال بدل 2,700.'),
  ('كم سعر المونتاج أو الموقع أو التطبيق أو اللعبة؟', 'يختلف حسب الطلب. ضياء تجمع تفاصيل طلبك على الواتساب، وعلي يرسل لك عرض السعر بنفسه.'),
  ('هل تشتغلون مع أي مدينة؟', 'إيه، الشغل كله أونلاين ونخدم كل مدن السعودية والخليج.'),
]

# ---------- قطع مشتركة ----------
def head(title, desc, path, extra_ld=(), depth=0):
    up = '../' * depth
    url = SITE + path
    lds = '\n'.join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in extra_ld)
    return f'''<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#1d1f24">
<meta property="og:type" content="website">
<meta property="og:locale" content="ar_SA">
<meta property="og:site_name" content="علي وليشو">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}assets/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{up}assets/logo.png">
<link rel="apple-touch-icon" href="{up}assets/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{up}assets/site.css">
{lds}
</head>
<body>
'''

def topbar(depth, current=''):
    up = '../' * depth
    names = {'motion': 'موشن', 'editing': 'مونتاج', 'websites': 'مواقع', 'apps': 'تطبيقات', 'games': 'ألعاب', 'ai': 'ذكاء اصطناعي', 'hikayah': 'حكاية'}
    cur = ' aria-current="page"'
    links = ''.join(f'<a href="{up}{s["slug"]}/"{cur if s["slug"] == current else ""}>{names[s["slug"]]}</a>' for s in SERVICES)
    return (f'<header class="top"><a class="brand" href="{up}"><img src="{up}assets/logo.png" alt="" width="36" height="36"><b>علي وليشو</b></a>'
            f'<nav class="menu" aria-label="الخدمات">{links}<a href="{up}episodes/"{cur if current == 'episodes' else ''}>الحلقات</a><a href="{up}blog/">المدونة</a><a href="{up}#links">روابط الحلقات</a></nav></header>')

def footer(depth):
    up = '../' * depth
    return (f'<footer class="foot"><nav class="social" aria-label="حساباتنا">'
            '<a href="https://www.youtube.com/@ali.wa.leesho" target="_blank" rel="noopener">يوتيوب</a>'
            '<a href="https://www.tiktok.com/@ali.wa.leesho" target="_blank" rel="noopener">تيك توك</a>'
            '<a href="https://www.instagram.com/ali.wa.leesho" target="_blank" rel="noopener">إنستقرام</a></nav>'
            f'<p><a href="{up}">علي وليشو</a> · <bdi dir="ltr">@ali.wa.leesho</bdi> · الطلب عبر واتساب ضياء <bdi dir="ltr">+966 50 557 3933</bdi></p></footer>'
            f'<a class="fab" href="{e(wa(OTHER_LABEL))}" target="_blank" rel="noopener" aria-label="كلّم ضياء على الواتساب">💬 كلّم ضياء</a>')

def prices_html():
    rows = ''.join(f'<li><span>{e(n)}</span><b>{e(p)} ريال</b> <s>{e(w)}</s></li>' for n, p, w in MOTION_PRICES)
    return f'<p class="offer">{e(OFFER_BANNER)}</p><ul class="prices">{rows}</ul><p class="pn">{e(PRICE_NOTE)}</p>'

def faq_html(items):
    return '\n'.join(f'<details><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in items)

def faq_ld(items):
    return {'@context': 'https://schema.org', '@type': 'FAQPage',
            'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in items]}

BUSINESS = {
  '@context': 'https://schema.org', '@type': 'ProfessionalService', '@id': SITE + '#business',
  'name': 'علي وليشو', 'alternateName': 'Ali Wa Leesho', 'url': SITE,
  'logo': SITE + 'assets/logo.png', 'image': SITE + 'assets/og.jpg',
  'description': 'موشن جرافيك ومونتاج فيديو وإنشاء مواقع وبرامج وألعاب وحلول ذكاء اصطناعي، بالعربي، والطلب عبر واتساب.',
  'telephone': '+' + WA, 'areaServed': [{'@type': 'Country', 'name': 'Saudi Arabia'}, {'@type': 'Place', 'name': 'الخليج'}],
  'availableLanguage': ['ar', 'en'], 'priceRange': '99-2700 SAR',
  'contactPoint': {'@type': 'ContactPoint', 'contactType': 'sales', 'telephone': '+' + WA, 'url': 'https://wa.me/' + WA, 'availableLanguage': ['ar', 'en']},
  'sameAs': ['https://www.youtube.com/@ali.wa.leesho', 'https://www.tiktok.com/@ali.wa.leesho', 'https://www.instagram.com/ali.wa.leesho'],
  'hasOfferCatalog': {'@type': 'OfferCatalog', 'name': 'الخدمات', 'itemListElement': [
      {'@type': 'Offer', 'url': SITE + s['slug'] + '/', 'itemOffered': {'@type': 'Service', 'name': s['title'], 'description': s['short']},
       **({'price': '99', 'priceCurrency': 'SAR'} if s.get('prices') else {})} for s in SERVICES]},
}

# ---------- صفحة خدمة ----------
def service_page(s):
    url = SITE + s['slug'] + '/'
    ld = [{'@context': 'https://schema.org', '@type': 'Service', 'name': s['title'], 'description': s['meta'], 'url': url,
           'serviceType': s['title'], 'areaServed': {'@type': 'Country', 'name': 'Saudi Arabia'},
           'provider': {'@id': SITE + '#business', '@type': 'ProfessionalService', 'name': 'علي وليشو', 'url': SITE},
           **({'offers': [{'@type': 'Offer', 'name': n, 'price': p.split(' ')[0].replace(',', ''), 'priceCurrency': 'SAR'} for n, p, _ in MOTION_PRICES]} if s.get('prices') else {})},
          {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
              {'@type': 'ListItem', 'position': 1, 'name': 'علي وليشو', 'item': SITE},
              {'@type': 'ListItem', 'position': 2, 'name': s['title'], 'item': url}]},
          faq_ld(s['faq'])]
    order = e(wa(s['label']))
    others = ''.join(f'<a href="../{o["slug"]}/">{o["icon"]} {e(o["title"])}</a>' for o in SERVICES if o is not s)
    body = f'''{topbar(1, s['slug'])}
<main class="wrap">
  <nav class="crumbs" aria-label="مسار الصفحة"><a href="../">الرئيسية</a> ‹ <span>{e(s['title'])}</span></nav>
  <section class="hero">
    <div class="ic" aria-hidden="true">{s['icon']}</div>
    <h1>{e(s['h1'])}</h1>
    <p class="sub">{e(s['short'])}</p>
    <a class="btn wa" href="{order}" target="_blank" rel="noopener">اطلب {e(s['label'])} عبر واتساب</a>
  </section>
  {'<section class="card hl"><h2>الأسعار <span>(عرض التأسيس)</span></h2>' + prices_html() + '</section>' if s.get('prices') else ''}
  <section><h2>{e(s['examples_title'])}</h2>{s['examples']()}</section>
  <section class="card"><h2>وش نسوي لك؟</h2><ul class="ticks">{''.join(f'<li>{e(b)}</li>' for b in s['bullets'])}</ul></section>
  <section><h2>كيف تطلب؟</h2><ol class="steps"><li>اضغط «اطلب عبر واتساب»، ويفتح لك برسالة جاهزة. أرسلها.</li><li>ضياء، مساعدة علي، تسألك عن طلبك سؤال سؤال.</li><li>علي يرسل لك العرض ويبدأ الشغل بعد موافقتك.</li></ol>
    <p class="center"><a class="btn wa" href="{order}" target="_blank" rel="noopener">اطلب {e(s['label'])} الحين</a></p></section>
  <section class="faq"><h2>أسئلة <span>تتكرر</span></h2>{faq_html(s['faq'])}</section>
  <section><h2>خدمات ثانية</h2><div class="chips">{others}</div></section>
</main>
{footer(1)}
</body>
</html>
'''
    out = ROOT / s['slug'] / 'index.html'
    out.parent.mkdir(exist_ok=True)
    out.write_text(head(f'{s["title"]} — علي وليشو', s['meta'], s['slug'] + '/', ld, depth=1) + body, encoding='utf-8', newline='\n')

# ---------- صفحة الحلقات (من tools/videos.json — حدّثه بـ python tools/fetch_videos.py) ----------
def episodes_page():
    vp = ROOT / 'tools' / 'videos.json'
    data = json.loads(vp.read_text(encoding='utf-8')) if vp.exists() else {}
    def clean(t):
        for tail in (' | علي وليشو', ' | عالم لِيشُو', ' | عالم ليشو'):
            t = t.replace(tail, '')
        return t.strip()
    def grid(vs):
        return '<div class="yts">' + ''.join(yt(v['id'], clean(v['title'])) for v in vs) + '</div>'
    def sub_btn(ch):
        return f'<p class="center"><a class="btn ghost" href="{e(ch["url"])}" target="_blank" rel="noopener">اشترك في قناة {e(ch["name"])}</a></p>'
    secs, items = [], []
    for key, ch in data.items():
        vs = [v for v in ch['videos'] if v.get('sec', 0) >= 60]
        if key == 'ali':
            job = [v for v in vs if 'ليشو يدوّر وظيفة' in v['title']]
            rest = [v for v in vs if v not in job]
            secs.append(f'<section id="ali"><h2>حلقات <span>علي وليشو</span></h2><p class="h2sub">قصص حقيقية، سرقات، أفلام، علوم، وشروحات أدوات.</p>{grid(rest)}{sub_btn(ch)}</section>')
            if job:
                secs.append(f'<section id="job"><h2>سلسلة <span>ليشو يدوّر وظيفة</span></h2><p class="h2sub">من اختيار التخصص لين أول راتب وكشف الوظايف الوهمية.</p>{grid(list(reversed(job)))}</section>')
        else:
            secs.append(f'<section id="world"><h2>حلقات <span>{e(ch["name"])}</span></h2><p class="h2sub">مغامرات ليشو: كل حلقة «يوم» غريب صار له.</p>{grid(vs)}{sub_btn(ch)}</section>')
        items += [{'@type': 'ListItem', 'position': len(items) + i + 1, 'url': f'https://www.youtube.com/watch?v={v["id"]}', 'name': clean(v['title'])} for i, v in enumerate(vs)]
    ld = [{'@context': 'https://schema.org', '@type': 'ItemList', 'name': 'حلقات علي وليشو وعالم ليشو', 'itemListElement': items},
          {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
              {'@type': 'ListItem', 'position': 1, 'name': 'علي وليشو', 'item': SITE},
              {'@type': 'ListItem', 'position': 2, 'name': 'الحلقات', 'item': SITE + 'episodes/'}]}]
    order = e(wa('مونتاج فيديو', ' — صفحة الحلقات'))
    body = f'''{topbar(1, 'episodes')}
<main class="wrap">
  <nav class="crumbs" aria-label="مسار الصفحة"><a href="../">الرئيسية</a> ‹ <span>الحلقات</span></nav>
  <section class="hero"><div class="ic" aria-hidden="true">📺</div><h1>حلقات <span>علي وليشو</span> و<span>عالم ليشو</span></h1>
    <p class="sub">كل حلقات القناتين في مكان واحد. اضغط الحلقة وتفتح لك في يوتيوب.</p>
    <div class="chips"><a href="#ali">علي وليشو</a><a href="#job">ليشو يدوّر وظيفة</a><a href="#world">عالم ليشو</a><a href="../#links">روابط وبرومتات الحلقات</a></div></section>
  {''.join(secs)}
  <section class="card"><h2>تبي <span>فيديو مثلها</span>؟</h2><p class="center">المونتاج والموشن في الحلقات كله من شغلنا، ونقدر نسوي لك مثله لقناتك أو نشاطك.</p>
    <p class="center"><a class="btn wa" href="{order}" target="_blank" rel="noopener">اطلب مونتاج عبر واتساب</a></p></section>
</main>
{footer(1)}
</body>
</html>
'''
    out = ROOT / 'episodes' / 'index.html'
    out.parent.mkdir(exist_ok=True)
    out.write_text(head('حلقات علي وليشو وعالم ليشو — علي وليشو',
                        'كل حلقات قناة علي وليشو وقناة عالم ليشو على يوتيوب: قصص حقيقية، سرقات، أفلام، سلسلة ليشو يدوّر وظيفة، ومغامرات عالم ليشو.',
                        'episodes/', ld, depth=1) + body, encoding='utf-8', newline='\n')

# ---------- فهرس البحث (خدمات + نماذج + مقالات) ----------
DEMOS = [
  ('demos/perfume/', 'متجر عطورات ليشو', 'نموذج متجر إلكتروني عطور موقع', 'websites'),
  ('demos/landing/', 'صفحة هبوط بن ليشو', 'نموذج صفحة هبوط منتج قهوة موقع', 'websites'),
  ('apps/dashboard/', 'لوحة المبيعات والمصروفات', 'تطبيق إيرادات مصروفات تقويم أصناف محاسبة', 'apps'),
  ('apps/menu/', 'منيو QR بطلب واتساب', 'تطبيق منيو رقمي مطعم كافيه طلب', 'apps'),
  ('apps/booking/', 'حجز مواعيد', 'تطبيق حجز موعد عيادة صالون', 'apps'),
  ('apps/loyalty/', 'بطاقة ولاء رقمية', 'تطبيق ولاء أختام كافيه', 'apps'),
  ('games/order-rush/', 'لعبة ركّب الطلب', 'لعبة انتظار مطعم برجر شاورما', 'games'),
  ('games/table-talk/', 'لعبة سوالف الطاولة', 'لعبة جماعية أسئلة سوالف طاولة', 'games'),
  ('games/forbidden-word/', 'لعبة الكلمة الممنوعة', 'لعبة جماعية فريقين كلمات', 'games'),
]

def search_index():
    idx = [{'t': s['title'], 'd': s['short'], 'k': s['label'] + ' ' + ' '.join(s['bullets']), 'u': s['slug'] + '/', 'g': 'خدمة', 'i': s['icon']} for s in SERVICES]
    idx += [{'t': t, 'd': 'نموذج تقدر تجربه', 'k': k, 'u': u, 'g': 'نموذج', 'i': next(s['icon'] for s in SERVICES if s['slug'] == g)} for u, t, k, g in DEMOS if (ROOT / u).exists()]
    idx.append({'t': 'حلقات علي وليشو وعالم ليشو', 'd': 'كل حلقات القناتين', 'k': 'حلقات يوتيوب قناة عالم ليشو ليشو يدور وظيفة سرقة ماتريكس', 'u': 'episodes/', 'g': 'صفحة', 'i': '📺'})
    idx += [{'t': p['title'], 'd': p.get('description', ''), 'k': ' '.join(p.get('tags', [])), 'u': f'blog/{p["slug"]}/', 'g': 'مقال', 'i': '📰'} for p in POSTS]
    (ROOT / 'assets' / 'search-index.js').write_text('// مولّد من tools/build_site.py — لا تعدّله يدويًا\nwindow.SEARCH_INDEX = ' + json.dumps(idx, ensure_ascii=False, indent=0) + ';\n', encoding='utf-8', newline='\n')

# ---------- الرئيسية ----------
EPISODES_SCRIPT = r'''<script>
const list=document.getElementById('list');
const eps=window.EPISODES||[];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if(!eps.length){list.innerHTML='<p class="empty">أول الروابط توصل مع الحلقة الجاية… خلك قريب 👀</p>';}
eps.forEach(ep=>{
  const s=document.createElement('section');s.className='ep';s.id=ep.id;
  let h=`<h3>${esc(ep.title)}</h3><div class="meta">${ep.date?`<span>${esc(ep.date)}</span>`:''}${ep.watch?`<a href="${esc(ep.watch)}" target="_blank" rel="noopener">شاهد الحلقة</a>`:''}<button data-link="${esc(ep.id)}">انسخ رابط القسم</button></div>`;
  (ep.items||[]).forEach((it,i)=>{
    h+=`<div class="item"><div class="t">${esc(it.title)}</div>`;
    if(it.type==='prompt'){h+=`<pre id="p-${esc(ep.id)}-${i}">${esc(it.text)}</pre><button data-copy="p-${esc(ep.id)}-${i}">انسخ البرومت</button>`;}
    else{h+=`<a class="go" href="${esc(it.url)}" target="_blank" rel="noopener">${esc(it.url)}</a>`;}
    if(it.note)h+=`<div class="note">${esc(it.note)}</div>`;
    h+='</div>';
  });
  s.innerHTML=h;list.appendChild(s);
});
// البحث: يطابق العنوان والكلمات والروابط والبرومتات، ويتسامح مع الهمزات والتاء المربوطة والتشكيل وگ/ق
const norm=t=>String(t||'').toLowerCase().replace(/[ً-ْٰـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/گ/g,'ق').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const hay=eps.map(ep=>norm([ep.title,ep.id,(ep.keywords||[]).join(' '),...(ep.items||[]).map(it=>[it.title,it.note,it.text,it.url].join(' '))].join(' ')));
const titleHay=eps.map(ep=>norm(ep.title+' '+(ep.keywords||[]).join(' ')));
const SI=(window.SEARCH_INDEX||[]).map(x=>({...x,h:norm([x.t,x.d,x.k,x.g].join(' ')),th:norm(x.t)}));
const qIn=document.getElementById('q'),cnt=document.getElementById('count'),res=document.getElementById('results');
function runSearch(){
  const words=norm(qIn.value).split(' ').filter(Boolean);
  let shown=[];
  eps.forEach((ep,i)=>{
    const sec=document.getElementById(ep.id);
    const ok=!words.length||words.every(w=>hay[i].includes(w));
    sec.classList.toggle('hide',!ok);
    if(ok){shown.push({sec,score:words.filter(w=>titleHay[i].includes(w)).length});}
  });
  shown.sort((a,b)=>b.score-a.score).forEach(o=>list.appendChild(o.sec));
  if(!words.length){eps.forEach(ep=>list.appendChild(document.getElementById(ep.id)));cnt.textContent='';res.innerHTML='';res.hidden=true;return shown;}
  const hits=SI.filter(x=>words.every(w=>x.h.includes(w))).sort((a,b)=>words.filter(w=>b.th.includes(w)).length-words.filter(w=>a.th.includes(w)).length).slice(0,8);
  let r=hits.map(x=>`<a class="hit" href="${esc(x.u)}"><span class="hi">${x.i}</span><span><b>${esc(x.t)}</b><small>${esc(x.g)} · ${esc(x.d)}</small></span></a>`).join('');
  if(shown.length)r+=`<a class="hit" href="#links"><span class="hi">🔗</span><span><b>${shown.length===1?'حلقة وحدة فيها اللي تدوره':shown.length+' حلقات فيها اللي تدوره'}</b><small>روابط وبرومتات الحلقات — تحت 👇</small></span></a>`;
  res.innerHTML=r||'<p class="empty">ما لقينا شي… جرّب كلمة ثانية، أو كلّم ضياء على الواتساب.</p>';res.hidden=false;
  cnt.textContent=shown.length?(shown.length===1?'لقينا المقطع 👇':`لقينا ${shown.length} مقاطع 👇`):'ما لقينا حلقة فيها هالكلمة';
  return shown;
}
qIn.addEventListener('input',runSearch);
qIn.addEventListener('keydown',e=>{if(e.key==='Enter'){const a=res.querySelector('a.hit');if(a&&a.getAttribute('href')!=='#links'){location.href=a.href;return;}const r=runSearch();if(r[0])r[0].sec.scrollIntoView({behavior:'smooth'});qIn.blur();}});
// روابط يوتيوب القديمة: ?q= و#<id> تنزل على قسم الروابط
const q0=new URLSearchParams(location.search).get('q');if(q0){qIn.value=q0;const r=runSearch();(r[0]?r[0].sec:document.getElementById('links')).scrollIntoView();}
else{const h=decodeURIComponent(location.hash.slice(1));const t=h&&eps.some(ep=>ep.id===h)&&document.getElementById(h);if(t)t.scrollIntoView();}
document.addEventListener('click',e=>{
  const b=e.target.closest('button[data-copy],button[data-link]');if(!b)return;
  const txt=b.dataset.copy?document.getElementById(b.dataset.copy).textContent:location.origin+location.pathname+'#'+b.dataset.link;
  navigator.clipboard.writeText(txt).then(()=>{const o=b.textContent;b.textContent='تم النسخ ✓';setTimeout(()=>b.textContent=o,1400);});
});
</script>'''

def home():
    cards = []
    for s in SERVICES:
        price = ('<p class="from">من <b>99 ريال</b> <s>250</s> · عرض التأسيس</p>' if s.get('prices') else '')
        cards.append(f'''<article class="svc" id="svc-{s['slug']}">
<a class="cover" href="{s['slug']}/"><span class="ic" aria-hidden="true">{s['icon']}</span><h3>{e(s['title'])}</h3></a>
<p>{e(s['short'])}</p>{price}
<div class="acts"><a class="btn ghost" href="{s['slug']}/">شوف الأمثلة</a><a class="btn wa" href="{e(wa(s['label']))}" target="_blank" rel="noopener" data-svc="{s['slug']}">اطلب واتساب</a></div>
</article>''')
    cards.append(f'''<article class="svc" id="svc-other"><div class="cover"><span class="ic" aria-hidden="true">💡</span><h3>عندك فكرة ثانية؟</h3></div>
<p>أي شي ينسوى بأدوات الذكاء الاصطناعي والبرمجة والتصميم: اكتب لنا فكرتك ونشوف كيف نسويها لك.</p>
<div class="acts"><a class="btn wa" href="{e(wa(OTHER_LABEL))}" target="_blank" rel="noopener" data-svc="other">اكتب طلبك واتساب</a></div></article>''')
    featured = ''.join([
        demo('games/order-rush/', '🍔', 'لعبة ركّب الطلب', 'جهّز طلبات الزباين قبل ما يعصبون!', 'العب'),
        demo('apps/dashboard/', '📊', 'لوحة المبيعات والمصروفات', 'تقويم يومي بالإيرادات والمصروفات.'),
        demo('demos/perfume/', '🧴', 'متجر عطورات ليشو', 'متجر فاخر بحركة وسلة.'),
        demo('motion/', '🎬', 'إعلانات الموشن', '7 إعلانات في دقيقة، والجاسوس، وبرجر ليشو.', 'شوفها'),
        demo('episodes/', '📺', 'حلقات علي وليشو وعالم ليشو', 'كل حلقات القناتين في مكان واحد.', 'شوفها'),
    ])
    latest = ''
    if POSTS:
        latest = '<section id="blog"><h2>آخر <span>المقالات</span></h2><div class="demos">' + ''.join(
            demo(f'blog/{p["slug"]}/', '📰', p['title'], p.get('description', ''), 'اقرأ') for p in POSTS[:3]) + \
            '</div><p class="center"><a class="btn ghost" href="blog/">كل المقالات</a></p></section>'
    ld = [BUSINESS, faq_ld(FAQ_HOME), {'@context': 'https://schema.org', '@type': 'WebSite', 'name': 'علي وليشو', 'url': SITE, 'inLanguage': 'ar',
          'potentialAction': {'@type': 'SearchAction', 'target': SITE + '?q={search_term_string}', 'query-input': 'required name=search_term_string'}}]
    title = 'علي وليشو — موشن جرافيك، مونتاج، مواقع، تطبيقات، ألعاب وحلول ذكاء اصطناعي'
    desc = 'اطلب موشن جرافيك لإعلانك من 99 ريال، أو مونتاج فيديو، أو موقع ومتجر، أو تطبيق، أو لعبة لمطعمك، أو حلول ذكاء اصطناعي. شوف الأمثلة واضغط الخدمة وكمّل طلبك مع ضياء على الواتساب.'
    body = f'''{topbar(0)}
<main class="wrap">
  <div class="search top-search" role="search">
    <input id="q" type="search" placeholder="🔍 ابحث عن خدمة، نموذج، مقال، أو حلقة (مثل: موقع، لعبة، إكسل)" autocomplete="off" aria-label="ابحث في الموقع">
    <div id="results" class="results" hidden></div>
  </div>
  <section class="hero">
    <img class="logo" src="assets/logo.png" alt="شعار علي وليشو" width="96" height="96">
    <img class="wm" src="assets/wordmark.png" alt="علي وليشو" width="200" height="67">
    <h1>موشن جرافيك، مونتاج، مواقع، تطبيقات، ألعاب، و<span>حلول ذكاء اصطناعي</span> لشغلك</h1>
    <p class="sub">شوف الأمثلة، واضغط الخدمة اللي تبيها. يفتح لك الواتساب برسالة جاهزة لضياء، مساعدة علي، وهي تكمل معك.</p>
  </section>
  <section id="services"><h2>وش <span>نسوي لك؟</span></h2><div class="grid">{''.join(cards)}</div></section>
  <section class="card hl" id="prices"><h2>أسعار الموشن جرافيك <span>(عرض التأسيس)</span></h2>{prices_html()}
    <p class="center"><a class="btn wa" href="{e(wa('موشن جرافيك'))}" target="_blank" rel="noopener">اطلب إعلانك</a></p></section>
  <section id="try"><h2>جرّب <span>بنفسك</span></h2><p class="h2sub">نماذج تشتغل فعليًا من جوالك.</p><div class="demos">{featured}</div></section>
  <section id="how"><h2>كيف <span>أطلب؟</span></h2><ol class="steps"><li>اضغط زر الخدمة، ويفتح الواتساب برسالة جاهزة. أرسلها.</li><li>ضياء ترد عليك وتسألك عن طلبك سؤال سؤال.</li><li>علي يرسل لك العرض ويبدأ الشغل بعد موافقتك.</li></ol></section>
  {latest}
  <section id="faq" class="faq"><h2>أسئلة <span>تتكرر</span></h2>{faq_html(FAQ_HOME)}</section>
  <section id="links" class="links">
    <h2>كل <span>الروابط والبرومتات</span> اللي نذكرها في الحلقات</h2>
    <p class="h2sub">دوّر على حلقتك من البحث فوق، وانسخ اللي تبيه بضغطة.</p>
    <div class="tip">تبي الرابط على طول؟ أرسل كلمة <b>«ليشو»</b> في إنستقرام (خاص أو تعليق) ونرسل لك الرابط في الخاص.</div>
    <div class="count" id="count"></div>
    <div id="list"></div>
  </section>
</main>
{footer(0)}
<script src="assets/search-index.js"></script>
<script src="episodes.js"></script>
{EPISODES_SCRIPT}
</body>
</html>
'''
    (ROOT / 'index.html').write_text(head(title, desc, '', ld, depth=0) + body, encoding='utf-8', newline='\n')

def sitemap():
    urls = [''] + [s['slug'] + '/' for s in SERVICES] + [u for u, *_ in DEMOS if (ROOT / u).exists() and not u.startswith('demos/')]  # علامات خيالية: noindex وما تدخل sitemap
    urls.append('episodes/')
    if (ROOT / 'blog' / 'index.html').exists(): urls.append('blog/')
    urls += [f'blog/{p["slug"]}/' for p in POSTS if (ROOT / 'blog' / p['slug']).exists()]
    body = ''.join(f'  <url><loc>{SITE}{u}</loc><lastmod>{TODAY}</lastmod></url>\n' for u in urls)
    (ROOT / 'sitemap.xml').write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{body}</urlset>\n', encoding='utf-8', newline='\n')
    return urls

if __name__ == '__main__':
    for s in SERVICES: service_page(s)
    episodes_page(); search_index(); home(); urls = sitemap()
    print('built', len(SERVICES), 'service pages;', len(POSTS), 'posts;', len(urls), 'sitemap urls')
