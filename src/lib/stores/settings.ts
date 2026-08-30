import { writable } from "svelte/store";
import { browser } from "$app/environment";
import type { GameMode, RulesetId } from "$lib/domain/rulesets";

type Settings = {
  ruleset: RulesetId;
  mode: GameMode;
  theme: "light" | "dark";
};

const SETTINGS_STORAGE_KEY = "bb-companion:settings";

const DEFAULT_SETTINGS: Settings = {
  ruleset: "2025",
  mode: "11s",
  theme: "dark"
};

function createSettingsStore() {
  let initial: Settings = DEFAULT_SETTINGS;

  if (browser) {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<Settings>;

        const ruleset = parsed && typeof parsed.ruleset === "string" && ["2020", "2025"].includes(parsed.ruleset)
          ? (parsed.ruleset as RulesetId)
          : DEFAULT_SETTINGS.ruleset;

        const mode = parsed && typeof parsed.mode === "string" && ["11s", "7s"].includes(parsed.mode)
          ? (parsed.mode as GameMode)
          : DEFAULT_SETTINGS.mode;

        initial = {
          ruleset,
          mode: ruleset === "2025" ? mode : "11s",
          theme:
            parsed.theme === "dark" || parsed.theme === "light"
              ? parsed.theme
              : DEFAULT_SETTINGS.theme
        };
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
