import { derived } from "svelte/store";
import { currentRoster, selectedTeam, treasuryLeft } from "./roster";
import { settings } from "./settings";
import { RULESETS } from "$lib/domain/rulesets";
import { validateRoster } from "$lib/domain/validateRoster";

export const rosterValidation = derived(
  [currentRoster, selectedTeam, treasuryLeft, settings],
  ([$r, $t, $m, $s]) =>
    $t ? validateRoster({ players: $r.players, treasuryLeft: $m }, $t, RULESETS[$s.ruleset]) : []
);
