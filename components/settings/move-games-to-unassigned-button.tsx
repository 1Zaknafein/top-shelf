import { Game, Tier } from "@/types/types";
import { Dispatch, useState } from "react";
import { Button } from "../ui/button";

interface Type {
  tierRowData: Record<Tier, Game[]>;
  setTierRowData: Dispatch<React.SetStateAction<Record<Tier, Game[]>>>;
}

export function MoveGamesToUnassignedButton({
  tierRowData,
  setTierRowData,
}: Type) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!showConfirm) {
    return (
      <Button onClick={() => setShowConfirm(true)}>
        Move all games to unassigned row
      </Button>
    );
  }

  const moveGamesToUnassignedRow = () => {
    setShowConfirm(false);

    const allGames = Object.values(tierRowData).flat();

    setTierRowData(() => ({
      [Tier.Unassigned]: allGames,
      [Tier.S]: [],
      [Tier.A]: [],
      [Tier.B]: [],
      [Tier.C]: [],
      [Tier.D]: [],
      [Tier.E]: [],
      [Tier.F]: [],
    }));
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <span className="font-semibold text-center">
        Are you sure? This cannot be undone
      </span>
      <div className="flex gap-4">
        <Button variant={"destructive"} onClick={moveGamesToUnassignedRow}>
          Confirm
        </Button>
        <Button onClick={() => setShowConfirm(false)}>Cancel</Button>
      </div>
    </div>
  );
}
