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

export function AddGameButton({ onAddGame }: AddGameButtonProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className={`flex items-center justify-center text-3xl font-bold w-75 h-25 bg-black hover:bg-gray-300 rounded-lg`}
        >
          ADD
        </Button>
      </DrawerTrigger>

      <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh] bg-background">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <div className="flex items-center justify-center space-x-2">
              <DrawerTitle>Add a new game</DrawerTitle>
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
              className="w-full border rounded px-2 py-2"
            />
            <DrawerFooter className="flex justify-end gap-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button type="submit">Add</Button>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
