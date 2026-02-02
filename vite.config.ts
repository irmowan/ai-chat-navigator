import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';

export default defineConfig({
  plugins: [crx({ manifest })],
  esbuild: {
    target: 'es2020',
  },
  server: {
    port: 5173,
    strictPort: false,
    hmr: {
      port: 5173,
      clientPort: 5173,
    },
    cors: {
      origin: '*',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
