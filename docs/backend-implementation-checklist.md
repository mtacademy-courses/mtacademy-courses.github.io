# Backend diploma implementation and verification

Completed on 2026-10-08. Existing working-tree changes were preserved; no commit, push, or deployment was performed.

- [x] Snapshot the working Udemy course data, campaign schedule, Kids levels, sessions, and offer before editing.
- [x] Extract shared homepage discovery data into `learning-paths-data.js`; remove Kids-specific preview bindings/data ownership.
- [x] Preserve the large Kids box and Udemy cover stack in the first row; add the full-width upcoming third path below.
- [x] Use one `coming-soon` status in `backend-diploma-data.js`, with bilingual labels on the card and announcement.
- [x] Add the real `/backend-development-diploma/` static route, controller, page styles, native SVG illustration, and 1200 × 630 social preview.
- [x] Add root-relative navigation, localized inquiry links, correct metadata and sitemap language variants.
- [x] Synchronize Kids navigation/footer through its existing authoring helper.
- [x] Match navigation CSS and shared JavaScript at 70rem, leaving content layout breakpoints independent.
- [x] Update README with three offerings, script order, authoring helpers, and future enrollment requirements.

## Verification

- 30 responsive combinations: three routes × Arabic/English × 320/390/768/1024/1440 px.
- One h1 per route, correct lang/dir, no document/header overflow, working language metadata, valid image loading.
- Backend spans the full second row on tablet/desktop. The Kids box viewport remains 247.0625 px wide at 1440 px, matching the previous two-path layout.
- Native mobile menu, Escape, persisted language across all three routes, reload, and 1120 px resize/scroll unlock behavior pass.
- Essential Arabic announcement, beginner-from-zero positioning, and links work without JavaScript. Static homepage shows three cards and six Udemy fallback links.
- Backend JSON-LD contains only Organization and WebPage, with no fabricated Offer or CourseInstance.
- The diploma has no enrollment, campaign, payment, countdown, or subscription UI. Its optional WhatsApp link opens only a localized inquiry.
- Udemy course objects/campaign and Kids level/session/offer objects match the pre-edit working snapshot exactly.
- Kids, Backend, and shared-path Arabic/English translation field shapes match.
- 24 existing regression groups pass: Udemy search/categories/empty reset, dialogs/hashes/back-forward, instructor/reviews/lightbox/payment; Kids gallery/FAQ/menu/inquiry/error recovery; promotion isolation and English 404.
- All JavaScript files pass syntax checks. Sitemap XML parses. Git whitespace validation passes.
- Desktop/mobile screenshots of both languages were captured and inspected. Browser runs recorded no uncaught page errors or HTTP asset failures.

GitHub Pages publication and sending external messages were not performed. Upcoming program dates, delivery, fees, and curriculum remain unannounced as requested.
