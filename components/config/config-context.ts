import { createContext } from "react";

export interface ConfigContextValue {
  locale: Record<string, any> | null;
}

export const ConfigContext = createContext<ConfigContextValue>({ locale: null });
