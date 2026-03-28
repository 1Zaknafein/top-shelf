import { Game } from "@/types/types";

type RawgGame = {
  name: string;
  background_image: string | null;
};

export async function searchGames(query: string) {
  const res = await fetch(`/api/rawg/search?q=${encodeURIComponent(query)}`);

  if (!res.ok) {
    throw new Error("Search failed");
  }

  return res.json();
}

export function mapRawgDataToGame(raw_data: RawgGame): Partial<Game> {
  return {
    title: raw_data.name,
    image: raw_data.background_image ?? "/placeholder.webp",
  };
}
