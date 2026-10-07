import { writable } from "svelte/store";
import { browser } from "$app/environment";
import type { GameMode, RulesetId } from "$lib/domain/rulesets";
import type { SharedTeamPayload } from "$lib/tools/teamSharing";
import type { IndividualPlayers } from "$lib/domain/rosterPlayers";
import type { TeamTier } from "$lib/domain/matchedPlay";

export type SavedTeamRoster = {
  players: Record<string, number>;
  stars?: Record<string, number>;
  reRolls: number;
  apothecary: number;
  individualPlayers?: IndividualPlayers;
  tiersByMode?: Partial<Record<GameMode, TeamTier>>;
};

export type SavedTeam = {
  id: string;
  shareId?: string;
  name?: string;
  selectedTeamId: string;
  roster: SavedTeamRoster;
  startingTreasury?: number;
  ruleset?: RulesetId;
  mode?: GameMode;
};

export type SaveTeamPayload = Omit<SavedTeam, "id" | "shareId"> & { shareId?: string };

const STORAGE_KEY = "bb-companion:saved-teams";
const STORAGE_VERSION_KEY = "bb-companion:saved-teams-version";
const STORAGE_VERSION = 3;

function isSavedTeamRoster(v: unknown): v is SavedTeamRoster {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  if (typeof o.reRolls !== "number" || typeof o.apothecary !== "number") return false;
  if (!o.players || typeof o.players !== "object" || Array.isArray(o.players)) return false;
  for (const val of Object.values(o.players as Record<string, unknown>)) {
    if (typeof val !== "number") return false;
  }
  if (o.stars !== undefined) {
    if (!o.stars || typeof o.stars !== "object" || Array.isArray(o.stars)) return false;
    for (const val of Object.values(o.stars as Record<string, unknown>)) {
      if (typeof val !== "number") return false;
    }
  }
  if (o.individualPlayers !== undefined) {
    if (!o.individualPlayers || typeof o.individualPlayers !== "object" || Array.isArray(o.individualPlayers)) return false;
    const seenIds = new Set<string>();
    const seenNumbers = new Set<number>();
    for (const value of Object.values(o.individualPlayers as Record<string, unknown>)) {
      if (!Array.isArray(value)) return false;
      for (const player of value) {
        if (!player || typeof player !== "object" || Array.isArray(player)) return false;
        const details = player as Record<string, unknown>;
        if (
          typeof details.id !== "string" ||
          !Number.isInteger(details.number) ||
          (details.number as number) < 0 ||
          (details.number as number) > 99 ||
          (details.name !== undefined && typeof details.name !== "string") ||
          (details.numberCustomized !== undefined && typeof details.numberCustomized !== "boolean") ||
          (details.veteran !== undefined && typeof details.veteran !== "boolean") ||
          !Array.isArray(details.skills) ||
          !details.skills.every((skill) => typeof skill === "string") ||
          new Set(details.skills).size !== details.skills.length
        ) return false;
        if (seenIds.has(details.id) || seenNumbers.has(details.number as number)) return false;
        seenIds.add(details.id);
        seenNumbers.add(details.number as number);
      }
    }
  }
  if (o.tiersByMode !== undefined) {
    if (!o.tiersByMode || typeof o.tiersByMode !== "object" || Array.isArray(o.tiersByMode)) return false;
    const tiers = o.tiersByMode as Record<string, unknown>;
    if (Object.keys(tiers).some((mode) => mode !== "11s" && mode !== "7s")) return false;
    if (Object.values(tiers).some((tier) => !Number.isInteger(tier) || (tier as number) < 1 || (tier as number) > 4)) return false;
  }
  return true;
}

function isSavedTeam(v: unknown): v is SavedTeam {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.selectedTeamId === "string" &&
    isSavedTeamRoster(o.roster) &&
    (o.shareId === undefined || typeof o.shareId === "string") &&
    (o.name === undefined || typeof o.name === "string") &&
    (o.startingTreasury === undefined || typeof o.startingTreasury === "number") &&
    (o.ruleset === undefined || o.ruleset === "2020" || o.ruleset === "2025") &&
    (o.mode === undefined || o.mode === "11s" || o.mode === "7s")
  );
}

function loadFromStorage(): SavedTeam[] {
  if (!browser) return [];
  try {
    const version = Number(localStorage.getItem(STORAGE_VERSION_KEY));
    if (version !== STORAGE_VERSION && version !== 2) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_VERSION_KEY, String(STORAGE_VERSION));
      return [];
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const loaded = parsed.filter(isSavedTeam);
    if (version !== STORAGE_VERSION) persist(loaded);
    return loaded;
  } catch {
    return [];
  }
}

function persist(teams: SavedTeam[]) {
  if (!browser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
    localStorage.setItem(STORAGE_VERSION_KEY, String(STORAGE_VERSION));
  } catch {
    // Ignore write errors
  }
}

const initial = loadFromStorage();
export const savedTeams = writable<SavedTeam[]>(initial);

export function getSavedTeams(): SavedTeam[] {
  if (browser) {
    const loaded = loadFromStorage();
    savedTeams.set(loaded);
    return loaded;
  }
  return [];
}

export function getSavedTeam(id: string): SavedTeam | undefined {
  const teams = browser ? loadFromStorage() : [];
  return teams.find((t) => t.id === id);
}

export function saveTeam(payload: SaveTeamPayload): string {
  const id = createId();
  const team: SavedTeam = {
    shareId: payload.shareId,
    id,
    name: payload.name,
    selectedTeamId: payload.selectedTeamId,
    roster: cloneRoster(payload.roster),
    startingTreasury: payload.startingTreasury,
    ruleset: payload.ruleset,
    mode: payload.mode
  };
  savedTeams.update((list) => {
    const next = [...list, team];
    persist(next);
    return next;
  });
  return id;
}

export function updateTeam(
  id: string,
  payload: Partial<Omit<SavedTeam, "id" | "shareId">>
): void {
  savedTeams.update((list) => {
    const idx = list.findIndex((t) => t.id === id);
    if (idx < 0) return list;
    const next = [...list];
    const current = next[idx];
    const updated = { ...current, ...payload };
    if (hasShareDataChanged(current, updated)) {
      updated.shareId = undefined;
    }
    next[idx] = updated;
    persist(next);
    return next;
  });
}

export function ensureTeamShare(teamId: string, ruleset: RulesetId, mode: GameMode): SavedTeam | undefined {
  let sharedTeam: SavedTeam | undefined;
  savedTeams.update((list) => {
    const idx = list.findIndex((team) => team.id === teamId);
    if (idx < 0) return list;

    const current = list[idx];
    sharedTeam = {
      ...current,
      shareId: current.shareId ?? createId(),
      ruleset: current.ruleset ?? ruleset,
      mode: current.mode ?? mode
    };
    const next = [...list];
    next[idx] = sharedTeam;
    persist(next);
    return next;
  });
  return sharedTeam;
}

export function importSharedTeam(payload: SharedTeamPayload): "added" | "duplicate" {
  let result: "added" | "duplicate" = "added";
  savedTeams.update((list) => {
    if (list.some((team) => team.shareId === payload.shareId)) {
      result = "duplicate";
      return list;
    }

    const next = [
      ...list,
      {
        id: createId(),
        shareId: payload.shareId,
        name: payload.team.name,
        selectedTeamId: payload.team.selectedTeamId,
        roster: {
          ...cloneRoster(payload.team.roster)
        },
        startingTreasury: payload.team.startingTreasury,
        ruleset: payload.ruleset,
        mode: payload.mode
      }
    ];
    persist(next);
    return next;
  });
  return result;
}

export function deleteTeam(id: string): void {
  savedTeams.update((list) => {
    const next = list.filter((t) => t.id !== id);
    persist(next);
    return next;
  });
}

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function hasShareDataChanged(current: SavedTeam, updated: SavedTeam): boolean {
  return (
    current.name !== updated.name ||
    current.selectedTeamId !== updated.selectedTeamId ||
    current.startingTreasury !== updated.startingTreasury ||
    current.ruleset !== updated.ruleset ||
    current.mode !== updated.mode ||
    rosterFingerprint(current.roster) !== rosterFingerprint(updated.roster)
  );
}

function rosterFingerprint(roster: SavedTeamRoster): string {
  const sortCounts = (counts: Record<string, number> | undefined) =>
    Object.fromEntries(Object.entries(counts ?? {}).sort(([left], [right]) => left.localeCompare(right)));

  return JSON.stringify({
    players: sortCounts(roster.players),
    stars: sortCounts(roster.stars),
    reRolls: roster.reRolls,
    apothecary: roster.apothecary,
    individualPlayers: Object.fromEntries(
      Object.entries(roster.individualPlayers ?? {}).sort(([left], [right]) => left.localeCompare(right))
    ),
    tiersByMode: roster.tiersByMode
  });
}

function cloneRoster(roster: SavedTeamRoster): SavedTeamRoster {
  return {
    ...roster,
    players: { ...roster.players },
    stars: { ...(roster.stars ?? {}) },
    individualPlayers: roster.individualPlayers
      ? Object.fromEntries(Object.entries(roster.individualPlayers).map(([id, players]) => [id, players.map((player) => ({ ...player, skills: [...player.skills] }))]))
      : undefined,
    tiersByMode: roster.tiersByMode ? { ...roster.tiersByMode } : undefined
  };
}
