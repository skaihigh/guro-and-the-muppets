---
layout: base.njk
title: Transpose For Instrument
---

# Skill: Transpose for Instrument

## Command
`/transpose`

## Description
Transposes music from concert pitch to the appropriate key for each instrument in the band.

## Usage
```
/transpose [from_key] to [target_key] for [instrument]
```

## Supported Instruments

### Concert Pitch (No transposition)
- Piano/Keyboard
- Guitar
- Bass (sounds octave lower, but written at pitch)
- Vocals

### Transposing Instruments

#### Alto Saxophone (E♭)
- Concert C = Written A
- Add 3 sharps (or remove 3 flats)
- Write a Major 6th higher

#### Tenor Saxophone (B♭)
- Concert C = Written D
- Add 2 sharps (or remove 2 flats)
- Write a Major 2nd higher (+ octave)

## Quick Reference Tables

### Concert to Alto Sax
| Concert | Alto Written |
|---------|-------------|
| C | A |
| D | B |
| E♭ | C |
| E | C# |
| F | D |
| G | E |
| A | F# |
| B♭ | G |

### Concert to Tenor Sax
| Concert | Tenor Written |
|---------|--------------|
| C | D |
| D | E |
| E♭ | F |
| E | F# |
| F | G |
| G | A |
| A | B |
| B♭ | C |

## Example Usage

```
User: /transpose E♭m to tenor sax

Agent:
Concert key: E♭m
Tenor sax written key: Fm

Chord transpositions:
- E♭m → Fm
- A♭m → B♭m
- D♭7 → E♭7
- G♭maj7 → A♭maj7
- B♭7 → C7
- F7 → G7
```
