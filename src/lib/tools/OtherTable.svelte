<script lang="ts">
  import { selectedTeam, currentRoster } from '$lib/stores/roster';
  import { settings } from '$lib/stores/settings';
  import { getRulesetConfig } from '$lib/domain/rulesets';
  import { formatCost } from '$lib/tools/format';

  $: rules = getRulesetConfig($settings.ruleset, $settings.mode);
  $: rerollCost =
    $settings.ruleset === '2025' && $settings.mode === '7s'
      ? rules.rerollCost
      : ($selectedTeam?.rerollCost ?? 0);
  $: apothecaryCost =
    $settings.ruleset === '2025' && $settings.mode === '7s' ? rules.apothecaryCost : 50000;
</script>

<style>
  .other-list {
    width: 100%;
    margin: 1rem 0 0;
    padding: 0;
    list-style: none;
  }

  .other-card {
    display: grid;
    grid-template-columns: minmax(7.25rem, 0.8fr) minmax(0, 2fr);
    margin-bottom: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    background: #fff;
    box-shadow: 0 1px 2px rgb(15 23 42 / 0.08);
    color: #1f2937;
  }

  :global(.dark) .other-card {
    border-color: #374151;
    background: #111827;
    color: #e5e7eb;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.25);
  }

  .other-count-rail {
    display: flex;
    align-items: center;
    min-width: 0;
    padding: 0.75rem 0.125rem 0.75rem 0.5rem;
    border-right: 1px solid #e5e7eb;
    border-radius: 0.7rem 0 0 0.7rem;
    background: #f9fafb;
  }

  :global(.dark) .other-count-rail {
    border-color: #374151;
    background: #1f2937;
  }

  .other-count {
    display: grid;
    grid-template-columns: 2.75rem minmax(0, 1fr) 2.75rem;
    align-items: center;
    width: 100%;
    min-width: 0;
  }

  .other-count-value {
    display: grid;
    grid-column: 2;
    grid-row: 1;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto 1px auto;
    align-items: center;
    justify-items: center;
    min-width: 0;
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
  }

  .other-count-value > :first-child {
    grid-column: 1;
    grid-row: 1;
  }

  .other-count-value > :last-child {
    grid-column: 1;
    grid-row: 3;
  }

  .other-count-divider {
    grid-column: 1;
    grid-row: 2;
    width: 1.25em;
    height: 1px;
    background: #9ca3af;
  }

  :global(.dark) .other-count-divider {
    background: #6b7280;
  }

  .other-count button:first-child {
    grid-column: 1;
    grid-row: 1;
  }

  .other-count button:last-child {
    grid-column: 3;
    grid-row: 1;
  }

  .other-count button {
    min-width: 2.75rem;
    min-height: 2.75rem;
    padding: 0.4rem;
    border: 0;
    border-radius: 0.5rem;
    background: #15803d;
    color: #fff;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
  }

  .other-count button:hover:not(:disabled) {
    background: #166534;
  }

  .other-count button:disabled {
    background: #e5e7eb;
    color: #4b5563;
    cursor: not-allowed;
  }

  :global(.dark) .other-count button {
    background: #15803d;
    color: #fff;
  }

  :global(.dark) .other-count button:hover:not(:disabled) {
    background: #166534;
  }

  :global(.dark) .other-count button:disabled {
    background: #4b5563;
    color: #e5e7eb;
  }

  .other-count button:focus-visible {
    outline: 3px solid #2563eb;
    outline-offset: 2px;
  }

  .other-information {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    min-width: 0;
    padding: 0.75rem;
  }

  .other-name {
    min-width: 0;
    font-weight: 600;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  .other-cost {
    flex: 0 0 auto;
    padding: 0.125rem 0.625rem;
    border-radius: 9999px;
    background: #fef3c7;
    color: #92400e;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  :global(.dark) .other-cost {
    background: rgb(120 53 15 / 0.3);
    color: #fcd34d;
  }

  @media (max-width: 360px) {
    .other-card {
      grid-template-columns: minmax(0, 1fr);
    }

    .other-count-rail {
      border-right: 0;
      border-bottom: 1px solid #e5e7eb;
      border-radius: 0.7rem 0.7rem 0 0;
    }

    :global(.dark) .other-count-rail {
      border-color: #374151;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    .other-count button {
      transition: background-color 120ms ease;
    }
  }
</style>

<ul class="other-list" aria-label="Other roster items">
  <li class="other-card">
    <div class="other-count-rail">
      <div class="other-count">
        <button
          aria-label="Decrease Team Re-rolls count"
          on:click={() =>
            currentRoster.update((roster) => {
              if (roster.reRolls > 0) roster.reRolls--;
              return roster;
            })}
          disabled={$currentRoster.reRolls === 0}>−</button
        >
        <span class="other-count-value" aria-label={`${$currentRoster.reRolls} of 8`}>
          <span>{$currentRoster.reRolls}</span>
          <span class="other-count-divider" aria-hidden="true"></span>
          <span>8</span>
        </span>
        <button
          aria-label="Increase Team Re-rolls count"
          on:click={() =>
            currentRoster.update((roster) => {
              if (roster.reRolls < 8) roster.reRolls++;
              return roster;
            })}>+</button
        >
      </div>
    </div>
    <div class="other-information">
      <div class="other-name">Team Re-rolls</div>
      <span class="other-cost" aria-label={`Cost ${formatCost(rerollCost)}`}>{formatCost(rerollCost)}</span>
    </div>
  </li>
  <li class="other-card">
    <div class="other-count-rail">
      <div class="other-count">
        <button
          aria-label="Decrease Apothecary count"
          on:click={() =>
            currentRoster.update((roster) => {
              if (roster.apothecary > 0) roster.apothecary--;
              return roster;
            })}
          disabled={$currentRoster.apothecary === 0}>−</button
        >
        <span class="other-count-value" aria-label={`${$currentRoster.apothecary} of 1`}>
          <span>{$currentRoster.apothecary}</span>
          <span class="other-count-divider" aria-hidden="true"></span>
          <span>1</span>
        </span>
        <button
          aria-label="Increase Apothecary count"
          on:click={() =>
            currentRoster.update((roster) => {
              if (roster.apothecary < 1) roster.apothecary++;
              return roster;
            })}>+</button
        >
      </div>
    </div>
    <div class="other-information">
      <div class="other-name">Apothecary</div>
      <span class="other-cost" aria-label={`Cost ${formatCost(apothecaryCost)}`}>{formatCost(apothecaryCost)}</span>
    </div>
  </li>
</ul>