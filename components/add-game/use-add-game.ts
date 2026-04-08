"use client";

import { mapRawgDataToGame, searchGames } from "@/lib/rawg";
import { Game, Tier } from "@/types/types";
import { useState } from "react";
import { toast } from "sonner";

export function useAddGame(
  onAddGame: (g: Partial<Game>) => void,
  allGames: Game[],
) {
  const [inputValue, setInputValue] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Partial<Game>[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [bulkQueue, setBulkQueue] = useState<string[]>([]);
  const [totalBulk, setTotalBulk] = useState(0);

  const reset = () => {
    setSearchResults([]);
    setSelectedIndex(0);
    setSearching(false);
    setInputValue("");
  };

  const processNextInQueue = async (queue?: string[]) => {
    const currentQueue = queue ?? bulkQueue;
    if (currentQueue.length === 0) return;
    const [next, ...rest] = currentQueue;
    setBulkQueue(rest);
    setInputValue(next);
    setSearching(true);
    setSearchResults([]);
    setSelectedIndex(0);
    try {
      const results = await searchGames(next);
      if (!results.length) {
        toast(`No result for "${next}"`);
        processNextInQueue(rest);
        return;
      }
      const mapped = results
        .slice(0, 3)
        .map(mapRawgDataToGame)
        .map((game: Partial<Game>) => ({
          ...game,
          tier: Tier.Unassigned,
          order_in_tier: null,
        }));
      setSearchResults(mapped);
      setSelectedIndex(0);
    } catch {
      processNextInQueue(rest);
    } finally {
      setSearching(false);
    }
  };

  const handleStart = () => {
    const titles = inputValue
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);

    if (!titles.length) return;

    setBulkQueue(titles);
    setTotalBulk(titles.length);

    processNextInQueue(titles);
  };

  const handleAdd = () => {
    if (!searchResults.length) return;
    const selected = searchResults[selectedIndex];
    if (!selected) return;
    const exists = allGames.some(
      (g) =>
        g.title.toLowerCase().trim() ===
        (selected.title ?? "").toLowerCase().trim(),
    );
    if (exists) {
      toast("Game already exists!", {
        style: { background: "#f87171", color: "#fff" },
      });
    } else {
      onAddGame(selected);
      toast("Game added!");
    }
    reset();
    processNextInQueue();
  };

  const handleSkip = () => {
    reset();
    processNextInQueue();
  };

  const handleSelect = (idx: number) => {
    setSelectedIndex(idx);
  };

  return {
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
  };
}
