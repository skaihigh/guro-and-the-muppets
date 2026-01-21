/**
 * Bass Generator
 * Creates walking bass lines and vekselbass patterns
 */

const MidiWriter = require('midi-writer-js');
const { noteToMidi, dynamicToVelocity, varyVelocity, calculateSwungTick } = require('../utils');

// General MIDI program number for Acoustic Bass
const BASS_PROGRAM = 33;
const BASS_CHANNEL = 2;

/**
 * Create a bass track
 * @param {Object} options - Bass track options
 * @returns {MidiWriter.Track} MIDI track
 */
function createBassTrack(options = {}) {
  const track = new MidiWriter.Track();
  track.addTrackName('Acoustic Bass');
  track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: BASS_PROGRAM, channel: BASS_CHANNEL }));
  return track;
}

/**
 * Generate walking bass line for a chord progression
 * @param {Object[]} chords - Array of chord objects with name, duration (in beats), and optional bassNotes
 * @param {Object} options - Generation options
 * @returns {Object[]} Array of note events
 */
function generateWalkingBass(chords, options = {}) {
  const {
    octave = 2,
    velocity = 'mf',
    swing = 'triplet',
    ticksPerBeat = 128
  } = options;

  const notes = [];
  let currentTick = 0;

  for (const chord of chords) {
    const beatsInChord = chord.duration || 4; // Default to 4 beats
    const bassNotes = chord.bassNotes || generateBassNotesForChord(chord.name, beatsInChord, octave);

    for (let i = 0; i < bassNotes.length; i++) {
      const note = bassNotes[i];
      const beat = i; // Quarter notes
      const tick = calculateSwungTick(0, beat, ticksPerBeat, 4, swing);

      notes.push({
        pitch: note,
        tick: currentTick + tick,
        duration: ticksPerBeat, // Quarter note
        velocity: varyVelocity(dynamicToVelocity(velocity), 5),
        channel: BASS_CHANNEL
      });
    }

    currentTick += beatsInChord * ticksPerBeat;
  }

  return notes;
}

/**
 * Generate bass notes for a single chord (walking bass)
 * @param {string} chordName - Chord name (e.g., "Em9", "D7")
 * @param {number} beats - Number of beats
 * @param {number} octave - Base octave
 * @returns {string[]} Array of note names
 */
function generateBassNotesForChord(chordName, beats, octave = 2) {
  // Extract root note from chord name
  const rootMatch = chordName.match(/^([A-G][#b]?)/);
  if (!rootMatch) return [];

  const root = rootMatch[1];
  const rootNote = `${root}${octave}`;

  // Common walking bass patterns based on chord quality
  const patterns = getWalkingPatterns(root, octave, chordName);

  // Select appropriate pattern based on number of beats
  if (beats === 1) return [rootNote];
  if (beats === 2) return patterns.twoBeats;
  if (beats >= 4) return patterns.fourBeats.slice(0, beats);

  return patterns.fourBeats.slice(0, beats);
}

/**
 * Get walking bass patterns for a chord
 * @param {string} root - Root note name (e.g., "E", "Bb")
 * @param {number} octave - Octave number
 * @param {string} chordName - Full chord name for quality detection
 * @returns {Object} Patterns object with different beat counts
 */
function getWalkingPatterns(root, octave, chordName) {
  const isMinor = chordName.includes('m') && !chordName.includes('maj');
  const isDim = chordName.includes('dim');

  // Calculate scale degrees
  const rootNote = `${root}${octave}`;

  // Common intervals for walking bass
  // We'll use simple patterns that work well
  const chromaticApproach = getChromaticApproach(root, octave);

  if (isMinor || isDim) {
    return {
      twoBeats: [rootNote, chromaticApproach.above],
      fourBeats: [
        rootNote,
        getScaleDegree(root, octave, 2),  // 2nd
        getScaleDegree(root, octave, 'b3'), // minor 3rd
        chromaticApproach.below // chromatic approach to next root
      ]
    };
  }

  // Major/dominant chords
  return {
    twoBeats: [rootNote, getScaleDegree(root, octave, 5)],
    fourBeats: [
      rootNote,
      getScaleDegree(root, octave, 2),  // 2nd
      getScaleDegree(root, octave, 3),  // 3rd
      chromaticApproach.above // chromatic approach
    ]
  };
}

/**
 * Get chromatic approach notes
 * @param {string} root - Root note
 * @param {number} octave - Octave
 * @returns {{above: string, below: string}} Approach notes
 */
function getChromaticApproach(root, octave) {
  const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const normalizedRoot = root.replace('b', '#'); // Simplify for lookup

  // Find index
  let idx = noteOrder.indexOf(root);
  if (idx === -1) {
    // Handle flats by converting
    const flatToSharp = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };
    idx = noteOrder.indexOf(flatToSharp[root] || root);
  }

  const aboveIdx = (idx + 1) % 12;
  const belowIdx = (idx - 1 + 12) % 12;

  return {
    above: `${noteOrder[aboveIdx]}${octave}`,
    below: `${noteOrder[belowIdx]}${octave}`
  };
}

/**
 * Get a scale degree from a root
 * @param {string} root - Root note
 * @param {number} octave - Octave
 * @param {number|string} degree - Scale degree (1-7 or 'b3', '#4', etc.)
 * @returns {string} Note name
 */
function getScaleDegree(root, octave, degree) {
  const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // Find root index
  let rootIdx = noteOrder.indexOf(root);
  if (rootIdx === -1) {
    const flatToSharp = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };
    rootIdx = noteOrder.indexOf(flatToSharp[root] || root);
  }

  // Scale degree intervals (major scale)
  const majorIntervals = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11 };

  let semitones;
  if (typeof degree === 'number') {
    semitones = majorIntervals[degree] || 0;
  } else {
    // Handle accidentals like 'b3', '#4'
    const match = degree.match(/([b#]?)(\d)/);
    if (match) {
      const [, accidental, num] = match;
      semitones = majorIntervals[parseInt(num)] || 0;
      if (accidental === 'b') semitones--;
      if (accidental === '#') semitones++;
    } else {
      semitones = 0;
    }
  }

  const noteIdx = (rootIdx + semitones) % 12;
  const octaveAdjust = Math.floor((rootIdx + semitones) / 12);

  return `${noteOrder[noteIdx]}${octave + octaveAdjust}`;
}

/**
 * Generate vekselbass pattern (alternating bass)
 * Traditional 2-beat pattern: root on 1, fifth on 3
 * @param {Object[]} chords - Chord progression
 * @param {Object} options - Generation options
 * @returns {Object[]} Array of note events
 */
function generateVekselbass(chords, options = {}) {
  const {
    octave = 2,
    velocity = 'mf',
    swing = 'triplet',
    ticksPerBeat = 128
  } = options;

  const notes = [];
  let currentTick = 0;

  for (const chord of chords) {
    const beatsInChord = chord.duration || 4;
    const rootMatch = chord.name.match(/^([A-G][#b]?)/);
    if (!rootMatch) continue;

    const root = rootMatch[1];
    const rootNote = `${root}${octave}`;
    const fifth = getScaleDegree(root, octave, 5);

    // Vekselbass: root on 1, fifth on 3 (for 4-beat bars)
    const pattern = beatsInChord >= 4
      ? [rootNote, null, fifth, null]
      : [rootNote, fifth];

    for (let i = 0; i < pattern.length && i < beatsInChord; i++) {
      if (pattern[i]) {
        const tick = calculateSwungTick(0, i, ticksPerBeat, 4, swing);
        notes.push({
          pitch: pattern[i],
          tick: currentTick + tick,
          duration: ticksPerBeat * 2, // Half note feel
          velocity: varyVelocity(dynamicToVelocity(velocity), 5),
          channel: BASS_CHANNEL
        });
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
  // Sort notes by tick
  const sortedNotes = [...notes].sort((a, b) => a.tick - b.tick);

  let lastTick = 0;

  for (const note of sortedNotes) {
    // Add micro-timing humanization (±2% of beat for bass - subtle)
    const humanize = Math.round((Math.random() - 0.5) * ticksPerBeat * 0.04);
    const adjustedTick = Math.max(0, note.tick + humanize);
    const wait = adjustedTick - lastTick;

    // Convert tick duration to midi-writer-js format
    const durationTicks = note.duration || ticksPerBeat;
    const durationNotation = `T${durationTicks}`;
    const waitNotation = wait > 0 ? `T${wait}` : '0';

    const noteEvent = new MidiWriter.NoteEvent({
      pitch: note.pitch,
      duration: durationNotation,
      wait: waitNotation,
      velocity: note.velocity || 70,
      channel: note.channel || BASS_CHANNEL
    });

    track.addEvent(noteEvent);
    lastTick = adjustedTick;
  }
}

module.exports = {
  BASS_PROGRAM,
  BASS_CHANNEL,
  createBassTrack,
  generateWalkingBass,
  generateVekselbass,
  addNotesToTrack,
  generateBassNotesForChord,
  getScaleDegree
};
