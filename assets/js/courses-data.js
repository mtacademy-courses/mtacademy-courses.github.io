/**
 * MT Academy content source of truth.
 *
 * Shared facts and URLs live once at the top level. All Arabic and English UI
 * copy lives in `siteConfig.translations`; course copy lives in each course's
 * `translations` object. The renderer reads the single, deeply frozen global
 * `window.MTAcademyData`.
 */
(function exposeMTAcademyData() {
  "use strict";

  const siteConfig = {
    brandName: "MT Academy",
    siteUrl: "https://mtacademy-courses.github.io/",
    defaultLocale: "ar",
    locales: [
      {
        code: "ar",
        label: "العربية",
        shortLabel: "ع",
        direction: "rtl"
      },
      {
        code: "en",
        label: "English",
        shortLabel: "EN",
        direction: "ltr"
      }
    ],
    logo: {
      src: "./assets/images/brand/mt-academy-logo.jpg",
      alt: "MT Academy",
      width: 1000,
      height: 1000
    },
    colors: {
      background: "#f8f6f2",
      surface: "#ffffff",
      primary: "#c9a84c",
      accent: "#0a0a0a",
      text: "#0a0a0a"
    },
    seo: {
      canonicalUrl: "https://mtacademy-courses.github.io/",
      socialImage: "./assets/images/brand/social-preview.png"
    },
    contact: {
      whatsapp: "https://wa.me/201032105166",
      email: "",
      phone: "",
      enrollmentUrl: "https://www.udemy.com/user/mohamed-tamer-15/"
    },
    socialLinks: [
      {
        id: "udemy",
        platform: "Udemy",
        url: "https://www.udemy.com/user/mohamed-tamer-15/"
      }
    ],
    instructorProfile: {
      image: {
        src: "./assets/images/Me.png",
        width: 948,
        height: 1659,
        alt: "Mohamed Tamer"
      },
      totalLearners: "21,682",
      totalReviews: "731"
    },
    reviewsGallery: {
      images: Array.from({ length: 31 }, (_, index) => ({
        src: `./assets/images/reviews/${index + 1}.png`,
        width: 960,
        height: 1200
      }))
    },
    paymentMethods: [
      {
        id: "udemy",
        image: {
          src: "./assets/images/payment/udemy.webp",
          width: 720,
          height: 420
        },
        contactRequired: false,
        translations: {
          ar: {
            name: "Udemy",
            description: "الدفع بالكريدت كارد.",
            imageAlt: "صورة توضيحية لطريقة الدفع عبر Udemy"
          },
          en: {
            name: "Udemy",
            description: "Pay by credit card.",
            imageAlt: "Illustration for paying with Udemy"
          }
        }
      },
      {
        id: "vodafone-cash",
        image: {
          src: "./assets/images/payment/vodafone-cash.webp",
          width: 720,
          height: 420
        },
        contactRequired: true,
        translations: {
          ar: {
            name: "فودافون كاش",
            description: "سهولة وسرعة. تواصل خاص عبر واتساب.",
            imageAlt: "صورة توضيحية لطريقة الدفع عبر فودافون كاش"
          },
          en: {
            name: "Vodafone Cash",
            description: "Quick and easy. Contact us privately on WhatsApp.",
            imageAlt: "Illustration for paying with Vodafone Cash"
          }
        }
      },
      {
        id: "instapay",
        image: {
          src: "./assets/images/payment/instapay.webp",
          width: 720,
          height: 420
        },
        contactRequired: true,
        translations: {
          ar: {
            name: "إنستا باي",
            description: "دفع أونلاين بكل سهولة. تواصل خاص عبر واتساب.",
            imageAlt: "صورة توضيحية لطريقة الدفع عبر إنستا باي"
          },
          en: {
            name: "InstaPay",
            description: "Easy online payment. Contact us privately on WhatsApp.",
            imageAlt: "Illustration for paying with InstaPay"
          }
        }
      },
      {
        id: "paypal",
        image: {
          src: "./assets/images/payment/paypal.webp",
          width: 720,
          height: 420
        },
        contactRequired: true,
        translations: {
          ar: {
            name: "باي بال",
            description: "دفع آمن ومريح. تواصل خاص عبر واتساب.",
            imageAlt: "صورة توضيحية لطريقة الدفع عبر باي بال"
          },
          en: {
            name: "PayPal",
            description: "Secure and convenient payment. Contact us privately on WhatsApp.",
            imageAlt: "Illustration for paying with PayPal"
          }
        }
      }
    ],
    translations: {
      ar: {
        seo: {
          title: "كورسات البرمجة بالعربي | MT Academy",
          description: "اكتشف كورسات MT Academy باللغة العربية في هندسة البرمجيات، وقواعد البيانات، وتطوير الويب، وKotlin، وAndroid، وبناء REST APIs.",
          socialImageAlt: "MT Academy — كورسات برمجة باللغة العربية"
        },
        navigation: [
          { label: "الرئيسية", href: "#top" },
          { label: "الكورسات", href: "#courses" },
          { label: "المدرّس", href: "#instructor" },
          { label: "التقييمات", href: "#reviews" },
          { label: "طرق الدفع", href: "#payment" },
          { label: "تواصل معنا", href: "#contact" }
        ],
        headerCta: {
          label: "تواصل عبر واتساب"
        },
        hero: {
          eyebrow: "تعلّم البرمجة باللغة العربية",
          title: "طوّر مهاراتك البرمجية مع MT Academy",
          description: "تصفّح كورسات البرمجة المتاحة باللغة العربية، من أساسيات الويب وقواعد البيانات إلى Kotlin وتطوير Android وبناء REST APIs.",
          topics: ["هندسة البرمجيات", "قواعد البيانات", "تطوير الويب", "Kotlin", "Android", "REST APIs"],
          cta: {
            label: "استعرض الكورسات",
            href: "#courses"
          },
          secondaryCta: {
            label: "صفحة المدرّس على Udemy",
            href: "https://www.udemy.com/user/mohamed-tamer-15/"
          }
        },
        instructor: {
          eyebrow: "المدرّس",
          name: "محمد تامر",
          headline: "مهندس برمجيات | سابقًا في السويدي إليكتريك | المؤسس والرئيس التنفيذي | مدرّس على Udemy | موجّه مهني | دبلومة دراسات عليا في علوم الحاسب | ITIL® v4 | كاتب مقالات تقنية",
          learnersLabel: "إجمالي المتعلمين",
          reviewsLabel: "التقييمات",
          summary: [
            "أنا محمد تامر، مهندس برمجيات ومدرّس تقني وصانع محتوى وموجّه وكاتب تقني، أمتلك أكثر من 7 سنوات من الخبرة في تطوير البرمجيات.",
            "أنا المؤسس والرئيس التنفيذي لشركة MT Software Solutions، حيث أعمل على برمجيات المؤسسات والحلول الرقمية، كما أسست MT Academy لمساعدة المطورين على بناء مهارات عملية واتخاذ قرارات مهنية أفضل."
          ],
          moreLabel: "اقرأ النبذة الكاملة",
          biography: [
            "بدأت رحلتي في هندسة البرمجيات بالتعلّم الذاتي المكثف من دون موجّه رسمي. هذه التجربة شكّلت أسلوبي في الهندسة اليوم: فهم الأساسيات بعمق، وحل المشكلات بطريقة منهجية، وبناء حلول عملية وقابلة للتوسع والصيانة.",
            "عملت لمدة عامين في تطوير تطبيقات Android Native باستخدام Java وKotlin، ثم قضيت ثلاث سنوات مهندس برمجيات في السويدي إليكتريك، وشاركت في تكامل الأنظمة المعقدة، وتطوير الأنظمة الخلفية، وحلول RFID، وقواعد بيانات المؤسسات، وتطبيقات Oracle APEX.",
            "أعمل أيضًا مدرّسًا على Udemy منذ أكثر من ثلاث سنوات، ودرّست لأكثر من 21,000 طالب حول العالم. وخلال العامين الماضيين عملت مباشرة مع أكثر من 133 متدرّبًا من أكثر من 14 دولة في جلسات توجيه فردية، وساعدتهم على تطوير مهاراتهم والاستعداد للفرص واتخاذ قرارات مهنية أوضح، وحصل هذا العمل على أكثر من 133 تقييمًا.",
            "أدرس حاليًا دبلومة دراسات عليا في علوم الحاسب بجامعة القاهرة، مع التركيز على هندسة الحاسب ومعمارية البرمجيات وتصميم الأنظمة.",
            "أساهم كذلك في مشاريع مفتوحة المصدر، وأكتب مقالات تقنية عن المبادئ الهندسية والمعمارية وتطوير البرمجيات في الواقع العملي. وقد تم تقدير نشاطي على GitHub ضمن تصنيفات المطورين الإقليمية، ومنها المركز 64 بين المطورين المؤثرين في أفريقيا والمركز 88 في مصر وفقًا للمساهمات العامة.",
            "يدفعني التعلّم المستمر والهندسة العملية ومشاركة المعرفة التي تساعد الناس على بناء مسارات مهنية أقوى وبرمجيات أفضل."
          ],
          focusTitle: "مجالات التركيز والخبرة",
          focusAreas: [
            "معمارية البرمجيات وتصميم الأنظمة: Microservices وAPIs وأنماط التصميم والأنظمة القابلة للتوسع.",
            "الأنظمة الخلفية والموزعة: Java وKotlin وSpring Boot وNode.js وASP.NET وKafka وRabbitMQ.",
            "قواعد البيانات: Oracle Database وPostgreSQL وMongoDB وSQL وNoSQL وPL/SQL.",
            "السحابة وDevOps: OCI وDocker وKubernetes ومسارات النشر.",
            "حلول المؤسسات: ERP وCRM وEdTech وتكامل الأنظمة وRFID/QR وOracle APEX.",
            "تطوير الموبايل والويب: Android Native وiOS وتقنيات الويب.",
            "هندسة الحاسب والأنظمة المدمجة والبرمجة منخفضة المستوى."
          ]
        },
        reviewsSection: {
          eyebrow: "آراء المتعلمين",
          title: "تقييمات طلاب MT Academy",
          description: "نماذج حقيقية من تقييمات المتعلمين على كورساتنا في Udemy.",
          previousLabel: "عرض مجموعة التقييمات السابقة",
          nextLabel: "عرض مجموعة التقييمات التالية",
          pageTemplate: "{current} / {total}",
          imageAltPrefix: "صورة تقييم طالب رقم"
        },
        catalog: {
          eyebrow: "الكورسات المتاحة",
          title: "اختر الكورس المناسب لك",
          description: "ابحث بالعنوان أو المجال أو الموضوع، ثم انتقل إلى صفحة الكورس على Udemy.",
          allCoursesLabel: "كل الكورسات",
          searchLabel: "ابحث في الكورسات",
          searchPlaceholder: "ابحث عن كورس أو موضوع…",
          clearSearchLabel: "مسح البحث",
          resultCountTemplate: "{count} كورس",
          emptyTitle: "لا توجد نتائج مطابقة",
          emptyDescription: "جرّب كلمة بحث أخرى أو اختر كل الكورسات.",
          resetFiltersLabel: "إعادة ضبط البحث",
          showMoreTagsLabel: "عرض {count} من الوسوم الإضافية لكورس {title}",
          hideMoreTagsLabel: "إخفاء الوسوم الإضافية لكورس {title}",
          closeTagsLabel: "إغلاق",
          searchEnabledFrom: 5
        },
        courseDetails: {
          dialogLabel: "تفاصيل الكورس",
          closeLabel: "إغلاق التفاصيل",
          detailsLabel: "عرض التفاصيل",
          instructorLabel: "المدرّس",
          languageLabel: "اللغة",
          levelLabel: "المستوى",
          durationLabel: "المدة",
          lessonCountLabel: "عدد الدروس",
          learningOutcomesTitle: "ماذا ستتعلم",
          curriculumTitle: "محتوى الكورس",
          enrollmentLabel: "عرض الكورس على Udemy",
          shareLabel: "نسخ رابط الكورس",
          shareSuccessLabel: "تم نسخ رابط الكورس",
          ratingLabel: "التقييم",
          reviewsLabel: "{count} تقييم",
          outOfLabel: "من {max}"
        },
        contactSection: {
          eyebrow: "هل تحتاج مساعدة؟",
          title: "ابدأ من المسار المناسب لهدفك",
          description: "راسلنا للاستفسار عن الكورسات أو خيارات الدفع المتاحة خارج Udemy.",
          whatsappLabel: "واتساب",
          udemyLabel: "Udemy"
        },
        payment: {
          eyebrow: "خيارات مرنة",
          title: "طرق الدفع المتاحة",
          description: "اختر طريقة الدفع المناسبة. للمدفوعات خارج Udemy، تواصل معنا عبر واتساب.",
          contactLabel: "تواصل عبر واتساب"
        },
        faq: {
          eyebrow: "معلومات سريعة",
          title: "الأسئلة الشائعة",
          description: "إجابات عن أكثر الأسئلة شيوعًا.",
          items: []
        },
        footer: {
          statement: "كورسات برمجة باللغة العربية من MT Academy.",
          navigationTitle: "روابط سريعة",
          categoriesTitle: "مجالات الكورسات",
          contactTitle: "تواصل معنا",
          whatsappLabel: "واتساب",
          udemyProfileLabel: "صفحة المدرّس على Udemy",
          copyright: "© 2026 MT Academy."
        },
        interface: {
          skipToContentLabel: "انتقل إلى المحتوى الرئيسي",
          openMenuLabel: "فتح قائمة التنقل",
          closeMenuLabel: "إغلاق قائمة التنقل",
          externalLinkLabel: "يفتح في نافذة جديدة",
          languageSwitcherLabel: "تغيير اللغة",
          primaryNavigationLabel: "التنقل الرئيسي",
          mobileNavigationLabel: "التنقل على الهاتف",
          catalogControlsLabel: "أدوات البحث وتصفية الكورسات",
          categoryFilterLabel: "تصفية الكورسات حسب المجال",
          paymentMethodsLabel: "طرق الدفع المتاحة",
          courseRatingLabelTemplate: "تقييم {value} من {max} بناءً على {count} تقييم",
          reviewCountTemplate: "{count} تقييم",
          starRatingLabel: "التقييم بالنجوم",
          brandHomeLabel: "MT Academy - الصفحة الرئيسية",
          backToTopLabel: "العودة إلى أعلى الصفحة",
          heroTopicsLabel: "مجالات التعلّم"
        },
        errorPage: {
          pageTitle: "الصفحة غير موجودة | MT Academy",
          title: "الصفحة غير موجودة",
          description: "تعذّر العثور على الصفحة التي تبحث عنها.",
          homeLabel: "العودة إلى الصفحة الرئيسية",
          languageSwitcherLabel: "تغيير اللغة"
        }
      },
      en: {
        seo: {
          title: "Arabic Programming Courses | MT Academy",
          description: "Explore MT Academy courses taught in Arabic across software engineering, databases, web development, Kotlin, Android, and REST API development.",
          socialImageAlt: "MT Academy — programming courses taught in Arabic"
        },
        navigation: [
          { label: "Home", href: "#top" },
          { label: "Courses", href: "#courses" },
          { label: "Instructor", href: "#instructor" },
          { label: "Reviews", href: "#reviews" },
          { label: "Payment", href: "#payment" },
          { label: "Contact", href: "#contact" }
        ],
        headerCta: {
          label: "Contact on WhatsApp"
        },
        hero: {
          eyebrow: "Learn programming in Arabic",
          title: "Build your programming skills with MT Academy",
          description: "Explore programming courses taught in Arabic, from web and database fundamentals to Kotlin, Android development, and REST APIs.",
          topics: ["Software Engineering", "Databases", "Web Development", "Kotlin", "Android", "REST APIs"],
          cta: {
            label: "Explore courses",
            href: "#courses"
          },
          secondaryCta: {
            label: "Instructor page on Udemy",
            href: "https://www.udemy.com/user/mohamed-tamer-15/"
          }
        },
        instructor: {
          eyebrow: "Instructor",
          name: "Mohamed Tamer",
          headline: "Software Engineer | Ex- Elsewedy Electric | Founder & CEO | Udemy Instructor | Mentor | Computer Science Postgraduate Diploma | ITIL® v4 | Technical Articles Writer",
          learnersLabel: "Total learners",
          reviewsLabel: "Reviews",
          summary: [
            "I’m Mohamed Tamer, a Software Engineer, technical educator, content creator, mentor, and technical writer with 7+ years of experience in software development.",
            "I’m the Founder & CEO of MT Software Solutions, where I work on enterprise software and digital solutions, and the Founder & Mentor at MT Academy, where I help developers build practical skills and make better career decisions."
          ],
          moreLabel: "Read the full bio",
          biography: [
            "My journey into software engineering began with intensive self-study and no formal mentor. That experience shaped how I approach engineering today: learning the fundamentals deeply, solving problems systematically, and building solutions that are practical, scalable, and maintainable.",
            "I spent two years in Android Native development using Java and Kotlin, followed by three years as a Software Engineer at Elsewedy Electric. There, I worked on complex system integrations, backend development, RFID solutions, enterprise databases, and low-code applications using Oracle APEX.",
            "For more than three years, I have also been a Udemy instructor, teaching over 21,000 students worldwide. Over the past two years, I have worked directly with 133+ mentees from 14+ countries through 1:1 mentorship, helping them develop their technical skills, prepare for opportunities, and make clearer career decisions. This work has received 133+ reviews.",
            "I’m currently pursuing a postgraduate diploma in Computer Science at Cairo University, focusing on Computer Engineering, Software Architecture, and System Design.",
            "I also contribute to open-source projects and write technical articles about engineering principles, architecture, and real-world software development. My GitHub work has been recognized in regional developer rankings, including #64 among influential developers in Africa and #88 in Egypt by public contributions.",
            "I’m driven by continuous learning, practical engineering, and sharing knowledge that helps people build stronger careers and better software."
          ],
          focusTitle: "Main areas of focus",
          focusAreas: [
            "Software Architecture & System Design: microservices, APIs, design patterns, and scalable systems.",
            "Backend & Distributed Systems: Java, Kotlin, Spring Boot, Node.js, ASP.NET, Kafka, and RabbitMQ.",
            "Databases: Oracle Database, PostgreSQL, MongoDB, SQL, NoSQL, and PL/SQL.",
            "Cloud & DevOps: OCI, Docker, Kubernetes, and deployment workflows.",
            "Enterprise Solutions: ERP, CRM, EdTech, system integration, RFID/QR, and Oracle APEX.",
            "Mobile & Web Development: Android Native, iOS, and web technologies.",
            "Computer Engineering, embedded systems, and low-level programming."
          ]
        },
        reviewsSection: {
          eyebrow: "Learner feedback",
          title: "MT Academy student reviews",
          description: "A selection of real learner feedback from our courses on Udemy.",
          previousLabel: "Show the previous group of reviews",
          nextLabel: "Show the next group of reviews",
          pageTemplate: "{current} / {total}",
          imageAltPrefix: "Student review image"
        },
        catalog: {
          eyebrow: "Available courses",
          title: "Choose the right course for you",
          description: "Search by title, field, or topic, then continue to the course page on Udemy.",
          allCoursesLabel: "All courses",
          searchLabel: "Search courses",
          searchPlaceholder: "Search for a course or topic…",
          clearSearchLabel: "Clear search",
          resultCountTemplate: "{count} courses",
          emptyTitle: "No matching results",
          emptyDescription: "Try another search term or select all courses.",
          resetFiltersLabel: "Reset search",
          showMoreTagsLabel: "Show {count} more tags for {title}",
          hideMoreTagsLabel: "Hide additional tags for {title}",
          closeTagsLabel: "Close",
          searchEnabledFrom: 5
        },
        courseDetails: {
          dialogLabel: "Course details",
          closeLabel: "Close course details",
          detailsLabel: "View details",
          instructorLabel: "Instructor",
          languageLabel: "Language",
          levelLabel: "Level",
          durationLabel: "Duration",
          lessonCountLabel: "Lessons",
          learningOutcomesTitle: "What you will learn",
          curriculumTitle: "Course content",
          enrollmentLabel: "View course on Udemy",
          shareLabel: "Copy course link",
          shareSuccessLabel: "Course link copied",
          ratingLabel: "Rating",
          reviewsLabel: "{count} ratings",
          outOfLabel: "out of {max}"
        },
        contactSection: {
          eyebrow: "Need help?",
          title: "Start with the path that fits your goal",
          description: "Message us with questions about the courses or payment options available outside Udemy.",
          whatsappLabel: "WhatsApp",
          udemyLabel: "Udemy"
        },
        payment: {
          eyebrow: "Flexible options",
          title: "Available payment methods",
          description: "Choose a suitable payment method. For payments outside Udemy, contact us on WhatsApp.",
          contactLabel: "Contact on WhatsApp"
        },
        faq: {
          eyebrow: "Quick information",
          title: "Frequently asked questions",
          description: "Answers to frequently asked questions.",
          items: []
        },
        footer: {
          statement: "Programming courses taught in Arabic by MT Academy.",
          navigationTitle: "Quick links",
          categoriesTitle: "Course fields",
          contactTitle: "Contact us",
          whatsappLabel: "WhatsApp",
          udemyProfileLabel: "Instructor page on Udemy",
          copyright: "© 2026 MT Academy."
        },
        interface: {
          skipToContentLabel: "Skip to main content",
          openMenuLabel: "Open navigation menu",
          closeMenuLabel: "Close navigation menu",
          externalLinkLabel: "Opens in a new window",
          languageSwitcherLabel: "Change language",
          primaryNavigationLabel: "Primary navigation",
          mobileNavigationLabel: "Mobile navigation",
          catalogControlsLabel: "Course search and filter controls",
          categoryFilterLabel: "Filter courses by field",
          paymentMethodsLabel: "Available payment methods",
          courseRatingLabelTemplate: "{value} out of {max} from {count} ratings",
          reviewCountTemplate: "{count} ratings",
          starRatingLabel: "Star rating",
          brandHomeLabel: "MT Academy home",
          backToTopLabel: "Back to top",
          heroTopicsLabel: "Course topics"
        },
        errorPage: {
          pageTitle: "Page not found | MT Academy",
          title: "Page not found",
          description: "We could not find the page you are looking for.",
          homeLabel: "Return to the home page",
          languageSwitcherLabel: "Change language"
        }
      }
    }
  };

  const courses = [
    {
      id: "course-001",
      slug: "master-solid-principles-arabic",
      image: {
        src: "./assets/images/courses/master-solid-principles.webp",
        width: 1200,
        height: 1200
      },
      instructor: "Mohamed Tamer",
      rating: {
        value: 4.4,
        max: 5,
        reviewCount: 119
      },
      price: null,
      featured: false,
      enrollmentUrl: "https://www.udemy.com/course/master-solid-principles-arabic/?couponCode=MT-SOLID-AUG-2026",
      status: "available",
      translations: {
        ar: {
          title: "إتقان مبادئ SOLID [بالعربية]",
          category: "هندسة البرمجيات",
          shortDescription: "إتقان مبادئ SOLID لكتابة كود متين وقابل للصيانة.",
          fullDescription: "",
          tags: ["SOLID", "الكود النظيف", "مبادئ التصميم", "معمارية قابلة للصيانة"],
          learningOutcomes: [
            "مبدأ المسؤولية الواحدة (SRP)",
            "مبدأ الانفتاح والإغلاق (OCP)",
            "مبدأ استبدال ليسكوف (LSP)",
            "مبدأ فصل الواجهات (ISP)",
            "مبدأ عكس الاعتماد (DIP)"
          ],
          curriculum: [],
          level: "",
          language: "العربية",
          ctaLabel: "عرض الكورس على Udemy",
          imageAlt: "غلاف كورس إتقان مبادئ SOLID من MT Academy"
        },
        en: {
          title: "Master SOLID Principles [Arabic]",
          category: "Software Engineering",
          shortDescription: "Mastering SOLID Principles for Robust and Maintainable Code.",
          fullDescription: "",
          tags: ["SOLID", "Clean Code", "Design Principles", "Maintainable Architecture"],
          learningOutcomes: [
            "Single Responsibility Principle (SRP)",
            "Open/Closed Principle (OCP)",
            "Liskov Substitution Principle (LSP)",
            "Interface Segregation Principle (ISP)",
            "Dependency Inversion Principle (DIP)"
          ],
          curriculum: [],
          level: "",
          language: "Arabic",
          ctaLabel: "View course on Udemy",
          imageAlt: "MT Academy cover for Master SOLID Principles"
        }
      }
    },
    {
      id: "course-002",
      slug: "master-oracle-database-sql-arabic",
      image: {
        src: "./assets/images/courses/master-oracle-database-sql.webp",
        width: 1200,
        height: 1200
      },
      instructor: "Mohamed Tamer",
      rating: {
        value: 4.5,
        max: 5,
        reviewCount: 46
      },
      price: null,
      featured: false,
      enrollmentUrl: "https://www.udemy.com/course/master-oracle-database-sql-arabic/?couponCode=MT-ORACLE-AUG-2026",
      status: "available",
      translations: {
        ar: {
          title: "إتقان Oracle Database SQL [بالعربية]",
          category: "تصميم قواعد البيانات وتطويرها",
          shortDescription: "أتقن Oracle SQL من الأساسيات إلى التقنيات المتقدمة باللغة العربية.",
          fullDescription: "",
          tags: ["Oracle SQL", "مفاهيم RDBMS", "معمارية Oracle 11g", "تقنيات SQL المتقدمة"],
          learningOutcomes: [
            "إتقان مفاهيم Oracle Database وRDBMS.",
            "تنزيل Oracle Database 11g وتثبيته.",
            "استكشاف معمارية Oracle Database 11g.",
            "إنشاء اتصالات موثوقة بقواعد البيانات."
          ],
          curriculum: [],
          level: "",
          language: "العربية",
          ctaLabel: "عرض الكورس على Udemy",
          imageAlt: "غلاف كورس إتقان Oracle Database SQL من MT Academy"
        },
        en: {
          title: "Master Oracle Database SQL [Arabic]",
          category: "Database Design & Development",
          shortDescription: "Master Oracle SQL: From Basics to Advanced Techniques in Arabic.",
          fullDescription: "",
          tags: ["Oracle SQL", "RDBMS Concepts", "Oracle 11g Architecture", "Advanced SQL Techniques"],
          learningOutcomes: [
            "Master Oracle Database and RDBMS concepts.",
            "Download and install Oracle Database 11g.",
            "Explore Oracle Database 11g Architecture.",
            "Establish reliable database connections."
          ],
          curriculum: [],
          level: "",
          language: "Arabic",
          ctaLabel: "View course on Udemy",
          imageAlt: "MT Academy cover for Master Oracle Database SQL"
        }
      }
    },
    {
      id: "course-003",
      slug: "learn-html-full-tutorial-arabic",
      image: {
        src: "./assets/images/courses/learn-html-full-tutorial.webp",
        width: 1200,
        height: 1200
      },
      instructor: "Mohamed Tamer",
      rating: {
        value: 4.8,
        max: 5,
        reviewCount: 49
      },
      price: null,
      featured: false,
      enrollmentUrl: "https://www.udemy.com/course/learn-html-full-tutorial-arabic/?couponCode=MT-HTML-AUG-2026",
      status: "available",
      translations: {
        ar: {
          title: "تعلّم HTML – شرح كامل [بالعربية]",
          category: "تطوير الويب",
          shortDescription: "أتقن HTML من البداية باللغة العربية، وابنِ مواقع ويب حديثة بثقة.",
          fullDescription: "",
          tags: ["HTML", "بنية HTML", "HTML وCSS", "النماذج والوسائط"],
          learningOutcomes: [
            "كتابة HTML منظم ونظيف باستخدام العناصر والسمات.",
            "استخدام HTML وCSS معًا لإنشاء صفحات ويب متجاوبة.",
            "إنشاء النماذج وجمع البيانات باستخدام أنواع الإدخال والسمات.",
            "تضمين الصور ومقاطع الفيديو وCanvas وSVG."
          ],
          curriculum: [],
          level: "",
          language: "العربية",
          ctaLabel: "عرض الكورس على Udemy",
          imageAlt: "غلاف كورس تعلّم HTML – شرح كامل من MT Academy"
        },
        en: {
          title: "Learn HTML – Full Tutorial [Arabic]",
          category: "Web Development",
          shortDescription: "Master HTML from Scratch in Arabic: Build Modern Websites with Confidence.",
          fullDescription: "",
          tags: ["HTML", "HTML Structure", "HTML & CSS", "Forms & Media"],
          learningOutcomes: [
            "Write clean and well-structured HTML using elements and attributes.",
            "Use HTML and CSS together to create responsive web pages.",
            "Create forms and collect data with input types and attributes.",
            "Embed images, videos, Canvas, and SVG."
          ],
          curriculum: [],
          level: "",
          language: "Arabic",
          ctaLabel: "View course on Udemy",
          imageAlt: "MT Academy cover for Learn HTML – Full Tutorial"
        }
      }
    },
    {
      id: "course-004",
      slug: "kotlin-for-beginners-arabic",
      image: {
        src: "./assets/images/courses/kotlin-for-beginners.webp",
        width: 1200,
        height: 1200
      },
      instructor: "Mohamed Tamer",
      rating: {
        value: 4.3,
        max: 5,
        reviewCount: 264
      },
      price: null,
      featured: false,
      enrollmentUrl: "https://www.udemy.com/course/kotlin-course-arabic/?couponCode=MT-KOTLIN-AUG-2026",
      status: "available",
      translations: {
        ar: {
          title: "Kotlin للمبتدئين: من الصفر إلى الاحتراف [بالعربية]",
          category: "لغات البرمجة",
          shortDescription: "تعلّم برمجة Kotlin واستعد لبناء التطبيقات والألعاب والمواقع باستخدام لغة بسيطة وحديثة.",
          fullDescription: "",
          tags: ["Kotlin", "مناسب للمبتدئين", "مشاريع عملية"],
          learningOutcomes: [
            "فهم أساسيات لغة البرمجة Kotlin.",
            "التعامل مع المتغيرات وأنواع البيانات والعوامل الأساسية.",
            "إنشاء الدوال واستخدامها بفاعلية في Kotlin.",
            "كتابة كود Kotlin نظيف وسهل القراءة بصياغة صحيحة.",
            "استخدام الشروط والحلقات للتحكم في تدفق البرامج.",
            "تطبيق مبادئ البرمجة كائنية التوجه."
          ],
          curriculum: [],
          level: "مبتدئ",
          language: "العربية",
          ctaLabel: "عرض الكورس على Udemy",
          imageAlt: "غلاف كورس Kotlin للمبتدئين من MT Academy"
        },
        en: {
          title: "Kotlin for Beginners: From Zero to Hero [Arabic]",
          category: "Programming Languages",
          shortDescription: "Learn Kotlin programming and get ready to build apps, games, and websites using a simple and modern language.",
          fullDescription: "",
          tags: ["Kotlin", "Beginner Friendly", "Practical Projects"],
          learningOutcomes: [
            "Understand the fundamentals of the Kotlin programming language.",
            "Work with variables, data types, and basic operators.",
            "Create and use functions effectively in Kotlin.",
            "Write clean and readable Kotlin code with proper syntax.",
            "Use conditionals and loops to control program flow.",
            "Apply object-oriented programming principles."
          ],
          curriculum: [],
          level: "Beginner",
          language: "Arabic",
          ctaLabel: "View course on Udemy",
          imageAlt: "MT Academy cover for Kotlin for Beginners"
        }
      }
    },
    {
      id: "course-005",
      slug: "android-kotlin-development-arabic",
      image: {
        src: "./assets/images/courses/android-kotlin-development.webp",
        width: 1200,
        height: 1200
      },
      instructor: "Mohamed Tamer",
      rating: {
        value: 4.4,
        max: 5,
        reviewCount: 223
      },
      price: null,
      featured: false,
      enrollmentUrl: "https://www.udemy.com/course/android-kotlin-development-from-zero-to-hero-2022-arabic/?couponCode=MT-ANDROID-AUG-2026",
      status: "available",
      translations: {
        ar: {
          title: "تطوير Android باستخدام Kotlin: من الصفر إلى الاحتراف [بالعربية]",
          category: "تطوير تطبيقات الهاتف",
          shortDescription: "أتقن تطوير تطبيقات Android باستخدام Kotlin، وابنِ تطبيقات واقعية من البداية.",
          fullDescription: "",
          tags: ["Android", "Kotlin", "مناسب للمبتدئين", "مشاريع عملية"],
          learningOutcomes: [
            "بناء تطبيقات Android عملية من البداية باستخدام Kotlin.",
            "فهم أساسيات Android، بما فيها Activities وIntents وLifecycles.",
            "تصميم واجهات المستخدم باستخدام مكونات Material Design.",
            "استخدام ListView وRecyclerView لعرض البيانات الديناميكية."
          ],
          curriculum: [],
          level: "مبتدئ",
          language: "العربية",
          ctaLabel: "عرض الكورس على Udemy",
          imageAlt: "غلاف كورس تطوير Android باستخدام Kotlin من MT Academy"
        },
        en: {
          title: "Android Kotlin Development: From Zero to Hero [Arabic]",
          category: "Mobile Development",
          shortDescription: "Master Android App Development with Kotlin: Build Real-World Applications from Scratch.",
          fullDescription: "",
          tags: ["Android", "Kotlin", "Beginner Friendly", "Practical Projects"],
          learningOutcomes: [
            "Build functional Android apps from scratch using Kotlin.",
            "Understand Android fundamentals including Activities, Intents, and Lifecycles.",
            "Design user interfaces using Material Design components.",
            "Work with ListView and RecyclerView to display dynamic data."
          ],
          curriculum: [],
          level: "Beginner",
          language: "Arabic",
          ctaLabel: "View course on Udemy",
          imageAlt: "MT Academy cover for Android Kotlin Development"
        }
      }
    },
    {
      id: "course-006",
      slug: "ktor-rest-api-arabic",
      image: {
        src: "./assets/images/courses/ktor-rest-api.webp",
        width: 1200,
        height: 1200
      },
      instructor: "Mohamed Tamer",
      rating: {
        value: 4.9,
        max: 5,
        reviewCount: 10
      },
      price: null,
      featured: false,
      enrollmentUrl: "https://www.udemy.com/course/ktor-restapi-arabic-2024/?couponCode=MT-KTOR-AUG-2026",
      status: "available",
      translations: {
        ar: {
          title: "بناء REST API باستخدام Ktor - واجهة CRUD [بالعربية]",
          category: "تطوير الويب",
          shortDescription: "أتقن Ktor من خلال بناء REST API كاملة لعمليات CRUD من البداية — دليل شامل باللغة العربية.",
          fullDescription: "",
          tags: ["Ktor", "REST API", "عمليات CRUD", "البرمجة غير المتزامنة"],
          learningOutcomes: [
            "تطوير تطبيقات ويب وREST APIs باستخدام التوجيه والطلبات والاستجابات في Ktor.",
            "استخدام Kotlin Coroutines للبرمجة غير المتزامنة في Ktor.",
            "ربط تطبيقات Ktor بقواعد البيانات وتنفيذ عمليات CRUD.",
            "اختبار تطبيقات Ktor ونشرها."
          ],
          curriculum: [],
          level: "",
          language: "العربية",
          ctaLabel: "عرض الكورس على Udemy",
          imageAlt: "غلاف كورس بناء REST API باستخدام Ktor من MT Academy"
        },
        en: {
          title: "Build a REST API with Ktor - CRUD API [Arabic]",
          category: "Web Development",
          shortDescription: "Master Ktor by Building a Complete CRUD REST API from Scratch — Comprehensive Arabic Guide.",
          fullDescription: "",
          tags: ["Ktor", "REST API", "CRUD Operations", "Asynchronous Programming"],
          learningOutcomes: [
            "Develop web applications and REST APIs with Ktor routing, requests, and responses.",
            "Use Kotlin coroutines for asynchronous programming in Ktor.",
            "Connect Ktor applications to databases and perform CRUD operations.",
            "Test and deploy Ktor applications."
          ],
          curriculum: [],
          level: "",
          language: "Arabic",
          ctaLabel: "View course on Udemy",
          imageAlt: "MT Academy cover for Build a REST API with Ktor"
        }
      }
    }
  ];

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) {
      return value;
    }

    Object.getOwnPropertyNames(value).forEach((property) => {
      deepFreeze(value[property]);
    });

    return Object.freeze(value);
  }

  Object.defineProperty(window, "MTAcademyData", {
    value: deepFreeze({ siteConfig, courses }),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
