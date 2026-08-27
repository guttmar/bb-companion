// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { screen } from '@testing-library/dom';
import { get } from 'svelte/store';
import Page from './+page.svelte';
import { savedTeams, saveTeam, updateTeam } from '$lib/stores/savedTeams';

// helpers for making a minimal payload
function makePayload(name?: string) {
	return {
		name,
		selectedTeamId: 'human',
		roster: { players: {}, reRolls: 0, apothecary: 0 }
	};
}

describe('roster page save behavior', () => {
	beforeEach(() => {
		savedTeams.set([]);
	});

	it('opens with Save team button and clicking creates a new record', async () => {
		render(Page);
		const saveBtn = screen.getByRole('button', { name: /save team/i });
		expect(saveBtn).toBeInTheDocument();
		await saveBtn.click();
		const list = get(savedTeams);
		expect(list).toHaveLength(1);
	});

	it('button shows "Update team" when editingId is provided and clicking updates', async () => {
		// create an initial saved team
		const id = saveTeam(makePayload('foo'));
		// render page with editingId prop
		render(Page, { editingId: id });
		const updateBtn = screen.getByRole('button', { name: /update team/i });
		expect(updateBtn).toBeInTheDocument();

		// change the name input
		const nameInput = screen.getByPlaceholderText('My team');
		nameInput.value = 'bar';
		await updateBtn.click();

		const list = get(savedTeams);
		expect(list).toHaveLength(1);
		expect(list[0].id).toBe(id);
		expect(list[0].name).toBe('bar');
	});

	it('sorts the team select options alphabetically by name', async () => {
		render(Page);
		// read actual options text
		const options = screen.getAllByRole('option').map((opt) => opt.textContent?.trim() ?? '');
		// verify sorted order
		const sorted = [...options].sort((a, b) => a.localeCompare(b));
		expect(options).toEqual(sorted);
	});

	it('renders numeric stat columns on roster table', async () => {
		render(Page);
		// basic header labels added for stats
		expect(screen.getByText('MA')).toBeInTheDocument();
		expect(screen.getByText('ST')).toBeInTheDocument();
		expect(screen.getByText('AG')).toBeInTheDocument();
		expect(screen.getByText('PA')).toBeInTheDocument();
		expect(screen.getByText('AV')).toBeInTheDocument();
	});

	it('renders primary and secondary skill categories as compact text', async () => {
		render(Page);

		expect(screen.getByText('Prim')).toBeInTheDocument();
		expect(screen.getByText('Sec')).toBeInTheDocument();
		expect(screen.getByText('G')).toBeInTheDocument();
		expect(screen.getByText('AS')).toBeInTheDocument();
		expect(screen.getByText('—')).toBeInTheDocument();
	});
});
