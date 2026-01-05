<script>
  import RosterTable from "$lib/tools/RosterTable.svelte";
  import RosterWarnings from "$lib/components/RosterWarnings.svelte";
  import { treasuryLeft, currentRoster } from "$lib/stores/roster";

  $: totalPlayers = Object.values($currentRoster.players).reduce((sum, count) => sum + count, 0);
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
</style>

<main>
  <RosterTable />
  <p>Treasury left: {$treasuryLeft}</p>
  <p>Total players: {totalPlayers}</p>
  <RosterWarnings />
</main>
