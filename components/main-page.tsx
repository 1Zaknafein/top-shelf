"use client";

import { gameApiRequest } from "@/lib/api";
import { Game, Tier } from "@/types/types";
import { Settings } from "lucide-react";
import { useState } from "react";
import { GameCard } from "./game-card";
import { HoverPopup } from "./hover-popup";
import { TierRowsList } from "./tier-rows-list";
import { TierRowsProvider } from "./tier-rows-provider";

import { AddNewItem } from "./add-game/add-new-item";
import { SearchBar } from "./search-bar";
import { SettingsMenu } from "./settings/settings-menu";
import { TierRow } from "./tier-row";
import { Button } from "./ui/button";
import { HoverProvider } from "./use-hover";
import { SearchProvider } from "./use-search";

interface Props {
  initialGames: Game[];
}

export default function MainPage({ initialGames }: Props) {
  const [tierRowData, setTierRowData] = useState<Record<Tier, Game[]>>(() => {
    const grouped = initialGames.reduce(
      (acc, game) => {
        const tier = game.tier || Tier.Unassigned;
        if (!acc[tier]) {
          acc[tier] = [];
        }
        acc[tier].push(game);
        return acc;
      },
      {
        [Tier.S]: [],
        [Tier.A]: [],
        [Tier.B]: [],
        [Tier.C]: [],
        [Tier.D]: [],
        [Tier.E]: [],
        [Tier.F]: [],
        [Tier.Unassigned]: [],
      } as Record<Tier, Game[]>,
    );

    // Sort each tier by order_in_tier
    Object.keys(grouped).forEach((tier) => {
      grouped[tier as Tier].sort((a, b) => {
        const aOrder = a.order_in_tier ?? Infinity;
        const bOrder = b.order_in_tier ?? Infinity;
        return aOrder - bOrder;
      });
    });

    return grouped;
  });

  const addGame = async (game: Partial<Game>) => {
    const createdGame = await gameApiRequest("POST", game);

    setTierRowData((prev) => ({
      ...prev,
      [Tier.Unassigned]: [...prev[Tier.Unassigned], createdGame],
    }));
  };

  const tierRowOrder = Object.keys(tierRowData).filter(
    (key) => key !== Tier.Unassigned,
  ) as Tier[];

  const [showSettings, setShowSettings] = useState(false);

  return (
    <SearchProvider>
      <div className="mx:0 md:mx-50">
        <div className="flex flex-col gap-2 items-center justify-center text-center">
          <h1 className="text-4xl font-bold pt-6">Top Shelf</h1>
          <hr className="hr-fade h-0.5 w-100 my-4" />
          <h2 className="text-lg font-medium mb-4 text-secondary/50">
            Rank your favorites!
          </h2>
        </div>

        <div className="flex justify-end mr-1 gap-5 -mt-3">
          <SearchBar />

          <Button
            className="glass-bg rounded-full p-2 h-auto w-auto "
            onClick={() => setShowSettings((v) => !v)}
          >
            <Settings style={{ width: "30px", height: "30px" }} />
          </Button>
        </div>

        <HoverProvider>
          <TierRowsProvider tierRows={tierRowData} setTierRows={setTierRowData}>
            <TierRowsList rowOrder={tierRowOrder} tierRows={tierRowData} />

            <HoverPopup setTierRowData={setTierRowData} />

            <span className="flex pt-10 text-2xl font-bold">
              Unassigned games
            </span>
            <hr className="w-full border-t-2 border-border my-4 opacity-20" />

            <div
              key={Tier.Unassigned}
              className={`gap-4 my-10 pb-10 flex items-stretch `}
            >
              <AddNewItem
                onAddGame={addGame}
                allGames={Object.values(tierRowData).flat()}
              />

              <div className="flex-1 tier-unassigned mb-4">
                <TierRow id={Tier.Unassigned}>
                  {tierRowData[Tier.Unassigned].map((game, index) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      index={index}
                      row={Tier.Unassigned}
                    />
                  ))}
                </TierRow>
              </div>
            </div>
          </TierRowsProvider>
        </HoverProvider>
      </div>

      {showSettings && (
        <SettingsMenu
          onClose={() => setShowSettings(false)}
          tierRowData={tierRowData}
          setTierRowData={setTierRowData}
        />
      )}
    </SearchProvider>
  );
}
