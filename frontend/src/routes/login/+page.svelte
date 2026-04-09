<script lang="ts">
  import { onMount } from 'svelte';
  import { login } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  let dexUrl = $state('');
  onMount(() => {
    const hash = new URLSearchParams(window.location.hash.substring(1));
    const t = hash.get('id_token');
    if (t) { try { login(t, JSON.parse(atob(t.split('.')[1]))); goto('/clusters'); return; } catch {} }
    const issuer = '/dex';
    dexUrl = issuer + '/auth?client_id=cnpg-console&redirect_uri=' + encodeURIComponent(location.origin + '/login') + '&response_type=id_token&scope=openid+profile+email+groups&nonce=' + crypto.randomUUID();
  });
</script>
<div class="login-page">
  <div class="login-card">
    <span style="font-size:3rem">🐘</span>
    <h1>CNPG Console</h1>
    <p>Web management for CloudNativePG</p>
    {#if dexUrl}<a href={dexUrl} class="login-btn">Sign in</a>{:else}<p>Loading…</p>{/if}
  </div>
</div>
<style>
  .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--cnpg-blue-dark), var(--cnpg-blue)); }
  .login-card { background: #fff; border-radius: 16px; padding: 3rem; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,.25); max-width: 380px; width: 90%; }
  h1 { margin: .5rem 0 .25rem; color: var(--cnpg-blue-dark); }
  p { color: var(--cnpg-gray-500); margin: 0 0 2rem; }
  .login-btn { display: block; padding: .875rem; border-radius: 8px; background: var(--cnpg-teal); color: #fff; text-decoration: none; font-weight: 600; }
</style>
