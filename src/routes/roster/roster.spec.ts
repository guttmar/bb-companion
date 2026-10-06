import { page } from 'vitest/browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { get } from 'svelte/store';
import Page from './+page.svelte';
import { formatCost, formatStat } from '$lib/tools/format';
import { savedTeams, saveTeam } from '$lib/stores/savedTeams';
import { currentRoster, selectedStarPlayers, selectedTeamId, startingTreasury } from '$lib/stores/roster';
import { settings } from '$lib/stores/settings';

vi.mock('$app/stores', async () => {
	const { writable } = await import('svelte/store');
	return {
		page: writable({
			url: new URL('http://localhost/'),
			params: {},
			route: { id: '/' },
			status: 200,
			error: null,
			data: {},
			state: {},
			form: null
		})
	};
});

// helpers for making a minimal payload
function makePayload(name?: string) {
	return {
		name,
		selectedTeamId: 'human',
		roster: {
			players: {},
			reRolls: 0,
			apothecary: 0
		}
	};
}

describe('roster page save behavior', () => {
	beforeEach(() => {
		savedTeams.set([]);
		currentRoster.set({ players: {}, stars: {}, reRolls: 0, apothecary: 0 });
		selectedTeamId.set('amazon');
		settings.update((value) => ({ ...value, ruleset: '2025', mode: '11s' }));
	});

	it('opens the save dialog and saves a new record with the entered name', async () => {
		render(Page);
		const saveBtn = page.getByRole('button', { name: /save team/i });
		await expect.element(saveBtn).toBeInTheDocument();
		await saveBtn.click();
		const dialog = page.getByRole('dialog');
		await expect.element(dialog).toBeInTheDocument();
		await dialog.getByPlaceholder('My team').fill('New team');
		await dialog.getByRole('button', { name: 'Save team', exact: true }).click();
		const list = get(savedTeams);
		expect(list).toHaveLength(1);
		expect(list[0].name).toBe('New team');
	});

	it('button shows "Update team" when editingId is provided and clicking updates', async () => {
		// create an initial saved team
		const id = saveTeam(makePayload('foo'));
		// render page with editingId prop
		render(Page, { editingId: id });
		const updateBtn = page.getByRole('button', { name: /update team/i });
		await expect.element(updateBtn).toBeInTheDocument();

		await updateBtn.click();
		const dialog = page.getByRole('dialog');
		const nameInput = dialog.getByPlaceholder('My team');
		await nameInput.fill('bar');
		await dialog.getByRole('button', { name: 'Update team', exact: true }).click();

		const list = get(savedTeams);
		expect(list).toHaveLength(1);
		expect(list[0].id).toBe(id);
		expect(list[0].name).toBe('bar');
	});

	it('shows the player capacity for each game mode', async () => {
		render(Page);
		const summary = () =>
			page
				.getByRole('main')
				.element()
				.querySelector('.summary-bar .total-summary')
				?.textContent?.replace(/\s+/g, ' ')
				.trim();
		expect(summary()).toBe('0 / 16');
		settings.update((value) => ({ ...value, mode: '7s' }));
		await expect.element(page.getByText('0 / 11', { exact: true })).toBeInTheDocument();
	});

	it('sorts the team select options alphabetically by name', async () => {
		render(Page);
		// read actual options text
		const options = page
			.getByRole('option')
			.elements()
			.map((option) => option.textContent?.trim() ?? '');
		// verify sorted order
		const sorted = [...options].sort((a, b) => a.localeCompare(b));
		expect(options).toEqual(sorted);
	});

	it('shows starting, spent, and remaining treasury in an equation', async () => {
		render(Page);
		await expect.element(page.getByText('Left:', { exact: true })).not.toBeInTheDocument();
		const input = page.getByRole('spinbutton', { name: 'Starting treasury in thousands' });
		await input.fill('1234');
		expect(get(startingTreasury)).toBe(1234000);
		const summary = input.element().closest('.treasury-summary');
		expect(summary?.textContent?.replace(/\s+/g, ' ').trim()).toBe('k - 0k = 1234k');
	});

	it('renders player stat cards instead of a roster table', async () => {
		render(Page);
		const playerList = page.getByRole('list', { name: 'Available players' });
		const firstCard = playerList.getByRole('listitem').first();

		await expect.element(firstCard).toBeInTheDocument();
		for (const label of ['MA', 'ST', 'AG', 'PA', 'AV']) {
			await expect.element(firstCard.getByText(label, { exact: true })).toBeInTheDocument();
		}
		expect(playerList.element().querySelector('table')).toBeNull();
	});

	it('renders player names, tags, and access group values inside cards', async () => {
		render(Page);
		const playerList = page.getByRole('list', { name: 'Available players' });
		const firstCard = playerList.getByRole('listitem').first();

		const cardElement = firstCard.element();
		expect(cardElement.querySelector('.player-name')?.textContent?.trim()).not.toBe('');
		expect(cardElement.querySelectorAll('.player-tags > div').length).toBeGreaterThan(0);
		for (const group of cardElement.querySelectorAll('.player-group')) {
			expect(group.textContent?.trim()).not.toBe('');
		}
	});

	it('renders expandable star-player cards with a binary selection switch', async () => {
		render(Page);
		await page.getByText('Star players', { exact: true }).click();
		const star = get(selectedStarPlayers)[0];
		expect(star).toBeDefined();

		const card = page
			.getByRole('list', { name: 'Available star players' })
			.getByRole('listitem')
			.first();
		await expect.element(card.getByText(star.name, { exact: true })).toBeInTheDocument();
		await expect.element(card.getByText(formatCost(star.cost), { exact: true })).toBeInTheDocument();
		const selectionSwitch = card.getByRole('switch', { name: `Include ${star.name}` });
		expect((selectionSwitch.element() as HTMLInputElement).checked).toBe(false);

		(selectionSwitch.element() as HTMLInputElement).click();
		expect(get(currentRoster).stars[star.name]).toBe(1);
		expect((selectionSwitch.element() as HTMLInputElement).checked).toBe(true);
		(selectionSwitch.element() as HTMLInputElement).click();
		expect(get(currentRoster).stars[star.name]).toBe(0);
		expect((selectionSwitch.element() as HTMLInputElement).checked).toBe(false);

		const pairedStar = get(selectedStarPlayers).find((candidate) => candidate.name.toLowerCase().includes(' and '))!;
		const pairedStarSwitch = page.getByRole('switch', { name: `Include ${pairedStar.name}` });
		(pairedStarSwitch.element() as HTMLInputElement).click();
		expect(get(currentRoster).stars[pairedStar.name]).toBe(1);
		await expect.element(page.getByText('0 (+ 2) / 16', { exact: true })).toBeInTheDocument();

		const expandButton = card.getByRole('button', { name: star.name });
		await expandButton.click();
		await expect.element(expandButton).toHaveAttribute('aria-expanded', 'true');
		expect(card.element().querySelector('.star-stat')).not.toBeNull();
		expect(page.getByText('Available to teams', { exact: true }).length).toBe(0);
	});

	it('renders undefined stat values as an em dash instead of undefined+', () => {
		expect(formatStat(undefined, '+')).toBe('—');
		expect(formatStat(3, '+')).toBe('3+');
	});
});
