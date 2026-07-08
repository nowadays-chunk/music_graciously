import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createPRNG, GLAMOUR_PALETTES, GLAMOUR_TEMPLATES, GLAMOUR_TERMS } from '../../components/Graphics/DynamicArtworks';

const PRIVATE_DIR = path.join(process.cwd(), 'private-assets', 'glamour-svg');
const PATTERNS = ['grid', 'dots', 'stripes', 'rays'];

const normalizeSlug = (slug) => String(slug || '').padStart(2, '0');

const isValidSlug = (slug) => /^\d{1,3}$/.test(String(slug || ''));

const findOriginalPng = (slug) => {
  const normalized = normalizeSlug(slug);
  if (!fs.existsSync(PRIVATE_DIR)) return null;

  const file = fs
    .readdirSync(PRIVATE_DIR)
    .find((name) => name.startsWith(`${normalized}-`) && name.toLowerCase().endsWith('.png'));

  return file ? path.join(PRIVATE_DIR, file) : null;
};

const fileToDataUrl = (filePath) => {
  const image = fs.readFileSync(filePath);
  return {
    src: `data:image/png;base64,${image.toString('base64')}`,
    mimeType: 'image/png',
    source: 'private-png',
  };
};

const escapeSvg = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const generateOriginalSvgDataUrl = (slug) => {
  const normalized = normalizeSlug(slug);
  const index = Math.max(0, Number(normalized) - 1);
  const template = GLAMOUR_TEMPLATES[index % GLAMOUR_TEMPLATES.length];
  const palette = GLAMOUR_PALETTES[index % GLAMOUR_PALETTES.length];
  const rand = createPRNG(`glamour-original-${normalized}`);
  const term1 = GLAMOUR_TERMS[index % GLAMOUR_TERMS.length];
  const term2 = GLAMOUR_TERMS[(index * 7 + 3) % GLAMOUR_TERMS.length];
  const patternId = `glamour-pattern-${normalized}`;
  const patternType = PATTERNS[index % PATTERNS.length];
  const artworkMarkup = renderToStaticMarkup(
    <>{template.render(rand, palette.colors, term1, term2, patternId, patternType)}</>
  );
  const title = escapeSvg(template.name || `Glamour artwork ${normalized}`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 400 400" role="img" aria-label="${title}">${artworkMarkup}</svg>`;

  return {
    src: `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`,
    mimeType: 'image/svg+xml',
    source: 'generated-original-svg',
  };
};

export const getGlamourDataUrlPayload = (slug) => {
  if (!isValidSlug(slug)) {
    const err = new Error('Invalid slug.');
    err.statusCode = 400;
    throw err;
  }

  const normalized = normalizeSlug(slug);
  const originalPng = findOriginalPng(normalized);
  const data = originalPng ? fileToDataUrl(originalPng) : generateOriginalSvgDataUrl(normalized);

  return {
    slug: normalized,
    mimeType: data.mimeType,
    src: data.src,
    dataUrl: data.src,
    source: data.source,
  };
};

export const sendGlamourDataUrlResponse = (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const slug = Array.isArray(req.query.slug) ? req.query.slug[0] : req.query.slug;

  try {
    const payload = getGlamourDataUrlPayload(slug);
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
    return res.status(200).json(payload);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message || 'Unable to build glamour data URL.' });
  }
};
