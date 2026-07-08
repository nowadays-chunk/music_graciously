import { useEffect } from 'react';
import { useRouter } from 'next/router';

const dataUrlCache = new Map();
const GLAMOUR_PREVIEW_PATTERN = /\/api\/glamour-preview\/(\d{1,3})/;

const extractSlug = (value = '') => {
  const match = String(value).match(GLAMOUR_PREVIEW_PATTERN);
  return match?.[1] ? String(match[1]).padStart(2, '0') : null;
};

const getDataUrl = async (slug) => {
  if (dataUrlCache.has(slug)) return dataUrlCache.get(slug);

  const response = await fetch(`/api/glamour-data/${slug}`);
  if (!response.ok) throw new Error(`Unable to load glamour data URL ${slug}`);

  const payload = await response.json();
  if (!payload?.dataUrl) throw new Error(`Missing glamour data URL ${slug}`);

  const originalGlamourDataBase64 = payload.dataUrl;
  dataUrlCache.set(slug, originalGlamourDataBase64);
  return originalGlamourDataBase64;
};

const hydrateImageElement = async (element) => {
  const currentSrc = element.getAttribute('src') || element.currentSrc || '';
  const slug = extractSlug(currentSrc);
  if (!slug || element.dataset.glamourDataUrlHydrated === 'true') return;

  try {
    const originalGlamourDataBase64 = await getDataUrl(slug);
    element.src = originalGlamourDataBase64;
    element.setAttribute('src', originalGlamourDataBase64);
    element.dataset.glamourDataUrlHydrated = 'true';
  } catch (error) {
    element.dataset.glamourDataUrlHydrated = 'failed';
  }
};

const hydrateSvgImageElement = async (element) => {
  const currentHref = element.getAttribute('href') || element.getAttribute('xlink:href') || '';
  const slug = extractSlug(currentHref);
  if (!slug || element.dataset.glamourDataUrlHydrated === 'true') return;

  try {
    const originalGlamourDataBase64 = await getDataUrl(slug);
    element.setAttribute('href', originalGlamourDataBase64);
    element.setAttribute('xlink:href', originalGlamourDataBase64);
    element.dataset.glamourDataUrlHydrated = 'true';
  } catch (error) {
    element.dataset.glamourDataUrlHydrated = 'failed';
  }
};

const hydrateGlamourPreviewElements = () => {
  if (typeof document === 'undefined') return;

  document.querySelectorAll('img[src*="/api/glamour-preview/"]').forEach((element) => {
    hydrateImageElement(element);
  });

  document.querySelectorAll('image[href*="/api/glamour-preview/"], image[xlink\\:href*="/api/glamour-preview/"]').forEach((element) => {
    hydrateSvgImageElement(element);
  });
};

const GlamourPreviewDataUrlHydrator = () => {
  const router = useRouter();

  useEffect(() => {
    hydrateGlamourPreviewElements();
    const observer = new MutationObserver(() => hydrateGlamourPreviewElements());
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'href', 'xlink:href'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    hydrateGlamourPreviewElements();
  }, [router.asPath]);

  return null;
};

export default GlamourPreviewDataUrlHydrator;
