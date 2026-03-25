"use client";

import { AddNewItem } from "@/components/add-new-item";
import { useEffect, useState } from "react";
import { TierCard } from "../components/tier-card";
import { TierRow } from "../components/tier-row";
import { mockGameData } from "../lib/mockGames";
import { Game } from "../types/types";

const tiers = ["S", "A", "B", "C", "D", "E", "F"];

export default function Page() {
  const [games, setGames] = useState<Game[]>(mockGameData);

  const [rowMinHeight, setRowMinHeight] = useState(72);
  const aspectRatio = 16 / 9;

  useEffect(() => {
    function updateHeight() {
      const width = window.innerWidth;

      if (width >= 768) setRowMinHeight(72);
      else if (width >= 640) setRowMinHeight(54);
    }

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const imgWidth = Math.round(rowMinHeight * aspectRatio);

  const getGamesByTier = (tier?: string) =>
    games.filter((g) => g.tier === tier);

  const unassignedGames = games.filter((g) => !g.tier);

  return (
    <div className="mx:0 md:mx-50">
      <div className="flex flex-col gap-2 items-center justify-center text-center">
        <h1 className="text-4xl font-bold pt-6">Top Shelf</h1>
        <hr className="hr-fade h-0.5 w-100 my-4" />
        <h2 className="text-lg font-medium mb-4 text-secondary/50">
          Rank your favorites!
        </h2>
      </div>

      {tiers.map((tier) => (
        <div
          key={tier}
          className={`gap-2 my-4 flex items-stretch tier-${tier}`}
        >
          <div>
            <TierCard tier={tier} className="h-full" />
          </div>

          <div className="flex-1">
            <TierRow
              games={getGamesByTier(tier)}
              imgWidth={imgWidth}
              imgHeight={rowMinHeight}
            />
          </div>
        </div>
      ))}
      <span className="flex pt-10 text-2xl font-bold">Unassigned games</span>
      <hr className="w-full border-t-2 border-border my-4 opacity-20" />

      <div key="unassigned" className={`gap-2 my-10 flex items-stretch `}>
        <AddNewItem
          onAddGame={(name) =>
            setGames([
              ...games,
              { id: Date.now(), name, image: "/placeholder.webp", tier: "" },
            ])
          }
        />

        <div className="flex-1 tier-unassigned">
          <TierRow
            games={unassignedGames}
            imgWidth={imgWidth}
            imgHeight={rowMinHeight}
          />
        </div>
      </div>
    </div>
  );
}
