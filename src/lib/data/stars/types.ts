import type { DisplayStats } from "$lib/data/teams/types";

export interface StarPlayerProfile {
  name: string;
  ma: number;
  st: number;
  ag: number;
  pa?: number;
  av: number;
  skills: string[];
  displayStats: DisplayStats;
}

export interface StarPlayer {
  id: string;
  name: string;
  cost: number;
  profiles: StarPlayerProfile[];
  sourceUrl?: string;
}

export type StarPlayerCatalog = Record<string, StarPlayer>;
