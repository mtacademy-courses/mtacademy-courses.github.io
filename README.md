# MT Academy Course Catalog

[![Live Website](https://img.shields.io/badge/Live_Website-Visit_MT_Academy-0b4f3f?style=for-the-badge)](https://mtacademy-courses.github.io/)
[![License](https://img.shields.io/badge/License-Apache_2.0-c9a84c?style=for-the-badge)](LICENSE)

![MT Academy Course Catalog](assets/images/brand/social-preview.png)

A fast, responsive, bilingual course catalog for **MT Academy**, built to help Arabic-speaking learners discover practical programming courses and continue enrollment on Udemy.

The website is Arabic-first, includes a complete English interface, and is built with semantic HTML, modern CSS, and vanilla JavaScript. It has no framework, package manager, build step, external font, or runtime dependency.

## Live website

**[mtacademy-courses.github.io](https://mtacademy-courses.github.io/)**

## Highlights

- Arabic and English interfaces with automatic RTL/LTR layout switching
- Saved language preference across visits
- Responsive course catalog with search and category filters
- Detailed course dialogs with shareable URL hashes and browser history support
- Instructor profile, learner reviews, payment methods, and contact options
- Centralized, data-driven content in one JavaScript configuration file
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

Clone the repository and start any static HTTP server:

```bash
git clone https://github.com/mtacademy-courses/mtacademy-courses.github.io.git
cd mtacademy-courses.github.io
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

Opening `index.html` directly is not recommended because URL hashes, navigation history, and 404 behavior are best tested through a local server.

## Project structure

```text
.
├── index.html                  # Main website
├── 404.html                    # GitHub Pages error page
├── assets/
│   ├── css/
│   │   └── styles.css          # Layout, components, and responsive styles
│   ├── js/
│   │   ├── courses-data.js     # Site configuration and course content
│   │   └── app.js              # Rendering, localization, and interactions
│   └── images/
│       ├── brand/              # Logo and social preview
│       ├── courses/            # Course artwork
│       ├── payment/            # Payment method artwork
│       ├── reviews/            # Learner review gallery
│       └── Me.png              # Instructor portrait
├── robots.txt
├── sitemap.xml
├── LICENSE
└── README.md
```

## Customize the website

Most website content is managed from [`assets/js/courses-data.js`](assets/js/courses-data.js). The file exposes a deeply frozen `window.MTAcademyData` object containing `siteConfig` and `courses`.

Use `siteConfig` to update:

- Brand details, colors, logo, and default language
- SEO title, description, canonical URL, and social image
- Navigation, hero content, interface labels, and footer copy
- Instructor information and statistics
- Review gallery images
- Payment methods
- WhatsApp, Udemy, and other contact links
- FAQ content when available

Localized interface text belongs under:

```text
siteConfig.translations.ar
siteConfig.translations.en
```

Keep `courses-data.js` loaded before `app.js` in `index.html`.

## Add or update a course

Edit the `courses` array in [`assets/js/courses-data.js`](assets/js/courses-data.js).

When adding a course:

1. Copy an existing course object.
2. Assign a unique `id` and URL-safe `slug`.
3. Add the course image to `assets/images/courses/`.
4. Update the image path, alternative text, width, and height.
5. Provide both Arabic and English translations for every visible field.
6. Use complete `https://` URLs for enrollment links.
7. Update `rating.value`, `rating.max`, and `rating.reviewCount` together.

Optional values may be `""`, `null`, or `[]`; the interface hides unavailable content instead of showing empty fields.

Do not publish prices, discounts, student counts, certificates, or similar claims unless they have been supplied and approved by MT Academy.

## Image guidelines

- Course artwork: `1200 × 1200` WebP, optimized for the web and using the filename configured in the course object
- Main logo: `assets/images/brand/mt-academy-logo.jpg` at `1000 × 1000`
- Social preview: `assets/images/brand/social-preview.png` at `1200 × 630`
- Payment artwork: `720 × 420` WebP

Preserve exact filename casing because GitHub Pages paths are case-sensitive. When replacing an image, update its configured dimensions and localized alternative text when necessary.

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
- Social preview, structured data, sitemap, and canonical URL

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

Built for learners who want practical programming education in Arabic.
