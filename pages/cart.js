import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    Box,
    IconButton,
    Divider,
    Paper,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { removeFromCart, clearCart, updateQuantity } from '../redux/actions/cartActions';
import { DEFAULT_KEYWORDS } from '../data/seo';
import CartItemThumbnail from '../components/Cart/CartItemThumbnail';


const PENDING_CHECKOUT_KEY = 'pending_checkout_context';
const DOWNLOAD_LINKS_KEY = 'secure_download_links';
const CART_STORAGE_KEY = 'cart_state';
const CHECKOUT_API_BASE_URL = process.env.NEXT_PUBLIC_CHECKOUT_API_BASE_URL || process.env.NEXT_PUBLIC_PAYPAL_API_BASE_URL;
const CHECKOUT_CURRENCY = process.env.NEXT_PUBLIC_CHECKOUT_CURRENCY;
const GOOGLE_REVIEWS_MERCHANT_ID = Number(process.env.NEXT_PUBLIC_GOOGLE_CUSTOMER_REVIEWS_MERCHANT_ID || 5739862912);
const GOOGLE_REVIEWS_ESTIMATED_DELIVERY_DAYS = Number(process.env.NEXT_PUBLIC_GOOGLE_CUSTOMER_REVIEWS_ESTIMATED_DELIVERY_DAYS || 1);
const GOOGLE_REVIEWS_DEFAULT_COUNTRY = String(
    process.env.NEXT_PUBLIC_GOOGLE_CUSTOMER_REVIEWS_DEFAULT_COUNTRY || 'US'
).trim().toUpperCase();

const DEFAULT_CHECKOUT_ADDRESS = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    country: '',
};

const CHECKOUT_ADDRESS_FIELDS = [
    { name: 'firstName', label: 'First Name', xs: 6 },
    { name: 'lastName', label: 'Last Name', xs: 6 },
    { name: 'address', label: 'Address', xs: 12 },
    { name: 'city', label: 'City', xs: 6 },
    { name: 'zip', label: 'ZIP / Postal', xs: 6 },
    { name: 'country', label: 'Country', xs: 12 },
];

const readStoredDownloadLinks = () => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = JSON.parse(window.localStorage.getItem(DOWNLOAD_LINKS_KEY) || '[]');
        return Array.isArray(stored) ? stored : [];
    } catch (_error) {
        return [];
    }
};

const mergeDownloadLinks = (existingLinks, incomingLinks) => {
    const keyFor = (entry) => {
        const orderId = String(entry?.orderId || '');
        const productId = String(entry?.productId || '');
        const url = String(entry?.url || '');
        return `${orderId}::${productId}::${url}`;
    };

    const map = new Map();
    [...existingLinks, ...incomingLinks].forEach((entry) => {
        if (!entry || typeof entry !== 'object') return;
        if (!entry.url) return;
        map.set(keyFor(entry), entry);
    });

    return Array.from(map.values());
};

const normalizeImportedLinks = (payload) => {
    const rawEntries = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.downloads)
            ? payload.downloads
            : Array.isArray(payload?.links)
                ? payload.links
                : [];

    return rawEntries
        .filter((entry) => entry && typeof entry === 'object' && entry.url)
        .map((entry) => ({
            orderId: entry.orderId || '',
            userEmail: entry.userEmail || '',
            productId: entry.productId || '',
            title: entry.title || entry.productId || 'Download',
            url: entry.url,
            expiresAt: entry.expiresAt || null,
            format: entry.format || '',
            isBundle: entry.isBundle || false,
            sheets: Array.isArray(entry.sheets) ? entry.sheets : [],
        }));
};

const COUNTRY_NAME_TO_CODE = {
    US: 'US',
    USA: 'US',
    'UNITED STATES': 'US',
    'UNITED STATES OF AMERICA': 'US',
    CA: 'CA',
    CANADA: 'CA',
    FR: 'FR',
    FRANCE: 'FR',
    GB: 'GB',
    UK: 'GB',
    'UNITED KINGDOM': 'GB',
    DE: 'DE',
    GERMANY: 'DE',
    ES: 'ES',
    SPAIN: 'ES',
    IT: 'IT',
    ITALY: 'IT',
    NL: 'NL',
    NETHERLANDS: 'NL',
    AU: 'AU',
    AUSTRALIA: 'AU',
    JP: 'JP',
    JAPAN: 'JP',
};

const formatDateYyyyMmDd = (value) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const normalizeCountryCode = (rawValue) => {
    const value = String(rawValue || '').trim().toUpperCase();
    if (!value) return '';
    if (/^[A-Z]{2}$/.test(value)) return value;
    return COUNTRY_NAME_TO_CODE[value] || '';
};

const resolveDeliveryCountryCode = ({ captureData, pendingCheckout, formCountry }) => {
    const candidates = [
        captureData?.purchase_units?.[0]?.shipping?.address?.country_code,
        captureData?.payer?.address?.country_code,
        captureData?.purchase_units?.[0]?.shipping?.address?.country,
        pendingCheckout?.shippingAddress?.countryCode,
        pendingCheckout?.shippingAddress?.country,
        pendingCheckout?.country,
        formCountry,
        GOOGLE_REVIEWS_DEFAULT_COUNTRY,
    ];

    for (const candidate of candidates) {
        const resolved = normalizeCountryCode(candidate);
        if (resolved) return resolved;
    }
    return 'US';
};

const buildGoogleReviewProducts = ({ pendingItems, captureData }) => {
    const fromPending = Array.isArray(pendingItems) ? pendingItems : [];
    const captureItems = Array.isArray(captureData?.purchase_units)
        ? captureData.purchase_units.flatMap((unit) => (Array.isArray(unit?.items) ? unit.items : []))
        : [];

    const map = new Map();
    [...fromPending, ...captureItems].forEach((item) => {
        if (!item || typeof item !== 'object') return;
        const id = String(item.id || item.sku || item.productId || item.title || '').trim();
        if (!id) return;

        const gtin = String(item.gtin || item.ean || item.upc || item.id || item.sku || '').trim();
        if (!gtin) return;
        map.set(id, { gtin });
    });

    return Array.from(map.values()).slice(0, 100);
};

const buildGoogleReviewOptInPayload = ({
    orderId,
    email,
    captureData,
    pendingCheckout,
    formCountry,
}) => {
    const normalizedOrderId = String(orderId || '').trim();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedOrderId || !normalizedEmail) return null;

    const estimatedDays = Number.isFinite(GOOGLE_REVIEWS_ESTIMATED_DELIVERY_DAYS)
        ? Math.max(0, Math.floor(GOOGLE_REVIEWS_ESTIMATED_DELIVERY_DAYS))
        : 1;

    const estimatedDate = new Date();
    estimatedDate.setUTCDate(estimatedDate.getUTCDate() + estimatedDays);

    const payload = {
        merchant_id: Number.isFinite(GOOGLE_REVIEWS_MERCHANT_ID) ? GOOGLE_REVIEWS_MERCHANT_ID : 5739862912,
        order_id: normalizedOrderId,
        email: normalizedEmail,
        delivery_country: resolveDeliveryCountryCode({ captureData, pendingCheckout, formCountry }),
        estimated_delivery_date: formatDateYyyyMmDd(estimatedDate),
    };

    const products = buildGoogleReviewProducts({
        pendingItems: pendingCheckout?.items,
        captureData,
    });

    if (products.length > 0) {
        payload.products = products;
    }

    return payload;
};

const CartPage = () => {
    const { items, total } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const router = useRouter();
    const captureHandledRef = useRef(false);
    const submitLockRef = useRef(false);
    const importFileInputRef = useRef(null);
    const downloadsTriggeredRef = useRef(false);

    const [formData, setFormData] = useState({
        email: '',
    });
    const [shippingAddress, setShippingAddress] = useState({ ...DEFAULT_CHECKOUT_ADDRESS });
    const [billingAddress, setBillingAddress] = useState({ ...DEFAULT_CHECKOUT_ADDRESS });
    const [billingSame, setBillingSame] = useState(true);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [downloadLinks, setDownloadLinks] = useState([]);
    const [paidArtworkItems, setPaidArtworkItems] = useState([]);
    const [linksMessage, setLinksMessage] = useState('');
    const [googleReviewOptIn, setGoogleReviewOptIn] = useState(null);
    const [returnShipping, setReturnShipping] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (setter) => (event) => {
        setter((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const normalizeCheckoutAddress = (address) => CHECKOUT_ADDRESS_FIELDS.reduce((normalized, field) => {
        normalized[field.name] = String(address?.[field.name] || '').trim();
        return normalized;
    }, {});

    const isCheckoutAddressComplete = (address) => CHECKOUT_ADDRESS_FIELDS.every((field) => (
        String(address?.[field.name] || '').trim()
    ));

    const getCheckoutAddresses = () => {
        const normalizedShippingAddress = normalizeCheckoutAddress(shippingAddress);
        const normalizedBillingAddress = billingSame
            ? { ...normalizedShippingAddress }
            : normalizeCheckoutAddress(billingAddress);

        return {
            shippingAddress: normalizedShippingAddress,
            billingAddress: normalizedBillingAddress,
            billingSame,
        };
    };

    const renderAddressFields = (address, onChange, keyPrefix) => CHECKOUT_ADDRESS_FIELDS.map((field) => (
        <Grid item xs={field.xs} key={`${keyPrefix}-${field.name}`}>
            <TextField
                required
                fullWidth
                label={field.label}
                name={field.name}
                value={address[field.name]}
                onChange={onChange}
                size="small"
            />
        </Grid>
    ));

    const getApiUrl = (path) => {
        const baseUrl = CHECKOUT_API_BASE_URL;
        if (!baseUrl) {
            throw new Error('Missing NEXT_PUBLIC_CHECKOUT_API_BASE_URL (or NEXT_PUBLIC_PAYPAL_API_BASE_URL).');
        }
        return `${baseUrl.replace(/\/+$/, '')}${path}`;
    };

    const buildCheckoutContext = () => {
        if (!CHECKOUT_CURRENCY) {
            throw new Error('Missing NEXT_PUBLIC_CHECKOUT_CURRENCY.');
        }

        const checkoutAddresses = getCheckoutAddresses();

        if (!isCheckoutAddressComplete(checkoutAddresses.shippingAddress)) {
            throw new Error('Please complete the shipping address before checkout.');
        }

        if (!isCheckoutAddressComplete(checkoutAddresses.billingAddress)) {
            throw new Error('Please complete the billing address before checkout.');
        }

        const checkoutItems = items.map((item) => ({
            id: item.id,
            sku: item.sku || item.id,
            title: item.title,
            price: Number(item.price) || 0,
            quantity: Math.max(1, Number(item.quantity) || 1),
            gtin: item.gtin || item.ean || item.upc || '',
            requiresSecureDownload: item.requiresSecureDownload !== false,
            productType: item.productType || item.type || '',
            format: item.format || '',
            svgMarkup: item.svgMarkup || '',
            fileName: item.fileName || '',
            variantSummary: item.variantSummary || '',
            apparel: item.apparel || null,
        }));
        const checkoutAmount = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const productsDescription = checkoutItems
            .map((item) => `${item.title} (x${item.quantity})`)
            .join(', ');
        const origin = typeof window !== 'undefined' ? window.location.origin : '';

        return {
            checkoutItems,
            orderPayload: {
                currency: CHECKOUT_CURRENCY,
                amount: checkoutAmount.toFixed(2),
                referenceId: `cart-${Date.now()}`,
                description: productsDescription.slice(0, 127),
                customId: formData.email || undefined,
                items: checkoutItems,
                shippingAddress: checkoutAddresses.shippingAddress,
                billingAddress: checkoutAddresses.billingAddress,
                billingSame: checkoutAddresses.billingSame,
                returnUrl: origin ? `${origin}/cart?checkout=success` : undefined,
                cancelUrl: origin ? `${origin}/cart?checkout=cancel` : undefined,
            },
            checkoutAddresses,
        };
    };

    const persistPendingCheckout = (checkoutItems, checkoutAddresses) => {
        if (typeof window === 'undefined') return;

        window.localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify({
            email: String(formData.email || '').trim().toLowerCase(),
            items: checkoutItems,
            shippingAddress: checkoutAddresses.shippingAddress,
            billingAddress: checkoutAddresses.billingAddress,
            billingSame: checkoutAddresses.billingSame,
            country: String(checkoutAddresses.shippingAddress.country || '').trim(),
            returnShipping,
            createdAt: Date.now(),
        }));
    };

    const finalizeCapturedOrder = async (orderId, captureData, pendingCheckoutOverride = null) => {
        const pendingCheckout = pendingCheckoutOverride || (typeof window !== 'undefined'
            ? JSON.parse(window.localStorage.getItem(PENDING_CHECKOUT_KEY) || '{}')
            : {});

        const capturePayerEmail = String(captureData?.payer?.email_address || '').trim().toLowerCase();
        const captureCustomIdEmail = String(captureData?.purchase_units?.[0]?.custom_id || '').trim().toLowerCase();
        const buyerEmail = String(pendingCheckout?.email || capturePayerEmail || captureCustomIdEmail || '').trim().toLowerCase();

        if (!buyerEmail) {
            throw new Error('Missing buyer email for order authorization.');
        }

        const pendingItems = Array.isArray(pendingCheckout?.items) ? pendingCheckout.items : [];
        const fallbackProductIds = pendingItems
            .filter((item) => item?.requiresSecureDownload !== false)
            .map((item) => String(item?.id || '').trim())
            .filter(Boolean);
        const artworkItems = pendingItems
            .filter((item) => String(item?.productType || '').startsWith('artwork-'))
            .filter((item) => item?.svgMarkup);

        let links = [];
        if (fallbackProductIds.length > 0) {
            links = await issueSecureLinks(orderId, buyerEmail, fallbackProductIds);
            saveLinksToLocalStorage(orderId, buyerEmail, links);
        }

        const expandedArtworkItems = artworkItems.flatMap((item) => {
            const quantity = Math.max(1, Number(item.quantity) || 1);
            return Array.from({ length: quantity }, (_, copyIndex) => ({
                ...item,
                copyIndex,
                orderId,
                userEmail: buyerEmail,
            }));
        });

        if (typeof window !== 'undefined' && expandedArtworkItems.length > 0) {
            const previousArtwork = JSON.parse(window.localStorage.getItem('paid_artwork_files') || '[]');
            window.localStorage.setItem('paid_artwork_files', JSON.stringify([
                ...(Array.isArray(previousArtwork) ? previousArtwork : []),
                ...expandedArtworkItems,
            ]));
        }

        setDownloadLinks(links);
        setPaidArtworkItems(expandedArtworkItems);
        setGoogleReviewOptIn(buildGoogleReviewOptInPayload({
            orderId,
            email: buyerEmail,
            captureData,
            pendingCheckout,
            formCountry: shippingAddress.country,
        }));

        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(PENDING_CHECKOUT_KEY);
            window.localStorage.removeItem(CART_STORAGE_KEY);
        }

        setSuccess(true);
        dispatch(clearCart());
    };

    const downloadPaidArtwork = (item) => {
        if (typeof window === 'undefined' || !item?.svgMarkup) return;

        const safeName = String(item.fileName || item.title || 'artwork')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        if (item.format === 'png') {
            const image = new Image();
            const svgBlob = new Blob([item.svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);
            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 1600;
                canvas.height = 1600;
                const context = canvas.getContext('2d');
                context.fillStyle = '#ffffff';
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                URL.revokeObjectURL(svgUrl);
                canvas.toBlob((blob) => {
                    if (!blob) return;
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${safeName}.png`;
                    link.click();
                    URL.revokeObjectURL(url);
                }, 'image/png');
            };
            image.src = svgUrl;
            return;
        }

        const blob = new Blob([`<?xml version="1.0" encoding="utf-8"?>\n${item.svgMarkup}`], {
            type: 'image/svg+xml;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${safeName}.svg`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const saveLinksToLocalStorage = (orderId, userEmail, links) => {
        if (typeof window === 'undefined') return;

        const previous = readStoredDownloadLinks();
        const merged = mergeDownloadLinks([
            ...previous.filter((entry) => entry?.orderId !== orderId),
            ...links.map((link) => ({ ...link, orderId, userEmail })),
        ], []);

        window.localStorage.setItem(DOWNLOAD_LINKS_KEY, JSON.stringify(merged));
    };

    const handleExportLinksJson = () => {
        if (typeof window === 'undefined') return;
        const storedLinks = readStoredDownloadLinks();
        const linksToExport = storedLinks.length > 0 ? storedLinks : downloadLinks;

        if (linksToExport.length === 0) {
            setLinksMessage('No links available to export yet.');
            return;
        }

        const content = JSON.stringify({
            exportedAt: new Date().toISOString(),
            note: 'Temporary local backup of secure download links.',
            downloads: linksToExport,
        }, null, 2);

        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const dateTag = new Date().toISOString().slice(0, 10);
        const a = document.createElement('a');
        a.href = url;
        a.download = `download-links-${dateTag}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setLinksMessage('Links exported as JSON.');
    };

    const openImportPicker = () => {
        importFileInputRef.current?.click();
    };

    const handleImportLinksJson = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const parsed = JSON.parse(text);
            const importedLinks = normalizeImportedLinks(parsed);

            if (importedLinks.length === 0) {
                setLinksMessage('No valid download links found in this JSON file.');
                return;
            }

            const existingLinks = readStoredDownloadLinks();
            const merged = mergeDownloadLinks(existingLinks, importedLinks);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(DOWNLOAD_LINKS_KEY, JSON.stringify(merged));
            }
            setDownloadLinks((previousLinks) => mergeDownloadLinks(previousLinks, importedLinks));
            setLinksMessage(`Imported ${importedLinks.length} link(s). Imports are stacked.`);
        } catch (_error) {
            setLinksMessage('Invalid JSON file. Import failed.');
        } finally {
            event.target.value = '';
        }
    };

    const issueSecureLinks = async (orderId, email, fallbackProductIds = []) => {
        const response = await fetch('/api/secure-downloads/issue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId, email, fallbackProductIds }),
        });

        const data = await response.json();
        if (!response.ok) {
            const firstMissingReason = Array.isArray(data?.missingProducts) && data.missingProducts[0]?.reason
                ? ` First issue: ${data.missingProducts[0].reason}`
                : '';
            throw new Error((data?.error || 'Unable to issue secure links.') + firstMissingReason);
        }

        return Array.isArray(data?.downloads) ? data.downloads : [];
    };

    useEffect(() => {
        if (!router.isReady || captureHandledRef.current) return;

        const orderId = typeof router.query.token === 'string' ? router.query.token : '';
        const checkoutState = typeof router.query.checkout === 'string' ? router.query.checkout : '';

        if (!orderId && !checkoutState) return;
        captureHandledRef.current = true;

        if (checkoutState === 'cancel') {
            setSubmitError('Payment was cancelled. You can try again.');
            router.replace('/cart', undefined, { shallow: true });
            return;
        }

        if (!orderId) {
            router.replace('/cart', undefined, { shallow: true });
            return;
        }

        const captureApprovedOrder = async () => {
            setIsSubmitting(true);
            setSubmitError('');

            try {
                const captureResponse = await fetch(getApiUrl(`/api/payment/capture/${orderId}`), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const captureData = await captureResponse.json();
                if (!captureResponse.ok) {
                    throw new Error(captureData?.error || 'Unable to capture payment.');
                }

                await finalizeCapturedOrder(orderId, captureData);
                router.replace('/cart', undefined, { shallow: true });
            } catch (error) {
                setSubmitError(error?.message || 'Checkout capture failed. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        };

        captureApprovedOrder();
    }, [router.isReady, router.query, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (success && downloadLinks.length > 0 && !downloadsTriggeredRef.current) {
            downloadsTriggeredRef.current = true;
            downloadLinks.forEach((link, idx) => {
                if (link.url) {
                    setTimeout(() => {
                        const a = document.createElement('a');
                        a.href = link.url;
                        a.target = '_blank';
                        a.setAttribute('download', '');
                        a.click();
                    }, idx * 800);
                }
            });
        }
    }, [success, downloadLinks]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitLockRef.current) {
            return;
        }
        submitLockRef.current = true;
        setSubmitError('');
        setIsSubmitting(true);

        try {
            const { checkoutItems, orderPayload, checkoutAddresses } = buildCheckoutContext();
            persistPendingCheckout(checkoutItems, checkoutAddresses);

            const createOrderResponse = await fetch(getApiUrl('/api/checkout/order'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderPayload),
            });

            const createOrderData = await createOrderResponse.json();
            if (!createOrderResponse.ok || !createOrderData?.id) {
                throw new Error(createOrderData?.error || 'Unable to create order.');
            }

            const approveUrl = createOrderData?.links?.find((link) => link.rel === 'approve' || link.rel === 'payer-action')?.href;
            if (!approveUrl) {
                throw new Error('Unable to find PayPal approval URL (approve/payer-action).');
            }

            window.location.assign(approveUrl);
        } catch (error) {
            setSubmitError(error?.message || 'Checkout failed. Please try again.');
            submitLockRef.current = false;
            setIsSubmitting(false);
        }
    };

    if (success) {
        const googleReviewPayloadJson = googleReviewOptIn
            ? JSON.stringify(googleReviewOptIn).replace(/</g, '\\u003c')
            : '';

        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                {googleReviewOptIn ? (
                    <>
                        <Script id="google-customer-reviews-optin-init" strategy="afterInteractive">
                            {`
                                window.renderOptIn = function() {
                                    try {
                                        var optInPayload = ${googleReviewPayloadJson};
                                        if (!window.gapi || !window.gapi.load) return;
                                        window.gapi.load('surveyoptin', function() {
                                            window.gapi.surveyoptin.render(optInPayload);
                                        });
                                    } catch (error) {
                                        console.error('Google Customer Reviews opt-in error', error);
                                    }
                                };
                            `}
                        </Script>
                        <Script
                            id="google-customer-reviews-platform"
                            src="https://apis.google.com/js/platform.js?onload=renderOptIn"
                            strategy="afterInteractive"
                        />
                    </>
                ) : null}
                <Typography variant="h4" gutterBottom color="success.main">
                    Thank you for your order!
                </Typography>
                <Typography variant="body1" paragraph>
                    Your payment is verified and your order is ready.
                </Typography>
                {downloadLinks.length > 0 || paidArtworkItems.length > 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Download access is kept in temporary browser storage after checkout.
                    </Typography>
                ) : null}
                {downloadLinks.length > 0 ? (
                    <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Secure sheet links are valid for 7 days. You can export/import the link data as JSON to keep a local backup.
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
                            <Button variant="outlined" onClick={handleExportLinksJson}>
                                Export Links JSON
                            </Button>
                            <Button variant="outlined" onClick={openImportPicker}>
                                Import Links JSON
                            </Button>
                            <input
                                ref={importFileInputRef}
                                type="file"
                                accept="application/json,.json"
                                style={{ display: 'none' }}
                                onChange={handleImportLinksJson}
                            />
                        </Box>
                    </>
                ) : null}
                {linksMessage ? (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {linksMessage}
                    </Typography>
                ) : null}

                {downloadLinks.length > 0 ? (
                    <Box sx={{ mt: 3, textAlign: 'left' }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 900 }}>
                            Your Downloads
                        </Typography>
                        {downloadLinks.map((link) => (
                            <Box key={link.productId} sx={{ mb: 3 }}>
                                <Button
                                    component="a"
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ fontWeight: '900', mb: link.isBundle ? 2 : 0 }}
                                >
                                    Download {link.title || link.productId} ({String(link.format || (link.isBundle ? 'pdf' : 'file')).toUpperCase()})
                                </Button>
                                {link.isBundle && Array.isArray(link.sheets) && link.sheets.length > 0 && (
                                    <Box sx={{ pl: { xs: 1, sm: 3 }, borderLeft: '3px solid var(--brutal-ink)', mt: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: 'text.secondary' }}>
                                            Or download individual sheets:
                                        </Typography>
                                        {link.sheets.map((sheet) => (
                                            <Box key={sheet.id} sx={{ mb: 2, p: 1.5, border: '2px solid var(--brutal-ink)', borderRadius: 1, bgcolor: 'var(--brutal-paper)' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 800, mb: 1 }}>
                                                    {sheet.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    <Button
                                                        size="small"
                                                        component="a"
                                                        href={`${link.url}&item=${sheet.id}&format=pdf`}
                                                        target="_blank"
                                                        variant="outlined"
                                                        sx={{ py: 0.5, px: 1.5, fontSize: '0.75rem', fontWeight: 800 }}
                                                    >
                                                        PDF
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        component="a"
                                                        href={`${link.url}&item=${sheet.id}&format=png&labelDisplay=notes`}
                                                        target="_blank"
                                                        variant="outlined"
                                                        sx={{ py: 0.5, px: 1.5, fontSize: '0.75rem', fontWeight: 800 }}
                                                    >
                                                        PNG (Notes)
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        component="a"
                                                        href={`${link.url}&item=${sheet.id}&format=png&labelDisplay=intervals`}
                                                        target="_blank"
                                                        variant="outlined"
                                                        sx={{ py: 0.5, px: 1.5, fontSize: '0.75rem', fontWeight: 800 }}
                                                    >
                                                        PNG (Intervals)
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        component="a"
                                                        href={`${link.url}&item=${sheet.id}&format=png&labelDisplay=fingering`}
                                                        target="_blank"
                                                        variant="outlined"
                                                        sx={{ py: 0.5, px: 1.5, fontSize: '0.75rem', fontWeight: 800 }}
                                                    >
                                                        PNG (Fingering)
                                                    </Button>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </Box>
                ) : null}

                {paidArtworkItems.length > 0 ? (
                    <Box sx={{ mt: 3, textAlign: 'left' }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 900 }}>
                            Your Paid Artwork Files
                        </Typography>
                        {paidArtworkItems.map((item) => (
                            <Button
                                key={`${item.id}-${item.copyIndex}`}
                                onClick={() => downloadPaidArtwork(item)}
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ fontWeight: 900, mb: 1 }}
                            >
                                Download {item.title} ({String(item.format || 'svg').toUpperCase()})
                            </Button>
                        ))}
                    </Box>
                ) : null}

                {downloadLinks.length > 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                        Open the Download Links page to review links saved in this temporary local storage on this browser.
                    </Typography>
                ) : null}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button variant="contained" href="/download_links">
                        Go to Download Links
                    </Button>
                    <Button variant="contained" href="/">
                        Return to Home
                    </Button>
                </Box>
            </Container>
        );
    }

    if (items.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Your Cart is Empty
                </Typography>
                <Button variant="contained" href="/#store" sx={{ mt: 2 }}>
                    Go to Store
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 10 }}>
            <Head>
                <title>Shopping Cart | Guitar Sheets Store</title>
                <meta
                    name="keywords"
                    content={DEFAULT_KEYWORDS}
                />
                <meta
                    name="description"
                    content="Review your cart and checkout guitar sheets and music products. Secure checkout for digital and physical guitar learning materials."
                />
            </Head>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Shopping Cart
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Paper elevation={0} variant="outlined">
                        {items.map((item) => (
                            <Box key={item.id}>
                                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                                    <CartItemThumbnail item={item} />

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">{item.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ${Number(item.price).toFixed(2)}
                                            {item.variantSummary ? ` | ${item.variantSummary}` : ''}
                                        </Typography>
                                    </Box>

                                    {item.allowQuantity ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mx: 2, border: '2px solid var(--brutal-ink)' }}>
                                            <IconButton size="small" onClick={() => dispatch(updateQuantity(item.id, Math.max(1, Number(item.quantity) - 1)))}>
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                            <Typography variant="body2" sx={{ minWidth: 28, textAlign: 'center', fontWeight: 900 }}>
                                                {item.quantity}
                                            </Typography>
                                            <IconButton size="small" onClick={() => dispatch(updateQuantity(item.id, Number(item.quantity) + 1))}>
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" sx={{ mx: 2 }}>
                                            Qty: 1
                                        </Typography>
                                    )}

                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 60, textAlign: 'right' }}>
                                        ${(Number(item.price) * Math.max(1, Number(item.quantity) || 1)).toFixed(2)}
                                    </Typography>

                                    <IconButton color="error" onClick={() => dispatch(removeFromCart(item.id))} sx={{ ml: 1 }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                                <Divider />
                            </Box>
                        ))}
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h5" color="secondary" fontWeight="bold">${total.toFixed(2)}</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>checkout details</Typography>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 900 }}>
                                            Contact
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField required fullWidth type="email" label="Email Address" name="email" value={formData.email} onChange={handleInputChange} size="small" />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 900 }}>
                                            Shipping Address
                                        </Typography>
                                    </Grid>
                                    {renderAddressFields(shippingAddress, handleAddressChange(setShippingAddress), 'shipping')}

                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                        <FormControlLabel
                                            control={<Checkbox checked={billingSame} onChange={(event) => setBillingSame(event.target.checked)} />}
                                            label="Billing address is the same as shipping"
                                        />
                                    </Grid>

                                    {!billingSame ? (
                                        <>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 900 }}>
                                                    Billing Address
                                                </Typography>
                                            </Grid>
                                            {renderAddressFields(billingAddress, handleAddressChange(setBillingAddress), 'billing')}
                                        </>
                                    ) : null}

                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 1 }} />
                                        <FormControlLabel
                                            control={<Checkbox checked={returnShipping} onChange={(event) => setReturnShipping(event.target.checked)} />}
                                            label="Include return-shipping option when available"
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                                            Payment Method
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            PayPal Checkout
                                        </Typography>
                                    </Grid>
                                </Grid>
                                {submitError ? (
                                    <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                                        {submitError}
                                    </Typography>
                                ) : null}

                                {/* Shipping notice */}
                                <Box
                                    sx={{
                                        mt: 3,
                                        p: 1.5,
                                        bgcolor: '#fff8e1',
                                        border: '1.5px solid #f0b429',
                                        borderRadius: 1,
                                    }}
                                >
                                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.3 }}>
                                        ⚠️ Shipping & handling fee applies
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        A shipping & handling fee is added at checkout. All products are delivered digitally by email within 2–3 working days.{' '}
                                        <Link href="/shipping-policy" style={{ color: 'inherit', fontWeight: 700 }}>
                                            Learn more
                                        </Link>
                                    </Typography>
                                </Box>

                                <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 2 }} disabled={isSubmitting}>
                                    {isSubmitting ? 'Processing...' : `Pay with PayPal ($${total.toFixed(2)})`}
                                </Button>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.2 }}>
                                    You will be redirected to PayPal to complete payment securely.
                                </Typography>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CartPage;
