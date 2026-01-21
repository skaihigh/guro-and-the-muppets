---
layout: base.njk
title: Knowledge Base
---

<div class="index-page">

# Knowledge Base

Learn about swing jazz theory, instrument techniques, and arrangement principles.

<div class="index-grid">
{% for article in collections.knowledge %}
  <div class="card">
    <h3><a href="{{ article.url }}">{{ article.data.title }}</a></h3>
    {% if article.data.description %}
    <p>{{ article.data.description }}</p>
    {% endif %}
  </div>
{% endfor %}
</div>

## Topics Covered

- **Swing Era Fundamentals** - History, feel, and musical characteristics
- **Instrument Techniques** - Walking bass, jazz voicings, swing drumming
- **Arrangement Principles** - Song transformation, orchestration

</div>
