import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Box, Typography, Button, MenuItem, Select, InputLabel,
  FormControl, Grid, Chip, Divider, Checkbox, FormControlLabel,
  TextField, InputAdornment, IconButton, Tooltip, Slider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import guitar from '../../config/guitar';
import {
  getAbsoluteNotes, getNoteName, getIntervalName
} from '../../core/music/musicTheory';
import { getSoundfontInstrument } from '../../core/audio/AudioService';

// ─── Styled Components (Neo-Brutalism) ────────────────────────────────────────

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
  minWidth: 140,
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
  '& .MuiInputLabel-root': {
    fontWeight: 900,
    color: 'var(--brutal-ink)',
  },
});

const BrutalTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    border: '3px solid var(--brutal-ink)',
    borderRadius: 4,
    backgroundColor: 'var(--brutal-paper)',
    boxShadow: '2px 2px 0 var(--brutal-ink)',
    fontWeight: 700,
    '& fieldset': { border: 'none' },
    '&:hover': { backgroundColor: 'var(--brutal-paper)' },
    '&.Mui-focused': { boxShadow: 'none' },
  },
});

const BrutalButton = styled(Button)(({ theme, bgcolor = 'var(--brutal-yellow)', hovercolor = 'var(--brutal-pink)' }) => ({
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
  '&:disabled': { opacity: 0.5 },
}));

const SidebarItem = styled(Box)({
  border: '3px solid var(--brutal-ink)',
  borderRadius: 4,
  background: 'var(--brutal-paper)',
  padding: '12px',
  boxShadow: '2px 2px 0 var(--brutal-ink)',
  cursor: 'pointer',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  '&:hover': {
    transform: 'translate(-2px, -2px)',
    boxShadow: '4px 4px 0 var(--brutal-ink)',
    background: 'var(--brutal-yellow)',
  },
});

const LabelChip = styled(Chip)({
  border: '2px solid var(--brutal-ink)',
  fontWeight: 800,
  borderRadius: 4,
  fontSize: '0.85rem',
  boxShadow: '1px 1px 0 var(--brutal-ink)',
});

// ─── Constants ─────────────────────────────────────────────────────────────────

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SCALE_KEYS = Object.keys(guitar.scales);
const ARP_KEYS = Object.keys(guitar.arppegios);

const MatchesNetworkDiagram = () => {
  // --- UI and Filtering State ---
  const [selectedKeyIndex, setSelectedKeyIndex] = useState(0);
  const [colorMode, setColorMode] = useState('category'); // 'category' | 'degree'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Relationship types to display
  const [showScaleChord, setShowScaleChord] = useState(true);
  const [showChordChord, setShowChordChord] = useState(false);
  const [showScaleScale, setShowScaleScale] = useState(false);
  
  // Entity type filters
  const [showScales, setShowScales] = useState(true);
  const [showModes, setShowModes] = useState(true);
  const [showChords, setShowChords] = useState(true);

  // Physics settings
  const [physicsActive, setPhysicsActive] = useState(false); // Default false for clean mind map mode
  const [springLength, setSpringLength] = useState(150);
  const [layoutMode, setLayoutMode] = useState('poster'); // 'poster' | 'network'

  const physicsActiveRef = useRef(physicsActive);
  physicsActiveRef.current = physicsActive;
  const springLengthRef = useRef(springLength);
  springLengthRef.current = springLength;

  // Sync physics activity to layout mode
  useEffect(() => {
    if (layoutMode === 'poster') {
      setPhysicsActive(false);
    } else {
      setPhysicsActive(true);
    }
  }, [layoutMode]);

  // Selected Node in Inspector
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Audio Playback State
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const playTimeoutRef = useRef([]);

  // Vis-Network Refs
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const nodesDataSetRef = useRef(null);
  const edgesDataSetRef = useRef(null);

  const selectedKey = KEYS[selectedKeyIndex];
  const preferFlats = [1, 3, 5, 8, 10].includes(selectedKeyIndex);

  // --- Load audio player ---
  const loadAudioPlayer = async () => {
    if (player) return player;
    setLoadingAudio(true);
    try {
      const p = await getSoundfontInstrument('acoustic_grand_piano');
      setPlayer(p);
      setLoadingAudio(false);
      return p;
    } catch (err) {
      console.error("Failed to load soundfont player:", err);
      setLoadingAudio(false);
      return null;
    }
  };

  const stopSequence = useCallback(() => {
    playTimeoutRef.current.forEach(t => clearTimeout(t));
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

    const notes = node.notes; // absolute note indices
    const baseOctave = 4;

    notes.forEach((noteIdx, i) => {
      // Calculate running octave height dynamically based on ascending comparison
      let octaveOffset = 0;
      if (i > 0) {
        let currentOffset = 0;
        for (let j = 1; j <= i; j++) {
          if (notes[j] < notes[j - 1]) {
            currentOffset++;
          }
        }
        octaveOffset = currentOffset;
      }
      const noteName = getNoteName(noteIdx, preferFlats);
      const octave = baseOctave + octaveOffset;
      const noteWithOctave = `${noteName}${octave}`;

      const t = setTimeout(() => {
        activePlayer.play(noteWithOctave);
        if (i === notes.length - 1) {
          setIsPlaying(false);
        }
      }, i * 400);

      playTimeoutRef.current.push(t);
    });
  };

  useEffect(() => {
    return () => {
      playTimeoutRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  // --- Music Theory Processing: Nodes & Containments ---
  
  // 1. Build all raw nodes (Key independent calculations but absolute notes calculated based on selected key)
  const allNodes = useMemo(() => {
    const nodesList = [];

    // Scales & Modes
    SCALE_KEYS.forEach(sk => {
      const sd = guitar.scales[sk];
      if (!sd) return;

      if (sd.modes && sd.isModal) {
        sd.modes.forEach((mode, mi) => {
          const id = `scale_${sk}_mode_${mi}`;
          const notes = getAbsoluteNotes('scale', sk, selectedKeyIndex, mi);
          const label = `${selectedKey} ${mode.name}`;
          const intervals = mode.intervals || sd.intervals || [];
          nodesList.push({
            id,
            label,
            type: 'scale',
            subType: sk,
            modeIndex: mi,
            name: mode.name,
            notes,
            intervals,
            formula: sd.formula,
            description: mode.description || sd.description || `The ${mode.name} mode of the ${sd.name} scale.`
          });
        });
      } else {
        const id = `scale_${sk}`;
        const notes = getAbsoluteNotes('scale', sk, selectedKeyIndex);
        const label = `${selectedKey} ${sd.name || sk}`;
        const intervals = sd.intervals || [];
        nodesList.push({
          id,
          label,
          type: 'scale',
          subType: sk,
          modeIndex: null,
          name: sd.name || sk,
          notes,
          intervals,
          formula: sd.formula,
          description: sd.description || `The ${sd.name || sk} scale.`
        });
      }
    });

    // Chords / Arpeggios
    ARP_KEYS.forEach(ak => {
      const ad = guitar.arppegios[ak];
      if (!ad) return;
      
      const id = `chord_${ak}`;
      const notes = getAbsoluteNotes('arppegio', ak, selectedKeyIndex);
      const label = `${selectedKey} ${ad.name || ak}`;
      const intervals = ad.intervals || [];
      nodesList.push({
        id,
        label,
        type: 'chord',
        subType: ak,
        name: ad.name || ak,
        notes,
        intervals,
        formula: ad.formula,
        description: ad.description || `The ${ad.name || ak} chord / arpeggio.`
      });
    });

    return nodesList;
  }, [selectedKeyIndex, selectedKey]);

  // Helper to check subset
  const isSubset = (subset, superset) => {
    return subset.every(val => superset.includes(val));
  };

  // 2. Precompute "Full" degree connectivity (all relationships enabled) for styling commonality sizing
  const fullDegrees = useMemo(() => {
    const degrees = {};
    allNodes.forEach(n => {
      degrees[n.id] = 0;
    });

    allNodes.forEach(nodeA => {
      allNodes.forEach(nodeB => {
        if (nodeA.id === nodeB.id) return;

        // Scale-Chord matches
        if (nodeA.type === 'scale' && nodeB.type === 'chord') {
          if (isSubset(nodeB.notes, nodeA.notes)) {
            degrees[nodeA.id]++;
            degrees[nodeB.id]++;
          }
        }
        // Chord-Chord containment
        if (nodeA.type === 'chord' && nodeB.type === 'chord') {
          if (nodeA.notes.length < nodeB.notes.length && isSubset(nodeA.notes, nodeB.notes)) {
            degrees[nodeA.id]++;
            degrees[nodeB.id]++;
          }
        }
        // Scale-Scale containment
        if (nodeA.type === 'scale' && nodeB.type === 'scale') {
          if (nodeA.notes.length < nodeB.notes.length && isSubset(nodeA.notes, nodeB.notes)) {
            degrees[nodeA.id]++;
            degrees[nodeB.id]++;
          }
        }
      });
    });

    return degrees;
  }, [allNodes]);

  const minMaxDegrees = useMemo(() => {
    const degreesArray = Object.values(fullDegrees);
    const max = Math.max(...degreesArray, 1);
    const min = Math.min(...degreesArray, 0);
    return { min, max };
  }, [fullDegrees]);

  // 3. Filtered Nodes and Edges based on active controls
  const networkData = useMemo(() => {
    const filteredNodes = allNodes.filter(node => {
      // Filter by entity type checkbox
      if (node.type === 'scale' && node.modeIndex === null && !showScales) return false;
      if (node.type === 'scale' && node.modeIndex !== null && !showModes) return false;
      if (node.type === 'chord' && !showChords) return false;

      // Filter by search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const nameMatch = node.name.toLowerCase().includes(q);
        const notesMatch = node.notes.map(n => getNoteName(n, preferFlats).toLowerCase()).join(' ').includes(q);
        const intervalsMatch = node.intervals.map(i => i.toLowerCase()).join(' ').includes(q);
        if (!nameMatch && !notesMatch && !intervalsMatch) return false;
      }
      return true;
    });

    const filteredNodesIds = new Set(filteredNodes.map(n => n.id));
    const edgesList = [];

    // Scale-Chord Matches
    if (showScaleChord) {
      allNodes.forEach(nodeA => {
        if (nodeA.type !== 'scale' || !filteredNodesIds.has(nodeA.id)) return;
        allNodes.forEach(nodeB => {
          if (nodeB.type !== 'chord' || !filteredNodesIds.has(nodeB.id)) return;
          if (isSubset(nodeB.notes, nodeA.notes)) {
            edgesList.push({
              id: `edge_${nodeA.id}_${nodeB.id}`,
              from: nodeA.id,
              to: nodeB.id,
              relation: 'scale-chord',
              width: 1.5,
              color: { color: 'rgba(26,26,26,0.12)', highlight: '#ff007f' }
            });
          }
        });
      });
    }

    // Chord-Chord Containment
    if (showChordChord) {
      allNodes.forEach(nodeA => {
        if (nodeA.type !== 'chord' || !filteredNodesIds.has(nodeA.id)) return;
        allNodes.forEach(nodeB => {
          if (nodeB.type !== 'chord' || !filteredNodesIds.has(nodeB.id)) return;
          if (nodeA.id === nodeB.id) return;
          if (nodeA.notes.length < nodeB.notes.length && isSubset(nodeA.notes, nodeB.notes)) {
            edgesList.push({
              id: `edge_${nodeA.id}_${nodeB.id}`,
              from: nodeA.id,
              to: nodeB.id,
              relation: 'chord-chord',
              arrows: { to: { enabled: true, scaleFactor: 0.5 } },
              width: 1.5,
              color: { color: 'rgba(54, 162, 235, 0.25)', highlight: '#36a2eb' }
            });
          }
        });
      });
    }

    // Scale-Scale Containment
    if (showScaleScale) {
      allNodes.forEach(nodeA => {
        if (nodeA.type !== 'scale' || !filteredNodesIds.has(nodeA.id)) return;
        allNodes.forEach(nodeB => {
          if (nodeB.type !== 'scale' || !filteredNodesIds.has(nodeB.id)) return;
          if (nodeA.id === nodeB.id) return;
          if (nodeA.notes.length < nodeB.notes.length && isSubset(nodeA.notes, nodeB.notes)) {
            edgesList.push({
              id: `edge_${nodeA.id}_${nodeB.id}`,
              from: nodeA.id,
              to: nodeB.id,
              relation: 'scale-scale',
              arrows: { to: { enabled: true, scaleFactor: 0.5 } },
              width: 1.5,
              color: { color: 'rgba(75, 192, 192, 0.25)', highlight: '#4bc0c0' }
            });
          }
        });
      });
    }

    // Compute active degree for filtered nodes to size/color properly
    const activeDegrees = {};
    filteredNodes.forEach(n => { activeDegrees[n.id] = 0; });
    edgesList.forEach(e => {
      if (activeDegrees[e.from] !== undefined) activeDegrees[e.from]++;
      if (activeDegrees[e.to] !== undefined) activeDegrees[e.to]++;
    });

    // Exclude isolated nodes (nodes with 0 active connections) to prevent drift and visual clutter
    const connectedNodes = filteredNodes.filter(n => activeDegrees[n.id] > 0);

    return { nodes: connectedNodes, edges: edgesList, activeDegrees };
  }, [allNodes, showScaleChord, showChordChord, showScaleScale, showScales, showModes, showChords, searchQuery, preferFlats]);

  // --- Map node properties to Vis-Network Format ---
  const visNodesAndEdges = useMemo(() => {
    const { nodes, edges } = networkData;
    const { min, max } = minMaxDegrees;

    // Partition nodes if in poster mode
    const scalesList = [];
    const modesList = [];
    const chordsList = [];

    if (layoutMode === 'poster') {
      nodes.forEach(node => {
        if (node.type === 'scale' && node.modeIndex === null) {
          scalesList.push(node);
        } else if (node.type === 'scale' && node.modeIndex !== null) {
          modesList.push(node);
        } else {
          chordsList.push(node);
        }
      });

      // Sort lists for logical visual hierarchy
      const scaleKeyOrder = Object.keys(guitar.scales);
      const arpKeyOrder = Object.keys(guitar.arppegios);

      scalesList.sort((a, b) => scaleKeyOrder.indexOf(a.subType) - scaleKeyOrder.indexOf(b.subType));
      modesList.sort((a, b) => {
        const scaleDiff = scaleKeyOrder.indexOf(a.subType) - scaleKeyOrder.indexOf(b.subType);
        if (scaleDiff !== 0) return scaleDiff;
        return (a.modeIndex || 0) - (b.modeIndex || 0);
      });
      chordsList.sort((a, b) => arpKeyOrder.indexOf(a.subType) - arpKeyOrder.indexOf(b.subType));
    }

    const scalesSpacing = 100;
    const modesSpacing = 70;
    const chordsSpacing = 80;

    const scalesYStart = -((scalesList.length - 1) / 2) * scalesSpacing;
    const modesYStart = -((modesList.length - 1) / 2) * modesSpacing;
    const chordsYStart = -((chordsList.length - 1) / 2) * chordsSpacing;

    const nodeCoords = {};
    if (layoutMode === 'poster') {
      scalesList.forEach((node, i) => {
        nodeCoords[node.id] = { x: -360, y: scalesYStart + i * scalesSpacing };
      });
      modesList.forEach((node, i) => {
        nodeCoords[node.id] = { x: 0, y: modesYStart + i * modesSpacing };
      });
      chordsList.forEach((node, i) => {
        nodeCoords[node.id] = { x: 360, y: chordsYStart + i * chordsSpacing };
      });
    }

    const formattedNodes = nodes.map(node => {
      const degree = fullDegrees[node.id] || 0;
      const commonality = (degree - min) / (max - min || 1);
      
      // Node sizing based on commonality
      const fontSize = 12 + Math.round(commonality * 8);

      // Node coloring
      let background = '#ffffff';
      let border = 'var(--brutal-ink)';
      let highlightBg = 'var(--brutal-yellow)';

      if (colorMode === 'category') {
        if (node.type === 'scale' && node.modeIndex === null) {
          background = '#99f6e4'; // teal
          highlightBg = '#2dd4bf';
        } else if (node.type === 'scale' && node.modeIndex !== null) {
          background = '#e9d5ff'; // purple
          highlightBg = '#c084fc';
        } else {
          background = '#fef08a'; // yellow
          highlightBg = '#facc15';
        }
      } else {
        // Coloring by degree (Commonality vs Rarity)
        if (commonality > 0.6) {
          background = 'var(--brutal-yellow)'; // High (Gold/Yellow)
          highlightBg = '#facc15';
        } else if (commonality > 0.2) {
          background = 'var(--brutal-mint)'; // Medium (Teal/Mint)
          highlightBg = '#2dd4bf';
        } else {
          background = 'var(--brutal-pink)'; // Rare (Pink)
          highlightBg = '#f472b6';
        }
      }

      const baseNode = {
        id: node.id,
        label: node.label,
        shape: 'box',
        margin: 10,
        borderWidth: 3,
        color: {
          background,
          border,
          highlight: {
            background: highlightBg,
            border: 'var(--brutal-ink)'
          }
        },
        font: {
          size: fontSize,
          face: 'Open Sans, sans-serif',
          color: '#1a1a1a',
          bold: true
        },
        shadow: {
          enabled: true,
          color: 'var(--brutal-ink)',
          size: 0,
          x: 4,
          y: 4
        }
      };

      if (layoutMode === 'poster') {
        const coords = nodeCoords[node.id] || { x: 0, y: 0 };
        baseNode.x = coords.x;
        baseNode.y = coords.y;
        baseNode.fixed = { x: true, y: true };
      }

      return baseNode;
    });

    return { nodes: formattedNodes, edges };
  }, [networkData, colorMode, minMaxDegrees, fullDegrees, layoutMode]);

  // --- Selected Node Object ---
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return allNodes.find(n => n.id === selectedNodeId) || null;
  }, [selectedNodeId, allNodes]);

  // --- Network Initialization and Updates ---

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy existing network
    if (networkRef.current) {
      networkRef.current.destroy();
      networkRef.current = null;
    }

    const { nodes, edges } = visNodesAndEdges;

    const nodesDataSet = new DataSet(nodes);
    const edgesDataSet = new DataSet(edges);

    nodesDataSetRef.current = nodesDataSet;
    edgesDataSetRef.current = edgesDataSet;

    const options = {
      physics: {
        enabled: layoutMode === 'poster' ? false : physicsActiveRef.current,
        barnesHut: {
          gravitationalConstant: -1800,
          centralGravity: 0.5,
          springLength: springLengthRef.current,
          springConstant: 0.04,
          damping: 0.8,
          avoidOverlap: 1.0
        },
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 50
        }
      },
      edges: {
        smooth: layoutMode === 'poster' ? false : {
          type: 'continuous',
          roundness: 0.5
        }
      },
      interaction: {
        hover: true,
        zoomView: true,
        dragView: true,
        selectConnectedEdges: false
      }
    };

    const network = new Network(containerRef.current, { nodes: nodesDataSet, edges: edgesDataSet }, options);
    networkRef.current = network;

    // Selection listener
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        setSelectedNodeId(params.nodes[0]);
      } else {
        setSelectedNodeId(null);
      }
    });

    // Auto turn off physics on stabilization
    network.on('stabilized', () => {
      if (layoutMode !== 'poster') {
        network.setOptions({ physics: { enabled: false } });
        setPhysicsActive(false);
      }
    });

    // Enforce viewport boundaries (restrict panning and zooming)
    const enforceBoundaries = () => {
      const pos = network.getViewPosition();
      const scale = network.getScale();
      
      let newX = pos.x;
      let newY = pos.y;
      
      const maxPanX = 800;
      const maxPanY = 800;
      
      if (pos.x > maxPanX) newX = maxPanX;
      else if (pos.x < -maxPanX) newX = -maxPanX;
      
      if (pos.y > maxPanY) newY = maxPanY;
      else if (pos.y < -maxPanY) newY = -maxPanY;
      
      let newScale = scale;
      if (scale < 0.15) newScale = 0.15;
      else if (scale > 2.0) newScale = 2.0;
      
      if (newX !== pos.x || newY !== pos.y || newScale !== scale) {
        network.moveTo({
          position: { x: newX, y: newY },
          scale: newScale,
          animation: { duration: 150, easingFunction: 'easeOutQuad' }
        });
      }
    };

    network.on('dragEnd', enforceBoundaries);
    network.on('zoom', enforceBoundaries);

    // Fallback timeout to guarantee physics stops running after 3.5 seconds
    const forceStopTimeout = setTimeout(() => {
      if (networkRef.current && layoutMode !== 'poster') {
        networkRef.current.setOptions({ physics: { enabled: false } });
        setPhysicsActive(false);
      }
    }, 3500);

    return () => {
      clearTimeout(forceStopTimeout);
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [visNodesAndEdges, layoutMode]); // Re-create only when structure changes

  // Update physics settings without re-creating network
  useEffect(() => {
    if (networkRef.current) {
      networkRef.current.setOptions({
        physics: {
          enabled: physicsActive,
          springLength: springLength
        }
      });
    }
  }, [physicsActive, springLength]);

  // Highlight selected node and its neighbors in-place
  useEffect(() => {
    if (!nodesDataSetRef.current || !edgesDataSetRef.current) return;

    const { nodes, edges } = visNodesAndEdges;

    if (!selectedNodeId) {
      // Reset colors and opacities
      nodesDataSetRef.current.update(nodes);
      edgesDataSetRef.current.update(edges);
      return;
    }

    // Find neighbors of selectedNodeId
    const neighbors = new Set();
    edges.forEach(e => {
      if (e.from === selectedNodeId) neighbors.add(e.to);
      if (e.to === selectedNodeId) neighbors.add(e.from);
    });

    const updatedNodes = nodes.map(n => {
      const isSelected = n.id === selectedNodeId;
      const isNeighbor = neighbors.has(n.id);
      
      let opacity = 1;
      let background = n.color.background;
      let border = n.color.border;
      let fontColor = '#1a1a1a';

      if (!isSelected && !isNeighbor) {
        opacity = 0.15;
        background = '#e5e7eb';
        border = '#d1d5db';
        fontColor = '#9ca3af';
      }

      return {
        ...n,
        color: {
          ...n.color,
          background,
          border
        },
        font: {
          ...n.font,
          color: fontColor
        },
        opacity
      };
    });

    const updatedEdges = edges.map(e => {
      const isConnected = e.from === selectedNodeId || e.to === selectedNodeId;
      let color = e.color.color;
      let width = e.width;

      if (isConnected) {
        color = '#ff007f'; // hot pink highlight
        width = 3.5;
      } else {
        color = 'rgba(26,26,26,0.02)';
        width = 0.8;
      }

      return {
        ...e,
        color: {
          ...e.color,
          color
        },
        width
      };
    });

    nodesDataSetRef.current.update(updatedNodes);
    edgesDataSetRef.current.update(updatedEdges);
  }, [selectedNodeId, visNodesAndEdges]);

  // Center on node function for sidebar clicks
  const handleSelectNodeFromSidebar = (nodeId) => {
    setSelectedNodeId(nodeId);
    if (networkRef.current) {
      networkRef.current.selectNodes([nodeId]);
      networkRef.current.focus(nodeId, {
        scale: 1.1,
        animation: {
          duration: 500,
          easingFunction: 'easeInOutQuad'
        }
      });
    }
  };

  const handleResetCamera = () => {
    if (networkRef.current) {
      networkRef.current.fit({
        animation: {
          duration: 500,
          easingFunction: 'easeInOutQuad'
        }
      });
    }
  };

  // --- Statistics Sidebar Calculation ---
  const stats = useMemo(() => {
    // Sort all nodes by total degree
    const sorted = [...allNodes].sort((a, b) => (fullDegrees[b.id] || 0) - (fullDegrees[a.id] || 0));
    const hubs = sorted.slice(0, 5);
    const rares = sorted.filter(n => fullDegrees[n.id] > 0).reverse().slice(0, 5); // filter out 0 matches

    return {
      totalNodes: allNodes.length,
      totalEdges: networkData.edges.length,
      hubs,
      rares
    };
  }, [allNodes, fullDegrees, networkData.edges.length]);

  return (
    <PageContainer>
      {/* ─── Page Title / Preface ─── */}
      <Box sx={{ borderBottom: '4px solid var(--brutal-ink)', pb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: -1 }}>
          🔗 Matches Network
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700, opacity: 0.8, maxWidth: 800 }}>
          Explore the relationships between music scales, modes, arpeggios, and chords. 
          A chord is connected to a scale if all of its notes are contained within that scale. 
          Highly connected entities form heavy hubs (commonality), while sparsely matched entities float to the edges (rarity).
        </Typography>
      </Box>

      {/* ─── Control Panel ─── */}
      <ControlPanel>
        <SelectWrapper>
          <InputLabel id="key-select-label">Root Key</InputLabel>
          <Select
            labelId="key-select-label"
            id="key-select"
            value={selectedKeyIndex}
            label="Root Key"
            onChange={(e) => {
              setSelectedKeyIndex(e.target.value);
              setSelectedNodeId(null);
              stopSequence();
            }}
          >
            {KEYS.map((k, i) => (
              <MenuItem key={k} value={i} sx={{ fontWeight: 700 }}>{k}</MenuItem>
            ))}
          </Select>
        </SelectWrapper>

        <SelectWrapper>
          <InputLabel id="color-select-label">Coloring Mode</InputLabel>
          <Select
            labelId="color-select-label"
            id="color-select"
            value={colorMode}
            label="Coloring Mode"
            onChange={(e) => setColorMode(e.target.value)}
          >
            <MenuItem value="category" sx={{ fontWeight: 700 }}>Category</MenuItem>
            <MenuItem value="degree" sx={{ fontWeight: 700 }}>Commonality</MenuItem>
          </Select>
        </SelectWrapper>

        <SelectWrapper>
          <InputLabel id="layout-select-label">Layout Mode</InputLabel>
          <Select
            labelId="layout-select-label"
            id="layout-select"
            value={layoutMode}
            label="Layout Mode"
            onChange={(e) => setLayoutMode(e.target.value)}
          >
            <MenuItem value="poster" sx={{ fontWeight: 700 }}>Mind-Map Poster</MenuItem>
            <MenuItem value="network" sx={{ fontWeight: 700 }}>Interactive Network</MenuItem>
          </Select>
        </SelectWrapper>

        <BrutalTextField
          size="small"
          placeholder="Search (e.g. Dorian, Maj7)..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedNodeId(null);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'var(--brutal-ink)' }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <BrutalButton bgcolor="var(--brutal-yellow)" onClick={handleResetCamera}>
            <RestartAltIcon /> Reset View
          </BrutalButton>
          <FormControlLabel
            control={
              <Checkbox
                checked={physicsActive}
                disabled={layoutMode === 'poster'}
                onChange={(e) => setPhysicsActive(e.target.checked)}
                sx={{
                  color: 'var(--brutal-ink)',
                  '&.Mui-checked': { color: 'var(--brutal-ink)' }
                }}
              />
            }
            label={<Typography sx={{ fontWeight: 800, opacity: layoutMode === 'poster' ? 0.5 : 1 }}>Physics Simulation</Typography>}
          />
        </Box>
      </ControlPanel>

      {/* ─── Grid Workspace ─── */}
      <Grid container spacing={3}>
        {/* Network Diagram Column */}
        <Grid item xs={12} lg={8.5}>
          <BrutalCard sx={{ position: 'relative', overflow: 'hidden' }}>
            {/* Filter Toolbars */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, alignItems: 'center', borderBottom: '3px solid var(--brutal-ink)', pb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, textTransform: 'uppercase', mt: 1 }}>
                  Show Entities:
                </Typography>
                <FormControlLabel
                  control={<Checkbox checked={showScales} onChange={(e) => setShowScales(e.target.checked)} />}
                  label={<Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>Parent Scales</Typography>}
                />
                <FormControlLabel
                  control={<Checkbox checked={showModes} onChange={(e) => setShowModes(e.target.checked)} />}
                  label={<Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>Modes</Typography>}
                />
                <FormControlLabel
                  control={<Checkbox checked={showChords} onChange={(e) => setShowChords(e.target.checked)} />}
                  label={<Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>Chords</Typography>}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, textTransform: 'uppercase', mt: 1 }}>
                  Relationships:
                </Typography>
                <FormControlLabel
                  control={<Checkbox checked={showScaleChord} onChange={(e) => setShowScaleChord(e.target.checked)} />}
                  label={<Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>Chord-Scale</Typography>}
                />
                <FormControlLabel
                  control={<Checkbox checked={showChordChord} onChange={(e) => setShowChordChord(e.target.checked)} />}
                  label={<Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>Chord Containment</Typography>}
                />
                <FormControlLabel
                  control={<Checkbox checked={showScaleScale} onChange={(e) => setShowScaleScale(e.target.checked)} />}
                  label={<Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>Scale Containment</Typography>}
                />
              </Box>
            </Box>

            {/* Physics spring control slider */}
            {physicsActive && layoutMode !== 'poster' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', minWidth: 100 }}>
                  Spring Distance:
                </Typography>
                <Slider
                  size="small"
                  value={springLength}
                  min={80}
                  max={300}
                  onChange={(e, val) => setSpringLength(val)}
                  sx={{ color: 'var(--brutal-ink)' }}
                />
                <Typography variant="caption" sx={{ fontWeight: 900 }}>{springLength}px</Typography>
              </Box>
            )}

            {/* Network container canvas */}
            <Box
              ref={containerRef}
              sx={{
                width: '100%',
                height: 600,
                border: '3px solid var(--brutal-ink)',
                borderRadius: 1,
                bgcolor: 'var(--brutal-paper)',
                cursor: 'grab',
                '&:active': { cursor: 'grabbing' }
              }}
            />
          </BrutalCard>
        </Grid>

        {/* Sidebar Column (Inspector / General Stats) */}
        <Grid item xs={12} lg={3.5}>
          <BrutalCard sx={{ height: '100%', minHeight: 600, justifyContent: 'flex-start' }}>
            {selectedNode ? (
              // --- Node Inspector View ---
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', justifySelf: 'flex-start', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid var(--brutal-ink)', pb: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', px: 1, py: 0.5, bgcolor: selectedNode.type === 'scale' ? 'var(--brutal-mint)' : 'var(--brutal-pink)', border: '2px solid var(--brutal-ink)', borderRadius: 1 }}>
                    {selectedNode.type === 'scale' ? (selectedNode.modeIndex !== null ? 'Mode' : 'Scale') : 'Chord / Arp'}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setSelectedNodeId(null)}
                    sx={{ border: '2px solid var(--brutal-ink)', bgcolor: 'var(--brutal-paper)', borderRadius: 1 }}
                  >
                    ×
                  </IconButton>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 900, mt: 1 }}>
                  {selectedNode.label}
                </Typography>

                <Typography variant="body2" sx={{ fontWeight: 700, opacity: 0.85 }}>
                  {selectedNode.description}
                </Typography>

                <Divider sx={{ borderBottomWidth: 3, borderColor: 'var(--brutal-ink)' }} />

                {/* Notes List */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, textTransform: 'uppercase', mb: 1 }}>
                    Notes
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    {selectedNode.notes.map((noteIdx) => (
                      <LabelChip
                        key={noteIdx}
                        label={getNoteName(noteIdx, preferFlats)}
                        sx={{ bgcolor: 'var(--brutal-paper)' }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Intervals List */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, textTransform: 'uppercase', mb: 1 }}>
                    Intervals
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                    {selectedNode.intervals.map((interval, index) => (
                      <LabelChip
                        key={index}
                        label={interval}
                        sx={{ bgcolor: 'var(--brutal-yellow)' }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Connective Commonality Stats */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, textTransform: 'uppercase', mb: 0.5 }}>
                    Commonality Stats
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Matches: <b style={{ fontSize: '1.1rem' }}>{fullDegrees[selectedNode.id] || 0}</b> total relationships
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--brutal-ink)', opacity: 0.7 }}>
                    Degree rank: {fullDegrees[selectedNode.id] > 12 ? 'Very Common' : (fullDegrees[selectedNode.id] > 4 ? 'Moderate' : 'Rare')}
                  </Typography>
                </Box>

                <Divider sx={{ borderBottomWidth: 3, borderColor: 'var(--brutal-ink)', my: 1 }} />

                {/* Sound Playback Button */}
                <BrutalButton
                  bgcolor="var(--brutal-yellow)"
                  hovercolor="var(--brutal-mint)"
                  disabled={loadingAudio}
                  onClick={() => playSequence(selectedNode)}
                  sx={{ width: '100%', mt: 'auto', py: 1.5 }}
                >
                  {isPlaying ? (
                    <>
                      <StopIcon /> Stop Playback
                    </>
                  ) : (
                    <>
                      {loadingAudio ? <VolumeUpIcon className="animate-pulse" /> : <PlayArrowIcon />}
                      Play Notes Sequence
                    </>
                  )}
                </BrutalButton>
              </Box>
            ) : (
              // --- Default General Stats View ---
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, borderBottom: '3px solid var(--brutal-ink)', pb: 1.5 }}>
                  📊 Ecosystem Stats
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ border: '3px solid var(--brutal-ink)', borderRadius: 1, p: 1.5, textAlign: 'center', bgcolor: 'var(--brutal-mint)' }}>
                      <Typography variant="h4" sx={{ fontWeight: 900 }}>{stats.totalNodes}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>Active Nodes</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ border: '3px solid var(--brutal-ink)', borderRadius: 1, p: 1.5, textAlign: 'center', bgcolor: 'var(--brutal-pink)' }}>
                      <Typography variant="h4" sx={{ fontWeight: 900 }}>{stats.totalEdges}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>Active Edges</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ borderBottomWidth: 3, borderColor: 'var(--brutal-ink)' }} />

                {/* Top Common Entities */}
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, textTransform: 'uppercase', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    🌟 Hubs of Commonality
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {stats.hubs.map((node) => (
                      <SidebarItem key={node.id} onClick={() => handleSelectNodeFromSidebar(node.id)}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>{node.label}</Typography>
                          <LabelChip size="small" label={`${fullDegrees[node.id]} matches`} sx={{ bgcolor: 'var(--brutal-mint)' }} />
                        </Box>
                      </SidebarItem>
                    ))}
                  </Box>
                </Box>

                {/* Rare gems */}
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, textTransform: 'uppercase', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    💎 Rare Outposts
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {stats.rares.map((node) => (
                      <SidebarItem key={node.id} onClick={() => handleSelectNodeFromSidebar(node.id)}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>{node.label}</Typography>
                          <LabelChip size="small" label={`${fullDegrees[node.id]} matches`} sx={{ bgcolor: 'var(--brutal-pink)' }} />
                        </Box>
                      </SidebarItem>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
          </BrutalCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default MatchesNetworkDiagram;
