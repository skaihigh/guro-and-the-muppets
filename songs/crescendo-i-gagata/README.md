# Crescendo i gågata - Swing Jazz Arrangement

**Original**: Lillebjørn Nilsen
**Arrangement**: Guro and the Muppets
**Key**: G major (original toneart)
**Tempo**: 140-150 BPM (medium-up swing)

---

## Filer i denne mappen

| Fil | Instrument | Beskrivelse |
|-----|------------|-------------|
| `keyboard.md` | Keyboard/Piano | Voicings, comping, fills |
| `bass.md` | Kontrabass | Walking bass lines |
| `guitar.md` | Rytmegitar | Shell voicings, strumming |
| `saxophone.md` | Saksofon | Transponerte akkorder (Alto/Tenor) |
| `drums.md` | Trommer | Patterns, fills |
| `vocals.md` | Vokal | Tekst med akkorder, tips |
| `full-score.md` | Alle | Komplett arrangement |

---

## Quick Reference

### Toneart
- **Concert pitch**: G major
- **Tenor sax**: A major (skrevet)
- **Alto sax**: E major (skrevet)

### Form
```
INTRO → VERS 1 → VERS 2 → CHORUS 1 → VERS 3 → VERS 4 →
CHORUS 2 → BRIDGE → VERS 5 → CHORUS 3 → OUTRO
```

### Akkordprogresjon (Vers, reharmonisert)
```
| Cmaj7 | Bm7 E7 | Am9 | D13 |
| Em7 A7 | Am7 D7 | Gmaj9 | G6 |
```

### Chorus (Rhythm Changes style)
```
| Cmaj7 C#dim7 | Gmaj7/D G6 | Cmaj7 C#dim7 | Gmaj7 D7 |
```

---

## Dynamikk-oversikt

| Del | Dynamikk |
|-----|----------|
| Intro | mp |
| Vers 1-2 | mf |
| Chorus 1 | f |
| Vers 3-4 | mf |
| Chorus 2 | f |
| Bridge start | mp |
| Bridge slutt | f |
| Vers 5 | ff |
| Outro | f → mp |

---

## Generere PDF

Kjør fra prosjektets rotmappe:
```bash
npm run generate-pdf
```

Eller manuelt:
```bash
npx md-to-pdf songs/crescendo-i-gagata/*.md
```
