import teams2020Data from "../../../../scraper/teams_2020.json";
import teams2025Data from "../../../../scraper/teams_2025.json";
import { adaptScrapedTeams } from "./scraped";
import type { Ruleset, TeamMap } from "./types";

const teamsByRuleset: Record<Ruleset, TeamMap> = {
  "2020": adaptScrapedTeams(teams2020Data),
  "2025": adaptScrapedTeams(teams2025Data)
};

export function getTeams(ruleset: Ruleset): TeamMap {
  const teams = teamsByRuleset[ruleset];

  return Object.fromEntries(
    Object.entries(teams).map(([id, team]) => [
      id,
      { ...team, roster: team.players }
    ])
  );
}

export * from "./types";
