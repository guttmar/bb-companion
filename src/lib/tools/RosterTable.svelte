<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import { selectedTeam, currentRoster } from '$lib/stores/roster';
	import { bb2025Skills, type Skill } from '$lib/data/skills/bb2025';
	import DismissRegular from 'fluentui-icons-svelte/DismissRegular.svelte';
	import { formatCost, formatStat } from '$lib/tools/format';

	let openSkill: Skill | null = null;
	type ExpandableGroup = 'primary' | 'secondary' | 'skills';
	let expandedGroups = new SvelteSet<string>();

	function isGroupExpanded(playerId: string, group: ExpandableGroup): boolean {
		return expandedGroups.has(`${playerId}:${group}`);
	}

	function toggleGroup(playerId: string, group: ExpandableGroup) {
		const key = `${playerId}:${group}`;
		if (expandedGroups.has(key)) {
			expandedGroups.delete(key);
		} else {
			expandedGroups.add(key);
		}
	}

	function resolveSkill(name: string): Skill | null {
		const n = (name ?? '').toLowerCase();
		for (const cat of bb2025Skills) {
			for (const s of cat.skills) {
				if ((s.name && s.name.toLowerCase() === n) || (s.id && s.id.toLowerCase() === n))
					return s as Skill;
			}
		}
		return null;
	}

	function showSkill(name: string) {
		const cleanedName = name.replace(/\s*\([^)]*\)\s*/g, '').trim();
		openSkill =
			resolveSkill(cleanedName) ??
			({
				id: cleanedName,
				name: cleanedName,
				type: 'passive',
				description: 'No description available.'
			} as Skill);
	}

	function closeSkill() {
		openSkill = null;
	}

	function getInlineItems(primaryItems: string[], secondaryItems: string[], skillItems: string[]) {
		const primaryValue = primaryItems.filter(Boolean).join('');
		const secondaryValue = secondaryItems.filter(Boolean).join('');

		return [
			...(primaryValue ? [{ kind: 'primary', value: primaryValue }] : []),
			...(secondaryValue ? [{ kind: 'secondary', value: secondaryValue }] : []),
			...skillItems.map((skill) => ({ kind: 'skill', value: skill }))
		];
	}
</script>

<ul class="roster-list" aria-label="Available players">
	{#each $selectedTeam?.players ?? [] as p (p.id)}
		{@const primaryItems = p.primary ?? []}
		{@const primaryExpanded = isGroupExpanded(p.id, 'primary')}
		{@const secondaryItems = p.secondary ?? []}
		{@const secondaryExpanded = isGroupExpanded(p.id, 'secondary')}
		{@const skillItems = p.skills ?? []}
		{@const skillsExpanded = isGroupExpanded(p.id, 'skills')}
		{@const inlineItems = getInlineItems(primaryItems, secondaryItems, skillItems)}
		<li class="roster-card">
			<div class="player-identity">
				<div class="player-name">{p.name}</div>
				<div class="player-count" aria-label={`${p.name} roster count`}>
					<button
						aria-label={`Decrease ${p.name} count`}
						on:click={() =>
							currentRoster.update((r) => {
								r.players[p.id] = r.players[p.id] ?? 0;
								if (r.players[p.id] == 0) {
									return r;
								}

								r.players[p.id]--;
								return r;
							})}
						disabled={($currentRoster.players[p.id] ?? 0) == 0}>−</button
					>
					<span class="count-value" aria-label={`${$currentRoster.players[p.id] ?? 0} of ${p.max}`}>
						<span class="count-current">{$currentRoster.players[p.id] ?? 0}</span>
						<span class="count-divider" aria-hidden="true"></span>
						<span class="count-max">{p.max}</span>
					</span>
					<button
						aria-label={`Increase ${p.name} count`}
						on:click={() =>
							currentRoster.update((r) => {
								r.players[p.id] = r.players[p.id] ?? 0;
								r.players[p.id]++;
								return r;
							})}>+</button
					>
				</div>
				{#if p.tags?.length}
					<div class="player-tags">
						{#each p.tags as tag, index (index)}
							<div>{tag}</div>
						{/each}
					</div>
				{/if}
			</div>

			<div class="player-information">
				<dl class="player-stat-band" aria-label={`${p.name} cost and stats`}>
					<div>
						<dt>MA</dt>
						<dd>{p.ma}</dd>
					</div>
					<div>
						<dt>ST</dt>
						<dd>{p.st}</dd>
					</div>
					<div>
						<dt>AG</dt>
						<dd>{formatStat(p.ag, '+')}</dd>
					</div>
					<div>
						<dt>PA</dt>
						<dd>{formatStat(p.pa, '+')}</dd>
					</div>
					<div>
						<dt>AV</dt>
						<dd>{formatStat(p.av, '+')}</dd>
					</div>
					<div class="cost-badge" aria-label={`Cost ${formatCost(p.cost)}`}>
						<dd>{formatCost(p.cost)}</dd>
					</div>
				</dl>

				<div class="player-groups">
					<div class="player-group">
						{#if inlineItems.length}
							{#each inlineItems as item, index (item.kind + item.value + index)}
								{#if item.kind === 'skill'}
									<button class="skill-btn" on:click={() => showSkill(item.value)}>
										{item.value}
									</button>
								{:else}
									<span class={`item-pill ${item.kind}-pill`}>
										{item.kind === 'primary' ? 'Pri' : 'Sec'} {item.value}
									</span>
								{/if}
							{/each}
						{:else}
							<span>—</span>
						{/if}
					</div>
				</div>
			</div>
		</li>
	{/each}
</ul>

{#if openSkill}
	<div
		class="modal-overlay"
		role="presentation"
		tabindex="-1"
		on:click={(event) => event.target === event.currentTarget && closeSkill()}
		on:keydown={(event) => event.key === 'Escape' && closeSkill()}
	>
		<div class="modal" role="dialog" aria-modal="true" aria-label="Skill details">
			<div class="skill-card">
				<div class="skill-header">
					<div>
						<strong class="text-gray-900 dark:text-white">{openSkill.name}</strong>
						<span class="badge">{openSkill.type}</span>
						{#if openSkill.elite}
							<span class="elite">Elite</span>
						{/if}
					</div>
					<div>
						<button class="close-icon" on:click={closeSkill} aria-label="Close">
							<DismissRegular />
						</button>
					</div>
				</div>
				<div class="skill-desc">{openSkill.description}</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.roster-list {
		width: 100%;
		margin: 0.5rem 0;
		padding: 0;
		list-style: none;
	}

	.roster-card {
		display: grid;
		grid-template-columns: minmax(7.25rem, 0.8fr) minmax(0, 2fr);
		margin-bottom: 0.75rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.75rem;
		background: #fff;
		box-shadow: 0 1px 2px rgb(15 23 42 / 0.08);
		color: #1f2937;
	}

	:global(.dark) .roster-card {
		border-color: #374151;
		background: #111827;
		color: #e5e7eb;
		box-shadow: 0 1px 2px rgb(0 0 0 / 0.25);
	}

	.player-identity {
		container-name: player-identity;
		container-type: inline-size;
		grid-row: 1;
		min-width: 0;
		padding: 0.75rem 0.125rem 0.75rem 0.5rem;
		border-right: 1px solid #e5e7eb;
		border-radius: 0.7rem 0 0 0.7rem;
		background: #f9fafb;
	}

	:global(.dark) .player-identity {
		border-color: #374151;
		background: #1f2937;
	}

	.player-name {
		overflow-wrap: anywhere;
		font-weight: 600;
		line-height: 1.3;
	}

	.player-count {
		display: grid;
		grid-template-columns: 2.75rem minmax(0, 1fr) 2.75rem;
		align-items: center;
		min-width: 0;
		margin-top: 0.6rem;
	}

	.player-count > .count-value {
		display: grid;
		grid-column: 2;
		grid-row: 1;
		grid-template-columns: minmax(0, 1fr) 1px;
		grid-template-rows: repeat(2, auto);
		align-items: center;
		justify-items: center;
		min-width: 0;
		text-align: center;
		font-size: 0.75rem;
		line-height: 1;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.player-count .count-current {
		grid-column: 1;
		grid-row: 1;
	}

	.player-count .count-max {
		grid-column: 1;
		grid-row: 2;
	}

	.player-count .count-divider {
		grid-column: 2;
		grid-row: 1 / span 2;
		width: 1px;
		height: 1.75rem;
		background: #9ca3af;
	}

	:global(.dark) .player-count .count-divider {
		background: #6b7280;
	}

	.player-count button:first-child {
		grid-column: 1;
		grid-row: 1;
	}

	.player-count button:last-child {
		grid-column: 3;
		grid-row: 1;
	}

	.player-count button {
		min-width: 2.75rem;
		min-height: 2.75rem;
		padding: 0.4rem;
		border: 0;
		border-radius: 0.5rem;
		background: #15803d;
		color: #fff;
		font-size: 1.25rem;
		line-height: 1;
		cursor: pointer;
	}

	.player-count button:hover:not(:disabled) {
		background: #166534;
	}

	.player-count button:disabled {
		background: #e5e7eb;
		color: #4b5563;
		cursor: not-allowed;
	}

	:global(.dark) .player-count button {
		background: #15803d;
		color: #fff;
	}

	:global(.dark) .player-count button:hover:not(:disabled) {
		background: #166534;
	}

	:global(.dark) .player-count button:disabled {
		background: #4b5563;
		color: #e5e7eb;
	}

	.player-count button:focus-visible,
	.skill-btn:focus-visible,
	.group-toggle:focus-visible,
	.close-icon:focus-visible {
		outline: 3px solid #2563eb;
		outline-offset: 2px;
	}

	.player-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-top: 0.6rem;
	}

	.player-tags > div {
		max-width: 100%;
		padding: 0.15rem 0.45rem;
		border: 1px solid #e5e7eb;
		border-radius: 9999px;
		background: #f3f4f6;
		color: #374151;
		font-size: 0.7rem;
		line-height: 1.15;
		overflow-wrap: anywhere;
	}

	:global(.dark) .player-tags > div {
		border-color: #4b5563;
		background: #374151;
		color: #e5e7eb;
	}

	.player-information {
		display: grid;
		grid-column: 2;
		grid-row: 1;
		grid-template-rows: auto 1fr;
		min-width: 0;
	}

	.player-stat-band {
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		gap: 0.4rem;
		min-width: 0;
		margin: 0;
		padding: 0.75rem;
		border-bottom: 1px solid #e5e7eb;
	}

	:global(.dark) .player-stat-band {
		border-color: #374151;
	}

	.player-stat-band > div {
		display: inline-flex;
		align-items: baseline;
		gap: 0.25rem;
		min-width: 0;
		padding: 0.25rem 0.55rem;
		border: 1px solid #93c5fd;
		border-radius: 9999px;
		background: #dbeafe;
		color: #172554;
		font-size: 0.75rem;
		line-height: 1rem;
		white-space: nowrap;
	}

	.player-stat-band > .cost-badge {
		margin-left: auto;
		padding: 0.125rem 0.625rem;
		border: 0;
		background: #fef3c7;
		color: #92400e;
		font-size: 0.875rem;
		font-weight: 500;
	}

	:global(.dark) .player-stat-band > .cost-badge {
		background: rgb(120 53 15 / 0.3);
		color: #fcd34d;
	}

	:global(.dark) .player-stat-band > div {
		border-color: #1e3a8a;
		background: #172554;
		color: #fff;
	}

	.player-stat-band dt {
		font-weight: 600;
	}

	.player-stat-band dd {
		margin: 0;
		font-variant-numeric: tabular-nums;
	}

	.player-groups {
		display: grid;
		align-content: start;
		gap: 0.45rem;
		min-width: 0;
		padding: 0.65rem 0.75rem 0.75rem;
	}

	.player-group {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem;
		min-width: 0;
		font-size: 0.8rem;
	}

	.player-group > strong {
		color: #374151;
		font-size: 0.75rem;
		font-weight: 700;
	}

	:global(.dark) .player-group > strong {
		color: #d1d5db;
	}

	.player-group > span {
		display: inline-flex;
		align-items: center;
		min-width: 0;
		max-width: 100%;
		min-height: 1.6rem;
		padding: 0.2rem 0.55rem;
		border: 1px solid #bfdbfe;
		border-radius: 9999px;
		background: #eff6ff;
		color: #1e3a8a;
		font-size: 0.75rem;
		line-height: 1rem;
		overflow-wrap: anywhere;
	}

	:global(.dark) .player-group > span {
		border-color: #1e3a8a;
		background: #1e293b;
		color: #dbeafe;
	}

	.skill-btn {
		min-height: 1.8rem;
		max-width: 100%;
		padding: 0.25rem 0.6rem;
		border: 1px solid #e5e7eb;
		border-radius: 9999px;
		background: #f3f4f6;
		color: #1f2937;
		font-size: 0.75rem;
		line-height: 1rem;
		cursor: pointer;
		overflow-wrap: anywhere;
	}

	.skill-btn:hover {
		background: #e5e7eb;
	}

	:global(.dark) .skill-btn {
		border-color: #4b5563;
		background: #374151;
		color: #e5e7eb;
	}

	:global(.dark) .skill-btn:hover {
		background: #4b5563;
	}

	.group-toggle {
		min-height: 1.8rem;
		padding: 0.2rem 0.35rem;
		border: 0;
		border-radius: 0.25rem;
		background: transparent;
		color: #1d4ed8;
		font-size: 0.75rem;
		font-weight: 600;
		line-height: 1rem;
		text-decoration: underline;
		text-underline-offset: 2px;
		cursor: pointer;
	}

	.group-toggle:hover {
		color: #1e3a8a;
	}

	:global(.dark) .group-toggle {
		color: #93c5fd;
	}

	:global(.dark) .group-toggle:hover {
		color: #bfdbfe;
	}

	@media (max-width: 360px) {
		.roster-card {
			grid-template-columns: minmax(0, 1fr);
		}

		.player-identity {
			grid-row: auto;
			border-right: 0;
			border-bottom: 1px solid #e5e7eb;
			border-radius: 0.7rem 0.7rem 0 0;
		}

		:global(.dark) .player-identity {
			border-color: #374151;
		}

		.player-information {
			grid-column: 1;
			grid-row: auto;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.player-count button,
		.skill-btn {
			transition: background-color 120ms ease;
		}
	}

	.skill-card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		border-radius: 6px;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		text-align: left;
		/* ensure text is readable in light mode */
		color: #111827;
	}

	.skill-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.skill-desc {
		color: #374151;
		white-space: pre-line;
		line-height: 1.5;
	}

	:global(.dark) .skill-desc {
		color: #d1d5db;
	}

	.badge {
		margin-left: 0.5rem;
		padding: 2px 6px;
		font-size: 0.75rem;
		background: #d1fae5;
		border-radius: 999px;
		color: #065f46;
		margin-right: 0.4rem;
	}

	.elite {
		background: #fde68a;
		color: #92400e;
		padding: 2px 6px;
		border-radius: 4px;
		margin-left: 0.4rem;
		font-size: 0.75rem;
	}

	:global(.dark) .skill-card {
		background: #0b1220;
		border-color: #222;
		/* light text for dark mode */
		color: #f9fafb;
	}

	/* Modal overlay */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	.modal {
		max-width: 90%;
		max-height: 90%;
		overflow: auto;
	}

	:global(.dark) .modal-overlay {
		background: rgba(0, 0, 0, 0.7);
	}

	.close-icon {
		background: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
		color: inherit;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}
</style>
