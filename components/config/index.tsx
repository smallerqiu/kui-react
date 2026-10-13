import React, { useContext, useEffect, useMemo } from "react";
import { ConfigContext, EMPTY_CONFIG, type Locale } from "./config-context";
import { pushConfig } from "./context";
import type { ShapeType, SizeType, ThemeType } from "../const/types";
export type { Locale } from "./config-context";

export interface ConfigProviderProps {
  locale?: Locale | null;
  getPopupContainer?: () => HTMLElement | null | undefined;
  size?: SizeType;
  shape?: ShapeType;
  theme?: ThemeType;
  children?: React.ReactNode;
}

const ConfigProvider: React.FC<ConfigProviderProps> = ({
  locale,
  getPopupContainer,
  size,
  shape,
  theme,
  children,
}) => {
  const parentConfig = useContext(ConfigContext);
  // 只有最外层那个 Provider 登记：嵌套 Provider 的配置已经包含在父级里，
  // 再登记一次会让命令式 API 拿到同一个根的两份配置（和 Vue 侧的 !parentConfig 判断同构）。
  const isRootProvider = parentConfig === EMPTY_CONFIG;
  // useMemo 不只是省渲染：登记给命令式 API 的就是这个对象，身份一变就会多跑一轮
  // 注销/登记，活着的弹窗会跟着白重渲染一次。
  const config = useMemo(
    () => ({
      locale: locale ?? parentConfig.locale,
      getPopupContainer: getPopupContainer ?? parentConfig.getPopupContainer,
      size: size ?? parentConfig.size,
      shape: shape ?? parentConfig.shape,
      theme: theme ?? parentConfig.theme,
    }),
    [locale, getPopupContainer, size, shape, theme, parentConfig],
  );
  useEffect(() => {
    if (isRootProvider) return pushConfig(config);
  }, [isRootProvider, config]);
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};

export default ConfigProvider;
