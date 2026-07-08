import fs from 'fs';
import path from 'path';

export const config = { api: { bodyParser: false } };

const SCREENS_DIR = path.join(process.cwd(), 'screens');
const SAFE_PART = /^[a-zA-Z0-9_#(),.+-]+$/;

const isSafePart = (value) => typeof value === 'string' && SAFE_PART.test(value);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const { instrument, key, category, item, side = 'recto' } = req.query;

    if (
        !isSafePart(instrument) ||
        !isSafePart(key) ||
        !isSafePart(category) ||
        !isSafePart(item) ||
        !['recto', 'verso'].includes(side)
    ) {
        return res.status(400).json({ error: 'Invalid preview parameters.' });
    }

    const filePath = path.join(SCREENS_DIR, instrument, key, category, `${item}_${side}.png`);
    const resolvedPath = path.resolve(filePath);

    if (!resolvedPath.startsWith(path.resolve(SCREENS_DIR) + path.sep)) {
        return res.status(400).json({ error: 'Invalid preview path.' });
    }

    if (!fs.existsSync(resolvedPath)) {
        return res.status(404).json({ error: 'Preview not found.' });
    }

    try {
        const image = await fs.promises.readFile(resolvedPath);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
        res.setHeader('Content-Length', image.byteLength);
        return res.status(200).end(image);
    } catch (error) {
        console.error('[social-sheet-preview]', error);
        return res.status(500).json({ error: 'Failed to load preview.' });
    }
}
