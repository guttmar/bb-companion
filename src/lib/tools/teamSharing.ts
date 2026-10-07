import { getStarPlayers } from "$lib/data/stars";
import { getTeams } from "$lib/data/teams";
import type { GameMode, RulesetId } from "$lib/domain/rulesets";
import type { SavedTeam, SavedTeamRoster } from "$lib/stores/savedTeams";

const SHARE_VERSION = 2;
const MAX_ENCODED_LENGTH = 32_768;
const MAX_SHARE_ID_LENGTH = 128;

export type SharedTeamPayload = {
  version: 1 | typeof SHARE_VERSION;
  shareId: string;
  ruleset: RulesetId;
  mode: GameMode;
  team: {
    name?: string;
    selectedTeamId: string;
    roster: SavedTeamRoster;
    startingTreasury?: number;
  };
};

export type ShareDecodeResult =
  | { ok: true; payload: SharedTeamPayload }
  | { ok: false; error: string };

export function encodeTeamShare(team: SavedTeam): string {
  if (!team.shareId || !team.ruleset || !team.mode) {
    throw new Error("The team needs share metadata before it can be encoded.");
  }

  const payload: SharedTeamPayload = {
    version: SHARE_VERSION,
    shareId: team.shareId,
    ruleset: team.ruleset,
    mode: team.mode,
    team: {
      name: team.name,
      selectedTeamId: team.selectedTeamId,
      roster: team.roster,
      startingTreasury: team.startingTreasury
    }
  };
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeAndValidateTeamShare(encoded: string): ShareDecodeResult {
  if (!encoded || encoded.length > MAX_ENCODED_LENGTH || !/^[A-Za-z0-9_-]+$/.test(encoded)) {
    return { ok: false, error: "This team link is malformed." };
  }

  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const parsed: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    const payload = normalizePayload(parsed);
    if (!payload) return { ok: false, error: "This team link contains invalid team data." };

    const availableTeams = getTeams(payload.ruleset);
    const team = availableTeams[payload.team.selectedTeamId];
    if (!team) {
      return { ok: false, error: "This team template is not available for the linked ruleset." };
    }

    const playerIds = new Set(team.players.map((player) => player.id));
    if (Object.keys(payload.team.roster.players).some((playerId) => !playerIds.has(playerId))) {
      return { ok: false, error: "This team link includes players that are not in its team template." };
    }
    if (payload.team.roster.individualPlayers) {
      if (Object.keys(payload.team.roster.individualPlayers).some((playerId) => !playerIds.has(playerId))) {
        return { ok: false, error: "This team link includes individual players that are not in its team template." };
      }
      const individuals = Object.entries(payload.team.roster.individualPlayers).flatMap(([positionId, players]) => {
        return players.length === (payload.team.roster.players[positionId] ?? 0) ? players : [];
      });
      const declaredCount = Object.values(payload.team.roster.individualPlayers).reduce((sum, players) => sum + players.length, 0);
      const rosterCount = Object.values(payload.team.roster.players).reduce((sum, count) => sum + count, 0);
      if (individuals.length !== declaredCount || declaredCount !== rosterCount) {
        return { ok: false, error: "This team link contains inconsistent player details." };
      }
      const numbers = individuals.map((player) => player.number);
      const ids = individuals.map((player) => player.id);
      if (new Set(numbers).size !== numbers.length || new Set(ids).size !== ids.length) {
        return { ok: false, error: "This team link contains duplicate player numbers or identities." };
      }
    }

    const starCatalog = getStarPlayers(payload.ruleset);
    const allowedStarNames = new Set(
      (team.starPlayers ?? [])
        .map((starId) => starCatalog[starId]?.name)
        .filter((name): name is string => Boolean(name))
    );
    if (Object.keys(payload.team.roster.stars ?? {}).some((starName) => !allowedStarNames.has(starName))) {
      return { ok: false, error: "This team link includes star players that are not available to its team." };
    }

    return { ok: true, payload };
  } catch {
    return { ok: false, error: "This team link is malformed or could not be decoded." };
  }
}

function normalizePayload(value: unknown): SharedTeamPayload | undefined {
  if (!isRecord(value) || (value.version !== 1 && value.version !== SHARE_VERSION)) return undefined;
  if (
    typeof value.shareId !== "string" ||
    value.shareId.length === 0 ||
    value.shareId.length > MAX_SHARE_ID_LENGTH ||
    !/^[A-Za-z0-9_-]+$/.test(value.shareId)
  ) {
    return undefined;
  }
  if (value.ruleset !== "2020" && value.ruleset !== "2025") return undefined;
  if (value.mode !== "11s" && value.mode !== "7s") return undefined;
  if (value.ruleset === "2020" && value.mode !== "11s") return undefined;
  if (!isRecord(value.team) || typeof value.team.selectedTeamId !== "string") return undefined;
  if (value.team.selectedTeamId.length === 0 || value.team.selectedTeamId.length > 128) return undefined;
  if (value.team.name !== undefined && typeof value.team.name !== "string") {
    return undefined;
  }
  if (
    value.team.startingTreasury !== undefined &&
    (!Number.isSafeInteger(value.team.startingTreasury) || (value.team.startingTreasury as number) < 0)
  ) {
    return undefined;
  }
  if (!isRecord(value.team.roster)) return undefined;

  const sourceRoster = value.team.roster;
  if (!isCountRecord(sourceRoster.players)) return undefined;
  if (sourceRoster.stars !== undefined && !isCountRecord(sourceRoster.stars)) return undefined;
  if (sourceRoster.individualPlayers !== undefined && !isIndividualPlayers(sourceRoster.individualPlayers)) return undefined;
  if (sourceRoster.tiersByMode !== undefined && !isTierMap(sourceRoster.tiersByMode)) return undefined;
  if (!isCount(sourceRoster.reRolls) || sourceRoster.reRolls > 8) return undefined;
  if (!isCount(sourceRoster.apothecary) || sourceRoster.apothecary > 1) return undefined;
  const sourceStars = sourceRoster.stars === undefined ? {} : sourceRoster.stars;
  if (Object.values(sourceStars).some((count) => count > 1)) return undefined;

  const players = Object.fromEntries(Object.entries(sourceRoster.players));
  const stars = Object.fromEntries(Object.entries(sourceStars));
  const roster: SavedTeamRoster = {
    players,
    stars,
    reRolls: sourceRoster.reRolls,
    apothecary: sourceRoster.apothecary,
    individualPlayers: sourceRoster.individualPlayers as SavedTeamRoster["individualPlayers"],
    tiersByMode: sourceRoster.tiersByMode as SavedTeamRoster["tiersByMode"]
  };

  return {
    version: value.version as SharedTeamPayload["version"],
    shareId: value.shareId,
    ruleset: value.ruleset,
    mode: value.mode,
    team: {
      name: value.team.name as string | undefined,
      selectedTeamId: value.team.selectedTeamId,
      roster,
      startingTreasury: value.team.startingTreasury as number | undefined
    }
  };
}

function isCountRecord(value: unknown): value is Record<string, number> {
  return (
    isRecord(value) &&
    Object.values(value).every((count) => isCount(count))
  );
}

function isCount(value: unknown): value is number {
  return Number.isSafeInteger(value) && typeof value === "number" && value >= 0;
}

function isIndividualPlayers(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return Object.values(value).every((players) =>
    Array.isArray(players) && players.every((player) => {
      if (!isRecord(player)) return false;
      return (
        typeof player.id === "string" &&
        player.id.length > 0 &&
        Number.isInteger(player.number) &&
        (player.number as number) >= 0 &&
        (player.number as number) <= 99 &&
        (player.name === undefined || typeof player.name === "string") &&
        (player.numberCustomized === undefined || typeof player.numberCustomized === "boolean") &&
        Array.isArray(player.skills) &&
        player.skills.every((skill) => typeof skill === "string") &&
        new Set(player.skills).size === player.skills.length
      );
    })
  );
}

function isTierMap(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    Object.keys(value).every((mode) => mode === "11s" || mode === "7s") &&
    Object.values(value).every((tier) => Number.isInteger(tier) && (tier as number) >= 1 && (tier as number) <= 4)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
