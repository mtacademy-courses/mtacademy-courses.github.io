/** Shared academy identity and contact facts. No offering-specific promotions or statistics. */
(() => {
  "use strict";
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
      "interface": {
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
      "interface": {
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
