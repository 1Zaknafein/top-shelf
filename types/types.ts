export interface Game {
  id: number;
  name: string;
  image: string;
  tier?: string;
  description?: string;
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
