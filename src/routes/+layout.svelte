
<script lang="ts">
	import { browser } from '$app/environment';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import TabBar from '$lib/components/TabBar.svelte';
	import { settings } from '$lib/stores/settings';

	let { children } = $props();

	if (browser) {
		$effect(() => {
			const theme = $settings.theme;
			if (theme === 'dark') document.documentElement.classList.add('dark');
			else document.documentElement.classList.remove('dark');
		});
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<header>
	<TabBar />
</header>
<main class="min-h-screen bg-gray-50 dark:bg-gray-950">
	{@render children()}
</main>
