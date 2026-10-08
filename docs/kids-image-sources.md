# Kids Bootcamp image sources

All session images are provided by MT Academy. They represent actual sessions, not testimonials. Originals in `assets/images/kids/` and the user's source directory remain unchanged. The website uses optimized derivatives under `assets/images/kids/`.

| Original | Web filename (under `sessions/`) | Content and use |
| --- | --- | --- |
| 62.png | scratch-session-collage.webp | Scratch instruction/session collage; gallery |
| 63.png | scratch-lesson-presentation.webp | Scratch Level 2 presentation; gallery |
| 64.png | scratch-live-editor.webp | Scratch practical session; hero, Level 2, gallery |
| 65.png | bootcamp-session-collage.webp | General teaching-session collage; gallery |
| 66.png | codeorg-practical-activities.webp | Code.org practical activities; gallery |
| 67.png | codeorg-maze-debugging.webp | Code.org maze/debugging session; Level 1 and gallery |
| 68.png | codeorg-interactive-scene.webp | Code.org scene programming; gallery |

Each has a 1600 × 1327 WebP and a 640 × 531 `-thumb.webp` version. Images retain their entire composition. All fourteen optimized session files total approximately 832 KiB; the source PNGs total approximately 17 MiB. The smaller files use quality 86 WebP with Lanczos resizing. Gallery `srcset` selects the appropriate resolution, and below-the-fold images load lazily.

## Level 3: MIT App Inventor

- File: `assets/images/kids/levels/app-inventor-designer.webp`.
- Source: [MIT App Inventor, Hello Purr](https://appinventor.mit.edu/explore/ai2/hellopurr).
- Original image: [Designer Viewer, Components and Properties](https://appinventor.mit.edu/explore/sites/all/files/ai2tutorials/helloPurr/viewer.png).
- Creator: MIT App Inventor / Massachusetts Institute of Technology.
- License: [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/), as stated in the tutorial footer.
- Changes: resized from 911 × 343 to 1280 × 482 and converted to WebP. This derivative remains CC BY-SA 4.0; the repository's code license does not replace that license.
- The page displays the source, license, and modification notice next to the image. It is labeled as an official example, not a student project or endorsement.

## Level 4: working website demonstration

- File: `assets/images/kids/levels/web-project-example.webp` (1280 × 800).
- Source code: `docs/examples/web-project.html`.
- The HTML/CSS/JavaScript page was run in Chromium, and its discovery button was clicked before capturing the screenshot.
- Original demonstration created for this repository, covered by the repository's Apache-2.0 license.
- Explicitly labeled as an illustrative example, not student work.

## Level 5: executed Python demonstration

- File: `assets/images/kids/levels/python-project-example.webp` (1280 × 800).
- Executable source: `docs/examples/python-quiz.py`.
- Ran with inputs `5`, `earth`, and `3`; the actual output shows a score of `3 / 3`.
- The screenshot displays the actual code and captured execution output in a presentation panel, not a fabricated Python IDE.
- Original demonstration created for this repository, covered by Apache-2.0.
- Explicitly labeled as an illustrative example, not student work.

## Social preview

`assets/images/kids/social/kids-bootcamp.png` is a 1200 × 630 composition of the existing academy logo, genuine `64.png` session imagery, program name, and verified program facts. It contains no time-sensitive offer claims or invented imagery.

## Replacing an image

Update the image object in `assets/js/kids-data.js`, including actual width/height, both localized alternative texts, and source metadata when applicable. Preserve honest `kind` values (`session`, `official`, `example`). Replace gallery derivatives together and update their `srcset`/dimensions in `scripts/refresh-kids-page.cjs` if the sizes change. Run `node scripts/refresh-kids-page.cjs` to synchronize the saved Arabic HTML. Never label an example as a student's work.

## Homepage course box

`assets/images/kids/brand/kids-coding-bootcamp-box.webp` is the user-supplied `ChatGPT Image Aug 1, 2026, 02_06_50 AM (1).png` from the source Kids directory. Converted losslessly to WebP at its original 1254 × 1254 resolution, preserving alpha transparency and all artwork. Used only as the homepage Kids Bootcamp card preview, with dedicated Arabic/English alt text. This is promotional product artwork, not evidence of an actual teaching session. The hero and session gallery retain their original real session images.

The homepage box uses a CSS viewport (`learning-path__box-stage`) to exclude transparent canvas margins while preserving the entire artwork. Its 880 × 1218 viewport includes 24 source pixels of padding around the nontransparent box. The source WebP is unchanged. Udemy's neighboring card displays a native SVG/CSS stack of the existing SOLID, Kotlin, and HTML course images; original course files and catalog content remain unchanged.
