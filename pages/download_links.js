import React, { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import {
    Container,
    Typography,
    Box,
    Button,
    TextField,
    Card,
    CardContent,
} from '@mui/material';

const DOWNLOAD_LINKS_KEY = 'secure_download_links';

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

const DownloadLinksPage = () => {
    const [links, setLinks] = useState([]);
    const [emailFilter, setEmailFilter] = useState('');
    const [storageMessage, setStorageMessage] = useState('');
    const importFileInputRef = useRef(null);

    useEffect(() => {
        setLinks(readStoredDownloadLinks());
    }, []);

    const filteredLinks = useMemo(() => {
        const normalizedEmail = emailFilter.trim().toLowerCase();
        if (!normalizedEmail) return links;
        return links.filter((link) => String(link?.userEmail || '').toLowerCase() === normalizedEmail);
    }, [links, emailFilter]);

    const handleExportLinksJson = () => {
        if (typeof window === 'undefined') return;
        if (links.length === 0) {
            setStorageMessage('No links available to export.');
            return;
        }

        const content = JSON.stringify({
            exportedAt: new Date().toISOString(),
            note: 'Temporary local backup of secure download links.',
            downloads: links,
        }, null, 2);

        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const dateTag = new Date().toISOString().slice(0, 10);
        const a = document.createElement('a');
        a.href = url;
        a.download = `download-links-${dateTag}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setStorageMessage('Links exported as JSON.');
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
                setStorageMessage('No valid download links found in this JSON file.');
                return;
            }

            const merged = mergeDownloadLinks(readStoredDownloadLinks(), importedLinks);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(DOWNLOAD_LINKS_KEY, JSON.stringify(merged));
            }
            setLinks(merged);
            setStorageMessage(`Imported ${importedLinks.length} link(s). Imports are stacked.`);
        } catch (_error) {
            setStorageMessage('Invalid JSON file. Import failed.');
        } finally {
            event.target.value = '';
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 10 }}>
            <Head>
                <title>Download Links | Guitar Sheets Store</title>
            </Head>

            <Typography variant="h4" gutterBottom fontWeight="bold">
                Your Download Links
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Download links are saved locally on this browser after successful payments.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                We do not have a database for this page. These links live in temporary browser storage.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Secure links are valid for 7 days, so export a JSON backup if needed.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
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
            {storageMessage ? (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {storageMessage}
                </Typography>
            ) : null}

            <TextField
                fullWidth
                label="Filter by Email"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                size="small"
                sx={{ mb: 3 }}
            />

            {filteredLinks.length === 0 ? (
                <Typography>No stored download links found for this browser/email.</Typography>
            ) : (
                filteredLinks.map((link, index) => (
                    <Card key={`${link.orderId || 'order'}-${link.productId || 'product'}-${index}`} variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {link.title || link.productId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Order: {link.orderId || 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                User: {link.userEmail || 'N/A'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: link.isBundle ? 2 : 0 }}>
                                <Button
                                    component="a"
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="contained"
                                    color="primary"
                                    sx={{ fontWeight: '900' }}
                                >
                                    Download {String(link.format || (link.isBundle ? 'pdf' : 'file')).toUpperCase()}
                                </Button>
                            </Box>
                            {link.isBundle && Array.isArray(link.sheets) && link.sheets.length > 0 && (
                                <Box sx={{ pl: { xs: 1, sm: 3 }, borderLeft: '3px solid var(--brutal-ink)', mt: 2 }}>
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
                        </CardContent>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default DownloadLinksPage;
