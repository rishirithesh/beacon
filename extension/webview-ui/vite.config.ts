import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Single-file, no-hash output so the extension host can reference
// dist/webview/main.js and main.css by a fixed name.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../dist/webview",
    emptyOutDir: true,
    rollupOptions: {
      input: "src/main.tsx",
      output: {
        entryFileNames: "main.js",
        assetFileNames: "main.[ext]",
        format: "iife",
      },
    },
  },
});
