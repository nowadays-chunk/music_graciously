import React, { useEffect, useMemo, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { resolveChordDiagram, resolveChordLabelDiagram } from '@/core/music/chordDiagrams';

const EMPTY_OBJECT = Object.freeze({});

export default function VexChord({
  diagram: diagramProp,
  root,
  quality,
  shape,
  chordLabel,
  width = 140,
  height = 170,
  showTuning = false,
  diagramOptions,
  sx,
}) {
  const hostRef = useRef(null);
  const safeDiagramOptions = diagramOptions || EMPTY_OBJECT;
  const safeSx = sx || EMPTY_OBJECT;

  const diagram = useMemo(() => {
    if (diagramProp) {
      return diagramProp;
    }

    if (root && quality) {
      return resolveChordDiagram({
        root,
        quality,
        shape,
        label: chordLabel,
      });
    }

    if (chordLabel) {
      return resolveChordLabelDiagram(chordLabel);
    }

    return null;
  }, [chordLabel, diagramProp, root, quality, shape]);

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;

    if (!host || !diagram) return undefined;

    host.innerHTML = '';

    async function renderChord() {
      const { ChordBox } = await import('vexchords');
      if (cancelled || !host) return;

      host.innerHTML = '';

      new ChordBox(host, {
        width,
        height,
        numFrets: diagram.numFrets,
        showTuning,
        defaultColor: '#0f172a',
        strokeColor: '#0f172a',
        textColor: '#334155',
        stringColor: '#94a3b8',
        fretColor: '#cbd5e1',
        bgColor: '#ffffff',
        fontFamily: 'inherit',
        fontWeight: '500',
        labelWeight: '600',
        ...safeDiagramOptions,
      }).draw({
        chord: diagram.chord,
        position: diagram.position,
        tuning: diagram.tuning,
      });
    }

    renderChord().catch((error) => {
      console.error('Failed to render VexChord diagram', error);
    });

    return () => {
      cancelled = true;
      if (host) {
        host.innerHTML = '';
      }
    };
  }, [diagram, height, safeDiagramOptions, showTuning, width]);

  if (!diagram) {
    return (
      <Box
        sx={{
          width,
          height,
          border: '1px dashed #cbd5e1',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 1.5,
          ...safeSx,
        }}
      >
        <Typography variant="caption" color="text.secondary" align="center">
          Diagram unavailable
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={hostRef}
      sx={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': {
          width: '100%',
          height: '100%',
        },
        ...safeSx,
      }}
    />
  );
}
