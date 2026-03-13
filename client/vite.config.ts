import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import tailwindcss from '@tailwindcss/vite';
// @ts-expect-error JS config module has no declaration file
import API_URL from './src/api/config.js';

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      tailwindcss(),
      react(),
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: 'electron/main.ts',
        },
        {
          entry: 'electron/preload.ts',
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
            // instead of restarting the entire Electron App.
            options.reload();
          },
        },
      ]),
      renderer(),
    ],
    server: {
      proxy: {
        '/api': { target: API_URL, changeOrigin: true },
      },
    },
  };
});
