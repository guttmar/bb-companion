import type { StarPlayer } from '$lib/data/stars';
import type { Team } from '$lib/data/teams/types';
import type { IndividualPlayers } from './rosterPlayers';
import {
	getEliteSkillLimit,
	getSecondarySkillLimit,
	getSkillChoices,
	getSkillPointBudget,
	getStarSkillPointCost,
	getTeamTier,
	isMegaStar,
	type TeamTier
} from './matchedPlay';
import type { GameMode, RulesetId } from './rulesets';
import type { ValidationWarning } from './validation';

export function validateSkillDraft(
	roster: {
		players: Record<string, number>;
		stars?: Record<string, number>;
		individualPlayers?: IndividualPlayers;
		tiersByMode?: Partial<Record<GameMode, TeamTier>>;
	},
	team: Team,
	stars: StarPlayer[],
	ruleset: RulesetId,
	mode: GameMode
): ValidationWarning[] {
	if (ruleset !== '2025') return [];
	const warnings: ValidationWarning[] = [];
	const tier = getTeamTier(team, team.name, roster.tiersByMode ?? {}, mode);
	if (!tier) {
		return [{ id: 'skill-tier', level: 'warning', message: 'Choose a team tier to calculate Skill Points.' }];
	}

	let spent = 0;
	let secondaryCount = 0;
	let eliteCount = 0;
	for (const [positionId, count] of Object.entries(roster.players)) {
		const position = team.players.find((player) => player.id === positionId);
		if (!position) continue;
		const individuals = roster.individualPlayers?.[positionId] ?? [];
		for (const player of individuals.slice(0, count)) {
			if (player.skills.length > 1) {
				warnings.push({
					id: `multiple-skills-${player.id}`,
					level: 'warning',
					message: `${player.name?.trim() || position.name} #${player.number} has more than one additional skill.`
				});
			}
			const choices = getSkillChoices(position);
			for (const skillId of player.skills) {
				const choice = choices.find((candidate) => candidate.skill.id === skillId);
				if (!choice) {
					warnings.push({
						id: `invalid-skill-${player.id}-${skillId}`,
						level: 'warning',
						message: `${position.name} #${player.number} has an additional skill that is not available to this player.`
					});
					continue;
				}
				spent += choice.cost;
				if (choice.access === 'secondary') secondaryCount++;
				if (choice.skill.elite) eliteCount++;
			}
		}
	}

	let starPlayerChoices = 0;
	let megaStarChoices = 0;
	for (const [starName, count] of Object.entries(roster.stars ?? {})) {
		if (!count || mode === '7s') continue;
		const star = stars.find((candidate) => candidate.name === starName);
		if (!star) continue;
		const descriptions = star.profiles.flatMap((profile) => profile.specialSkills.map((skill) => skill.description));
		starPlayerChoices += count;
		if (isMegaStar(star.name)) megaStarChoices += count;
		spent += getStarSkillPointCost(star.name, descriptions, mode) * count;
	}
	if (mode === '11s') {
		const maxStars = tier === 1 ? 1 : 2;
		if (starPlayerChoices > maxStars) {
			warnings.push({ id: 'star-player-tier-limit', level: 'warning', message: `Too many Star Players for Tier ${tier}: ${starPlayerChoices} selected of ${maxStars} allowed.` });
		}
		if (megaStarChoices > 1) {
			warnings.push({ id: 'mega-star-limit', level: 'warning', message: 'A team may include only one Mega-star.' });
		}
	}

	const budget = getSkillPointBudget(tier, mode);
	if (spent > budget) {
		warnings.push({
			id: 'skill-points-over-budget',
			level: 'warning',
			message: `Skill Points over budget: ${spent} spent of ${budget}.`
		});
	}
	const secondaryLimit = getSecondarySkillLimit(tier, mode);
	if (secondaryCount > secondaryLimit) {
		warnings.push({
			id: 'secondary-skills-over-limit',
			level: 'warning',
			message: `Too many Secondary Skills: ${secondaryCount} used of ${secondaryLimit} allowed.`
		});
	}
	const eliteLimit = getEliteSkillLimit(mode);
	if (eliteCount > eliteLimit) {
		warnings.push({
			id: 'elite-skills-over-limit',
			level: 'warning',
			message: `Too many Elite Skills: ${eliteCount} used of ${eliteLimit} allowed.`
		});
	}
	return warnings;
}

export function getRosterSkillSpend(
	roster: {
		players: Record<string, number>;
		stars?: Record<string, number>;
		individualPlayers?: IndividualPlayers;
	},
	team: Team,
	stars: StarPlayer[],
	mode: GameMode
): number {
	let spent = 0;
	for (const [positionId, count] of Object.entries(roster.players)) {
		const position = team.players.find((player) => player.id === positionId);
		if (!position) continue;
		const choices = getSkillChoices(position);
		for (const player of (roster.individualPlayers?.[positionId] ?? []).slice(0, count)) {
			for (const skillId of player.skills) spent += choices.find((choice) => choice.skill.id === skillId)?.cost ?? 0;
		}
	}
	if (mode === '11s') {
		for (const [starName, count] of Object.entries(roster.stars ?? {})) {
			const star = stars.find((candidate) => candidate.name === starName);
			if (!star) continue;
			const descriptions = star.profiles.flatMap((profile) => profile.specialSkills.map((skill) => skill.description));
			spent += getStarSkillPointCost(star.name, descriptions, mode) * count;
		}
	}
	return spent;
}