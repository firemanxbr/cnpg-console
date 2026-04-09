<script lang="ts">
  let { message = 'No items found.', icon = '' }: { message: string; icon?: string } = $props();
</script>

<div class="empty-state">
  {#if icon}<span class="icon">{icon}</span>{/if}
  <p>{message}</p>
</div>

<style>
  .empty-state { text-align: center; padding: 4rem 2rem; color: var(--cnpg-gray-400); }
  .icon { font-size: 3rem; display: block; margin-bottom: 1rem; opacity: .5; }
  p { margin: 0; font-size: .95rem; }
</style>
