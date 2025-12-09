import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Frontend Port
    open: true, // Browser auto-open
    
    // ✅ গুরত্বপূর্ণ: ব্যাকএন্ডের সাথে কানেক্ট করার জন্য Proxy সেটআপ
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // তোমার ব্যাকএন্ড সার্ভারের পোর্ট
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});