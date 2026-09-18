<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { bb2025RuleChapters, searchRuleSections } from '$lib/data/rules/bb2025';
	import PanelLeftRegular from 'fluentui-icons-svelte/PanelLeftRegular.svelte';
	import DismissRegular from 'fluentui-icons-svelte/DismissRegular.svelte';

	let searchQuery = '';
	let contentsOpen = false;
	let selectedChapterId = bb2025RuleChapters[0]?.id ?? '';

	$: results = searchRuleSections(searchQuery);
	$: visibleSections = searchQuery.trim() ? results : bb2025RuleChapters.flatMap((chapter) => chapter.sections);
	$: selectedSectionId = $page.url.hash.slice(1);
	$: selectedChapter = bb2025RuleChapters.find((chapter) => chapter.id === selectedChapterId) ?? bb2025RuleChapters[0];
	$: selectedChapterSections = selectedChapter?.sections.filter((ruleSection) => visibleSections.includes(ruleSection)) ?? [];

	function selectChapter(chapterId: string) {
		selectedChapterId = chapterId;
	}

	function closeContents() {
		contentsOpen = false;
	}

	function escapeHtml(value: string): string {
		return value.replace(/[&<>'"]/g, (character) => ({
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			"'": '&#39;',
			'"': '&quot;'
		})[character] ?? character);
	}

	function highlighted(value: string | null | undefined): string {
		if (!value) return '';
		const query = searchQuery.trim();
		if (!query) return escapeHtml(value);

		const matcher = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
		let output = '';
		let lastIndex = 0;
		for (const match of value.matchAll(matcher)) {
			const index = match.index ?? 0;
			output += escapeHtml(value.slice(lastIndex, index));
			output += `<mark class="rounded bg-yellow-200 px-0.5 text-inherit dark:bg-yellow-700">${escapeHtml(match[0])}</mark>`;
			lastIndex = index + match[0].length;
		}
		return output + escapeHtml(value.slice(lastIndex));
	}

</script>

<svelte:head>
	<title>Rules Reference | Blood Bowl Companion</title>
	<meta name="description" content="Searchable BB2025 Rules Reference" />
</svelte:head>


<div class="sticky top-[60px] z-30 border-b border-gray-200 bg-gray-50/95 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-950/95">
	<div class="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2">
		<button
			type="button"
			class="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
			aria-label={contentsOpen ? 'Close rules contents' : 'Open rules contents'}
			aria-expanded={contentsOpen}
			on:click={() => (contentsOpen = !contentsOpen)}
		>
			{#if contentsOpen}
				<DismissRegular width={24} height={24} />
			{:else}
				<PanelLeftRegular width={24} height={24} />
			{/if}
		</button>
		<label class="min-w-0 flex-1" for="rule-search">
			<span class="sr-only">Search rules</span>
			<input id="rule-search" type="search" placeholder="Search rules..." bind:value={searchQuery} class="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100" />
		</label>
	</div>
</div>

{#if contentsOpen}
	<div class="fixed inset-x-0 bottom-0 top-[120px] z-20 bg-black/30" role="presentation" on:click={closeContents}></div>
	<aside aria-label="Rules contents" class="fixed bottom-0 left-0 top-[120px] z-30 w-[min(24rem,90vw)] overflow-y-auto border-r border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white">Contents</h2>
			<button type="button" class="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800" aria-label="Close rules contents" on:click={closeContents}>
				<DismissRegular width={20} height={20} />
			</button>
		</div>
		<div class="grid min-h-0 grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)] gap-3">
			<nav aria-label="Rule chapters" class="space-y-1 border-r border-gray-200 pr-3 dark:border-gray-700">
				{#each bb2025RuleChapters as chapter (chapter.id)}
					<button
						type="button"
						class="flex w-full items-start justify-between gap-2 rounded-md p-2 text-left text-sm font-medium {selectedChapterId === chapter.id
							? 'bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-100'
							: 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'}"
						aria-current={selectedChapterId === chapter.id ? 'true' : undefined}
						on:click={() => selectChapter(chapter.id)}
					>
						<span>{@html highlighted(chapter.title)}</span>
						<span aria-hidden="true">›</span>
					</button>
				{/each}
			</nav>

			<section aria-label="Rule sections" class="min-w-0">
				<h3 class="mb-2 text-sm font-semibold text-gray-900 dark:text-white">{selectedChapter?.title}</h3>
				{#if selectedChapterSections.length}
					<ul class="space-y-1">
						{#each selectedChapterSections as ruleSection (ruleSection.id)}
							<li><a class="block rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-300" href={`${base}/rules#${ruleSection.id}`} on:click={closeContents}>{@html highlighted(ruleSection.title)}</a></li>
						{/each}
					</ul>
				{:else}
					<p class="text-sm text-gray-500 dark:text-gray-400">No matching sections.</p>
				{/if}
			</section>
		</div>
	</aside>
{/if}

<main class="mx-auto max-w-5xl px-4 py-6 sm:py-10">
	<header class="mb-8">
		<p class="mb-2 text-sm font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-300">BB2025 · Rules Snapshot</p>
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Rules Reference</h1>
		<p class="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">Search the reviewed local reference by chapter, section, or rule language.</p>
		<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{visibleSections.length} {visibleSections.length === 1 ? 'section' : 'sections'} found</p>
	</header>

	<section aria-label="Rule sections" class="space-y-6">
			{#each bb2025RuleChapters as chapter (chapter.id)}
				{#if visibleSections.some((ruleSection) => ruleSection.chapterId === chapter.id)}
					<div>
						<h2 class="mb-2 border-b border-gray-300 pb-2 text-2xl font-bold text-gray-900 dark:border-gray-700 dark:text-white">{@html highlighted(chapter.title)}</h2>
						<p class="mb-4 text-sm text-gray-600 dark:text-gray-400">{@html highlighted(chapter.description)}</p>
						<div class="space-y-4">
							{#each chapter.sections.filter((ruleSection) => visibleSections.includes(ruleSection)) as ruleSection (ruleSection.id)}
								<article id={ruleSection.id} class="scroll-mt-32 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900" class:ring-2={selectedSectionId === ruleSection.id} class:ring-blue-500={selectedSectionId === ruleSection.id}>
									<h3 class="text-xl font-semibold text-gray-900 dark:text-white">{@html highlighted(ruleSection.title)}</h3>
									<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">{@html highlighted(ruleSection.summary)}</p>
									<div class="mt-4 space-y-3 text-gray-800 dark:text-gray-200">
										{#each ruleSection.body as block}
											{#if block.type === 'paragraph' || block.type === 'quote'}
													<p class:italic={block.type === 'quote'}>{@html highlighted(block.value)}</p>
											{:else if block.type === 'list'}
													<ul class="list-disc space-y-1 pl-5">{#each block.value as item}<li>{@html highlighted(item)}</li>{/each}</ul>
											{:else if block.type === 'table'}
													<div class="overflow-x-auto"><table class="w-full text-left text-sm"><caption class="mb-2 text-left text-sm font-medium">{@html highlighted(block.value.caption)}</caption><thead><tr>{#each block.value.headers as header}<th class="border-b border-gray-200 px-2 py-2 dark:border-gray-700">{@html highlighted(header)}</th>{/each}</tr></thead><tbody>{#each block.value.rows as row}<tr>{#each row as cell}<td class="border-b border-gray-100 px-2 py-2 dark:border-gray-800">{@html highlighted(cell)}</td>{/each}</tr>{/each}</tbody></table></div>
											{:else if block.type === 'figure'}
													<figure><img src={block.value.mediaRef} alt={block.value.altText} class="max-h-96 max-w-full object-contain" />{#if block.value.caption}<figcaption class="mt-2 text-sm text-gray-600 dark:text-gray-400">{@html highlighted(block.value.caption)}</figcaption>{/if}</figure>
											{/if}
										{/each}
									</div>
									<div class="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
										<span>Snapshot: {ruleSection.snapshotId}</span><span>Status: {ruleSection.review.status}</span><a class="underline hover:no-underline" href={ruleSection.source.url} rel="noreferrer">Source</a>
									</div>
									{#if ruleSection.relatedSkillIds?.length}
										<p class="mt-3 text-sm text-gray-600 dark:text-gray-300">Related specialist material: <a class="font-medium underline" href={`${base}/skills`}>Skills reference</a></p>
									{/if}
								</article>
							{/each}
						</div>
					</div>
				{/if}
			{/each}
	</section>
</main>