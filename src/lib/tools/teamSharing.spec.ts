import { describe, expect, it } from "vitest";
import { getStarPlayers } from "$lib/data/stars";
import { getTeams } from "$lib/data/teams";
import type { SavedTeam } from "$lib/stores/savedTeams";
import { decodeAndValidateTeamShare, encodeTeamShare } from "./teamSharing";

function makeTeam(): SavedTeam {
  const ruleset = "2025";
  const template = Object.values(getTeams(ruleset))[0];
  const starCatalog = getStarPlayers(ruleset);
  const eligibleStar = (template.starPlayers ?? []).map((id) => starCatalog[id]).find(Boolean);

  return {
    id: "local-id",
    shareId: "share_identity_1",
    name: "Équipe test",
    selectedTeamId: template.id,
    ruleset,
    mode: "11s",
    startingTreasury: 1000000,
    roster: {
      players: { [template.players[0].id]: 2 },
      stars: eligibleStar ? { [eligibleStar.name]: 1 } : {},
      reRolls: 2,
      apothecary: 1,
      individualPlayers: {
        [template.players[0].id]: [
          { id: 'player-one', number: 4, name: 'MVP', veteran: true, skills: ['block'] },
          { id: 'player-two', number: 12, numberCustomized: true, skills: [] }
        ]
      },
      tiersByMode: { '11s': 2, '7s': 3 }
    }
  };
}

function encodeRaw(value: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

describe("team share links", () => {
  it("round-trips complete UTF-8 team data using URL-safe encoding", () => {
    const team = makeTeam();
    const decoded = decodeAndValidateTeamShare(encodeTeamShare(team));

    expect(decoded.ok).toBe(true);
    if (decoded.ok) {
      expect(decoded.payload).toMatchObject({
        version: 2,
        shareId: team.shareId,
        ruleset: team.ruleset,
        mode: team.mode,
        team: {
          name: team.name,
          selectedTeamId: team.selectedTeamId,
          roster: team.roster,
          startingTreasury: team.startingTreasury
        }
      });
    }
  });

  it("rejects malformed data, invalid counts, and unknown player identifiers", () => {
    const team = makeTeam();
    const decoded = decodeAndValidateTeamShare(encodeTeamShare(team));
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    const valid = decoded.payload;

    expect(decodeAndValidateTeamShare("not a share link").ok).toBe(false);
    expect(
      decodeAndValidateTeamShare(
        encodeRaw({ ...valid, team: { ...valid.team, roster: { ...valid.team.roster, reRolls: -1 } } })
      ).ok
    ).toBe(false);
    expect(
      decodeAndValidateTeamShare(
        encodeRaw({ ...valid, team: { ...valid.team, roster: { ...valid.team.roster, players: { unknown: 1 } } } })
      ).ok
    ).toBe(false);
  });

  it('continues to accept version-1 links without individual player details', () => {
    const team = makeTeam();
    const encoded = encodeTeamShare(team);
    const decoded = decodeAndValidateTeamShare(encoded);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;

    const legacy = {
      ...decoded.payload,
      version: 1,
      team: {
        ...decoded.payload.team,
        roster: {
          players: decoded.payload.team.roster.players,
          stars: decoded.payload.team.roster.stars,
          reRolls: decoded.payload.team.roster.reRolls,
          apothecary: decoded.payload.team.roster.apothecary
        }
      }
    };
    const imported = decodeAndValidateTeamShare(encodeRaw(legacy));
    expect(imported.ok).toBe(true);
    if (imported.ok) {
      expect(imported.payload.version).toBe(1);
      expect(imported.payload.team.roster.individualPlayers).toBeUndefined();
      expect(imported.payload.team.roster.tiersByMode).toBeUndefined();
    }
  });
});
