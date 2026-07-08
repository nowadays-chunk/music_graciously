import React from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import ProductArtwork from '../Graphics/ProductArtwork';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Derive the 2-digit preview slug from a cart item.
 * Apparel items now store `templateIndex` directly.
 * Digital items have id like "glamour-svg-03" / "glamour-png-03".
 * Falls back to parsing the id for legacy items.
 */
const getPreviewSlug = (item) => {
    const { productType, id, templateIndex } = item;

    if (productType === 'artwork-apparel') {
        // Prefer the stored templateIndex (set since the SVG-code removal refactor)
        if (templateIndex !== undefined && templateIndex !== null) {
            return String(Number(templateIndex) + 1).padStart(2, '0');
        }
        // Legacy fallback: parse "apparel-{index}-..." from id
        const parts = String(id).split('-');
        return String(Number(parts[1] || 0) + 1).padStart(2, '0');
    }

    if (productType === 'artwork-digital') {
        // id: "glamour-svg-03" → slug "03"
        const parts = String(id).split('-');
        return String(parts[2] || '01').padStart(2, '0');
    }

    return '01';
};

// ---------------------------------------------------------------------------
// GarmentBadge – tiny SVG silhouette overlaid on the artwork thumbnail
// ---------------------------------------------------------------------------

const resolveGarment = (label = '') => {
    const l = String(label).toLowerCase();
    if (l.includes('long')) return 'long-sleeve';
    if (l.includes('v-neck') || l.includes("v'")) return 'v-neck';
    return 'crew';
};

const GarmentBadge = ({ garmentLabel = '', colorHex = '#171717', size = 26 }) => {
    const type = resolveGarment(garmentLabel);
    const isLong  = type === 'long-sleeve';
    const isVNeck = type === 'v-neck';

    const collar = isVNeck
        ? 'L9,13 L16,21 L23,13'
        : 'L9,13 Q16,17 23,13';

    const sleeveBottom = isLong ? 28 : 17;
    const shirtPath = isLong
        ? `M4,11 ${collar} L28,11 L28,28 L23,28 L23,17 L9,17 L9,28 L4,28 Z`
        : `M4,11 ${collar} L28,11 L28,${sleeveBottom} L23,${sleeveBottom} L23,28 L9,28 L9,${sleeveBottom} L4,${sleeveBottom} Z`;

    return (
        <svg viewBox="0 0 32 32" width={size} height={size} style={{ display: 'block' }} aria-label={garmentLabel || 'Garment'}>
            <rect x="1" y="1" width="30" height="30" rx="5" fill="#fffdf5" stroke="#151515" strokeWidth="1.5" />
            <path d={shirtPath} fill={colorHex} stroke="#151515" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
    );
};

// ---------------------------------------------------------------------------
// CartItemThumbnail – public component used by cart page + drawer
// ---------------------------------------------------------------------------

/**
 * Props:
 *   item  – cart item object from Redux
 *   size  – pixel size of the square thumbnail (default 72)
 */
const CartItemThumbnail = ({ item, size = 72 }) => {
    const { productType, apparel } = item;
    const isApparel = productType === 'artwork-apparel';
    const isDigital = productType === 'artwork-digital';
    const isGlamour = isApparel || isDigital;

    const wrapperSx = {
        width: size,
        height: size,
        display: { xs: 'none', sm: 'flex' },
        flexShrink: 0,
        mr: 2,
        border: '3px solid var(--brutal-ink)',
        overflow: 'visible',
        bgcolor: 'var(--brutal-paper)',
        position: 'relative',
    };

    if (isGlamour) {
        const slug = getPreviewSlug(item);
        const previewSrc = `/api/glamour-preview/${slug}`;

        return (
            <Box sx={wrapperSx}>
                <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                    <Image
                        src={previewSrc}
                        alt={item.title || 'Product preview'}
                        fill
                        unoptimized
                        style={{ objectFit: 'cover' }}
                    />
                </Box>

                {/* Garment badge only for apparel items */}
                {isApparel && (
                    <Box sx={{ position: 'absolute', top: -6, right: -6, zIndex: 2, filter: 'drop-shadow(1px 1px 0 #151515)' }}>
                        <GarmentBadge
                            garmentLabel={apparel?.garment || ''}
                            colorHex={apparel?.colorHex || '#171717'}
                            size={28}
                        />
                    </Box>
                )}
            </Box>
        );
    }

    // Guitar theory bundle from /store → ProductArtwork SVG (no paid asset exposed)
    return (
        <Box sx={{ ...wrapperSx, overflow: 'hidden' }}>
            <ProductArtwork product={item} height="100%" compact />
        </Box>
    );
};

export default CartItemThumbnail;
