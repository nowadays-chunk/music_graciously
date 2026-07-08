// ui/app/AppShell.jsx
import React from "react";
import { ScoreProvider } from "@/core/editor/ScoreContext";
import MenuBar from "@/ui/editor/MenuBar";
import Toolbar from "@/ui/editor/Toolbar";
import TransportBar from "@/ui/editor/TransportBar";
import Layout from "@/ui/editor/Layout";
import KeyboardShortcutsOverlay from "@/ui/editor/KeyboardShortcutsOverlay";

export default function AppShell() {
  return (
    <ScoreProvider>
      <MenuBar />
      <Toolbar />
      <TransportBar />
      <Layout />
      <KeyboardShortcutsOverlay />
    </ScoreProvider>
  );
}
