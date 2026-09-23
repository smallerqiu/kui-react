import {
  createElement,
  lazy,
  Suspense,
  useEffect,
  type ComponentType,
  type ReactNode,
} from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { modal, Skeleton } from "react-kui";
import { useDocs } from "./context";
import AppLayout from "./components/app-layout";
import Home from "./views";
import Playground from "./views/playground";
import { withRouteLoading } from "./utils/route-loading";

type PageModule = { default: ComponentType };
const componentDocs = import.meta.glob<PageModule>("../components/**/index*.md");
const guideDocs = import.meta.glob<PageModule>("./views/**/*.md");
const pages = new Map<string, ReactNode>();
for (const [file, loader] of [...Object.entries(componentDocs), ...Object.entries(guideDocs)]) {
  const isComponent = file.startsWith("../components/");
  const part = isComponent
    ? file.split("/").at(-2)!
    : file.split("/")[2].replace(/\.en_US\.md$|\.md$/g, "");
  const english = file.includes("en_US");
  pages.set(
    `/${isComponent ? "components" : "guide"}/${part}${english ? "-en" : ""}`,
    createElement(lazy(withRouteLoading(loader))),
  );
}

function RoutedPage() {
  const location = useLocation();
  useEffect(() => () => modal.destroyAll(), [location.pathname]);
  const page = pages.get(location.pathname);
  return page ? (
    <Suspense fallback={<RouteLoading />}>{page}</Suspense>
  ) : (
    <Navigate to="/guide/quick-started-en" replace />
  );
}

function RouteLoading() {
  const { lang } = useDocs();
  return (
    <div
      className="docs-page-skeleton"
      role="status"
      aria-label={lang === "en" ? "Loading documentation" : "正在加载文档"}
      aria-busy="true"
    >
      <div aria-hidden="true">
        <Skeleton loading animated delay={0} titleWidth={28} rows={2} />
        <div className="docs-page-skeleton-section">
          <Skeleton loading animated delay={0} titleWidth={18} rows={1} />
          <div className="docs-page-skeleton-demo">
            <Skeleton loading animated delay={0} titleWidth={0} rows={4} />
          </div>
        </div>
        <div className="docs-page-skeleton-section">
          <Skeleton loading animated delay={0} titleWidth={22} rows={3} />
        </div>
      </div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/playground" element={<Playground />} />
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
