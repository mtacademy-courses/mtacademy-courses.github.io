# MT Academy — Programming Learning Paths

[![Live Website](https://img.shields.io/badge/Live_Website-Visit_MT_Academy-0b4f3f?style=for-the-badge)](https://mtacademy-courses.github.io/)
[![License](https://img.shields.io/badge/License-Apache_2.0-c9a84c?style=for-the-badge)](LICENSE)

![MT Academy Course Catalog](assets/images/brand/social-preview.png)

A fast, responsive, bilingual website for **MT Academy**, with three learning paths: programming courses on **Udemy**, a live online **Kids Coding Bootcamp** for ages 6–18, and an upcoming **Backend Development Diploma with Java & Spring Boot** for complete beginners.

The website is Arabic-first, includes a complete English interface, and is built with semantic HTML, modern CSS, and vanilla JavaScript. It has no framework, package manager, build step, external font, or runtime dependency.

## Live website

**[mtacademy-courses.github.io](https://mtacademy-courses.github.io/)**

## Highlights

- Arabic and English interfaces with automatic RTL/LTR layout switching
- Saved language preference across visits
- Responsive course catalog with search and category filters
- Detailed course dialogs with shareable URL hashes and browser history support
- Instructor profile, learner reviews, payment methods, and contact options
- Shared homepage learning-path discovery, with separate data for Udemy, Kids, and the upcoming Backend diploma
- A bilingual Backend program preview with a confirmed study plan, projects, mentorship, code review, and qualified coming-soon announcements
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

Then open [the homepage](http://localhost:8000/) [the kids page](http://localhost:8000/kids-coding-bootcamp/), or [the Backend announcement](http://localhost:8000/backend-development-diploma/). Test English with `?lang=en`, and Arabic with `?lang=ar`.

Opening `index.html` directly is not recommended because URL hashes, navigation history, and 404 behavior are best tested through a local server.

## Project structure

```text
.
├── index.html                       # Homepage and existing Udemy catalog
├── kids-coding-bootcamp/index.html   # Static kids landing page
├── backend-development-diploma/index.html # Static coming-soon announcement
├── 404.html                         # Localized error page
├── assets/
│   ├── css/
│   │   ├── styles.css               # Shared primitives and Udemy/homepage styles
│   │   ├── kids-coding-bootcamp.css  # Kids page styles
│   │   └── backend-diploma.css       # Announcement page styles
│   ├── js/
│   │   ├── site-core.js             # Shared locale, navigation, metadata, scroll lock
│   │   ├── site-data.js             # Shared academy identity/contact facts
│   │   ├── courses-data.js          # Udemy content and scheduled campaign
│   │   ├── app.js                   # Existing Udemy page controller
│   │   ├── kids-data.js             # Independent kids content, gallery and offer
│   │   ├── kids.js                  # Kids page controller
│   │   ├── learning-paths-data.js    # Shared homepage cards and translations
│   │   ├── backend-diploma-data.js   # Confirmed upcoming diploma facts/status
│   │   └── backend-diploma.js        # Announcement page controller
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
├── scripts/refresh-backend-page.cjs  # Optional announcement authoring helper
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

The two current cards retain their large box/cover images and occupy the first desktop row. The upcoming diploma spans the full row below; mobile stacks all three in semantic order (Udemy, Kids, Backend). The six-item primary header groups the three paths under an accessible native Learning paths disclosure, in Udemy → Kids → Backend order. Mobile shows the same hierarchy expanded, below `70rem` (1120px). Kids-specific shortcuts remain inside the Kids page. The shared JavaScript cutoff matches the CSS. Content layout breakpoints remain independent.

### Upcoming Backend diploma

The static announcement lives at [`backend-development-diploma/index.html`](backend-development-diploma/index.html), served at `/backend-development-diploma/`. It presents the **Backend Development Diploma with Java & Spring Boot** for complete beginners: 9 months, a 36-week study plan, 2 sessions weekly, 72 sessions of up to 5 instructional hours each, 360 planned instructional hours, and 9 monthly practical projects. Assignments and independent project work are additional to instructional hours. The announced study duration and week plan do not define exact calendar dates or breaks.

Edit [`assets/js/backend-diploma-data.js`](assets/js/backend-diploma-data.js) for both languages, metadata, optional inquiry messages, and confirmed program facts. Its `plan` object owns the numeric study facts, capacity (15–20), tentative start year (2027), and registration/curriculum/price announcement states. The `experience` alias reads shared instructor statistics: over 8 professional years, over 21,697 Udemy learners, over 743 Udemy reviews, and over 145 mentorship trainees across over 14 countries. These figures are explicitly attributed to prior teaching/mentorship, not to this new diploma. Both language variants derive numeric copy from these sources, preserving the lower-bound meaning. Its single `status: 'coming-soon'` value supplies the homepage and announcement-page badge via localized `statusLabels`. There is no enrollment, price, promotion, deadline, or subscription backend.

After editing preview copy, navigation, or shared contact facts, synchronize the saved Arabic page and the Backend homepage card:

```bash
node scripts/refresh-backend-page.cjs
```

This helper uses Node's standard library and synchronizes the diploma page, its homepage card/visual, and the homepage instructor LinkedIn link. GitHub Pages serves the saved HTML without a build. Essential Arabic content and native FAQ disclosures work without JavaScript; the existing controller supplies English and saved language preference. The Kids navigation/footer links are maintained by its own data and authoring helper; run `node scripts/refresh-kids-page.cjs` after changing those.

The homepage card and diploma hero use the supplied product box, optimized losslessly as `assets/images/backend/backend-development-diploma-box.webp`. Its transparency and complete artwork are preserved; descriptor-driven CSS excludes only outer transparent margins. The existing social preview source is `assets/images/backend/backend-social-preview.svg`; its unchanged PNG is 1200 × 630. See [`docs/backend-image-sources.md`](docs/backend-image-sources.md) for provenance, viewport bounds and verification.

To use future approved program artwork, update `backend-diploma-data.js`'s `visual` path, actual dimensions and viewport bounds, update `visualAlt` in both languages, then regenerate the page/homepage. The learning-path registry reuses that descriptor for runtime rendering. Update social metadata only if replacing the separately sized social preview. The Backend portrait uses the original shared photo with a closer head-and-upper-body CSS frame; other paths retain their portrait styles.

Registration is not open; detailed curriculum, price, and the registration opening are coming soon. The beginning of 2027 is tentative, with no exact start date. The page describes assignments, live coding, code review, mentorship by Mohamed Tamer, and responsible AI usage without inventing a syllabus or delivery format. Existing Udemy profile/review links are labeled by their actual source; WhatsApp is inquiry-only. Opening enrollment requires confirmed dates, delivery details, curriculum, fees, contact/enrollment destinations, and a deliberate implementation update. Changing a badge alone is insufficient; the current data/controller intentionally implement an announcement page.

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

Built for practical programming education, with an upcoming Java and Spring Boot backend path.


Latest correctness review: [Project audit](docs/project-audit.md). Shared locale/history and saved SEO ownership are documented in [Platform maintenance](docs/platform-maintenance.md).
