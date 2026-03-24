import Image from "next/image";
import { Game } from "../types/types";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <div className="game-card w-24 h-32 rounded-lg overflow-hidden shadow-lg bg-white cursor-move hover:scale-105 transform transition">
      <div className="relative w-full h-24">
        <Image
          src={game.image}
          alt={game.name}
          width={96}
          height={96}
          className="object-cover"
        />
      </div>
      <div className="p-1 text-xs">
        <div className="font-semibold">{game.name}</div>
        {game.description && (
          <div className="text-gray-500">{game.description}</div>
        )}
      </div>
    </div>
  );
}