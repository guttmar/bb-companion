import type { Ruleset, TeamMap } from "./types";
import { bb2020Teams } from "./bb2020";

export function getTeams(ruleset: Ruleset): TeamMap {
  const teams = ruleset === "2020" ? bb2020Teams : bb2020Teams; // Placeholder

  // Map `players` to `roster` for compatibility
  return Object.fromEntries(
    Object.entries(teams).map(([id, team]) => [
      id,
      { ...team, roster: team.players }
    ])
  );
}

export const TEAMS = getTeams("2020");

export * from "./types";
