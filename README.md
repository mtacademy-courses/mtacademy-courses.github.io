# MT Academy Course Catalog

A static, bilingual Arabic/English course catalog for MT Academy. Arabic is the default language, and visitors can switch to English with their preference saved locally. The site uses semantic HTML, vanilla CSS, and vanilla JavaScript with no frameworks, package manager, build step, external fonts, or runtime dependencies.

## Project structure

```text
.
├── index.html
├── 404.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   │   ├── brand/
│   │   │   ├── mt-academy-logo.jpg
│   │   │   └── social-preview.png
│   │   ├── courses/
│   │   │   ├── android-kotlin-development.webp
│   │   │   ├── kotlin-for-beginners.webp
│   │   │   ├── ktor-rest-api.webp
│   │   │   ├── learn-html-full-tutorial.webp
│   │   │   ├── master-oracle-database-sql.webp
│   │   │   └── master-solid-principles.webp
│   │   └── payment/
│   │       ├── instapay.webp
│   │       ├── paypal.webp
│   │       ├── udemy.webp
│   │       └── vodafone-cash.webp
│   └── js/
│       ├── courses-data.js
│       └── app.js
├── robots.txt
├── sitemap.xml
└── README.md
```

## Edit brand and interface settings

All editable content lives in [`assets/js/courses-data.js`](assets/js/courses-data.js). Edit `siteConfig` there to change:

- Brand name, logo, colors, supported locales, and default language
- SEO title, description, canonical URL, and social image
- Navigation, hero, catalog, dialog, and interface labels
- WhatsApp and Udemy profile links
- Payment methods, FAQ items, and footer text

Localized interface copy lives under `siteConfig.translations.ar` and `siteConfig.translations.en`. Shared URLs and facts stay outside the translation objects so they are maintained only once. Change `siteConfig.defaultLocale` to switch the initial language.

The file exposes one read-only global, `window.MTAcademyData`, containing `siteConfig` and `courses`. Keep `courses-data.js` loaded before `app.js`.

## Add, update, or remove a course

Open `assets/js/courses-data.js` and edit the `courses` array.

- **Add:** copy one complete course object, then give it a unique `id` and URL-safe `slug`.
- **Update:** change only the relevant values. Keep external enrollment links as complete `https://` URLs.
- **Remove:** delete the complete course object, including its surrounding comma where applicable.
- Leave unavailable optional values empty (`""`), `null`, or `[]`. The interface hides them rather than rendering blank labels.
- Add both `translations.ar` and `translations.en` for every visible course field.
- Ratings use `rating.value`, `rating.max`, and `rating.reviewCount`. Because marketplace ratings can change, update all three together from an approved source.
- Do not add prices, discounts, student counts, certificates, or other claims unless MT Academy has supplied and approved them.

Categories, cards, search results, dialogs, footer category links, and course structured data are generated from this array. `index.html` contains only a deliberately minimal `<noscript>` enrollment-link fallback for visitors who disable JavaScript.

## Replace course images

1. Export the replacement as WebP.
2. Use the matching lowercase filename in `assets/images/courses/`, or update `image.src` in `courses-data.js`.
3. Update `image.alt`, `image.width`, and `image.height` when the content or dimensions change.
4. Preserve exact filename casing; GitHub Pages paths are case-sensitive.

The current course artwork has a **1:1 square ratio**. A recommended export is **1200 × 1200 px WebP**, compressed for the web. Keep comfortable breathing room around important text and artwork.

The single canonical logo is stored at `assets/images/brand/mt-academy-logo.jpg` with its original **1000 × 1000 px** dimensions. The site also uses this same file as its favicon, so there is no separate duplicate icon asset. Update `siteConfig.logo` and both HTML favicon links if its filename or dimensions change. The replaceable social preview image is `assets/images/brand/social-preview.png`; **1200 × 630 px** is recommended for link previews.

Payment illustrations are stored in `assets/images/payment/`. The current assets use a consistent **720 × 420 px WebP** format. If one is replaced, update the matching `paymentMethods[].image` dimensions and the Arabic and English alternative text in `courses-data.js`.

## Preview locally

From the project directory, start any basic static server. For example, if Python 3 is already installed:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Do not open `index.html` directly when testing URL hashes, navigation history, or 404 behavior.

Before publishing, test both language directions, keyboard navigation, the mobile menu, filters, search, course dialogs, back/forward hash behavior, all external links, and the browser console. If FAQ content is later added, test its accordion as well. Check layouts at approximately 320, 390, 768, 1024, and 1440 pixels.

## Deploy to GitHub Pages

1. Push these files to the default branch of the `mtacademy-courses.github.io` repository.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the default branch and the `/(root)` folder, then save.
5. After GitHub finishes deployment, verify `https://mtacademy-courses.github.io/`.

No build command is required. If the repository is already configured as a user or organization Pages site, pushing to its publishing branch is sufficient.

## Intentionally omitted information

The supplied content does not define course prices, durations, lesson counts, certificates, detailed curricula, FAQ answers, legal/privacy pages, an email address, a standalone telephone number, or social accounts other than Udemy and WhatsApp. Those elements remain hidden until real information is added to `assets/js/courses-data.js`.

Course ratings and review totals currently use the values supplied in the approved Udemy screenshots. They are centralized in `courses-data.js` so they can be refreshed without editing HTML. Student counts, discounts, countdowns, prices, and marketplace badges remain excluded because they were not approved as catalog facts and can change over time.
