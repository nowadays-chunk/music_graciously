import fs from 'fs';
import path from 'path';
import {
    extractPurchasedProductIds,
    fetchOrderFromCheckoutApi,
    getProductById,
    signDownloadToken,
    validateOrderOwnership,
} from '@/core/secureDownloads';

const LINK_TTL_MS = Number(process.env.DOWNLOAD_LINK_TTL_MS || 1000 * 60 * 60 * 24 * 7); // 7 days

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    try {
        const { orderId, email, fallbackProductIds } = req.body || {};

        if (!orderId || !email) {
            return res.status(400).json({ error: 'orderId and email are required.' });
        }

        const order = await fetchOrderFromCheckoutApi(orderId);
        validateOrderOwnership(order, email);

        const fromOrder = extractPurchasedProductIds(order);
        const fallbackIds = Array.isArray(fallbackProductIds)
            ? fallbackProductIds.map((id) => String(id || '').trim()).filter(Boolean)
            : [];
        const productIds = Array.from(new Set([...fromOrder, ...fallbackIds]));
        if (productIds.length === 0) {
            return res.status(422).json({
                error: 'No purchasable product items were found on this order.',
                fromOrderCount: fromOrder.length,
            });
        }

        const now = Date.now();
        const expiresAt = now + LINK_TTL_MS;

        const downloads = [];
        const missingProducts = [];

        productIds.forEach((productId) => {
            try {
                const product = getProductById(productId);
                if (!product) {
                    throw new Error(`Product ${productId} not found in catalog.`);
                }

                const token = signDownloadToken({
                    sub: String(email).trim().toLowerCase(),
                    orderId: String(orderId),
                    productId,
                    exp: expiresAt,
                });

                let isBundle = false;
                let sheets = [];
                const bundleDataPath = path.join(process.cwd(), 'bundles', `${productId}.json`);
                if (fs.existsSync(bundleDataPath)) {
                    try {
                        const bundleRaw = fs.readFileSync(bundleDataPath, 'utf8');
                        const bundleData = JSON.parse(bundleRaw);
                        if (Array.isArray(bundleData?.sheets)) {
                            isBundle = true;
                            sheets = bundleData.sheets.map(s => ({
                                id: s.id,
                                title: s.title,
                                pdf: s.pdf
                            }));
                        }
                    } catch (e) {
                        console.error('Error loading bundle sheets:', e);
                    }
                }

                downloads.push({
                    productId,
                    title: product?.title || productId,
                    url: `/api/secure-downloads/download?token=${encodeURIComponent(token)}`,
                    expiresAt,
                    format: product?.format || '',
                    isBundle,
                    sheets
                });
            } catch (error) {
                missingProducts.push({
                    productId,
                    reason: error?.message || 'File resolution failed.',
                });
            }
        });

        if (downloads.length === 0) {
            return res.status(422).json({
                error: 'No downloadable files were found for purchased products.',
                missingProducts,
            });
        }

        return res.status(200).json({ orderId, downloads, missingProducts });
    } catch (error) {
        return res.status(400).json({ error: error?.message || 'Unable to issue secure download links.' });
    }
}
