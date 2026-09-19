import React, { useContext } from "react";
import { ConfigContext, type Locale } from "./config-context";
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
  return (
    <ConfigContext.Provider
      value={{
        locale: locale ?? parentConfig.locale,
        getPopupContainer: getPopupContainer ?? parentConfig.getPopupContainer,
        size: size ?? parentConfig.size,
        shape: shape ?? parentConfig.shape,
        theme: theme ?? parentConfig.theme,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
