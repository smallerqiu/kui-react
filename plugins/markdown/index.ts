import fs from "fs";
import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import path from "path";
import { type Plugin } from "vite";

interface LiveDemo {
  component: string;
  title: string;
  source: string;
  highlightedSource: string;
  direction: string;
  description: string;
  localModules: string[];
}

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
    slugify: (value: string) => value.toLocaleLowerCase().trim().split(" ").join("-"),
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

      const liveDemos: LiveDemo[] = [];
      const demoReg = /\[(.*?)\]\((.*?\.tsx)(\?[^)]*)?\)(?:\s*\n((?:\s*-\s+.*(?:\n|$))+))?/g;
      const processedMarkdown = code.replace(
        demoReg,
        (_, title: string, src: string, query = "", descBlock = "") => {
          const absolutePath = path.resolve(path.dirname(id), src);
          const source = fs.readFileSync(absolutePath, "utf-8");
          const highlightedSource = hljs.highlight(source, { language: "tsx" }).value;
          const show = new URLSearchParams(query.replace(/^\?/, "")).get("show");
          const direction = show === "vertical" ? "vertical" : "horizontal";
          const localModules = Array.from(
            source.matchAll(/(?:from\s+|import\s+)["'](\.[^"']+)["']/g),
            (match) => match[1]
          ).filter((specifier, index, list) => list.indexOf(specifier) === index);
          const description = descBlock ? markdown.render(descBlock.replace(/^\s*-\s?/gm, "")) : "";
          const index = liveDemos.length;
          liveDemos.push({
            component: src,
            title,
            source,
            highlightedSource,
            direction,
            description,
            localModules,
          });
          return `\n\n<!--KUI_LIVE_DEMO_${index}-->\n\n`;
        }
      );

      const mainHtml = markdown.render(processedMarkdown);
      const parts = mainHtml.split(/<!--KUI_LIVE_DEMO_(\d+)-->/g);
      const componentImports = liveDemos
        .map((demo, index) => `import LiveDemo${index} from ${JSON.stringify(demo.component)};`)
        .join("\n");
      const moduleImports: string[] = [];
      liveDemos.forEach((demo, demoIndex) => {
        demo.localModules.forEach((specifier, moduleIndex) => {
          if (/\.(?:css|less|scss|sass)$/.test(specifier)) return;
          const joinedSpecifier = path.posix.join(path.posix.dirname(demo.component), specifier);
          const resolvedSpecifier = joinedSpecifier.startsWith(".")
            ? joinedSpecifier
            : `./${joinedSpecifier}`;
          moduleImports.push(
            `import * as LiveDemo${demoIndex}Module${moduleIndex} from ${JSON.stringify(resolvedSpecifier)};`
          );
        });
      });
      const moduleMaps = liveDemos.map((demo, demoIndex) => {
        const entries = demo.localModules.map((specifier, moduleIndex) => {
          const value = /\.(?:css|less|scss|sass)$/.test(specifier)
            ? "{}"
            : `LiveDemo${demoIndex}Module${moduleIndex}`;
          return `${JSON.stringify(specifier)}: ${value}`;
        });
        return `{ ${entries.join(", ")} }`;
      });
      const children = parts
        .flatMap((part, index) => {
          if (index % 2 === 0) {
            if (!part.trim()) return [];
            return [`createElement(Fragment, { key: ${index} }, parse(${JSON.stringify(part)}))`];
          }
          const demoIndex = Number(part);
          const demo = liveDemos[demoIndex];
          return [
            `createElement(Demo, {
            key: ${index},
            id: ${JSON.stringify(`${path.basename(id, ".md")}-${demoIndex}`)},
            title: ${JSON.stringify(demo.title)},
            descriptionHtml: ${JSON.stringify(demo.description)},
            source: ${JSON.stringify(demo.source)},
            highlightedSource: ${JSON.stringify(demo.highlightedSource)},
            direction: ${JSON.stringify(demo.direction)},
            modules: ${moduleMaps[demoIndex]}
          }, createElement(LiveDemo${demoIndex}))`,
          ];
        })
        .join(",\n");
      const result = `import parse from "html-react-parser";
import { createElement, Fragment } from "react";
import Demo from "/src/components/demo";
${componentImports}
${moduleImports.join("\n")}
export default function MarkdownPage() {
  return createElement("div", { className: "markdown-body" }, ${children});
}`;
      return { code: result, map: null };
    },
  };
}
