/**
 * Note Converter Utility
 * Converts note names (e.g., "C4", "F#3") to MIDI note numbers
 */

const NOTE_TO_SEMITONE = {
  'C': 0, 'C#': 1, 'Db': 1,
  'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'Fb': 4,
  'F': 5, 'E#': 5, 'F#': 6, 'Gb': 6,
  'G': 7, 'G#': 8, 'Ab': 8,
  'A': 9, 'A#': 10, 'Bb': 10,
  'B': 11, 'Cb': 11
};

/**
 * Convert a note name to MIDI note number
 * @param {string} noteName - Note name like "C4", "F#3", "Bb5"
 * @returns {number} MIDI note number (0-127)
 */
function noteToMidi(noteName) {
  if (typeof noteName === 'number') {
    return noteName; // Already a MIDI number
  }

  const match = noteName.match(/^([A-Ga-g][#b]?)(-?\d)$/);
  if (!match) {
    throw new Error(`Invalid note name: ${noteName}`);
  }

  const [, note, octaveStr] = match;
  const noteUpper = note.charAt(0).toUpperCase() + note.slice(1);
  const octave = parseInt(octaveStr, 10);

  const semitone = NOTE_TO_SEMITONE[noteUpper];
  if (semitone === undefined) {
    throw new Error(`Unknown note: ${noteUpper}`);
  }

  // MIDI note number: (octave + 1) * 12 + semitone
  // C4 (middle C) = 60
  return (octave + 1) * 12 + semitone;
}

/**
 * Convert MIDI note number to note name
 * @param {number} midiNumber - MIDI note number (0-127)
 * @returns {string} Note name like "C4"
 */
function midiToNote(midiNumber) {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midiNumber / 12) - 1;
  const note = noteNames[midiNumber % 12];
  return `${note}${octave}`;
}

/**
 * Transpose a note by a number of semitones
 * @param {string} noteName - Original note name
 * @param {number} semitones - Number of semitones to transpose (positive = up, negative = down)
 * @returns {string} Transposed note name
 */
function transpose(noteName, semitones) {
  const midiNumber = noteToMidi(noteName);
  return midiToNote(midiNumber + semitones);
}

/**
 * Get the octave of a note
 * @param {string} noteName - Note name like "C4"
 * @returns {number} Octave number
 */
function getOctave(noteName) {
  const match = noteName.match(/(-?\d)$/);
  return match ? parseInt(match[1], 10) : 4;
}

/**
 * Normalize a note name to standard format
 * @param {string} noteName - Note name (may use flats)
 * @returns {string} Normalized note name using sharps
 */
function normalizeNote(noteName) {
  const midi = noteToMidi(noteName);
  return midiToNote(midi);
}

module.exports = {
  noteToMidi,
  midiToNote,
  transpose,
  getOctave,
  normalizeNote,
  NOTE_TO_SEMITONE
};
