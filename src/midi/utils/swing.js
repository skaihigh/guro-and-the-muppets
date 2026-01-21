/**
 * Swing Quantization Utility
 * Applies swing feel to straight 8th notes
 */

/**
 * Standard swing ratios
 * 50% = straight (no swing)
 * 66.7% = triplet swing (most common)
 * 60% = light swing
 * 75% = heavy swing
 */
const SWING_PRESETS = {
  straight: 50,
  light: 58,
  medium: 62,
  triplet: 66.67,  // Classic jazz swing
  heavy: 72,
  shuffle: 75
};

/**
 * Apply swing to a series of note start times
 * Swing delays the second eighth note of each pair
 *
 * @param {number[]} startTicks - Array of note start times in ticks
 * @param {number} ticksPerBeat - Resolution (typically 480)
 * @param {number|string} swingAmount - Swing percentage (50-75) or preset name
 * @returns {number[]} Adjusted start times
 */
function applySwing(startTicks, ticksPerBeat, swingAmount = 'triplet') {
  // Get swing ratio
  let swingRatio;
  if (typeof swingAmount === 'string') {
    swingRatio = (SWING_PRESETS[swingAmount] || SWING_PRESETS.triplet) / 100;
  } else {
    swingRatio = swingAmount / 100;
  }

  // Eighth note duration
  const eighthNoteTicks = ticksPerBeat / 2;

  return startTicks.map(tick => {
    // Determine position within the beat
    const positionInBeat = tick % ticksPerBeat;

    // Check if this is on the "and" (second eighth note)
    // We have some tolerance for notes that are close to the off-beat
    const tolerance = eighthNoteTicks * 0.1;
    const isOffbeat = Math.abs(positionInBeat - eighthNoteTicks) < tolerance;

    if (isOffbeat) {
      // Calculate the swung position
      // For triplet swing (66.67%), the off-beat moves from 50% to 66.67% of the beat
      const beatStart = tick - positionInBeat;
      const swungPosition = ticksPerBeat * swingRatio;
      return beatStart + Math.round(swungPosition);
    }

    return tick;
  });
}

/**
 * Create a swing-quantized note event array
 * This is designed to work with midi-writer-js durations
 *
 * @param {Object[]} notes - Array of note objects with pitch and startBeat
 * @param {number|string} swingAmount - Swing percentage or preset
 * @param {number} ticksPerBeat - Resolution (default 480)
 * @returns {Object[]} Notes with adjusted wait/tick values
 */
function createSwungNotes(notes, swingAmount = 'triplet', ticksPerBeat = 128) {
  let swingRatio;
  if (typeof swingAmount === 'string') {
    swingRatio = (SWING_PRESETS[swingAmount] || SWING_PRESETS.triplet) / 100;
  } else {
    swingRatio = swingAmount / 100;
  }

  return notes.map(note => {
    const beat = note.beat || 0;
    const eighthNotePosition = (beat * 2) % 2; // 0 = downbeat, 1 = upbeat

    if (eighthNotePosition === 1) {
      // This is an off-beat eighth note
      // Calculate the tick offset for swing
      const straightTick = ticksPerBeat / 2;
      const swungTick = Math.round(ticksPerBeat * swingRatio);
      const swingOffset = swungTick - straightTick;

      return {
        ...note,
        swingOffset
      };
    }

    return note;
  });
}

/**
 * Get the swing-adjusted duration for an eighth note pair
 * In swing, the first note is longer, the second is shorter
 *
 * @param {number} ticksPerBeat - Resolution
 * @param {number|string} swingAmount - Swing amount
 * @returns {{long: number, short: number}} Tick durations for long and short notes
 */
function getSwungEighthNoteDurations(ticksPerBeat = 128, swingAmount = 'triplet') {
  let swingRatio;
  if (typeof swingAmount === 'string') {
    swingRatio = (SWING_PRESETS[swingAmount] || SWING_PRESETS.triplet) / 100;
  } else {
    swingRatio = swingAmount / 100;
  }

  const longDuration = Math.round(ticksPerBeat * swingRatio);
  const shortDuration = ticksPerBeat - longDuration;

  return {
    long: longDuration,
    short: shortDuration
  };
}

/**
 * Calculate the tick position for a note in a swing context
 *
 * @param {number} bar - Bar number (0-indexed)
 * @param {number} beat - Beat within bar (0-indexed, can be fractional for 8ths)
 * @param {number} ticksPerBeat - Resolution
 * @param {number} beatsPerBar - Time signature numerator
 * @param {number|string} swingAmount - Swing amount
 * @returns {number} Tick position
 */
function calculateSwungTick(bar, beat, ticksPerBeat = 128, beatsPerBar = 4, swingAmount = 'triplet') {
  let swingRatio;
  if (typeof swingAmount === 'string') {
    swingRatio = (SWING_PRESETS[swingAmount] || SWING_PRESETS.triplet) / 100;
  } else {
    swingRatio = swingAmount / 100;
  }

  // Base tick for the bar and whole beat
  const wholeBeat = Math.floor(beat);
  const baseTick = (bar * beatsPerBar + wholeBeat) * ticksPerBeat;

  // Fractional beat (0 = on beat, 0.5 = eighth note off-beat)
  const fractionalBeat = beat - wholeBeat;

  if (Math.abs(fractionalBeat - 0.5) < 0.01) {
    // This is an off-beat eighth note - apply swing
    return baseTick + Math.round(ticksPerBeat * swingRatio);
  } else if (fractionalBeat === 0) {
    // On the beat
    return baseTick;
  } else {
    // Some other fractional position (triplets, 16ths, etc.)
    return baseTick + Math.round(fractionalBeat * ticksPerBeat);
  }
}

module.exports = {
  SWING_PRESETS,
  applySwing,
  createSwungNotes,
  getSwungEighthNoteDurations,
  calculateSwungTick
};
