import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  base: process.env.VITE_BASE_URL, //This needs to be changed to the subdirectory value
  build: {
    // outDir: '../server/public'
    outDir: './dist'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
        scss: {
            additionalData: '@import "./src/assets/styles/variables.scss";',
        },
    },
  }
})
