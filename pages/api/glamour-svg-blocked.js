/**
 * /api/glamour-svg-blocked
 *
 * Catches any direct requests to .svg files under /assets/glamour-svg/
 * that are rewritten here by next.config.js.
 *
 * The actual SVG files have been moved to private-assets/glamour-svg/
 * and are only accessible after purchase through the FastAPI backend
 * /api/downloads/<signed-token> route.
 */
export default function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json');
    return res.status(403).json({
        error: 'Access denied. This file is only available after purchase via a secure download link.',
    });
}
