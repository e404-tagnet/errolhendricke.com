# Errol Hendriske Art Gallery

Self-hosted static site for the artist Errol Hendriske.

- Live domain (pending): `errolhendricke.com`
- GitHub repo: `https://github.com/e404-tagnet/errolhendricke.com.git`
- Local folder: `/home/e404/Dropbox/9-PROJECTS/erollhendriscke.com`

## Structure

```
.
├── index.html              # Main gallery page
├── assets/
│   ├── style.css           # Palette, layout, responsive rules
│   ├── gallery.js          # Collection + image cycling
│   ├── artworks.json       # Collection/painting data (titles, prices, paths)
│   ├── placeholder.svg     # Image placeholder
│   └── placeholder-bio.svg # Bio photo placeholder
└── artworks/
    ├── collection-1/
    ├── collection-2/
    ├── collection-3/
    ├── collection-4/
    └── bio/
        └── artist-placeholder.jpg   # Optional artist photo
```

## How to add the real artwork

1. Put JPEGs in the matching `artworks/collection-X/` folder.
2. Edit `assets/artworks.json`:
   - Set collection names and intros.
   - List each painting with its filename, title, and price.
3. Save an artist photo as `artworks/bio/artist-placeholder.jpg`.
4. Open `index.html` in a browser (or use local preview below).

## Local preview without a domain

You can view the site from your own computer. Open a terminal in the project folder and run:

```bash
python3 -m http.server 8080
```

Then open:

```
http://localhost:8080
```

in your browser (Flatpak Firefox works fine). No domain or internet hosting needed for preview.

To stop the preview server, press `Ctrl+C` in the terminal.

## Deploy notes

Once the domain is secured, the files in this repo can be served by any static host (GitHub Pages, Netlify, a self-hosted nginx server, etc.). The site is plain HTML/CSS/JS with no build step.
