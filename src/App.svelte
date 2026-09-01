<script lang="ts">
  import type { Component } from 'svelte';
  import Nav from './lib/Nav.svelte';

  let { Page }: { Page: Component } = $props();
</script>

<Nav />
<Page />
