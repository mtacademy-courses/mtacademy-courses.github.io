# Project correctness review — 2026-10-10

This review inspected the current working tree, rather than treating earlier documentation as verification. Existing UI/UX changes and unrelated work were preserved. No commit, push or deployment was performed.

## Confirmed defects and repairs

No P0 failure was reproduced. The confirmed defects below are P2: locale state/content inconsistencies and saved/runtime metadata drift. They have been repaired.

| Priority | Component | Reproduction and actual behavior | Expected behavior and impact | Cause and repair | Files |
| --- | --- | --- | --- | --- | --- |
| P2 | Shared language/history | Open Arabic homepage, follow an instructor section link, switch to English, press Back. URL returns to `?lang=ar` while visible content remains English. | URL and visible language should agree on Back/Forward; affected visitors lose page orientation. | Language switching did not observe history navigation. Save the locale within existing history state and restore it on `popstate`, preserving the course-dialog state. | `assets/js/site-core.js` |
| P2 | Learning-path and related-route links | Disable localStorage, open English homepage, follow the Kids card. Its plain route loads Arabic. Brand and related instructor links also depend on stored preference. | Explicit English routes should remain English even when browser storage is unavailable. | Shared link configuration now carries the visible language for known public routes. Static hash links and external/media destinations retain their behavior. | `assets/js/site-core.js` |
| P2 | Arabic homepage description | Inspect the runtime Arabic description: it announces the upcoming Backend diploma twice. Saved HTML differs. | A concise, equivalent description should be maintained from the localized source. | Remove the duplicated clause and synchronize saved title/descriptions/social metadata through the homepage authoring helper. | `assets/js/courses-data.js`, `scripts/refresh-homepage.cjs`, `index.html` |
| P2 | Saved structured data | Inspect homepage JSON-LD without JavaScript: it is `{}`, while runtime contains the organization and six existing Udemy courses. Kids/Backend saved organization records omit the source link present at runtime. | Saved and runtime Arabic structured data should describe the same existing content. | Share organization/catalog schema builders between browser controllers and authoring helpers; regenerate saved pages. Existing runtime course schemas, individual ratings and destinations remain unchanged. | `assets/js/site-core.js`, `assets/js/app.js`, `assets/js/kids.js`, `assets/js/backend-diploma.js`, all three refresh helpers and generated HTML |
| P2 | 404 description | Compare saved 404 description against its localized runtime source: the wording differs. | Metadata should remain synchronized with the existing error-page copy. | Generate its saved Arabic title and description from the same error-page data. | `scripts/refresh-homepage.cjs`, `404.html` |

## Review scope and preserved data

Reviewed homepage, Kids, Backend and 404 routes, shared data/controllers/styles, navigation/localization/motion, static authoring helpers, assets, robots and sitemap. Baseline inspection covered both requested languages with and without JavaScript, duplicate IDs, ARIA references, section hashes and metadata. Essential saved content remains Arabic when scripts are disabled, consistent with the existing site architecture.

Snapshot comparisons preserved all instructor statistics, all six course objects and their individual reviews/ratings, all six payment definitions, campaign configuration, Kids content/gallery/promotions, Backend study plan/status/artwork and shared identity including the verified instructor LinkedIn URL. Only the duplicated Arabic SEO description changed in the content models. No account details, offers, enrollment workflows or unsupported claims were added.

The existing October Udemy schedule was tested at its configured start/end boundaries, including the differing Cairo offsets. The first cohort and planned instructional-hour qualifications remain intact. Backend registration remains closed; curriculum and price remain forthcoming; early 2027 remains tentative.

## Verification performed

- 48 broad browser regression groups passed: both languages, three main learning routes at 320, 390, 768, 1024, 1119, 1120 and 1440px; navigation order, assets, statistics, menus, focus/scroll-lock cleanup, language switching, resize cleanup, section offsets, catalog search/filter/dialog/history, reviews, Kids gallery/FAQ, Backend FAQ, localized 404, normal/reduced motion, observer failure and essential Arabic without scripts.
- 62 UI/UX groups passed, including all four routes × both languages × seven widths, plus short mobile menus/dialogs, 404 recovery and campaign behavior.
- Nine additional audit regression groups passed: exact runtime catalog schema preservation in both languages; static/runtime Arabic metadata and schema equivalence on four routes; locale Back/Forward, queryless Arabic history, course-history state with locale changes, storage-blocked English navigation and live campaign expiry cleanup. Disabled and malformed promotion configuration were checked without changing the business configuration.
- Unknown/malformed course hashes and direct-course reload/close were checked on a 390×568 viewport.
- No uncaught JavaScript errors or failed asset responses were observed in the broad regression checks. Eager asset checks wait for actual image completion, including asynchronous runtime rendering.
- 14 JavaScript/CJS syntax checks passed. Exact-case asset validation passed for 172 references against tracked Git paths. Sitemap XML parsed and `git diff --check` passed.
- All three authoring helpers were rerun in documented and reverse order: all four HTML files remained byte-identical. Runtime and saved Arabic metadata/schema were compared directly.
- Final screenshots were captured for all four routes in Arabic and English at 390px and 1440px. Representative captures across every route, language and viewport category were inspected; no new clipping or distortion was observed. Previous responsive/component bounds checks also passed.

Local preview: `http://localhost:8000/?lang=ar`.

## Maintenance and limits

Shared navigation/localization/history and schema helpers live in `site-core.js`. Source content remains in the existing data models. Run the three refresh helpers after relevant source changes; inspect their output and verify a second run is idempotent. Details are in `docs/platform-maintenance.md`.

No confirmed, fixable defect identified by this review remains open. External payment transactions and deployed GitHub Pages behavior were not exercised; this was local verification plus tracked production-path validation. It is not a formal accessibility certification or a measured performance score. Backend curriculum, pricing, final start/registration dates and transfer recipient/account details remain genuinely unannounced; inquiry-based payment behavior is intentional. Optional cosmetic redesigns were not treated as defects.
