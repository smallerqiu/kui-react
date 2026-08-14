import React, { useContext } from "react";
import { ConfigContext, type Locale } from "./config-context";
export type { Locale } from "./config-context";

export interface ConfigProviderProps {
  locale?: Locale | null;
  getPopupContainer?: () => HTMLElement | null | undefined;
  children?: React.ReactNode;
}

const ConfigProvider: React.FC<ConfigProviderProps> = ({
  locale = null,
  getPopupContainer,
  children,
}) => {
  const parentConfig = useContext(ConfigContext);
  return (
    <ConfigContext.Provider
      value={{
        locale,
        getPopupContainer: getPopupContainer ?? parentConfig.getPopupContainer,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
