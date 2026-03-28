"use client";

import "@/app/add-button.css";
import { Game } from "@/types/types";
import Image from "next/image";
import { Button } from "../ui/button";

interface Props {
  searchResult: Partial<Game>;
  handleAdd: () => void;
  handleSkip: () => void;
}

export function AddGameResult({ searchResult, handleAdd, handleSkip }: Props) {
  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <span className="text-lg font-semibold text-secondary">
        {searchResult.title}
      </span>

      <div className="w-32 h-20 relative rounded overflow-hidden">
        <Image
          src={searchResult.image ?? "/placeholder.webp"}
          alt={searchResult.title ?? ""}
          fill
          sizes="128px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-2 w-full items-center">
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
