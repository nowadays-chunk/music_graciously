import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

import Image from 'next/image';
import { GLAMOUR_TEMPLATES } from '../components/Graphics/DynamicArtworks';
import { addToCart } from '../redux/actions/cartActions';
import { DEFAULT_KEYWORDS } from '../data/seo';
import glamourProducts from '../data/glamourSvgProducts.json';

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

const getArtworkImage = (templateIndex, format = 'png') => {
  const product = glamourProducts.find(
    (p) => p.format === format && Number(String(p.id).match(/(\d+)$/)?.[1]) === Number(templateIndex) + 1
  );
  return product?.image || '';
};

const slugify = (value) => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const findGlamourProduct = (templateIndex, format) => {
  const number = String(Number(templateIndex) + 1).padStart(2, '0');
  const productId = `glamour-${format}-${number}`;
  return glamourProducts.find((product) => product.id === productId);
};

const ApparelMockup = ({ garment, color, artworkIndex, seed, viewLabel, pose }) => {
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
        {/* Use SVG native <image> element — no DynamicArtwork client code exposed */}
        <image
          href={getArtworkImage(artworkIndex, 'png')}
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

const GraphicsGalleryPage = () => {
  const dispatch = useDispatch();
  const [seed, setSeed] = useState('caged-system');
  const [complexity, setComplexity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [purchaseMode, setPurchaseMode] = useState('digital');
  const [digitalFormat, setDigitalFormat] = useState('svg');
  const [garment, setGarment] = useState('crew');
  const [shirtColor, setShirtColor] = useState(COMMON_COLORS[1]);
  const [size, setSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    handleRandomizeSeed();
  }, []);

  const filteredTemplates = useMemo(() => GLAMOUR_TEMPLATES
    .map((tmpl, idx) => ({ ...tmpl, originalIndex: idx }))
    .filter((tmpl) => {
      if (complexity !== 'all' && tmpl.complexity !== complexity) return false;
      if (searchQuery && !tmpl.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    }), [complexity, searchQuery]);

  const handleRandomizeSeed = () => {
    const randomString = Math.random().toString(36).substring(2, 10) + '-' + Math.random().toString(36).substring(2, 10);
    setSeed(randomString);
  };

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
      // Store index so CartItemThumbnail can request /api/glamour-preview/[slug]
      // Raw SVG markup is NOT stored client-side
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

  const selectedSizes = selectedTemplate?.sizes || ['S', 'M', 'L', 'XL', 'XXL'];
  const selectedSeed = selectedTemplate ? `${seed}-${selectedTemplate.originalIndex}` : seed;

  return (
    <>
      <Head>
        <title>Paid Glamour SVG & T-Shirt Studio | Guitar Sheets</title>
        <meta name="description" content="Buy glamour music SVG and PNG artwork licenses, or preview the designs on printed T-shirts before checkout." />
        <meta name="keywords" content={`${DEFAULT_KEYWORDS}, paid svg, png artwork, guitar t-shirt, music apparel`} />
      </Head>

      <Container maxWidth="xl" sx={{ py: 15 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
            <MusicNoteIcon sx={{ fontSize: 40, color: 'var(--brutal-pink)' }} />
            <Typography variant="h3" component="h1" fontWeight="bold">
              GLAMOUR CLOTHING STORE
            </Typography>
          </Stack>
          <Typography variant="body1" sx={{ maxWidth: 760, mx: 'auto', mt: 1, color: 'text.secondary' }}>
            Choose a paid SVG/PNG license or preview the design on printed apparel before adding it to cart.
          </Typography>
        </Box>

        <Card sx={{ mb: 6, bgcolor: 'var(--brutal-paper)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow)', p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={5}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <TextField fullWidth label="Generative Seed" value={seed} onChange={(event) => setSeed(event.target.value)} />
                <Button variant="contained" onClick={handleRandomizeSeed} startIcon={<RefreshIcon />} sx={{ px: 3, flexShrink: 0 }}>
                  Shuffle
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Search Designs" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Tabs value={complexity} onChange={(_event, value) => setComplexity(value)} aria-label="complexity filter tabs">
                <Tab label={`All (${GLAMOUR_TEMPLATES.length})`} value="all" sx={{ fontWeight: 'bold' }} />
                <Tab label="Simple" value="simple" sx={{ fontWeight: 'bold' }} />
                <Tab label="Intermediate" value="intermediate" sx={{ fontWeight: 'bold' }} />
                <Tab label="Complete" value="complete" sx={{ fontWeight: 'bold' }} />
              </Tabs>
            </Grid>
          </Grid>
        </Card>

        <Grid container spacing={4}>
          {filteredTemplates.map((tmpl) => {
            const cardSeed = `${seed}-${tmpl.originalIndex}`;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={tmpl.originalIndex}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'rgba(255, 253, 245, 0.95)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow)' }}>
                  <Box sx={{ p: 2, borderBottom: '3px solid var(--brutal-ink)' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                      <Typography variant="subtitle1" fontWeight="bold" noWrap>{tmpl.originalIndex + 1}. {tmpl.name}</Typography>
                      <Chip label={tmpl.complexity.toUpperCase()} size="small" sx={{ fontSize: 9, fontWeight: 900 }} />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {tmpl.ageRange || 'All ages'} | {(tmpl.sizes || ['S', 'M', 'L', 'XL']).join(', ')}
                    </Typography>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: '0 !important' }}>
                    <Box sx={{ position: 'relative', width: '100%', height: 280 }}>
                      <Image
                        src={getArtworkImage(tmpl.originalIndex, 'png')}
                        alt={tmpl.name}
                        fill
                        unoptimized
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ borderTop: '3px solid var(--brutal-ink)', bgcolor: 'var(--brutal-bg)', justifyContent: 'space-between' }}>
                    <Tooltip title="Buy SVG or PNG">
                      <Button onClick={() => handleSelectTemplate(tmpl, 'digital')} startIcon={<ImageIcon />} variant="outlined" size="small">
                        License
                      </Button>
                    </Tooltip>
                    <Tooltip title="Preview on apparel">
                      <Button onClick={() => handleSelectTemplate(tmpl, 'apparel')} startIcon={<CheckroomIcon />} variant="contained" size="small">
                        T-shirt
                      </Button>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <Dialog open={Boolean(selectedTemplate)} onClose={() => setSelectedTemplate(null)} maxWidth="xl" fullWidth>
        {selectedTemplate ? (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 900 }}>
              {selectedTemplate.name}
              <IconButton onClick={() => setSelectedTemplate(null)}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={4}>
                <Grid item xs={12} md={purchaseMode === 'apparel' ? 7 : 5}>
                  {purchaseMode === 'apparel' ? (
                    <Grid container spacing={2}>
                      {['Front', 'Left angle', 'Right angle', 'Close print', 'Back color'].map((label, index) => (
                        <Grid item xs={12} sm={index === 3 ? 6 : 6} md={index === 3 ? 6 : 4} key={label}>
                          <ApparelMockup
                            garment={garment}
                            color={shirtColor}
                            artworkIndex={selectedTemplate.originalIndex}
                            seed={selectedSeed}
                            viewLabel={label}
                            pose={index === 1 ? 'slim' : index === 2 ? 'wide' : 'regular'}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, border: '3px solid var(--brutal-ink)', bgcolor: 'var(--brutal-paper)' }}>
                      <Box sx={{ position: 'relative', width: '100%', height: 460 }}>
                        <Image
                          src={getArtworkImage(selectedTemplate.originalIndex, 'png')}
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
                  <Stack spacing={2.5}>
                    <Tabs value={purchaseMode} onChange={(_event, value) => setPurchaseMode(value)}>
                      <Tab value="digital" label="Digital file" icon={<ImageIcon />} iconPosition="start" />
                      <Tab value="apparel" label="Printed apparel" icon={<CheckroomIcon />} iconPosition="start" />
                    </Tabs>

                    {purchaseMode === 'digital' ? (
                      <>
                        <TextField select label="Download format" value={digitalFormat} onChange={(event) => setDigitalFormat(event.target.value)} fullWidth>
                          {DIGITAL_PRODUCTS.map((product) => (
                            <MenuItem key={product.format} value={product.format}>
                              {product.label} - ${product.price.toFixed(2)}
                            </MenuItem>
                          ))}
                        </TextField>
                        <TextField label="Quantity" type="number" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))} inputProps={{ min: 1 }} />
                        <Button variant="contained" size="large" startIcon={<AddShoppingCartIcon />} onClick={addDigitalToCart}>
                          Add paid file to cart
                        </Button>
                      </>
                    ) : (
                      <>
                        <TextField select label="Garment" value={garment} onChange={(event) => setGarment(event.target.value)} fullWidth>
                          {GARMENTS.map((item) => (
                            <MenuItem key={item.value} value={item.value}>{item.label} - ${item.price.toFixed(2)}</MenuItem>
                          ))}
                        </TextField>
                        <TextField select label="Size" value={size} onChange={(event) => setSize(event.target.value)} fullWidth>
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
                                  '&:hover': { bgcolor: color.value },
                                }}
                              />
                            </Tooltip>
                          ))}
                        </Stack>
                        <TextField label="Quantity" type="number" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))} inputProps={{ min: 1 }} />
                        <Button variant="contained" size="large" startIcon={<ShoppingBagIcon />} onClick={addApparelToCart}>
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
        <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ fontWeight: 900 }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GraphicsGalleryPage;
