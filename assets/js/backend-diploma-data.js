/** Confirmed information only. This upcoming diploma has no enrollment or promotion. */
(() => {
  "use strict";
  window.MTAcademyBackend = window.MTAcademyCore.deepFreeze({
    id: 'backend-diploma',
    name: 'Backend Development Diploma with Java & Spring Boot',
    path: '/backend-development-diploma/',
    status: 'coming-soon',
    technologies: ['Java', 'Spring Boot'],
    visual: { src: '/assets/images/backend/backend-announcement.svg', width: 1200, height: 800 },
    socialImage: '/assets/images/backend/backend-social-preview.png',
    translations: {
      ar: {
        statusLabels: { 'coming-soon': 'قريبًا إن شاء الله' },
        navigation: [{ label: 'الرئيسية', href: '/' }, { label: 'المسارات', href: '/#learning-paths' }, { label: 'كورسات Udemy', href: '/#courses' }, { label: 'برمجة الأطفال', href: '/kids-coding-bootcamp/' }, { label: 'دبلومة Backend', href: '/backend-development-diploma/' }],
        seo: { title: 'دبلومة Backend باستخدام Java وSpring Boot — قريبًا | MT Academy', description: 'دبلومة تطوير Backend باستخدام Java وSpring Boot للمبتدئين من الصفر. قريبًا إن شاء الله — هنعلن قريبًا عن تفاصيل الدبلومة.', socialImageAlt: 'MT Academy — دبلومة Backend باستخدام Java وSpring Boot قريبًا' },
        card: { tag: 'المسار القادم · للمبتدئين من الصفر', title: 'دبلومة تطوير Backend', description: 'مسار للمبتدئين من الصفر لتعلّم تطوير Backend باستخدام Java وSpring Boot. هنعلن قريبًا عن تفاصيل الدبلومة.', cta: 'اعرف عن الدبلومة القادمة' },
        hero: { eyebrow: 'مسار جديد من MT Academy', title: 'دبلومة تطوير Backend', audience: 'للمبتدئين من الصفر', description: 'دبلومة قادمة لتعلّم تطوير Backend باستخدام Java وSpring Boot، تبدأ معاك من الصفر.', announcement: 'هنعلن قريبًا عن تفاصيل الدبلومة.', returnLabel: 'اكتشف كل مسارات التعلّم', contactLabel: 'استفسر عن الدبلومة' },
        related: { title: 'اكتشف مساراتنا الحالية', udemyTitle: 'كورسات Udemy', udemyDescription: 'كورسات برمجة باللغة العربية لتطوير مهاراتك.', udemyCta: 'تصفّح كورسات Udemy', kidsTitle: 'Kids Coding Bootcamp', kidsDescription: 'برمجة للأطفال والمراهقين أونلاين لايف.', kidsCta: 'اكتشف برمجة الأطفال' },
        footer: { statement: 'تعلّم البرمجة مع MT Academy — مسارات مختلفة لأهداف مختلفة.', home: 'الرئيسية', paths: 'مسارات التعلّم', udemy: 'كورسات Udemy', kids: 'برمجة الأطفال', backend: 'دبلومة Backend', top: 'العودة للأعلى', copyright: 'MT Academy. جميع الحقوق محفوظة.', navigationLabel: 'روابط سريعة' },
        inquiryMessage: 'مرحبًا، أريد الاستفسار عن دبلومة Backend Development باستخدام Java وSpring Boot القادمة.'
      },
      en: {
        statusLabels: { 'coming-soon': 'Coming soon' },
        navigation: [{ label: 'Home', href: '/' }, { label: 'Learning paths', href: '/#learning-paths' }, { label: 'Udemy courses', href: '/#courses' }, { label: 'Kids coding', href: '/kids-coding-bootcamp/' }, { label: 'Backend diploma', href: '/backend-development-diploma/' }],
        seo: { title: 'Backend Development Diploma with Java & Spring Boot — Coming Soon | MT Academy', description: 'An upcoming Backend Development Diploma with Java & Spring Boot for complete beginners starting from zero. Full diploma details will be announced soon.', socialImageAlt: 'MT Academy — Backend Development Diploma with Java & Spring Boot, coming soon' },
        card: { tag: 'Our next learning path · Start from zero', title: 'Backend Development Diploma', description: 'An upcoming backend development diploma for complete beginners, starting from zero with Java and Spring Boot. Full details will be announced soon.', cta: 'Explore the upcoming diploma' },
        hero: { eyebrow: 'A new path from MT Academy', title: 'Backend Development Diploma', audience: 'For complete beginners — starting from zero.', description: 'An upcoming diploma in backend development with Java and Spring Boot, designed for beginners starting from zero.', announcement: 'Full diploma details will be announced soon.', returnLabel: 'Explore all learning paths', contactLabel: 'Ask about the diploma' },
        related: { title: 'Explore our current learning paths', udemyTitle: 'Udemy courses', udemyDescription: 'Programming courses taught in Arabic to develop your skills.', udemyCta: 'Browse Udemy courses', kidsTitle: 'Kids Coding Bootcamp', kidsDescription: 'Live online coding for children and teenagers.', kidsCta: 'Discover kids coding' },
        footer: { statement: 'Learn programming with MT Academy — different paths for different goals.', home: 'Home', paths: 'Learning paths', udemy: 'Udemy courses', kids: 'Kids coding', backend: 'Backend diploma', top: 'Back to top', copyright: 'MT Academy. All rights reserved.', navigationLabel: 'Quick links' },
        inquiryMessage: 'Hello, I would like to ask about the upcoming Backend Development Diploma with Java & Spring Boot.'
      }
    }
  });
})();
