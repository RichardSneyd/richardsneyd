import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: './',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    },
    emptyOutDir: true,
    assetsDir: 'assets'
  },
  server: {
    port: 3000,
    hot: true,
    open: true
  }
});
