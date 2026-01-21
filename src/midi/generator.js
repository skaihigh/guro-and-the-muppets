/**
 * MIDI Generator
 * Core logic for generating MIDI files from song definitions
 */

const MidiWriter = require('midi-writer-js');
const fs = require('fs');
const path = require('path');

const { bass, drums, keyboard, guitar, saxophone } = require('./instruments');
const { dynamicToVelocity, createDynamicCurve } = require('./utils');

// midi-writer-js uses 128 ticks per beat by default
const TICKS_PER_BEAT = 128;

/**
 * Generate MIDI files for a song
 * @param {Object} songModule - Song module with song definition
 * @param {string} outputDir - Output directory path
 * @param {Object} options - Generation options
 */
async function generateSongMidi(songModule, outputDir, options = {}) {
  const { song, getAllChords, getSection, getTotalBars } = songModule;
  const { variants = ['standard'] } = options;

  console.log(`Generating MIDI for: ${song.title}`);
  console.log(`Key: ${song.key}, Tempo: ${song.tempo} BPM`);
  console.log(`Total bars: ${getTotalBars()}`);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const generatedFiles = [];

  // Generate individual instrument tracks
  for (const variant of variants) {
    const suffix = variant === 'standard' ? '' : `-${variant}`;

    // Generate each instrument
    const bassTrack = generateBassForSong(song, variant);
    const drumsTrack = generateDrumsForSong(song, variant);
    const keyboardTrack = generateKeyboardForSong(song, variant);
    const guitarTrack = generateGuitarForSong(song, variant);
    const saxophoneTrack = generateSaxophoneForSong(song, variant);

    // Write individual MIDI files
    const instruments = [
      { name: 'bass', track: bassTrack },
      { name: 'drums', track: drumsTrack },
      { name: 'keyboard', track: keyboardTrack },
      { name: 'guitar', track: guitarTrack },
      { name: 'saxophone', track: saxophoneTrack }
    ];

    for (const { name, track } of instruments) {
      const filename = `${name}${suffix}.mid`;
      const filepath = path.join(outputDir, filename);

      // Create writer with tempo track + instrument track
      const tempoTrack = createTempoTrack(song);
      const writer = new MidiWriter.Writer([tempoTrack, track]);

      fs.writeFileSync(filepath, Buffer.from(writer.buildFile()));
      generatedFiles.push(filepath);
      console.log(`  Created: ${filename}`);
    }

    // Generate full band MIDI (all instruments combined)
    const fullBandFilename = `full-band${suffix}.mid`;
    const fullBandPath = path.join(outputDir, fullBandFilename);

    const tempoTrack = createTempoTrack(song);
    const fullBandWriter = new MidiWriter.Writer([
      tempoTrack,
      keyboardTrack,
      bassTrack,
      guitarTrack,
      saxophoneTrack,
      drumsTrack
    ]);

    fs.writeFileSync(fullBandPath, Buffer.from(fullBandWriter.buildFile()));
    generatedFiles.push(fullBandPath);
    console.log(`  Created: ${fullBandFilename}`);
  }

  return generatedFiles;
}

/**
 * Create tempo/meta track
 * @param {Object} song - Song definition
 * @returns {MidiWriter.Track} Tempo track
 */
function createTempoTrack(song) {
  const track = new MidiWriter.Track();
  track.setTempo(song.tempo);
  track.setTimeSignature(song.timeSignature[0], song.timeSignature[1]);
  track.addTrackName(song.title);
  track.addCopyright(`Arranged by ${song.arranger}`);
  return track;
}

/**
 * Generate bass track for a song
 * @param {Object} song - Song definition
 * @param {string} variant - 'standard' or 'vekselbass'
 * @returns {MidiWriter.Track} Bass track
 */
function generateBassForSong(song, variant = 'standard') {
  const track = bass.createBassTrack();
  let currentTick = 0;
  const allNotes = []; // Collect all notes first

  for (const section of song.sections) {
    // Skip drums-only sections for bass
    if (section.drumsOnly) {
      currentTick += section.bars * 4 * TICKS_PER_BEAT;
      continue;
    }

    if (!section.chords) {
      currentTick += section.bars * 4 * TICKS_PER_BEAT;
      continue;
    }

    const sectionOptions = {
      velocity: section.dynamics || 'mf',
      swing: song.swing,
      ticksPerBeat: TICKS_PER_BEAT
    };

    let notes;
    if (variant === 'vekselbass') {
      notes = bass.generateVekselbass(section.chords, sectionOptions);
    } else {
      // Check for specific bass patterns
      const chordsWithPatterns = section.chords.map(chord => {
        if (song.bassPatterns && song.bassPatterns[chord.name]) {
          return { ...chord, bassNotes: song.bassPatterns[chord.name] };
        }
        return chord;
      });
      notes = bass.generateWalkingBass(chordsWithPatterns, sectionOptions);
    }

    // Offset notes by current position and collect
    for (const note of notes) {
      allNotes.push({
        ...note,
        tick: note.tick + currentTick
      });
    }

    // Use declared bars for consistent timing across all instruments
    currentTick += section.bars * 4 * TICKS_PER_BEAT;
  }

  // Add all notes at once to get correct delta times
  bass.addNotesToTrack(track, allNotes, TICKS_PER_BEAT);

  return track;
}

/**
 * Generate drums track for a song
 * @param {Object} song - Song definition
 * @param {string} variant - 'standard' or 'vekselbass'
 * @returns {MidiWriter.Track} Drums track
 */
function generateDrumsForSong(song, variant = 'standard') {
  const track = drums.createDrumsTrack();
  let currentTick = 0;
  const allHits = []; // Collect all hits first

  for (const section of song.sections) {
    const bars = section.bars;

    let hits;

    if (section.geneKrupaBreak) {
      // Generate Gene Krupa style break
      hits = drums.generateGeneKrupaBreak(bars, { ticksPerBeat: TICKS_PER_BEAT });
    } else if (section.name === 'intro') {
      hits = drums.generateIntroPattern(bars, {
        velocity: section.dynamics || 'mp',
        ticksPerBeat: TICKS_PER_BEAT
      });
    } else if (section.name.includes('chorus')) {
      hits = drums.generateChorusPattern(bars, {
        velocity: section.dynamics || 'f',
        ticksPerBeat: TICKS_PER_BEAT
      });
    } else if (section.dynamics === 'mp' || section.dynamics === 'p') {
      // Quieter sections - use hi-hat instead of ride
      hits = drums.generateSwingPattern(bars, {
        velocity: section.dynamics,
        ticksPerBeat: TICKS_PER_BEAT,
        useHiHat: true,
        includeKick: section.dynamics !== 'p',
        includeGhostNotes: section.dynamics !== 'p'
      });
    } else {
      // Standard swing pattern
      const useVekselbassFeel = variant === 'vekselbass';
      hits = drums.generateSwingPattern(bars, {
        velocity: section.dynamics || 'mf',
        ticksPerBeat: TICKS_PER_BEAT,
        includeKick: !useVekselbassFeel || section.name.includes('chorus'),
        includeGhostNotes: true
      });
    }

    // Offset hits by current position and collect
    for (const hit of hits) {
      allHits.push({
        ...hit,
        tick: hit.tick + currentTick
      });
    }

    currentTick += bars * 4 * TICKS_PER_BEAT;
  }

  // Add all hits at once to get correct delta times
  drums.addDrumHitsToTrack(track, allHits, TICKS_PER_BEAT);

  return track;
}

/**
 * Generate keyboard track for a song
 * @param {Object} song - Song definition
 * @param {string} variant - 'standard' or 'vekselbass'
 * @returns {MidiWriter.Track} Keyboard track
 */
function generateKeyboardForSong(song, variant = 'standard') {
  const track = keyboard.createKeyboardTrack();
  let currentTick = 0;
  const allNotes = []; // Collect all notes first

  for (const section of song.sections) {
    // Skip drums-only sections
    if (section.drumsOnly) {
      currentTick += section.bars * 4 * TICKS_PER_BEAT;
      continue;
    }

    if (!section.chords) {
      currentTick += section.bars * 4 * TICKS_PER_BEAT;
      continue;
    }

    let notes;
    const baseOptions = {
      velocity: section.dynamics || 'mf',
      swing: song.swing,
      ticksPerBeat: TICKS_PER_BEAT
    };

    if (section.name === 'intro') {
      // Stride piano for intro
      notes = keyboard.generateStrideLeftHand(section.chords, {
        ...baseOptions,
        octave: 3
      });
    } else if (section.dynamics === 'p' || section.dynamics === 'pp') {
      // Sparse comping for quiet sections
      notes = keyboard.generateComping(section.chords, {
        ...baseOptions,
        pattern: 'sparse',
        octave: 4
      });
    } else {
      // Standard comping
      const pattern = variant === 'vekselbass' ? 'two-feel' : 'quarter';
      notes = keyboard.generateComping(section.chords, {
        ...baseOptions,
        pattern,
        octave: 4
      });
    }

    // Offset notes and collect
    for (const note of notes) {
      allNotes.push({
        ...note,
        tick: note.tick + currentTick
      });
    }

    // Use declared bars for consistent timing across all instruments
    currentTick += section.bars * 4 * TICKS_PER_BEAT;
  }

  // Add all notes at once to get correct delta times
  keyboard.addNotesToTrack(track, allNotes, TICKS_PER_BEAT);

  return track;
}

/**
 * Generate guitar track for a song
 * @param {Object} song - Song definition
 * @param {string} variant - 'standard' or 'vekselbass'
 * @returns {MidiWriter.Track} Guitar track
 */
function generateGuitarForSong(song, variant = 'standard') {
  const track = guitar.createGuitarTrack();
  let currentTick = 0;
  const allNotes = []; // Collect all notes first

  for (const section of song.sections) {
    // Skip drums-only sections
    if (section.drumsOnly) {
      currentTick += section.bars * 4 * TICKS_PER_BEAT;
      continue;
    }

    if (!section.chords) {
      currentTick += section.bars * 4 * TICKS_PER_BEAT;
      continue;
    }

    // Skip intro (let piano lead)
    if (section.name === 'intro') {
      currentTick += section.bars * 4 * TICKS_PER_BEAT;
      continue;
    }

    let notes;
    const baseOptions = {
      velocity: section.dynamics || 'mf',
      swing: song.swing,
      ticksPerBeat: TICKS_PER_BEAT,
      octave: 3
    };

    if (variant === 'vekselbass') {
      notes = guitar.generateVekselbasStyle(section.chords, baseOptions);
    } else if (section.dynamics === 'p' || section.dynamics === 'pp') {
      // Very quiet - maybe skip
      notes = [];
    } else {
      notes = guitar.generateRhythmGuitar(section.chords, baseOptions);
    }

    // Offset notes and collect
    for (const note of notes) {
      allNotes.push({
        ...note,
        tick: note.tick + currentTick
      });
    }

    // Use declared bars for consistent timing across all instruments
    currentTick += section.bars * 4 * TICKS_PER_BEAT;
  }

  // Add all notes at once to get correct delta times
  guitar.addNotesToTrack(track, allNotes, TICKS_PER_BEAT);

  return track;
}

/**
 * Extract root note from a key (e.g., "Em" -> "E", "G" -> "G", "F#m" -> "F#")
 * @param {string} key - Key name
 * @returns {string} Root note
 */
function extractRootFromKey(key) {
  const match = key.match(/^([A-G][#b]?)/);
  return match ? match[1] : 'C';
}

/**
 * Generate saxophone track for a song
 * @param {Object} song - Song definition
 * @param {string} variant - Variant name (not used for sax currently)
 * @returns {MidiWriter.Track} Saxophone track
 */
function generateSaxophoneForSong(song, variant = 'standard') {
  const track = saxophone.createSaxophoneTrack({ type: 'tenor' });
  let currentTick = 0;
  const allNotes = []; // Collect all notes first

  // Extract just the root note from the key (e.g., "Em" -> "E")
  const rootNote = extractRootFromKey(song.key);

  for (const section of song.sections) {
    // Skip drums-only sections
    if (section.drumsOnly) {
      currentTick += section.bars * 4 * TICKS_PER_BEAT;
      continue;
    }

    if (!section.chords) {
      currentTick += section.bars * 4 * TICKS_PER_BEAT;
      continue;
    }

    const sectionDuration = section.chords.reduce((sum, c) => sum + (c.duration || 4), 0);

    let notes = [];

    if (section.saxFill || section.name === 'interlude') {
      // Generate melodic fill (notes have absolute ticks via startTick)
      notes = saxophone.generateFill(rootNote, song.isMinor, sectionDuration, {
        velocity: section.dynamics || 'mf',
        swing: song.swing,
        ticksPerBeat: TICKS_PER_BEAT,
        startTick: currentTick,
        density: 'medium'
      });
    } else if (section.saxMelody) {
      // Generate chord tone melody for choruses (notes have relative ticks)
      notes = saxophone.generateChordToneMelody(section.chords, {
        velocity: section.dynamics || 'f',
        swing: song.swing,
        ticksPerBeat: TICKS_PER_BEAT,
        octave: 4
      });
      // Offset notes to absolute ticks
      notes = notes.map(note => ({
        ...note,
        tick: note.tick + currentTick
      }));
    } else if (section.name === 'outro') {
      // Long tones for outro (notes have absolute ticks via startTick)
      const outroNote = `${rootNote}4`;
      notes = saxophone.generateLongTones([outroNote], sectionDuration, {
        velocity: section.dynamics || 'mf',
        ticksPerBeat: TICKS_PER_BEAT,
        startTick: currentTick
      });
    } else {
      // Generate occasional fills between phrases (every 4-8 bars)
      if (sectionDuration >= 8) {
        const fillStart = currentTick + 4 * TICKS_PER_BEAT * (song.timeSignature[0]);
        notes = saxophone.generateFill(rootNote, song.isMinor, 2, {
          velocity: section.dynamics || 'mf',
          swing: song.swing,
          ticksPerBeat: TICKS_PER_BEAT,
          startTick: fillStart,
          density: 'sparse'
        });
      }
    }

    // Collect notes (all should have absolute ticks now)
    allNotes.push(...notes);

    // Use declared bars for consistent timing across all instruments
    currentTick += section.bars * 4 * TICKS_PER_BEAT;
  }

  // Add all notes at once to get correct delta times
  if (allNotes.length > 0) {
    saxophone.addNotesToTrack(track, allNotes, TICKS_PER_BEAT);
  }

  return track;
}

module.exports = {
  generateSongMidi,
  createTempoTrack,
  generateBassForSong,
  generateDrumsForSong,
  generateKeyboardForSong,
  generateGuitarForSong,
  generateSaxophoneForSong,
  TICKS_PER_BEAT
};
