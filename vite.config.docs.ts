import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import banner from "./plugins/banner";
import reactMarkdown from "./plugins/markdown";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  console.log("isProd:", isProd);
  return {
    define: {
      // VITE_APP_VERSION: 111,
    },
    server: {
      port: 7006,
    },
    plugins: [reactMarkdown(), react(), babel({ presets: [reactCompilerPreset()] }), banner()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "/"),
        "kui-react": path.resolve(__dirname, "./components"),
        // "kui-icons": `${import.meta.env.VITE_APP_IMPORT_URL}/js/kui-icons.esm.js`,
      },
      extensions: [".js", ".ts", ".jsx", ".tsx", ".json", "md"],
    },
    build: {
      outDir: "docs",
      sourcemap: false,
      minify: "terser",
      rollupOptions: {
        output: {
          entryFileNames: "js/[name]-[hash].js",
          chunkFileNames: "js/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith(".css")) {
              return "css/[name]-[hash][extname]";
            }
            if (assetInfo.name && /\.(png|jpe?g|gif|svg|webp|avif|ico)$/.test(assetInfo.name)) {
              return "img/[name]-[hash][extname]";
            }
            if (assetInfo.name && /\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
              return "fonts/[name]-[hash][extname]";
            }
            return "assets/[name]-[hash][extname]";
          },
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("kui-icons")) return "ui-icons";
              if (id.includes("react-kui")) return "ui-lib";
              if (id.includes("react")) return "react";
              if (id.includes("dayjs")) return "dayjs";
              if (id.includes("react-router")) return "react-vendor";
            }
          },
        },
      },
    },
    optimizeDeps: {
      exclude: ["kui-react"],
    },
  };
});
