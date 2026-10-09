/** Kids Bootcamp: independent curriculum, translations, image evidence, and offer. */
(() => {
  "use strict";
  const sessions = [
    [62, 'scratch-session-collage'], [63, 'scratch-lesson-presentation'],
    [64, 'scratch-live-editor'], [65, 'bootcamp-session-collage'],
    [66, 'codeorg-practical-activities'], [67, 'codeorg-maze-debugging'],
    [68, 'codeorg-interactive-scene']
  ].map(([original, slug]) => ({ original: `${original}.png`, slug,
    image: { src: `/assets/images/kids/sessions/${slug}.webp`, width: 1600, height: 1327 },
    thumbnail: `/assets/images/kids/sessions/${slug}-thumb.webp`
  }));
  const levels = [
    { id: 'codeorg', tool: 'Code.org', image: sessions[5].image, kind: 'session' },
    { id: 'scratch', tool: 'Scratch 3', image: sessions[2].image, kind: 'session' },
    { id: 'app-inventor', tool: 'MIT App Inventor', image: { src: '/assets/images/kids/levels/app-inventor-designer.webp', width: 1280, height: 482 }, kind: 'official', source: 'https://appinventor.mit.edu/explore/ai2/hellopurr' },
    { id: 'web', tool: 'HTML · CSS · JavaScript', image: { src: '/assets/images/kids/levels/web-project-example.webp', width: 1280, height: 800 }, kind: 'example' },
    { id: 'python', tool: 'Python', image: { src: '/assets/images/kids/levels/python-project-example.webp', width: 1280, height: 800 }, kind: 'example' }
  ];
  const translations = {
    ar: {
      seo: { title: 'برمجة الأطفال أونلاين | Kids Coding Bootcamp | MT Academy', description: 'برمجة للأطفال والمراهقين من 6 إلى 18 سنة: محاضرات أونلاين لايف، تطبيق عملي 80%، وخمسة مستويات من Code.org وScratch إلى التطبيقات والويب وPython.', socialImageAlt: 'Kids Coding Bootcamp من MT Academy — تعلّم عملي أونلاين' },
      localNavigationLabel: "روابط داخل صفحة الأطفال",
      localNavigation: [{"label": "المستويات", "href": "#levels"}, {"label": "المحاضرات", "href": "#sessions"}, {"label": "أسئلة شائعة", "href": "#faq"}],
      interface: { ...window.MTAcademySite.translations.ar.interface },
      hero: { eyebrow: 'برمجة للأطفال والمراهقين · من 6 إلى 18 سنة', title: 'أفكار صغيرة.\nإبداعات كبيرة.', description: 'خلّي طفلك يبدأ رحلته في البرمجة بطريقة ممتعة وعملية. في MT Academy، بنتعلّم أونلاين لايف وبنطبّق بإيدينا، من أول لعبة تفاعلية لحد بناء تطبيق وموقع وكتابة كود.', cta: 'استفسر عن التسجيل', secondaryCta: 'اكتشف المستويات', note: 'للمبتدئين تمامًا · تفاعل مباشر مع المدرّس', mediaCaption: 'لحظة تعلّم حقيقية من محاضراتنا', imageAlt: 'واجهة Scratch أثناء محاضرة أونلاين مع طفل ومدرّس MT Academy' },
      roadmapLabel: 'المستويات الخمسة', footerNavigationLabel: 'روابط سريعة', assetChangeLabel: 'تم تغيير الحجم والصيغة',
      offerTemplate: 'خصم يصل إلى {percent}%',
      facts: [{ value: '6–18', label: 'سنة · أطفال ومراهقون' }, { value: '80%', label: 'تطبيق عملي' }, { value: 'لايف', label: 'محاضرات أونلاين' }, { value: '12', label: 'حصة لكل مستوى' }, { value: 'أسبوعيًا', label: 'حصة واحدة' }, { value: '3 ساعات', label: 'مدة كل حصة' }],
      benefitsHeading: { eyebrow: 'أكتر من مجرد كود', title: 'من استخدام التكنولوجيا\nإلى الإبداع بيها.', description: 'بنتعلّم بالفهم والتجربة، مش بالحفظ. أنشطة ممتعة وشرح مناسب لسن الطفل، عشان يشارك ويفكّر ويبني بنفسه.' },
      benefits: [{ title: 'التفكير المنطقي', description: 'يرتّب أفكاره ويحوّلها لخطوات واضحة.' }, { title: 'حل المشكلات', description: 'يجرّب أكتر من طريقة للوصول لحل.' }, { title: 'التركيز', description: 'ينتبه للتفاصيل أثناء تنفيذ الأنشطة.' }, { title: 'التفكير المستقل', description: 'يسأل ويستكشف ويطوّر أفكاره بنفسه.' }, { title: 'الإبداع بالتكنولوجيا', description: 'يتعلّم يصنع حاجات، مش يستهلكها بس.' }],
      levelsHeading: { eyebrow: 'خطوة ورا خطوة', title: 'خمسة مستويات.\nعالم من الاحتمالات.', description: 'رحلة من التفكير البرمجي والألعاب التفاعلية إلى التطبيقات والمواقع وPython. تواصل معنا عن نقطة البداية المناسبة لطفلك.' },
      levelLabel: 'المستوى', levelSchedule: '12 حصة · مرة أسبوعيًا · 3 ساعات للحصة', focusLabel: 'تركيز المستوى', exampleLabel: 'فكرة مشروع توضيحية', sessionLabel: 'من محاضراتنا الفعلية', officialLabel: 'مثال رسمي من MIT App Inventor', demoLabel: 'مثال توضيحي · ليس مشروع طالب', sourceLabel: 'المصدر والترخيص',
      levels: [
        { title: 'أول خطوة في التفكير البرمجي', description: 'أساسيات التفكير البرمجي والألعاب التفاعلية باستخدام Code.org.', focus: ['التعليمات والخطوات المنطقية', 'حل التحديات التفاعلية'], example: 'توجيه شخصية للخروج من متاهة.', imageAlt: 'تمرين متاهة وتصحيح خطوات في Code.org أثناء محاضرة فعلية' },
        { title: 'ألعاب وقصص من خياله', description: 'تعلّم البرمجة بشكل ممتع باستخدام Scratch 3.', focus: ['البرمجة باستخدام البلوكات', 'قصص وألعاب ورسوم متحركة'], example: 'قصة تفاعلية تتحرّك فيها الشخصيات.', imageAlt: 'بلوكات البرمجة وشخصية Scratch في محاضرة فعلية' },
        { title: 'فكرته تبقى تطبيق', description: 'بناء تطبيقات موبايل بطريقة بسيطة باستخدام MIT App Inventor.', focus: ['تصميم واجهة تطبيق', 'ربط الأفعال ببلوكات البرمجة'], example: 'تطبيق يتفاعل مع الضغط على زر.', imageAlt: 'صورة رسمية لواجهة Designer في درس Hello Purr من MIT App Inventor' },
        { title: 'موقعه الأول على الويب', description: 'تصميم وتطوير مواقع الويب باستخدام HTML وCSS وJavaScript.', focus: ['هيكل الصفحة وتنسيقها', 'إضافة تفاعل للموقع'], example: 'صفحة عن اهتماماته فيها زر تفاعلي.', imageAlt: 'لقطة لموقع توضيحي يعمل بـHTML وCSS وJavaScript عن استكشاف الفضاء' },
        { title: 'بداية قوية مع Python', description: 'بداية في البرمجة العملية وكتابة الكود باستخدام Python.', focus: ['التعرّف على البرمجة النصية', 'تنفيذ أفكار بسيطة بالكود'], example: 'برنامج بسيط لاختبار معلوماته.', imageAlt: 'لقطة لتشغيل برنامج أسئلة توضيحي مكتوب بلغة Python مع الكود والناتج' }
      ],
      howHeading: { eyebrow: 'التعلّم بيحصل إزاي؟', title: 'نجتمع. نجرّب. نتعلّم.', description: 'محاضرات أونلاين لايف بتفاعل مباشر، والطفل شريك في كل خطوة.' },
      how: [{ title: 'أونلاين لايف', description: 'تفاعل مباشر مع المدرّس أثناء المحاضرة.' }, { title: 'تطبيق ومشاركة', description: '80% تطبيق عملي يساعد الطفل يفهم بإيده.' }, { title: 'موعد أسبوعي', description: '12 حصة لكل مستوى؛ حصة واحدة أسبوعيًا، مدتها 3 ساعات.' }],
      sessionsHeading: { eyebrow: 'من داخل محاضراتنا', title: 'التعلّم الحقيقي\nفي الصورة.', description: 'لقطات فعلية من محاضرات MT Academy: أطفال بيجرّبوا، وبلوكات بتتحوّل لأفكار.' },
      sessions: [
        { caption: 'Scratch · شرح وتطبيق في المحاضرة', alt: 'صور مجمّعة من محاضرة Scratch وشرح درس البرمجة' },
        { caption: 'Scratch · من محتوى المستوى الثاني', alt: 'عرض درس من المستوى الثاني عن Scratch أثناء محاضرة أونلاين' },
        { caption: 'Scratch · تجربة البلوكات مباشرة', alt: 'طفل يشارك في تطبيق عملي باستخدام Scratch مع المدرّس' },
        { caption: 'لحظات من محاضرات Bootcamp', alt: 'لقطات من محاضرات Kids Coding Bootcamp الأونلاين' },
        { caption: 'Code.org · أنشطة وتحديات عملية', alt: 'أنشطة برمجة تفاعلية باستخدام Code.org أثناء محاضرات فعلية' },
        { caption: 'Code.org · حل تحدّي المتاهة', alt: 'تطبيق خطوات حل متاهة على Code.org في محاضرة أونلاين' },
        { caption: 'Code.org · بناء مشهد تفاعلي', alt: 'برمجة شخصيات في مشهد بحري باستخدام Code.org خلال محاضرة فعلية' }
      ],
      gallery: { openTemplate: 'عرض الصورة: {caption}', close: 'إغلاق الصورة', previous: 'الصورة السابقة', next: 'الصورة التالية', loading: 'جارٍ تحميل الصورة…', error: 'تعذّر تحميل الصورة. جرّب صورة أخرى.', positionTemplate: 'الصورة {current} من {total}' },
      instructor: { eyebrow: 'مع المدرّس', name: 'محمد تامر', title: 'نتعلّم مع بعض،\nخطوة بخطوة.', description: 'مهندس برمجيات ومؤسس MT Academy ومدرّس على Udemy. في المحاضرات، بنتفاعل مباشرة مع الأطفال وبنساعدهم يحوّلوا الفكرة لتطبيق.', link: 'اعرف أكتر عن المدرّس' },
      faqHeading: { eyebrow: 'لأولياء الأمور', title: 'أسئلتك، بإجابات واضحة.', description: 'كل ما تحتاج تعرفه عن طريقة التعلّم وتفاصيل البرنامج.' },
      faqs: [
        { question: 'البرنامج مناسب لسن كام؟', answer: 'مناسب للأطفال والمراهقين من 6 إلى 18 سنة، بشرح وأنشطة تراعي سن الطفل.' },
        { question: 'لازم يكون عنده خبرة في البرمجة؟', answer: 'لا، البرنامج مناسب للمبتدئين تمامًا. تواصل معنا عن المستوى المناسب لطفلك.' },
        { question: 'المحاضرات أونلاين ولا حضوري؟ وهل هي لايف؟', answer: 'المحاضرات أونلاين لايف، وفيها تفاعل مباشر بين المدرّس والأطفال.' },
        { question: 'كل مستوى كام حصة والمواعيد إيه؟', answer: 'كل مستوى 12 حصة. حصة واحدة أسبوعيًا، ومدة الحصة 3 ساعات.' },
        { question: 'إيه المستويات اللي بيتعلّمها الطفل؟', answer: 'خمسة مستويات: Code.org، ثم Scratch 3، ثم MIT App Inventor، ثم HTML وCSS وJavaScript، ثم Python.' },
        { question: 'هل التعلّم عملي؟', answer: 'أيوه، 80% من طريقة التعلّم تطبيق عملي، عشان الطفل يشارك ويجرّب ويبني بنفسه.' },
        { question: 'أعرف الأسعار والمستوى المناسب وأقدّم إزاي؟', answer: 'التواصل والتقديم متاح أونلاين عبر واتساب. ابعت لنا سن طفلك واستفسارك عن الأسعار والمستوى المناسب والمواعيد المتاحة.' }
      ],
      final: { eyebrow: 'بداية جديدة لفكرة كبيرة', title: 'خلّي الفضول\nيبقى مهارة.', description: 'ابعت لنا سن طفلك، ونتكلم عن المستوى المناسب وتفاصيل التسجيل.', cta: 'تواصل لمعرفة المستوى المناسب', note: 'الزر يفتح واتساب للاستفسار عن التسجيل.' },
      inquiryMessage: 'مرحبًا، أريد الاستفسار عن Kids Coding Bootcamp لطفلي ومعرفة المستوى المناسب وتفاصيل التسجيل.',
      footer: { statement: 'كورسات Udemy وبرمجة الأطفال أونلاين، وقريبًا دبلومة Backend من MT Academy.', home: 'الرئيسية', udemy: 'كورسات Udemy', kids: 'برمجة الأطفال', backend: 'دبلومة Backend', top: 'العودة للأعلى', copyright: 'MT Academy. جميع الحقوق محفوظة.' },
    },
    en: {
      seo: { title: 'Kids Coding Bootcamp | Live Online Coding | MT Academy', description: 'Live online coding for children and teenagers aged 6–18. 80% practical learning across five levels, from Code.org and Scratch to apps, websites, and Python.', socialImageAlt: 'MT Academy Kids Coding Bootcamp — practical live online learning' },
      localNavigationLabel: "Links within the Kids page",
      localNavigation: [{"label": "Levels", "href": "#levels"}, {"label": "Our sessions", "href": "#sessions"}, {"label": "FAQs", "href": "#faq"}],
      interface: { ...window.MTAcademySite.translations.en.interface },
      hero: { eyebrow: 'Coding for kids & teens · Ages 6–18', title: 'Small ideas.\nBig creations.', description: 'Let your child discover coding through fun, practical learning. At MT Academy, we meet live online and learn by doing — from an interactive game to an app, a website, and their first lines of code.', cta: 'Ask about enrollment', secondaryCta: 'Explore the levels', note: 'Complete beginners welcome · Live instructor interaction', mediaCaption: 'A real learning moment from our sessions', imageAlt: 'A child and MT Academy instructor working in the Scratch editor during a live online session' },
      roadmapLabel: 'The five learning levels', footerNavigationLabel: 'Quick links', assetChangeLabel: 'Resized and converted',
      offerTemplate: 'Up to {percent}% off',
      facts: [{ value: '6–18', label: 'Years · Kids & teens' }, { value: '80%', label: 'Practical learning' }, { value: 'Live', label: 'Online sessions' }, { value: '12', label: 'Sessions per level' }, { value: 'Weekly', label: 'One session' }, { value: '3 hours', label: 'Per session' }],
      benefitsHeading: { eyebrow: 'More than writing code', title: 'From using technology\nto creating with it.', description: 'We learn through understanding and experimenting. Fun activities and age-appropriate explanations encourage children to take part, think, and build.' },
      benefits: [{ title: 'Logical thinking', description: 'Organize ideas into clear steps.' }, { title: 'Problem-solving', description: 'Try different approaches to a challenge.' }, { title: 'Concentration', description: 'Pay attention to details while building.' }, { title: 'Independent thinking', description: 'Ask questions, explore, and develop ideas.' }, { title: 'Creating with technology', description: 'Make things instead of only consuming them.' }],
      levelsHeading: { eyebrow: 'One step at a time', title: 'Five levels.\nA world of possibilities.', description: 'A journey from programming fundamentals and interactive games to apps, websites, and Python. Ask us about a suitable starting point for your child.' },
      levelLabel: 'Level', levelSchedule: '12 sessions · Once a week · 3 hours each', focusLabel: 'Learning focus', exampleLabel: 'Illustrative project idea', sessionLabel: 'From our actual sessions', officialLabel: 'Official MIT App Inventor example', demoLabel: 'Illustrative example · Not student work', sourceLabel: 'Source & license',
      levels: [
        { title: 'A first step into coding', description: 'Programming fundamentals and interactive activities with Code.org.', focus: ['Logical instructions and sequences', 'Solving interactive challenges'], example: 'Guide a character out of a maze.', imageAlt: 'An actual Code.org maze and debugging activity during our live session' },
        { title: 'Games from their imagination', description: 'Creative programming with Scratch 3.', focus: ['Programming with visual blocks', 'Interactive stories, animation, and games'], example: 'An interactive story with moving characters.', imageAlt: 'Scratch programming blocks and a character during an actual live session' },
        { title: 'Turn an idea into an app', description: 'Build simple mobile applications with MIT App Inventor.', focus: ['Designing an app interface', 'Connecting actions with programming blocks'], example: 'An app that responds when a button is tapped.', imageAlt: 'Official MIT App Inventor Designer screenshot from the Hello Purr tutorial' },
        { title: 'Their first website', description: 'Design and develop websites with HTML, CSS, and JavaScript.', focus: ['Page structure and styling', 'Adding website interactivity'], example: 'A page about their interests with an interactive button.', imageAlt: 'An actual running HTML, CSS, and JavaScript demonstration website about exploring space' },
        { title: 'Start strong with Python', description: 'A practical introduction to text-based programming with Python.', focus: ['Discovering text-based programming', 'Turning simple ideas into code'], example: 'A short program to quiz their knowledge.', imageAlt: 'An executed Python quiz demonstration showing its source code and output' }
      ],
      howHeading: { eyebrow: 'How we learn', title: 'Meet. Experiment. Learn.', description: 'Live online sessions with direct interaction, where children take part in every step.' },
      how: [{ title: 'Live online', description: 'Interact directly with the instructor during the session.' }, { title: 'Build and participate', description: '80% practical learning to understand by doing.' }, { title: 'A weekly rhythm', description: '12 sessions per level; one three-hour session each week.' }],
      sessionsHeading: { eyebrow: 'Inside our live sessions', title: 'Real learning,\nin the picture.', description: 'Actual moments from MT Academy sessions: children experimenting and blocks turning into ideas.' },
      sessions: [
        { caption: 'Scratch · Explanation and practice', alt: 'A collage of a Scratch live session and its programming lesson' },
        { caption: 'Scratch · Inside Level 2', alt: 'A Level 2 Scratch lesson presentation during an online session' },
        { caption: 'Scratch · Trying blocks together', alt: 'A child participating in practical Scratch programming with the instructor' },
        { caption: 'Moments from our Bootcamp sessions', alt: 'Actual moments from Kids Coding Bootcamp online sessions' },
        { caption: 'Code.org · Practical challenges', alt: 'Interactive Code.org programming activities during actual sessions' },
        { caption: 'Code.org · Solving a maze', alt: 'Following maze-solving steps in Code.org during a live session' },
        { caption: 'Code.org · Building an interactive scene', alt: 'Programming characters in an underwater Code.org scene during an actual session' }
      ],
      gallery: { openTemplate: 'View image: {caption}', close: 'Close image', previous: 'Previous image', next: 'Next image', loading: 'Loading image…', error: 'Unable to load this image. Try another image.', positionTemplate: 'Image {current} of {total}' },
      instructor: { eyebrow: 'Meet your instructor', name: 'Mohamed Tamer', title: 'Learning together,\none step at a time.', description: 'Software engineer, MT Academy founder, and Udemy instructor. In our sessions, we interact directly with children and help turn ideas into practical activities.', link: 'More about the instructor' },
      faqHeading: { eyebrow: 'For parents', title: 'Your questions, answered.', description: 'Get to know the learning approach and the program details.' },
      faqs: [
        { question: 'What ages is the program for?', answer: 'Children and teenagers aged 6–18, with age-appropriate explanations and activities.' },
        { question: 'Does my child need coding experience?', answer: 'No. Complete beginners are welcome. Contact us about a suitable starting level for your child.' },
        { question: 'Are sessions online and live?', answer: 'Yes. Sessions are live online, with direct interaction between the instructor and children.' },
        { question: 'How many sessions are there, and when?', answer: 'Each level has 12 sessions. Sessions take place once a week and last three hours each.' },
        { question: 'What are the five levels?', answer: 'Code.org, Scratch 3, MIT App Inventor, HTML/CSS/JavaScript, and Python.' },
        { question: 'Is the learning practical?', answer: 'Yes. 80% of the learning approach is practical, so children participate, experiment, and build.' },
        { question: 'How do I ask about fees, the starting level, and enrollment?', answer: 'Online inquiries and applications are available through WhatsApp. Send us your child’s age and ask about fees, the appropriate level, and upcoming availability.' }
      ],
      final: { eyebrow: 'A new beginning for a big idea', title: 'Turn curiosity\ninto a skill.', description: 'Tell us your child’s age, and let’s talk about a suitable level and enrollment details.', cta: 'Ask about the right level', note: 'This button opens WhatsApp for an enrollment inquiry.' },
      inquiryMessage: 'Hello, I would like to ask about the Kids Coding Bootcamp for my child, the appropriate level, and enrollment details.',
      footer: { statement: 'Udemy courses and live online kids coding, with a Backend diploma coming soon from MT Academy.', home: 'Home', udemy: 'Udemy courses', kids: 'Kids coding', backend: 'Backend diploma', top: 'Back to top', copyright: 'MT Academy. All rights reserved.' },
    }
  };
  window.MTAcademyKids = window.MTAcademyCore.deepFreeze({
    name: 'Kids Coding Bootcamp', path: '/kids-coding-bootcamp/',
    facts: { minAge: 6, maxAge: 18, practicalPercent: 80, sessionsPerLevel: 12, sessionsPerWeek: 1, hoursPerSession: 3 },
    promotion: { enabled: true, upToPercent: 25 },
    heroImage: sessions[2].image, levels, sessions, translations
  });
})();
