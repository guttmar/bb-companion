<script lang="ts">
  import { rosterValidation } from "$lib/stores/validation";
</script>

{#each $rosterValidation as w}
  <div class="text-sm text-red-400">{w.message}</div>
{/each}
