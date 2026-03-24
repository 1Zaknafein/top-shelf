"use client";

import { useState } from "react";
import { AddGameForm } from "../components/AddGameForm";
import { TierRow } from "../components/TierRow";
import { Game } from "../types/types";

const mockGameData: Game[] = [
  {
    id: 1,
    name: "The Legend of Zelda: Breath of the Wild",
    image: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
  },
  {
    id: 2,
    name: "Hollow Knight",
    image: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
    tier: "A",
  },
  {
    id: 3,
    name: "Among Us",
    image: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
  },
];

const tiers = ["S", "A", "B", "C", "D", "F"];

export default function Page() {
  const [games, setGames] = useState<Game[]>(mockGameData);

  const handleAddGame = (name: string) => {
    const newGame: Game = {
      id: Date.now(),
      name,
      image: "https://via.placeholder.com/96x96.png?text=Game",
    };
    setGames((prev) => [...prev, newGame]);
  };

  const getGamesByTier = (tier?: string) =>
    games.filter((g) => g.tier === tier);

  const unassignedGames = games.filter((g) => !g.tier);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Top-Shelf Tier List</h1>
      <AddGameForm onAddGame={handleAddGame} />

      {tiers.map((tier) => (
        <TierRow
          key={tier}
          tier={tier}
          description={`Description for ${tier} tier`}
          games={getGamesByTier(tier)}
        />
      ))}

      {/* Unassigned row */}
      <TierRow
        tier="Unassigned"
        description="Drag new games here"
        games={unassignedGames}
      />
    </div>
  );
}