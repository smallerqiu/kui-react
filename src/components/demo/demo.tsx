import clsx from "clsx";
import { Copy, ListChevronsDownUp, ListChevronsUpDown, Undo2 } from "kui-icons";
import * as Icons from "kui-icons";
import * as React from "react";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import * as JSXRuntime from "react/jsx-runtime";
import * as ReactKUI from "react-kui";
import * as Share from "react-kui/utils/share";
import { Badge, Button, Tooltip, type BadgeStatusType } from "react-kui";
import dayjs from "dayjs";
import { transform } from "sucrase";

export interface DemoProps {
  id?: string;
  title?: string;
  descriptionHtml?: string;
  source: string;
  direction?: string;
  modules?: Record<string, unknown>;
  children?: ReactNode;
}

type BuildState = { state: BadgeStatusType; text: string };

export default function Demo({
  title,
  descriptionHtml,
  source,
  direction = "horizontal",
  modules = {},
  children,
}: DemoProps) {
  const [expanded, setExpanded] = useState(direction !== "vertical");
  const [preview, setPreview] = useState<ReactNode>(children);
  const [buildState, setBuildState] = useState<BuildState>({
    state: "success",
    text: "Editable",
  });
  const [error, setError] = useState("");
  const codeRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const originalSource = useRef(source);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const compile = (nextSource: string) => {
    try {
      const result = transform(nextSource, {
        transforms: ["typescript", "jsx", "imports"],
        jsxRuntime: "automatic",
        production: true,
        filePath: "demo.tsx",
      });
      const module = { exports: {} as Record<string, unknown> };
      const requireModule = (specifier: string): unknown => {
        const builtins: Record<string, unknown> = {
          react: React,
          "react/jsx-runtime": JSXRuntime,
          "react-kui": ReactKUI,
          "react-kui/utils/share": Share,
          "kui-icons": Icons,
          dayjs,
          "dayjs/locale/en": {},
        };
        if (specifier in builtins) return builtins[specifier];
        if (specifier in modules) return modules[specifier];
        if (/\.(?:css|less|scss|sass)$/.test(specifier)) return {};
        throw new Error(`Cannot resolve module: ${specifier}`);
      };
      const execute = new Function("require", "module", "exports", result.code);
      execute(requireModule, module, module.exports);
      const component = module.exports.default as ComponentType | undefined;
      if (!component) throw new Error("The demo must export a default React component.");
      setPreview(React.createElement(component));
      setError("");
      setBuildState({ state: "success", text: "Build success" });
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : String(reason);
      setError(message);
      setBuildState({ state: "error", text: "Build error" });
    }
  };

  const scheduleCompile = () => {
    setBuildState({ state: "default", text: "Building..." });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => compile(codeRef.current?.innerText || ""), 500);
  };

  const restore = () => {
    if (codeRef.current) codeRef.current.textContent = originalSource.current;
    compile(originalSource.current);
  };

  const copy = async () => {
    await Share.copyToClipboard(codeRef.current?.innerText || originalSource.current);
  };

  return (
    <section className={clsx("markdown-body", "k-demo-container", { "k-demo-expanded": expanded })}>
      <div className="k-desc">
        <div className="k-desc-content">
          <h3>{title}</h3>
          {descriptionHtml && <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />}
        </div>
      </div>
      <div className={clsx("k-demo", { "k-demo-horizontal": direction === "horizontal" })}>
        <div className={`k-demo-view k-demo-view-${direction}`}>
          <div className="k-content k-scroll">
            {preview}
            {error && <pre className="k-demo-error">{error}</pre>}
          </div>
        </div>
        {expanded && (
          <div className="k-code-box">
            <div className="k-code-tools" contentEditable={false}>
              <Badge status={buildState.state} text={buildState.text} />
              <Tooltip title="Copy code">
                <Button type="text" size="small" icon={Copy} onClick={() => void copy()} />
              </Tooltip>
              <Tooltip title="Restore code">
                <Button type="text" size="small" icon={Undo2} onClick={restore} />
              </Tooltip>
            </div>
            <pre
              className="k-code k-scroll"
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              onInput={scheduleCompile}
            >
              <code ref={codeRef}>{source}</code>
            </pre>
          </div>
        )}
        {direction !== "horizontal" && (
          <div className="k-code-actions">
            <Button
              block
              size="large"
              type="text"
              icon={expanded ? ListChevronsDownUp : ListChevronsUpDown}
              onClick={() => setExpanded((value) => !value)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
