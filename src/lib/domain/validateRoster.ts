import type { ValidationWarning } from "./validation";
import type { PlayerType } from "./types";

export function validateRoster(
  roster: { players: Record<string, number>; treasuryLeft: number },
  team: { roster: PlayerType[] },
  rules: { minPlayers: number; maxPlayers: number; allowNegativeTreasury: boolean }
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  const total = Object.values(roster.players).reduce((a, b) => a + b, 0);

  if (total < rules.minPlayers)
    warnings.push({ id: "min", level: "error", message: "Too few players" });

  if (total > rules.maxPlayers)
    warnings.push({ id: "max", level: "error", message: "Too many players" });

  for (const p of team.roster) {
    const count = roster.players[p.id] ?? 0;
    if (p.max && count > p.max)
      warnings.push({
        id: `max-${p.id}`,
        level: "error",
        message: `${p.name}: max ${p.max}`
      });
  }

  if (!rules.allowNegativeTreasury && roster.treasuryLeft < 0)
    warnings.push({ id: "money", level: "error", message: "Negative treasury" });

  return warnings;
}
