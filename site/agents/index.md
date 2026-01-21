---
layout: base.njk
title: Arrangement Agents
---

<div class="index-page">

# Arrangement Agents

Meet the specialized AI agents that help create our swing jazz arrangements.

<div class="index-grid">
{% for agent in collections.agents %}
  <div class="card">
    <h3><a href="{{ agent.url }}">{{ agent.data.title }}</a></h3>
    {% if agent.data.description %}
    <p>{{ agent.data.description }}</p>
    {% endif %}
  </div>
{% endfor %}
</div>

## Our Agent Team

Each agent specializes in a specific aspect of swing jazz arrangement:

- **Music Theory Expert** - Harmonic analysis and reharmonization
- **Swing Era Specialist** - Authentic period styling
- **Instrument Agents** - Bass, keyboard, guitar, drums, saxophone, vocals
- **Arrangement Orchestrator** - Coordinates the full arrangement

</div>
