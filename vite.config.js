import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://projetnode1.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/auth": {
        target: "https://projetnode1.onrender.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, "auth"),
      },
    },
  },
});

