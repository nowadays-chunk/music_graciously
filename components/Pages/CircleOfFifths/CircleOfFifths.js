import guitar from '../../../config/guitar';
import React, { useState, useEffect } from 'react';

const CircleOfFifths = ({
    tone,
    quality,
    onElementChange
}) => {
    const [selectedTone, setSelectedTone] = useState(null);
    const [selectedQuality, setSelectedQuality] = useState(null);

    useEffect(() => {
        setSelectedTone(tone);
        setSelectedQuality(quality);
    }, [tone, quality]);

    const majorRadius = 150; // Radius of the circle for major tones
    const minorRadius = 110; // Radius for the inner circle of minor tones
    const majorTones = guitar.circleOfFifths.map((key) => key.key);
    const minorTones = guitar.circleOfFifths.map((key) => key.relative);

    const calculatePosition = (angleDegrees, radius) => {
        const radians = ((angleDegrees - 90) * Math.PI) / 180; // Adjusting the starting angle by -90 degrees to move 'C' to the top
        return {
            x: radius * Math.cos(radians),
            y: radius * Math.sin(radians)
        };
    };

    const selectKey = (tone, quality) => {
        setSelectedTone(tone);
        setSelectedQuality(quality);
    };

    let rotationAngle = 0;
    let selectedMajorTone = selectedTone;
    let selectedMinorTone = selectedTone;

    if (selectedQuality === "Major" || selectedQuality === "Dominant") {
        const majorIndex = majorTones.indexOf(selectedTone);
        if (majorIndex !== -1) {
            rotationAngle = -30 * majorIndex;
            selectedMinorTone = guitar.circleOfFifths[majorIndex].relative.replace('m', '');
        }
    } else if (selectedQuality === "Minor") {
        const minorIndex = minorTones.indexOf(selectedTone + 'm');
        if (minorIndex !== -1) {
            rotationAngle = -30 * minorIndex;
            selectedMajorTone = guitar.circleOfFifths[minorIndex].key;
        }
    }

    const shouldBeHighlighted = (index, isMajor) => {
        const majorIndex = majorTones.indexOf(selectedMajorTone);
        const minorIndex = minorTones.indexOf(selectedMinorTone + 'm');

        // Highlight logic for Major tones (IV, I, V)
        if (isMajor) {
            if (majorIndex === -1) return false;
            const highlightedIndices = [];
            for (let i = -1; i <= 1; i++) {
                highlightedIndices.push((majorIndex + i + majorTones.length) % majorTones.length);
            }
            return highlightedIndices.includes(index);
        }

        // Highlight logic for Minor tones (ii, vi, iii)
        if (!isMajor) {
            if (minorIndex === -1) return false;
            const highlightedIndices = [];
            for (let i = -1; i <= 1; i++) {
                highlightedIndices.push((minorIndex + i + minorTones.length) % minorTones.length);
            }
            return highlightedIndices.includes(index);
        }

        return false;
    };


    return (
        <div className="circle-container" style={{ textAlign: 'center', margin: 0, padding: 0, width: '100%', height: '100%' }}>
            <svg viewBox="-200 -200 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer', display: 'block' }}>
                <rect x="-190" y="-190" width="380" height="380" rx="8" fill="none" stroke="none" />
                <g
                    className="circleOfFifthsTransition"
                    transform={`rotate(${rotationAngle}, 0, 0)`}
                    style={{ transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                >
                    <circle cx="0" cy="0" r={majorRadius + 25} fill="#ffc900" stroke="#111111" strokeWidth="5" />
                    <circle cx="0" cy="0" r={majorRadius} fill="none" stroke="#111111" strokeWidth="4" strokeDasharray="8 8" />
                    <circle cx="0" cy="0" r={minorRadius} fill="none" stroke="#111111" strokeWidth="4" strokeDasharray="8 8" />

                    {majorTones.map((tone, index) => {
                        const position = calculatePosition(index * 30, majorRadius);
                        const counterRotationAngle = -rotationAngle;
                        // For a given center index i, highlight [i-1, i+5] (7 notes)
                        const centerIndex = majorTones.indexOf(selectedMajorTone);
                        let isHighlighted = false;
                        if (centerIndex !== -1) {
                            for (let j = -1; j <= 5; j++) {
                                if ((centerIndex + j + 12) % 12 === index) isHighlighted = true;
                            }
                        }

                        return (
                            <g
                                key={`major-${tone}`}
                                transform={`translate(${position.x}, ${position.y})`}
                                className="hover-group"
                                onClick={() => onElementChange((index * 7) % 12, "key")}
                            >
                                <circle
                                    cx="0"
                                    cy="0"
                                    r="22"
                                    fill={tone === selectedTone ? "#ff7051" : (isHighlighted ? "#90a8ed" : "#fffdf5")}
                                    stroke="#111111"
                                    strokeWidth={tone === selectedTone || isHighlighted ? 5 : 4}
                                    style={{ transition: 'fill 0.3s, stroke 0.3s' }}
                                />
                                <text
                                    x="0"
                                    y="0"
                                    fontSize="14"
                                    fontWeight="900"
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    transform={`rotate(${counterRotationAngle})`}
                                    fill="#111111"
                                >
                                    {tone}
                                </text>
                            </g>
                        );
                    })}
                    {minorTones.map((tone, index) => {
                        const position = calculatePosition(index * 30, minorRadius);
                        const counterRotationAngle = -rotationAngle;

                        const centerIndex = majorTones.indexOf(selectedMajorTone);
                        let isHighlighted = false;
                        if (centerIndex !== -1) {
                            for (let j = -1; j <= 5; j++) {
                                if ((centerIndex + j + 12) % 12 === index) isHighlighted = true;
                            }
                        }

                        return (
                            <g
                                key={`minor-${tone}-${index}`}
                                transform={`translate(${position.x}, ${position.y})`}
                                className="hover-group"
                                onClick={() => onElementChange((index * 7) % 12, "key")}
                            >
                                <circle
                                    cx="0"
                                    cy="0"
                                    r="18"
                                    fill={tone.replace('m', '') === selectedTone ? "#ff90e8" : (isHighlighted ? "#23a094" : "#fffdf5")}
                                    stroke="#111111"
                                    strokeWidth={tone.replace('m', '') === selectedTone || isHighlighted ? 5 : 4}
                                    style={{ transition: 'fill 0.3s, stroke 0.3s' }}
                                />
                                <text
                                    x="0"
                                    y="0"
                                    fontSize="11"
                                    fontWeight="900"
                                    textAnchor="middle"
                                    alignmentBaseline="middle"
                                    transform={`rotate(${counterRotationAngle})`}
                                    fill="#111111"
                                >
                                    {tone}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        </div>
    );
};

export default CircleOfFifths;
