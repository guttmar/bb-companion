import { describe, expect, it } from 'vitest';
import { getDefaultStartingTreasury, getRulesetConfig } from './rulesets';
import { validateRoster } from './validateRoster';

describe('7s roster rules', () => {
  it('uses seven-a-side roster limits for the 2025 ruleset', () => {
    const rules = getRulesetConfig('2025', '7s');

    expect(rules.minPlayers).toBe(7);
    expect(rules.maxPlayers).toBe(11);
    expect(rules.allowNegativeTreasury).toBe(true);
    expect(rules.maxNonLinemanPlayers).toBe(4);
  });

  it('uses 600k as the default treasury in 7s mode', () => {
    expect(getDefaultStartingTreasury('2025', '7s')).toBe(600000);
    expect(getDefaultStartingTreasury('2025', '11s')).toBe(1000000);
  });

  it('supports separate treasury defaults for each ruleset and mode combination', () => {
    const overrides = {
      '2020': { '11s': 1200000 },
      '2025': { '11s': 1150000, '7s': 800000 }
    } as const;

    expect(getDefaultStartingTreasury('2025', '11s', overrides)).toBe(1150000);
    expect(getDefaultStartingTreasury('2025', '7s', overrides)).toBe(800000);
    expect(getDefaultStartingTreasury('2020', '11s', overrides)).toBe(1200000);
  });

  it('flags teams that are outside the seven-a-side player range', () => {
    const warnings = validateRoster(
      { players: { lineman: 6 }, treasuryLeft: 0 },
      { roster: [{ id: 'lineman', name: 'Lineman', cost: 10000, tags: ['Lineman'], max: undefined }] },
      getRulesetConfig('2025', '7s')
    );

    expect(warnings.map((w) => w.id)).toContain('min');
  });

  it('flags teams with more than four non-lineman players in 7s', () => {
    const warnings = validateRoster(
      { players: { blitzer: 5 }, treasuryLeft: 0 },
      { roster: [{ id: 'blitzer', name: 'Blitzer', cost: 10000, tags: ['Blitzer'], max: undefined }] },
      getRulesetConfig('2025', '7s')
    );

    expect(warnings.map((w) => w.id)).toContain('max-non-lineman');
  });
});
