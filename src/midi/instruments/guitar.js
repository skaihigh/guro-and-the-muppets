/**
 * Guitar Generator
 * Creates rhythm guitar patterns in Freddie Green style
 */

const MidiWriter = require('midi-writer-js');
const { noteToMidi, dynamicToVelocity, varyVelocity, calculateSwungTick } = require('../utils');

// General MIDI program number for Steel Acoustic Guitar
const GUITAR_PROGRAM = 26;
const GUITAR_CHANNEL = 3;

/**
 * Simple 3-4 note voicings for rhythm guitar
 * Freddie Green style - minimal notes, maximum groove
 */
const GUITAR_VOICINGS = {
  // Major chords (root on 6th string)
  'maj7': [0, 11, 16],      // root, maj7, 3rd (an octave up)
  'maj9': [0, 11, 14],      // root, maj7, 9th
  '6': [0, 9, 16],          // root, 6th, 3rd (an octave up)
  'maj': [0, 7, 16],        // root, 5th, 3rd (an octave up)

  // Minor chords
  'm7': [0, 10, 15],        // root, b7, b3 (an octave up)
  'm9': [0, 10, 14],        // root, b7, 9th
  'm6': [0, 9, 15],         // root, 6th, b3 (an octave up)
  'm': [0, 7, 15],          // root, 5th, b3 (an octave up)

  // Dominant chords
  '7': [0, 10, 16],         // root, b7, 3rd (an octave up)
  '9': [0, 10, 14],         // root, b7, 9th
  '13': [0, 10, 21],        // root, b7, 13th
  '7b9': [0, 10, 13],       // root, b7, b9
  '7#9': [0, 10, 15],       // root, b7, #9

  // Half-diminished
  'm7b5': [0, 6, 10],       // root, b5, b7

  // Diminished
  'dim7': [0, 6, 9],        // root, b5, bb7
  'dim': [0, 3, 6],         // root, b3, b5
};

/**
 * Create a guitar track
 * @param {Object} options - Track options
 * @returns {MidiWriter.Track} MIDI track
 */
function createGuitarTrack(options = {}) {
  const track = new MidiWriter.Track();
  track.addTrackName('Rhythm Guitar');
  track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: GUITAR_PROGRAM, channel: GUITAR_CHANNEL }));
  return track;
}

/**
 * Parse chord name to extract root and quality
 * @param {string} chordName - Chord name
 * @returns {{root: string, quality: string}} Parsed chord
 */
function parseChord(chordName) {
  const match = chordName.match(/^([A-G][#b]?)(.*)$/);
  if (!match) {
    return { root: 'C', quality: 'maj7' };
  }

  let [, root, quality] = match;

  if (!quality) quality = 'maj';

  quality = quality
    .replace(/^M7$/, 'maj7')
    .replace(/^Maj7$/, 'maj7')
    .replace(/^maj$/, 'maj7')
    .replace(/^min/, 'm')
    .replace(/^-/, 'm');

  return { root, quality };
}

/**
 * Get guitar voicing for a chord
 * @param {string} chordName - Chord name
 * @param {number} octave - Base octave (guitar sounds an octave lower than written)
 * @returns {string[]} Array of note names
 */
function getGuitarVoicing(chordName, octave = 3) {
  const { root, quality } = parseChord(chordName);

  let voicingIntervals = GUITAR_VOICINGS[quality];

  if (!voicingIntervals) {
    for (const key of Object.keys(GUITAR_VOICINGS)) {
      if (quality.includes(key)) {
        voicingIntervals = GUITAR_VOICINGS[key];
        break;
      }
    }
  }

  if (!voicingIntervals) {
    voicingIntervals = GUITAR_VOICINGS['maj7'];
  }

  const rootMidi = noteToMidi(`${root}${octave}`);
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  return voicingIntervals.map(interval => {
    const midiNum = rootMidi + interval;
    const noteName = noteNames[midiNum % 12];
    const noteOctave = Math.floor(midiNum / 12) - 1;
    return `${noteName}${noteOctave}`;
  });
}

/**
 * Generate rhythm guitar pattern (four on the floor)
 * Freddie Green style - muted "chunk" on 2 and 4
 * @param {Object[]} chords - Chord progression
 * @param {Object} options - Options
 * @returns {Object[]} Array of note events
 */
function generateRhythmGuitar(chords, options = {}) {
  const {
    octave = 3,
    velocity = 'mf',
    swing = 'triplet',
    ticksPerBeat = 128,
    accentOnBackbeat = true
  } = options;

  const notes = [];
  let currentTick = 0;
  const baseVelocity = dynamicToVelocity(velocity);

  for (const chord of chords) {
    const beatsInChord = chord.duration || 4;
    const voicing = getGuitarVoicing(chord.name, octave);

    // Four on the floor - quarter notes
    for (let beat = 0; beat < beatsInChord; beat++) {
      const tick = calculateSwungTick(0, beat, ticksPerBeat, 4, swing);

      // Accent on 2 and 4 (backbeat)
      const isBackbeat = beat === 1 || beat === 3;
      const beatVelocity = isBackbeat && accentOnBackbeat
        ? baseVelocity + 10
        : baseVelocity - 10;

      // Freddie Green style: shorter on backbeats but not too short
      // 70% for backbeats (punchy), 90% for downbeats (fuller sound)
      const duration = isBackbeat
        ? Math.round(ticksPerBeat * 0.7)  // Punchy but not choppy
        : Math.round(ticksPerBeat * 0.9); // Fuller legato feel

      // Add micro-timing humanization (±2% of beat)
      const humanize = Math.round((Math.random() - 0.5) * ticksPerBeat * 0.04);

      for (const note of voicing) {
        notes.push({
          pitch: note,
          tick: currentTick + tick + humanize,
          duration,
          velocity: varyVelocity(beatVelocity, 5),
          channel: GUITAR_CHANNEL
        });
      }
    }

    currentTick += beatsInChord * ticksPerBeat;
  }

  return notes;
}

/**
 * Generate vekselbass-style guitar pattern
 * More sparse - hits on 1 and 3, or just downbeats
 * @param {Object[]} chords - Chord progression
 * @param {Object} options - Options
 * @returns {Object[]} Array of note events
 */
function generateVekselbasStyle(chords, options = {}) {
  const {
    octave = 3,
    velocity = 'mf',
    swing = 'triplet',
    ticksPerBeat = 128
  } = options;

  const notes = [];
  let currentTick = 0;
  const baseVelocity = dynamicToVelocity(velocity);

  for (const chord of chords) {
    const beatsInChord = chord.duration || 4;
    const voicing = getGuitarVoicing(chord.name, octave);

    // Hit on beats 2 and 4 only (matching vekselbass feel)
    const beats = beatsInChord >= 4 ? [1, 3] : [1];

    for (const beat of beats) {
      if (beat < beatsInChord) {
        const tick = calculateSwungTick(0, beat, ticksPerBeat, 4, swing);
        // Add micro-timing humanization (±2% of beat)
        const humanize = Math.round((Math.random() - 0.5) * ticksPerBeat * 0.04);

        for (const note of voicing) {
          notes.push({
            pitch: note,
            tick: currentTick + tick + humanize,
            duration: Math.round(ticksPerBeat * 0.85), // Fuller sound
            velocity: varyVelocity(baseVelocity, 5),
            channel: GUITAR_CHANNEL
          });
        }
      }
    }

    currentTick += beatsInChord * ticksPerBeat;
  }

  return notes;
}

/**
 * Add notes to a MIDI track
 * @param {MidiWriter.Track} track - Target track
 * @param {Object[]} notes - Array of note objects
 * @param {number} ticksPerBeat - Resolution
 */
function addNotesToTrack(track, notes, ticksPerBeat = 128) {
  const notesByTick = {};
  for (const note of notes) {
    if (!notesByTick[note.tick]) {
      notesByTick[note.tick] = [];
    }
    notesByTick[note.tick].push(note);
  }

  const sortedTicks = Object.keys(notesByTick).map(Number).sort((a, b) => a - b);

  let lastTick = 0;

  for (const tick of sortedTicks) {
    const chordNotes = notesByTick[tick];
    const wait = tick - lastTick;

    const pitches = chordNotes.map(n => n.pitch);
    const avgVelocity = Math.round(chordNotes.reduce((sum, n) => sum + n.velocity, 0) / chordNotes.length);
    const duration = chordNotes[0].duration || ticksPerBeat;

    const waitNotation = wait > 0 ? `T${wait}` : '0';

    const noteEvent = new MidiWriter.NoteEvent({
      pitch: pitches,
      duration: `T${duration}`,
      wait: waitNotation,
      velocity: Math.min(127, Math.max(1, avgVelocity)),
      channel: GUITAR_CHANNEL
    });

    track.addEvent(noteEvent);
    lastTick = tick;
  }
}

module.exports = {
  GUITAR_PROGRAM,
  GUITAR_CHANNEL,
  GUITAR_VOICINGS,
  createGuitarTrack,
  parseChord,
  getGuitarVoicing,
  generateRhythmGuitar,
  generateVekselbasStyle,
  addNotesToTrack
};
