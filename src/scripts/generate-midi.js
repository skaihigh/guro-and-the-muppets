#!/usr/bin/env node

/**
 * MIDI Generation CLI Script
 * Generates MIDI files for all songs
 *
 * Usage:
 *   node src/scripts/generate-midi.js [songName] [--variants=standard,vekselbass]
 *
 * Examples:
 *   node src/scripts/generate-midi.js                    # Generate all songs
 *   node src/scripts/generate-midi.js vaarherres-klinkekule
 *   node src/scripts/generate-midi.js --variants=vekselbass
 */

const path = require('path');
const { generateSongMidi } = require('../midi/generator');
const songs = require('../midi/songs');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    songs: [],
    variants: ['standard']
  };

  for (const arg of args) {
    if (arg.startsWith('--variants=')) {
      options.variants = arg.replace('--variants=', '').split(',');
    } else if (arg.startsWith('--')) {
      // Other flags
      const flag = arg.replace('--', '');
      options[flag] = true;
    } else {
      options.songs.push(arg);
    }
  }

  // If no songs specified, generate all
  if (options.songs.length === 0) {
    options.songs = Object.keys(songs);
  }

  return options;
}

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  MIDI Generator - Guro and the Muppets');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');

  const options = parseArgs();

  console.log(`Songs to generate: ${options.songs.join(', ')}`);
  console.log(`Variants: ${options.variants.join(', ')}`);
  console.log('');

  const projectRoot = path.resolve(__dirname, '../..');
  const allGeneratedFiles = [];

  for (const songName of options.songs) {
    const songModule = songs[songName];

    if (!songModule) {
      console.error(`Unknown song: ${songName}`);
      console.error(`Available songs: ${Object.keys(songs).join(', ')}`);
      continue;
    }

    const outputDir = path.join(projectRoot, 'output', 'midi', songName);

    console.log('───────────────────────────────────────────────────────');

    try {
      const files = await generateSongMidi(songModule, outputDir, {
        variants: options.variants
      });
      allGeneratedFiles.push(...files);
    } catch (error) {
      console.error(`Error generating ${songName}:`, error.message);
      if (options.verbose) {
        console.error(error.stack);
      }
    }

    console.log('');
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log(`  Generation complete!`);
  console.log(`  Total files created: ${allGeneratedFiles.length}`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('');

  // Print summary
  console.log('Generated files:');
  for (const file of allGeneratedFiles) {
    const relativePath = path.relative(projectRoot, file);
    console.log(`  - ${relativePath}`);
  }
  console.log('');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
