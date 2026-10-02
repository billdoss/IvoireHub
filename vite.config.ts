import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  // Indispensable pour GitHub Pages : le site est servi depuis
  // https://billdoss.github.io/IvoireHub/ (voir "homepage" dans package.json).
  // Sans ce base, les assets sont resolus depuis /assets/... et la page reste blanche.
  base: "/IvoireHub/",
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
