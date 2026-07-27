import fs from "fs";
import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import path from "path";
import { type Plugin } from "vite";

export default function vitePluginKuiMd(): Plugin {
  const markdown: MarkdownIt = new MarkdownIt({
    html: true,
    breaks: true,
    highlight: (code: string, lang: string) => {
      if (lang && hljs.getLanguage(lang)) {
        return `<pre><code class="hljs language-${lang}">${hljs.highlight(code, { language: lang }).value}</code></pre>`;
      }
      return `<pre><code class="hljs">${markdown.utils.escapeHtml(code)}</code></pre>`;
    },
  }).use(anchor, {
    level: 2,
    slugify: (string: string) => string.toLocaleLowerCase().trim().split(" ").join("-"),
    permalink: anchor.permalink.headerLink(),
    permalinkClass: "anchor",
    permalinkSymbol: "#",
    permalinkBefore: false,
  });

  return {
    name: "vite-plugin-kui-md",
    enforce: "pre",

    transform(code, id) {
      if (!id.endsWith(".md")) return null;

      const liveDemos: Array<{ component: string; title: string; source: string }> = [];

      const demoReg = /\[(.*?)\]\((.*?\.vue)(?:\?show=(.*?))?\)\s*\n((?:\s*-\s+.*(?:\n|$))+)/g;

      let processedMarkdown = code.replace(
        demoReg,
        (_, title, src, _direction = "horizontal", descBlock) => {
          const absolutePath = path.resolve(path.dirname(id), src);
          const demoCode = fs.readFileSync(absolutePath, "utf-8").trim();
          const highlighted = hljs.highlight(demoCode, { language: "html" }).value;
          const renderedDescription = markdown.render(descBlock.replace(/-/g, ""));
          return `<section class="markdown-body k-demo-container"><div class="k-desc"><div class="k-desc-content"><h3>${markdown.utils.escapeHtml(title)}</h3>${renderedDescription}</div></div><div class="k-code-box"><pre><code class="hljs language-html">${highlighted}</code></pre></div></section>`;
        }
      );

      const jsxReg = /\[(.*?)\]\((.*?\.tsx)\)/g;
      processedMarkdown = processedMarkdown.replace(jsxReg, (_, title, src) => {
        const absolutePath = path.resolve(path.dirname(id), src);
        const index = liveDemos.length;
        liveDemos.push({ component: src, title, source: fs.readFileSync(absolutePath, "utf-8") });
        return `KUI_LIVE_DEMO_${index}`;
      });

      // fs.writeFileSync(path.join(__dirname, "demo.md"), processedMarkdown);
      const mainHtml = markdown.render(processedMarkdown);
      const parts = mainHtml.split(/KUI_LIVE_DEMO_(\d+)/g);
      const imports = liveDemos.map((demo, index) => `import LiveDemo${index} from ${JSON.stringify(demo.component)};`).join("\n");
      const children = parts.map((part, index) => index % 2 === 0
        ? `createElement("div", { key: ${index}, dangerouslySetInnerHTML: { __html: ${JSON.stringify(part)} } })`
        : `createElement(Demo, { key: ${index}, title: ${JSON.stringify(liveDemos[Number(part)].title)}, source: ${JSON.stringify(liveDemos[Number(part)].source)} }, createElement(LiveDemo${Number(part)}))`
      ).join(",\n");
      const result = `import { createElement } from "react";
import Demo from "/src/components/demo/demo.tsx";
${imports}
export default function MarkdownPage() {
  return createElement("div", { className: "markdown-body" }, ${children});
}`;
      return { code: result, map: null };
    },
  };
}
