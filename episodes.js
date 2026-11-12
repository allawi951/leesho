// كل حلقة تذكر أداة أو برومت أو رابط تضيف قسمها هنا قبل النشر (الأحدث أولًا).
// id = يُستخدم في الرابط المباشر: https://allawi951.github.io/leesho/#<id>
// keywords: كلمات إضافية للبحث (اختياري) — اسم المقطع بأكثر من صيغة
// items: { type: "link" | "prompt", title, url?, text?, note? }
window.EPISODES = [
  {
    id: "t14-excel-ai",
    title: "إكسل بالذكاء الاصطناعي: اكتب طلبك بالعربي وتجيك المعادلة",
    date: "2026-11-12",
    watch: "",
    keywords: ["إكسل", "اكسل", "excel", "إكسل بالذكاء الاصطناعي", "معادلة", "معادلات", "sumif", "شات جي بي تي", "chatgpt", "جدول", "مصاريف", "ببلاش"],
    items: [
      { type: "link", title: "شات جي بي تي — يكتب لك الجدول والمعادلة", url: "https://chatgpt.com", note: "مجاني، ويشتغل حتى بدون تسجيل دخول" },
      { type: "link", title: "إكسل أونلاين — مجاني بحساب مايكروسوفت", url: "https://excel.cloud.microsoft", note: "ما يحتاج تثبيت ولا تفعيل" },
      { type: "prompt", title: "١) طلب الجدول", text: "سوّ لي جدول مصاريف شهرية لموظف، عمودين: البند والمبلغ بالريال، ٨ بنود، بدون شرح", note: "انسخ الجدول، وفي إكسل اضغط على A1 والصق. لو طلع مزحوم: الصفحة الرئيسية ← الممحاة ← مسح التنسيقات" },
      { type: "prompt", title: "٢) طلب المعادلة", text: "الجدول في إكسل: البنود في العمود A والمبالغ في B2 إلى B9. أبي معادلة تجمع المصاريف اللي فوق ٥٠٠ ريال بس. اكتبها بفواصل منقوطة. عطني المعادلة وسطر شرح واحد.", note: "السر: گول له وين جدولك بالضبط (أي عمود وأي صفوف)" },
      { type: "prompt", title: "٣) المعادلة اللي طلعت لنا (إكسل عربي)", text: "=SUMIF(B2:B9;\">500\";B2:B9)", note: "إذا طلعت المعادلة كلام وما حسبت: إكسلك عربي ويبي ؛ بدل ، — بدّلها" }
    ]
  },
  {
    id: "shula",
    title: "شرح: كيف تسوي فيلم مثل «شعلة» بالكود؟ (٦ خطوات)",
    date: "2026-11-10",
    watch: "https://youtu.be/0fYDI2V2RaE",
    keywords: ["شعلة", "شرح", "فيلم قصير", "بدون كلام", "ثلاثي الأبعاد", "3d", "كلود كود", "claude code", "remotion", "three.js", "طريقة عمل الفيديو"],
    items: [
      { type: "link", title: "كلود كود — هو اللي يكتب الفيلم كله", url: "https://claude.com/claude-code", note: "ما تحتاج تعرف برمجة: أنت تكتب الطلب بالعربي وهو يكتب الكود ويشغّله على جهازك" },
      { type: "link", title: "Node.js — حمّله أول شي (مجاني)", url: "https://nodejs.org", note: "لازم يكون على الجهاز عشان يشتغل الرندر" },
      { type: "link", title: "Remotion — يحوّل الكود إلى فيديو (مجاني للأفراد)", url: "https://www.remotion.dev", note: "كلود يثبّته بنفسه، بس عشان تعرف وش يستخدم" },
      { type: "link", title: "three.js — المجسمات والإضاءة ثلاثية الأبعاد (مجاني)", url: "https://threejs.org", note: "كلود يثبّته بنفسه" },
      { type: "prompt", title: "١) الفكرة: اطلب ٥ أفكار وخلّه يقيّمها", text: "أبي فيلم قصير (٤٥ إلى ٦٠ ثانية) بدون أي كلام ولا نص، يفهمه أي إنسان في العالم، وفيه رسالة إنسانية.\nاجمع ٥ أفكار، وقيّم كل وحدة من ١٠ على: هل تنفهم بدون لغة، قوة العاطفة، قوة أول ثانية، الفضول للنهاية، هل الناس بتشاركها، وهل تقدر تنفذها كلها بالكود.\nاختر الأفضل وقل لي ليش.", note: "لا تبدأ بالتنفيذ قبل ما تختار الفكرة. فيلمنا فاز لأن «النور في الظلام» ينفهم بدون حرف" },
      { type: "prompt", title: "٢) السيناريو: جدول بالثواني", text: "اكتب سيناريو الفكرة الفايزة في جدول: الوقت بالثانية، وش يصير على الشاشة، وليش هذي اللقطة موجودة.\nالشروط:\n- أول ثانية فيها خطر أو مفاجأة تشد المشاهد.\n- كل ٥ ثواني يصير شي جديد.\n- في النص خسارة حقيقية للبطل.\n- النهاية صورة وحدة تنحفظ وتلخّص الرسالة.", note: "السيناريو هو أهم خطوة: الكود ينفّذ اللي في الجدول بالضبط" },
      { type: "prompt", title: "٣) البناء: شخصيات بسيطة وكل شي بالكود", text: "سوِّ مشروع Remotion جديد مع three.js وابنِ الفيلم كله بالكود، بدون أي صور أو مجسمات جاهزة:\n- الشخصيات أشكال بسيطة (جسم مثل البيضة، عيون كبيرة، فم) وكل شخصية لها لون.\n- المشاعر من العيون والفم وحركة الجسم (رجفة، نطّة، انكماش).\n- الإضاءة جزء من القصة: كل شخصية تضوّي بلونها.\n- الكاميرا تتحرك حسب جدول السيناريو.\n- المقاس عمودي 1080×1920، ٣٠ فريم في الثانية.", note: "السر: شخصيات بسيطة + إضاءة حلوة أحسن من شخصيات معقدة" },
      { type: "prompt", title: "٤) الصوت: موسيقى ومؤثرات بالكود", text: "سوِّ صوت الفيلم كله بالكود (ملف WAV) بدون أي كلام وبدون ملفات جاهزة:\n- كل شخصية لها نغمة تنسمع لحظة ظهورها.\n- في النهاية النغمات كلها تصير لحن واحد.\n- صوت الجو (ريح مثلًا) يتبع اللي يصير في الصورة.\n- قبل أقوى لحظة خلّ الصوت يهدأ تقريبًا للصمت.", note: "الصوت نص الفيديو. وبما إنه مولّد بالكود ما فيه مشاكل حقوق" },
      { type: "prompt", title: "٥) المراجعة: خلّه يشوف شغله", text: "قبل الرندر الكامل: طلّع صورة من الفيلم كل ثانيتين، حطّهم في صفحة وحدة وراجعهم بنفسك.\nدوّر على: شي مقصوص، لقطة مظلمة ما ينشاف فيها البطل، شخصية تمشي عكس اتجاهها، ولقطة ما يصير فيها شي.\nصلّح اللي تلقاه ورجّع الصور لين يصير كل شي نظيف.", note: "هذي الخطوة اللي تفرق بين فيديو عادي وفيديو مرتب. كررها أكثر من مرة" },
      { type: "prompt", title: "٦) الرندر: الفيديو النهائي", text: "سوِّ الرندر الكامل للفيديو العمودي بجودة عالية، وبعدها نسخة أفقية 1920×1080 من نفس الفيلم، واضبط مستوى الصوت للنشر (‎-14 LUFS).\nأعطني مكان الملفات ومدة الفيديو.", note: "الرندر ياخذ وقت على اللابتوب (فيلمنا ٥٤ ثانية). لا تشغّل رندرين مع بعض" }
    ]
  },
  {
    id: "t11-free-ai-video",
    title: "كيف تسوي فيديو بالذكاء الاصطناعي ببلاش؟ (٥ خطوات)",
    date: "2026-11-09",
    watch: "https://youtu.be/e35-fIGYiJM",
    keywords: ["فيديو ذكاء اصطناعي", "مسلسل فواكه", "فواكه", "طماطة", "فلو", "google flow", "ميتا", "meta ai", "كاب كات", "capcut", "جيميناي", "ببلاش", "مجانا"],
    items: [
      { type: "link", title: "جيميناي — للقصة", url: "https://gemini.google.com", note: "مجاني للكتابة" },
      { type: "link", title: "شات جي بي تي — للقصة", url: "https://chatgpt.com", note: "مجاني للكتابة" },
      { type: "prompt", title: "١) برومت القصة", text: "اكتب لي حلقة نص دقيقة، أبطالها فواكه، وفيها نهاية تضحّك.\nالبطل: طماطة لابسة نظارة تبي تنضم لسلة الفواكه لأن الكل يگول لها إنتي خضار.\nقسّمها على ٦ مشاهد قصيرة، وكل مشهد سطر وصف للصورة وسطر حوار.", note: "غيّر البطل والفكرة على كيفك" },
      { type: "link", title: "ميتا AI — للشخصيات (أو من واتساب نفسه)", url: "https://www.meta.ai", note: "اكتب «تخيّل» وبعدها وصف الشخصية" },
      { type: "prompt", title: "٢) برومت الشخصية (انسخه نفسه في كل مشهد)", text: "تخيّل طماطة كرتونية ثلاثية الأبعاد، حمراء لامعة، عيونها كبيرة، لابسة نظارة دائرية سودا، يدينها ورجولها خضر رفيعة، لابسة جزمة بيضا، ستايل أفلام الأطفال، صورة عمودية — تمشي في سوق خضار ملوّن", note: "السر: نفس الوصف في كل صورة، وغيّر بس المكان" },
      { type: "link", title: "فلو من گوگل — للحركة (Frames to Video)", url: "https://labs.google/fx/tools/flow", note: "حط صورة البداية وصورة النهاية. الرصيد المجاني شهري: شوف كم ياخذ كل فيديو، واختار المدة، وخلّ عدد الفيديوهات ١ بدل ٢" },
      { type: "prompt", title: "٣) حركة المقطع A: الصورة 1 ← الصورة 2", text: "The tomato character stands in the sunny fruit-and-vegetable market and waves hello at the camera, then turns to the left and starts walking happily along the street, arms swinging; the camera pulls back a little and follows it. Same market, smooth continuous shot, cheerful 3D cartoon style, the tomato keeps exactly the same look. NO dialogue: nobody talks, no voices, no speech, no narration, no singing, no lip movement as if speaking (mouths only smile, gasp or open in surprise). Audio = light ambient sound effects only. No text or subtitles on screen." },
      { type: "prompt", title: "٣) حركة المقطع B: الصورة 2 ← الصورة 3", text: "The tomato keeps walking happily through the market, the camera tracks with it until it stops in front of a big wicker fruit basket; the fruits peek over the rim, cross their arms and look at it suspiciously. Smooth continuous tracking shot. NO dialogue: nobody talks, no voices, no speech, no narration, no singing, no lip movement as if speaking (mouths only smile, gasp or open in surprise). Audio = light ambient sound effects only. No text or subtitles on screen." },
      { type: "prompt", title: "٣) حركة المقطع C: الصورة 3 ← الصورة 4", text: "The tomato knocks politely, the fruits shake their heads; the tomato ducks out of frame for a second and pops back up wearing a fake apple leaf and a fake moustache, grinning nervously, while a green apple steps beside it and stares at it, unconvinced. Comic timing, smooth camera. NO dialogue: nobody talks, no voices, no speech, no narration, no singing, no lip movement as if speaking (mouths only smile, gasp or open in surprise). Audio = light ambient sound effects only. No text or subtitles on screen." },
      { type: "prompt", title: "٣) حركة المقطع D: الصورة 4 ← الصورة 5", text: "The fake moustache falls off, the tomato looks embarrassed; suddenly a small grape with reading glasses opens a big old book and points at it in surprise, the fruits gasp, the camera moves closer into the basket. Smooth continuous shot. NO dialogue: nobody talks, no voices, no speech, no narration, no singing, no lip movement as if speaking (mouths only smile, gasp or open in surprise). Audio = light ambient sound effects only. No text or subtitles on screen." },
      { type: "prompt", title: "٣) حركة المقطع E: الصورة 5 ← الصورة 6", text: "The fruits realise the tomato is a fruit, they cheer and pull the tomato into the basket, confetti bursts into the air, everyone jumps with arms up in celebration. Joyful, smooth camera pull-back. NO dialogue: nobody talks, no voices, no speech, no narration, no singing, no lip movement as if speaking (mouths only smile, gasp or open in surprise). Audio = light ambient sound effects only. No text or subtitles on screen." },
      { type: "prompt", title: "٣) حركة المقطع F: الصورة 6 ← الصورة 7", text: "In the middle of the party a human hand reaches in and picks up the tomato, the camera follows it into a bright home kitchen where the hand holds it above a glass salad bowl; lettuce and cucumber wave hello and the tomato's mouth drops open in comic shock, glasses crooked. Silly, never scary, smooth continuous shot. NO dialogue: nobody talks, no voices, no speech, no narration, no singing, no lip movement as if speaking (mouths only smile, gasp or open in surprise). Audio = light ambient sound effects only. No text or subtitles on screen." },
      { type: "link", title: "كاب كات — للمونتاج والترجمة التلقائية", url: "https://www.capcut.com", note: "حط المشاهد ورا بعض + صوتك + «تعليقات تلقائية»" },
    ],
  },
  {
    id: "t08-arabic-fonts",
    title: "كيف تسوي خط عربي حلو؟ (٣ خطوات ببلاش)",
    date: "2026-11-08",
    watch: "https://youtu.be/MN2QCz4hG5M",
    keywords: ["خط عربي", "خطوط عربية", "خطوط", "خط ثلث", "رقعة", "كوفي", "قوقل فونتس", "google fonts", "fonts", "عيد ميلاد ليشو", "اسمك بخط"],
    items: [
      { type: "link", title: "قوقل فونتس — الخطوط العربية", url: "https://fonts.google.com/?lang=ar_Arab", note: "أكثر من ٥٠ خط عربي مجاني، حتى للاستخدام التجاري. اكتب جملتك فوق وشوفها بكل الخطوط" },
      { type: "link", title: "كايرو (Cairo) — للعناوين القوية", url: "https://fonts.google.com/specimen/Cairo" },
      { type: "link", title: "أميري (Amiri) — نسخ فخم", url: "https://fonts.google.com/specimen/Amiri" },
      { type: "link", title: "عارف رقعة (Aref Ruqaa) — كأنه خط يد", url: "https://fonts.google.com/specimen/Aref+Ruqaa" },
      { type: "link", title: "ريم كوفي (Reem Kufi) — كوفي عصري", url: "https://fonts.google.com/specimen/Reem+Kufi" },
      { type: "link", title: "تجوّل (Tajawal) — نظيف وبسيط", url: "https://fonts.google.com/specimen/Tajawal" },
      { type: "link", title: "مرحي (Marhey) — مرح ومدوّر", url: "https://fonts.google.com/specimen/Marhey" },
      { type: "prompt", title: "اسمك بخط ثلث ذهبي (شات جي بي تي أو جيمناي)", text: "اكتب اسم \"علي\" بخط ثُلث ذهبي، على ورق كحلي، وتأكد من الحروف", note: "غيّر الاسم بين العلامتين. إذا غلط حرف أو نقطة، قل له: صحّح الحروف" },
      { type: "prompt", title: "جملة بخط ثلث داخل إطار", text: "اكتب \"جملتك هنا\" بخط ثُلث ذهبي، على ورق كحلي، داخل إطار ذهبي معلّق على جدار، وتأكد من الحروف" }
    ]
  },
  // {
  //   id: "05-example",
  //   title: "عنوان الحلقة",
  //   date: "2026-11-10",
  //   watch: "https://www.youtube.com/@ali.wa.leesho",
  //   items: [
  //     { type: "link", title: "اسم الأداة", url: "https://example.com", note: "وش تسوي باختصار" },
  //     { type: "prompt", title: "برومت الصورة", text: "اكتب البرومت هنا" }
  //   ]
  // }
];
