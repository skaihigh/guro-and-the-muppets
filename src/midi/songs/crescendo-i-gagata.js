/**
 * Crescendo i gågata - Song Definition
 * Swing Jazz Arrangement in G major
 */

const song = {
  title: "Crescendo i gågata",
  composer: "Lillebjørn Nilsen",
  arranger: "Guro and the Muppets",
  key: "G",
  isMinor: false,
  tempo: 145,
  timeSignature: [4, 4],
  swing: 'triplet',

  // Section definitions with chord progressions
  sections: [
    {
      name: 'intro',
      bars: 4,
      dynamics: 'mp',
      chords: [
        { name: 'Gmaj9', duration: 4 },
        { name: 'Am7', duration: 2 },
        { name: 'D7', duration: 2 },
        { name: 'Gmaj9', duration: 4 },
        { name: 'D7#9', duration: 4 }
      ]
    },
    {
      name: 'verse1',
      bars: 8,
      dynamics: 'mf',
      chords: [
        { name: 'Cmaj7', duration: 4 },
        { name: 'Bm7', duration: 2 },
        { name: 'E7', duration: 2 },
        { name: 'Am9', duration: 4 },
        { name: 'D13', duration: 4 },
        { name: 'Em7', duration: 2 },
        { name: 'A7', duration: 2 },
        { name: 'Am7', duration: 2 },
        { name: 'D7', duration: 2 },
        { name: 'Gmaj9', duration: 4 },
        { name: 'G6', duration: 2 },
        { name: 'D7', duration: 2 }
      ]
    },
    {
      name: 'verse2',
      bars: 8,
      dynamics: 'mf',
      chords: [
        { name: 'Cmaj7', duration: 4 },
        { name: 'Bm7', duration: 2 },
        { name: 'E7', duration: 2 },
        { name: 'Am9', duration: 4 },
        { name: 'D13', duration: 4 },
        { name: 'Em7', duration: 2 },
        { name: 'A7', duration: 2 },
        { name: 'Am7', duration: 2 },
        { name: 'D7', duration: 2 },
        { name: 'Gmaj9', duration: 4 },
        { name: 'G6', duration: 2 },
        { name: 'D7', duration: 2 }
      ]
    },
    {
      name: 'chorus1',
      bars: 8,
      dynamics: 'f',
      chords: [
        { name: 'Cmaj7', duration: 2 },
        { name: 'C#dim7', duration: 2 },
        { name: 'Gmaj7', duration: 2 },
        { name: 'G6', duration: 2 },
        { name: 'Cmaj7', duration: 2 },
        { name: 'C#dim7', duration: 2 },
        { name: 'Gmaj7', duration: 2 },
        { name: 'D7', duration: 2 },
        { name: 'Cmaj7', duration: 2 },
        { name: 'C#dim7', duration: 2 },
        { name: 'Gmaj7', duration: 2 },
        { name: 'G6', duration: 2 },
        { name: 'Am7', duration: 2 },
        { name: 'D7', duration: 2 },
        { name: 'Gmaj7', duration: 2 },
        { name: 'D7', duration: 2 }
      ],
      saxMelody: true
    },
    {
      name: 'verse3',
      bars: 8,
      dynamics: 'mf',
      chords: [
        { name: 'Cmaj7', duration: 4 },
        { name: 'Bm7', duration: 2 },
        { name: 'E7', duration: 2 },
        { name: 'Am9', duration: 4 },
        { name: 'D13', duration: 4 },
        { name: 'Em7', duration: 2 },
        { name: 'A7', duration: 2 },
        { name: 'Am7', duration: 2 },
        { name: 'D7', duration: 2 },
        { name: 'Gmaj9', duration: 4 },
        { name: 'G6', duration: 2 },
        { name: 'D7', duration: 2 }
      ]
    },
    {
      name: 'verse4',
      bars: 8,
      dynamics: 'mf',
      chords: [
        { name: 'Cmaj7', duration: 4 },
        { name: 'Bm7', duration: 2 },
        { name: 'E7', duration: 2 },
        { name: 'Am9', duration: 4 },
        { name: 'D13', duration: 4 },
        { name: 'Em7', duration: 2 },
        { name: 'A7', duration: 2 },
        { name: 'Am7', duration: 2 },
        { name: 'D7', duration: 2 },
        { name: 'Gmaj9', duration: 4 },
        { name: 'G6', duration: 2 },
        { name: 'D7', duration: 2 }
      ]
    },
    {
      name: 'chorus2',
      bars: 8,
      dynamics: 'f',
      chords: [
        { name: 'Cmaj7', duration: 2 },
        { name: 'C#dim7', duration: 2 },
        { name: 'Gmaj7', duration: 2 },
        { name: 'G6', duration: 2 },
        { name: 'Cmaj7', duration: 2 },
        { name: 'C#dim7', duration: 2 },
        { name: 'Gmaj7', duration: 2 },
        { name: 'D7', duration: 2 },
        { name: 'Cmaj7', duration: 2 },
        { name: 'C#dim7', duration: 2 },
        { name: 'Gmaj7', duration: 2 },
        { name: 'G6', duration: 2 },
        { name: 'Am7', duration: 2 },
        { name: 'D7', duration: 2 },
        { name: 'Gmaj7', duration: 2 },
        { name: 'D7', duration: 2 }
      ],
      saxMelody: true
    },
    {
      name: 'bridge',
      bars: 12,
      dynamics: 'mp',
      dynamicsEnd: 'f',
      chords: [
        { name: 'Cmaj7', duration: 2 },
        { name: 'C#dim7', duration: 2 },
        { name: 'Gmaj9', duration: 4 },
        { name: 'E7#9', duration: 4 },
        { name: 'Am9', duration: 4 },
        { name: 'D13', duration: 4 },
        { name: 'Cmaj7', duration: 2 },
        { name: 'C#dim7', duration: 2 },
        { name: 'Gmaj9', duration: 4 },
        { name: 'E7#9', duration: 4 },
        { name: 'Am9', duration: 4 },
        { name: 'D9', duration: 4 },
        { name: 'Gmaj7', duration: 4 },
        { name: 'D7', duration: 4 }
      ]
    },
    {
      name: 'verse5',
      bars: 8,
      dynamics: 'ff',
      chords: [
        { name: 'Cmaj7', duration: 4 },
        { name: 'Bm7', duration: 2 },
        { name: 'E7', duration: 2 },
        { name: 'Am9', duration: 4 },
        { name: 'D13', duration: 4 },
        { name: 'Em7', duration: 2 },
        { name: 'A7', duration: 2 },
        { name: 'Am7', duration: 2 },
        { name: 'D7', duration: 2 },
        { name: 'Gmaj9', duration: 4 },
        { name: 'G6', duration: 2 },
        { name: 'D7', duration: 2 }
      ]
    },
    {
      name: 'chorus3',
      bars: 8,
      dynamics: 'ff',
      chords: [
        { name: 'Cmaj7', duration: 2 },
        { name: 'C#dim7', duration: 2 },
        { name: 'Gmaj7', duration: 2 },
        { name: 'G6', duration: 2 },
        { name: 'Cmaj7', duration: 2 },
        { name: 'C#dim7', duration: 2 },
        { name: 'Gmaj7', duration: 2 },
        { name: 'D7', duration: 2 },
        { name: 'Cmaj7', duration: 2 },
        { name: 'C#dim7', duration: 2 },
        { name: 'Gmaj7', duration: 2 },
        { name: 'G6', duration: 2 },
        { name: 'Am7', duration: 2 },
        { name: 'D7', duration: 2 },
        { name: 'Gmaj7', duration: 2 },
        { name: 'D7', duration: 2 }
      ],
      saxMelody: true
    },
    {
      name: 'outro',
      bars: 4,
      dynamics: 'f',
      dynamicsEnd: 'mp',
      chords: [
        { name: 'Gmaj9', duration: 4 },
        { name: 'Am7', duration: 2 },
        { name: 'D7', duration: 2 },
        { name: 'Gmaj7', duration: 4 },
        { name: 'G6', duration: 4, hold: true }
      ]
    }
  ],

  // Specific walking bass patterns
  bassPatterns: {
    'Cmaj7': ['C2', 'D2', 'E2', 'F#2'],
    'Bm7': ['B2', 'C#3', 'D3', 'E3'],
    'E7': ['E2', 'F#2', 'G#2', 'A2'],
    'Am9': ['A2', 'B2', 'C3', 'C#3'],
    'D13': ['D2', 'E2', 'F#2', 'G2'],
    'Em7': ['E2', 'F#2', 'G2', 'G#2'],
    'A7': ['A2', 'B2', 'C#3', 'D3'],
    'Am7': ['A2', 'G2', 'F#2', 'E2'],
    'D7': ['D2', 'E2', 'F#2', 'G2'],
    'Gmaj9': ['G2', 'A2', 'B2', 'D3'],
    'G6': ['G2', 'B2', 'D3', 'E3'],
    'C#dim7': ['C#3', 'E3', 'G3', 'A#3'],
    'Gmaj7': ['G2', 'A2', 'B2', 'C3'],
    'D7#9': ['D2', 'E2', 'F#2', 'G2'],
    'E7#9': ['E2', 'F#2', 'G#2', 'A2'],
    'D9': ['D2', 'E2', 'F#2', 'A2']
  },

  // Chorus bass pattern (rhythm changes style)
  chorusBassLine: ['C2', 'E2', 'C#2', 'E2', 'D2', 'F#2', 'G2', 'B2']
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
