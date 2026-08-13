import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "react-kui": path.resolve(import.meta.dirname, "components"),
      "kui-icons": path.resolve(import.meta.dirname, "node_modules/kui-icons/dist/kui-icons.esm.js"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    restoreMocks: true,
  },
});
