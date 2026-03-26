import { Game } from "@/types/types";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";

type Data = {
  games: Game[];
};

const filePath = path.join(process.cwd(), "data", "db.json");
const adapter = new JSONFile<Data>(filePath);

export const db = new Low<Data>(adapter, { games: [] });

export async function initDB() {
  await db.read();

  db.data ||= {
    games: [],
  };

  await db.write();
}
