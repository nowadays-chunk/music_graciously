// ui/editor/TabBar.jsx
import React from "react";
import { Tabs, Tab } from "@mui/material";

export default function TabBar({ tabs, active, onChange }) {
  return (
    <Tabs value={active} onChange={(e, v) => onChange(v)}>
      {tabs.map((t, i) => (
        <Tab key={i} label={t.title || "Untitled"} />
      ))}
    </Tabs>
  );
}
