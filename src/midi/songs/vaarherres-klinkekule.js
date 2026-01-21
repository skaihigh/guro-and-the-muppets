/**
 * Vårherres Klinkekule - Song Definition
 * Swing Jazz Arrangement in E minor
 */

const song = {
  title: "Vårherres Klinkekule",
  composer: "Erik Bye (text) / Finn Luth (melody)",
  arranger: "Guro and the Muppets",
  key: "Em",
  isMinor: true,
  tempo: 135,
  timeSignature: [4, 4],
  swing: 'triplet',

  // Section definitions with chord progressions
  sections: [
    {
      name: 'intro',
      bars: 4,
      dynamics: 'mp',
      chords: [
        { name: 'Em6', duration: 4 },
        { name: 'Am7', duration: 2 },
        { name: 'D7', duration: 2 },
        { name: 'Gmaj7', duration: 4 },
        { name: 'B7', duration: 4 }
      ]
    },
    {
      name: 'verse1',
      bars: 8,
      dynamics: 'mf',
      chords: [
        { name: 'Em9', duration: 4 },
        { name: 'Bm7', duration: 2 },
        { name: 'E7', duration: 2 },
        { name: 'Am9', duration: 4 },
        { name: 'D13', duration: 4 },
        { name: 'Gmaj7', duration: 4 },
        { name: 'G#dim7', duration: 4 },
        { name: 'Am7', duration: 4 },
        { name: 'D7', duration: 4 }
      ]
    },
    {
      name: 'verse2',
      bars: 8,
      dynamics: 'mf',
      chords: [
        { name: 'Gmaj7', duration: 4 },
        { name: 'G#dim7', duration: 4 },
        { name: 'Am7', duration: 2 },
        { name: 'D7', duration: 2 },
        { name: 'Em7', duration: 4 },
        { name: 'C#m7b5', duration: 2 },
        { name: 'F#7', duration: 2 },
        { name: 'Bm7', duration: 4 },
        { name: 'E7', duration: 4 },
        { name: 'B7', duration: 4 }
      ]
    },
    {
      name: 'interlude',
      bars: 4,
      dynamics: 'mf',
      chords: [
        { name: 'Em6', duration: 4 },
        { name: 'Em6', duration: 4 },
        { name: 'Am7', duration: 4 },
        { name: 'D7', duration: 4 }
      ],
      saxFill: true
    },
    {
      name: 'verse3',
      bars: 8,
      dynamics: 'mp',
      chords: [
        { name: 'Em9', duration: 4 },
        { name: 'Bm7', duration: 2 },
        { name: 'E7', duration: 2 },
        { name: 'Am9', duration: 4 },
        { name: 'D13', duration: 4 },
        { name: 'Gmaj7', duration: 4 },
        { name: 'G#dim7', duration: 4 },
        { name: 'Am7', duration: 4 },
        { name: 'D7', duration: 4 }
      ]
    },
    {
      name: 'verse4',
      bars: 8,
      dynamics: 'mf',
      dynamicsEnd: 'f',
      chords: [
        { name: 'Am7', duration: 4 },
        { name: 'Cmaj7', duration: 4 },
        { name: 'Am7', duration: 4 },
        { name: 'Em', duration: 4 },
        { name: 'C#m7b5', duration: 4 },
        { name: 'F#7b9', duration: 4 },
        { name: 'Bm7', duration: 4 },
        { name: 'B7', duration: 4 }
      ]
    },
    {
      name: 'drumBreak',
      bars: 8,
      dynamics: 'pp',
      dynamicsEnd: 'ff',
      drumsOnly: true,
      geneKrupaBreak: true
    },
    {
      name: 'verse5',
      bars: 8,
      dynamics: 'p',
      dynamicsEnd: 'ff',
      chords: [
        { name: 'Em6', duration: 4 },
        { name: 'Am9', duration: 4 },
        { name: 'Em/B', duration: 4 },
        { name: 'C#m7b5', duration: 2 },
        { name: 'F#7', duration: 2 },
        { name: 'B7sus4', duration: 4 },
        { name: 'B7', duration: 4 },
        { name: 'Em6', duration: 4 },
        { name: 'B7', duration: 4 }
      ]
    },
    {
      name: 'outro',
      bars: 4,
      dynamics: 'f',
      dynamicsEnd: 'mp',
      chords: [
        { name: 'Em6', duration: 4 },
        { name: 'Am7', duration: 4 },
        { name: 'Em/B', duration: 4 },
        { name: 'Em6', duration: 4, hold: true }
      ]
    }
  ],

  // Specific walking bass patterns for key chords
  bassPatterns: {
    'Em9': ['E2', 'F#2', 'G2', 'G#2'],
    'Bm7': ['B2', 'C#3', 'D3', 'E3'],
    'Am9': ['A2', 'B2', 'C3', 'C#3'],
    'D13': ['D2', 'E2', 'F#2', 'G2'],
    'Gmaj7': ['G2', 'A2', 'B2', 'C3'],
    'G#dim7': ['G#2', 'A2', 'A#2', 'B2'],
    'Am7': ['A2', 'G2', 'F#2', 'E2'],
    'D7': ['D2', 'E2', 'F#2', 'G2'],
    'Em6': ['E2', 'G2', 'A2', 'B2'],
    'B7': ['B2', 'C#3', 'D3', 'D#3'],
    'C#m7b5': ['C#3', 'B2', 'G2', 'E2'],
    'F#7': ['F#2', 'G#2', 'A2', 'A#2']
  },

  // Intro bass line (specific)
  introBassLine: ['E2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3', 'F#3', 'G2', 'A2', 'B2', 'C#3', 'D3', 'C#3', 'C3', 'B2']
};

/**
 * Get all chords flattened from all sections
 * @returns {Object[]} All chords in order
 */
function getAllChords() {
  const chords = [];
  for (const section of song.sections) {
    if (section.chords) {
      chords.push(...section.chords);
    }
  }
  return chords;
}

/**
 * Get section by name
 * @param {string} name - Section name
 * @returns {Object|undefined} Section object
 */
function getSection(name) {
  return song.sections.find(s => s.name === name);
}

/**
 * Calculate total duration in bars
 * @returns {number} Total bars
 */
function getTotalBars() {
  return song.sections.reduce((sum, section) => sum + section.bars, 0);
}

/**
 * Calculate total duration in ticks
 * @param {number} ticksPerBeat - Resolution
 * @returns {number} Total ticks
 */
function getTotalTicks(ticksPerBeat = 128) {
  const totalBars = getTotalBars();
  return totalBars * 4 * ticksPerBeat; // 4/4 time
}

module.exports = {
  song,
  getAllChords,
  getSection,
  getTotalBars,
  getTotalTicks
};
