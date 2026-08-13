import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import banner from "./plugins/banner/index.ts";
export const getLocaleEntries = () => {
  const localePath = path.resolve(import.meta.dirname, "components/locale");
  if (!fs.existsSync(localePath)) return {};
  const files = fs.readdirSync(localePath);
  const entries: Record<string, string> = {};
  files.forEach((file) => {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      const name = file.replace(/\.(ts|js)$/, "");
      entries[`locale/${name}`] = path.resolve(import.meta.dirname, `components/locale/${file}`);
    }
  });
  return entries;
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    dts({
      // The repository still contains legacy React documentation examples. They
      // are not library sources and must not make the declaration generator
      // switch to its React processor.
      processor: "ts",
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.app.json",
      outDirs: "./types/",
      entryRoot: path.resolve(import.meta.dirname, "components"),
      exclude: ["node_modules/**", "src/**", "plugins"],
      include: ["components/**/*.ts", "components/**/*.tsx"],
    }),
    banner(),
  ],
  build: {
    outDir: "es",
    lib: {
      entry: {
        index: path.resolve(import.meta.dirname, "components/index.ts"),
        ...getLocaleEntries(),
      },
      formats: ["es"],
      fileName: (_, entryName) => `${entryName}.js`,
    },
    minify: false,
    rollupOptions: {
      external: [
        "react",
        "react/compiler-runtime",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-dom",
        "react-dom/client",
        "dayjs",
      ],
      output: {
        exports: "named",
        globals: { react: "React", dayjs: "dayjs" },
      },
    },
  },
});
