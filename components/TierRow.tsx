import { Game } from "@/types/types";
import { GameCard } from "./GameCard";

interface TierRowProps {
  tier: string;
  description?: string;
  games: Game[];
}

export function TierRow({ tier, description, games }: TierRowProps) {
  return (
    <div className="tier-row my-4 p-2 border rounded-lg bg-gray-100">
      <div className="tier-header flex items-center mb-2">
        <h2 className="text-xl font-bold mr-4">{tier}</h2>
        {description && (
          <span className="text-gray-500 text-sm hover:underline cursor-help">
            {description}
          </span>
        )}
      </div>
      <div className="tier-games flex flex-wrap gap-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}