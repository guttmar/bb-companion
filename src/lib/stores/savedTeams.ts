import { writable } from "svelte/store";
import { browser } from "$app/environment";

export type SavedTeamRoster = {
  players: Record<string, number>;
  reRolls: number;
  apothecary: number;
};

export type SavedTeam = {
  id: string;
  name?: string;
  selectedTeamId: string;
  roster: SavedTeamRoster;
  startingTreasury?: number;
};

export type SaveTeamPayload = Omit<SavedTeam, "id"> & { name?: string };

const STORAGE_KEY = "bb-companion:saved-teams";
const STORAGE_VERSION_KEY = "bb-companion:saved-teams-version";
const STORAGE_VERSION = 2;

function isSavedTeamRoster(v: unknown): v is SavedTeamRoster {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  if (typeof o.reRolls !== "number" || typeof o.apothecary !== "number") return false;
  if (!o.players || typeof o.players !== "object" || Array.isArray(o.players)) return false;
  for (const val of Object.values(o.players as Record<string, unknown>)) {
    if (typeof val !== "number") return false;
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
    (o.name === undefined || typeof o.name === "string") &&
    (o.startingTreasury === undefined || typeof o.startingTreasury === "number")
  );
}

function loadFromStorage(): SavedTeam[] {
  if (!browser) return [];
  try {
    const version = Number(localStorage.getItem(STORAGE_VERSION_KEY));
    if (version !== STORAGE_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_VERSION_KEY, String(STORAGE_VERSION));
      return [];
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedTeam);
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
  const id = crypto.randomUUID?.() ?? Date.now().toString();
  const team: SavedTeam = {
    id,
    name: payload.name,
    selectedTeamId: payload.selectedTeamId,
    roster: { ...payload.roster },
    startingTreasury: payload.startingTreasury
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
  payload: Partial<Omit<SavedTeam, "id">>
): void {
  savedTeams.update((list) => {
    const idx = list.findIndex((t) => t.id === id);
    if (idx < 0) return list;
    const next = [...list];
    next[idx] = { ...next[idx], ...payload };
    persist(next);
    return next;
  });
}

export function deleteTeam(id: string): void {
  savedTeams.update((list) => {
    const next = list.filter((t) => t.id !== id);
    persist(next);
    return next;
  });
}
