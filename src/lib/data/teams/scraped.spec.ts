import { describe, expect, it } from 'vitest';
import teams2020Data from '../../../../scraper/teams_2020.json';
import teams2025Data from '../../../../scraper/teams_2025.json';
import { adaptScrapedTeams } from './scraped';

describe('adaptScrapedTeams', () => {
	it('filters empty entries, derives stable IDs, and preserves scraped metadata', () => {
		const teams = adaptScrapedTeams({
			teams: [
				{ name: 'Teams', players: [] },
				{
					name: 'Chaos Chosen',
					reroll_cost: 50000,
					league: 'Chaos Clash',
					special_rules: ['Favoured of...'],
					staff: { cheerleader: 10000 },
					star_players: [{ name: 'Star', cost: 100000 }],
					inducements: [{ name: 'Item', cost: 20000 }],
					players: [
						{
							max_quantity: 16,
							position: 'Beastman Runner Lineman',
							MA: '6',
							ST: '3',
							AG: '3+',
							PA: '4+',
							AV: '9+',
							skills: ['Horns'],
							primary: ['G', 'M', 'S'],
							secondary: ['A', 'P'],
							cost: 60000
						}
					]
				}
			]
		});

		expect(Object.keys(teams)).toEqual(['chaos-chosen']);
		expect(teams['chaos-chosen'].players[0]).toMatchObject({
			id: 'beastman-runner-lineman',
			ma: 6,
			ag: 3,
			pa: 4,
			av: 9,
			displayStats: { ag: '3+', pa: '4+', av: '9+' }
		});
		expect(teams['chaos-chosen'].league).toBe('Chaos Clash');
	});

	it('keeps the first team when scraped navigation contains duplicates', () => {
		const teams = adaptScrapedTeams({
			teams: [
				{ name: 'Human', players: [] },
				{
					name: 'Human',
					reroll_cost: 50000,
					players: [
						{
							max_quantity: 16,
							position: 'Lineman',
							MA: '6',
							ST: '3',
							AG: '3+',
							PA: '4+',
							AV: '9+',
							cost: 50000
						}
					]
				},
				{
					name: 'Human',
					reroll_cost: 50000,
					players: [
						{
							max_quantity: 16,
							position: 'Other Lineman',
							MA: '6',
							ST: '3',
							AG: '3+',
							PA: '4+',
							AV: '9+',
							cost: 50000
						}
					]
				}
			]
		});

		expect(Object.keys(teams)).toEqual(['human']);
		expect(teams.human.players[0].name).toBe('Lineman');
	});

	it('preserves different reroll costs from scraped data', () => {
		const teams = adaptScrapedTeams({
			teams: [
				{
					name: 'Amazon',
					reroll_cost: 60000,
					players: [
						{
							max_quantity: 16,
							position: 'Linewoman',
							MA: '6',
							ST: '3',
							AG: '3+',
							AV: '8+',
							cost: 50000
						}
					]
				},
				{
					name: 'Human',
					reroll_cost: 50000,
					players: [
						{
							max_quantity: 16,
							position: 'Lineman',
							MA: '6',
							ST: '3',
							AG: '3+',
							AV: '9+',
							cost: 50000
						}
					]
				}
			]
		});

		expect(teams.amazon.rerollCost).toBe(60000);
		expect(teams.human.rerollCost).toBe(50000);
	});

	it('rejects playable teams without a reroll cost', () => {
		expect(() =>
			adaptScrapedTeams({
				teams: [
					{
						name: 'Missing Cost',
						players: [
							{ max_quantity: 16, position: 'Lineman', MA: '6', ST: '3', AG: '3+', AV: '9+', cost: 50000 }
						]
					}
				]
			})
		).toThrow('Missing reroll cost for Missing Cost');
	});

	it.each([
		['2020', teams2020Data],
		['2025', teams2025Data]
	])('has reroll costs for every %s team with players', (_ruleset, data) => {
		const playableTeams = data.teams.filter((team) => team.players?.length);

		expect(playableTeams.every((team) => typeof team.reroll_cost === 'number')).toBe(true);
		expect(adaptScrapedTeams(data)).not.toEqual({});
	});
});
