import { Button } from "@base-ui/react";
import { SearchIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { useSearch } from "./use-search";

export function SearchBar() {
  const { setSearchQuery } = useSearch();
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSubmit = () => {
    setSearchQuery(inputValue);
  };

  const handleClose = () => {
    setShowInput(false);
    setInputValue("");
    setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") handleClose();
  };

  if (!showInput) {
    return (
      <Button
        className="glass-bg rounded-full p-2 h-auto w-auto"
        onClick={handleOpen}
      >
        <SearchIcon style={{ width: "30px", height: "30px" }} />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search games..."
        className="glass-bg rounded-full px-4 py-2 text-sm outline-none w-48"
      />
      <Button
        className="glass-bg rounded-full p-2 h-auto w-auto"
        onClick={handleSubmit}
      >
        <SearchIcon style={{ width: "30px", height: "30px" }} />
      </Button>
      <Button
        className="glass-bg rounded-full p-2 h-auto w-auto"
        onClick={handleClose}
      >
        <X style={{ width: "30px", height: "30px" }} />
      </Button>
    </div>
  );
}
