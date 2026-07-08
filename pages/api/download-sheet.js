import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const ALLOWED_FORMATS = ['pdf', 'png'];

const getContentType = (format) => {
    const mimeTypes = {
        pdf: 'application/pdf',
        png: 'image/png'
    };

    return mimeTypes[format] || 'application/octet-stream';
};

const createPdfFromPng = async (pngPath) => {
    const pngBytes = await fs.promises.readFile(pngPath);
    const pdf = await PDFDocument.create();
    const image = await pdf.embedPng(pngBytes);
    const page = pdf.addPage([image.width, image.height]);

    page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height
    });

    return Buffer.from(await pdf.save());
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const { type, key, item, subtype, mode, labelDisplay, format, title } = req.query;

    // 1. Basic sanitization to prevent path traversal
    const safeRegex = /^[a-zA-Z0-9_#() ,+-]+$/;
    const isSafe = (val) => typeof val === 'string' && safeRegex.test(val);

    if (!isSafe(type) || !isSafe(key) || !isSafe(item) || !isSafe(labelDisplay) || !isSafe(format)) {
        return res.status(400).json({ error: 'Invalid parameters.' });
    }

    if (!ALLOWED_FORMATS.includes(format)) {
        return res.status(400).json({ error: 'Invalid format.' });
    }

    if (subtype && !isSafe(subtype)) {
        return res.status(400).json({ error: 'Invalid subtype parameter.' });
    }

    if (mode && !isSafe(mode)) {
        return res.status(400).json({ error: 'Invalid mode parameter.' });
    }

    // Determine base folder on format
    const baseDir = format === 'pdf' ? 'pdf-pages' : 'screens';
    let fileRelativePath = '';

    if (type === 'chord') {
        fileRelativePath = path.join('chords', key, item, `${labelDisplay}.${format}`);
    } else if (type === 'scale') {
        if (subtype === 'single') {
            fileRelativePath = path.join('scales', key, item, 'single', `${labelDisplay}.${format}`);
        } else if (subtype === 'modal') {
            fileRelativePath = path.join('scales', key, item, 'modal', mode, `${labelDisplay}.${format}`);
        } else {
            return res.status(400).json({ error: 'Invalid scale subtype.' });
        }
    } else if (type === 'arpeggio') {
        fileRelativePath = path.join('arppegios', key, item, `${labelDisplay}.${format}`);
    } else {
        return res.status(400).json({ error: 'Invalid type.' });
    }

    const fullPath = path.join(process.cwd(), baseDir, fileRelativePath);
    let responseBody = null;
    let responsePath = fullPath;

    if (!fs.existsSync(fullPath)) {
        if (format !== 'pdf') {
            return res.status(404).json({ error: 'File not found on server.' });
        }

        const pngRelativePath = fileRelativePath.replace(/\.pdf$/i, '.png');
        const pngPath = path.join(process.cwd(), 'screens', pngRelativePath);

        if (!fs.existsSync(pngPath)) {
            return res.status(404).json({ error: 'File not found on server.' });
        }

        responseBody = await createPdfFromPng(pngPath);
        responsePath = pngPath;
    }

    // If format is PDF, dynamically load the PDF and draw the brutalist coupon footer banner
    if (format === 'pdf') {
        try {
            const pdfBytes = responseBody || await fs.promises.readFile(responsePath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();
            
            if (pages.length > 0) {
                const firstPage = pages[0];
                const { width, height } = firstPage.getSize();
                const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
                const bannerHeight = 35;

                // Draw background rectangle (Brutal yellow)
                firstPage.drawRectangle({
                    x: 0,
                    y: 0,
                    width: width,
                    height: bannerHeight,
                    color: rgb(1.0, 0.94, 0.0),
                });

                // Draw black top border line
                firstPage.drawLine({
                    start: { x: 0, y: bannerHeight },
                    end: { x: width, y: bannerHeight },
                    thickness: 3,
                    color: rgb(0.0, 0.0, 0.0),
                });

                const { getMonthlyCoupons } = require('../../core/marketing/coupons');
                const { code10 } = getMonthlyCoupons();

                const bannerText = `WANT ALL GRIDS? GET THE BUNDLE AT 10% OFF! CODE: ${code10}`;
                const storeLinkText = `VISIT: www.musicgraciously.com/STORE`;
                
                const fontSize = Math.min(10, width / 60); // Responsive font size
                const linkWidth = font.widthOfTextAtSize(storeLinkText, fontSize);

                firstPage.drawText(bannerText, {
                    x: 20,
                    y: 12,
                    size: fontSize,
                    font: font,
                    color: rgb(0.0, 0.0, 0.0),
                });

                firstPage.drawText(storeLinkText, {
                    x: width - linkWidth - 20,
                    y: 12,
                    size: fontSize,
                    font: font,
                    color: rgb(0.0, 0.0, 0.0),
                });
            }

            const modifiedPdfBytes = await pdfDoc.save();
            responseBody = Buffer.from(modifiedPdfBytes);
        } catch (pdfError) {
            console.error('Failed to append marketing coupon to PDF:', pdfError);
            // Gracefully fall back to the original unmodified flow if loading or editing fails
        }
    }

    // Set file response headers
    const contentType = getContentType(format);

    // Rename file to title
    const sanitizedTitle = (title || 'sheet_music')
        .replace(/[^a-zA-Z0-9\s_-]/g, '')
        .trim()
        .replace(/\s+/g, '_');
    const downloadName = `${sanitizedTitle}.${format}`;

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');

    if (responseBody) {
        res.setHeader('Content-Length', responseBody.length);
        return res.status(200).send(responseBody);
    }

    const stream = fs.createReadStream(responsePath);
    stream.pipe(res);
}
