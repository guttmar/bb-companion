import { page } from 'vitest/browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { get } from 'svelte/store';
import Page from './+page.svelte';
import { formatCost, formatStat } from '$lib/tools/format';
import { savedTeams, saveTeam } from '$lib/stores/savedTeams';
import { currentRoster, selectedStarPlayers, selectedTeamId } from '$lib/stores/roster';

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
	});

	it('opens with Save team button and clicking creates a new record', async () => {
		render(Page);
		const saveBtn = page.getByRole('button', { name: /save team/i });
		await expect.element(saveBtn).toBeInTheDocument();
		(saveBtn.element() as HTMLButtonElement).click();
		const list = get(savedTeams);
		expect(list).toHaveLength(1);
	});

	it('button shows "Update team" when editingId is provided and clicking updates', async () => {
		// create an initial saved team
		const id = saveTeam(makePayload('foo'));
		// render page with editingId prop
		render(Page, { editingId: id });
		const updateBtn = page.getByRole('button', { name: /update team/i });
		await expect.element(updateBtn).toBeInTheDocument();

		// change the name input
		await page.getByText('Choose team, name, and starting treasury', { exact: true }).click();
		const nameInput = page.getByPlaceholder('My team');
		await nameInput.fill('bar');
		await updateBtn.click();

		const list = get(savedTeams);
		expect(list).toHaveLength(1);
		expect(list[0].id).toBe(id);
		expect(list[0].name).toBe('bar');
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

	it('renders labeled player cards instead of roster table headings', async () => {
		render(Page);
		const playerList = page.getByRole('list', { name: 'Available players' });
		const firstCard = playerList.getByRole('listitem').first();

		await expect.element(firstCard).toBeInTheDocument();
		for (const label of ['Cost', 'MA', 'ST', 'AG', 'PA', 'AV', 'Prim:', 'Sec:', 'Skills:']) {
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
