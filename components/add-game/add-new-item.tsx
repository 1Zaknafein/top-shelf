"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Plus } from "lucide-react";

import { Game } from "@/types/types";
import { AddGameInput } from "./add-game-input";
import { AddGameResult } from "./add-game-result";
import { useAddGame } from "./use-add-game";

interface Props {
  onAddGame: (game: Partial<Game>) => void;
  allGames: Game[];
}

export function AddNewItem({ onAddGame, allGames }: Props) {
  const {
    inputValue,
    setInputValue,
    searching,
    searchResult,
    bulkQueue,
    totalBulk,
    handleStart,
    handleAdd,
    handleSkip,
  } = useAddGame(onAddGame, allGames);

  const progress =
    totalBulk > 0 ? ((totalBulk - bulkQueue.length) / totalBulk) * 100 : 0;

  const processed = totalBulk - bulkQueue.length;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="glass-bg w-18 h-18">
          <Plus style={{ width: "40px", height: "40px" }} />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="data-[vaul-drawer-direction=top]:max-h-[50vh] bg-background/96">
        <DrawerHeader>
          <DrawerTitle>
            {searching ? "Searching..." : searchResult ? "" : "Add game"}
          </DrawerTitle>

          <DrawerDescription>
            {searching
              ? "Fetching game data..."
              : searchResult
                ? "Add or skip"
                : "Enter title(s)"}
          </DrawerDescription>
        </DrawerHeader>

        {/* Progress bar */}
        {totalBulk > 0 &&
          (searching || searchResult || bulkQueue.length > 0) && (
            <div className="flex flex-col items-center px-4 mb-2">
              <div className="text-sm mb-1 text-center text-foreground">
                {processed} / {totalBulk}
              </div>
              <div className="w-50 bg-foreground h-2 rounded">
                <div
                  className="bg-lime-600 h-2 rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

        {!searchResult && !searching && (
          <AddGameInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleStart={handleStart}
          />
        )}

        {searchResult && (
          <AddGameResult
            searchResult={searchResult}
            handleAdd={handleAdd}
            handleSkip={handleSkip}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
