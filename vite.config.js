import { defineConfig } from 'vite';
import { splitVendorChunkPlugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    sourcemap: true
  },
  plugins: [
    splitVendorChunkPlugin(),
    VitePWA({
      manifestFilename: 'manifest.json',
      includeAssets: ['*','*/*','*/*/*'],
      manifest: {
        name: 'Dinatests',
        short_name: 'dinatests',
        description: 'Dinatests',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'assets/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'assets/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'assets/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/dinatests/api': {
        target: 'http://7bh.com',
        changeOrigin: true
      }
    }
  }
});