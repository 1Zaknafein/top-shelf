import Image from "next/image";
import { Game } from "../types/types";

interface GameCardProps {
  game: Game;
  imgWidth: number;
  imgHeight: number;
}

export function GameCard({ game, imgWidth, imgHeight }: GameCardProps) {
  const glowStyle = game.tier
    ? {
        boxShadow:
          "0 0 6px var(--tier-color-glow), 0 2px 18px var(--tier-color-glow)",
      }
    : undefined;

  return (
    <div
      className={`game-card rounded-md overflow-hidden cursor-move`}
      style={glowStyle}
    >
      <div className="w-full h-full flex items-center justify-center">
        <Image
          src={game.image}
          alt={game.name}
          width={imgWidth}
          height={imgHeight}
          loading="eager"
          className="object-cover"
        />
      </div>
    </div>
  );
}
