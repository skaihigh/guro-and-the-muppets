---
layout: base.njk
title: Songs
---

<div class="index-page">

# Our Arrangements

All songs are arranged in authentic swing jazz style, perfect for lindy hop dancing at 130-140 BPM.

<div class="songs-preview">
{% for song in songs %}
  <div class="song-card">
    <h3><a href="/songs/{{ song.slug }}/">{{ song.title }}</a></h3>
    <div class="meta">
      <strong>Key:</strong> {{ song.key }}<br>
      <strong>Tempo:</strong> {{ song.tempo }}<br>
      <strong>Original:</strong> {{ song.original }}
    </div>
    <p>{{ song.description }}</p>
    <div style="margin-top: 1rem;">
      <a href="/songs/{{ song.slug }}/" class="btn btn-primary">View Arrangement</a>
    </div>
  </div>
{% endfor %}
</div>

## What's Included

Each song package contains:

| Component | Description |
|-----------|-------------|
| Full Band MIDI | Complete arrangement with all instruments |
| Individual MIDIs | Separate tracks for each instrument |
| Sheet Music | Detailed notation in markdown format |
| Download Package | ZIP file with everything included |

## Instruments

Our arrangements are scored for a classic swing sextet:

- **Keyboard/Piano** - Comping, voicings, and fills
- **Contrabass** - Walking bass lines
- **Rhythm Guitar** - Shell voicings and strumming
- **Drums** - Swing patterns and fills
- **Saxophone** - Melody and harmonies (transposed for alto/tenor)
- **Vocals** - Lyrics with chord symbols

</div>
