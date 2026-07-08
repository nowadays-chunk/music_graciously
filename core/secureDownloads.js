import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function getDownloadSecret() {
    const secret = process.env.DOWNLOAD_LINK_SECRET;
    if (!secret) {
        throw new Error('Missing DOWNLOAD_LINK_SECRET.');
    }
    return secret;
}

function toBase64Url(input) {
    return Buffer.from(input)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
}

function fromBase64Url(input) {
    const base = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base + '='.repeat((4 - (base.length % 4)) % 4);
    return Buffer.from(padded, 'base64').toString('utf8');
}

export function signDownloadToken(payload) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = toBase64Url(JSON.stringify(header));
    const encodedPayload = toBase64Url(JSON.stringify(payload));
    const data = `${encodedHeader}.${encodedPayload}`;

    const signature = crypto
        .createHmac('sha256', getDownloadSecret())
        .update(data)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');

    return `${data}.${signature}`;
}

export function verifyDownloadToken(token) {
    if (!token || typeof token !== 'string') {
        throw new Error('Invalid token.');
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Malformed token.');
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const data = `${encodedHeader}.${encodedPayload}`;
    const expectedSig = crypto
        .createHmac('sha256', getDownloadSecret())
        .update(data)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');

    const expectedBuffer = Buffer.from(expectedSig);
    const signatureBuffer = Buffer.from(signature);
    if (expectedBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
        throw new Error('Invalid token signature.');
    }

    const payload = JSON.parse(fromBase64Url(encodedPayload));
    if (!payload?.exp || Date.now() >= Number(payload.exp)) {
        throw new Error('Token expired.');
    }

    return payload;
}

function loadProducts() {
    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    const raw = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(raw);

    const glamourProductsPath = path.join(process.cwd(), 'data', 'glamourSvgProducts.json');
    if (!fs.existsSync(glamourProductsPath)) {
        return products;
    }

    const glamourRaw = fs.readFileSync(glamourProductsPath, 'utf8');
    const glamourProducts = JSON.parse(glamourRaw);

    return [
        ...products,
        ...(Array.isArray(glamourProducts) ? glamourProducts : []),
    ];
}

export function getProductById(productId) {
    const products = loadProducts();
    const id = String(productId || '').trim();
    if (!id) return null;

    const exact = products.find((product) => String(product?.id) === id);
    if (exact) return exact;

    const normalizedId = resolveKnownProductId(productId);
    if (!normalizedId) return null;

    return products.find((product) => String(product?.id) === normalizedId) || null;
}

function resolveKnownProductId(productId) {
    const products = loadProducts();

    const raw = String(productId || '').trim();
    if (!raw) return '';

    if (products.some((product) => String(product?.id) === raw)) {
        return raw;
    }

    const byLower = products.find((product) => String(product?.id || '').toLowerCase() === raw.toLowerCase());
    if (byLower) return String(byLower.id);

    return '';
}

function resolveProductIdFromTitle(title) {
    const products = loadProducts();
    const key = String(title || '').trim().toLowerCase();
    if (!key) return '';
    const matched = products.find((product) => String(product?.title || '').trim().toLowerCase() === key);
    return matched ? String(matched.id) : '';
}

function safeResolve(baseDir, relativePath) {
    const normalized = relativePath.replace(/^\/+/, '');
    const absolutePath = path.resolve(baseDir, normalized);
    const allowedBase = path.resolve(baseDir);

    if (!absolutePath.startsWith(allowedBase)) {
        throw new Error('Invalid file path.');
    }

    return absolutePath;
}

function tryCaseInsensitiveFilePath(absolutePath) {
    if (fs.existsSync(absolutePath)) {
        return absolutePath;
    }

    const dir = path.dirname(absolutePath);
    const targetName = path.basename(absolutePath).toLowerCase();
    if (!fs.existsSync(dir)) return '';

    const matched = fs.readdirSync(dir).find((name) => String(name).toLowerCase() === targetName);
    if (!matched) return '';

    const matchedPath = path.join(dir, matched);
    return fs.existsSync(matchedPath) ? matchedPath : '';
}

function resolveExistingFilePath(relativePath) {
    const normalized = String(relativePath || '').replace(/^\/+/, '');
    const roots = [
        process.cwd(),
        path.resolve(process.cwd(), '..'),
        path.resolve(process.cwd(), '../..'),
    ];

    for (const root of roots) {
        try {
            const candidate = safeResolve(root, normalized);
            const found = tryCaseInsensitiveFilePath(candidate);
            if (found) return found;
        } catch (_error) {
            // Skip invalid roots.
        }
    }

    return '';
}

function resolveConfiguredProductFilePath(product) {
    const configuredPath = product?.filePath || product?.downloadPath || product?.assetPath;
    if (!configuredPath) return '';

    const resolvedPath = resolveExistingFilePath(String(configuredPath));
    if (!resolvedPath) {
        throw new Error(`Configured product file missing: ${configuredPath}`);
    }

    return resolvedPath;
}

export function resolveProductFilePath(productId) {
    const id = resolveKnownProductId(productId) || String(productId);
    const product = getProductById(id);
    const configuredProductPath = resolveConfiguredProductFilePath(product);
    if (configuredProductPath) {
        return configuredProductPath;
    }

    var paths = [];
    // ---- BUNDLES ----
    if (id.startsWith('bundle-')) {
        const bundlePath = resolveExistingFilePath(`products/${id}.pdf`) || resolveExistingFilePath(`bundles-pdf/${id}.pdf`);

        if (!bundlePath) {
            throw new Error(`Bundle file not found: ${id}`);
        }

        return bundlePath;
    }

    // ---- SINGLE SHEETS ----
    if (id.startsWith('sheet-')) {
        const product = getProductById(id);
        if (!product || !product.png) {
            throw new Error(`Sheet has no file configured: ${id}`);
        }

        const absolutePath = safeResolve(
            process.cwd(),
            String(product.png)
        );

        const resolvedSinglePath = tryCaseInsensitiveFilePath(absolutePath) || resolveExistingFilePath(String(product.png));
        if (!resolvedSinglePath) {
            throw new Error(`Sheet file missing: ${product.png}`);
        }

        return resolvedSinglePath;
    }

    throw new Error(`Unknown product type: ${id}`);
}

export function resolveProductFileEntries(productId) {
    const id = String(productId);
    const singlePath = resolveProductFilePath(id);
    return [{
        filePath: singlePath,
        fileKey: path.relative(process.cwd(), singlePath).split(path.sep).join('/'),
        fileName: path.basename(singlePath),
    }];
}

export function resolveProductFileFromKey(productId, fileKey) {
    const safeKeyPath = String(fileKey || '').split('/').join(path.sep);
    const absoluteFromKey = safeResolve(process.cwd(), safeKeyPath);
    const allowed = resolveProductFileEntries(productId).find((entry) => entry.filePath === absoluteFromKey);

    if (!allowed) {
        throw new Error('Requested file is not authorized for this product.');
    }

    return allowed;
}

export function getCheckoutApiBaseUrl() {
    const baseUrl = process.env.CHECKOUT_API_BASE_URL || process.env.NEXT_PUBLIC_CHECKOUT_API_BASE_URL || process.env.NEXT_PUBLIC_PAYPAL_API_BASE_URL;
    if (!baseUrl) {
        throw new Error('Missing CHECKOUT_API_BASE_URL (or NEXT_PUBLIC_CHECKOUT_API_BASE_URL).');
    }
    return baseUrl;
}

export async function fetchOrderFromCheckoutApi(orderId) {
    const baseUrl = getCheckoutApiBaseUrl();
    const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/api/payment/order/${encodeURIComponent(orderId)}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.error || 'Unable to fetch order details.');
    }

    return data;
}

export function extractPurchasedProductIds(orderData) {
    const ids = [];
    const purchaseUnits = Array.isArray(orderData?.purchase_units) ? orderData.purchase_units : [];

    purchaseUnits.forEach((unit) => {
        const items = Array.isArray(unit?.items) ? unit.items : [];
        items.forEach((item) => {
            const fromSku = resolveKnownProductId(item?.sku);
            if (fromSku) {
                ids.push(fromSku);
            }

            const fromCustomId = resolveKnownProductId(item?.custom_id);
            if (fromCustomId) {
                ids.push(fromCustomId);
            }

            const fromTitle = resolveProductIdFromTitle(item?.name);
            if (fromTitle) {
                ids.push(fromTitle);
            }
        });
    });

    return Array.from(new Set(ids));
}

export function validateOrderOwnership(orderData, expectedEmail) {
    const email = String(expectedEmail || '').trim().toLowerCase();
    if (!email) {
        throw new Error('Email is required for authorization.');
    }

    const status = String(orderData?.status || '').toUpperCase();
    if (status !== 'COMPLETED') {
        throw new Error('Payment is not completed.');
    }

    const payerEmail = String(orderData?.payer?.email_address || '').trim().toLowerCase();
    const customIds = (Array.isArray(orderData?.purchase_units) ? orderData.purchase_units : [])
        .map((unit) => String(unit?.custom_id || '').trim().toLowerCase())
        .filter(Boolean);

    const emailMatchesPayer = payerEmail && payerEmail === email;
    const emailMatchesCustomId = customIds.includes(email);

    if (!emailMatchesPayer && !emailMatchesCustomId) {
        throw new Error('Order does not belong to this email.');
    }
}
