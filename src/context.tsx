import { createContext, useContext } from "react";

export interface DocsContextValue {
  lang: string;
  locale: Record<string, any>;
  t: (key: string, fallback?: string) => string;
  changeLang: () => void;
}

export const DocsContext = createContext<DocsContextValue>({
  lang: "en",
  locale: {},
  t: (key) => key,
  changeLang: () => undefined,
});
export const useDocs = () => useContext(DocsContext);
