"use client";

import { useDroppable } from "@dnd-kit/react";
import { ReactNode } from "react";

interface TierRowProps {
  id: string;
  children: ReactNode;
}

export function TierRow({ children, id }: TierRowProps) {
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
