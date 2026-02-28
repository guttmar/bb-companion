import type { Ruleset, TeamMap } from "./types";
import { bb2020Teams } from "./bb2020";
import { bb2025Teams } from "./bb2025";

const teamsByRuleset: Record<Ruleset, TeamMap> = {
  "2016": bb2020Teams,
  "2020": bb2020Teams,
  "2025": bb2025Teams
};

export function getTeams(ruleset: Ruleset): TeamMap {
  const teams = teamsByRuleset[ruleset];

  // Map `players` to `roster` for compatibility
  return Object.fromEntries(
    Object.entries(teams).map(([id, team]) => [
      id,
      { ...team, roster: team.players }
    ])
  );
}

export * from "./types";
