<!-- TAGNET README HEADER — Catppuccin Mocha — do not edit by hand -->
<div align="center">

[![License](https://img.shields.io/github/license/e404-tagnet/errollhendriscke.com?color=313244&labelColor=11111b&label=License&style=flat-square)](https://github.com/e404-tagnet/errollhendriscke.com/blob/main/LICENSE)
[![Status](https://img.shields.io/badge/Status-stable-a6e3a1?labelColor=11111b&style=flat-square)](https://github.com/e404-tagnet/errollhendriscke.com/pulse)
[![Version](https://img.shields.io/github/v/release/e404-tagnet/errollhendriscke.com?color=313244&labelColor=11111b&label=Version&style=flat-square)](https://github.com/e404-tagnet/errollhendriscke.com/releases)
[![Website](https://img.shields.io/badge/Live-errolhendrickse.uk-94e2d5?labelColor=11111b&style=flat-square&logo=google-chrome&logoColor=94e2d5)](https://errolhendrickse.uk)
[![Repo](https://img.shields.io/badge/Repo-errollhendriscke.com-94e2d5?labelColor=11111b&style=flat-square&logo=github&logoColor=94e2d5)](https://github.com/e404-tagnet/errollhendriscke.com)
[![Tagnet](https://img.shields.io/badge/By-Tagnet-89dceb?labelColor=11111b&style=flat-square&logo=tag&logoColor=89dceb)](https://tagnet.dev)

</div>
<!-- TAGNET README HEADER — end -->

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

### 2026-08-06: Description text legibility update
- Changed artwork description text from light frame colour to dark frame colour so it reads clearly on the greige page gradient.
- Bumped `style.css` cache buster to `v=14` in `index.html` and `gallery.html`.

## Outstanding / next steps

- Replace placeholder collection intros for Abstraction, Form, and Tribal with artist-written text.
- Replace "Description coming soon." placeholders with real artwork descriptions.
- Refine red dash/hand-drawn underline if further visual adjustments are needed.

<!-- TAGNET README FOOTER — start -->

<div align="center">

**Like this work? Fuel the next widget / experiment / scaffold.**

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-%23FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/e404.tagnet)
[![Patreon](https://img.shields.io/badge/Support-Patreon-ff424d?logo=patreon&logoColor=white&style=for-the-badge)](https://www.patreon.com/VeritasExMachina?utm_campaign=creatorshare_creator)

<small>Crafted with caffeine, curiosity, and a Catppuccin palette · © e404-tagnet</small>

</div>
<!-- TAGNET README FOOTER — end -->
