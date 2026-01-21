# Guro and the Muppets - Music Generator

AI-powered swing jazz arrangement generator for transforming songs into 1920s-1950s Lindy Hop style.

---

## Quick Links - Songs

| Song | Markdown | PDF |
|------|----------|-----|
| Vårherres Klinkekule (Em) | [songs/vaarherres-klinkekule/](songs/vaarherres-klinkekule/) | [output/pdf/vaarherres-klinkekule/](output/pdf/vaarherres-klinkekule/) |
| Crescendo i gågata (G) | [songs/crescendo-i-gagata/](songs/crescendo-i-gagata/) | [output/pdf/crescendo-i-gagata/](output/pdf/crescendo-i-gagata/) |

---

## Project Structure

```
├── agents/           # AI agent definitions for each instrument
├── knowledge/        # Music theory knowledge base
├── skills/           # Command skills (/transform, /transpose, etc.)
├── songs/            # Arranged songs with per-instrument parts
│   ├── vaarherres-klinkekule/
│   │   ├── README.md
│   │   ├── keyboard.md
│   │   ├── bass.md
│   │   ├── guitar.md
│   │   ├── saxophone.md
│   │   ├── drums.md
│   │   ├── vocals.md
│   │   └── full-score.md
│   └── crescendo-i-gagata/
│       └── ...
├── scripts/          # Utility scripts
└── output/           # Generated PDFs (gitignored)
```

## Songs

### Vårherres Klinkekule
- **Original**: Erik Bye / Finn Luth
- **Key**: E minor (original key)
- **Tempo**: 130-140 BPM
- **Features**: Gene Krupa drum break

### Crescendo i gågata
- **Original**: Lillebjørn Nilsen
- **Key**: G major
- **Tempo**: 140-150 BPM
- **Features**: Rhythm changes chorus

## Agents

| Agent | Purpose |
|-------|---------|
| `music-theory-expert` | Core jazz theory |
| `swing-era-specialist` | 1920-1950s style |
| `contrabass-agent` | Walking bass lines |
| `saxophone-agent` | Transposition, fills |
| `rhythm-guitar-agent` | Freddie Green style |
| `keyboard-agent` | Voicings, comping |
| `vocals-agent` | Jazz phrasing |
| `drums-agent` | Swing patterns |
| `arrangement-orchestrator` | Full arrangements |

## Skills (Commands)

- `/transform-to-swing` - Convert song to swing jazz
- `/transpose` - Transpose for instruments
- `/walking-bass` - Generate bass lines
- `/drum-pattern` - Generate drum patterns

## Generate PDFs

### First time setup:
```bash
npm install
```

### Generate all PDFs:
```bash
npm run generate-pdf
```

PDFs will be saved to `output/pdf/`.

### Manual generation:
```bash
npx md-to-pdf songs/vaarherres-klinkekule/keyboard.md
```

## Band Members Quick Start

1. Go to `songs/[song-name]/`
2. Find your instrument file (e.g., `guitar.md`)
3. Read the README for song overview
4. Generate PDF if needed

## Tempo Guide (Lindy Hop)

| Tempo | Description | Style |
|-------|-------------|-------|
| 110-130 | Slow swing | Brush, soft |
| 130-160 | Medium (sweet spot) | Basic, Jo Jones |
| 160-190 | Fast | Energetic, Gene Krupa |
| 190+ | Balboa territory | Simplified |
