"use client";

import { gameApiRequest } from "@/lib/api";
import { Game, Tier } from "@/types/types";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Settings } from "lucide-react";
import { useState } from "react";
import { AddNewItem } from "./add-new-item";
import { HoverPopup } from "./hover-popup";
import { SettingsMenu } from "./settings-menu";
import { TierCard } from "./tier-card";
import { TierRow } from "./tier-row";
import { Button } from "./ui/button";
import { HoverProvider } from "./use-hover";

export const tiers: Tier[] = [
  Tier.S,
  Tier.A,
  Tier.B,
  Tier.C,
  Tier.D,
  Tier.E,
  Tier.F,
];
const cardAspectRatio = 16 / 9;

interface Props {
  initialGames: Game[];
}

export default function MainPage({ initialGames }: Props) {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [showSettings, setShowSettings] = useState(false);
  const [rowMinHeight, setRowMinHeight] = useState(64);

  const imgWidth = Math.round(rowMinHeight * cardAspectRatio);

  const addGame = async (game: Game) => {
    const createdGame = await gameApiRequest("POST", game);

    setGames((prev) => [...prev, createdGame]);
  };

  const getGamesByTier = (tier?: string) =>
    games.filter((g) => g.tier === tier);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const gameId = active.id as number;
    const newTier = over.id as Tier;

    setGames((prev) =>
      prev.map((game) =>
        game.id === gameId ? { ...game, tier: newTier } : game,
      ),
    );

    await gameApiRequest("PUT", {
      id: gameId,
      tier: newTier,
    });
  };

  const unassignedGames = games.filter((g) => g.tier === Tier.Unassigned);

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

        <DndContext onDragEnd={handleDragEnd}>
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
                  tier={tier as Tier}
                  imgWidth={imgWidth}
                  imgHeight={rowMinHeight}
                />
              </div>
            </div>
          ))}

          <HoverPopup />

          <span className="flex pt-10 text-2xl font-bold">
            Unassigned games
          </span>
          <hr className="w-full border-t-2 border-border my-4 opacity-20" />

          <div
            key={Tier.Unassigned}
            className={`gap-2 my-10 flex items-stretch `}
          >
            <AddNewItem onAddGame={addGame} />

            <div className="flex-1 tier-unassigned mb-4">
              <TierRow
                games={unassignedGames}
                tier={Tier.Unassigned}
                imgWidth={imgWidth}
                imgHeight={rowMinHeight}
              />
            </div>
          </div>
        </DndContext>
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
