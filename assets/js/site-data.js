/** Shared academy identity and contact facts. Instructor evidence is distinct from program enrollment; no offering promotions. */
(() => {
  "use strict";
  const linkedInUrl = 'https://www.linkedin.com/in/mohamedtamer0/';
  window.MTAcademySite = window.MTAcademyCore.deepFreeze({
  "brandName": "MT Academy",
  "siteUrl": "https://mtacademy-courses.github.io/",
  "defaultLocale": "ar",
  "locales": [
    {
      "code": "ar",
      "label": "العربية",
      "shortLabel": "ع",
      "direction": "rtl"
    },
    {
      "code": "en",
      "label": "English",
      "shortLabel": "EN",
      "direction": "ltr"
    }
  ],
  "logo": {
    "src": "/assets/images/brand/mt-academy-logo.jpg",
    "alt": "MT Academy",
    "width": 1000,
    "height": 1000
  },
  "colors": {
    "background": "#f8f6f2",
    "surface": "#ffffff",
    "primary": "#c9a84c",
    "accent": "#0a0a0a",
    "text": "#0a0a0a"
  },
  "contact": {
    "whatsapp": "https://wa.me/201032105166",
    "email": "",
    "phone": "",
    "enrollmentUrl": "https://www.udemy.com/user/mohamed-tamer-15/"
  },
  "socialLinks": [
    {
      "id": "udemy",
      "platform": "Udemy",
      "url": "https://www.udemy.com/user/mohamed-tamer-15/"
    }
  ],
  "instructorProfile": {
    "linkedinUrl": linkedInUrl,
    "statistics": {
      "qualification": "more-than",
      "professionalYearsOver": 8,
      "udemyLearnersOver": 21697,
      "udemyReviewsOver": 743,
      "mentorshipTraineesOver": 145,
      "mentorshipCountriesOver": 14
    },
    "name": "Mohamed Tamer",
    "image": {
      "src": "/assets/images/Me.png",
      "width": 948,
      "height": 1659,
      "alt": "Mohamed Tamer"
    }
  },
  "translations": {
    "ar": {
      "primaryNavigation": [{"label": "الرئيسية", "href": "/#top"}, {"label": "مسارات التعلّم", "href": "/#learning-paths"}, {"label": "المدرّس", "href": "/#instructor"}, {"label": "تقييمات Udemy", "href": "/#reviews"}, {"label": "طرق الدفع", "href": "/#payment"}, {"label": "تواصل معنا", "href": "/#contact"}],
      "learningNavigation": [{"label": "كورسات Udemy", "href": "/#courses"}, {"label": "برمجة الأطفال", "href": "/kids-coding-bootcamp/"}, {"label": "دبلومة Backend", "href": "/backend-development-diploma/"}],
      "learningOverviewLabel": "اكتشف كل المسارات",
      "interface": {
        "instructorLinkedInLabel": "حساب محمد تامر على LinkedIn",
        "skipToContentLabel": "انتقل إلى المحتوى الرئيسي",
        "openMenuLabel": "فتح قائمة التنقل",
        "closeMenuLabel": "إغلاق قائمة التنقل",
        "externalLinkLabel": "يفتح في نافذة جديدة",
        "languageSwitcherLabel": "تغيير اللغة",
        "primaryNavigationLabel": "التنقل الرئيسي",
        "mobileNavigationLabel": "التنقل على الهاتف",
        "brandHomeLabel": "MT Academy - الصفحة الرئيسية",
        "backToTopLabel": "العودة إلى أعلى الصفحة"
      }
    },
    "en": {
      "primaryNavigation": [{"label": "Home", "href": "/#top"}, {"label": "Learning paths", "href": "/#learning-paths"}, {"label": "Instructor", "href": "/#instructor"}, {"label": "Udemy reviews", "href": "/#reviews"}, {"label": "Payment", "href": "/#payment"}, {"label": "Contact", "href": "/#contact"}],
      "learningNavigation": [{"label": "Udemy courses", "href": "/#courses"}, {"label": "Kids coding", "href": "/kids-coding-bootcamp/"}, {"label": "Backend diploma", "href": "/backend-development-diploma/"}],
      "learningOverviewLabel": "Explore all learning paths",
      "interface": {
        "instructorLinkedInLabel": "Mohamed Tamer on LinkedIn",
        "skipToContentLabel": "Skip to main content",
        "openMenuLabel": "Open navigation menu",
        "closeMenuLabel": "Close navigation menu",
        "externalLinkLabel": "Opens in a new window",
        "languageSwitcherLabel": "Change language",
        "primaryNavigationLabel": "Primary navigation",
        "mobileNavigationLabel": "Mobile navigation",
        "brandHomeLabel": "MT Academy home",
        "backToTopLabel": "Back to top"
      }
    }
  }
});
})();
