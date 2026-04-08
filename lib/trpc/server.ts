import { appRouter } from "@/server/routers/_app";
import { createCallerFactory, createTRPCContext } from "@/server/trpc";

const createCaller = createCallerFactory(appRouter);

/** Used to call tRPC procedures directly on the server pages */
export async function trpcServer() {
  const ctx = await createTRPCContext();
  return createCaller(ctx);
}
