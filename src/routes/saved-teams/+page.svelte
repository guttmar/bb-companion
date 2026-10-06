<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { get } from "svelte/store";
  import { savedTeams, deleteTeam, ensureTeamShare, importSharedTeam, type SavedTeam } from "$lib/stores/savedTeams";
  import { teams } from "$lib/stores/roster";
  import { settings } from "$lib/stores/settings";
  import { decodeAndValidateTeamShare, encodeTeamShare } from "$lib/tools/teamSharing";
  import EditRegular from "fluentui-icons-svelte/EditRegular.svelte";
  import DeleteRegular from "fluentui-icons-svelte/DeleteRegular.svelte";
  import ShareRegular from "fluentui-icons-svelte/ShareRegular.svelte";
  import { base } from '$app/paths';

  let deletingId: string | null = null;
  let shareMessage = "";
  let shareMessageKind: "success" | "error" = "success";
  let shareFallbackUrl = "";
  let copiedTeamId: string | null = null;
  let messageTimeout: ReturnType<typeof setTimeout> | undefined;
  const ICON_SIZE = 18;

  onMount(() => {
    const prefix = "#share=";
    if (!window.location.hash.startsWith(prefix)) return;

    const result = decodeAndValidateTeamShare(window.location.hash.slice(prefix.length));
    if (!result.ok) {
      showMessage(result.error, "error");
      return;
    }

    if (result.payload.ruleset !== get(settings).ruleset) {
      showMessage(`This team uses the ${result.payload.ruleset} ruleset. Change your ruleset in Settings to import it.`, "error");
      return;
    }

    const imported = importSharedTeam(result.payload);
    showMessage(
      imported === "added" ? "Shared team added to Saved teams." : "This shared team is already in Saved teams.",
      "success"
    );
    clearShareFragment();
  });

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

  async function shareTeam(team: SavedTeam) {
    const currentSettings = get(settings);
    const shareData = ensureTeamShare(team.id, currentSettings.ruleset, currentSettings.mode);
    if (!shareData) {
      showMessage("Could not prepare this team for sharing.", "error");
      return;
    }

    const encoded = encodeTeamShare(shareData);
    const shareUrl = new URL(`${base}/saved-teams`, window.location.origin);
    shareUrl.hash = `share=${encoded}`;
    const url = shareUrl.toString();

    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard access is unavailable.");
      await navigator.clipboard.writeText(url);
      shareFallbackUrl = "";
      shareMessage = "";
      copiedTeamId = team.id;
      window.setTimeout(() => {
        if (copiedTeamId === team.id) copiedTeamId = null;
      }, 1100);
    } catch {
      shareFallbackUrl = url;
      showMessage("Could not copy automatically. Select and copy the share link below.", "error");
    }
  }

  function showMessage(message: string, kind: "success" | "error") {
    if (messageTimeout) clearTimeout(messageTimeout);
    shareMessage = message;
    shareMessageKind = kind;
    if (kind === "success") {
      messageTimeout = setTimeout(() => {
        if (shareMessage === message) shareMessage = "";
      }, 3000);
    }
  }

  function clearShareFragment() {
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
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
    background-color: #0f766e;
    color: white;
  }

  .btn-edit:hover {
    background-color: #115e59;
  }

  :global(.dark) .btn-edit {
    background-color: #0f766e;
  }

  :global(.dark) .btn-edit:hover {
    background-color: #115e59;
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

  .btn-share {
    background-color: #2563eb;
    color: white;
  }

  .btn-share:hover {
    background-color: #1d4ed8;
  }

  .share-action {
    position: relative;
  }

  .copied-badge {
    position: absolute;
    z-index: 1;
    top: -1.65rem;
    left: 50%;
    padding: 0.2rem 0.45rem;
    border-radius: 9999px;
    background: #166534;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    pointer-events: none;
    transform: translateX(-50%);
    animation: copied-badge 1.3s ease both;
  }

  @keyframes copied-badge {
    0% {
      opacity: 0;
      transform: translate(-50%, 0.35rem) scale(0.9);
    }
    15%,
    70% {
      opacity: 1;
      transform: translate(-50%, 0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -0.25rem) scale(0.96);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .copied-badge {
      animation-duration: 0.01ms;
    }
  }

  .share-message {
    border-radius: 6px;
    padding: 0.75rem;
    margin: 1rem 0;
  }

  .share-success {
    background: #dcfce7;
    color: #166534;
  }

  .share-error {
    background: #fee2e2;
    color: #991b1b;
  }

  :global(.dark) .share-success {
    background: #14532d;
    color: #dcfce7;
  }

  :global(.dark) .share-error {
    background: #7f1d1d;
    color: #fee2e2;
  }

  .share-fallback {
    display: grid;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .share-fallback input {
    width: 100%;
    box-sizing: border-box;
    padding: 0.65rem;
    border: 1px solid #9ca3af;
    border-radius: 4px;
  }

  :global(.dark) .share-fallback input {
    background: #262626;
    color: #e5e5e5;
    border-color: #525252;
  }
</style>

<main>
  <h1>Saved teams</h1>

  {#if shareMessage}
    <p transition:fade={{ duration: 250 }} class="share-message {shareMessageKind === 'success' ? 'share-success' : 'share-error'}" role={shareMessageKind === 'error' ? 'alert' : 'status'}>
      {shareMessage}
    </p>
  {/if}

  {#if shareFallbackUrl}
    <div class="share-fallback">
      <label for="share-link">Share link</label>
      <input id="share-link" type="text" readonly value={shareFallbackUrl} on:focus={(event) => event.currentTarget.select()} />
      <button type="button" class="btn btn-cancel" on:click={() => (shareFallbackUrl = "")}>Close link</button>
    </div>
  {/if}

  {#if $savedTeams.length === 0}
    <p class="empty">No saved teams. <a href="{base + '/roster'}">Create a roster</a> and save it to see it here.</p>
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
              <a href="{base + '/roster?load=' + encodeURIComponent(team.id)}" class="btn btn-edit">
                <EditRegular width={ICON_SIZE} height={ICON_SIZE} />
              </a>
              <span class="share-action">
                <button type="button" class="btn btn-share" aria-label={`Share ${displayName(team)}`} title="Share" on:click={() => shareTeam(team)}>
                  <ShareRegular width={ICON_SIZE} height={ICON_SIZE} aria-hidden="true" />
                </button>
                {#if copiedTeamId === team.id}
                  <span class="copied-badge" role="status">Copied!</span>
                {/if}
              </span>
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
