# Errol Hendrickse Online Gallery

Static artist portfolio and gallery site for Errol Hendrickse.

## Project structure

- `index.html` — Public placeholder / landing page with "Enter Gallery" link.
- `gallery.html` — Full gallery with collection slider, About the Artist, Red Line & Signature, and contact section.
- `placeholder.html` — Source copy of the landing page (kept for reference; deploy uses `index.html`).
- `assets/style.css` — Site styles.
- `assets/gallery.js` — Collection / artwork slider logic.
- `assets/artworks.json` — Collection and artwork metadata.
- `artworks/` — Collection images and reference PDFs.

## Change log

### 2026-08-06: Gallery layout update (commit `5b50007`)
- Unified artwork slide template so every artwork shows title/price caption plus a description info box. Missing descriptions use "Description coming soon." for consistency with the Portraits collection.
- About / Red Line section redesigned as three columns: About the Artist text, four Liberty detail images (`artworks/Liberty/lb1.jpg`–`lb4.jpg`), and The Red Line & Signature text.
- Added hand-drawn red underline under the Red Line verse: left-to-right stroke that rises and thickens/spreads toward the right, with rough edges to look human-made.
- Made placeholder page the public homepage (`index.html`) and changed "Coming Soon" text into an "Enter Gallery" button linking to `gallery.html`.
- Renamed four Liberty detail images to `lb1.jpg`–`lb4.jpg` and removed unused UUID-named duplicates.
- Added reference PDFs to `artworks/bio/` (Biography, The red line factor, monochromaticbroucher).

### 2026-08-06: Placeholder refresh and rickroll (commit `7146a96`)
- Removed corner images from placeholder homepage.
- Matched placeholder typography to gallery header: skinny uppercase letter-spaced title and larger "Online Gallery" subtitle.
- Changed "Coming Soon" / "Enter Gallery" text into a small, discreet circular button linking to `gallery.html`.
- Added a hidden rickroll trigger button and overlay to both `index.html`/`placeholder.html` and `gallery.html`.

## Outstanding / next steps

- Replace placeholder collection intros for Abstraction, Form, and Tribal with artist-written text.
- Replace "Description coming soon." placeholders with real artwork descriptions.
- Refine red dash/hand-drawn underline if further visual adjustments are needed.
