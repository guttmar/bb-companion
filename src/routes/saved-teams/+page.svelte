<script lang="ts">
  import { savedTeams, deleteTeam, type SavedTeam } from "$lib/stores/savedTeams";
  import { teams } from "$lib/stores/roster";
  import EditRegular from "fluentui-icons-svelte/EditRegular.svelte";
  import DeleteRegular from "fluentui-icons-svelte/DeleteRegular.svelte";

  let deletingId: string | null = null;
  const ICON_SIZE = 18;

  function totalPlayers(roster: SavedTeam["roster"]) {
    return Object.values(roster.players).reduce((sum, n) => sum + n, 0);
  }

  function confirmDelete(team: SavedTeam) {
    if (deletingId === team.id) {
      deleteTeam(team.id);
      deletingId = null;
    } else {
      deletingId = team.id;
    }
  }

  function displayName(team: SavedTeam): string {
    if (team.name?.trim()) return team.name.trim();
    const template = $teams?.[team.selectedTeamId];
    return template?.name ?? team.selectedTeamId;
  }
</script>

<style>
  main {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  :global(.dark) main {
    background: #171717;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  h1 {
    font-size: 1.5rem;
    color: #333;
    margin-top: 0;
  }

  :global(.dark) h1 {
    color: #e5e5e5;
  }

  .empty {
    color: #666;
    margin: 2rem 0;
  }

  :global(.dark) .empty {
    color: #a3a3a3;
  }

  .empty a {
    color: #2563eb;
  }

  :global(.dark) .empty a {
    color: #60a5fa;
  }

  .list {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0 0;
  }

  .card {
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 0.75rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  :global(.dark) .card {
    border-color: #404040;
    background: #262626;
  }

  .card-info {
    flex: 1;
    min-width: 0;
  }

  .card-title {
    font-weight: bold;
    font-size: 1.1rem;
    color: #333;
  }

  :global(.dark) .card-title {
    color: #e5e5e5;
  }

  .card-summary {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.25rem;
  }

  :global(.dark) .card-summary {
    color: #a3a3a3;
  }

  .card-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .btn-edit {
    background-color: #2563eb;
    color: white;
  }

  .btn-edit:hover {
    background-color: #1d4ed8;
  }

  :global(.dark) .btn-edit {
    background-color: #2563eb;
  }

  :global(.dark) .btn-edit:hover {
    background-color: #1d4ed8;
  }

  .btn-delete {
    background-color: #dc2626;
    color: white;
  }

  .btn-delete:hover {
    background-color: #b91c1c;
  }

  .btn-confirm {
    background-color: #dc2626;
    color: white;
  }

  .btn-cancel {
    background-color: #6b7280;
    color: white;
  }
</style>

<main>
  <h1>Saved teams</h1>

  {#if $savedTeams.length === 0}
    <p class="empty">No saved teams. <a href="/roster">Create a roster</a> and save it to see it here.</p>
  {:else}
    <ul class="list">
      {#each $savedTeams as team (team.id)}
        <li class="card">
          <div class="card-info">
            <div class="card-title">{displayName(team)}</div>
            <div class="card-summary">
              {totalPlayers(team.roster)} players · {team.roster.reRolls} re-rolls
              {#if team.roster.apothecary}
                · Apothecary
              {/if}
              {#if team.startingTreasury != null}
                · Treasury: {team.startingTreasury.toLocaleString()}
              {/if}
            </div>
          </div>
          <div class="card-actions">
            {#if deletingId === team.id}
              <span class="card-summary">Delete?</span>
              <button type="button" class="btn btn-confirm" on:click={() => confirmDelete(team)}>Yes</button>
              <button type="button" class="btn btn-cancel" on:click={() => (deletingId = null)}>No</button>
            {:else}
              <a href="/roster?load={encodeURIComponent(team.id)}" class="btn btn-edit">
                <EditRegular width={ICON_SIZE} height={ICON_SIZE} />
              </a>
              <button type="button" class="btn btn-delete" on:click={() => confirmDelete(team)}>
                <DeleteRegular width={ICON_SIZE} height={ICON_SIZE} />
              </button>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</main>
