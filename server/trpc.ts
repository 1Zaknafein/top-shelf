import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { db } from "./db";

/**
 * Creates the context for tRPC procedures, including the database client and user session.
 * @returns Database client and user session, used as context for tRPC procedures.
 */
export const createTRPCContext = async () => {
  const session = await getServerSession(authOptions);
  return { db, session };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.session.user.id,
    },
  });
});
