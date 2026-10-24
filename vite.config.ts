import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'static-pages-rewrite',
        configureServer(server) {
          server.middlewares.use((req, _res, next) => {
            const staticPages = ['/privacy', '/privacypolicy', '/terms', '/about', '/contact', '/parents-guide', '/games', '/categories', '/articles'];
            const urlPath = req.url ? req.url.split('?')[0] : '';
            if (urlPath && staticPages.includes(urlPath)) {
              req.url = `${urlPath}/index.html`;
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
