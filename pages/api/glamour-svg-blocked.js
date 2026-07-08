/**
 * /api/glamour-svg-blocked
 *
 * Catches any direct requests to .svg files under /assets/glamour-svg/
 * that are rewritten here by next.config.js.
 *
 * The actual SVG files have been moved to private-assets/glamour-svg/
 * and are only accessible through the signed token route at
 * /api/secure-downloads/download?token=<JWT>
 */
export default function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json');
    return res.status(403).json({
        error: 'Access denied. This file is only available after purchase via a secure download link.',
    });
}
