import React, { useMemo, useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { DEFAULT_KEYWORDS } from '../../data/seo';
import {
    Container,
    Grid,
    Box,
    Typography,
    Breadcrumbs,
    Button,
    IconButton,
    Card,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack,
    Chip,
    Divider,
    Dialog
} from '@mui/material';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { addToCart, toggleCart } from '../../redux/actions/cartActions';
import productsData from '../../data/products.json';
import glamourSvgProducts from '../../data/glamourSvgProducts.json';
import ProductArtwork from '../../components/Graphics/ProductArtwork';
import { getAffinity, applyStorefrontPersonalization } from '../../core/marketing/affinity';
import {
    ApparelIcon,
    ScaleIcon,
    ShieldIcon,
    LightningIcon,
    ChartIcon,
    TargetIcon,
    FilterIcon,
    LightbulbIcon,
    FlameIcon,
    KeyIcon,
    GuitarIcon,
    PianoIcon,
    BassIcon,
    UkuleleIcon,
    ViolinIcon,
    DoubleBassIcon,
    SaxophoneIcon,
    TrumpetIcon
} from '../../components/Graphics/BrutalistIcons';

export async function getStaticProps() {
    return {
        props: {
            staticProducts: productsData,
        },
        revalidate: 60,
    };
}

const STORE_GRID_COLUMNS = {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(3, 1fr)'
};

const INSTRUMENT_FILTERS = [
    { id: 'guitar', label: 'Guitar', Icon: GuitarIcon, color: 'var(--brutal-pink)' },
    { id: 'piano', label: 'Piano', Icon: PianoIcon, color: 'var(--brutal-blue)' },
    { id: 'ukulele', label: 'Ukulele', Icon: UkuleleIcon, color: 'var(--brutal-mint)' },
    { id: 'violin', label: 'Violin', Icon: ViolinIcon, color: 'var(--brutal-yellow)' },
    { id: 'bass', label: 'Bass', Icon: BassIcon, color: 'var(--brutal-orange)' },
    { id: 'double-bass', label: 'Double Bass', Icon: DoubleBassIcon, color: 'var(--brutal-mint)' },
    { id: 'trumpet', label: 'Trumpet', Icon: TrumpetIcon, color: 'var(--brutal-blue)' },
    { id: 'saxophone', label: 'Saxophone', Icon: SaxophoneIcon, color: 'var(--brutal-pink)' },
];

const getInstrumentMeta = (instrumentId = 'guitar') => (
    INSTRUMENT_FILTERS.find((instrument) => instrument.id === instrumentId) || INSTRUMENT_FILTERS[0]
);

const renderInstrumentIcon = (instrumentId = 'guitar', size = 24) => {
    const { Icon } = getInstrumentMeta(instrumentId);

    return (
        <Box
            component="span"
            sx={{
                width: size,
                height: size,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                '& svg': { width: size, height: size, margin: 0 },
            }}
        >
            <Icon size={size} />
        </Box>
    );
};

const InstrumentBadge = ({ instrumentId = 'guitar', iconSize = 18, sx }) => {
    const instrumentMeta = getInstrumentMeta(instrumentId);

    return (
        <Chip
            icon={renderInstrumentIcon(instrumentId, iconSize)}
            label={instrumentMeta.label}
            sx={{
                bgcolor: instrumentMeta.color,
                color: 'var(--brutal-ink)',
                border: '2px solid var(--brutal-ink)',
                fontWeight: 900,
                fontSize: '0.65rem',
                height: 30,
                '& .MuiChip-icon': { ml: 0.75, mr: -0.25 },
                '& .MuiChip-label': { px: 0.85 },
                ...sx,
            }}
        />
    );
};

const getApparelTheme = (slug) => {
    const s = String(slug);
    switch (s) {
        case '01': return { label: 'Guitar', color: 'var(--brutal-pink)' };
        case '02': return { label: 'Violin', color: 'var(--brutal-yellow)' };
        case '03': return { label: 'Amplifier', color: 'var(--brutal-orange)' };
        case '04': return { label: 'Festival', color: 'var(--brutal-blue)' };
        case '05':
        case '06':
        case '07':
        case '12':
        case '16':
        case '17':
        case '21':
        case '22':
        case '27':
        case '28':
        case '29':
        case '30':
            return { label: 'Theory', color: 'var(--brutal-mint)' };
        case '08': return { label: 'Tempo', color: 'var(--brutal-yellow)' };
        case '09': return { label: 'Rhythm', color: 'var(--brutal-pink)' };
        case '10': return { label: 'Bass', color: 'var(--brutal-orange)' };
        case '11': return { label: 'Pitch', color: 'var(--brutal-blue)' };
        case '13': return { label: 'Guitar', color: 'var(--brutal-pink)' };
        case '14': return { label: 'Production', color: 'var(--brutal-orange)' };
        case '15': return { label: 'Piano', color: 'var(--brutal-blue)' };
        case '18': return { label: 'Acoustic', color: 'var(--brutal-yellow)' };
        case '19': return { label: 'Guitar', color: 'var(--brutal-pink)' };
        case '20': return { label: 'Viola', color: 'var(--brutal-yellow)' };
        case '23': return { label: 'Practice', color: 'var(--brutal-blue)' };
        case '24': return { label: 'Stage', color: 'var(--brutal-blue)' };
        case '25': return { label: 'Amplifier', color: 'var(--brutal-orange)' };
        case '26': return { label: 'Guitar', color: 'var(--brutal-pink)' };
        case '31': return { label: 'Violin', color: 'var(--brutal-yellow)' };
        default: return { label: 'Artwork', color: 'var(--brutal-blue)' };
    }
};

const getStorePageSize = () => {
    if (typeof window === 'undefined') return 9;
    if (window.matchMedia('(max-width: 599.95px)').matches) return 3;
    if (window.matchMedia('(max-width: 899.95px)').matches) return 6;
    return 9;
};

const StoreSectionHeader = ({ icon, title, meta, subtitle }) => (
    <Box
        sx={{
            mb: 3,
            p: { xs: 2.25, sm: 3 },
            bgcolor: 'var(--brutal-paper)',
            border: '4px solid var(--brutal-ink)',
            boxShadow: 'var(--brutal-shadow-small)',
            borderRadius: '4px',
        }}
    >
        <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                <Box
                    sx={{
                        width: 54,
                        height: 54,
                        flex: '0 0 54px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'var(--brutal-yellow)',
                        border: '3px solid var(--brutal-ink)',
                        boxShadow: '4px 4px 0 var(--brutal-ink)',
                    }}
                >
                    {icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            m: 0,
                            lineHeight: 1.05,
                            letterSpacing: 0,
                            fontSize: { xs: '1.65rem', sm: '2rem', md: '2.25rem' }
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 800, color: 'text.secondary', mt: 0.75 }}>
                        {subtitle}
                    </Typography>
                </Box>
            </Box>
            <Chip
                label={meta}
                sx={{
                    bgcolor: 'var(--brutal-mint)',
                    color: 'var(--brutal-ink)',
                    border: '2px solid var(--brutal-ink)',
                    borderRadius: '4px',
                    fontWeight: 900,
                    height: 'auto',
                    '& .MuiChip-label': { py: 0.7, whiteSpace: 'normal' },
                }}
            />
        </Box>
    </Box>
);

const INSIGHTS = [
    "⚡ Hand-coded solo for fun! Every visual guide is created by a passionate developer-musician.",
    "🛡️ 100% programmatically verified! No transcription errors or typos. Pure math & music theory.",
    "📐 We offer custom bundles for 8 instruments, covering Guitar, Piano, Bass, Ukulele, Violin, Double Bass, Saxophone, and Trumpet.",
    "🔑 Full coverage across all 12 keys! Master CAGED layouts in any tonality.",
    "⚡ Total catalog size: 288 unique study bundles compiled dynamically.",
    "🎯 8 distinct scale systems per key, mapped for all instruments.",
    "🎹 8 distinct chord systems per key, mapped for all instruments.",
    "🎻 8 arpeggio systems per key, mapped for all instruments.",
    "💡 Need chord-scale relationships? Check out the interactive map on /play/matches!",
    "🎸 Play all instruments! Never look lost or unprepared in a rehearsal studio again.",
    "🛡️ Ethically printed! Apparel is created locally on premium 100% ring-spun cotton.",
    "📥 Instant delivery! Get cryptographically secure PDF download links immediately in your inbox.",
    "📐 Unlimited vector scaling! Print diagram sheets up to poster size without losing crispness.",
    "🎯 Master CAGED visually! Designed for quick fingerboard interval recognition.",
    "🔒 100% secure Stripe payment. No credentials or password registration required.",
    "👕 Apparel designs are generated programmatically using raw SVG and Javascript canvas code.",
    "💡 Did you know? A C chord bundle on Piano shares identical pitch relations with a C bundle on Bass.",
    "⚡ 30-day easy exchanges and returns guarantee on all premium apparel.",
    "🎹 Explore first, buy later: download single visual sheets completely free to test them out.",
    "🎸 Interactive siblings: every chord and scale page contains links to its relative modes."
];

const StorePage = ({ staticProducts }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [activeKey, setActiveKey] = useState('C');
    const [activeInstrument, setActiveInstrument] = useState('guitar');
    const [activeElement, setActiveElement] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(9);
    const [apparelVisibleCount, setApparelVisibleCount] = useState(9);
    const [storePageSize, setStorePageSize] = useState(9);
    const storePageSizeRef = useRef(9);
    const prevFilterRef = useRef({ activeKey: 'C', activeInstrument: 'guitar', activeElement: 'all', searchQuery: '' });

    // Stickers state
    const [stickerProducts, setStickerProducts] = useState([]);
    const [stickerColors, setStickerColors] = useState([]);

    const handleShuffleStickers = () => {
        const svgs = (glamourSvgProducts || [])
            .filter((product) => product.format === 'svg' && product.id?.startsWith('glamour-svg-'))
            .map((product, index) => {
                const numericIndex = Math.max(0, index);
                return {
                    id: product.id,
                    index: numericIndex,
                    title: String(product.title || 'Music Theory Artwork').replace(/\s+SVG License$/i, ' Sticker'),
                    image: product.image,
                    description: product.description || "Premium vinyl die-cut music theory sticker."
                };
            });
        
        const shuffled = [...svgs].sort(() => 0.5 - Math.random()).slice(0, 9);
        
        const brutalColors = [
            'var(--brutal-pink)',
            'var(--brutal-yellow)',
            'var(--brutal-blue)',
            'var(--brutal-mint)',
            'var(--brutal-orange)',
            'var(--brutal-paper)'
        ];
        
        const randomColors = Array.from({ length: 9 }, () => {
            return brutalColors[Math.floor(Math.random() * brutalColors.length)];
        });

        setStickerProducts(shuffled);
        setStickerColors(randomColors);
    };

    useEffect(() => {
        handleShuffleStickers();
    }, []);

    // Modal states
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [customQuantity, setCustomQuantity] = useState(1);
    const [customApparelType, setCustomApparelType] = useState('T-Shirt');
    const [customApparelNeck, setCustomApparelNeck] = useState('Crew neck');
    const [customApparelColor, setCustomApparelColor] = useState({ name: 'Navy', hex: '#17233d', ink: '#ffffff' });
    const [customApparelSize, setCustomApparelSize] = useState('M');
    const [isPersonalized, setIsPersonalized] = useState(false);
    const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
    const [showInsight, setShowInsight] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);

    useEffect(() => {
        const affinity = getAffinity();
        if (affinity.preferredKey) {
            setActiveKey(affinity.preferredKey);
            setIsPersonalized(true);
        }
        applyStorefrontPersonalization(router.push);
    }, [router.push]);

    useEffect(() => {
        if (!modalOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                setCarouselIndex((prev) => (prev === 0 ? 1 : 0));
            } else if (e.key === 'ArrowRight') {
                setCarouselIndex((prev) => (prev === 0 ? 1 : 0));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalOpen]);

    useEffect(() => {
        let isMounted = true;
        const runCycle = async () => {
            while (isMounted) {
                // Wait 60 seconds before showing the next popup
                await new Promise(r => setTimeout(r, 60000));
                if (!isMounted) break;
                setShowInsight(true);
                
                // Keep showing for 6 seconds
                await new Promise(r => setTimeout(r, 6000));
                if (!isMounted) break;
                setShowInsight(false);
                
                // Wait for fade out (800ms), then increment index
                await new Promise(r => setTimeout(r, 800));
                if (!isMounted) break;
                setCurrentInsightIndex((prev) => (prev + 1) % INSIGHTS.length);
            }
        };
        runCycle();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const syncStorePageSize = () => {
            const nextPageSize = getStorePageSize();
            const previousPageSize = storePageSizeRef.current || 9;

            storePageSizeRef.current = nextPageSize;
            setStorePageSize(nextPageSize);
            setVisibleCount((current) => Math.max(1, Math.ceil(current / previousPageSize)) * nextPageSize);
            setApparelVisibleCount((current) => Math.max(1, Math.ceil(current / previousPageSize)) * nextPageSize);
        };

        syncStorePageSize();
        window.addEventListener('resize', syncStorePageSize);
        return () => window.removeEventListener('resize', syncStorePageSize);
    }, []);

    const products = useMemo(() => {
        const list = staticProducts || productsData || [];
        return list.filter((product) => {
            // 1. Filter by key
            if (activeKey !== 'all') {
                // musicKey is stored as e.g. "C#", "A", "G#"
                if ((product.musicKey || '').toLowerCase() !== activeKey.toLowerCase()) {
                    return false;
                }
            }

            // 2. Filter by instrument
            if (activeInstrument !== 'all') {
                const prodInstrument = product.instrument || 'guitar'; // default guitar for backward compat
                if (prodInstrument !== activeInstrument) {
                    return false;
                }
            }

            // 3. Filter by element type (Chord, Scale, Arpeggio)
            if (activeElement !== 'all') {
                if (product.musicType !== activeElement) {
                    return false;
                }
            }

            // 4. Filter by search query
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const titleMatch = String(product.title || '').toLowerCase().includes(query);
                const descMatch = String(product.description || '').toLowerCase().includes(query);
                const typeMatch = String(product.musicType || '').toLowerCase().includes(query);
                const keyMatch = String(product.musicKey || '').toLowerCase().includes(query);
                const instrMatch = String(product.instrument || '').toLowerCase().includes(query);
                if (!titleMatch && !descMatch && !typeMatch && !keyMatch && !instrMatch) {
                    return false;
                }
            }

            return true;
        });
    }, [staticProducts, activeKey, activeInstrument, activeElement, searchQuery]);

    const apparelItems = useMemo(() => (
        (glamourSvgProducts || [])
            .filter((product) => product.format === 'svg' && product.id?.startsWith('glamour-svg-'))
            .map((product, index) => ({
                index,
                baseTitle: String(product.title || 'Music Theory Artwork').replace(/\s+SVG License$/i, ' Coded'),
                image: product.image
            }))
    ), []);

    // Synchronously reset visible count when filters change (avoids SSR hydration mismatch)
    const prev = prevFilterRef.current;
    if (
        prev.activeKey !== activeKey ||
        prev.activeInstrument !== activeInstrument ||
        prev.activeElement !== activeElement ||
        prev.searchQuery !== searchQuery
    ) {
        prevFilterRef.current = { activeKey, activeInstrument, activeElement, searchQuery };
        if (visibleCount !== storePageSize) setVisibleCount(storePageSize);
    }

    const getFixedBundleCartItem = (product) => ({
        ...product,
        quantity: 1,
        allowQuantity: false,
        format: 'pdf',
        labelDisplay: 'notes'
    });

    const getProductUrl = (product) => `/product/${encodeURIComponent(product.id)}`;

    const handleBundleAddToCart = (product) => {
        dispatch(addToCart(getFixedBundleCartItem(product)));
        dispatch(toggleCart());
    };

    const handleBundleBuyNow = (product) => {
        dispatch(addToCart(getFixedBundleCartItem(product)));
        router.push('/cart');
    };

    const handleProductClick = (product) => {
        if (product.productType === 'artwork-apparel') {
            router.push(`/product/${encodeURIComponent(product.id || product.title || 'glamour-apparel')}`);
            return;
        }
        router.push(getProductUrl(product));
    };

    const toCartPart = (value) => String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const getApparelPrice = (type) => (type === 'T-Shirt' ? 29.99 : 49.99);

    const buildApparelCartItem = () => {
        if (!selectedProduct) return null;

        const baseTitle = selectedProduct.baseTitle;
        const fullTitle = `${baseTitle} (${customApparelType} / ${customApparelNeck} / ${customApparelColor.name} / Size ${customApparelSize})`;
        const price = getApparelPrice(customApparelType);

        return {
            id: `apparel-${selectedProduct.index}-${toCartPart(customApparelType)}-${toCartPart(customApparelNeck)}-${toCartPart(customApparelColor.name)}-${toCartPart(customApparelSize)}`,
            title: fullTitle,
            price,
            quantity: customQuantity,
            allowQuantity: true,
            requiresSecureDownload: false,
            productType: 'artwork-apparel',
            templateIndex: selectedProduct.index,
            variantSummary: `${customApparelType} | ${customApparelNeck} | ${customApparelColor.name} | ${customApparelSize}`,
            apparel: {
                garment: customApparelType,
                neck: customApparelNeck,
                color: customApparelColor.name,
                colorHex: customApparelColor.hex,
                size: customApparelSize,
            }
        };
    };

    const handleModalAddToCart = () => {
        const cartItem = buildApparelCartItem();
        if (!cartItem) return;

        dispatch(addToCart(cartItem));
        dispatch(toggleCart());
        setModalOpen(false);
    };

    const handleModalBuy = () => {
        const cartItem = buildApparelCartItem();
        if (!cartItem) return;

        dispatch(addToCart(cartItem));
        setModalOpen(false);
        router.push('/cart');
    };

    const [apparelSizes] = useState({ 0: 'M', 1: 'M', 2: 'M' });
    const [apparelTypes] = useState({ 0: 'T-Shirt', 1: 'T-Shirt', 2: 'T-Shirt' });
    const [apparelColors] = useState({
        0: { name: 'Navy', hex: '#17233d', ink: '#ffffff' },
        1: { name: 'Forest Green', hex: '#1f4a37', ink: '#ffffff' },
        2: { name: 'Red', hex: '#a6262d', ink: '#ffffff' }
    });

    return (
        <>
            <Head>
                <title>Curated Key of C Guitar Bundles | Secure Music Store</title>
                <meta name="description" content="Shop premium key of C guitar chord, scale, and arpeggio sheets. Structured CAGED layouts designed for quick learning and safety." />
                <meta name="keywords" content={DEFAULT_KEYWORDS} />
            </Head>

            <Box sx={{ bgcolor: 'var(--brutal-bg)', minHeight: '100vh', pt: 8, pb: 10 }}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Box sx={{ mb: 2 }}>
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                            <Link href="/" style={{ textDecoration: 'none', color: 'var(--brutal-ink)', opacity: 0.6, fontWeight: 700 }}>Home</Link>
                            <Typography sx={{ color: 'var(--brutal-ink)', fontWeight: 900 }}>Books</Typography>
                        </Breadcrumbs>
                    </Box>

                    {isPersonalized && (
                        <Box sx={{ mb: 4, p: 2, bgcolor: 'var(--brutal-pink)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <TargetIcon size={20} />
                                <Typography sx={{ fontWeight: 900, color: 'var(--brutal-ink)' }}>
                                    Showing bundles personalized for <strong>Key of {activeKey}</strong> — Shop directly:
                                </Typography>
                                {[
                                    { label: `${activeKey} Chords`, type: 'chords', color: 'var(--brutal-pink)' },
                                    { label: `${activeKey} Scales`, type: 'scales', color: 'var(--brutal-yellow)' },
                                    { label: `${activeKey} Arpeggios`, type: 'arppegios', color: 'var(--brutal-blue)' }
                                ].map(({ label, type, color }) => {
                                    const keySlug = activeKey.replace('#', 'sharp');
                                    const productId = `bundle-guitar-${keySlug}-${type}`;
                                    return (
                                        <Button
                                            key={type}
                                            size="small"
                                            onClick={() => {
                                                const el = document.getElementById(`product-${productId}`);
                                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                else {
                                                    const found = (staticProducts || productsData || []).find(p => p.id === productId);
                                                    if (found) handleProductClick(found);
                                                }
                                            }}
                                            sx={{
                                                fontWeight: 900,
                                                fontSize: '0.78rem',
                                                bgcolor: color,
                                                color: 'var(--brutal-ink)',
                                                border: '2px solid var(--brutal-ink)',
                                                boxShadow: '2px 2px 0 var(--brutal-ink)',
                                                '&:hover': { bgcolor: 'var(--brutal-paper)', boxShadow: 'none' }
                                            }}
                                        >
                                            {label} ➔
                                        </Button>
                                    );
                                })}
                            </Box>
                            <Button size="small" variant="contained" onClick={() => { setActiveKey('C'); setIsPersonalized(false); }} sx={{ bgcolor: 'var(--brutal-paper)', color: 'var(--brutal-ink)', border: '2px solid var(--brutal-ink)', fontWeight: 900, boxShadow: 'none', '&:hover': { bgcolor: 'var(--brutal-yellow)', boxShadow: 'none' } }}>Reset to Key of C</Button>
                        </Box>
                    )}

                    {/* 5. Stats & Insights Dashboard */}
                    <Box sx={{ mb: 6, p: 4, bgcolor: 'var(--brutal-paper)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow)', borderRadius: '4px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <ChartIcon size={32} />
                            <Typography variant="h4" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'var(--brutal-ink)', m: 0 }}>Store Catalog & Insight Data</Typography>
                        </Box>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={5}>
                                <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, color: 'var(--brutal-ink)' }}>Live Database Catalog</Typography>
                                <Grid container spacing={2}>
                                    {[
                                        { label: "Total Music Bundles", val: "288 Unique Products" },
                                        { label: "Licensed Custom SVGs", val: "150 Unique Designs" },
                                        { label: "Scales per Key", val: "8 Instruments" },
                                        { label: "Chords per Key", val: "8 Instruments" },
                                        { label: "Arpeggios per Key", val: "8 Instruments" },
                                        { label: "Physical Clothing", val: "T-Shirts & Sweaters" }
                                    ].map((stat, idx) => (
                                        <Grid item xs={6} key={idx}>
                                            <Box sx={{ p: 2, bgcolor: 'rgba(255, 253, 245, 0.8)', border: '2px solid var(--brutal-ink)', borderRadius: '4px' }}>
                                                <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'text.secondary', display: 'block', mb: 0.5 }}>{stat.label}</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 900, color: 'var(--brutal-ink)' }}>{stat.val}</Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <LightbulbIcon size={24} />
                                    <Typography variant="h6" sx={{ fontWeight: 900, color: 'var(--brutal-ink)', m: 0 }}>System Insights</Typography>
                                </Box>
                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                        <ScaleIcon size={24} />
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>SVG Artwork Shapes</Typography>
                                            <Typography variant="body2" color="text.secondary">Circles represent Chords, Triangles represent Scales, and Squares represent Arpeggios. Color themes automatically match each category for instant visual recognition.</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                        <ApparelIcon size={24} />
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Clothing Customization</Typography>
                                            <Typography variant="body2" color="text.secondary">Choose between T-Shirts or Sweaters directly in the card hover menu. Colors and sleeves adapt in real-time on the SVG mockup.</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                        <ShieldIcon size={24} />
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Infinitely Scalable Vectors</Typography>
                                            <Typography variant="body2" color="text.secondary">Downloaded as high-resolution vector PDFs (2480 x 3508 pixels). Infinitely scalable, designed to print up to poster size without pixelation.</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                        <LightningIcon size={24} />
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Multi-Instrument Alignment</Typography>
                                            <Typography variant="body2" color="text.secondary">All 8 instruments are synced to represent the exact same underlying mathematical pitch relations for unified tracking.</Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* 1. Catalog Filters Section */}
                    <Box sx={{ mb: 6, p: 4, bgcolor: 'rgba(255, 253, 245, 0.8)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow)', borderRadius: '4px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                            <FilterIcon size={32} />
                            <Typography variant="h4" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'var(--brutal-ink)', m: 0 }}>Smart Filters: {activeKey} • {activeInstrument.toUpperCase()} • {activeElement.toUpperCase()}</Typography>
                        </Box>
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>Select Instrument (8 options):</Typography>
                            <Grid container spacing={2}>
                                {INSTRUMENT_FILTERS.map((inst) => {
                                    const isActive = activeInstrument === inst.id;
                                    return (
                                        <Grid item xs={6} sm={3} md={1.5} key={inst.id}>
                                                <Box onClick={() => setActiveInstrument(inst.id)} sx={{ p: 2, minHeight: 118, textAlign: 'center', cursor: 'pointer', bgcolor: isActive ? inst.color : 'var(--brutal-paper)', border: '3px solid var(--brutal-ink)', boxShadow: isActive ? '3px 3px 0 var(--brutal-ink)' : 'none', borderRadius: '4px', transition: 'all 0.15s ease', '&:hover': { bgcolor: isActive ? inst.color : 'rgba(255, 144, 232, 0.15)', transform: 'scale(1.03)' } }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 40, mb: 1 }}>
                                                    {renderInstrumentIcon(inst.id, 36)}
                                                </Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>{inst.label}</Typography>
                                            </Box>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={8}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><KeyIcon size={20} /> Select Key (12 options):</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((k) => {
                                        const isActive = activeKey === k;
                                        return (
                                            <Button key={k} onClick={() => { setActiveKey(k); setIsPersonalized(false); }} sx={{ minWidth: '46px', height: '46px', fontWeight: 900, bgcolor: isActive ? 'var(--brutal-pink)' : 'var(--brutal-paper)', color: 'var(--brutal-ink)', border: '2px solid var(--brutal-ink)', borderRadius: '4px', boxShadow: isActive ? '2px 2px 0 var(--brutal-ink)' : 'none', '&:hover': { bgcolor: isActive ? 'var(--brutal-pink)' : 'var(--brutal-yellow)' } }}>{k}</Button>
                                        );
                                    })}
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><ScaleIcon size={20} /> Select Element (3 options):</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {[
                                        { id: 'all', label: 'All' }, { id: 'Chord', label: 'Chords' },
                                        { id: 'Scale', label: 'Scales' }, { id: 'Arpeggio', label: 'Arpeggios' }
                                    ].map((elem) => {
                                        const isActive = activeElement === elem.id;
                                        return (
                                            <Button key={elem.id} onClick={() => setActiveElement(elem.id)} sx={{ flexGrow: 1, fontWeight: 900, bgcolor: isActive ? 'var(--brutal-mint)' : 'var(--brutal-paper)', color: 'var(--brutal-ink)', border: '2px solid var(--brutal-ink)', borderRadius: '4px', boxShadow: isActive ? '2px 2px 0 var(--brutal-ink)' : 'none', '&:hover': { bgcolor: isActive ? 'var(--brutal-mint)' : 'var(--brutal-yellow)' } }}>{elem.label}</Button>
                                        );
                                    })}
                                </Box>
                            </Grid>
                        </Grid>
                        {/* Search Input Field */}
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                Search Products:
                            </Typography>
                            <Box
                                component="input"
                                type="text"
                                placeholder="Search by title, key, or type (e.g. 'C Scale')..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{
                                    width: '100%',
                                    p: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 900,
                                    border: '3px solid var(--brutal-ink)',
                                    borderRadius: '4px',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    bgcolor: 'var(--brutal-paper)',
                                    boxShadow: 'var(--brutal-shadow-small)',
                                    transition: 'all 0.15s ease',
                                    '&:focus': {
                                        bgcolor: 'var(--brutal-yellow)',
                                        boxShadow: '4px 4px 0 var(--brutal-ink)'
                                    }
                                }}
                            />
                        </Box>
                    </Box>

                    {/* 2. Products Carousel Section */}
                    <Box sx={{ mb: 8 }}>
                        <StoreSectionHeader
                            icon={<FlameIcon size={32} />}
                            title="PDF Sheet Bundles"
                            meta={`${products.length} product${products.length !== 1 ? 's' : ''} - showing ${Math.min(visibleCount, products.length)}`}
                            subtitle={products.length === 0
                                ? 'No products match your current filters.'
                                : `Fixed PDF downloads in notes format for Key of ${activeKey}: chord shapes, scale patterns, and arpeggio maps.`}
                        />

                        {/* Responsive Grid: 3 rows per page at every breakpoint */}
                        <Box
                            id="products-grid"
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: STORE_GRID_COLUMNS,
                                gap: 3,
                            }}
                        >
                            {products.slice(0, visibleCount).map((product) => {
                                return (
                                    <Box
                                        key={product.id}
                                        id={`product-${product.id}`}
                                        sx={{ width: '100%' }}
                                    >
                                    <Card
                                        onClick={() => router.push(getProductUrl(product))}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            border: '3px solid var(--brutal-ink)',
                                            boxShadow: 'var(--brutal-shadow)',
                                            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                            '&:hover': {
                                                transform: 'translate(-4px, -4px)',
                                                boxShadow: '10px 10px 0 var(--brutal-ink)',
                                            },
                                            '&:hover .hover-details-overlay': {
                                                transform: 'translateY(0)',
                                                opacity: 1
                                            }
                                        }}
                                    >
                                        {/* Normal State View */}
                                        <Box sx={{ height: 200, position: 'relative', bgcolor: 'transparent', borderBottom: '3px solid var(--brutal-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ProductArtwork product={product} height="100%" compact />
                                        </Box>
                                        <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 0.5, fontSize: '0.9rem', lineHeight: 1.2 }}>{product.title}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                                <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 900 }}>${product.price}</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <Chip label={product.musicType} sx={{ bgcolor: 'var(--brutal-paper)', color: 'var(--brutal-ink)', border: '2px solid var(--brutal-ink)', fontWeight: 900, fontSize: '0.65rem', height: 24, '& .MuiChip-label': { px: 0.75 } }} />
                                                    <InstrumentBadge instrumentId={product.instrument || 'guitar'} iconSize={14} sx={{ height: 24, fontSize: '0.6rem', border: '2px solid var(--brutal-ink)', '& .MuiChip-icon': { ml: 0.5, mr: -0.5, width: 14, height: 14 }, '& .MuiChip-label': { px: 0.5 } }} />
                                                </Box>
                                            </Box>
                                        </CardContent>

                                        {/* Hover Details Overlay */}
                                        <Box
                                            className="hover-details-overlay"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                bgcolor: 'var(--brutal-paper)',
                                                zIndex: 10,
                                                p: 2.5,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                transform: 'translateY(100%)',
                                                opacity: 0,
                                                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                                                border: 'none'
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 0.5, borderBottom: '2px solid var(--brutal-ink)', pb: 0.5, fontSize: '0.9rem' }}>{product.title}</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 700, lineHeight: 1.3, fontSize: '0.75rem', maxHeight: 80, overflow: 'hidden' }}>
                                                    {String(product.description || '').substring(0, 140)}...
                                                </Typography>
                                                <Stack spacing={0.3}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircleIcon sx={{ fontSize: 13, color: 'success.main' }} /><Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.68rem' }}>All 5 CAGED shapes</Typography></Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircleIcon sx={{ fontSize: 13, color: 'success.main' }} /><Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.68rem' }}>High-res PDF vector</Typography></Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircleIcon sx={{ fontSize: 13, color: 'success.main' }} /><Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.68rem' }}>Harmonic siblings cited</Typography></Box>
                                                </Stack>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    startIcon={<ShoppingCartIcon />}
                                                    onClick={(e) => { e.stopPropagation(); handleBundleAddToCart(product); }}
                                                    sx={{ fontWeight: 900, fontSize: '0.75rem', border: '2px solid var(--brutal-ink)', borderRadius: 0, boxShadow: '2px 2px 0 var(--brutal-ink)', bgcolor: 'var(--brutal-paper)', color: 'var(--brutal-ink)', '&:hover': { bgcolor: 'var(--brutal-yellow)' } }}
                                                >
                                                    Add To Cart
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    fullWidth
                                                    onClick={(e) => { e.stopPropagation(); handleBundleBuyNow(product); }}
                                                    sx={{ fontWeight: 900, fontSize: '0.75rem', border: '2px solid var(--brutal-ink)', borderRadius: 0, boxShadow: '2px 2px 0 var(--brutal-ink)', '&:hover': { bgcolor: 'var(--brutal-pink)', color: 'var(--brutal-ink)' } }}
                                                >
                                                    Buy Now
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Card>
                                    </Box>
                                );
                            })}
                        </Box>

                        {/* Load More adds one 3-row page for the current breakpoint */}
                        {products.length > visibleCount && (
                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                    {products.length - visibleCount} more products
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => setVisibleCount(prev => prev + storePageSize)}
                                    sx={{
                                        px: 4, py: 1.5,
                                        fontWeight: 900,
                                        fontSize: '1rem',
                                        bgcolor: 'var(--brutal-yellow)',
                                        color: 'var(--brutal-ink)',
                                        border: '3px solid var(--brutal-ink)',
                                        borderRadius: 0,
                                        boxShadow: 'var(--brutal-shadow-small)',
                                        '&:hover': { bgcolor: 'var(--brutal-pink)', boxShadow: '4px 4px 0 var(--brutal-ink)' }
                                    }}
                                >
                                    Load More ↓
                                </Button>
                            </Box>
                        )}
                    </Box>

                    {/* ─────────────────────────────────────────── */}
                    {/* 3. Apparel Section */}
                    <Box sx={{ mb: 8 }}>
                        <StoreSectionHeader
                            icon={<ApparelIcon size={32} />}
                            title="Customize Clothing"
                            meta={`${apparelItems.length} design${apparelItems.length !== 1 ? 's' : ''} available - showing ${Math.min(apparelVisibleCount, apparelItems.length)}`}
                            subtitle="Premium printed T-shirts and sweaters with Crew neck or V-neck, color, and size options."
                        />

                        {/* Apparel Grid uses the same 3-row responsive page as bundles */}
                        {(() => {
                            const visibleApparelItems = apparelItems.slice(0, apparelVisibleCount);
                            return (
                                <>
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: STORE_GRID_COLUMNS,
                                            gap: 3,
                                        }}
                                    >
                                    {visibleApparelItems.map((item) => {
                                        const garmentTypes = ['T-Shirt', 'Sweater'];
                                        const neckStyles = ['Crew neck', 'V-neck'];
                                        const apparelPalette = [
                                            { name: "Navy", hex: "#17233d", ink: "#ffffff" },
                                            { name: "Forest Green", hex: "#1f4a37", ink: "#ffffff" },
                                            { name: "Red", hex: "#a6262d", ink: "#ffffff" },
                                            { name: "Black", hex: "#111111", ink: "#ffffff" },
                                            { name: "Gray", hex: "#888888", ink: "#111111" }
                                        ];
                                        const selectedType = garmentTypes[item.index % 2];
                                        const selectedNeck = neckStyles[Math.floor(item.index / 2) % 2];
                                        const selectedColor = apparelPalette[(item.index * 3) % 5];
                                        const selectedSize = 'M';
                                        const price = getApparelPrice(selectedType);
                                        const title = `${item.baseTitle} ${selectedType}`;
                                        const apparelProduct = {
                                            id: `glamour-apparel-${item.index + 1}`,
                                            index: item.index,
                                            baseTitle: item.baseTitle,
                                            image: item.image,
                                            price,
                                            title,
                                            musicType: 'Apparel',
                                            productType: 'artwork-apparel',
                                            defaultType: selectedType,
                                            defaultNeck: selectedNeck,
                                            defaultColor: selectedColor,
                                            defaultSize: selectedSize
                                        };
                                        const themeInfo = getApparelTheme(String(item.index + 1).padStart(2, '0'));
                                        return (
                                            <Box
                                                key={item.index}
                                                sx={{ width: '100%' }}
                                            >
                                                <Card
                                                    onClick={() => handleProductClick(apparelProduct)}
                                                    sx={{
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                        cursor: 'pointer',
                                                        border: '3px solid var(--brutal-ink)',
                                                        boxShadow: 'var(--brutal-shadow)',
                                                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                                        '&:hover': {
                                                            transform: 'translate(-4px, -4px)',
                                                            boxShadow: '10px 10px 0 var(--brutal-ink)',
                                                        },
                                                        '&:hover .hover-details-overlay': {
                                                            transform: 'translateY(0)',
                                                            opacity: 1
                                                        }
                                                    }}
                                                >
                                                    {/* Apparel SVG Preview */}
                                                    <Box sx={{ bgcolor: '#f4efe7', borderBottom: '3px solid var(--brutal-ink)', p: 2, display: 'flex', justifyContent: 'center' }}>
                                                        <svg viewBox="0 0 260 270" width="100%" height="210" style={{ maxWidth: '210px' }}>
                                                            <path d="M 51 62 L 81 34 L 179 34 L 209 62 L 193 244 L 67 244 Z" fill={selectedColor.hex} stroke="#151515" strokeWidth="5" strokeLinejoin="round" />
                                                            {selectedNeck === 'V-neck' ? (
                                                                <path d="M 101 35 L 130 72 L 159 35" fill="none" stroke={selectedColor.ink} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                                                            ) : (
                                                                <path d="M 101 35 Q 130 67 159 35" fill="none" stroke={selectedColor.ink} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                                                            )}
                                                            {selectedType === 'T-Shirt' ? (
                                                                <>
                                                                    <path d="M 55 68 L 48 132 L 76 144 L 85 92" fill={selectedColor.hex} stroke="#151515" strokeWidth="5" strokeLinejoin="round" />
                                                                    <path d="M 205 68 L 212 132 L 184 144 L 175 92" fill={selectedColor.hex} stroke="#151515" strokeWidth="5" strokeLinejoin="round" />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <path d="M 55 68 L 35 200 L 60 206 L 85 92" fill={selectedColor.hex} stroke="#151515" strokeWidth="5" strokeLinejoin="round" />
                                                                    <path d="M 205 68 L 225 200 L 200 206 L 175 92" fill={selectedColor.hex} stroke="#151515" strokeWidth="5" strokeLinejoin="round" />
                                                                </>
                                                            )}
                                                            <rect x="91" y="98" width="78" height="78" rx="8" fill="#ffffff" stroke="#151515" strokeWidth="4" />
                                                            <image href={item.image} x="93" y="100" width="74" height="74" preserveAspectRatio="xMidYMid slice" clipPath={`url(#artwork-clip-${item.index})`} />
                                                            <defs><clipPath id={`artwork-clip-${item.index}`}><rect x="91" y="98" width="78" height="78" rx="8" /></clipPath></defs>
                                                        </svg>
                                                    </Box>
                                                    <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 0.5, fontSize: '0.9rem', lineHeight: 1.2 }}>{title}</Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                                            <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 900 }}>${price}</Typography>
                                                            <Chip
                                                                label={themeInfo.label}
                                                                sx={{
                                                                    bgcolor: themeInfo.color,
                                                                    color: 'var(--brutal-ink)',
                                                                    border: '2px solid var(--brutal-ink)',
                                                                    fontWeight: 900,
                                                                    fontSize: '0.65rem',
                                                                    height: 24,
                                                                    '& .MuiChip-label': { px: 0.85 }
                                                                }}
                                                            />
                                                        </Box>
                                                    </CardContent>

                                                    {/* Hover Overlay */}
                                                    <Box
                                                        className="hover-details-overlay"
                                                        sx={{
                                                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                                            bgcolor: 'var(--brutal-paper)', zIndex: 10, p: 2.5,
                                                            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                                            transform: 'translateY(100%)', opacity: 0,
                                                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                                                            border: 'none'
                                                        }}
                                                    >
                                                        <Box>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 0.5, borderBottom: '2px solid var(--brutal-ink)', pb: 0.5, fontSize: '0.9rem' }}>{title}</Typography>
                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 700, lineHeight: 1.3, fontSize: '0.75rem' }}>
                                                                Customizable premium apparel printed locally on 100% ring-spun cotton. High-definition graphic detailing.
                                                            </Typography>
                                                            <Stack spacing={0.3}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircleIcon sx={{ fontSize: 13, color: 'success.main' }} /><Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.68rem' }}>Choose color & size</Typography></Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircleIcon sx={{ fontSize: 13, color: 'success.main' }} /><Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.68rem' }}>T-Shirt or Sweater</Typography></Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircleIcon sx={{ fontSize: 13, color: 'success.main' }} /><Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.68rem' }}>Crew neck or V-neck</Typography></Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircleIcon sx={{ fontSize: 13, color: 'success.main' }} /><Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.68rem' }}>Locally printed, ring-spun cotton</Typography></Box>
                                                            </Stack>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                fullWidth
                                                                endIcon={<ArrowForwardIcon />}
                                                                onClick={(e) => { e.stopPropagation(); handleProductClick(apparelProduct); }}
                                                                sx={{ fontWeight: 900, fontSize: '0.75rem', border: '2px solid var(--brutal-ink)', borderRadius: 0, boxShadow: '2px 2px 0 var(--brutal-ink)', bgcolor: 'var(--brutal-paper)', color: 'var(--brutal-ink)', '&:hover': { bgcolor: 'var(--brutal-yellow)' } }}
                                                            >
                                                                Customize
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                fullWidth
                                                                onClick={(e) => { e.stopPropagation(); handleProductClick(apparelProduct); }}
                                                                sx={{ fontWeight: 900, fontSize: '0.75rem', border: '2px solid var(--brutal-ink)', borderRadius: 0, boxShadow: '2px 2px 0 var(--brutal-ink)', '&:hover': { bgcolor: 'var(--brutal-pink)', color: 'var(--brutal-ink)' } }}
                                                            >
                                                                Buy Now
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Card>
                                            </Box>
                                        );
                                    })}
                                    </Box>
                                    {apparelItems.length > apparelVisibleCount && (
                                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                                {apparelItems.length - apparelVisibleCount} more designs
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                onClick={() => setApparelVisibleCount(prev => prev + storePageSize)}
                                                sx={{
                                                    px: 4, py: 1.5,
                                                    fontWeight: 900,
                                                    fontSize: '1rem',
                                                    bgcolor: 'var(--brutal-yellow)',
                                                    color: 'var(--brutal-ink)',
                                                    border: '3px solid var(--brutal-ink)',
                                                    borderRadius: 0,
                                                    boxShadow: 'var(--brutal-shadow-small)',
                                                    '&:hover': { bgcolor: 'var(--brutal-pink)', boxShadow: '4px 4px 0 var(--brutal-ink)' }
                                                }}
                                            >
                                                Load More ↓
                                            </Button>
                                        </Box>
                                    )}
                                </>
                            );
                        })()}
                    </Box>

                    {/* ─────────────────────────────────────────── */}
                    {/* Glamorous Stickers Section */}
                    <Box sx={{ mb: 8 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                            <StoreSectionHeader
                                icon={<LightningIcon size={32} />}
                                title="Glamorous Stickers"
                                meta={`${stickerProducts.length} designs active`}
                                subtitle="Collect die-cut premium vinyl stickers for your case or laptop. High-definition vector graphics, customizable size, and bulk discounts."
                                sx={{ flex: 1, mb: 0 }}
                            />
                            <Button
                                onClick={handleShuffleStickers}
                                sx={{
                                    fontWeight: 900,
                                    fontSize: '0.875rem',
                                    bgcolor: 'var(--brutal-yellow)',
                                    color: 'var(--brutal-ink)',
                                    border: '3px solid var(--brutal-ink)',
                                    borderRadius: 0,
                                    boxShadow: 'var(--brutal-shadow-small)',
                                    px: 3,
                                    py: 1,
                                    '&:hover': { bgcolor: 'var(--brutal-pink)', boxShadow: '4px 4px 0 var(--brutal-ink)' }
                                }}
                            >
                                Shuffle Stickers & Colors ➔
                            </Button>
                        </Box>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: STORE_GRID_COLUMNS,
                                gap: 3,
                            }}
                        >
                            {stickerProducts.map((sticker, idx) => {
                                const cardBgColor = stickerColors[idx] || 'var(--brutal-paper)';
                                const stickerProductUrl = `/product/${encodeURIComponent(sticker.id)}`;
                                return (
                                    <Box key={sticker.id} sx={{ width: '100%' }}>
                                        <Card
                                            onClick={() => router.push(stickerProductUrl)}
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                border: '3px solid var(--brutal-ink)',
                                                boxShadow: 'var(--brutal-shadow)',
                                                bgcolor: cardBgColor,
                                                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                                '&:hover': {
                                                    transform: 'translate(-4px, -4px)',
                                                    boxShadow: '10px 10px 0 var(--brutal-ink)',
                                                },
                                                '&:hover .hover-details-overlay': {
                                                    transform: 'translateY(0)',
                                                    opacity: 1
                                                }
                                            }}
                                        >
                                            <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
                                                <Chip
                                                    label="Sticker"
                                                    sx={{
                                                        bgcolor: 'var(--brutal-paper)',
                                                        color: 'var(--brutal-ink)',
                                                        border: '2px solid var(--brutal-ink)',
                                                        fontWeight: 900,
                                                        fontSize: '0.65rem',
                                                        height: 24,
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ bgcolor: '#f4efe7', borderBottom: '3px solid var(--brutal-ink)', p: 3, display: 'flex', justifyContent: 'center', height: 210, alignItems: 'center' }}>
                                                <img 
                                                    src={sticker.image}
                                                    alt={sticker.title}
                                                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                                />
                                            </Box>
                                            <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 0.5, fontSize: '0.9rem', lineHeight: 1.2, color: 'var(--brutal-ink)' }}>
                                                    {sticker.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                                    <Typography variant="h5" sx={{ color: 'var(--brutal-ink)', fontWeight: 900 }}>From $4.99</Typography>
                                                    <Chip
                                                        label="4+ or 10+ Discount"
                                                        sx={{
                                                            bgcolor: 'var(--brutal-paper)',
                                                            color: 'var(--brutal-ink)',
                                                            border: '2px solid var(--brutal-ink)',
                                                            fontWeight: 900,
                                                            fontSize: '0.6rem',
                                                            height: 20,
                                                        }}
                                                    />
                                                </Box>
                                            </CardContent>

                                            {/* Hover details overlay */}
                                            <Box
                                                className="hover-details-overlay"
                                                sx={{
                                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                                    bgcolor: 'var(--brutal-paper)', zIndex: 10, p: 2.5,
                                                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                                    transform: 'translateY(100%)', opacity: 0,
                                                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                                                    border: 'none'
                                                }}
                                            >
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 0.5, borderBottom: '2px solid var(--brutal-ink)', pb: 0.5, fontSize: '0.9rem' }}>{sticker.title}</Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 700, lineHeight: 1.3, fontSize: '0.75rem' }}>
                                                        {sticker.description}
                                                    </Typography>
                                                    <Stack spacing={0.3}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircleIcon sx={{ fontSize: 13, color: 'success.main' }} /><Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.68rem' }}>4 Sizes (Small to 30cm XL)</Typography></Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircleIcon sx={{ fontSize: 13, color: 'success.main' }} /><Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.68rem' }}>Weather-resistant premium vinyl</Typography></Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircleIcon sx={{ fontSize: 13, color: 'success.main' }} /><Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.68rem' }}>Bulk discount: 15% at 4+, 30% at 10+</Typography></Box>
                                                    </Stack>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        endIcon={<ArrowForwardIcon />}
                                                        onClick={(e) => { e.stopPropagation(); router.push(stickerProductUrl); }}
                                                        sx={{ fontWeight: 900, fontSize: '0.75rem', border: '2px solid var(--brutal-ink)', borderRadius: 0, boxShadow: '2px 2px 0 var(--brutal-ink)', bgcolor: 'var(--brutal-paper)', color: 'var(--brutal-ink)', '&:hover': { bgcolor: 'var(--brutal-yellow)' } }}
                                                    >
                                                        Configure
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Card>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* 8. FAQ Section */}
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}><HelpOutlineIcon sx={{ fontSize: 36 }} /><Typography variant="h3" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>Designed For Your Success & Frequently Asked Questions</Typography></Box>
                        <Accordion sx={{ border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)', mb: 2, bgcolor: 'var(--brutal-yellow)', '&::before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ border: '2px solid var(--brutal-ink)', borderRadius: 1 }} />}><Typography variant="h5" sx={{ fontWeight: 900 }}>How does instant access work?</Typography></AccordionSummary>
                            <AccordionDetails sx={{ bgcolor: 'var(--brutal-paper)', borderTop: '3px solid var(--brutal-ink)', p: 3 }}><Typography variant="body1">Skip the wait. Once your payment is confirmed, our server immediately generates a secure, tokenized download link and sends it directly to your inbox. No registration required — you get instant access to your digital PDF bundles right after checkout.</Typography></AccordionDetails>
                        </Accordion>
                        <Accordion sx={{ border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)', mb: 2, bgcolor: 'var(--brutal-mint)', '&::before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ border: '2px solid var(--brutal-ink)', borderRadius: 1 }} />}><Typography variant="h5" sx={{ fontWeight: 900 }}>What makes the layouts professional-grade?</Typography></AccordionSummary>
                            <AccordionDetails sx={{ bgcolor: 'var(--brutal-paper)', borderTop: '3px solid var(--brutal-ink)', p: 3 }}><Typography variant="body1">Every sheet uses a color-coded CAGED system fretboard that maps all 5 positions with precision. Layouts are programmatically generated from pure music theory — meaning zero human transcription error and 100% mathematically verified accuracy across all 12 keys and 8 instruments.</Typography></AccordionDetails>
                        </Accordion>
                        <Accordion sx={{ border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)', mb: 2, bgcolor: 'var(--brutal-blue)', '&::before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ border: '2px solid var(--brutal-ink)', borderRadius: 1 }} />}><Typography variant="h5" sx={{ fontWeight: 900 }}>Is my payment and download secure?</Typography></AccordionSummary>
                            <AccordionDetails sx={{ bgcolor: 'var(--brutal-paper)', borderTop: '3px solid var(--brutal-ink)', p: 3 }}><Typography variant="body1">Absolutely. All payments are processed exclusively through Stripe — a PCI-compliant, industry-standard payment processor. We never store your card details. Download links are cryptographically signed and expire after use, guaranteeing clean, safe, and tamper-proof file delivery.</Typography></AccordionDetails>
                        </Accordion>
                        <Accordion sx={{ border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)', mb: 2, bgcolor: 'var(--brutal-pink)', '&::before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ border: '2px solid var(--brutal-ink)', borderRadius: 1 }} />}><Typography variant="h5" sx={{ fontWeight: 900 }}>How do the interactive filters work?</Typography></AccordionSummary>
                            <AccordionDetails sx={{ bgcolor: 'var(--brutal-paper)', borderTop: '3px solid var(--brutal-ink)', p: 3 }}><Typography variant="body1">Our store features cross-matching filters for 12 Keys, 8 Instruments (Guitar, Piano, Bass, Ukulele, Violin, Double Bass, Saxophone, and Trumpet), and 3 theoretical elements (Chords, Scales, and Arpeggios). Simply tap your instrument, key, or concept to instantly render the corresponding study bundle.</Typography></AccordionDetails>
                        </Accordion>
                        <Accordion sx={{ border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)', mb: 2, bgcolor: 'var(--brutal-yellow)', '&::before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ border: '2px solid var(--brutal-ink)', borderRadius: 1 }} />}><Typography variant="h5" sx={{ fontWeight: 900 }}>Are these bundles hand-drawn or programmatically compiled?</Typography></AccordionSummary>
                            <AccordionDetails sx={{ bgcolor: 'var(--brutal-paper)', borderTop: '3px solid var(--brutal-ink)', p: 3 }}><Typography variant="body1">Every diagram is automatically generated by our dedicated music-theory code engine. This guarantees absolute mathematical accuracy—no human transcription error can slip in, giving you 100% reliable layouts.</Typography></AccordionDetails>
                        </Accordion>
                        <Accordion sx={{ border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)', mb: 2, bgcolor: 'var(--brutal-blue)', '&::before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ border: '2px solid var(--brutal-ink)', borderRadius: 1 }} />}><Typography variant="h5" sx={{ fontWeight: 900 }}>How does secure instant delivery work?</Typography></AccordionSummary>
                            <AccordionDetails sx={{ bgcolor: 'var(--brutal-paper)', borderTop: '3px solid var(--brutal-ink)', p: 3 }}><Typography variant="body1">Once checkout is safely processed by Stripe, our server immediately issues a secure, tokenized download link to your email address. You get instant access to the digital PDF bundles with no registration required.</Typography></AccordionDetails>
                        </Accordion>
                        <Accordion sx={{ border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)', mb: 2, bgcolor: 'var(--brutal-mint)', '&::before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ border: '2px solid var(--brutal-ink)', borderRadius: 1 }} />}><Typography variant="h5" sx={{ fontWeight: 900 }}>Can I print these or view them on a tablet?</Typography></AccordionSummary>
                            <AccordionDetails sx={{ bgcolor: 'var(--brutal-paper)', borderTop: '3px solid var(--brutal-ink)', p: 3 }}><Typography variant="body1">Absolutely! Every sheet is delivered as a high-resolution, vector-based PDF (2480 x 3508 pixels). They scale perfectly without pixelation, whether you view them on an iPad, a laptop screen, or print them for your practice binder.</Typography></AccordionDetails>
                        </Accordion>
                        <Accordion sx={{ border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)', mb: 2, bgcolor: 'var(--brutal-pink)', '&::before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ border: '2px solid var(--brutal-ink)', borderRadius: 1 }} />}><Typography variant="h5" sx={{ fontWeight: 900 }}>What is your apparel printing and return policy?</Typography></AccordionSummary>
                            <AccordionDetails sx={{ bgcolor: 'var(--brutal-paper)', borderTop: '3px solid var(--brutal-ink)', p: 3 }}><Typography variant="body1">Our music theory apparel is printed locally on premium 100% cotton garments using high-definition techniques. To ensure complete satisfaction, we back all apparel purchases with a 30-day easy exchanges and returns guarantee.</Typography></AccordionDetails>
                        </Accordion>
                    </Box>
                </Container>
            </Box>

            {/* Pop-up Insights Footer Toast */}
            <Box sx={{ position: 'fixed', bottom: 24, left: 24, zIndex: 2000, maxWidth: { xs: 'calc(100% - 48px)', sm: 380 }, bgcolor: 'var(--brutal-yellow)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)', p: 2, borderRadius: '4px', display: 'flex', alignItems: 'center', gap: 1.5, opacity: showInsight ? 1 : 0, transform: showInsight ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.4s ease, transform 0.4s ease', pointerEvents: showInsight ? 'auto' : 'none' }}>
                <Box sx={{ fontSize: 24 }}>💡</Box>
                <Typography variant="body2" sx={{ fontWeight: 800, color: 'var(--brutal-ink)', lineHeight: 1.3 }}>{INSIGHTS[currentInsightIndex]}</Typography>
            </Box>

            {/* Customization Modal */}
            <Dialog
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        border: '6px solid var(--brutal-ink)',
                        boxShadow: 'var(--brutal-shadow)',
                        borderRadius: 0,
                        bgcolor: 'var(--brutal-paper)',
                        overflow: 'visible',
                        p: 0,
                        position: 'relative'
                    }
                }}
            >
                {selectedProduct && (
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: 450 }}>
                        {/* Left Side Visual Preview */}
                        <Box sx={{
                            width: { xs: '100%', md: '45%' },
                            bgcolor: selectedProduct.productType === 'artwork-apparel' ? '#f4efe7' : 'transparent',
                            borderRight: { xs: 'none', md: '5px solid var(--brutal-ink)' },
                            borderBottom: { xs: '5px solid var(--brutal-ink)', md: 'none' },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2,
                            position: 'relative'
                        }}>
                            {selectedProduct.productType === 'artwork-apparel' ? (
                                <Box sx={{ width: '100%', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                    {carouselIndex === 0 ? (
                                        <svg viewBox="0 0 260 270" width="100%" height="320" style={{ maxWidth: '300px' }}>
                                            <path d="M 51 62 L 81 34 L 179 34 L 209 62 L 193 244 L 67 244 Z" fill={customApparelColor.hex} stroke="#151515" strokeWidth="5" strokeLinejoin="round" />
                                            {customApparelNeck === 'V-neck' ? (
                                                <path d="M 101 35 L 130 72 L 159 35" fill="none" stroke={customApparelColor.ink} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                                            ) : (
                                                <path d="M 101 35 Q 130 67 159 35" fill="none" stroke={customApparelColor.ink} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                                            )}
                                            
                                            {customApparelType === 'T-Shirt' ? (
                                                <>
                                                    <path d="M 55 68 L 48 132 L 76 144 L 85 92" fill={customApparelColor.hex} stroke="#151515" strokeWidth="5" strokeLinejoin="round" />
                                                    <path d="M 205 68 L 212 132 L 184 144 L 175 92" fill={customApparelColor.hex} stroke="#151515" strokeWidth="5" strokeLinejoin="round" />
                                                </>
                                            ) : (
                                                <>
                                                    <path d="M 55 68 L 35 200 L 60 206 L 85 92" fill={customApparelColor.hex} stroke="#151515" strokeWidth="5" strokeLinejoin="round" />
                                                    <path d="M 205 68 L 225 200 L 200 206 L 175 92" fill={customApparelColor.hex} stroke="#151515" strokeWidth="5" strokeLinejoin="round" />
                                                </>
                                            )}

                                            <rect x="91" y="98" width="78" height="78" rx="8" fill="#ffffff" stroke="#151515" strokeWidth="4" />
                                            <image href={selectedProduct.image} x="93" y="100" width="74" height="74" preserveAspectRatio="xMidYMid slice" clipPath={`url(#modal-artwork-clip-${selectedProduct.index})`} />
                                            <defs><clipPath id={`modal-artwork-clip-${selectedProduct.index}`}><rect x="91" y="98" width="78" height="78" rx="8" /></clipPath></defs>
                                        </svg>
                                    ) : (
                                        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                                            <img
                                                src={selectedProduct.image}
                                                alt={selectedProduct.baseTitle}
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '300px',
                                                    objectFit: 'contain',
                                                    border: '4px solid var(--brutal-ink)',
                                                    boxShadow: 'var(--brutal-shadow-small)',
                                                    backgroundColor: '#ffffff'
                                                }}
                                            />
                                        </Box>
                                    )}

                                    {/* Left Arrow */}
                                    <IconButton
                                        onClick={() => setCarouselIndex((prev) => (prev === 0 ? 1 : 0))}
                                        sx={{
                                            position: 'absolute',
                                            left: 8,
                                            bgcolor: 'var(--brutal-pink)',
                                            color: 'var(--brutal-ink)',
                                            border: '3px solid var(--brutal-ink)',
                                            borderRadius: 0,
                                            boxShadow: '2px 2px 0 var(--brutal-ink)',
                                            zIndex: 12,
                                            '&:hover': { bgcolor: 'var(--brutal-yellow)', transform: 'scale(1.05)' },
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        <ArrowBackIcon />
                                    </IconButton>

                                    {/* Right Arrow */}
                                    <IconButton
                                        onClick={() => setCarouselIndex((prev) => (prev === 0 ? 1 : 0))}
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            bgcolor: 'var(--brutal-pink)',
                                            color: 'var(--brutal-ink)',
                                            border: '3px solid var(--brutal-ink)',
                                            borderRadius: 0,
                                            boxShadow: '2px 2px 0 var(--brutal-ink)',
                                            zIndex: 12,
                                            '&:hover': { bgcolor: 'var(--brutal-yellow)', transform: 'scale(1.05)' },
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        <ArrowForwardIcon />
                                    </IconButton>

                                    {/* Bottom Indicators (Dots) */}
                                    <Box sx={{ position: 'absolute', bottom: 8, display: 'flex', gap: 1, zIndex: 12 }}>
                                        {[0, 1].map((idx) => (
                                            <Box
                                                key={idx}
                                                onClick={() => setCarouselIndex(idx)}
                                                sx={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: '50%',
                                                    bgcolor: carouselIndex === idx ? 'var(--brutal-pink)' : 'var(--brutal-paper)',
                                                    border: '2px solid var(--brutal-ink)',
                                                    cursor: 'pointer',
                                                    '&:hover': { bgcolor: 'var(--brutal-yellow)' }
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            ) : (
                                <ProductArtwork product={selectedProduct} height={320} compact />
                            )}
                            <Chip
                                label={selectedProduct.musicType === 'Apparel' ? 'Apparel' : selectedProduct.musicType}
                                sx={{
                                    position: 'absolute',
                                    top: 16,
                                    left: 16,
                                    bgcolor: 'var(--brutal-paper)',
                                    color: 'var(--brutal-ink)',
                                    border: '2px solid var(--brutal-ink)',
                                    fontWeight: 900
                                }}
                            />
                            {selectedProduct.productType !== 'artwork-apparel' && (
                                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                                    <InstrumentBadge
                                        instrumentId={selectedProduct.instrument || 'guitar'}
                                        iconSize={20}
                                        sx={{
                                            height: 34,
                                            fontSize: '0.72rem',
                                            '& .MuiChip-icon': { ml: 0.85, mr: -0.1 },
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>

                        {/* Right Side Configuration Controls */}
                        <Box sx={{ width: { xs: '100%', md: '55%' }, p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto', maxHeight: { xs: 'none', md: '85vh' } }}>
                            <Box>
                                {/* Close Button */}
                                <Button
                                    onClick={() => setModalOpen(false)}
                                    sx={{
                                        position: 'absolute',
                                        top: -12,
                                        right: -12,
                                        minWidth: '40px',
                                        width: '40px',
                                        height: '40px',
                                        bgcolor: 'var(--brutal-pink)',
                                        color: 'var(--brutal-ink)',
                                        border: '3px solid var(--brutal-ink)',
                                        borderRadius: '50%',
                                        fontWeight: 900,
                                        '&:hover': { bgcolor: 'var(--brutal-yellow)' }
                                    }}
                                >
                                    ✕
                                </Button>
                                
                                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>
                                    {selectedProduct.productType === 'artwork-apparel' ? `${selectedProduct.baseTitle} ${customApparelType} (${customApparelNeck})` : selectedProduct.title}
                                </Typography>
                                <Typography variant="h5" color="primary.main" sx={{ fontWeight: 900, mb: 2 }}>
                                    ${selectedProduct.productType === 'artwork-apparel' ? getApparelPrice(customApparelType).toFixed(2) : selectedProduct.price}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 700, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {selectedProduct.description}
                                </Typography>

                                <Divider sx={{ mb: 3, borderColor: 'var(--brutal-ink)', borderWidth: '1px' }} />

                                {/* Interactive Customization Fields */}
                                <Stack spacing={3.5}>
                                        {/* Apparel Style */}
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 900, display: 'block', mb: 1 }}>GARMENT STYLE:</Typography>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                {['T-Shirt', 'Sweater'].map((t) => {
                                                    const isTypeActive = customApparelType === t;
                                                    return (
                                                        <Button
                                                            key={t}
                                                            onClick={() => setCustomApparelType(t)}
                                                            sx={{
                                                                flexGrow: 1,
                                                                py: 1,
                                                                fontWeight: 900,
                                                                bgcolor: isTypeActive ? 'var(--brutal-mint)' : 'var(--brutal-paper)',
                                                                color: 'var(--brutal-ink)',
                                                                border: '3px solid var(--brutal-ink)',
                                                                borderRadius: 0,
                                                                boxShadow: isTypeActive ? '3px 3px 0 var(--brutal-ink)' : 'none',
                                                                '&:hover': { bgcolor: 'var(--brutal-mint)' }
                                                            }}
                                                        >
                                                            {t}
                                                        </Button>
                                                    );
                                                })}
                                            </Box>
                                        </Box>

                                        {/* Neck Style */}
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 900, display: 'block', mb: 1 }}>NECK STYLE:</Typography>
                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                {['Crew neck', 'V-neck'].map((neck) => {
                                                    const isNeckActive = customApparelNeck === neck;
                                                    return (
                                                        <Button
                                                            key={neck}
                                                            onClick={() => setCustomApparelNeck(neck)}
                                                            sx={{
                                                                flexGrow: 1,
                                                                py: 1,
                                                                fontWeight: 900,
                                                                bgcolor: isNeckActive ? 'var(--brutal-yellow)' : 'var(--brutal-paper)',
                                                                color: 'var(--brutal-ink)',
                                                                border: '3px solid var(--brutal-ink)',
                                                                borderRadius: 0,
                                                                boxShadow: isNeckActive ? '3px 3px 0 var(--brutal-ink)' : 'none',
                                                                '&:hover': { bgcolor: 'var(--brutal-yellow)' }
                                                            }}
                                                        >
                                                            {neck}
                                                        </Button>
                                                    );
                                                })}
                                            </Box>
                                        </Box>

                                        {/* Apparel Color picker */}
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 900, display: 'block', mb: 1 }}>SELECT COLOR:</Typography>
                                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                                {[
                                                    { name: "Navy", hex: "#17233d", ink: "#ffffff" },
                                                    { name: "Forest Green", hex: "#1f4a37", ink: "#ffffff" },
                                                    { name: "Red", hex: "#a6262d", ink: "#ffffff" },
                                                    { name: "Black", hex: "#111111", ink: "#ffffff" },
                                                    { name: "Gray", hex: "#888888", ink: "#111111" }
                                                ].map((c) => {
                                                    const isColorActive = customApparelColor.name === c.name;
                                                    return (
                                                        <Box
                                                            key={c.name}
                                                            onClick={() => setCustomApparelColor(c)}
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: '50%',
                                                                bgcolor: c.hex,
                                                                border: '3px solid var(--brutal-ink)',
                                                                boxShadow: isColorActive ? '0 0 0 3px var(--brutal-yellow)' : 'none',
                                                                cursor: 'pointer',
                                                                '&:hover': { transform: 'scale(1.1)' },
                                                                transition: 'transform 0.1s ease'
                                                            }}
                                                            title={c.name}
                                                        />
                                                    );
                                                })}
                                            </Box>
                                        </Box>

                                        {/* Apparel Sizes */}
                                        <Box>
                                            <Typography variant="caption" sx={{ fontWeight: 900, display: 'block', mb: 1 }}>SELECT SIZE:</Typography>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                                                    <Button
                                                        key={sz}
                                                        onClick={() => setCustomApparelSize(sz)}
                                                        sx={{
                                                            minWidth: '42px',
                                                            height: '42px',
                                                            fontWeight: 900,
                                                            bgcolor: customApparelSize === sz ? 'var(--brutal-yellow)' : 'var(--brutal-paper)',
                                                            color: 'var(--brutal-ink)',
                                                            border: '3px solid var(--brutal-ink)',
                                                            borderRadius: 0,
                                                            boxShadow: customApparelSize === sz ? '2px 2px 0 var(--brutal-ink)' : 'none',
                                                            '&:hover': { bgcolor: 'var(--brutal-yellow)' }
                                                        }}
                                                    >
                                                        {sz}
                                                    </Button>
                                                ))}
                                            </Box>
                                        </Box>
                                </Stack>

                                {/* Quantity Selector */}
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 900, display: 'block', mb: 1 }}>QUANTITY:</Typography>
                                    <Box sx={{ display: 'inline-flex', alignItems: 'center', border: '3px solid var(--brutal-ink)' }}>
                                        <Button
                                            onClick={() => setCustomQuantity(prev => Math.max(1, prev - 1))}
                                            sx={{ minWidth: '40px', width: '40px', height: '40px', color: 'var(--brutal-ink)', borderRadius: 0, fontWeight: 900 }}
                                        >
                                            -
                                        </Button>
                                        <Typography sx={{ minWidth: 40, textAlign: 'center', fontWeight: 900, fontSize: '1.1rem', color: 'var(--brutal-ink)' }}>
                                            {customQuantity}
                                        </Typography>
                                        <Button
                                            onClick={() => setCustomQuantity(prev => prev + 1)}
                                            sx={{ minWidth: '40px', width: '40px', height: '40px', color: 'var(--brutal-ink)', borderRadius: 0, fontWeight: 900 }}
                                        >
                                            +
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleModalAddToCart}
                                    sx={{
                                        flexGrow: 1,
                                        py: 1.5,
                                        fontWeight: 900,
                                        bgcolor: 'var(--brutal-paper)',
                                        color: 'var(--brutal-ink)',
                                        border: '3px solid var(--brutal-ink)',
                                        borderRadius: 0,
                                        boxShadow: '4px 4px 0 var(--brutal-ink)',
                                        '&:hover': { bgcolor: 'var(--brutal-yellow)' }
                                    }}
                                >
                                    Add To Cart
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleModalBuy}
                                    sx={{
                                        flexGrow: 1,
                                        py: 1.5,
                                        fontWeight: 900,
                                        border: '3px solid var(--brutal-ink)',
                                        borderRadius: 0,
                                        boxShadow: '4px 4px 0 var(--brutal-ink)',
                                        '&:hover': { bgcolor: 'var(--brutal-pink)', color: 'var(--brutal-ink)' }
                                    }}
                                >
                                    Buy Now
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Dialog>
        </>
    );
};

export default StorePage;
