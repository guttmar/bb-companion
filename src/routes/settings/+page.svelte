<script>
  import { settings } from "$lib/stores/settings";
</script>

<select bind:value={$settings.ruleset}>
  <option value="2016">2016</option>
  <option value="2020">2020</option>
  <option value="2025">2025</option>
</select>
