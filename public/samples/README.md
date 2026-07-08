# Sheets-Media browser samples

This folder is reserved for browser-playable instrument samples used by `core/audio/SamplerPlaybackEngine.js`.

The app can use Tone.js Sampler when sample files exist here, and it falls back to the existing Soundfont player when they do not.

## Recommended free sources

- Salamander Grand Piano for piano.
- VSCO Community Edition for orchestral instruments.
- University of Iowa Musical Instrument Samples for acoustic orchestral/brass/woodwind source material. Verify redistribution terms before bundling.
- Philharmonia Orchestra samples for articulations. Verify redistribution terms before bundling.
- Freesound CC0 or CC BY samples for guitar, bass, ukulele, noises, articulations, and percussion. Prefer CC0 for app redistribution.
- Pianobook community libraries that can be converted from DecentSampler/Kontakt/SFZ-style packs into plain WAV/MP3 mappings.

## Expected structure

```txt
/public/samples/
  piano/salamander/
  guitar/nylon/
  bass/finger/
  double-bass/pizzicato/
  violin/sustain/
  trumpet/sustain/
  saxophone/alto-sustain/
  ukulele/
```

## Naming

Use the note names expected in `DEFAULT_SAMPLE_MAPS`, for example:

```txt
C3.mp3
D3.mp3
Fs3.mp3
A3.mp3
```

Sharp note filenames in maps use `Fs` instead of `F#` where file systems or tooling dislike `#` in URLs.

## Licensing note

Do not commit commercial or unclear-license samples. Keep attribution metadata for CC BY samples. Avoid CC BY-NC samples for commercial use.
