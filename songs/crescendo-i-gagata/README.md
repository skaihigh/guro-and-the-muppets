# Crescendo i gågata - Swing Jazz Arrangement

**Original**: Lillebjørn Nilsen
**Arrangement**: Guro and the Muppets
**Key**: G major (vers) / E minor (chorus - Ode to Joy)
**Tempo**: 130-140 BPM (medium swing)
**Special Feature**: Chorus based on Beethoven's "Ode to Joy"

---

## Toneart-konsept

Denne sangen bruker **major/minor kontrast**:
- **Vers**: G-dur (lyst, glad, optimistisk)
- **Chorus**: E-moll (dramatisk, Beethoven-referanse)

Dette passer perfekt med teksten "Beethovens Niendes kor stemt opp!"

---

## Filer i denne mappen

| Fil | Instrument | Beskrivelse |
|-----|------------|-------------|
| `keyboard.md` | Keyboard/Piano | Voicings for G og Em, comping |
| `bass.md` | Kontrabass | Walking lines, pivot-linjer |
| `guitar.md` | Rytmegitar | Shell voicings, strumming |
| `saxophone.md` | Saksofon | **Ode to Joy melodi!** Transponert |
| `drums.md` | Trommer | Patterns, pivot-fills |
| `vocals.md` | Vokal | Tekst, Ode to Joy melodi |
| `full-score.md` | Alle | Komplett arrangement |
| `ode-to-joy-analysis.md` | Referanse | Detaljert Ode to Joy analyse |

---

## Quick Reference

### Tonearter
- **Vers (Concert pitch)**: G major
- **Chorus (Concert pitch)**: E minor
- **Tenor sax (vers)**: A major (skrevet)
- **Tenor sax (chorus)**: F# minor (skrevet)
- **Alto sax (vers)**: E major (skrevet)
- **Alto sax (chorus)**: C# minor (skrevet)

### Form
```
INTRO (Em) → VERS 1 (G) → VERS 2 (G) → CHORUS 1 (Em - Ode to Joy) →
VERS 3 (G) → VERS 4 (G) → CHORUS 2 (Em) → BRIDGE (G→Em) →
[SAX SOLO] → VERS 5 (G) → CHORUS 3/TAG (Em) → OUTRO
```

### Akkordprogresjon

**Vers (G-dur):**
```
| Cmaj7 | Bm7 E7 | Am9 | D13 | Em7 A7 | Am7 D7 | Gmaj9 | G6 B7 |
```

**Chorus - Ode to Joy (E-moll):**
```
| Em9 | Am7 D7 | Gmaj7 | B7#9 | Em9 | Am7 D7 | Gmaj7 C#m7b5 | F#7 B7 |
```

### Ode to Joy Melodi (Concert - E minor)
```
Frase 1: G  G  A  B | B  A  G  F# | E  E  F# G | G  F# F# -
Frase 2: G  G  A  B | B  A  G  F# | E  E  F# G | F# E  E  -
```

---

## Dynamikk-oversikt

| Del | Dynamikk | Toneart |
|-----|----------|---------|
| Intro | mp | Em |
| Vers 1-2 | mf | G |
| Chorus 1 | f | Em |
| Vers 3-4 | mf | G |
| Chorus 2 | f | Em |
| Bridge start | mp | G |
| Bridge slutt | f | →Em |
| Vers 5 | ff | G |
| Chorus 3 | f → mp | Em |

---

## Viktige øyeblikk

1. **Pivot-akkord**: B7 på slutten av vers leder til Em chorus
2. **Ode to Joy inngang**: Sax og vokal dobler melodien
3. **Bridge build**: Start intimt, crescendo til klimaks
4. **Ritardando**: På siste chorus/tag

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
