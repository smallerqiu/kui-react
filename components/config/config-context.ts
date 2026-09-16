import { createContext } from "react";
import zhCN from "../locale/zh-CN";
import type { ShapeType, SizeType, ThemeType } from "../const/types";

export type Locale = typeof zhCN & Record<string, unknown>;

export interface ConfigContextValue {
  locale: Locale | null;
  getPopupContainer?: () => HTMLElement | null | undefined;
  size?: SizeType;
  shape?: ShapeType;
  theme?: ThemeType;
}

export const ConfigContext = createContext<ConfigContextValue>({ locale: null });
