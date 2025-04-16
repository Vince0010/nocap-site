import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Optional: Ensure ESM compatibility
      '@chakra-ui/react': '@chakra-ui/react',
      '@chakra-ui/icons': '@chakra-ui/icons',
    },
  },
});