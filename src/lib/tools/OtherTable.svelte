<script lang="ts">
  import { selectedTeam, currentRoster } from "$lib/stores/roster";
  import { settings } from "$lib/stores/settings";
  import { getRulesetConfig } from "$lib/domain/rulesets";
  import { formatCost } from "$lib/tools/format";

  $: rules = getRulesetConfig($settings.ruleset, $settings.mode);
  $: rerollCost = $settings.ruleset === "2025" && $settings.mode === "7s" ? rules.rerollCost : ($selectedTeam?.rerollCost ?? 0);
  $: apothecaryCost = $settings.ruleset === "2025" && $settings.mode === "7s" ? rules.apothecaryCost : 50000;
</script>

<style>
  table.other-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }

  .other-table th,
  .other-table td {
    border: 1px solid #ccc;
    padding: 0.75rem;
    text-align: center;
  }

  .other-table th {
    background-color: #f2f2f2;
  }

  .other-table button {
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    margin: 0 0.25rem;
  }

  .other-table button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  :global(.dark) .other-table th,
  :global(.dark) .other-table td {
    border-color: #404040;
  }

  :global(.dark) .other-table th {
    background-color: #262626;
    color: #e5e5e5;
  }

  :global(.dark) .other-table td {
    color: #a3a3a3;
  }

  :global(.dark) .other-table button {
    background-color: #2563eb;
    color: white;
  }

  :global(.dark) .other-table button:hover:not(:disabled) {
    background-color: #1d4ed8;
  }

  :global(.dark) .other-table button:disabled {
    background-color: #525252;
    color: #737373;
  }
</style>

<table class="other-table">
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
        <td>{formatCost(rerollCost)}</td>
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
      <td>{formatCost(apothecaryCost)}</td>
      <td>Apothecary</td>
    </tr>
  </tbody>
</table>