import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Pages project sites are served below /Baustellenmanager/.
  // The workflow sets this base path during production builds.
  base: process.env.GITHUB_ACTIONS ? "/Baustellenmanager/" : "/",
});
