<script>
  import { base } from '$app/paths';
  export let open = false;
</script>

{#if open}
  <nav class="p-4 bg-gray-200 dark:bg-gray-800">
    <a href="{base + '/'}" use:link>Home</a><br />
    <a href="{base + '/roster'}" use:link>Roster</a><br />
    <a href="{base + '/skills'}" use:link>Skills</a><br />
    <a href="{base + '/settings'}" use:link>Settings</a>
  </nav>
{/if}
