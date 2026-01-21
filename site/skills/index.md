---
layout: base.njk
title: Skills
---

<div class="index-page">

# Skills

Techniques and patterns used in our swing jazz arrangements.

<div class="index-grid">
{% for skill in collections.skills %}
  <div class="card">
    <h3><a href="{{ skill.url }}">{{ skill.data.title }}</a></h3>
    {% if skill.data.description %}
    <p>{{ skill.data.description }}</p>
    {% endif %}
  </div>
{% endfor %}
</div>

## Available Skills

- **Transform to Swing** - Convert any song to swing style
- **Transpose for Instrument** - Adjust keys for Bb/Eb instruments
- **Generate Walking Bass** - Create authentic walking bass lines
- **Generate Drum Patterns** - Swing rhythm patterns

</div>
