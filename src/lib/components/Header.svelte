<script>
  export let onMenu: () => void;
</script>

<header class="p-2 bg-gray-900 flex items-center">
  <button on:click={onMenu}>☰</button>
  <h1 class="ml-2 font-semibold">Blood Bowl Companion</h1>
</header>
