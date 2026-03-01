<script>
  import { base } from '$app/paths';
  export let open = false;
</script>

{#if open}
  <nav class="p-4 bg-gray-200 dark:bg-gray-800">
    <a href="{base + '/'}">Home</a><br />
    <a href="{base + '/roster'}">Roster</a><br />
    <a href="{base + '/skills'}">Skills</a><br />
    <a href="{base + '/settings'}">Settings</a>
  </nav>
{/if}
