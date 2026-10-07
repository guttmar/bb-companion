import { derived } from "svelte/store";
import { currentRoster, selectedTeam, selectedStarPlayers, treasuryLeft } from "./roster";
import { settings } from "./settings";
import { getRulesetConfig } from "$lib/domain/rulesets";
import { validateRoster } from "$lib/domain/validateRoster";
import { validateSkillDraft } from "$lib/domain/validateSkillDraft";

export const rosterValidation = derived(
  [currentRoster, selectedTeam, selectedStarPlayers, treasuryLeft, settings],
  ([$r, $t, $stars, $m, $s]) =>
    $t
      ? [
          ...validateRoster({ players: $r.players, treasuryLeft: $m }, { roster: $t.players }, getRulesetConfig($s.ruleset, $s.mode)),
          ...validateSkillDraft($r, $t, $stars, $s.ruleset, $s.mode)
        ]
      : []
);
