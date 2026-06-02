import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { cpSync, existsSync } from 'node:fs'

// Copia assets/images al dist para que las imágenes dinámicas del JSON funcionen en producción
function copyAssetsPlugin() {
  return {
    name: 'copy-project-assets',
    closeBundle() {
      if (existsSync('./assets/images')) {
        cpSync('./assets/images', './dist/assets/images', { recursive: true })
      }
    }
  }
}

export default defineConfig({
  base: './',
  plugins: [vue(), copyAssetsPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
