import { useConfigAppearance, normalizeSurfaceShape } from "../config/use-config-appearance";
import clsx from "clsx";
import React, { useState } from "react";
import { getChildren } from "../utils/react-node";
import type { CollapsePanelProps } from "./collapse-panel";
import type { ShapeType, ThemeType } from "../const/types";

export interface CollapseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  openKeys?: (string | number)[];
  defaultOpenKeys?: (string | number)[];
  accordion?: boolean;
  sample?: boolean;
  theme?: ThemeType;
  shape?: ShapeType;
  onChange?: (key: string | number) => void;
  onOpenKeysChange?: (keys: (string | number)[]) => void;
  children?: React.ReactNode;
}

const Collapse: React.FC<CollapseProps> = ({
  openKeys,
  defaultOpenKeys = [],
  accordion = false,
  sample = false,
  theme: themeProp,
  shape: shapeProp,
  onChange,
  onOpenKeysChange,
  children,
  className = "",
  ...rest
}) => {
  const inheritedAppearance = useConfigAppearance();
  const theme = themeProp ?? inheritedAppearance.theme ?? "outline";
  const shape = normalizeSurfaceShape(shapeProp ?? inheritedAppearance.shape ?? "round");
  const [innerActiveKeys, setInnerActiveKeys] = useState<(string | number)[]>(defaultOpenKeys);
  const activeKeys = openKeys ?? innerActiveKeys;
  const [keyRegistry, setKeyRegistry] = useState(
    () =>
      new Map([...defaultOpenKeys, ...(openKeys ?? [])].map((key) => [String(key), key] as const)),
  );
  // Preserve numeric keys after closing without mutating refs during render.
  const resolvedKeys = new Map(keyRegistry);
  activeKeys.forEach((key) => resolvedKeys.set(String(key), key));
  if (activeKeys.some((key) => keyRegistry.get(String(key)) !== key)) {
    setKeyRegistry(resolvedKeys);
  }

  const keysEqual = (left: string | number, right: string | number) =>
    left === right || String(left) === String(right);

  const handleExpand = (key: string | number) => {
    if (!key && key !== 0) return;

    let nextKeys = [...activeKeys];
    const index = nextKeys.findIndex((item) => keysEqual(item, key));

    if (index >= 0) {
      nextKeys = accordion ? [] : nextKeys.filter((k) => !keysEqual(k, key));
    } else {
      nextKeys = accordion ? [key] : [...nextKeys, key];
    }

    if (openKeys === undefined) setInnerActiveKeys(nextKeys);
    onOpenKeysChange?.(nextKeys);
    onChange?.(key);
  };

  const classes = clsx(
    "k-collapse",
    { "k-collapse-sample": sample },
    `k-collapse-${theme}`,
    `k-collapse-${shape}`,
    className,
  );

  const childList = getChildren(children);

  return (
    <div className={classes} {...rest}>
      {childList.map((child, index) => {
        if (!React.isValidElement<CollapsePanelProps>(child)) return child;

        const rawKey = child.props.panelKey ?? child.key ?? index;
        const key = child.props.panelKey ?? resolvedKeys.get(String(rawKey)) ?? rawKey;
        const isActive = activeKeys.some((item) => keysEqual(item, key));

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
