import { writable, derived } from "svelte/store";
import { TEAMS } from "$lib/data/teams";

export const selectedTeamId = writable<string>("human");

export const selectedTeam = derived(selectedTeamId, id => TEAMS[id]);

export const currentRoster = writable<{ players: Record<string, number> }>({
  players: {}
});

export const startingTreasury = writable(1000000);

export const treasuryLeft = derived(
  [currentRoster, selectedTeam, startingTreasury],
  ([$roster, $team, $start]) =>
    $start -
    Object.entries($roster.players).reduce(
      (sum, [id, count]) =>
        sum + ($team?.players.find((p: { id: string; cost: number }) => p.id === id)?.cost ?? 0) * (count as number),
      0
    )
);
