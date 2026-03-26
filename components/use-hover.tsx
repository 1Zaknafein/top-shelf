"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { Game } from "../types/types";

interface HoverContextType {
  hover: { game: Game; rect: DOMRect } | null;
  setHover: (hover: { game: Game; rect: DOMRect } | null) => void;
}

const HoverContext = createContext<HoverContextType | undefined>(undefined);

export function HoverProvider({ children }: { children: ReactNode }) {
  const [hover, setHover] = useState<{ game: Game; rect: DOMRect } | null>(
    null,
  );
  return (
    <HoverContext.Provider value={{ hover, setHover }}>
      {children}
    </HoverContext.Provider>
  );
}

export function useHover() {
  const context = useContext(HoverContext);
  if (!context) throw new Error("useHover must be used within HoverProvider");
  return context;
}
