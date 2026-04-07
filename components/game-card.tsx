import { Game, Tier } from "@/types/types";
import { useSortable } from "@dnd-kit/react/sortable";
import Image from "next/image";
import { useRef } from "react";
import { useHover } from "./use-hover";
import { useSearch } from "./use-search";

import { pointerIntersection } from "@dnd-kit/collision";

interface GameCardProps {
  game: Game;
  index: number;
  row: Tier;
}

export function GameCard({ game, index }: GameCardProps) {
  const { setHover } = useHover();
  const { searchQuery } = useSearch();
  const cardRef = useRef<HTMLDivElement>(null);

  const { ref, isDragging } = useSortable({
    id: game.id,
    index,
    type: "item",
    accept: ["row", "item"],
    group: "row",
    data: { tier: game.tier },
    collisionDetector: pointerIntersection,
  });

  const isHighlighted =
    searchQuery.length > 0 &&
    game.title.toLowerCase().includes(searchQuery.toLowerCase());

  const glowStyle = game.tier
    ? {
        boxShadow:
          "0 0 6px var(--tier-color-glow), 0 2px 18px var(--tier-color-glow)",
      }
    : undefined;

  const highlightStyle = isHighlighted
    ? { outline: "2px solid white", outlineOffset: "2px" }
    : undefined;

  const handleMouseEnter = () => {
    if (!isDragging && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setHover({ game, rect });
    }
  };
  const handleMouseLeave = () => {
    setHover(null);
  };

  return (
    <div ref={ref} data-dragging={isDragging}>
      <div
        ref={(node) => {
          cardRef.current = node;
        }}
        style={{ ...glowStyle, ...highlightStyle }}
        role="button"
        tabIndex={0}
        className="game-card rounded-md overflow-hidden cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center justify-center w-30 aspect-video overflow-hidden">
          <Image
            src={game.image}
            alt={game.title}
            width={300}
            height={300}
            loading="eager"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
