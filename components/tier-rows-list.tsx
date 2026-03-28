import { Game, Tier } from "@/types/types";
import { GameCard } from "./game-card";
import { TierCard } from "./tier-card";
import { TierRow } from "./tier-row";

interface TierRowsListProps {
  rowOrder: Tier[];
  tierRows: Record<Tier, Game[]>;
  rowMinHeight: number;
  imgWidth: number;
}

export function TierRowsList({
  rowOrder,
  tierRows,
  rowMinHeight,
  imgWidth,
}: TierRowsListProps) {
  return (
    <div>
      {rowOrder.map((row, rowIndex) => (
        <div key={row} className={`gap-2 my-4 flex items-stretch tier-${row}`}>
          <div>
            <TierCard tier={row} className="h-full" />
          </div>
          <div className="flex-1">
            <TierRow key={row} id={row} index={rowIndex}>
              {tierRows[row as Tier].map((game, index) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={index}
                  imgHeight={rowMinHeight}
                  imgWidth={imgWidth}
                  row={row as Tier}
                />
              ))}
            </TierRow>
          </div>
        </div>
      ))}
    </div>
  );
}
