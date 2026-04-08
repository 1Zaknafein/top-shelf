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
  isAuthenticated: boolean;
}

export function AddNewItem({ onAddGame, allGames, isAuthenticated }: Props) {
  const {
    inputValue,
    setInputValue,
    searching,
    searchResults,
    selectedIndex,
    handleSelect,
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
        <div className="relative inline-flex">
          <Button className="glass-bg w-18 h-18">
            <Plus style={{ width: "40px", height: "40px" }} />
          </Button>
          {!isAuthenticated && (
            <span
              className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none"
              title="Not signed in — changes won't be saved"
            >
              !
            </span>
          )}
        </div>
      </DrawerTrigger>

      <DrawerContent className="data-[vaul-drawer-direction=top]:max-h-[50vh] bg-background/96">
        <DrawerHeader>
          <DrawerTitle>
            {searching
              ? "Searching..."
              : searchResults.length > 0
                ? ""
                : "Add game"}
          </DrawerTitle>

          <DrawerDescription>
            {searching
              ? "Fetching game data..."
              : searchResults.length > 0
                ? "Add or skip"
                : isAuthenticated
                  ? "Enter title(s)"
                  : "Enter title(s) — not signed in, changes won't be saved"}
          </DrawerDescription>
        </DrawerHeader>

        {/* Progress bar */}
        {totalBulk > 0 &&
          (searching || searchResults.length > 0 || bulkQueue.length > 0) && (
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

        {searchResults.length === 0 && !searching && (
          <AddGameInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleStart={handleStart}
          />
        )}

        {searchResults.length > 0 && (
          <AddGameResult
            searchResults={searchResults}
            selectedIndex={selectedIndex}
            handleSelect={handleSelect}
            handleAdd={handleAdd}
            handleSkip={handleSkip}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
