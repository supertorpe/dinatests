import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/dinatests/api': {
        target: 'http://7bh.com',
        changeOrigin: true
      }
    }
  }
});