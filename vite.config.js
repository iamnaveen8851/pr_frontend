import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["ad26-2405-201-4021-1a06-4f9-9612-eb82-628a.ngrok-free.app"],
  },
});
