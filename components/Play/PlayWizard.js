import React, { useState, useMemo } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Container,
    Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import guitar from '../../config/guitar.js';
import { getAbsoluteNotes, checkMatch } from '../../core/music/musicTheory';
import {
    appendLabelDisplayToPath,
    DEFAULT_LABEL_DISPLAY,
    isValidLabelDisplay
} from '../../core/spreading/labelDisplay';

// -----------------------------------------
// CONSTANTS
// -----------------------------------------

const keysSharps = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const normalizedKeys = keysSharps.map(k => k.replace("#", "sharp"));

const degreesDynamic = Object.keys(guitar.arppegios);
const scaleTypes = Object.keys(guitar.scales);

// -----------------------------------------
// HELPERS
// -----------------------------------------

const normalizeKey = (str) => str?.replace("sharp", "#");
const normalizeDegree = (str) => str?.replace(/sharp/g, "#").replace(/#/g, "sharp");

const normalizeModeName = (str) => {
    if (!str) return "";
    return str
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/_/g, "-")
        .replace(/--+/g, "-")
        .replace(/#/g, "sharp")
        .trim();
};

const slugify = (text) => text.toLowerCase().replace(/#/g, 'sharp').replace(/ /g, '_');

const getRoutePartsFromHref = (href) => {
    const parts = href.split("/");
    const lastPart = parts[parts.length - 1];

    if (isValidLabelDisplay(lastPart)) {
        return {
            parts: parts.slice(0, -1),
            labelDisplay: lastPart
        };
    }

    return {
        parts,
        labelDisplay: DEFAULT_LABEL_DISPLAY
    };
};

// -----------------------------------------
// STYLES
// -----------------------------------------

const StyledCard = styled(Card)(({ theme }) => ({
    margin: '16px auto',
    width: '100%',
    padding: '20px',
    borderRadius: 4,
    border: '4px solid var(--brutal-ink)',
    boxShadow: 'var(--brutal-shadow)',
    background: 'rgba(255, 253, 245, 0.84)',
    backdropFilter: 'blur(10px)',
    [theme.breakpoints.up('md')]: { maxWidth: '92%' },
    [theme.breakpoints.up('lg')]: { maxWidth: '85%' },
}));

const OptionButton = styled(Button)(({ theme, selected }) => ({
    borderRadius: 4,
    margin: "4px",
    minHeight: 44,
    minWidth: 72,
    background: selected ? "var(--brutal-yellow)" : "var(--brutal-paper)",
    color: "var(--brutal-ink)",
    border: "3px solid var(--brutal-ink)",
    boxShadow: selected ? "var(--brutal-shadow-small)" : "none",
    fontWeight: 900,
    lineHeight: 1.1,
    textTransform: "none",
    "&:hover": {
        background: selected ? "var(--brutal-pink)" : "var(--brutal-yellow)",
        borderColor: "var(--brutal-ink)",
        boxShadow: "var(--brutal-shadow-small)",
        transform: "translate(-2px, -2px)",
    }
}));

// -----------------------------------------
// COMPONENT
// -----------------------------------------

const PlayWizard = ({ onSelect, elements = [] }) => {
    // Filters
    const [searchType, setSearchType] = useState("scale");
    const [searchKey, setSearchKey] = useState("C");
    const [searchScaleType, setSearchScaleType] = useState("major");
    const [searchMode, setSearchMode] = useState("Ionian");
    const [searchDegree, setSearchDegree] = useState("M");

    // Matches State
    const [searchChord, setSearchChord] = useState("M");
    const [searchMatchType, setSearchMatchType] = useState("scale");
    const [searchShape, setSearchShape] = useState("E");
    const [searchCrossKey, setSearchCrossKey] = useState(false);

    const filteredElements = useMemo(() => {
        if (searchType === "matches") {
            if (!searchKey || !searchChord || !searchMatchType || !searchShape) return [];

            const keyIndex = guitar.notes.sharps.indexOf(searchKey);
            if (keyIndex === -1) return [];

            const chordNotes = getAbsoluteNotes('chord', searchChord, keyIndex);
            let results = [];
            const keysToSearch = searchCrossKey ? guitar.notes.sharps : [searchKey];

            keysToSearch.forEach((targetKey) => {
                const targetKeyIndex = guitar.notes.sharps.indexOf(targetKey);

                if (searchMatchType === 'scale') {
                    Object.entries(guitar.scales).forEach(([scaleKey, scaleData]) => {
                        if (scaleData.modes) {
                            scaleData.modes.forEach((mode, mIdx) => {
                                const targetNotes = getAbsoluteNotes('scale', scaleKey, targetKeyIndex, mIdx);
                                if (checkMatch(chordNotes, targetNotes)) {
                                    results.push({
                                        label: `Scale ${mode.name} in ${targetKey}`,
                                        type: 'scale',
                                        key: targetKeyIndex,
                                        value: scaleKey,
                                        mode: mIdx,
                                        shape: searchShape,
                                        labelDisplay: DEFAULT_LABEL_DISPLAY,
                                        href: appendLabelDisplayToPath(`/spreading/scales/${targetKey.replace(/#/g, 'sharp')}/${scaleKey}/modal/${normalizeModeName(mode.name)}`)
                                    });
                                }
                            });
                        } else {
                            const targetNotes = getAbsoluteNotes('scale', scaleKey, targetKeyIndex);
                            if (checkMatch(chordNotes, targetNotes)) {
                                results.push({
                                    label: `Scale ${scaleData.name} in ${targetKey}`,
                                    type: 'scale',
                                    key: targetKeyIndex,
                                    value: scaleKey,
                                    shape: searchShape,
                                    labelDisplay: DEFAULT_LABEL_DISPLAY,
                                    href: appendLabelDisplayToPath(`/spreading/scales/${targetKey.replace(/#/g, 'sharp')}/${scaleKey}/single`)
                                });
                            }
                        }
                    });
                } else {
                    Object.entries(guitar.arppegios).forEach(([arpKey, arpData]) => {
                        const targetNotes = getAbsoluteNotes('arppegio', arpKey, targetKeyIndex);
                        if (checkMatch(chordNotes, targetNotes)) {
                            results.push({
                                label: `Arpeggio ${arpData.name} in ${targetKey}`,
                                type: 'arppegio',
                                key: targetKeyIndex,
                                value: arpKey,
                                shape: searchShape,
                                labelDisplay: DEFAULT_LABEL_DISPLAY,
                                href: appendLabelDisplayToPath(`/spreading/arppegios/${targetKey.replace(/#/g, 'sharp')}/${arpKey.replace(/#/g, 'sharp')}`)
                            });
                        }
                    });
                }
            });
            return results;
        }

        return elements.filter(el => {
            const { parts } = getRoutePartsFromHref(el.href);
            const elementType = parts[2];
            const elementKeyRaw = parts[3];
            const elementScaleType = parts[4];
            const elementModeRaw = parts[5] === 'modal' ? parts[6] : '';
            const elementMode = normalizeModeName(elementModeRaw);
            const elementDegree = normalizeDegree(parts[4]);
            const elementKey = normalizeKey(elementKeyRaw);

            if (searchType === "scale" && elementType !== "scales") return false;
            if (searchType === "chord" && elementType !== "chords") return false;
            if (searchType === "arp" && elementType !== "arppegios") return false;
            if (searchKey && elementKey !== searchKey) return false;

            if (searchScaleType && elementType === "scales") {
                if (elementScaleType !== searchScaleType) return false;
            }
            // Only filter by mode when the selected scale type is modal
            const selectedScaleIsModal = guitar.scales[searchScaleType]?.isModal;
            if (searchMode && elementType === "scales" && selectedScaleIsModal) {
                if (normalizeModeName(searchMode) !== elementMode) return false;
            }
            if (searchDegree && elementType !== "scales") {
                if (normalizeDegree(searchDegree) !== elementDegree) return false;
            }

            return true;
        }).map(el => {
            // Convert href to app state
            const { parts, labelDisplay } = getRoutePartsFromHref(el.href);
            const typeMap = { 'scales': 'scale', 'chords': 'chord', 'arppegios': 'arppegio' };
            const type = typeMap[parts[2]];
            const keyIdx = guitar.notes.sharps.indexOf(normalizeKey(parts[3]));
            const selection = { label: el.label, type, key: keyIdx, href: el.href, labelDisplay };
            if (type === 'scale') {
                selection.value = parts[4];
                if (parts[5] === 'modal') {
                    const scale = guitar.scales[parts[4]];
                    const mIdx = scale.modes.findIndex(m => normalizeModeName(m.name) === normalizeModeName(parts[6]));
                    selection.mode = mIdx;
                }
            } else {
                selection.value = normalizeDegree(parts[4]);
            }
            return selection;
        });
    }, [elements, searchType, searchKey, searchScaleType, searchMode, searchDegree, searchChord, searchMatchType, searchShape, searchCrossKey]);

    return (
        <Container sx={{ py: 4 }}>
            <StyledCard>
                <CardContent
                    sx={{
                        '& > .MuiBox-root:not(.wizard-hero)': {
                            mb: 3,
                            p: { xs: 1.5, sm: 2 },
                            bgcolor: 'rgba(255, 253, 245, 0.74)',
                            border: '3px solid var(--brutal-ink)',
                            borderRadius: 1,
                            boxShadow: 'var(--brutal-shadow-small)',
                        },
                        '& > .MuiBox-root:not(.wizard-hero):nth-of-type(3n + 1)': {
                            bgcolor: 'var(--brutal-blue)',
                        },
                        '& > .MuiBox-root:not(.wizard-hero):nth-of-type(3n + 2)': {
                            bgcolor: 'var(--brutal-mint)',
                        },
                        '& > .MuiBox-root:not(.wizard-hero):nth-of-type(3n + 3)': {
                            bgcolor: 'var(--brutal-yellow)',
                        },
                        '& .MuiTypography-h6': {
                            color: 'var(--brutal-ink)',
                            fontWeight: 900,
                            mb: 1,
                        },
                    }}
                >
                    <Box
                        className="wizard-hero"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 3,
                            p: { xs: 1.5, sm: 2 },
                            bgcolor: 'var(--brutal-pink)',
                            border: '4px solid var(--brutal-ink)',
                            boxShadow: 'var(--brutal-shadow)',
                        }}
                    >
                        <Box component="img" src="/graphics/search-spark.svg" alt="" sx={{ width: 76, height: 76, flex: '0 0 auto' }} />
                        <Box>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 900, mb: 0 }}>
                                Play Wizard
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: 'var(--brutal-ink)' }}>
                                Pick a musical path, then jump straight into the fretboard view.
                            </Typography>
                        </Box>
                    </Box>

                    {/* STEP 1 – CATEGORY */}
                    <Box mb={3}>
                        <Typography variant="h6" color="textSecondary">Step 1: Category</Typography>
                        <OptionButton selected={searchType === "scale"} onClick={() => setSearchType("scale")}>Scales</OptionButton>
                        <OptionButton selected={searchType === "chord"} onClick={() => setSearchType("chord")}>Chords</OptionButton>
                        <OptionButton selected={searchType === "arp"} onClick={() => setSearchType("arp")}>Arpeggios</OptionButton>
                        <OptionButton selected={searchType === "matches"} onClick={() => setSearchType("matches")}>Matches</OptionButton>
                    </Box>

                    {/* STEP 2 – KEY */}
                    <Box mb={3}>
                        <Typography variant="h6" color="textSecondary">Step 2: Key</Typography>
                        <Grid container spacing={0.5}>
                            {keysSharps.map((k, idx) => (
                                <Grid item key={k}>
                                    <OptionButton
                                        selected={searchKey === k}
                                        onClick={() => setSearchKey(k)}
                                    >
                                        {k}
                                    </OptionButton>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* DYNAMIC STEPS based on Category */}
                    {searchType === 'matches' ? (
                        <>
                            <Box mb={3}>
                                <Typography variant="h6" color="textSecondary">Step 3: Depth</Typography>
                                <OptionButton selected={!searchCrossKey} onClick={() => setSearchCrossKey(false)}>Same Key ({searchKey})</OptionButton>
                                <OptionButton selected={searchCrossKey} onClick={() => setSearchCrossKey(true)}>Cross-Key</OptionButton>
                            </Box>
                            <Box mb={3}>
                                <Typography variant="h6" color="textSecondary">Step 4: Root Chord</Typography>
                                {Object.entries(guitar.arppegios)
                                    .filter(([_, data]) => data.matchingScales?.length > 0 || data.matchingArpeggios?.length > 0)
                                    .map(([ck, cd]) => (
                                        <OptionButton key={ck} selected={searchChord === ck} onClick={() => setSearchChord(ck)}>{cd.name}</OptionButton>
                                    ))}
                            </Box>
                            <Box mb={3}>
                                <Typography variant="h6" color="textSecondary">Step 5: Match Type</Typography>
                                <OptionButton selected={searchMatchType === 'scale'} onClick={() => setSearchMatchType('scale')}>Scale</OptionButton>
                                <OptionButton selected={searchMatchType === 'arpeggio'} onClick={() => setSearchMatchType('arpeggio')}>Arpeggio</OptionButton>
                            </Box>
                            <Box mb={3}>
                                <Typography variant="h6" color="textSecondary">Step 6: Shape</Typography>
                                {['C', 'A', 'G', 'E', 'D'].map(s => (
                                    <OptionButton key={s} selected={searchShape === s} onClick={() => setSearchShape(s)}>{s} Shape</OptionButton>
                                ))}
                            </Box>
                        </>
                    ) : (
                        <>
                            {searchType === "scale" ? (
                                <>
                                    <Box mb={3}>
                                        <Typography variant="h6" color="textSecondary">Step 3: Scale Type</Typography>
                                        {scaleTypes.map(s => (
                                            <OptionButton key={s} selected={searchScaleType === s} onClick={() => setSearchScaleType(s)}>{s}</OptionButton>
                                        ))}
                                    </Box>
                                    {searchScaleType && guitar.scales[searchScaleType]?.isModal && guitar.scales[searchScaleType].modes?.length > 0 && (
                                        <Box mb={3}>
                                            <Typography variant="h6" color="textSecondary">Step 4: Modes</Typography>
                                            {guitar.scales[searchScaleType].modes.map(m => (
                                                <OptionButton key={m.name} selected={searchMode === m.name} onClick={() => setSearchMode(m.name)}>{m.name}</OptionButton>
                                            ))}
                                        </Box>
                                    )}
                                </>
                            ) : (
                                <Box mb={3}>
                                    <Typography variant="h6" color="textSecondary">Step 3: Chord Type</Typography>
                                    {degreesDynamic.map(d => (
                                        <OptionButton key={d} selected={searchDegree === d} onClick={() => setSearchDegree(d)}>{guitar.arppegios[d]?.name || d}</OptionButton>
                                    ))}
                                </Box>
                            )}
                        </>
                    )}
                </CardContent>
            </StyledCard>

            {/* RESULTS */}
            <StyledCard>
                <CardContent
                    sx={{
                        bgcolor: 'var(--brutal-mint)',
                        border: '3px solid var(--brutal-ink)',
                        boxShadow: 'var(--brutal-shadow-small)',
                    }}
                >
                    <Typography variant="h5" gutterBottom>Select to Visualize ({filteredElements.length})</Typography>
                    <Box component="ul" sx={{ pl: 0, listStyle: 'none', m: 0 }}>
                        {filteredElements.map((el, idx) => (
                            <Box
                                component="li"
                                key={idx}
                                sx={{
                                    mb: 1,
                                    p: 1.25,
                                    display: 'flex',
                                    alignItems: { xs: 'stretch', sm: 'center' },
                                    justifyContent: 'space-between',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 1,
                                    bgcolor: 'var(--brutal-paper)',
                                    border: '3px solid var(--brutal-ink)',
                                }}
                            >
                                <Typography sx={{ fontWeight: 800 }}>{el.label}</Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => onSelect(el)}
                                    sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
                                >
                                    Visualize
                                </Button>
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </StyledCard>
        </Container>
    );
};

export default PlayWizard;
