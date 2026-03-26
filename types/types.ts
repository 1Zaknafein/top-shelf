export interface Game {
  id: number;
  title: string;
  image: string;
  tier?: string;
  description?: string;
  order_in_tier?: number | null;
}

export enum Tier {
  S = "S",
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  Unassigned = "unassigned",
}
