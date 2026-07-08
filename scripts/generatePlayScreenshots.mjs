import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import guitar from '../config/guitar.js';

// ─── Constants ─────────────────────────────────────────────────────────────────
const VALID_INSTRUMENTS = [
  'guitar', 'piano', 'ukulele', 'violin', 'bass', 'double-bass', 'trumpet', 'saxophone'
];
const KEYS = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const VALID_CATEGORIES = ['scale', 'chord', 'arpeggio'];

// Helper to convert key name (e.g. C#) to URL slug (Csharp)
const keyToSlug = (key) => key.replace('#', 'sharp');

// Helper to convert mode name (e.g. "Dorian") to URL slug
const modeNameToSlug = (modeName) =>
  String(modeName || '')
    .trim()
    .toLowerCase()
    .replace(/#/g, 'sharp')
    .replace(/\s+/g, '-');

const hasPdfHeader = (bytes) => bytes.subarray(0, 1024).toString('latin1').includes('%PDF-');

const isValidPdf = async (pdfPath) => {
  if (!(await fs.pathExists(pdfPath))) return false;

  try {
    const stats = await fs.stat(pdfPath);
    if (!stats.isFile() || stats.size < 5) return false;

    const bytes = await fs.readFile(pdfPath);
    if (!hasPdfHeader(bytes)) return false;

    await PDFDocument.load(bytes);
    return true;
  } catch {
    return false;
  }
};

const writeImagePdf = async (imagePath, pdfPath) => {
  const meta = await sharp(imagePath).metadata();
  const pdf = await PDFDocument.create();
  const pngBytes = await fs.readFile(imagePath);
  const embeddedPng = await pdf.embedPng(pngBytes);
  const page = pdf.addPage([meta.width, meta.height]);

  page.drawImage(embeddedPng, {
    x: 0,
    y: 0,
    width: meta.width,
    height: meta.height
  });

  await fs.ensureDir(path.dirname(pdfPath));
  await fs.writeFile(pdfPath, await pdf.save());
};

// ─── Argument Parsing ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const options = {
  instrument: 'all',
  key: 'all',
  category: 'all',
  concurrency: 4,
  limit: null,
  local: false
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--instrument') {
    options.instrument = args[++i];
  } else if (args[i] === '--key') {
    options.key = args[++i];
  } else if (args[i] === '--category') {
    options.category = args[++i];
  } else if (args[i] === '--concurrency') {
    options.concurrency = parseInt(args[++i], 10);
  } else if (args[i] === '--limit') {
    options.limit = parseInt(args[++i], 10);
  } else if (args[i] === '--local') {
    options.local = true;
  }
}

// ─── Options Resolution ───────────────────────────────────────────────────────
const instruments = options.instrument === 'all'
  ? VALID_INSTRUMENTS
  : options.instrument.split(',').map(s => s.trim().toLowerCase()).filter(inst => VALID_INSTRUMENTS.includes(inst));

const rawKeysInput = options.key === 'all'
  ? KEYS
  : options.key.split(',').map(s => s.trim());

// Map input keys (like Csharp -> C#)
const keys = rawKeysInput.map(inputKey => {
  const normalized = inputKey.replace(/sharp/gi, '#');
  return KEYS.includes(normalized) ? normalized : null;
}).filter(Boolean);

const categories = options.category === 'all'
  ? VALID_CATEGORIES
  : options.category.split(',').map(s => s.trim().toLowerCase()).filter(cat => VALID_CATEGORIES.includes(cat));

const BASE_URL = options.local ? 'http://localhost:3000' : 'https://www.musicgraciously.com';

console.log('=== SCREENSHOT GENERATION OPTIONS ===');
console.log('Instruments:', instruments.join(', '));
console.log('Keys:       ', keys.join(', '));
console.log('Categories: ', categories.join(', '));
console.log('Concurrency:', options.concurrency);
console.log('Limit:      ', options.limit ? options.limit : 'None');
console.log('Mode:       ', options.local ? 'Local (http://localhost:3000)' : 'Production (https://www.musicgraciously.com)');
console.log('=====================================\n');

if (instruments.length === 0 || keys.length === 0 || categories.length === 0) {
  console.error('Error: Invalid instrument, key, or category specification.');
  process.exit(1);
}

// ─── Build Tasks ─────────────────────────────────────────────────────────────
const tasks = [];
const tempDir = path.join('screens', '.temp');

for (const instrument of instruments) {
  for (const key of keys) {
    const keySlug = keyToSlug(key);

    for (const category of categories) {
      if (category === 'chord' || category === 'arpeggio') {
        let types = Object.keys(guitar.arppegios);
        if (options.limit !== null) {
          types = types.slice(0, options.limit);
        }

        for (const type of types) {
          const typeName = guitar.arppegios[type]?.name || type;
          const typeSlug = type.replace(/#/g, 'sharp');
          const url = `${BASE_URL}/play/${instrument}/${keySlug}/${category}/${typeSlug}/notes`;

          const relativePath = path.join(instrument, keySlug, category, typeSlug);
          tasks.push({
            instrument,
            key,
            keySlug,
            category,
            type,
            typeName,
            url,
            rectoRawPath: path.join(tempDir, `${relativePath}_recto.png`),
            versoRawPath: path.join(tempDir, `${relativePath}_verso.png`),
            rectoFinalPng: path.join('screens', `${relativePath}_recto.png`),
            versoFinalPng: path.join('screens', `${relativePath}_verso.png`),
            rectoFinalPdf: path.join('screens', `${relativePath}_recto.pdf`),
            versoFinalPdf: path.join('screens', `${relativePath}_verso.pdf`)
          });
        }
      } else if (category === 'scale') {
        let types = Object.keys(guitar.scales);
        if (options.limit !== null) {
          types = types.slice(0, options.limit);
        }

        for (const type of types) {
          const scaleData = guitar.scales[type];
          if (!scaleData) continue;

          if (scaleData.isModal && scaleData.modes?.length) {
            for (const mode of scaleData.modes) {
              const modeSlug = modeNameToSlug(mode.name);
              const url = `${BASE_URL}/play/${instrument}/${keySlug}/scale/${type}/notes/${modeSlug}`;

              const relativePath = path.join(instrument, keySlug, 'scale', `${type}_${modeSlug}`);
              tasks.push({
                instrument,
                key,
                keySlug,
                category,
                type,
                typeName: `${scaleData.name} - ${mode.name}`,
                modeSlug,
                modeName: mode.name,
                url,
                rectoRawPath: path.join(tempDir, `${relativePath}_recto.png`),
                versoRawPath: path.join(tempDir, `${relativePath}_verso.png`),
                rectoFinalPng: path.join('screens', `${relativePath}_recto.png`),
                versoFinalPng: path.join('screens', `${relativePath}_verso.png`),
                rectoFinalPdf: path.join('screens', `${relativePath}_recto.pdf`),
                versoFinalPdf: path.join('screens', `${relativePath}_verso.pdf`)
              });
            }
          } else {
            const url = `${BASE_URL}/play/${instrument}/${keySlug}/scale/${type}/notes`;
            const relativePath = path.join(instrument, keySlug, 'scale', type);
            tasks.push({
              instrument,
              key,
              keySlug,
              category,
              type,
              typeName: scaleData.name || type,
              url,
              rectoRawPath: path.join(tempDir, `${relativePath}_recto.png`),
              versoRawPath: path.join(tempDir, `${relativePath}_verso.png`),
              rectoFinalPng: path.join('screens', `${relativePath}_recto.png`),
              versoFinalPng: path.join('screens', `${relativePath}_verso.png`),
              rectoFinalPdf: path.join('screens', `${relativePath}_recto.pdf`),
              versoFinalPdf: path.join('screens', `${relativePath}_verso.pdf`)
            });
          }
        }
      }
    }
  }
}

console.log(`Total crawling tasks generated: ${tasks.length}`);

// ─── Crawler helper for a single task list ─────────────────────────────────────
const crawlTasks = async (page, queue) => {
  if (queue.length === 0) return;

  for (let i = 0; i < queue.length; i++) {
    const task = queue[i];
    const progress = `[${i + 1}/${queue.length}]`;
    console.log(`  ${progress} Capturing ${task.instrument} ${task.key} ${task.category} ${task.type}${task.modeSlug ? ' (' + task.modeSlug + ')' : ''}...`);

    try {
      // 1. Load recto (Visualizer active by default)
      await page.goto(task.url, { waitUntil: 'domcontentloaded', timeout: 120000 });

      // Wait until applying settings loader is gone
      await page.waitForFunction(() => {
        return !document.body.innerText.includes("Applying settings…");
      }, { timeout: 25000 }).catch(() => {
        console.warn(`    ⚠️ Timeout waiting for "Applying settings..." to clear on ${task.url}, proceeding anyway.`);
      });

      // Wait for visualizer canvas or svg
      await page.waitForSelector("canvas, svg", { timeout: 15000 }).catch(() => {
        console.warn(`    ⚠️ Visualizer (canvas/svg) not found on ${task.url}`);
      });

      // Extra stabilizing wait
      await new Promise(res => setTimeout(res, 1000));

      // Inject style to hide "Play" column and remove max-width constraints on the layout
      await page.addStyleTag({
        content: `
          /* Hide Play column in tables */
          table th:nth-child(4),
          table td:nth-child(4) {
            display: none !important;
          }
          /* Remove maximum width restrictions so components can layout fully wide */
          div, main, section, .MuiContainer-root {
            max-width: none !important;
          }
        `
      }).catch(e => {
        console.warn(`    ⚠️ Failed to inject CSS overrides: ${e.message}`);
      });

      // Get Visualizer Tab Container element handle
      const rectoHandle = await page.evaluateHandle(() => {
        const h5 = Array.from(document.querySelectorAll('h5')).find(el => el.textContent.includes('✨'));
        if (!h5) return null;
        return h5.parentElement.parentElement;
      });

      if (!rectoHandle) {
        throw new Error("Could not locate Visualizer Tab Container (grandparent of title h5)");
      }

      const rectoElement = rectoHandle.asElement();
      if (!rectoElement) {
        throw new Error("Visualizer Tab Container handle is not an Element");
      }

      // Take Recto screenshot
      await fs.ensureDir(path.dirname(task.rectoRawPath));
      await rectoElement.screenshot({ path: task.rectoRawPath });

      // 2. Load verso (Theory tab)
      const tabClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const theoryBtn = buttons.find(btn => btn.textContent.includes('Theory'));
        if (theoryBtn) {
          theoryBtn.click();
          return true;
        }
        return false;
      });

      if (!tabClicked) {
        throw new Error("Failed to find or click 'Theory' tab button");
      }

      // Wait for Theory content to render (table should contain th)
      await page.waitForSelector("table th", { timeout: 10000 }).catch(() => {
        console.warn(`    ⚠️ Theory table th not found, proceeding with screenshot.`);
      });

      // Inject style again for Theory tab just in case
      await page.addStyleTag({
        content: `
          table th:nth-child(4),
          table td:nth-child(4) {
            display: none !important;
          }
          div, main, section, .MuiContainer-root {
            max-width: none !important;
          }
        `
      }).catch(e => {
        console.warn(`    ⚠️ Failed to inject CSS overrides on theory tab: ${e.message}`);
      });

      // Wait short moment for render settle
      await new Promise(res => setTimeout(res, 500));

      // Get Theory Tab Container element handle
      const versoHandle = await page.evaluateHandle(() => {
        const h4 = document.querySelector('h4');
        if (!h4) return null;
        return h4.parentElement.parentElement;
      });

      if (!versoHandle) {
        throw new Error("Could not locate Theory Tab Container (grandparent of title h4)");
      }

      const versoElement = versoHandle.asElement();
      if (!versoElement) {
        throw new Error("Theory Tab Container handle is not an Element");
      }

      // Take Verso screenshot
      await fs.ensureDir(path.dirname(task.versoRawPath));
      await versoElement.screenshot({ path: task.versoRawPath });

      task.success = true;
    } catch (err) {
      task.success = false;
      task.error = err.message;
      console.error(`    ❌ Failed task: ${task.url} - Error: ${err.message}`);
    }
  }
};

// ─── Image Processing & PDF Merging helper for a single set ───────────────────
const processAndMergeSet = async (instrument, key, keySlug, category, setTasks) => {
  const successfulTasks = setTasks.filter(t => t.success);
  if (successfulTasks.length === 0) {
    console.log(`  ⚠️ No successful tasks to merge for set: ${instrument} - ${key} - ${category}`);
    return;
  }

  console.log(`  Processing & merging set: ${instrument} - ${key} - ${category} (${successfulTasks.length} successful items)...`);

  // 1. Process images and generate individual page PDFs
  for (const task of successfulTasks) {
    for (const [rawPath, finalPngPath, finalPdfPath] of [
      [task.rectoRawPath, task.rectoFinalPng, task.rectoFinalPdf],
      [task.versoRawPath, task.versoFinalPng, task.versoFinalPdf]
    ]) {
      if (!(await fs.pathExists(rawPath))) {
        continue;
      }

      // If task was skipped (raw exist) and final files exist, reuse them only when the PDF is valid too.
      if (task.skipped && await fs.pathExists(finalPngPath) && await fs.pathExists(finalPdfPath)) {
        const rawMeta = await sharp(rawPath).metadata();
        const finalMeta = await sharp(finalPngPath).metadata();
        const pdfValid = await isValidPdf(finalPdfPath);
        if (rawMeta.width === finalMeta.width && rawMeta.height === finalMeta.height && pdfValid) {
          continue;
        }
        if (!pdfValid) {
          console.warn(`  ⚠️ Invalid PDF found, regenerating: ${finalPdfPath}`);
        }
      }

      // Copy image without padding
      await fs.ensureDir(path.dirname(finalPngPath));
      await fs.copy(rawPath, finalPngPath);

      // Generate matching PDF page matching original image dimensions
      await writeImagePdf(finalPngPath, finalPdfPath);
    }
  }

  // 3. Sort tasks naturally by type
  successfulTasks.sort((a, b) => {
    const typeCompare = a.type.localeCompare(b.type, undefined, { numeric: true, sensitivity: 'base' });
    if (typeCompare !== 0) return typeCompare;
    const modeA = a.modeSlug || '';
    const modeB = b.modeSlug || '';
    return modeA.localeCompare(modeB);
  });

  // 4. Merge PDFs into single output
  const mergedPdf = await PDFDocument.create();
  let mergedPageCount = 0;

  const addPdfPage = async (pdfPath) => {
    if (!(await fs.pathExists(pdfPath))) return;
    if (!(await isValidPdf(pdfPath))) {
      console.warn(`  ⚠️ Skipping invalid PDF during merge: ${pdfPath}`);
      return;
    }

    const bytes = await fs.readFile(pdfPath);
    const tempPdf = await PDFDocument.load(bytes);
    const [copiedPage] = await mergedPdf.copyPages(tempPdf, [0]);
    mergedPdf.addPage(copiedPage);
    mergedPageCount += 1;
  };

  for (const task of successfulTasks) {
    await addPdfPage(task.rectoFinalPdf);
    await addPdfPage(task.versoFinalPdf);
  }

  if (mergedPageCount === 0) {
    console.log(`  ⚠️ No valid PDF pages to merge for set: ${instrument} - ${key} - ${category}`);
    return;
  }

  const mergedPath = path.join('screens', instrument, `${instrument}_${keySlug}_${category}_merged.pdf`);
  await fs.ensureDir(path.dirname(mergedPath));
  await fs.writeFile(mergedPath, await mergedPdf.save());
  console.log(`  ✅ Created/Updated merged PDF: ${mergedPath}\n`);
};

// ─── Main Execution ───────────────────────────────────────────────────────────
(async () => {
  const startTime = Date.now();

  try {
    console.log(`Starting Puppeteer browser once...`);
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      userDataDir: "./chrome-profile",
      args: [
        "--window-size=1310,2400",
        "--disable-web-security"
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1310, height: 2400, deviceScaleFactor: 4 });

    // Enable request interception to block trackers and ads for performance
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const url = req.url();
      if (
        url.includes('google-analytics') ||
        url.includes('googletagmanager') ||
        url.includes('doubleclick') ||
        url.includes('googleadservices') ||
        url.includes('facebook') ||
        url.includes('hotjar')
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // We process sets sequentially: Instrument -> Key -> Category
    for (const instrument of instruments) {
      for (const key of keys) {
        const keySlug = keyToSlug(key);
        for (const category of categories) {
          // Filter tasks belonging to the current set
          const setTasks = tasks.filter(
            t => t.instrument === instrument && t.keySlug === keySlug && t.category === category
          );

          if (setTasks.length === 0) continue;

          const mergedPath = path.join('screens', instrument, `${instrument}_${keySlug}_${category}_merged.pdf`);
          if (await fs.pathExists(mergedPath)) {
            if (await isValidPdf(mergedPath)) {
              console.log(`=== SKIPPING SET (Merged PDF already exists): ${instrument} - ${key} - ${category} ===\n`);
              continue;
            }
            console.warn(`=== REBUILDING SET (Merged PDF is invalid): ${instrument} - ${key} - ${category} ===`);
          }

          console.log(`=== RUNNING SET: ${instrument} - ${key} - ${category} ===`);

          // Determine which tasks need to be crawled
          const setQueue = [];
          for (const task of setTasks) {
            const filesExist = await Promise.all([
              fs.pathExists(task.rectoRawPath),
              fs.pathExists(task.versoRawPath)
            ]);

            if (filesExist.every(Boolean)) {
              task.success = true;
              task.skipped = true;
            } else {
              setQueue.push(task);
            }
          }

          if (setQueue.length > 0) {
            console.log(`  Crawling ${setQueue.length} tasks...`);
            await crawlTasks(page, setQueue);
          } else {
            console.log(`  All tasks in this set already exist. Skipping crawl.`);
          }

          // Process and merge this set immediately
          await processAndMergeSet(instrument, key, keySlug, category, setTasks);
        }
      }
    }

    await page.close();
    await browser.close();

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n🎉 ALL COMPLETED SUCCESSFULLY in ${duration}s!`);
    console.log('Results saved under "./screens"');

  } catch (error) {
    console.error('\nFatal Error in main script execution:', error.stack || error);
    process.exit(1);
  }
})();
