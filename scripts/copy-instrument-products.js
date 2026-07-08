/**
 * copy-guitar-products.js
 * Copies instrument PDFs from screens/ → products/
 * Renames them to include instrument name: bundle-{instrument}-{Key}-{category}.pdf
 * Updates products.json IDs, titles, filePaths, and instrument details.
 */
const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '../screens');
const destDir = path.join(__dirname, '../products');
const productsJsonPath = path.join(__dirname, '../data/products.json');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

console.log(`Scanning screens directory: ${screensDir}`);
if (!fs.existsSync(screensDir)) {
    console.error(`Screens directory does not exist: ${screensDir}`);
    process.exit(1);
}

// Find all instrument directories (directories under screens/ that are not .temp)
const instruments = fs.readdirSync(screensDir).filter(f => {
    const fullPath = path.join(screensDir, f);
    return fs.statSync(fullPath).isDirectory() && f !== '.temp';
});

console.log(`Found instruments: ${instruments.join(', ')}`);

const categoryMap = {
    'scale': 'scales',
    'arpeggio': 'arppegios',
    'chord': 'chords'
};

const musicTypeMap = { 
    'scales': 'Scale', 
    'arppegios': 'Arpeggio', 
    'chords': 'Chord' 
};

// Load current products.json if it exists
let products = [];
if (fs.existsSync(productsJsonPath)) {
    try {
        products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
    } catch (e) {
        console.error(`Error parsing products.json: ${e.message}`);
    }
}

// Track copied files
const copiedCountMap = {};

instruments.forEach(instrument => {
    const srcDir = path.join(screensDir, instrument);
    const files = fs.readdirSync(srcDir);
    const pdfFiles = files.filter(f => f.endsWith('.pdf'));
    
    console.log(`\nScanning instrument directory: ${instrument} (${pdfFiles.length} PDF files)`);
    copiedCountMap[instrument] = 0;
    
    pdfFiles.forEach(file => {
        // Match: {instrument}_{key}_{category}_merged.pdf
        const regex = new RegExp(`^${instrument}_([A-Za-z#]+)_(scale|arpeggio|chord)_merged\\.pdf$`);
        const match = file.match(regex);
        if (match) {
            const keySlug = match[1];
            const category = match[2];
            const bundleCategory = categoryMap[category];
            
            const newDestName = `bundle-${instrument}-${keySlug}-${bundleCategory}.pdf`;
            const oldDestName = `bundle-${keySlug}-${bundleCategory}.pdf`; // backward compatibility
            
            const srcPath = path.join(srcDir, file);
            const newDestPath = path.join(destDir, newDestName);
            
            fs.copyFileSync(srcPath, newDestPath);
            copiedCountMap[instrument]++;
            console.log(`Copied: ${file} -> ${newDestName}`);
            
            // Remove old file if it exists to keep directory clean
            const oldDestPath = path.join(destDir, oldDestName);
            if (fs.existsSync(oldDestPath)) {
                fs.unlinkSync(oldDestPath);
                console.log(`Removed old file: ${oldDestName}`);
            }
            
            // Rebuild/generate product entry details
            const musicKey = keySlug.replace('sharp', '#');
            const musicType = musicTypeMap[bundleCategory];
            const instrumentName = instrument.charAt(0).toUpperCase() + instrument.slice(1);
            
            const productId = `bundle-${instrument}-${keySlug}-${bundleCategory}`;
            const title = `Bundle: All ${musicKey} ${musicType}s — ${instrumentName}`;
            const price = 10;
            const filePath = `products/bundle-${instrument}-${keySlug}-${bundleCategory}.pdf`;
            const categoryName = `${instrumentName} Sheets Bundles`;
            
            const image = bundleCategory === 'chords' ? '/assets/dummy_products/bundle_chords.png' :
                          bundleCategory === 'scales' ? '/assets/dummy_products/bundle_scales.png' : '/assets/dummy_products/bundle_arpeggios.png';
            
            const visualizationDetails = instrument === 'guitar' 
                ? '5-shape CAGED visualization, color-coded root/modal notes, and cited sibling correlations to help you master the fretboard with precision and speed.'
                : instrument === 'piano'
                ? 'keyboard visualization, color-coded notes, and cited sibling correlations to help you master the keyboard with precision and speed.'
                : 'visualization, color-coded notes, and cited sibling correlations to help you master the instrument with precision and speed.';

            const description = `Unlock the complete collection of ${musicType}s specifically for the key of ${musicKey} on the ${instrumentName}. Please be advised: this bundle is strictly limited to the key of ${musicKey} and does not include documentation for other keys. It is curated to provide specialized focus for players working within ${musicKey} tonality.\n\nThis digital product is delivered as a high-resolution PDF (2480 x 3508 pixels) optimized for both digital screens and high-quality printing. Your purchase is processed securely via Stripe, ensuring your payment data is never stored on our servers. Upon successful checkout, the PDF file will be sent directly to your provided email address for instant access.\n\nInside, you will find every individual ${musicType.toLowerCase()}s sheet authorized for this key. Each document features ${visualizationDetails}`;

            // Check if product already exists in products.json
            const existingIndex = products.findIndex(p => p.id === productId);
            const productData = {
                id: productId,
                title,
                price,
                type: 'Digital',
                category: categoryName,
                musicType,
                musicKey,
                image,
                description,
                filePath,
                instrument
            };
            
            if (existingIndex > -1) {
                // Update existing
                products[existingIndex] = productData;
            } else {
                // Add new
                products.push(productData);
            }
        } else {
            console.warn(`[${instrument}] Unmatched file skipped: ${file}`);
        }
    });
});

// Update products.json
console.log(`\nWriting updated products to ${productsJsonPath}`);
fs.writeFileSync(productsJsonPath, JSON.stringify(products, null, 4), 'utf8');

console.log(`\n✅ Copy completed:`);
Object.keys(copiedCountMap).forEach(inst => {
    console.log(`   - ${inst}: Copied ${copiedCountMap[inst]} files`);
});
console.log(`✅ Total products in products.json: ${products.length}`);
