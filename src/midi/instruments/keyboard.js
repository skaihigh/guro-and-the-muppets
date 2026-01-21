/**
 * Keyboard Generator
 * Creates piano voicings for swing jazz
 */

const MidiWriter = require('midi-writer-js');
const { noteToMidi, dynamicToVelocity, varyVelocity, calculateSwungTick } = require('../utils');

// General MIDI program number for Acoustic Grand Piano
const PIANO_PROGRAM = 1;
const PIANO_CHANNEL = 1;

/**
 * Shell voicing definitions for common jazz chords
 * Format: [intervals from root in semitones]
 */
const SHELL_VOICINGS = {
  // Major chords
  'maj7': [0, 4, 11],     // root, 3rd, maj7
  'maj9': [0, 4, 11, 14], // root, 3rd, maj7, 9th
  '6': [0, 4, 9],         // root, 3rd, 6th
  'maj': [0, 4, 7],       // root, 3rd, 5th

  // Minor chords
  'm7': [0, 3, 10],       // root, b3, 7th
  'm9': [0, 3, 10, 14],   // root, b3, 7th, 9th
  'm6': [0, 3, 9],        // root, b3, 6th
  'm': [0, 3, 7],         // root, b3, 5th

  // Dominant chords
  '7': [0, 4, 10],        // root, 3rd, b7
  '9': [0, 4, 10, 14],    // root, 3rd, b7, 9th
  '13': [0, 4, 10, 21],   // root, 3rd, b7, 13th
  '7b9': [0, 4, 10, 13],  // root, 3rd, b7, b9
  '7#9': [0, 4, 10, 15],  // root, 3rd, b7, #9

  // Half-diminished
  'm7b5': [0, 3, 6, 10],  // root, b3, b5, b7

  // Diminished
  'dim7': [0, 3, 6, 9],   // root, b3, b5, bb7
  'dim': [0, 3, 6],       // root, b3, b5

  // Sus chords
  'sus4': [0, 5, 7],      // root, 4th, 5th
  '7sus4': [0, 5, 7, 10]  // root, 4th, 5th, b7
};

/**
 * Create a keyboard track
 * @param {Object} options - Track options
 * @returns {MidiWriter.Track} MIDI track
 */
function createKeyboardTrack(options = {}) {
  const track = new MidiWriter.Track();
  track.addTrackName('Piano');
  track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: PIANO_PROGRAM, channel: PIANO_CHANNEL }));
  return track;
}

/**
 * Parse chord name to extract root and quality
 * @param {string} chordName - Chord name like "Em9", "D13", "C#m7b5"
 * @returns {{root: string, quality: string}} Parsed chord
 */
function parseChord(chordName) {
  const match = chordName.match(/^([A-G][#b]?)(.*)$/);
  if (!match) {
    return { root: 'C', quality: 'maj7' };
  }

  let [, root, quality] = match;

  // Normalize quality
  if (!quality) quality = 'maj';

  // Handle common variations
  quality = quality
    .replace(/^M7$/, 'maj7')
    .replace(/^Maj7$/, 'maj7')
    .replace(/^maj$/, 'maj7')
    .replace(/^min/, 'm')
    .replace(/^-/, 'm');

  return { root, quality };
}

/**
 * Get shell voicing for a chord
 * @param {string} chordName - Chord name
 * @param {number} octave - Base octave for voicing
 * @returns {string[]} Array of note names
 */
function getShellVoicing(chordName, octave = 3) {
  const { root, quality } = parseChord(chordName);

  // Find matching voicing
  let voicingIntervals = SHELL_VOICINGS[quality];

  if (!voicingIntervals) {
    // Try to find a partial match
    for (const key of Object.keys(SHELL_VOICINGS)) {
      if (quality.includes(key)) {
        voicingIntervals = SHELL_VOICINGS[key];
        break;
      }
    }
  }

  if (!voicingIntervals) {
    voicingIntervals = SHELL_VOICINGS['maj7']; // Default
  }

  // Convert intervals to notes
  const rootMidi = noteToMidi(`${root}${octave}`);
  return voicingIntervals.map(interval => {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const midiNum = rootMidi + interval;
    const noteName = noteNames[midiNum % 12];
    const noteOctave = Math.floor(midiNum / 12) - 1;
    return `${noteName}${noteOctave}`;
  });
}

/**
 * Generate comping pattern for a chord progression
 * @param {Object[]} chords - Array of chord objects
 * @param {Object} options - Generation options
 * @returns {Object[]} Array of note events
 */
function generateComping(chords, options = {}) {
  const {
    octave = 4,
    velocity = 'mf',
    swing = 'triplet',
    ticksPerBeat = 480,
    pattern = 'quarter' // 'quarter', 'charleston', 'sparse'
  } = options;

  const notes = [];
  let currentTick = 0;

  for (const chord of chords) {
    const beatsInChord = chord.duration || 4;
    const voicing = getShellVoicing(chord.name, octave);

    // Generate comping pattern
    const compBeats = getCompPattern(pattern, beatsInChord);

    for (const beat of compBeats) {
      const tick = calculateSwungTick(0, beat, ticksPerBeat, 4, swing);

      for (const note of voicing) {
        notes.push({
          pitch: note,
          tick: currentTick + tick,
          duration: Math.round(ticksPerBeat * 0.9), // Slightly detached
          velocity: varyVelocity(dynamicToVelocity(velocity), 5),
          channel: PIANO_CHANNEL
        });
      }
    }

    currentTick += beatsInChord * ticksPerBeat;
  }

  return notes;
}

/**
 * Get comping beats for a pattern
 * @param {string} pattern - Pattern type
 * @param {number} beats - Beats in bar
 * @returns {number[]} Array of beat positions
 */
function getCompPattern(pattern, beats) {
  switch (pattern) {
    case 'quarter':
      // Quarter notes, accent on 2 and 4
      return Array.from({ length: beats }, (_, i) => i);

    case 'charleston':
      // Beat 1 and the "and" of 2
      return beats >= 4 ? [0, 1.5] : [0];

    case 'sparse':
      // Just beats 1 and 3
      return beats >= 4 ? [0, 2] : [0];

    case 'two-feel':
      // Half notes
      return beats >= 4 ? [0, 2] : [0];

    default:
      return [0];
  }
}

/**
 * Generate stride piano left hand pattern
 * @param {Object[]} chords - Chord progression
 * @param {Object} options - Options
 * @returns {Object[]} Array of note events
 */
function generateStrideLeftHand(chords, options = {}) {
  const {
    octave = 2,
    velocity = 'mf',
    swing = 'triplet',
    ticksPerBeat = 480
  } = options;

  const notes = [];
  let currentTick = 0;

  for (const chord of chords) {
    const beatsInChord = chord.duration || 4;
    const { root, quality } = parseChord(chord.name);

    // Stride pattern: bass on 1 and 3, chord on 2 and 4
    for (let beat = 0; beat < beatsInChord; beat++) {
      const tick = calculateSwungTick(0, beat, ticksPerBeat, 4, swing);

      if (beat % 2 === 0) {
        // Bass note on 1 and 3
        notes.push({
          pitch: `${root}${octave}`,
          tick: currentTick + tick,
          duration: ticksPerBeat,
          velocity: varyVelocity(dynamicToVelocity(velocity), 5),
          channel: PIANO_CHANNEL
        });
      } else {
        // Chord voicing on 2 and 4 (in higher octave)
        const voicing = getShellVoicing(chord.name, octave + 2);
        for (const note of voicing) {
          notes.push({
            pitch: note,
            tick: currentTick + tick,
            duration: ticksPerBeat * 0.8,
            velocity: varyVelocity(dynamicToVelocity(velocity), 5),
            channel: PIANO_CHANNEL
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
function addNotesToTrack(track, notes, ticksPerBeat = 480) {
  // Group notes by tick for chords
  const notesByTick = {};
  for (const note of notes) {
    if (!notesByTick[note.tick]) {
      notesByTick[note.tick] = [];
    }
    notesByTick[note.tick].push(note);
  }

  // Sort ticks
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
      channel: PIANO_CHANNEL
    });

    track.addEvent(noteEvent);
    lastTick = tick;
  }
}

module.exports = {
  PIANO_PROGRAM,
  PIANO_CHANNEL,
  SHELL_VOICINGS,
  createKeyboardTrack,
  parseChord,
  getShellVoicing,
  generateComping,
  generateStrideLeftHand,
  addNotesToTrack
};
