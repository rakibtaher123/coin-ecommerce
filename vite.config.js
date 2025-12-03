import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // ✅ তুমি চাইলে এখানে custom port দিতে পারো
    open: true, // ✅ server start হলে browser auto-open হবে
  },
  resolve: {
    alias: {
      '@': '/src', // ✅ shortcut import path (e.g. import X from '@/components/X')
    },
  },
  build: {
    outDir: 'dist', // ✅ build output folder
    sourcemap: true, // ✅ debugging এর জন্য sourcemap enable
  },
});
