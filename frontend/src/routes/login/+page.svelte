<script lang="ts">
  import { onMount } from 'svelte';
  import { login } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let dexUrl = $state('');
  let isDev = $state(false);

  onMount(() => {
    isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    const hash = new URLSearchParams(window.location.hash.substring(1));
    const t = hash.get('id_token');
    if (t) {
      try {
        login(t, JSON.parse(atob(t.split('.')[1])));
        goto('/clusters');
        return;
      } catch {}
    }

    const issuer = '/dex';
    dexUrl =
      issuer +
      '/auth?client_id=cnpg-console&redirect_uri=' +
      encodeURIComponent(location.origin + '/login') +
      '&response_type=id_token&scope=openid+profile+email+groups&nonce=' +
      crypto.randomUUID();
  });

  function devLogin() {
    // Create a minimal fake JWT for local development (kubectl proxy handles real auth)
    const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        name: 'Developer',
        email: 'dev@localhost',
        exp: Math.floor(Date.now() / 1000) + 86400,
      }),
    );
    const token = header + '.' + payload + '.dev';
    login(token, { name: 'Developer', email: 'dev@localhost' });
    goto('/clusters');
  }
</script>

<div class="login-page">
  <div class="login-card">
    <span style="font-size:3rem">🐘</span>
    <h1>CNPG Console</h1>
    <p>Web management for CloudNativePG</p>
    {#if dexUrl}<a href={dexUrl} class="login-btn">Sign in with SSO</a>{:else}<p>Loading...</p>{/if}
    {#if isDev}
      <button class="dev-btn" onclick={devLogin}>Dev Login (kubectl proxy)</button>
      <p class="dev-hint">For local development only. Requires <code>kubectl proxy --port=8001</code></p>
    {/if}
  </div>
</div>

<style>
  .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--cnpg-blue-dark), var(--cnpg-blue)); }
  .login-card { background: #fff; border-radius: 16px; padding: 3rem; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,.25); max-width: 380px; width: 90%; }
  h1 { margin: .5rem 0 .25rem; color: var(--cnpg-blue-dark); }
  p { color: var(--cnpg-gray-500); margin: 0 0 2rem; }
  .login-btn { display: block; padding: .875rem; border-radius: 8px; background: var(--cnpg-teal); color: #fff; text-decoration: none; font-weight: 600; }
  .dev-btn { display: block; width: 100%; padding: .875rem; border-radius: 8px; background: var(--cnpg-gray-700); color: #fff; border: none; font-weight: 600; cursor: pointer; margin-top: .75rem; }
  .dev-hint { font-size: .75rem; color: var(--cnpg-gray-400); margin-top: .75rem; margin-bottom: 0; }
  .dev-hint code { font-family: var(--font-mono); background: var(--cnpg-gray-100); padding: .1rem .3rem; border-radius: 3px; }
</style>
