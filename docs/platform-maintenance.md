# Shared platform maintenance

Updated 2026-10-09.

## Instructor evidence

`MTAcademySite.instructorProfile.statistics` in `assets/js/site-data.js` owns the user-confirmed lower bounds:

- `professionalYearsOver`: 8.
- `udemyLearnersOver`: 21697.
- `udemyReviewsOver`: 743.
- `mentorshipTraineesOver`: 145.
- `mentorshipCountriesOver`: 14.
- `qualification`: `more-than`.

Homepage counters and the Backend credibility section derive their displays from this object. Numeric displays include a trailing `+` and are isolated as LTR in either locale; biographies use explicit “more than” wording. Mentorship trainees are not reviews. These are prior instructor achievements, never Kids enrollment or new diploma results. Individual Udemy course ratings/review counts remain independent.

The homepage’s previous 7-year summary, stale totals and ambiguous mentorship-review paragraph were corrected. Its hero now describes all three paths, explicitly marking Backend as upcoming.

## Global navigation

Shared Arabic/English `primaryNavigation`, `learningNavigation` and `learningOverviewLabel` in `site-data.js` own the global hierarchy:

1. Home.
2. Learning paths: Udemy, Kids, Backend.
3. Instructor.
4. Udemy reviews.
5. Payment.
6. Contact.

Desktop uses a native `details`/`summary` disclosure with an overview link and the three path links. It works with keyboard and without JavaScript. Shared JavaScript adds Escape, outside-click and focus-out closing. Mobile presents the same ordered group expanded within the existing menu. It remains scrollable on short screens. Choosing a language closes the mobile menu and restores focus, following the existing behavior.

`sharedNavigationConfig` in `site-core.js` converts homepage destinations into local hashes only on the homepage; inner routes use root destinations. English cross-route links explicitly carry `?lang=en`. Current route links use `aria-current="page"`; current homepage/local sections use `location`. A normal CSS active background replaces the previous position-dependent navigation pill. Active sections are tracked with a passive requestAnimationFrame-throttled scroll handler using the measured header height and a document-bottom correction.

The shared breakpoint remains 70rem (1120px) in CSS and JavaScript. Resizing to desktop closes the mobile menu, clears scroll lock and restores focus to visible content, even when CSS has already blurred the hidden mobile controls. Switching back returns disclosure focus to the mobile toggle. The floating promotion flag is hidden while a menu or dialog is open. `initHeaderMotion` measures header height and sets `--header-height` for menu positioning and anchor scroll padding.

Kids Levels, Our sessions and FAQs remain available in a separate localized page-local shortcut bar. Footer destinations share the same site hierarchy.

`scripts/shared-markup.cjs` generates static navbar/footer markup for all three routes. It is an authoring helper only, not a production dependency.

## Motion

All three controllers use `initMotionSystem` and `initHeaderMotion` from `site-core.js`. A singleton reveal observer prevents duplicate ownership; a WeakSet prevents repeat registration. Reveal timing, interaction timing, counter timing, easing, distance and stagger are owned by CSS tokens in `styles.css`.

Current defaults: micro 150ms, component 240ms, reveal 420ms, counter 620ms, reveal distance .65rem, stagger 35ms capped at three steps. Relevant JavaScript cleanup delays read the same duration tokens through `motionDuration`.

Content is visible by default; the reveal animates from partial opacity with a small vertical shift when observed. No observer or JavaScript failure can leave reveal targets hidden. Page-specific Kids/Backend entrance animations and homepage ambient loops/extra nested staging were removed. `prefers-reduced-motion` disables shared reveals and gives final counter values immediately. Switching the preference while the page is open reveals all registered content and finishes counters.

Promotional timing and campaign dates are not animation durations and remain unchanged.

## Payment information

`MTAcademyData.siteConfig.paymentMethods` in `courses-data.js` now contains six methods, preserving the previous four in their original order and adding Western Union and bank transfer.

The two added cards describe academy payment arrangements and have localized inquiry actions through the existing WhatsApp contact. Each message names the requested method; opening a link does not send the message automatically. Existing manual-method cards also have inquiry links. Direct Udemy purchases still use Udemy checkout and course links.

Bank account, beneficiary, recipient, IBAN/SWIFT, country, fees, currencies and processing-time details were not supplied and are not invented. Contact is used to obtain transfer instructions. There is no new checkout, transfer form, processor or Backend enrollment workflow.

The new 720 × 420 SVG assets are simple original transfer/bank illustrations, not official payment-provider logos. They live under `assets/images/payment/` with lowercase filenames.

## Synchronize saved Arabic content

After editing shared facts/navigation, localized content or payment methods, run:

```bash
node scripts/refresh-homepage.cjs
node scripts/refresh-kids-page.cjs
node scripts/refresh-backend-page.cjs
node scripts/check-asset-paths.cjs
```

The homepage helper synchronizes the header/footer, data-bound Arabic copy, instructor counters and complete static payment cards. The Kids/Backend helpers synchronize their full saved pages; the Backend helper also maintains its homepage preview and the shared instructor LinkedIn link. All are Node standard-library authoring tools. GitHub Pages serves the saved files directly without a build.

Verify idempotence, both locales, widths around 1120px, keyboard/focus behavior, reduced motion, no-JavaScript content, course dialogs/history, Kids gallery and image paths before publishing. Source changes do not publish the site automatically.

## Verification for this update

- 48 browser check groups passed: 42 responsive route/locale combinations (three routes × two languages × 320, 390, 768, 1024, 1119, 1120 and 1440px), plus breakpoint focus/scroll-lock handling, section navigation, saved Arabic without JavaScript, normal/reduced motion, missing-observer fallback and existing course/gallery/FAQ/404 interactions.
- No uncaught JavaScript errors, failed HTTP asset responses, broken images or horizontal/header overflow were observed in these checks. Desktop/mobile screenshots of navigation, statistics, instructor evidence and payments were inspected.
- A separate check using October 9, 2026 verified the active Udemy promotion popup, normal-motion menu overlap handling and instructor biography disclosure with normal/reduced motion.
- Translation field parity passed. The six original course objects, Udemy campaign, Kids facts/levels/sessions/promotion, Backend plan/visual/status and four original payment definitions match the pre-update snapshot. Instructor statistics intentionally changed.
- All 14 JS/CJS files passed syntax checks; all three authoring helpers were idempotent; 165 asset references matched exact tracked Git paths; sitemap XML parsing and `git diff --check` passed.

These are local implementation checks, not a deployment or an external payment transaction.

## UI/UX maintenance

See `uiux-quality.md` for the subsequent layout and usability refinement, baseline observations and additional verification. Shared FAQ styling and heading/focus tokens live in `styles.css`. `technicalTextParts` in `site-core.js` is also used by static authoring helpers to preserve readable technical names in Arabic text. `refresh-homepage.cjs` now synchronizes the 404 recovery copy as well as the homepage.

The original Udemy campaign panel appears inside its catalog section; the shared header's existing throttled update hides the floating flag while the homepage hero is in view. Campaign dates and promotion behavior remain separately owned by the campaign data/controller.


## Audit fixes: locale history and saved metadata

`site-core.js` now preserves the visible language on public route links, including learning-path cards, brand links and instructor evidence links. This works when localStorage is blocked. Hash-only links keep their original section/course behavior. `saveLocale` records `__mtAcademyLocale` in the existing history state without removing the course dialog state; `initLanguageSwitching` restores the URL/history language on Back and Forward.

`buildOrganizationSchema` owns the shared organization identity for runtime and saved HTML on all three learning routes. `buildCatalogSchema` owns homepage course structured data; individual course ratings remain independent of instructor totals. `refresh-homepage.cjs` synchronizes Arabic title, descriptions, social metadata and JSON-LD, plus 404 title/description. The Kids and Backend generators use the shared organization builder too.

After editing relevant content, run all three refresh helpers, asset validation and syntax checks. A second run must leave all four saved HTML files unchanged. See `docs/project-audit.md` for the latest verified fixes.
