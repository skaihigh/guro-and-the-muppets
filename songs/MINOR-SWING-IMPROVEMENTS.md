# Minor Swing - Critical Improvement Recommendations

**Date**: February 10, 2026  
**Based on**: Django Reinhardt research + current arrangement analysis

---

## 🚨 CRITICAL ISSUES FOUND

### 1. **TEMPO IS TOO FAST**

- **Current**: 240 BPM
- **Problem**: Original Django recordings are 200-220 BPM, not 240
- **Impact**: At 240 BPM, the walking bass becomes muddy, swing feel is lost, and it's too frantic
- **FIX**: **Reduce to 210 BPM** (or test between 200-220)

### 2. **DRUM PATTERN IS WRONG STYLE**

- **Current**: Standard swing ride cymbal pattern with bass drum on 1
- **Problem**: Original had NO DRUMS AT ALL! This is gypsy jazz, not American swing
- **Impact**: Sounds too heavy, not authentic gypsy jazz feel
- **FIX**: Use **BRUSHES throughout**, emphasize hi-hat on 2 & 4, minimal bass drum

### 3. **MISSING INSTRUMENTATION CLARITY**

- **Current docs mention**: Piano, Sax, Guitar (la pompe), Bass, Drums
- **User wants**: Piano, Sax, Bass, Drums, Percussion (NO GUITAR mentioned!)
- **Problem**: If we remove guitar, we lose "la pompe" - the heartbeat of gypsy jazz
- **CRITICAL DECISION NEEDED**:
  - **Option A**: Keep guitar with la pompe (authentic)
  - **Option B**: Remove guitar, simulate la pompe with piano chords + percussion
  - **Option C**: Singer plays percussion rhythm to replace la pompe feel

---

## 📋 SPECIFIC MIDI FILE IMPROVEMENTS

### Priority 1: Tempo Adjustment

```
CHANGE: 240 BPM → 210 BPM
TEST: Try 200, 210, 220 and pick what swings best
```

### Priority 2: Drum Track Rewrite

**Current (WRONG):**

```
Ride:    X . X X X . X X  (ding-ding-a-ding)
Hi-hat:  . . X . . . X .  (foot chick on 2 & 4)
Bass:    X . . . . . . .  (on 1)
```

**New (AUTHENTIC GYPSY JAZZ ADAPTED):**

```
OPTION A - Brushes, light approach:
Brushes: swish-swish-swish-swish (circular pattern, very light)
Hi-hat:  . . X . . . X .  (foot on 2 & 4 - ESSENTIAL!)
Snare:   . . . . . . . .  (ghost notes only, very quiet)
Bass:    . . . . . . . .  (NO bass drum, or beat 1 ONLY, very soft)

OPTION B - Two-feel:
Brushes: swish --- swish ---  (only on 1 and 3)
Hi-hat:  . . X . . . X .      (foot on 2 & 4)
```

**Key differences:**

- BRUSHES, not sticks
- Emphasize HI-HAT FOOT on 2 & 4 (this simulates la pompe accents)
- Minimal or NO bass drum
- Very light overall - think "whisper drums"

### Priority 3: Bass Line Enhancement

**Current bass docs look GOOD**, but verify:

- [ ] Is it using pizzicato upright bass sound (not electric)?
- [ ] Root on beat 1 ALWAYS?
- [ ] Chromatic approaches between chords?
- [ ] Try TWO-FEEL during head melody (quarter notes on 1 & 3 only)

**Two-feel example for Takt 1-2:**

```
Standard walking:  | A  B  C  E | A  G  F#  E |
Two-feel option:   | A  -  -  E | A  -  -  E |
                     1  2  3  4   1  2  3  4
```

### Priority 4: Piano Part - ADD SPACE!

**Current problem**: Piano likely comps on every beat (too busy)

**NEW APPROACH:**

1. **During HEAD melody** (Chorus 1-2):
   - Piano plays SHELL VOICINGS on beats 2 & 4 ONLY
   - This reinforces the "la pompe" feel
   - Example: Am6 shell = just A + F# on beats 2 & 4

2. **During PIANO SOLO** (Chorus 3-4):
   - Piano can be active, improvising
   - Left hand: walking bass-style or shell voicings
   - Right hand: melodic improvisation

3. **During SAX SOLO** (Chorus 5-6):
   - Piano LAYS OUT completely (silence) OR
   - Very sparse shell voicings, letting sax breathe

4. **During HEAD OUT** (Chorus 7):
   - Return to beats 2 & 4 shell voicings

**Shell voicings (play these on beats 2 & 4):**

```
Am6:  Left hand plays A + F# (root + 6th)
Dm6:  Left hand plays D + B  (root + 6th)
E7:   Left hand plays E + D  (root + 7th)
Bb7:  Left hand plays Bb + Ab (root + 7th)
```

### Priority 5: Saxophone Melody Line

**Need to CREATE** an actual melodic line based on arpeggios.

**Minor Swing Melody Approach:**

- Based on Am6 arpeggio: A - C - E - F# - A
- Add chromatic enclosures
- Rhythmically: syncopated, not straight quarters
- Think VIOLIN (Grappelli) not bebop sax

**Example melody for first 4 bars:**

```
Bar 1 (Am6):  | A  -  F# E  |  C  B  A  -  |
Bar 2 (Am6):  | E  -  C  -  |  A  G# A  -  |
Bar 3 (Dm6):  | D  -  B  A  |  F  E  D  -  |
Bar 4 (Dm6):  | A  -  F  -  |  D  C# D  -  |
```

**Priority**: Create this based on Django/Grappelli recordings!

### Priority 6: ADD PERCUSSION FOR SINGER

**Instruments for singer:**

- **Tambourine**: On beats 2 & 4 (like hi-hat, reinforces la pompe)
- **Shaker**: Continuous eighth notes, very light background
- **Woodblock**: Accents on intro/ending, breakdown sections

**Pattern:**

```
         1   +   2   +   3   +   4   +
Tamb:    .   .   X   .   .   .   X   .   (tap on 2 & 4)
Or:      .   .   Sh  .   .   .   Sh  .   (shake on 2 & 4)
```

**Important**: Singer can't play complex patterns - keep it SIMPLE!

### Priority 7: Arrangement Form Updates

**Current form is good**, but needs these tweaks:

```
COUNT-IN (1 bar) - just bass
  ↓
INTRO (4 bars) - Arpeggios
  - Bass + percussion only
  - Establish Am-Dm-E7 vamp
  - NO drums yet
  ↓
HEAD 1 (16 bars) - Chorus 1
  - SAX enters with melody
  - DRUMS enter (brushes, light)
  - Piano: shell voicings on 2 & 4 only
  - Dynamics: mf
  ↓
HEAD 2 (16 bars) - Chorus 2
  - Repeat melody or variation
  - Full band, slightly more energy
  - Dynamics: mf → f
  ↓
PIANO SOLO (16 bars) - Chorus 3
  - Sax LAYS OUT
  - Piano improvises freely
  - Drums can get slightly busier
  - Dynamics: f
  ↓
PIANO SOLO (16 bars) - Chorus 4
  - Continue piano solo
  - Peak energy
  - Dynamics: ff
  ↓
SAX SOLO (16 bars) - Chorus 5
  - Piano LAYS OUT or very sparse
  - Sax builds intensity
  - Dynamics: mf → f
  ↓
SAX SOLO (16 bars) - Chorus 6
  - Continue sax solo
  - Peak, then taper
  - Dynamics: ff → mf (prepare for return)
  ↓
HEAD OUT (16 bars) - Chorus 7
  - Return to melody
  - Full band
  - Build to climax
  - Dynamics: f → ff
  ↓
ENDING (4-8 bars)
  - Similar to intro arpeggio material
  - Ritardando on last 2 bars
  - Final Am6 chord - HOLD
  - Woodblock accent on final note
```

**Total duration**: ~7 choruses × 16 bars = 112 bars @ 210 BPM = ~2:08 (vs current ~1:55)

---

## 🎼 SPECIFIC MIDI EDITING CHECKLIST

### Track 1: Drums

- [ ] Change to BRUSH sound instead of sticks
- [ ] Remove or reduce bass drum (only on beat 1, if at all)
- [ ] Emphasize hi-hat FOOT on beats 2 & 4
- [ ] Add ghost notes on snare (velocity 20-30, barely audible)
- [ ] Try two-feel option (beats 1 & 3 only)
- [ ] During intro (bars 1-4): drums completely silent

### Track 2: Bass

- [ ] Verify sound: pizzicato upright bass (not electric)
- [ ] Check all beat-1 notes are chord roots
- [ ] Add more chromatic approaches between changes
- [ ] Try two-feel during head (beats 1 & 3 only, bars 5-36)
- [ ] Full walking bass during solos

### Track 3: Piano

- [ ] REMOVE notes on beats 1 & 3 during head sections
- [ ] Keep only beats 2 & 4 (shell voicings)
- [ ] Change to lighter velocity (70-80, not 100+)
- [ ] Sections where piano lays out: delete all notes during sax solo (bars 69-100)
- [ ] Piano solo section (bars 37-68): can be fully active

### Track 4: Saxophone

- [ ] CREATE actual melodic line based on arpeggios
- [ ] Use upper register (C5-A6)
- [ ] Add chromatic enclosures
- [ ] Vary articulation (some staccato, some legato)
- [ ] Transpose correctly: Tenor Sax = Bm, Alto Sax = F#m

### Track 5: Percussion (NEW!)

- [ ] ADD tambourine track
- [ ] Pattern: hits on beats 2 & 4 only
- [ ] Velocity: 60-70 (moderate, not loud)
- [ ] OR: shaker eighth notes, velocity 40-50 (background)
- [ ] Woodblock accents: intro/ending only

### Track 6: Guitar (DECISION NEEDED!)

**Current**: Has rhythm guitar with la pompe
**User mentioned**: piano, sax, drums, bass, percussion (no guitar?)

**CRITICAL QUESTION**: Do we KEEP guitar or REMOVE it?

**Recommendation**: **KEEP GUITAR!**

- Without guitar, it won't sound like gypsy jazz
- La pompe is the defining characteristic
- Singer can play percussion WHILE guitar keeps rhythm
- Modern swing sextet can include guitar

**IF we remove guitar:**

- Piano MUST play on beats 2 & 4 to simulate la pompe
- Percussion (tambourine) becomes MORE important
- Sound will be more "American swing" than "gypsy jazz"

---

## 🎯 IMMEDIATE ACTION PLAN

### Phase 1: Quick Fixes (Do These First)

1. **Change tempo**: 240 → 210 BPM
2. **Change drum sound**: Sticks → Brushes
3. **Reduce drum activity**: Remove busy ride pattern, emphasize hi-hat
4. **Thin out piano**: Remove beats 1 & 3 during head sections

### Phase 2: Melody Creation

5. **Create sax melody line** based on arpeggios and Django's vocabulary
6. **Record or program melody** following Grappelli's violin approach

### Phase 3: Structure

7. **Add proper intro** section (4 bars, bass + perc only)
8. **Add ending tag** (4-8 bars, with ritardando)
9. **Define section boundaries** clearly in MIDI

### Phase 4: Percussion

10. **Add tambourine track** (beats 2 & 4)
11. **Add shaker track** (optional, background)
12. **Add woodblock accents** (intro/ending)

### Phase 5: Polish

13. **Dynamics programming**: Velocity curves matching section dynamics
14. **Articulation**: Vary note lengths and attacks
15. **Humanization**: Slight timing variations (not perfectly quantized)

---

## 🔍 TESTING CHECKLIST

After making changes, TEST these elements:

### Tempo Test

- [ ] Does 210 BPM feel like it swings? (vs 240 feeling frantic)
- [ ] Can you hear individual walking bass notes clearly?
- [ ] Does it match the feel of Django's original recording?

### Drums Test

- [ ] Do drums sound LIGHT, not heavy?
- [ ] Can you hear the "chick" of hi-hat on 2 & 4?
- [ ] Does it feel like gypsy jazz or American swing?

### Piano Test

- [ ] Is there SPACE in the arrangement?
- [ ] Can you hear beats 2 & 4 clearly?
- [ ] Does piano lay out during sax solo?

### Sax Test

- [ ] Does the melody sound violin-like (smooth, arpeggio-based)?
- [ ] Is it in the upper register?
- [ ] Does it avoid bebop clichés?

### Overall Feel Test

- [ ] Does it sound transparent (not overly dense)?
- [ ] Can you hear the "la pompe" feel (even without live guitar)?
- [ ] Does it capture Django's Paris 1937 spirit?
- [ ] Would it work for lindy hop dancing?

---

## 📚 REFERENCE CHECKLIST

Before finalizing, COMPARE to:

### Listen to These Recordings:

1. **Django Reinhardt - Minor Swing (1937)** - original
2. **Stochelo Rosenberg Trio - Minor Swing** - modern gypsy jazz
3. **Bireli Lagrene - Minor Swing** - contemporary approach

### Check These Elements Match:

- [ ] Tempo feels similar (200-220 range)
- [ ] Light, transparent texture
- [ ] Strong emphasis on beats 2 & 4
- [ ] Arpeggio-based melodic lines
- [ ] A harmonic minor scale sound (especially the G#!)
- [ ] Minor-key moodiness with virtuosic energy

---

## 🎼 MUSICALITY REMINDERS

Remember these principles while editing:

### Space is Essential

"The notes you DON'T play are as important as the notes you DO play."

- Don't fill every beat
- Let soloists breathe
- Silence creates tension and release

### Beats 2 & 4 are Everything

In swing jazz, beats 2 & 4 drive the music:

- Hi-hat foot: 2 & 4
- Piano chords: 2 & 4
- Tambourine: 2 & 4
- La pompe accents: 2 & 4

### Arpeggio > Scale

Gypsy jazz improvisation is built on:

- Chord arpeggios (Am6 = A C E F#)
- Chromatic connecting notes
- NOT running up and down scales

### Light, Fast, Transparent

At 200-220 BPM with light touch:

- Rhythm section should sound effortless
- No heavy-handed playing
- Acoustic sensibility even if amplified

---

## NEXT STEPS

1. **Read research document**: `MINOR-SWING-RESEARCH.md`
2. **Listen to original**: Django Reinhardt 1937 recording (YouTube)
3. **Open MIDI file**: In your DAW or MIDI editor
4. **Apply Priority 1-3 fixes**: Tempo, drums, bass
5. **Test and iterate**: Does it sound better?
6. **Create melody**: Based on arpeggio approach
7. **Add percussion**: Tambourine track
8. **Final polish**: Dynamics, humanization

---

**Document Status**: Ready for implementation  
**Last Updated**: February 10, 2026
