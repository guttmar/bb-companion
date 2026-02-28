<script lang="ts">
  import { selectedTeam, currentRoster } from "$lib/stores/roster";
</script>

<style>
  table.roster-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  .roster-table th,
  .roster-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  .roster-table td {
    min-width: auto;
  }

  .roster-table td > span {
    display: inline-block;
    width: 3.5rem;
    text-align: center;
  }

  .roster-table th {
    background-color: #3d8c40;
    color: white;
  }

  .roster-table tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  .roster-table button {
    background-color: #4CAF50;
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
</style>

<table class="roster-table">
  <tbody>
    <tr>
      <th>#</th>
      <th>Cost</th>
      <th>Name</th>
    </tr>

    {#each $selectedTeam?.players ?? [] as p}
    <tr>
      <td>
        <button on:click={() => currentRoster.update(r => {
          r.players[p.id] = r.players[p.id] ?? 0;
          if (r.players[p.id] == 0) {
            return r;
          }

          r.players[p.id]--;
          return r;
        })} disabled={($currentRoster.players[p.id] ?? 0) == 0}>−</button>
        <span>{$currentRoster.players[p.id] ?? 0} / {p.max}</span>
        <button on:click={() => currentRoster.update(r => {
          r.players[p.id] = r.players[p.id] ?? 0;
          r.players[p.id]++;
          return r;
        })}>+</button>
      </td>
      <td>{p.cost}</td>
      <td>{p.name}</td>
    </tr>
    {/each}
  </tbody>
</table>
