import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { useMemo } from "react";
import { BrowserRouter } from "react-router";
import { ConfigProvider } from "react-kui";
import uiEn from "react-kui/locale/en";
import uiZh from "react-kui/locale/zh-CN";
import { DocsContext } from "./context";
import localEn from "./lang/en";
import localZh from "./lang/zh";
import AppRouter from "./router";
import { localizeDocsPath, resolveDocsLanguage } from "./docs-language";

const read = (object: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((value, key) => {
    if (typeof value !== "object" || value === null) return undefined;
    return (value as Record<string, unknown>)[key];
  }, object);

export default function App() {
  const lang = resolveDocsLanguage(window.location.pathname, localStorage.getItem("lang"));
  const locale = useMemo(
    () => (lang === "en" ? { ...uiEn, ...localEn } : { ...uiZh, ...localZh }),
    [lang],
  );
  dayjs.locale(lang === "zh" ? "zh-cn" : "en");
  const context = {
    lang,
    locale,
    t: (key: string, fallback?: string) => {
      const value = read(locale, key);
      return typeof value === "string" ? value : (fallback ?? key);
    },
    changeLang: () => {
      const nextLang = lang === "en" ? "zh" : "en";
      localStorage.setItem("lang", nextLang);
      const nextPath = localizeDocsPath(window.location.pathname, nextLang);
      const nextUrl = `${nextPath}${window.location.search}${window.location.hash}`;
      if (nextUrl === `${window.location.pathname}${window.location.search}${window.location.hash}`)
        window.location.reload();
      else window.location.assign(nextUrl);
    },
  };
  return (
    <ConfigProvider locale={locale}>
      <DocsContext.Provider value={context}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </DocsContext.Provider>
    </ConfigProvider>
  );
}
