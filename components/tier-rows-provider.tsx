import { gameApiRequest } from "@/lib/api";
import { Game, Tier } from "@/types/types";
import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { useRef } from "react";

interface TierRowsProviderProps {
  tierRows: Record<Tier, Game[]>;
  setTierRows: React.Dispatch<React.SetStateAction<Record<Tier, Game[]>>>;
  children: React.ReactNode;
}

export function TierRowsProvider({
  tierRows,
  setTierRows,
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

        // Handles case when dropped on a row (not on/near an item).
        if (source?.type === "item" && target?.type === "row") {
          setTierRows((prev) => {
            const movedGame = Object.values(prev)
              .flat()
              .find((g) => g.id === source.id);

            if (!movedGame) return prev;

            const targetTier = target.id as Tier;

            const newRows = { ...prev };

            // remove from all rows
            for (const tier in newRows) {
              newRows[tier as Tier] = newRows[tier as Tier].filter(
                (g) => g.id !== movedGame.id,
              );
            }

            // add to target row
            const updatedTargetRow = [
              ...newRows[targetTier],
              { ...movedGame, tier: targetTier },
            ].map((g, i) => ({
              ...g,
              order_in_tier: i,
            }));

            newRows[targetTier] = updatedTargetRow;

            // update all items in target row
            updatedTargetRow.forEach((g) => {
              gameApiRequest("PUT", {
                id: g.id,
                tier: g.tier,
                order_in_tier: g.order_in_tier,
              });
            });

            return newRows;
          });
        }

        // Handles case when dropped on/near an item, and we need to check if tier changed.
        if (source?.type === "item" && target?.type === "item") {
          setTierRows((prev) => {
            const next = move(prev, event);

            const targetTier =
              lastTargetTier.current ?? (source.data.tier as Tier);

            const targetRow = next[targetTier];

            // reindex entire target row
            const updatedRow = targetRow.map((g, i) => ({
              ...g,
              tier: targetTier,
              order_in_tier: i,
            }));

            const newRows = {
              ...next,
              [targetTier]: updatedRow,
            };

            updatedRow.forEach((g) => {
              const original = Object.values(prev)
                .flat()
                .find((o) => o.id === g.id);

              if (
                original &&
                (original.tier !== g.tier ||
                  original.order_in_tier !== g.order_in_tier)
              ) {
                gameApiRequest("PUT", {
                  id: g.id,
                  tier: g.tier,
                  order_in_tier: g.order_in_tier,
                });
              }
            });

            return newRows;
          });
        }
      }}
    >
      {children}
    </DragDropProvider>
  );
}
