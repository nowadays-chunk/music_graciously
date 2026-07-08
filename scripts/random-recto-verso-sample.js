#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

const root = path.resolve('instagram');
const outRoot = path.resolve('random-couples');
const COUPLES_COUNT = 3;
const CATEGORIES = ['scale', 'chord', 'arpeggio'];
const SKIP_CHORD_INSTRUMENTS = ['bass ukulele'];

function pad(value) {
  return String(value).padStart(2, '0');
}

function timestamp(date = new Date()) {
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;
}

const outDir = path.join(outRoot, timestamp());

const png = (p) => p.toLowerCase().endsWith('.png');
const side = (name) => name.match(/(?:^|[_-])(recto|verso)(?:\.[^.]+)?$/i)?.[1]?.toLowerCase();
const base = (name) => name.replace(/[_-](recto|verso)(?=\.[^.]+$)/i, '');
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const normalize = (value) => String(value).toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
const folderSafe = (value) => String(value).replace(/[<>:"/\\|?*]+/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

function categoryFromParts(parts) {
  return parts.map(normalize).find((part) => CATEGORIES.includes(part)) || 'unknown';
}

function shouldSkipFile(instrument, category) {
  return SKIP_CHORD_INSTRUMENTS.includes(normalize(instrument)) && category === 'chord';
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile() && png(full)) files.push(full);
  }
  return files;
}

function chooseCouples(byInstrument) {
  const instruments = shuffle([...byInstrument.keys()]);
  const choices = [];
  const used = new Set();

  for (const instrument of instruments) {
    if (choices.length >= COUPLES_COUNT) break;
    const pair = pick(byInstrument.get(instrument));
    used.add(pair.key);
    choices.push({ instrument, pair });
  }

  const allPairs = shuffle(
    [...byInstrument.entries()].flatMap(([instrument, pairs]) =>
      pairs.map((pair) => ({ instrument, pair }))
    )
  );

  for (const choice of allPairs) {
    if (choices.length >= COUPLES_COUNT) break;
    if (used.has(choice.pair.key)) continue;
    used.add(choice.pair.key);
    choices.push(choice);
  }

  while (choices.length < COUPLES_COUNT && allPairs.length > 0) {
    choices.push(pick(allPairs));
  }

  return choices;
}

async function main() {
  const files = await walk(root);
  const pairs = new Map();
  let skippedCount = 0;

  for (const file of files) {
    const rel = path.relative(root, file);
    const parts = rel.split(path.sep);
    const instrument = parts[0];
    const category = categoryFromParts(parts);
    const fileSide = side(path.basename(file));
    if (!instrument || !fileSide) continue;
    if (shouldSkipFile(instrument, category)) {
      skippedCount += 1;
      continue;
    }

    const key = [instrument, path.dirname(rel), base(path.basename(file))].join('|');
    pairs.set(key, { ...(pairs.get(key) || { instrument, category, key }), [fileSide]: file });
  }

  const byInstrument = new Map();
  for (const pair of pairs.values()) {
    if (!pair.recto || !pair.verso) continue;
    byInstrument.set(pair.instrument, [...(byInstrument.get(pair.instrument) || []), pair]);
  }

  if (byInstrument.size === 0) {
    throw new Error('No instruments with recto/verso pairs found in ./instagram.');
  }

  const choices = chooseCouples(byInstrument);

  await fs.mkdir(outDir, { recursive: true });
  for (const [index, { instrument, pair }] of choices.entries()) {
    const coupleNumber = pad(index + 1);
    const category = pair.category || 'unknown';
    const dir = path.join(outDir, `${coupleNumber}-${folderSafe(instrument)}-${folderSafe(category)}`);
    await fs.mkdir(dir, { recursive: true });
    await fs.copyFile(pair.recto, path.join(dir, path.basename(pair.recto)));
    await fs.copyFile(pair.verso, path.join(dir, path.basename(pair.verso)));
    console.log(`${coupleNumber}. ${instrument} ${category}: ${path.relative(root, pair.recto)} + ${path.relative(root, pair.verso)}`);
  }

  if (skippedCount > 0) console.log(`Skipped ${skippedCount} bass ukulele chord file(s).`);
  console.log(`Saved ${choices.length} couple(s) to ${path.relative(process.cwd(), outDir)}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
