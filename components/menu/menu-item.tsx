import clsx from "clsx";
import React, { useContext, useEffect, useState } from "react";
import Icon, { type IconType } from "../icon";
import { MenuContext } from "./context";

export interface MenuItemProps extends Omit<React.HTMLAttributes<HTMLLIElement>, "title"> {
  icon?: IconType[];
  title?: React.ReactNode;
  disabled?: boolean;
  menuKey?: string;
  children?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  disabled = false,
  menuKey = "",
  children,
  className,
  ...rest
}) => {
  const context = useContext(MenuContext);
  const [active, setActive] = useState(false);
  const selected = context.selectedKeys.includes(menuKey) && !context.dropdown;
  const preCls = context.dropdown ? "dropdown-menu" : "menu";

  useEffect(() => {
    if (selected) context.registerSelectedPath(menuKey, context.keyPath);
  }, []);

  return (
    <li
      className={clsx(
        `k-${preCls}-item`,
        {
          [`k-${preCls}-item-active`]: active,
          [`k-${preCls}-item-selected`]: selected,
          [`k-${preCls}-item-disabled`]: disabled,
        },
        className
      )}
      style={{
        paddingLeft:
          context.mode === "inline" && !context.inlineCollapsed && context.keyPath.length
            ? `${context.keyPath.length * 16 + 16}px`
            : undefined,
      }}
      onMouseEnter={() => {
        if (!disabled) setActive(true);
      }}
      onMouseLeave={() => {
        if (!disabled) setActive(false);
      }}
      onClick={() => {
        if (!disabled) context.selectedKeysChange(menuKey, true, context.keyPath);
      }}
      {...rest}
    >
      {icon ? <Icon type={icon} className={`k-${preCls}-item-icon`} /> : null}
      <span className={`k-${preCls}-title-content`}>{title ?? children}</span>
    </li>
  );
};

export default MenuItem;
