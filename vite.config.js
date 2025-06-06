import { defineConfig } from 'vite';
import { resolve } from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

export default defineConfig({
  root: './',
  base: './',
  publicDir: 'static',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        assetFileNames: (assetInfo) => {
          // Keep PDFs in the root of the dist folder
          if (assetInfo.name.endsWith('.pdf')) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
  },
  server: {
    port: 3000,
    hot: true,
    open: true
  },
  plugins: [
    {
      name: 'copy-cname',
      closeBundle: async () => {
        try {
          await fs.copyFile(
            resolve(__dirname, 'public/CNAME'),
            resolve(__dirname, 'dist/CNAME')
          );
        } catch (error) {
          console.warn('Could not copy CNAME file:', error.message);
        }
      }
    }
  ]
});
