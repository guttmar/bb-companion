<script>
  import { settings } from "$lib/stores/settings";

  let defaultTreasuryInput = Math.floor($settings.treasuryDefaults[$settings.ruleset][$settings.mode] / 1000);

  $: if ($settings.ruleset !== "2025") {
    $settings.mode = "11s";
  }

  $: defaultTreasuryInput = Math.floor(
    $settings.treasuryDefaults[$settings.ruleset][$settings.mode] / 1000
  );

  function handleDefaultTreasuryChange(event) {
    const target = event.currentTarget;
    const num = parseInt(target.value, 10);

    if (!isNaN(num)) {
      settings.update((current) => ({
        ...current,
        treasuryDefaults: {
          ...current.treasuryDefaults,
          [current.ruleset]: {
            ...current.treasuryDefaults[current.ruleset],
            [current.mode]: num * 1000
          }
        }
      }));
    }
  }
</script>

<div class="space-y-4">
  <div>
    <span class="block font-medium text-gray-900 dark:text-gray-100 mb-2">Theme</span>
    <div
      role="group"
      aria-label="Theme"
      class="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 p-0.5"
    >
      <button
        type="button"
        aria-pressed={$settings.theme === 'light'}
        class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-gray-500 {$settings.theme === 'light'
          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}"
        on:click={() => ($settings.theme = 'light')}
      >
        Light
      </button>
      <button
        type="button"
        aria-pressed={$settings.theme === 'dark'}
        class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-gray-500 {$settings.theme === 'dark'
          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}"
        on:click={() => ($settings.theme = 'dark')}
      >
        Dark
      </button>
    </div>
  </div>
  <div>
    <label for="ruleset-select" class="block font-medium text-gray-900 dark:text-gray-100 mb-1">Ruleset</label>
    <select id="ruleset-select" bind:value={$settings.ruleset} class="block w-full max-w-xs p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <option value="2020">2020</option>
      <option value="2025">2025</option>
    </select>
  </div>
  <div>
    <label for="default-treasury" class="block font-medium text-gray-900 dark:text-gray-100 mb-1">
      Default treasury
    </label>
    <div class="flex items-center gap-2">
      <input
        id="default-treasury"
        type="number"
        min="0"
        step="50"
        value={defaultTreasuryInput}
        on:input={handleDefaultTreasuryChange}
        class="block w-full max-w-xs p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      <span class="text-sm text-gray-600 dark:text-gray-300">k</span>
    </div>
    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
      Saved separately for {$settings.ruleset} {$settings.mode}.
    </p>
  </div>
  {#if $settings.ruleset === '2025'}
    <div>
      <span class="block font-medium text-gray-900 dark:text-gray-100 mb-2">Team size</span>
      <label class="inline-flex cursor-pointer items-center gap-3">
        <span class="text-sm text-gray-700 dark:text-gray-300">11s</span>
        <span class="relative inline-flex h-6 w-11 items-center rounded-full border border-gray-300 bg-gray-200 transition-colors dark:border-gray-600 dark:bg-gray-700">
          <input
            type="checkbox"
            checked={$settings.mode === '7s'}
            aria-label="Toggle teams between 11s and 7s"
            class="peer sr-only"
            on:change={(event) => {
              const target = event.currentTarget;
              $settings.mode = target.checked ? '7s' : '11s';
            }}
          />
          <span class="absolute h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5 dark:bg-gray-100"></span>
        </span>
        <span class="text-sm text-gray-700 dark:text-gray-300">7s</span>
      </label>
    </div>
  {/if}
</div>
