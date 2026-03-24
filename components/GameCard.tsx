import Image from "next/image";
import { Game } from "../types/types";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {

  return (
    <div className="game-card w-24 h-32 rounded-lg overflow-hidden shadow-lg bg-white cursor-move hover:scale-105 transform transition">
      <div className="w-full h-full flex items-center justify-center">

        { /* RAWG images have 16x9 aspect ratio */}
        <Image
          src={game.image}
          alt={game.name}
          width={128}
          height={72}
          className="object-cover"
        />
      </div>
    </div>
  );
}