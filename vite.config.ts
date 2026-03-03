import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'supabase': path.resolve(__dirname, './supabase'),
      'utils': path.resolve(__dirname, './utils'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'dnd-vendor': ['react-dnd', 'react-dnd-html5-backend'],
          'icons-vendor': ['lucide-react'],
        },
      },
    },
  },
})