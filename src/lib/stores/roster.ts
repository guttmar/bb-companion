import { writable, derived, get } from "svelte/store";
import { getTeams } from "$lib/data/teams";
import { getDefaultStartingTreasury, getRulesetConfig } from "$lib/domain/rulesets";
import { settings } from "$lib/stores/settings";

export const selectedTeamId = writable<string>("amazon");

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

export const startingTreasury = writable(
  getDefaultStartingTreasury(get(settings).ruleset, get(settings).mode)
);

let previousSettings = { ruleset: get(settings).ruleset, mode: get(settings).mode };

settings.subscribe(($settings) => {
  const desiredDefault = getDefaultStartingTreasury($settings.ruleset, $settings.mode);
  const previousDefault = getDefaultStartingTreasury(previousSettings.ruleset, previousSettings.mode);

  startingTreasury.update((current) => {
    const isDefaultValue = current === 1000000 || current === 600000;
    const changedMode = previousSettings.mode !== $settings.mode;

    if (changedMode && isDefaultValue && current === previousDefault) {
      return desiredDefault;
    }

    if (current === 1000000 || current === 600000) {
      return desiredDefault;
    }

    return current;
  });

  previousSettings = { ruleset: $settings.ruleset, mode: $settings.mode };
});

export const treasuryLeft = derived(
  [currentRoster, selectedTeam, startingTreasury, settings],
  ([$roster, $team, $start, $settings]) => {
    const rules = getRulesetConfig($settings.ruleset, $settings.mode);
    const rerollCost = $settings.ruleset === "2025" && $settings.mode === "7s" ? rules.rerollCost : ($team?.rerollCost ?? 0);
    const apothecaryCost = $settings.ruleset === "2025" && $settings.mode === "7s" && $team?.apothecary ? rules.apothecaryCost : ($team?.apothecary ? 50000 : 0);

    return (
      $start -
      Object.entries($roster.players).reduce(
        (sum, [id, count]) =>
          sum + ($team?.players.find((p: { id: string; cost: number }) => p.id === id)?.cost ?? 0) * (count as number),
        0
      ) -
      rerollCost * $roster.reRolls -
      apothecaryCost * $roster.apothecary
    );
  }
);
