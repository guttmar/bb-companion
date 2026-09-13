import { bb2025Skills, type Skill } from '$lib/data/skills/bb2025';

export function normalizeSkillName(name: string): string {
	return name.replace(/\s*\([^)]*\)\s*/g, '').trim();
}

export function resolveSkill(name: string): Skill | null {
	const normalized = normalizeSkillName(name).toLowerCase();

	for (const category of bb2025Skills) {
		const skill = category.skills.find(
			(candidate) =>
				candidate.name.toLowerCase() === normalized || candidate.id.toLowerCase() === normalized
		);
		if (skill) return skill;
	}

	return null;
}