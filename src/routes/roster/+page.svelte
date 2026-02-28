<script>
  import { onMount } from "svelte";
  import { tick } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import RosterTable from "$lib/tools/RosterTable.svelte";
  import OtherTable from "$lib/tools/OtherTable.svelte";
  import RosterWarnings from "$lib/components/RosterWarnings.svelte";
  import {
    treasuryLeft,
    currentRoster,
    selectedTeam,
    selectedTeamId,
    teams,
    startingTreasury
  } from "$lib/stores/roster";
  import { getSavedTeam, saveTeam } from "$lib/stores/savedTeams";

  let teamName = "";
  let saveMessage = "";

  $: totalPlayers = Object.values($currentRoster.players).reduce((sum, count) => sum + count, 0);

  $: teamIds = Object.keys($teams ?? {});

  $: if ($selectedTeamId) {
    currentRoster.set({ players: {}, reRolls: 0, apothecary: 0 });
  }

  onMount(() => {
    const loadId = $page.url.searchParams.get("load");
    if (loadId) {
      const saved = getSavedTeam(loadId);
      if (saved) {
        selectedTeamId.set(saved.selectedTeamId);
        tick().then(() => {
          currentRoster.set({ ...saved.roster });
          if (saved.startingTreasury != null) {
            startingTreasury.set(saved.startingTreasury);
          }
          const url = new URL($page.url);
          url.searchParams.delete("load");
          goto(url.pathname + url.search, { replaceState: true });
        });
      }
    }
  });

  function handleSave() {
    const id = saveTeam({
      name: teamName.trim() || undefined,
      selectedTeamId: $selectedTeamId,
      roster: { ...$currentRoster },
      startingTreasury: $startingTreasury
    });
    saveMessage = "Team saved.";
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

  :global(.dark) .team-name-input {
    border-color: #525252;
    background: #262626;
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
</style>

<main>
  <label for="team-select">Choose a team:</label>
  <select id="team-select" bind:value={$selectedTeamId}>
    {#each teamIds as teamId}
      <option value={teamId}>{$teams[teamId].name}</option>
    {/each}
  </select>

  <RosterTable />
  <p>Treasury left: {$treasuryLeft}</p>
  <p>Total players: {totalPlayers}</p>
  <RosterWarnings />

  <h2>Save team</h2>
  <p class="save-hint">Optionally give the team a name, then save to access it from Saved teams.</p>
  <div class="save-row">
    <label for="team-name">Team name (optional)</label>
    <input
      id="team-name"
      type="text"
      placeholder="My team"
      bind:value={teamName}
      class="team-name-input"
    />
    <button type="button" class="save-btn" on:click={handleSave}>Save team</button>
  </div>
  {#if saveMessage}
    <p class="save-message">{saveMessage} <a href="/saved-teams">View saved teams</a></p>
  {/if}

  <h2>Other</h2>
  <OtherTable />
</main>
