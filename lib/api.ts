import { type AppRouter } from "@/server/routers/_app";
import { type Game } from "@/types/types";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});

export async function gameApiRequest(
  method: "POST" | "PUT" | "DELETE",
  body: Partial<Game>,
): Promise<Game> {
  if (method === "POST") {
    return trpcClient.games.create.mutate({
      title: body.title!,
      image: body.image,
      description: body.description,
    });
  }

  if (method === "PUT") {
    return trpcClient.games.update.mutate({
      id: body.id!,
      tier: body.tier!,
      order_in_tier: body.order_in_tier,
      description: body.description,
    });
  }

  await trpcClient.games.delete.mutate({ id: body.id! });

  return body as Game;
}
