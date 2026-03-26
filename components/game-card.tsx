import { Game } from "@/types/types";
import { useDraggable } from "@dnd-kit/core";
import Image from "next/image";
import { useRef } from "react";
import { useHover } from "./use-hover";

interface GameCardProps {
  game: Game;
  imgWidth: number;
  imgHeight: number;
}

export function GameCard({ game, imgWidth, imgHeight }: GameCardProps) {
  const { setHover } = useHover();
  const cardRef = useRef<HTMLDivElement>(null);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: game.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const glowStyle = game.tier
    ? {
        boxShadow:
          "0 0 6px var(--tier-color-glow), 0 2px 18px var(--tier-color-glow)",
      }
    : undefined;

  const handleMouseEnter = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setHover({ game, rect });
    }
  };
  const handleMouseLeave = () => {
    setHover(null);
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node); // drag&drop
        cardRef.current = node; // hover
      }}
      style={{ ...style, ...glowStyle }}
      {...listeners}
      role="button"
      tabIndex={0}
      className="game-card rounded-md overflow-hidden cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-center">
        <Image
          src={game.image}
          alt={game.name}
          width={imgWidth}
          height={imgHeight}
          loading="eager"
          className="object-cover"
        />
      </div>
    </div>
  );
}
