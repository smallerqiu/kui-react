import { useEffect, useState } from "react";
import { Layout } from "react-kui";
import AppHeader from "../../components/app-header";
import Demo from "../../components/demo/demo";
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
    return JSON.parse(sessionStorage.getItem("kui-playground-code") || "{}") as SavedPlayground;
  } catch {
    return {};
  }
};

export default function Playground() {
  const [saved] = useState(readSavedPlayground);

  useEffect(
    () => () => {
      sessionStorage.removeItem("kui-playground-code");
    },
    [],
  );

  return (
    <Layout className="playground-layout">
      <AppHeader />
      <main className="playground-page">
        <Demo
          id="playground"
          direction="horizontal"
          toolbar="status"
          defaultLanguage={saved.language || "ts"}
          autoCompile
          source={saved.ts || defaultSource}
          javaScriptSource={saved.js || defaultSource}
        />
      </main>
    </Layout>
  );
}
