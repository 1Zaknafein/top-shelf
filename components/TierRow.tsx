import { Game } from "@/types/types";
import { GameCard } from "./GameCard";

interface TierRowProps {
  tier: string;
  games: Game[];
}

const tiers = new Set(["S", "A", "B", "C", "D", "E", "F"]);

export function TierRow({ tier, games }: TierRowProps) {
  const key = tiers.has(tier) ? tier : "unassigned";

  return (
    <div className={`tier-row my-4 w-full max-w-full rounded-md p-3 min-h-[100px] tier-${key} ${
      key === "unassigned"
        ? "bg-[#131313] border border-gray-800"
        : "bg-(--inner-fill) border border-(--tier-color-border)"
    }`}>

      <div className="flex flex-wrap gap-6 py-2 items-start">
        {games.map((game) => (
          <div
            key={game.id}
            className="game-wrapper p-[2px] flex-none mr-24 mb-[10px] mr-[10px] inline-block"
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  );
}