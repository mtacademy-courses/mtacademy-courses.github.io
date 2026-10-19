/** Backend diploma source of truth. PDF facts + user-confirmed open registration.
 * Curriculum pairs are [English, Arabic]; module titles retain standard technical names.
 * Run scripts/refresh-backend-page.cjs after editing to synchronize saved Arabic HTML.
 */
(() => {
  'use strict';
  const site = window.MTAcademySite;
  const plan = {
    durationMonths: 9, studyWeeks: 36, sessionsPerWeek: 2, totalSessions: 72,
    sessionHours: 5, scheduledHours: 360, learningHours: 324, breakHours: 36,
    independentPractice: { min: 12, max: 16 }, projectCount: 9,
    cohortCapacity: { min: 15, max: 20 },
    start: { year: 2027, month: 2, status: 'proposed' },
    javaVersion: 17, springBootVersion: 4, springVersion: 7
  };
  const pricingPlans = [
    { id: 'egypt', currency: 'EGP', full: 16500, total: 18000, deposit: 4000, count: 7, monthly: 2000 },
    { id: 'international', currency: 'USD', full: 650, total: 750, deposit: 150, count: 6, monthly: 100 }
  ];
  const sessionBlocks = [
    { minutes: 25, label: ['Recap', 'مراجعة سريعة'] },
    { minutes: 60, label: ['Concepts', 'شرح المفاهيم'] },
    { minutes: 70, label: ['Guided coding', 'برمجة بتوجيه المدرّب'] },
    { minutes: 75, label: ['Student practice', 'تطبيق الطلاب'] },
    { minutes: 25, label: ['Review', 'مراجعة العمل'] },
    { minutes: 15, label: ['Exit task', 'مهمة ختامية'] },
    { minutes: 30, label: ['Three 10-minute breaks', 'ثلاث استراحات، كل منها 10 دقائق'] }
  ];
  const curriculum = [
    { title: ['Java programming', 'برمجة Java'], modules: [
      { title: 'Java 17 Fundamentals & Advanced Java', topics: [
        ['Getting started: JDK 17, IntelliJ IDEA, JShell, project setup, syntax, variables, primitive types, casting, operators and console input.', 'البداية: JDK 17 وIntelliJ IDEA وJShell، إعداد المشروع، الصياغة، المتغيرات، الأنواع الأولية، التحويل بين الأنواع، العمليات وإدخال البيانات من الطرفية.'],
        ['Programming & OOP: conditions, switch expressions, loops, methods, overloading, classes, constructors, inheritance, encapsulation, composition and polymorphism.', 'البرمجة وOOP: الشروط، تعبيرات switch، الحلقات، الدوال، التحميل الزائد، الأصناف، المُنشئات، الوراثة، التغليف، التركيب وتعدد الأشكال.'],
        ['Data structures & modern Java: arrays, lists, sets, maps, enums, generics, Comparable / Comparator, nested classes, lambdas, method references, Streams and Optional.', 'هياكل البيانات وJava الحديثة: المصفوفات، القوائم، المجموعات، الخرائط، enums وgenerics وComparable / Comparator، الأصناف المتداخلة، lambdas، مراجع الدوال، Streams وOptional.'],
        ['Java 17 features & data handling: records, sealed classes, instanceof pattern matching, text blocks, immutability, final, defensive copying, BigDecimal, Date / Time and regex.', 'مزايا Java 17 ومعالجة البيانات: records وsealed classes، مطابقة الأنماط مع instanceof، الكتل النصية، عدم قابلية التغيير، final، النسخ الوقائي، BigDecimal، التاريخ والوقت وregex.'],
        ['Files, concurrency & networking: exceptions, try-with-resources, I/O, NIO, binary files, serialization, threads, locks, executors, concurrent collections, sockets and HttpClient.', 'الملفات والتزامن والشبكات: الاستثناءات، try-with-resources وI/O وNIO، الملفات الثنائية، serialization، الخيوط، الأقفال، executors، المجموعات المتزامنة، sockets وHttpClient.'],
        ['Debugging & practical foundations: breakpoints, watches, stepping, JUnit basics and coding challenges. JDBC / JPA foundations follow SQL later in the path; asynchronous HTTP and a guided WebSocket example.', 'تتبّع الأخطاء والأساسيات العملية: نقاط التوقف، مراقبة القيم، التنفيذ خطوة بخطوة، أساسيات JUnit وتحديات برمجية. تأتي أساسيات JDBC / JPA بعد SQL لاحقًا في المسار؛ مع HTTP غير المتزامن ومثال WebSocket بتوجيه المدرّب.']
      ] }
    ] },
    { title: ['Teamwork & problem solving', 'العمل الجماعي وحل المشكلات'], modules: [
      { title: 'Git, GitHub & Team Collaboration', topics: [
        ['Git basics: repositories, commits, history, diff and .gitignore.', 'أساسيات Git: المستودعات، commits، سجل التغييرات، diff و.gitignore.'],
        ['Branches, merging, merge conflicts, remotes and GitHub workflows.', 'الفروع، الدمج، تعارضات الدمج، المستودعات البعيدة وسير العمل على GitHub.'],
        ['Pull requests, code review, team collaboration and useful project READMEs.', 'طلبات الدمج، مراجعة الكود، التعاون بين أعضاء الفريق وكتابة ملفات README مفيدة للمشاريع.']
      ] },
      { title: 'Agile, Scrum & Kanban Fundamentals', topics: [
        ['Agile values, iterative delivery and feedback.', 'قيم Agile، التسليم التكراري والاستفادة من الملاحظات.'],
        ['Scrum roles, Product Backlog, Sprint Planning, Daily Scrum, Review and Retrospective.', 'أدوار Scrum وProduct Backlog وSprint Planning وDaily Scrum، مراجعة النتائج والاجتماعات الاسترجاعية.'],
        ['Kanban boards, work in progress limits and tracking delivery.', 'لوحات Kanban، حدود العمل الجاري ومتابعة التسليم.']
      ] },
      { title: 'Requirements Engineering & SRS', topics: [
        ['Stakeholders, requirement gathering and functional / non-functional requirements.', 'أصحاب المصلحة، جمع المتطلبات، والمتطلبات الوظيفية وغير الوظيفية.'],
        ['User stories, use cases, acceptance criteria and prioritization.', 'قصص المستخدم، حالات الاستخدام، معايير القبول وترتيب الأولويات.'],
        ['SRS structure, requirement validation, traceability and change management.', 'هيكل SRS، التحقق من المتطلبات، تتبّعها وإدارة التغيير.']
      ] },
      { title: 'Data Structures, Algorithms & Problem Solving', topics: [
        ['Big O, arrays, linked lists, stacks, queues, hash tables and trees.', 'تحليل Big O، المصفوفات، القوائم المترابطة، المكدسات، الطوابير، جداول التجزئة والأشجار.'],
        ['Recursion, searching, sorting and common problem-solving patterns.', 'الاستدعاء الذاتي، البحث، الترتيب والأنماط الشائعة لحل المشكلات.'],
        ['Coding exercises: edge cases, explaining solutions and time / space trade-offs.', 'تمارين برمجية: الحالات الحدّية، شرح الحلول والمفاضلة بين الوقت والذاكرة.']
      ] }
    ] },
    { title: ['Code design & databases', 'تصميم الكود وقواعد البيانات'], modules: [
      { title: 'SOLID Principles & Design Patterns', topics: [
        ['SOLID: SRP, OCP, LSP, ISP and DIP, with Java refactoring practice.', 'مبادئ SOLID: SRP وOCP وLSP وISP وDIP، مع تطبيق إعادة هيكلة كود Java.'],
        ['Builder, Factory Method, Singleton, Adapter, Decorator, Facade and Proxy.', 'أنماط Builder وFactory Method وSingleton وAdapter وDecorator وFacade وProxy.'],
        ['Chain of Responsibility, Observer, Strategy and Template Method; UML, trade-offs and pitfalls.', 'أنماط Chain of Responsibility وObserver وStrategy وTemplate Method؛ مع UML والمفاضلات والأخطاء الشائعة.']
      ] },
      { title: 'SQL & MySQL Database Design', topics: [
        ['Schemas, tables, data types, CRUD, constraints, primary / foreign keys and relationships.', 'المخططات، الجداول، أنواع البيانات، CRUD، القيود، المفاتيح الأساسية والخارجية والعلاقات.'],
        ['Joins, subqueries, aggregates, GROUP BY, HAVING, string / date functions and window functions.', 'الربط، الاستعلامات الفرعية، التجميع، GROUP BY وHAVING، دوال النص والتاريخ ودوال النوافذ.'],
        ['Views, SQL modes, triggers and schema changes; JDBC, PreparedStatement, transactions and stored procedures.', 'العروض، أوضاع SQL، المشغّلات وتغييرات المخطط؛ مع JDBC وPreparedStatement والمعاملات والإجراءات المخزّنة.']
      ] },
      { title: 'MySQL Indexing & Query Optimization', topics: [
        ['How indexes work: primary, secondary, composite and covering indexes.', 'كيف تعمل الفهارس: الأساسية، الثانوية، المركّبة والمغطّية.'],
        ['EXPLAIN, query plans, selectivity and finding expensive queries.', 'استخدام EXPLAIN، خطط الاستعلام، الانتقائية واكتشاف الاستعلامات المكلفة.'],
        ['Improve filters, joins, sorting and pagination; compare results and index write costs.', 'تحسين التصفية، الربط، الترتيب وتقسيم النتائج إلى صفحات؛ مقارنة النتائج وتكلفة الكتابة مع الفهارس.']
      ] }
    ] },
    { title: ['Spring applications & security', 'تطبيقات Spring والأمان'], modules: [
      { title: 'Spring Boot, REST APIs & Hibernate', topics: [
        ['Maven, Spring Boot 4, Spring 7, IoC, Dependency Injection, bean scopes and lifecycle.', 'استخدام Maven وSpring Boot 4 وSpring 7، والتحكم العكسي IoC وحقن الاعتماديات، نطاقات beans ودورة حياتها.'],
        ['HTTP, JSON, REST CRUD, validation, exception handling, PATCH and OpenAPI / Swagger.', 'استخدام HTTP وJSON وREST CRUD، التحقق من البيانات، معالجة الاستثناءات، PATCH وOpenAPI / Swagger.'],
        ['Hibernate / JPA CRUD, layered APIs, MVC, Thymeleaf forms, MVC security, AOP and Actuator.', 'عمليات CRUD باستخدام Hibernate / JPA، واجهات متعددة الطبقات، MVC، نماذج Thymeleaf، أمان MVC وAOP وActuator.']
      ] },
      { title: 'Spring Data JPA & Database Migrations with Flyway', topics: [
        ['Repositories, derived queries, JPQL, Criteria API, pagination and sorting.', 'المستودعات، الاستعلامات المشتقة، JPQL وCriteria API، تقسيم النتائج إلى صفحات وترتيبها.'],
        ['Entity relationships, cascades, lazy / eager loading, N+1 queries, JOIN FETCH and transactions.', 'علاقات الكيانات، cascades، التحميل الكسول والمبكر، مشكلة N+1، وJOIN FETCH والمعاملات.'],
        ['Flyway versioned migrations, schema history, repeatable migrations and database evolution.', 'ترحيلات Flyway ذات الإصدارات، سجل المخطط، الترحيلات القابلة للتكرار وتطور قاعدة البيانات.']
      ] },
      { title: 'Unit Testing with JUnit, Mockito & MockMvc', topics: [
        ['JUnit assertions, test lifecycle, parameterized tests, exceptions, timeouts and TDD.', 'تأكيدات JUnit، دورة حياة الاختبار، الاختبارات ذات المعاملات، الاستثناءات، المهلات وTDD.'],
        ['Mockito stubbing, verification, exception scenarios, Spring bean mocks and ReflectionTestUtils.', 'استخدام Mockito لإعداد البدائل والتحقق، سيناريوهات الاستثناءات، محاكاة Spring beans وReflectionTestUtils.'],
        ['MockMvc tests for MVC / REST, service and repository checks, test profiles, SQL fixtures and coverage.', 'اختبارات MockMvc لـMVC / REST، فحص الخدمات والمستودعات، ملفات إعداد الاختبار، بيانات SQL للاختبار والتغطية.']
      ] },
      { title: 'Spring Security, JWT & OAuth 2.0', topics: [
        ['Servlets, Filters, SecurityFilterChain, users, PasswordEncoder and AuthenticationProvider.', 'استخدام Servlets وFilters وSecurityFilterChain، المستخدمين، PasswordEncoder وAuthenticationProvider.'],
        ['Sessions, SecurityContext, roles / authorities, method security, CORS, CSRF and custom filters.', 'الجلسات، SecurityContext، الأدوار والصلاحيات، أمان الدوال، CORS وCSRF والمرشّحات المخصصة.'],
        ['JWT, OAuth 2.0, OpenID Connect, PKCE, refresh tokens, social login, Keycloak and Spring Authorization Server.', 'استخدام JWT وOAuth 2.0 وOpenID Connect وPKCE، رموز التجديد، الدخول بالحسابات الاجتماعية، Keycloak وSpring Authorization Server.']
      ] }
    ] },
    { title: ['Linux, Docker & Kubernetes', 'العمل باستخدام Linux وDocker وKubernetes'], modules: [
      { title: 'Linux & Command Line Fundamentals', topics: [
        ['Terminal basics, paths, files, directories and the Linux filesystem.', 'أساسيات الطرفية، المسارات، الملفات، المجلدات ونظام ملفات Linux.'],
        ['Permissions, users, processes, environment variables and command-line tools.', 'الصلاحيات، المستخدمون، العمليات، متغيرات البيئة وأدوات سطر الأوامر.'],
        ['Pipes, redirects, searching files and logs; running and troubleshooting Java applications.', 'الأنابيب وإعادة التوجيه، البحث في الملفات والسجلات؛ تشغيل تطبيقات Java وتشخيص مشكلاتها.']
      ] },
      { title: 'Microservices, Docker & Kubernetes', topics: [
        ['Microservice boundaries, DTOs, cloud-native configuration, Config Server, Eureka and API Gateway.', 'حدود الخدمات المصغرة، DTOs، إعدادات التطبيقات السحابية، Config Server وEureka وAPI Gateway.'],
        ['Resilience, RabbitMQ, Kafka, Spring Cloud Stream, metrics, logs, traces and OAuth 2.0 security.', 'تحمّل الأعطال، RabbitMQ وKafka وSpring Cloud Stream، المقاييس والسجلات والتتبّع وأمان OAuth 2.0.'],
        ['Docker from scratch: images, containers, Dockerfile, Buildpacks, Jib, networks, volumes and Compose.', 'استخدام Docker من الصفر: الصور، الحاويات، Dockerfile وBuildpacks وJib والشبكات ووحدات التخزين وCompose.'],
        ['Kubernetes from scratch: Pods, Deployments, Services, ConfigMaps, Secrets, probes and rollouts; guided Helm / cloud deployment.', 'استخدام Kubernetes من الصفر: Pods وDeployments وServices وConfigMaps وSecrets، فحوصات الجاهزية وتحديثات النشر؛ مع نشر Helm أو نشر سحابي بتوجيه المدرّب.']
      ] }
    ] },
    { title: ['Integration testing & CI/CD', 'اختبارات التكامل وCI/CD'], modules: [
      { title: 'Integration Testing with Testcontainers', topics: [
        ['Integration tests with real services running in disposable containers.', 'اختبارات التكامل مع خدمات حقيقية تعمل داخل حاويات مؤقتة.'],
        ['Testcontainers setup, MySQL containers, connection properties and database lifecycle.', 'إعداد Testcontainers، حاويات MySQL، خصائص الاتصال ودورة حياة قاعدة البيانات.'],
        ['Verify repositories, API flows and Flyway migrations; isolate test data and run tests in CI.', 'التحقق من المستودعات وتدفقات API وترحيلات Flyway؛ عزل بيانات الاختبار وتشغيل الاختبارات داخل CI.']
      ] },
      { title: 'CI/CD with GitHub Actions', topics: [
        ['GitHub Actions workflows, events, jobs, runners and steps.', 'سير عمل GitHub Actions، الأحداث، المهام، بيئات التشغيل والخطوات.'],
        ['Build Java applications, run unit / integration tests and publish test reports.', 'بناء تطبيقات Java، تشغيل اختبارات الوحدات والتكامل ونشر تقارير الاختبار.'],
        ['Secrets, artifacts, container image builds and a guided deployment workflow.', 'إدارة الأسرار، نواتج البناء، بناء صور الحاويات وسير عمل للنشر بتوجيه المدرّب.']
      ] }
    ] },
    { title: ['Architecture & system design', 'المعمارية وتصميم الأنظمة'], modules: [
      { title: 'Software Architecture & System Design Fundamentals', topics: [
        ['Functional requirements, quality attributes, architecture boundaries and design trade-offs.', 'المتطلبات الوظيفية، خصائص الجودة، حدود المعمارية والمفاضلات التصميمية.'],
        ['Capacity estimates, latency, throughput, availability and scalability.', 'تقدير السعة، زمن الاستجابة، معدل المعالجة، الإتاحة وقابلية التوسع.'],
        ['Load balancing, caching, replication, partitioning / sharding and messaging fundamentals.', 'أساسيات موازنة الحمل، التخزين المؤقت، النسخ، التقسيم وsharding والمراسلة.'],
        ['Consistency choices, failure handling and choosing a monolith or microservices.', 'خيارات اتساق البيانات، التعامل مع الأعطال والاختيار بين تطبيق موحّد وخدمات مصغرة.']
      ] },
      { title: 'System Design Case Studies & Interview Preparation', topics: [
        ['Work through practical cases such as URL shortening, notifications and an order platform.', 'دراسة حالات عملية مثل اختصار الروابط، الإشعارات ومنصة الطلبات.'],
        ['Define APIs, data models, request flows and service boundaries.', 'تحديد واجهات API، نماذج البيانات، تدفقات الطلبات وحدود الخدمات.'],
        ['Identify bottlenecks, discuss scaling options and compare design alternatives.', 'تحديد نقاط الاختناق، مناقشة خيارات التوسع ومقارنة بدائل التصميم.'],
        ['Practise design interviews: clarify requirements, draw the system and explain trade-offs.', 'التدرّب على مقابلات التصميم: توضيح المتطلبات، رسم النظام وشرح المفاضلات.']
      ] }
    ] },
    { title: ['AI tools & career preparation', 'أدوات AI والاستعداد للعمل'], modules: [
      { title: 'AI-Assisted Development with Codex', topics: [
        ['Codex workflows: provide repository context, clear tasks and acceptance criteria.', 'سير عمل Codex: توفير سياق المستودع، مهام واضحة ومعايير قبول.'],
        ['Plan changes, implement small features, investigate bugs and generate useful tests.', 'تخطيط التغييرات، تنفيذ مزايا صغيرة، تشخيص الأخطاء وإنشاء اختبارات مفيدة.'],
        ['Inspect diffs, run checks and review results; protect secrets and explain accepted code.', 'فحص الفروق، تشغيل الفحوصات ومراجعة النتائج؛ حماية الأسرار وشرح الكود المقبول.']
      ] },
      { title: 'AI-Assisted Development with Claude Code', topics: [
        ['Claude Code setup, project context, focused prompts and practical coding workflows.', 'إعداد Claude Code، سياق المشروع، طلبات محددة وسير عمل برمجي عملي.'],
        ['Explore a codebase, debug a failure, refactor safely and improve tests.', 'استكشاف قاعدة الكود، تتبّع فشل، إعادة الهيكلة بأمان وتحسين الاختبارات.'],
        ['Review changes, manage permissions and verify outcomes before accepting a result.', 'مراجعة التغييرات، إدارة الصلاحيات والتحقق من النتائج قبل قبولها.']
      ] },
      { title: 'CV, LinkedIn & Job Interview Preparation', topics: [
        ['Developer CV, LinkedIn profile, GitHub portfolio and project READMEs.', 'سيرة ذاتية للمطوّر، ملف LinkedIn، معرض مشاريع GitHub وملفات README للمشاريع.'],
        ['Job search strategy, relevant applications and clear project walkthroughs.', 'استراتيجية البحث عن عمل، التقدّم للفرص المناسبة وعرض المشاريع بوضوح.'],
        ['Coding, technical and behavioural interview practice; communicate your own contribution.', 'التدرّب على المقابلات البرمجية والتقنية والسلوكية؛ توضيح مساهمتك الشخصية.']
      ] }
    ] }
  ];
  const projects = [
    ['Expense Tracker Console', ['Build a console app with input validation, calculations, menus and clear control flow.', 'بناء تطبيق طرفية لتتبّع المصروفات، مع التحقق من المدخلات والحسابات والقوائم وتدفق تحكم واضح.']],
    ['Library & Lending Console', ['Model books, members and loans using OOP, collections and reusable operations.', 'نمذجة الكتب والأعضاء والإعارات باستخدام OOP والمجموعات والعمليات القابلة لإعادة الاستخدام.']],
    ['File Processing & Reporting Tool', ['Read and validate files, transform records and produce useful reports with clean Java design.', 'قراءة الملفات والتحقق منها، تحويل السجلات وإنتاج تقارير مفيدة بتصميم Java نظيف.']],
    ['Social Analytics Database & JDBC App', ['Design a relational schema, write analytical SQL and connect a Java application through JDBC.', 'تصميم مخطط علائقي، كتابة استعلامات SQL تحليلية وربط تطبيق Java من خلال JDBC.']],
    ['Employee Operations Portal', ['Build an employee CRUD application with REST endpoints, Spring MVC and persistent data.', 'بناء تطبيق لإدارة الموظفين بعمليات CRUD، واجهات REST وSpring MVC وتخزين دائم للبيانات.']],
    ['Tested Appointment Service', ['Develop an appointment backend with JPA relationships, migrations and automated tests.', 'تطوير Backend للمواعيد بعلاقات JPA وترحيلات قاعدة البيانات واختبارات آلية.']],
    ['Secure Learning API', ['Secure a learning application with authentication, authorization, token handling and security checks.', 'تأمين تطبيق تعلّم بالمصادقة، الصلاحيات، إدارة الرموز وفحوصات الأمان.']],
    ['Banking Microservices Platform', ['Connect banking services using containers, configuration, routing, messaging and observability.', 'ربط خدمات مصرفية باستخدام الحاويات والإعدادات والتوجيه والمراسلة ومراقبة النظام.']],
    ['Commerce Platform Capstone', ['Combine requirements, APIs, persistence, security, tests, CI/CD and guided deployment in a final team project.', 'دمج المتطلبات وواجهات API والتخزين والأمان والاختبارات وCI/CD والنشر بتوجيه المدرّب في مشروع جماعي ختامي.']]
  ];
  const practice = [
    [['Live coding, then your turn', 'برمجة مباشرة، وبعدها دورك'], ['Follow a short implementation, then modify it yourself. Predict results, run code, investigate failures and explain your changes.', 'تابع تنفيذًا قصيرًا ثم عدّله بنفسك. توقّع النتائج، شغّل الكود، ابحث عن سبب الفشل واشرح التغيير.']],
    [['Assignments with evidence', 'تكليفات لها دليل واضح'], ['Complete assignments after sessions. Submit code, tests or queries in Git, with clear run instructions and weekly submissions.', 'نفّذ تكليفات بعد الجلسات. سلّم الكود أو الاختبارات أو الاستعلامات في Git، مع تعليمات تشغيل واضحة وتسليمات أسبوعية.']],
    [['Review, revise, improve', 'راجع، عدّل، وطوّر شغلك'], ['Rotating code reviews and monthly project feedback turn review notes into revision tasks. Use agreed support channels for mentor guidance.', 'مراجعات دورية بالتناوب للكود وملاحظات شهرية على المشاريع تتحول إلى مهام تعديل. تواصل مع الموجّه عبر قنوات الدعم المتفق عليها.']],
    [['Build with a team', 'اشتغل مع فريق'], ['Practise branches, pull requests, requirements, acceptance criteria and reviews. Record your individual contribution in the capstone.', 'تدرّب على الفروع وطلبات الدمج والمتطلبات ومعايير القبول والمراجعات. وثّق مساهمتك الفردية في المشروع الختامي.']],
    [['AI assistance you can explain', 'مساعدة AI تقدر تراجعها وتشرحها'], ['Codex and Claude Code come after programming and testing foundations. Provide context, inspect diffs and verify every accepted change.', 'تأتي أدوات Codex وClaude Code بعد أساسيات البرمجة والاختبار. وفّر السياق، افحص الفروق وتحقّق من كل تغيير تقبله.']]
  ];
  const graduation = [
    [['A working backend portfolio', 'معرض مشاريع Backend يعمل فعليًا'], ['Submit nine monthly projects. Refine selected projects into portfolio examples with clear requirements and run instructions.', 'سلّم تسعة مشاريع شهرية. حسّن مشاريع مختارة لمعرض أعمالك مع متطلبات واضحة وتعليمات تشغيل.']],
    [['Engineering evidence', 'أدلة على شغلك الهندسي'], ['Show validation, database integrity, security rules, automated tests, Git history, pull requests and deployment evidence where relevant.', 'قدّم أدلة على التحقق من البيانات، سلامة قاعدة البيانات، قواعد الأمان، الاختبارات الآلية، سجل Git، طلبات الدمج والنشر حيث يلزم.']],
    [['An individual change', 'تغيير تنفّذه بنفسك'], ['Implement a small feature or bug fix, adjust a test and explain the result. Complete an unaided task alongside reviewed AI-assisted work.', 'نفّذ ميزة صغيرة أو أصلح خطأ، عدّل اختبارًا واشرح النتيجة. أنجز مهمة دون مساعدة إلى جانب عمل بمساعدة AI خاضع للمراجعة.']],
    [['A design you can defend', 'تصميم تقدر تشرح قراراته'], ['Explain APIs, the data model, dependency boundaries and a trade-off. Respond to a changed requirement without memorized diagrams.', 'اشرح واجهات API ونموذج البيانات وحدود الاعتماديات وإحدى المفاضلات. تعامل مع تغيير في المتطلبات دون الاعتماد على رسومات محفوظة.']],
    [['Career preparation & next steps', 'الاستعداد للعمل وخطوتك التالية'], ['Prepare a targeted CV, LinkedIn, GitHub portfolio, README and project walkthrough. Practise coding, design and behavioural interviews; identify personal gaps and a next-step learning plan.', 'جهّز سيرة ذاتية مناسبة وLinkedIn ومعرض GitHub وREADME وعرضًا واضحًا لمشروعك. تدرّب على مقابلات البرمجة والتصميم والسلوك؛ حدّد الفجوات الشخصية وخطة التعلّم التالية.']]
  ];
  const outcomes = [
    ['Write, debug and improve Java programs with sound OOP and design choices.', 'اكتب برامج Java، تتبّع أخطاءها وحسّنها باختيارات سليمة في OOP والتصميم.'],
    ['Design relational databases and explain SQL queries and performance choices.', 'صمّم قواعد بيانات علائقية واشرح استعلامات SQL واختيارات تحسين الأداء.'],
    ['Build, secure and test Spring REST APIs with persistent data.', 'ابنِ واجهات REST باستخدام Spring، وأمّنها واختبرها واربطها ببيانات دائمة.'],
    ['Collaborate through Git, automate checks and deploy services with guidance.', 'تعاون باستخدام Git، شغّل الفحوصات آليًا وانشر الخدمات بتوجيه المدرّب.']
  ];
  const document = { url: '/assets/documents/mt-academy-backend-diploma-overview-roadmap.pdf', filename: 'MT-Academy-Backend-Diploma-Overview-Roadmap.pdf', pages: 15, bytes: 2414903 };
  const number = value => value.toLocaleString('en-US');
  const bookingPolicy = {
    refund: {calendarDays: 7, clockStarts: 'request-received', settlementCutoff: 'request-sent'},
    latePayment: {graceDays: 7, clockStarts: 'installment-due', writtenNoticeRequired: true}
  };
  // Approved application/policy copy. Tokens keep repeated programme facts centralized.
  function buildEnrollmentContent(locale) {
    const ar = locale === 'ar';
    const choose = (en, arabic) => ar ? arabic : en;
    const egypt = pricingPlans.find(p => p.id === 'egypt');
    const international = pricingPlans.find(p => p.id === 'international');
    const tokens = {
      months: plan.durationMonths, weeks: plan.studyWeeks, sessions: plan.totalSessions, year: plan.start.year,
      egyptFull: number(egypt.full), egyptTotal: number(egypt.total), egyptDeposit: number(egypt.deposit), egyptCount: egypt.count, egyptMonthly: number(egypt.monthly),
      internationalFull: number(international.full), internationalTotal: number(international.total), internationalDeposit: number(international.deposit), internationalCount: international.count, internationalMonthly: number(international.monthly),
      refundDays: bookingPolicy.refund.calendarDays, graceDays: bookingPolicy.latePayment.graceDays
    };
    const fill = text => text.replace(/\{([A-Za-z]+)\}/g, (_, key) => String(tokens[key]));
    const clauseSource = [
  {
    "id": "programme",
    "enTitle": "Programme and workload",
    "arTitle": "مدة الدبلومة والتطبيق",
    "en": [
      "The diploma is for beginners starting from zero. It lasts {months} training months across {weeks} weeks and {sessions} sessions, with ongoing projects and assignments between sessions."
    ],
    "ar": [
      "الدبلومة للمبتدئين من الصفر. مدتها {months} شهور تدريبية بواقع {weeks} أسبوع و{sessions} سيشن مع مشاريع وتكليفات مستمرة بين السيشنات."
    ]
  },
  {
    "id": "schedule",
    "enTitle": "Proposed start and final timetable",
    "arTitle": "البداية المقترحة والجدول النهائي",
    "en": [
      "The proposed start is February {year}. We will clarify the scheduling status before payment and inform you of the final session timetable before the start. If the final timetable does not suit you, you may cancel before study begins and receive a full refund of the amount paid."
    ],
    "ar": [
      "البداية المقترحة فبراير {year}. هنوضح لك حالة المواعيد قبل الدفع وهنبلغك بجدول السيشنات النهائي قبل البداية. لو الجدول النهائي مش مناسب ليك تقدر تلغي الحجز قبل بداية الدراسة وتسترد المبلغ المدفوع بالكامل."
    ]
  },
  {
    "id": "confirmation",
    "enTitle": "When booking is confirmed",
    "arTitle": "متى يتأكد الحجز؟",
    "en": [
      "Your booking is confirmed after completing the application information, agreeing to the terms, paying the required amount, and receiving confirmation from the academy. Sending information alone does not reserve a place."
    ],
    "ar": [
      "تأكيد الحجز بيكون بعد استكمال بيانات التقديم والموافقة على الشروط وسداد المبلغ المطلوب واستلام تأكيد من الأكاديمية. إرسال البيانات وحده مش بيحجز مكان."
    ]
  },
  {
    "id": "egyptian-price",
    "enTitle": "Egyptian student pricing",
    "arTitle": "التكلفة للطالب المصري",
    "en": [
      "Egyptian student pricing:\nFull payment: EGP {egyptFull} for the complete diploma.\nInstallment total: EGP {egyptTotal}.\nDeposit: EGP {egyptDeposit}.\nRemaining payments: {egyptCount} monthly installments of EGP {egyptMonthly}."
    ],
    "ar": [
      "التكلفة للطالب المصري:\nالكاش: {egyptFull} جنيه للدبلومة كاملة.\nالتقسيط: إجمالي {egyptTotal} جنيه.\nالمقدم: {egyptDeposit} جنيه.\nالمتبقي: {egyptCount} أقساط شهرية قيمة القسط {egyptMonthly} جنيه."
    ]
  },
  {
    "id": "international-price",
    "enTitle": "International student pricing",
    "arTitle": "التكلفة للطالب الدولي من خارج مصر",
    "en": [
      "International student pricing for students outside Egypt:\nFull payment: USD {internationalFull} for the complete diploma.\nInstallment total: USD {internationalTotal}.\nDeposit: USD {internationalDeposit}.\nRemaining payments: {internationalCount} monthly installments of USD {internationalMonthly}."
    ],
    "ar": [
      "التكلفة للطالب الدولي من خارج مصر:\nالكاش: {internationalFull} دولار للدبلومة كاملة.\nالتقسيط: إجمالي {internationalTotal} دولار.\nالمقدم: {internationalDeposit} دولار.\nالمتبقي: {internationalCount} أقساط شهرية قيمة القسط {internationalMonthly} دولار."
    ]
  },
  {
    "id": "installments",
    "enTitle": "Deposit, installments and fixed price",
    "arTitle": "المقدم والأقساط وثبات السعر",
    "en": [
      "The deposit is part of the total price. Monthly installments start when teaching begins, and we will provide the due dates in writing before payment. After booking confirmation, the agreed price is fixed."
    ],
    "ar": [
      "المقدم جزء من إجمالي السعر. الأقساط الشهرية تبدأ مع انطلاق الدراسة وهنوضح لك مواعيدها كتابة قبل الدفع. بعد تأكيد الحجز السعر المتفق عليه بيكون ثابت."
    ]
  },
  {
    "id": "payment-records",
    "enTitle": "Payment confirmations and records",
    "arTitle": "تأكيدات الدفع والإيصالات",
    "en": [
      "After each payment, you will receive confirmation of the amount paid and the remaining balance. Keep your payment receipt, booking confirmation, and installment schedule."
    ],
    "ar": [
      "بعد كل دفعة هتستلم تأكيدا بالمبلغ المدفوع والمتبقي. احتفظ بإيصال الدفع وتأكيد الحجز وجدول الأقساط."
    ]
  },
  {
    "id": "withdrawal-before-start",
    "enTitle": "Withdrawal before study begins",
    "arTitle": "الانسحاب قبل بداية الدراسة",
    "en": [
      "If you request withdrawal before study begins, you will receive a refund of all amounts paid without any administrative deduction."
    ],
    "ar": [
      "لو طلبت الانسحاب قبل بداية الدراسة هتسترد كل المبالغ المدفوعة بدون خصم رسوم إدارية."
    ]
  },
  {
    "id": "withdrawal-after-start",
    "enTitle": "Withdrawal after study begins",
    "arTitle": "الانسحاب بعد بداية الدراسة",
    "en": [
      "If you request withdrawal after study begins, we will deduct the value of sessions delivered and available to you up to the withdrawal-request date and refund the remaining paid balance, if any.",
      "The calculation is as follows:",
      "Missing a session that was delivered and available to you does not exclude it from the calculation. Canceled sessions and sessions the academy did not provide are not counted."
    ],
    "ar": [
      "لو طلبت الانسحاب بعد بداية الدراسة هنخصم قيمة السيشنات اللي اتقدمت وكانت متاحة ليك لحد تاريخ طلب الانسحاب ونرد باقي المبلغ المدفوع إن وجد.",
      "الحساب بيكون كالتالي:",
      "التغيب عن سيشن اتقدمت وكانت متاحة ليك مش بيلغي احتسابها. السيشنات الملغاة أو اللي لم تقدمها الأكاديمية لا تدخل في الحساب."
    ]
  },
  {
    "id": "withdrawal-request",
    "enTitle": "Written request, settlement and refund timing",
    "arTitle": "طلب الانسحاب والتسوية وموعد الاسترداد",
    "en": [
      "Send your withdrawal request in writing to the official WhatsApp contact. The date you send the request is used for the settlement calculation. After withdrawal, your participation and future installments stop.",
      "We will send you the settlement details and refund any amount due within {refundDays} calendar days of receiving the request, in the same currency and through the same payment method where possible, or through an alternative agreed in writing."
    ],
    "ar": [
      "طلب الانسحاب بيتبعت كتابة على واتساب التواصل الرسمي ويعتد بتاريخ إرسال الطلب في حساب التسوية. بعد الانسحاب بيتوقف اشتراكك والأقساط المستقبلية.",
      "هنرسل لك تفاصيل الحساب ونرد أي مبلغ مستحق خلال {refundDays} أيام تقويمية من استلام الطلب بنفس عملة وطريقة الدفع متى أمكن أو بطريقة بديلة نتفق عليها كتابة."
    ]
  },
  {
    "id": "academy-changes",
    "enTitle": "Academy cancellation and schedule changes",
    "arTitle": "إلغاء الراوند وتغييرات المواعيد",
    "en": [
      "If the academy cancels the cohort before it begins, you will receive a full refund. If teaching permanently stops after the start, you will receive a refund for the unprovided portion from the amounts you have paid.",
      "If a material change to the agreed schedule prevents you from continuing, you may withdraw and recover the paid balance corresponding to undelivered sessions. Transfer to another cohort requires your agreement."
    ],
    "ar": [
      "لو الأكاديمية ألغت الراوند قبل البداية هتسترد المبلغ بالكامل. ولو توقفت الدراسة نهائيا بعد البداية هتسترد قيمة الجزء غير المقدم من المبالغ اللي دفعتها.",
      "ولو حصل تغيير جوهري في المواعيد المتفق عليها ومقدرتش تكمل بسببه تقدر تنسحب وتسترد الرصيد المدفوع مقابل السيشنات غير المقدمة. التحويل لراوند تانية بيكون بموافقتك."
    ]
  },
  {
    "id": "late-payment",
    "enTitle": "Late installments",
    "arTitle": "التأخر في سداد الأقساط",
    "en": [
      "If an installment is late, we will contact you. After a {graceDays}-day grace period from the due date and written notice, access to new sessions may be suspended temporarily until payment or an agreement to withdraw and settle the account. There are no late-payment fines."
    ],
    "ar": [
      "لو اتأخرت في سداد قسط هنتواصل معاك. بعد مهلة {graceDays} أيام من موعد الاستحقاق وتنبيه مكتوب ممكن يتوقف الوصول للسيشنات الجديدة مؤقتا لحين السداد أو الاتفاق على الانسحاب وتسوية الحساب. مفيش غرامات تأخير."
    ]
  },
  {
    "id": "participation",
    "enTitle": "Participation and employment expectations",
    "arTitle": "المشاركة وعدم ضمان وظيفة",
    "en": [
      "Benefiting from the diploma requires attendance, practice, assignment submissions, and applying feedback. Training and mentorship do not include a guarantee of employment."
    ],
    "ar": [
      "الاستفادة من الدبلومة محتاجة حضور وتطبيق وتسليم تكليفات ومراجعة الملاحظات. التدريب والمتابعة لا يتضمنوا ضمان الحصول على وظيفة."
    ]
  },
  {
    "id": "materials",
    "enTitle": "Materials and privacy",
    "arTitle": "المواد التعليمية والخصوصية",
    "en": [
      "Educational materials are for personal use. Sharing, selling, publishing, or recording sessions by a student is not permitted without permission. Please respect the privacy of the trainer and other students."
    ],
    "ar": [
      "المواد التعليمية للاستخدام الشخصي. غير مسموح بمشاركتها أو بيعها أو نشرها أو تسجيل السيشنات من طرف الطالب بدون إذن. يرجى احترام خصوصية المدرب وباقي الطلاب."
    ]
  },
  {
    "id": "statutory-rights",
    "enTitle": "Rights under applicable law",
    "arTitle": "الحقوق المقررة بالقانون",
    "en": [
      "These terms do not reduce any rights granted to the student under applicable law."
    ],
    "ar": [
      "الشروط دي لا تنتقص من أي حقوق مقررة للطالب بموجب القانون المطبق."
    ]
  }
];
    const fields = [
  {
    "id": "arabic-name",
    "en": "Full name in Arabic:",
    "ar": "الاسم بالكامل بالعربي:"
  },
  {
    "id": "english-name",
    "en": "Name in English:",
    "ar": "الاسم بالإنجليزي:"
  },
  {
    "id": "email",
    "en": "Email address:",
    "ar": "البريد الإلكتروني:"
  },
  {
    "id": "whatsapp",
    "en": "WhatsApp number with country code:",
    "ar": "رقم الواتساب بكود الدولة:"
  },
  {
    "id": "residence",
    "en": "Country of residence and city:",
    "ar": "بلد الإقامة والمدينة:"
  },
  {
    "id": "study-work",
    "en": "Current study or work:",
    "ar": "الدراسة أو العمل الحالي:"
  },
  {
    "id": "programming-level",
    "en": "Programming level: complete beginner or some background? If you have experience, briefly describe it:",
    "ar": "مستواك في البرمجة: مبتدئ تماما ولا عندك خلفية؟ ولو عندك خلفية اذكرها باختصار:"
  },
  {
    "id": "goal",
    "en": "Your goal for the diploma:",
    "ar": "هدفك من الدبلومة:"
  },
  {
    "id": "equipment-internet",
    "en": "Do you have access to a laptop or computer and suitable internet for the sessions?",
    "ar": "هل متاح عندك لابتوب أو كمبيوتر وإنترنت مناسب للسيشنات؟"
  },
  {
    "id": "commitment",
    "en": "Can you commit to two sessions per week and additional time for practice and assignments?",
    "ar": "هل تقدر تلتزم بسيشنين أسبوعيا وتخصص وقت إضافي للتطبيق والتكليفات؟"
  },
  {
    "id": "availability",
    "en": "Suitable days and times, in Cairo time:",
    "ar": "الأيام والأوقات المناسبة ليك بتوقيت القاهرة:"
  },
  {
    "id": "payment-preference",
    "en": "Preferred payment system: full payment or installments?",
    "ar": "نظام الدفع المفضل: كاش ولا تقسيط؟"
  }
];
    const application = {
      title: choose('How to apply', 'خطوات التقديم'),
      description: choose('Prepare your information, review the terms, then contact MT Academy on WhatsApp. An application is the first step; it does not reserve a place.', 'جهّز بياناتك، اقرأ الشروط، وبعدها تواصل مع MT Academy على WhatsApp. التقديم هو الخطوة الأولى، وإرسال البيانات وحده مش بيحجز مكان.'),
      greeting: choose('Welcome to MT Academy', 'أهلا بيك في MT Academy'),
      introduction: choose('To apply for the Backend Development with Java & Spring Boot diploma, send the following information in one message:', 'للتقديم على دبلومة الـBackend Development with Java & Spring Boot ابعت لنا البيانات دي في رسالة واحدة:'),
      fields: fields.map(field => ({id:field.id, prompt:choose(field.en,field.ar)})),
      nextSteps: choose('After reviewing your information, we will confirm whether the diploma suits your level and clarify the schedule, cost, and booking, payment, and withdrawal terms before any payment.', 'بعد مراجعة البيانات هنأكد معاك مناسبة الدبلومة لمستواك ونوضح لك تفاصيل المواعيد والتكلفة وشروط الحجز والدفع والانسحاب قبل أي دفع.'),
      confirmationNotice: choose('Sending your information is an application only. Your booking is confirmed after completing the steps and receiving a confirmation message from the academy.', 'إرسال البيانات طلب تقديم فقط. الحجز بيتأكد بعد استكمال الخطوات واستلام رسالة تأكيد من الأكاديمية.'),
      privacyNotice: choose('Your information will be used for applications, communication, and organizing study. Do not send an identity-card image, bank-card details, or any verification codes.', 'البيانات هتستخدم للتقديم والتواصل وتنظيم الدراسة. مش مطلوب تبعت صورة بطاقة أو بيانات بطاقة بنكية أو أي أكواد تحقق.'),
      stepsTitle: choose('From application to confirmed booking', 'من طلب التقديم لتأكيد الحجز'),
      steps: choose([
        'Complete your application information.', 'Clarify scheduling, pricing and terms with the academy before paying.',
        'Read and agree to the terms.', 'Pay the required amount.', 'Receive your booking confirmation from the academy.'
      ], [
        'استكمل بيانات التقديم.', 'راجع المواعيد والتكلفة والشروط مع الأكاديمية قبل الدفع.',
        'اقرأ الشروط ووافق عليها.', 'سدّد المبلغ المطلوب.', 'استلم تأكيد الحجز من الأكاديمية.'
      ]),
      templateTitle: choose('Your application message', 'رسالة بيانات التقديم'),
      templateInstructions: choose('Copy this message, complete the blank fields in your messaging app, and send it in one WhatsApp message. You do not need to enter personal information on this website.', 'انسخ الرسالة، كمّل البيانات في تطبيق الرسائل، وابعتها في رسالة واحدة على WhatsApp. مش محتاج تدخل بياناتك الشخصية على الموقع.'),
      copyLabel: choose('Copy application message', 'انسخ رسالة التقديم'),
      copiedLabel: choose('Application message copied. Complete it before sending; copying does not submit an application.', 'تم نسخ رسالة التقديم. كمّلها قبل الإرسال؛ النسخ وحده لا يرسل طلب تقديم.'),
      copyFailureLabel: choose('Could not copy automatically. Select the visible message and copy it manually.', 'تعذّر النسخ التلقائي. حدّد الرسالة الظاهرة وانسخها يدويًا.'),
      whatsappLabel: choose('Open WhatsApp to apply', 'افتح WhatsApp للتقديم'),
      termsLabel: choose('Read all booking, payment & withdrawal terms', 'اقرأ شروط الحجز والدفع والانسحاب كاملة')
    };
    const digit = n => ar ? String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);
    application.messageTemplate = [application.greeting, application.introduction,
      application.fields.map((field,i)=>`${digit(i+1)}- ${field.prompt}`).join('\n'),
      application.nextSteps, application.confirmationNotice, application.privacyNotice].join('\n\n');
    const bookingTerms = {
      title: choose('Booking, payment & withdrawal terms', 'شروط الحجز والدفع والانسحاب'),
      description: choose('Before confirming your booking in the Backend Development with Java & Spring Boot diploma, please read the following terms:', 'قبل تأكيد حجزك في دبلومة الـBackend Development with Java & Spring Boot يرجى قراءة الشروط التالية:'),
      clauses: clauseSource.map(clause => ({id:clause.id,title:choose(clause.enTitle,clause.arTitle),paragraphs:(ar?clause.ar:clause.en).map(fill)})),
      refundFormula: {
        perSession: fill(choose('Session value = total diploma price for the agreed payment system ÷ {sessions}.', 'قيمة السيشن = إجمالي سعر الدبلومة بنظام الدفع المتفق عليه ÷ {sessions}.')),
        refund: choose('Refund = total amount paid minus the value of sessions delivered up to the withdrawal request.', 'المبلغ المسترد = إجمالي اللي دفعته ناقص قيمة السيشنات المقدمة حتى طلب الانسحاب.'),
        inputs: fill(choose('Use the full diploma price for the payment system agreed with you, the amount you actually paid, and the number of sessions delivered and available to you up to the date you send the request. A refund is due if a paid balance remains.', 'الحساب بيستخدم سعر الدبلومة الكامل بنظام الدفع المتفق عليه، وإجمالي اللي دفعته فعليًا، وعدد السيشنات المقدمة والمتاحة ليك لحد تاريخ إرسال طلب الانسحاب. نرد الرصيد المدفوع المتبقي إن وجد.'))
      },
      acceptanceTitle: choose('Acceptance message — after reading the terms', 'رسالة الموافقة — بعد قراءة الشروط'),
      acceptanceInstructions: choose('Before payment, send us this message after completing it:', 'قبل الدفع ابعت لنا الرسالة دي بعد استكمالها:'),
      acceptanceTemplate: choose('I have read the diploma details and the booking, payment, and withdrawal terms, and I agree to them. Selected payment system: ........', 'قرأت تفاصيل الدبلومة وشروط الحجز والدفع والانسحاب وموافق عليها. نظام الدفع المختار: ........'),
      acceptanceNote: choose('Read the complete terms and fill in your chosen payment system before sending. Copying this text does not send acceptance or confirm a booking.', 'اقرأ الشروط كاملة واستكمل نظام الدفع المختار قبل الإرسال. نسخ النص لا يرسل موافقة ولا يؤكد حجزًا.'),
      copyAcceptanceLabel: choose('Copy acceptance message', 'انسخ رسالة الموافقة'),
      copiedLabel: choose('Acceptance message copied. Complete the payment-system placeholder and send it only after reading and agreeing to the terms.', 'تم نسخ رسالة الموافقة. استكمل نظام الدفع، وابعتها فقط بعد قراءة الشروط والموافقة عليها.'),
      copyFailureLabel: application.copyFailureLabel,
      contactLabel: choose('Contact the academy on WhatsApp', 'تواصل مع الأكاديمية على WhatsApp')
    };
    return {application,bookingTerms};
  }

  const translations = {};
  for (const locale of ['ar','en']) {
    const ar = locale === 'ar';
    const pick = pair => pair[ar ? 1 : 0];
    const months = ar ? `${plan.durationMonths} شهور` : `${plan.durationMonths} months`;
    const facts = ar ? `${months} · ${plan.totalSessions} جلسة مباشرة · ${plan.projectCount} مشاريع` : `${months} · ${plan.totalSessions} live sessions · ${plan.projectCount} projects`;
    const start = ar ? `فبراير ${plan.start.year} — بداية مقترحة` : `February ${plan.start.year} — proposed start`;
    const capacity = `${plan.cohortCapacity.min}–${plan.cohortCapacity.max}`;
    const practiceHours = `${plan.independentPractice.min}–${plan.independentPractice.max}`;
    const fullPrices = pricingPlans.map((p,i) => ar
      ? `${i === 0 ? 'مصر' : 'دوليًا'}: ${number(p.full)} ${p.currency} دفعة واحدة، أو ${number(p.total)} ${p.currency} بالتقسيط.`
      : `${i === 0 ? 'Egypt' : 'International'}: ${p.currency} ${number(p.full)} in full or ${p.currency} ${number(p.total)} in installments.`).join(' ');
    const installmentEquations = pricingPlans.map(p => `${p.currency} ${number(p.deposit)} + ${p.count} × ${p.currency} ${number(p.monthly)} = ${p.currency} ${number(p.total)}`).join('; ');
    const sessionSummary = sessionBlocks.map(block => `${block.minutes} ${ar ? 'دقيقة' : 'min'}: ${pick(block.label)}`).join(ar ? '؛ ' : '; ');
    translations[locale] = {
      statusLabels: { open: pick(['Registration is now open', 'تم فتح باب الحجز']) },
      seo: { title: pick(['Java & Spring Boot Backend Diploma — Registration Open | MT Academy', 'دبلومة Backend باستخدام Java وSpring Boot — الحجز مفتوح | MT Academy']), description: pick([`Start from zero: ${facts}. Full curriculum, mentorship, prices and nine monthly projects. Registration open; ${start}.`, `ابدأ من الصفر: ${facts}. المنهج الكامل، المتابعة، الأسعار والمشاريع الشهرية. الحجز مفتوح؛ ${start}.`]), socialImageAlt: pick(['MT Academy — Backend Development Diploma · Registration open', 'MT Academy — دبلومة Backend · الحجز مفتوح']) },
      card: { tag: pick(['For complete beginners · Registration open', 'للمبتدئين من الصفر · الحجز مفتوح']), title: pick(['Backend Development Diploma','دبلومة تطوير Backend']), description: pick(['Build, test and deploy with Java & Spring Boot. Practical projects and mentorship with Mohamed Tamer. Registration is now open.', 'ابنِ واختبر وانشر باستخدام Java وSpring Boot، مع مشاريع عملية وتوجيه محمد تامر. تم فتح باب الحجز.']), facts, cta: pick(['Explore the diploma & application', 'اكتشف الدبلومة وخطوات التقديم']) },
      hero: { eyebrow: 'MT ACADEMY / BACKEND DEVELOPMENT', title: pick(['Backend Development Diploma', 'دبلومة تطوير Backend']), audience: pick(['For complete beginners, from zero', 'للمبتدئين من الصفر']), description: pick(['From your first Java program to a backend you can build, test, deploy and explain. Learn through practice with Mohamed Tamer, your trainer and mentor.', 'من أول برنامج Java إلى Backend تقدر تبنيه وتختبره وتنشره وتشرح قراراته. تعلّم بالتطبيق مع محمد تامر، المدرّب والموجّه خلال الدبلومة.']), summary: facts, announcement: start, detailsLabel: pick(['Explore the curriculum', 'اكتشف المنهج']), contactLabel: pick(['Start your application', 'ابدأ التقديم']), returnLabel: pick(['Explore all learning paths','اكتشف كل مسارات التعلّم']) },
      registrationNote: pick(['Sending information is an application only. Booking requires completed information, agreement to the terms, the required payment, and confirmation from the academy.', 'إرسال البيانات طلب تقديم فقط. تأكيد الحجز يحتاج استكمال البيانات والموافقة على الشروط وسداد المبلغ المطلوب واستلام تأكيد من الأكاديمية.']),
      inquiryMessage: pick(['Hello, I would like to apply for the Backend Development Diploma with Java & Spring Boot. Please help me begin the application process and clarify the scheduling status and payment steps.', 'مرحبًا، أرغب في التقديم لدبلومة Backend باستخدام Java وSpring Boot. أرجو مساعدتي في بدء التقديم وتوضيح حالة المواعيد وخطوات الدفع.']),
      sectionNav: { label: pick(['Diploma sections','أقسام الدبلومة']), items: (ar ? ['نظرة عامة','المنهج','المشاريع','تجربة التعلّم','الأسعار','خطوات التقديم','شروط الحجز','الأسئلة'] : ['Overview','Curriculum','Projects','Learning experience','Pricing','How to apply','Booking terms','FAQs']).map((label,i)=>({label,href:['#study-plan','#curriculum','#projects','#experience','#pricing','#apply','#booking-terms','#faq'][i]})) },
      overview: { title: pick(['A clear commitment. A practical path.', 'خطة واضحة. وتطبيق في كل خطوة.']), description: pick(['Live teaching in Arabic, using standard English technical terminology. Time in sessions and practice between sessions are separate commitments.', 'الشرح المباشر بالعربية مع استخدام المصطلحات التقنية الإنجليزية المتعارف عليها. وقت الجلسات والممارسة المستقلة التزامان منفصلان.']), metrics: [
        {value: months, label: ar ? `${plan.studyWeeks} أسبوعًا تدريبيًا` : `${plan.studyWeeks} training weeks`},
        {value: ar ? `${plan.totalSessions} جلسة` : `${plan.totalSessions} live sessions`, label: ar ? `${plan.sessionsPerWeek} جلسات أسبوعيًا` : `${plan.sessionsPerWeek} sessions each week`},
        {value: ar ? `${plan.sessionHours} ساعات` : `${plan.sessionHours} hours`, label: pick(['Each scheduled session, including breaks','لكل جلسة مجدولة، تشمل الاستراحات'])},
        {value: ar ? `${plan.scheduledHours} ساعة` : `${plan.scheduledHours} hours`,label: pick(['Scheduled total, including breaks','الإجمالي المجدول، يشمل الاستراحات'])},
        {value: ar ? `${plan.learningHours} ساعة` : `${plan.learningHours} hours`,label: pick(['Learning within scheduled sessions','تعلّم ضمن الجلسات المجدولة'])},
        {value: ar ? `${plan.breakHours} ساعة` : `${plan.breakHours} hours`,label: pick(['Breaks within scheduled sessions','استراحات ضمن الجلسات المجدولة'])}
      ], hoursNote: ar ? `${plan.totalSessions} جلسة × ${plan.sessionHours} ساعات = ${plan.scheduledHours} ساعة مجدولة، منها ${plan.learningHours} ساعة تعلّم و${plan.breakHours} ساعة استراحات. بالإضافة إلى ${practiceHours} ساعة ممارسة مستقلة أسبوعيًا للتكليفات والمشاريع وتطبيق الملاحظات، خارج وقت الجلسات.` : `${plan.totalSessions} sessions × ${plan.sessionHours} hours = ${plan.scheduledHours} scheduled hours: ${plan.learningHours} learning + ${plan.breakHours} break hours. In addition, plan ${practiceHours} hours of independent practice each week for assignments, project increments and revisions, outside scheduled sessions.` },
      audience: { title: pick(['Starting from zero? Start here.', 'بتبدأ من الصفر؟ ابدأ من هنا.']), description: pick(['Designed for beginners with basic computer and file-management skills. No prior programming is required. Be ready for live participation and regular independent practice.', 'مناسبة للمبتدئين مع مهارات أساسية في استخدام الكمبيوتر وإدارة الملفات. لا تحتاج إلى خبرة برمجية سابقة، مع الاستعداد للمشاركة المباشرة والممارسة المستقلة المنتظمة.']) },
      outcomes: { title: pick(['What you will work towards', 'هتتعلّم تعمل إيه؟']), items: outcomes.map(pick) },
      curriculum: { title: pick(['Your learning roadmap', 'رحلتك خطوة بخطوة']), description: pick([`8 learning stages · 21 modules. Java ${plan.javaVersion} first, then SQL, followed by Spring Boot ${plan.springBootVersion} and Spring ${plan.springVersion}. These stages are a learning sequence, separate from the nine monthly projects.`, `8 مراحل تعلّم · 21 وحدة. تبدأ بـJava ${plan.javaVersion} ثم SQL، وبعدها Spring Boot ${plan.springBootVersion} وSpring ${plan.springVersion}. المراحل ترتيب للتعلّم، وهي منفصلة عن تسلسل المشاريع الشهرية التسعة.`]), stageLabel: pick(['Stage','المرحلة']), expand: pick(['Expand all modules','افتح كل الوحدات']), collapse: pick(['Collapse all modules','اغلق كل الوحدات']), depthNote: pick(['Core Java, SQL, APIs, testing and security receive repeated practice. Docker and Kubernetes begin with the basics and move into guided deployment. Sharding, service mesh and mTLS are introductory topics. Use automated checks before packaging or deployment; start designs with requirements, compare alternatives and test assumptions.', 'تتكرر الممارسة في Java وSQL وواجهات API والاختبارات والأمان. يبدأ Docker وKubernetes بالأساسيات ثم النشر بتوجيه المدرّب. موضوعات sharding وservice mesh وmTLS تمهيدية. استخدم الفحوصات الآلية قبل التجهيز أو النشر؛ وابدأ التصميم بالمتطلبات وقارن البدائل واختبر الافتراضات.']), stages: curriculum.map(stage=>({title:pick(stage.title),modules:stage.modules.map(module=>({title:module.title,topics:module.topics.map(pick)}))})) },
      projects: { title: pick(['Nine months. Nine things you build.', 'تسعة شهور. تسعة مشاريع تبنيها.']), description: pick(['One project each training month, with assignments, live coding, a demo or submission, and review feedback. These are planned learning projects.', 'مشروع كل شهر تدريبي، مع تكليفات وبرمجة مباشرة وعرض أو تسليم وملاحظات مراجعة. دي مشاريع مخططة ضمن رحلة التعلّم.']), monthLabel: pick(['Month','الشهر']), items: projects.map(([title,description],i)=>({month:String(i+1).padStart(2,'0'),title,description:pick(description)})) },
      practice: { title: pick(['Build, explain, test and improve.', 'ابنِ، اشرح، اختبر، وحسّن.']), description: pick(['Progress through visible work, feedback and revisions. Reviews rotate across submissions; support uses agreed channels.', 'تقدّم من خلال عمل واضح وملاحظات وتعديلات. تتناوب المراجعات بين التسليمات، ويكون الدعم عبر القنوات المتفق عليها.']), items: practice.map(([title,description])=>({title:pick(title),description:pick(description)})) },
      session: { title: pick(['Inside a five-hour session', 'جوه الجلسة ذات الخمس ساعات']), description: pick([`${plan.sessionHours * 60} scheduled minutes: ${plan.learningHours / plan.totalSessions * 60} learning minutes + ${plan.breakHours / plan.totalSessions * 60} break minutes.`, `${plan.sessionHours * 60} دقيقة مجدولة: ${plan.learningHours / plan.totalSessions * 60} دقيقة تعلّم + ${plan.breakHours / plan.totalSessions * 60} دقيقة استراحات.`]), minuteLabel: pick(['min','دقيقة']), items: sessionBlocks.map(block=>({minutes:String(block.minutes),label:pick(block.label)})) },
      graduation: { title: pick(['Show the work. Explain the decisions.', 'ورّي شغلك. واشرح قراراتك.']), description: pick(['Learning and assessment expectations for graduation and your next steps.', 'توقّعات التعلّم والتقييم عند إتمام الدبلومة، والاستعداد لخطوتك التالية.']), items: graduation.map(([title,description])=>({title:pick(title),description:pick(description)})) },
      cohort: { eyebrow: pick(['THE FIRST COHORT','الدفعة الأولى']), title: ar ? `${capacity} طالبًا` : `${capacity} students`, description: start, note: pick(['Planned cohort capacity. The exact start day and weekly timetable will be confirmed before the cohort begins.', 'سعة الدفعة المخططة. يتم تأكيد يوم البداية والجدول الأسبوعي قبل بدء الدفعة.']) },
      pricing: { title: pick(['Choose how you pay for the complete diploma.', 'اختَر طريقة دفع الدبلومة كاملة.']), description: pick(['Both markets and both payment options are shown below. Contact the academy to arrange your booking and payment.', 'الأسعار للسوقين وخيارات الدفع متاحة بوضوح. تواصل مع الأكاديمية لترتيب الحجز والدفع.']), fullLabel: pick(['Full payment · complete diploma','دفعة واحدة · الدبلومة كاملة']), installmentLabel: pick(['Installment total · complete diploma','إجمالي التقسيط · الدبلومة كاملة']), depositLabel: pick(['Booking deposit, included in total','مقدم الحجز، ضمن الإجمالي']), notes: [
        pick(['The deposit is included in the installment total; it is not an extra fee.', 'مقدم الحجز جزء من إجمالي التقسيط، وليس رسومًا إضافية.']),
        pick(['Monthly installments begin with teaching; due dates are provided in writing before payment.', 'تبدأ الأقساط مع التدريس، وتُوضّح مواعيدها كتابة قبل الدفع.']),
        pick(['The stated totals cover the complete diploma.', 'الإجماليات المعلنة تغطي الدبلومة كاملة.']),
        pick(['Payment dates move with any agreed change to the cohort start.', 'تتحرك مواعيد الدفع مع أي تغيير متفق عليه في بداية الدفعة.']),
        pick(['The agreed price is fixed after booking confirmation. Read the complete terms below before payment.', 'السعر المتفق عليه ثابت بعد تأكيد الحجز. اقرأ الشروط كاملة أدناه قبل الدفع.'])
      ], plans: pricingPlans.map(p=>({ title: p.id === 'egypt' ? pick(['Egyptian students','للطلاب المصريين']) : pick(['International students outside Egypt','للطلاب الدوليين من خارج مصر']), full: `${p.currency} ${number(p.full)}`, total:`${p.currency} ${number(p.total)}`, deposit:`${p.currency} ${number(p.deposit)}`, installments: ar ? `${p.count} أقساط شهرية، كل منها ${number(p.monthly)} ${p.currency}` : `${p.count} monthly installments of ${p.currency} ${number(p.monthly)}`, equation:`${number(p.deposit)} + ${p.count} × ${number(p.monthly)} = ${number(p.total)} ${p.currency}`, contactLabel:pick(['Apply with this pricing plan','قدّم بالخطة دي']), inquiryMessage:pick([`Hello, I would like to apply for the Java & Spring Boot Backend Development Diploma with interest in the ${p.id === 'egypt' ? 'Egyptian' : 'international'} student pricing plan. Please clarify the scheduling status and the application and payment steps.`, `مرحبًا، أرغب في التقديم لدبلومة Backend باستخدام Java وSpring Boot بخطة ${p.id === 'egypt' ? 'الطلاب المصريين' : 'الطلاب الدوليين'}. أرجو توضيح حالة المواعيد وخطوات التقديم والدفع الكامل أو التقسيط.`]) })) },
      document: { title:pick(['Keep the full roadmap close.', 'خريطة الدبلومة معاك في ملف واحد.']), description:pick(['Backend Development Diploma — Overview & Roadmap. The original programme document: curriculum, monthly projects, learning approach, graduation expectations and payment notes.', 'دبلومة Backend — النظرة العامة وخريطة التعلّم. الملف الأصلي للبرنامج: المنهج والمشاريع الشهرية وأسلوب التعلّم وتوقّعات التخرّج وملاحظات الدفع.']), meta: `PDF · ${document.pages} ${ar ? 'صفحة' : 'pages'} · ${(document.bytes / 1000000).toFixed(2)} MB`, view:pick(['View PDF','عرض الملف']),download:pick(['Download PDF','تحميل الملف']), newTab:pick(['Opens in a new tab','يفتح في تبويب جديد']) },
      faq: { title:pick(['Questions before you book', 'أسئلة قبل ما تحجز']), contact:pick(['For anything else, contact the academy to confirm the details.', 'لو عندك سؤال تاني، تواصل مع الأكاديمية لتأكيد التفاصيل.']), items: [
        [['Is registration open?', 'هل الحجز مفتوح؟'], ['Yes. Contact the academy on WhatsApp to arrange booking and payment. Opening the link does not complete registration.', 'أيوه، الحجز مفتوح. تواصل مع الأكاديمية على WhatsApp لترتيب الحجز والدفع. فتح الرابط لا يُكمل التسجيل.']],
        [['Is it suitable for complete beginners?', 'هل الدبلومة مناسبة للمبتدئين من الصفر؟'], ['Yes. The path starts from your first Java program and builds towards backend applications.', 'أيوه، يبدأ المسار من أول برنامج Java ويتدرج إلى بناء تطبيقات Backend.']],
        [['What basic skills do I need?', 'ما المهارات الأساسية المطلوبة؟'], ['Basic computer and file-management skills, plus readiness for regular practice.', 'مهارات أساسية في استخدام الكمبيوتر وإدارة الملفات، مع الاستعداد للممارسة المنتظمة.']],
        [['What language is used for teaching?', 'ما لغة الشرح؟'], ['Arabic, using standard English technical terminology.', 'العربية، مع استخدام المصطلحات التقنية الإنجليزية المتعارف عليها.']],
        [['How long is the diploma?', 'ما مدة الدبلومة؟'], [`${months}, across ${plan.studyWeeks} training weeks.`, `${months}، موزّعة على ${plan.studyWeeks} أسبوعًا تدريبيًا.`]],
        [['How many sessions are there each week?', 'كم جلسة في الأسبوع؟'], [`${plan.sessionsPerWeek} live sessions per week; ${plan.totalSessions} in total.`, `جلستان مباشرتان أسبوعيًا؛ ${plan.totalSessions} جلسة إجمالًا.`]],
        [['What does the five-hour session include?', 'ماذا تشمل الجلسة ذات الخمس ساعات؟'], [sessionSummary, sessionSummary]],
        [['Are breaks included in the 360 hours?', 'هل الـ360 ساعة تشمل الاستراحات؟'], [`Yes: ${plan.learningHours} learning hours + ${plan.breakHours} break hours = ${plan.scheduledHours} scheduled hours.`, `نعم: ${plan.learningHours} ساعة تعلّم + ${plan.breakHours} ساعة استراحات = ${plan.scheduledHours} ساعة مجدولة.`]],
        [['How much independent practice is expected?', 'كم ساعة ممارسة مستقلة متوقعة؟'], [`${practiceHours} hours each week, in addition to scheduled sessions, for assignments, projects and revisions.`, `${practiceHours} ساعة أسبوعيًا، بالإضافة إلى الجلسات المجدولة، للتكليفات والمشاريع والتعديلات.`]],
        [['Which technologies will I study?', 'ما التقنيات التي سأدرسها؟'], [`Java ${plan.javaVersion}, Git, SQL / MySQL, then Spring Boot ${plan.springBootVersion} and Spring ${plan.springVersion}, APIs, testing, security, Linux, containers, CI/CD, system design and reviewed AI tools. All 21 modules appear in the roadmap.`, `Java ${plan.javaVersion} وGit وSQL / MySQL، ثم Spring Boot ${plan.springBootVersion} وSpring ${plan.springVersion} وواجهات API والاختبارات والأمان وLinux والحاويات وCI/CD وتصميم الأنظمة وأدوات AI مع المراجعة. كل الوحدات الـ21 موضحة في المنهج.`]],
        [['What projects will I build?', 'ما المشاريع التي سأبنيها؟'], [`${plan.projectCount} monthly projects, from Expense Tracker Console to the Commerce Platform Capstone team project. The project section lists each month in order.`, `${plan.projectCount} مشاريع شهرية، من Expense Tracker Console إلى مشروع Commerce Platform Capstone الجماعي. قسم المشاريع يوضح كل شهر بالترتيب.`]],
        [['How do mentorship and reviews work?', 'كيف تعمل المتابعة ومراجعة الكود؟'], ['Mohamed Tamer is the trainer and mentor. Weekly submissions, rotating code reviews and monthly project feedback support progress, through agreed support channels.', 'محمد تامر هو المدرّب والموجّه. تدعم التقدّم تسليمات أسبوعية ومراجعات كود بالتناوب وملاحظات شهرية على المشاريع، عبر قنوات الدعم المتفق عليها.']],
        [['When are AI tools introduced?', 'متى تُستخدم أدوات AI؟'], ['After programming and testing foundations. Codex and Claude Code work is reviewed through diffs and checks. Assessment also includes an unaided task.', 'بعد أساسيات البرمجة والاختبار. يُراجع العمل بمساعدة Codex وClaude Code عبر الفروق والفحوصات. يشمل التقييم مهمة دون مساعدة أيضًا.']],
        [['When is the proposed start?', 'متى البداية المقترحة؟'], [start + '.', start + '.']],
        [['When will the timetable be confirmed?', 'متى يتم تأكيد الجدول؟'], ['The exact start day and weekly timetable will be confirmed before the cohort begins.', 'يتم تأكيد يوم البداية والجدول الأسبوعي قبل بدء الدفعة.']],
        [['How many students are planned?', 'ما العدد المخطط للدفعة الأولى؟'], [`${capacity} students. This is planned cohort capacity.`, `${capacity} طالبًا. هذه سعة الدفعة المخططة.`]],
        [['What are the prices?', 'ما أسعار مصر والدولي؟'], [fullPrices,fullPrices]],
        [['Is the deposit included in the installment total?', 'هل مقدم الحجز ضمن إجمالي التقسيط؟'], [`Yes. ${installmentEquations}. The deposit is not an extra fee.`, `نعم. ${installmentEquations}. المقدم ليس رسومًا إضافية.`]],
        [['When do installments start?', 'متى تبدأ الأقساط؟'], ['When teaching begins. Payment dates move with any agreed change to the cohort start.', 'عند بدء التدريس. تتحرك مواعيد الدفع مع أي تغيير متفق عليه في بداية الدفعة.']],
        [['How do I arrange booking and payment?', 'كيف أرتّب الحجز والدفع؟'], ['Read How to apply and the published terms, then send your application information on WhatsApp. Booking requires completed information, agreement to terms, required payment, and academy confirmation.', 'اقرأ خطوات التقديم والشروط المنشورة، وبعدها ابعت بياناتك على WhatsApp. الحجز يحتاج استكمال البيانات والموافقة على الشروط وسداد المبلغ المطلوب وتأكيد الأكاديمية.']],
        [['How do I view or download the roadmap?', 'كيف أعرض أو أحمّل خريطة الدبلومة؟'], ['Use View PDF to open the original 15-page document in a new tab, or Download PDF to save it using your browser.', 'استخدم عرض الملف لفتح المستند الأصلي ذي الـ15 صفحة في تبويب جديد، أو تحميل الملف لحفظه باستخدام المتصفح.']],
        [['How do I get booking and withdrawal terms?', 'كيف أحصل على شروط الحجز والانسحاب؟'], ['All 15 booking, payment and withdrawal terms are published in the Booking terms section of this page. Read them before payment.', 'شروط الحجز والدفع والانسحاب الـ15 منشورة كاملة في قسم شروط الحجز على الصفحة. اقرأها قبل الدفع.']]
      ].map(([question,answer])=>({question:pick(question),answer:pick(answer)})) },
      closing: { title:pick(['Ready to build your first backend?', 'جاهز تبني أول Backend بإيدك؟']), description:pick(['Applications are open. Review the programme, read the terms, prepare your information and contact MT Academy to begin your application.', 'التقديم مفتوح. راجع البرنامج، اقرأ الشروط، جهّز بياناتك وتواصل مع MT Academy لبدء طلب التقديم.']) }
    };
    Object.assign(translations[locale], buildEnrollmentContent(locale));
    const additionalFaqs = [
      ['application-information','application','What information should I send?','ما البيانات اللي أبعتها؟',
        'Send all 12 fields in one message: Arabic and English names, email, WhatsApp with country code, residence, study/work, programming background, goal, equipment/internet, time commitment, availability in Cairo time, and preferred payment system.',
        'ابعت الحقول الـ12 في رسالة واحدة: الاسم بالعربي والإنجليزي، الإيميل، WhatsApp بكود الدولة، الإقامة، الدراسة أو العمل، خلفيتك البرمجية، هدفك، الجهاز والإنترنت، الالتزام بالوقت، المواعيد بتوقيت القاهرة ونظام الدفع المفضل.','#apply'],
      ['application-only','application','Does sending my information reserve a place?','هل إرسال بياناتي بيحجز مكان؟',
        'No. Sending information is an application only. A place is not reserved just by sending your details.',
        'لأ. إرسال البيانات طلب تقديم فقط، ومش بيحجز مكان لوحده.','#terms-confirmation'],
      ['booking-confirmation','application','When is booking confirmed?','إمتى الحجز بيتأكد؟',
        'After completing application information, agreeing to the terms, paying the required amount, and receiving confirmation from the academy.',
        'بعد استكمال بيانات التقديم والموافقة على الشروط وسداد المبلغ المطلوب واستلام تأكيد من الأكاديمية.','#terms-confirmation'],
      ['unsuitable-timetable','application','What if the final timetable does not suit me?','لو الجدول النهائي مش مناسب ليا؟',
        'The scheduling status is clarified before payment and the final timetable before the start. If it does not suit you, you may cancel before study begins and receive a full refund of the amount paid.',
        'هنوضح حالة المواعيد قبل الدفع والجدول النهائي قبل البداية. لو الجدول مش مناسب ليك، تقدر تلغي قبل بداية الدراسة وتسترد المبلغ المدفوع بالكامل.','#terms-schedule'],
      ['withdraw-before','withdrawals','Can I withdraw before study begins?','أقدر أنسحب قبل بداية الدراسة؟',
        'Yes. All amounts paid are refunded without an administrative deduction.',
        'أيوه. هتسترد كل المبالغ المدفوعة بدون خصم رسوم إدارية.','#terms-withdrawal-before-start'],
      ['withdraw-after','withdrawals','How is a refund calculated after study begins?','إزاي بيتحسب الاسترداد بعد بداية الدراسة؟',
        `Session value is the total diploma price for your agreed payment system divided by ${plan.totalSessions}. Deduct the value of sessions delivered and available up to the request date from what you actually paid; any remaining paid balance is refunded.`,
        `قيمة السيشن هي سعر الدبلومة الكامل بنظام الدفع المتفق عليه ÷ ${plan.totalSessions}. بنخصم قيمة السيشنات المقدمة والمتاحة حتى تاريخ الطلب من اللي دفعته فعليًا، ونرد باقي الرصيد المدفوع إن وجد.`,'#terms-withdrawal-after-start'],
      ['missed-sessions','withdrawals','Do missed sessions count?','هل السيشنات اللي غبت عنها بتتحسب؟',
        'Yes, if the session was delivered and available to you. Absence does not exclude it from the calculation.',
        'أيوه، لو السيشن اتقدمت وكانت متاحة ليك. الغياب مش بيلغي احتسابها.','#terms-withdrawal-after-start'],
      ['undelivered-sessions','withdrawals','Do canceled or undelivered sessions count?','هل السيشنات الملغاة أو اللي متقدمتش بتتحسب؟',
        'No. Canceled sessions and sessions the academy did not provide are excluded.',
        'لأ. السيشنات الملغاة أو اللي الأكاديمية لم تقدمها لا تدخل في الحساب.','#terms-withdrawal-after-start'],
      ['withdrawal-channel','withdrawals','How do I submit a withdrawal request?','أبعت طلب الانسحاب إزاي؟',
        'Send it in writing to the official WhatsApp contact linked on this page.',
        'ابعت الطلب كتابة على واتساب التواصل الرسمي المرتبط بالصفحة.','#terms-withdrawal-request'],
      ['withdrawal-date','withdrawals','Which date is used for the settlement?','أي تاريخ بيُستخدم في حساب التسوية؟',
        'The date you send the written withdrawal request is the calculation cutoff. The refund deadline starts when the academy receives it.',
        'تاريخ إرسال طلب الانسحاب المكتوب هو الحد المستخدم في الحساب. مهلة رد المبلغ تبدأ من استلام الأكاديمية للطلب.','#terms-withdrawal-request'],
      ['refund-deadline','withdrawals','When and how is a refund processed?','إمتى وإزاي بيتم رد المبلغ؟',
        `Settlement details and any refund due are provided within ${bookingPolicy.refund.calendarDays} calendar days of receiving the request, in the same currency and payment method where possible, or an alternative agreed in writing.`,
        `هنرسل تفاصيل التسوية ونرد أي مبلغ مستحق خلال ${bookingPolicy.refund.calendarDays} أيام تقويمية من استلام الطلب، بنفس العملة وطريقة الدفع متى أمكن، أو بطريقة بديلة نتفق عليها كتابة.`,'#terms-withdrawal-request'],
      ['future-installments','withdrawals','What happens to future installments after withdrawal?','إيه اللي بيحصل للأقساط المستقبلية بعد الانسحاب؟',
        'Participation and future installments stop after withdrawal.',
        'بعد الانسحاب بيتوقف اشتراكك والأقساط المستقبلية.','#terms-withdrawal-request'],
      ['academy-cancellation','withdrawals','What if the academy cancels the cohort before the start?','لو الأكاديمية ألغت الراوند قبل البداية؟',
        'You receive a full refund of the amount paid.',
        'هتسترد المبلغ المدفوع بالكامل.','#terms-academy-changes'],
      ['teaching-stops','withdrawals','What if teaching permanently stops after the start?','لو الدراسة توقفت نهائيًا بعد البداية؟',
        'You receive a refund for the unprovided portion from the amounts you have paid.',
        'هتسترد قيمة الجزء غير المقدم من المبالغ اللي دفعتها.','#terms-academy-changes'],
      ['material-schedule-change','withdrawals','What if a material schedule change prevents me from continuing?','لو تغيير جوهري في المواعيد منعني من الاستمرار؟',
        'You may withdraw and recover the paid balance corresponding to undelivered sessions.',
        'تقدر تنسحب وتسترد الرصيد المدفوع مقابل السيشنات غير المقدمة.','#terms-academy-changes'],
      ['cohort-transfer','withdrawals','Can I be transferred to another cohort without agreeing?','ينفع أتحول لراوند تانية من غير موافقتي؟',
        'No. Transfer to another cohort requires your agreement.',
        'لأ. التحويل لراوند تانية بيكون بموافقتك.','#terms-academy-changes'],
      ['late-installment','payments','What happens if an installment is late?','لو اتأخرت في سداد قسط؟',
        `The academy contacts you. After a ${bookingPolicy.latePayment.graceDays}-day grace period from the due date and written notice, access to new sessions may be suspended temporarily until payment or agreed withdrawal and settlement.`,
        `الأكاديمية هتتواصل معاك. بعد مهلة ${bookingPolicy.latePayment.graceDays} أيام من موعد الاستحقاق وتنبيه مكتوب، ممكن يتوقف الوصول للسيشنات الجديدة مؤقتًا لحين السداد أو الاتفاق على الانسحاب وتسوية الحساب.`,'#terms-late-payment'],
      ['late-fines','payments','Are there late-payment fines?','هل فيه غرامات تأخير؟',
        'No. There are no late-payment fines.', 'لأ. مفيش غرامات تأخير.','#terms-late-payment'],
      ['fixed-price','payments','Is the agreed price fixed?','هل السعر المتفق عليه ثابت؟',
        'Yes, after booking confirmation. Installment due dates are provided in writing before payment and monthly installments begin with teaching.',
        'أيوه، بعد تأكيد الحجز. مواعيد الأقساط بتتوضح كتابة قبل الدفع، والأقساط الشهرية تبدأ مع الدراسة.','#terms-installments'],
      ['payment-confirmation','payments','What payment confirmations will I receive?','هستلم إيه بعد كل دفعة؟',
        'Confirmation of the amount paid and the remaining balance. Keep receipts, booking confirmation and the installment schedule.',
        'تأكيد بالمبلغ المدفوع والمتبقي. احتفظ بالإيصالات وتأكيد الحجز وجدول الأقساط.','#terms-payment-records'],
      ['employment','programme','Is employment guaranteed?','هل فيه ضمان وظيفة؟',
        'No. Training and mentorship do not guarantee employment. Progress requires attendance, practice, assignments and applying feedback.',
        'لأ. التدريب والمتابعة لا يضمنوا الحصول على وظيفة. الاستفادة محتاجة حضور وتطبيق وتكليفات ومراجعة الملاحظات.','#terms-participation'],
      ['material-use','programme','Can I share materials or record sessions?','أقدر أشارك المواد أو أسجل السيشنات؟',
        'Materials are for personal use. Sharing, selling, publishing or student recording requires permission. Respect the trainer’s and other students’ privacy.',
        'المواد للاستخدام الشخصي. مشاركتها أو بيعها أو نشرها أو تسجيل الطالب للسيشنات يحتاج إذن. احترم خصوصية المدرب وباقي الطلاب.','#terms-materials'],
      ['application-data-use','application','How is my application information used?','بيانات التقديم بتُستخدم في إيه؟',
        'For applications, communication and organizing study.', 'للتقديم والتواصل وتنظيم الدراسة.','#application-privacy'],
      ['sensitive-information','application','Should I send identity documents, bank-card details or verification codes?','أبعت صورة بطاقة أو بيانات بطاقة بنكية أو أكواد تحقق؟',
        'No. These are not requested. Send only the application information listed on this page.',
        'لأ. البيانات دي مش مطلوبة. ابعت بيانات التقديم الموضحة في الصفحة فقط.','#application-privacy'],
      ['acceptance-message','application','How do I send the acceptance message?','أبعت رسالة الموافقة إزاي؟',
        'Read the full terms, complete the application information, fill in the chosen payment system in the separate acceptance message, then send it to the academy before payment. Copying it does not send acceptance or confirm booking.',
        'اقرأ الشروط كاملة واستكمل بيانات التقديم، واملأ نظام الدفع المختار في رسالة الموافقة المنفصلة، وبعدها ابعتها للأكاديمية قبل الدفع. النسخ لا يرسل موافقة ولا يؤكد حجزًا.','#acceptance-message']
    ];
    const faq = translations[locale].faq;
    faq.items.forEach((item,i) => {
      item.group = i < 16 ? 'programme' : i < 19 ? 'payments' : 'application';
      if (i === 19 || i === 21) { item.href = i === 19 ? '#apply' : '#booking-terms'; item.linkLabel = pick(['Read the full section','اقرأ القسم كاملًا']); }
    });
    faq.items.push(...additionalFaqs.map(([id,group,qEn,qAr,aEn,aAr,href])=>({id,group,question:pick([qEn,qAr]),answer:pick([aEn,aAr]),href,linkLabel:pick(['Read the full section','اقرأ القسم كاملًا'])})));
    faq.groups = [
      {id:'programme', title:pick(['About the diploma','عن الدبلومة'])},
      {id:'application', title:pick(['Application & confirmation','التقديم وتأكيد الحجز'])},
      {id:'payments', title:pick(['Payments & installments','الدفع والأقساط'])},
      {id:'withdrawals', title:pick(['Withdrawal, refunds & changes','الانسحاب والاسترداد والتغييرات'])}
    ];
    translations[locale].document.currentTermsNote = pick(['The original PDF is unchanged. Read the current application instructions and complete booking, payment and withdrawal terms on this webpage.', 'الملف الأصلي لم يتغير. اقرأ خطوات التقديم الحالية وشروط الحجز والدفع والانسحاب كاملة على الصفحة.']);

  }
  // Existing instructor evidence and related paths remain separately attributed.
  const supportingCopy = {
  "ar": {
    "visualAlt": "غلاف دبلومة تطوير Backend باستخدام Java وSpring Boot من MT Academy",
    "mentor": {
      "eyebrow": "المدرّب والموجّه",
      "name": "بشمهندس محمد تامر",
      "role": "معاك في الشرح والمتابعة طول الدبلومة.",
      "description": "محمد تامر هيكون المدرّب والموجّه خلال الدبلومة: يوجّهك، يساعدك ترتّب خطواتك، ويتابع مستواك وتقدّمك في الدراسة والتطبيق.",
      "title": "الدبلومة جديدة، لكن الخبرة اللي مبنية عليها مش جديدة.",
      "attribution": "الأرقام دي عن خبرة محمد تامر السابقة في التدريس والتوجيه والمتابعة، مش أعداد طلاب أو نتائج للدبلومة الجديدة.",
      "evidence": "تقدر ترجع للتجارب والتقييمات الحقيقية الموجودة عن كورسات Udemy وتشوف بنفسك طريقة الشرح.",
      "udemyLabel": "ملف محمد تامر على Udemy",
      "reviewsLabel": "تقييمات كورسات Udemy",
      "portraitAlt": "بشمهندس محمد تامر، المدرّب والموجّه خلال الدبلومة"
    },
    "related": {
      "title": "اكتشف مساراتنا الحالية",
      "udemyTitle": "كورسات Udemy",
      "udemyDescription": "كورسات برمجة باللغة العربية لتطوير مهاراتك.",
      "udemyCta": "تصفّح كورسات Udemy",
      "kidsTitle": "Kids Coding Bootcamp",
      "kidsDescription": "برمجة للأطفال والمراهقين أونلاين لايف.",
      "kidsCta": "اكتشف برمجة الأطفال"
    },
    "footer": {
      "statement": "تعلّم البرمجة مع MT Academy — مسارات مختلفة لأهداف مختلفة.",
      "home": "الرئيسية",
      "paths": "مسارات التعلّم",
      "udemy": "كورسات Udemy",
      "kids": "برمجة الأطفال",
      "backend": "دبلومة Backend",
      "top": "العودة للأعلى",
      "copyright": "MT Academy. جميع الحقوق محفوظة.",
      "navigationLabel": "روابط سريعة"
    }
  },
  "en": {
    "visualAlt": "MT Academy Backend Development Diploma with Java and Spring Boot product box",
    "mentor": {
      "eyebrow": "Your instructor and mentor",
      "name": "Engineer Mohamed Tamer",
      "role": "Teaching and guidance throughout the diploma.",
      "description": "Mohamed Tamer will be both your instructor and mentor: guiding you, helping organize your learning steps and following your progress in study and practice.",
      "title": "A new diploma, built on established experience.",
      "attribution": "These figures describe Mohamed Tamer’s prior teaching and mentorship experience. They are not student counts or results for this new diploma.",
      "evidence": "Explore real reviews of the existing Udemy courses to see learners’ experiences with the teaching.",
      "udemyLabel": "Mohamed Tamer’s Udemy profile",
      "reviewsLabel": "Reviews of Udemy courses",
      "portraitAlt": "Engineer Mohamed Tamer, the diploma instructor and mentor"
    },
    "related": {
      "title": "Explore our current learning paths",
      "udemyTitle": "Udemy courses",
      "udemyDescription": "Programming courses taught in Arabic to develop your skills.",
      "udemyCta": "Browse Udemy courses",
      "kidsTitle": "Kids Coding Bootcamp",
      "kidsDescription": "Live online coding for children and teenagers.",
      "kidsCta": "Discover kids coding"
    },
    "footer": {
      "statement": "Learn programming with MT Academy — different paths for different goals.",
      "home": "Home",
      "paths": "Learning paths",
      "udemy": "Udemy courses",
      "kids": "Kids coding",
      "backend": "Backend diploma",
      "top": "Back to top",
      "copyright": "MT Academy. All rights reserved.",
      "navigationLabel": "Quick links"
    }
  }
};
  const experience = site.instructorProfile.statistics;
  for (const locale of ['ar','en']) {
    const ar = locale === 'ar';
    Object.assign(translations[locale], supportingCopy[locale]);
    const mentor = translations[locale].mentor;
    mentor.experience = ar ? `خبرة أكتر من ${experience.professionalYearsOver} سنين في المجال.` : `More than ${experience.professionalYearsOver} years of professional experience.`;
    mentor.stats = [
      {value: `${number(experience.udemyLearnersOver)}+`, label: ar ? 'متعلّم على Udemy' : 'Learners on Udemy'},
      {value: `${number(experience.udemyReviewsOver)}+`, label: ar ? 'تقييمًا لكورسات Udemy' : 'Reviews of Udemy courses'},
      {value: `${number(experience.mentorshipTraineesOver)}+`, label: ar ? 'متدرّب في المنتورشيب' : 'Mentorship trainees'},
      {value: `${number(experience.mentorshipCountriesOver)}+`, label: ar ? 'دولة في المنتورشيب' : 'Countries across mentorship experiences'}
    ];
  }
  const path = '/backend-development-diploma/';
  window.MTAcademyBackend = window.MTAcademyCore.deepFreeze({
    id: 'backend-diploma', name: 'Backend Development Diploma with Java & Spring Boot', path,
    status: 'open', bookingPolicy, technologies: [`Java ${plan.javaVersion}`,`Spring Boot ${plan.springBootVersion}`,`Spring ${plan.springVersion}`], plan, pricingPlans, sessionBlocks, document, experience,
    instructor: {name: 'Mohamed Tamer', role: 'instructor-and-mentor'},
    evidenceLinks: {udemy: site.contact.enrollmentUrl, reviews: '/#reviews'},
    visual: {src: '/assets/images/backend/backend-development-diploma-box.webp', width: 1254, height: 1254, viewport: {left:154,top:37,width:990,height:1160}},
    socialImage: '/assets/images/backend/backend-social-preview.png', translations,
    courseSchema(locale) {
      const copy = translations[locale];
      return {'@type':'Course','@id':`${new URL(path,site.siteUrl).href}#course`,name:copy.hero.title,description:copy.seo.description,
        url:new URL(path,site.siteUrl).href,inLanguage:'ar',
        coursePrerequisites:copy.audience.description,educationalLevel:'Beginner',
        provider:{'@id':`${site.siteUrl}#organization`},teaches:copy.curriculum.stages.flatMap(stage=>stage.modules.map(module=>module.title))};
    }
  });
})();
