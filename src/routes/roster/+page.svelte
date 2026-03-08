<script lang="ts">
  import { onMount } from "svelte";
  import { tick } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { base } from '$app/paths';
  import RosterTable from "$lib/tools/RosterTable.svelte";
  import OtherTable from "$lib/tools/OtherTable.svelte";
  import RosterWarnings from "$lib/components/RosterWarnings.svelte";
  import { formatCost } from "$lib/tools/format";
  import {
    treasuryLeft,
    currentRoster,
    selectedTeamId,
    teams,
    startingTreasury
  } from "$lib/stores/roster";
  import { getSavedTeam, saveTeam, updateTeam } from "$lib/stores/savedTeams";

  let teamName = "";
  let saveMessage = "";
  // currently-editing saved team id (undefined when creating new)
  export let editingId: string | undefined;
  // keep track of the template that was used when loading the team so
  // we can clear editing state if the user switches to a different base
  let loadedTemplateId: string | undefined;

  let startingTreasuryInput = Math.floor($startingTreasury / 1000);

  $: startingTreasuryInput = Math.floor($startingTreasury / 1000);

  $: totalPlayers = Object.values($currentRoster.players).reduce((sum, count) => sum + count, 0);

  $: teamIds = Object.keys($teams ?? {});

  $: if ($selectedTeamId) {
    currentRoster.set({ players: {}, reRolls: 0, apothecary: 0 });
  }

  // if the user switches teams while editing a saved roster clear the
  // editing state (otherwise we'd accidentally update a team that no
  // longer matches the template they are working on)
  $: if (loadedTemplateId && $selectedTeamId !== loadedTemplateId) {
    editingId = undefined;
    loadedTemplateId = undefined;
  }

  function handleStartingTreasuryChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const num = parseInt(target.value, 10);
    if (!isNaN(num)) {
      startingTreasury.set(num * 1000);
    }
  }

  onMount(() => {
    const loadId = $page.url.searchParams.get("load");
    if (loadId) {
      const saved = getSavedTeam(loadId);
      if (saved) {
        // set editing state and form fields
        editingId = saved.id;
        teamName = saved.name ?? "";
        if (saved.startingTreasury != null) {
          startingTreasury.set(saved.startingTreasury);
        }
        selectedTeamId.set(saved.selectedTeamId);
        loadedTemplateId = saved.selectedTeamId;
        tick().then(() => {
          currentRoster.set({ ...saved.roster });
          const url = new URL($page.url);
          url.searchParams.delete("load");
          goto(url.pathname + url.search, { replaceState: true });
        });
      }
    }
  });

  function handleSave() {
    const payload = {
      name: teamName.trim() || undefined,
      selectedTeamId: $selectedTeamId,
      roster: { ...$currentRoster },
      startingTreasury: $startingTreasury
    };

    if (editingId) {
      // update existing record
      updateTeam(editingId, payload);
      saveMessage = "Team updated.";
    } else {
      const id = saveTeam(payload);
      saveMessage = "Team saved.";
    }

    // if we just saved (or updated) clear the name field but keep editingId
    // so the user can continue to tweak without losing context.  if the
    // roster template changes the reactive block below will reset editingId.
    teamName = "";
  }
</script>

<style>
  :global(body) {
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    margin: 0;
    padding: 0;
  }

  :global(.dark) :global(body) {
    background-color: #0a0a0a;
  }

  main {
    max-width: 800px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  :global(.dark) main {
    background: #171717;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
  }

  :global(.dark) main label {
    color: #e5e5e5;
  }

  select {
    margin-bottom: 1.5rem;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }

  :global(.dark) main select {
    border-color: #525252;
    background: #262626;
    color: #e5e5e5;
  }

  h2 {
    margin-top: 2rem;
    font-size: 1.5rem;
    color: #333;
  }

  :global(.dark) main h2 {
    color: #e5e5e5;
  }

  :global(.dark) main p {
    color: #a3a3a3;
  }

  .save-hint {
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }

  .save-row {
    margin-top: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
  }

  .save-row label {
    margin-bottom: 0;
  }

  .team-name-input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    min-width: 12rem;
  }

  .treasury-input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 10rem;
  }

  .treasury-input-container {
    display: flex;
    align-items: center;
  }

  .treasury-input-container span {
    margin-left: 0.5rem;
    font-weight: bold;
    color: inherit; /* match surrounding text color */
  }

  :global(.dark) .team-name-input {
    border-color: #525252;
    background: #262626;
    color: #e5e5e5;
  }

  /* ensure the treasury input unit inherits correct color in dark mode */
  :global(.dark) .treasury-input-container span {
    color: #e5e5e5;
  }

  .save-btn {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: #3d8c40;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .save-btn:hover {
    background-color: #45a049;
  }

  :global(.dark) .save-btn {
    background-color: #15803d;
  }

  :global(.dark) .save-btn:hover {
    background-color: #166534;
  }

  .save-message {
    margin-top: 0.5rem;
  }

  .save-message a {
    color: #2563eb;
  }

  :global(.dark) .save-message a {
    color: #60a5fa;
  }

  .fixed-header {
    flex-shrink: 0;
    padding: 1rem;
  }

  .scrollable-content {
    flex: 1;
    overflow-y: auto;
    padding: 0 1rem 1rem 1rem;
  }
</style>

<main>
  <div class="fixed-header">
  <label for="team-select">Choose a team:</label>
  <select id="team-select" bind:value={$selectedTeamId}>
    {#each teamIds as teamId}
      <option value={teamId}>{$teams[teamId].name}</option>
    {/each}
  </select>

  <div class="save-row">
    <label for="team-name">Team name (optional)</label>
    <input
      id="team-name"
      type="text"
      placeholder="My team"
      bind:value={teamName}
      class="team-name-input"
    />
    <label for="starting-treasury">Starting treasury</label>
    <div class="treasury-input-container">
      <input
        id="starting-treasury"
        type="number"
        min="0"
        class="treasury-input"
        value={startingTreasuryInput}
        on:input={handleStartingTreasuryChange}
        placeholder="1000"
      />
      <span>k</span>
    </div>
    <button type="button" class="save-btn" on:click={handleSave}>
      {editingId ? 'Update team' : 'Save team'}
    </button>
    <p>Treasury left: {formatCost($treasuryLeft)}</p>
    <p>Total players: {totalPlayers}</p>
  </div>
  {#if saveMessage}
    <p class="save-message">{saveMessage} <a href="{base + '/saved-teams'}">View saved teams</a></p>
  {/if}
  </div>
  <div class="scrollable-content">
  <RosterTable />
  <RosterWarnings />

  <h2>Other</h2>
  <OtherTable />
  </div>
</main>
