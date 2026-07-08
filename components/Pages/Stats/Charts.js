import React from "react";
import {
    Box,
    Card,
    Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import {
    BarChart, Bar,
    LineChart, Line,
    AreaChart, Area,
    PieChart, Pie, Cell,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ScatterChart, Scatter,
    Treemap,
    FunnelChart, Funnel, LabelList,
    RadialBarChart, RadialBar,
    ComposedChart,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
    CartesianGrid,
    ZAxis,
    ResponsiveContainer
} from "recharts";

import { COLORS } from "./utils";

// ---------------------------------------------
// MINIMAL STYLING CONSTANTS
// ---------------------------------------------
const FONT_FAMILY = '"Arial", "Helvetica", system-ui, sans-serif';
const TEXT_COLOR = "#111111";
const SUBTLE_GRID = "#111111";
const AXIS_COLOR = "#111111";
const MAIN_COLOR = "#ff90e8";

// ---------------------------------------------
// BASIC CARD STYLE
// ---------------------------------------------
export const StatCard = styled(Card)({
    borderRadius: "4px",
    padding: "24px",
    marginBottom: "24px",
    background: "rgba(255, 253, 245, 0.84)",
    width: "100%",
    boxShadow: "var(--brutal-shadow)",
    border: "3px solid var(--brutal-ink)",
    transition: "transform 0.16s ease, box-shadow 0.16s ease",
    "&:hover": {
        transform: "translate(-3px, -3px)",
        boxShadow: "10px 10px 0 var(--brutal-ink)",
    }
});

export const GraphCard = styled(Box)({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    backgroundColor: "rgba(255, 253, 245, 0.82)",
    borderRadius: "4px",
    boxShadow: "var(--brutal-shadow-small)",
    border: "3px solid var(--brutal-ink)",
});

const ChartTitle = ({ children }) => (
    <Typography
        variant="h6"
        sx={{
            mb: 3,
            fontWeight: 900,
            fontSize: "1rem",
            color: TEXT_COLOR,
            fontFamily: FONT_FAMILY,
            textAlign: "left",
            width: "100%",
            letterSpacing: 0
        }}
    >
        {children}
    </Typography>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: "#fffdf5",
                border: "3px solid #111111",
                padding: "8px 12px",
                borderRadius: "4px",
                boxShadow: "6px 6px 0 #111111",
                fontFamily: FONT_FAMILY,
                fontSize: "0.85rem",
            }}>
                <p style={{ margin: 0, fontWeight: 600, color: "#555" }}>{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ margin: "4px 0 0", color: entry.color || MAIN_COLOR }}>
                        {`${entry.name}: ${entry.value}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// ---------------------------------------------
// BAR GRAPH
// ---------------------------------------------
export const BarGraph = ({ data, title, height = 250 }) => (
    <GraphCard>
        <ChartTitle>{title}</ChartTitle>
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid stroke={SUBTLE_GRID} vertical={false} />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: AXIS_COLOR, fontSize: 12 }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: AXIS_COLOR, fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9f9f9" }} />
                <Bar dataKey="value" fill={MAIN_COLOR} radius={[4, 4, 0, 0]} barSize={40}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </GraphCard>
);

// ---------------------------------------------
// PIE GRAPH
// ---------------------------------------------
export const PieGraph = ({ data, title, height = 260 }) => (
    <GraphCard>
        <ChartTitle>{title}</ChartTitle>
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    dataKey="value"
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60} // Donut chart for modern look
                    outerRadius={80}
                    paddingAngle={5}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span style={{ color: AXIS_COLOR, fontSize: "0.85rem" }}>{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    </GraphCard>
);

// ---------------------------------------------
// LINE GRAPH
// ---------------------------------------------
export const LineGraph = ({ data, title, height = 250 }) => (
    <GraphCard>
        <ChartTitle>{title}</ChartTitle>
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid stroke={SUBTLE_GRID} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: AXIS_COLOR, fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: AXIS_COLOR, fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={MAIN_COLOR}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    </GraphCard>
);

// ---------------------------------------------
// AREA GRAPH
// ---------------------------------------------
export const AreaGraph = ({ data, title, height = 250 }) => (
    <GraphCard>
        <ChartTitle>{title}</ChartTitle>
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={MAIN_COLOR} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={MAIN_COLOR} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: AXIS_COLOR, fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: AXIS_COLOR, fontSize: 12 }} />
                <CartesianGrid stroke={SUBTLE_GRID} vertical={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke={MAIN_COLOR} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
        </ResponsiveContainer>
    </GraphCard>
);

// ---------------------------------------------
// SCATTER GRAPH
// ---------------------------------------------
export const ScatterGraph = ({ data, title, height = 300 }) => (
    <GraphCard>
        <ChartTitle>{title}</ChartTitle>
        <ResponsiveContainer width="100%" height={height}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid stroke={SUBTLE_GRID} />
                <XAxis type="number" dataKey="x" name="Fret" unit="" axisLine={false} tickLine={false} tick={{ fill: AXIS_COLOR }} />
                <YAxis type="number" dataKey="y" name="String" unit="" axisLine={false} tickLine={false} tick={{ fill: AXIS_COLOR }} />
                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                <Scatter name="Notes" data={data} fill={MAIN_COLOR}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Scatter>
            </ScatterChart>
        </ResponsiveContainer>
    </GraphCard>
);

// ---------------------------------------------
// TREEMAP
// ---------------------------------------------
const TreemapContent = (props) => {
    const { root, depth, x, y, width, height, index, colors, name, value } = props;
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: colors[index % colors.length],
                    stroke: "#fff",
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                }}
            />
            {width > 30 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 7}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={12}
                    fontWeight={500}
                    style={{ pointerEvents: "none" }}
                >
                    {name}
                </text>
            )}
        </g>
    );
};

export const TreemapGraph = ({ data, title, height = 300 }) => (
    <GraphCard>
        <ChartTitle>{title}</ChartTitle>
        <ResponsiveContainer width="100%" height={height}>
            <Treemap
                data={data}
                dataKey="size"
                ratio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
                content={<TreemapContent colors={COLORS} />}
            />
        </ResponsiveContainer>
    </GraphCard>
);

// ---------------------------------------------
// RADAR GRAPH
// ---------------------------------------------
export const RadarGraph = ({ data, title, height = 280 }) => (
    <GraphCard>
        <ChartTitle>{title}</ChartTitle>
        <ResponsiveContainer width="100%" height={height}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke={SUBTLE_GRID} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                    name="Usage"
                    dataKey="value"
                    stroke={MAIN_COLOR}
                    fill={MAIN_COLOR}
                    fillOpacity={0.4}
                />
                <Tooltip content={<CustomTooltip />} />
            </RadarChart>
        </ResponsiveContainer>
    </GraphCard>
);

// ---------------------------------------------
// RADIAL BAR
// ---------------------------------------------
export const RadialBarGraph = ({ data, title, height = 300 }) => (
    <GraphCard>
        <ChartTitle>{title}</ChartTitle>
        <ResponsiveContainer width="100%" height={height}>
            <RadialBarChart
                innerRadius="20%"
                outerRadius="90%"
                data={data}
                startAngle={180}
                endAngle={0}
                barSize={20}
            >
                <RadialBar
                    minAngle={15}
                    label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    clockWise
                    dataKey="value"
                    cornerRadius={10}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </RadialBar>
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
        </ResponsiveContainer>
    </GraphCard>
);

// ---------------------------------------------
// FUNNEL GRAPH
// ---------------------------------------------
export const FunnelGraph = ({ data, title, height = 300 }) => (
    <GraphCard>
        <ChartTitle>{title}</ChartTitle>
        <ResponsiveContainer width="100%" height={height}>
            <FunnelChart>
                <Tooltip content={<CustomTooltip />} />
                <Funnel
                    dataKey="value"
                    data={data}
                    isAnimationActive
                >
                    <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Funnel>
            </FunnelChart>
        </ResponsiveContainer>
    </GraphCard>
);

// ---------------------------------------------
// RANGE GRAPH (MIN/MAX/AVG)
// ---------------------------------------------
export const RangeGraph = ({ data, title, height = 250 }) => (
    <GraphCard>
        <ChartTitle>{title}</ChartTitle>
        <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: AXIS_COLOR, fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: AXIS_COLOR, fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <CartesianGrid stroke={SUBTLE_GRID} vertical={false} />
                <Bar dataKey="value" barSize={30} radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
                <Line type="monotone" dataKey="value" stroke={MAIN_COLOR} strokeWidth={2} dot={false} />
            </ComposedChart>
        </ResponsiveContainer>
    </GraphCard>
);

// ---------------------------------------------
// HISTOGRAM (FRET COUNT)
// ---------------------------------------------
export const HistogramGraph = ({ data, title, height = 250 }) => (
    <GraphCard>
        <ChartTitle>{title}</ChartTitle>
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid stroke={SUBTLE_GRID} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: AXIS_COLOR, fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: AXIS_COLOR, fontSize: 12 }} />
                <Bar dataKey="value" fill={MAIN_COLOR} radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
                <Tooltip content={<CustomTooltip />} />
            </BarChart>
        </ResponsiveContainer>
    </GraphCard>
);

// ---------------------------------------------
// FLOW GRAPH (Chord Sequence)
// ---------------------------------------------
export const FlowGraph = ({ data, title, height = 250 }) => (
    <GraphCard>
        <ChartTitle>{title}</ChartTitle>
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke={SUBTLE_GRID} horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11, fill: TEXT_COLOR }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill={MAIN_COLOR} radius={[0, 4, 4, 0]} barSize={20}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </GraphCard>
);

// ---------------------------------------------
// HEATMAP (FRET INTENSITY)
// ---------------------------------------------
export const Heatmap = ({ data, title, height = 80 }) => {
    const max = Math.max(...data.map((d) => d.value), 1);
    return (
        <GraphCard>
            <ChartTitle>{title}</ChartTitle>
            <Box sx={{ display: "flex", gap: "2px", width: "100%", justifyContent: "center", overflowX: "auto", pb: 1, minHeight: height }}>
                {data.map((d, i) => {
                    const intensity = d.value / max;
                    // Use a nice gradient or single color opacity
                    const color = `rgba(136, 132, 216, ${0.1 + intensity * 0.9})`;
                    return (
                        <Box
                            key={d.fret}
                            sx={{
                                width: "24px",
                                height: height,
                                background: color,
                                color: intensity > 0.5 ? "#fff" : "#555",
                                fontSize: "0.7rem",
                                display: "flex",
                                flexDirection: "column-reverse",
                                alignItems: "center",
                                pb: 0.5,
                                borderRadius: "4px",
                                transition: "all 0.2s",
                                "&:hover": {
                                    transform: "scaleY(1.1)",
                                }
                            }}
                        >
                            <span style={{ fontSize: "10px" }}>{d.fret}</span>
                        </Box>
                    );
                })}
            </Box>
        </GraphCard>
    );
};
