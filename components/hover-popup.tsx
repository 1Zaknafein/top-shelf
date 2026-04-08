"use client";

import { gameApiRequest } from "@/lib/api";
import { Game } from "@/types/types";
import { Pencil, Trash } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import ReactDOM from "react-dom";
import { Button } from "./ui/button";
import { useHover } from "./use-hover";

// Game popup that appears when hovering over a game card.

interface HoverPopupProps {
  setTierRowData: Dispatch<SetStateAction<Record<string, Game[]>>>;
}

export function HoverPopup({ setTierRowData }: HoverPopupProps) {
  const { hover, setHover } = useHover();
  const [editMode, setEditMode] = useState(false);
  const [descValue, setDescValue] = useState(hover?.game.description || "");
  const [popupHovered, setPopupHovered] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

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
    setConfirmDelete(false);
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
              onClick={async () => {
                const updated = await gameApiRequest("PUT", {
                  ...game,
                  description: descValue,
                });
                setTierRowData((prev) => {
                  const newData = { ...prev };
                  const tier = updated.tier || "unassigned";
                  newData[tier] = newData[tier].map((g) =>
                    g.id === updated.id
                      ? { ...g, description: updated.description }
                      : g,
                  );
                  return newData;
                });
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
              {confirmDelete ? (
                <>
                  <Button
                    size="xs"
                    variant="destructive"
                    onClick={async () => {
                      await gameApiRequest("DELETE", { id: game.id });

                      setTierRowData((prev) => {
                        const newData = { ...prev };
                        const tier = game.tier || "unassigned";
                        newData[tier] = newData[tier].filter(
                          (g) => g.id !== game.id,
                        );
                        return newData;
                      });

                      handleMouseLeave();
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  size="icon-xs"
                  variant="destructive"
                  title="Delete"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash />
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>,
    document.body,
  );
}
