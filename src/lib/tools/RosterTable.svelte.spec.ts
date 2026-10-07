import { page, userEvent } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { get, writable, type Writable } from 'svelte/store';
import type { Team, PlayerType } from '$lib/data/teams/types';
import { currentRoster, selectedTeam } from '$lib/stores/roster';
import RosterTable from './RosterTable.svelte';

vi.mock('$lib/stores/roster', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$lib/stores/roster')>();
	return { ...actual, selectedTeam: writable<Team | undefined>(undefined) };
});

const makePlayer = (id: string, name: string, overrides: Partial<PlayerType> = {}): PlayerType => ({
	id,
	name,
	ma: 6,
	st: 3,
	ag: 4,
	pa: undefined,
	av: 8,
	cost: 65000,
	max: 4,
	tags: ['Runner', 'Long-name tag', 'Passing specialist'],
	primary: ['Prime A', 'Prime B', 'Prime C', 'Prime D', 'Prime E'],
	secondary: ['Second A', 'Second B', 'Second C', 'Second D'],
	skills: ['Horns', 'Sure Hands', 'Dodge', 'Block', 'Tackle', 'Jump Up'],
	...overrides
});

const testTeam: Team = {
	id: 'test-team',
	name: 'Test Team',
	rerollCost: 50000,
	apothecary: true,
	players: [
		makePlayer('long-player', 'Long Player'),
		makePlayer('other-player', 'Other Player', {
			tags: ['Independent tag'],
			primary: ['Other A', 'Other B', 'Other C', 'Other D'],
			secondary: ['Other Sec A', 'Other Sec B', 'Other Sec C', 'Other Sec D'],
			skills: ['Other Skill A', 'Other Skill B', 'Other Skill C', 'Other Skill D']
		}),
		makePlayer('short-player', 'Short Player', {
			tags: ['Short tag'],
			primary: ['Short A', 'Short B', 'Short C'],
			secondary: [],
			skills: ['Short Skill A', 'Short Skill B', 'Short Skill C']
		}),
		makePlayer(
			'stress-player',
			'A Very Long Player Position Name That Must Wrap On Narrow Screens',
			{
				tags: ['A Long Tag With A ParticularlyLongUnbrokenSegmentThatMustWrap'],
				primary: [
					'PrimaryOptionWithAnExtremelyLongUnbrokenNameThatMustNotCauseHorizontalOverflow',
					'Primary Option B',
					'Primary Option C',
					'Primary Option D'
				],
				secondary: [
					'SecondaryOptionWithAnExtremelyLongUnbrokenNameThatMustNotCauseHorizontalOverflow',
					'Secondary Option B',
					'Secondary Option C',
					'Secondary Option D'
				],
				skills: [
					'SkillNameWithAnExtremelyLongUnbrokenNameThatMustNotCauseHorizontalOverflow',
					'Long Skill B',
					'Long Skill C',
					'Long Skill D'
				]
			}
		)
	]
};

const selectedTeamStore = selectedTeam as unknown as Writable<Team | undefined>;

function getPlayerCard(index: number) {
	return page.getByRole('list', { name: 'Available players' }).getByRole('listitem').nth(index);
}

function getButton(locator: ReturnType<typeof page.getByRole>): HTMLButtonElement {
	return locator.element() as HTMLButtonElement;
}

describe('RosterTable player cards', () => {
	beforeEach(() => {
		selectedTeamStore.set(testTeam);
		currentRoster.set({ players: {}, stars: {}, reRolls: 0, apothecary: 0 });
	});

	it('renders player identity, all tags, formatted cost, and labeled stats and groups', async () => {
		render(RosterTable);
		const card = getPlayerCard(0);

		await expect.element(page.getByRole('list', { name: 'Available players' })).toBeInTheDocument();
		await expect.element(card.getByText('Long Player', { exact: true })).toBeInTheDocument();
		for (const tag of ['Runner', 'Long-name tag', 'Passing specialist']) {
			await expect.element(card.getByText(tag, { exact: true })).toBeInTheDocument();
		}

		await expect.element(card.getByText('65k', { exact: true })).toBeInTheDocument();
		expect(card.element().querySelector('.cost-badge')?.getAttribute('aria-label')).toBe('Cost 65k');

		for (const [label, value] of [
			['MA', '6'],
			['ST', '3'],
			['AG', '4+'],
			['PA', '—'],
			['AV', '8+']
		]) {
			await expect.element(card.getByText(label, { exact: true })).toBeInTheDocument();
			await expect.element(card.getByText(value, { exact: true })).toBeInTheDocument();
		}

		const groups = card.element().querySelector('.player-group');
		expect(groups?.querySelector('.primary-pill')?.textContent).toBe('Pri Prime APrime BPrime CPrime DPrime E');
		expect(groups?.querySelector('.secondary-pill')?.textContent).toBe('Sec Second ASecond BSecond CSecond D');
		expect(groups?.textContent).toContain('Horns');
	});

	it('renders category access strings as single compact badges', async () => {
		selectedTeamStore.set({
			...testTeam,
			players: [makePlayer('eagle', 'Eagle Warrior', { primary: ['G'], secondary: ['A', 'S'] })]
		});
		render(RosterTable);
		const card = getPlayerCard(0);
		await expect.element(card.getByText('Pri G', { exact: true })).toBeInTheDocument();
		await expect.element(card.getByText('Sec AS', { exact: true })).toBeInTheDocument();
	});

	it('increments and decrements counts and disables decrement at zero', async () => {
		render(RosterTable);
		const card = getPlayerCard(0);
		const decrement = card.getByRole('button', { name: 'Decrease Long Player count' });
		const increment = card.getByRole('button', { name: 'Increase Long Player count' });
		const count = card.element().querySelector('.count-value')!;

		expect(decrement.element().hasAttribute('disabled')).toBe(true);
		await userEvent.click(getButton(increment));
		expect(count.getAttribute('aria-label')).toBe('1 of 4');
		expect(decrement.element().hasAttribute('disabled')).toBe(false);

		await userEvent.click(getButton(decrement));
		expect(count.getAttribute('aria-label')).toBe('0 of 4');
		expect(decrement.element().hasAttribute('disabled')).toBe(true);
	});

	it('removes directly when uncustomized players are the only removal choice', async () => {
		render(RosterTable);
		const card = getPlayerCard(0);
		await userEvent.click(getButton(card.getByRole('button', { name: 'Increase Long Player count' })));
		await userEvent.click(getButton(card.getByRole('button', { name: 'Decrease Long Player count' })));

		await expect.element(page.getByRole('dialog', { name: /remove long player/i })).not.toBeInTheDocument();
		await expect.element(card.getByText('0', { exact: true }).first()).toBeInTheDocument();
	});

	it('removes the selected customized player while preserving the other instances', async () => {
		currentRoster.set({
			players: { 'long-player': 3 },
			stars: {},
			reRolls: 0,
			apothecary: 0,
			individualPlayers: {
				'long-player': [
					{ id: 'named', number: 1, name: 'Captain', skills: [] },
					{ id: 'skilled', number: 2, skills: ['tackle'] },
					{ id: 'default', number: 3, skills: [] }
			]
			}
		});
		render(RosterTable);
		const card = getPlayerCard(0);
		await userEvent.click(getButton(card.getByRole('button', { name: 'Decrease Long Player count' })));
		const dialog = page.getByRole('dialog', { name: /remove long player/i });
		await expect.element(dialog.getByRole('radio', { name: /captain #1/i })).toBeInTheDocument();
		await expect.element(dialog.getByRole('radio', { name: /any uncustomized player \(1\)/i })).toBeInTheDocument();
		await userEvent.click(dialog.getByRole('radio', { name: /captain #1/i }).element());
		await userEvent.click(getButton(dialog.getByRole('button', { name: 'Remove player' })));
		expect(get(currentRoster).individualPlayers?.['long-player'].map((player) => player.id)).toEqual(['skilled', 'default']);
		expect(get(currentRoster).players['long-player']).toBe(2);
	});

	it('edits per-player names, unique numbers, and added skills without exposing starting skills for removal', async () => {
		const skillTeam: Team = {
			...testTeam,
			players: [makePlayer('eligible', 'Eligible Player', { primary: ['G'], secondary: ['A'], skills: ['Block'] })]
		};
		selectedTeamStore.set(skillTeam);
		currentRoster.set({
			players: { eligible: 1 },
			stars: {},
			reRolls: 0,
			apothecary: 0,
			individualPlayers: { eligible: [{ id: 'unique-player', number: 1, skills: [] }] }
		});
		render(RosterTable, { editMode: true });

		const name = page.getByRole('textbox', { name: 'Eligible Player #1 name' });
		await name.fill('The Ace');
		const number = page.getByRole('spinbutton', { name: 'Eligible Player #1 number' });
		await number.fill('0');
		const skill = page.getByRole('combobox', { name: 'Choose additional skill for Eligible Player #0' });
		(skill.element() as HTMLSelectElement).value = 'strip-ball';
		(skill.element() as HTMLSelectElement).dispatchEvent(new Event('change', { bubbles: true }));
		await userEvent.click(getButton(page.getByRole('button', { name: 'Add skill', exact: true })));

		expect(get(currentRoster)).toMatchObject({
			individualPlayers: { eligible: [{ id: 'unique-player', number: 0, name: 'The Ace', numberCustomized: true, skills: ['strip-ball'] }] }
		});
		await expect.element(page.getByRole('button', { name: 'Remove Strip Ball from Eligible Player #0' })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Remove Block from Eligible Player #0' })).not.toBeInTheDocument();
	});

	it('keeps access badges combined and displays every skill without a more toggle', async () => {
		render(RosterTable);
		const first = getPlayerCard(0);
		await expect.element(first.getByText('Pri Prime APrime BPrime CPrime DPrime E', { exact: true })).toBeInTheDocument();
		for (const skill of ['Horns', 'Block', 'Tackle', 'Jump Up']) {
			await expect.element(first.getByRole('button', { name: skill, exact: true })).toBeInTheDocument();
		}
		expect(first.getByRole('button', { name: /more/i }).length).toBe(0);
	});

	it('keeps compact access badges and skills independent from the skill details modal', async () => {
		render(RosterTable);
		const shortCard = getPlayerCard(2);
		await expect.element(shortCard.getByText('Pri Short AShort BShort C', { exact: true })).toBeInTheDocument();
		expect(shortCard.getByText('Sec', { exact: true }).length).toBe(0);

		const first = getPlayerCard(0);
		await expect.element(first.getByRole('button', { name: 'Block' })).toBeInTheDocument();
		await expect.element(first.getByRole('button', { name: 'Tackle' })).toBeInTheDocument();
		await expect.element(first.getByRole('button', { name: 'Jump Up' })).toBeInTheDocument();
		expect(page.getByRole('dialog').length).toBe(0);

		getButton(first.getByRole('button', { name: 'Horns' })).click();
		const skillDialog = page.getByRole('dialog', { name: 'Skill details' });
		await expect.element(skillDialog).toBeInTheDocument();
		getButton(page.getByRole('button', { name: 'Close' })).click();
		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
		await expect.element(first.getByRole('button', { name: 'Tackle' })).toBeInTheDocument();
	});

	it('shows active/passive and Elite badges in the roster skill modal', async () => {
		render(RosterTable);
		const first = getPlayerCard(0);

		getButton(first.getByRole('button', { name: 'Horns', exact: true })).click();
		const dialog = page.getByRole('dialog', { name: 'Skill details' });
		await expect.element(dialog).toBeInTheDocument();
		expect(dialog.element().querySelector('.badge')?.textContent?.trim()).toMatch(/^(active|passive)$/);
		getButton(dialog.getByRole('button', { name: 'Close' })).click();

		getButton(first.getByRole('button', { name: 'Block', exact: true })).click();
		await expect.element(dialog.getByText('active', { exact: true })).toBeInTheDocument();
		await expect.element(dialog.getByText('Elite', { exact: true })).toBeInTheDocument();
	});

	it.each([320, 360, 390, 768, 1280])(
		'keeps long card content within %i px in light and dark themes',
		async (width) => {
			await page.viewport(width, 900);
			render(RosterTable);
			const cardLocator = getPlayerCard(3);
			const card = cardLocator.element();
			const documentElement = card.ownerDocument.documentElement;
			const identity = card.querySelector('.player-identity')!;
			const countButtons = Array.from(card.querySelectorAll('.player-count > button'));
			const currentCount = card.querySelector('.count-current')!;
			const maxCount = card.querySelector('.count-max')!;
			const countDivider = card.querySelector('.count-divider')!;

			for (const theme of ['light', 'dark'] as const) {
				documentElement.classList.toggle('dark', theme === 'dark');
				const identityRect = identity.getBoundingClientRect();
				const buttonRects = countButtons.map((button) => button.getBoundingClientRect());
				expect(buttonRects.map((rect) => Math.round(rect.width))).toEqual([44, 44]);
				expect(buttonRects.map((rect) => Math.round(rect.height))).toEqual([44, 44]);
				expect(buttonRects.every((rect) => rect.left >= identityRect.left - 1)).toBe(true);
				expect(buttonRects.every((rect) => rect.right <= identityRect.right + 1)).toBe(true);
				expect(currentCount.getBoundingClientRect().top).toBeLessThan(
					maxCount.getBoundingClientRect().top
				);
				expect(countDivider.getBoundingClientRect().width).toBeGreaterThan(
					countDivider.getBoundingClientRect().height
				);
				expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
				expect(card.getBoundingClientRect().right).toBeLessThanOrEqual(
					documentElement.clientWidth + 1
				);
				expect(card.ownerDocument.defaultView!.getComputedStyle(card).backgroundColor).toBe(
					theme === 'dark' ? 'rgb(17, 24, 39)' : 'rgb(255, 255, 255)'
				);
			}

			expect(card.querySelectorAll('.group-toggle')).toHaveLength(0);

			for (const theme of ['light', 'dark'] as const) {
				documentElement.classList.toggle('dark', theme === 'dark');
				const gridColumns = card.ownerDocument
					.defaultView!.getComputedStyle(card)
					.gridTemplateColumns.trim()
					.split(/\s+/);
				expect(gridColumns).toHaveLength(width <= 360 ? 1 : 2);
				expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
				expect(card.getBoundingClientRect().right).toBeLessThanOrEqual(
					documentElement.clientWidth + 1
				);
				expect(card.ownerDocument.defaultView!.getComputedStyle(card).backgroundColor).toBe(
					theme === 'dark' ? 'rgb(17, 24, 39)' : 'rgb(255, 255, 255)'
				);
			}

			documentElement.classList.remove('dark');
			await page.viewport(1280, 900);
		}
	);
});
