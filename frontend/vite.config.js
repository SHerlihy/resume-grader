import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
    //allow to level await for pdf webworker
    optimizeDeps: {
   esbuildOptions: {
     target: 'esnext'
   }
 },
  build: {
    target: 'esnext'
  },
})
