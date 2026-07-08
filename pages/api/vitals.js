export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    try {
        const metric = req.body || {};

        // Replace this with persistent storage/analytics pipeline if needed.
        console.log('[web-vitals]', JSON.stringify(metric));

        return res.status(200).json({ ok: true });
    } catch (error) {
        return res.status(400).json({ error: 'Invalid web-vitals payload.' });
    }
}
