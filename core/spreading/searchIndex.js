import guitar from '../../config/guitar';

const toSlug = (value) =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/#/g, 'sharp');

const toKeySlug = (value) => String(value).replace(/#/g, 'sharp');

const cleanName = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const buildKeywords = (...parts) =>
  parts
    .flat()
    .filter(Boolean)
    .map(cleanName)
    .join(' ')
    .toLowerCase();

const buildItem = ({ type, keyName, title, href, description, keywords, accessibility }) => ({
  id: `${type}-${keyName}-${title}-${href}`,
  type,
  key: keyName,
  label: title,
  href,
  description,
  keywords: buildKeywords(type, keyName, title, description, keywords),
  accessibility: accessibility || 5,
});

const INSTRUMENTS = [
  { id: 'guitar', name: 'Guitar', accessibility: 2 },
  { id: 'piano', name: 'Piano', accessibility: 2 },
  { id: 'ukulele', name: 'Ukulele', accessibility: 4 },
  { id: 'violin', name: 'Violin', accessibility: 4 },
  { id: 'bass', name: 'Bass', accessibility: 4 },
  { id: 'double-bass', name: 'Double Bass', accessibility: 4 },
  { id: 'trumpet', name: 'Trumpet', accessibility: 4 },
  { id: 'saxophone', name: 'Saxophone', accessibility: 4 }
];

const PROJECT_PAGES = [
  {
    type: 'Page',
    keyName: '',
    title: 'Home Page',
    href: '/',
    description: 'Go to the main landing page and dashboard.',
    accessibility: 1,
    keywords: 'home landing main index dashboard'
  },
  {
    type: 'Page',
    keyName: '',
    title: 'Interactive Instrument Player',
    href: '/play',
    description: 'Practice and visualize scales, chords, and arpeggios on multiple instruments.',
    accessibility: 1,
    keywords: 'play player practice visualizer keys fretboard scales chords arpeggios'
  },
  {
    type: 'Page',
    keyName: '',
    title: 'Guitar Sheets Store',
    href: '/books',
    description: 'Browse and purchase interactive sheets, books, and method studies.',
    accessibility: 1,
    keywords: 'store shop buy checkout books apparel clothes merch'
  },
  {
    type: 'Page',
    keyName: '',
    title: 'Compose Music (Tab Editor)',
    href: '/compose',
    description: 'Write, edit, and play back your own musical scores and tabs.',
    accessibility: 1,
    keywords: 'compose sheet editor write tab tabulature playback track notation'
  },
  {
    type: 'Page',
    keyName: '',
    title: 'Circle of Fifths',
    href: '/references/circle-of-fifths',
    description: 'Interactive Circle of Fifths tool for key signatures and relationships.',
    accessibility: 1,
    keywords: 'circle fifths keys signature harmony theory modulation'
  },
  {
    type: 'Page',
    keyName: '',
    title: 'Musician News Feed',
    href: '/news',
    description: 'Latest news, posts, updates and media from the music community.',
    accessibility: 3,
    keywords: 'news blog posts social media community update'
  },
  {
    type: 'Page',
    keyName: '',
    title: 'About Us',
    href: '/about',
    description: 'Learn about Guitar Sheets, our mission, and our features.',
    accessibility: 3,
    keywords: 'about info mission contact team faq'
  },
  {
    type: 'Page',
    keyName: '',
    title: 'Musical Matches Network Diagram',
    href: '/play/matches',
    description: 'Visualize relationships between scales, chords, and arpeggios.',
    accessibility: 3,
    keywords: 'matches network diagram chart graph relations harmony theory'
  },
  {
    type: 'Page',
    keyName: '',
    title: 'Music Analysis & Guides',
    href: '/articles',
    description: 'Educational articles, analysis, and guides on music theory.',
    accessibility: 3,
    keywords: 'articles guide learn tutorial analysis education'
  },
  {
    type: 'Page',
    keyName: '',
    title: 'Digital Audio Workstation (DAW) Integration',
    href: '/workstation',
    description: 'Integrate and sync with Audacity, MuseScore, ProTools, and iZotope RX.',
    accessibility: 6,
    keywords: 'workstation daw tools audacity musescore protools izotope sync audio'
  },
  {
    type: 'Page',
    keyName: '',
    title: 'Technical Implementations & Codebase',
    href: '/implementations',
    description: 'Review technical documentation, developer tools, and code implementations.',
    accessibility: 6,
    keywords: 'implementations docs dev documentation developers code API info'
  },
  {
    type: 'Page',
    keyName: '',
    title: 'References',
    href: '/references',
    description: 'Interactive databases and tabular views for musical data.',
    accessibility: 6,
    keywords: 'tables database data raw csv grid sheet export spreadsheet'
  },
  {
    type: 'Page',
    keyName: '',
    title: 'Contact Us',
    href: '/contact',
    description: 'Get in touch with the Guitar Sheets support and feedback team.',
    accessibility: 6,
    keywords: 'contact support help message email ticket feedback'
  }
];

export const buildSpreadingSearchIndex = () => {
  const keys = guitar.notes.sharps;
  const chordKeys = Object.keys(guitar.arppegios || {});
  const scaleKeys = Object.keys(guitar.scales || {});

  // 1. Build Project Pages
  const pageItems = PROJECT_PAGES.map((page) =>
    buildItem({
      type: page.type,
      keyName: page.keyName,
      title: page.title,
      href: page.href,
      description: page.description,
      keywords: [page.keywords],
      accessibility: page.accessibility,
    })
  );

  // 2. Build Instrument Practice Pages
  const instrumentPages = INSTRUMENTS.map((inst) =>
    buildItem({
      type: 'Instrument',
      keyName: '',
      title: `${inst.name} Practice Board`,
      href: `/play/${inst.id}`,
      description: `Interactive ${inst.name.toLowerCase()} visualizer for scales, chords, and arpeggios.`,
      keywords: [inst.id, inst.name, 'practice', 'visualizer', 'player', 'board'],
      accessibility: inst.accessibility,
    })
  );

  // 3. Build Scale, Chord, and Arpeggio items for each instrument
  const instrumentItems = INSTRUMENTS.flatMap((inst) => {
    return keys.flatMap((keyName) => {
      const keySlug = toKeySlug(keyName);

      const chords = chordKeys.map((chordKey) => {
        const chordName = guitar.arppegios[chordKey]?.name || chordKey;
        const chordSlug = toKeySlug(chordKey);
        return buildItem({
          type: 'Chord',
          keyName,
          title: `${keyName} ${chordName} chord (${inst.name})`,
          href: `/play/${inst.id}/${keySlug}/chord/${chordSlug}/notes`,
          description: `${inst.name} chord shapes and fingering for ${keyName} ${chordName}.`,
          keywords: [chordKey, chordName, `${keyName}${chordKey}`, 'harmony', inst.id, inst.name],
          accessibility: inst.accessibility === 2 ? 4 : 5,
        });
      });

      const arpeggios = chordKeys.map((arppegioKey) => {
        const arpName = guitar.arppegios[arppegioKey]?.name || arppegioKey;
        const arpSlug = toKeySlug(arppegioKey);
        return buildItem({
          type: 'Arpeggio',
          keyName,
          title: `${keyName} ${arpName} arpeggio (${inst.name})`,
          href: `/play/${inst.id}/${keySlug}/arpeggio/${arpSlug}/notes`,
          description: `${inst.name} arpeggio patterns and visualizer map for ${keyName} ${arpName}.`,
          keywords: [arppegioKey, arpName, `${keyName}${arppegioKey}`, 'arp', 'arpeggio', inst.id, inst.name],
          accessibility: inst.accessibility === 2 ? 4 : 5,
        });
      });

      const scales = scaleKeys.flatMap((scaleKey) => {
        const scale = guitar.scales[scaleKey] || {};
        const scaleName = scale.name || scaleKey;

        if (scale.isModal && Array.isArray(scale.modes)) {
          return scale.modes.map((mode) => {
            const modeName = cleanName(mode.name);
            return buildItem({
              type: 'Scale',
              keyName,
              title: `${keyName} ${modeName} (${inst.name})`,
              href: `/play/${inst.id}/${keySlug}/scale/${scaleKey}/notes/${toSlug(modeName)}`,
              description: `${scaleName} mode on ${inst.name.toLowerCase()} with all essential positions.`,
              keywords: [scaleKey, scaleName, modeName, `${keyName} ${scaleName}`, 'mode', inst.id, inst.name],
              accessibility: inst.accessibility === 2 ? 4 : 5,
            });
          });
        }

        return [
          buildItem({
            type: 'Scale',
            keyName,
            title: `${keyName} ${scaleName} (${inst.name})`,
            href: `/play/${inst.id}/${keySlug}/scale/${scaleKey}/notes`,
            description: `${scaleName} scale visualizer across the ${inst.name.toLowerCase()} layout.`,
            keywords: [scaleKey, scaleName, `${keyName} ${scaleName}`, inst.id, inst.name],
            accessibility: inst.accessibility === 2 ? 4 : 5,
          }),
        ];
      });

      return [...scales, ...chords, ...arpeggios];
    });
  });

  return [...pageItems, ...instrumentPages, ...instrumentItems];
};

export const SPREADING_SEARCH_INDEX = buildSpreadingSearchIndex();

export default SPREADING_SEARCH_INDEX;
