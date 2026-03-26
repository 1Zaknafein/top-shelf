import { db, initDB } from "@/server/db";
import { Game } from "@/types/types";
import { NextResponse } from "next/server";

export async function GET() {
  await initDB();

  return NextResponse.json(db.data?.games ?? []);
}

// Adding new game
export async function POST(req: Request) {
  await initDB();

  const body = await req.json();

  const newGame: Game = {
    id: crypto.randomUUID(),
    title: body.title,
    image: body.image ?? "/placeholder.webp",
    description: body.description ?? "",
    tier: body.tier ?? "unassigned",
    order_in_tier: null,
  };

  db.data!.games.push(newGame);
  await db.write();

  return NextResponse.json(newGame, { status: 201 });
}

// Updating existing game
export async function PUT(req: Request) {
  await initDB();

  const body = await req.json();

  const { id, tier, order_in_tier } = body;

  const game = db.data!.games.find((g) => g.id === id);

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  game.tier = tier;
  game.order_in_tier = order_in_tier ?? null;

  await db.write();

  return NextResponse.json(game);
}
