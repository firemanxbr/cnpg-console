<script lang="ts">
  let { open = false, title = '', onclose }: { open: boolean; title: string; onclose: () => void } = $props();
</script>

{#if open}
<div class="overlay" onclick={onclose} role="dialog" aria-modal="true">
  <div class="modal" onclick={(e) => e.stopPropagation()}>
    <div class="modal-header">
      <h3>{title}</h3>
      <button class="close-btn" onclick={onclose} aria-label="Close">&times;</button>
    </div>
    <div class="modal-body">
      {@render children()}
    </div>
  </div>
</div>
{/if}

{#snippet children()}{/snippet}

<style>
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
  .modal { background: #fff; border-radius: 12px; width: 90%; max-width: 560px; max-height: 85vh; overflow-y: auto; box-shadow: 0 25px 50px rgba(0,0,0,.25); }
  .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--cnpg-gray-200); }
  .modal-header h3 { margin: 0; color: var(--cnpg-blue-dark); }
  .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--cnpg-gray-400); padding: 0; line-height: 1; }
  .close-btn:hover { color: var(--cnpg-gray-700); }
  .modal-body { padding: 1.5rem; }
</style>
