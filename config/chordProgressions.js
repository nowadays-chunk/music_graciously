const BASE_PROGRESSIONS = [
  ['I–V–vi–IV', ['I','V','vi','IV']],
  ['I–vi–IV–V', ['I','vi','IV','V']],
  ['vi–IV–I–V', ['vi','IV','I','V']],
  ['I–IV–V–I', ['I','IV','V','I']],
  ['ii–V–I', ['ii','V','I']],
  ['ii7–V7–Imaj7', ['ii7','V7','Imaj7']],
  ['Imaj7–vi7–ii7–V7', ['Imaj7','vi7','ii7','V7']],
  ['I–V–IV–I', ['I','V','IV','I']],
  ['I–iii–IV–iv', ['I','iii','IV','iv']],
  ['I–IV–iv–I', ['I','IV','iv','I']],
  ['I–bVII–IV–I', ['I','bVII','IV','I']],
  ['I–bIII–IV–I', ['I','bIII','IV','I']],
  ['I–III–IV–iv', ['I','III','IV','iv']],
  ['I–V/vi–vi–IV', ['I','V/vi','vi','IV']],
  ['I–VI7–ii7–V7', ['I','VI7','ii7','V7']],
  ['I–#Idim7–ii7–V7', ['I','#Idim7','ii7','V7']],
  ['I–IV–ii–V', ['I','IV','ii','V']],
  ['I–ii–IV–V', ['I','ii','IV','V']],
  ['I–iii–vi–IV', ['I','iii','vi','IV']],
  ['I–vi–ii–V', ['I','vi','ii','V']],
  ['I–V–ii–IV', ['I','V','ii','IV']],
  ['I–V–bVII–IV', ['I','V','bVII','IV']],
  ['I–bVII–bVI–V', ['I','bVII','bVI','V']],
  ['I–bVI–bVII–I', ['I','bVI','bVII','I']],
  ['I–IV–bVII–IV', ['I','IV','bVII','IV']],
  ['vi–ii–V–I', ['vi','ii','V','I']],
  ['iii–vi–ii–V', ['iii','vi','ii','V']],
  ['Imaj7–IVmaj7', ['Imaj7','IVmaj7']],
  ['Imaj7–iii7–IVmaj7–iv7', ['Imaj7','iii7','IVmaj7','iv7']],
  ['I6–ii7–V7–I6', ['I6','ii7','V7','I6']],
  ['I–V7/IV–IV–iv', ['I','V7/IV','IV','iv']],
  ['I–V7/V–V7–I', ['I','V7/V','V7','I']],
  ['I–III7–vi–IV', ['I','III7','vi','IV']],
  ['I–VII7–iii–VI7', ['I','VII7','iii','VI7']],
  ['I–III7–VI7–II7–V7', ['I','III7','VI7','II7','V7']],
  ['I–vi–ii–V7', ['I','vi','ii','V7']],
  ['I–vi7–ii7–V7', ['I','vi7','ii7','V7']],
  ['Imaj7–#I°7–ii7–#II°7', ['Imaj7','#I°7','ii7','#II°7']],
  ['I–IV–I–V', ['I','IV','I','V']],
  ['I–IV–I–IV', ['I','IV','I','IV']],
  ['I7–IV7–I7–V7', ['I7','IV7','I7','V7']],
  ['I7–IV7–I7–I7', ['I7','IV7','I7','I7']],
  ['IV7–IV7–I7–I7', ['IV7','IV7','I7','I7']],
  ['V7–IV7–I7–V7', ['V7','IV7','I7','V7']],
  ['i–bVII–bVI–V', ['i','bVII','bVI','V']],
  ['i–iv–V–i', ['i','iv','V','i']],
  ['i–VI–III–VII', ['i','VI','III','VII']],
  ['i–VII–VI–VII', ['i','VII','VI','VII']],
  ['i–iv–VII–III', ['i','iv','VII','III']],
  ['i–VI–iv–V', ['i','VI','iv','V']],
  ['i–v–VI–IV', ['i','v','VI','IV']],
  ['i–III–VII–VI', ['i','III','VII','VI']],
  ['i–bIII–bVII–IV', ['i','bIII','bVII','IV']],
  ['i7–iv7–bVII7–bIIImaj7', ['i7','iv7','bVII7','bIIImaj7']],
  ['i7–iiø7–V7–i', ['i7','iiø7','V7','i']],
  ['iiø7–V7–i', ['iiø7','V7','i']],
  ['i–ii°–V–i', ['i','ii°','V','i']],
  ['i–iv–iiø7–V7', ['i','iv','iiø7','V7']],
  ['i–VImaj7–iiø7–V7', ['i','VImaj7','iiø7','V7']],
  ['i–bIImaj7–V7–i', ['i','bIImaj7','V7','i']],
  ['i–V7/iv–iv–V7', ['i','V7/iv','iv','V7']],
  ['i–III7–VImaj7–iiø7', ['i','III7','VImaj7','iiø7']],
  ['i–VI–iiø7–V7', ['i','VI','iiø7','V7']],
  ['i–iv–VI–V', ['i','iv','VI','V']],
  ['i–bVII–bVI–bVII', ['i','bVII','bVI','bVII']],
  ['i–bVI–bIII–bVII', ['i','bVI','bIII','bVII']],
  ['i–V–VI–iv', ['i','V','VI','iv']],
  ['i–VII–III–VI', ['i','VII','III','VI']],
  ['i–VI–VII–i', ['i','VI','VII','i']],
  ['i–iv–i–V', ['i','iv','i','V']],
  ['i–iv–i–iv', ['i','iv','i','iv']],
  ['i7–iv7–i7–V7', ['i7','iv7','i7','V7']],
  ['i7–iv7–i7–i7', ['i7','iv7','i7','i7']],
  ['iv7–iv7–i7–i7', ['iv7','iv7','i7','i7']],
  ['V7–iv7–i7–V7', ['V7','iv7','i7','V7']],
  ['Imaj7–VI7–ii7–V7', ['Imaj7','VI7','ii7','V7']],
  ['iii7–VI7–ii7–V7', ['iii7','VI7','ii7','V7']],
  ['Imaj7–#I°7–ii7–V7', ['Imaj7','#I°7','ii7','V7']],
  ['Imaj7–iv7–bVII7–Imaj7', ['Imaj7','iv7','bVII7','Imaj7']],
  ['Imaj7–bIII7–bVImaj7–bII7', ['Imaj7','bIII7','bVImaj7','bII7']],
  ['Imaj7–II7–ii7–V7', ['Imaj7','II7','ii7','V7']],
  ['Imaj7–VII7–iii7–VI7', ['Imaj7','VII7','iii7','VI7']],
  ['Imaj7–III7–vi7–II7', ['Imaj7','III7','vi7','II7']],
  ['Imaj7–vi7–ii7–V7', ['Imaj7','vi7','ii7','V7']],
  ['Imaj7–ii7–iii7–IVmaj7', ['Imaj7','ii7','iii7','IVmaj7']],
  ['IVmaj7–iii7–ii7–Imaj7', ['IVmaj7','iii7','ii7','Imaj7']],
  ['Imaj7–V7/ii–ii7–V7', ['Imaj7','V7/ii','ii7','V7']],
  ['Imaj7–V7/vi–vi7–ii7', ['Imaj7','V7/vi','vi7','ii7']],
  ['Imaj7–III7–vi7–IVmaj7', ['Imaj7','III7','vi7','IVmaj7']],
  ['Imaj7–bVII7–IVmaj7–iv7', ['Imaj7','bVII7','IVmaj7','iv7']],
  ['i7–bVImaj7–iiø7–V7', ['i7','bVImaj7','iiø7','V7']],
  ['i7–bIIImaj7–bVImaj7–V7', ['i7','bIIImaj7','bVImaj7','V7']],
  ['i7–iv7–bVII7–bIIImaj7', ['i7','iv7','bVII7','bIIImaj7']],
  ['i7–iiø7–V7–iMaj7', ['i7','iiø7','V7','iMaj7']],
  ['iMaj7–iv7–iiø7–V7', ['iMaj7','iv7','iiø7','V7']],
  ['i–bII7–i–V7', ['i','bII7','i','V7']],
  ['i–#ivø7–VII7–IIImaj7', ['i','#ivø7','VII7','IIImaj7']],
  ['i–VI7–iiø7–V7', ['i','VI7','iiø7','V7']],
  ['i–iv7–V7alt–i', ['i','iv7','V7alt','i']],
  ['i–iiø7–V7b9–i', ['i','iiø7','V7b9','i']]
];

const DEGREE_TO_SEMITONES = { I:0, II:2, III:4, IV:5, V:7, VI:9, VII:11 };
const QUALITY_SUFFIX = {
  '': 'M', m: 'min', maj7: 'M7', '7': '7', m7: 'min7', '6': '6',
  '°': 'dim', '°7': 'dim7', 'ø7': 'min7b5', m7b5: 'min7b5',
  b9: '7b9', alt: '7#5', mMaj7: 'minMaj7', Maj7: 'M7'
};

function parseRomanToken(token) {
  const slashParts = token.split('/');
  const main = slashParts[0];
  const accidental = main.match(/^[b#]+/)?.[0] || '';
  const roman = main.match(/[ivIV]+/)?.[0] || 'I';
  const suffix = main.slice(accidental.length + roman.length);
  const upperRoman = roman.toUpperCase();
  let semitones = DEGREE_TO_SEMITONES[upperRoman] ?? 0;
  for (const char of accidental) semitones += char === 'b' ? -1 : 1;
  semitones = (semitones + 12) % 12;
  const isMinor = roman === roman.toLowerCase();
  let quality = QUALITY_SUFFIX[suffix];
  if (!quality) {
    if (suffix.startsWith('maj7')) quality = 'M7';
    else if (suffix.startsWith('Maj7')) quality = 'M7';
    else if (suffix.startsWith('m7')) quality = suffix.includes('b5') ? 'min7b5' : 'min7';
    else if (suffix.startsWith('7')) quality = suffix.includes('b9') ? '7b9' : suffix.includes('alt') ? '7#5' : '7';
    else if (suffix.includes('ø')) quality = 'min7b5';
    else if (suffix.includes('°7')) quality = 'dim7';
    else if (suffix.includes('°')) quality = 'dim';
    else if (suffix.includes('6')) quality = '6';
    else quality = isMinor ? 'min' : 'M';
  }
  return { semitones, quality, roman: token };
}

export const CHORD_PROGRESSIONS = BASE_PROGRESSIONS.map(([name, numerals], index) => ({
  id: `progression-${index + 1}`,
  name,
  numerals,
  chords: numerals.map(parseRomanToken),
}));

export function progressionInKey(progression, keyIndex, getNoteName, preferFlats) {
  return progression.chords.map((chord) => ({
    ...chord,
    rootIndex: (keyIndex + chord.semitones) % 12,
    label: `${getNoteName((keyIndex + chord.semitones) % 12, preferFlats)}${chord.quality === 'M' ? '' : chord.quality}`,
  }));
}
