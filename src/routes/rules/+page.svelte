<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { bb2025RuleChapters, searchRuleSections } from '$lib/data/rules/bb2025';

	let searchQuery = '';
	let expandedChapterIds = new Set(bb2025RuleChapters.map((chapter) => chapter.id));

	$: results = searchRuleSections(searchQuery);
	$: visibleSections = searchQuery.trim() ? results : bb2025RuleChapters.flatMap((chapter) => chapter.sections);
	$: selectedSectionId = $page.url.hash.slice(1);

	function toggleChapter(chapterId: string) {
		const next = new Set(expandedChapterIds);
		if (next.has(chapterId)) next.delete(chapterId);
		else next.add(chapterId);
		expandedChapterIds = next;
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

<main class="mx-auto max-w-5xl px-4 py-6 sm:py-10">
	<header class="mb-8">
		<p class="mb-2 text-sm font-semibold tracking-wide text-blue-700 uppercase dark:text-blue-300">BB2025 · Rules Snapshot</p>
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Rules Reference</h1>
		<p class="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">Search the reviewed local reference by chapter, section, or rule language.</p>
		<label class="mt-5 block" for="rule-search">
			<span class="sr-only">Search rules</span>
			<input id="rule-search" type="search" placeholder="Search rules..." bind:value={searchQuery} class="w-full rounded-md border border-gray-300 bg-white p-3 text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100" />
		</label>
		<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{visibleSections.length} {visibleSections.length === 1 ? 'section' : 'sections'} found</p>
	</header>

	<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
		<aside aria-label="Rules contents" class="lg:sticky lg:top-4 lg:self-start">
			<h2 class="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Contents</h2>
			<nav class="space-y-2">
				{#each bb2025RuleChapters as chapter (chapter.id)}
					<div class="rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
						<button type="button" class="flex w-full items-start justify-between gap-3 p-3 text-left font-medium text-gray-900 dark:text-white" aria-expanded={expandedChapterIds.has(chapter.id)} on:click={() => toggleChapter(chapter.id)}>
											<span>{@html highlighted(chapter.title)}</span><span aria-hidden="true">{expandedChapterIds.has(chapter.id) ? '−' : '+'}</span>
						</button>
						{#if expandedChapterIds.has(chapter.id)}
							<ul class="border-t border-gray-200 px-3 py-2 dark:border-gray-700">
								{#each chapter.sections as ruleSection (ruleSection.id)}
															<li><a class="block py-1 text-sm text-gray-600 hover:text-blue-700 dark:text-gray-300 dark:hover:text-blue-300" href={`${base}/rules#${ruleSection.id}`}>{@html highlighted(ruleSection.title)}</a></li>
								{/each}
							</ul>
						{/if}
					</div>
				{/each}
			</nav>
		</aside>

		<section aria-label="Rule sections" class="space-y-6">
			{#each bb2025RuleChapters as chapter (chapter.id)}
				{#if visibleSections.some((ruleSection) => ruleSection.chapterId === chapter.id)}
					<div>
						<h2 class="mb-2 border-b border-gray-300 pb-2 text-2xl font-bold text-gray-900 dark:border-gray-700 dark:text-white">{@html highlighted(chapter.title)}</h2>
						<p class="mb-4 text-sm text-gray-600 dark:text-gray-400">{@html highlighted(chapter.description)}</p>
						<div class="space-y-4">
							{#each chapter.sections.filter((ruleSection) => visibleSections.includes(ruleSection)) as ruleSection (ruleSection.id)}
								<article id={ruleSection.id} class="scroll-mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900" class:ring-2={selectedSectionId === ruleSection.id} class:ring-blue-500={selectedSectionId === ruleSection.id}>
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
	</div>
</main>