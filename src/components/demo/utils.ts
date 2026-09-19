import LZString from "lz-string";

const dependencies = {
  react: "^19.0.0",
  "react-dom": "^19.0.0",
  "react-kui": "latest",
  "kui-icons": "^5.0.0",
  dayjs: "^1.11.0",
};

const packageJson = JSON.stringify(
  {
    type: "module",
    scripts: { dev: "vite" },
    dependencies,
    devDependencies: {
      vite: "^8.0.0",
      "@vitejs/plugin-react": "^6.0.0",
      typescript: "^6.0.0",
    },
  },
  null,
  2,
);

const mainSource = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-kui/style/index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode><App /></StrictMode>,
);`;

const viteConfig = `import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({ plugins: [react()] });`;

const projectFiles = (source: string) => ({
  "package.json": packageJson,
  "index.html":
    '<div id="root" style="padding:24px;"></div><script type="module" src="/src/main.tsx"></script>',
  "src/main.tsx": mainSource,
  "src/App.tsx": source,
  "vite.config.ts": viteConfig,
});

export const openStackBlitz = async (source: string) => {
  const { default: sdk } = await import("@stackblitz/sdk");
  sdk.openProject(
    {
      title: "KUI React Demo",
      description: "KUI React component example",
      template: "node",
      files: projectFiles(source),
    },
    { newWindow: true, openFile: "src/App.tsx", view: "default" },
  );
};

export const openCodeSandbox = (source: string) => {
  const files = Object.fromEntries(
    Object.entries(projectFiles(source)).map(([path, content]) => [path, { content }]),
  );
  const parameters = LZString.compressToBase64(JSON.stringify({ template: "node", files }))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  submitPlaygroundForm("https://codesandbox.io/api/v1/sandboxes/define", "parameters", parameters);
};

export const openCodePen = (source: string) => {
  if (/<\/xmp/i.test(source)) throw new Error("CodePen demo source cannot contain </xmp>");
  const html = `<div id="root" style="padding:24px;"></div><xmp id="app-source" style="display:none">${source}</xmp>`;
  const js = `(async () => {
  const [React, ReactDOM, JSXRuntime, KUI, Icons, Dayjs, Share] = await Promise.all([
    import("https://esm.sh/react@19"),
    import("https://esm.sh/react-dom@19/client"),
    import("https://esm.sh/react@19/jsx-runtime"),
    import("https://esm.sh/react-kui@latest?external=react,react-dom"),
    import("https://esm.sh/kui-icons@latest"),
    import("https://esm.sh/dayjs@1"),
    import("https://esm.sh/react-kui@latest/utils/share?external=react,react-dom"),
  ]);
  const source = document.querySelector("#app-source").textContent.trim();
  const output = Babel.transform(source, {
    filename: "App.tsx",
    presets: [["typescript", { allExtensions: true, isTSX: true }], ["react", { runtime: "automatic" }]],
    plugins: ["transform-modules-commonjs"],
  }).code;
  const module = { exports: {} };
  const modules = {
    react: React,
    "react-dom/client": ReactDOM,
    "react/jsx-runtime": JSXRuntime,
    "react-kui": KUI,
    "react-kui/utils/share": Share,
    "kui-icons": Icons,
    dayjs: Dayjs.default,
    "dayjs/locale/en": {},
  };
  const require = (id) => /\\.(css|less|scss|sass)$/.test(id) ? {} : modules[id];
  new Function("require", "module", "exports", output)(require, module, module.exports);
  ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(module.exports.default));
})();`;
  submitPlaygroundForm(
    "https://codepen.io/pen/define",
    "data",
    JSON.stringify({
      title: "KUI React Demo",
      description: "KUI React component example",
      html,
      js,
      js_pre_processor: "none",
      js_external: "https://unpkg.com/@babel/standalone/babel.min.js",
      css_external: "https://unpkg.com/react-kui@latest/style/index.css",
      editors: "100",
      layout: "left",
    }),
  );
};

function submitPlaygroundForm(action: string, name: string, value: string) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  form.target = "_blank";
  form.rel = "noopener noreferrer";
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  form.remove();
}
