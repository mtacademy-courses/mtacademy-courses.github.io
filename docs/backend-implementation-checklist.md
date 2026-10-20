# Backend diploma: registration landing page

Updated 2026-10-20. Registration is open. Local implementation only; no deployment.

## Content ownership

- `assets/js/backend-diploma-data.js` owns the plan, 8 curriculum stages / 21 modules, 9 monthly projects, session breakdown, graduation expectations, pricing plans, PDF metadata, application/terms collections, 56 grouped FAQs and both translations.
- Instructor evidence continues to derive from `MTAcademySite.instructorProfile.statistics`. Prior Udemy/mentorship evidence is explicitly attributed to Mohamed Tamer's previous work.
- `scripts/refresh-backend-page.cjs` renders the complete saved Arabic page, Course/Organization/WebPage JSON-LD and Backend homepage card/status. Run homepage, Kids, then Backend refresh helpers; repeat to check idempotence.
- `backend-diploma.js` updates the existing bindings without rebuilding disclosures, preserving open states and focus when switching language. It localizes generic and market-specific WhatsApp draft messages and adds expand/collapse controls.
- Registration uses the verified shared WhatsApp contact. Clicking opens a draft message; the visitor contacts the academy to arrange confirmation and payment.
- PDF actions use one configured same-origin URL. View opens a new tab; Download uses a meaningful filename. The copied source remains byte-for-byte unchanged.
- The page opts into full technical-term isolation through shared formatting; other routes retain the existing recognized-term formatting.

## PDF coverage checklist (all 15 pages)

- [x] 01: Program identity, beginner suitability, trainer/mentor and practical journey → hero, instructor.
- [x] 02: 9 months, 36 weeks, 72 sessions, 360 scheduled = 324 learning + 36 breaks, 12–16 independent hours, baseline, support → overview, audience, experience.
- [x] 03: Stage 1 / module 01, all six Java topic groups → curriculum.
- [x] 04: Stage 2 / modules 02–05, all teamwork, requirements and problem-solving bullets → curriculum.
- [x] 05: Stage 3 / modules 06–08, design, SQL/JDBC, indexing and optimization → curriculum.
- [x] 06: Stage 4 / modules 09–12, Spring Boot 4 / Spring 7, persistence, testing, security → curriculum.
- [x] 07: Stage 5 / modules 13–14, Linux, microservices, containers and guided Kubernetes/Helm/cloud deployment → curriculum, depth note.
- [x] 08: Stage 6 / modules 15–16, Testcontainers and GitHub Actions, checks before packaging/deployment → curriculum, depth note.
- [x] 09: Stage 7 / modules 17–18, architecture and design cases, requirements, alternatives and assumptions → curriculum, depth note.
- [x] 10: Stage 8 / modules 19–21, reviewed Codex/Claude Code workflows, permissions, secrets and career preparation → curriculum, experience.
- [x] 11: Projects 01–05 with exact titles, purpose and practical work → monthly project sequence.
- [x] 12: Projects 06–09, final team capstone with guided deployment → monthly project sequence.
- [x] 13: Live coding/student practice, assignments, Git evidence, monthly revisions, teamwork, individual contribution, reviewed AI and 300-minute session → experience, session breakdown.
- [x] 14: Portfolio, engineering evidence, individual/unaided tasks, defensible design, career preparation, repeated core practice vs guided/introductory depth, personal gaps → graduation, depth note.
- [x] 15: Arabic teaching, 15–20 planned capacity, proposed February 2027 start, exact timetable confirmation, both markets/payment options and every small-print payment note → overview, cohort, pricing, FAQs.

## Accuracy constraints

- `status: 'open'` is user-confirmed. February 2027 remains proposed; exact day and weekly timetable are not yet confirmed.
- Eight stages are a learning sequence, separate from the nine monthly projects.
- No remaining-seat counter, registration deadline, certificate, accreditation, diploma reviews, job guarantee, unlimited support or per-submission individual review is promised.
- Egypt: EGP 16,500 full payment; EGP 4,000 + 7 × EGP 2,000 = EGP 18,000 installments.
- International: USD 650 full payment; USD 150 + 6 × USD 100 = USD 750 installments.
- Deposits are included; installments start with teaching; all totals cover the complete diploma; dates follow agreed start changes; all 15 booking/payment/withdrawal clauses are published on the page for review before payment.

## Local verification

Verification results are recorded below after browser and repository checks. Preview with `python3 -m http.server 8000`, then open `/backend-development-diploma/?lang=ar` or `?lang=en`.

Completed verification on 2026-10-19:

- Arabic/English diploma checks at 360, 390, 768, 1120 and 1440 px; curriculum also expanded fully at every width. No horizontal overflow or missing bindings.
- Homepage and Kids regression checks in both languages at 360, 390, 768, 1119, 1120 and 1440 px. Six Udemy courses remain present and Backend status is open. No failed local asset responses or uncaught page errors observed.
- Larger text at 200% with the complete Arabic curriculum expanded: no horizontal overflow.
- Native curriculum Enter/FAQ Space interaction, expand/collapse, preserved disclosure state on locale change, locale-specific WhatsApp drafts, market messages, localized metadata/canonical and 21-item Course schema passed.
- Section links clear the fixed header at mobile/desktop widths. Direct Arabic/English `#pricing` entry was also checked.
- Mobile menu Escape/scroll-lock cleanup, mobile language selection, homepage diploma navigation, blocked-storage locale links, Udemy search/course dialog/history, Kids FAQ/gallery all passed.
- Saved Arabic contains all 8 stages, 21 modules, 9 projects, prices, open registration and both PDF links without JavaScript; native disclosures also work.
- Desktop/mobile screenshots of both languages were inspected, including curriculum, pricing and hero; project, experience, instructor, PDF and FAQ views were also reviewed.
- Original, hosted and browser-downloaded PDF SHA-256: `13da4522268c2c1f781aa8963f79614218435b9da500ffd855f9feb9e32dc551`. The actual file is 15 pages / 2,414,903 bytes. Native download produced the configured filename. View creates a new tab and receives HTTP 200 / application/pdf. Headless Chromium cannot render its built-in PDF viewer; visual PDF reading in that browser environment was not verified. Native browser/mobile PDF handling can vary.
- `node scripts/check-backend-content.cjs`, `node scripts/check-asset-paths.cjs` (177 references), every JavaScript/CJS syntax check, sitemap XML parsing and `git diff --check` passed. All three authoring helpers were run twice; all four saved HTML pages are unchanged on regeneration.
- Baseline object comparisons confirm unchanged shared identity/contact/statistics, six Udemy courses, Udemy promotion and complete Kids data. The Kids saved page is unchanged.

Remaining factual confirmation: exact start day and weekly timetable. Booking/payment/withdrawal terms are now published in full. February 2027 remains proposed. No external messages, payment transactions, commit, push or deployment were performed.

## Application and approved policy implementation

- [x] Preserve the existing uncommitted registration landing page and unrelated shared data.
- [x] Publish every paragraph of the 15 approved Arabic clauses, with complete English translations and stable clause anchors.
- [x] Publish the 12 application fields and complete message template, plus review/confirmation steps and the supplied data-use notice.
- [x] Separate application from confirmed booking; generic and market-specific draft messages do not claim agreement or reserve a place.
- [x] Add separate application/acceptance copy controls, native Clipboard API, localized polite feedback, and visible selectable templates without JavaScript.
- [x] Separate request-sending settlement cutoff from receipt-based seven-calendar-day refund timing and the due-date-based late-payment grace period.
- [x] Preserve full pre-start refunds without administrative deductions, the agreed-payment-price/72 post-start formula, session availability rules, future-installment cessation, same currency/method conditions, cancellation/change/transfer cases, written late-payment notice and no-fine rule.
- [x] Preserve fixed confirmed price, payment records, no employment guarantee, personal material use/privacy and statutory rights.
- [x] Link hero/pricing/navigation/PDF/FAQs to application and terms sections; the original PDF remains unchanged.
- [x] Extend content validation and synchronize the authoring helper with saved Arabic HTML.

The content supplied directly by the user is the policy source; the existing PDF remains the original programme roadmap. No policy effective date or external legal approval is asserted. The website collects no application information and sends no WhatsApp messages automatically.

Application/policy verification completed locally:

- The full Arabic application message matches the approved source exactly. Every paragraph and formula from all 15 Arabic clauses and all 12 fields was checked against the saved page with JavaScript disabled.
- Both locales passed 12 responsive combinations: 360, 390, 768, 1119, 1120 and 1440 px. All fields, clauses, 47 FAQ answers, 21 modules and nine projects are present; no hidden translation bindings or document overflow. Both locales also passed 200% text sizing.
- Actual Clipboard API contents match each localized application and acceptance template, with real line breaks and the payment-system placeholder. Denied and unavailable API cases display localized manual-copy instructions. Locale changes clear stale feedback and switch the copied language.
- Touch copy, keyboard copy, visible keyboard focus, subsequent Tab navigation, live-status references, unique IDs and all ARIA targets passed. The application and terms sections contain no data-entry form.
- Source/market WhatsApp URLs use the shared contact, preserve localized application drafts, and contain no acceptance statement. Application/terms anchors clear the fixed header. Both templates remain visible and selectable without JavaScript; copy controls are hidden in the static fallback.
- Desktop/mobile screenshots were inspected for both languages, including application steps, complete terms, the refund formula and the separate acceptance message. Normal/reduced motion and primary text contrast checks passed.
- Homepage/Kids responsive checks, Udemy search/course dialog/history, Kids gallery/FAQ, mobile menu/scroll-lock cleanup, language navigation and blocked-storage locale links passed. No uncaught browser errors or failed assets were observed in the completed runs.
- Baseline comparisons preserve all earlier curriculum/projects/workload/prices/artwork/instructor/PDF facts, shared identity, Udemy course/promotion objects and complete Kids data. Kids and 404 saved pages are unchanged; the homepage change is limited to its Backend CTA wording.
- Content/asset checks, every JS/CJS syntax check and whitespace checks pass. All three authoring helpers reproduce all four saved pages unchanged. The original PDF checksum remains unchanged.

No messages, application submissions, payments, commit, push or deployment were performed. The exact start day and weekly timetable still require academy confirmation; full booking/payment/withdrawal terms are now public on the page.

Final PDF regression: the native download succeeded with the configured filename, and its SHA-256 matches the unchanged hosted original. View still creates a new tab and receives HTTP 200 / application/pdf; headless native-viewer rendering remains the previously documented verification limit.


## Employment and professional outcomes — 2026-10-20

Implementation checklist:

- [x] Audit the clean repository baseline and current clause 13, employment FAQ, career activities and prior-review attribution.
- [x] Maintain the six approved Arabic paragraphs and supplied English translation once in `careerOutcomesNotice`, with contextual summaries and FAQ answers derived from it.
- [x] Expand clause 13, retaining its attendance/practice/assignments/feedback requirement and `#terms-participation` anchor. The clause count remains 15; `#career-outcomes-notice` identifies the full clarification heading.
- [x] Add five normal-flow notices: hero, instructor/review evidence, career-preparation/graduation, shared pricing area and application action. All link to the full clarification; pricing also links to withdrawal/refund terms and reiterates the academy’s service commitments and retained rights.
- [x] Update the employment FAQ and add eight related questions, for nine outcome FAQs and 55 total questions across five groups.
- [x] Preserve application/acceptance templates, WhatsApp drafts, all other policy clauses, prices, curriculum, projects and the original PDF. No additional consent gate or data-entry form is introduced.
- [x] Render static Arabic, runtime translations and reusable notice markup from the same data. Extend focused checks for source fingerprints, paragraph/FAQ/notice counts, canonical links and unique IDs.

The clarification excludes guarantees of a job, internship, freelance work, a particular income or a professional level within a particular timeframe. It explains individual and market factors, educational/advisory career support and individual reviews. It retains agreed academy services, legal rights, withdrawal and refund terms. It is not a new refund exclusion or general waiver.

Verification completed locally on 2026-10-20:

- Both languages passed at 360, 390, 768, 1119, 1120 and 1440 px: five visible notices, six exact full-text paragraphs, 15 clauses and 55 FAQs, with no horizontal overflow or missing translations. Both languages also passed 200% text sizing.
- Every repeated notice reaches the single full-text heading below the fixed header. The legacy participation anchor remains functional. Saved Arabic and notice links work without JavaScript; IDs and ARIA references are unique and valid. Keyboard focus/Enter, language switching with preserved disclosures and reduced-motion checks passed.
- Actual desktop/mobile screenshots were inspected for the hero, evidence, career preparation, pricing, application and full clarification, including the retained commitments and rights.
- Application/acceptance Clipboard API contents and manual-copy fallbacks passed in both languages. WhatsApp drafts remain unchanged and do not assert acceptance. Mobile menu, scroll lock, FAQ controls, homepage navigation, Udemy search/dialog/history and Kids FAQ/gallery passed. No uncaught browser errors or failed local assets were observed.
- Baseline comparisons confirm the other 14 clauses, pricing, application and acceptance content, curriculum/projects and instructor attribution remain unchanged. Shared Udemy/Kids data and saved homepage, Kids and 404 pages are unchanged.
- Both PDF actions passed: View opens a tab and receives HTTP 200 / application/pdf; native download uses the configured filename and matches the original SHA-256. Headless Chromium's built-in PDF viewer rendering remains unverified; the original file is unchanged.
- Backend content checks, asset checks (177 references), JavaScript/CJS syntax checks and `git diff --check` passed. All three authoring helpers were run in order and repeated, reproducing all four saved pages without changes.

No messages, submissions, payments, commit, push, publication or deployment were performed for this update.

## Available payment methods — 2026-10-20

- [x] Preserve the uncommitted career-outcomes implementation and audit pricing, policy, FAQ, contact and rendering patterns.
- [x] Centralize five bilingual methods (InstaPay, Vodafone Cash, PayPal, Western Union and bank transfer), coordination guidance and an inquiry draft; derive one new FAQ from their names, for 56 total FAQs.
- [x] Render a shared, responsive section after the pricing career notice, with neutral decorative SVGs and non-interactive tiles. No account data, checkout, payment restrictions or new contractual conditions are introduced.
- [x] Preserve all prior content and use the existing verified WhatsApp configuration for a localized, user-initiated draft. Initial fragment positioning is corrected after localized layout, unless the visitor has interacted.
- [x] Synchronize saved Arabic, runtime translations and authoring/check helpers.

Local verification:

- Arabic and English passed at 360, 390, 768, 1119, 1120 and 1440 px, with exactly five correctly named methods, the derived FAQ and localized inquiry URL. No horizontal overflow or clipped labels was observed. Both locales passed 200% text sizing.
- Desktop and mobile screenshots in both languages were inspected. The career notice remains above the payment section; the shared section serves both markets. Keyboard focus and Enter on the contact action passed using a locally intercepted WhatsApp destination; no external message was sent. Saved Arabic, method names and the contact draft also work without JavaScript.
- Twenty-four settled fragment-navigation combinations passed for the payment section, full career clarification and legacy participation clause, in both languages at mobile/desktop sizes with normal/reduced motion.
- Existing copy controls (including denied/unavailable clipboard fallbacks), localized drafts, PDF view/download, menu/scroll lock, disclosures, homepage navigation, Udemy search/dialog/history and Kids FAQ/gallery passed. Homepage/Kids checks covered both languages at all six widths. IDs, ARIA references, focus, reduced motion and existing text contrast checks passed.
- Baseline comparisons confirm all prior 55 FAQ entries and every earlier bilingual datum remain unchanged, including pricing, policy, application/acceptance templates, curriculum/projects and outcome paragraphs. Saved homepage, Kids and 404 files remain byte-identical to this task's baseline. The downloaded and hosted PDF still match the original checksum; native headless PDF-viewer rendering remains the previously recorded verification limit.
- Content/asset checks (177 references), changed JavaScript/CJS syntax checks and whitespace checks pass. Repeating the three established authoring helpers reproduces all four saved pages unchanged.

No commit, push, publication, payment transaction or deployment was performed.
