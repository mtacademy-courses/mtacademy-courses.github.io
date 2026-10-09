# Backend diploma imagery and instructor links

Updated 2026-10-09.

## Supplied product box

- Original: `/Users/mohamedtamer0/Downloads/Backend Development Diploma Box (1).png`.
- Original canvas: 1254 × 1254 px, RGBA PNG with actual transparency around the box. The apparent black outer background in the attachment preview is transparent.
- Published asset: `assets/images/backend/backend-development-diploma-box.webp`, 1254 × 1254 px, lossless WebP with alpha; 1,012,744 bytes versus 1,754,725 bytes for the original PNG.
- Visible source bounds: x=170–1127, y=53–1180. CSS viewport: left=154, top=37, width=990, height=1160, retaining 16 transparent pixels around the complete box.
- No artwork, wording, perspective, logos, visible pixels or alpha were altered. The original file remains untouched. Raw decoded alpha and visible RGB pixels were compared against the original during verification.
- Both the homepage Backend card and diploma hero use `MTAcademyBackend.visual`. The optional authoring helper derives their matching CSS viewport variables from its dimensions and `viewport` fields. Runtime bindings use the same descriptor and localized `visualAlt`.
- Descriptive alt text is exposed to assistive technology; the image is not inside an `aria-hidden` container.
- Printed code and marketing text are artwork, not a source of newly confirmed curriculum details.

The original `backend-announcement.svg` is retained, but no longer used by either main program visual. The existing 1200 × 630 social preview remains accurate and unchanged.

## Instructor portrait

The Backend page continues to use the authentic shared `assets/images/Me.png` (948 × 1659 px). No replacement face, retouching, sharpening or upscaling was performed, and the image file is unchanged.

The prior full-body layout reduced the face size. Backend-only CSS now uses a full-width 4:5 portrait frame, no inset padding, `object-fit: cover` and `object-position: 50% 12%`, showing the head and upper body more prominently. The Udemy and Kids portrait styles remain unchanged. No new portrait derivative was needed.

## LinkedIn

The user supplied `linkedin.com/in/mohamedtamer0`. The normalized destination is `https://www.linkedin.com/in/mohamedtamer0/`.

`MTAcademySite.instructorProfile.linkedinUrl` in `assets/js/site-data.js` is the shared source of truth. Localized labels live in `translations.ar/en.interface.instructorLinkedInLabel`. It is a personal instructor profile, not an academy company page or registration destination.

Visible links appear in the homepage Udemy instructor section, the Kids instructor section and the Backend instructor/mentor section. They use shared safe-link bindings and open in a new tab with `noopener noreferrer`.

After changing the profile URL/labels, run both authoring helpers to synchronize the static Arabic links:

```bash
node scripts/refresh-backend-page.cjs
node scripts/refresh-kids-page.cjs
```
