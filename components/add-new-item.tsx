"use client";

import "@/app/add-button.css";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { mapRawgDataToGame, searchGames } from "@/lib/rawg";
import { Game, Tier } from "@/types/types";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface AddGameButtonProps {
  onAddGame: (game: Partial<Game>) => void;
  allGames: Game[];
}

export function AddNewItem({ onAddGame, allGames }: AddGameButtonProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<null | Partial<Game>>(null);

  const handleSearch = async () => {
    if (!inputValue.trim()) return;

    setSearching(true);
    setSearchResult(null);

    try {
      const results = await searchGames(inputValue.trim());

      if (!results.length) {
        setSearchResult(null);
        return;
      }

      const game = mapRawgDataToGame(results[0]);

      setSearchResult({
        ...game,
        tier: Tier.Unassigned,
        order_in_tier: null,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = () => {
    if (searchResult == null) {
      throw new Error("No search result to add!");
    }

    const exists = allGames.some(
      (g) =>
        g.title.trim().toLowerCase() ===
        (searchResult.title ?? "").trim().toLowerCase(),
    );

    setSearching(false);
    setInputValue("");

    if (exists) {
      toast("Game already exists!", {
        position: "bottom-right",
        duration: 2000,
        style: { background: "#f87171", color: "#fff" },
      });

      setSearchResult(null);

      return;
    }

    onAddGame(searchResult);

    toast("Game has been added!", {
      position: "bottom-right",
      duration: 2000,
    });

    setSearchResult(null);
  };

  const handleClose = () => {
    setInputValue("");
    setSearching(false);
    setSearchResult(null);
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button className="glass-bg rounded-lg w-20 justify-center h-20 hover:scale-102 active:scale-95">
          <Plus style={{ width: "40px", height: "40px" }} />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="data-[vaul-drawer-direction=top]:max-h-[50vh] bg-background/96">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <div className="flex flex-col items-center justify-center space-x-2">
              <DrawerTitle>
                {searching
                  ? "Searching..."
                  : searchResult
                    ? ""
                    : "Add a new item"}
              </DrawerTitle>

              <DrawerDescription>
                {searching
                  ? "Please wait while we fetch game data."
                  : searchResult
                    ? "Click Add to insert this game into your list."
                    : "Enter the title you want to search."}
              </DrawerDescription>
            </div>
          </DrawerHeader>

          {/* Input State */}
          {!searchResult && !searching && (
            <form
              className="space-y-4 p-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <input
                type="text"
                name="gameName"
                placeholder="Game name..."
                className="w-full border rounded px-2 py-2 text-secondary"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <DrawerFooter className="flex justify-end gap-2">
                <Button
                  type="submit"
                  disabled={searching || !inputValue.trim()}
                >
                  Search
                </Button>
              </DrawerFooter>
            </form>
          )}

          {/* Result State */}
          {searchResult && (
            <div className="flex flex-col items-center space-y-4 p-4">
              <span className="text-lg font-semibold text-secondary">
                {searchResult.title ?? "Unknown Title"}
              </span>
              <div className="w-32 h-20 relative rounded overflow-hidden">
                <Image
                  src={searchResult.image ?? "/placeholder.webp"}
                  alt={searchResult.title ?? "Game image"}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>

              <DrawerFooter className="flex flex-col items-center gap-2 w-full">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="fancy-add-btn mb-2 w-50"
                >
                  <span className="shadow"></span>
                  <span className="edge"></span>
                  <span className="front">Add</span>
                </button>
                <Button className="w-32 mx-auto" onClick={handleClose}>
                  Cancel
                </Button>
              </DrawerFooter>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
