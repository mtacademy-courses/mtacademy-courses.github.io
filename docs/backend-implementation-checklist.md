# Backend diploma implementation and verification

Updated on 2026-10-09. The diploma remains `coming-soon`; registration is not open. No commit, push, or deployment was performed.

## Confirmed program preview

- [x] Preserve the existing `/backend-development-diploma/` route and stable offering ID.
- [x] Keep study facts in `MTAcademyBackend.plan`: 9 months, a 36-week study plan, 2 sessions weekly, 72 total sessions, up to 5 hours per session, and 360 planned instructional hours.
- [x] Explain that assignments and independent project work are additional to instructional hours; do not turn the week plan into exact calendar dates.
- [x] Announce one practical project each month, for 9 projects, with ongoing assignments.
- [x] Describe student participation in live coding, individual code review, mentorship and practical AI usage without adding an unannounced syllabus.
- [x] Identify Mohamed Tamer as both instructor and mentor throughout the diploma.
- [x] Attribute the separate `experience` figures to prior work: over 8 professional years, over 21,697 Udemy learners, over 743 Udemy reviews, over 145 mentorship trainees across over 14 countries. These now derive from shared instructor statistics.
- [x] Link to the existing Udemy profile and homepage Udemy reviews with accurate source labels; do not present these as diploma reviews.
- [x] Explain the planned first-cohort capacity of 15–20 students without seat counters or booking claims.
- [x] Mark curriculum, price and registration opening as forthcoming.
- [x] Qualify the beginning of 2027 as tentative; no exact start date is published.
- [x] Keep contact actions inquiry-only, with no registration, payment, subscription or waitlist workflow.

## Structure and maintenance

- [x] Provide equivalent Arabic/English copy using the existing shared controller and localization system.
- [x] Derive numeric content from the study/experience objects instead of repeating editable constants.
- [x] Add a compact six-fact overview, practice cards, instructor/mentor evidence, cohort panel, upcoming announcements, ten native FAQ disclosures and a closing inquiry section.
- [x] Use the supplied program box, existing social preview and authentic instructor portrait.
- [x] Update the Backend homepage summary, facts and CTA while preserving the two other cards and their image dimensions/styles.
- [x] Make `scripts/refresh-backend-page.cjs` synchronize the static Arabic diploma page and its homepage card text bindings.
- [x] Preserve canonical/hreflang metadata and Organization/WebPage JSON-LD without fabricated offers, ratings, prices or start dates.
- [x] Update the homepage/diploma sitemap dates and README; Kids sitemap entries remain unchanged.

## Verification

- Arabic and English diploma/homepage views at 320, 390, 768, 1024 and 1440 px: correct content, lang/dir, metadata, images and no document overflow.
- All announced numeric facts, the planned-hours qualification, prior-experience attribution and tentative start wording checked in rendered content.
- Ten FAQ disclosures work with Enter/Space and without JavaScript; Arabic essential content and homepage facts are available without JavaScript.
- Mobile navigation and Escape, inquiry message encoding, page links, saved language across routes and reload checked.
- Existing six Udemy courses/course dialog and Kids page smoke checked. Confirmed Udemy course objects/campaign, Kids program facts/levels/sessions/offer and Backend numeric plan/experience remain equal to the pre-visual-update snapshot. Shared rendering changes are limited to offering-specific image descriptors/alt text and shared instructor-link configuration.
- Study-plan arithmetic, Arabic/English translation field parity, generator idempotence, JavaScript syntax, exact Git asset paths, sitemap parsing and whitespace checked.
- Desktop/mobile screenshots captured and visually reviewed for both languages. Browser checks record uncaught errors and HTTP asset failures.

## Still awaiting announcement

Detailed curriculum, price, registration opening date, exact start date, session days/times and delivery format remain unannounced. Early 2027 is a tentative plan. Adding actual enrollment requires a deliberate implementation update with approved details; changing a badge alone is insufficient.

## Artwork, Arabic proofreading and instructor presentation — 2026-10-09

- [x] Replace both active Backend illustrations with the supplied lossless transparent product-box asset, using one visual descriptor and complete-artwork CSS viewports.
- [x] Keep the separately sized social preview unchanged; document source and conversion in `backend-image-sources.md`.
- [x] Add the user-confirmed LinkedIn profile in all three instructor sections through shared configuration and localized labels, including static Arabic fallbacks.
- [x] Review Backend Arabic, standardize session/cohort terminology, fix awkward wording, and retain all study facts and announcement qualifications.
- [x] Improve Backend-only portrait framing using the existing authentic source photo, without modifying the face or other paths' portrait styles.
- [x] Synchronize homepage visual/link maintenance through the existing authoring helper.

Verification: 30 responsive combinations (three routes × two languages × five widths), plus static Arabic and interaction/language regression groups, all pass. LinkedIn URL/labels, image loading, complete box bounds, portrait framing, mobile navigation, FAQ keyboard behavior, no overflow and preserved program data were checked. The WebP alpha and all visible RGB pixels match the supplied PNG exactly. Both authoring helpers are idempotent, JavaScript syntax and 157 exact-case Git asset references pass, and desktop/mobile screenshots were inspected. Detailed results are recorded in the local browser validation artifact. No deployment or external messages are part of this work.

## Shared platform update — 2026-10-09

Instructor evidence now derives from `MTAcademySite.instructorProfile.statistics`: more than 21,697 Udemy learners, 743 Udemy reviews, 145 mentorship trainees and 14 mentorship countries, with more than 8 professional years. The Backend numeric plan, visual, status and tentative 2027 timing remain unchanged.

The shared navigation hierarchy, motion system and authoring markup now also serve this page. Verification expanded to 48 browser groups, including 42 route/locale/width combinations, breakpoint focus cleanup, static Arabic, normal/reduced motion, observer fallback and existing interactions. All three helpers are idempotent and 165 exact-case asset references pass. See `platform-maintenance.md` for ownership, payment-information scope and the current validation details; the earlier counts above describe the previous visual-update checkpoint.
