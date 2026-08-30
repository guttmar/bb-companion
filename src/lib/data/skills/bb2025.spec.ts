import { describe, expect, it } from 'vitest';
import { bb2025Skills } from './bb2025';

describe('bb2025 skill descriptions', () => {
	it('keeps explicit line breaks in the Stab description', () => {
		const stab = bb2025Skills
			.flatMap((category) => category.skills)
			.find((skill) => skill.name === 'Stab');

		expect(stab).toBeDefined();
		expect(stab?.description).toContain('Turn.\n\nWhen this player performs a Stab Special Action');
		expect(stab?.description).toContain('When this player performs a Stab Special Action');
	});
});
