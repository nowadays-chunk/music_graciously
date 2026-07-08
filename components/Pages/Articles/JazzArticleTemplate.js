import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Chip,
    Divider,
    Button,
    Card,
    CardContent,
    CardActions,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Snackbar,
    Alert,
    Tooltip,
    Stack,
    TextField,
    MenuItem, 
    Tabs,
    Tab
} from '@mui/material';
import { styled } from '@mui/system';
import { connect } from 'react-redux';
import { updateStateProperty, addFretboard, newFretboard } from '../../../redux/actions';
import MusicApp from '../../../components/Containers/MusicApp';
import VexChord from '../../../components/Elements/VexChord';
import { getNoteIndex, getNoteName } from '../../../core/music/musicTheory';
import guitar from '../../../config/guitar';
import productsData from '../../../data/products.json';
import { addToCart, toggleCart } from '../../../redux/actions/cartActions';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Image from 'next/image';
import { TargetIcon } from '../../Graphics/BrutalistIcons';
import ProductArtwork from '../../Graphics/ProductArtwork';
import ArticleArtwork from '../../Graphics/ArticleArtwork';

import { GLAMOUR_TEMPLATES } from '../../Graphics/DynamicArtworks';
import glamourProducts from '../../../data/glamourSvgProducts.json';

// Digital / Apparel Products Constants for Graphics
const DIGITAL_PRODUCTS = [
  { format: 'svg', label: 'SVG license', price: 6.99 },
  { format: 'png', label: 'PNG license', price: 5.99 },
];

const GARMENTS = [
  { value: 'crew', label: 'Classic crew-neck T-shirt', price: 29.99 },
  { value: 'long-sleeve', label: 'Long-sleeve T-shirt', price: 34.99 },
  { value: 'v-neck', label: "Women's V-neck T-shirt", price: 31.99 },
];

const COMMON_COLORS = [
  { name: 'White', value: '#f7f5ef', ink: '#151515' },
  { name: 'Black', value: '#171717', ink: '#ffffff' },
  { name: 'Navy', value: '#17233d', ink: '#ffffff' },
  { name: 'Charcoal', value: '#34343a', ink: '#ffffff' },
  { name: 'Heather Gray', value: '#bfc1c2', ink: '#151515' },
  { name: 'Red', value: '#a6262d', ink: '#ffffff' },
  { name: 'Forest Green', value: '#1f4a37', ink: '#ffffff' },
];

const indexToSlug = (index) => String(Number(index) + 1).padStart(2, '0');

const slugify = (value) => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const findGlamourProduct = (templateIndex, format) => {
  const number = String(Number(templateIndex) + 1).padStart(2, '0');
  const productId = `glamour-${format}-${number}`;
  return glamourProducts.find((product) => product.id === productId);
};

// Styled Components
const ArticleSection = styled(Box)(({ theme }) => ({
    marginBottom: '4rem',
    paddingLeft: '10px',
    paddingRight: '10px',
    '& p': {
        fontSize: '1.1rem',
        lineHeight: '1.8',
        color: '#1a202c',
        marginBottom: '1.5rem',
        fontWeight: 500
    },
    '& h2': {
        fontWeight: 900,
        fontSize: '2rem',
        marginBottom: '1.5rem',
        color: 'var(--brutal-ink)',
        borderBottom: '3px solid var(--brutal-ink)',
        display: 'inline-block',
        paddingBottom: '4px'
    },
    '& h3': {
        fontWeight: 800,
        fontSize: '1.3rem',
        marginBottom: '1rem',
        color: 'var(--brutal-ink)'
    }
}));

const HighlightBox = styled(Paper)(({ theme }) => ({
    padding: '2rem',
    borderRadius: '4px !important',
    backgroundColor: '#fffdf5',
    border: '3px solid var(--brutal-ink) !important',
    boxShadow: 'var(--brutal-shadow-small, 4px 4px 0 #111111) !important',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
}));

const BannerContainer = styled(Box)({
  background: 'var(--brutal-pink)',
  border: '4px solid var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow)',
  borderRadius: 4,
  padding: '16px 24px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  marginBottom: '24px',
  marginTop: '24px',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    alignItems: 'stretch',
    textAlign: 'center',
  },
});

const BannerText = styled(Typography)({
  fontWeight: 800,
  color: 'var(--brutal-ink)',
  fontSize: '1.05rem',
  lineHeight: 1.4,
  flex: 1,
});

const BannerLinkButton = styled(Button)({
  borderRadius: 4,
  border: '3px solid var(--brutal-ink)',
  background: 'var(--brutal-yellow)',
  color: 'var(--brutal-ink)',
  boxShadow: '4px 4px 0 var(--brutal-ink)',
  fontWeight: 900,
  textTransform: 'none',
  fontSize: '0.95rem',
  padding: '8px 20px',
  whiteSpace: 'nowrap',
  '&:hover': {
    background: 'var(--brutal-mint)',
    transform: 'translate(2px, 2px)',
    boxShadow: '2px 2px 0 var(--brutal-ink)',
  },
  '@media (max-width: 768px)': {
    width: '100%',
    justifyContent: 'center',
  },
});

const shortenParagraphs = (text) => {
    if (!text || typeof text !== 'string') return text;
    return text
        .split('\n')
        .map(p => {
            const trimmed = p.trim();
            if (!trimmed) return '';
            const sentences = trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmed];
            if (sentences.length <= 1) {
                const words = trimmed.split(/\s+/);
                if (words.length > 8) {
                    return words.slice(0, Math.ceil(words.length / 2)).join(' ') + '...';
                }
                return trimmed;
            }
            const halfCount = Math.max(1, Math.ceil(sentences.length / 2));
            return sentences.slice(0, halfCount).join('').trim();
        })
        .filter(Boolean)
        .join('\n\n');
};


const NORMALIZE_KEY_MAP = {
  'C': 'C', 'C#': 'C#', 'Db': 'C#',
  'D': 'D', 'D#': 'D#', 'Eb': 'D#',
  'E': 'E',
  'F': 'F', 'F#': 'F#', 'Gb': 'F#',
  'G': 'G', 'G#': 'G#', 'Ab': 'G#',
  'A': 'A', 'A#': 'A#', 'Bb': 'A#',
  'B': 'B'
};

const ChordInfo = ({ quality, keyNote, shape, title }) => {
    const info = guitar.arppegios[quality];
    const notes = useMemo(() => {
        if (!info) return [];
        const keyIndex = getNoteIndex(keyNote);
        const preferFlats = guitar.notes.flats.includes(keyNote);
        let n = [getNoteName(keyIndex, preferFlats)];
        let idx = keyIndex;
        for (let i = 0; i < info.intervals.length - 1; i++) {
            idx = (idx + info.formula[i]) % 12;
            n.push(getNoteName(idx, preferFlats));
        }
        return n;
    }, [keyNote, info]);

    return (
        <HighlightBox elevation={0}>
            <Box sx={{ 
                width: '100%', 
                bgcolor: 'var(--brutal-yellow)', 
                borderBottom: '3px solid var(--brutal-ink)', 
                py: 1, 
                px: 2, 
                textAlign: 'center', 
                mb: 2,
                marginTop: '-2rem',
                marginLeft: '-2rem',
                marginRight: '-2rem',
                width: 'calc(100% + 4rem)',
                borderRadius: '1px 1px 0 0'
            }}>
                <Typography variant="h5" fontWeight="900" sx={{ color: 'var(--brutal-ink)' }}>
                    {title || `${keyNote} ${info ? info.name : quality}`}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <VexChord
                    root={keyNote}
                    quality={quality}
                    shape={shape}
                    width={200}
                    height={240}
                />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                {notes.map((n, i) => (
                    <Chip 
                        key={i} 
                        label={n} 
                        sx={{ 
                            bgcolor: '#fff', 
                            fontWeight: '900', 
                            border: '2px solid var(--brutal-ink) !important',
                            borderRadius: '4px !important'
                        }} 
                    />
                ))}
            </Box>
            <Typography variant="body2" fontWeight="800" color="text.secondary">
                Intervals: {info ? info.intervals.map(inter => inter === '1' ? 'root' : inter).join(', ') : 'N/A'}
            </Typography>
        </HighlightBox>
    );
};

const ApparelMockup = ({ garment, color, artworkIndex, viewLabel, pose }) => {
  const isLongSleeve = garment === 'long-sleeve';
  const isVNeck = garment === 'v-neck';
  const bodyWidth = pose === 'wide' ? 174 : pose === 'slim' ? 142 : 158;
  const bodyX = (260 - bodyWidth) / 2;

  return (
    <Box
      sx={{
        minHeight: 310,
        bgcolor: '#fff',
        border: '3px solid var(--brutal-ink)',
        boxShadow: '6px 6px 0 var(--brutal-ink)',
        p: 1.5,
      }}
    >
      <svg viewBox="0 0 260 270" width="100%" height="250" role="img" aria-label={viewLabel}>
        <rect width="260" height="270" fill="#f4efe7" />
        <path
          d={`M ${bodyX} 62 L ${bodyX + 30} 34 L ${bodyX + bodyWidth - 30} 34 L ${bodyX + bodyWidth} 62 L ${bodyX + bodyWidth - 16} 244 L ${bodyX + 16} 244 Z`}
          fill={color.value}
          stroke="#151515"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d={isVNeck ? `M 104 35 L 130 86 L 156 35` : `M 101 35 Q 130 67 159 35`}
          fill="none"
          stroke={color.ink}
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={isLongSleeve ? `M ${bodyX + 4} 68 L 28 214 L 58 226 L ${bodyX + 34} 92` : `M ${bodyX + 4} 68 L 48 132 L 76 144 L ${bodyX + 34} 92`}
          fill={color.value}
          stroke="#151515"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d={isLongSleeve ? `M ${bodyX + bodyWidth - 4} 68 L 232 214 L 202 226 L ${bodyX + bodyWidth - 34} 92` : `M ${bodyX + bodyWidth - 4} 68 L 212 132 L 184 144 L ${bodyX + bodyWidth - 34} 92`}
          fill={color.value}
          stroke="#151515"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <rect x="91" y="98" width="78" height="78" rx="8" fill="#ffffff" stroke="#151515" strokeWidth="4" />
        <image
          href={`/api/glamour-preview/${indexToSlug(artworkIndex)}`}
          x="93" y="100" width="74" height="74"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#artwork-clip)"
        />
        <clipPath id="artwork-clip">
          <rect x="91" y="98" width="78" height="78" rx="8" />
        </clipPath>
        <text x="130" y="258" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="12" fill="#151515">
          {viewLabel}
        </text>
      </svg>
    </Box>
  );
};

const ProductCard = ({ id, title, price, image, type, dispatch, ...productMeta }) => {
    const handleAddToCart = () => {
        dispatch(addToCart({ id, title, price, image, type, ...productMeta }));
        dispatch(toggleCart());
    };

    return (
        <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.16s ease, box-shadow 0.16s ease',
                bgcolor: 'rgba(255, 253, 245, 0.86) !important',
                border: '3px solid var(--brutal-ink) !important',
                boxShadow: 'var(--brutal-shadow, 6px 6px 0 #111111) !important',
                borderRadius: '4px !important',
                '&:hover': { 
                    transform: 'translate(-3px, -3px)', 
                    boxShadow: '10px 10px 0 var(--brutal-ink) !important' 
                }
            }}>
                <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
                    <Chip 
                        label={type} 
                        size="small" 
                        sx={{ 
                            bgcolor: type === 'Physical' ? 'var(--brutal-pink) !important' : 'var(--brutal-blue) !important',
                            color: 'var(--brutal-ink) !important',
                            fontWeight: '900',
                            border: '2px solid var(--brutal-ink) !important'
                        }} 
                    />
                </Box>
                <Link href={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Box sx={{
                        height: 160,
                        position: 'relative',
                        overflow: 'hidden',
                        bgcolor: 'var(--brutal-paper)',
                        cursor: 'pointer',
                        borderBottom: '3px solid var(--brutal-ink)'
                    }}>
                        <ProductArtwork product={{ id, title, price, image, type, ...productMeta }} height="100%" compact />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography variant="subtitle1" component="h3" gutterBottom fontWeight="900" sx={{ fontSize: '0.9rem', lineHeight: 1.2, height: '2.4em', overflow: 'hidden', color: 'var(--brutal-ink)' }}>
                            {title}
                        </Typography>
                        <Typography variant="h6" color="var(--brutal-ink)" fontWeight="900">
                            ${price}
                        </Typography>
                    </CardContent>
                </Link>
                <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            bgcolor: 'var(--brutal-yellow) !important',
                            color: 'var(--brutal-ink) !important',
                            fontWeight: '900',
                            border: '3px solid var(--brutal-ink) !important',
                            '&:hover': {
                                bgcolor: 'var(--brutal-pink) !important'
                            }
                        }}
                        size="small"
                        startIcon={<ShoppingCartIcon />}
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
};

const JazzArticleTemplate = ({ data, boards, updateBoards, addFretboard, dispatch }) => {
    const [activeSection, setActiveSection] = useState(0);

    const activeSectionData = data.sections?.[activeSection] || data.sections?.[0];
    const bannerInfo = useMemo(() => {
        const songKeyName = data.key ? data.key.replace('m', '').trim() : 'C';
        const normalizedKey = NORMALIZE_KEY_MAP[songKeyName] || songKeyName;
        const keySlug = normalizedKey.replace('#', 'sharp');
        
        const validInstrument = 'guitar'; 
        
        const sentence1 = `Master the key of ${normalizedKey} on Guitar with our complete collection of sheet music bundles.`;
        const sentence2 = `Download the high-resolution PDFs below to practice chords, scales, and arpeggios offline.`;
        const bannerText = `${sentence1} ${sentence2}`;

        const links = [
            { label: `${normalizedKey} Chords`, url: `/product/bundle-${validInstrument}-${keySlug}-chords`, color: 'var(--brutal-pink)' },
            { label: `${normalizedKey} Scales`, url: `/product/bundle-${validInstrument}-${keySlug}-scales`, color: 'var(--brutal-yellow)' },
            { label: `${normalizedKey} Arpeggios`, url: `/product/bundle-${validInstrument}-${keySlug}-arppegios`, color: 'var(--brutal-blue)' }
        ];

        return { keyName: normalizedKey, bannerText, links };
    }, [data.key]);

    // Dialog state for Graphics selection
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [purchaseMode, setPurchaseMode] = useState('digital');
    const [digitalFormat, setDigitalFormat] = useState('svg');
    const [garment, setGarment] = useState('crew');
    const [shirtColor, setShirtColor] = useState(COMMON_COLORS[1]);
    const [size, setSize] = useState('M');
    const [quantity, setQuantity] = useState(1);
    const [toastMessage, setToastMessage] = useState('');
    const [toastOpen, setToastOpen] = useState(false);

    // Prevent React StrictMode duplicate boards dispatch using ref guard
    const isAddingRef = useRef(false);

    // Initialize board
    useEffect(() => {
        if (boards.length === 0 && !isAddingRef.current) {
            isAddingRef.current = true;
            addFretboard(newFretboard(6, 25, [4, 7, 2, 9, 11, 4], [4, 3, 3, 3, 2, 2], 'articles', 'scale'));
        }
    }, [boards.length, addFretboard]);

    const handleSectionClick = useCallback((section) => {
        const boardId = boards[0]?.id;
        if (!boardId) return;

        const choice = section.display || "scale";
        updateBoards(boardId, "generalSettings.choice", choice);

        if (choice === "scale") {
            updateBoards(boardId, "keySettings.scale", getNoteIndex(section.key));
            updateBoards(boardId, "scaleSettings.scale", section.scale);
            updateBoards(boardId, "modeSettings.mode", "");
            updateBoards(boardId, "scaleSettings.shape", "");
        } else if (choice === "chord" || choice === "arppegio") {
            const settingsKey = choice + "Settings";
            updateBoards(boardId, `keySettings.${choice}`, getNoteIndex(section.key));
            updateBoards(boardId, `${settingsKey}.${choice}`, section.quality);
            updateBoards(boardId, `${settingsKey}.shape`, section.shape || "E");
        }
    }, [boards, updateBoards]);

    // Auto-trigger first section
    const hasInitialized = useRef(false);
    useEffect(() => {
        if (boards.length > 0 && !hasInitialized.current) {
            handleSectionClick(data.sections[0]);
            hasInitialized.current = true;
        }
    }, [boards, data.sections, handleSectionClick]);

    const handleSelectTemplate = (template, mode) => {
        setSelectedTemplate(template);
        setPurchaseMode(mode);
        setDigitalFormat('svg');
        setGarment('crew');
        setShirtColor(COMMON_COLORS[1]);
        setSize(template.sizes?.includes('M') ? 'M' : template.sizes?.[0] || 'M');
        setQuantity(1);
    };

    const addDigitalToCart = () => {
        if (!selectedTemplate) return;
        const license = DIGITAL_PRODUCTS.find((item) => item.format === digitalFormat) || DIGITAL_PRODUCTS[0];
        const secureProduct = findGlamourProduct(selectedTemplate.originalIndex, license.format);
        if (!secureProduct) {
            setToastMessage('This artwork file is not configured yet. Please try another design.');
            setToastOpen(true);
            return;
        }

        dispatch(addToCart({
            id: secureProduct.id,
            sku: secureProduct.id,
            title: secureProduct.title,
            price: secureProduct.price,
            quantity,
            allowQuantity: true,
            requiresSecureDownload: true,
            productType: 'artwork-digital',
            format: license.format,
            svgMarkup: '',
            fileName: `${slugify(secureProduct.title)}.${license.format}`,
            filePath: secureProduct.filePath || '',
            variantSummary: `${license.format.toUpperCase()} | secure download | ${selectedTemplate.ageRange || 'All ages'}`,
        }));
        setToastMessage(`${license.label} added to cart.`);
        setToastOpen(true);
        setSelectedTemplate(null);
    };

    const addApparelToCart = () => {
        if (!selectedTemplate) return;
        const garmentOption = GARMENTS.find((item) => item.value === garment) || GARMENTS[0];

        dispatch(addToCart({
            id: `apparel-${selectedTemplate.originalIndex}-${garment}-${slugify(shirtColor.name)}-${size}`,
            title: `${selectedTemplate.name} printed ${garmentOption.label}`,
            price: garmentOption.price,
            quantity,
            allowQuantity: true,
            requiresSecureDownload: false,
            productType: 'artwork-apparel',
            templateIndex: selectedTemplate.originalIndex,
            variantSummary: `${garmentOption.label} | ${shirtColor.name} | ${size}`,
            apparel: {
                garment: garmentOption.label,
                color: shirtColor.name,
                colorHex: shirtColor.value,
                size,
            },
        }));
        setToastMessage('Printed apparel added to cart.');
        setToastOpen(true);
        setSelectedTemplate(null);
    };

    // Grab a selection of 3 graphics from the gallery
    const featuredGraphics = useMemo(() => {
        return [
            { ...GLAMOUR_TEMPLATES[0], originalIndex: 0 },
            { ...GLAMOUR_TEMPLATES[1], originalIndex: 1 },
            { ...GLAMOUR_TEMPLATES[2], originalIndex: 2 }
        ];
    }, []);

    const selectedSizes = selectedTemplate?.sizes || ['S', 'M', 'L', 'XL', 'XXL'];

    return (
        <Box sx={{ bgcolor: 'var(--brutal-bg)', minHeight: '100vh', marginTop: '50px', pb: 10 }}>
            <Head>
                <title>{data.title} Analysis | Sheets Media Academy</title>
                <meta name="description" content={data.description} />
            </Head>

            <Container maxWidth="lg" sx={{ py: 10 }}>
                {/* Header */}
                <Box sx={{ 
                    textAlign: 'left', 
                    mb: 8, 
                    p: { xs: 3, md: 5 }, 
                    bgcolor: 'var(--brutal-yellow)', 
                    border: '4px solid var(--brutal-ink)', 
                    boxShadow: 'var(--brutal-shadow)',
                    borderRadius: '4px'
                }}>
                    <Typography variant="overline" sx={{ color: 'var(--brutal-ink)', fontWeight: '900', letterSpacing: 2 }}>JAZZ THEORY MASTERCLASS</Typography>
                    <Typography
                        variant="h1"
                        sx={{
                            fontWeight: 900,
                            mb: 3,
                            fontSize: { xs: '2.5rem', md: '4rem' },
                            letterSpacing: '-0.02em',
                            color: 'var(--brutal-ink)'
                        }}
                    >
                        {data.title}: <span style={{ color: 'var(--brutal-pink)' }}>{data.subtitle}</span>
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: 'var(--brutal-ink)', fontSize: '1.1rem', lineHeight: 1.6 }}>
                        {shortenParagraphs(data.description)}
                    </Typography>
                </Box>

                <Box sx={{ height: { xs: 280, md: 440 }, mb: 8, overflow: 'hidden', border: '4px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow)', borderRadius: '4px' }}>
                    <ArticleArtwork
                        article={{
                            slug: data.title,
                            title: `${data.title}: ${data.subtitle}`,
                            category: data.theoryFocus || 'Analysis',
                        }}
                        height="100%"
                    />
                </Box>

                <ArticleSection>
                    <Typography variant="h2">{data.title}: Inside the Music</Typography>
                    <Typography>
                        Every standard has a story, and <em>{data.title}</em> (in key of <strong>{data.key}</strong>) is a masterclass in songwriting and a foundational canvas for improvisation. Let's explore its unique approach to <strong>{data.theoryFocus}</strong>.
                    </Typography>

                    {data.historicalContext && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h3">A Musician's Perspective & Background</Typography>
                            <Typography>{shortenParagraphs(data.historicalContext)}</Typography>
                        </Box>
                    )}
                </ArticleSection>

                {/* Interactive Music App Section */}
                <Box sx={{ mb: 10 }}>
                    <Typography variant="h3" align="left" fontWeight="900" gutterBottom sx={{ borderBottom: '3px solid var(--brutal-ink)', pb: 1, display: 'inline-block', mb: 3, px: '10px' }}>
                        Interactive Soloing Laboratory
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', fontWeight: '800', px: '10px' }}>
                        Use the controls below to visualize key harmonic moments on the fretboard and circle of fifths.
                    </Typography>
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                            {data.sections.map((s, idx) => (
                                <Button
                                    key={idx}
                                    variant={activeSection === idx ? "contained" : "outlined"}
                                    onClick={() => { setActiveSection(idx); handleSectionClick(s); }}
                                    sx={{ 
                                        borderRadius: '4px',
                                        border: '3px solid var(--brutal-ink) !important',
                                        boxShadow: activeSection === idx ? 'none' : 'var(--brutal-shadow-small, 4px 4px 0 #111111)',
                                        bgcolor: activeSection === idx ? 'var(--brutal-yellow) !important' : '#fffdf5',
                                        color: 'var(--brutal-ink) !important',
                                        fontWeight: '900',
                                        transition: 'transform 0.1s ease',
                                        '&:hover': {
                                            bgcolor: 'var(--brutal-pink) !important',
                                        }
                                    }}
                                >
                                    {s.name}
                                </Button>
                            ))}
                        </Box>
                        <MusicApp board="articles" showFretboard={true} showFretboardControls={true} showCircleOfFifths={true} showStats={true} />
                    </Box>
                </Box>

                {data.harmonicAnalysis && (
                    <ArticleSection>
                        <Typography variant="h2">Harmonic Deep-Dive</Typography>
                        <Typography>{shortenParagraphs(data.harmonicAnalysis)}</Typography>
                        <Grid container spacing={4} sx={{ my: 4 }}>
                            {data.sections.filter(s => s.display === 'chord').map((s, i) => (
                                <Grid item xs={12} sm={6} md={4} key={i}>
                                    <ChordInfo quality={s.quality} keyNote={s.key} shape={s.shape} title={s.name} />
                                </Grid>
                            ))}
                        </Grid>
                    </ArticleSection>
                )}

                {data.melodicAnalysis && (
                    <ArticleSection>
                        <Typography variant="h2">Melodic Ideas to Try</Typography>
                        <Typography>{shortenParagraphs(data.melodicAnalysis)}</Typography>
                    </ArticleSection>
                )}

                {data.rhythmicFoundation && (
                    <ArticleSection>
                        <Typography variant="h2">The Groove & The Feel</Typography>
                        <Typography>{shortenParagraphs(data.rhythmicFoundation)}</Typography>
                    </ArticleSection>
                )}

                {data.improvisationStrategies && (
                    <ArticleSection>
                        <Typography variant="h2">Improvisation Strategies</Typography>
                        <Typography>{shortenParagraphs(data.improvisationStrategies)}</Typography>
                    </ArticleSection>
                )}

                {data.keyTakeaways && (
                    <ArticleSection>
                        <Typography variant="h2">Summary & Takeaways</Typography>
                        <Typography sx={{ 
                            bgcolor: 'rgba(255, 253, 245, 0.86)', 
                            p: 3, 
                            borderRadius: '4px', 
                            border: '3px solid var(--brutal-ink)',
                            boxShadow: 'var(--brutal-shadow-small)',
                            fontWeight: 500,
                            lineHeight: 1.7
                        }}>
                            {shortenParagraphs(data.keyTakeaways)}
                        </Typography>
                    </ArticleSection>
                )}

                <Divider sx={{ my: 8, borderColor: 'var(--brutal-ink)', borderWidth: '2px' }} />
                {bannerInfo && (
                    <Box sx={{ 
                        mb: 4, 
                        p: 2.5, 
                        bgcolor: 'var(--brutal-pink)', 
                        border: '3px solid var(--brutal-ink)', 
                        boxShadow: 'var(--brutal-shadow-small, 4px 4px 0 #111111)', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        flexWrap: 'wrap', 
                        gap: 2,
                        borderRadius: '4px',
                        mt: 4
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', flex: 1 }}>
                            <TargetIcon size={22} fill="var(--brutal-yellow)" />
                            <Typography sx={{ fontWeight: 900, color: 'var(--brutal-ink)', fontSize: '1rem', lineHeight: 1.5 }}>
                                {bannerInfo.bannerText}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', ml: { xs: 0, md: 'auto' } }}>
                            {bannerInfo.links.map(btn => (
                                <Button 
                                    key={btn.label}
                                    component={Link}
                                    href={btn.url}
                                    sx={{
                                        fontWeight: 900,
                                        fontSize: '0.8rem',
                                        bgcolor: btn.color,
                                        color: 'var(--brutal-ink)',
                                        border: '2px solid var(--brutal-ink)',
                                        boxShadow: '2px 2px 0 var(--brutal-ink)',
                                        textTransform: 'none',
                                        padding: '6px 14px',
                                        '&:hover': { bgcolor: 'var(--brutal-paper)', boxShadow: 'none' }
                                    }}
                                >
                                    {btn.label} ➔
                                </Button>
                            ))}
                        </Box>
                    </Box>
                )}
                <Box sx={{ textAlign: 'left', color: 'text.secondary', fontWeight: '800' }}>
                    <Typography variant="body2">© 2026 Sheets Media Academy. All Rights Reserved.</Typography>
                </Box>
            </Container>

            {/* Purchase modal dialog for graphics */}
            <Dialog open={Boolean(selectedTemplate)} onClose={() => setSelectedTemplate(null)} maxWidth="lg" fullWidth>
                {selectedTemplate ? (
                    <>
                        <DialogTitle sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            fontWeight: 900,
                            borderBottom: '3px solid var(--brutal-ink)',
                            bgcolor: 'var(--brutal-yellow)',
                            color: 'var(--brutal-ink)'
                        }}>
                            {selectedTemplate.name}
                            <IconButton onClick={() => setSelectedTemplate(null)} sx={{ border: '2px solid var(--brutal-ink)', bgcolor: '#fff', color: 'var(--brutal-ink)' }}><CloseIcon /></IconButton>
                        </DialogTitle>
                        <DialogContent sx={{ bgcolor: 'var(--brutal-bg)', py: 4 }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={purchaseMode === 'apparel' ? 7 : 5}>
                                    {purchaseMode === 'apparel' ? (
                                        <Grid container spacing={2}>
                                            {['Front', 'Close print', 'Back color'].map((label, index) => (
                                                <Grid item xs={12} sm={index === 0 ? 12 : 6} key={label}>
                                                    <ApparelMockup
                                                        garment={garment}
                                                        color={shirtColor}
                                                        artworkIndex={selectedTemplate.originalIndex}
                                                        viewLabel={label}
                                                        pose={index === 1 ? 'slim' : 'regular'}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, border: '3px solid var(--brutal-ink)', bgcolor: 'var(--brutal-paper)', borderRadius: '4px', boxShadow: 'var(--brutal-shadow-small)' }}>
                                            <Box sx={{ position: 'relative', width: '100%', height: 380 }}>
                                                <Image
                                                    src={`/api/glamour-preview/${indexToSlug(selectedTemplate.originalIndex)}`}
                                                    alt={selectedTemplate.name}
                                                    fill
                                                    unoptimized
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </Box>
                                        </Box>
                                    )}
                                </Grid>

                                <Grid item xs={12} md={purchaseMode === 'apparel' ? 5 : 7}>
                                    <Stack spacing={3}>
                                        <Tabs 
                                            value={purchaseMode} 
                                            onChange={(_event, value) => setPurchaseMode(value)}
                                            sx={{
                                                '& .MuiTabs-indicator': { bgcolor: 'var(--brutal-pink)', height: 4 },
                                                '& .MuiTab-root': { fontWeight: '900', color: 'var(--brutal-ink)' },
                                                '& .MuiTab-root.Mui-selected': { color: 'var(--brutal-pink)' }
                                            }}
                                        >
                                            <Tab value="digital" label="Digital file" icon={<ImageIcon />} iconPosition="start" />
                                            <Tab value="apparel" label="Printed apparel" icon={<CheckroomIcon />} iconPosition="start" />
                                        </Tabs>

                                        {purchaseMode === 'digital' ? (
                                            <>
                                                <TextField 
                                                    select 
                                                    label="Download format" 
                                                    value={digitalFormat} 
                                                    onChange={(event) => setDigitalFormat(event.target.value)} 
                                                    fullWidth
                                                >
                                                    {DIGITAL_PRODUCTS.map((product) => (
                                                        <MenuItem key={product.format} value={product.format}>
                                                            {product.label} - ${product.price.toFixed(2)}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                                <TextField 
                                                    label="Quantity" 
                                                    type="number" 
                                                    value={quantity} 
                                                    onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))} 
                                                    inputProps={{ min: 1 }} 
                                                />
                                                <Button 
                                                    variant="contained" 
                                                    size="large" 
                                                    startIcon={<AddShoppingCartIcon />} 
                                                    onClick={addDigitalToCart}
                                                    sx={{
                                                        bgcolor: 'var(--brutal-yellow) !important',
                                                        color: 'var(--brutal-ink) !important',
                                                        fontWeight: '900',
                                                        border: '3px solid var(--brutal-ink) !important',
                                                        boxShadow: 'var(--brutal-shadow-small) !important',
                                                        '&:hover': { bgcolor: 'var(--brutal-pink) !important' }
                                                    }}
                                                >
                                                    Add paid file to cart
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <TextField 
                                                    select 
                                                    label="Garment" 
                                                    value={garment} 
                                                    onChange={(event) => setGarment(event.target.value)} 
                                                    fullWidth
                                                >
                                                    {GARMENTS.map((item) => (
                                                        <MenuItem key={item.value} value={item.value}>{item.label} - ${item.price.toFixed(2)}</MenuItem>
                                                    ))}
                                                </TextField>
                                                <TextField 
                                                    select 
                                                    label="Size" 
                                                    value={size} 
                                                    onChange={(event) => setSize(event.target.value)} 
                                                    fullWidth
                                                >
                                                    {selectedSizes.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                                                </TextField>
                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                    {COMMON_COLORS.map((color) => (
                                                        <Tooltip key={color.name} title={color.name}>
                                                            <IconButton
                                                                onClick={() => setShirtColor(color)}
                                                                sx={{
                                                                    width: 42,
                                                                    height: 42,
                                                                    bgcolor: color.value,
                                                                    border: shirtColor.name === color.name ? '4px solid var(--brutal-pink)' : '3px solid var(--brutal-ink)',
                                                                    boxShadow: shirtColor.name === color.name ? 'none' : '2px 2px 0 var(--brutal-ink)',
                                                                    '&:hover': { bgcolor: color.value },
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    ))}
                                                </Stack>
                                                <TextField 
                                                    label="Quantity" 
                                                    type="number" 
                                                    value={quantity} 
                                                    onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))} 
                                                    inputProps={{ min: 1 }} 
                                                />
                                                <Button 
                                                    variant="contained" 
                                                    size="large" 
                                                    startIcon={<ShoppingBagIcon />} 
                                                    onClick={addApparelToCart}
                                                    sx={{
                                                        bgcolor: 'var(--brutal-yellow) !important',
                                                        color: 'var(--brutal-ink) !important',
                                                        fontWeight: '900',
                                                        border: '3px solid var(--brutal-ink) !important',
                                                        boxShadow: 'var(--brutal-shadow-small) !important',
                                                        '&:hover': { bgcolor: 'var(--brutal-pink) !important' }
                                                    }}
                                                >
                                                    Add apparel to cart
                                                </Button>
                                            </>
                                        )}
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </>
                ) : null}
            </Dialog>

            <Snackbar open={toastOpen} autoHideDuration={3000} onClose={() => setToastOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ fontWeight: 900, border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)', borderRadius: '4px' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

const mapStateToProps = (state) => ({
    boards: state.fretboard.components.filter(b => b.generalSettings.page === 'articles')
});

const mapDispatchToProps = (dispatch) => ({
    updateBoards: (id, prop, val) => dispatch(updateStateProperty(id, prop, val)),
    addFretboard: (board) => dispatch(addFretboard(board)),
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(JazzArticleTemplate);
