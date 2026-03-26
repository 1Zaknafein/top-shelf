"use client";

import { Game, Tier } from "@/types/types";
import { useDroppable } from "@dnd-kit/core";
import { GameCard } from "./game-card";

interface TierRowProps {
  games: Game[];
  imgWidth: number;
  imgHeight: number;
  tier: Tier;
}

export function TierRow({ games, tier, imgWidth, imgHeight }: TierRowProps) {
  const { setNodeRef, isOver } = useDroppable({ id: tier });

  return (
    <div
      ref={setNodeRef}
      className={
        "tier-row glass-bg rounded-lg" + (isOver ? " ring-2 ring-primary" : "")
      }
      style={{ minHeight: `${80}px` }}
    >
      <div className="flex flex-wrap">
        {games.map((game) => (
          <div
            key={game.id}
            className="game-wrapper flex-none inline-block p-1.5"
          >
            <GameCard game={game} imgWidth={imgWidth} imgHeight={imgHeight} />
          </div>
        ))}
      </div>
    </div>
  );
}
