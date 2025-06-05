import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: '/richardsneyd/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    assetsInlineLimit: 0
  },
  server: {
    port: 3000,
    hot: true,
    open: true
  }
});
