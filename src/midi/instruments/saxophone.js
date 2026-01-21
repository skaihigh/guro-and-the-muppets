/**
 * Saxophone Generator
 * Creates melodic fills and lines for tenor/alto sax
 */

const MidiWriter = require('midi-writer-js');
const { noteToMidi, midiToNote, transpose, dynamicToVelocity, varyVelocity, calculateSwungTick } = require('../utils');

// General MIDI program numbers
const TENOR_SAX_PROGRAM = 67;
const ALTO_SAX_PROGRAM = 66;
const SAX_CHANNEL = 4;

/**
 * Create a saxophone track
 * @param {Object} options - Track options
 * @returns {MidiWriter.Track} MIDI track
 */
function createSaxophoneTrack(options = {}) {
  const { type = 'tenor' } = options;

  const track = new MidiWriter.Track();
  const program = type === 'alto' ? ALTO_SAX_PROGRAM : TENOR_SAX_PROGRAM;

  track.addTrackName(type === 'alto' ? 'Alto Saxophone' : 'Tenor Saxophone');
  track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: program, channel: SAX_CHANNEL }));

  return track;
}

/**
 * Get pentatonic scale for a key
 * @param {string} root - Root note
 * @param {boolean} isMinor - Whether minor pentatonic
 * @param {number} octave - Base octave
 * @returns {string[]} Scale notes
 */
function getPentatonicScale(root, isMinor = false, octave = 4) {
  const rootMidi = noteToMidi(`${root}${octave}`);

  // Minor pentatonic intervals: 0, 3, 5, 7, 10
  // Major pentatonic intervals: 0, 2, 4, 7, 9
  const intervals = isMinor
    ? [0, 3, 5, 7, 10, 12, 15, 17, 19, 22]  // Two octaves
    : [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];

  return intervals.map(interval => midiToNote(rootMidi + interval));
}

/**
 * Generate a melodic fill using pentatonic scale
 * @param {string} key - Key center (e.g., "E", "G")
 * @param {boolean} isMinor - Whether in minor key
 * @param {number} beats - Duration in beats
 * @param {Object} options - Options
 * @returns {Object[]} Array of note events
 */
function generateFill(key, isMinor, beats, options = {}) {
  const {
    octave = 4,
    velocity = 'mf',
    swing = 'triplet',
    ticksPerBeat = 480,
    startTick = 0,
    density = 'medium' // 'sparse', 'medium', 'dense'
  } = options;

  const scale = getPentatonicScale(key, isMinor, octave);
  const notes = [];
  const baseVelocity = dynamicToVelocity(velocity);

  // Determine note count based on density
  let noteCount;
  switch (density) {
    case 'sparse': noteCount = Math.max(2, Math.floor(beats)); break;
    case 'dense': noteCount = beats * 2; break;
    default: noteCount = Math.floor(beats * 1.5);
  }

  // Generate melodic contour
  let currentScaleIndex = Math.floor(scale.length / 2); // Start in middle of range
  let currentBeat = 0;
  const beatIncrement = beats / noteCount;

  for (let i = 0; i < noteCount && currentBeat < beats; i++) {
    // Move up or down in scale (with tendency toward resolution)
    const direction = Math.random() > 0.5 ? 1 : -1;
    const step = Math.random() > 0.7 ? 2 : 1; // Occasional leaps

    currentScaleIndex = Math.max(0, Math.min(scale.length - 1, currentScaleIndex + direction * step));

    const tick = calculateSwungTick(0, currentBeat, ticksPerBeat, 4, swing);
    const duration = Math.round(ticksPerBeat * beatIncrement * 0.9);

    notes.push({
      pitch: scale[currentScaleIndex],
      tick: startTick + tick,
      duration,
      velocity: varyVelocity(baseVelocity, 8),
      channel: SAX_CHANNEL
    });

    currentBeat += beatIncrement;
  }

  return notes;
}

/**
 * Generate long held notes (pads)
 * @param {string[]} notePitches - Notes to play
 * @param {number} beats - Duration
 * @param {Object} options - Options
 * @returns {Object[]} Array of note events
 */
function generateLongTones(notePitches, beats, options = {}) {
  const {
    velocity = 'mp',
    ticksPerBeat = 480,
    startTick = 0
  } = options;

  const baseVelocity = dynamicToVelocity(velocity);

  return notePitches.map(pitch => ({
    pitch,
    tick: startTick,
    duration: beats * ticksPerBeat,
    velocity: varyVelocity(baseVelocity, 5),
    channel: SAX_CHANNEL
  }));
}

/**
 * Generate a simple melodic line from chord tones
 * @param {Object[]} chords - Chord progression
 * @param {Object} options - Options
 * @returns {Object[]} Array of note events
 */
function generateChordToneMelody(chords, options = {}) {
  const {
    octave = 4,
    velocity = 'mf',
    swing = 'triplet',
    ticksPerBeat = 480
  } = options;

  const notes = [];
  let currentTick = 0;
  const baseVelocity = dynamicToVelocity(velocity);

  for (const chord of chords) {
    const beatsInChord = chord.duration || 4;
    const chordTones = getChordTones(chord.name, octave);

    // Pick a chord tone to emphasize
    const targetNote = chordTones[Math.floor(Math.random() * chordTones.length)];

    // Play on beat 1 of the chord
    notes.push({
      pitch: targetNote,
      tick: currentTick,
      duration: Math.round(ticksPerBeat * (beatsInChord - 0.5)),
      velocity: varyVelocity(baseVelocity, 5),
      channel: SAX_CHANNEL
    });

    currentTick += beatsInChord * ticksPerBeat;
  }

  return notes;
}

/**
 * Get chord tones for a chord
 * @param {string} chordName - Chord name
 * @param {number} octave - Octave
 * @returns {string[]} Chord tone notes
 */
function getChordTones(chordName, octave = 4) {
  const match = chordName.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return [`C${octave}`];

  const [, root, quality] = match;
  const rootMidi = noteToMidi(`${root}${octave}`);

  // Basic chord tone intervals
  let intervals;
  if (quality.includes('m') && !quality.includes('maj')) {
    intervals = [0, 3, 7, 10]; // minor 7th
  } else if (quality.includes('dim')) {
    intervals = [0, 3, 6, 9]; // diminished
  } else if (quality.includes('7')) {
    intervals = [0, 4, 7, 10]; // dominant 7th
  } else {
    intervals = [0, 4, 7, 11]; // major 7th
  }

  return intervals.map(interval => midiToNote(rootMidi + interval));
}

/**
 * Transpose notes for transposing instrument
 * @param {Object[]} notes - Note events
 * @param {string} instrument - 'tenor' (Bb) or 'alto' (Eb)
 * @returns {Object[]} Transposed notes
 */
function transposeForInstrument(notes, instrument = 'tenor') {
  // Tenor sax sounds a whole step lower than written (transpose up 2 semitones to get written pitch)
  // Alto sax sounds a major sixth lower than written (transpose up 9 semitones to get written pitch)
  // But for MIDI, we want concert pitch, so no transposition needed
  // This function is for reference when generating written parts

  const semitones = instrument === 'alto' ? 9 : 2;

  return notes.map(note => ({
    ...note,
    writtenPitch: transpose(note.pitch, semitones)
  }));
}

/**
 * Add notes to a MIDI track
 * @param {MidiWriter.Track} track - Target track
 * @param {Object[]} notes - Array of note objects
 * @param {number} ticksPerBeat - Resolution
 */
function addNotesToTrack(track, notes, ticksPerBeat = 480) {
  const sortedNotes = [...notes].sort((a, b) => a.tick - b.tick);

  let lastTick = 0;

  for (const note of sortedNotes) {
    const wait = note.tick - lastTick;

    const waitNotation = wait > 0 ? `T${wait}` : '0';

    const noteEvent = new MidiWriter.NoteEvent({
      pitch: note.pitch,
      duration: `T${note.duration}`,
      wait: waitNotation,
      velocity: Math.min(127, Math.max(1, note.velocity)),
      channel: SAX_CHANNEL
    });

    track.addEvent(noteEvent);
    lastTick = note.tick;
  }
}

module.exports = {
  TENOR_SAX_PROGRAM,
  ALTO_SAX_PROGRAM,
  SAX_CHANNEL,
  createSaxophoneTrack,
  getPentatonicScale,
  generateFill,
  generateLongTones,
  generateChordToneMelody,
  getChordTones,
  transposeForInstrument,
  addNotesToTrack
};
