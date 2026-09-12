import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// `npm run build:single` reproduces the old one-file artifact for contexts that
// need it (e-mail attachments, offline demos). The default build emits normal
// chunked, cacheable assets plus one pre-rendered document per locale.
const singleFile = process.env.SINGLE_FILE === "1";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ...(singleFile ? [viteSingleFile()] : [])],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    // Keep asset URLs identical between the client and SSR builds so the
    // pre-rendered markup references files the client build actually emits.
    assetsInlineLimit: 0,
  },
  server: {
    host: true,
    port: 5173,
    // The site is routinely previewed behind reverse proxies (sandboxed
    // hosts, tunnel domains); Vite's default host allow-list rejects those.
    allowedHosts: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
});
