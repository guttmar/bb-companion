<script lang="ts">
  import { onMount } from "svelte";
  import { tick } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { base } from '$app/paths';
  import RosterTable from "$lib/tools/RosterTable.svelte";
  import OtherTable from "$lib/tools/OtherTable.svelte";
  import RosterWarnings from "$lib/components/RosterWarnings.svelte";
  import { formatCost, formatStat } from "$lib/tools/format";
  import { bb2025Skills, type Skill } from "$lib/data/skills/bb2025";
  import DismissRegular from "fluentui-icons-svelte/DismissRegular.svelte";
  import {
    treasuryLeft,
    currentRoster,
    selectedTeamId,
    selectedStarPlayers,
    teams,
    startingTreasury
  } from "$lib/stores/roster";
  import { settings } from "$lib/stores/settings";
  import { getSavedTeam, saveTeam, updateTeam } from "$lib/stores/savedTeams";

  let teamName = "";
  let saveMessage = "";
  let expandedStarId: string | null = null;
  let openSkill: Skill | null = null;
  // currently-editing saved team id (undefined when creating new)
  export let editingId: string | undefined;
  // keep track of the template that was used when loading the team so
  // we can clear editing state if the user switches to a different base
  let loadedTemplateId: string | undefined;

  let startingTreasuryInput = Math.floor($startingTreasury / 1000);

  $: startingTreasuryInput = Math.floor($startingTreasury / 1000);

  $: totalPlayers = Object.values($currentRoster.players).reduce((sum, count) => sum + count, 0);
  $: totalStars = Object.values($currentRoster.stars ?? {}).reduce((sum, count) => sum + count, 0);

  // derive an array of team ids sorted by the team's display name so the
  // dropdown is alphabetical.  We can't rely on the raw object order since
  // the files defining the teams don't guarantee any particular sorting.
  $: teamIds = Object.keys($teams ?? {}).sort((a, b) => {
    const nameA = $teams?.[a]?.name ?? "";
    const nameB = $teams?.[b]?.name ?? "";
    return nameA.localeCompare(nameB);
  });

  $: if ($selectedTeamId) {
    currentRoster.set({ players: {}, stars: {}, reRolls: 0, apothecary: 0 });
    expandedStarId = null;
  }

  // if the user switches teams while editing a saved roster clear the
  // editing state (otherwise we'd accidentally update a team that no
  // longer matches the template they are working on)
  $: if (loadedTemplateId && $selectedTeamId !== loadedTemplateId) {
    editingId = undefined;
    loadedTemplateId = undefined;
  }

  function handleStartingTreasuryChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const num = parseInt(target.value, 10);
    if (!isNaN(num)) {
      startingTreasury.set(num * 1000);
    }
  }

  function toggleStar(starId: string) {
    expandedStarId = expandedStarId === starId ? null : starId;
  }

  function resolveSkill(name: string): Skill | null {
    const normalized = name.toLowerCase();
    for (const category of bb2025Skills) {
      const skill = category.skills.find(
        (candidate) => candidate.name.toLowerCase() === normalized || candidate.id.toLowerCase() === normalized
      );
      if (skill) return skill;
    }
    return null;
  }

  function showSkill(name: string) {
    const cleanedName = name.replace(/\s*\([^)]*\)\s*/g, '').trim();
    openSkill =
      resolveSkill(cleanedName) ??
      ({
        id: cleanedName,
        name: cleanedName,
        type: 'passive',
        description: 'No description available.'
      } as Skill);
  }

  function closeSkill() {
    openSkill = null;
  }

  onMount(() => {
    const loadId = $page.url.searchParams.get("load");
    if (loadId) {
      const saved = getSavedTeam(loadId);
      if (saved) {
        // set editing state and form fields
        editingId = saved.id;
        teamName = saved.name ?? "";
        if (saved.startingTreasury != null) {
          startingTreasury.set(saved.startingTreasury);
        }
        selectedTeamId.set(saved.selectedTeamId);
        loadedTemplateId = saved.selectedTeamId;
        tick().then(() => {
          currentRoster.set({ ...saved.roster, stars: saved.roster.stars ?? {} });
          const url = new URL($page.url);
          url.searchParams.delete("load");
          goto(url.pathname + url.search, { replaceState: true });
        });
      }
    }
  });

  function handleSave() {
    const payload = {
      name: teamName.trim() || undefined,
      selectedTeamId: $selectedTeamId,
      roster: { ...$currentRoster, stars: { ...$currentRoster.stars } },
      startingTreasury: $startingTreasury
    };

    if (editingId) {
      // update existing record
      updateTeam(editingId, payload);
      saveMessage = "Team updated.";
    } else {
      const id = saveTeam(payload);
      saveMessage = "Team saved.";
    }

    // if we just saved (or updated) clear the name field but keep editingId
    // so the user can continue to tweak without losing context.  if the
    // roster template changes the reactive block below will reset editingId.
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
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
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

  :global(.dark) main p {
    color: #a3a3a3;
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

  .treasury-input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 10rem;
  }

  .treasury-input-container {
    display: flex;
    align-items: center;
  }

  .treasury-input-container span {
    margin-left: 0.5rem;
    font-weight: bold;
    color: inherit; /* match surrounding text color */
  }

  :global(.dark) .team-name-input {
    border-color: #525252;
    background: #262626;
    color: #e5e5e5;
  }

  /* ensure the treasury input unit inherits correct color in dark mode */
  :global(.dark) .treasury-input-container span {
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

  .fixed-header {
    flex-shrink: 0;
    padding: 1rem;
  }

  .summary-bar {
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
  }

  .summary-bar p {
    margin: 0;
  }

  .summary-bar .treasury-summary {
    margin-left: auto;
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
    font-weight: bold;
  }

  .treasury-value {
    min-width: 5ch;
    text-align: right;
  }

  .summary-bar .total-summary {
    font-weight: bold;
  }

  .summary-separator {
    color: #6b7280;
    font-weight: bold;
  }

  :global(.dark) .summary-bar {
    background: #171717;
    border-color: #404040;
  }

  :global(.dark) .summary-separator {
    color: #d1d5db;
  }

  .roster-section {
    margin-bottom: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
  }

  .roster-section summary {
    padding: 0.75rem 1rem;
    cursor: pointer;
    font-size: 1.25rem;
    font-weight: bold;
    color: #333;
  }

  .roster-section-content {
    padding: 0 1rem 1rem;
  }

  .star-table {
    width: 100%;
    border-collapse: collapse;
  }

  .star-table th,
  .star-table td {
    border: 1px solid #ddd;
    padding: 0.5rem;
    text-align: center;
  }

  .star-table th {
    background: #3d8c40;
    color: white;
  }

  .star-row-toggle {
    cursor: pointer;
  }

  .star-cost-toggle {
    text-align: center;
  }

  .star-name-toggle {
    text-align: left;
  }

  .star-row-toggle:hover {
    background: #e6f7ed;
  }

  .star-detail-row td {
    padding: 0.75rem 1rem;
    background: #f8fafc;
    text-align: left;
  }

  .star-profile + .star-profile {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #d1d5db;
  }

  .star-profile p {
    margin: 0.2rem 0;
  }

  .star-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.25rem;
    margin-top: 0.5rem;
  }

  .star-stat {
    min-width: 3.5rem;
    padding: 0.3rem 0.55rem;
    border: 1px solid #93c5fd;
    border-radius: 999px;
    background: #dbeafe;
    color: #172554;
    font-variant-numeric: tabular-nums;
    text-align: center;
  }

  .star-skill-btn {
    margin: 0.15rem;
    padding: 0.25rem 0.45rem;
    border: 1px solid #c7f0d6;
    border-radius: 4px;
    background: transparent;
    color: #064e3b;
    cursor: pointer;
  }

  .star-skill-btn:hover {
    background: #e6f7ed;
  }

  :global(.dark) .star-profile + .star-profile {
    border-color: #404040;
  }

  :global(.dark) .star-stat {
    border-color: #1e3a8a;
    background: #172554;
    color: #fff;
  }

  :global(.dark) .star-row-toggle:hover,
  :global(.dark) .star-detail-row td {
    background: #262626;
  }

  :global(.dark) .star-skill-btn {
    border-color: #14532d;
    color: #86efac;
  }

  .star-table button {
    padding: 0.25rem 0.6rem;
    border: 0;
    border-radius: 4px;
    background: #4caf50;
    color: white;
    cursor: pointer;
  }

  .star-table button:disabled {
    background: #ccc;
    color: #666;
    cursor: not-allowed;
  }

  :global(.dark) .roster-section summary {
    color: #e5e5e5;
  }

  :global(.dark) .roster-section {
    border-color: #404040;
  }

  :global(.dark) .star-table th,
  :global(.dark) .star-table td {
    border-color: #404040;
  }

  :global(.dark) .star-table th {
    background: #166534;
  }

  :global(.dark) .star-table td {
    color: #a3a3a3;
  }

  .scrollable-content {
    flex: 1;
    overflow-y: auto;
    padding: 0 1rem 1rem 1rem;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 10;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: rgb(0 0 0 / 45%);
  }

  .skill-card {
    width: min(32rem, 100%);
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: #f9fafb;
    color: #111827;
  }

  .skill-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .skill-desc {
    margin-top: 0.75rem;
    line-height: 1.5;
    white-space: pre-line;
  }

  .close-icon {
    display: grid;
    width: 2rem;
    height: 2rem;
    place-items: center;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }

  :global(.dark) .skill-card {
    border-color: #404040;
    background: #262626;
    color: #e5e5e5;
  }
</style>

<main>
  <div class="fixed-header">
    <div class="summary-bar">
      <button type="button" class="save-btn" on:click={handleSave}>
        {editingId ? 'Update team' : 'Save team'}
      </button>
      <p class="total-summary">Total players: {totalPlayers}</p>
      {#if totalStars > 0}
        <span class="summary-separator" aria-hidden="true">&middot;</span>
        <p class="total-summary">{totalStars} stars</p>
      {/if}
      <p class="treasury-summary">
        <span>Treasury left:</span>
        <span class="treasury-value">{formatCost($treasuryLeft)}</span>
      </p>
    </div>

    <details class="roster-section">
      <summary>Choose team, name, and starting treasury</summary>
      <div class="roster-section-content">
        <label for="team-select">Choose a team:</label>
        <select id="team-select" bind:value={$selectedTeamId}>
          {#each teamIds as teamId}
            <option value={teamId}>{$teams[teamId].name}</option>
          {/each}
        </select>

        <div class="save-row">
          <label for="team-name">Team name (optional)</label>
          <input
            id="team-name"
            type="text"
            placeholder="My team"
            bind:value={teamName}
            class="team-name-input"
          />
          <label for="starting-treasury">Starting treasury</label>
          <div class="treasury-input-container">
            <input
              id="starting-treasury"
              type="number"
              min="0"
              class="treasury-input"
              value={startingTreasuryInput}
              on:input={handleStartingTreasuryChange}
              placeholder="1000"
            />
            <span>k</span>
          </div>
        </div>
      </div>
    </details>
    {#if saveMessage}
      <p class="save-message">{saveMessage} <a href="{base + '/saved-teams'}">View saved teams</a></p>
    {/if}
  </div>
  <div class="scrollable-content">
    <details class="roster-section" open>
      <summary>Current roster</summary>
      <div class="roster-section-content">
        <RosterTable />
        <RosterWarnings />
      </div>
    </details>

    <details class="roster-section">
      <summary>Star players</summary>
      <div class="roster-section-content">
        {#if $selectedStarPlayers.length}
          <table class="star-table">
            <tbody>
              <tr>
                <th>Count</th>
                <th>Cost</th>
                <th>Name</th>
              </tr>
              {#each $selectedStarPlayers as star}
                <tr>
                  <td>
                    <button
                      type="button"
                      on:click={() => currentRoster.update((roster) => ({
                        ...roster,
                        stars: { ...roster.stars, [star.name]: 0 }
                      }))}
                      disabled={!($currentRoster.stars?.[star.name] ?? 0)}>-</button
                    >
                    <span>{$currentRoster.stars?.[star.name] ?? 0} / 1</span>
                    <button
                      type="button"
                      on:click={() => currentRoster.update((roster) => ({
                        ...roster,
                        stars: { ...roster.stars, [star.name]: 1 }
                      }))}
                      disabled={($currentRoster.stars?.[star.name] ?? 0) >= 1}>+</button
                    >
                  </td>
                  <td
                    class="star-row-toggle star-cost-toggle"
                    role="button"
                    tabindex="0"
                    aria-expanded={expandedStarId === star.id}
                    aria-label={`Expand ${star.name}`}
                    on:click={() => toggleStar(star.id)}
                    on:keydown={(event) => (event.key === 'Enter' || event.key === ' ') && toggleStar(star.id)}
                  >
                    {formatCost(star.cost)}
                  </td>
                  <td
                    class="star-row-toggle star-name-toggle"
                    role="button"
                    tabindex="0"
                    aria-expanded={expandedStarId === star.id}
                    aria-label={`Expand ${star.name}`}
                    on:click={() => toggleStar(star.id)}
                    on:keydown={(event) => (event.key === 'Enter' || event.key === ' ') && toggleStar(star.id)}
                  >
                    {star.name}
                  </td>
                </tr>
                {#if expandedStarId === star.id}
                  <tr class="star-detail-row">
                    <td colspan="3">
                      {#each star.profiles as profile}
                        <div class="star-profile">
                          <div class="star-stats">
                            <span class="star-stat">MA {profile.displayStats.ma}</span>
                            <span class="star-stat">ST {profile.displayStats.st}</span>
                            <span class="star-stat">AG {profile.displayStats.ag}</span>
                            <span class="star-stat">PA {profile.displayStats.pa ?? formatStat(profile.pa, '+')}</span>
                            <span class="star-stat">AV {profile.displayStats.av}</span>
                          </div>
                          <p>
                            {#each profile.skills as skill}
                              <button type="button" class="star-skill-btn" on:click={() => showSkill(skill)}>{skill}</button>
                            {/each}
                          </p>
                        </div>
                      {/each}
                    </td>
                  </tr>
                {/if}
              {/each}
            </tbody>
          </table>
        {:else}
          <p>No star players available.</p>
        {/if}
      </div>
    </details>

    <details class="roster-section">
      <summary>Other</summary>
      <div class="roster-section-content">
        <OtherTable />
      </div>
    </details>
  </div>
</main>

{#if openSkill}
  <div
    class="modal-overlay"
    role="presentation"
    tabindex="-1"
    on:click={(event) => event.target === event.currentTarget && closeSkill()}
    on:keydown={(event) => event.key === 'Escape' && closeSkill()}
  >
    <div class="skill-card" role="dialog" aria-modal="true" aria-label="Skill details">
      <div class="skill-header">
        <strong>{openSkill.name}</strong>
        <button type="button" class="close-icon" on:click={closeSkill} aria-label="Close">
          <DismissRegular />
        </button>
      </div>
      <div class="skill-desc">{openSkill.description}</div>
    </div>
  </div>
{/if}
