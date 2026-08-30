export type RulesetId = "2020" | "2025";
export type GameMode = "11s" | "7s";

export type RulesetConfig = {
  minPlayers: number;
  maxPlayers: number;
  allowNegativeTreasury: boolean;
  maxNonLinemanPlayers?: number;
  apothecaryCost: number;
  rerollCost: number;
};

export const BASE_RULESETS: Record<RulesetId, Omit<RulesetConfig, "apothecaryCost" | "rerollCost" | "maxNonLinemanPlayers">> = {
  "2020": { minPlayers: 11, maxPlayers: 16, allowNegativeTreasury: false },
  "2025": { minPlayers: 11, maxPlayers: 16, allowNegativeTreasury: true }
};

export function getRulesetConfig(ruleset: RulesetId, mode: GameMode = "11s"): RulesetConfig {
  const base = BASE_RULESETS[ruleset];

  if (ruleset === "2025" && mode === "7s") {
    return {
      ...base,
      minPlayers: 7,
      maxPlayers: 11,
      maxNonLinemanPlayers: 4,
      apothecaryCost: 80000,
      rerollCost: 100000
    };
  }

  return {
    ...base,
    apothecaryCost: 50000,
    rerollCost: 0
  };
}

export function getDefaultStartingTreasury(ruleset: RulesetId, mode: GameMode = "11s"): number {
  return ruleset === "2025" && mode === "7s" ? 600000 : 1000000;
}

export const RULESETS = {
  "2020": getRulesetConfig("2020"),
  "2025": getRulesetConfig("2025")
} satisfies Record<RulesetId, RulesetConfig>;
