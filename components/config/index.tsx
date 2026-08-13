import React from "react";
import { ConfigContext, type Locale } from "./config-context";
export type { Locale } from "./config-context";

export interface ConfigProviderProps {
  locale?: Locale | null;
  children?: React.ReactNode;
}

class ConfigProvider extends React.Component<ConfigProviderProps> {
  render() {
    const { locale = null, children } = this.props;
    return <ConfigContext.Provider value={{ locale }}>{children}</ConfigContext.Provider>;
  }
}

export default ConfigProvider;
