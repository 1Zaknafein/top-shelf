"use client";

import { findGamesByTitlesInDb } from "@/lib/api";
import { mapRawgDataToGame, searchGames } from "@/lib/rawg";
import { Game, Tier } from "@/types/types";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function useAddGame(
  onAddGame: (g: Partial<Game>) => void,
  allGames: Game[],
  isAuthenticated: boolean,
) {
  const [inputValue, setInputValue] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Partial<Game>[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [bulkQueue, setBulkQueue] = useState<string[]>([]);
  const [totalBulk, setTotalBulk] = useState(0);

  const dbCacheRef = useRef<Map<string, Partial<Game>>>(new Map());

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
      const cached = dbCacheRef.current.get(next.toLowerCase().trim());

      if (cached) {
        setSearchResults([
          { ...cached, tier: Tier.Unassigned, order_in_tier: null },
        ]);
        setSelectedIndex(0);
        return;
      }

      // Fall back to RAWG API.
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

  const handleStart = async () => {
    const titles = inputValue
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);

    if (!titles.length) return;

    if (isAuthenticated) {
      // Find matches in DB to avoid unnecessary RAWG calls.
      const dbGames = await findGamesByTitlesInDb(titles);
      const cache = new Map<string, Partial<Game>>();

      for (const g of dbGames) {
        cache.set(g.title.toLowerCase().trim(), g);
      }

      dbCacheRef.current = cache;
    } else {
      dbCacheRef.current = new Map();
    }

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
