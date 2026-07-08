import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import {
    Container,
    Typography,
    Grid,
    Button,
    Box,
    Chip,
    Paper,
    Divider,
    Breadcrumbs,
    Rating,
    Stack
} from '@mui/material';
import Link from 'next/link';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SecurityIcon from '@mui/icons-material/Security';
import StarIcon from '@mui/icons-material/Star';
import { addToCart, toggleCart } from '../../redux/actions/cartActions';
import products from '../../data/products.json';
import glamourSvgProducts from '../../data/glamourSvgProducts.json';
import { DEFAULT_KEYWORDS } from '../../data/seo';
import ProductArtwork from '../../components/Graphics/ProductArtwork';

const sizePrices = { 'Small': 4.99, 'Medium': 7.99, 'Large': 11.99, 'Extra Large': 16.99 };
const sizeSpecs = {
    'Small': { dims: '5 cm x 5 cm', weight: '2g' },
    'Medium': { dims: '10 cm x 10 cm', weight: '5g' },
    'Large': { dims: '20 cm x 20 cm', weight: '12g' },
    'Extra Large': { dims: '30 cm x 30 cm', weight: '25g' }
};

const getCommitmentDetails = (product) => {
    const isSticker = product?.productType === 'sticker';
    const isApparel = product?.productType === 'artwork-apparel' || product?.productType === 'apparel' || String(product?.id || '').includes('apparel') || String(product?.category || '').toLowerCase().includes('clothing') || String(product?.category || '').toLowerCase().includes('apparel');
    
    const title = product?.title || '';
    const musicType = String(product?.musicType || '').toLowerCase();
    const category = String(product?.category || '').toLowerCase();
    
    let isArpeggio = musicType.includes('arpeggio') || musicType.includes('arppegio') || title.toLowerCase().includes('arpeggio') || title.toLowerCase().includes('arppegio');
    let isScale = musicType.includes('scale') || title.toLowerCase().includes('scale') || category.includes('scale') || title.toLowerCase().includes('scales') || category.includes('scales');
    let isChord = musicType.includes('chord') || title.toLowerCase().includes('chord') || category.includes('chord') || title.toLowerCase().includes('chords') || category.includes('chords');
    
    if (isSticker) {
        return {
            title: "Sticker Quality & Durability Guarantee",
            text: "This is a premium, high-grade vinyl sticker designed to last. Our stickers are made from weather-resistant, scratch-resistant, and UV-protected vinyl with clean die-cut edges, ensuring they won't fade or peel on your instrument case, laptop, or bumper. Unlike cheap paper alternatives, our stickers utilize non-residue adhesives that let you clean and reposition them without damaging your valuable gear."
        };
    }
    
    if (isApparel) {
        return {
            title: "Apparel Printing & Commercial Standards",
            text: "Launch your own brand or customize premium merchandise with our commercial-grade apparel service. Our shirts and sweaters are custom-printed on 100% ring-spun cotton using direct-to-garment (DTG) technology, ensuring long-lasting print washability, vibrant color reproduction, and perfect edge alignment. To sell successfully, you need professional graphic assets, high-resolution source SVGs, and consistent textile sourcing, all of which we verify for checkout compliance."
        };
    }
    
    if (isArpeggio) {
        return {
            title: "Arpeggio Precision & Fretboard Mastery",
            text: "Unlock the fretboard with our programmatically verified arpeggio map. Every interval position, root relation, and finger configuration is generated directly from music theory code frameworks, ensuring perfect accuracy across all octaves. Master targeting chord tones during solos, improving your phrasing, linear transitions, and spatial awareness across the neck without the typical errors found in manually transcribed sheets."
        };
    }
    
    if (isScale) {
        return {
            title: "Scale Curation & Structural Accuracy",
            text: "Learn the neck with confidence using our programmatically generated scale map. Every scale pattern, finger spacing, and interval sequence is verified directly from music theory code frameworks to guarantee 100% fretboard accuracy. Avoid common forum errors and gain instant spatial visualization of the pentatonic, major, and minor modes across all keys, helping you internalize muscle memory and play with clean execution."
        };
    }
    
    if (isChord) {
        return {
            title: "Chord Voicing & Harmonic Precision",
            text: "Build clean harmonic foundations with our professionally compiled chord vault. Every voicing, voice-leading connection, and open-voiced structure is verified directly from music theory code frameworks for flawless fretboard geometry. Explore jazz extensions, triad shapes, and shell voicings without the typical formatting typos or incorrect note sistering, ensuring you learn proper theory and clean fretboard placement."
        };
    }
    
    return {
        title: "Our Curation & Safety Commitment",
        text: "This is a premium, verified learning vault. Unlike general \"thrifting\" objects on guitar forums, these documents are generated directly from music theory code frameworks, guaranteeing perfect alignment of shapes, notes, and siblings. We ensure absolute safety with no third-party trackers, pop-up ads, or suspicious download archives."
    };
};

const getDescriptionParagraphs = (product) => {
    const isSticker = product?.productType === 'sticker';
    const isApparel = product?.productType === 'artwork-apparel' || product?.productType === 'apparel' || String(product?.id || '').includes('apparel') || String(product?.category || '').toLowerCase().includes('clothing') || String(product?.category || '').toLowerCase().includes('apparel');
    
    const title = product?.title || '';
    const musicType = String(product?.musicType || '').toLowerCase();
    const category = String(product?.category || '').toLowerCase();
    const keyName = product?.musicKey && product?.musicKey !== 'All' ? product.musicKey : 'C';

    let isArpeggio = musicType.includes('arpeggio') || musicType.includes('arppegio') || title.toLowerCase().includes('arpeggio') || title.toLowerCase().includes('arppegio');
    let isScale = musicType.includes('scale') || title.toLowerCase().includes('scale') || category.includes('scale') || title.toLowerCase().includes('scales') || category.includes('scales');
    let isChord = musicType.includes('chord') || title.toLowerCase().includes('chord') || category.includes('chord') || title.toLowerCase().includes('chords') || category.includes('chords');

    if (isSticker) {
        return [
            "Express your musical identity with our premium die-cut theory sticker. Perfect for placing on instrument cases, laptops, or gear racks, it acts as a quick visual reference for music intervals.",
            "Each sticker is printed on thick, weather-resistant vinyl material with a special protective UV layer. This makes it highly resistant to fading, scratching, or tearing over years of use.",
            "Features a custom, residue-free adhesive backing that keeps the sticker securely in place while allowing clean removal without leaving marks or damaging valuable lacquer finishes."
        ];
    }

    if (isApparel) {
        return [
            "Upgrade your look with premium streetwear printed with vector-precise music theory artwork. Designed for guitarists, producers, and theory enthusiasts alike to showcase their craft in style.",
            "Crafted from 100% combed ring-spun cotton fabric for a luxurious soft-touch feel and maximum breathability. The fabric maintains its shape and color vibrancy even after numerous washes.",
            "Features a modern retail fit with double-needle tailoring on sleeves and bottom hems. Locally printed using direct-to-garment (DTG) inks for a clean, long-lasting finish."
        ];
    }

    if (isArpeggio) {
        return [
            `Unlock complete fretboard mastery in the key of ${keyName} with our programmatically compiled arpeggio guides. This study bundle maps out target chord tones across all positions of the neck.`,
            "Learn to weave through chord progressions smoothly by isolating individual chord degrees. Our clean visual mappings remove transcription errors and show you exactly where to anchor your solos.",
            "Designed for all learning stages, these guides connect vertical CAGED fretboard shapes with horizontal scale patterns, helping you build faster picking technique and melodic phrasing."
        ];
    }

    if (isScale) {
        return [
            `Master position playing and improvisation in the key of ${keyName} with our highly structured scale diagrams. This bundle maps the complete scale structures across all CAGED fretboard shapes.`,
            "Every layout highlights the core root anchor points and interval relations, allowing you to instantly visualize pentatonic, major, and minor mode paths without getting lost.",
            "Eliminate second-guessing and manually transcribed errors. These sheets are generated directly from theoretical frameworks, providing a reliable reference for your daily scale practice."
        ];
    }

    if (isChord) {
        return [
            `Build a strong harmonic foundation in the key of ${keyName} with our comprehensive chord voicing charts. This study bundle contains professional layouts detailing fretboard geometry.`,
            "Explore open voicings, jazz extensions, shell shapes, and triads. Every diagram isolates the intervals and root positions to help you understand voice leading and chord structure.",
            "Say goodbye to blurry chord charts and forum typos. Our high-resolution, vector-precise PDFs print beautifully and help you practice correct fingerings with absolute theory accuracy."
        ];
    }

    const originalDesc = product?.description || "Premium music theory reference sheets.";
    const sentences = originalDesc.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length >= 3) {
        const size = Math.ceil(sentences.length / 3);
        return [
            sentences.slice(0, size).join(' '),
            sentences.slice(size, size * 2).join(' '),
            sentences.slice(size * 2).join(' ')
        ];
    }
    return [
        originalDesc,
        "Includes high-resolution layouts optimized for print and digital screen viewing.",
        "Verified programmatically to guarantee 100% mathematical accuracy across all keys and positions."
    ];
};

const ProductPage = ({ product }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
        } else {
            router.push('/store');
        }
    };

    const isSticker = product?.productType === 'sticker';
    const [stickerSize, setStickerSize] = useState('Small');
    const [stickerQuantity, setStickerQuantity] = useState(1);

    const baseUnitPrice = sizePrices[stickerSize] || 4.99;
    let bulkDiscountPercent = 0;
    if (stickerQuantity >= 10) {
        bulkDiscountPercent = 30;
    } else if (stickerQuantity >= 4) {
        bulkDiscountPercent = 15;
    }
    
    const finalUnitPrice = parseFloat((baseUnitPrice * (1 - bulkDiscountPercent / 100)).toFixed(2));
    const finalTotalPrice = parseFloat((finalUnitPrice * stickerQuantity).toFixed(2));

    // Apparel states
    const isApparel = product?.productType === 'artwork-apparel' || product?.productType === 'apparel' || String(product?.id || '').includes('apparel') || String(product?.category || '').toLowerCase().includes('clothing') || String(product?.category || '').toLowerCase().includes('apparel');
    const [apparelType, setApparelType] = useState('T-Shirt');
    const [apparelNeck, setApparelNeck] = useState('Crew neck');
    const [apparelColor, setApparelColor] = useState({ name: 'Navy', hex: '#17233d', ink: '#ffffff' });
    const [apparelSize, setApparelSize] = useState('M');
    const [apparelQuantity, setApparelQuantity] = useState(1);

    const apparelPalette = [
        { name: "Navy", hex: "#17233d", ink: "#ffffff" },
        { name: "Forest Green", hex: "#1f4a37", ink: "#ffffff" },
        { name: "Red", hex: "#a6262d", ink: "#ffffff" },
        { name: "Black", hex: "#111111", ink: "#ffffff" },
        { name: "Gray", hex: "#888888", ink: "#111111" }
    ];

    const apparelPrice = apparelType === 'T-Shirt' ? 29.99 : 49.99;
    const finalApparelTotalPrice = parseFloat((apparelPrice * apparelQuantity).toFixed(2));

    const commitment = getCommitmentDetails(product);

    if (router.isFallback) {
        return <Container sx={{ py: 10 }}>Loading...</Container>;
    }

    if (!product) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>Product not found</Typography>
                <Button onClick={handleBack} variant="contained">Back</Button>
            </Container>
        );
    }

    const getCartProduct = () => {
        if (isSticker) {
            return {
                ...product,
                title: `${product.title} (${stickerSize} Sticker)`,
                price: finalUnitPrice,
                quantity: stickerQuantity,
                allowQuantity: true,
                format: 'physical',
                labelDisplay: 'sticker',
                selectedSize: stickerSize,
                selectedQuantity: stickerQuantity
            };
        }
        if (isApparel) {
            return {
                ...product,
                title: `${product.title} (${apparelType} / ${apparelNeck} / ${apparelColor.name} / Size ${apparelSize})`,
                price: apparelPrice,
                quantity: apparelQuantity,
                allowQuantity: true,
                format: 'physical',
                labelDisplay: 'apparel',
                selectedSize: apparelSize,
                selectedType: apparelType,
                selectedNeck: apparelNeck,
                selectedColor: apparelColor
            };
        }
        return {
            ...product,
            quantity: 1,
            allowQuantity: false,
            format: 'pdf',
            labelDisplay: 'notes'
        };
    };

    const handleAddToCart = () => {
        dispatch(addToCart(getCartProduct()));
        dispatch(toggleCart());
    };

    const handleBuyNow = () => {
        dispatch(addToCart(getCartProduct()));
        router.push('/cart');
    };

    // Render custom dissertation based on product type
    const renderDissertation = () => {
        const isSticker = product?.productType === 'sticker';
        const isApparel = product?.productType === 'artwork-apparel' || product?.productType === 'apparel' || String(product?.id || '').includes('apparel') || String(product?.category || '').toLowerCase().includes('clothing') || String(product?.category || '').toLowerCase().includes('apparel');
        
        const title = product?.title || '';
        const musicType = String(product?.musicType || '').toLowerCase();
        const category = String(product?.category || '').toLowerCase();
        const keyName = product?.musicKey && product?.musicKey !== 'All' ? product.musicKey : 'C';

        let isArpeggio = musicType.includes('arpeggio') || musicType.includes('arppegio') || title.toLowerCase().includes('arpeggio') || title.toLowerCase().includes('arppegio');
        let isScale = musicType.includes('scale') || title.toLowerCase().includes('scale') || category.includes('scale') || title.toLowerCase().includes('scales') || category.includes('scales');
        let isChord = musicType.includes('chord') || title.toLowerCase().includes('chord') || category.includes('chord') || title.toLowerCase().includes('chords') || category.includes('chords');

        if (!isArpeggio && !isScale && !isChord && !isSticker && !isApparel) {
            isScale = true;
        }

        if (isSticker) {
            return (
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, textTransform: 'uppercase' }}>
                        Product Spotlight: Premium Vinyl Applications
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 4 }}>
                        This is more than a standard sticker. It's a high-definition vector representation of complex musical geometry, designed for visual learning and gear personalization. Apply it to your case, laptop, or desk to keep key structures and paths in view:
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 3, bgcolor: 'var(--brutal-yellow)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>1. Weatherproof Finish</Typography>
                                <Typography variant="body2">
                                    Our thick, durable vinyl protects your sticker from scratches, rain, and sunlight. Engineered to handle gig travel and daily wear without peeling or color degradation.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 3, bgcolor: 'var(--brutal-mint)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>2. High Contrast Vectors</Typography>
                                <Typography variant="body2">
                                    Drawn with pixel-perfect resolution, the music theory graphics remain readable even from a distance. Ideal for quick reference while practicing or recording in the studio.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 3, bgcolor: 'var(--brutal-pink)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>3. Safe Gear Adhesive</Typography>
                                <Typography variant="body2">
                                    Uses a clean-peel adhesive that stays firmly in place but leaves no sticky residue behind when removed. Safe for instrument cases, midi controllers, and laptops.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            );
        }

        if (isApparel) {
            return (
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, textTransform: 'uppercase' }}>
                        Product Spotlight: Print Quality & Textile Standards
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 4 }}>
                        Our apparel is constructed for comfort and longevity, featuring sharp Direct-To-Garment prints of custom music theory graphics. Ideal for music fans, creators, or launching your own brand:
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 3, bgcolor: 'var(--brutal-pink)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>1. 100% Ring-Spun Cotton</Typography>
                                <Typography variant="body2">
                                    We print exclusively on high-grade ring-spun cotton. This delivers a remarkably soft fabric feel, premium thickness, and a smooth surface that holds ink wash after wash.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 3, bgcolor: 'var(--brutal-blue)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>2. Premium Print Curing</Typography>
                                <Typography variant="body2">
                                    Using direct-to-garment prints with environment-safe water-based inks. The graphics are heat-cured to lock in colors, preventing premature cracking or peeling.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 3, bgcolor: 'var(--brutal-yellow)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>3. Durable Retail Stitching</Typography>
                                <Typography variant="body2">
                                    Features double-needle stitching along the sleeves and bottom hem for long-term structural shape retention, making it perfect for everyday casual or stage wear.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            );
        }

        if (isChord) {
            return (
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, textTransform: 'uppercase' }}>
                        Curriculum Dissertation: Chordal Architecture in {keyName}
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 4 }}>
                        This bundle is not a random list of grips. It is a visual mapping of harmonic shapes designed to build complete fretboard mastery. By studying these sheets, you unlock the fundamental structure of chords inside the {keyName}-tonality using three core pedagogical phases:
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 3, bgcolor: 'var(--brutal-pink)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>1. The CAGED Geometry</Typography>
                                <Typography variant="body2">
                                    Understand the 5 primary shapes (C, A, G, E, D). Every chord voicing is derived from these shapes. Our sheets visually align these forms, showing how they connect across the fretboard like interlocking puzzle pieces.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 3, bgcolor: 'var(--brutal-yellow)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>2. Color-Coded Roots</Typography>
                                <Typography variant="body2">
                                    Stop gripping shapes blindly. Our sheets isolate and color-code root notes in red, and chord intervals (thirds, fifths) in distinct styling. This builds immediate visualization, letting you find your anchor points in any position.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 3, bgcolor: 'var(--brutal-blue)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>3. Sibling Connections</Typography>
                                <Typography variant="body2">
                                    Learn the matching scales and arpeggios that fit directly over each chord shape. This is the key transition point from rhythm guitar playing to melodic lead work and chord-melody arranging.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            );
        }

        if (isScale) {
            return (
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, textTransform: 'uppercase' }}>
                        Curriculum Dissertation: Scale Pathways in {keyName}
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 4 }}>
                        A scale is not a linear exercise of finger movements; it is a grid of possibilities. Study this curriculum to master fretboard navigation, position changes, and musical expression in the key of {keyName}:
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 3, bgcolor: 'var(--brutal-yellow)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>1. Grid System Navigation</Typography>
                                <Typography variant="body2">
                                    We map the scale layouts across all 5 CAGED boxes. This teaches you how to comfortably play inside a single position or glide cleanly up and down the fretboard during dynamic solos.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 3, bgcolor: 'var(--brutal-mint)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>2. Interval Construction</Typography>
                                <Typography variant="body2">
                                    Identify the exact step-by-step intervals (1, 2, b3, 3, 4, 5, b6, 6, b7, 7). Knowing the scale degrees builds the crucial ear-to-finger connection needed for fluent, intentional improvisation.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ p: 3, bgcolor: 'var(--brutal-pink)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>3. Modal Architecture</Typography>
                                <Typography variant="body2">
                                    Understand how shifting the tonal center of {keyName} Major creates Ionian, Dorian, Phrygian, and Lydian modes. You will learn to alter the sound mood of your solos simply by emphasizing different starting points.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            );
        }

        return (
            <Box>
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, textTransform: 'uppercase' }}>
                    Curriculum Dissertation: Arpeggio Outlines in {keyName}
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 4 }}>
                    Arpeggios are the bridge between chords and scales. They isolate chord tones to outline chord changes during your solos. Study this curated system to master linear melodic outlines in the key of {keyName}:
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 3, bgcolor: 'var(--brutal-blue)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>1. Chord Outlining</Typography>
                            <Typography variant="body2">
                                Instead of playing full chord blocks, arpeggios isolate the individual notes. This bundle maps these notes across all 5 CAGED positions so you can highlight chord changes dynamically.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 3, bgcolor: 'var(--brutal-pink)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>2. Picking Optimization</Typography>
                            <Typography variant="body2">
                                Our clean visual layouts show the vertical string-to-string relationship of the notes, optimizing your economy picking or sweep picking patterns for smooth, rapid-fire phrasing.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box sx={{ p: 3, bgcolor: 'var(--brutal-yellow)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>3. Resolving Harmonic Tensions</Typography>
                            <Typography variant="body2">
                                Learn how to target the arpeggio notes to resolve scales over standard chord progressions in the key of {keyName}, turning scale runs into beautiful, target-note-focused solos.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    return (
        <Box sx={{ bgcolor: 'var(--brutal-bg)', minHeight: '100vh', pt: { xs: '72px', sm: '88px' }, pb: 10 }}>
            <Head>
                <title>{`${product.title} | Curated C-Tonality Systems`}</title>
                <meta
                    name="description"
                    content={product.description || `Buy ${product.title} - ${product.type} guitar sheet music and learning materials. Instant delivery, high quality format, secure checkout.`}
                />
                <meta
                    name="keywords"
                    content={DEFAULT_KEYWORDS}
                />
            </Head>

            <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
                {/* Breadcrumbs & Back Button */}
                <Box sx={{ mb: 4 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                        sx={{
                            mb: 2,
                            bgcolor: 'var(--brutal-paper)',
                            color: 'var(--brutal-ink)',
                            borderColor: 'var(--brutal-ink)',
                            fontWeight: 900,
                            '&:hover': { bgcolor: 'var(--brutal-yellow)' }
                        }}
                    >
                        Back
                    </Button>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                        <Link href="/" style={{ textDecoration: 'none', color: 'var(--brutal-ink)', opacity: 0.6, fontWeight: 700 }}>
                            Home
                        </Link>
                        <Link href="/store" style={{ textDecoration: 'none', color: 'var(--brutal-ink)', opacity: 0.6, fontWeight: 700 }}>
                            Store
                        </Link>
                        <Typography sx={{ color: 'var(--brutal-ink)', fontWeight: 900 }}>{product.title}</Typography>
                    </Breadcrumbs>
                </Box>

                {/* Main Product Info */}
                <Grid container spacing={6} sx={{ mb: 8 }}>
                    {/* Product Image */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={0} sx={{
                            position: 'relative',
                            height: 400,
                            bgcolor: (isSticker || isApparel) ? '#f4efe7' : 'var(--brutal-paper)',
                            borderRadius: 1,
                            overflow: 'hidden',
                            border: '4px solid var(--brutal-ink)',
                            boxShadow: 'var(--brutal-shadow)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: (isSticker || isApparel) ? 4 : 0
                        }}>
                            {isSticker ? (
                                <img
                                    src={`/api/glamour-preview/${product.id.replace('glamour-sticker-', '')}`}
                                    alt={product.title}
                                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                />
                            ) : isApparel ? (
                                <svg viewBox="0 0 260 270" width="100%" height="100%" style={{ maxHeight: '100%', maxWidth: '350px' }}>
                                    <path d="M 51 62 L 81 34 L 179 34 L 209 62 L 193 244 L 67 244 Z" fill={apparelColor.hex} stroke="#151515" strokeWidth="5" strokeLinejoin="round" />
                                    {apparelNeck === 'V-neck' ? (
                                        <path d="M 101 35 L 130 72 L 159 35" fill="none" stroke={apparelColor.ink} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                                    ) : (
                                        <path d="M 101 35 Q 130 67 159 35" fill="none" stroke={apparelColor.ink} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                                    )}
                                    {apparelType === 'T-Shirt' ? (
                                        <>
                                            <path d="M 55 68 L 48 132 L 76 144 L 85 92" fill={apparelColor.hex} stroke="#151515" strokeWidth="5" strokeLinejoin="round" />
                                            <path d="M 205 68 L 212 132 L 184 144 L 175 92" fill={apparelColor.hex} stroke="#151515" strokeWidth="5" strokeLinejoin="round" />
                                        </>
                                    ) : (
                                        <>
                                            <path d="M 55 68 L 35 200 L 60 206 L 85 92" fill={apparelColor.hex} stroke="#151515" strokeWidth="5" strokeLinejoin="round" />
                                            <path d="M 205 68 L 225 200 L 200 206 L 175 92" fill={apparelColor.hex} stroke="#151515" strokeWidth="5" strokeLinejoin="round" />
                                        </>
                                    )}
                                    <rect x="91" y="98" width="78" height="78" rx="8" fill="#ffffff" stroke="#151515" strokeWidth="4" />
                                    <image href={`/api/glamour-preview/${product.id.replace('glamour-apparel-', '').replace('apparel-', '')}`} x="93" y="100" width="74" height="74" preserveAspectRatio="xMidYMid slice" clipPath="url(#artwork-clip-product)" />
                                    <defs><clipPath id="artwork-clip-product"><rect x="91" y="98" width="78" height="78" rx="8" /></clipPath></defs>
                                </svg>
                            ) : (
                                <ProductArtwork product={product} height="100%" compact />
                            )}
                        </Paper>
                    </Grid>

                    {/* Product Details */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                            <Chip
                                label={isSticker ? 'Sticker' : (isApparel ? 'Apparel' : product.type)}
                                color={(isSticker || isApparel) ? 'secondary' : (product.type === 'Digital' ? 'primary' : 'secondary')}
                                size="small"
                                sx={{ mb: 2, borderRadius: 1, border: '2px solid var(--brutal-ink)', fontWeight: 900 }}
                            />
                            <Typography variant="h3" component="h1" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>
                                {product.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <Rating value={5} readOnly size="small" emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />} />
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>(24 verified reviews)</Typography>
                            </Box>
                        </Box>

                        <Typography variant="h4" color="primary.main" sx={{ fontWeight: 900, mb: 1 }}>
                            ${isSticker ? finalUnitPrice : (isApparel ? apparelPrice : product.price)}
                        </Typography>

                        {isSticker && bulkDiscountPercent > 0 && (
                            <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CheckCircleIcon sx={{ fontSize: 18 }} /> {bulkDiscountPercent}% Bulk Discount Applied! (Unit Price: ${finalUnitPrice})
                            </Typography>
                        )}

                        {getDescriptionParagraphs(product).map((para, index) => (
                            <Typography key={index} variant="body1" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'text.secondary', mb: 2 }}>
                                {para}
                            </Typography>
                        ))}

                        {isSticker && (
                            <>
                                <Box sx={{ mb: 3, p: 2, bgcolor: 'var(--brutal-paper)', border: '2px solid var(--brutal-ink)', boxShadow: '4px 4px 0 var(--brutal-ink)' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>⚡ Volume Discounts:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'var(--brutal-ink)' }}>• Buy 1 - 3: Standard price</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'var(--brutal-ink)' }}>• Buy 4 - 9: 15% discount</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'var(--brutal-ink)' }}>• Buy 10+: 30% discount</Typography>
                                </Box>

                                <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>Select Size:</Typography>
                                <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
                                    {Object.entries(sizeSpecs).map(([size, spec]) => (
                                        <Button
                                            key={size}
                                            onClick={() => setStickerSize(size)}
                                            sx={{
                                                border: '2px solid var(--brutal-ink)',
                                                borderRadius: 0,
                                                bgcolor: stickerSize === size ? 'var(--brutal-yellow)' : 'var(--brutal-paper)',
                                                color: 'var(--brutal-ink)',
                                                boxShadow: stickerSize === size ? 'none' : '2px 2px 0 var(--brutal-ink)',
                                                fontWeight: 900,
                                                px: 2,
                                                py: 1,
                                                fontSize: '0.85rem',
                                                textTransform: 'none',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                '&:hover': { bgcolor: 'var(--brutal-mint)' }
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ fontWeight: 900 }}>{size}</Typography>
                                            <Typography variant="caption" sx={{ fontSize: '0.68rem', opacity: 0.8 }}>
                                                {spec.dims} ({spec.weight})
                                            </Typography>
                                        </Button>
                                    ))}
                                </Box>

                                <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>Quantity:</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                    <Button 
                                        disabled={stickerQuantity <= 1} 
                                        onClick={() => setStickerQuantity(prev => prev - 1)}
                                        sx={{ border: '2px solid var(--brutal-ink)', minWidth: 40, height: 40, borderRadius: 0, fontWeight: 900, bgcolor: 'var(--brutal-paper)', color: 'var(--brutal-ink)' }}
                                    >
                                        -
                                    </Button>
                                    <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', minWidth: 20, textAlign: 'center', color: 'var(--brutal-ink)' }}>
                                        {stickerQuantity}
                                    </Typography>
                                    <Button 
                                        onClick={() => setStickerQuantity(prev => prev + 1)}
                                        sx={{ border: '2px solid var(--brutal-ink)', minWidth: 40, height: 40, borderRadius: 0, fontWeight: 900, bgcolor: 'var(--brutal-paper)', color: 'var(--brutal-ink)' }}
                                    >
                                        +
                                    </Button>
                                </Box>

                                <Box sx={{ mb: 4, p: 2, bgcolor: 'var(--brutal-mint)', border: '2px solid var(--brutal-ink)', display: 'inline-block' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: 'var(--brutal-ink)' }}>
                                        Subtotal: ${finalTotalPrice}
                                    </Typography>
                                </Box>
                            </>
                        )}

                        {isApparel && (
                            <>
                                <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>Select Type:</Typography>
                                <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                                    {['T-Shirt', 'Sweater'].map((type) => (
                                        <Button
                                            key={type}
                                            onClick={() => setApparelType(type)}
                                            sx={{
                                                border: '2px solid var(--brutal-ink)',
                                                borderRadius: 0,
                                                bgcolor: apparelType === type ? 'var(--brutal-yellow)' : 'var(--brutal-paper)',
                                                color: 'var(--brutal-ink)',
                                                boxShadow: apparelType === type ? 'none' : '2px 2px 0 var(--brutal-ink)',
                                                fontWeight: 900,
                                                px: 3,
                                                py: 1,
                                                '&:hover': { bgcolor: 'var(--brutal-mint)' }
                                            }}
                                        >
                                            {type}
                                        </Button>
                                    ))}
                                </Box>

                                <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>Select Neckline:</Typography>
                                <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                                    {['Crew neck', 'V-neck'].map((neck) => (
                                        <Button
                                            key={neck}
                                            onClick={() => setApparelNeck(neck)}
                                            sx={{
                                                border: '2px solid var(--brutal-ink)',
                                                borderRadius: 0,
                                                bgcolor: apparelNeck === neck ? 'var(--brutal-yellow)' : 'var(--brutal-paper)',
                                                color: 'var(--brutal-ink)',
                                                boxShadow: apparelNeck === neck ? 'none' : '2px 2px 0 var(--brutal-ink)',
                                                fontWeight: 900,
                                                px: 3,
                                                py: 1,
                                                '&:hover': { bgcolor: 'var(--brutal-mint)' }
                                            }}
                                        >
                                            {neck}
                                        </Button>
                                    ))}
                                </Box>

                                <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>Select Color:</Typography>
                                <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
                                    {apparelPalette.map((colorObj) => (
                                        <Button
                                            key={colorObj.name}
                                            onClick={() => setApparelColor(colorObj)}
                                            sx={{
                                                border: '2px solid var(--brutal-ink)',
                                                borderRadius: 0,
                                                bgcolor: colorObj.hex,
                                                color: colorObj.ink,
                                                boxShadow: apparelColor.name === colorObj.name ? 'none' : '2px 2px 0 var(--brutal-ink)',
                                                fontWeight: 900,
                                                px: 2,
                                                py: 1,
                                                textTransform: 'none',
                                                '&:hover': { opacity: 0.9, bgcolor: colorObj.hex }
                                            }}
                                        >
                                            {colorObj.name}
                                        </Button>
                                    ))}
                                </Box>

                                <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>Select Size:</Typography>
                                <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                                    {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                        <Button
                                            key={size}
                                            onClick={() => setApparelSize(size)}
                                            sx={{
                                                border: '2px solid var(--brutal-ink)',
                                                borderRadius: 0,
                                                bgcolor: apparelSize === size ? 'var(--brutal-yellow)' : 'var(--brutal-paper)',
                                                color: 'var(--brutal-ink)',
                                                boxShadow: apparelSize === size ? 'none' : '2px 2px 0 var(--brutal-ink)',
                                                fontWeight: 900,
                                                minWidth: 45,
                                                py: 1,
                                                '&:hover': { bgcolor: 'var(--brutal-mint)' }
                                            }}
                                        >
                                            {size}
                                        </Button>
                                    ))}
                                </Box>

                                <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase' }}>Quantity:</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                    <Button 
                                        disabled={apparelQuantity <= 1} 
                                        onClick={() => setApparelQuantity(prev => prev - 1)}
                                        sx={{ border: '2px solid var(--brutal-ink)', minWidth: 40, height: 40, borderRadius: 0, fontWeight: 900, bgcolor: 'var(--brutal-paper)', color: 'var(--brutal-ink)' }}
                                    >
                                        -
                                    </Button>
                                    <Typography sx={{ fontWeight: 900, fontSize: '1.2rem', minWidth: 20, textAlign: 'center', color: 'var(--brutal-ink)' }}>
                                        {apparelQuantity}
                                    </Typography>
                                    <Button 
                                        onClick={() => setApparelQuantity(prev => prev + 1)}
                                        sx={{ border: '2px solid var(--brutal-ink)', minWidth: 40, height: 40, borderRadius: 0, fontWeight: 900, bgcolor: 'var(--brutal-paper)', color: 'var(--brutal-ink)' }}
                                    >
                                        +
                                    </Button>
                                </Box>

                                <Box sx={{ mb: 4, p: 2, bgcolor: 'var(--brutal-mint)', border: '2px solid var(--brutal-ink)', display: 'inline-block' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 900, color: 'var(--brutal-ink)' }}>
                                        Subtotal: ${finalApparelTotalPrice}
                                    </Typography>
                                </Box>
                            </>
                        )}

                        {!(isSticker || isApparel) && <Divider sx={{ mb: 4 }} />}

                        {/* Features List */}
                        <Box sx={{ mb: 4 }}>
                            <Stack spacing={1.5}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <MenuBookIcon sx={{ color: 'var(--brutal-ink)', mr: 2, fontSize: 24 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 800 }}>
                                        {isSticker ? 'Vibrant Full Color Vinyl Print' : isApparel ? 'Direct-to-Garment (DTG) Soft Print' : 'Instant Delivery via Secure Email Token'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CheckCircleIcon sx={{ color: 'success.main', mr: 2, fontSize: 24 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 800 }}>
                                        {isSticker ? 'Weather-Resistant, Scratch & UV Protected' : isApparel ? 'Soft 100% Ring-Spun Cotton Fabric' : 'Vector-precise, high-res PDF (Scalable & Printable)'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <SecurityIcon sx={{ color: 'info.main', mr: 2, fontSize: 24 }} />
                                    <Typography variant="body1" sx={{ fontWeight: 800 }}>
                                        {isSticker || isApparel ? '100% Secure Checkout via Stripe' : '100% Malware-Free & Stripe-Secured Checkout'}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={<ArrowBackIcon />}
                                onClick={handleBack}
                                sx={{
                                    px: 4,
                                    py: 2,
                                    fontWeight: 900,
                                    bgcolor: 'var(--brutal-paper)',
                                    color: 'var(--brutal-ink)',
                                    border: '3px solid var(--brutal-ink)',
                                    '&:hover': { bgcolor: 'var(--brutal-yellow)' }
                                }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<ShoppingCartIcon />}
                                onClick={handleAddToCart}
                                sx={{ px: 5, py: 2, fontWeight: 900 }}
                            >
                                Add To Cart
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                onClick={handleBuyNow}
                                sx={{ px: 5, py: 2, fontWeight: 900 }}
                            >
                                Buy Now
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 6 }} />

                {/* Dissertation Section */}
                <Box sx={{
                    p: { xs: 4, md: 6 },
                    bgcolor: 'var(--brutal-paper)',
                    border: '4px solid var(--brutal-ink)',
                    boxShadow: 'var(--brutal-shadow)',
                    mb: 6
                }}>
                    {renderDissertation()}
                </Box>

                {/* Safety & Premium Curation Commitment */}
                <Box sx={{
                    p: 4,
                    bgcolor: 'var(--brutal-mint)',
                    border: '3px solid var(--brutal-ink)',
                    boxShadow: 'var(--brutal-shadow-small)',
                    color: 'var(--brutal-paper)'
                }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, textTransform: 'uppercase', color: 'var(--brutal-ink)' }}>
                        {commitment.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--brutal-ink)', fontWeight: 650 }}>
                        {commitment.text}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export async function getStaticPaths() {
    return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
    const lookupKey = String(params?.id || "").trim();

    if (lookupKey.startsWith('glamour-sticker-')) {
        const slug = lookupKey.replace('glamour-sticker-', '');
        const svgProduct = (glamourSvgProducts || []).find(p => p.id === `glamour-svg-${slug}`);
        if (svgProduct) {
            const product = {
                ...svgProduct,
                id: lookupKey,
                productType: 'sticker',
                price: 4.99,
                description: svgProduct.description || "Premium vinyl die-cut music theory sticker. Weather-resistant coating, beautiful vibrant print details."
            };
            return {
                props: { product },
                revalidate: 60
            };
        }
    }

    if (lookupKey.startsWith('glamour-apparel-') || lookupKey.startsWith('apparel-')) {
        const slug = lookupKey.replace('glamour-apparel-', '').replace('apparel-', '');
        const svgProduct = (glamourSvgProducts || []).find(p => p.id === `glamour-svg-${slug}`);
        if (svgProduct) {
            const product = {
                ...svgProduct,
                id: lookupKey,
                productType: 'apparel',
                price: 29.99,
                description: svgProduct.description || "Premium printed apparel featuring vector-precise music theory artwork."
            };
            return {
                props: { product },
                revalidate: 60
            };
        }
    }

    // Check if it's a dynamic bundle format: bundle-[instrument]-[key]-[element]s
    const regex = /^bundle-([a-z-]+)-([A-Za-z#]+)-(chord|scale|arpeggio)s$/i;
    const match = lookupKey.match(regex);

    if (match) {
        const instrument = match[1];
        const keyPart = match[2];
        const elemSingular = match[3].charAt(0).toUpperCase() + match[3].slice(1); // Chord, Scale, Arpeggio
        
        // Re-construct the key sign from keyPart (e.g., Csharp -> C#)
        const musicKey = keyPart.replace(/sharp/i, '#');
        
        const title = `Bundle: All ${musicKey} ${elemSingular}s for ${instrument.charAt(0).toUpperCase() + instrument.slice(1)}`;
        const price = 9.99;
        const type = 'Digital';
        const category = `${instrument.charAt(0).toUpperCase() + instrument.slice(1)} Sheets Bundles`;
        const image = elemSingular === 'Chord' ? '/assets/dummy_products/bundle_chords.png' :
                      elemSingular === 'Scale' ? '/assets/dummy_products/bundle_scales.png' : '/assets/dummy_products/bundle_arpeggios.png';
        const description = `Unlock the complete collection of ${elemSingular}s specifically for the key of ${musicKey} on the ${instrument.charAt(0).toUpperCase() + instrument.slice(1)}. Hand-selected templates verified by our programmatic music-theory compilation engine for 100% precision. High-resolution printable PDF.`;

        const product = {
            id: lookupKey,
            title,
            price,
            type,
            category,
            musicType: elemSingular,
            musicKey,
            instrument,
            image,
            description
        };

        return {
            props: { product },
            revalidate: 60
        };
    }

    const product = products.find(
        (p) => String(p.id) === lookupKey || String(p.slug || "") === lookupKey
    );

    return {
        props: { product: product || null },
        revalidate: 60
    };
}

export default ProductPage;
