import clsx from "clsx";
import React, { useState } from "react";
import { getChildren } from "../utils/react-node";
import type { CollapsePanelProps } from "./collapse-panel";

export interface CollapseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  openKeys?: (string | number)[];
  accordion?: boolean;
  sample?: boolean;
  onChange?: (key: string | number) => void;
  children?: React.ReactNode;
}

const Collapse: React.FC<CollapseProps> = ({
  openKeys,
  accordion = false,
  sample = false,
  onChange,
  children,
  className = "",
  ...rest
}) => {
  const [innerActiveKeys, setInnerActiveKeys] = useState<(string | number)[]>(openKeys ?? []);
  const activeKeys = openKeys ?? innerActiveKeys;

  const handleExpand = (key: string | number) => {
    if (!key && key !== 0) return;

    let nextKeys = [...activeKeys];
    const index = nextKeys.indexOf(key);

    if (index >= 0) {
      nextKeys = accordion ? [] : nextKeys.filter((k) => k !== key);
    } else {
      nextKeys = accordion ? [key] : [...nextKeys, key];
    }

    if (openKeys === undefined) setInnerActiveKeys(nextKeys);
    onChange?.(key);
  };

  const classes = clsx("k-collapse", { "k-collapse-sample": sample }, className);

  const childList = getChildren(children);

  return (
    <div className={classes} {...rest}>
      {childList.map((child, index) => {
        if (!React.isValidElement<CollapsePanelProps>(child)) return child;

        const key = child.key ?? index;
        const isActive = activeKeys.includes(key as string | number);

        return React.cloneElement(child, {
          panelKey: key,
          active: isActive,
          onExpand: handleExpand,
        });
      })}
    </div>
  );
};

export default Collapse;
