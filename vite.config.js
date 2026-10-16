import fs from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// On Windows the project folder can be redirected (e.g. packaged-app AppData), so
// dependency files resolve to a different real path. Allow both spellings.
const root = process.cwd();
let realRoot = root;
try {
  realRoot = fs.realpathSync.native(root);
} catch {
  /* keep cwd */
}

export default defineConfig({
  // GitHub Pages serves the project under /<repo>/; local dev and other hosts use "/".
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  server: {
    fs: { allow: [...new Set([root, realRoot])] },
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Shared vendors get their own long-cached chunks; each site stays a lazy chunk.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|cookie|set-cookie-parser)[\\/]/.test(id)) return 'react';
          if (/[\\/]node_modules[\\/](gsap|@gsap)[\\/]/.test(id)) return 'gsap';
          if (/[\\/]node_modules[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) return 'motion';
        },
      },
    },
  },
});
