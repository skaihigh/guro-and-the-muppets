---
layout: base.njk
title: Notation
---

# LilyPond Notation Pipeline

We render engraving-quality snippets with LilyPond and embed the SVG/PDF outputs directly in Markdown and the site.

## Render assets

1. Install LilyPond (make sure `lilypond` is on your PATH).
2. Run:
   ```bash
   npm run render:lilypond
   ```
3. Outputs go to:
   - SVG: `notation/out/svg/`
   - PDF: `notation/out/pdf/`

## Embed in Markdown

Use the shortcode in pages:

```njk
{% raw %}{% notationSvg "brush-intro" "Brush intro (4 bars)" %}{% endraw %}
```

## Example snippets

- Brushes intro (drums):
  {% notationSvg "brush-intro", "Brush intro (4 bars)" %}

- Oom-chunk guitar comp:
  {% notationSvg "oom-chunk-guitar", "Oom-CHUNK comp (Cmin - F7 - Cmin - G7)" %}

Update the `.ly` files in `notation/src/`, rerun the render script, and commit both the source and the rendered assets. PDFs can be linked alongside SVGs for print handouts.
