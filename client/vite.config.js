import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // All /api requests in dev get forwarded to the Express server
      "/api": {
        target: "http://localhost:8001",
        changeOrigin: true,
      },
      // Uploaded files served from backend
      "/uploads": {
        target: "http://localhost:8001",
        changeOrigin: true,
      },
    },
  },
});