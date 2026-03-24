import { Game } from "../types/types";

const baseGames: Game[] = [
  {
    id: 1,
    name: "The Legend of Zelda: Breath of the Wild",
    image:
      "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
    tier: "A",
  },
  {
    id: 2,
    name: "Hollow Knight",
    image:
      "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
    tier: "S",
  },
  {
    id: 3,
    name: "Among Us",
    image:
      "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
  },
  {
    id: 4,
    name: "Title",
    image:
      "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
    tier: "C",
  },
];

export const mockGameData: Game[] = Array.from({ length: 18 }).map((_, i) => {
  const base = baseGames[i % baseGames.length];
  return {
    ...base,
    id: i + 1,
  } as Game;
});
