import { Game } from "@/types/types";
import { GameCard } from "./GameCard";

interface TierRowProps {
  tier: string;
  games: Game[];
  imgWidth: number;
  imgHeight: number;
}

const tiers = new Set(["S", "A", "B", "C", "D", "E", "F"]);

export function TierRow({ tier, games, imgWidth, imgHeight }: TierRowProps) {
  const key = tiers.has(tier) ? tier : "unassigned";

  return (
    <div
      className={`tier-row tier-${key} bg-(--inner-fill) border border-(--tier-color-border)`}
      style={{ minHeight: `${imgHeight}px` }}
    >
      <div className="flex flex-wrap">
        {games.map((game) => (
          <div
            key={game.id}
            className="game-wrapper flex-none inline-block p-[6px]"
          >
            <GameCard game={game} imgWidth={imgWidth} imgHeight={imgHeight} />
          </div>
        ))}
      </div>
    </div>
  );
}
