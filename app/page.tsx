"use client";

import { useState } from "react";
import { AddGameForm } from "../components/AddGameForm";
import { TierCard } from "../components/TierCard";
import { TierRow } from "../components/TierRow";
import { mockGameData } from "../lib/mockGames";
import { Game } from "../types/types";

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
    <div className="max-w-screen-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Top-Shelf Tier List</h1>
      <AddGameForm onAddGame={handleAddGame} />

      {tiers.map((tier) => 
      (
        <div key={tier} className={`my-4 flex items-stretch tier-${tier}`}>
          <div className="w-1/5">
            <TierCard tier={tier} className="h-full" />
          </div>

          <div className="flex-1">
            <TierRow tier={tier} games={getGamesByTier(tier)} />
          </div>
        </div>
      ))}


         {/* Unassigned row */}
     <div className="my-4 w-full sm:w-11/12 lg:w-4/5 mx-auto flex items-stretch gap-4 tier-unassigned">
        <div>
          <TierCard tier="" className="h-full" />
        </div>
        <div className="flex-1">
          <TierRow tier="" games={unassignedGames} />
        </div>
      </div> 

    </div>
  );
}



   