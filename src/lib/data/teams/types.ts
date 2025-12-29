export type Ruleset = "2016" | "2020" | "2025";

export interface PlayerType {
  id: string;
  name: string;

  ma: number;
  st: number;
  ag: number;
  pa?: number;
  av: number;

  cost: number;
  max: number;
}

export interface Team {
  id: string;
  name: string;
  tier?: 1 | 2 | 3;

  rerollCost: number;
  apothecary: boolean;

  players: PlayerType[];
}

export type TeamMap = Record<string, Team>;
