<script lang="ts">
	import { base } from '$app/paths';
	import { settings } from '$lib/stores/settings';
	import { bb2025Skills } from '$lib/data/skills/bb2025';
	import { getStarPlayers } from '$lib/data/stars';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import { writable } from 'svelte/store';
	import type { Skill } from '$lib/data/skills/bb2025';
	import SkillDetailsModal from '$lib/components/SkillDetailsModal.svelte';
	import ChevronDownRegular from 'fluentui-icons-svelte/ChevronDownRegular.svelte';
	import ChevronRightRegular from 'fluentui-icons-svelte/ChevronRightRegular.svelte';

	const searchQuery = writable('');
	const expandedCategories = writable(new SvelteSet([...bb2025Skills.map((category) => category.name), 'Star Player']));
	let openSkill: Skill | null = null;
	let searchTerm = '';

	$: starPlayerSkills = (() => {
		const skills = new SvelteMap<
			string,
			{ id: string; name: string; starNames: string[]; type: 'passive'; description: string }
		>();

		for (const star of Object.values(getStarPlayers($settings.ruleset))) {
			for (const profile of star.profiles) {
				for (const specialSkill of profile.specialSkills) {
					const key = specialSkill.name.trim().toLowerCase();
					const existing = skills.get(key);
					if (existing) {
						if (!existing.starNames.includes(star.name)) existing.starNames.push(star.name);
						continue;
					}

					skills.set(key, {
						id: `star-${key.replace(/[^a-z0-9]+/g, '-')}`,
						name: specialSkill.name,
						starNames: [star.name],
						type: 'passive',
						description: specialSkill.description
					});
				}
			}
		}

		return [...skills.values()];
	})();

	$: searchTerm = $searchQuery.trim().toLowerCase();
	$: filteredSkillsByCategory = bb2025Skills.map((category) => ({
		...category,
		skills: category.skills.filter((skill) =>
			matchesSearch([skill.name, skill.description], searchTerm)
		)
	}));
	$: filteredStarPlayerSkills = starPlayerSkills.filter((skill) =>
		matchesSearch([skill.name, skill.description, ...skill.starNames], searchTerm)
	);

	function toggleCategory(categoryName: string) {
		expandedCategories.update((expanded) => {
			const newExpanded = new SvelteSet(expanded);
			if (newExpanded.has(categoryName)) {
				newExpanded.delete(categoryName);
			} else {
				newExpanded.add(categoryName);
			}
			return newExpanded;
		});
	}

	function showSkill(skill: Skill) {
		openSkill = skill;
	}

	function showStarPlayerSkill(skill: (typeof starPlayerSkills)[number]) {
		openSkill = {
			...skill,
			description: `${skill.starNames.join(', ')}: ${skill.description}`
		};
	}

	function closeSkill() {
		openSkill = null;
	}

	function matchesSearch(values: string[], query: string): boolean {
		return values.some((value) => value.toLowerCase().includes(query));
	}
</script>

<main class="mx-auto max-w-4xl px-4 py-6">
	{#if $settings.ruleset === '2025'}
		<input
			type="text"
			placeholder="Search skills..."
			class="mb-6 w-full rounded-md border border-gray-300 p-2"
			bind:value={$searchQuery}
		/>

		<div class="space-y-10">
			{#each filteredSkillsByCategory as category (category.id)}
				<section>
					<button
						type="button"
						class="mb-4 flex w-full items-center border-b border-gray-200 pb-2 text-left text-xl font-semibold text-gray-900 dark:border-gray-700 dark:text-white"
						aria-expanded={$expandedCategories.has(category.name)}
						on:click={() => toggleCategory(category.name)}
					>
						{#if $expandedCategories.has(category.name)}
							<ChevronDownRegular class="mr-2" />
						{:else}
							<ChevronRightRegular class="mr-2" />
						{/if}
						{category.name}
					</button>
					{#if $expandedCategories.has(category.name)}
						<ul id={`skills-${category.id}`} aria-label={`${category.name} skills`} class="skill-list">
							{#each category.skills as skill (skill.id)}
								<li
									class="skill-card rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
								>
									<button
										type="button"
										class="skill-button cursor-pointer rounded-lg bg-transparent font-medium text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-white dark:hover:bg-gray-800"
										on:click={() => showSkill(skill)}
									>
										<span class="min-w-0 break-words">{skill.name}</span>
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</section>
			{/each}

			<section>
				<button
					type="button"
					class="mb-4 flex w-full items-center border-b border-gray-200 pb-2 text-left text-xl font-semibold text-gray-900 dark:border-gray-700 dark:text-white"
					aria-expanded={$expandedCategories.has('Star Player')}
					on:click={() => toggleCategory('Star Player')}
				>
					{#if $expandedCategories.has('Star Player')}
						<ChevronDownRegular class="mr-2" />
					{:else}
						<ChevronRightRegular class="mr-2" />
					{/if}
					Star Player
				</button>
				{#if $expandedCategories.has('Star Player')}
					<ul id="skills-star-player" aria-label="Star Player skills" class="skill-list">
						{#each filteredStarPlayerSkills as skill (skill.id)}
							<li
								class="skill-card rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
							>
								<button
									type="button"
									class="skill-button cursor-pointer rounded-lg bg-transparent font-medium text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-white dark:hover:bg-gray-800"
									on:click={() => showStarPlayerSkill(skill)}
								>
									<span class="min-w-0 break-words">{skill.name}</span>
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		</div>
	{:else}
		<div
			class="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/30"
		>
			<p class="text-amber-800 dark:text-amber-200">
				Skills reference is only available for Blood Bowl 2025. Switch to the 2025 ruleset in
				<a href="{base}/settings" class="font-medium underline hover:no-underline">Settings</a>
				to view the skills list.
			</p>
		</div>
	{/if}
</main>

<SkillDetailsModal skill={openSkill} on:close={closeSkill} />

<style>
	.skill-list {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		align-items: start;
		gap: 1rem;
	}

	.skill-card {
		min-width: 0;
		width: 100%;
	}

	.skill-button {
		display: flex;
		min-height: 5rem;
		width: 100%;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		text-align: center;
	}

	.skill-button span {
		overflow-wrap: anywhere;
	}

	@media (max-width: 380px) {
		.skill-list {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 640px) {
		.skill-list {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (min-width: 1024px) {
		.skill-list {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}
	}
</style>
