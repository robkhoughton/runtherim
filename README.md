# runtherim.com

Website for Run the Rim, the trail race on the Arnold Rim Trail in Arnold, California, presented by the Arnold Rim Trail Association.

Plain static HTML: no framework and no build step. Served by GitHub Pages from the `main` branch root.

- `index.html`, `courses.html`, `race-day.html`, `sponsors.html`, `404.html`: the pages. Each page carries its own copy of the header and footer, so a nav or footer change must be made in all five.
- `css/style.css`: all styling (ARTA brand colors, Open Sans).
- `img/`, `gpx/`, `docs/`: images, course GPX files, and the Runner Guide PDF.

Registration status, prices and the wait-list live on UltraSignup. The site links there and never states open or closed status itself.

Do not use Git LFS in this repository; GitHub Pages cannot serve LFS files.

Preview locally: `python -m http.server` in this folder, then open http://localhost:8000.
