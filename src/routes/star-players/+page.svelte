<script lang="ts">
	import { getStarPlayers, type StarPlayer } from '$lib/data/stars';
	import { getTeams } from '$lib/data/teams';
	import type { Skill } from '$lib/data/skills/bb2025';
	import SkillDetailsModal from '$lib/components/SkillDetailsModal.svelte';
	import { formatCost, formatStat } from '$lib/tools/format';
	import { normalizeSkillName, resolveSkill } from '$lib/tools/skills';
	import { settings } from '$lib/stores/settings';
	import ChevronDownRegular from 'fluentui-icons-svelte/ChevronDownRegular.svelte';
	import ChevronRightRegular from 'fluentui-icons-svelte/ChevronRightRegular.svelte';

	let searchQuery = '';
	let expandedStarId: string | null = null;
	let openSkill: Skill | null = null;

	$: starPlayers = Object.values(getStarPlayers($settings.ruleset)).sort(
		(left, right) => left.cost - right.cost || left.name.localeCompare(right.name)
	);
	$: teams = Object.values(getTeams($settings.ruleset));
	$: teamsByStarId = Object.fromEntries(
		starPlayers.map((star) => [
			star.id,
			teams.filter((team) => team.starPlayers?.includes(star.id)).sort((left, right) =>
				left.name.localeCompare(right.name)
			)
		])
	);
	$: filteredStarPlayers = starPlayers.filter((star: StarPlayer) => {
		const searchableText = [
			star.name,
			...(teamsByStarId[star.id] ?? []).map((team) => team.name),
			...star.profiles.flatMap((profile) => [
				...profile.skills,
				...profile.specialSkills.flatMap((skill) => [skill.name, skill.description])
			])
		]
			.join(' ')
			.toLowerCase();

		return searchableText.includes(searchQuery.trim().toLowerCase());
	});

	function toggleStar(starId: string) {
		expandedStarId = expandedStarId === starId ? null : starId;
	}

	function showSkill(name: string) {
		const cleanedName = normalizeSkillName(name);
		const skill = resolveSkill(name);

		openSkill =
			skill ??
			({
				id: cleanedName,
				name: cleanedName,
				type: 'passive',
				description: 'No description available.'
			} as Skill);
	}

	function showSpecialSkill(name: string, description: string) {
		openSkill = { id: name, name, type: 'passive', description };
	}

	function closeSkill() {
		openSkill = null;
	}
</script>

<main class="mx-auto max-w-4xl px-4 py-6">
	<h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Star Players</h1>

	<input
		type="text"
		placeholder="Search star players..."
		aria-label="Search star players"
		class="mb-6 w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
		bind:value={searchQuery}
	/>

	<p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
		Showing {filteredStarPlayers.length} of {starPlayers.length} star players
	</p>

	{#if filteredStarPlayers.length}
		<ul class="space-y-4">
			{#each filteredStarPlayers as star (star.id)}
				<li
					class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
				>
					<div class="mb-3 flex flex-wrap items-center justify-between gap-2">
						<button
							type="button"
							class="flex items-center gap-2 text-left text-lg font-semibold text-gray-900 dark:text-white"
							on:click={() => toggleStar(star.id)}
							aria-expanded={expandedStarId === star.id}
						>
							{#if expandedStarId === star.id}
								<ChevronDownRegular />
							{:else}
								<ChevronRightRegular />
							{/if}
							<span>{star.name}</span>
						</button>
						<span
							class="rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
						>
							{formatCost(star.cost)}
						</span>
					</div>

					{#if expandedStarId === star.id}
						<div class="mb-4 border-b border-gray-200 pb-3 dark:border-gray-700">
							<h3 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Available to teams</h3>
							{#if teamsByStarId[star.id]?.length}
								<ul class="grid gap-1 text-sm text-gray-600 sm:grid-cols-2 dark:text-gray-400">
									{#each teamsByStarId[star.id] as team (team.id)}
										<li>{team.name}</li>
									{/each}
								</ul>
							{:else}
								<p class="text-sm text-gray-600 dark:text-gray-400">No team affiliations found.</p>
							{/if}
						</div>
					{/if}

					{#each star.profiles as profile}
						<div class="star-profile">
							{#if profile.name !== star.name}
								<h3 class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{profile.name}</h3>
							{/if}
							<div class="mb-3 flex flex-wrap gap-2">
								<span class="star-stat">MA {profile.displayStats.ma}</span>
								<span class="star-stat">ST {profile.displayStats.st}</span>
								<span class="star-stat">AG {profile.displayStats.ag}</span>
								<span class="star-stat">PA {profile.displayStats.pa ?? formatStat(profile.pa, '+')}</span>
								<span class="star-stat">AV {profile.displayStats.av}</span>
							</div>
							<div class="flex flex-wrap gap-2">
								{#each profile.skills as skill}
									<button type="button" class="skill-tag" on:click={() => showSkill(skill)}>{skill}</button>
								{/each}
								{#each profile.specialSkills as specialSkill}
									<button type="button" class="skill-tag" on:click={() => showSpecialSkill(specialSkill.name, specialSkill.description)}>{specialSkill.name}</button>
								{/each}
							</div>
						</div>
					{/each}
				</li>
			{/each}
		</ul>
	{:else}
		<p class="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
			No star players match your search.
		</p>
	{/if}
</main>

<SkillDetailsModal skill={openSkill} on:close={closeSkill} />

<style>
	.star-profile + .star-profile {
		margin-top: 1rem;
		border-top: 1px solid rgb(229 231 235);
		padding-top: 1rem;
	}

	:global(.dark) .star-profile + .star-profile {
		border-color: rgb(55 65 81);
	}

	.star-stat,
	.skill-tag {
		display: inline-flex;
		align-items: center;
		border-radius: 9999px;
		padding: 0.25rem 0.625rem;
		font-size: 0.75rem;
		line-height: 1rem;
	}

	.star-stat {
		border: 1px solid rgb(147 197 253);
		background: rgb(219 234 254);
		color: rgb(23 37 84);
		font-variant-numeric: tabular-nums;
	}

	.skill-tag {
		border: 0;
		background: rgb(243 244 246);
		color: rgb(31 41 55);
		cursor: pointer;
	}

	:global(.dark) .star-stat {
		border-color: rgb(30 58 138);
		background: rgb(23 37 84);
		color: white;
	}

	:global(.dark) .skill-tag {
		background: rgb(55 65 81);
		color: rgb(229 231 235);
	}
</style>