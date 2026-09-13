<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import DismissRegular from 'fluentui-icons-svelte/DismissRegular.svelte';

	export let skill: { name: string; description: string } | null = null;
	const dispatch = createEventDispatcher<{ close: void }>();

	function close() {
		dispatch('close');
	}
</script>

{#if skill}
	<div
		class="modal-overlay"
		role="presentation"
		tabindex="-1"
		on:click={(event) => event.target === event.currentTarget && close()}
		on:keydown={(event) => event.key === 'Escape' && close()}
	>
		<div class="skill-card" role="dialog" aria-modal="true" aria-label="Skill details">
			<div class="skill-header">
				<strong>{skill.name}</strong>
				<button type="button" class="close-icon" on:click={close} aria-label="Close">
					<DismissRegular />
				</button>
			</div>
			<div class="skill-desc">{skill.description}</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		z-index: 10;
		display: grid;
		place-items: center;
		padding: 1rem;
		background: rgb(0 0 0 / 45%);
	}

	.skill-card {
		width: min(32rem, 100%);
		padding: 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		background: #f9fafb;
		color: #111827;
	}

	.skill-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.skill-desc {
		margin-top: 0.75rem;
		line-height: 1.5;
		white-space: pre-line;
	}

	.close-icon {
		display: grid;
		width: 2rem;
		height: 2rem;
		place-items: center;
		border: 0;
		background: transparent;
		color: inherit;
		cursor: pointer;
	}

	:global(.dark) .skill-card {
		border-color: #404040;
		background: #262626;
		color: #e5e5e5;
	}
</style>