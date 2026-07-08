import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const config = { api: { bodyParser: false } };

const PRIVATE_DIR = path.join(process.cwd(), 'private-assets', 'glamour-svg');
const COLORS = {
    black: '#171717',
    navy: '#17233d',
    charcoal: '#34343a',
    red: '#a6262d',
    forest: '#1f4a37',
    white: '#f7f5ef',
    heather: '#bfc1c2',
};

function findSvg(slug) {
    const padded = String(slug || '').padStart(2, '0');
    if (!/^\d{2,3}$/.test(padded)) return null;

    const entries = fs.readdirSync(PRIVATE_DIR);
    const match = entries.find((file) => file.startsWith(`${padded}-`) && file.endsWith('.svg'));
    return match ? path.join(PRIVATE_DIR, match) : null;
}

function normalizeChoice(value, allowed, fallback) {
    const normalized = String(value || '').toLowerCase().replace(/_/g, '-');
    return allowed.includes(normalized) ? normalized : fallback;
}

function buildShirtSvg({ color, neck, sleeve }) {
    const isLongSleeve = sleeve === 'long-sleeve';
    const isVNeck = neck === 'v-neck';
    const ink = ['white', 'heather'].includes(color) ? '#171717' : '#ffffff';
    const fill = COLORS[color] || COLORS.black;
    const sleeveLeft = isLongSleeve
        ? 'M 304 274 L 118 805 Q 111 838 140 850 L 224 885 Q 254 895 266 864 L 392 424 Z'
        : 'M 304 274 L 154 486 Q 137 515 166 534 L 245 584 Q 278 604 298 571 L 392 424 Z';
    const sleeveRight = isLongSleeve
        ? 'M 776 274 L 962 805 Q 969 838 940 850 L 856 885 Q 826 895 814 864 L 688 424 Z'
        : 'M 776 274 L 926 486 Q 943 515 914 534 L 835 584 Q 802 604 782 571 L 688 424 Z';
    const collar = isVNeck
        ? '<path d="M 434 198 L 540 381 L 646 198" fill="none" stroke="' + ink + '" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" opacity="0.92"/>'
        : '<path d="M 426 197 Q 540 315 654 197" fill="none" stroke="' + ink + '" stroke-width="36" stroke-linecap="round" opacity="0.92"/>';

    return Buffer.from(`
        <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
            <rect width="1080" height="1080" fill="#f4efe7"/>
            <ellipse cx="540" cy="958" rx="350" ry="44" fill="#000000" opacity="0.13"/>
            <path d="${sleeveLeft}" fill="${fill}" opacity="0.97"/>
            <path d="${sleeveRight}" fill="${fill}" opacity="0.97"/>
            <path d="M 396 190 Q 454 236 540 236 Q 626 236 684 190 L 806 304 Q 760 482 734 900 Q 733 932 701 936 L 379 936 Q 347 932 346 900 Q 320 482 274 304 Z" fill="${fill}"/>
            <path d="M 396 190 Q 454 255 540 255 Q 626 255 684 190 L 642 186 Q 540 250 438 186 Z" fill="#000000" opacity="0.12"/>
            ${collar}
            <path d="M 360 340 Q 540 389 720 340" fill="none" stroke="#ffffff" stroke-width="7" opacity="0.12"/>
            <path d="M 340 707 Q 540 756 740 707" fill="none" stroke="#000000" stroke-width="7" opacity="0.08"/>
        </svg>
    `);
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    try {
        const svgPath = findSvg(req.query.slug);
        if (!svgPath) {
            return res.status(404).json({ error: 'Artwork SVG not found.' });
        }

        const color = normalizeChoice(req.query.color, Object.keys(COLORS), 'black');
        const neck = normalizeChoice(req.query.neck, ['crew-neck', 'v-neck'], 'crew-neck');
        const sleeve = normalizeChoice(req.query.sleeve, ['short-sleeve', 'long-sleeve'], 'short-sleeve');

        const artwork = await sharp(svgPath)
            .resize(350, 350, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toBuffer();

        const output = await sharp(buildShirtSvg({ color, neck, sleeve }))
            .composite([{ input: artwork, left: 365, top: 390 }])
            .png({ quality: 92 })
            .toBuffer();

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
        res.setHeader('Content-Length', output.byteLength);
        return res.status(200).end(output);
    } catch (error) {
        console.error('[social-shirt-preview]', error);
        return res.status(500).json({ error: 'Failed to generate shirt preview.' });
    }
}
