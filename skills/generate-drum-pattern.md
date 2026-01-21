# Skill: Generate Drum Pattern

## Command
`/drum-pattern`

## Description
Genererer swing jazz trommepatterns, fills og arrangement-forslag.

## Usage
```
/drum-pattern [tempo] [stil] [seksjon]
```

### Parametere
- **tempo**: BPM (typisk 110-190 for Lindy Hop)
- **stil**: `jo-jones` | `gene-krupa` | `brush` | `basic`
- **seksjon**: `intro` | `vers` | `chorus` | `solo` | `shout` | `break` | `outro`

## Output

### Basic Pattern Output
```
Tempo: [X] BPM
Stil: [navn]
Seksjon: [type]

PATTERN:
    1   +   2   +   3   +   4   +
R:  [ride]
HH: [hi-hat foot]
S:  [snare]
B:  [bass drum]

DYNAMIKK: [pp-ff]
TIPS: [kontekst-spesifikke råd]
```

### Fill Output
```
FILL ([lengde] takter):
    1   +   2   +   3   +   4   +
    [notasjon]

BRUK: [når og hvordan]
```

## Eksempler

### Eksempel 1: Basic Swing
```
User: /drum-pattern 140 basic vers

Output:
Tempo: 140 BPM
Stil: Basic Swing
Seksjon: Vers

    1   +   2   +   3   +   4   +
R:  X   .   X   X   X   .   X   X
HH: .   .   X   .   .   .   X   .
S:  .   .   .   .   .   .   .   .
B:  X   .   .   .   .   .   .   .

DYNAMIKK: mf
TIPS: Hold steady, støtt vokalisten
```

### Eksempel 2: Gene Krupa Break
```
User: /drum-pattern 135 gene-krupa break

Output:
Tempo: 135 BPM
Stil: Gene Krupa
Seksjon: Break (4 takter solo)

TAKT 1 (pp):
FT: X   .   X   .   X   .   X   X

TAKT 2 (p):
FT: X   .   X   .   X   .   X   X
    dum     dum     dum     dum-dum

TAKT 3 (mp):
    X   X   X   X   X   X   X   X

TAKT 4 (f → CRASH):
    X   X   X   X   X   X   X   CRASH!

TIPS: Bygg intensitet! Band kommer inn på crash.
```

### Eksempel 3: Brush Ballad
```
User: /drum-pattern 90 brush intro

Output:
Tempo: 90 BPM
Stil: Brushes
Seksjon: Intro

    1   +   2   +   3   +   4   +
LH: ~~~~~~~~~~~~~~~~~~~~~~~~~~~ (sweep)
RH: .   .   tap .   .   .   tap .
HH: .   .   X   .   .   .   X   .

DYNAMIKK: pp-p
TIPS: Mykt og intimt, sett stemningen
```

## Lindy Hop Tempo Guide

| Tempo | Beskrivelse | Anbefalt Stil |
|-------|-------------|---------------|
| 110-130 | Slow swing | Brush eller lett |
| 130-160 | Medium (sweet spot) | Basic eller Jo Jones |
| 160-190 | Fast | Energisk, Gene Krupa |
| 190+ | Balboa territory | Forenklet, hi-hat fokus |
