import { Game } from "@/types/types";
import { GameCard } from "./game-card";

interface TierRowProps {
  games: Game[];
  imgWidth: number;
  imgHeight: number;
}

export function TierRow({ games, imgWidth, imgHeight }: TierRowProps) {
  return (
    <div
      className={`tier-row bg-inner-fill rounded-lg `}
      style={{ minHeight: `${imgHeight}px` }}
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
