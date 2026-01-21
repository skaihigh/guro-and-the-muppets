#!/bin/bash

# Generate PDFs from markdown files
# Requires: npx md-to-pdf

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SONGS_DIR="$PROJECT_DIR/songs"
OUTPUT_DIR="$PROJECT_DIR/output/pdf"

echo "==================================="
echo "  Guro and the Muppets"
echo "  PDF Generator"
echo "==================================="
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to generate PDFs for a song folder
generate_song_pdfs() {
    local song_folder="$1"
    local song_name=$(basename "$song_folder")
    local song_output="$OUTPUT_DIR/$song_name"

    echo "Processing: $song_name"
    mkdir -p "$song_output"

    # Generate PDF for each markdown file
    for md_file in "$song_folder"/*.md; do
        if [ -f "$md_file" ]; then
            local filename=$(basename "$md_file" .md)
            echo "  - $filename.md -> $filename.pdf"

            # md-to-pdf outputs to same directory, so we generate then move
            npx md-to-pdf "$md_file" 2>/dev/null && {
                local pdf_file="${md_file%.md}.pdf"
                if [ -f "$pdf_file" ]; then
                    mv "$pdf_file" "$song_output/$filename.pdf"
                fi
            } || {
                echo "    Warning: Failed to generate $filename.pdf"
            }
        fi
    done

    echo ""
}

# Process each song folder
for song_folder in "$SONGS_DIR"/*/; do
    if [ -d "$song_folder" ]; then
        generate_song_pdfs "$song_folder"
    fi
done

echo "==================================="
echo "  Done!"
echo "  PDFs saved to: $OUTPUT_DIR"
echo "==================================="

# List generated files
echo ""
echo "Generated files:"
find "$OUTPUT_DIR" -name "*.pdf" -type f 2>/dev/null | sort || echo "No PDFs generated yet"
