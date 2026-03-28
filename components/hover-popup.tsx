"use client";

import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import ReactDOM from "react-dom";
import { Button } from "./ui/button";
import { useHover } from "./use-hover";

// Game popup that appears when hovering over a game card.
export function HoverPopup() {
  const { hover, setHover } = useHover();
  const [editMode, setEditMode] = useState(false);
  const [descValue, setDescValue] = useState(hover?.game.description || "");

  const [popupHovered, setPopupHovered] = useState(false);

  if (!hover || typeof window === "undefined") return null;

  const { game, rect } = hover;

  // Keep popup open if mouse is over it
  const handleMouseEnter = () => {
    setHover({ game, rect });
    setPopupHovered(true);
  };
  const handleMouseLeave = () => {
    setPopupHovered(false);
    setEditMode(false);
    setHover(null);
  };

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        left: rect.left + rect.width / 2,
        top: rect.top,
        transform: "translate(-50%, -100%)",
        minWidth: 150,
        maxWidth: 300,
        fontFamily: "system-ui, Arial, Helvetica, sans-serif",
      }}
      className="flex flex-col items-center card-hover text-popover-foreground rounded-lg shadow-lg p-3 animate-fade-in pointer-events-auto gap-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="font-bold text-foreground text-center">{game.title}</div>
      {editMode ? (
        <div className="flex flex-col gap-2 w-full">
          <input
            className="border text-foreground rounded px-2 py-1 text-sm w-full"
            value={descValue}
            onChange={(e) => setDescValue(e.target.value)}
            placeholder="Enter description"
            autoFocus
          />
          <div className="flex gap-2 justify-end ">
            <Button size="xs" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
            <Button
              size="xs"
              onClick={() => {
                // TODO: Save description to backend
                setEditMode(false);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <>
          {game.description && (
            <div className="text-sm text-foreground text-center mb-1">
              {game.description}
            </div>
          )}
          {popupHovered && (
            <div className="flex gap-2 mt-1 text-foreground">
              <Button
                size="icon-xs"
                title="Edit description"
                onClick={() => {
                  setDescValue(game.description || "");
                  setEditMode(true);
                }}
              >
                <Pencil />
              </Button>
              <Button
                size="icon-xs"
                variant="destructive"
                title="Delete"
                onClick={() => {
                  // TODO: Delete logic
                }}
              >
                <Trash />
              </Button>
            </div>
          )}
        </>
      )}
    </div>,
    document.body,
  );
}
