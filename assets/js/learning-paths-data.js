/** Homepage discovery content shared by all three offerings. No promotions are defined here. */
(() => {
  "use strict";
  const backend = window.MTAcademyBackend;
  window.MTAcademyPaths = window.MTAcademyCore.deepFreeze({
    offerings: [
      { id: 'udemy', href: '#courses' },
      { id: 'kids', href: '/kids-coding-bootcamp/', image: {"src":"/assets/images/kids/brand/kids-coding-bootcamp-box.webp","width":1254,"height":1254} },
      { id: backend.id, href: backend.path, image: backend.visual, imageAltKey: 'backend.visualAlt' }
    ],
    translations: {
  "ar": {
    "udemyImageAlt": "أغلفة كورسات MT Academy على Udemy: SOLID وKotlin وHTML",
    "imageAlt": "غلاف Box الخاص ببرنامج Kids Coding Bootcamp من MT Academy",
    "eyebrow": "اختَر طريقك",
    "title": "ثلاث مسارات للتعلّم. أكاديمية واحدة.",
    "udemyTag": "تطوير مهاراتك",
    "udemyTitle": "كورسات Udemy",
    "udemyDescription": "كورسات برمجة باللغة العربية في هندسة البرمجيات وقواعد البيانات وتطوير الويب والموبايل.",
    "udemyCta": "تصفّح كورسات Udemy",
    "kidsTag": "للأطفال والمراهقين · من 6 إلى 18 سنة",
    "kidsTitle": "Kids Coding Bootcamp",
    "kidsDescription": "محاضرات برمجة أونلاين لايف، تفاعل مباشر، وتطبيق عملي 80% من الألعاب إلى Python.",
    "kidsCta": "اكتشف برمجة الأطفال"
  },
  "en": {
    "udemyImageAlt": "MT Academy Udemy course covers: SOLID, Kotlin, and HTML",
    "imageAlt": "MT Academy Kids Coding Bootcamp course box artwork",
    "eyebrow": "Choose your path",
    "title": "Three learning paths. One academy.",
    "udemyTag": "Develop your skills",
    "udemyTitle": "Udemy courses",
    "udemyDescription": "Arabic programming courses in software engineering, databases, web, and mobile development.",
    "udemyCta": "Browse Udemy courses",
    "kidsTag": "For kids & teens · Ages 6–18",
    "kidsTitle": "Kids Coding Bootcamp",
    "kidsDescription": "Live online coding, direct interaction, and 80% practical learning — from games to Python.",
    "kidsCta": "Discover kids coding"
  }
}
  });
})();
