import nixix from "nixix/vite-plugin";
import path from "path";
import { defineConfig } from "vite";
// @ts-ignore
import viteJsconfigPaths from "vite-jsconfig-paths";

function resolve(string: string) {
  return path.resolve(__dirname, string);
}

export default defineConfig({
  plugins: [
    viteJsconfigPaths(),
    nixix({
      hmr: true,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve("./"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "assets/index.js",
      },
    },
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
});
