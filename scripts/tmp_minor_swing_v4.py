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

# Django Reinhardt inspired head - SHORT, SPARSER, SWING FEEL
# Mid range sax, lots of space
# Pattern: [(start_beat, dur_beats, note), ...]
# REPEAT every 16 beats (one chorus)

pattern = [
    # Bar 1 (Am6) - pickup + statement
    (0.0, 0.3, 72),  # C5 - pickup
    (0.5, 0.5, 76),  # E5
    (1.0, 0.8, 78),  # F#5 - SYNCOPATED
    (2.0, 1.5, 76),  # E5 - LONG NOTE (swing feel)
    # beat 4 = REST

    # Bar 2 (Am6) - call
    # Beat 1 = REST
    (4.5, 0.3, 72),  # C5
    (5.0, 1.0, 69),  # A4 - START OF PHRASE
    # beats 3-4 = REST

    # Bar 3 (Dm6) - response
    (8.0, 0.5, 74),  # D5
    (8.5, 0.5, 77),  # F5
    (9.0, 1.0, 81),  # A5
    # beat 4 = REST

    # Bar 4 (Dm6) - continuation
    (12.0, 0.8, 74),  # D5 SYNCOPATED
    (13.0, 1.0, 72),  # C5
    (14.0, 0.5, 69),  # A4
    # beat 4 = REST
]

# Replace sax track
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

        total_beats = max_ticks / TPB
        pattern_len = 16  # One 16-bar form per repeat
        repeats = int(total_beats // pattern_len) + 1

        for r in range(repeats):
            base_beat = r * pattern_len
            for start_beat, dur_beats, note in pattern:
                abs_beat = base_beat + start_beat
                if abs_beat * TPB >= max_ticks:
                    continue
                start_tick = int(abs_beat * TPB)
                end_tick = int((abs_beat + dur_beats) * TPB)
                velocity = 78
                events.append((start_tick, mido.Message("note_on", channel=3, note=note, velocity=velocity, time=0)))
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
                events.append((t, mido.Message("note_on", channel=9, note=38, velocity=18, time=0)))
                events.append((t + 120, mido.Message("note_off", channel=9, note=38, velocity=0, time=0)))
            else:
                events.append((t, mido.Message("note_on", channel=9, note=44, velocity=55, time=0)))
                events.append((t + 60, mido.Message("note_off", channel=9, note=44, velocity=0, time=0)))
            beat += 1

        new_tracks.append(events_to_track(events))
    else:
        new_tracks.append(track)

mid.tracks = new_tracks
mid.save(dst_path)
print(f"Saved {dst_path}")
