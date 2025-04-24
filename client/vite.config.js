// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // URL where your Express/Node backend runs
        changeOrigin: true,              // sets Host header to match the target
        secure: false                    // allow self‑signed HTTPS; safe for local dev
        // No rewrite needed because we want to keep the /api prefix
      }
    }
  },
  plugins: [react()]
});
