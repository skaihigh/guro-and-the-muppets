const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '../..');
const SITE_DIR = path.join(ROOT, 'site');
const OUTPUT_DIR = path.join(ROOT, 'docs');
const MIDI_SOURCE = path.join(ROOT, 'output/midi');
const SONGS_SOURCE = path.join(ROOT, 'songs');
const KNOWLEDGE_SOURCE = path.join(ROOT, 'knowledge');
const AGENTS_SOURCE = path.join(ROOT, 'agents');
const SKILLS_SOURCE = path.join(ROOT, 'skills');

const SONGS = [
  {
    slug: 'vaarherres-klinkekule',
    title: 'Vaarherres Klinkekule',
    instruments: ['keyboard', 'bass', 'guitar', 'drums', 'saxophone', 'vocals', 'full-score']
  },
  {
    slug: 'crescendo-i-gagata',
    title: 'Crescendo i Gagata',
    instruments: ['keyboard', 'bass', 'guitar', 'drums', 'saxophone', 'vocals', 'full-score']
  }
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest) {
  if (fs.existsSync(src)) {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${path.relative(ROOT, src)} -> ${path.relative(ROOT, dest)}`);
  } else {
    console.warn(`Warning: Source not found: ${src}`);
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Warning: Source directory not found: ${src}`);
    return;
  }
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  console.log(`Copied directory: ${path.relative(ROOT, src)} -> ${path.relative(ROOT, dest)}`);
}

function addFrontMatter(content, frontMatter) {
  const yaml = Object.entries(frontMatter)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
  return `---\n${yaml}\n---\n\n${content}`;
}

function copyMarkdownWithFrontMatter(src, dest, frontMatter) {
  if (!fs.existsSync(src)) {
    console.warn(`Warning: Source not found: ${src}`);
    return;
  }
  let content = fs.readFileSync(src, 'utf8');

  // Check if file already has front matter
  if (!content.startsWith('---')) {
    content = addFrontMatter(content, frontMatter);
  }

  ensureDir(path.dirname(dest));
  fs.writeFileSync(dest, content);
  console.log(`Copied with front matter: ${path.relative(ROOT, src)}`);
}

function copyMidiFiles() {
  console.log('\n--- Copying MIDI files ---');
  for (const song of SONGS) {
    const src = path.join(MIDI_SOURCE, song.slug);
    const dest = path.join(SITE_DIR, 'midi', song.slug);
    copyDir(src, dest);
  }
}

function copySongParts() {
  console.log('\n--- Copying song instrument parts ---');
  for (const song of SONGS) {
    for (const instrument of song.instruments) {
      const src = path.join(SONGS_SOURCE, song.slug, `${instrument}.md`);
      const dest = path.join(SITE_DIR, 'songs', song.slug, `${instrument}.md`);

      const midiName = instrument === 'full-score' ? 'full-band' : instrument;

      copyMarkdownWithFrontMatter(src, dest, {
        layout: 'part.njk',
        title: instrument.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        song: song.slug,
        songTitle: song.title,
        midi: midiName
      });
    }
  }
}

function copyKnowledgeArticles() {
  console.log('\n--- Copying knowledge articles ---');
  if (!fs.existsSync(KNOWLEDGE_SOURCE)) {
    console.warn('Warning: Knowledge directory not found');
    return;
  }

  const files = fs.readdirSync(KNOWLEDGE_SOURCE).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const src = path.join(KNOWLEDGE_SOURCE, file);
    const dest = path.join(SITE_DIR, 'knowledge', file);
    const title = file.replace('.md', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    copyMarkdownWithFrontMatter(src, dest, {
      layout: 'base.njk',
      title: title
    });
  }
}

function copyAgents() {
  console.log('\n--- Copying agent descriptions ---');
  if (!fs.existsSync(AGENTS_SOURCE)) {
    console.warn('Warning: Agents directory not found');
    return;
  }

  const files = fs.readdirSync(AGENTS_SOURCE).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const src = path.join(AGENTS_SOURCE, file);
    const dest = path.join(SITE_DIR, 'agents', file);
    const title = file.replace('.md', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    copyMarkdownWithFrontMatter(src, dest, {
      layout: 'base.njk',
      title: title
    });
  }
}

function copySkills() {
  console.log('\n--- Copying skills ---');
  if (!fs.existsSync(SKILLS_SOURCE)) {
    console.warn('Warning: Skills directory not found');
    return;
  }

  const files = fs.readdirSync(SKILLS_SOURCE).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const src = path.join(SKILLS_SOURCE, file);
    const dest = path.join(SITE_DIR, 'skills', file);
    const title = file.replace('.md', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    copyMarkdownWithFrontMatter(src, dest, {
      layout: 'base.njk',
      title: title
    });
  }
}

async function createZipPackages() {
  console.log('\n--- Creating ZIP packages ---');
  const downloadsDir = path.join(SITE_DIR, 'downloads');
  ensureDir(downloadsDir);

  for (const song of SONGS) {
    const zipPath = path.join(downloadsDir, `${song.slug}.zip`);

    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        console.log(`Created: ${song.slug}.zip (${archive.pointer()} bytes)`);
        resolve();
      });

      archive.on('error', reject);
      archive.pipe(output);

      // Add MIDI files
      const midiDir = path.join(MIDI_SOURCE, song.slug);
      if (fs.existsSync(midiDir)) {
        archive.directory(midiDir, 'midi');
      }

      // Add sheet music (markdown files)
      const sheetsDir = path.join(SONGS_SOURCE, song.slug);
      if (fs.existsSync(sheetsDir)) {
        const mdFiles = fs.readdirSync(sheetsDir).filter(f => f.endsWith('.md'));
        for (const file of mdFiles) {
          archive.file(path.join(sheetsDir, file), { name: `sheets/${file}` });
        }
      }

      archive.finalize();
    });
  }
}

function runEleventy() {
  console.log('\n--- Running Eleventy ---');
  try {
    execSync('npx @11ty/eleventy', { cwd: ROOT, stdio: 'inherit' });
    console.log('Eleventy build complete!');
  } catch (error) {
    console.error('Eleventy build failed:', error.message);
    process.exit(1);
  }
}

async function main() {
  console.log('Building Guro and the Muppets website...\n');

  // Copy source files
  copyMidiFiles();
  copySongParts();
  copyKnowledgeArticles();
  copyAgents();
  copySkills();

  // Create downloadable packages
  await createZipPackages();

  // Run Eleventy to generate the site
  runEleventy();

  console.log('\n✓ Build complete! Output in docs/ directory');
}

main().catch(console.error);
