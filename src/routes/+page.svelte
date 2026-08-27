<script lang="ts">
	import { base } from '$app/paths';
	import PeopleTeamRegular from 'fluentui-icons-svelte/PeopleTeamRegular.svelte';
	import FolderRegular from 'fluentui-icons-svelte/FolderRegular.svelte';
	import BookRegular from 'fluentui-icons-svelte/BookRegular.svelte';
	import SettingsRegular from 'fluentui-icons-svelte/SettingsRegular.svelte';

	const actions = [
		{ href: '/roster', label: 'Roster', icon: PeopleTeamRegular },
		{ href: '/saved-teams', label: 'Saved teams', icon: FolderRegular },
		{ href: '/skills', label: 'Skills', icon: BookRegular },
		{ href: '/settings', label: 'Settings', icon: SettingsRegular }
	];
</script>

<section class="mx-auto max-w-4xl px-4 py-10 sm:py-16" aria-labelledby="welcome-title">
	<h1 id="welcome-title" class="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
		Blood Bowl Companion
	</h1>

	<nav class="grid grid-cols-2 gap-4 sm:grid-cols-4" aria-label="Quick access">
		{#each actions as action}
			<a
				href={base + action.href}
				class="flex min-h-40 flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 bg-white p-5 text-center text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-800 dark:focus:ring-offset-gray-950"
			>
				<svelte:component this={action.icon} width={40} height={40} aria-hidden="true" />
				<span class="text-lg font-semibold">{action.label}</span>
			</a>
		{/each}
	</nav>
</section>
