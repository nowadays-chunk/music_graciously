import glamourProducts from '../../data/glamourSvgProducts.json';

export const GLAMOUR_PRIVATE_ASSET_PREFIX = '/private-assets/glamour-svg/';
export const GLAMOUR_PUBLIC_ASSET_PREFIX = '/glamour-svg/';

export const normalizeGlamourPreviewSlug = (slug) => String(slug ?? '').padStart(2, '0');

export const toPublicGlamourPngSrc = (value) => String(value || '')
  .replace(GLAMOUR_PRIVATE_ASSET_PREFIX, GLAMOUR_PUBLIC_ASSET_PREFIX);

const getProductSlug = (product) => {
  const match = String(product?.id || '').match(/glamour-(?:svg|png)-(\d{1,3})/);
  return match?.[1] ? normalizeGlamourPreviewSlug(match[1]) : null;
};

const pngProductsBySlug = new Map();
const allProductsBySlug = new Map();

for (const product of glamourProducts || []) {
  const slug = getProductSlug(product);
  if (!slug) continue;

  if (!allProductsBySlug.has(slug)) {
    allProductsBySlug.set(slug, product);
  }

  if (product.format === 'png' && !pngProductsBySlug.has(slug)) {
    pngProductsBySlug.set(slug, product);
  }
}

export const getGlamourPreviewPngSrc = (slug) => {
  const normalized = normalizeGlamourPreviewSlug(slug);
  const product = pngProductsBySlug.get(normalized) || allProductsBySlug.get(normalized);

  if (product?.image) {
    return toPublicGlamourPngSrc(product.image);
  }

  return `${GLAMOUR_PUBLIC_ASSET_PREFIX}${normalized}.png`;
};

export const getGlamourPreviewPngSrcFromIndex = (index) => getGlamourPreviewPngSrc(Number(index || 0) + 1);

export const getGlamourPreviewPngSrcFromProductId = (id) => {
  const match = String(id || '').match(/glamour-(?:svg|png)-(\d{1,3})/);
  return getGlamourPreviewPngSrc(match?.[1] || '01');
};

export const getGlamourPreviewPngSrcFromProduct = (product) => {
  if (product?.image) return toPublicGlamourPngSrc(product.image);
  return getGlamourPreviewPngSrcFromProductId(product?.id);
};

export const fetchGlamourPreviewDataUrl = async (slug) => getGlamourPreviewPngSrc(slug);
