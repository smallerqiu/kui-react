import { useState } from "react";
import { ArrowLeft } from "kui-icons";
import { useLocation, useNavigate } from "react-router";
import { useDocs } from "../../context";
import { Button, Layout } from "react-kui";
import AppHeader from "../../components/app-header";
import Demo from "../../components/demo";
import "./style.less";

const defaultSource = `import { Spin } from "react-kui";

export default function App() {
  return <Spin />;
}`;

interface SavedPlayground {
  ts?: string;
  js?: string;
  language?: "ts" | "js";
}

const readSavedPlayground = (): SavedPlayground => {
  try {
    const saved = JSON.parse(sessionStorage.getItem("kui-playground-code") || "{}");
    if (!saved || typeof saved !== "object") return {};
    return {
      ts: typeof saved.ts === "string" ? saved.ts : undefined,
      js: typeof saved.js === "string" ? saved.js : undefined,
      language: saved.language === "js" ? "js" : "ts",
    };
  } catch {
    return {};
  }
};

const savePlayground = (saved: SavedPlayground) => {
  try {
    sessionStorage.setItem("kui-playground-code", JSON.stringify(saved));
  } catch {
    // Editing remains available when browser storage is blocked or full.
  }
};

export default function Playground() {
  const [saved] = useState(readSavedPlayground);
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useDocs();
  const goBack = () => {
    const from: unknown = location.state?.playgroundFrom;
    const target = typeof from === "string" && /^\/(components|guide)\//.test(from)
      ? from : `/guide/components${lang === "en" ? "-en" : ""}`;
    navigate(target, { replace: true });
  };

  return (
    <Layout className="playground-layout">
      <AppHeader leading={
        <Button className="playground-back" type="text" icon={ArrowLeft} onClick={goBack}>
          {lang === "en" ? "Back to docs" : "返回文档"}
        </Button>
      } />
      <main className="playground-page">
        <Demo
          id="playground"
          direction="horizontal"
          toolbar="status"
          defaultLanguage={saved.language || "ts"}
          autoCompile
          source={saved.ts ?? defaultSource}
          javaScriptSource={saved.js ?? defaultSource}
          onSourceChange={savePlayground}
        />
      </main>
    </Layout>
  );
}
