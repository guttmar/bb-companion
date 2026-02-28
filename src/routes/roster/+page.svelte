<script>
  import RosterTable from "$lib/tools/RosterTable.svelte";
  import OtherTable from "$lib/tools/OtherTable.svelte";
  import RosterWarnings from "$lib/components/RosterWarnings.svelte";
  import { treasuryLeft, currentRoster, selectedTeam, selectedTeamId, teams } from "$lib/stores/roster";

  $: totalPlayers = Object.values($currentRoster.players).reduce((sum, count) => sum + count, 0);

  $: teamIds = Object.keys($teams ?? {});

  $: if ($selectedTeamId) {
    currentRoster.set({ players: {}, reRolls: 0, apothecary: 0 });
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

  <h2>Other</h2>
  <OtherTable />
</main>
