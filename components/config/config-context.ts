import { createContext } from "react";
import enUS from "../locale/en";
import type { ShapeType, SizeType, ThemeType } from "../const/types";

/** 语言包的形状契约就是 `en` 这一份：其余语言都得把 `k.*` 这些键填全。 */
export type Locale = typeof enUS & Record<string, unknown>;

/**
 * 没有 ConfigProvider 兜底时用的语言。
 * 默认值只有这一个出处，组件里不许再各自写 `|| zhCN` 之类的兜底；要改库级默认就改这里。
 * 选 `en` 与文档口径一致，也和 dayjs 那侧对得上——中文语言包没注册时月份和星期本来就是英文。
 */
export const DEFAULT_LOCALE: Locale = enUS;

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
