import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import {
    extractPurchasedProductIds,
    fetchOrderFromCheckoutApi,
    resolveProductFilePath,
    validateOrderOwnership,
    verifyDownloadToken,
} from '@/core/secureDownloads';

export const config = {
    api: {
        bodyParser: false,
    },
};

/**
 * Build a personalized watermark SVG overlay.
 * The buyer's email is embedded so leaked files are traceable.
 */
function buildLicenseWatermarkSvg(width, height, email) {
    const safeEmail = String(email || '').replace(/[<>&"]/g, '');
    const licenseText = `Licensed to: ${safeEmail}`;
    const OPACITY = 0.22;

    const rows = Math.ceil(height / 90) + 2;
    const cols = Math.ceil(width / 200) + 2;
    const stamps = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * 200 - 60;
            const y = r * 90 - 20;
            stamps.push(
                `<text x="${x}" y="${y}" transform="rotate(-28 ${x} ${y})"
                    font-family="Arial, sans-serif" font-size="14" font-weight="700"
                    fill="black" opacity="${OPACITY}" letter-spacing="1">${licenseText}</text>`
            );
        }
    }

    return Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            ${stamps.join('\n')}
        </svg>`
    );
}

/** Returns true if this is a glamour PNG product (needs watermark on download). */
function isGlamourPng(filePath) {
    return filePath.includes('private-assets') &&
           filePath.includes('glamour-svg') &&
           filePath.endsWith('.png');
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    try {
        const token = req.query?.token;
        const payload = verifyDownloadToken(token);

        const { orderId, productId, sub } = payload || {};
        if (!orderId || !productId || !sub) {
            return res.status(400).json({ error: 'Invalid token payload.' });
        }

        const order = await fetchOrderFromCheckoutApi(orderId);
        validateOrderOwnership(order, sub);

        const purchasedProductIds = extractPurchasedProductIds(order);
        const hasPurchasableItemsInOrder = purchasedProductIds.length > 0;
        if (hasPurchasableItemsInOrder && !purchasedProductIds.includes(String(productId))) {
            return res.status(403).json({ error: 'This file is not authorized for the payment.' });
        }

        const item = req.query?.item;
        const format = req.query?.format || 'pdf';
        const labelDisplay = req.query?.labelDisplay || 'notes';

        let filePath;
        let finalFileName = '';

        if (item) {
            // Load the bundle JSON file
            const bundleJsonPath = path.join(process.cwd(), 'bundles', `${productId}.json`);
            if (!fs.existsSync(bundleJsonPath)) {
                return res.status(404).json({ error: 'Bundle metadata not found.' });
            }
            const bundleData = JSON.parse(fs.readFileSync(bundleJsonPath, 'utf8'));
            const sheet = bundleData.sheets?.find(s => s.id === item || s.id === `${item}-chords` || s.id === `${item}-arpeggios` || s.id === `${item}-scales`);
            if (!sheet) {
                return res.status(403).json({ error: 'Requested sheet is not part of the purchased bundle.' });
            }

            if (format === 'png') {
                const cleanPdfPath = sheet.pdf.replace(/^\/+/, '');
                const basePng = cleanPdfPath.replace(/^pdf-pages/, 'screens').replace(/\.pdf$/i, '');
                filePath = path.join(process.cwd(), `${basePng}/${labelDisplay}.png`);
                finalFileName = `${item.replace(/[^a-zA-Z0-9._-]/g, '_')}_${labelDisplay}.png`;
            } else {
                filePath = path.join(process.cwd(), sheet.pdf.replace(/^\/+/, ''));
                finalFileName = `${item.replace(/[^a-zA-Z0-9._-]/g, '_')}.pdf`;
            }
        } else {
            filePath = resolveProductFilePath(productId);
            const ext = path.extname(filePath).replace(/^\./, '').toLowerCase() || 'pdf';
            finalFileName = `${String(productId).replace(/[^a-zA-Z0-9._-]/g, '_')}.${ext}`;
        }

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Requested file format or document not found.' });
        }

        const ext = path.extname(filePath).replace(/^\./, '').toLowerCase();
        const mimeTypes = {
            pdf: 'application/pdf',
            png: 'image/png',
            svg: 'image/svg+xml; charset=utf-8',
        };
        const mimeType = mimeTypes[ext] || 'application/octet-stream';

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${finalFileName}"`);
        res.setHeader('Cache-Control', 'private, no-store, max-age=0');

        // For glamour PNG purchases: embed a personalized license watermark
        if (isGlamourPng(filePath)) {
            const image = sharp(filePath);
            const meta = await image.metadata();
            const watermarkSvg = buildLicenseWatermarkSvg(meta.width, meta.height, sub);

            const watermarked = await sharp(filePath)
                .composite([{ input: watermarkSvg, top: 0, left: 0 }])
                .png({ quality: 95 })
                .toBuffer();

            res.setHeader('Content-Length', watermarked.byteLength);
            return res.status(200).end(watermarked);
        }

        // All other files: stream directly
        const stream = fs.createReadStream(filePath);
        stream.on('error', () => {
            if (!res.headersSent) {
                res.status(500).json({ error: 'Unable to read download file.' });
            } else {
                res.end();
            }
        });

        stream.pipe(res);
    } catch (error) {
        return res.status(403).json({ error: error?.message || 'Unauthorized download request.' });
    }
}
