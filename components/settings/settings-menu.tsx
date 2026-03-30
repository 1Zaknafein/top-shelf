"use client";

import { Game, Tier } from "@/types/types";
import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { MoveGamesToUnassignedButton } from "./move-games-to-unassigned-button";

interface SettingsMenuProps {
  onClose: () => void;
  tierRowData: Record<Tier, Game[]>;
  setTierRowData: Dispatch<SetStateAction<Record<Tier, Game[]>>>;
}

export function SettingsMenu({
  onClose,
  tierRowData,
  setTierRowData,
}: SettingsMenuProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogTrigger>Open</DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="bg-tier-card text-foreground"
      >
        {/* Move all items to unassigned row */}
        <MoveGamesToUnassignedButton
          tierRowData={tierRowData}
          setTierRowData={setTierRowData}
        />
      </DialogContent>
    </Dialog>
  );
}
