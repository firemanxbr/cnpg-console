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

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') oncancel();
  }
</script>

<svelte:window onkeydown={open ? handleKeydown : undefined} />

{#if open}
<div class="overlay" role="presentation">
  <button class="overlay-btn" onclick={oncancel} aria-label="Close dialog" tabindex="-1"></button>
  <div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-msg">
    <h3 id="confirm-title">{title}</h3>
    <p id="confirm-msg">{message}</p>
    <div class="actions">
      <button class="btn-cancel" onclick={oncancel}>Cancel</button>
      <button class="btn-confirm" class:danger onclick={onconfirm}>{confirmLabel}</button>
    </div>
  </div>
</div>
{/if}

<style>
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
  .overlay-btn { position: absolute; inset: 0; width: 100%; height: 100%; background: transparent; border: none; cursor: default; }
  .dialog { background: #fff; border-radius: 12px; padding: 1.5rem; max-width: 420px; width: 90%; box-shadow: 0 25px 50px rgba(0,0,0,.25); position: relative; z-index: 1; }
  h3 { margin: 0 0 .5rem; color: var(--cnpg-blue-dark); }
  p { margin: 0 0 1.5rem; color: var(--cnpg-gray-600); line-height: 1.5; }
  .actions { display: flex; gap: .75rem; justify-content: flex-end; }
  .btn-cancel { padding: .5rem 1rem; border-radius: 6px; border: 1px solid var(--cnpg-gray-300); background: #fff; cursor: pointer; color: var(--cnpg-gray-700); }
  .btn-confirm { padding: .5rem 1rem; border-radius: 6px; border: none; background: var(--cnpg-teal); color: #fff; font-weight: 600; cursor: pointer; }
  .btn-confirm.danger { background: var(--cnpg-red); }
</style>
