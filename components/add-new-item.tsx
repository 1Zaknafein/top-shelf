"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface AddGameButtonProps {
  onAddGame: (name: string) => void;
}

export function AddNewItem({ onAddGame }: AddGameButtonProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className={`bg-tier-card rounded-lg w-20 justify-center text-5xl h-20 transition-transform hover:scale-105 active:scale-95 hover:bg-teal-900`}
        >
          +
        </Button>
      </DrawerTrigger>

      <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh] bg-background">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <div className="flex flex-col items-center justify-center space-x-2">
              <DrawerTitle>Add a new item</DrawerTitle>
              <DrawerDescription>
                Enter the title you want to add.
              </DrawerDescription>
            </div>
          </DrawerHeader>

          <form
            className="space-y-4 p-2"
            onSubmit={(e) => {
              e.preventDefault();

              const input = (e.target as HTMLFormElement).elements.namedItem(
                "gameName",
              ) as HTMLInputElement;

              if (input.value.trim()) {
                onAddGame(input.value.trim());
                input.value = "";
              }
            }}
          >
            <input
              type="text"
              name="gameName"
              placeholder="Game name..."
              className="w-full border rounded px-2 py-2 text-secondary"
            />
            <DrawerFooter className="flex justify-end gap-2">
              <DrawerClose asChild>
                <Button variant="outline" className="text-secondary">
                  Cancel
                </Button>
              </DrawerClose>
              <Button type="submit">Add</Button>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
