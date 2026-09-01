import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'node:path';

export default defineConfig({
  root: resolve(__dirname, 'src/pages'),
  plugins: [svelte()],
  publicDir: false,
  build: {
    outDir: resolve(__dirname, 'public'),
    emptyOutDir: false,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/pages/index.html'),
        blog: resolve(__dirname, 'src/pages/blog.html'),
        contact: resolve(__dirname, 'src/pages/contact.html'),
        projects: resolve(__dirname, 'src/pages/projects/index.html'),
        'projects/other': resolve(__dirname, 'src/pages/projects/other.html'),
        'projects/palladia-engine': resolve(__dirname, 'src/pages/projects/palladia-engine.html'),
        'projects/piru': resolve(__dirname, 'src/pages/projects/piru.html'),
        'projects/portfolio': resolve(__dirname, 'src/pages/projects/portfolio.html'),
        'projects/sd-runpod': resolve(__dirname, 'src/pages/projects/sd-runpod.html'),
        'projects/math': resolve(__dirname, 'src/pages/projects/math.html'),
        'School/UCM/USTU-092/Milestone1': resolve(__dirname, 'src/pages/School/UCM/USTU-092/Milestone1.html'),
      },
      output: { assetFileNames: 'dist/[name][extname]' },
    },
  },
});
