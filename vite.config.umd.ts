import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";

import path from "path";
import { defineConfig } from "vite";
import banner from "./plugins/banner";

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  publicDir: false,
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), banner()],
  build: {
    outDir: "dist",
    lib: {
      entry: path.resolve(__dirname, "components/index.ts"),
      name: "kui",
      formats: ["umd"],
      fileName: () => "index.js",
    },
    minify: "terser",
    rollupOptions: {
      external: ["react", "dayjs"],
      output: {
        globals: {
          react: "React",
          dayjs: "dayjs",
        },
        exports: "named",
      },
    },
  },
});
