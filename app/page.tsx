"use client";

import { AddNewItem } from "@/components/add-new-item";
import { useEffect, useState } from "react";
import { TierCard } from "../components/tier-card";
import { TierRow } from "../components/tier-row";
import { mockGameData } from "../lib/mockGames";
import { Game } from "../types/types";

const tiers = ["S", "A", "B", "C", "D", "F"];

export default function Page() {
  const [games, setGames] = useState<Game[]>(mockGameData);

  const [rowMinHeight, setRowMinHeight] = useState(72);
  const aspectRatio = 16 / 9;

  useEffect(() => {
    function updateHeight() {
      const width = window.innerWidth;

      if (width >= 768) setRowMinHeight(80);
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
      <h1 className="text-3xl font-bold mb-4">Top-Shelf Tier List</h1>

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

      {/* Unassigned row */}

      <div key="unassigned" className={`gap-2 my-10 flex items-stretch `}>
        <AddNewItem
          onAddGame={(name) =>
            setGames([
              ...games,
              { id: Date.now(), name, image: "/placeholder.webp", tier: "" },
            ])
          }
        />

        <div className="flex-1">
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
