/**
 * MIDI Generation Module
 * Main entry point for the MIDI generation system
 */

const generator = require('./generator');
const instruments = require('./instruments');
const utils = require('./utils');
const songs = require('./songs');

module.exports = {
  ...generator,
  instruments,
  utils,
  songs
};
