<script lang="ts">
  import { base } from "$app/paths";
  import { settings } from "$lib/stores/settings";
  import { bb2025Skills } from "$lib/data/skills/bb2025";
  import { writable } from "svelte/store";
  import ChevronDownRegular from 'fluentui-icons-svelte/ChevronDownRegular.svelte';
  import ChevronRightRegular from 'fluentui-icons-svelte/ChevronRightRegular.svelte';

  const searchQuery = writable("");
  const expandedCategories = writable(new Set(bb2025Skills.map(category => category.name)));

  function toggleCategory(categoryName: string) {
    expandedCategories.update((expanded) => {
      const newExpanded = new Set(expanded);
      if (newExpanded.has(categoryName)) {
        newExpanded.delete(categoryName);
      } else {
        newExpanded.add(categoryName);
      }
      return newExpanded;
    });
  }
</script>

<main class="max-w-4xl mx-auto px-4 py-6">
  <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skills</h1>

  {#if $settings.ruleset === "2025"}
    <input
      type="text"
      placeholder="Search skills..."
      class="w-full mb-6 p-2 border border-gray-300 rounded-md"
      bind:value={$searchQuery}
    />

    <div class="space-y-10">
      {#each bb2025Skills as category}
        <section>
          <button
            type="button"
            class="flex items-center text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 w-full text-left"
            on:click={() => toggleCategory(category.name)}
          >
            {#if $expandedCategories.has(category.name)}
              <ChevronDownRegular class="mr-2" />
            {:else}
              <ChevronRightRegular class="mr-2" />
            {/if}
            {category.name}
          </button>
          {#if $expandedCategories.has(category.name)}
            <ul class="space-y-4">
              {#each category.skills.filter(skill => skill.name.toLowerCase().includes($searchQuery.toLowerCase())) as skill (skill.id)}
                <li
                  class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm"
                >
                  <div class="flex flex-wrap items-center gap-2 mb-2">
                    <span class="font-medium text-gray-900 dark:text-white">{skill.name}</span>
                    <span
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {skill.type ===
                      'active'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}"
                    >
                      {skill.type}
                    </span>
                    {#if skill.elite}
                      <span
                        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      >
                        Elite
                      </span>
                    {/if}
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {skill.description}
                  </p>
                </li>
              {/each}
            </ul>
          {/if}
        </section>
      {/each}
    </div>
  {:else}
    <div
      class="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-6"
    >
      <p class="text-amber-800 dark:text-amber-200">
        Skills reference is only available for Blood Bowl 2025. Switch to the 2025 ruleset in
        <a href="{base}/settings" class="font-medium underline hover:no-underline">Settings</a>
        to view the skills list.
      </p>
    </div>
  {/if}
</main>
