import React from 'react';
import { useRouter } from 'next/router';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  GuitarIcon,
  PianoIcon,
  UkuleleIcon,
  ViolinIcon,
  BassIcon,
  DoubleBassIcon,
  TrumpetIcon,
  SaxophoneIcon
} from '../Graphics/BrutalistIcons';

const SelectorContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  justifyContent: 'center',
  padding: '16px',
  marginBottom: '20px',
  background: 'var(--brutal-mint)',
  border: '4px solid var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow)',
  borderRadius: 4,
});

const InstrumentButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ active }) => ({
  borderRadius: 4,
  padding: '8px 16px',
  background: active ? 'var(--brutal-yellow)' : 'var(--brutal-paper)',
  color: 'var(--brutal-ink)',
  border: '3px solid var(--brutal-ink)',
  boxShadow: active ? 'var(--brutal-shadow-small)' : '2px 2px 0 var(--brutal-ink)',
  fontWeight: 900,
  fontSize: '14px',
  textTransform: 'none',
  transition: 'all 0.15s ease',
  '&:hover': {
    background: active ? 'var(--brutal-pink)' : 'var(--brutal-yellow)',
    transform: 'translate(2px, 2px)',
    boxShadow: 'none',
  },
}));

const INSTRUMENTS = [
  { id: 'guitar', label: 'Guitar', Icon: GuitarIcon },
  { id: 'piano', label: 'Piano', Icon: PianoIcon },
  { id: 'ukulele', label: 'Ukulele', Icon: UkuleleIcon },
  { id: 'violin', label: 'Violin', Icon: ViolinIcon },
  { id: 'bass', label: 'Bass', Icon: BassIcon },
  { id: 'double-bass', label: 'Double Bass', Icon: DoubleBassIcon },
  { id: 'trumpet', label: 'Trumpet', Icon: TrumpetIcon },
  { id: 'saxophone', label: 'Saxophone', Icon: SaxophoneIcon },
];

const renderInstrumentIcon = (Icon, size = 18) => {
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
        '& svg': { width: `${size}px !important`, height: `${size}px !important`, margin: '0 !important', display: 'inline-block !important' },
      }}
    >
      <Icon size={size} />
    </Box>
  );
};

const InstrumentSelector = ({ activeInstrument }) => {
  const router = useRouter();

  const handleSelect = (id) => {
    if (id === activeInstrument) return;

    // The current route may be the shallow /play/[instrument] page or the deep
    // /play/[instrument]/[key]/[category]/[type]/[display]/[[...mode]] page.
    // In both cases the path segments beyond the instrument live in router.query.
    const { key, category, type, display, mode } = router.query;

    if (key && category && type && display) {
      // Reconstruct the full nested path, swapping only the instrument segment.
      let path = `/play/${id}/${key}/${category}/${type}/${display}`;
      if (mode) {
        const modeSegment = Array.isArray(mode) ? mode.join('/') : mode;
        path += `/${modeSegment}`;
      }
      router.push(path);
    } else {
      // Fallback: only the instrument is known (e.g. coming from /play/[instrument]).
      router.push(`/play/${id}`);
    }
  };

  return (
    <SelectorContainer>
      {INSTRUMENTS.map((inst) => (
        <InstrumentButton
          key={inst.id}
          active={activeInstrument === inst.id ? 1 : 0}
          onClick={() => handleSelect(inst.id)}
          startIcon={renderInstrumentIcon(inst.Icon, 18)}
        >
          {inst.label}
        </InstrumentButton>
      ))}
    </SelectorContainer>
  );
};

export default InstrumentSelector;
