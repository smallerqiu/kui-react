import clsx from "clsx";
import React from "react";
import type { IconType } from "../icon";

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  icon?: IconType[];
  disabled?: boolean;
  closable?: boolean;
  /** injected by Tabs */
  tabKey?: string | number;
  /** injected by Tabs */
  activeKey?: string | number;
  /** injected by Tabs */
  tabsId?: string;
  children?: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { tabKey, activeKey, tabsId, children, className = "", ...rest } = props;
  const domProps = { ...rest };
  delete domProps.title;
  delete domProps.icon;
  delete domProps.disabled;
  delete domProps.closable;
  const isActive = tabKey !== undefined && String(activeKey) === String(tabKey);
  return (
    <div
      className={clsx("k-tabs-tabpanel", { "k-tabs-tabpanel-active": isActive }, className)}
      id={tabKey !== undefined ? `${tabsId}-panel-${String(tabKey)}` : undefined}
      role="tabpanel"
      aria-labelledby={tabKey !== undefined ? `${tabsId}-tab-${String(tabKey)}` : undefined}
      aria-hidden={!isActive}
      {...domProps}
    >
      {children}
    </div>
  );
};

export default TabPanel;
