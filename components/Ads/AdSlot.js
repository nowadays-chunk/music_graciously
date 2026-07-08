import React, { useEffect, useRef } from 'react';

/**
 * AdSlot component for Google AdSense.
 * Uses a ref to ensure the ad is pushed only once per component mount.
 */
const AdSlot = ({
    adSlot = "2963007271",
    adFormat = "auto",
    fullWidthResponsive = "true",
    minHeight = 100,
    style = {},
    adLayout
}) => {
    const adInitialized = useRef(false);
    const containerRef = useRef(null);
    const retryTimeoutRef = useRef(null);

    useEffect(() => {
        // Prevent multiple pushes in React StrictMode
        if (adInitialized.current) return;

        let attempts = 0;
        const maxAttempts = 60;

        const tryInitializeAd = () => {
            if (adInitialized.current) return;

            const containerWidth = containerRef.current?.offsetWidth || 0;
            if (containerWidth <= 0) {
                attempts += 1;
                if (attempts < maxAttempts) {
                    retryTimeoutRef.current = setTimeout(tryInitializeAd, 200);
                }
                return;
            }

            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                adInitialized.current = true;
            } catch (e) {
                // Avoid noisy logs for known layout timing issues.
                if (!String(e?.message || '').includes('No slot size for availableWidth=0')) {
                    console.error("Adsbygoogle error:", e);
                }
            }
        };

        tryInitializeAd();

        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
        };
    }, [adSlot, adFormat, fullWidthResponsive, adLayout]); // Re-run if slot changes, though usually it's per mount

    return (
        <div
            ref={containerRef}
            style={{
                overflow: 'hidden',
                minHeight: `${minHeight}px`,
                width: '100%',
                ...style,
            }}
        >
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-3419259043892692"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive}
                data-ad-layout={adLayout}
            />
        </div>
    );
};

export default AdSlot;
