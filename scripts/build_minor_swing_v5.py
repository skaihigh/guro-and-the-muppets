#!/usr/bin/env python3
"""
Build Minor Swing v5 MIDI - Authentic swing arrangement

From the Grappelli/Django sheet music:
- HEAD 1 (bars 1-16):  Am arpeggio phrases with grace-note ornaments
- HEAD 2 (bars 17-32): Running eighth note lines, G#/F# chromatics,
                        E7 turnaround, triplet figures
- HEAD OUT:             Fortissimo combination of both styles

Swing feel from original MIDI analysis:
- Ride skip notes at 0.62 beat offset (beats 2 & 4 only)
- "ding... ding-dinga... ding... ding-dinga..."
"""
from pathlib import Path
import mido

src = Path("docs/songs/minor-swing/Minor-Swing.mid")
dst = Path("docs/songs/minor-swing/Minor-Swing-v5.mid")

mid = mido.MidiFile(src)
TPB = mid.ticks_per_beat          # 480
BPB = 4                           # beats per bar
BPC = 16 * BPB                    # 64 beats per chorus
TARGET_BPM = 200

# Swing eighth offset (from original MIDI: skip at 298 ticks)
SW = 298 / TPB                    # ≈ 0.621
TRIP = 1.0 / 3                    # triplet subdivision


def b2t(b):
    return int(round(b * TPB))


def events_to_track(events):
    events.sort(key=lambda x: x[0])
    trk = mido.MidiTrack()
    prev = 0
    for tick, msg in events:
        trk.append(msg.copy(time=max(0, tick - prev)))
        prev = tick
    return trk


max_tick = max(sum(m.time for m in t) for t in mid.tracks)

# Chorus beat offsets (7 choruses of 16 bars each)
C = [i * BPC for i in range(7)]


# ═══════════════════════════════════════════════════════════
#  NOTE REFERENCE
# ═══════════════════════════════════════════════════════════
# G#4=68  A4=69  B4=71  C5=72  D5=74  E5=76
# F5=77   F#5=78 G5=79  G#5=80 A5=81


# ═══════════════════════════════════════════════════════════
#  HEAD 1 - Arpeggio phrases (sheet bars 1-16)
# ═══════════════════════════════════════════════════════════

def build_head1():
    """16-bar head melody: Am arpeggio -> rolled chord -> Dm ornamental turn.
    Returns [(beat, dur, note, vel)]"""
    n = []

    def am(b):
        """Am bar: A4 quarter, C5 eighth, swung E5+C5 rolled chord"""
        n.append((b,               0.95, 69, 88))    # A4 quarter
        n.append((b + 1,           0.45, 72, 82))    # C5 eighth
        n.append((b + 1 + SW,      1.35, 76, 92))    # E5 chord top
        n.append((b + 1 + SW + .06, 1.28, 72, 76))   # C5 chord bottom

    def dm(b):
        """Dm bar: D5-C5 pickup, grace-note cascade, A4 landing"""
        n.append((b,          0.40, 74, 80))          # D5 eighth
        n.append((b + SW,     0.28, 72, 75))          # C5 swung eighth
        # 32nd grace-note ornamental turn
        n.append((b + 1.0,    0.07, 76, 70))          # E5
        n.append((b + 1.07,   0.07, 74, 66))          # D5
        n.append((b + 1.14,   0.07, 72, 62))          # C5
        n.append((b + 1.21,   0.07, 71, 58))          # B4
        n.append((b + 1.30,   0.60, 69, 83))          # A4 landing

    def stab(b):
        """Am arpeggiated chord stab"""
        n.append((b,        0.55, 76, 92))            # E5
        n.append((b + 0.04, 0.55, 72, 87))            # C5
        n.append((b + 0.08, 0.55, 69, 82))            # A4

    def pickup_mf(b):
        """mf pickup figure (bar 16 on sheet)"""
        n.append((b + SW,      0.28, 72, 76))         # C5 swung
        n.append((b + 1,       0.28, 76, 83))         # E5
        n.append((b + 1 + SW,  0.28, 74, 76))         # D5 swung
        n.append((b + 2,       0.28, 72, 73))         # C5
        n.append((b + 2 + SW,  0.55, 69, 80))         # A4 swung

    # Bars 1-6: repeating Am-Dm arpeggio cell
    am(0);   dm(4)
    am(8);   dm(12)
    am(16);  dm(20)
    # Bars 7-8: stab + silence
    stab(24)
    # Bars 9-14: resume
    am(32);  dm(36)
    am(40);  dm(44)
    am(48);  dm(52)
    # Bars 15-16: stab + mf pickup
    stab(56)
    pickup_mf(60)

    return n


# ═══════════════════════════════════════════════════════════
#  HEAD 2 - Running eighth note lines (sheet bars 17-32)
# ═══════════════════════════════════════════════════════════
# The second chorus on the sheet is COMPLETELY DIFFERENT:
# - Syncopated pickup figures (bars 16-17)
# - Running swung eighth note scalar lines (bars 18-20)
# - G# leading tone, F# from Am melodic minor / Am6
# - E7 turnaround chord (bar 21)
# - Triplet figure (bar 22)

def build_head2():
    """HEAD 2: running eighth note lines with chromatic tones.
    Based on sheet music bars 17-32."""
    n = []

    # == Bars 1-2 (sheet 17-18): pickup figures → running eighths ==
    # Bar 1 (Am): mf syncopated pickup (like sheet bar 17)
    n += [
        (SW,        0.33, 72, 82),     # C5
        (1.0,       0.33, 76, 86),     # E5
        (1 + SW,    0.33, 74, 82),     # D5
        (2.0,       0.33, 72, 78),     # C5
        (2 + SW,    0.50, 69, 82),     # A4
    ]
    # Bar 2 (Dm): ascending run with F# (sheet bar 18)
    n += [
        (4 + SW,    0.33, 69, 78),     # A4
        (5.0,       0.33, 71, 80),     # B4
        (5 + SW,    0.33, 72, 82),     # C5
        (6.0,       0.33, 74, 85),     # D5
        (6 + SW,    0.33, 76, 88),     # E5
        (7.0,       0.33, 78, 86),     # F#5 (melodic minor!)
        (7 + SW,    0.45, 76, 82),     # E5
    ]

    # == Bars 3-4 (sheet 19-20): running lines with G# ==
    # Bar 3: descending answer
    n += [
        (8.0,       0.33, 74, 82),     # D5
        (8 + SW,    0.33, 72, 80),     # C5
        (9.0,       0.33, 76, 85),     # E5 (jump up)
        (9 + SW,    0.33, 74, 82),     # D5
        (10.0,      0.33, 72, 80),     # C5
        (10 + SW,   0.33, 71, 78),     # B4
        (11.0,      0.50, 69, 82),     # A4
    ]
    # Bar 4: chromatic approach with G#
    n += [
        (12.0,      0.33, 74, 82),     # D5
        (12 + SW,   0.33, 72, 80),     # C5
        (13.0,      0.33, 69, 78),     # A4
        (13 + SW,   0.33, 68, 82),     # G#4 (leading tone!)
        (14.0,      0.75, 69, 86),     # A4 resolution
    ]

    # == Bars 5-6 (sheet 21-22): E7 turnaround + triplet ==
    # Bar 5 (E7): descending with G# emphasis
    n += [
        (16 + SW,   0.33, 76, 82),     # E5
        (17.0,      0.33, 74, 80),     # D5
        (17 + SW,   0.33, 72, 78),     # C5
        (18.0,      0.33, 71, 82),     # B4
        (18 + SW,   0.33, 68, 86),     # G#4
        (19.0,      0.50, 69, 88),     # A4
    ]
    # Bar 6: TRIPLET figure (marked "3" on sheet) + G# resolution
    n += [
        (20.0,          0.28, 68, 80),  # G#4 ┐
        (20 + TRIP,     0.28, 72, 78),  # C5  │ triplet
        (20 + 2 * TRIP, 0.28, 71, 76),  # B4  ┘
        (21.0,          0.33, 69, 82),  # A4
        (21 + SW,       0.33, 68, 78),  # G#4
        (22.0,          0.75, 69, 86),  # A4 resolution
    ]

    # == Bars 7-8: chord stab + rest ==
    n += [
        (24.0,      0.55, 76, 92),     # E5
        (24.04,     0.55, 72, 87),     # C5
        (24.08,     0.55, 69, 82),     # A4
    ]

    # == Bars 9-12: running eighth note variation 2 ==
    # Bar 9 (Am): syncopated pickup ascending
    n += [
        (32 + SW,   0.33, 72, 80),     # C5
        (33.0,      0.33, 76, 86),     # E5
        (33 + SW,   0.33, 74, 82),     # D5
        (34.0,      0.33, 72, 80),     # C5
        (34 + SW,   0.33, 71, 78),     # B4
        (35.0,      0.50, 69, 82),     # A4
    ]
    # Bar 10 (Dm): high F5 descending run
    n += [
        (36.0,      0.33, 77, 82),     # F5
        (36 + SW,   0.33, 76, 80),     # E5
        (37.0,      0.33, 74, 78),     # D5
        (37 + SW,   0.33, 72, 82),     # C5
        (38.0,      0.33, 71, 80),     # B4
        (38 + SW,   0.50, 69, 82),     # A4
    ]
    # Bar 11 (Am): arpeggio with F#5
    n += [
        (40 + SW,   0.33, 69, 78),     # A4
        (41.0,      0.33, 72, 82),     # C5
        (41 + SW,   0.33, 76, 86),     # E5
        (42.0,      0.33, 78, 88),     # F#5
        (42 + SW,   0.33, 76, 86),     # E5
        (43.0,      0.50, 72, 82),     # C5
    ]
    # Bar 12 (Dm): winding down
    n += [
        (44.0,      0.33, 74, 82),     # D5
        (44 + SW,   0.33, 72, 80),     # C5
        (45.0,      0.33, 71, 78),     # B4
        (45 + SW,   0.50, 69, 82),     # A4
    ]

    # == Bars 13-14: return to HEAD 1 arpeggio style (callback) ==
    n += [
        (48.0,      0.95, 69, 90),     # A4 quarter
        (49.0,      0.45, 72, 85),     # C5 eighth
        (49 + SW,   1.35, 76, 95),     # E5 chord
        (49 + SW + 0.06, 1.28, 72, 78),  # C5 chord bottom
    ]
    # Bar 14 (Dm): ornamental turn
    n += [
        (52.0,      0.40, 74, 82),     # D5
        (52 + SW,   0.28, 72, 78),     # C5
        (53.0,      0.07, 76, 72),     # E5 grace
        (53.07,     0.07, 74, 68),     # D5 grace
        (53.14,     0.07, 72, 65),     # C5 grace
        (53.21,     0.07, 71, 60),     # B4 grace
        (53.30,     0.55, 69, 85),     # A4 landing
    ]

    # == Bars 15-16: G# chromatic ending ==
    n += [
        (56.0,      0.33, 76, 88),     # E5
        (56 + SW,   0.33, 74, 85),     # D5
        (57.0,      0.33, 72, 82),     # C5
        (57 + SW,   0.33, 71, 80),     # B4
        (58.0,      0.33, 68, 86),     # G#4 chromatic
        (58 + SW,   0.75, 69, 90),     # A4 resolution
        # Bar 16: pickup into solos
        (60 + SW,   0.33, 72, 80),     # C5
        (61.0,      0.33, 74, 82),     # D5
        (61 + SW,   0.33, 76, 85),     # E5
        (62.0,      0.70, 74, 82),     # D5
    ]

    return n


# ═══════════════════════════════════════════════════════════
#  HEAD OUT - Fortissimo climax (combining both styles)
# ═══════════════════════════════════════════════════════════

def build_head_out():
    """HEAD OUT: starts with HEAD 1 arpeggios ff, then switches to
    HEAD 2 running eighths for bars 9-12, climactic ending."""
    n = []

    # Bars 1-6: HEAD 1 arpeggio style, fortissimo
    def am_ff(b):
        n.append((b,               0.95, 69, 105))
        n.append((b + 1,           0.45, 72, 98))
        n.append((b + 1 + SW,      1.35, 76, 110))
        n.append((b + 1 + SW + .06, 1.28, 72, 92))

    def dm_ff(b):
        n.append((b,          0.40, 74, 98))
        n.append((b + SW,     0.28, 72, 92))
        n.append((b + 1.0,    0.07, 76, 88))
        n.append((b + 1.07,   0.07, 74, 84))
        n.append((b + 1.14,   0.07, 72, 80))
        n.append((b + 1.21,   0.07, 71, 76))
        n.append((b + 1.30,   0.60, 69, 100))

    am_ff(0);  dm_ff(4)
    am_ff(8);  dm_ff(12)
    am_ff(16); dm_ff(20)

    # Bars 7-8: stab + ascending energy run
    n += [
        (24.0,      0.55, 76, 108),   # E5 stab
        (24.04,     0.55, 72, 103),   # C5
        (24.08,     0.55, 69, 98),    # A4
        # Bar 8: ascending run building energy
        (28.0,      0.28, 69, 95),    # A4
        (28 + SW,   0.28, 71, 97),    # B4
        (29.0,      0.28, 72, 100),   # C5
        (29 + SW,   0.28, 74, 102),   # D5
        (30.0,      0.28, 76, 105),   # E5
        (30 + SW,   0.40, 78, 103),   # F#5 (reaching high!)
        (31.0,      0.75, 76, 108),   # E5 sustain
    ]

    # Bars 9-12: HEAD 2 running eighth style, fortissimo
    # Bar 9: pickup ascending
    n += [
        (32 + SW,   0.33, 72, 98),    # C5
        (33.0,      0.33, 76, 102),   # E5
        (33 + SW,   0.33, 78, 105),   # F#5
        (34.0,      0.33, 76, 102),   # E5
        (34 + SW,   0.33, 74, 98),    # D5
        (35.0,      0.50, 72, 100),   # C5
    ]
    # Bar 10: descending with G#
    n += [
        (36.0,      0.33, 74, 100),   # D5
        (36 + SW,   0.33, 72, 98),    # C5
        (37.0,      0.33, 71, 96),    # B4
        (37 + SW,   0.33, 68, 100),   # G#4
        (38.0,      0.75, 69, 105),   # A4
    ]
    # Bar 11: big ascending run
    n += [
        (40 + SW,   0.33, 69, 98),    # A4
        (41.0,      0.33, 72, 100),   # C5
        (41 + SW,   0.33, 76, 103),   # E5
        (42.0,      0.33, 78, 105),   # F#5
        (42 + SW,   0.33, 80, 108),   # G#5 (highest note!)
        (43.0,      0.50, 81, 110),   # A5 (climax!)
    ]
    # Bar 12: powerful descent
    n += [
        (44.0,      0.33, 76, 105),   # E5
        (44 + SW,   0.33, 74, 102),   # D5
        (45.0,      0.33, 72, 100),   # C5
        (45 + SW,   0.50, 69, 105),   # A4
    ]

    # Bars 13-14: massive arpeggio statement
    n += [
        (48.0,      0.95, 69, 110),   # A4 quarter ff
        (49.0,      0.45, 72, 105),   # C5
        (49 + SW,   1.35, 76, 115),   # E5 chord
        (49 + SW + .06, 1.28, 72, 100),  # C5
    ]
    n += [
        (52.0,      0.40, 74, 105),   # D5
        (52 + SW,   0.28, 72, 100),   # C5
        (53.0,      0.07, 76, 92),
        (53.07,     0.07, 74, 88),
        (53.14,     0.07, 72, 84),
        (53.21,     0.07, 71, 80),
        (53.30,     0.60, 69, 108),   # A4 landing fortissimo
    ]

    # Bars 15-16: dramatic descending ending
    n += [
        (56.0,      0.33, 76, 110),   # E5
        (56 + SW,   0.33, 74, 107),   # D5
        (57.0,      0.33, 72, 110),   # C5
        (57 + SW,   0.33, 71, 107),   # B4
        (58.0,      0.33, 68, 112),   # G#4 (chromatic)
        (59.0,      2.5,  69, 115),   # A4 LONG final sustain
    ]

    return n


HEAD1    = build_head1()
HEAD2    = build_head2()
HEAD_OUT = build_head_out()


# ═══════════════════════════════════════════════════════════
#  PIANO PARTS
# ═══════════════════════════════════════════════════════════
# Am6: A3(57)+F#4(66)    Dm6: D3(50)+B3(59)    E7: E3(52)+D4(62)
CHORDS = {
    0:  [57, 66],  1:  [50, 59],   2:  [57, 66],  3:  [50, 59],
    4:  [57, 66],  5:  [50, 59],   6:  [57, 66],  7:  [57, 66],
    8:  [57, 66],  9:  [50, 59],  10:  [57, 66],  11: [50, 59],
    12: [57, 66],  13: [50, 59],  14: [57, 66],  15: [57, 66],
}


def shells_2_4(vel=60):
    """Shell voicings on beats 2 & 4."""
    out = []
    for bar, notes in CHORDS.items():
        for bib in (1, 3):
            b = bar * BPB + bib
            for note in notes:
                out.append((b, 0.28, note, vel))
    return out


def comp_charleston(vel=55):
    """Charleston rhythm: 1, swung-and-of-2, 4."""
    out = []
    for bar, notes in CHORDS.items():
        for bib in (0.0, 1 + SW, 3.0):
            b = bar * BPB + bib
            dur = 0.22 if abs(bib - (1 + SW)) < 0.01 else 0.28
            for note in notes:
                out.append((b, dur, note, vel))
    return out


def comp_swung_offbeats(vel=52):
    """Comping on swung upbeats of 1 & 3."""
    out = []
    for bar, notes in CHORDS.items():
        for bib in (SW, 2 + SW):
            b = bar * BPB + bib
            for note in notes:
                out.append((b, 0.22, note, vel))
    return out


# ═══════════════════════════════════════════════════════════
#  DRUMS (same as before - swing ride + varied sections)
# ═══════════════════════════════════════════════════════════
# 35=BD  38=Snare  44=PedalHH  51=Ride  49=Crash  53=RideBell

def make_drums(start_beat, end_beat, style):
    """Build drum pattern in BEATS.
    Styles: gentle, swing, cooking, peak, simmer, burning"""
    h = []
    num_bars = int((end_beat - start_beat) / BPB)

    for i in range(int(end_beat - start_beat)):
        beat = start_beat + i
        bib = i % BPB
        bar = i // BPB
        is_4bar = (bar % 4 == 3) and (bib == 3)
        is_8bar = (bar % 8 == 7) and (bib == 3)
        is_end  = (bar == num_bars - 1) and (bib == 3)
        progress = bar / max(num_bars - 1, 1)

        # ─── RIDE ─────────────────────────────
        if style == 'gentle':
            rv = 48 if bib in (0, 2) else 55
            h.append((beat, 51, rv))
        elif style == 'swing':
            rv = 58 if bib in (0, 2) else 66
            h.append((beat, 51, rv))
            if bib in (1, 3):
                h.append((beat + SW, 51, 40))
        elif style in ('cooking', 'peak'):
            base = 62 if style == 'cooking' else 70
            rv = base if bib in (0, 2) else base + 8
            h.append((beat, 51, rv))
            if bib in (1, 3):
                h.append((beat + SW, 51, base - 18))
            if bar % 4 == 0 and bib == 0:
                h.append((beat, 53, base - 5))
        elif style == 'simmer':
            rv = 52 if bib in (0, 2) else 58
            h.append((beat, 51, rv))
            if bib == 3:
                h.append((beat + SW, 51, 35))
        elif style == 'burning':
            base = int(62 + progress * 28)
            rv = min(base + (8 if bib in (1, 3) else 0), 110)
            h.append((beat, 51, rv))
            if bib in (1, 3):
                h.append((beat + SW, 51, min(base - 15, 62)))

        # ─── HI-HAT: 2 & 4 ───────────────────
        if bib in (1, 3):
            hh_v = {
                'gentle': 62, 'swing': 72, 'cooking': 78,
                'peak': 85, 'simmer': 68,
                'burning': min(int(72 + progress * 23), 100),
            }[style]
            h.append((beat, 44, hh_v))

        # ─── BASS DRUM ───────────────────────
        if style == 'gentle':
            if bib == 0:
                h.append((beat, 35, 25))
        elif style == 'swing':
            if bib == 0:
                h.append((beat, 35, 33))
            elif bib == 2 and bar % 2 == 0:
                h.append((beat, 35, 22))
        elif style in ('cooking', 'peak'):
            kick = 42 if style == 'cooking' else 52
            if bib == 0:
                h.append((beat, 35, kick))
            elif bib == 2:
                h.append((beat, 35, kick - 12))
            if bar % 3 == 1 and bib == 3:
                h.append((beat + SW, 35, 22))
        elif style == 'simmer':
            if bib == 0:
                h.append((beat, 35, 32))
        elif style == 'burning':
            kv = min(int(40 + progress * 32), 78)
            if bib == 0:
                h.append((beat, 35, kv))
            elif bib == 2:
                h.append((beat, 35, max(kv - 12, 25)))

        # ─── SNARE ───────────────────────────
        if style == 'gentle':
            if bar % 4 == 2 and bib == 2:
                h.append((beat + SW, 38, 18))
        elif style == 'swing':
            if bib in (0, 2) and bar % 2 == 0:
                h.append((beat + SW, 38, 22))
        elif style in ('cooking', 'peak'):
            accent = 48 if style == 'cooking' else 60
            if bib in (1, 3):
                h.append((beat, 38, accent))
            if bib in (0, 2):
                h.append((beat + SW, 38, 25))
        elif style == 'simmer':
            if bib in (1, 3) and bar % 2 == 0:
                h.append((beat, 38, 38))
            if bib == 0:
                h.append((beat + SW, 38, 18))
        elif style == 'burning':
            sv = min(int(50 + progress * 48), 108)
            if bib in (1, 3):
                h.append((beat, 38, sv))
            if bib in (0, 2):
                h.append((beat + SW, 38, 25))

        # ─── FILLS ───────────────────────────
        if style in ('cooking', 'peak', 'burning'):
            if is_4bar and not is_8bar:
                h.append((beat + 0.33, 38, 55))
                h.append((beat + SW, 38, 62))
            elif is_8bar and not is_end:
                h.append((beat - 1, 38, 50))
                h.append((beat - 1 + SW, 38, 55))
                h.append((beat, 38, 65))
                h.append((beat + 0.33, 38, 60))
                h.append((beat + SW, 38, 72))
            elif is_end:
                h.append((beat - 1, 38, 58))
                h.append((beat - 1 + 0.33, 38, 62))
                h.append((beat - 1 + SW, 38, 68))
                h.append((beat, 38, 75))
                h.append((beat + 0.33, 38, 80))
                h.append((beat + SW, 38, 88))
                h.append((beat + 1.0, 49, 105))
        elif style == 'swing' and is_end:
            h.append((beat, 38, 48))
            h.append((beat + SW, 38, 55))

    return h


# ═══════════════════════════════════════════════════════════
#  ASSEMBLE TRACKS
# ═══════════════════════════════════════════════════════════

new_tracks = []
for track in mid.tracks:
    name = None
    for msg in track:
        if msg.type == "track_name":
            name = msg.name
            break

    # ── Tempo track ──────────────────────────────
    if name == "Minor Swing":
        t = mido.MidiTrack()
        for msg in track:
            if msg.type == 'set_tempo':
                t.append(mido.MetaMessage('set_tempo',
                    tempo=mido.bpm2tempo(TARGET_BPM), time=msg.time))
            else:
                t.append(msg)
        new_tracks.append(t)

    # ── Saxophone ────────────────────────────────
    elif name == "Saxophone":
        ev = [
            (0, mido.MetaMessage("track_name", name="Saxophone")),
            (0, mido.Message("program_change", channel=3, program=65)),
        ]

        def add_notes(notes, chorus_off, ch=3):
            for b, d, n, v in notes:
                t0 = b2t(chorus_off + b)
                t1 = b2t(chorus_off + b + d)
                if t0 < max_tick:
                    ev.append((t0, mido.Message(
                        "note_on", channel=ch, note=n, velocity=v)))
                    ev.append((t1, mido.Message(
                        "note_off", channel=ch, note=n, velocity=0)))

        # C1: HEAD 1 (arpeggio phrases)
        add_notes(HEAD1, C[0])

        # C2: HEAD 2 (running eighth notes - DIFFERENT melody!)
        add_notes(HEAD2, C[1])

        # C3-C6: sax lays out

        # C7: HEAD OUT (fortissimo climax)
        add_notes(HEAD_OUT, C[6])

        ev.append((max_tick, mido.MetaMessage('end_of_track')))
        new_tracks.append(events_to_track(ev))

    # ── Piano ────────────────────────────────────
    elif name == "Piano":
        ev = [
            (0, mido.MetaMessage("track_name", name="Piano")),
            (0, mido.Message("program_change", channel=0, program=0)),
        ]

        def add_pno(notes, chorus_off, nudge=0):
            for b, d, n, v in notes:
                t0 = b2t(chorus_off + b + nudge)
                t1 = b2t(chorus_off + b + d + nudge)
                if t0 < max_tick:
                    ev.append((t0, mido.Message(
                        "note_on", channel=0, note=n, velocity=v)))
                    ev.append((t1, mido.Message(
                        "note_off", channel=0, note=n, velocity=0)))

        # C1 HEAD 1: shell voicings only (sax states melody alone)
        add_pno(shells_2_4(58), C[0])

        # C2 HEAD 2: piano doubles the running eighth note melody + shells
        pno_head2 = [(b, d, n, max(v - 12, 40)) for b, d, n, v in HEAD2]
        add_pno(pno_head2, C[1], nudge=0.02)
        add_pno(shells_2_4(60), C[1])

        # C3 Piano solo 1: charleston comping
        add_pno(comp_charleston(60), C[2])

        # C4 Piano solo 2: peak energy comping
        add_pno(comp_charleston(65), C[3])
        add_pno(comp_swung_offbeats(48), C[3])

        # C5 Sax solo 1: sparse shells
        add_pno(shells_2_4(48), C[4])

        # C6 Sax solo 2: charleston rebuild
        add_pno(comp_charleston(55), C[5])

        # C7 HEAD OUT: piano doubles fortissimo melody + shells
        pno_out = [(b, d, n, max(v - 8, 40)) for b, d, n, v in HEAD_OUT]
        add_pno(pno_out, C[6], nudge=0.02)
        add_pno(shells_2_4(68), C[6])

        ev.append((max_tick, mido.MetaMessage('end_of_track')))
        new_tracks.append(events_to_track(ev))

    # ── Drums ────────────────────────────────────
    elif name == "Drums":
        ev = [
            (0, mido.MetaMessage("track_name", name="Drums")),
        ]

        all_hits = (
            make_drums(C[0], C[0] + BPC, 'gentle')  +
            make_drums(C[1], C[1] + BPC, 'swing')   +
            make_drums(C[2], C[2] + BPC, 'cooking')  +
            make_drums(C[3], C[3] + BPC, 'peak')     +
            make_drums(C[4], C[4] + BPC, 'simmer')   +
            make_drums(C[5], C[5] + BPC, 'cooking')  +
            make_drums(C[6], C[6] + BPC, 'burning')
        )

        for beat, note, vel in all_hits:
            t = b2t(beat)
            if t < max_tick:
                ev.append((t, mido.Message(
                    "note_on", channel=9, note=note, velocity=vel)))
                ev.append((t + 48, mido.Message(
                    "note_off", channel=9, note=note, velocity=0)))

        ev.append((max_tick, mido.MetaMessage('end_of_track')))
        new_tracks.append(events_to_track(ev))

    # ── Pass through: Guitar, Bass, Click ────────
    else:
        new_tracks.append(track)


mid.tracks = new_tracks
mid.save(dst)

# ── Verify ───────────────────────────────────────────────
out = mido.MidiFile(dst)
print(f"Saved {dst}")
for i, t in enumerate(out.tracks):
    nm = ""
    nn = sum(1 for m in t if m.type == "note_on"
             and getattr(m, 'velocity', 0) > 0)
    for m in t:
        if m.type == "track_name":
            nm = m.name
    print(f"  Track {i}: {nm:12s}  notes={nn}")

for m in out.tracks[0]:
    if m.type == 'set_tempo':
        print(f"\nTempo: {mido.tempo2bpm(m.tempo):.0f} BPM  |  Swing: {SW:.3f}")
        break

print(f"\nArrangement:")
print(f"  C1: HEAD 1    Am arpeggio phrases (sheet bars 1-16)")
print(f"  C2: HEAD 2    Running eighths, G#/F#, E7, triplets (bars 17-32)")
print(f"  C3-4: PIANO SOLOS  (charleston/offbeat comping)")
print(f"  C5-6: SAX SOLOS    (sparse shells -> charleston)")
print(f"  C7: HEAD OUT  ff arpeggios bars 1-8, running eighths 9-12, climax")
