/**
 * Drums Generator
 * Creates swing drum patterns including Gene Krupa style breaks
 */

const MidiWriter = require('midi-writer-js');
const { dynamicToVelocity, varyVelocity, createDynamicCurve } = require('../utils');

// MIDI Channel 10 is reserved for drums (0-indexed = 9)
const DRUMS_CHANNEL = 10;

// General MIDI Drum Map
const DRUM_NOTES = {
  kick: 36,         // Bass Drum 1
  kick2: 35,        // Acoustic Bass Drum
  snare: 38,        // Acoustic Snare
  snareSidestick: 37, // Side Stick
  snareElectric: 40,  // Electric Snare
  closedHiHat: 42,  // Closed Hi-Hat
  openHiHat: 46,    // Open Hi-Hat
  pedalHiHat: 44,   // Pedal Hi-Hat
  ride: 51,         // Ride Cymbal 1
  rideBell: 53,     // Ride Bell
  crash: 49,        // Crash Cymbal 1
  crash2: 57,       // Crash Cymbal 2
  lowFloorTom: 41,  // Low Floor Tom
  highFloorTom: 43, // High Floor Tom
  lowTom: 45,       // Low Tom
  midTom: 47,       // Low-Mid Tom
  highTom: 50,      // High Tom
  hiMidTom: 48,     // Hi-Mid Tom
  splash: 55,       // Splash Cymbal
  china: 52,        // Chinese Cymbal
  cowbell: 56       // Cowbell
};

/**
 * Create a drums track
 * @param {Object} options - Track options
 * @returns {MidiWriter.Track} MIDI track
 */
function createDrumsTrack(options = {}) {
  const track = new MidiWriter.Track();
  track.addTrackName('Drums');
  // No program change needed for drums - channel 10 is always drums
  return track;
}

/**
 * Generate basic swing pattern
 * Classic "ding-ding-a-ding" ride pattern with hi-hat on 2 and 4
 * @param {number} bars - Number of bars to generate
 * @param {Object} options - Pattern options
 * @returns {Object[]} Array of drum hit objects
 */
function generateSwingPattern(bars, options = {}) {
  const {
    velocity = 'mf',
    ticksPerBeat = 128,
    includeKick = true,
    includeGhostNotes = true,
    useHiHat = false // Use hi-hat instead of ride
  } = options;

  const hits = [];
  const baseVelocity = dynamicToVelocity(velocity);

  for (let bar = 0; bar < bars; bar++) {
    const barOffset = bar * 4 * ticksPerBeat;

    // Generate one bar of swing pattern
    for (let beat = 0; beat < 4; beat++) {
      const beatTick = barOffset + beat * ticksPerBeat;

      // Ride/Hi-hat: "ding-ding-a-ding" pattern
      // Beat 1: X, and: -, 2: X, 2+: x(triplet), 3: X, 3+: -, 4: X, 4+: x(triplet)
      const cymbal = useHiHat ? DRUM_NOTES.closedHiHat : DRUM_NOTES.ride;

      // On the beat
      hits.push({
        drum: cymbal,
        tick: beatTick,
        velocity: varyVelocity(baseVelocity, 5)
      });

      // Triplet-swung "a" (third triplet partial)
      // For triplet swing, this falls at ~66% of the beat
      const tripletTick = beatTick + Math.round(ticksPerBeat * 0.67);
      hits.push({
        drum: cymbal,
        tick: tripletTick,
        velocity: varyVelocity(baseVelocity - 15, 5) // Slightly softer
      });

      // Hi-hat pedal on 2 and 4
      if (beat === 1 || beat === 3) {
        hits.push({
          drum: DRUM_NOTES.pedalHiHat,
          tick: beatTick,
          velocity: varyVelocity(baseVelocity - 10, 3)
        });
      }

      // Ghost notes on snare (very soft)
      if (includeGhostNotes) {
        const ghostVelocity = dynamicToVelocity('ghost');
        // Ghost on the "and" of each beat
        const ghostTick = beatTick + Math.round(ticksPerBeat * 0.5);
        hits.push({
          drum: DRUM_NOTES.snare,
          tick: ghostTick,
          velocity: varyVelocity(ghostVelocity, 3)
        });
      }

      // Kick drum on beat 1 (and sometimes 3)
      if (includeKick && beat === 0) {
        hits.push({
          drum: DRUM_NOTES.kick,
          tick: beatTick,
          velocity: varyVelocity(baseVelocity - 5, 5)
        });
      }
    }
  }

  return hits;
}

/**
 * Generate chorus/energetic pattern with more backbeat
 * @param {number} bars - Number of bars
 * @param {Object} options - Pattern options
 * @returns {Object[]} Array of drum hits
 */
function generateChorusPattern(bars, options = {}) {
  const {
    velocity = 'f',
    ticksPerBeat = 128
  } = options;

  const hits = [];
  const baseVelocity = dynamicToVelocity(velocity);

  for (let bar = 0; bar < bars; bar++) {
    const barOffset = bar * 4 * ticksPerBeat;

    for (let beat = 0; beat < 4; beat++) {
      const beatTick = barOffset + beat * ticksPerBeat;

      // Ride cymbal on every beat and triplet partial
      hits.push({
        drum: DRUM_NOTES.ride,
        tick: beatTick,
        velocity: varyVelocity(baseVelocity, 5)
      });

      const tripletTick = beatTick + Math.round(ticksPerBeat * 0.67);
      hits.push({
        drum: DRUM_NOTES.ride,
        tick: tripletTick,
        velocity: varyVelocity(baseVelocity - 10, 5)
      });

      // Snare backbeat on 2 and 4
      if (beat === 1 || beat === 3) {
        hits.push({
          drum: DRUM_NOTES.snare,
          tick: beatTick,
          velocity: varyVelocity(baseVelocity + 5, 5)
        });

        hits.push({
          drum: DRUM_NOTES.pedalHiHat,
          tick: beatTick,
          velocity: varyVelocity(baseVelocity - 10, 3)
        });
      }

      // Kick on 1 and 3
      if (beat === 0 || beat === 2) {
        hits.push({
          drum: DRUM_NOTES.kick,
          tick: beatTick,
          velocity: varyVelocity(baseVelocity, 5)
        });
      }
    }
  }

  return hits;
}

/**
 * Generate Gene Krupa style tom break
 * Builds from very soft to explosive
 * @param {number} bars - Number of bars (typically 4-8)
 * @param {Object} options - Break options
 * @returns {Object[]} Array of drum hits
 */
function generateGeneKrupaBreak(bars = 8, options = {}) {
  const { ticksPerBeat = 128 } = options;

  const hits = [];
  const velocityCurve = createDynamicCurve(
    dynamicToVelocity('pp'),
    dynamicToVelocity('ff'),
    bars
  );

  for (let bar = 0; bar < bars; bar++) {
    const barOffset = bar * 4 * ticksPerBeat;
    const barVelocity = velocityCurve[bar];

    // Pattern evolves as we build
    if (bar < 2) {
      // First 2 bars: Simple floor tom quarter notes
      for (let beat = 0; beat < 4; beat++) {
        hits.push({
          drum: DRUM_NOTES.lowFloorTom,
          tick: barOffset + beat * ticksPerBeat,
          velocity: varyVelocity(barVelocity, 3)
        });
      }
    } else if (bar < 4) {
      // Bars 3-4: Eighth notes on floor tom
      for (let eighth = 0; eighth < 8; eighth++) {
        hits.push({
          drum: DRUM_NOTES.lowFloorTom,
          tick: barOffset + eighth * (ticksPerBeat / 2),
          velocity: varyVelocity(barVelocity, 5)
        });
      }
    } else if (bar < 6) {
      // Bars 5-6: Moving to mid toms
      for (let eighth = 0; eighth < 8; eighth++) {
        const drum = eighth < 4 ? DRUM_NOTES.lowFloorTom : DRUM_NOTES.midTom;
        hits.push({
          drum,
          tick: barOffset + eighth * (ticksPerBeat / 2),
          velocity: varyVelocity(barVelocity, 5)
        });
      }
    } else if (bar < bars - 1) {
      // Building bars: Toms to snare
      for (let eighth = 0; eighth < 8; eighth++) {
        const drums = [DRUM_NOTES.lowFloorTom, DRUM_NOTES.midTom, DRUM_NOTES.highTom, DRUM_NOTES.snare];
        const drum = drums[Math.min(Math.floor(eighth / 2), drums.length - 1)];
        hits.push({
          drum,
          tick: barOffset + eighth * (ticksPerBeat / 2),
          velocity: varyVelocity(barVelocity, 5)
        });
      }
    } else {
      // Final bar: Build to crash
      for (let sixteenth = 0; sixteenth < 16; sixteenth++) {
        hits.push({
          drum: DRUM_NOTES.snare,
          tick: barOffset + sixteenth * (ticksPerBeat / 4),
          velocity: varyVelocity(barVelocity + 10, 3)
        });
      }

      // Final crash!
      hits.push({
        drum: DRUM_NOTES.crash,
        tick: barOffset + 4 * ticksPerBeat, // On beat 1 of next bar
        velocity: dynamicToVelocity('fff')
      });
      hits.push({
        drum: DRUM_NOTES.kick,
        tick: barOffset + 4 * ticksPerBeat,
        velocity: dynamicToVelocity('fff')
      });
    }
  }

  return hits;
}

/**
 * Generate intro pattern (lighter, possibly brushes feel)
 * @param {number} bars - Number of bars
 * @param {Object} options - Options
 * @returns {Object[]} Array of drum hits
 */
function generateIntroPattern(bars, options = {}) {
  const {
    velocity = 'mp',
    ticksPerBeat = 128
  } = options;

  const hits = [];
  const baseVelocity = dynamicToVelocity(velocity);

  for (let bar = 0; bar < bars; bar++) {
    const barOffset = bar * 4 * ticksPerBeat;

    for (let beat = 0; beat < 4; beat++) {
      const beatTick = barOffset + beat * ticksPerBeat;

      // Hi-hat pedal on 2 and 4
      if (beat === 1 || beat === 3) {
        hits.push({
          drum: DRUM_NOTES.pedalHiHat,
          tick: beatTick,
          velocity: varyVelocity(baseVelocity, 3)
        });

        // Light sidestick tap
        hits.push({
          drum: DRUM_NOTES.snareSidestick,
          tick: beatTick,
          velocity: varyVelocity(baseVelocity - 15, 3)
        });
      }
    }
  }

  return hits;
}

/**
 * Generate fill pattern
 * @param {string} fillType - Type of fill ('turnaround', 'crash', 'build')
 * @param {Object} options - Fill options
 * @returns {Object[]} Array of drum hits
 */
function generateFill(fillType, options = {}) {
  const {
    velocity = 'f',
    ticksPerBeat = 128
  } = options;

  const hits = [];
  const baseVelocity = dynamicToVelocity(velocity);

  switch (fillType) {
    case 'turnaround':
      // Classic jazz turnaround: snare-snare-tom-crash
      hits.push(
        { drum: DRUM_NOTES.snare, tick: ticksPerBeat * 2, velocity: baseVelocity },
        { drum: DRUM_NOTES.snare, tick: ticksPerBeat * 2.5, velocity: baseVelocity },
        { drum: DRUM_NOTES.highTom, tick: ticksPerBeat * 3, velocity: baseVelocity },
        { drum: DRUM_NOTES.crash, tick: ticksPerBeat * 4, velocity: baseVelocity + 10 },
        { drum: DRUM_NOTES.kick, tick: ticksPerBeat * 4, velocity: baseVelocity }
      );
      break;

    case 'crash':
      // Simple crash on beat 1
      hits.push(
        { drum: DRUM_NOTES.crash, tick: 0, velocity: baseVelocity + 10 },
        { drum: DRUM_NOTES.kick, tick: 0, velocity: baseVelocity }
      );
      break;

    case 'build':
      // Two-beat build
      for (let eighth = 0; eighth < 4; eighth++) {
        hits.push({
          drum: DRUM_NOTES.snare,
          tick: eighth * (ticksPerBeat / 2),
          velocity: baseVelocity + eighth * 5
        });
      }
      break;
  }

  return hits;
}

/**
 * Add drum hits to a MIDI track
 * @param {MidiWriter.Track} track - Target track
 * @param {Object[]} hits - Array of drum hit objects
 * @param {number} ticksPerBeat - Resolution
 */
function addDrumHitsToTrack(track, hits, ticksPerBeat = 128) {
  // Sort hits by tick
  const sortedHits = [...hits].sort((a, b) => a.tick - b.tick);

  let lastTick = 0;

  for (const hit of sortedHits) {
    // Add micro-timing humanization (±3% of a beat for natural feel)
    const humanize = Math.round((Math.random() - 0.5) * ticksPerBeat * 0.06);
    const adjustedTick = Math.max(0, hit.tick + humanize);
    const wait = adjustedTick - lastTick;

    const waitNotation = wait > 0 ? `T${wait}` : '0';

    // Use appropriate duration based on drum type for natural decay
    let duration;
    if (hit.drum === DRUM_NOTES.ride || hit.drum === DRUM_NOTES.crash ||
        hit.drum === DRUM_NOTES.crash2 || hit.drum === DRUM_NOTES.splash) {
      // Cymbals ring longer
      duration = Math.round(ticksPerBeat * 1.5);
    } else if (hit.drum === DRUM_NOTES.openHiHat) {
      duration = Math.round(ticksPerBeat * 0.8);
    } else {
      // Snare, kick, toms - moderate sustain
      duration = Math.round(ticksPerBeat * 0.5);
    }

    const noteEvent = new MidiWriter.NoteEvent({
      pitch: hit.drum,
      duration: `T${duration}`,
      wait: waitNotation,
      velocity: Math.min(127, Math.max(1, hit.velocity)),
      channel: DRUMS_CHANNEL
    });

    track.addEvent(noteEvent);
    lastTick = adjustedTick;
  }
}

module.exports = {
  DRUMS_CHANNEL,
  DRUM_NOTES,
  createDrumsTrack,
  generateSwingPattern,
  generateChorusPattern,
  generateGeneKrupaBreak,
  generateIntroPattern,
  generateFill,
  addDrumHitsToTrack
};
