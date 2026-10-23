# MT Academy — Programming Learning Paths

[![Live Website](https://img.shields.io/badge/Live_Website-Visit_MT_Academy-0b4f3f?style=for-the-badge)](https://mtacademy-courses.github.io/)
[![License](https://img.shields.io/badge/License-Apache_2.0-c9a84c?style=for-the-badge)](LICENSE)

![MT Academy Course Catalog](assets/images/brand/social-preview.png)

A fast, responsive, bilingual website for **MT Academy**, with three learning paths: programming courses on **Udemy**, a live online **Kids Coding Bootcamp** for ages 6–18, and a **Backend Development Diploma with Java & Spring Boot** for complete beginners.

The website is Arabic-first, includes a complete English interface, and is built with semantic HTML, modern CSS, and vanilla JavaScript. It has no framework, package manager, build step, external font, or runtime dependency.

## Live website

**[mtacademy-courses.github.io](https://mtacademy-courses.github.io/)**

## Highlights

- Arabic and English interfaces with automatic RTL/LTR layout switching
- Saved language preference across visits
- Responsive course catalog with search and category filters
- Detailed course dialogs with shareable URL hashes and browser history support
- Instructor profile, learner reviews, payment methods, and contact options
- Shared homepage learning-path discovery, with separate data for Udemy, Kids, and the Backend diploma, now open for registration
- A complete bilingual Backend landing page with open registration, the full curriculum, monthly projects, mentorship, pricing and the original roadmap PDF
- Dedicated kids page with five levels, genuine session imagery, and parent FAQs
- Accessible keyboard navigation, labels, dialogs, and live result announcements
- SEO metadata, Open Graph preview, sitemap, robots file, and structured data
- Graceful no-JavaScript enrollment links
- Custom GitHub Pages 404 page
- No installation, compilation, or build process required

## Courses

The catalog currently features six Arabic programming courses:

- Master SOLID Principles
- Master Oracle Database SQL
- Learn HTML — Full Tutorial
- Kotlin for Beginners: From Zero to Hero
- Android Kotlin Development: From Zero to Hero
- Build a REST API with Ktor — CRUD API

Course details, ratings, enrollment links, categories, learning outcomes, and localized copy are maintained in [`assets/js/courses-data.js`](assets/js/courses-data.js).

## Technology

| Area | Technology |
| --- | --- |
| Structure | HTML5 |
| Styling | CSS3 with custom properties and responsive layouts |
| Interactivity | Vanilla JavaScript |
| Content | Centralized JavaScript configuration |
| Hosting | GitHub Pages |
| Languages | Arabic and English |

## Run locally

For shared UI/UX ownership and the latest visual/responsive validation, see [UI/UX quality](docs/uiux-quality.md) and [platform maintenance](docs/platform-maintenance.md).

Clone the repository and start any static HTTP server:

```bash
git clone https://github.com/mtacademy-courses/mtacademy-courses.github.io.git
cd mtacademy-courses.github.io
python3 -m http.server 8000
```

Then open [the homepage](http://localhost:8000/) [the kids page](http://localhost:8000/kids-coding-bootcamp/), or [the Backend diploma](http://localhost:8000/backend-development-diploma/). Test English with `?lang=en`, and Arabic with `?lang=ar`.

Opening `index.html` directly is not recommended because URL hashes, navigation history, and 404 behavior are best tested through a local server.

## Project structure

```text
.
├── index.html                       # Homepage and existing Udemy catalog
├── kids-coding-bootcamp/index.html   # Static kids landing page
├── backend-development-diploma/index.html # Static registration landing page
├── 404.html                         # Localized error page
├── assets/
│   ├── css/
│   │   ├── styles.css               # Shared primitives and Udemy/homepage styles
│   │   ├── kids-coding-bootcamp.css  # Kids page styles
│   │   └── backend-diploma.css       # Registration page styles
│   ├── js/
│   │   ├── site-core.js             # Shared locale, navigation, metadata, scroll lock
│   │   ├── site-data.js             # Shared academy identity/contact facts
│   │   ├── courses-data.js          # Udemy content and scheduled campaign
│   │   ├── app.js                   # Existing Udemy page controller
│   │   ├── kids-data.js             # Independent kids content, gallery and offer
│   │   ├── kids.js                  # Kids page controller
│   │   ├── learning-paths-data.js    # Shared homepage cards and translations
│   │   ├── backend-diploma-data.js   # Program facts, curriculum, projects, prices and translations
│   │   └── backend-diploma.js        # Registration page controller
│   ├── documents/                 # Original Backend diploma roadmap PDF
│   └── images/
│       ├── brand/, courses/, payment/, reviews/
│       ├── kids/sessions/           # Optimized full-size images and thumbnails
│       ├── kids/levels/             # Official and executed demonstration visuals
│       ├── kids/social/             # Kids Open Graph image
│       ├── backend/                 # Code-native illustration and social preview
│       └── Me.png
├── scripts/shared-markup.cjs        # Shared static navigation/footer markup
├── scripts/refresh-homepage.cjs      # Homepage content/stats/payments/navigation authoring
├── scripts/refresh-kids-page.cjs     # Optional authoring helper for static Arabic HTML
├── scripts/refresh-backend-page.cjs  # Optional registration page authoring helper
├── docs/kids-image-sources.md        # Asset mapping and attribution
├── docs/examples/                    # Executable visual demonstrations
├── sitemap.xml
├── robots.txt
├── LICENSE
└── README.md
```

## Customize the website

Shared academy identity, locales, the instructor image, personal LinkedIn profile, and contact destinations live in [`assets/js/site-data.js`](assets/js/site-data.js), exposed as deeply frozen `window.MTAcademySite`.

Udemy content remains in [`assets/js/courses-data.js`](assets/js/courses-data.js), exposed through the existing deeply frozen `window.MTAcademyData` contract (`siteConfig`, `courses`). Its translations include the hero, catalog, payments, reviews, and campaign copy. Global navigation and instructor evidence come from shared site data.

Kids content lives separately in [`assets/js/kids-data.js`](assets/js/kids-data.js), exposed as deeply frozen `window.MTAcademyKids`. The five levels are not Udemy products. Edit `translations.ar` and `translations.en` together for copy, FAQs, captions, alt text, learning focus, example ideas, and inquiry messages.

Load scripts in this order:

- Homepage: `site-core.js`, `site-data.js`, `courses-data.js`, `kids-data.js`, `backend-diploma-data.js`, `learning-paths-data.js`, `app.js`.
- Kids page: `site-core.js`, `site-data.js`, `kids-data.js`, `kids.js`.
- Backend: `site-core.js`, `site-data.js`, `backend-diploma-data.js`, `backend-diploma.js`.
- 404: `site-core.js`, `site-data.js`, `courses-data.js`, `app.js`.

All page controllers share locale storage (`mt-academy-locale`), safe links, metadata, mobile menu behavior, navigation tracking, and scroll locking. An explicit `?lang=en` or `?lang=ar` takes precedence over the saved preference and persists across pages. Switching languages preserves course dialog hashes and browser history state.


### Shared homepage learning paths

[`assets/js/learning-paths-data.js`](assets/js/learning-paths-data.js) exposes deeply frozen `window.MTAcademyPaths`: the three offering IDs/destinations, Kids and Backend preview image metadata, section heading, existing card summaries, and localized accessible image labels. This homepage content no longer belongs to `kids-data.js`.

`renderLearningPaths(locale)` in `site-core.js` updates generic `data-path-*` bindings. Backend title, summary, facts, CTA, status, visual and localized alt text are resolved from the diploma's separate data source. `renderKidsOffering(locale)` now manages only the independent Kids discount; the Udemy campaign remains in the catalog controller.

The two current cards retain their large box/cover images and occupy the first desktop row. The Backend diploma uses the shared learning-path card layout; mobile stacks all three in semantic order (Udemy, Kids, Backend). The six-item primary header groups the three paths under an accessible native Learning paths disclosure, in Udemy → Kids → Backend order. Mobile shows the same hierarchy expanded, below `70rem` (1120px). Kids-specific shortcuts remain inside the Kids page. The shared JavaScript cutoff matches the CSS. Content layout breakpoints remain independent.

### Backend diploma — registration open

The complete landing page lives at [`backend-development-diploma/index.html`](backend-development-diploma/index.html), served at `/backend-development-diploma/`. It is designed for complete beginners with basic computer/file-management skills. The plan is 9 training months, 36 weeks, 72 live sessions, two sessions each week and nine monthly projects. Each five-hour scheduled block includes breaks: **360 scheduled hours = 324 learning hours + 36 break hours**. Independent practice is an additional **12–16 hours each week**.

Edit [`assets/js/backend-diploma-data.js`](assets/js/backend-diploma-data.js) for central numeric facts, all 8 stages / 21 modules and their complete topics, nine projects, learning activities, session breakdown, graduation expectations, pricing, PDF metadata, the 17-field application message, all 15 booking/payment/withdrawal clauses, a separate acceptance message and 58 grouped FAQs in Arabic and English. Java 17 precedes SQL, then Spring Boot 4 / Spring 7. Core topics receive repeated practice; Kubernetes deployment is guided; sharding, service mesh and mTLS are introductory. Shared instructor statistics and genuine Udemy evidence remain attributed to prior teaching/mentorship.

`status: 'open'` supplies the homepage and diploma badge. The proposed start is **February 2027**, with a planned **15–20 students**; the exact day and weekly timetable will be confirmed before the cohort begins. WhatsApp buttons use the verified shared contact with localized draft messages, including market-specific pricing messages. Visitors arrange booking confirmation and payment with the academy.

Egyptian pricing: **EGP 16,500** in full, or **EGP 18,000** installments (EGP 4,000 deposit + 7 × EGP 2,000). International pricing: **USD 650** in full, or **USD 750** installments (USD 150 deposit + 6 × USD 100). The deposit is included in the total. Installments start with teaching; dates follow agreed start changes. The complete booking, payment and withdrawal terms are published on the page and must be read before payment.

The application section provides the 17 requested fields and a complete copyable WhatsApp message. Sending information is an application only. Booking requires completed information, agreement to terms, required payment and academy confirmation. The separate acceptance-message copy action does not send acceptance or confirm a booking. No application-data form or storage was added; locale preferences retain the existing behavior.

The revised application asks about age, actual technologies, work/training experience, independent project contributions and optional LinkedIn/GitHub links. Multiline level/goal options and five closing paragraphs derive from the same localized application data as the clipboard template. Actual experience means work/training time, rather than study time. Prior programming study, projects and professional accounts are not prerequisites. Experienced applicants with specific goals may discuss private-mentorship suitability before deciding to book; no automatic transfer or new eligibility rule is introduced.

All 15 approved clauses are visible in saved HTML and translated fully. Clause 13 includes the complete six-paragraph employment/professional-outcomes clarification, while preserving attendance/practice expectations and the existing clause anchor. One bilingual `careerOutcomesNotice` source supplies the full text, contextual summaries and nine related FAQs. Five notices appear near the hero, instructor evidence, career preparation, both pricing plans and the application action; each links to `#career-outcomes-notice`. The academy’s agreed service commitments, legal rights and withdrawal/refund terms remain explicit. `bookingPolicy` keeps the refund deadline (seven calendar days from receiving the request, with the sending date as settlement cutoff) separate from the late-installment grace period (seven days from the due date, with written notice). The refund formula uses the agreed payment-system total divided by 72 and sessions delivered and available to the student. Copy controls use the native Clipboard API after a click, with localized live feedback and manual-copy fallback.

The original 15-page PDF is hosted unchanged at `assets/documents/mt-academy-backend-diploma-overview-roadmap.pdf`. One configuration URL supplies separate native View PDF (new tab) and Download PDF actions. The PDF is unchanged and does not replace the current webpage application instructions and full terms. Curriculum, projects and prices are also available directly in the page, including saved Arabic HTML without JavaScript.

The shared pricing area also presents five payment channels at `#diploma-payment-methods`: InstaPay, Vodafone Cash, PayPal, Western Union and bank transfer. Backend `paymentMethods` data owns their stable IDs, bilingual names, coordination guidance and inquiry draft; the payment-method FAQ derives its list from those names. Neutral inline icons are decorative, and tiles do not select or process payments. The contact action opens a localized WhatsApp draft using the existing academy contact; no receiving account, fees or currency support is inferred. Initial fragment navigation is realigned after localization/layout, unless the visitor has already interacted.

After editing page copy, navigation, or shared contact facts, synchronize the saved Arabic page and the Backend homepage card:

```bash
node scripts/refresh-backend-page.cjs
node scripts/check-backend-content.cjs
```

This helper uses Node's standard library and synchronizes the diploma page, its homepage card/visual, and the homepage instructor LinkedIn link. GitHub Pages serves the saved HTML without a build. Essential Arabic content and native FAQ disclosures work without JavaScript; the existing controller supplies English and saved language preference. The Kids navigation/footer links are maintained by its own data and authoring helper; run `node scripts/refresh-kids-page.cjs` after changing those.

The homepage card and diploma hero use the supplied product box, optimized losslessly as `assets/images/backend/backend-development-diploma-box.webp`. Its transparency and complete artwork are preserved; descriptor-driven CSS excludes only outer transparent margins. The existing social preview source is `assets/images/backend/backend-social-preview.svg`; its updated registration-open PNG is 1200 × 630. See [`docs/backend-image-sources.md`](docs/backend-image-sources.md) for provenance, viewport bounds and verification.

To use future approved program artwork, update `backend-diploma-data.js`'s `visual` path, actual dimensions and viewport bounds, update `visualAlt` in both languages, then regenerate the page/homepage. The learning-path registry reuses that descriptor for runtime rendering. Update social metadata only if replacing the separately sized social preview. The Backend portrait uses the original shared photo with a closer head-and-upper-body CSS frame; other paths retain their portrait styles.

The page uses native curriculum/FAQ disclosures, keyboard-accessible expand/collapse controls, section shortcuts, responsive layouts and the shared language/navigation/motion system. Course structured data reflects visible program information without inventing exact dates, reviews, accreditation or offers. See [`docs/backend-implementation-checklist.md`](docs/backend-implementation-checklist.md) for the complete 15-page source mapping and verification record. The exact start day and weekly timetable still require confirmation through the academy. Full application instructions and terms are published at `#apply` and `#booking-terms`.

### Instructor LinkedIn profile

The user-confirmed personal LinkedIn URL is maintained once as `MTAcademySite.instructorProfile.linkedinUrl` in `site-data.js`. Its Arabic/English label is `interface.instructorLinkedInLabel`. The homepage Udemy instructor section and dedicated Kids/Backend instructor sections use the same safe-link bindings. It is not added to the academy Organization's `sameAs` links because it identifies the instructor personally. Run both page authoring helpers after changing the URL or labels to update all static Arabic fallbacks. The Backend helper also synchronizes the homepage instructor link.

### Shared facts, navigation, motion and payment maintenance

The source of truth for instructor lower bounds is `instructorProfile.statistics` in `site-data.js`: 21,697+ Udemy learners, 743+ Udemy reviews, 145+ mentorship trainees, 14+ countries and 8+ professional years. Course-level ratings and program enrollment figures remain separate.

The same file owns the localized global navigation hierarchy. `scripts/shared-markup.cjs` generates static navigation; `site-core.js` handles current states, native disclosure behavior, locale-aware destinations, mobile focus/scroll lock and header measurements. All page controllers also reuse its shared reveal/header motion controllers and CSS timing tokens. Essential content is visible by default, including without JavaScript.

The payment section includes Western Union and bank transfer as academy arrangement options with inquiry links; no unconfirmed bank/recipient details are published, and these methods are not described as Udemy checkout methods.

After editing shared facts, navigation or payments, synchronize saved Arabic content:

```bash
node scripts/refresh-homepage.cjs
node scripts/refresh-kids-page.cjs
node scripts/refresh-backend-page.cjs
node scripts/check-backend-content.cjs
node scripts/check-asset-paths.cjs
```

See [`docs/platform-maintenance.md`](docs/platform-maintenance.md) for data ownership, navigation order, motion behavior and remaining transfer details.

### Promotion configuration

The **Udemy** hero offer, floating offer button, popup, countdowns, and eligible-course badges use `siteConfig.promotion` in `courses-data.js` as one source of truth. This campaign applies only to the Udemy catalog. Configure `enabled`, `discountPercent`, `startsAt`, and `endsAt` there; campaign timestamps must include an explicit timezone offset. The promotion is active from `startsAt` (inclusive) until `endsAt` (exclusive), and all promotional UI is removed automatically outside that window.

Coupon and enrollment URLs are maintained separately for each course. Verify new coupon URLs before publishing them—changing the promotion schedule does not make an older coupon link valid for the new campaign.


### Kids page and independent offer

The saved static page is [`kids-coding-bootcamp/index.html`](kids-coding-bootcamp/index.html), served at `/kids-coding-bootcamp/`. It includes the essential Arabic program content, working WhatsApp links, image links, and native FAQ disclosures even without JavaScript. English is provided by the bilingual controller.

After editing kids copy, level definitions, or shared contact facts, synchronize the static Arabic page with:

```bash
node scripts/refresh-kids-page.cjs
```

This is an optional authoring helper using only Node's standard library; deployment serves the saved HTML directly and needs no build command. Keep its template in sync when changing page structure or image sizes. Script execution never writes to `kids-data.js`.

The independent `MTAcademyKids.promotion` has `enabled` and `upToPercent` fields. It currently says **up to 25% off** and has no invented deadline or countdown. Set `enabled: false` to remove the offer from the kids hero, final CTA, and homepage preview together. The Udemy campaign is unaffected. Optional future `startsAt` and `endsAt` values must be supplied explicitly with timezone offsets; the renderer checks these when invoked.

Kids inquiry links use the shared WhatsApp destination and a localized, URL-encoded `inquiryMessage`. They open WhatsApp for an inquiry; they do not send a message automatically or complete enrollment. Payment details, fees, starting level, and availability are handled through the contact channel.

### Kids imagery

See [`docs/kids-image-sources.md`](docs/kids-image-sources.md) for the seven source images, optimized derivatives, MIT attribution, and executable demonstration projects. Real session images establish Code.org and Scratch teaching. MIT App Inventor uses a labeled official example; web and Python visuals show working demonstrations, explicitly identified as examples.

To add a gallery image, add the optimized full-size/thumbnail files, extend `sessions` in `kids-data.js`, and add matching Arabic/English captions and alt text. Run the authoring helper to update the static gallery. Preserve original source files.

For a level image, update its `image.src`, actual dimensions, `kind`, localized alt text, and source/credit where required. Do not attach Udemy statistics, reviews, or prices to the kids program.

## Add or update a course

Edit the `courses` array in [`assets/js/courses-data.js`](assets/js/courses-data.js).

When adding a course:

1. Copy an existing course object.
2. Assign a unique `id` and URL-safe `slug`.
3. Add the course image to `assets/images/courses/` as a transparent WebP cutout.
4. Update the image path, alternative text, width, and height.
5. Provide both Arabic and English translations for every visible field.
6. Use complete `https://` URLs for enrollment links.
7. Update `rating.value`, `rating.max`, and `rating.reviewCount` together.

Optional values may be `""`, `null`, or `[]`; the interface hides unavailable content instead of showing empty fields.

Do not publish prices, discounts, student counts, certificates, or similar claims unless they have been supplied and approved by MT Academy.

## Image guidelines

- Udemy course artwork: `1200 × 1200` WebP with alpha transparency, optimized for the web and using the filename configured in the course object
- Main logo: `assets/images/brand/mt-academy-logo.jpg` at `1000 × 1000`
- Social preview: `assets/images/brand/social-preview.png` at `1200 × 630`
- Payment artwork: `720 × 420` WebP

Course artwork should retain the complete product-box composition while keeping the external studio background transparent. Preserve clean anti-aliased edges and enough transparent space around the product so `object-fit: contain` can display it without cropping, stretching, or exposing a conflicting rectangular background.

Preserve exact filename casing because GitHub Pages paths are case-sensitive. When replacing an image, update its configured dimensions and localized alternative text when necessary.

## Check production asset paths

Before publishing, run:

```bash
node scripts/check-asset-paths.cjs
```

This dependency-free check compares configured and static asset paths against exact filenames in the Git index. It catches case-only mismatches that can work on macOS but return 404 on GitHub Pages, and detects assets that have not been added to Git. Stage new assets before running it.

## Quality checklist

Before publishing changes, verify:

- Arabic and English layouts
- RTL and LTR direction switching
- Mobile navigation and keyboard navigation
- Search, category filters, and empty states
- Course dialogs and browser back/forward behavior
- Instructor, review, payment, and contact sections
- External enrollment and contact links
- Browser console errors
- Responsive layouts around `320`, `390`, `768`, `1024`, and `1440` pixels
- Kids roadmap, session gallery, FAQ, inquiry links, and independent offer
- Direct nested-page loading and no-JavaScript essentials
- Third-path availability, complete bilingual announcement, and preserved existing preview sizes
- Social preview, structured data, sitemap, and canonical/alternate URLs on all pages

## Deploy to GitHub Pages

This repository is designed for direct deployment with GitHub Pages:

1. Push changes to the repository's default branch.
2. Open **Settings → Pages** on GitHub.
3. Select **Deploy from a branch**.
4. Choose the default branch and the `/(root)` directory.
5. Save and wait for the Pages deployment to finish.

No build command or generated distribution directory is required.

## Contributing

Contributions that improve accessibility, performance, localization, content accuracy, or maintainability are welcome.

Please keep changes focused, test both languages, avoid introducing unnecessary dependencies, and preserve the site's lightweight static architecture.

## License

This project is licensed under the [Apache License 2.0](LICENSE).

## Contact

- [MT Academy on Udemy](https://www.udemy.com/user/mohamed-tamer-15/)
- [Contact MT Academy on WhatsApp](https://wa.me/201032105166)

---

Built for practical programming education, with registration open for the Java and Spring Boot backend path.


Latest correctness review: [Project audit](docs/project-audit.md). Shared locale/history and saved SEO ownership are documented in [Platform maintenance](docs/platform-maintenance.md).
