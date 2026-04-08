import { type Game, Tier } from "@/types/types";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

function mapGame(g: {
  id: string;
  title: string;
  image: string;
  description: string;
  tier: string;
  orderInTier: number | null;
  userId: string;
}): Game {
  return {
    id: g.id,
    title: g.title,
    image: g.image,
    description: g.description,
    tier: g.tier as Tier,
    order_in_tier: g.orderInTier,
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
    const games = await ctx.db.game.findMany({
      where: { userId: ctx.userId },
      orderBy: [{ tier: "asc" }, { orderInTier: "asc" }],
    });

    return games.map(mapGame);
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
      try {
        const game = await ctx.db.game.create({
          data: {
            title: input.title,
            image: input.image,
            description: input.description,
            tier: Tier.Unassigned,
            userId: ctx.userId,
          },
        });
        return mapGame(game);
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
        const game = await ctx.db.game.update({
          where: { id: input.id, userId: ctx.userId },
          data: {
            tier: input.tier,
            orderInTier: input.order_in_tier ?? null,
            ...(input.description !== undefined && {
              description: input.description,
            }),
          },
        });
        return mapGame(game);
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
        await ctx.db.game.delete({
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
