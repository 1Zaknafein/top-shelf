import { Game } from "@/types/types";
import { GameCard } from "./GameCard";
import { TierCard } from "./TierCard";

interface TierRowProps {
  tier: string;
  description?: string;
  games: Game[];
}

const tiers = new Set(["S", "A", "B", "C", "D", "E", "F"]);

export function TierRow({ tier, description, games }: TierRowProps) {
  const key = tiers.has(tier) ? tier : 'unassigned';

  return (
    <div className={`tier-row-outer my-4 w-full sm:w-11/12 lg:w-4/5 mx-auto tier-${key}`}>
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-4">
        <div className="flex-shrink-0 self-stretch">
          <TierCard tier={tier} className="w-16 sm:w-20 h-full flex items-center justify-center" />
        </div>

        <div
          className={`flex flex-col bg-[var(--inner-fill)] rounded-md p-3 border ${
            key === 'unassigned' ? 'bg-[#131313] border-gray-800' : 'border-[var(--tier-color-border)]'
          }`}
        >
          <div className="tier-header">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold truncate">Tier {tier}</h2>

                {description && (
                  <span className="text-sm text-gray-400 hidden sm:inline">
                    {description}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="tier-games">
            {games.map((game) => (
              <div key={game.id} className="game-wrapper">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}