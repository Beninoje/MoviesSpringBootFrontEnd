import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
  base:"/MoviesSpringBootFrontEnd",
  build: {
    // Minimize output errors
    sourcemap: false, // Disable source maps (they can sometimes cause issues)
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore specific warning types if needed
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
          return; // Ignore unused external import warnings
        }
        warn(warning); // Otherwise, log the warning
      },
    },
  },
  
});
