<script lang="ts">
	import { page } from '$app/stores';
	import HomeRegular from 'fluentui-icons-svelte/HomeRegular.svelte';
	import HomeFilled from 'fluentui-icons-svelte/HomeFilled.svelte';
	import PeopleTeamRegular from 'fluentui-icons-svelte/PeopleTeamRegular.svelte';
	import PeopleTeamFilled from 'fluentui-icons-svelte/PeopleTeamFilled.svelte';
	import BookRegular from 'fluentui-icons-svelte/BookRegular.svelte';
	import BookFilled from 'fluentui-icons-svelte/BookFilled.svelte';
	import SettingsRegular from 'fluentui-icons-svelte/SettingsRegular.svelte';
	import SettingsFilled from 'fluentui-icons-svelte/SettingsFilled.svelte';

	const tabs = [
		{ href: '/', label: 'Home', iconRegular: HomeRegular, iconFilled: HomeFilled },
		{ href: '/roster', label: 'Roster', iconRegular: PeopleTeamRegular, iconFilled: PeopleTeamFilled },
		{ href: '/skills', label: 'Skills', iconRegular: BookRegular, iconFilled: BookFilled },
		{ href: '/settings', label: 'Settings', iconRegular: SettingsRegular, iconFilled: SettingsFilled }
	];

	const ICON_SIZE = 24;
</script>

<nav class="flex items-center justify-center gap-1 border-b border-gray-200 bg-white px-2 py-2 shadow-sm" aria-label="Main navigation">
	{#each tabs as tab}
		{@const active = $page.url.pathname === tab.href}
		<a
			href={tab.href}
			aria-label={tab.label}
			aria-current={active ? 'page' : undefined}
			class="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-colors {active
				? 'bg-gray-100 text-gray-900'
				: 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'}"
		>
			{#if active}
				<svelte:component this={tab.iconFilled} width={ICON_SIZE} height={ICON_SIZE} />
			{:else}
				<svelte:component this={tab.iconRegular} width={ICON_SIZE} height={ICON_SIZE} />
			{/if}
		</a>
	{/each}
</nav>
