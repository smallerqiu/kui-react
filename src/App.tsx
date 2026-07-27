import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { useMemo } from "react";
import { BrowserRouter } from "react-router";
import ConfigProvider from "../components/config";
import uiEn from "../components/locale/en";
import uiZh from "../components/locale/zh-CN";
import { DocsContext } from "./context";
import localEn from "./lang/en";
import localZh from "./lang/zh";
import AppRouter from "./router";

const read = (object: any, path: string) =>
  path.split(".").reduce((value, key) => value?.[key], object);

export default function App() {
  const lang = localStorage.getItem("lang") || "en";
  const locale = useMemo(
    () => (lang === "en" ? { ...uiEn, ...localEn } : { ...uiZh, ...localZh }),
    [lang]
  );
  if (lang === "zh") dayjs.locale("zh-cn");
  const context = {
    lang,
    locale,
    t: (key: string, fallback?: string) => read(locale, key) ?? fallback ?? key,
    changeLang: () => {
      localStorage.setItem("lang", lang === "en" ? "zh" : "en");
      window.location.reload();
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
