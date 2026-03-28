"use client";

import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface SettingsMenuProps {
  onClose: () => void;
}

export function SettingsMenu({ onClose }: SettingsMenuProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogTrigger>Open</DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="bg-tier-card text-foreground"
      >
        Settings will show here
      </DialogContent>
    </Dialog>
  );
}
