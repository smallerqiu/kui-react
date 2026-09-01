import {
  createElement,
  lazy,
  Suspense,
  useEffect,
  type ComponentType,
  type ReactNode,
} from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { modal } from "react-kui";
import AppLayout from "./components/app-layout";
import Home from "./views";

type PageModule = { default: ComponentType };
const componentDocs = import.meta.glob<PageModule>("../components/**/index*.md");
const guideDocs = import.meta.glob<PageModule>("./views/**/*.md");
const pages = new Map<string, ReactNode>();
for (const [file, loader] of [...Object.entries(componentDocs), ...Object.entries(guideDocs)]) {
  const isComponent = file.startsWith("../components/");
  const part = isComponent
    ? file.split("/")[2]
    : file.split("/")[2].replace(/\.en_US\.md$|\.md$/g, "");
  const english = file.includes("en_US");
  pages.set(
    `/${isComponent ? "components" : "guide"}/${part}${english ? "-en" : ""}`,
    createElement(lazy(loader)),
  );
}

function RoutedPage() {
  const location = useLocation();
  useEffect(() => () => modal.destroyAll(), [location.pathname]);
  const page = pages.get(location.pathname);
  return page ? (
    <Suspense fallback={<div className="content-inner">Loading...</div>}>{page}</Suspense>
  ) : (
    <Navigate to="/guide/quick-started-en" replace />
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/*"
        element={
          <AppLayout>
            <RoutedPage />
          </AppLayout>
        }
      />
    </Routes>
  );
}
