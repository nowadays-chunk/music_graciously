import React from 'react';

const PALETTES = [
  ['#ffc900', '#ff90e8', '#23a094', '#90a8ed', '#ff7051'],
  ['#23a094', '#fffdf5', '#ffc900', '#ff90e8', '#90a8ed'],
  ['#ff7051', '#90a8ed', '#fffdf5', '#ffc900', '#23a094'],
  ['#90a8ed', '#ffc900', '#ff7051', '#23a094', '#ff90e8'],
  ['#ff90e8', '#23a094', '#ffc900', '#fffdf5', '#ff7051'],
];

const hashString = (value = '') =>
  value.split('').reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 3), 0);

const splitTitle = (title = '') => {
  const words = String(title || 'Guitar Product').split(/\s+/).filter(Boolean);
  return [words.slice(0, 3).join(' ') || 'Guitar Product', words.slice(3, 6).join(' ')];
};

const titleCase = (value = '') => {
  const cleanValue = String(value || '').trim().toLowerCase();
  if (!cleanValue) return '';
  return cleanValue.charAt(0).toUpperCase() + cleanValue.slice(1);
};

const getProductKind = (product = {}) => {
  const source = `${product.category || ''} ${product.title || ''} ${product.id || ''}`.toLowerCase();
  return source.includes('bundle') ? 'Bundle' : 'Sheet';
};

const getMusicType = (product = {}, seed = 0) => {
  const explicit = titleCase(product.musicType || '');
  if (['Chord', 'Arpeggio', 'Scale'].includes(explicit)) return explicit;

  const source = `${product.title || ''} ${product.id || ''} ${product.category || ''}`.toLowerCase();
  if (source.includes('arppegio') || source.includes('arpeggio')) return 'Arpeggio';
  if (source.includes('chord')) return 'Chord';
  if (source.includes('scale')) return 'Scale';

  return ['Chord', 'Arpeggio', 'Scale'][seed % 3];
};

const getMusicKey = (product = {}) => {
  const explicit = String(product.musicKey || '').trim();
  if (explicit && explicit.toLowerCase() !== 'all') return explicit.replace(/sharp/gi, '#');

  const source = `${product.title || ''} ${product.id || ''}`
    .replace(/Csharp/gi, 'C#')
    .replace(/Dsharp/gi, 'D#')
    .replace(/Fsharp/gi, 'F#')
    .replace(/Gsharp/gi, 'G#')
    .replace(/Asharp/gi, 'A#');
  const match = source.match(/(^|[^A-Za-z])([A-G]#?)(?=[^A-Za-z#]|$)/);
  return match?.[2] || 'All';
};

const ProductArtwork = ({ product = {}, height = 220, compact = false, sx }) => {
  const instrument = product.instrument || 'guitar';
  const instrumentName = instrument.charAt(0).toUpperCase() + instrument.slice(1);
  const seedSource = String(product.slug || product.id || product.title || 'product');
  const seed = hashString(seedSource);
  const palette = PALETTES[seed % PALETTES.length];
  const [lineOne, lineTwo] = splitTitle(product.title);
  const kindLabel = getProductKind(product);
  const musicTypeLabel = getMusicType(product, seed);
  const keyLabel = getMusicKey(product);
  const kindFontSize = kindLabel.length > 5 ? 42 : 50;
  const musicTypeFontSize = musicTypeLabel.length > 7 ? 34 : 42;
  const keyFontSize = keyLabel.length > 2 ? 52 : 68;
  const rotation = (seed % 11) - 5;
  const fretYs = [108, 140, 172, 204];
  const fretXs = [128, 184, 240, 296];
  const dots = Array.from({ length: 5 }, (_, index) => ({
    cx: 128 + ((seed + index * 37) % 4) * 56,
    cy: 108 + ((seed + index * 19) % 4) * 32,
    fill: palette[(index + 2) % palette.length],
  }));
  const sparks = Array.from({ length: 7 }, (_, index) => ({
    x: 390 + ((seed + index * 23) % 150),
    y: 58 + ((seed + index * 31) % 168),
    r: 7 + ((seed + index) % 8),
    fill: palette[index % palette.length],
  }));

  const typeColor = musicTypeLabel === 'Chord' ? 'var(--brutal-pink)'
                  : musicTypeLabel === 'Scale' ? 'var(--brutal-yellow)'
                  : 'var(--brutal-blue)';
  const typeBg = musicTypeLabel === 'Chord' ? '#fff5fc'
                 : musicTypeLabel === 'Scale' ? '#fffdf0'
                 : '#f3f6ff';

  return (
    <svg
      viewBox="0 0 640 360"
      role="img"
      aria-label={`${product.title || 'Product'} illustration`}
      style={{
        display: 'block',
        width: '100%',
        height,
        maxWidth: '100%',
        ...sx,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer border card background */}
      <rect width="640" height="360" fill={typeColor} />
      <rect x="24" y="24" width="592" height="312" fill={typeBg} stroke="#111111" strokeWidth="10" />

      {/* Central Geometric Shape (Triangle for Scale, Circle for Chord, Square for Arpeggio) */}
      {musicTypeLabel === 'Chord' && (
        <g>
          <circle cx="210" cy="185" r="60" fill="var(--brutal-pink)" stroke="#111111" strokeWidth="10" />
          <circle cx="210" cy="185" r="30" fill="#fffdf5" stroke="#111111" strokeWidth="8" />
          <circle cx="275" cy="130" r="14" fill="var(--brutal-yellow)" stroke="#111111" strokeWidth="6" />
        </g>
      )}

      {musicTypeLabel === 'Scale' && (
        <g>
          <path d="M 210 115 L 145 245 L 275 245 Z" fill="var(--brutal-yellow)" stroke="#111111" strokeWidth="10" strokeLinejoin="round" />
          <path d="M 210 160 L 175 225 L 245 225 Z" fill="#fffdf5" stroke="#111111" strokeWidth="8" strokeLinejoin="round" />
          <circle cx="275" cy="130" r="14" fill="var(--brutal-pink)" stroke="#111111" strokeWidth="6" />
        </g>
      )}

      {musicTypeLabel === 'Arpeggio' && (
        <g>
          <rect x="150" y="125" width="120" height="120" rx="8" fill="var(--brutal-blue)" stroke="#111111" strokeWidth="10" />
          <rect x="180" y="155" width="60" height="60" rx="4" fill="#fffdf5" stroke="#111111" strokeWidth="8" />
          <circle cx="285" cy="130" r="14" fill="var(--brutal-mint)" stroke="#111111" strokeWidth="6" />
        </g>
      )}

      {/* Decorative clean line coordinates grid */}
      <line x1="80" y1="185" x2="115" y2="185" stroke="#111111" strokeWidth="8" strokeLinecap="round" />
      <line x1="305" y1="185" x2="340" y2="185" stroke="#111111" strokeWidth="8" strokeLinecap="round" />

      {!compact && (
        <>
          <rect x="56" y="184" width="278" height="54" fill="#fffdf5" stroke="#111111" strokeWidth="8" />
          <text x="78" y="216" fontFamily="var(--font-primary), Arial Black, Arial, sans-serif" fontSize="22" fill="#111111">
            {lineOne}
          </text>
          {lineTwo ? (
            <text x="78" y="234" fontFamily="var(--font-primary), Arial, sans-serif" fontWeight="900" fontSize="15" fill="#111111">
              {lineTwo}
            </text>
          ) : null}
        </>
      )}

      <g>
        {/* Top left Label (BUNDLE or SHEET) */}
        <rect x="38" y="32" width="252" height="82" fill={typeColor} stroke="#111111" strokeWidth="10" />
        <text x="164" y="88" textAnchor="middle" fontFamily="var(--font-primary), Arial Black, Arial, sans-serif" fontSize={kindFontSize} fill="#111111">
          {kindLabel}
        </text>

        {/* Top right Label (CHORD, SCALE, or ARPEGGIO) */}
        <rect x="318" y="32" width="284" height="82" fill="#fffdf5" stroke="#111111" strokeWidth="10" />
        <text x="460" y="88" textAnchor="middle" fontFamily="var(--font-primary), Arial Black, Arial, sans-serif" fontSize={musicTypeFontSize} fill="#111111">
          {musicTypeLabel}
        </text>

        {/* Key Box */}
        <rect x="402" y="126" width="190" height="104" fill={typeColor} stroke="#111111" strokeWidth="10" />
        <text x="497" y="196" textAnchor="middle" fontFamily="var(--font-primary), Arial Black, Arial, sans-serif" fontSize={keyFontSize} fill="#111111">
          {keyLabel}
        </text>
        <text x="497" y="218" textAnchor="middle" fontFamily="var(--font-primary), Arial, sans-serif" fontWeight="900" fontSize="17" fill="#111111">
          KEY
        </text>

        {/* Bottom System Label */}
        <rect x="42" y="254" width="552" height="70" fill="#fffdf5" stroke="#111111" strokeWidth="10" />
        <text x="318" y="301" textAnchor="middle" fontFamily="var(--font-primary), Arial Black, Arial, sans-serif" fontSize="34" fill="#111111">
          {instrumentName}
        </text>
      </g>
    </svg>
  );
};

export default ProductArtwork;
