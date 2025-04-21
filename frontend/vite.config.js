import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/assets': 'http://localhost:5000',
      '/altImg': 'http://localhost:5000',
    },
  },
  resolve: {
    alias: {
      // Optional: Ensure ESM compatibility
      '@chakra-ui/react': '@chakra-ui/react',
      '@chakra-ui/icons': '@chakra-ui/icons',
    },
  },
});