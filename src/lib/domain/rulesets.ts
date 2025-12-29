export type RulesetId = "2016" | "2020" | "2025";

export const RULESETS = {
  "2016": { minPlayers: 11, maxPlayers: 16, allowNegativeTreasury: false },
  "2020": { minPlayers: 11, maxPlayers: 16, allowNegativeTreasury: false },
  "2025": { minPlayers: 11, maxPlayers: 16, allowNegativeTreasury: true }
} satisfies Record<RulesetId, any>;
