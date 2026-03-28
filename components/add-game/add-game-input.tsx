"use client";

import { Button } from "../ui/button";

interface Props {
  inputValue: string;
  setInputValue: (v: string) => void;
  handleStart: () => void;
}

export function AddGameInput({
  inputValue,
  setInputValue,
  handleStart,
}: Props) {
  const count = inputValue.split("\n").filter(Boolean).length;

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Game title or multiple (one per line)"
        className="w-100 border rounded px-2 py-2 text-secondary"
      />

      <div className="flex justify-center w-full">
        <Button onClick={handleStart} disabled={!inputValue.trim()}>
          {count > 1 ? `Search ${count} games` : "Search"}
        </Button>
      </div>
    </div>
  );
}
