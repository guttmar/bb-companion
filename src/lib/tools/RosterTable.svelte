<script lang="ts">
	import { selectedTeam, currentRoster } from '$lib/stores/roster';
	import { bb2025Skills, type Skill } from '$lib/data/skills/bb2025';
	import { createIndividualPlayer, isCustomizedPlayer, syncIndividualPlayers, type IndividualPlayer } from '$lib/domain/rosterPlayers';
	import { getSkillChoices } from '$lib/domain/matchedPlay';
	import DismissRegular from 'fluentui-icons-svelte/DismissRegular.svelte';
	import { formatCost, formatStat } from '$lib/tools/format';

	export let editMode = false;
	let openSkill: Skill | null = null;
	let removeDialog: HTMLDialogElement;
	let removePositionId = '';
	let removeChoice = '';
	let pendingSkill: Record<string, string> = {};
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

	$: removalCandidates = $currentRoster.individualPlayers?.[removePositionId] ?? [];
	$: customizedCandidates = removalCandidates.filter(isCustomizedPlayer);
	$: uncustomizedCount = removalCandidates.length - customizedCandidates.length;

	function addPlayer(positionId: string) {
		currentRoster.update((roster) => {
			const players = syncIndividualPlayers(roster.players, roster.individualPlayers);
			players[positionId] = [...(players[positionId] ?? []), createIndividualPlayer(players)];
			return { ...roster, players: { ...roster.players, [positionId]: (roster.players[positionId] ?? 0) + 1 }, individualPlayers: players };
		});
	}

	function openRemoveDialog(positionId: string) {
		const candidates = $currentRoster.individualPlayers?.[positionId] ?? [];
		const choices = [
			...candidates.filter(isCustomizedPlayer),
			...(candidates.some((player) => !isCustomizedPlayer(player)) ? ['uncustomized'] : [])
		];
		if (choices.length === 1) {
			removePositionId = positionId;
			removeChoice = typeof choices[0] === 'string' ? choices[0] : choices[0].id;
			removeSelectedPlayer();
			return;
		}
		removePositionId = positionId;
		const firstCustomized = candidates.find(isCustomizedPlayer);
		removeChoice = firstCustomized?.id ?? (candidates.length ? 'uncustomized' : '');
		removeDialog.showModal();
	}

	function removeSelectedPlayer() {
		currentRoster.update((roster) => {
			const candidates = [...(roster.individualPlayers?.[removePositionId] ?? [])];
			const target = removeChoice === 'uncustomized'
				? candidates.find((player) => !isCustomizedPlayer(player))
				: candidates.find((player) => player.id === removeChoice);
			if (!target) return roster;
			const players = candidates.filter((player) => player.id !== target.id);
			return {
				...roster,
				players: { ...roster.players, [removePositionId]: Math.max(0, (roster.players[removePositionId] ?? 0) - 1) },
				individualPlayers: { ...roster.individualPlayers, [removePositionId]: players }
			};
		});
		removeDialog.close();
	}

	function updatePlayer(positionId: string, playerId: string, update: (player: IndividualPlayer) => IndividualPlayer) {
		currentRoster.update((roster) => {
			const individualPlayers = syncIndividualPlayers(roster.players, roster.individualPlayers);
			return {
				...roster,
				individualPlayers: {
					...individualPlayers,
					[positionId]: individualPlayers[positionId].map((player) => player.id === playerId ? update(player) : player)
				}
			};
		});
	}

	function addSkill(positionId: string, player: IndividualPlayer) {
		const skillId = pendingSkill[player.id];
		if (!skillId || player.skills.includes(skillId)) return;
		updatePlayer(positionId, player.id, (current) => ({ ...current, skills: [...current.skills, skillId] }));
		pendingSkill = { ...pendingSkill, [player.id]: '' };
	}

	function removeSkill(positionId: string, player: IndividualPlayer, skillId: string) {
		updatePlayer(positionId, player.id, (current) => ({ ...current, skills: current.skills.filter((id) => id !== skillId) }));
	}

</script>

<ul class="roster-list" aria-label="Available players">
	{#each $selectedTeam?.players ?? [] as p (p.id)}
		{@const primaryItems = p.primary ?? []}
		{@const secondaryItems = p.secondary ?? []}
		{@const skillItems = p.skills ?? []}
		{@const individualPlayers = $currentRoster.individualPlayers?.[p.id] ?? []}
		<li class="roster-card">
			<div class="player-identity">
				<div class="player-name">{p.name}</div>
				<div class="player-count" aria-label={`${p.name} roster count`}>
					<button
					type="button"
						aria-label={`Decrease ${p.name} count`}
						on:click={() => openRemoveDialog(p.id)}
						disabled={($currentRoster.players[p.id] ?? 0) == 0}>−</button
					>
					<span class="count-value" aria-label={`${$currentRoster.players[p.id] ?? 0} of ${p.max}`}>
						<span class="count-current">{$currentRoster.players[p.id] ?? 0}</span>
						<span class="count-divider" aria-hidden="true"></span>
						<span class="count-max">{p.max}</span>
					</span>
					<button
						type="button"
						aria-label={`Increase ${p.name} count`}
						on:click={() => addPlayer(p.id)}>+</button
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
						{#if primaryItems.length}<span class="item-pill primary-pill">Pri {primaryItems.join('')}</span>{/if}
						{#if secondaryItems.length}<span class="item-pill secondary-pill">Sec {secondaryItems.join('')}</span>{/if}
						{#each skillItems as skill, index (skill + index)}
							<button class="skill-btn" type="button" on:click={() => showSkill(skill)}>{skill}</button>
						{/each}
						{#if !skillItems.length}<span>—</span>{/if}
					</div>
				</div>
			</div>
			{#if editMode && individualPlayers.length}
				<div class="individual-editor" aria-label={`${p.name} individual players`}>
					{#each individualPlayers as player (player.id)}
						{@const choices = getSkillChoices(p).filter((choice) => !player.skills.includes(choice.skill.id))}
						<div class="individual-player">
							<h3>{p.name} #{player.number}</h3>
							<label>
								<span>Player name</span>
								<input
									type="text"
									placeholder={p.name}
									value={player.name ?? ''}
									aria-label={`${p.name} #${player.number} name`}
									on:input={(event) => {
										const value = (event.currentTarget as HTMLInputElement).value;
										updatePlayer(p.id, player.id, (current) => ({ ...current, name: value || undefined }));
									}}
								/>
							</label>
							<label>
								<span>Number (0–99)</span>
								<input
									type="number"
									min="0"
									max="99"
									value={player.number}
									aria-label={`${p.name} #${player.number} number`}
									on:input={(event) => {
										const input = event.currentTarget as HTMLInputElement;
										const value = Number(input.value);
										const numberTaken = Object.values($currentRoster.individualPlayers ?? {}).flat().some((other) => other.id !== player.id && other.number === value);
										if (input.value !== '' && Number.isInteger(value) && value >= 0 && value <= 99 && !numberTaken) {
											updatePlayer(p.id, player.id, (current) => ({ ...current, number: value, numberCustomized: true }));
										}
									}}
								/>
							</label>
							<div class="assigned-skills" aria-label={`${p.name} #${player.number} added skills`}>
								{#each player.skills as skillId (skillId)}
									{@const assigned = bb2025Skills.flatMap((category) => category.skills).find((skill) => skill.id === skillId)}
									{#if assigned}
										<span class="assigned-skill">
											<button type="button" class="skill-btn" on:click={() => showSkill(assigned.name)}>{assigned.name}</button>
											<button type="button" class="remove-skill" aria-label={`Remove ${assigned.name} from ${p.name} #${player.number}`} on:click={() => removeSkill(p.id, player, skillId)}>×</button>
										</span>
									{/if}
								{/each}
							</div>
							{#if choices.length}
								<div class="skill-picker">
									<label for={`skill-${player.id}`}>Add skill</label>
									<select id={`skill-${player.id}`} aria-label={`Choose additional skill for ${p.name} #${player.number}`} value={pendingSkill[player.id] ?? ''} on:change={(event) => (pendingSkill = { ...pendingSkill, [player.id]: (event.currentTarget as HTMLSelectElement).value })}>
										<option value="">Choose a skill…</option>
										{#each choices as choice (choice.skill.id)}
											<option value={choice.skill.id}>{choice.skill.name} · {choice.access} · {choice.cost} SP</option>
										{/each}
									</select>
									<button type="button" on:click={() => addSkill(p.id, player)} disabled={!pendingSkill[player.id]}>Add skill</button>
								</div>
							{:else}
								<p>No eligible additional skills remain.</p>
							{/if}
						</div>
					{/each}
				</div>
			{:else if individualPlayers.some(isCustomizedPlayer)}
				<div class="player-custom-summary" aria-label={`${p.name} customized players`}>
					{#each individualPlayers.filter(isCustomizedPlayer) as player (player.id)}
						<div>
							<strong>{player.name?.trim() || p.name} #{player.number}</strong>
							{#each player.skills as skillId (skillId)}
								{@const assigned = bb2025Skills.flatMap((category) => category.skills).find((skill) => skill.id === skillId)}
								{#if assigned}<button type="button" class="skill-btn" on:click={() => showSkill(assigned.name)}>{assigned.name}</button>{/if}
							{/each}
						</div>
					{/each}
				</div>
			{/if}
		</li>
	{/each}
</ul>

<dialog class="remove-player-dialog" bind:this={removeDialog} aria-labelledby="remove-player-title">
	<form on:submit|preventDefault={removeSelectedPlayer}>
		<h2 id="remove-player-title">Remove { $selectedTeam?.players.find((player) => player.id === removePositionId)?.name ?? 'player' }</h2>
		<p>Choose which player to remove from your roster.</p>
		<fieldset>
			<legend class="sr-only">Player to remove</legend>
			{#each customizedCandidates as player (player.id)}
				<label class="remove-choice">
					<input type="radio" name="remove-player" value={player.id} bind:group={removeChoice} />
					<span>{player.name?.trim() ? `${player.name.trim()} #${player.number}` : `${$selectedTeam?.players.find((position) => position.id === removePositionId)?.name ?? 'Player'} #${player.number}`}{player.skills.length ? ` · ${player.skills.map((id) => bb2025Skills.flatMap((category) => category.skills).find((skill) => skill.id === id)?.name ?? id).join(', ')}` : ''}</span>
				</label>
			{/each}
			{#if uncustomizedCount > 0}
				<label class="remove-choice">
					<input type="radio" name="remove-player" value="uncustomized" bind:group={removeChoice} />
					<span>Any uncustomized player ({uncustomizedCount})</span>
				</label>
			{/if}
		</fieldset>
		<div class="remove-dialog-actions">
			<button type="button" on:click={() => removeDialog.close()}>Cancel</button>
			<button type="submit" disabled={!removeChoice}>Remove player</button>
		</div>
	</form>
</dialog>

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
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: auto 1px auto;
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
		grid-row: 3;
	}

	.player-count .count-divider {
		grid-column: 1;
		grid-row: 2;
		width: 1.25em;
		height: 1px;
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

	.individual-editor {
		grid-column: 1 / -1;
		display: grid;
		gap: 0.75rem;
		padding: 0.75rem;
		border-top: 1px solid #e5e7eb;
		background: #f9fafb;
	}

	.player-custom-summary {
		grid-column: 1 / -1;
		display: grid;
		gap: 0.4rem;
		padding: 0.65rem 0.75rem;
		border-top: 1px solid #e5e7eb;
	}

	.player-custom-summary > div {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.8rem;
	}

	:global(.dark) .player-custom-summary {
		border-color: #374151;
	}

	.individual-player {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
		align-items: end;
		gap: 0.65rem;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		background: #fff;
	}

	.individual-player h3,
	.individual-player p {
		grid-column: 1 / -1;
		margin: 0;
	}

	.individual-player label,
	.skill-picker {
		display: grid;
		gap: 0.3rem;
		min-width: 0;
		font-size: 0.8rem;
	}

	.individual-player input,
	.skill-picker select {
		width: 100%;
		min-width: 0;
		min-height: 2.5rem;
		padding: 0.4rem;
		border: 1px solid #9ca3af;
		border-radius: 0.35rem;
		background: white;
		color: #111827;
	}

	.assigned-skills,
	.assigned-skill {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.3rem;
	}

	.assigned-skills {
		grid-column: 1 / -1;
	}

	.remove-skill {
		min-width: 1.8rem;
		min-height: 1.8rem;
		border: 0;
		border-radius: 9999px;
		background: #fee2e2;
		color: #991b1b;
		font-size: 1rem;
		cursor: pointer;
	}

	.skill-picker button,
	.remove-dialog-actions button {
		min-height: 2.5rem;
		padding: 0.4rem 0.75rem;
		border: 0;
		border-radius: 0.35rem;
		background: #15803d;
		color: white;
		font-weight: 600;
		cursor: pointer;
	}

	.skill-picker button:disabled,
	.remove-dialog-actions button:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	:global(.dark) .individual-editor {
		border-color: #374151;
		background: #1f2937;
	}

	:global(.dark) .individual-player {
		border-color: #4b5563;
		background: #111827;
	}

	:global(.dark) .individual-player input,
	:global(.dark) .skill-picker select {
		border-color: #4b5563;
		background: #1f2937;
		color: #f9fafb;
	}

	.remove-player-dialog {
		width: min(30rem, calc(100vw - 2rem));
		max-height: min(80vh, 40rem);
		padding: 1.25rem;
		border: 1px solid #d1d5db;
		border-radius: 0.75rem;
		color: #111827;
	}

	.remove-player-dialog::backdrop {
		background: rgb(0 0 0 / 0.55);
		backdrop-filter: blur(2px);
	}

	.remove-player-dialog form,
	.remove-player-dialog fieldset {
		display: grid;
		gap: 0.75rem;
		min-width: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.remove-player-dialog h2,
	.remove-player-dialog p {
		margin: 0;
	}

	.remove-choice {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		padding: 0.65rem;
		border: 1px solid #d1d5db;
		border-radius: 0.4rem;
		cursor: pointer;
	}

	.remove-dialog-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	.remove-dialog-actions button:first-child {
		background: #6b7280;
	}

	:global(.dark) .remove-player-dialog {
		border-color: #4b5563;
		background: #111827;
		color: #f9fafb;
	}

	:global(.dark) .remove-choice {
		border-color: #4b5563;
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

		.individual-editor {
			grid-column: 1;
		}

		.player-custom-summary {
			grid-column: 1;
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
