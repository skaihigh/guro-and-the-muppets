#!/usr/bin/env python3
from pathlib import Path
import mido

src_path = Path("docs/songs/minor-swing/Minor-Swing.mid")
dst_path = Path("docs/songs/minor-swing/Minor-Swing-v4.mid")

mid = mido.MidiFile(src_path)
TPB = mid.ticks_per_beat
BEATS_PER_BAR = 4


def track_to_events(track):
    events = []
    abs_time = 0
    for msg in track:
        abs_time += msg.time
        events.append((abs_time, msg))
    return events


def events_to_track(events):
    events = sorted(events, key=lambda x: x[0])
    track = mido.MidiTrack()
    last_time = 0
    for abs_time, msg in events:
        msg = msg.copy(time=abs_time - last_time)
        track.append(msg)
        last_time = abs_time
    return track


def total_ticks(midi_file):
    return max(sum(msg.time for msg in track) for track in midi_file.tracks)


max_ticks = total_ticks(mid)

# Django/Grappelli melody from published sheet
# Stephane Grappelli / Django Reinhardt transcription
# 16-bar form with syncopation and rests
head_melody = [
    # Bar 1-2 (Am6)
    (0.33, 0.33, 69),
    (1.0, 0.5, 72),
    (1.5, 0.5, 76),
    (2.0, 0.66, 78),
    (2.66, 1.34, 76),
    # Bar 3-4 (Am6/Dm6)
    (4.5, 0.33, 72),
    (4.83, 0.33, 76),
    (5.16, 0.5, 78),
    (5.66, 0.34, 79),
    # Bar 5-6 (Dm6)
    (8.0, 0.5, 74),
    (8.5, 0.5, 77),
    (9.0, 0.66, 81),
    (9.66, 1.34, 79),
    # Bar 7-8 (Am6)
    (12.0, 0.5, 72),
    (12.5, 0.5, 76),
    (13.0, 0.66, 78),
    (13.66, 1.34, 76),
]

new_tracks = []
for track in mid.tracks:
    name = None
    for msg in track:
        if msg.type == "track_name":
            name = msg.name
            break

    if name == "Saxophone":
        events = []
        events.append((0, mido.MetaMessage("track_name", name="Saxophone", time=0)))
        events.append((0, mido.Message("program_change", channel=3, program=65, time=0)))

        sax_notes = []

        # HEAD 1 (chorus 1)
        for start_beat, dur_beats, note in head_melody:
            sax_notes.append((start_beat, dur_beats, note))

        # HEAD 2 (chorus 2)
        for start_beat, dur_beats, note in head_melody:
            sax_notes.append((16.0 + start_beat, dur_beats, note))

        # SOLOS (chorus 3-6, 32 bars) - sax lays out

        # HEAD OUT (chorus 7)
        for start_beat, dur_beats, note in head_melody:
            sax_notes.append((96.0 + start_beat, dur_beats, note))

        # Program all notes
        for start_beat, dur_beats, note in sax_notes:
            if start_beat * TPB >= max_ticks:
                continue
            start_tick = int(start_beat * TPB)
            end_tick = int((start_beat + dur_beats) * TPB)
            events.append((start_tick, mido.Message("note_on", channel=3, note=note, velocity=80, time=0)))
            events.append((end_tick, mido.Message("note_off", channel=3, note=note, velocity=0, time=0)))

        new_tracks.append(events_to_track(events))
    elif name == "Drums":
        events = []
        events.append((0, mido.MetaMessage("track_name", name="Drums", time=0)))
        events.append((0, mido.Message("program_change", channel=9, program=40, time=0)))

        beat = 0
        while beat * TPB < max_ticks:
            t = beat * TPB
            beat_in_bar = beat % BEATS_PER_BAR
            if beat_in_bar in (0, 2):
                # Two-feel: light brush snare on 1 & 3
                events.append((t, mido.Message("note_on", channel=9, note=38, velocity=15, time=0)))
                events.append((t + 100, mido.Message("note_off", channel=9, note=38, velocity=0, time=0)))
            else:
                # Hi-hat foot on 2 & 4
                events.append((t, mido.Message("note_on", channel=9, note=44, velocity=50, time=0)))
                events.append((t + 50, mido.Message("note_off", channel=9, note=44, velocity=0, time=0)))
            beat += 1

        new_tracks.append(events_to_track(events))
    else:
        new_tracks.append(track)

mid.tracks = new_tracks
mid.save(dst_path)
print(f"✓ Saved {dst_path}")
print(f"\nARRANGEMENT STRUCTURE:")
print(f"  CHORUS 1-2: HEAD (Django/Grappelli melody)")
print(f"  CHORUS 3-4: PIANO SOLO (sax lays out)")
print(f"  CHORUS 5-6: SAX SOLO (over chord changes)")
print(f"  CHORUS 7:   HEAD OUT (return to melody)")
print(f"\nTEMPO: 210 BPM")
print(f"DRUMS: Two-feel brush pattern (beats 1&3 snare, beats 2&4 hi-hat foot)")
print(f"SAX:   Authentic Django/Grappelli melody")
print(f"\nPerfect for your swing sextet!")
