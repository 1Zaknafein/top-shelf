"use client";

import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Slider } from "./ui/slider";

interface SettingsMenuProps {
  onClose: () => void;
  rowMinHeight: number;
  setRowMinHeight: (height: number) => void;
}

export function SettingsMenu({
  onClose,
  rowMinHeight,
  setRowMinHeight,
}: SettingsMenuProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent className="bg-tier-card text-foreground">
        Card size: {rowMinHeight}px
        <Slider
          defaultValue={rowMinHeight}
          max={100}
          min={60}
          step={1}
          className="bg-tier-card  w-full max-w-xs"
          onChange={(value) => setRowMinHeight(value.target.valueAsNumber)}
        />
      </DialogContent>
    </Dialog>
  );
}
