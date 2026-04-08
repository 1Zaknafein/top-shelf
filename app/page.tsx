import MainPage from "@/components/main-page";
import { trpcServer } from "@/lib/trpc/server";
import { authOptions } from "@/server/auth";
import { type Game } from "@/types/types";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);

  let games: Game[] = [];

  if (session?.user?.id) {
    const caller = await trpcServer();
    games = await caller.games.getAll();
  }

  return <MainPage initialGames={games} />;
}
