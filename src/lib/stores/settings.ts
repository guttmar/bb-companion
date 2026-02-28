import { writable } from "svelte/store";
import { browser } from "$app/environment";
import type { RulesetId } from "$lib/domain/rulesets";

type Settings = {
  ruleset: RulesetId;
};

const SETTINGS_STORAGE_KEY = "bb-companion:settings";

const DEFAULT_SETTINGS: Settings = {
  ruleset: "2020"
};

function createSettingsStore() {
  let initial: Settings = DEFAULT_SETTINGS;

  if (browser) {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<Settings>;

        if (
          parsed &&
          typeof parsed.ruleset === "string" &&
          ["2016", "2020", "2025"].includes(parsed.ruleset)
        ) {
          initial = { ruleset: parsed.ruleset as RulesetId };
        }
      } catch {
        // Ignore invalid JSON and fall back to defaults
      }
    }
  }

  const store = writable<Settings>(initial);

  if (browser) {
    store.subscribe((value) => {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(value));
      } catch {
        // Ignore write errors
      }
    });
  }

  return store;
}

export const settings = createSettingsStore();
