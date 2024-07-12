import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // base: '/sample-ui/',
  server: {
    proxy: {
      // '^/.*': {
      //   target: 'https://unified-dev.digit.org', // Backend server URL for egov-mdms-service
      //   changeOrigin: true,
      //   // rewrite: (path) => path.replace(/^\/egov-mdms-service/, '/egov-mdms-service'), // Path rewrite if needed
      //   secure: false,
      // },
      '/egov-mdms-service': {
        target: 'https://unified-dev.digit.org', // Backend server URL for egov-mdms-service
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/egov-mdms-service/, '/egov-mdms-service'), // Path rewrite if needed
        secure: false,
      },
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
});


