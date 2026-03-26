import { Game } from "@/types/types";

export async function gameApiRequest(
  method: "POST" | "PUT",
  body: Partial<Game>,
): Promise<Game> {
  const res = await fetch("/api/games", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return res.json();
}
