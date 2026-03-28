"use client";

import { useDroppable } from "@dnd-kit/react";

interface TierRowProps {
  id: string;
  index: number;
  children: React.ReactNode;
}

export function TierRow({ children, id, index }: TierRowProps) {
  const { isDropTarget, ref } = useDroppable({
    id: id,
    type: "row",
    accept: "item",
    data: { tier: id },
  });

  const dropStyle = isDropTarget ? "drop-target" : undefined;

  return (
    <div
      className={`flex flex-wrap gap-2 glass-bg tier-row tier-${id} min-height ${dropStyle}`}
      ref={ref}
    >
      {children}
    </div>
  );
}
