import { describe, expect, it } from 'vitest';
import { createIndividualPlayer, isCustomizedPlayer, syncIndividualPlayers } from './rosterPlayers';

describe('individual roster players', () => {
	it('creates unique IDs and the first available 1–99 numbers', () => {
		const existing = {
			first: [{ id: 'a', number: 1, skills: [] }, { id: 'b', number: 3, skills: [] }],
			second: [{ id: 'c', number: 2, skills: [] }]
		};
		expect(createIndividualPlayer(existing)).toMatchObject({ number: 4, skills: [] });
	});

	it('fills legacy count-only rosters with numbered player instances', () => {
		const roster = syncIndividualPlayers({ lineman: 2, catcher: 1 }, undefined);
		expect(roster.lineman).toHaveLength(2);
		expect(roster.catcher).toHaveLength(1);
		expect(Object.values(roster).flat().map((player) => player.number)).toEqual([1, 2, 3]);
	});

	it('groups untouched players but treats names, edited numbers, and skills as customization', () => {
		expect(isCustomizedPlayer({ id: 'default', number: 1, skills: [] })).toBe(false);
		expect(isCustomizedPlayer({ id: 'named', number: 2, name: 'Named', skills: [] })).toBe(true);
		expect(isCustomizedPlayer({ id: 'numbered', number: 0, numberCustomized: true, skills: [] })).toBe(true);
		expect(isCustomizedPlayer({ id: 'skilled', number: 3, skills: ['block'] })).toBe(true);
	});
});