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

/**
 * 没有 ConfigProvider 时的默认值。
 * 导出它不是为了让人用，而是让 ConfigProvider 能凭引用认出自己是不是最外层：
 * useContext 拿到这个对象就说明上面没有别的 Provider，这时才需要把配置登记给命令式 API。
 */
export const EMPTY_CONFIG: ConfigContextValue = { locale: null };

export const ConfigContext = createContext<ConfigContextValue>(EMPTY_CONFIG);
