import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
export default defineConfig({
  plugins: [sveltekit()],
  server: { proxy: { '/api': { target: 'https://kubernetes.default.svc', changeOrigin: true, secure: false } } }
});
