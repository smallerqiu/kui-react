import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";

import path from "path";
import { defineConfig } from "vite";
import banner from "./plugins/banner";
import { getLocaleEntries } from "./vite.config";

export default defineConfig({
  publicDir: false,
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), banner()],
  build: {
    outDir: "lib",
    lib: {
      entry: {
        index: path.resolve(__dirname, "components/index.ts"),
        ...getLocaleEntries(),
      },
      name: "kui",
      formats: ["cjs"],
      fileName: (_, entryName) => `${entryName}.js`,
    },
    minify: "terser",
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true },
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-dom/client", "dayjs"],
      output: {
        exports: "named",
        globals: { react: "React", dayjs: "dayjs" },
      },
    },
  },
});
