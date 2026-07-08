import fs from 'fs';
import path from 'path';

export const config = { api: { bodyParser: false } };

const PRIVATE_DIR = path.join(process.cwd(), 'private-assets', 'glamour-svg');

function findPng(slug) {
    const padded = String(slug || '').padStart(2, '0');
    if (!/^\d{2,3}$/.test(padded)) return null;

    const entries = fs.readdirSync(PRIVATE_DIR);
    const match = entries.find((file) => file.startsWith(`${padded}-`) && file.endsWith('.png'));
    return match ? path.join(PRIVATE_DIR, match) : null;
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    try {
        const filePath = findPng(req.query.slug);
        if (!filePath) {
            return res.status(404).json({ error: 'Artwork not found.' });
        }

        const image = await fs.promises.readFile(filePath);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
        res.setHeader('Content-Length', image.byteLength);
        return res.status(200).end(image);
    } catch (error) {
        console.error('[social-artwork-preview]', error);
        return res.status(500).json({ error: 'Failed to load artwork preview.' });
    }
}
