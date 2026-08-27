import type { Team, TeamMap, PlayerType } from "./types";

type ScrapedPlayer = {
  max_quantity: number;
  position: string;
  tags?: string[];
  MA: string;
  ST: string;
  AG: string;
  PA?: string;
  AV: string;
  skills?: string[];
  primary?: string[];
  secondary?: string[];
  cost: number;
};

type ScrapedTeam = {
  name: string;
  league?: string | null;
  special_rules?: string[];
  players?: ScrapedPlayer[];
  staff?: Record<string, number | undefined>;
  star_players?: Array<{ name: string; cost: number }>;
  inducements?: Array<{ name: string; cost: number }>;
};

type ScrapedData = { teams: ScrapedTeam[] };

function slug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function statValue(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base || "item";
  let suffix = 2;
  while (used.has(id)) id = `${base}-${suffix++}`;
  used.add(id);
  return id;
}

function staffValues(staff: Record<string, number | undefined> | undefined): Record<string, number> {
  return Object.fromEntries(
    Object.entries(staff ?? {}).filter((entry): entry is [string, number] => entry[1] !== undefined)
  );
}

function adaptPlayer(player: ScrapedPlayer, usedIds: Set<string>): PlayerType {
  const id = uniqueId(slug(player.position), usedIds);
  return {
    id,
    name: player.position,
    ma: statValue(player.MA) ?? 0,
    st: statValue(player.ST) ?? 0,
    ag: statValue(player.AG) ?? 0,
    pa: statValue(player.PA),
    av: statValue(player.AV) ?? 0,
    cost: player.cost,
    max: player.max_quantity,
    skills: player.skills ?? [],
    tags: player.tags ?? [],
    primary: player.primary ?? [],
    secondary: player.secondary ?? [],
    displayStats: {
      ma: player.MA,
      st: player.ST,
      ag: player.AG,
      pa: player.PA,
      av: player.AV
    }
  };
}

export function adaptScrapedTeams(data: ScrapedData): TeamMap {
  const teams: TeamMap = {};

  for (const scraped of data.teams) {
    if (!scraped.name || !scraped.players?.length) continue;

    const id = slug(scraped.name);
    if (!id || teams[id]) continue;
    const playerIds = new Set<string>();
    const team: Team = {
      id,
      name: scraped.name,
      tier: undefined,
      rerollCost: 60000,
      apothecary: true,
      players: scraped.players.map((player) => adaptPlayer(player, playerIds)),
      league: scraped.league ?? undefined,
      specialRules: scraped.special_rules ?? [],
      staff: staffValues(scraped.staff),
      starPlayers: scraped.star_players ?? [],
      inducements: scraped.inducements ?? []
    };

    teams[id] = team;
  }

  return teams;
}
