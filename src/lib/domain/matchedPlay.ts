import { bb2025Skills, type Skill } from '$lib/data/skills/bb2025';
import type { PlayerType, Team } from '$lib/data/teams/types';
import type { GameMode } from './rulesets';

export type TeamTier = 1 | 2 | 3 | 4;
export type SkillAccess = 'primary' | 'secondary';
export type SkillChoice = { skill: Skill; access: SkillAccess; cost: number };

const ACCESS_CATEGORY: Record<string, string> = {
	G: 'general',
	A: 'agility',
	P: 'pass',
	S: 'strength',
	D: 'devious',
	M: 'mutation'
};

// Compact values transcribed from Rules Snapshot sections
// bb2025-faq-team-tiers-may-2026 and bb2025-spike-22-sevens-team-tiers.
const TEAM_TIERS: Record<GameMode, string[][]> = {
	'11s': [
		['Amazon', 'Chaos Dwarf', 'Dark Elf', 'High Elf', 'Lizardmen', 'Norse', 'Old World Alliance', 'Underworld Denizens', 'Wood Elf'],
		['Bretonnian', 'Dwarf', 'Elven Union', 'Human', 'Imperial Nobility', 'Necromantic Horror', 'Orc', 'Shambling Undead', 'Skaven', 'Tomb Kings', 'Vampire'],
		['Black Orc', 'Chaos Chosen', 'Chaos Renegade', 'Khorne', 'Nurgle'],
		['Gnome', 'Goblin', 'Halfling', 'Ogre', 'Snotling']
	],
	'7s': [
		['Amazon', 'Chaos Dwarf', 'Dark Elf', 'Elven Union', 'Human', 'High Elf', 'Necromantic Horror', 'Norse', 'Old World Alliance', 'Skaven', 'Wood Elf'],
		['Bretonnian', 'Dwarf', 'Imperial Nobility', 'Lizardmen', 'Nurgle', 'Orc', 'Shambling Undead', 'Tomb Kings', 'Vampire'],
		['Black Orc', 'Chaos Chosen', 'Chaos Renegade', 'Halfling', 'Khorne', 'Underworld Denizens'],
		['Gnome', 'Goblin', 'Ogre', 'Snotling']
	]
};

// Mega-star names from Rules Snapshot section bb2025-faq-mega-stars (May 2026).
const MEGA_STARS = new Set([
	'griff oberwald',
	'hakflem skuttlespike',
	"h'thark the unstoppable",
	'ivan deathshroud',
	"morg 'n' thorg"
]);

function normalizeTeamName(value: string): string {
	const normalized = value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
	return normalized === 'chaosrenegades' ? 'chaosrenegade' : normalized;
}

function tierForTeam(teamName: string, mode: GameMode): TeamTier | undefined {
	const target = normalizeTeamName(teamName);
	const tierIndex = TEAM_TIERS[mode].findIndex((teams) => teams.some((name) => normalizeTeamName(name) === target));
	return tierIndex < 0 ? undefined : (tierIndex + 1) as TeamTier;
}

export function getDefaultTeamTier(teamName: string, mode: GameMode): TeamTier | undefined {
	return tierForTeam(teamName, mode);
}

export function getSkillPointBudget(tier: TeamTier, mode: GameMode): number {
	return mode === '7s' ? tier : [0, 6, 8, 9, 10][tier];
}

export function getSecondarySkillLimit(tier: TeamTier, mode: GameMode): number {
	return mode === '7s' ? 1 : tier;
}

export function getEliteSkillLimit(mode: GameMode): number {
	return mode === '7s' ? 2 : 4;
}

export function getSkillChoices(player: PlayerType): SkillChoice[] {
	const primary = new Set((player.primary ?? []).map((category) => ACCESS_CATEGORY[category]));
	const secondary = new Set((player.secondary ?? []).map((category) => ACCESS_CATEGORY[category]));
	const existing = new Set((player.skills ?? []).map(normalizeSkillName));
	const choices: SkillChoice[] = [];
	for (const category of bb2025Skills) {
		if (category.id === 'traits') continue;
		for (const skill of category.skills) {
			if (existing.has(normalizeSkillName(skill.name))) continue;
			const access: SkillAccess | undefined = primary.has(category.id)
				? 'primary'
				: secondary.has(category.id)
					? 'secondary'
					: undefined;
			if (access) choices.push({ skill, access, cost: access === 'primary' ? 1 : 2 });
		}
	}
	return choices;
}

export function normalizeSkillName(value: string): string {
	return value.replace(/\s*\([^)]*\)\s*/g, '').trim().toLowerCase();
}

export function getStarSkillPointCost(name: string, specialSkillDescriptions: string[], mode: GameMode): number {
	if (mode === '7s') return 0;
	if (isPairedStar(specialSkillDescriptions)) return 2;
	return isMegaStar(name) ? 4 : 2;
}

export function isPairedStar(specialSkillDescriptions: string[]): boolean {
	return specialSkillDescriptions.some((description) => /must be hired as a pair/i.test(description));
}

export function isMegaStar(name: string): boolean {
	return MEGA_STARS.has(name.trim().toLowerCase());
}

export function getTeamTier(team: Team | undefined, teamName: string, tiers: Partial<Record<GameMode, TeamTier>>, mode: GameMode): TeamTier | undefined {
	return tiers[mode] ?? (team?.tier as TeamTier | undefined) ?? getDefaultTeamTier(teamName, mode);
}