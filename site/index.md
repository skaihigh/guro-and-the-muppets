---
layout: base.njk
title: Home
---

<div class="hero">
  <h1>Guro and the Muppets</h1>
  <p>Swing jazz arrangements of Norwegian classics, with detailed musical documentation for each instrument.</p>
</div>

## Arrangements

Complete swing jazz arrangements with chord progressions, voicings, walking bass lines, and rhythm patterns for the full band.

<div class="songs-preview">
{% for song in songs %}
  <div class="song-card">
    <h3><a href="{{ baseUrl }}/songs/{{ song.slug }}/">{{ song.title }}</a></h3>
    <div class="meta">{{ song.key }} | {{ song.tempo }}</div>
    <p>{{ song.description }}</p>
    <div class="song-links">
      <a href="{{ baseUrl }}/songs/{{ song.slug }}/" class="btn btn-primary">View Arrangement</a>
      <a href="{{ baseUrl }}/songs/{{ song.slug }}/full-score/" class="btn btn-secondary">Full Score</a>
    </div>
  </div>
{% endfor %}
</div>

## Instruments

Our arrangements are scored for a classic swing sextet:

<div class="instruments-overview">
  <a href="{{ baseUrl }}/knowledge/keyboard-piano-swing/" class="instrument">
    <strong>Keyboard/Piano</strong>
    <span>Shell voicings, stride patterns, comping rhythms, fills</span>
  </a>
  <a href="{{ baseUrl }}/knowledge/contrabass-walking-bass/" class="instrument">
    <strong>Contrabass</strong>
    <span>Walking bass lines with chromatic approaches</span>
  </a>
  <a href="{{ baseUrl }}/knowledge/rhythm-guitar-swing/" class="instrument">
    <strong>Rhythm Guitar</strong>
    <span>Freddie Green style shell voicings, four-on-the-floor</span>
  </a>
  <a href="{{ baseUrl }}/knowledge/drums-swing-patterns/" class="instrument">
    <strong>Drums</strong>
    <span>Swing patterns, hi-hat work, fills, breaks</span>
  </a>
  <a href="{{ baseUrl }}/knowledge/saxophone-jazz-melodic/" class="instrument">
    <strong>Saxophone</strong>
    <span>Melody, harmony, transposed for alto/tenor</span>
  </a>
  <a href="{{ baseUrl }}/knowledge/jazz-vocal-styling/" class="instrument">
    <strong>Vocals</strong>
    <span>Lyrics with chord symbols, phrasing suggestions</span>
  </a>
</div>

## Learn More

<div class="index-grid">
  <div class="card">
    <h3><a href="{{ baseUrl }}/knowledge/">Knowledge Base</a></h3>
    <p>Swing era fundamentals, walking bass theory, jazz voicings, and arrangement techniques.</p>
  </div>
  <div class="card">
    <h3><a href="{{ baseUrl }}/agents/">Arrangement Agents</a></h3>
    <p>The specialized AI agents that help create these arrangements.</p>
  </div>
  <div class="card">
    <h3><a href="{{ baseUrl }}/skills/">Skills</a></h3>
    <p>Techniques for transforming songs to swing, generating bass lines, and more.</p>
  </div>
</div>
