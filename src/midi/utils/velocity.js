/**
 * Velocity Utility
 * Maps dynamics to MIDI velocity values
 */

/**
 * Dynamic markings to MIDI velocity mapping
 * MIDI velocity ranges from 0 to 127
 */
const DYNAMICS_TO_VELOCITY = {
  'ppp': 16,      // pianississimo
  'pp': 25,       // pianissimo
  'p': 40,        // piano
  'mp': 55,       // mezzo-piano
  'mf': 70,       // mezzo-forte
  'f': 85,        // forte
  'ff': 100,      // fortissimo
  'fff': 115,     // fortississimo
  'ghost': 20,    // ghost notes
  'accent': 90,   // accented notes
  'sfz': 110      // sforzando
};

/**
 * Convert a dynamic marking to MIDI velocity
 * @param {string|number} dynamic - Dynamic marking or velocity value
 * @returns {number} MIDI velocity (1-127)
 */
function dynamicToVelocity(dynamic) {
  if (typeof dynamic === 'number') {
    return Math.max(1, Math.min(127, dynamic));
  }

  const velocity = DYNAMICS_TO_VELOCITY[dynamic.toLowerCase()];
  if (velocity === undefined) {
    // Default to mezzo-forte if unknown
    console.warn(`Unknown dynamic: ${dynamic}, using mf`);
    return DYNAMICS_TO_VELOCITY['mf'];
  }

  return velocity;
}

/**
 * Apply a velocity variation (humanization)
 * @param {number} baseVelocity - Base velocity value
 * @param {number} variationRange - Range of random variation (+/-)
 * @returns {number} Varied velocity
 */
function varyVelocity(baseVelocity, variationRange = 5) {
  const variation = (Math.random() - 0.5) * 2 * variationRange;
  return Math.max(1, Math.min(127, Math.round(baseVelocity + variation)));
}

/**
 * Apply accent pattern to velocities
 * @param {number[]} velocities - Array of velocity values
 * @param {number[]} accentPattern - Pattern of accents (1 = accent, 0 = normal)
 * @param {number} accentBoost - Amount to boost accented notes
 * @returns {number[]} Modified velocities
 */
function applyAccentPattern(velocities, accentPattern, accentBoost = 15) {
  return velocities.map((vel, i) => {
    const patternIndex = i % accentPattern.length;
    if (accentPattern[patternIndex]) {
      return Math.min(127, vel + accentBoost);
    }
    return vel;
  });
}

/**
 * Create a crescendo or decrescendo velocity curve
 * @param {number} startVelocity - Starting velocity
 * @param {number} endVelocity - Ending velocity
 * @param {number} noteCount - Number of notes
 * @returns {number[]} Array of interpolated velocities
 */
function createDynamicCurve(startVelocity, endVelocity, noteCount) {
  const velocities = [];
  for (let i = 0; i < noteCount; i++) {
    const ratio = i / (noteCount - 1);
    const velocity = Math.round(startVelocity + (endVelocity - startVelocity) * ratio);
    velocities.push(Math.max(1, Math.min(127, velocity)));
  }
  return velocities;
}

/**
 * Get standard swing accent pattern (2 and 4)
 * @returns {number[]} Accent pattern for 4/4 swing
 */
function getSwingAccentPattern() {
  // 8 eighth notes: accents on beats 2 and 4 (positions 2 and 6 in 8th notes)
  return [0, 0, 1, 0, 0, 0, 1, 0];
}

/**
 * Get backbeat accent pattern for drums
 * @returns {number[]} Accent pattern emphasizing 2 and 4
 */
function getBackbeatPattern() {
  // Quarter notes: accents on 2 and 4
  return [0, 1, 0, 1];
}

module.exports = {
  DYNAMICS_TO_VELOCITY,
  dynamicToVelocity,
  varyVelocity,
  applyAccentPattern,
  createDynamicCurve,
  getSwingAccentPattern,
  getBackbeatPattern
};
