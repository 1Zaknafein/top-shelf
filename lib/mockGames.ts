import { Game, Tier } from "../types/types";

// Set how many games you want per tier/undefined
const S_COUNT = 3;
const A_COUNT = 5;
const B_COUNT = 4;
const C_COUNT = 2;
const UNDEFINED_COUNT = 20;

const baseGames: Omit<Game, "id">[] = [
  {
    name: "Title",
    image:
      "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
    tier: Tier.Unassigned,
  },
];

function generateGames(count: number, tier: Tier, startId = 1): Game[] {
  return Array.from({ length: count }).map((_, i) => {
    const base =
      baseGames[(i + (tier ? tier.charCodeAt(0) : 0)) % baseGames.length];
    return {
      ...base,
      id: startId + i,
      tier: tier ?? Tier.Unassigned,
    };
  });
}

let currentId = 1;
const sGames = generateGames(S_COUNT, Tier.S, currentId);
currentId += S_COUNT;
const aGames = generateGames(A_COUNT, Tier.A, currentId);
currentId += A_COUNT;
const bGames = generateGames(B_COUNT, Tier.B, currentId);
currentId += B_COUNT;
const cGames = generateGames(C_COUNT, Tier.C, currentId);
currentId += C_COUNT;
const undefinedGames = generateGames(
  UNDEFINED_COUNT,
  Tier.Unassigned,
  currentId,
);

export const mockGameData: Game[] = [
  ...sGames,
  ...aGames,
  ...bGames,
  ...cGames,
  ...undefinedGames,
];
