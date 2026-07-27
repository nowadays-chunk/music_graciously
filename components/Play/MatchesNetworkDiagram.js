import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Box, Typography, Button, MenuItem, Select, InputLabel,
  FormControl, Grid, Chip, Divider, Checkbox, FormControlLabel,
  TextField, InputAdornment, IconButton, Slider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import guitar from '../../config/guitar';
import { CHORD_PROGRESSIONS, progressionInKey } from '../../config/chordProgressions';
import { getAbsoluteNotes, getNoteName } from '../../core/music/musicTheory';
import { getSoundfontInstrument } from '../../core/audio/AudioService';

const PageContainer = styled(Box)({
  maxWidth: 1400,
  margin: '0 auto',
  padding: '0 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

const BrutalCard = styled(Box)({
  background: 'rgba(255, 253, 245, 0.95)',
  border: '4px solid var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow)',
  borderRadius: 4,
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const ControlPanel = styled(Box)({
  background: 'var(--brutal-mint)',
  border: '4px solid var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow-small)',
  borderRadius: 4,
  padding: '16px 20px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  alignItems: 'center',
});

const SelectWrapper = styled(FormControl)({
  minWidth: 160,
  '& .MuiOutlinedInput-root': {
    border: '3px solid var(--brutal-ink)',
    borderRadius: 4,
    backgroundColor: 'var(--brutal-paper)',
    boxShadow: '2px 2px 0 var(--brutal-ink)',
    fontWeight: 900,
    fontSize: '0.9rem',
    '& fieldset': { border: 'none' },
    '&:hover': { backgroundColor: 'var(--brutal-yellow)' },
    '&.Mui-focused': { backgroundColor: 'var(--brutal-yellow)', boxShadow: 'none' },
  },
  '& .MuiInputLabel-root': { fontWeight: 900, color: 'var(--brutal-ink)' },
});

const BrutalTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    border: '3px solid var(--brutal-ink)',
    borderRadius: 4,
    backgroundColor: 'var(--brutal-paper)',
    boxShadow: '2px 2px 0 var(--brutal-ink)',
    fontWeight: 700,
    '& fieldset': { border: 'none' },
  },
});

const BrutalButton = styled(Button)(({ bgcolor = 'var(--brutal-yellow)', hovercolor = 'var(--brutal-pink)' }) => ({
  borderRadius: 4,
  border: '3px solid var(--brutal-ink)',
  background: bgcolor,
  color: 'var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow-small)',
  fontWeight: 900,
  textTransform: 'none',
  padding: '8px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '&:hover': { background: hovercolor, transform: 'translate(2px,2px)', boxShadow: 'none' },
}));

const LabelChip = styled(Chip)({
  border: '2px solid var(--brutal-ink)',
  fontWeight: 800,
  borderRadius: 4,
  fontSize: '0.85rem',
  boxShadow: '1px 1px 0 var(--brutal-ink)',
});

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SCALE_KEYS = Object.keys(guitar.scales);
const ARP_KEYS = Object.keys(guitar.arppegios);
const INTERVAL_TO_SEMITONES = {
  '1':0, b2:1, '2':2, b3:3, '3':4, '4':5, b5:6, '#4':6,
  '5':7, '#5':8, b6:8, '6':9, bb7:9, b7:10, '7':11,
  b9:1, '9':2, '#9':3, '11':5, '#11':6, '13':9,
};

const MatchesNetworkDiagram = () => {
  const [selectedKeyIndex, setSelectedKeyIndex] = useState(0);
  const [colorMode, setColorMode] = useState('category');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScaleChord, setShowScaleChord] = useState(true);
  const [showChordChord, setShowChordChord] = useState(false);
  const [showScaleScale, setShowScaleScale] = useState(false);
  const [showScales, setShowScales] = useState(true);
  const [showModes, setShowModes] = useState(true);
  const [showChords, setShowChords] = useState(true);
  const [physicsActive, setPhysicsActive] = useState(false);
  const [springLength, setSpringLength] = useState(150);
  const [layoutMode, setLayoutMode] = useState('poster');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedProgressionId, setSelectedProgressionId] = useState('');
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const playTimeoutRef = useRef([]);
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const nodesDataSetRef = useRef(null);
  const edgesDataSetRef = useRef(null);
  const physicsActiveRef = useRef(physicsActive);
  const springLengthRef = useRef(springLength);
  physicsActiveRef.current = physicsActive;
  springLengthRef.current = springLength;

  const selectedKey = KEYS[selectedKeyIndex];
  const preferFlats = [1, 3, 5, 8, 10].includes(selectedKeyIndex);
  const selectedProgression = useMemo(
    () => CHORD_PROGRESSIONS.find((progression) => progression.id === selectedProgressionId) || null,
    [selectedProgressionId]
  );

  useEffect(() => {
    setPhysicsActive(layoutMode !== 'poster' && !selectedProgression);
  }, [layoutMode, selectedProgression]);

  const loadAudioPlayer = async () => {
    if (player) return player;
    setLoadingAudio(true);
    try {
      const nextPlayer = await getSoundfontInstrument('acoustic_grand_piano');
      setPlayer(nextPlayer);
      return nextPlayer;
    } catch (error) {
      console.error('Failed to load soundfont player:', error);
      return null;
    } finally {
      setLoadingAudio(false);
    }
  };

  const stopSequence = useCallback(() => {
    playTimeoutRef.current.forEach(clearTimeout);
    playTimeoutRef.current = [];
    setIsPlaying(false);
  }, []);

  const playSequence = async (node) => {
    if (isPlaying) {
      stopSequence();
      return;
    }
    const activePlayer = player || (await loadAudioPlayer());
    if (!activePlayer) return;
    setIsPlaying(true);
    stopSequence();
    node.notes.forEach((noteIdx, index) => {
      const timeout = setTimeout(() => {
        activePlayer.play(`${getNoteName(noteIdx, preferFlats)}4`);
        if (index === node.notes.length - 1) setIsPlaying(false);
      }, index * 400);
      playTimeoutRef.current.push(timeout);
    });
  };

  useEffect(() => () => playTimeoutRef.current.forEach(clearTimeout), []);

  const allNodes = useMemo(() => {
    const nodes = [];
    SCALE_KEYS.forEach((scaleKey) => {
      const scale = guitar.scales[scaleKey];
      if (!scale) return;
      if (scale.modes && scale.isModal) {
        scale.modes.forEach((mode, modeIndex) => {
          nodes.push({
            id: `scale_${scaleKey}_mode_${modeIndex}`,
            label: `${selectedKey} ${mode.name}`,
            type: 'scale',
            subType: scaleKey,
            modeIndex,
            name: mode.name,
            notes: getAbsoluteNotes('scale', scaleKey, selectedKeyIndex, modeIndex),
            intervals: mode.intervals || scale.intervals || [],
            description: mode.description || `The ${mode.name} mode of the ${scale.name} scale.`,
          });
        });
      } else {
        nodes.push({
          id: `scale_${scaleKey}`,
          label: `${selectedKey} ${scale.name || scaleKey}`,
          type: 'scale',
          subType: scaleKey,
          modeIndex: null,
          name: scale.name || scaleKey,
          notes: getAbsoluteNotes('scale', scaleKey, selectedKeyIndex),
          intervals: scale.intervals || [],
          description: scale.description || `The ${scale.name || scaleKey} scale.`,
        });
      }
    });
    ARP_KEYS.forEach((arpKey) => {
      const chord = guitar.arppegios[arpKey];
      if (!chord) return;
      nodes.push({
        id: `chord_${arpKey}`,
        label: `${selectedKey} ${chord.name || arpKey}`,
        type: 'chord',
        subType: arpKey,
        modeIndex: null,
        name: chord.name || arpKey,
        notes: getAbsoluteNotes('arppegio', arpKey, selectedKeyIndex),
        intervals: chord.intervals || [],
        description: chord.description || `The ${chord.name || arpKey} chord / arpeggio.`,
      });
    });
    return nodes;
  }, [selectedKeyIndex, selectedKey]);

  const progressionSteps = useMemo(() => {
    if (!selectedProgression) return [];
    return progressionInKey(selectedProgression, selectedKeyIndex, getNoteName, preferFlats).map((step, index) => {
      const chordData = guitar.arppegios[step.quality] || guitar.arppegios.M;
      const notes = (chordData.intervals || []).map((interval) => (
        step.rootIndex + (INTERVAL_TO_SEMITONES[interval] ?? 0)
      ) % 12);
      return { ...step, index, notes: [...new Set(notes)], chordData };
    });
  }, [selectedProgression, selectedKeyIndex, preferFlats]);

  const progressionUnion = useMemo(() => {
    const notes = new Set();
    progressionSteps.forEach((step) => step.notes.forEach((note) => notes.add(note)));
    return [...notes].sort((a, b) => a - b);
  }, [progressionSteps]);

  const progressionIntersection = useMemo(() => {
    if (!progressionSteps.length) return [];
    return progressionSteps[0].notes.filter((note) => progressionSteps.every((step) => step.notes.includes(note)));
  }, [progressionSteps]);

  const progressionWorkflow = useMemo(() => {
    if (!selectedProgression) return null;
    const nodes = [];
    const edges = [];
    const scaleUsage = {};
    const modeUsage = {};
    const noteUsage = {};

    progressionSteps.forEach((step, stepIndex) => {
      step.notes.forEach((note) => { noteUsage[note] = (noteUsage[note] || 0) + 1; });
      const chordId = `progression_chord_${stepIndex}`;
      const chordX = stepIndex * 430;
      nodes.push({
        id: chordId,
        label: `${stepIndex + 1}. ${step.roman}\n${step.label}`,
        type: 'progression-chord',
        name: step.label,
        notes: step.notes,
        intervals: step.chordData.intervals || [],
        description: `Step ${stepIndex + 1} of ${selectedProgression.name}.`,
        x: chordX,
        y: 240,
        fixed: { x: true, y: true },
        shape: 'box',
        margin: 18,
        widthConstraint: { minimum: 150, maximum: 190 },
        heightConstraint: { minimum: 72 },
        borderWidth: 4,
        color: { background: '#fef08a', border: '#1a1a1a', highlight: { background: '#ff007f', border: '#1a1a1a' } },
        font: { size: 17, face: 'Open Sans, sans-serif', color: '#1a1a1a', bold: true, multi: true },
        shadow: { enabled: true, color: '#1a1a1a', size: 0, x: 5, y: 5 },
      });

      const compatibleScales = [];
      SCALE_KEYS.forEach((scaleKey) => {
        const scale = guitar.scales[scaleKey];
        if (!scale) return;
        const scaleNotes = getAbsoluteNotes('scale', scaleKey, step.rootIndex);
        if (step.notes.every((note) => scaleNotes.includes(note))) {
          compatibleScales.push({ scaleKey, scale, notes: scaleNotes });
        }
      });

      compatibleScales.slice(0, 4).forEach((entry, scaleIndex) => {
        const scaleId = `progression_scale_${stepIndex}_${entry.scaleKey}`;
        const scaleX = chordX + (scaleIndex - (Math.min(compatibleScales.length, 4) - 1) / 2) * 145;
        const scaleLabel = `${getNoteName(step.rootIndex, preferFlats)} ${entry.scale.name || entry.scaleKey}`;
        scaleUsage[scaleLabel] = (scaleUsage[scaleLabel] || 0) + 1;
        nodes.push({
          id: scaleId,
          label: scaleLabel,
          type: 'progression-scale',
          name: scaleLabel,
          notes: entry.notes,
          intervals: entry.scale.intervals || [],
          description: `Parent scale compatible with ${step.label}.`,
          x: scaleX,
          y: 40,
          fixed: { x: true, y: true },
          shape: 'box',
          margin: 12,
          widthConstraint: { minimum: 130, maximum: 165 },
          borderWidth: 3,
          color: { background: '#99f6e4', border: '#1a1a1a', highlight: { background: '#2dd4bf', border: '#1a1a1a' } },
          font: { size: 14, face: 'Open Sans, sans-serif', color: '#1a1a1a', bold: true },
          shadow: { enabled: true, color: '#1a1a1a', size: 0, x: 4, y: 4 },
        });
        edges.push({
          id: `edge_${chordId}_${scaleId}`,
          from: chordId,
          to: scaleId,
          arrows: { to: { enabled: true, scaleFactor: 0.7 } },
          width: 2.5,
          color: { color: '#1a1a1a', highlight: '#ff007f' },
          smooth: { enabled: true, type: 'cubicBezier', forceDirection: 'vertical', roundness: 0.18 },
        });

        const playableModes = [];
        if (entry.scale.modes && entry.scale.modes.length) {
          entry.scale.modes.forEach((mode, modeIndex) => {
            const modeNotes = getAbsoluteNotes('scale', entry.scaleKey, step.rootIndex, modeIndex);
            if (step.notes.every((note) => modeNotes.includes(note))) {
              playableModes.push({ mode, modeIndex, notes: modeNotes });
            }
          });
        }

        playableModes.slice(0, 3).forEach((modeEntry, modeIndex) => {
          const modeId = `progression_mode_${stepIndex}_${entry.scaleKey}_${modeEntry.modeIndex}`;
          const modeLabel = `${getNoteName(step.rootIndex, preferFlats)} ${modeEntry.mode.name}`;
          modeUsage[modeLabel] = (modeUsage[modeLabel] || 0) + 1;
          nodes.push({
            id: modeId,
            label: modeLabel,
            type: 'progression-mode',
            name: modeLabel,
            notes: modeEntry.notes,
            intervals: modeEntry.mode.intervals || entry.scale.intervals || [],
            description: `Playable mode above ${scaleLabel} for ${step.label}.`,
            x: scaleX + (modeIndex - (Math.min(playableModes.length, 3) - 1) / 2) * 105,
            y: -145,
            fixed: { x: true, y: true },
            shape: 'box',
            margin: 10,
            widthConstraint: { minimum: 110, maximum: 145 },
            borderWidth: 3,
            color: { background: '#e9d5ff', border: '#1a1a1a', highlight: { background: '#c084fc', border: '#1a1a1a' } },
            font: { size: 12, face: 'Open Sans, sans-serif', color: '#1a1a1a', bold: true },
            shadow: { enabled: true, color: '#1a1a1a', size: 0, x: 3, y: 3 },
          });
          edges.push({
            id: `edge_${scaleId}_${modeId}`,
            from: scaleId,
            to: modeId,
            arrows: { to: { enabled: true, scaleFactor: 0.65 } },
            width: 2,
            color: { color: '#6b21a8', highlight: '#ff007f' },
            smooth: { enabled: true, type: 'cubicBezier', forceDirection: 'vertical', roundness: 0.15 },
          });
        });
      });

      if (stepIndex < progressionSteps.length - 1) {
        edges.push({
          id: `edge_progression_${stepIndex}_${stepIndex + 1}`,
          from: chordId,
          to: `progression_chord_${stepIndex + 1}`,
          arrows: { to: { enabled: true, scaleFactor: 0.85 } },
          width: 4,
          color: { color: '#ff007f', highlight: '#ff007f' },
          smooth: { enabled: true, type: 'horizontal', roundness: 0.08 },
        });
      }
    });

    return { nodes, edges, scaleUsage, modeUsage, noteUsage };
  }, [selectedProgression, progressionSteps, preferFlats]);

  const isSubset = (subset, superset) => subset.every((value) => superset.includes(value));

  const fullDegrees = useMemo(() => {
    const degrees = Object.fromEntries(allNodes.map((node) => [node.id, 0]));
    allNodes.forEach((nodeA) => {
      allNodes.forEach((nodeB) => {
        if (nodeA.id === nodeB.id) return;
        if (nodeA.type === 'scale' && nodeB.type === 'chord' && isSubset(nodeB.notes, nodeA.notes)) {
          degrees[nodeA.id] += 1;
          degrees[nodeB.id] += 1;
        }
        if (nodeA.type === 'chord' && nodeB.type === 'chord' && nodeA.notes.length < nodeB.notes.length && isSubset(nodeA.notes, nodeB.notes)) {
          degrees[nodeA.id] += 1;
          degrees[nodeB.id] += 1;
        }
        if (nodeA.type === 'scale' && nodeB.type === 'scale' && nodeA.notes.length < nodeB.notes.length && isSubset(nodeA.notes, nodeB.notes)) {
          degrees[nodeA.id] += 1;
          degrees[nodeB.id] += 1;
        }
      });
    });
    return degrees;
  }, [allNodes]);

  const minMaxDegrees = useMemo(() => {
    const values = Object.values(fullDegrees);
    return { min: Math.min(...values, 0), max: Math.max(...values, 1) };
  }, [fullDegrees]);

  const fullNetworkData = useMemo(() => {
    const filteredNodes = allNodes.filter((node) => {
      if (node.type === 'scale' && node.modeIndex === null && !showScales) return false;
      if (node.type === 'scale' && node.modeIndex !== null && !showModes) return false;
      if (node.type === 'chord' && !showChords) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const haystack = `${node.name} ${node.notes.map((note) => getNoteName(note, preferFlats)).join(' ')} ${node.intervals.join(' ')}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
    const filteredIds = new Set(filteredNodes.map((node) => node.id));
    const edges = [];
    if (showScaleChord) {
      allNodes.forEach((scale) => {
        if (scale.type !== 'scale' || !filteredIds.has(scale.id)) return;
        allNodes.forEach((chord) => {
          if (chord.type !== 'chord' || !filteredIds.has(chord.id)) return;
          if (isSubset(chord.notes, scale.notes)) edges.push({ id: `edge_${scale.id}_${chord.id}`, from: scale.id, to: chord.id, width: 1.5, color: { color: 'rgba(26,26,26,0.12)', highlight: '#ff007f' } });
        });
      });
    }
    if (showChordChord) {
      allNodes.forEach((small) => {
        if (small.type !== 'chord' || !filteredIds.has(small.id)) return;
        allNodes.forEach((large) => {
          if (large.type !== 'chord' || !filteredIds.has(large.id) || small.id === large.id) return;
          if (small.notes.length < large.notes.length && isSubset(small.notes, large.notes)) edges.push({ id: `edge_${small.id}_${large.id}`, from: small.id, to: large.id, arrows: { to: { enabled: true, scaleFactor: 0.5 } }, width: 1.5, color: { color: 'rgba(54,162,235,0.25)', highlight: '#36a2eb' } });
        });
      });
    }
    if (showScaleScale) {
      allNodes.forEach((small) => {
        if (small.type !== 'scale' || !filteredIds.has(small.id)) return;
        allNodes.forEach((large) => {
          if (large.type !== 'scale' || !filteredIds.has(large.id) || small.id === large.id) return;
          if (small.notes.length < large.notes.length && isSubset(small.notes, large.notes)) edges.push({ id: `edge_${small.id}_${large.id}`, from: small.id, to: large.id, arrows: { to: { enabled: true, scaleFactor: 0.5 } }, width: 1.5, color: { color: 'rgba(75,192,192,0.25)', highlight: '#4bc0c0' } });
        });
      });
    }
    const activeDegrees = Object.fromEntries(filteredNodes.map((node) => [node.id, 0]));
    edges.forEach((edge) => {
      if (activeDegrees[edge.from] !== undefined) activeDegrees[edge.from] += 1;
      if (activeDegrees[edge.to] !== undefined) activeDegrees[edge.to] += 1;
    });
    return { nodes: filteredNodes.filter((node) => activeDegrees[node.id] > 0), edges };
  }, [allNodes, showScaleChord, showChordChord, showScaleScale, showScales, showModes, showChords, searchQuery, preferFlats]);

  const fullVisNetwork = useMemo(() => {
    const { min, max } = minMaxDegrees;
    const partitions = { scales: [], modes: [], chords: [] };
    fullNetworkData.nodes.forEach((node) => {
      if (node.type === 'scale' && node.modeIndex === null) partitions.scales.push(node);
      else if (node.type === 'scale') partitions.modes.push(node);
      else partitions.chords.push(node);
    });
    const coords = {};
    if (layoutMode === 'poster') {
      partitions.scales.forEach((node, index) => { coords[node.id] = { x: -360, y: (index - (partitions.scales.length - 1) / 2) * 100 }; });
      partitions.modes.forEach((node, index) => { coords[node.id] = { x: 0, y: (index - (partitions.modes.length - 1) / 2) * 70 }; });
      partitions.chords.forEach((node, index) => { coords[node.id] = { x: 360, y: (index - (partitions.chords.length - 1) / 2) * 80 }; });
    }
    const nodes = fullNetworkData.nodes.map((node) => {
      const degree = fullDegrees[node.id] || 0;
      const commonality = (degree - min) / (max - min || 1);
      let background = node.type === 'chord' ? '#fef08a' : node.modeIndex === null ? '#99f6e4' : '#e9d5ff';
      if (colorMode === 'degree') background = commonality > 0.6 ? 'var(--brutal-yellow)' : commonality > 0.2 ? 'var(--brutal-mint)' : 'var(--brutal-pink)';
      const result = {
        id: node.id,
        label: node.label,
        shape: 'box',
        margin: 10,
        borderWidth: 3,
        color: { background, border: 'var(--brutal-ink)', highlight: { background: '#ff007f', border: 'var(--brutal-ink)' } },
        font: { size: 12 + Math.round(commonality * 8), face: 'Open Sans, sans-serif', color: '#1a1a1a', bold: true },
        shadow: { enabled: true, color: 'var(--brutal-ink)', size: 0, x: 4, y: 4 },
      };
      if (layoutMode === 'poster') {
        result.x = coords[node.id]?.x || 0;
        result.y = coords[node.id]?.y || 0;
        result.fixed = { x: true, y: true };
      }
      return result;
    });
    return { nodes, edges: fullNetworkData.edges };
  }, [fullNetworkData, minMaxDegrees, fullDegrees, colorMode, layoutMode]);

  const activeVisNetwork = selectedProgression ? progressionWorkflow : fullVisNetwork;
  const activeNodeSource = selectedProgression ? progressionWorkflow?.nodes || [] : allNodes;
  const selectedNode = useMemo(
    () => activeNodeSource.find((node) => node.id === selectedNodeId) || null,
    [selectedNodeId, activeNodeSource]
  );

  useEffect(() => {
    if (!containerRef.current) return undefined;
    if (networkRef.current) networkRef.current.destroy();
    const nodesDataSet = new DataSet(activeVisNetwork.nodes);
    const edgesDataSet = new DataSet(activeVisNetwork.edges);
    nodesDataSetRef.current = nodesDataSet;
    edgesDataSetRef.current = edgesDataSet;
    const progressionMode = Boolean(selectedProgression);
    const network = new Network(containerRef.current, { nodes: nodesDataSet, edges: edgesDataSet }, {
      physics: { enabled: !progressionMode && layoutMode !== 'poster' && physicsActiveRef.current, barnesHut: { gravitationalConstant: -1800, centralGravity: 0.5, springLength: springLengthRef.current, springConstant: 0.04, damping: 0.8, avoidOverlap: 1 } },
      edges: { smooth: progressionMode ? true : layoutMode === 'poster' ? false : { type: 'continuous', roundness: 0.5 } },
      interaction: { hover: true, zoomView: true, dragView: true, selectConnectedEdges: false },
    });
    networkRef.current = network;
    network.on('click', (params) => setSelectedNodeId(params.nodes[0] || null));
    setTimeout(() => {
      if (networkRef.current) networkRef.current.fit({ animation: false });
    }, 0);
    return () => {
      if (networkRef.current) networkRef.current.destroy();
      networkRef.current = null;
    };
  }, [activeVisNetwork, selectedProgressionId, selectedKeyIndex, layoutMode]);

  const sortedUsage = (usage) => Object.entries(usage || {}).sort((a, b) => b[1] - a[1]);
  const handleResetCamera = () => networkRef.current?.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });

  return (
    <PageContainer>
      <Box sx={{ borderBottom: '4px solid var(--brutal-ink)', pb: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>🔗 Matches Network</Typography>
        <Typography sx={{ fontWeight: 700, opacity: 0.8, maxWidth: 900 }}>
          Explore the complete theory network, or select a progression to switch to a focused three-level workflow.
        </Typography>
      </Box>

      <ControlPanel>
        <SelectWrapper>
          <InputLabel id="key-select-label">Root Key</InputLabel>
          <Select labelId="key-select-label" value={selectedKeyIndex} label="Root Key" onChange={(event) => { setSelectedKeyIndex(event.target.value); setSelectedNodeId(null); }}>
            {KEYS.map((key, index) => <MenuItem key={key} value={index}>{key}</MenuItem>)}
          </Select>
        </SelectWrapper>
        {!selectedProgression && (
          <>
            <SelectWrapper>
              <InputLabel id="color-select-label">Coloring Mode</InputLabel>
              <Select labelId="color-select-label" value={colorMode} label="Coloring Mode" onChange={(event) => setColorMode(event.target.value)}>
                <MenuItem value="category">Category</MenuItem>
                <MenuItem value="degree">Commonality</MenuItem>
              </Select>
            </SelectWrapper>
            <SelectWrapper>
              <InputLabel id="layout-select-label">Layout Mode</InputLabel>
              <Select labelId="layout-select-label" value={layoutMode} label="Layout Mode" onChange={(event) => setLayoutMode(event.target.value)}>
                <MenuItem value="poster">Mind-Map Poster</MenuItem>
                <MenuItem value="network">Interactive Network</MenuItem>
              </Select>
            </SelectWrapper>
            <BrutalTextField size="small" placeholder="Search (Dorian, Maj7...)" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
          </>
        )}
        <BrutalButton onClick={handleResetCamera}><RestartAltIcon /> Reset View</BrutalButton>
      </ControlPanel>

      <BrutalCard sx={{ bgcolor: 'var(--brutal-yellow)' }}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>Chord Progression Workflow</Typography>
        <SelectWrapper sx={{ minWidth: 360, maxWidth: 640 }}>
          <InputLabel id="progression-select-label">Chord Progression</InputLabel>
          <Select
            labelId="progression-select-label"
            value={selectedProgressionId}
            label="Chord Progression"
            onChange={(event) => {
              setSelectedNodeId(null);
              setSelectedProgressionId(event.target.value);
            }}
            renderValue={(value) => {
              if (!value) return 'None — show complete theory network';
              const progression = CHORD_PROGRESSIONS.find((item) => item.id === value);
              return progression ? `${progression.name} — ${progression.songs.join(' • ')}` : '';
            }}
          >
            <MenuItem value="">None — show complete theory network</MenuItem>
            {CHORD_PROGRESSIONS.map((progression) => (
              <MenuItem key={progression.id} value={progression.id} sx={{ alignItems: 'flex-start', py: 1.25 }}>
                <Box>
                  <Typography sx={{ fontWeight: 900 }}>{progression.name}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.75 }}>{progression.songs.join(' • ')}</Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </SelectWrapper>

        {selectedProgression && (
          <>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>{selectedProgression.name} in {selectedKey}</Typography>
            <Box>
              <Typography sx={{ fontWeight: 900, textTransform: 'uppercase' }}>Songs using this progression</Typography>
              {selectedProgression.songs.map((song) => (
                <Typography key={song} sx={{ fontWeight: 800 }}>• {song}</Typography>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {progressionSteps.map((step) => <LabelChip key={`${step.index}-${step.roman}`} label={`${step.index + 1}. ${step.roman}: ${step.label}`} sx={{ bgcolor: 'var(--brutal-paper)' }} />)}
            </Box>
            <Divider sx={{ borderBottomWidth: 3, borderColor: 'var(--brutal-ink)' }} />
            <Typography sx={{ fontWeight: 900 }}>Common notes through the whole progression</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {progressionIntersection.length
                ? progressionIntersection.map((note) => <LabelChip key={note} label={getNoteName(note, preferFlats)} sx={{ bgcolor: 'var(--brutal-mint)' }} />)
                : <Typography sx={{ fontWeight: 700 }}>No single chord tone appears in every chord.</Typography>}
            </Box>
          </>
        )}
      </BrutalCard>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8.5}>
          <BrutalCard sx={{ overflow: 'hidden' }}>
            {!selectedProgression && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, borderBottom: '3px solid var(--brutal-ink)', pb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <FormControlLabel control={<Checkbox checked={showScales} onChange={(event) => setShowScales(event.target.checked)} />} label="Parent Scales" />
                  <FormControlLabel control={<Checkbox checked={showModes} onChange={(event) => setShowModes(event.target.checked)} />} label="Modes" />
                  <FormControlLabel control={<Checkbox checked={showChords} onChange={(event) => setShowChords(event.target.checked)} />} label="Chords" />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <FormControlLabel control={<Checkbox checked={showScaleChord} onChange={(event) => setShowScaleChord(event.target.checked)} />} label="Chord-Scale" />
                  <FormControlLabel control={<Checkbox checked={showChordChord} onChange={(event) => setShowChordChord(event.target.checked)} />} label="Chord Containment" />
                  <FormControlLabel control={<Checkbox checked={showScaleScale} onChange={(event) => setShowScaleScale(event.target.checked)} />} label="Scale Containment" />
                </Box>
              </Box>
            )}
            {physicsActive && !selectedProgression && layoutMode !== 'poster' && <Slider value={springLength} min={80} max={300} onChange={(event, value) => setSpringLength(value)} />}
            <Box ref={containerRef} sx={{ width: '100%', height: selectedProgression ? 760 : 650, border: '3px solid var(--brutal-ink)', bgcolor: 'var(--brutal-paper)' }} />
          </BrutalCard>
        </Grid>

        <Grid item xs={12} lg={3.5}>
          <BrutalCard sx={{ minHeight: selectedProgression ? 760 : 650 }}>
            {selectedNode ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>{selectedNode.label}</Typography>
                  <IconButton onClick={() => setSelectedNodeId(null)}>×</IconButton>
                </Box>
                <Typography sx={{ fontWeight: 700 }}>{selectedNode.description}</Typography>
                <Typography sx={{ fontWeight: 900 }}>Notes</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{selectedNode.notes.map((note) => <LabelChip key={note} label={getNoteName(note, preferFlats)} />)}</Box>
                <Typography sx={{ fontWeight: 900 }}>Intervals</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{selectedNode.intervals.map((interval) => <LabelChip key={interval} label={interval} sx={{ bgcolor: 'var(--brutal-yellow)' }} />)}</Box>
                <BrutalButton onClick={() => playSequence(selectedNode)} disabled={loadingAudio}>{isPlaying ? <StopIcon /> : <PlayArrowIcon />} {isPlaying ? 'Stop' : 'Play'}</BrutalButton>
              </>
            ) : selectedProgression ? (
              <>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>Progression Statistics</Typography>
                <Typography sx={{ fontWeight: 900 }}>Chords: {progressionSteps.length}</Typography>
                <Typography sx={{ fontWeight: 900 }}>Distinct notes: {progressionUnion.length}</Typography>
                <Typography sx={{ fontWeight: 900 }}>Common notes: {progressionIntersection.length}</Typography>
                <Divider sx={{ borderBottomWidth: 3, borderColor: 'var(--brutal-ink)' }} />
                <Typography sx={{ fontWeight: 900 }}>Most used notes</Typography>
                {sortedUsage(progressionWorkflow?.noteUsage).slice(0, 8).map(([note, count]) => <Typography key={note} sx={{ fontWeight: 700 }}>{getNoteName(Number(note), preferFlats)} — {count} chord{count === 1 ? '' : 's'}</Typography>)}
                <Typography sx={{ fontWeight: 900, mt: 2 }}>Most reused parent scales</Typography>
                {sortedUsage(progressionWorkflow?.scaleUsage).slice(0, 8).map(([name, count]) => <Typography key={name} sx={{ fontWeight: 700 }}>{name} — {count}</Typography>)}
                <Typography sx={{ fontWeight: 900, mt: 2 }}>Most reusable modes</Typography>
                {sortedUsage(progressionWorkflow?.modeUsage).slice(0, 8).map(([name, count]) => <Typography key={name} sx={{ fontWeight: 700 }}>{name} — {count}</Typography>)}
              </>
            ) : (
              <>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>Complete Theory Network</Typography>
                <Typography sx={{ fontWeight: 700 }}>No progression is selected, so the original linked scale, mode and chord diagram is displayed.</Typography>
              </>
            )}
          </BrutalCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default MatchesNetworkDiagram;
