<script lang="ts">
  let {
    open = false,
    title = 'Confirm',
    message = 'Are you sure?',
    confirmLabel = 'Confirm',
    danger = false,
    onconfirm,
    oncancel,
  }: {
    open: boolean;
    title?: string;
    message: string;
    confirmLabel?: string;
    danger?: boolean;
    onconfirm: () => void;
    oncancel: () => void;
  } = $props();
</script>

{#if open}
<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
<div class="overlay" onclick={oncancel} role="dialog" aria-modal="true" tabindex="-1">
  <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
  <div class="dialog" onclick={(e) => e.stopPropagation()}>
    <h3>{title}</h3>
    <p>{message}</p>
    <div class="actions">
      <button class="btn-cancel" onclick={oncancel}>Cancel</button>
      <button class="btn-confirm" class:danger onclick={onconfirm}>{confirmLabel}</button>
    </div>
  </div>
</div>
{/if}

<style>
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
  .dialog { background: #fff; border-radius: 12px; padding: 1.5rem; max-width: 420px; width: 90%; box-shadow: 0 25px 50px rgba(0,0,0,.25); }
  h3 { margin: 0 0 .5rem; color: var(--cnpg-blue-dark); }
  p { margin: 0 0 1.5rem; color: var(--cnpg-gray-600); line-height: 1.5; }
  .actions { display: flex; gap: .75rem; justify-content: flex-end; }
  .btn-cancel { padding: .5rem 1rem; border-radius: 6px; border: 1px solid var(--cnpg-gray-300); background: #fff; cursor: pointer; color: var(--cnpg-gray-700); }
  .btn-confirm { padding: .5rem 1rem; border-radius: 6px; border: none; background: var(--cnpg-teal); color: #fff; font-weight: 600; cursor: pointer; }
  .btn-confirm.danger { background: var(--cnpg-red); }
</style>
