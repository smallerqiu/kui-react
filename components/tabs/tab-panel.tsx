import React from "react";

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: any[];
  disabled?: boolean;
  closable?: boolean;
  /** injected by Tabs */
  tabKey?: string | number;
  /** injected by Tabs */
  activeKey?: string | number;
  children?: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({
  tabKey,
  activeKey,
  children,
  className = "",
  // strip out props that should not be spread to DOM
  title: _title,
  icon: _icon,
  disabled: _disabled,
  closable: _closable,
  ...rest
}) => {
  const isActive = activeKey === tabKey;
  return (
    <div
      className={["k-tabs-tabpanel", isActive ? "k-tabs-tabpanel-active" : "", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
};

export default TabPanel;
