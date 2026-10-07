import { describe, expect, it } from 'vitest';
import { getTeams } from '$lib/data/teams';
import { getDefaultTeamTier, getSkillChoices, getSkillPointBudget, getStarSkillPointCost } from './matchedPlay';
import { validateSkillDraft } from './validateSkillDraft';

describe('BB2025 Matched Play skill rules', () => {
	it('uses the regular and Sevens tier lists independently', () => {
		expect(getDefaultTeamTier('Underworld Denizens', '11s')).toBe(1);
		expect(getDefaultTeamTier('Underworld Denizens', '7s')).toBe(3);
		for (const team of Object.values(getTeams('2025'))) {
			expect(getDefaultTeamTier(team.name, '11s'), `${team.name} has a regular tier`).toBeDefined();
			expect(getDefaultTeamTier(team.name, '7s'), `${team.name} has a Sevens tier`).toBeDefined();
		}
	});

	it('uses the separate 11s and 7s Skill Point budgets', () => {
		expect(getSkillPointBudget(3, '11s')).toBe(9);
		expect(getSkillPointBudget(3, '7s')).toBe(3);
	});

	it('offers eligible skills, excludes starting skills, and prices overlapping access as Primary', () => {
		const choices = getSkillChoices({
			id: 'player', name: 'Player', ma: 6, st: 3, ag: 3, av: 8, cost: 50000, max: 16,
			skills: ['Block'], primary: ['G'], secondary: ['G', 'A']
		});
		expect(choices.some((choice) => choice.skill.id === 'block')).toBe(false);
		expect(choices.find((choice) => choice.skill.id === 'tackle')).toMatchObject({ access: 'primary', cost: 1 });
		expect(choices.find((choice) => choice.skill.id === 'dodge')).toMatchObject({ access: 'secondary', cost: 2 });
	});

	it('charges regular Star Players, Mega-stars, and pairs according to the reference', () => {
		expect(getStarSkillPointCost('Akhorne the Squirrel', [], '11s')).toBe(2);
		expect(getStarSkillPointCost('Griff Oberwald', [], '11s')).toBe(4);
		expect(getStarSkillPointCost('Dribl & Drull', ['Must be hired as a pair.'], '11s')).toBe(2);
		expect(getStarSkillPointCost('Griff Oberwald', [], '7s')).toBe(0);
	});

	it('warns about multiple added skills and Skill Point budget excess', () => {
		const team = getTeams('2025')['underworld-denizens'];
		const playerType = team.players.find((player) => (player.primary ?? []).includes('G'))!;
		const skills = getSkillChoices(playerType).filter((choice) => choice.access === 'primary').slice(0, 7).map((choice) => choice.skill.id);
		const warnings = validateSkillDraft({
			players: { [playerType.id]: 1 },
			individualPlayers: {
				[playerType.id]: [{ id: 'p-1', number: 1, name: 'Runner', skills }]
			},
			tiersByMode: { '11s': 1 }
		}, team, [], '2025', '11s');
		expect(warnings.map((warning) => warning.id)).toContain('multiple-skills-p-1');
		expect(warnings.map((warning) => warning.id)).toContain('skill-points-over-budget');
	});

	it('applies the Sevens secondary-skill limit and lower budget', () => {
		const team = getTeams('2025').amazon;
		const playerType = team.players.find((player) => (player.primary ?? []).includes('G'))!;
		const secondarySkills = getSkillChoices(playerType).filter((choice) => choice.access === 'secondary').slice(0, 2);
		const warnings = validateSkillDraft({
			players: { [playerType.id]: 2 },
			individualPlayers: {
				[playerType.id]: [
					{ id: 's1', number: 1, skills: [secondarySkills[0].skill.id] },
					{ id: 's2', number: 2, skills: [secondarySkills[1].skill.id] }
				]
			},
			tiersByMode: { '7s': 1 }
		}, team, [], '2025', '7s');
		expect(warnings.map((warning) => warning.id)).toContain('secondary-skills-over-limit');
		expect(warnings.map((warning) => warning.id)).toContain('skill-points-over-budget');
	});
});