import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SPA middleware plugin
const spaFallback = {
  name: 'spa-fallback',
  apply: 'serve',
  enforce: 'post',
  handle: 'pre',
  configResolved() {},
  resolveId(id) {
    return undefined;
  },
  load(id) {
    return undefined;
  },
  async transform(code, id) {
    return null;
  },
  configureServer(server) {
    return () => {
      server.middlewares.use((req, res, next) => {
        // If request doesn't have a dot (file extension) and isn't api/static, serve index.html
        if (!req.url.includes('.') && !req.url.startsWith('/api/')) {
          req.url = '/index.html';
        }
        next();
      });
    };
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile(), spaFallback],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
