"use client";

import "@/app/add-button.css";
import { Game } from "@/types/types";
import Image from "next/image";
import { Button } from "../ui/button";

interface Props {
  searchResults: Partial<Game>[];
  selectedIndex: number;
  handleSelect: (idx: number) => void;
  handleAdd: () => void;
  handleSkip: () => void;
}

export function AddGameResult({
  searchResults,
  selectedIndex,
  handleSelect,
  handleAdd,
  handleSkip,
}: Props) {
  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="flex flex-col w-80 gap-4">
        {searchResults.map((result, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-4 p-3 rounded cursor-pointer border transition-all ${selectedIndex === idx ? "border-lime-500 bg-lime-100/20" : "border-transparent hover:bg-muted/40"}`}
            onClick={() => handleSelect(idx)}
            style={{ minHeight: 80 }}
          >
            <div className="w-20 h-12 relative rounded overflow-hidden shrink-0">
              <Image
                src={result.image ?? "/placeholder.webp"}
                alt={result.title ?? ""}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <span className="text-base font-semibold text-secondary">
              {result.title}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 w-full items-center mt-4">
        <button
          type="button"
          onClick={handleAdd}
          className="fancy-add-btn mb-2 w-30"
        >
          <span className="shadow"></span>
          <span className="edge"></span>
          <span className="front">Add</span>
        </button>
        <Button onClick={handleSkip}>Skip</Button>
      </div>
    </div>
  );
}
