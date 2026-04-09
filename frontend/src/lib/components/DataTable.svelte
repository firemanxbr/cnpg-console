<script lang="ts">
  let { columns = [], rows = [], emptyMessage = 'No data.' }: { columns: { key: string; label: string; align?: string }[]; rows: any[]; emptyMessage?: string } = $props();
</script>

{#if !rows.length}
  <div class="empty">{emptyMessage}</div>
{:else}
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          {#each columns as col}<th style:text-align={col.align || 'left'}>{col.label}</th>{/each}
        </tr>
      </thead>
      <tbody>
        {#each rows as row}
          <tr>
            {#each columns as col}<td style:text-align={col.align || 'left'}>{@html row[col.key] ?? '—'}</td>{/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<style>
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
  th { text-align: left; padding: .75rem 1rem; background: var(--cnpg-gray-50); color: var(--cnpg-gray-500); font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; }
  td { padding: .75rem 1rem; border-top: 1px solid var(--cnpg-gray-100); color: var(--cnpg-gray-700); font-size: .875rem; }
  tr:hover td { background: var(--cnpg-gray-50); }
  .empty { text-align: center; padding: 3rem; color: var(--cnpg-gray-400); background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
</style>
