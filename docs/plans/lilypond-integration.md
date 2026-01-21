# Plan: LilyPond Integration for Notation

Purpose: add engraving-quality notation (SVG/PDF) for rhythms, drums, guitar, and full scores, usable on the Eleventy site and in `md-to-pdf` exports.

## Directory layout (new)
1) `notation/src/` — source `.ly` files (one per pattern/section/score).
2) `notation/out/svg/` — rendered SVGs (web embedding).
3) `notation/out/pdf/` — rendered PDFs (downloads/print).
4) `site/notation/` — Eleventy pages that reference the rendered SVG/PDF assets (or include them in song pages).

## Step-by-step
1) Tooling
   - Install LilyPond locally (stable release) and ensure `lilypond` is on PATH.
   - If SVG export needs Inkscape/RSVG on your OS, install one (LilyPond can write SVG directly, but some platforms require an SVG backend helper).

2) Rendering script
   - Add `scripts/render-lilypond.sh` (bash) to:
     - find `notation/src/*.ly`;
     - render each to SVG and PDF into `notation/out/svg` and `notation/out/pdf`;
     - error if LilyPond is missing; keep outputs deterministic (overwrite, fail on error).
   - Add npm scripts: `render:lilypond` (single run) and `render:lilypond:watch` (optional, rerun on changes with `fswatch`/`chokidar-cli` if desired).

3) Eleventy wiring
   - In `.eleventy.js`, passthrough-copy `notation/out/svg` and `notation/out/pdf`.
   - Add a Nunjucks shortcode (e.g., `notationSvg(name)`) that emits an `<figure>` with the SVG `<img>` pointing to `/notation/out/svg/{name}.svg` plus a caption.
   - For downloads, link to `/notation/out/pdf/{name}.pdf`.

4) CSS touch-up
   - Add a small CSS block (e.g., `site/css/notation.css`) for max-width, centering, caption style, and optional dark-mode-friendly background.
   - Ensure `md-to-pdf` picks up the same CSS (include it in the print pipeline).

5) Example content
   - Add one drum groove and one guitar comp pattern as `.ly` files in `notation/src/`.
   - Render them via the script; embed the SVGs into an existing song page (e.g., `site/songs/vaarherres-klinkekule/index.md`) using the shortcode.
   - Add a standalone reference page under `site/notation/index.md` explaining how to embed and naming conventions.

6) Print/PDF path
   - Confirm `md-to-pdf` output shows the embedded SVG cleanly.
   - For printable handouts, link the rendered PDFs next to the SVG embeds.

7) QA + docs
   - Document usage in `README.md` (prereqs, `npm run render:lilypond`, where assets live).
   - Add a quick checklist: run render → run site build → spot-check SVG and PDF → commit `notation/src` and rendered outputs.

8) Future (optional)
   - Export MusicXML/MEI from LilyPond if we later want Verovio-based interactive views.
   - Add a cache-busting hash in filenames if browser caching becomes an issue.
