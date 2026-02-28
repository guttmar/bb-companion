import { writable, derived } from "svelte/store";
import { getTeams } from "$lib/data/teams";
import { settings } from "$lib/stores/settings";

export const selectedTeamId = writable<string>("human");

export const teams = derived(settings, ($settings) => getTeams($settings.ruleset));

export const selectedTeam = derived(
  [selectedTeamId, teams],
  ([$id, $teams]) => $teams?.[$id]
);

export const currentRoster = writable<{
  players: Record<string, number>;
  reRolls: number;
  apothecary: number;
}>({
  players: {},
  reRolls: 0,
  apothecary: 0
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
    ) -
    ($team?.rerollCost ?? 0) * $roster.reRolls -
    ($team?.apothecary ? 50000 * $roster.apothecary : 0)
);
