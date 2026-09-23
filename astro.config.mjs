// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    server: {
      proxy: {
        '/auth': {
          target: 'http://localhost:8001',
          changeOrigin: true,
        },
        '/api': {
          target: 'http://localhost:8001',
          changeOrigin: true,
        },
        '/constructoras': {
          target: 'http://localhost:8001',
          changeOrigin: true,
        },
        '/terminos': {
          target: 'http://localhost:8001',
          changeOrigin: true,
        },
      },
    },
  },
});