---
layout: base.njk
title: Generate Walking Bass
---

# Skill: Generate Walking Bass Line

## Command
`/walking-bass`

## Description
Creates a walking bass line for any chord progression in swing style.

## Usage
```
/walking-bass [chord progression] in [key] at [tempo]
```

## Input Format
Chord progression as: `| Chord | Chord | Chord | Chord |`

## Output Format
```
| Chord    |
| B1 B2 B3 B4 |  (quarter notes)
| note note note note |
```

## Walking Bass Rules Applied

1. **Beat 1**: Root or strong chord tone
2. **Beat 3**: 5th or another chord tone
3. **Beats 2 & 4**: Passing tones, approach notes
4. **Beat 4**: Approach to next chord root

## Approach Types Used
- Chromatic below (half step up to target)
- Chromatic above (half step down to target)
- Diatonic (scale tone approach)
- Dominant (5th of target chord)

## Example

```
User: /walking-bass | Dm7 | G7 | Cmaj7 | Cmaj7 | in C

Agent:
| Dm7           | G7            | Cmaj7         | Cmaj7         |
| D  F  A  Ab   | G  B  D  Db   | C  E  G  A    | G  E  D  B    |
  R  3  5  chr    R  3  5  chr    R  3  5  6      5  3  2  7

Legend: R=root, 3=third, 5=fifth, chr=chromatic approach
```

## Tempo Guidelines
- Slow (80-110): More space, simpler lines
- Medium (110-150): Standard walking
- Fast (150+): Simplified, root-focused
