<script lang="ts">
  import { rosterValidation } from "$lib/stores/validation";
</script>

<style>
  .warning {
    padding: 0.5rem;
    margin: 0.5rem 0;
    border: 1px solid #f5c6cb;
    background-color: #f8d7da;
    color: #721c24;
    border-radius: 4px;
    font-size: 0.9rem;
  }
</style>

{#each $rosterValidation as w}
  <div class="warning">{w.message}</div>
{/each}
