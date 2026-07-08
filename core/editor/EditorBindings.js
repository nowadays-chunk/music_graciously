// core/editor/EditorBindings.js
import { useEffect } from "react";
import useEditorCommands from "./EditorCommands";

export default function EditorBindings() {
  const { onKey } = useEditorCommands();

  useEffect(() => {
    const handler = (e) => onKey(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey]);

  return null;
}
