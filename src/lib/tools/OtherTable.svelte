<script lang="ts">
  import { selectedTeam, currentRoster } from "$lib/stores/roster";
</script>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }

  th, td {
    border: 1px solid #ccc;
    padding: 0.75rem;
    text-align: center;
  }

  th {
    background-color: #f2f2f2;
  }

  button {
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    margin: 0 0.25rem;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
</style>

<table>
  <tbody>
    <tr>
      <th>Count</th>
      <th>Cost</th>
      <th>Item</th>
    </tr>
    <tr>
        <td>
            <button on:click={() => currentRoster.update(r => {
                if (r.reRolls > 0) r.reRolls--;
                return r;
            })} disabled={$currentRoster.reRolls === 0}>−</button>
        <span>{$currentRoster.reRolls} / 8</span>
        <button on:click={() => currentRoster.update(r => {
            if (r.reRolls < 8) r.reRolls++;
            return r;
        })}>+</button>
      </td>
        <td>{$selectedTeam.rerollCost}</td>
      <td>Team Re-rolls</td>
    </tr>
    <tr>
        <td>
            <button on:click={() => currentRoster.update(r => {
                if (r.apothecary > 0) r.apothecary--;
                return r;
            })} disabled={$currentRoster.apothecary === 0}>−</button>
        <span>{$currentRoster.apothecary} / 1</span>
        <button on:click={() => currentRoster.update(r => {
            if (r.apothecary < 1) r.apothecary++;
            return r;
        })}>+</button>
      </td>
      <td>50000</td>
      <td>Apothecary</td>
    </tr>
  </tbody>
</table>