"use client";

import { AddNewItem } from "@/components/add-new-item";
import { HoverPopup } from "@/components/hover-popup";
import { SettingsMenu } from "@/components/settings-menu";
import { Button } from "@/components/ui/button";
import { HoverProvider } from "@/components/use-hover";
import { Settings } from "lucide-react";
import { useState } from "react";
import { TierCard } from "../components/tier-card";
import { TierRow } from "../components/tier-row";
import { mockGameData } from "../lib/mockGames";
import { Game } from "../types/types";

const tiers = ["S", "A", "B", "C", "D", "E", "F"];
const cardAspectRatio = 16 / 9;

export default function Page() {
  const [games, setGames] = useState<Game[]>(mockGameData);
  const [showSettings, setShowSettings] = useState(false);
  const [rowMinHeight, setRowMinHeight] = useState(60);

  const imgWidth = Math.round(rowMinHeight * cardAspectRatio);

  const getGamesByTier = (tier?: string) =>
    games.filter((g) => g.tier === tier);

  const unassignedGames = games.filter((g) => !g.tier);

  return (
    <HoverProvider>
      <div className="mx:0 md:mx-50">
        <div className="flex flex-col gap-2 items-center justify-center text-center">
          <h1 className="text-4xl font-bold pt-6">Top Shelf</h1>
          <hr className="hr-fade h-0.5 w-100 my-4" />
          <h2 className="text-lg font-medium mb-4 text-secondary/50">
            Rank your favorites!
          </h2>
        </div>

        <div className="flex justify-end mr-1 -mt-3">
          <Button
            className="glass-bg rounded-full p-2 h-auto w-auto "
            onClick={() => setShowSettings((v) => !v)}
          >
            <Settings style={{ width: "30px", height: "30px" }} />
          </Button>
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

        <HoverPopup />

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

      {showSettings && (
        <SettingsMenu
          onClose={() => setShowSettings(false)}
          rowMinHeight={rowMinHeight}
          setRowMinHeight={setRowMinHeight}
        />
      )}
    </HoverProvider>
  );
}
