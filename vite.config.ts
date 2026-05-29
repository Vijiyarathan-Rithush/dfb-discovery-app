import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/dfb-discovery-app/',
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: (source: string, filename: string) => {
          if (/[\\/]_(tokens|mixins)\.scss$/.test(filename)) return source
          return `@use '/src/styles/tokens';\n@use '/src/styles/mixins';\n${source}`
        },
      },
    },
  },
})