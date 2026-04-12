import { type Game, Tier } from "@/types/types";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

function mapGame(ug: {
  id: string;
  tier: string;
  orderInTier: number | null;
  game: {
    title: string;
    image: string;
    description: string;
  };
}): Game {
  return {
    id: ug.id,
    title: ug.game.title,
    image: ug.game.image,
    description: ug.game.description,
    tier: ug.tier as Tier,
    order_in_tier: ug.orderInTier,
  };
}

function isPrismaError(e: unknown, code: string): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    (e as { code: string }).code === code
  );
}

export const gamesRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }): Promise<Game[]> => {
    const userGames = await ctx.db.userGame.findMany({
      where: { userId: ctx.userId },
      include: { game: true },
      orderBy: [{ tier: "asc" }, { orderInTier: "asc" }],
    });

    return userGames.map(mapGame);
  }),

  findByTitles: protectedProcedure
    .input(z.object({ titles: z.array(z.string().min(1)).min(1) }))
    .query(async ({ ctx, input }) => {
      const games = await ctx.db.game.findMany({
        where: {
          OR: input.titles.map((t) => ({
            title: { equals: t, mode: "insensitive" },
          })),
        },
      });
      return games.map((g) => ({
        title: g.title,
        image: g.image,
        description: g.description,
      }));
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        image: z.string().optional().default("/placeholder.webp"),
        description: z.string().optional().default(""),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<Game> => {
      const game = await ctx.db.game.upsert({
        where: { title: input.title },
        update: {},
        create: {
          title: input.title,
          image: input.image,
          description: input.description,
        },
      });

      try {
        const userGame = await ctx.db.userGame.create({
          data: {
            userId: ctx.userId,
            gameId: game.id,
            tier: Tier.Unassigned,
          },
          include: { game: true },
        });
        return mapGame(userGame);
      } catch (e) {
        if (isPrismaError(e, "P2002")) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You already have a game with this title.",
          });
        }
        throw e;
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        tier: z.nativeEnum(Tier),
        order_in_tier: z.number().nullable().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<Game> => {
      try {
        const userGame = await ctx.db.userGame.update({
          where: { id: input.id, userId: ctx.userId },
          data: {
            tier: input.tier,
            orderInTier: input.order_in_tier ?? null,
            ...(input.description !== undefined && {
              game: { update: { description: input.description } },
            }),
          },
          include: { game: true },
        });
        return mapGame(userGame);
      } catch (e) {
        if (isPrismaError(e, "P2025")) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        throw e;
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }): Promise<{ success: true }> => {
      try {
        await ctx.db.userGame.delete({
          where: { id: input.id, userId: ctx.userId },
        });
        return { success: true };
      } catch (e) {
        if (isPrismaError(e, "P2025")) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        throw e;
      }
    }),
});
