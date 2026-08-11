import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// إعداد Vite: بيبني المشروع كملفات static داخل مجلد dist
// وده اللي Capacitor بيغلفه جوه تطبيق الأندرويد
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
