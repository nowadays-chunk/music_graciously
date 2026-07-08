#!/usr/bin/env node

/*
 * Fit PNG or PDF media into exact Instagram post canvases without distortion.
 * Default output is exactly 1080x1080.
 *
 * Usage:
 *   node scripts/fit-instagram.js ./screens
 *   node scripts/fit-instagram.js ./screens/example.png
 *   node scripts/fit-instagram.js ./screens/example.pdf
 *   node scripts/fit-instagram.js ./screens --ratio 4:5 --width 1080
 *
 * Results are written under ./instagram at the project/current working root.
 * - File input:      ./instagram/<name>-instagram.png
 * - PDF input:       ./instagram/<name>-page-001-instagram.png, etc.
 * - Directory input: ./instagram/<same nested hierarchy>/<file>.png
 */

const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const DEFAULT_RATIO = '1:1';
const DEFAULT_WIDTH = 1080;
const OUTPUT_DIR_NAME = 'instagram';
const BACKGROUND = { r: 255, g: 255, b: 255, alpha: 1 };
const SKIP_DIRS = new Set(['.git', 'node_modules', '.next', OUTPUT_DIR_NAME]);

function printUsageAndExit() {
  console.error(`Usage: node scripts/fit-instagram.js <png|pdf|directory> [--ratio 1:1|4:5|1.91:1] [--width 1080]\n\nExamples:\n  node scripts/fit-instagram.js ./screens\n  node scripts/fit-instagram.js ./screens/image.png\n  node scripts/fit-instagram.js ./screens/file.pdf\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const input = args.find((arg) => !arg.startsWith('--'));

  if (!input) printUsageAndExit();

  const options = {
    input,
    ratio: DEFAULT_RATIO,
    width: DEFAULT_WIDTH,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '--ratio') {
      options.ratio = args[i + 1];
      i += 1;
    } else if (arg.startsWith('--ratio=')) {
      options.ratio = arg.slice('--ratio='.length);
    } else if (arg === '--width') {
      options.width = Number(args[i + 1]);
      i += 1;
    } else if (arg.startsWith('--width=')) {
      options.width = Number(arg.slice('--width='.length));
    }
  }

  if (!Number.isFinite(options.width) || options.width <= 0) {
    throw new Error('--width must be a positive number.');
  }

  const target = parseRatio(options.ratio, options.width);

  return {
    ...options,
    targetWidth: target.width,
    targetHeight: target.height,
  };
}

function parseRatio(ratio, width) {
  const normalized = String(ratio || '').trim();
  const parts = normalized.split(':').map(Number);

  if (parts.length !== 2 || parts.some((part) => !Number.isFinite(part) || part <= 0)) {
    throw new Error(`Invalid ratio "${ratio}". Use values like 1:1, 4:5, or 1.91:1.`);
  }

  const [ratioWidth, ratioHeight] = parts;

  return {
    width: Math.round(width),
    height: Math.round((width * ratioHeight) / ratioWidth),
  };
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function isPng(filePath) {
  return path.extname(filePath).toLowerCase() === '.png';
}

function isPdf(filePath) {
  return path.extname(filePath).toLowerCase() === '.pdf';
}

async function collectMediaFiles(rootDir) {
  const files = [];

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) {
          await walk(fullPath);
        }
        continue;
      }

      if (entry.isFile() && (isPng(fullPath) || isPdf(fullPath))) {
        files.push(fullPath);
      }
    }
  }

  await walk(rootDir);
  return files;
}

function outputBaseForFile(inputPath, options) {
  const outputRoot = path.join(process.cwd(), OUTPUT_DIR_NAME);
  const parsed = path.parse(inputPath);

  if (options.mode === 'directory') {
    const relativePath = path.relative(options.inputRoot, inputPath);
    const relativeParsed = path.parse(relativePath);
    return path.join(outputRoot, relativeParsed.dir, relativeParsed.name);
  }

  return path.join(outputRoot, `${parsed.name}-instagram`);
}

async function fitImageBufferToInstagram(buffer, outputPath, options) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const normalized = await sharp(buffer)
    .rotate()
    .flatten({ background: BACKGROUND })
    .png()
    .toBuffer();

  const meta = await sharp(normalized).metadata();
  if (!meta.width || !meta.height) {
    throw new Error(`Could not read image dimensions for ${outputPath}`);
  }

  // One shared scale factor keeps the original width/height ratio intact.
  // If width is shrunk, height is shrunk by the exact same proportion.
  const scale = Math.min(options.targetWidth / meta.width, options.targetHeight / meta.height);
  const fittedWidth = Math.max(1, Math.round(meta.width * scale));
  const fittedHeight = Math.max(1, Math.round(meta.height * scale));
  const left = Math.round((options.targetWidth - fittedWidth) / 2);
  const top = Math.round((options.targetHeight - fittedHeight) / 2);

  const resized = await sharp(normalized)
    .resize(fittedWidth, fittedHeight, {
      fit: 'fill',
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: false,
    })
    .png({ compressionLevel: 9, quality: 100 })
    .toBuffer();

  await sharp({
    create: {
      width: options.targetWidth,
      height: options.targetHeight,
      channels: 4,
      background: BACKGROUND,
    },
  })
    .composite([{ input: resized, left, top }])
    .flatten({ background: BACKGROUND })
    .png({ compressionLevel: 9, quality: 100 })
    .toFile(outputPath);

  const written = await sharp(outputPath).metadata();
  if (written.width !== options.targetWidth || written.height !== options.targetHeight) {
    throw new Error(
      `Output is ${written.width}x${written.height}, expected ${options.targetWidth}x${options.targetHeight}: ${outputPath}`
    );
  }
}

async function fitPng(inputPath, outputBase, options) {
  const outputPath = `${outputBase}.png`;
  const buffer = await fs.readFile(inputPath);
  await fitImageBufferToInstagram(buffer, outputPath, options);
  return [outputPath];
}

async function fitPdf(inputPath, outputBase, options) {
  const metadata = await sharp(inputPath, { density: 220 }).metadata();
  const pages = Math.max(1, metadata.pages || 1);
  const outputs = [];

  for (let page = 0; page < pages; page += 1) {
    const pageLabel = String(page + 1).padStart(3, '0');
    const outputPath = pages === 1 ? `${outputBase}.png` : `${outputBase}-page-${pageLabel}.png`;

    const buffer = await sharp(inputPath, { page, density: 220 }).png().toBuffer();
    await fitImageBufferToInstagram(buffer, outputPath, options);
    outputs.push(outputPath);
  }

  return outputs;
}

async function processFile(inputPath, options) {
  const outputBase = outputBaseForFile(inputPath, options);

  if (isPng(inputPath)) {
    return fitPng(inputPath, outputBase, options);
  }

  if (isPdf(inputPath)) {
    return fitPdf(inputPath, outputBase, options);
  }

  return [];
}

async function main() {
  const options = parseArgs(process.argv);
  const absoluteInput = path.resolve(options.input);

  if (!(await pathExists(absoluteInput))) {
    throw new Error(`Input path does not exist: ${absoluteInput}`);
  }

  const stat = await fs.stat(absoluteInput);
  let files = [];

  if (stat.isDirectory()) {
    options.mode = 'directory';
    options.inputRoot = absoluteInput;
    files = await collectMediaFiles(absoluteInput);
  } else if (stat.isFile() && (isPng(absoluteInput) || isPdf(absoluteInput))) {
    options.mode = 'file';
    options.inputRoot = path.dirname(absoluteInput);
    files = [absoluteInput];
  } else {
    throw new Error('Input must be a PNG file, a PDF file, or a directory containing PNG/PDF files.');
  }

  if (files.length === 0) {
    console.log('No PNG or PDF files found.');
    return;
  }

  let written = 0;

  for (const file of files) {
    const outputs = await processFile(file, options);
    written += outputs.length;

    for (const output of outputs) {
      console.log(`${path.relative(process.cwd(), file)} -> ${path.relative(process.cwd(), output)} (${options.targetWidth}x${options.targetHeight})`);
    }
  }

  console.log(`Done. Wrote ${written} Instagram PNG file(s) to ./${OUTPUT_DIR_NAME}/ at ${options.targetWidth}x${options.targetHeight}.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
