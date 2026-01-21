/**
 * Instrument Generators
 * Re-exports all instrument modules
 */

const bass = require('./bass');
const drums = require('./drums');
const keyboard = require('./keyboard');
const guitar = require('./guitar');
const saxophone = require('./saxophone');

module.exports = {
  bass,
  drums,
  keyboard,
  guitar,
  saxophone
};
