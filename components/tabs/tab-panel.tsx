import clsx from "clsx";
import React from "react";
import type { IconType } from "../icon";

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: IconType[];
  disabled?: boolean;
  closable?: boolean;
  /** injected by Tabs */
  tabKey?: string | number;
  /** injected by Tabs */
  activeKey?: string | number;
  children?: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { tabKey, activeKey, children, className = "", ...rest } = props;
  const isActive = activeKey === tabKey;
  return (
    <div
      className={clsx("k-tabs-tabpanel", { "k-tabs-tabpanel-active": isActive }, className)}
      {...rest}
    >
      {children}
    </div>
  );
};

export default TabPanel;
