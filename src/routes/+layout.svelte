<script module lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import TabBar from '$lib/components/TabBar.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<header>
	<TabBar />
</header>
<main class="min-h-screen">
	{@render children()}
</main>
