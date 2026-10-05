<script lang="ts">
  import { onMount } from "svelte";
  import { tick } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { base } from '$app/paths';
  import RosterTable from "$lib/tools/RosterTable.svelte";
  import OtherTable from "$lib/tools/OtherTable.svelte";
  import RosterWarnings from "$lib/components/RosterWarnings.svelte";
  import SkillDetailsModal from "$lib/components/SkillDetailsModal.svelte";
  import { formatCost, formatStat } from "$lib/tools/format";
  import type { Skill } from "$lib/data/skills/bb2025";
  import { normalizeSkillName, resolveSkill } from "$lib/tools/skills";
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

  function setStarSelected(starName: string, selected: boolean) {
    currentRoster.update((roster) => ({
      ...roster,
      stars: { ...roster.stars, [starName]: selected ? 1 : 0 }
    }));
  }

  function showSkill(name: string) {
    const cleanedName = normalizeSkillName(name);
    openSkill =
      resolveSkill(cleanedName) ??
      ({
        id: cleanedName,
        name: cleanedName,
        type: 'passive',
        description: 'No description available.'
      } as Skill);
  }

  function showSpecialSkill(name: string, description: string) {
    openSkill = {
      id: name,
      name,
      type: 'passive',
      description
    } as Skill;
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

  .star-list {
    display: grid;
    gap: 1rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .star-card {
    min-width: 0;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    background: #fff;
    box-shadow: 0 1px 2px rgb(15 23 42 / 0.08);
    color: #1f2937;
  }

  :global(.dark) .star-card {
    border-color: #374151;
    background: #111827;
    color: #e5e7eb;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.25);
  }

  .star-card-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
  }

  .star-expand {
    display: flex;
    flex: 1 1 12rem;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font-size: 1.125rem;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
  }

  .star-expand span {
    overflow-wrap: anywhere;
  }

  .star-chevron {
    flex: 0 0 auto;
    width: 1rem;
    font-size: 1.5rem;
    line-height: 1;
    text-align: center;
  }

  .star-cost {
    flex: 0 0 auto;
    padding: 0.125rem 0.625rem;
    border-radius: 9999px;
    background: #fef3c7;
    color: #92400e;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  :global(.dark) .star-cost {
    background: rgb(120 53 15 / 0.3);
    color: #fcd34d;
  }

  .star-switch {
    position: relative;
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    min-height: 2.75rem;
    cursor: pointer;
  }

  .star-switch input {
    position: absolute;
    width: 2.75rem;
    height: 1.75rem;
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }

  .star-switch-track {
    position: relative;
    width: 2.75rem;
    height: 1.5rem;
    border-radius: 9999px;
    background: #9ca3af;
    transition: background-color 120ms ease;
  }

  .star-switch-track::after {
    position: absolute;
    top: 0.125rem;
    left: 0.125rem;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: #fff;
    content: '';
    transition: transform 120ms ease;
  }

  .star-switch input:checked + .star-switch-track {
    background: #15803d;
  }

  .star-switch input:checked + .star-switch-track::after {
    transform: translateX(1.25rem);
  }

  .star-switch input:focus-visible + .star-switch-track,
  .star-expand:focus-visible,
  .star-skill-btn:focus-visible {
    outline: 3px solid #2563eb;
    outline-offset: 3px;
  }

  .star-profile + .star-profile {
    margin-top: 1rem;
    border-top: 1px solid #e5e7eb;
    padding-top: 1rem;
  }

  .star-profile h3 {
    margin: 0 0 0.5rem;
    color: #374151;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .star-profile-content {
    display: grid;
    gap: 0.75rem;
  }

  .star-stats,
  .star-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .star-stat,
  .star-skill-btn {
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
    line-height: 1rem;
  }

  .star-stat {
    border: 1px solid #93c5fd;
    background: #dbeafe;
    color: #172554;
    font-variant-numeric: tabular-nums;
  }

  .star-skill-btn {
    border: 0;
    background: #f3f4f6;
    color: #1f2937;
    cursor: pointer;
  }

  .star-skill-btn:hover {
    background: #e5e7eb;
  }

  :global(.dark) .star-profile + .star-profile {
    border-color: #374151;
  }

  :global(.dark) .star-profile h3 {
    color: #d1d5db;
  }

  :global(.dark) .star-stat {
    border-color: #1e3a8a;
    background: #172554;
    color: #fff;
  }

  :global(.dark) .star-skill-btn {
    background: #374151;
    color: #e5e7eb;
  }

  :global(.dark) .star-skill-btn:hover {
    background: #4b5563;
  }

  :global(.dark) .roster-section summary {
    color: #e5e5e5;
  }

  :global(.dark) .roster-section {
    border-color: #404040;
  }

  .scrollable-content {
    flex: 1;
    overflow-y: auto;
    padding: 0 1rem 1rem 1rem;
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
          <ul class="star-list" aria-label="Available star players">
            {#each $selectedStarPlayers as star (star.id)}
              <li class="star-card">
                <div class="star-card-header">
                  <label class="star-switch">
                    <input
                      type="checkbox"
                      role="switch"
                      aria-label={`Include ${star.name}`}
                      checked={($currentRoster.stars?.[star.name] ?? 0) > 0}
                      on:change={(event) =>
                        setStarSelected(star.name, (event.currentTarget as HTMLInputElement).checked)}
                    />
                    <span class="star-switch-track" aria-hidden="true"></span>
                  </label>
                  <button
                    type="button"
                    class="star-expand"
                    on:click={() => toggleStar(star.id)}
                    aria-expanded={expandedStarId === star.id}
                  >
                    <span class="star-chevron" aria-hidden="true">
                      {expandedStarId === star.id ? '⌄' : '›'}
                    </span>
                    <span>{star.name}</span>
                  </button>
                  <span class="star-cost">{formatCost(star.cost)}</span>
                </div>

                {#if expandedStarId === star.id}
                  {#each star.profiles as profile (profile.name)}
                    <div class="star-profile">
                      {#if profile.name !== star.name}
                        <h3>{profile.name}</h3>
                      {/if}
                      <div class="star-profile-content">
                        <div class="star-stats">
                          <span class="star-stat">MA {profile.displayStats.ma}</span>
                          <span class="star-stat">ST {profile.displayStats.st}</span>
                          <span class="star-stat">AG {profile.displayStats.ag}</span>
                          <span class="star-stat">PA {profile.displayStats.pa ?? formatStat(profile.pa, '+')}</span>
                          <span class="star-stat">AV {profile.displayStats.av}</span>
                        </div>
                        <div class="star-skills">
                          {#each profile.skills as skill, index (skill + index)}
                            <button type="button" class="star-skill-btn" on:click={() => showSkill(skill)}>{skill}</button>
                          {/each}
                          {#each profile.specialSkills as specialSkill (specialSkill.name)}
                            <button type="button" class="star-skill-btn" on:click={() => showSpecialSkill(specialSkill.name, specialSkill.description)}>{specialSkill.name}</button>
                          {/each}
                        </div>
                      </div>
                    </div>
                  {/each}
                {/if}
              </li>
            {/each}
          </ul>
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

<SkillDetailsModal skill={openSkill} on:close={closeSkill} />
