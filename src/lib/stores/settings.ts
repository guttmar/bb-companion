import { writable } from "svelte/store";
import { browser } from "$app/environment";
import {
  DEFAULT_STARTING_TREASURY_BY_RULESET_MODE,
  type GameMode,
  type RulesetId,
  type TreasuryDefaults
} from "$lib/domain/rulesets";

type Settings = {
  ruleset: RulesetId;
  mode: GameMode;
  theme: "light" | "dark";
  treasuryDefaults: TreasuryDefaults;
};

const SETTINGS_STORAGE_KEY = "bb-companion:settings";

const cloneTreasuryDefaults = (): TreasuryDefaults => ({
  "2020": { "11s": 1000000, "7s": 1000000 },
  "2025": { "11s": 1000000, "7s": 600000 }
});

const DEFAULT_SETTINGS: Settings = {
  ruleset: "2025",
  mode: "11s",
  theme: "dark",
  treasuryDefaults: cloneTreasuryDefaults()
};

function normalizeTreasuryDefaults(value: unknown): TreasuryDefaults {
  const normalized = cloneTreasuryDefaults();

  if (!value || typeof value !== "object") {
    return normalized;
  }

  for (const ruleset of ["2020", "2025"] as const) {
    const modeMap = (value as Record<string, unknown>)[ruleset];
    if (!modeMap || typeof modeMap !== "object") {
      continue;
    }

    for (const mode of ["11s", "7s"] as const) {
      const candidate = (modeMap as Record<string, unknown>)[mode];
      if (typeof candidate === "number" && Number.isFinite(candidate) && candidate >= 0) {
        normalized[ruleset][mode] = candidate;
      }
    }
  }

  return normalized;
}

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
              : DEFAULT_SETTINGS.theme,
          treasuryDefaults: normalizeTreasuryDefaults(parsed.treasuryDefaults)
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
