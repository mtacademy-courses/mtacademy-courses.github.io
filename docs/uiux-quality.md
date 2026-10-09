# UI/UX refinement — 2026-10-09

## Observed problems and resulting behavior

- The October promotion occupied most of the initial mobile viewport ahead of the academy introduction. The original campaign panel now appears with its Udemy catalog. The campaign's dates, discount, automatic popup, countdowns and purchase destinations are unchanged. Its floating flag is compact on mobile and hidden while the homepage hero, a menu or a dialog is visible.
- Two horizontal learning cards followed by a large full-width Backend card made comparison uneven. At 1200px and above, all three choices share a column layout with equally sized artwork panels and aligned actions. Between 672px and 1199px, each choice uses a readable text/artwork split; smaller screens stack complete artwork above the copy. Original artwork descriptors and viewport bounds are preserved.
- Search depended on a placeholder and filters could scroll off-screen without an explanation. The catalog now has a visible associated search label, field label and localized swipe hint that appears only when the category list overflows. Existing filtering and search logic remain intact.
- Full-width payment illustrations and a large side column made six methods require excessive scrolling. Cards now use small contained illustrations and readable copy in a responsive one/two/three-column layout. All six method definitions, original images and inquiry destinations are retained.
- Course preview art consumed most of a mobile dialog's first view. The contained preview has a bounded height, leaving more space for the description and metadata. The sticky close control and dialog/history behavior are preserved.
- Arabic hero line heights, heading scales and program FAQs varied considerably. Shared heading tokens, Arabic text rhythm and native FAQ card styling now provide a consistent hierarchy. Kids roadmap/source text and useful page links have more readable sizing and touch areas.
- Technical names could break or reorder within Arabic prose. `technicalTextParts` in shared core code preserves the exact source string while isolating recognized names in `bdi` elements. Multiword terms stay together. Authoring helpers use that same formatter for generated text and the Backend homepage fallback.
- The 404 page offered only a general homepage action. It now also links directly to learning paths, with equivalent Arabic/English labels and an explicit English destination. The homepage authoring helper maintains its saved Arabic bindings as well.

## Ownership and maintenance

- `assets/css/styles.css`: shared section/hero heading tokens, focus-ring token, component spacing, navigation breakpoint, learning-path layouts, catalog controls, payments, dialogs, shared FAQs and 404 actions.
- `assets/css/kids-coding-bootcamp.css` and `assets/css/backend-diploma.css`: page-specific composition, imagery and program components. Shared FAQ styling is owned by `styles.css` rather than duplicated here.
- `assets/js/site-core.js`: mixed-text parts and DOM rendering, measured-header/hero visibility, existing shared navigation and motion engine.
- `assets/js/courses-data.js`: localized catalog labels/hints and 404 recovery labels/destinations. Instructor, course, campaign and payment facts remain in their existing sources.
- `scripts/shared-markup.cjs`: escaped static mixed-text markup using shared core parts.
- `scripts/refresh-homepage.cjs`: homepage and 404 Arabic bindings; existing Kids/Backend helpers maintain their pages. The Backend helper supports nested markup in its homepage text bindings and remains idempotent.

The navigation breakpoint is consistently 70rem in CSS and shared JavaScript. Old navigation-pill positioning and conflicting mobile visibility overrides were removed from the affected rules. Existing motion durations, reduced-motion behavior and once-only reveal ownership remain unchanged.

Run the three authoring helpers after changing source copy. GitHub Pages continues serving saved HTML directly without a production build.

## Verification

Baseline and final screenshots were captured in both languages at 390px and 1440px for all four routes, with focused captures of the hero, paths, catalog/dialog, instructor, reviews, payments, Kids levels/gallery/FAQs and Backend metrics/instructor/announcements. Representative captures were visually compared.

- 48 existing browser regression groups passed, covering route/locale/responsive layouts, navigation, focus/scroll-lock cleanup, language persistence, section offsets, course filtering/dialog/history, reviews, Kids gallery/FAQs, Backend FAQs, normal/reduced motion, missing-observer fallback and saved Arabic content without JavaScript.
- 62 additional UI/UX groups passed: 56 route/locale/width combinations (four routes × two languages × 320, 390, 768, 1024, 1119, 1120 and 1440px) plus short-screen menu/dialog behavior, localized 404 recovery, no-JavaScript Arabic formatting and active October campaign behavior with normal motion.
- No document overflow, tested component text clipping, artwork-panel clipping, uncaught JavaScript errors or failed asset responses were observed in the browser checks.
- Snapshot comparisons confirmed unchanged shared identity/statistics, all six course objects, instructor biography, all six payment definitions, campaign configuration, complete Kids data and Backend program facts. Only the short Backend card description was condensed with equivalent meaning.
- JavaScript/CJS syntax, three-helper idempotence across four saved pages, 165 exact-case tracked asset references, sitemap parsing and `git diff --check` passed.

These checks are local verification, not a formal accessibility certification, external payment transaction or deployment. Transfer account/recipient details, Backend curriculum, pricing and final start/registration dates remain unannounced.
