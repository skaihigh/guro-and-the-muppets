#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT_DIR/notation/src"
SVG_DIR="$ROOT_DIR/notation/out/svg"
PDF_DIR="$ROOT_DIR/notation/out/pdf"

if ! command -v lilypond >/dev/null 2>&1; then
  echo "Error: lilypond is not on PATH. Install LilyPond and retry." >&2
  exit 1
fi

mkdir -p "$SVG_DIR" "$PDF_DIR"

shopt -s nullglob
scores=("$SRC_DIR"/*.ly)
shopt -u nullglob

if [[ ${#scores[@]} -eq 0 ]]; then
  echo "No .ly files found in $SRC_DIR"
  exit 0
fi

for score in "${scores[@]}"; do
  name="$(basename "$score" .ly)"
  echo "Rendering $name to SVG..."
  lilypond -dbackend=svg -dno-point-and-click -o "$SVG_DIR/$name" "$score"

  echo "Rendering $name to PDF..."
  lilypond -dno-point-and-click --pdf -o "$PDF_DIR/$name" "$score"
done

echo "Done. SVGs in $SVG_DIR, PDFs in $PDF_DIR."
