import { gameApiRequest } from "@/lib/api";
import { Game, Tier } from "@/types/types";
import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { useRef } from "react";

interface TierRowsProviderProps {
  tierRows: Record<Tier, Game[]>;
  setTierRows: React.Dispatch<React.SetStateAction<Record<Tier, Game[]>>>;
  rowOrder: Tier[];
  setRowOrder: React.Dispatch<React.SetStateAction<Tier[]>>;
  children: React.ReactNode;
}

export function TierRowsProvider({
  tierRows,
  setTierRows,
  rowOrder,
  setRowOrder,
  children,
}: TierRowsProviderProps) {
  const previousItems = useRef(tierRows);

  // Store the last valid target tier (row) during drag over
  // Necessary as dnd-kit sees target as item when hovering over another item, even when rows have changed.
  // Otherwise there's no way to know target row.
  const lastTargetTier = useRef<Tier | null>(null);

  return (
    <DragDropProvider
      onDragStart={() => {
        previousItems.current = tierRows;
      }}
      onDragOver={(event) => {
        const { source, target } = event.operation;

        if (target?.type === "row") return;

        if (source?.data.tier !== target?.data.tier) {
          if (target?.data.tier) {
            lastTargetTier.current = target.data.tier;
          }
        }
        setTierRows((items) => move(items, event));
      }}
      onDragEnd={(event) => {
        const { source, target } = event.operation;

        if (event.canceled) {
          if (source?.type === "item") {
            setTierRows(previousItems.current);
          }
          lastTargetTier.current = null;
          return;
        }

        // Handles case when dropped on a row (not on/near an item).
        if (source?.type === "item" && target?.type === "row") {
          setTierRows((prev) => {
            const movedGame = Object.values(tierRows)
              .flat()
              .find((g) => g.id === source.id);

            if (!movedGame) return prev;

            const newRows = { ...prev };

            for (const tier in newRows) {
              newRows[tier as Tier] = newRows[tier as Tier].filter(
                (g) => g.id !== movedGame.id,
              );
            }

            const updatedGame = { ...movedGame, tier: target.id as Tier };

            newRows[target.id as Tier] = [
              ...newRows[target.id as Tier],
              updatedGame,
            ];

            if (movedGame && movedGame.tier !== target.id) {
              gameApiRequest("PUT", {
                id: movedGame.id,
                tier: target.id as Tier,
              });
            }
            return newRows;
          });
        }

        // Handles case when dropped on/near an item, and we need to check if tier changed.
        if (
          source?.type === "item" &&
          target?.type === "item" &&
          lastTargetTier.current
        ) {
          setTierRows((prev) => {
            // Ensure ordering is updated
            const next = move(prev, event);

            const targetTier = lastTargetTier.current as Tier;

            // Update target tier manually
            const newRows = { ...next };

            for (const tier in newRows) {
              newRows[tier as Tier] = newRows[tier as Tier].map((g) =>
                g.id === source.id ? { ...g, tier: targetTier } : g,
              );
            }

            const originalItem = Object.values(prev)
              .flat()
              .find((g) => g.id === source.id);

            if (originalItem && originalItem.tier !== targetTier) {
              gameApiRequest("PUT", {
                id: source.id as string,
                tier: targetTier,
              });
            }

            return newRows;
          });
        }
      }}
    >
      {children}
    </DragDropProvider>
  );
}
