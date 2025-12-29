<script>
  export let open = false;
</script>

{#if open}
  <nav class="p-4 bg-gray-800">
    <a href="/">Home</a><br />
    <a href="/roster">Roster</a><br />
    <a href="/skills">Skills</a><br />
    <a href="/settings">Settings</a>
  </nav>
{/if}
