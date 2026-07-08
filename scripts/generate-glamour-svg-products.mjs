import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const rootDir = process.cwd();
const assetDir = path.join(rootDir, 'private-assets', 'glamour-svg');
const dataPath = path.join(rootDir, 'data', 'glamourSvgProducts.json');

const colors = [
  ['#ff4fa3', '#ffd84d', '#4ee6b8', '#55a7ff', '#ff8a3d', '#fff8e8', '#151515'],
  ['#ff8a3d', '#ffd84d', '#ff4fa3', '#55a7ff', '#4ee6b8', '#fff8e8', '#151515'],
  ['#55a7ff', '#ff4fa3', '#4ee6b8', '#ffd84d', '#ff8a3d', '#fff8e8', '#151515'],
  ['#4ee6b8', '#ffd84d', '#55a7ff', '#ff8a3d', '#ff4fa3', '#fff8e8', '#151515'],
  ['#d7b6ff', '#ffe45c', '#38d9a9', '#ff6b6b', '#4dabf7', '#fffaf0', '#151515'],
  ['#f72585', '#f9c74f', '#90be6d', '#577590', '#f8961e', '#fff8e8', '#151515'],
];

const designs = [
  ['neon-pick-cascade', 'Neon Pick Cascade', 'PICK FAST, TIP WELL', 'Guitar picks, falling notes, stage gloss', 'pick'],
  ['violin-vibrato-runway', 'Violin Vibrato Runway', 'VIBRATO HAS DRAMA', 'Violin, bow, elegant sustain', 'violin'],
  ['amp-stack-confessions', 'Amp Stack Confessions', 'MY AMP HAS OPINIONS', 'Amplifiers, knobs, thunderous tone', 'amp'],
  ['crowd-surf-cadence', 'Crowd Surf Cadence', 'DROP THE V, RESOLVE TO I', 'Festival crowd, cadence theory', 'crowd'],
  ['circle-fifths-afterparty', 'Circle Fifths Afterparty', 'I LEFT BY THE BACKDOOR DOMINANT', 'Circle of fifths, jazz motion', 'fifths'],
  ['minor-seventh-mood', 'Minor Seventh Mood', 'TOO COOL FOR TRIADS', 'm7 harmony, lounge sparkle', 'chord'],
  ['lydian-lipstick-solo', 'Lydian Lipstick Solo', 'RAISE THE FOUR, RAISE THE ROOF', 'Lydian mode, guitar solo', 'guitar'],
  ['metronome-diva', 'Metronome Diva', 'I AM NOT RUSHING, I AM EARLY', 'Metronome, tempo jokes', 'metronome'],
  ['syncopation-stiletto', 'Syncopation Stiletto', 'I ACCENT OFFBEATS FOR SPORT', 'Rhythm, offbeat accents', 'wave'],
  ['bass-clef-bouncer', 'Bass Clef Bouncer', 'LOW END, HIGH STANDARDS', 'Bass clef, club security', 'bass'],
  ['tuning-fork-glam', 'Tuning Fork Glam', 'A440 AND FABULOUS', 'Tuning fork, pitch standard', 'fork'],
  ['dominant-seventh-drama', 'Dominant Seventh Drama', 'UNRESOLVED BUT WELL DRESSED', 'Dominant 7, harmonic tension', 'chord'],
  ['pedalboard-paradise', 'Pedalboard Paradise', 'TRUE BYPASS, FALSE MODESTY', 'Effects pedals, signal chain', 'pedals'],
  ['vinyl-mode-orbit', 'Vinyl Mode Orbit', 'SPIN ME MIXOLYDIAN', 'Record, modal groove', 'record'],
  ['piano-roll-glitter', 'Piano Roll Glitter', 'QUANTIZE MY FEELINGS', 'Piano roll, DAW humor', 'keys'],
  ['arpeggio-catwalk', 'Arpeggio Catwalk', 'ONE NOTE AT A TIME, DARLING', 'Arpeggios, runway pose', 'bars'],
  ['jazz-hands-voicing', 'Jazz Hands Voicing', 'ADD9, ADD COFFEE', 'Jazz voicings, stylish quote', 'hands'],
  ['backstage-rosette', 'Backstage Rosette', 'SOUNDHOLE BUT MAKE IT COUTURE', 'Acoustic rosette, strings', 'rosette'],
  ['stratocaster-spotlight', 'Stratocaster Spotlight', 'SINGLE COIL, DOUBLE TROUBLE', 'Electric guitar, spotlight', 'guitar'],
  ['viola-clef-vogue', 'Viola Clef Vogue', 'ALTO CLEF ENTERED THE CHAT', 'Viola, alto clef knowledge', 'violin'],
  ['quartal-harmony-club', 'Quartal Harmony Club', 'STACK FOURTHS, NOT EXCUSES', 'Quartal harmony, club lights', 'chord'],
  ['tritone-tease', 'Tritone Tease', 'I WAS BANNED IN THEORY CLASS', 'Tritone, music theory joke', 'fifths'],
  ['practice-room-paparazzi', 'Practice Room Paparazzi', 'SCALES BEFORE SCANDALS', 'Practice routine, flash bulbs', 'fret'],
  ['festival-pick-shower', 'Festival Pick Shower', 'FREE PICKS, EXPENSIVE TONE', 'Crowd, flying guitar picks', 'pick'],
  ['tube-amp-tantrum', 'Tube Amp Tantrum', 'WARM TONE, HOT TEMPER', 'Tube amp, stage heat', 'amp'],
  ['chorus-pedal-charm', 'Chorus Pedal Charm', 'I DUPLICATE MYSELF FOR WIDTH', 'Chorus pedal, modulation', 'pedals'],
  ['dorian-after-dark', 'Dorian After Dark', 'MINOR, BUT MAKE IT FUNKY', 'Dorian mode, funk theory', 'bass'],
  ['phrygian-red-carpet', 'Phrygian Red Carpet', 'HALF STEP TO THE DRAMA', 'Phrygian mode, red carpet', 'keys'],
  ['mixolydian-mirrorball', 'Mixolydian Mirrorball', 'FLAT SEVEN, SHARP OUTFIT', 'Mixolydian mode, disco', 'record'],
  ['locrian-luxury-warning', 'Locrian Luxury Warning', 'UNSTABLE AND EXPENSIVE', 'Locrian mode, diminished flavor', 'fifths'],
  ['violin-bow-boss', 'Violin Bow Boss', 'DOWNBOW, UPSTAGE', 'Violin bowing, stage attitude', 'violin'],
  ['crowd-call-response', 'Crowd Call Response', 'YOU SAY IV, I SAY V', 'Audience, call and response', 'crowd'],
  ['amp-knob-gossip', 'Amp Knob Gossip', 'GAIN TOLD TREBLE EVERYTHING', 'Amp controls, funny quote', 'amp'],
  ['guitar-pick-orbit', 'Guitar Pick Orbit', 'GRAVITY LOVES A GOOD RIFF', 'Orbiting picks, riff energy', 'pick'],
  ['counterpoint-couture', 'Counterpoint Couture', 'INDEPENDENT LINES, DEPENDENT EGO', 'Counterpoint, stylish theory', 'wave'],
  ['voice-leading-velvet', 'Voice Leading Velvet', 'SMOOTH MOVES ONLY', 'Voice leading, chord motion', 'chord'],
  ['cadence-champagne', 'Cadence Champagne', 'AUTHENTIC CADENCE, QUESTIONABLE CHOICES', 'Perfect cadence humor', 'fifths'],
  ['fretboard-flashbulbs', 'Fretboard Flashbulbs', 'KNOW THE NECK, OWN THE ROOM', 'Fretboard mastery, camera flashes', 'fret'],
  ['pickup-selector-party', 'Pickup Selector Party', 'BRIDGE FOR BITE, NECK FOR CHARM', 'Guitar pickup knowledge', 'guitar'],
  ['grand-staff-glitter', 'Grand Staff Glitter', 'TREBLE BRINGS TEA, BASS BRINGS TRUTH', 'Grand staff, clefs', 'keys'],
  ['interval-influencer', 'Interval Influencer', 'MAJOR THIRD ENERGY', 'Intervals, influencer quote', 'bars'],
  ['harmonics-halo', 'Harmonics Halo', 'TOUCH LIGHTLY, SHINE LOUDLY', 'Natural harmonics, guitar technique', 'guitar'],
  ['drum-fill-drama', 'Drum Fill Drama', 'ONE MORE FILL, THEN I PROMISE', 'Drums, band humor', 'crowd'],
  ['studio-monitor-mystique', 'Studio Monitor Mystique', 'FLAT RESPONSE, FANCY SHOES', 'Studio monitors, mixing knowledge', 'amp'],
  ['bowed-string-boulevard', 'Bowed String Boulevard', 'SUSTAIN IS A LIFESTYLE', 'Bowed strings, violin elegance', 'violin'],
  ['altered-scale-attitude', 'Altered Scale Attitude', 'ALL TENSIONS, NO APOLOGY', 'Altered scale, jazz theory', 'fifths'],
  ['pickup-hum-pageant', 'Pickup Hum Pageant', 'SINGLE COIL SERENADE', 'Pickup hum, electric guitar', 'guitar'],
  ['setlist-sparkle', 'Setlist Sparkle', 'ENCORE IN E MINOR', 'Setlist, stage music', 'crowd'],
  ['practice-tempo-princess', 'Practice Tempo Princess', 'SLOW IS SMOOTH, SMOOTH IS FAST', 'Practice wisdom, tempo', 'metronome'],
  ['finale-fret-fanfare', 'Finale Fret Fanfare', 'CAGED AND DANGEROUS', 'Guitar theory finale', 'fret'],
  ['hendrix-excuse-me', 'Hendrix Excuse Me', 'EXCUSE ME WHILE I KISS THE SKY', 'Jimi Hendrix style afro and guitar solo', 'hendrix'],
  ['joplin-compromise', 'Joplin Compromise', "DON'T COMPROMISE YOURSELF, YOU'RE ALL YOU'VE GOT", 'Janis Joplin style feather boa and vintage mic', 'joplin'],
  ['beatles-love', 'Beatles Love', 'ALL YOU NEED IS LOVE AND MELODY', 'The iconic four-man mop-top silhouette walking', 'beatles'],
  ['scorpions-storm', 'Scorpions Storm', 'WIND OF CHANGE, CHORD OF STORM', 'Stylized scorpion tail coiled around a guitar V-body', 'scorpions'],
  ['mercury-legend', 'Mercury Legend', 'I WILL NOT BE A STAR, I WILL BE A LEGEND', 'Freddie Mercury style microphone stand performance', 'mic'],
  ['beethoven-passion', 'Beethoven Passion', 'TO PLAY WITHOUT PASSION IS INEXCUSABLE', 'Classic piano player hands flying on keys', 'piano'],
  ['zeppelin-song', 'Zeppelin Song', 'THE SONG REMAINS THE SAME', 'Vintage double-neck guitar outline under the lights', 'guitar'],
  ['pink-floyd-scale', 'Pink Floyd Scale', 'ANOTHER BRICK IN THE CHROMATIC SCALE', 'Music score beams forming a prism shape', 'score'],
  ['marley-hits', 'Marley Hits', 'WHEN IT HITS YOU, YOU FEEL NO PAIN', 'Reggae style electric bass and soundwaves', 'bass'],
  ['watt-is-up-amp', 'Watt Is Up Amp', "WATT'S UP: MY AMP GOES TO ELEVEN", 'Amplifier stack cranked to maximum volume', 'amp'],
  ['cable-chaos-pit', 'Cable Chaos Pit', 'CABLE CHAOS: THE SNAKE PIT AWAITS', 'Coiled stage cables and jack connectors', 'cables'],
  ['console-warmth-fader', 'Console Warmth Fader', 'COFFEE, CABLES, AND CONSOLE WARMTH', 'Mixing console channel strips and faders', 'mixer'],
  ['compressor-dynamics-squeeze', 'Compressor Dynamics Squeeze', 'SQUEEZING THE LIFE OUT OF DYNAMICS', 'Console VU meters and threshold knobs', 'mixer'],
  ['metronome-honest-friend', 'Metronome Honest Friend', 'METRONOME IS MY ONLY HONEST FRIEND', 'Classic pyramid wood metronome ticking', 'metronome'],
  ['vocalist-reverb-serenade', 'Vocalist Reverb Serenade', 'VOCALISTS: 90% REVERB, 10% LYRICS', 'Studio microphone with a pop filter shield', 'mic'],
  ['stage-crew-shadows', 'Stage Crew Shadows', 'WE WEAR BLACK AND RUN THE WORLD', 'Stage crew cables and backstage rig', 'cables'],
  ['roadie-lift-power', 'Roadie Lift Power', 'I LIFT THINGS AND DISAGREE WITH SOUND', 'Heavy duty road case and tuning fork', 'fork'],
  ['banned-notes-theory', 'Banned Notes Theory', 'I ONLY PLAY NOTES THAT ARE BANNED', 'Music score with notes drifting off the page', 'score'],
  ['auto-tune-secrets', 'Auto Tune Secrets', 'AUTO-TUNE: THE SECTOR OF MY SECRETS', 'Digital sound waves and pitch tuner lines', 'wave'],
  ['headphones-audio-pulse', 'Headphones Audio Pulse', 'FREQUENCY IS REALITY, TIMBRE IS SOUL', 'Over-ear studio monitor headphones pulsing', 'headphones'],
  ['drums-time-keepers', 'Drums Time Keepers', 'DRUMMERS: KEEPING TIME, LOSING MINDS', 'Crossed drumsticks on a vintage snare drum', 'drums'],
  ['unexpected-note-path', 'Unexpected Note Path', 'THE UNEXPECTED NOTE IS THE PATH TO GENIUS', 'Music score staff lines with ascending notes', 'score'],
  ['frequency-reality-timbre', 'Frequency Reality Timbre', 'IN THE SPECTRUM OF HARMONY, MATH BECOMES ART', 'Audio headphones surrounded by frequency scales', 'headphones'],
  ['console-mixer-master', 'Console Mixer Master', 'THE BEST MIXES ARE FELT, NOT JUST HEARD', 'Studio console mixing faders in peak alignment', 'mixer'],
  ['improv-composers-adlib', 'Improv Composers AdLib', 'IMPROVISATION IS AD-LIB COMPOSITION', 'Stylized grand piano keyboard in wave shape', 'piano'],
  ['space-of-wisdom-rest', 'Space of Wisdom Rest', 'BETWEEN THE NOTES LIES THE SPACE OF WISDOM', 'Elegant music score partition showing a rest note', 'score'],
  ['acoustics-reflection-sound', 'Acoustics Reflection Sound', 'THE ACOUSTICS OF LIFE REFLECT YOUR SOUL', 'Vocalist microphone reflecting wave circles', 'mic'],
  ['phase-cancellation-alignment', 'Phase Cancellation Alignment', 'PHASE CANCELLATION: CHOOSE YOUR ALIGNMENT', 'Coiled patch cables in phase alignment shape', 'cables'],
  ['echoes-and-futures', 'Echoes and Futures', 'ECHOES OF THE PAST, SOUNDS OF THE FUTURE', 'Retro vinyl record spinning in orbit rings', 'record'],
  ['riff-loud-defy', 'Riff Loud Defy', 'RIFF LOUD, DEFY THE SILENCE', 'Electric guitar silhouette emitting sonic rings', 'guitar'],
  ['stagelights-soul-remain', 'Stagelights Soul Remain', 'STAGELIGHTS FADE, SOULS REMAIN UNBOWED', 'Retro stage mic under neon spotlight rays', 'mic'],
  ['play-last-note', 'Play Last Note', 'PLAY EACH NOTE AS IF IT IS YOUR LAST', 'Beautiful music score with intense chord markings', 'score'],
  ['wood-and-steel-heart', 'Wood and Steel Heart', 'WOOD AND STEEL, HEART AND SOUL', 'Acoustic guitar rosette and neck detail', 'guitar'],
  ['no-pedal-passion', 'No Pedal Passion', 'NO PEDAL CAN COMPENSATE FOR PASSION', 'Stompbox effect pedals lined up with cables', 'pedals'],
  ['crank-the-amp', 'Crank the Amp', 'CRANK THE AMP, BREAK THE BARRIERS', 'Warm tube amp glowing under massive power', 'amp'],
  ['born-in-studio', 'Born in Studio', 'BORN IN THE STUDIO, MADE ON THE STAGE', 'Faders and microphone merged in stage glow', 'mixer'],
  ['fearless-improv-session', 'Fearless Improv Session', 'FEARLESS IMPROV, UNTAMED EXPRESSION', 'Piano keys winding into an abstract vortex', 'piano'],
  ['voice-ultimate-instrument', 'Voice Ultimate Instrument', 'YOUR VOICE IS THE ULTIMATE INSTRUMENT', 'Glamorous stage microphone surrounded by sparkles', 'mic'],
  ['rock-pit-light', 'Rock Pit Light', 'IN THE PIT OF ROCK, WE FIND LIGHT', 'Crowd surf silhouette under neon stage beams', 'crowd'],
  ['beyond-the-frets', 'Beyond the Frets', 'BEYOND THE FRETS, BEYOND THE FEAR', 'Fretboard and fret markers shining under lights', 'fret'],
  ['unleash-tone-heal', 'Unleash Tone Heal', 'UNLEASH THE TONE, HEAL THE WORLD', 'Stratocaster guitar neck emerging from waves', 'guitar'],
  ['stand-tall-strum', 'Stand Tall Strum', 'STAND TALL, STRUM LOUD', 'Acoustic dreadnought body with bold strings', 'guitar'],
  ['record-the-sparks', 'Record the Sparks', 'RECORD THE SPARKS, IGNITE THE FLAME', 'Vintage vinyl record throwing fire sparks', 'record'],
  ['stage-fright-gain', 'Stage Fright Gain', 'STAGE FRIGHT? JUST TURN UP THE GAIN', 'Guitar amplifier controls and input jacks', 'amp'],
  ['cable-chaos-snake-pit', 'Cable Chaos Snake Pit', 'I HAVE 99 CABLES AND NO 1/4 INCH ADAPTER', 'XLR and instrument patch cables tangled up', 'cables'],
  ['i-can-hear-feedback', 'I Can Hear Feedback', 'I CAN HEAR EVERY 60HZ HUM IN YOUR SOUL', 'Amplifier knobs and pickup selector switches', 'amp'],
  ['turn-me-up-monitor', 'Turn Me Up Monitor', 'TURN ME UP IN THE MONITOR', 'Retro microphone in front of feedback waves', 'mic'],
  ['jazz-police-chords', 'Jazz Police Chords', 'JAZZ POLICE: CHORDS ARE TOO CORRECT', 'Acoustic guitar neck with complex chord dots', 'guitar'],
  ['console-mixer-fader-pro', 'Console Mixer Fader Pro', 'WE WILL FIX IT IN THE MIX', 'Mixing faders at maximum height settings', 'mixer'],
  ['ultimate-cadence-courage', 'Ultimate Cadence Courage', 'AUTHENTIC CADENCE, LEGENDS NEVER DROWN', 'Circle of fifths scale and compass star', 'fifths'],
  ['elvis-presley-king', 'Elvis Presley King', 'BEFORE ELVIS, THERE WAS NOTHING', 'Pompadour hair and high collar outline', 'portrait_elvis'],
  ['michael-jackson-pop', 'Michael Jackson Pop', 'LIES RUN SPRINTS, BUT TRUTH RUNS MARATHONS', 'Fedora hat and aviator glasses silhouette', 'portrait_jackson'],
  ['david-bowie-aladdin', 'David Bowie Aladdin', 'I DONT KNOW WHERE I AM GOING, BUT I PROMISE IT WONT BE BORING', 'Lightning bolt painted over face outline', 'portrait_bowie'],
  ['freddie-mercury-showman', 'Freddie Mercury Showman', 'I WILL NOT BE A STAR, I WILL BE A LEGEND', 'Slick hair and iconic mustache performance shape', 'portrait_mercury'],
  ['bob-dylan-folk', 'Bob Dylan Folk', 'BEING BORN IS LIKE BEING AN ACCIDENT', 'Curly hair and harmonica holder silhouette', 'portrait_dylan'],
  ['john-lennon-peace', 'John Lennon Peace', 'IMAGINE ALL THE PEOPLE LIVING LIFE IN PEACE', 'Iconic round glasses and parted hair outline', 'portrait_lennon'],
  ['paul-mccartney-beatle', 'Paul McCartney Beatle', 'YESTERDAY, ALL MY TROUBLES SEEMED SO FAR AWAY', 'Classic mop-top hair and Hofner bass body', 'portrait_mccartney'],
  ['kurt-cobain-grunge', 'Kurt Cobain Grunge', 'WANTING TO BE SOMEONE ELSE IS A WASTE OF WHO YOU ARE', 'Messy long hair and oval grunge sunglasses', 'portrait_cobain'],
  ['amy-winehouse-soul', 'Amy Winehouse Soul', 'LIFE IS SHORT, LIFE IS VALUABLE, DO YOUR THING', 'Beehive hair and winged eyeliner makeup silhouette', 'portrait_winehouse'],
  ['aretha-franklin-respect', 'Aretha Franklin Respect', 'R-E-S-P-E-C-T, FIND OUT WHAT IT MEANS TO ME', 'High tiara and classic vocal hair profile', 'portrait_aretha'],
  ['stevie-wonder-keynote', 'Stevie Wonder Keynote', 'JUST BECAUSE A MAN LACKS EYESIGHT DOESNT MEAN HE LACKS VISION', 'Braids outline and signature dark glasses', 'portrait_wonder'],
  ['ray-charles-blues', 'Ray Charles Blues', 'MUSIC IS A NECESSITY, AFTER FOOD, AIR, AND WATER', 'Happy keyboard smile and dark Wayfarer shades', 'portrait_ray'],
  ['louis-armstrong-satchmo', 'Louis Armstrong Satchmo', 'WHAT A WONDERFUL WORLD', 'Puffed cheeks and jazz trumpet nozzle', 'portrait_armstrong'],
  ['miles-davis-jazz', 'Miles Davis Jazz', 'DON’T PLAY WHAT’S THERE, PLAY WHAT’S NOT THERE', 'Trumpet pointing down and sunglasses silhouette', 'portrait_miles'],
  ['ella-fitzgerald-queen', 'Ella Fitzgerald Queen', 'IT IS NOT WHERE YOU COME FROM, IT’S WHERE YOU ARE GOING', 'Glamorous high hair bun and pearl necklace', 'portrait_ella'],
  ['billie-holiday-gardenia', 'Billie Holiday Gardenia', 'NO TWO SINGERS EVER SANG THE SAME SONG TWICE', 'Gardenia flower in parted hair profile', 'portrait_billie'],
  ['nina-simone-priestess', 'Nina Simone Priestess', 'I’LL TELL YOU WHAT FREEDOM IS TO ME: NO FEAR', 'High turban headwrap and hoop earrings', 'portrait_nina'],
  ['dolly-parton-country', 'Dolly Parton Country', 'IF YOU WANT THE RAINBOW, YOU HAVE TO PUT UP WITH THE RAIN', 'Super voluminous country curls and eyelashes', 'portrait_dolly'],
  ['johnny-cash-rebel', 'Johnny Cash Rebel', 'I WEAR THE BLACK FOR THE POOR AND THE BEATEN DOWN', 'Cowboy hat and acoustic guitar neck backdrop', 'portrait_cash'],
  ['willie-nelson-outlaw', 'Willie Nelson Outlaw', 'ON THE ROAD AGAIN', 'Outlaw bandana and long hanging braided ropes', 'portrait_willie'],
  ['bob-marley-freedom', 'Bob Marley Freedom', 'EMANCIPATE YOURSELVES FROM MENTAL SLAVERY', 'Thick dreadlocks silhouette with Rasta bandana', 'portrait_marley'],
  ['mick-jagger-lips', 'Mick Jagger Lips', 'YOU CAN’T ALWAYS GET WHAT YOU WANT', 'Famous big lips open and shaggy hair outline', 'portrait_jagger'],
  ['keith-richards-stone', 'Keith Richards Stone', 'I’VE NEVER HAD A PROBLEM WITH DRUGS, ONLY POLICE', 'Messy rock hair and signature head bandana', 'portrait_keith'],
  ['bruce-springsteen-boss', 'Bruce Springsteen Boss', 'BORN IN THE U.S.A.', 'Swept hair and denim collar with guitar strap', 'portrait_springsteen'],
  ['elton-john-star', 'Elton John Star', 'SAD SONGS SAY SO MUCH', 'Extravagant star-shaped glasses and hair silhouette', 'portrait_elton'],
  ['billy-joel-pianoman', 'Billy Joel PianoMan', 'SING US A SONG, YOU’RE THE PIANO MAN', 'Short hair, goatee beard, and classic piano glasses', 'portrait_joel'],
  ['mozart-classic', 'Mozart Classic', 'THE MUSIC IS NOT IN THE NOTES, BUT IN THE SILENCE BETWEEN', 'Powdered wig and ribbon tie silhouette', 'portrait_mozart'],
  ['beethoven-storm', 'Beethoven Storm', 'MUSIC SHOULD STRIKE FIRE FROM THE HEART OF MAN', 'Wind-blown wild hair and red neck scarf profile', 'portrait_beethoven'],
  ['bach-baroque', 'Bach Baroque', 'WHERE THERE IS DEVOTIONAL MUSIC, GOD IS ALWAYS AT HAND', 'Heavy curled baroque wig contour', 'portrait_bach'],
  ['chopin-nocturne', 'Chopin Nocturne', 'SIMPLICITY IS THE FINAL ACHIEVEMENT', 'Left-facing profile with swept-back hair silhouette', 'portrait_chopin'],
  ['edith-piaf-sparrow', 'Edith Piaf Sparrow', 'NON, JE NE REGRETTE RIEN', 'Curly French hair locks and thin arched eyebrows', 'portrait_piaf'],
  ['luciano-pavarotti-tenor', 'Luciano Pavarotti Tenor', 'CREATIVITY IS EVERYWHERE, MUSIC IS LIFE', 'Singing full beard and tuxedo collar outline', 'portrait_pavarotti'],
  ['frank-sinatra-blueeyes', 'Frank Sinatra BlueEyes', 'I DID IT MY WAY', 'Fedora hat tilted and bow tie silhouette', 'portrait_sinatra'],
  ['tupac-shakur-poet', 'Tupac Shakur Poet', 'REALITY IS WRONG, DREAMS ARE FOR REAL', 'Bald profile and bandana tied at the front', 'portrait_tupac'],
  ['notorious-biggie', 'Notorious Biggie', 'IT WAS ALL A DREAM', 'Tilting golden crown and dark sunglasses', 'portrait_biggie'],
  ['eminem-rapgod', 'Eminem RapGod', 'YOU ONLY GET ONE SHOT, DO NOT MISS YOUR CHANCE', 'Trucker cap and hoodie collar contour', 'portrait_eminem'],
  ['lady-gaga-fame', 'Lady Gaga Fame', 'I’M JUST TRYING TO CHANGE THE WORLD, ONE SEQUIN AT A TIME', 'Straight blonde hair and right-eye lightning bolt paint', 'portrait_gaga'],
  ['beyonce-diva', 'Beyonce Diva', 'WHO RUNS THE WORLD? GIRLS', 'Face outline framed by wavy dynamic hair curls', 'portrait_beyonce'],
  ['taylor-swift-folklore', 'Taylor Swift Folklore', 'SHAKE IT OFF', 'Straight hair bangs and side braid profile', 'portrait_taylor'],
  ['daft-punk-robot', 'Daft Punk Robot', 'AROUND THE WORLD', 'Robotic chrome helmet and visor outline', 'portrait_daftpunk'],
  ['bjork-utopia', 'Bjork Utopia', 'I find that if I can make myself laugh, I’m in a good place', 'Avant-garde face paint and geometric hair rolls', 'portrait_bjork'],
  ['robert-plant-led', 'Robert Plant Led', 'THERE’S A LADY WHO SURE, ALL THAT GLITTERS IS GOLD', 'Long curly golden mane locks contour', 'portrait_plant'],
  ['jim-morrison-doors', 'Jim Morrison Doors', 'PEOPLE ARE STRANGE WHEN YOU’RE A STRANGER', 'Wild curly hair and Indian bead necklace silhouette', 'portrait_morrison'],
  ['ozzy-osbourne-metal', 'Ozzy Osbourne Metal', 'OF ALL THE THINGS I’VE LOST, I MISS MY MIND THE MOST', 'Round glasses and long straight black hair profile', 'portrait_ozzy'],
  ['angus-young-ac', 'Angus Young AC', 'FOR THOSE ABOUT TO ROCK, WE SALUTE YOU', 'Schoolboy cap with A logo print outline', 'portrait_angus'],
  ['slash-guns-n-roses', 'Slash Guns N Roses', 'SWEET CHILD O’ MINE', 'Huge top hat and curly hair mass backdrop', 'portrait_slash'],
  ['madonna-vogue', 'Madonna Vogue', 'EXPRESS YOURSELF, DON’T REPRESS YOURSELF', 'Short blonde curls and beauty mark profile', 'portrait_madonna'],
  ['prince-purple', 'Prince Purple', 'PURPLE RAIN, PURPLE RAIN', 'Perm curly hair, pencil mustache, and love symbol', 'portrait_prince'],
  ['janis-joplin-pearl', 'Janis Joplin Pearl', 'CRY BABY, CRY BABY', 'Round sunglasses and wild feathers hair silhouette', 'portrait_joplin_face'],
  ['jimi-hendrix-experience', 'Jimi Hendrix Experience', 'EXCUSE ME WHILE I KISS THE SKY', 'Big afro and horizontal headband contour', 'portrait_hendrix_face']
];

function drawArtistPortrait(artist, palette) {
  const [c1, c2, c3, c4, c5, paper, ink] = palette;
  switch (artist) {
    case 'elvis':
      return `
        <g transform="translate(200 178)">
          <path d="M-30 65 Q-60-40 0-60 Q60-40 30 65" fill="${ink}"/>
          <path d="M-42-10 C-52-80 52-80 42-10 C50 15-50 15-42-10" fill="${ink}"/>
          <path d="M-50 60 L-65 110 L-25 95 L-20 110 L20 110 L25 95 L65 110 L50 60 Z" fill="${c2}" stroke="${ink}" stroke-width="5"/>
          <rect x="-38" y="-5" width="6" height="30" fill="${ink}"/>
          <rect x="32" y="-5" width="6" height="30" fill="${ink}"/>
        </g>
      `;
    case 'jackson':
      return `
        <g transform="translate(200 178)">
          <ellipse cx="0" cy="10" rx="60" ry="50" fill="${ink}"/>
          <rect x="-42" y="-12" width="34" height="26" rx="8" fill="${ink}" stroke="${c1}" stroke-width="2"/>
          <rect x="8" y="-12" width="34" height="26" rx="8" fill="${ink}" stroke="${c1}" stroke-width="2"/>
          <line x1="-8" y1="-5" x2="8" y2="-5" stroke="${ink}" stroke-width="4"/>
          <ellipse cx="0" cy="-35" rx="72" ry="12" fill="${ink}"/>
          <path d="M-48-35 L-38-78 L38-78 L48-35 Z" fill="${ink}"/>
          <rect x="-42" y="-45" width="84" height="10" fill="${c4}"/>
          <path d="M-15-20 Q-24 15-12 40" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>
        </g>
      `;
    case 'bowie':
      return `
        <g transform="translate(200 178)">
          <path d="M-52 60 L-60-40 C-40-90 40-90 60-40 L52 60 Z" fill="${c2}" stroke="${ink}" stroke-width="5"/>
          <path d="M-15-76 L15-10 L-10 0 L25 76 L-8 10 L12-4 Z" fill="${c4}" stroke="${ink}" stroke-width="4"/>
          <circle cx="-25" cy="-5" r="4" fill="${ink}"/>
          <circle cx="25" cy="-5" r="4" fill="${ink}"/>
        </g>
      `;
    case 'mercury':
      return `
        <g transform="translate(200 178)">
          <path d="M-30 65 Q-60-40 0-60 Q60-40 30 65" fill="${c3}" stroke="${ink}" stroke-width="5"/>
          <path d="M-35-42 C-20-72 20-72 35-42 Z" fill="${ink}"/>
          <path d="M-26 26 Q0 16 26 26 Q16 38 0 32 Q-16 38-26 26" fill="${ink}" stroke="${ink}" stroke-width="2"/>
          <path d="M-35 60 L-10 110 L10 110 L35 60" fill="none" stroke="${ink}" stroke-width="6"/>
        </g>
      `;
    case 'dylan':
      return `
        <g transform="translate(200 178)">
          ${Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 360) / 12;
            const rad = (angle * Math.PI) / 180;
            return `<circle cx="${Math.cos(rad) * 48}" cy="${Math.sin(rad) * 42}" r="22" fill="${ink}"/>`;
          }).join('')}
          <rect x="-42" y="-12" width="34" height="24" rx="4" fill="${ink}"/>
          <rect x="8" y="-12" width="34" height="24" rx="4" fill="${ink}"/>
          <line x1="-8" y1="-5" x2="8" y2="-5" stroke="${ink}" stroke-width="6"/>
          <path d="M-60 55 L-60 110 L60 110 L60 55" fill="none" stroke="${c1}" stroke-width="6" stroke-linecap="round"/>
          <rect x="-30" y="96" width="60" height="10" fill="${c4}" stroke="${ink}" stroke-width="3"/>
        </g>
      `;
    case 'lennon':
      return `
        <g transform="translate(200 178)">
          <path d="M-65 65 C-75-60-25-70 0-45 C25-70 75-60 65 65 Z" fill="${ink}"/>
          <path d="M-30-15 C-25-25-5-25 0-15" fill="none" stroke="${paper}" stroke-width="4"/>
          <circle cx="-25" cy="5" r="22" fill="none" stroke="${ink}" stroke-width="6"/>
          <circle cx="-25" cy="5" r="18" fill="${c5}" opacity="0.4"/>
          <circle cx="25" cy="5" r="22" fill="none" stroke="${ink}" stroke-width="6"/>
          <circle cx="25" cy="5" r="18" fill="${c5}" opacity="0.4"/>
          <line x1="-3" y1="5" x2="3" y2="5" stroke="${ink}" stroke-width="6"/>
        </g>
      `;
    case 'mccartney':
      return `
        <g transform="translate(200 178)">
          <path d="M-50 55 C-65-30 65-30 50 55 C45 25-45 25-50 55" fill="${ink}"/>
          <g transform="translate(30 40) scale(0.6) rotate(-20)">
            <rect x="-8" y="-120" width="16" height="180" fill="${c2}" stroke="${ink}" stroke-width="4"/>
            <path d="M-26 0 C-45 15-45 45-26 60 C-15 70 15 70 26 60 C45 45 45 15 26 0 Z" fill="${c1}" stroke="${ink}" stroke-width="5"/>
          </g>
        </g>
      `;
    case 'cobain':
      return `
        <g transform="translate(200 178)">
          <path d="M-52 75 L-56-40 C-40-76 40-76 56-40 L52 75 C40 50 24 60 24 30 L-24 30 C-24 60-40 50-52 75 Z" fill="${c2}" stroke="${ink}" stroke-width="5"/>
          <rect x="-42" y="-10" width="34" height="24" rx="12" fill="${paper}" stroke="${ink}" stroke-width="5"/>
          <ellipse cx="-25" cy="2" rx="10" ry="7" fill="${ink}"/>
          <rect x="8" y="-10" width="34" height="24" rx="12" fill="${paper}" stroke="${ink}" stroke-width="5"/>
          <ellipse cx="25" cy="2" rx="10" ry="7" fill="${ink}"/>
          <line x1="-8" y1="2" x2="8" y2="2" stroke="${ink}" stroke-width="6"/>
        </g>
      `;
    case 'winehouse':
      return `
        <g transform="translate(200 178)">
          <path d="M-40 60 C-82 0-68-95 0-95 C68-95 82 0 40 60 Z" fill="${ink}"/>
          <path d="M-38-6 L-20-15 L-26-2 Z" fill="${ink}"/>
          <path d="M38-6 L20-15 L26-2 Z" fill="${ink}"/>
          <path d="M-44 32 L-40 38 L-34 35 L-38 42 L-34 48 L-41 45 L-46 48 L-43 41 L-48 36 L-42 36 Z" fill="${c2}"/>
          <path d="M44 32 L40 38 L34 35 L38 42 L34 48 L41 45 L46 48 L43 41 L48 36 L42 36 Z" fill="${c2}"/>
        </g>
      `;
    case 'aretha':
      return `
        <g transform="translate(200 178)">
          <circle cx="0" cy="-10" r="54" fill="${ink}"/>
          <circle cx="-42" cy="10" r="32" fill="${ink}"/>
          <circle cx="42" cy="10" r="32" fill="${ink}"/>
          <path d="M-30-54 L-45-78 L-15-68 L0-88 L15-68 L45-78 L30-54 Z" fill="${c2}" stroke="${ink}" stroke-width="3"/>
          <path d="M-40 50 C-40 90 40 90 40 50" fill="none" stroke="${ink}" stroke-width="6"/>
        </g>
      `;
    case 'wonder':
      return `
        <g transform="translate(200 178)">
          <circle cx="0" cy="0" r="56" fill="${ink}"/>
          ${[-45, -30, -15, 15, 30, 45].map((x) => `<line x1="${x}" y1="30" x2="${x}" y2="78" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`).join('')}
          <rect x="-44" y="-12" width="88" height="22" rx="4" fill="${ink}" stroke="${c3}" stroke-width="3"/>
          <line x1="0" y1="-12" x2="0" y2="10" stroke="${c3}" stroke-width="3"/>
        </g>
      `;
    case 'ray':
      return `
        <g transform="translate(200 178)">
          <path d="M-35 50 Q-56-30 0-45 Q56-30 35 50" fill="${ink}"/>
          <rect x="-42" y="-12" width="34" height="24" rx="3" fill="${ink}"/>
          <rect x="8" y="-12" width="34" height="24" rx="3" fill="${ink}"/>
          <line x1="-8" y1="-8" x2="8" y2="-8" stroke="${ink}" stroke-width="5"/>
          <path d="M-26 24 C-26 42 26 42 26 24" fill="${paper}" stroke="${ink}" stroke-width="4"/>
          ${[-16, -8, 0, 8, 16].map((x) => `<line x1="${x}" y1="24" x2="${x}" y2="34" stroke="${ink}" stroke-width="2"/>`).join('')}
        </g>
      `;
    case 'armstrong':
      return `
        <g transform="translate(200 178)">
          <circle cx="0" cy="10" r="48" fill="${c1}" stroke="${ink}" stroke-width="4"/>
          <circle cx="-38" cy="18" r="24" fill="${c2}" stroke="${ink}" stroke-width="4"/>
          <circle cx="38" cy="18" r="24" fill="${c2}" stroke="${ink}" stroke-width="4"/>
          <g transform="translate(0 10)">
            <line x1="0" y1="0" x2="0" y2="92" stroke="${ink}" stroke-width="12"/>
            <line x1="0" y1="0" x2="0" y2="92" stroke="${c4}" stroke-width="6"/>
            <path d="M-24 92 L24 92 L10 74 L-10 74 Z" fill="${c4}" stroke="${ink}" stroke-width="4"/>
          </g>
        </g>
      `;
    case 'miles':
      return `
        <g transform="translate(200 178)">
          <path d="M-30 65 Q-50-40 0-50 Q50-40 30 65" fill="${ink}"/>
          <rect x="-40" y="-10" width="32" height="20" rx="3" fill="${ink}" stroke="${c1}" stroke-width="2"/>
          <rect x="8" y="-10" width="32" height="20" rx="3" fill="${ink}" stroke="${c1}" stroke-width="2"/>
          <g transform="translate(10 20) rotate(55)">
            <line x1="0" y1="0" x2="0" y2="100" stroke="${ink}" stroke-width="8"/>
            <line x1="0" y1="0" x2="0" y2="100" stroke="${c3}" stroke-width="4"/>
            <path d="M-16 100 L16 100 L8 85 L-8 85 Z" fill="${c3}" stroke="${ink}" stroke-width="3"/>
          </g>
        </g>
      `;
    case 'ella':
      return `
        <g transform="translate(200 178)">
          <circle cx="0" cy="-35" r="32" fill="${ink}"/>
          <ellipse cx="0" cy="15" rx="46" ry="38" fill="${ink}"/>
          <path d="M-26-5 Q-14-12-2-5" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
          <path d="M26-5 Q14-12 2-5" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
          ${[-25, -15, -5, 5, 15, 25].map((x) => `<circle cx="${x}" cy="42" r="6" fill="${paper}" stroke="${ink}" stroke-width="2"/>`).join('')}
        </g>
      `;
    case 'billie':
      return `
        <g transform="translate(200 178)">
          <path d="M-40 50 Q-56-30 0-45 Q56-30 40 50 Z" fill="${ink}"/>
          <g transform="translate(-32 -28)">
            <circle r="18" fill="${paper}" stroke="${ink}" stroke-width="3"/>
            <circle cx="-8" cy="-8" r="8" fill="${paper}" stroke="${ink}" stroke-width="2"/>
            <circle cx="8" cy="-8" r="8" fill="${paper}" stroke="${ink}" stroke-width="2"/>
            <circle cx="-8" cy="8" r="8" fill="${paper}" stroke="${ink}" stroke-width="2"/>
            <circle cx="8" cy="8" r="8" fill="${paper}" stroke="${ink}" stroke-width="2"/>
          </g>
          <path d="M12-5 C16-12 28-12 32-5" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
        </g>
      `;
    case 'nina':
      return `
        <g transform="translate(200 178)">
          <path d="M-30 45 C-45 10-35-70 0-75 C35-75 45 10 30 45 Z" fill="${c1}" stroke="${ink}" stroke-width="5"/>
          <path d="M-32-20 Q0-5 32-20" fill="none" stroke="${ink}" stroke-width="4"/>
          <path d="M-26-48 Q0-35 26-48" fill="none" stroke="${ink}" stroke-width="4"/>
          <circle cx="-38" cy="38" r="18" fill="none" stroke="${c4}" stroke-width="6"/>
          <circle cx="38" cy="38" r="18" fill="none" stroke="${c4}" stroke-width="6"/>
        </g>
      `;
    case 'dolly':
      return `
        <g transform="translate(200 178)">
          <path d="M-54 65 C-92 20-78-75 0-75 C78-75 92 20 54 65 C42 35-42 35-54 65 Z" fill="${c2}" stroke="${ink}" stroke-width="5"/>
          <circle cx="-46" cy="-15" r="18" fill="${c2}" stroke="${ink}" stroke-width="3"/>
          <circle cx="46" cy="-15" r="18" fill="${c2}" stroke="${ink}" stroke-width="3"/>
          <circle cx="0" cy="-56" r="22" fill="${c2}" stroke="${ink}" stroke-width="3"/>
          <path d="M-26 0 L-18-8 M-22 4 L-12-2" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>
          <path d="M26 0 L18-8 M22 4 L12-2" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>
        </g>
      `;
    case 'cash':
      return `
        <g transform="translate(200 178)">
          <path d="M-30 65 Q-56-20 0-38 Q56-20 30 65" fill="${ink}"/>
          <ellipse cx="0" cy="-24" rx="72" ry="12" fill="${ink}" stroke="${ink}" stroke-width="2"/>
          <path d="M-42-24 L-32-68 L32-68 L42-24 Z" fill="${ink}"/>
          <g transform="translate(-48 20) rotate(-45)">
            <rect x="-6" y="-60" width="12" height="80" fill="${c3}" stroke="${ink}" stroke-width="4"/>
            <rect x="-14" y="-76" width="28" height="18" rx="2" fill="${c5}" stroke="${ink}" stroke-width="4"/>
          </g>
        </g>
      `;
    case 'willie':
      return `
        <g transform="translate(200 178)">
          <path d="M-30 50 Q-54-30 0-38 Q54-30 30 50" fill="${ink}"/>
          <rect x="-35" y="-12" width="70" height="12" fill="${c4}" stroke="${ink}" stroke-width="3"/>
          <path d="M-32 40 L-42 100 L-30 110 L-42 100" fill="none" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>
          <path d="M32 40 L42 100 L30 110 L42 100" fill="none" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>
          <circle cx="-30" cy="110" r="5" fill="${c2}"/>
          <circle cx="30" cy="110" r="5" fill="${c2}"/>
        </g>
      `;
    case 'marley':
      return `
        <g transform="translate(200 178)">
          ${Array.from({ length: 14 }).map((_, i) => {
            const angle = (i * 360) / 14;
            const rad = (angle * Math.PI) / 180;
            const rx = Math.cos(rad) * 44;
            const ry = Math.sin(rad) * 38;
            return `<ellipse cx="${rx}" cy="${ry}" rx="26" ry="18" fill="${ink}" transform="rotate(${angle} ${rx} ${ry})"/>`;
          }).join('')}
          <path d="M-32-25 Q0-15 32-25" fill="none" stroke="#ff4f4f" stroke-width="8"/>
          <path d="M-34-17 Q0-7 34-17" fill="none" stroke="#ffd84d" stroke-width="8"/>
          <path d="M-36-9 Q0 1 36-9" fill="none" stroke="#4ee6b8" stroke-width="8"/>
        </g>
      `;
    case 'jagger':
      return `
        <g transform="translate(200 178)">
          <path d="M-48 60 C-60-30 60-30 48 60 Z" fill="${ink}"/>
          <path d="M-34 10 C-20-10 20-10 34 10 C20 30-20 30-34 10" fill="${c4}" stroke="${ink}" stroke-width="6" stroke-linejoin="round"/>
          <path d="M-24 10 C-15 2 15 2 24 10" fill="none" stroke="${ink}" stroke-width="4"/>
        </g>
      `;
    case 'keith':
      return `
        <g transform="translate(200 178)">
          ${Array.from({ length: 8 }).map((_, i) => `<circle cx="-44" cy="${-30 + i * 12}" r="14" fill="${ink}"/>`).join('')}
          ${Array.from({ length: 8 }).map((_, i) => `<circle cx="44" cy="${-30 + i * 12}" r="14" fill="${ink}"/>`).join('')}
          <path d="M-40-35 C-40-70 40-70 40-35 Z" fill="${ink}"/>
          <rect x="-42" y="-30" width="84" height="12" fill="${c2}" stroke="${ink}" stroke-width="3" transform="rotate(-4)"/>
        </g>
      `;
    case 'springsteen':
      return `
        <g transform="translate(200 178)">
          <path d="M-30 60 Q-50-30 0-45 Q50-30 30 60" fill="${c3}" stroke="${ink}" stroke-width="4"/>
          <rect x="-34" y="-14" width="68" height="10" fill="${c4}" stroke="${ink}" stroke-width="3"/>
          <path d="M-40 55 L-60 92 L-20 82 L-15 105 L15 105 L20 82 L60 92 L40 55 Z" fill="${c1}" stroke="${ink}" stroke-width="4"/>
        </g>
      `;
    case 'elton':
      return `
        <g transform="translate(200 178)">
          <path d="M-45 50 Q-56-35 0-42 Q56-35 45 50 Z" fill="${ink}"/>
          <g transform="translate(-25 10)">
            <path d="M0-18 L5-5 L18-5 L8 4 L12 18 L0 10 L-12 18 L-8 4 L-18-5 L-5-5 Z" fill="${c3}" stroke="${ink}" stroke-width="5"/>
          </g>
          <g transform="translate(25 10)">
            <path d="M0-18 L5-5 L18-5 L8 4 L12 18 L0 10 L-12 18 L-8 4 L-18-5 L-5-5 Z" fill="${c3}" stroke="${ink}" stroke-width="5"/>
          </g>
          <line x1="-8" y1="10" x2="8" y2="10" stroke="${ink}" stroke-width="6"/>
        </g>
      `;
    case 'joel':
      return `
        <g transform="translate(200 178)">
          <path d="M-30 50 Q-46-30 0-40 Q46-30 30 50" fill="${c2}" stroke="${ink}" stroke-width="4"/>
          <path d="M-15 42 L0 62 L15 42 Z" fill="${ink}" stroke="${ink}" stroke-width="3"/>
          <rect x="-35" y="-8" width="28" height="18" rx="2" fill="none" stroke="${ink}" stroke-width="4"/>
          <rect x="7" y="-8" width="28" height="18" rx="2" fill="none" stroke="${ink}" stroke-width="4"/>
          <line x1="-7" y1="0" x2="7" y2="0" stroke="${ink}" stroke-width="4"/>
        </g>
      `;
    case 'mozart':
      return `
        <g transform="translate(200 178)">
          <path d="M-40 50 C-56-40 56-40 40 50" fill="${paper}" stroke="${ink}" stroke-width="5"/>
          <circle cx="-38" cy="10" r="14" fill="${paper}" stroke="${ink}" stroke-width="4"/>
          <circle cx="-38" cy="30" r="14" fill="${paper}" stroke="${ink}" stroke-width="4"/>
          <circle cx="38" cy="10" r="14" fill="${paper}" stroke="${ink}" stroke-width="4"/>
          <circle cx="38" cy="30" r="14" fill="${paper}" stroke="${ink}" stroke-width="4"/>
          <path d="M-12 50 L-25 96 L0 84 L25 96 L12 50 Z" fill="${ink}"/>
        </g>
      `;
    case 'beethoven':
      return `
        <g transform="translate(200 178)">
          <path d="M-45 55 C-92 10-78-85 0-85 C78-85 92 10 45 55 L35 30 L48 5 L20-40 L-20-40 L-48 5 L-35 30 Z" fill="${ink}"/>
          ${Array.from({ length: 8 }).map((_, i) => {
            const angle = -60 + i * 18;
            return `<line x1="0" y1="-40" x2="0" y2="-92" stroke="${ink}" stroke-width="8" stroke-linecap="round" transform="rotate(${angle})"/>`;
          }).join('')}
          <path d="M-30 45 Q0 92 30 45 Q15 105 0 88 Q-15 105-30 45" fill="${c4}" stroke="${ink}" stroke-width="4"/>
        </g>
      `;
    case 'bach':
      return `
        <g transform="translate(200 178)">
          <path d="M-45 50 C-60-50 60-50 45 50 Z" fill="${paper}" stroke="${ink}" stroke-width="5"/>
          ${[-35, -20, -5, 5, 20, 35].map((y) => `
            <g>
              <circle cx="-38" cy="${y}" r="13" fill="${paper}" stroke="${ink}" stroke-width="3"/>
              <circle cx="38" cy="${y}" r="13" fill="${paper}" stroke="${ink}" stroke-width="3"/>
            </g>
          `).join('')}
        </g>
      `;
    case 'chopin':
      return `
        <g transform="translate(200 178)">
          <path d="M40 78 C40-40-10-40-10 10 L-30 18 L-10 24 L-14 36 L-4 36 C-4 55 12 78 40 78 Z" fill="${ink}"/>
          <path d="M12-28 C30-60 65-30 48 30 C38-5 20-15 12-28" fill="${c1}" stroke="${ink}" stroke-width="3"/>
        </g>
      `;
    case 'piaf':
      return `
        <g transform="translate(200 178)">
          <path d="M-32 40 C-45-10 45-10 32 40 Z" fill="${ink}"/>
          <path d="M-26 0 Q-16-12-6-2" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>
          <path d="M26 0 Q16-12 6-2" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>
        </g>
      `;
    case 'pavarotti':
      return `
        <g transform="translate(200 178)">
          <path d="M-36 20 C-36 68 36 68 36 20 L26 15 C26 30-26 30-26 15 Z" fill="${ink}"/>
          <circle cx="0" cy="12" r="14" fill="${paper}" stroke="${ink}" stroke-width="4"/>
          <path d="M-38-20 C-46 20-32 45-30 45" fill="none" stroke="${ink}" stroke-width="8"/>
          <path d="M38-20 C46 20 32 45 30 45" fill="none" stroke="${ink}" stroke-width="8"/>
        </g>
      `;
    case 'sinatra':
      return `
        <g transform="translate(200 178)">
          <ellipse cx="0" cy="-15" rx="68" ry="12" fill="${ink}" transform="rotate(-6)"/>
          <path d="M-44-15 L-34-58 L34-58 L44-15 Z" fill="${ink}" transform="rotate(-6)"/>
          <rect x="-38" y="-24" width="76" height="8" fill="${c5}" transform="rotate(-6)"/>
          <path d="M-18 68 L-30 85 L0 76 L30 85 L18 68 Z" fill="${ink}"/>
        </g>
      `;
    case 'tupac':
      return `
        <g transform="translate(200 178)">
          <circle cx="0" cy="18" r="42" fill="${c3}" stroke="${ink}" stroke-width="4"/>
          <path d="M-41 0 Q0 10 41 0" fill="none" stroke="${paper}" stroke-width="12"/>
          <path d="M-41 0 Q0 10 41 0" fill="none" stroke="${ink}" stroke-width="4"/>
          <path d="M-10-4 L-28-34 L-6-18 Z" fill="${paper}" stroke="${ink}" stroke-width="3"/>
          <path d="M10-4 L28-34 L6-18 Z" fill="${paper}" stroke="${ink}" stroke-width="3"/>
        </g>
      `;
    case 'biggie':
      return `
        <g transform="translate(200 178)">
          <rect x="-42" y="-6" width="34" height="22" rx="2" fill="${ink}"/>
          <rect x="8" y="-6" width="34" height="22" rx="2" fill="${ink}"/>
          <line x1="-8" y1="2" x2="8" y2="2" stroke="${ink}" stroke-width="5"/>
          <g transform="translate(10 -28) rotate(12)">
            <rect x="-35" y="-12" width="70" height="24" fill="${c2}" stroke="${ink}" stroke-width="4"/>
            <path d="M-35-12 L-45-34 L-15-22 L0-45 L15-22 L45-34 L35-12 Z" fill="${c2}" stroke="${ink}" stroke-width="4"/>
          </g>
        </g>
      `;
    case 'eminem':
      return `
        <g transform="translate(200 178)">
          <path d="M-46 20 C-46-30 46-30 46 20 Z" fill="${ink}"/>
          <path d="M-54 12 C-20 28 20 28 54 12" fill="none" stroke="${ink}" stroke-width="10" stroke-linecap="round"/>
          <path d="M-50 65 L-35 110 L35 110 L50 65 C30 75-30 75-50 65 Z" fill="${c1}" stroke="${ink}" stroke-width="4"/>
        </g>
      `;
    case 'gaga':
      return `
        <g transform="translate(200 178)">
          <path d="M-50 65 L-54-38 C-40-74 40-74 54-38 L50 65 L36 20 L-36 20 Z" fill="${paper}" stroke="${ink}" stroke-width="5"/>
          <line x1="-36" y1="-10" x2="36" y2="-10" stroke="${ink}" stroke-width="5"/>
          <path d="M-28-34 L-10-5 L-20 2 L-8 38 L-20 10 L-14 0 Z" fill="${c4}" stroke="${ink}" stroke-width="3"/>
        </g>
      `;
    case 'beyonce':
      return `
        <g transform="translate(200 178)">
          ${Array.from({ length: 10 }).map((_, i) => {
            const y = -40 + i * 10;
            return `
              <path d="M-30 ${y} Q-72 ${y + 15}-46 ${y + 30}" fill="none" stroke="${c2}" stroke-width="10" stroke-linecap="round"/>
              <path d="M30 ${y} Q72 ${y + 15} 46 ${y + 30}" fill="none" stroke="${c2}" stroke-width="10" stroke-linecap="round"/>
            `;
          }).join('')}
          <circle cx="0" cy="10" r="38" fill="${c1}" stroke="${ink}" stroke-width="4"/>
        </g>
      `;
    case 'taylor':
      return `
        <g transform="translate(200 178)">
          <path d="M-48 65 L-52-38 C-38-74 38-74 52-38 L48 65 L34 24 L-34 24 Z" fill="${c2}" stroke="${ink}" stroke-width="4"/>
          <path d="M-42 24 C-36 50-20 65-34 92" fill="none" stroke="${c3}" stroke-width="6" stroke-linecap="round"/>
        </g>
      `;
    case 'daftpunk':
      return `
        <g transform="translate(200 178)">
          <rect x="-48" y="-48" width="96" height="96" rx="34" fill="${c5}" stroke="${ink}" stroke-width="6"/>
          <rect x="-48" y="-20" width="96" height="28" fill="${ink}"/>
          <line x1="-38" y1="-6" x2="38" y2="-6" stroke="${c1}" stroke-width="3"/>
        </g>
      `;
    case 'bjork':
      return `
        <g transform="translate(200 178)">
          <path d="M-45 50 Q-56-40 0-54 Q56-40 45 50 Z" fill="${ink}"/>
          <circle cx="-25" cy="-25" r="14" fill="${c4}" stroke="${ink}" stroke-width="3"/>
          <circle cx="25" cy="-25" r="14" fill="${c4}" stroke="${ink}" stroke-width="3"/>
        </g>
      `;
    case 'plant':
      return `
        <g transform="translate(200 178)">
          ${Array.from({ length: 12 }).map((_, i) => {
            const y = -50 + i * 10;
            return `
              <path d="M-30 ${y} Q-74 ${y + 20}-38 ${y + 35}" fill="none" stroke="${c2}" stroke-width="12" stroke-linecap="round"/>
              <path d="M30 ${y} Q74 ${y + 20} 38 ${y + 35}" fill="none" stroke="${c2}" stroke-width="12" stroke-linecap="round"/>
            `;
          }).join('')}
        </g>
      `;
    case 'morrison':
      return `
        <g transform="translate(200 178)">
          <path d="M-48 60 C-65-30 65-30 48 60 Z" fill="${ink}"/>
          ${[-20, -10, 0, 10, 20].map((x, i) => `<circle cx="${x}" cy="52" r="${i % 2 ? 6 : 4}" fill="${i % 2 ? c4 : c3}" stroke="${ink}" stroke-width="2"/>`).join('')}
        </g>
      `;
    case 'ozzy':
      return `
        <g transform="translate(200 178)">
          <path d="M-50 70 L-54-40 C-40-72 40-72 54-40 L50 70 Z" fill="${ink}"/>
          <circle cx="-22" cy="0" r="16" fill="none" stroke="${paper}" stroke-width="5"/>
          <circle cx="-22" cy="0" r="12" fill="${c1}" opacity="0.8"/>
          <circle cx="22" cy="0" r="16" fill="none" stroke="${paper}" stroke-width="5"/>
          <circle cx="22" cy="0" r="12" fill="${c1}" opacity="0.8"/>
          <line x1="-6" y1="0" x2="6" y2="0" stroke="${paper}" stroke-width="5"/>
        </g>
      `;
    case 'angus':
      return `
        <g transform="translate(200 178)">
          <path d="M-45 10 C-45-34 45-34 45 10 Z" fill="${c1}" stroke="${ink}" stroke-width="5"/>
          <path d="M-52 10 C-25 24 25 24 52 10" fill="none" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>
          <text x="0" y="-8" text-anchor="middle" font-family="Arial Black" font-size="18" fill="${c2}">A</text>
        </g>
      `;
    case 'slash':
      return `
        <g transform="translate(200 178)">
          <ellipse cx="0" cy="10" rx="58" ry="46" fill="${ink}"/>
          <path d="M-34 10 L-24-70 L24-70 L34 10 Z" fill="${ink}" stroke="${ink}" stroke-width="3"/>
          <ellipse cx="0" cy="10" rx="48" ry="8" fill="${ink}"/>
          <rect x="-10" y="-2" width="20" height="10" fill="${c3}" stroke="${ink}" stroke-width="2"/>
        </g>
      `;
    case 'madonna':
      return `
        <g transform="translate(200 178)">
          <path d="M-42 45 Q-56-35 0-45 Q56-35 42 45 Z" fill="${c2}" stroke="${ink}" stroke-width="4"/>
          <circle cx="16" cy="18" r="3.5" fill="${ink}"/>
        </g>
      `;
    case 'prince':
      return `
        <g transform="translate(200 178)">
          <ellipse cx="0" cy="-10" rx="52" ry="44" fill="${ink}"/>
          <path d="M-20 28 L-5 26 L0 28 L5 26 L20 28" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>
          <path d="M0 35 L0 85 M-20 55 L20 55 M-15 45 C-15 25 15 25 15 45 C15 65-15 65-15 45" fill="none" stroke="${c3}" stroke-width="4" opacity="0.6"/>
        </g>
      `;
    case 'joplin_face':
      return `
        <g transform="translate(200 178)">
          <path d="M-48 60 C-68-30 68-30 48 60 Z" fill="${c2}" stroke="${ink}" stroke-width="4"/>
          <circle cx="-25" cy="0" r="20" fill="none" stroke="${ink}" stroke-width="6"/>
          <circle cx="25" cy="0" r="20" fill="none" stroke="${ink}" stroke-width="6"/>
        </g>
      `;
    case 'hendrix_face':
      return `
        <g transform="translate(200 178)">
          <circle cx="0" cy="0" r="54" fill="${ink}"/>
          <rect x="-42" y="-12" width="84" height="12" fill="${c4}" stroke="${ink}" stroke-width="3" transform="rotate(-5)"/>
        </g>
      `;
    default:
      return `<circle cx="200" cy="178" r="42" fill="${c1}" stroke="${ink}" stroke-width="5"/>`;
  }
}

function shape(type, palette, index) {
  const [c1, c2, c3, c4, c5, paper, ink] = palette;
  const commonText = `<text x="200" y="358" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="16" fill="${ink}">${escapeXml(designs[index][1].toUpperCase())}</text>`;

  if (type.startsWith('portrait_')) {
    const artist = type.replace('portrait_', '');
    return drawArtistPortrait(artist, palette) + commonText;
  }

  switch (type) {
    case 'violin':
      return `<g transform="translate(200 175) rotate(${index % 2 ? 8 : -8})"><path d="M-24-118 C-72-92-54-48-18-42 C-72-24-72 54-18 70 C-12 112 12 112 18 70 C72 54 72-24 18-42 C54-48 72-92 24-118 C8-94-8-94-24-118Z" fill="${c1}" stroke="${ink}" stroke-width="6"/><circle cx="0" cy="-8" r="22" fill="${ink}"/><rect x="-8" y="-145" width="16" height="270" fill="${c2}" stroke="${ink}" stroke-width="4"/><line x1="-26" y1="-150" x2="76" y2="118" stroke="${paper}" stroke-width="6"/><line x1="-16" y1="-126" x2="24" y2="98" stroke="${paper}" stroke-width="2"/></g>${commonText}`;
    case 'amp':
      return `<g transform="translate(200 180)"><rect x="-128" y="-88" width="256" height="176" rx="10" fill="${c1}" stroke="${ink}" stroke-width="6"/><rect x="-102" y="-44" width="204" height="90" fill="${paper}" stroke="${ink}" stroke-width="4"/><path d="M-86 14 C-44-34 6 58 48 4 S86-22 100 16" fill="none" stroke="${c4}" stroke-width="8" stroke-linecap="round"/><g>${[-72,-36,0,36,72].map(x=>`<circle cx="${x}" cy="-64" r="10" fill="${c2}" stroke="${ink}" stroke-width="3"/>`).join('')}</g></g>${commonText}`;
    case 'crowd':
      return `<g>${Array.from({length:18}).map((_,i)=>`<circle cx="${40+i*19}" cy="${238+(i%3)*10}" r="18" fill="${[c1,c2,c3,c4,c5][i%5]}" stroke="${ink}" stroke-width="4"/>`).join('')}<path d="M64 210 C108 126 160 166 200 94 C244 166 296 126 338 210" fill="none" stroke="${ink}" stroke-width="12" stroke-linecap="round"/><path d="M64 210 C108 126 160 166 200 94 C244 166 296 126 338 210" fill="none" stroke="${c2}" stroke-width="6" stroke-linecap="round"/></g>${commonText}`;
    case 'pick':
      return `<g transform="translate(200 178)"><path d="M0-125 C92-125 122-48 76 80 C42 154-42 154-76 80 C-122-48-92-125 0-125Z" fill="${c1}" stroke="${ink}" stroke-width="7"/><path d="M-48-36 L48 54 M48-36 L-48 54" stroke="${c4}" stroke-width="14" stroke-linecap="round"/><circle r="24" fill="${paper}" stroke="${ink}" stroke-width="5"/></g>${commonText}`;
    case 'fifths':
      return `<g transform="translate(200 176)"><circle r="124" fill="${paper}" stroke="${ink}" stroke-width="6"/><circle r="82" fill="${c3}" stroke="${ink}" stroke-width="5"/><circle r="34" fill="${c5}" stroke="${ink}" stroke-width="4"/><g font-family="Arial Black, Arial" font-size="18" fill="${ink}">${['C','G','D','A','E','B','F#','Db','Ab','Eb','Bb','F'].map((n,i)=>{const a=(i*30-90)*Math.PI/180;return `<text x="${Math.cos(a)*104}" y="${Math.sin(a)*104+6}" text-anchor="middle">${n}</text>`}).join('')}</g></g>${commonText}`;
    case 'guitar':
      return `<g transform="translate(200 178) rotate(-18)"><ellipse cx="-34" cy="42" rx="58" ry="74" fill="${c1}" stroke="${ink}" stroke-width="6"/><ellipse cx="28" cy="20" rx="50" ry="64" fill="${c3}" stroke="${ink}" stroke-width="6"/><circle cx="0" cy="32" r="24" fill="${ink}"/><rect x="-13" y="-142" width="26" height="186" fill="${c2}" stroke="${ink}" stroke-width="5"/><rect x="-38" y="-174" width="76" height="36" rx="4" fill="${c4}" stroke="${ink}" stroke-width="5"/>${[-8,-3,2,7].map(x=>`<line x1="${x}" y1="-162" x2="${x}" y2="100" stroke="${paper}" stroke-width="2"/>`).join('')}</g>${commonText}`;
    case 'metronome':
      return `<g><path d="M206 82 L292 292 L112 292Z" fill="${ink}"/><path d="M200 76 L286 286 L114 286Z" fill="${c1}" stroke="${ink}" stroke-width="6"/><path d="M200 118 L252 272 L148 272Z" fill="${paper}" stroke="${ink}" stroke-width="4"/><g transform="translate(200 264) rotate(${index%2?18:-18})"><line y2="-162" stroke="${ink}" stroke-width="6" stroke-linecap="round"/><rect x="-12" y="-126" width="24" height="28" fill="${c3}" stroke="${ink}" stroke-width="4"/></g></g>${commonText}`;
    case 'bass':
      return `<g transform="translate(200 180)"><path d="M-56 102 C-118 64-88-24-26-8 C-82-62-36-118 18-82 C58-120 108-66 56-10 C118-20 124 70 58 102 Z" fill="${c1}" stroke="${ink}" stroke-width="6"/><rect x="-8" y="-146" width="22" height="210" fill="${c2}" stroke="${ink}" stroke-width="5"/><circle cx="0" cy="34" r="20" fill="${ink}"/><line x1="-18" y1="-134" x2="-18" y2="106" stroke="${paper}" stroke-width="3"/><line x1="4" y1="-134" x2="4" y2="106" stroke="${paper}" stroke-width="2"/></g>${commonText}`;
    case 'fork':
      return `<g transform="translate(200 176)"><path d="M-48-112 L-48-30 C-48 32 48 32 48-30 L48-112" fill="none" stroke="${ink}" stroke-width="26" stroke-linecap="round"/><path d="M-48-112 L-48-30 C-48 32 48 32 48-30 L48-112" fill="none" stroke="${c1}" stroke-width="15" stroke-linecap="round"/><line x1="0" y1="20" x2="0" y2="122" stroke="${ink}" stroke-width="22" stroke-linecap="round"/><line x1="0" y1="20" x2="0" y2="122" stroke="${c3}" stroke-width="11" stroke-linecap="round"/></g>${commonText}`;
    case 'pedals':
      return `<g>${[-82,0,82].map((x,i)=>`<g transform="translate(${200+x} 178) rotate(${(i-1)*5})"><rect x="-42" y="-70" width="84" height="140" rx="8" fill="${[c1,c3,c5][i]}" stroke="${ink}" stroke-width="5"/><circle cy="-38" r="12" fill="${c2}" stroke="${ink}" stroke-width="4"/><rect x="-24" y="10" width="48" height="36" fill="${paper}" stroke="${ink}" stroke-width="4"/></g>`).join('')}<path d="M76 178 C116 128 152 226 190 176 S264 124 324 180" fill="none" stroke="${ink}" stroke-width="7"/></g>${commonText}`;
    case 'record':
      return `<g transform="translate(200 176)"><circle r="118" fill="${ink}"/><circle r="88" fill="${c1}" stroke="${paper}" stroke-width="4"/><circle r="56" fill="none" stroke="${paper}" stroke-width="3" opacity=".7"/><circle r="28" fill="${c4}" stroke="${ink}" stroke-width="5"/><ellipse rx="152" ry="38" fill="none" stroke="${c2}" stroke-width="13"/><ellipse rx="152" ry="38" fill="none" stroke="${ink}" stroke-width="4" stroke-dasharray="12 10"/></g>${commonText}`;
    case 'keys':
      return `<g transform="translate(200 184)"><rect x="-144" y="-66" width="288" height="132" fill="${paper}" stroke="${ink}" stroke-width="6"/>${Array.from({length:12}).map((_,i)=>`<rect x="${-144+i*24}" y="-66" width="24" height="132" fill="${i%2?c2:paper}" stroke="${ink}" stroke-width="2"/>`).join('')}${[-108,-84,-36,-12,12,60,84,132].map(x=>`<rect x="${x}" y="-66" width="16" height="78" fill="${ink}"/>`).join('')}</g>${commonText}`;
    case 'bars':
      return `<g transform="translate(200 190)">${[-96,-48,0,48,96].map((x,i)=>`<rect x="${x-16}" y="${-42-i*12}" width="32" height="${112+i*18}" fill="${[c1,c2,c3,c4,c5][i]}" stroke="${ink}" stroke-width="5"/>`).join('')}</g>${commonText}`;
    case 'hands':
      return `<g transform="translate(200 178)"><path d="M-92 24 C-130-34-70-80-34-22 L-20 0 L-18-88 C-18-118 18-118 18-88 L20 0 L36-34 C66-84 124-44 96 18 C76 64 44 98 0 108 C-42 98-72 68-92 24Z" fill="${c1}" stroke="${ink}" stroke-width="6"/><circle cx="-78" cy="-96" r="18" fill="${c4}" stroke="${ink}" stroke-width="4"/><circle cx="86" cy="-82" r="14" fill="${c2}" stroke="${ink}" stroke-width="4"/></g>${commonText}`;
    case 'rosette':
      return `<g transform="translate(200 176)"><circle r="116" fill="${c2}" stroke="${ink}" stroke-width="6"/><circle r="82" fill="none" stroke="${c4}" stroke-width="18" stroke-dasharray="12 8"/><circle r="58" fill="${ink}"/>${[-72,-44,-16,16,44,72].map(x=>`<line x1="${x}" y1="-146" x2="${x}" y2="146" stroke="${paper}" stroke-width="4"/>`).join('')}</g>${commonText}`;
    case 'mic':
      return `<g transform="translate(200 178)"><circle r="126" fill="none" stroke="${c3}" stroke-width="2" stroke-dasharray="8 8" opacity="0.5"/><circle r="96" fill="none" stroke="${c2}" stroke-width="3" stroke-dasharray="6 6"/><line x1="0" y1="50" x2="0" y2="140" stroke="${ink}" stroke-width="8" stroke-linecap="round"/><line x1="-30" y1="140" x2="30" y2="140" stroke="${ink}" stroke-width="8" stroke-linecap="round"/><path d="M-30-10 C-30 40 30 40 30-10" fill="none" stroke="${ink}" stroke-width="8" stroke-linecap="round"/><rect x="-18" y="-50" width="36" height="70" rx="18" fill="${c1}" stroke="${ink}" stroke-width="5"/><rect x="-18" y="-50" width="36" height="30" rx="15" fill="${c4}" stroke="${ink}" stroke-width="4"/><line x1="-18" y1="-35" x2="18" y2="-35" stroke="${ink}" stroke-width="2"/><line x1="0" y1="-50" x2="0" y2="-20" stroke="${ink}" stroke-width="2"/><rect x="-20" y="-30" width="40" height="6" fill="${ink}"/></g>${commonText}`;
    case 'piano':
      return `<g transform="translate(200 180)"><path d="M-110 30 C-110-60-20-100 40-100 C 90-100 110-70 110-30 C 110 30 80 40 80 40 L-110 40 Z" fill="${c1}" stroke="${ink}" stroke-width="6"/><line x1="40" y1="-100" x2="60" y2="10" stroke="${ink}" stroke-width="6"/><rect x="-120" y="20" width="240" height="35" fill="${paper}" stroke="${ink}" stroke-width="5"/>${Array.from({length:15}).map((_,i)=>`<line x1="${-120+i*16}" y1="20" x2="${-120+i*16}" y2="55" stroke="${ink}" stroke-width="2"/>`).join('')}${[-112,-96,-64,-48,-32,0,16,48,64,80].map(x=>`<rect x="${x}" y="20" width="8" height="22" fill="${ink}"/>`).join('')}</g>${commonText}`;
    case 'cables':
      return `<g transform="translate(200 178)"><path d="M-130 50 Q-90-80-30-30 T 30-30 T 90 20 T 130-40" fill="none" stroke="${c2}" stroke-width="18" stroke-linecap="round"/><path d="M-130 50 Q-90-80-30-30 T 30-30 T 90 20 T 130-40" fill="none" stroke="${ink}" stroke-width="10" stroke-linecap="round"/><path d="M-110 70 Q-60-40 0 0 T 80-10 T 120 60" fill="none" stroke="${c4}" stroke-width="8" stroke-linecap="round"/><g transform="translate(-130 50) rotate(-45)"><rect x="-6" y="-20" width="12" height="30" fill="${c1}" stroke="${ink}" stroke-width="3" rx="2"/><rect x="-3" y="-35" width="6" height="15" fill="${paper}" stroke="${ink}" stroke-width="2"/></g><g transform="translate(130 -40) rotate(135)"><rect x="-6" y="-20" width="12" height="30" fill="${c5}" stroke="${ink}" stroke-width="3" rx="2"/><rect x="-3" y="-35" width="6" height="15" fill="${paper}" stroke="${ink}" stroke-width="2"/></g></g>${commonText}`;
    case 'score':
      return `<g transform="translate(200 178)">${[-40,-20,0,20,40].map(y=>`<path d="M-140 ${y} C-70 ${y-30} 70 ${y+30} 140 ${y}" fill="none" stroke="${ink}" stroke-width="3" opacity="0.6"/>`).join('')}<g transform="translate(-80 -10) scale(0.7)"><path d="M 20 80 C 20 110, -30 110, -30 80 C -30 60, -10 50, 0 50 C -20 50, -40 30, -40 0 C -40 -40, 0 -80, 20 -110 L 20 120 C 20 140, 5 150, -10 150" fill="none" stroke="${ink}" stroke-width="8" stroke-linecap="round"/><path d="M 20 80 C 20 110, -30 110, -30 80 C -30 60, -10 50, 0 50 C -20 50, -40 30, -40 0 C -40 -40, 0 -80, 20 -110 L 20 120 C 20 140, 5 150, -10 150" fill="none" stroke="${c1}" stroke-width="4" stroke-linecap="round"/></g><g transform="translate(0 -20)"><ellipse cx="-10" cy="10" rx="12" ry="8" fill="${c3}" stroke="${ink}" stroke-width="3" transform="rotate(-20)"/><line x1="0" y1="10" x2="0" y2="-40" stroke="${ink}" stroke-width="4"/><path d="M0-40 Q15-35 20-20" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/></g><g transform="translate(60 20)"><ellipse cx="-10" cy="10" rx="12" ry="8" fill="${c4}" stroke="${ink}" stroke-width="3" transform="rotate(-20)"/><line x1="0" y1="10" x2="0" y2="-40" stroke="${ink}" stroke-width="4"/><path d="M0-40 Q15-35 20-20" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/></g></g>${commonText}`;
    case 'mixer':
      return `<g transform="translate(200 180)"><rect x="-130" y="-80" width="260" height="160" rx="6" fill="${c1}" stroke="${ink}" stroke-width="5"/>${[-65,0,65].map(x=>`<line x1="${x}" y1="-80" x2="${x}" y2="80" stroke="${ink}" stroke-width="3" opacity="0.4"/>`).join('')}${[-97,-32,33,98].map((x,i)=>`<g transform="translate(${x} -60)"><rect x="-10" y="-12" width="20" height="24" fill="${ink}" rx="2"/><circle cx="-4" cy="-5" r="2.5" fill="${i===2?'#ff6b6b':'#38d9a9'}"/><circle cx="4" cy="-5" r="2.5" fill="${i===2?'#ff6b6b':'#38d9a9'}"/><circle cx="-4" cy="5" r="2.5" fill="#ffd84d"/><circle cx="4" cy="5" r="2.5" fill="#ffd84d"/></g>`).join('')}${[-97,-32,33,98].map(x=>`<line x1="${x}" y1="-30" x2="${x}" y2="60" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`).join('')}<rect x="-109" y="10" width="24" height="14" rx="2" fill="${c3}" stroke="${ink}" stroke-width="3"/><rect x="-44" y="-20" width="24" height="14" rx="2" fill="${c4}" stroke="${ink}" stroke-width="3"/><rect x="21" y="30" width="24" height="14" rx="2" fill="${c2}" stroke="${ink}" stroke-width="3"/><rect x="86" y="-5" width="24" height="14" rx="2" fill="${c5}" stroke="${ink}" stroke-width="3"/></g>${commonText}`;
    case 'headphones':
      return `<g transform="translate(200 178)"><path d="M-70 40 C-70-70 70-70 70 40" fill="none" stroke="${ink}" stroke-width="18" stroke-linecap="round"/><path d="M-70 40 C-70-70 70-70 70 40" fill="none" stroke="${c2}" stroke-width="10" stroke-linecap="round"/><g transform="translate(-75 30) rotate(-10)"><rect x="-22" y="-36" width="44" height="72" rx="22" fill="${c1}" stroke="${ink}" stroke-width="5"/><rect x="-10" y="-26" width="20" height="52" rx="10" fill="${c3}" stroke="${ink}" stroke-width="3"/></g><g transform="translate(75 30) rotate(10)"><rect x="-22" y="-36" width="44" height="72" rx="22" fill="${c1}" stroke="${ink}" stroke-width="5"/><rect x="-10" y="-26" width="20" height="52" rx="10" fill="${c3}" stroke="${ink}" stroke-width="3"/></g><path d="M-115 -10 A 60 60 0 0 0 -115 70" fill="none" stroke="${c4}" stroke-width="4" stroke-linecap="round" stroke-dasharray="4 6"/><path d="M 115 -10 A 60 60 0 0 1 115 70" fill="none" stroke="${c4}" stroke-width="4" stroke-linecap="round" stroke-dasharray="4 6"/></g>${commonText}`;
    case 'drums':
      return `<g transform="translate(200 182)"><rect x="-86" y="-25" width="172" height="74" rx="4" fill="${c1}" stroke="${ink}" stroke-width="6"/><rect x="-86" y="-35" width="172" height="10" fill="${c2}" stroke="${ink}" stroke-width="4"/><rect x="-86" y="49" width="172" height="10" fill="${c2}" stroke="${ink}" stroke-width="4"/>${[-70,-35,0,35,70].map(x=>`<line x1="${x}" y1="-25" x2="${x}" y2="49" stroke="${ink}" stroke-width="3"/>`).join('')}<g transform="rotate(22)"><line x1="-120" y1="-45" x2="120" y2="-45" stroke="${c3}" stroke-width="6" stroke-linecap="round"/><circle cx="120" cy="-45" r="6.5" fill="${ink}"/></g><g transform="rotate(-22)"><line x1="-120" y1="45" x2="120" y2="45" stroke="${c3}" stroke-width="6" stroke-linecap="round"/><circle cx="120" cy="45" r="6.5" fill="${ink}"/></g></g>${commonText}`;
    case 'hendrix':
      return `<g transform="translate(200 178)"><circle cx="-10" cy="-30" r="46" fill="${ink}"/><circle cx="28" cy="-24" r="42" fill="${ink}"/><circle cx="-28" cy="10" r="38" fill="${ink}"/><circle cx="24" cy="18" r="36" fill="${ink}"/><rect x="-44" y="-12" width="88" height="14" fill="${c4}" stroke="${ink}" stroke-width="3" transform="rotate(-5)"/><g transform="translate(10 40) rotate(-35)"><ellipse cx="-18" cy="18" rx="36" ry="46" fill="${c1}" stroke="${ink}" stroke-width="5"/><ellipse cx="14" cy="8" rx="30" ry="40" fill="${c1}" stroke="${ink}" stroke-width="5"/><rect x="-8" y="-96" width="16" height="120" fill="${c2}" stroke="${ink}" stroke-width="4"/><rect x="-24" y="-116" width="48" height="22" rx="3" fill="${c5}" stroke="${ink}" stroke-width="4"/></g></g>${commonText}`;
    case 'joplin':
      return `<g transform="translate(200 178)"><ellipse cx="0" cy="0" rx="96" ry="96" fill="${c1}" stroke="${ink}" stroke-width="5" stroke-dasharray="14 10"/><circle cx="-42" cy="-15" r="38" fill="none" stroke="${ink}" stroke-width="12"/><circle cx="-42" cy="-15" r="32" fill="${c2}" stroke="${ink}" stroke-width="4" opacity="0.8"/><circle cx="42" cy="-15" r="38" fill="none" stroke="${ink}" stroke-width="12"/><circle cx="42" cy="-15" r="32" fill="${c2}" stroke="${ink}" stroke-width="4" opacity="0.8"/><line x1="-4" y1="-15" x2="4" y2="-15" stroke="${ink}" stroke-width="12" stroke-linecap="round"/><g transform="translate(0 52)"><rect x="-14" y="-30" width="28" height="50" rx="14" fill="${c3}" stroke="${ink}" stroke-width="5"/><line x1="0" y1="20" x2="0" y2="90" stroke="${ink}" stroke-width="6"/><line x1="-14" y1="-10" x2="14" y2="-10" stroke="${ink}" stroke-width="3"/><line x1="0" y1="-30" x2="0" y2="20" stroke="${ink}" stroke-width="3"/></g></g>${commonText}`;
    case 'beatles':
      return `<g transform="translate(200 178)"><g transform="translate(-76 20)"><circle cx="0" cy="-45" r="18" fill="${ink}"/><path d="M-14-27 C-14-27-24 30-24 70 L 12 70 C 12 30 4-27 4-27 Z" fill="${ink}"/><path d="M-22-51 C-22-65 22-65 22-51 C 22-35-22-35-22-51" fill="${c3}"/></g><g transform="translate(-24 10)"><circle cx="0" cy="-45" r="18" fill="${ink}"/><path d="M-14-27 C-14-27-24 30-24 80 L 12 80 C 12 30 4-27 4-27 Z" fill="${ink}"/><path d="M-22-51 C-22-65 22-65 22-51 C 22-35-22-35-22-51" fill="${c1}"/></g><g transform="translate(28 15)"><circle cx="0" cy="-45" r="18" fill="${ink}"/><path d="M-14-27 C-14-27-20 30-20 75 L 12 75 C 12 30 4-27 4-27 Z" fill="${ink}"/><path d="M-22-51 C-22-65 22-65 22-51 C 22-35-22-35-22-51" fill="${c4}"/></g><g transform="translate(80 24)"><circle cx="0" cy="-45" r="18" fill="${ink}"/><path d="M-14-27 C-14-27-18 30-18 66 L 12 66 C 12 30 4-27 4-27 Z" fill="${ink}"/><path d="M-22-51 C-22-65 22-65 22-51 C 22-35-22-35-22-51" fill="${c2}"/></g></g>${commonText}`;
    case 'scorpions':
      return `<g transform="translate(200 178)"><g transform="rotate(-30)"><path d="M-60 60 L 0 -20 L 60 60 L 30 75 L 0 25 L -30 75 Z" fill="${c1}" stroke="${ink}" stroke-width="5"/><rect x="-8" y="-120" width="16" height="110" fill="${c2}" stroke="${ink}" stroke-width="4"/><rect x="-18" y="-136" width="36" height="18" rx="2" fill="${c4}" stroke="${ink}" stroke-width="4"/></g><path d="M-70 40 C-120 40-120-50-60-70 C-40-76-10-40-20-10 C-25 15-60 20-70 40" fill="none" stroke="${c3}" stroke-width="12" stroke-linecap="round"/><path d="M-70 40 C-120 40-120-50-60-70 C-40-76-10-40-20-10 C-25 15-60 20-70 40" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><path d="M-20-10 L-10-15 L-14-2 L-20-10" fill="${ink}"/></g>${commonText}`;
    case 'fret':
    default:
      return `<g transform="translate(200 178) rotate(10)"><rect x="-134" y="-76" width="268" height="152" fill="${c2}" stroke="${ink}" stroke-width="6"/>${[-98,-56,-14,28,70,112].map(x=>`<line x1="${x}" y1="-76" x2="${x}" y2="76" stroke="${ink}" stroke-width="4"/>`).join('')}${[-48,-16,16,48].map(y=>`<line x1="-134" y1="${y}" x2="134" y2="${y}" stroke="${paper}" stroke-width="3"/>`).join('')}<circle cx="-76" cy="-16" r="19" fill="${c1}" stroke="${ink}" stroke-width="5"/><circle cx="6" cy="18" r="19" fill="${c3}" stroke="${ink}" stroke-width="5"/><circle cx="88" cy="-46" r="19" fill="${c5}" stroke="${ink}" stroke-width="5"/></g>${commonText}`;
  }
}

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (char) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  }[char]));
}

function makeSvg(design, index) {
  const palette = colors[index % colors.length];
  const [c1, c2, c3, c4, c5, paper, ink] = palette;
  const [, title, quote, subtitle, motif] = design;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1600" viewBox="0 0 400 400" role="img" aria-labelledby="title desc">
<title id="title">${escapeXml(title)}</title>
<desc id="desc">${escapeXml(subtitle)}</desc>
<rect width="400" height="400" rx="10" fill="${paper}"/>
<path d="M0 0 H400 V400 H0Z" fill="${paper}"/>
${Array.from({ length: 15 }).map((_, i) => `<circle cx="${24 + i * 27}" cy="${38 + (i % 5) * 68}" r="${6 + (i % 4)}" fill="${[c1, c2, c3, c4, c5][i % 5]}" stroke="${ink}" stroke-width="3" opacity=".28"/>`).join('')}
<path d="M28 28 H372 V372 H28Z" fill="none" stroke="${ink}" stroke-width="6" stroke-dasharray="14 10"/>
${shape(motif, palette, index)}
<g transform="translate(200 54)">
<rect x="-152" y="-23" width="304" height="46" rx="4" fill="${index % 2 ? c2 : c5}" stroke="${ink}" stroke-width="5"/>
<text x="0" y="7" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="18" fill="${ink}">${escapeXml(quote)}</text>
</g>
</svg>
`;
}

fs.mkdirSync(assetDir, { recursive: true });

const products = [];
for (const [index, design] of designs.entries()) {
  const number = String(index + 1).padStart(2, '0');
  const [slug, title, , subtitle] = design;
  const baseName = `${number}-${slug}`;
  const svgRelativePath = `/private-assets/glamour-svg/${baseName}.svg`;
  const pngRelativePath = `/assets/glamour-svg/${baseName}.png`;
  const svg = makeSvg(design, index);

  fs.writeFileSync(path.join(assetDir, `${baseName}.svg`), svg, 'utf8');
  await sharp(Buffer.from(svg)).png().resize(1600, 1600).toFile(path.join(assetDir, `${baseName}.png`));

  products.push({
    id: `glamour-svg-${number}`,
    title: `${title} SVG License`,
    price: 6.99,
    type: 'Digital',
    category: 'Glamour Music SVG',
    musicType: 'Artwork',
    musicKey: 'All',
    image: pngRelativePath,
    filePath: svgRelativePath,
    format: 'svg',
    description: `${subtitle}. Includes a fixed-color SVG file that renders correctly in external SVG viewers.`,
  });
  products.push({
    id: `glamour-png-${number}`,
    title: `${title} PNG License`,
    price: 5.99,
    type: 'Digital',
    category: 'Glamour Music PNG',
    musicType: 'Artwork',
    musicKey: 'All',
    image: pngRelativePath,
    filePath: pngRelativePath,
    format: 'png',
    description: `${subtitle}. Includes a 1600px PNG export for immediate use.`,
  });
}

fs.writeFileSync(dataPath, `${JSON.stringify(products, null, 2)}\n`, 'utf8');
console.log(`Generated ${designs.length} SVG designs and ${products.length} digital products.`);
