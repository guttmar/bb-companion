<script lang="ts">
  import { selectedTeam, currentRoster } from "$lib/stores/roster";
</script>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  td {
    min-width: auto;
  }

  td > span {
    display: inline-block;
    width: 1.5rem;
    text-align: center;
  }

  th {
    background-color: #3d8c40;
    color: white;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
  }

  button:hover {
    background-color: #45a049;
  }

  button:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }
</style>

<table>
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
        <span>{$currentRoster.players[p.id] ?? 0}</span>
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
