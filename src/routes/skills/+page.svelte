<script lang="ts">
	import { base } from '$app/paths';
	import { settings } from '$lib/stores/settings';
	import { bb2025Skills } from '$lib/data/skills/bb2025';
	import { writable } from 'svelte/store';
	import ChevronDownRegular from 'fluentui-icons-svelte/ChevronDownRegular.svelte';
	import ChevronRightRegular from 'fluentui-icons-svelte/ChevronRightRegular.svelte';

	const searchQuery = writable('');
	const expandedCategories = writable(new Set(bb2025Skills.map((category) => category.name)));

	function toggleCategory(categoryName: string) {
		expandedCategories.update((expanded) => {
			const newExpanded = new Set(expanded);
			if (newExpanded.has(categoryName)) {
				newExpanded.delete(categoryName);
			} else {
				newExpanded.add(categoryName);
			}
			return newExpanded;
		});
	}
</script>

<main class="mx-auto max-w-4xl px-4 py-6">
	<h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Skills</h1>

	{#if $settings.ruleset === '2025'}
		<input
			type="text"
			placeholder="Search skills..."
			class="mb-6 w-full rounded-md border border-gray-300 p-2"
			bind:value={$searchQuery}
		/>

		<div class="space-y-10">
			{#each bb2025Skills as category}
				<section>
					<button
						type="button"
						class="mb-4 flex w-full items-center border-b border-gray-200 pb-2 text-left text-xl font-semibold text-gray-900 dark:border-gray-700 dark:text-white"
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
						<ul class="space-y-4">
							{#each category.skills.filter((skill) => skill.name
									.toLowerCase()
									.includes($searchQuery.toLowerCase())) as skill (skill.id)}
								<li
									class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
								>
									<div class="mb-2 flex flex-wrap items-center gap-2">
										<span class="font-medium text-gray-900 dark:text-white">{skill.name}</span>
										<span
											class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {skill.type ===
											'active'
												? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
												: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}"
										>
											{skill.type}
										</span>
										{#if skill.elite}
											<span
												class="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
											>
												Elite
											</span>
										{/if}
									</div>
									<p
										class="skill-description text-sm leading-relaxed text-gray-600 dark:text-gray-400"
									>
										{skill.description}
									</p>
								</li>
							{/each}
						</ul>
					{/if}
				</section>
			{/each}
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

<style>
	.skill-description {
		white-space: pre-line;
	}
</style>
