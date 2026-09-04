import clsx from "clsx";
import { CodeJar, type CodeJar as CodeJarInstance } from "codejar";
import dayjs from "dayjs";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import * as Icons from "kui-icons";
import { Copy, ListChevronsDownUp, ListChevronsUpDown, Play, Undo2 } from "kui-icons";
import * as React from "react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import * as ReactKUI from "react-kui";
import { Badge, Button, message, RadioGroup, Tooltip, type BadgeStatusType } from "react-kui";
import * as Share from "react-kui/utils/share";
import { useNavigate } from "react-router";
import * as JSXRuntime from "react/jsx-runtime";
import { transform } from "sucrase";
import Transition from "../../../components/base/transition";
import { CodePen, CodeSandbox, Stackblitz } from "./icons";
import { openCodePen, openCodeSandbox, openStackBlitz } from "./utils";

export interface DemoProps {
  id?: string;
  title?: string;
  descriptionHtml?: string;
  source: string;
  highlightedSource?: string;
  javaScriptSource: string;
  highlightedJavaScriptSource?: string;
  direction?: string;
  toolbar?: "default" | "status";
  defaultLanguage?: "ts" | "js";
  autoCompile?: boolean;
  modules?: Record<string, unknown>;
  children?: ReactNode;
}

type BuildState = { state: BadgeStatusType; text: string };
type CodeLanguage = "ts" | "js";
const emptyRuntimeModules: Record<string, unknown> = {};

interface DemoErrorBoundaryProps {
  children: ReactNode;
  onError: (error: Error) => void;
}

interface DemoErrorBoundaryState {
  failed: boolean;
}

export class DemoErrorBoundary extends React.Component<
  DemoErrorBoundaryProps,
  DemoErrorBoundaryState
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

hljs.registerLanguage("xml", xml);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);

export default function Demo({
  title,
  descriptionHtml,
  source,
  javaScriptSource,
  direction = "horizontal",
  toolbar = "default",
  defaultLanguage = "ts",
  autoCompile = false,
  modules = emptyRuntimeModules,
  children,
}: DemoProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(direction !== "vertical");
  const [preview, setPreview] = useState<ReactNode>(children);
  const [previewKey, setPreviewKey] = useState(0);
  const [buildState, setBuildState] = useState<BuildState>({
    state: "success",
    text: "Editable",
  });
  const [error, setError] = useState("");
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>(defaultLanguage);
  const codeRef = useRef<HTMLDivElement | null>(null);
  const codeJarRef = useRef<CodeJarInstance | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const originalSources = useRef<Record<CodeLanguage, string>>({
    ts: source,
    js: javaScriptSource,
  });
  const draftSources = useRef<Record<CodeLanguage, string>>({
    ts: source,
    js: javaScriptSource,
  });
  const codeLangOptions = [
    { value: "ts", label: "TS" },
    { value: "js", label: "JS" },
  ];

  useEffect(
    () => () => {
      codeJarRef.current?.destroy();
      clearTimeout(timerRef.current);
    },
    [],
  );

  const compile = useCallback(
    (nextSource: string) => {
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
        setPreviewKey((value) => value + 1);
        setError("");
        setBuildState({ state: "success", text: "Build success" });
      } catch (reason) {
        const message = reason instanceof Error ? reason.message : String(reason);
        setError(message);
        setBuildState({ state: "error", text: "Build error" });
      }
    },
    [modules],
  );

  const scheduleCompile = useCallback(
    (language: CodeLanguage, nextSource: string) => {
      draftSources.current[language] = nextSource;
      setBuildState({ state: "default", text: "Building..." });
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => compile(nextSource), 500);
    },
    [compile],
  );

  const handleRenderError = useCallback((reason: Error) => {
    setError(reason.message);
    setBuildState({ state: "error", text: "Build error" });
  }, []);

  useEffect(() => {
    if (autoCompile) compile(draftSources.current[defaultLanguage]);
  }, [autoCompile, compile, defaultLanguage]);

  useEffect(() => {
    const editor = codeRef.current;
    if (!expanded || !editor) return;
    codeJarRef.current?.destroy();
    const language = codeLanguage;
    const jar = CodeJar(
      editor,
      (element) => {
        element.innerHTML = hljs.highlight(element.textContent || "", {
          language: language === "ts" ? "tsx" : "jsx",
        }).value;
      },
      { tab: "  ", spellcheck: false },
    );
    jar.updateCode(draftSources.current[language], false);
    jar.onUpdate((code) => scheduleCompile(language, code));
    codeJarRef.current = jar;
    return () => {
      jar.destroy();
      if (codeJarRef.current === jar) codeJarRef.current = null;
    };
  }, [codeLanguage, expanded, scheduleCompile]);

  const restore = () => {
    const originalSource = originalSources.current[codeLanguage];
    draftSources.current[codeLanguage] = originalSource;
    codeJarRef.current?.updateCode(originalSource);
    compile(originalSource);
  };

  const switchCodeLanguage = (language: CodeLanguage) => {
    if (language === codeLanguage) return;
    clearTimeout(timerRef.current);
    setCodeLanguage(language);
    compile(draftSources.current[language]);
  };

  const copy = async () => {
    const copied = await Share.copyToClipboard(
      codeJarRef.current?.toString() || draftSources.current[codeLanguage],
    );
    if (copied) {
      message.success("Copied!");
    } else {
      message.error("Copy failed");
    }
  };

  const currentSource = () => codeJarRef.current?.toString() || draftSources.current[codeLanguage];
  const reportPlaygroundError = (reason: unknown) => {
    message.error(reason instanceof Error ? reason.message : "Unable to open playground");
  };
  const openPlayground = () => {
    sessionStorage.setItem(
      "kui-playground-code",
      JSON.stringify({
        ts: draftSources.current.ts,
        js: draftSources.current.js,
        language: codeLanguage,
      }),
    );
    navigate("/playground");
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
            <DemoErrorBoundary key={previewKey} onError={handleRenderError}>
              {preview}
            </DemoErrorBoundary>
            {error && <pre className="k-demo-error">{error}</pre>}
          </div>
        </div>
        <Transition show={expanded} name="k-collapse-slide" timeout={300}>
          <div className="k-code-box">
            <div className="k-code-tools" contentEditable={false}>
              <Badge status={buildState.state} text={buildState.text} />
              {toolbar !== "status" && (
                <>
                  <Tooltip title="Open in Playground">
                    <Button type="text" size="small" icon={Play} onClick={openPlayground} />
                  </Tooltip>
                  <Tooltip title="Open in StackBlitz">
                    <Button
                      type="text"
                      size="small"
                      icon={Stackblitz}
                      onClick={() =>
                        void openStackBlitz(currentSource()).catch(reportPlaygroundError)
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Open in CodeSandbox">
                    <Button
                      type="text"
                      size="small"
                      icon={CodeSandbox}
                      onClick={() => {
                        try {
                          openCodeSandbox(currentSource());
                        } catch (reason) {
                          reportPlaygroundError(reason);
                        }
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Open in CodePen">
                    <Button
                      type="text"
                      size="small"
                      icon={CodePen}
                      onClick={() => {
                        try {
                          openCodePen(currentSource());
                        } catch (reason) {
                          reportPlaygroundError(reason);
                        }
                      }}
                    />
                  </Tooltip>
                  <RadioGroup<CodeLanguage>
                    options={codeLangOptions}
                    value={codeLanguage}
                    onChange={(value) => {
                      if (value === "ts" || value === "js") switchCodeLanguage(value);
                    }}
                    type="button"
                    size="small"
                  />
                  <Tooltip title="Copy code">
                    <Button type="text" size="small" icon={Copy} onClick={() => void copy()} />
                  </Tooltip>
                  <Tooltip title="Restore code">
                    <Button type="text" size="small" icon={Undo2} onClick={restore} />
                  </Tooltip>
                </>
              )}
            </div>
            <div ref={codeRef} className="k-code k-scroll hljs" key={codeLanguage} />
          </div>
        </Transition>
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
