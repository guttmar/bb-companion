<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { base } from '$app/paths';
	import { pwaInfo } from 'virtual:pwa-info';
	import './layout.css';
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

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegistered(r) {
					console.log('SW Registered:', r);
				},
				onRegisterError(error) {
					console.log('SW registration error', error);
				}
			});
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={`${base}/favicon.ico`} sizes="48x48" />
	{#if pwaInfo?.webManifest?.linkTag}
		{@html pwaInfo.webManifest.linkTag}
	{/if}
</svelte:head>
<header>
	<TabBar />
</header>
<main class="min-h-screen bg-gray-50 dark:bg-gray-950">
	{@render children()}
</main>
