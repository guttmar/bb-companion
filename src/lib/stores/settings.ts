import { writable } from "svelte/store";
import type { RulesetId } from "$lib/domain/rulesets";

export const settings = writable({
  ruleset: "2020" as RulesetId
});
