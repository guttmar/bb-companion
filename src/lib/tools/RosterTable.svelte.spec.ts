import { page, userEvent } from 'vitest/browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { writable, type Writable } from 'svelte/store';
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
		expect(groups?.textContent).toContain('Pri');
		expect(groups?.textContent).toContain('Sec');
		expect(groups?.textContent).toContain('Horns');
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

	it('truncates each long group to three and expands each group and player independently', async () => {
		render(RosterTable);
		const first = getPlayerCard(0);
		const second = getPlayerCard(1);
		const primToggle = first.getByRole('button', {
			name: 'Show 2 more Prim options for Long Player'
		});
		const secToggle = first.getByRole('button', {
			name: 'Show 1 more Sec options for Long Player'
		});
		const skillsToggle = first.getByRole('button', { name: 'Show 3 more Skills for Long Player' });

		for (const toggle of [primToggle, secToggle, skillsToggle]) {
			expect(toggle.element().getAttribute('aria-expanded')).toBe('false');
		}
		expect(primToggle.element().textContent?.trim()).toBe('+2 more');
		expect(secToggle.element().textContent?.trim()).toBe('+1 more');
		expect(skillsToggle.element().textContent?.trim()).toBe('+3 more');
		await expect.element(first.getByText('Prime C', { exact: true })).toBeInTheDocument();
		expect(first.getByText('Prime D', { exact: true }).length).toBe(0);
		expect(first.getByText('Second D', { exact: true }).length).toBe(0);
		expect(first.getByRole('button', { name: 'Block' }).length).toBe(0);

		getButton(primToggle).click();
		const expandedPrimToggle = first.getByRole('button', {
			name: 'Show fewer Prim options for Long Player'
		});
		await expect.element(expandedPrimToggle).toHaveAttribute('aria-expanded', 'true');
		await expect.element(first.getByText('Prime D', { exact: true })).toBeInTheDocument();
		await expect.element(first.getByText('Prime E', { exact: true })).toBeInTheDocument();
		expect(secToggle.element().getAttribute('aria-expanded')).toBe('false');
		expect(skillsToggle.element().getAttribute('aria-expanded')).toBe('false');
		expect(
			second
				.getByRole('button', { name: 'Show 1 more Prim options for Other Player' })
				.element()
				.getAttribute('aria-expanded')
		).toBe('false');

		secToggle.element().focus();
		await userEvent.keyboard('{Enter}');
		const expandedSecToggle = first.getByRole('button', {
			name: 'Show fewer Sec options for Long Player'
		});
		await expect.element(expandedSecToggle).toHaveAttribute('aria-expanded', 'true');
		await expect.element(first.getByText('Second D', { exact: true })).toBeInTheDocument();
		await expect.element(expandedPrimToggle).toHaveAttribute('aria-expanded', 'true');

		getButton(expandedPrimToggle).click();
		const collapsedPrimToggle = first.getByRole('button', {
			name: 'Show 2 more Prim options for Long Player'
		});
		await expect.element(collapsedPrimToggle).toHaveAttribute('aria-expanded', 'false');
		await expect.element(first.getByText('Prime D', { exact: true })).not.toBeInTheDocument();
		await expect.element(expandedSecToggle).toHaveAttribute('aria-expanded', 'true');
		getButton(expandedSecToggle).click();
		const collapsedSecToggle = first.getByRole('button', {
			name: 'Show 1 more Sec options for Long Player'
		});
		await expect.element(collapsedSecToggle).toHaveAttribute('aria-expanded', 'false');
		await expect.element(first.getByText('Second D', { exact: true })).not.toBeInTheDocument();

		getButton(
			second.getByRole('button', { name: 'Show 1 more Prim options for Other Player' })
		).click();
		await expect
			.element(second.getByRole('button', { name: 'Show fewer Prim options for Other Player' }))
			.toHaveAttribute('aria-expanded', 'true');
		await expect
			.element(first.getByRole('button', { name: 'Show 2 more Prim options for Long Player' }))
			.toBeInTheDocument();
	});

	it('shows all short groups without disclosure controls and keeps skill disclosure separate from the modal', async () => {
		render(RosterTable);
		const shortCard = getPlayerCard(2);
		await expect.element(shortCard.getByText('Short A', { exact: true })).toBeInTheDocument();
		await expect.element(shortCard.getByText('Short C', { exact: true })).toBeInTheDocument();
		expect(shortCard.getByText('—', { exact: true }).length).toBe(2);
		for (const group of ['Prim', 'Sec', 'Skills']) {
			expect(
				shortCard.getByRole('button', { name: new RegExp(`${group} options for Short Player`) })
					.length
			).toBe(0);
		}

		const first = getPlayerCard(0);
		const skillsToggle = first.getByRole('button', { name: 'Show 3 more Skills for Long Player' });
		expect(skillsToggle.element().textContent?.trim()).toBe('+3 more');
		getButton(skillsToggle).click();
		await expect
			.element(first.getByRole('button', { name: 'Show fewer Skills for Long Player' }))
			.toHaveAttribute('aria-expanded', 'true');
		await expect.element(first.getByRole('button', { name: 'Block' })).toBeInTheDocument();
		await expect.element(first.getByRole('button', { name: 'Tackle' })).toBeInTheDocument();
		await expect.element(first.getByRole('button', { name: 'Jump Up' })).toBeInTheDocument();
		expect(page.getByRole('dialog').length).toBe(0);

		getButton(first.getByRole('button', { name: 'Horns' })).click();
		const skillDialog = page.getByRole('dialog', { name: 'Skill details' });
		await expect.element(skillDialog).toBeInTheDocument();
		getButton(page.getByRole('button', { name: 'Close' })).click();
		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
		getButton(first.getByRole('button', { name: 'Show fewer Skills for Long Player' })).click();
		await expect
			.element(first.getByRole('button', { name: 'Show 3 more Skills for Long Player' }))
			.toHaveAttribute('aria-expanded', 'false');
		await expect.element(first.getByRole('button', { name: 'Tackle' })).not.toBeInTheDocument();
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
				expect(countDivider.getBoundingClientRect().height).toBeGreaterThan(
					countDivider.getBoundingClientRect().width
				);
				expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
				expect(card.getBoundingClientRect().right).toBeLessThanOrEqual(
					documentElement.clientWidth + 1
				);
				expect(card.ownerDocument.defaultView!.getComputedStyle(card).backgroundColor).toBe(
					theme === 'dark' ? 'rgb(17, 24, 39)' : 'rgb(255, 255, 255)'
				);
			}

			for (const toggleName of [
				'Show 1 more Prim options for A Very Long Player Position Name That Must Wrap On Narrow Screens',
				'Show 1 more Sec options for A Very Long Player Position Name That Must Wrap On Narrow Screens',
				'Show 1 more Skills for A Very Long Player Position Name That Must Wrap On Narrow Screens'
			]) {
				getButton(cardLocator.getByRole('button', { name: toggleName })).click();
			}

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
