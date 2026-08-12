import clsx from "clsx";
import React, { useContext, useEffect, useState } from "react";
import { SiderHookContext } from "./layout-context";

export interface LayoutProps extends React.HTMLAttributes<HTMLElement> {
  suffixCls?: string;
  hasSider?: boolean;
  children?: React.ReactNode;
}

export interface SiderProps extends React.HTMLAttributes<HTMLElement> {
  suffixCls?: string;
  width?: number | string;
  collapsedWidth?: number | string;
  collapsible?: boolean;
  collapsed?: boolean;
  children?: React.ReactNode;
}

function createBasicComponent(suffixCls: string, displayName: string) {
  const Component: React.FC<LayoutProps> = ({
    suffixCls: customSuffixCls = suffixCls,
    children,
    className = "",
    ...rest
  }) => {
    const classes = clsx(`k-${customSuffixCls}`, className);
    return (
      <section className={classes} {...rest}>
        {children}
      </section>
    );
  };
  Component.displayName = displayName;
  return Component;
}

const LayoutMain: React.FC<LayoutProps> = ({
  suffixCls = "layout",
  hasSider,
  children,
  className = "",
  ...rest
}) => {
  const [siderCount, setSiderCount] = useState(0);

  const collectSider = (mounted: boolean) => {
    setSiderCount((prev) => (mounted ? prev + 1 : Math.max(0, prev - 1)));
  };

  const classes = clsx(
    `k-${suffixCls}`,
    { [`k-${suffixCls}-has-sider`]: hasSider ?? siderCount > 0 },
    className
  );

  return (
    <SiderHookContext.Provider value={collectSider}>
      <section className={classes} {...rest}>
        {children}
      </section>
    </SiderHookContext.Provider>
  );
};

const Sider: React.FC<SiderProps> = ({
  suffixCls = "layout-sider",
  width = 200,
  collapsedWidth = 80,
  collapsible,
  collapsed,
  children,
  className = "",
  style,
  ...rest
}) => {
  const collectSider = useContext(SiderHookContext);

  useEffect(() => {
    collectSider?.(true);
    return () => {
      collectSider?.(false);
    };
  }, [collectSider]);

  const classes = clsx(`k-${suffixCls}`, className);
  const siderWidth = collapsible && collapsed ? collapsedWidth : width;
  const siderStyle = {
    width: style?.width ?? siderWidth,
    ...style,
  };

  return (
    <aside className={classes} style={siderStyle} {...rest}>
      {children}
    </aside>
  );
};

const Content = createBasicComponent("layout-content", "LayoutContent");
const Header = createBasicComponent("layout-header", "LayoutHeader");
const Footer = createBasicComponent("layout-footer", "LayoutFooter");

type InternalLayoutType = typeof LayoutMain;
type LayoutType = InternalLayoutType & {
  Header: typeof Header;
  Footer: typeof Footer;
  Content: typeof Content;
  Sider: typeof Sider;
};

const Layout = LayoutMain as LayoutType;

Layout.Header = Header;
Layout.Footer = Footer;
Layout.Content = Content;
Layout.Sider = Sider;

export default Layout;
export { Content, Footer, Header, Layout, Sider };
