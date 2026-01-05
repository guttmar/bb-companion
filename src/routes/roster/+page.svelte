<script>
  import RosterTable from "$lib/tools/RosterTable.svelte";
  import OtherTable from "$lib/tools/OtherTable.svelte";
  import RosterWarnings from "$lib/components/RosterWarnings.svelte";
  import { treasuryLeft, currentRoster, selectedTeam, selectedTeamId } from "$lib/stores/roster";
  import { bb2020Teams } from "$lib/data/teams/bb2020";

  $: totalPlayers = Object.values($currentRoster.players).reduce((sum, count) => sum + count, 0);

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

  main {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
  }

  select {
    margin-bottom: 1.5rem;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }

  h2 {
    margin-top: 2rem;
    font-size: 1.5rem;
    color: #333;
  }
</style>

<main>
  <label for="team-select">Choose a team:</label>
  <select id="team-select" bind:value={$selectedTeamId}>
    {#each Object.keys(bb2020Teams) as teamId}
      <option value={teamId}>{bb2020Teams[teamId].name}</option>
    {/each}
  </select>

  <RosterTable />
  <p>Treasury left: {$treasuryLeft}</p>
  <p>Total players: {totalPlayers}</p>
  <RosterWarnings />

  <h2>Other</h2>
  <OtherTable />
</main>
