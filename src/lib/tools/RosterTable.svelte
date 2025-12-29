<script lang="ts">
  import { selectedTeam, currentRoster } from "$lib/stores/roster";
</script>

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
          r.players[p.id]--;
          return r;
        })}>−</button>
        {$currentRoster.players[p.id] ?? 0}
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
