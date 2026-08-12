import { createContext } from "react";
import zhCN from "../locale/zh-CN";

export type Locale = typeof zhCN & Record<string, unknown>;

export interface ConfigContextValue {
  locale: Locale | null;
}

export const ConfigContext = createContext<ConfigContextValue>({ locale: null });
