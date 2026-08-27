export type Ruleset = "2020" | "2025";

export type DisplayStats = {
  ma: string;
  st: string;
  ag: string;
  pa?: string;
  av: string;
};

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

  skills?: string[];
  tags?: string[];
  primary?: string[];
  secondary?: string[];
  displayStats?: DisplayStats;
}

export interface Team {
  id: string;
  name: string;
  tier?: 1 | 2 | 3 | 4;

  rerollCost: number;
  apothecary: boolean;

  players: PlayerType[];
  league?: string;
  specialRules?: string[];
  staff?: Record<string, number>;
  starPlayers?: Array<{ name: string; cost: number }>;
  inducements?: Array<{ name: string; cost: number }>;
}

export type TeamMap = Record<string, Team>;
