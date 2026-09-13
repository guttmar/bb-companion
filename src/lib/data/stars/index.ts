import stars2020Data from "../../../../scraper/star_players_2020.json";
import stars2025Data from "../../../../scraper/star_players_2025.json";
import type { Ruleset } from "$lib/data/teams/types";
import type { StarPlayer, StarPlayerCatalog } from "./types";

function normalizeSpecialSkill(name: string, description: string) {
  if (description.trim()) {
    return { name, description };
  }

  const match = name.match(/^(.+?[.!?])\s+(.+)$/);
  if (!match) {
    return { name, description };
  }

  return { name: match[1], description: match[2] };
}

function normalizeStar(star: StarPlayer): StarPlayer {
  return {
    ...star,
    profiles: star.profiles.map((profile) => ({
      ...profile,
      specialSkills: profile.specialSkills.map((specialSkill) =>
        normalizeSpecialSkill(specialSkill.name, specialSkill.description)
      )
    }))
  };
}

function toCatalog(entries: StarPlayer[]): StarPlayerCatalog {
  return Object.fromEntries(entries.map((star) => [star.id, normalizeStar(star)]));
}

const catalogsByRuleset: Record<Ruleset, StarPlayerCatalog> = {
  "2020": toCatalog(stars2020Data.star_players as StarPlayer[]),
  "2025": toCatalog(stars2025Data.star_players as StarPlayer[])
};

export function getStarPlayers(ruleset: Ruleset): StarPlayerCatalog {
  return catalogsByRuleset[ruleset];
}

export type { StarPlayer, StarPlayerCatalog, StarPlayerProfile } from "./types";
