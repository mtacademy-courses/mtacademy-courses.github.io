/** Confirmed study plan and qualified announcements; registration is not open. */
(() => {
  "use strict";
  const plan = {
    durationMonths: 9, studyWeeks: 36, sessionsPerWeek: 2, totalSessions: 72,
    maxSessionHours: 5, plannedInstructionHours: 360, projectCount: 9, projectsPerMonth: 1,
    cohortCapacity: { min: 15, max: 20 },
    start: { year: 2027, timing: 'beginning-of-year', status: 'tentative' },
    announcements: { registration: 'coming-soon', curriculum: 'coming-soon', price: 'coming-soon' }
  };
  // These are Mohamed Tamer's prior experience, never this diploma's results.
  const experience = window.MTAcademySite.instructorProfile.statistics;
  const learners = experience.udemyLearnersOver.toLocaleString('en-US');
  const weeklySessionsAr = plan.sessionsPerWeek === 2 ? 'جلستين' : `${plan.sessionsPerWeek} جلسات`;
  const capacity = `\u2066${plan.cohortCapacity.min}–${plan.cohortCapacity.max}\u2069`;
  window.MTAcademyBackend = window.MTAcademyCore.deepFreeze({
    id: 'backend-diploma',
    name: 'Backend Development Diploma with Java & Spring Boot',
    path: '/backend-development-diploma/',
    status: 'coming-soon',
    technologies: ['Java', 'Spring Boot'],
    plan, experience,
    instructor: { name: 'Mohamed Tamer', role: 'instructor-and-mentor' },
    evidenceLinks: { udemy: window.MTAcademySite.contact.enrollmentUrl, reviews: '/#reviews' },
    visual: { src: '/assets/images/backend/backend-development-diploma-box.webp', width: 1254, height: 1254, viewport: { left: 154, top: 37, width: 990, height: 1160 } },
    socialImage: '/assets/images/backend/backend-social-preview.png',
    translations: {
      ar: {
        visualAlt: 'غلاف دبلومة تطوير Backend باستخدام Java وSpring Boot من MT Academy',
        statusLabels: { 'coming-soon': 'قريبًا إن شاء الله' },
        seo: { title: 'دبلومة Backend باستخدام Java وSpring Boot — قريبًا | MT Academy', description: `ابدأ من الصفر مع Java وSpring Boot: ${plan.durationMonths} شهور، ${plan.totalSessions} جلسة و${plan.projectCount} مشاريع عملية، مع بشمهندس محمد تامر للشرح والتوجيه والمتابعة ومراجعة الكود (Code Review). الحجز قريبًا؛ البداية مبدئيًا أول ${plan.start.year}.`, socialImageAlt: 'MT Academy — دبلومة Backend باستخدام Java وSpring Boot، الحجز قريبًا' },
        card: { tag: 'المسار القادم · للمبتدئين من الصفر', title: 'دبلومة تطوير Backend', description: 'تطبيق عملي، مشاريع، متابعة ومراجعة للكود مع بشمهندس محمد تامر. الحجز قريبًا.', facts: `${plan.durationMonths} شهور · ${plan.totalSessions} جلسة · ${plan.projectCount} مشاريع عملية`, cta: 'اكتشف تفاصيل الدبلومة' },
        hero: { eyebrow: 'مسار جديد من MT Academy', title: 'دبلومة تطوير Backend', audience: 'للمبتدئين من الصفر', description: 'ابدأ تطوير الـ Backend من الصفر مع Java وSpring Boot، من خلال تطبيق عملي ومشاريع ومتابعة مستمرة مع بشمهندس محمد تامر.', summary: `${plan.durationMonths} شهور · خطة دراسة ${plan.studyWeeks} أسبوعًا · ${weeklySessionsAr} أسبوعيًا`, announcement: 'الحجز لسه ما اتفتحش. فتح باب الحجز قريبًا جدًا إن شاء الله.', detailsLabel: 'اكتشف خطة الدراسة', returnLabel: 'اكتشف كل مسارات التعلّم', contactLabel: 'استفسر عن الدبلومة' },
        overview: {
          eyebrow: 'خطة الدراسة', title: 'خطة واضحة للتعلّم والتطبيق.',
          description: 'دي المعلومات المعلنة عن مدة الدبلومة وحجم الدراسة. المحتوى التفصيلي هيتعلن قريبًا.',
          metrics: [
            { value: `${plan.durationMonths} شهور`, label: `خطة دراسة ${plan.studyWeeks} أسبوعًا` },
            { value: `${weeklySessionsAr}`, label: 'في الأسبوع' },
            { value: `${plan.totalSessions} جلسة`, label: 'إجمالي الجلسات' },
            { value: `حتى ${plan.maxSessionHours} ساعات`, label: 'شرح في الجلسة' },
            { value: `${plan.plannedInstructionHours} ساعة`, label: 'إجمالي الشرح المخطط' },
            { value: `${plan.projectCount} مشاريع`, label: 'مشروع عملي كل شهر' }
          ],
          hoursNote: `${plan.totalSessions} جلسة، بمدة تصل إلى ${plan.maxSessionHours} ساعات للجلسة، بإجمالي مخطط ${plan.plannedInstructionHours} ساعة شرح. وقت التكليفات والعمل المستقل على المشاريع إضافي خارج ساعات الشرح.`
        },
        practice: {
          eyebrow: 'تعلّم بالممارسة', title: 'هتكتب وتطبّق، وتفهم إزاي تحسّن شغلك.',
          description: 'أسلوب التعلّم العملي خلال الدبلومة؛ المحتوى التفصيلي لسه هيتعلن.',
          items: [
            { title: 'Live Coding بإيدك', description: 'تطبيق عملي بشكل مستمر. هتكتب الكود بنفسك خلال الجلسات وتشارك في التنفيذ، مش بس تتفرج على الشرح.' },
            { title: 'مشروع كل شهر', description: `كل شهر مشروع على اللي اتعلمته فيه، عشان في نهاية الدبلومة تكون اشتغلت على ${plan.projectCount} مشاريع عملية.` },
            { title: 'تكليفات وتدريبات · Assignments', description: 'تكليفات وتدريبات مستمرة عشان التطبيق ما يقفش عند وقت الجلسة، وتفضل تبني فهمك بالممارسة.' },
            { title: 'مراجعة الكود · Code Review', description: 'مراجعة للكود اللي بتكتبه عشان تفهم أخطاءك، وتحسّن طريقة تفكيرك وكتابتك للكود، وتكتب كود أنضف وأفضل.' },
            { title: 'موجّه للمتابعة والتوجيه', description: 'متابعة طول فترة الدراسة، ومساعدة في ترتيب خطواتك ومتابعة تقدّمك والمحافظة على استمرارية التطبيق.' },
            { title: 'استخدام AI بوعي', description: 'هتتعلم تستخدم AI بشكل عملي لتكتب كود أسرع وتحل المشاكل بذكاء، مع فهمك للكود ومن غير اعتماد كامل عليه.' }
          ]
        },
        mentor: {
          eyebrow: 'المدرّب والموجّه', name: 'بشمهندس محمد تامر', role: 'معاك في الشرح والمتابعة طول الدبلومة.',
          description: 'محمد تامر هيكون المدرّب والموجّه خلال الدبلومة: يوجّهك، يساعدك ترتّب خطواتك، ويتابع مستواك وتقدّمك في الدراسة والتطبيق.',
          experience: `خبرة أكتر من ${experience.professionalYearsOver} سنين في المجال.`,
          title: 'الدبلومة جديدة، لكن الخبرة اللي مبنية عليها مش جديدة.',
          stats: [
            { value: `${learners}+`, label: 'متعلّم على Udemy' },
            { value: `${experience.mentorshipTraineesOver}+`, label: 'متدرّب في المنتورشيب' },
            { value: `${experience.mentorshipCountriesOver}+`, label: 'دولة في المنتورشيب' }
          ],
          attribution: 'الأرقام دي عن خبرة محمد تامر السابقة في التدريس والتوجيه والمتابعة، مش أعداد طلاب أو نتائج للدبلومة الجديدة.',
          evidence: 'تقدر ترجع للتجارب والتقييمات الحقيقية الموجودة عن كورسات Udemy وتشوف بنفسك طريقة الشرح.',
          udemyLabel: 'ملف محمد تامر على Udemy', reviewsLabel: 'تقييمات كورسات Udemy', portraitAlt: 'بشمهندس محمد تامر، المدرّب والموجّه خلال الدبلومة'
        },
        cohort: { eyebrow: 'الدفعة الأولى', title: `${capacity} طالب فقط`, description: 'ده العدد المخطط للدفعة الأولى عشان نحافظ على جودة المتابعة، ومشاركة كل طالب في التطبيق، ومراجعة فردية (Code Review) للكود اللي بيكتبه.', note: 'دي سعة الدفعة المخططة؛ الحجز لسه ما اتفتحش.' },
        announcements: {
          eyebrow: 'الإعلانات القادمة', title: 'خطة الدراسة واضحة، وباقي التفاصيل قريبًا.',
          items: [
            { title: 'المحتوى التفصيلي', description: 'قريبًا جدًا إن شاء الله.' },
            { title: 'التكلفة', description: 'قريبًا جدًا إن شاء الله.' },
            { title: 'فتح باب الحجز', description: 'قريبًا جدًا إن شاء الله؛ الحجز غير متاح حاليًا.' },
            { title: 'البداية المبدئية', description: `الخطة المبدئية هي إن الدبلومة تبدأ في أول ${plan.start.year} إن شاء الله، والموعد النهائي هيتعلن قريبًا.` }
          ]
        },
        faq: { title: 'أسئلة عن الدبلومة', items: [
          { question: 'الدبلومة مناسبة لو ببدأ من الصفر؟', answer: 'أيوه، دبلومة Backend باستخدام Java وSpring Boot مخصصة للمبتدئين من الصفر.' },
          { question: 'مدة الدبلومة قد إيه؟', answer: `المدة المعلنة ${plan.durationMonths} شهور، بخطة دراسة ${plan.studyWeeks} أسبوعًا. المواعيد التفصيلية هتتعلن لاحقًا.` },
          { question: 'عدد الجلسات والمواعيد الأسبوعية إيه؟', answer: `${weeklySessionsAr} في الأسبوع، بإجمالي ${plan.totalSessions} جلسة خلال خطة الدراسة. أيام الجلسات ومواعيدها لسه هتتعلن.` },
          { question: 'الجلسة مدتها قد إيه؟', answer: `مدة الشرح خلال الجلسة تصل إلى ${plan.maxSessionHours} ساعات، بإجمالي مخطط ${plan.plannedInstructionHours} ساعة شرح. مدة كل جلسة مش شرط تكون ${plan.maxSessionHours} ساعات بالضبط؛ التكليفات والعمل المستقل على المشاريع خارج الإجمالي ده.` },
          { question: 'هطبّق خلال الجلسة ولا هتفرج على الشرح؟', answer: 'هتكتب وتطبّق بإيدك خلال الجلسات، مع Live Coding عملي مستمر ومراجعة للكود اللي بتكتبه.' },
          { question: 'فيه مشاريع وتكليفات؟', answer: `أيوه، مشروع عملي كل شهر على اللي اتعلمته، بإجمالي ${plan.projectCount} مشاريع، ومعاها تكليفات وتدريبات مستمرة (Assignments) خارج الجلسات.` },
          { question: 'مين هيشرح ويتابعني؟', answer: 'بشمهندس محمد تامر هيكون المدرّب والموجّه خلال الدبلومة للشرح والتوجيه ومتابعة مستواك وتقدّمك.' },
          { question: 'الحجز مفتوح دلوقتي؟', answer: `لأ، فتح باب الحجز قريبًا جدًا إن شاء الله. الدفعة الأولى مخطط لها ${capacity} طالب للحفاظ على جودة المتابعة والتطبيق ومراجعة الكود (Code Review).` },
          { question: 'تفاصيل المحتوى والتكلفة هتتعلن إمتى؟', answer: 'تفاصيل المحتوى والتكلفة هتتعلن قريبًا جدًا إن شاء الله؛ لسه مفيش موعد محدد للإعلان.' },
          { question: 'الدبلومة هتبدأ إمتى؟', answer: `التخطيط المبدئي هو أول ${plan.start.year} إن شاء الله. ده توقيت مبدئي، والموعد النهائي هيتعلن قريبًا.` }
        ] },
        closing: { title: 'ابدأ تتعرّف على مسارك القادم.', description: 'المحتوى والتكلفة وفتح باب الحجز قريبًا إن شاء الله. لو عندك استفسار عن المعلومات المعلنة، تقدر تتواصل معانا.' },
        related: { title: 'اكتشف مساراتنا الحالية', udemyTitle: 'كورسات Udemy', udemyDescription: 'كورسات برمجة باللغة العربية لتطوير مهاراتك.', udemyCta: 'تصفّح كورسات Udemy', kidsTitle: 'Kids Coding Bootcamp', kidsDescription: 'برمجة للأطفال والمراهقين أونلاين لايف.', kidsCta: 'اكتشف برمجة الأطفال' },
        footer: { statement: 'تعلّم البرمجة مع MT Academy — مسارات مختلفة لأهداف مختلفة.', home: 'الرئيسية', paths: 'مسارات التعلّم', udemy: 'كورسات Udemy', kids: 'برمجة الأطفال', backend: 'دبلومة Backend', top: 'العودة للأعلى', copyright: 'MT Academy. جميع الحقوق محفوظة.', navigationLabel: 'روابط سريعة' },
        inquiryMessage: 'مرحبًا، أريد الاستفسار عن المعلومات المعلنة لدبلومة Backend Development باستخدام Java وSpring Boot القادمة.'
      },
      en: {
        visualAlt: 'MT Academy Backend Development Diploma with Java and Spring Boot product box',
        statusLabels: { 'coming-soon': 'Coming soon' },
        seo: { title: 'Java & Spring Boot Backend Diploma — Coming Soon | MT Academy', description: `Start from zero with Java and Spring Boot: ${plan.durationMonths} months, ${plan.totalSessions} sessions and ${plan.projectCount} practical projects with Mohamed Tamer, mentorship and code review. Registration coming soon; tentative start in early ${plan.start.year}.`, socialImageAlt: 'MT Academy — Backend Development Diploma with Java & Spring Boot, registration coming soon' },
        card: { tag: 'Our next learning path · Start from zero', title: 'Backend Development Diploma', description: 'Practical coding, projects, mentorship and code review with Mohamed Tamer. Registration opens soon.', facts: `${plan.durationMonths} months · ${plan.totalSessions} sessions · ${plan.projectCount} practical projects`, cta: 'Explore diploma details' },
        hero: { eyebrow: 'A new path from MT Academy', title: 'Backend Development Diploma', audience: 'For complete beginners — starting from zero.', description: 'Start backend development from zero with Java and Spring Boot through hands-on coding, practical projects and ongoing guidance from Mohamed Tamer.', summary: `${plan.durationMonths} months · ${plan.studyWeeks}-week study plan · ${plan.sessionsPerWeek} sessions a week`, announcement: 'Registration is not open yet. It will open very soon.', detailsLabel: 'Explore the study plan', returnLabel: 'Explore all learning paths', contactLabel: 'Ask about the diploma' },
        overview: {
          eyebrow: 'The study plan', title: 'Time to learn. Room to keep practicing.',
          description: 'The announced duration and study workload. The detailed curriculum will be announced soon.',
          metrics: [
            { value: `${plan.durationMonths} months`, label: `${plan.studyWeeks}-week study plan` },
            { value: `${plan.sessionsPerWeek} sessions`, label: 'Each week' },
            { value: `${plan.totalSessions} sessions`, label: 'Across the study plan' },
            { value: `Up to ${plan.maxSessionHours} hours`, label: 'Instruction per session' },
            { value: `${plan.plannedInstructionHours} hours`, label: 'Planned instruction total' },
            { value: `${plan.projectCount} projects`, label: 'One practical project a month' }
          ],
          hoursNote: `${plan.totalSessions} sessions, with up to ${plan.maxSessionHours} hours of instruction per session and ${plan.plannedInstructionHours} planned instructional hours in total. Assignments and independent project work are additional to instructional hours.`
        },
        practice: {
          eyebrow: 'Learn through practice', title: 'Write code, apply it, and learn to improve it.',
          description: 'The practical learning approach throughout the diploma. The full curriculum is still to be announced.',
          items: [
            { title: 'Hands-on live coding', description: 'Regular practical live coding. You will write code and participate in implementation during sessions, beyond watching demonstrations.' },
            { title: 'A project every month', description: `Apply each month’s learning in a practical project, working on ${plan.projectCount} projects across the diploma.` },
            { title: 'Ongoing assignments', description: 'Continuous assignments and exercises keep practice going beyond session time and help you build understanding through repetition.' },
            { title: 'Code review', description: 'Reviews of your code help you understand mistakes, improve your approach and write cleaner, better code.' },
            { title: 'Mentorship and guidance', description: 'Follow-up throughout your studies, help organizing your learning steps, monitoring progress and maintaining consistent practice.' },
            { title: 'Thoughtful AI usage', description: 'Learn to use AI practically to write code faster and approach problems intelligently, while understanding your code and avoiding full dependence on AI.' }
          ]
        },
        mentor: {
          eyebrow: 'Your instructor and mentor', name: 'Engineer Mohamed Tamer', role: 'Teaching and guidance throughout the diploma.',
          description: 'Mohamed Tamer will be both your instructor and mentor: guiding you, helping organize your learning steps and following your progress in study and practice.',
          experience: `More than ${experience.professionalYearsOver} years of professional experience.`,
          title: 'A new diploma, built on established experience.',
          stats: [
            { value: `${learners}+`, label: 'Learners on Udemy' },
            { value: `${experience.mentorshipTraineesOver}+`, label: 'Mentorship trainees' },
            { value: `${experience.mentorshipCountriesOver}+`, label: 'Countries across mentorship experiences' }
          ],
          attribution: 'These figures describe Mohamed Tamer’s prior teaching and mentorship experience. They are not student counts or results for this new diploma.',
          evidence: 'Explore real reviews of the existing Udemy courses to see learners’ experiences with the teaching.',
          udemyLabel: 'Mohamed Tamer’s Udemy profile', reviewsLabel: 'Reviews of Udemy courses', portraitAlt: 'Engineer Mohamed Tamer, the diploma instructor and mentor'
        },
        cohort: { eyebrow: 'The first cohort', title: `${capacity} students only`, description: 'The planned first-cohort capacity supports quality follow-up, hands-on participation and individual review of each student’s code.', note: 'Registration is not open yet. This is the planned cohort capacity.' },
        announcements: {
          eyebrow: 'Upcoming announcements', title: 'The study plan is here. More details are coming.',
          items: [
            { title: 'Detailed curriculum', description: 'Coming very soon, God willing.' },
            { title: 'Price', description: 'Coming very soon, God willing.' },
            { title: 'Registration opening', description: 'Coming very soon. Registration is not currently available.' },
            { title: 'Tentative start', description: `The initial plan is to begin around the start of ${plan.start.year}, God willing. The final date will be announced soon.` }
          ]
        },
        faq: { title: 'Questions about the diploma', items: [
          { question: 'Is this suitable for complete beginners?', answer: 'Yes. The Backend Development Diploma with Java and Spring Boot is designed for beginners starting from zero.' },
          { question: 'How long is the diploma?', answer: `The announced duration is ${plan.durationMonths} months, with a ${plan.studyWeeks}-week study plan. The detailed timetable will be announced later.` },
          { question: 'How many sessions are planned?', answer: `${plan.sessionsPerWeek} sessions a week, for ${plan.totalSessions} sessions across the study plan. Session days and times are still to be announced.` },
          { question: 'How long is each session?', answer: `Up to ${plan.maxSessionHours} hours of instruction, with ${plan.plannedInstructionHours} planned instructional hours in total. Each session does not necessarily last exactly ${plan.maxSessionHours} hours. Assignments and independent project work are additional.` },
          { question: 'Will I practice during sessions?', answer: 'Yes. You will write and apply code yourself during sessions, with regular practical live coding and reviews of the code you write.' },
          { question: 'Are there projects and assignments?', answer: `Yes. One practical project each month applies that month’s learning, for ${plan.projectCount} projects in total, alongside ongoing assignments beyond sessions.` },
          { question: 'Who will teach and mentor me?', answer: 'Engineer Mohamed Tamer will be both the instructor and mentor, teaching, guiding and following your progress throughout the diploma.' },
          { question: 'Is registration open?', answer: `No. Registration will open very soon. The first cohort is planned for ${capacity} students to support quality follow-up, practice and code review.` },
          { question: 'When will curriculum and pricing be announced?', answer: 'The detailed curriculum and price will be announced very soon, God willing. No specific announcement date has been confirmed yet.' },
          { question: 'When is the diploma expected to begin?', answer: `The tentative plan is around the beginning of ${plan.start.year}, God willing. This timing is provisional; the final date will be announced soon.` }
        ] },
        closing: { title: 'Get to know your next learning path.', description: 'Curriculum, pricing and registration announcements are coming soon. Contact us if you have questions about the announced information.' },
        related: { title: 'Explore our current learning paths', udemyTitle: 'Udemy courses', udemyDescription: 'Programming courses taught in Arabic to develop your skills.', udemyCta: 'Browse Udemy courses', kidsTitle: 'Kids Coding Bootcamp', kidsDescription: 'Live online coding for children and teenagers.', kidsCta: 'Discover kids coding' },
        footer: { statement: 'Learn programming with MT Academy — different paths for different goals.', home: 'Home', paths: 'Learning paths', udemy: 'Udemy courses', kids: 'Kids coding', backend: 'Backend diploma', top: 'Back to top', copyright: 'MT Academy. All rights reserved.', navigationLabel: 'Quick links' },
        inquiryMessage: 'Hello, I would like to ask about the announced information for the upcoming Backend Development Diploma with Java & Spring Boot.'
      }
    }
  });
})();
