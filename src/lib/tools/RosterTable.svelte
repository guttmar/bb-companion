<script lang="ts">
	import { selectedTeam, currentRoster } from '$lib/stores/roster';
	import { bb2025Skills, type Skill } from '$lib/data/skills/bb2025';
	import DismissRegular from 'fluentui-icons-svelte/DismissRegular.svelte';
	import { formatCost, formatStat } from '$lib/tools/format';

	let openSkill: Skill | null = null;

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
</script>

<table class="roster-table">
	<tbody>
		<tr>
			<th>#</th>
			<th>Cost</th>
			<th>MA</th>
			<th>ST</th>
			<th>AG</th>
			<th>PA</th>
			<th>AV</th>
			<th>Name</th>
			<th>Prim</th>
			<th>Sec</th>
			<th>Skills</th>
		</tr>

		{#each $selectedTeam?.players ?? [] as p}
			<tr>
				<td>
					<button
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
					<span>{$currentRoster.players[p.id] ?? 0} / {p.max}</span>
					<button
						on:click={() =>
							currentRoster.update((r) => {
								r.players[p.id] = r.players[p.id] ?? 0;
								r.players[p.id]++;
								return r;
							})}>+</button
					>
				</td>
				<td>{formatCost(p.cost)}</td>
				<td>{p.ma}</td>
				<td>{p.st}</td>
				<td>{formatStat(p.ag, '+')}</td>
				<td>{formatStat(p.pa, '+')}</td>
				<td>{formatStat(p.av, '+')}</td>
				<td class="player-name-cell">
					<div class="player-name">{p.name}</div>
					{#if p.tags?.length}
						<div class="player-tags">
							{#each p.tags as tag}
								<div>{tag}</div>
							{/each}
						</div>
					{/if}
				</td>
				<td>{p.primary?.join('') || '—'}</td>
				<td>{p.secondary?.join('') || '—'}</td>
				<td>
					{#each p.skills ?? [] as s}
						<button class="skill-btn" on:click={() => showSkill(s)}>{s}</button>
					{/each}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

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
	table.roster-table {
		width: 100%;
		border-collapse: collapse;
		margin: 0.5rem 0; /* tightened vertical spacing */
	}

	.roster-table th,
	.roster-table td {
		border: 1px solid #ddd;
		padding: 6px; /* less padding overall */
		text-align: center;
	}

	.roster-table td {
		min-width: auto;
	}

	.player-name-cell {
		text-align: left;
	}

	.player-name {
		font-weight: 600;
	}

	.player-tags {
		margin-top: 0.15rem;
		color: #6b7280;
		font-size: 0.8rem;
		font-weight: 400;
	}

	.roster-table td > span {
		display: inline-block;
		width: 3.5rem;
		text-align: center;
	}

	.roster-table td:first-child {
		min-width: 12rem;
	}

	.roster-table th {
		background-color: #3d8c40;
		color: white;
	}

	.roster-table tr:nth-child(even) {
		background-color: #f2f2f2;
	}

	.roster-table button {
		background-color: #4caf50;
		color: white;
		border: none;
		padding: 5px 10px;
		cursor: pointer;
		border-radius: 4px;
	}

	.roster-table button:hover {
		background-color: #45a049;
	}

	.roster-table button:disabled {
		background-color: #ccc;
		color: #666;
		cursor: not-allowed;
	}

	:global(.dark) .roster-table th,
	:global(.dark) .roster-table td {
		border-color: #404040;
	}

	:global(.dark) .roster-table td {
		color: #a3a3a3;
	}

	:global(.dark) .player-tags {
		color: #9ca3af;
	}

	:global(.dark) .roster-table th {
		background-color: #166534;
	}

	:global(.dark) .roster-table tr:nth-child(even) {
		background-color: #262626;
	}

	:global(.dark) .roster-table tr:nth-child(odd) {
		background-color: #171717;
	}

	:global(.dark) .roster-table button {
		background-color: #15803d;
		color: white;
	}

	:global(.dark) .roster-table button:hover {
		background-color: #166534;
	}

	:global(.dark) .roster-table button:disabled {
		background-color: #525252;
		color: #737373;
	}

	/* Skills UI */
	.skill-btn {
		background: transparent;
		color: #064e3b;
		border: 1px solid #c7f0d6;
		padding: 4px 6px;
		margin: 2px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.85rem;
	}

	.skill-btn:hover {
		background: #e6f7ed;
	}

	:global(.dark) .skill-btn {
		background: transparent;
		color: #86efac;
		border-color: #14532d;
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

	/* responsive tweaks for mobile phones */
	@media (max-width: 640px) {
		.roster-table {
			margin: 0.25rem 0;
		}

		.roster-table th,
		.roster-table td {
			padding: 4px;
			font-size: 0.85rem;
		}

		.roster-table td > span {
			width: 2.5rem;
		}

		.roster-table td:first-child {
			min-width: 8rem;
		}

		.roster-table button {
			padding: 3px 6px;
		}

		.skill-btn {
			padding: 2px 4px;
			margin: 1px;
			font-size: 0.75rem;
		}
	}
</style>
