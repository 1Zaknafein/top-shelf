import { router } from "../trpc";
import { gamesRouter } from "./games";

export const appRouter = router({
  games: gamesRouter,
});

export type AppRouter = typeof appRouter;
