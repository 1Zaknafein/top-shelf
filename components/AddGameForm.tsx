import type { SyntheticEvent } from "react";
import { useState } from "react";

interface AddGameFormProps {
  onAddGame: (name: string) => void;
}

export function AddGameForm({ onAddGame }: AddGameFormProps) {
  const [name, setName] = useState<string>("");

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    // TODO: Implement this    
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 my-4"
    >
      <input
        type="text"
        placeholder="Add a game..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded px-2 py-1 flex-1"
      />
      <button
        type="submit"
        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add
      </button>
    </form>
  );
}