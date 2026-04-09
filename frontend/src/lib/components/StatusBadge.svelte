<script lang="ts">
  let { status = '', size = 'sm' }: { status: string; size?: 'sm' | 'md' } = $props();
  const colorMap: Record<string, string> = {
    'Cluster in healthy state': 'green',
    'completed': 'green',
    'available': 'green',
    'running': 'green',
    'ready': 'green',
    'present': 'green',
    'applied': 'green',
    'true': 'green',
    'pending': 'orange',
    'creating': 'orange',
    'Waiting for primary': 'orange',
    'Setting up primary': 'orange',
    'Creating replica': 'orange',
    'failed': 'red',
    'error': 'red',
    'false': 'red',
    'Failing over': 'red',
    'absent': 'gray',
    'suspended': 'gray',
  };
  function getColor(s: string): string {
    if (colorMap[s]) return colorMap[s];
    const lower = s.toLowerCase();
    for (const [key, val] of Object.entries(colorMap)) {
      if (lower.includes(key.toLowerCase())) return val;
    }
    return 'blue';
  }
</script>

<span class="badge {getColor(status)} {size}">{status || 'Unknown'}</span>

<style>
  .badge { display: inline-block; padding: .15rem .5rem; border-radius: 100px; font-weight: 600; text-transform: capitalize; white-space: nowrap; }
  .sm { font-size: .7rem; }
  .md { font-size: .8rem; }
  .green { background: #dcfce7; color: #166534; }
  .orange { background: #fef3c7; color: #92400e; }
  .red { background: #fee2e2; color: #991b1b; }
  .blue { background: #dbeafe; color: #1e40af; }
  .gray { background: #f1f5f9; color: #475569; }
</style>
