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
  const [searchResult, setSearchResult] = useState<Partial<Game> | null>(null);

  const [bulkQueue, setBulkQueue] = useState<string[]>([]);
  const [totalBulk, setTotalBulk] = useState(0);

  const reset = () => {
    setSearchResult(null);
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
    setSearchResult(null);

    try {
      const results = await searchGames(next);

      if (!results.length) {
        toast(`No result for "${next}"`);
        processNextInQueue(rest);
        return;
      }

      const game = mapRawgDataToGame(results[0]);

      setSearchResult({
        ...game,
        tier: Tier.Unassigned,
        order_in_tier: null,
      });
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
    if (!searchResult) return;

    const exists = allGames.some(
      (g) =>
        g.title.toLowerCase().trim() ===
        (searchResult.title ?? "").toLowerCase().trim(),
    );

    if (exists) {
      toast("Game already exists!", {
        style: { background: "#f87171", color: "#fff" },
      });
    } else {
      onAddGame(searchResult);
      toast("Game added!");
    }

    reset();
    processNextInQueue();
  };

  const handleSkip = () => {
    reset();
    processNextInQueue();
  };

  return {
    inputValue,
    setInputValue,
    searching,
    searchResult,
    bulkQueue,
    totalBulk,
    handleStart,
    handleAdd,
    handleSkip,
  };
}
