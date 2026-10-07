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

  :global(.dark) .warning {
    border-color: #7f1d1d;
    background-color: #450a0a;
    color: #fecaca;
  }

  .warning.rule-warning {
    border-color: #f59e0b;
    background-color: #fffbeb;
    color: #92400e;
  }

  :global(.dark) .warning.rule-warning {
    border-color: #92400e;
    background-color: #451a03;
    color: #fde68a;
  }
</style>

{#each $rosterValidation as w (w.id)}
  <div class="warning" class:rule-warning={w.level === 'warning'}>{w.message}</div>
{/each}
