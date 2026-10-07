import { page } from 'vitest/browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { getStarPlayers } from '$lib/data/stars';
import { settings } from '$lib/stores/settings';
import Page from './+page.svelte';

const firstStarPlayerSkill = Object.values(getStarPlayers('2025'))
	.flatMap((star) =>
		star.profiles.flatMap((profile) =>
			profile.specialSkills.map((specialSkill) => ({ ...specialSkill, starName: star.name }))
		)
	)[0];

describe('Skills page cards', () => {
	beforeEach(() => {
		settings.update((current) => ({ ...current, ruleset: '2025', mode: '11s' }));
	});

	it('opens the shared skill details modal for a standard skill', async () => {
		render(Page);

		const generalSkills = page.getByRole('list', { name: 'General skills' });
		const block = generalSkills.getByRole('button', { name: 'Block', exact: true });
		await block.click();
		const dialog = page.getByRole('dialog', { name: 'Skill details' });
		await expect.element(dialog).toBeInTheDocument();
		await expect.element(dialog.getByText('Block', { exact: true })).toBeInTheDocument();
		await expect.element(dialog.getByText('active', { exact: true })).toBeInTheDocument();
		await expect.element(dialog.getByText('Elite', { exact: true })).toBeInTheDocument();
		await expect
			.element(dialog.getByText(/A player with this Skill may choose not to be Knocked Down/))
			.toBeInTheDocument();

		await dialog.getByRole('button', { name: 'Close' }).click();
		await expect.element(dialog).not.toBeInTheDocument();
	});

	it('keeps category collapse and search filtering working with the modal', async () => {
		render(Page);

		const generalSkills = page.getByRole('list', { name: 'General skills' });
		const block = generalSkills.getByRole('button', { name: 'Block', exact: true });
		await block.click();
		await page.getByRole('button', { name: 'Close' }).click();

		const generalCategory = page.getByRole('button', { name: 'General', exact: true });
		await generalCategory.click();
		await expect.element(generalCategory).toHaveAttribute('aria-expanded', 'false');
		await expect.element(page.getByRole('list', { name: 'General skills' })).not.toBeInTheDocument();
		await generalCategory.click();

		const restoredGeneralSkills = page.getByRole('list', { name: 'General skills' });
		const search = page.getByPlaceholder('Search skills...');
		await search.fill('Dauntless');
		const dauntless = restoredGeneralSkills.getByRole('button', { name: 'Dauntless', exact: true });
		await expect.element(dauntless).toBeInTheDocument();
		await dauntless.click();
		await expect.element(page.getByRole('dialog', { name: 'Skill details' })).toBeInTheDocument();
	});

	it('searches standard and Star Player skill descriptions and associated Star Player names', async () => {
		expect(firstStarPlayerSkill).toBeDefined();
		render(Page);

		const search = page.getByPlaceholder('Search skills...');
		await search.fill('zz-nomatch-987');
		for (const list of page.getByRole('list').elements()) {
			if (list.classList.contains('skill-list')) {
				expect(list.querySelectorAll('li')).toHaveLength(0);
			}
		}

		await search.fill('knocked down');
		await expect
			.element(page.getByRole('list', { name: 'General skills' }).getByRole('button', { name: 'Block', exact: true }))
			.toBeInTheDocument();

		const starSkills = page.getByRole('list', { name: 'Star Player skills' });
		const descriptionTerm = firstStarPlayerSkill!.description.split(' ').slice(1, 4).join(' ');
		await search.fill(descriptionTerm);
		await expect
			.element(starSkills.getByRole('button', { name: firstStarPlayerSkill!.name, exact: true }))
			.toBeInTheDocument();

		await search.fill(firstStarPlayerSkill!.starName);
		await expect
			.element(starSkills.getByRole('button', { name: firstStarPlayerSkill!.name, exact: true }))
			.toBeInTheDocument();
	});

	it('opens the skill details modal for Star Player special skills', async () => {
		expect(firstStarPlayerSkill).toBeDefined();
		render(Page);

		const starSkills = page.getByRole('list', { name: 'Star Player skills' });
		const skillToggle = starSkills.getByRole('button', {
			name: firstStarPlayerSkill!.name,
			exact: true
		});
		await skillToggle.click();
		const dialog = page.getByRole('dialog', { name: 'Skill details' });
		await expect.element(dialog).toBeInTheDocument();
		await expect.element(dialog.getByText(firstStarPlayerSkill!.name, { exact: true })).toBeInTheDocument();
		await expect.element(dialog.getByText('passive', { exact: true })).toBeInTheDocument();
		const modalDescription = dialog.element().querySelector('.skill-desc')?.textContent?.trim();
		expect(modalDescription).toBe(
			`${firstStarPlayerSkill!.starName}: ${firstStarPlayerSkill!.description}`
		);
	});

	it('fits three cards across the integrated-browser width and adapts on smaller screens', async () => {
		await page.viewport(320, 900);
		render(Page);

		const generalSkills = page.getByRole('list', { name: 'General skills' }).element();
		const cards = Array.from(generalSkills.querySelectorAll<HTMLElement>(':scope > li'));
		const cardButton = cards[0].querySelector('button')!;
		expect(getComputedStyle(generalSkills).display).toBe('grid');
		expect(getComputedStyle(cardButton).textAlign).toBe('center');
		expect(parseFloat(getComputedStyle(cardButton).minHeight)).toBeGreaterThanOrEqual(80);
		expect(getComputedStyle(generalSkills).gridTemplateColumns.split(' ')).toHaveLength(2);
		expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth + 1);

		await page.viewport(431, 900);
		const desktopRects = cards.slice(0, 3).map((card) => card.getBoundingClientRect());
		expect(getComputedStyle(generalSkills).gridTemplateColumns.split(' ')).toHaveLength(3);
		expect(desktopRects.every((rect) => Math.abs(rect.top - desktopRects[0].top) < 1)).toBe(true);
		expect(desktopRects[1].left).toBeGreaterThan(desktopRects[0].left);
		expect(desktopRects[2].left).toBeGreaterThan(desktopRects[1].left);
		expect(desktopRects.every((rect) => rect.width > 0)).toBe(true);
		expect(Math.max(...desktopRects.map((rect) => rect.width))).toBeLessThanOrEqual(130);
		expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth + 1);

		await page.viewport(800, 900);
		expect(getComputedStyle(generalSkills).gridTemplateColumns.split(' ')).toHaveLength(4);

		await page.viewport(1200, 900);
		expect(getComputedStyle(generalSkills).gridTemplateColumns.split(' ')).toHaveLength(5);
	});
});