<script lang="ts">
  let { title = '', subtitle = '' }: { title: string; subtitle?: string } = $props();
</script>

<div class="page-header">
  <div>
    <h2>{title}</h2>
    {#if subtitle}<p class="subtitle">{subtitle}</p>{/if}
  </div>
  <div class="actions">
    {@render children()}
  </div>
</div>

{#snippet children()}{/snippet}

<style>
  .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  h2 { margin: 0; color: var(--cnpg-blue-dark); font-size: 1.5rem; }
  .subtitle { margin: .25rem 0 0; color: var(--cnpg-gray-500); font-size: .875rem; }
  .actions { display: flex; gap: .75rem; }
</style>
