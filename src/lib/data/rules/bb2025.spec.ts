import { describe, expect, it } from 'vitest';
import { bb2025RuleChapters, searchRuleSections } from './bb2025';

describe('BB2025 Rules Snapshot', () => {
	it('contains the ten Core chapters plus FAQ and Spike! groups', () => {
		expect(bb2025RuleChapters).toHaveLength(15);
		expect(bb2025RuleChapters.slice(0, 10).every((chapter) => chapter.family === 'core-rules')).toBe(true);
		expect(bb2025RuleChapters.slice(10).map((chapter) => chapter.family)).toEqual(['faq', 'spike', 'spike', 'spike', 'spike']);
	});

	it('searches section titles and structured rule content case-insensitively', () => {
		const results = searchRuleSections('TURNOVER');

		expect(results.map((ruleSection) => ruleSection.title)).toContain('THE TURNOVER');
		expect(results.every((ruleSection) => ruleSection.id.startsWith('bb2025-'))).toBe(true);
	});

	it('uses the source site underscore paths for chapter attribution', () => {
		const rulesAndRegulations = bb2025RuleChapters.find((chapter) => chapter.slug === 'rules-and-regulations');

		expect(rulesAndRegulations?.sections[0].source.url).toBe(
			'https://bloodbowlbase.ru/bb2025/core_rules/rules_and_regulations/'
		);
	});

	it('returns the complete local snapshot for an empty query', () => {
		expect(searchRuleSections('')).toHaveLength(521);
	});
});