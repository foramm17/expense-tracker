import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/frontend',

  server: {
    port: 3000,
    host: 'localhost',
    hmr: {
      overlay: false,
      clientPort: 3000,
    },
  },

  preview: {
    port: 3001,
    host: 'localhost',
  },

  plugins: [react(), nxViteTsPaths()],

  build: {
    outDir: '../../dist/apps/frontend',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          // Add other large dependencies here
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },

  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },

  optimizeDeps: {
    include: ['react', 'react-dom'],
  },

  css: {
    devSourcemap: true,
  },
});
