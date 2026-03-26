"use client";

import ReactDOM from "react-dom";
import { useHover } from "./use-hover";

// Game popup that appears when hovering over a game card.
export function HoverPopup() {
  const { hover } = useHover();

  if (!hover || typeof window === "undefined") return null;

  const { game, rect } = hover;

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        left: rect.left + rect.width / 2,
        top: rect.top - 12,
        transform: "translate(-50%, -100%)",
        minWidth: 150,
        maxWidth: game.description ? 300 : 150,
        fontFamily: "system-ui, Arial, Helvetica, sans-serif",
      }}
      className="flex flex-col items-center bg-tier-card text-popover-foreground rounded-lg shadow-lg p-3 animate-fade-in pointer-events-none"
    >
      <div className="font-bold text-foreground text-center">{game.title}</div>
      {game.description && (
        <div className="text-sm text-foreground ">{game.description}</div>
      )}
    </div>,
    document.body,
  );
}
