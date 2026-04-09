import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import http from 'node:http';
import { URL } from 'node:url';

const K8S_TARGET = process.env.K8S_API_URL || 'http://localhost:8001';

function k8sProxy() {
  return {
    name: 'k8s-api-proxy',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url?.startsWith('/api/') || req.url?.startsWith('/apis/')) {
          const target = new URL(req.url, K8S_TARGET);
          const proxyReq = http.request(
            target,
            { method: req.method, headers: req.headers },
            (proxyRes) => {
              res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
              proxyRes.pipe(res);
            },
          );
          proxyReq.on('error', () => {
            res.writeHead(502);
            res.end('K8s API proxy error — is kubectl proxy running?');
          });
          req.pipe(proxyReq);
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [k8sProxy(), sveltekit()],
});
