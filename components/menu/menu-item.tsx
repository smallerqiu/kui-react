import clsx from "clsx";
import React, { useContext, useState } from "react";
import Icon, { type IconType } from "../icon";
import { MenuContext } from "./context";

export interface MenuItemProps extends Omit<React.HTMLAttributes<HTMLLIElement>, "title"> {
  icon?: IconType[];
  title?: React.ReactNode;
  disabled?: boolean;
  isPopup?: boolean;
  menuKey?: string;
  keyPath?: string[];
  children?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  disabled = false,
  isPopup = false,
  menuKey,
  keyPath: ownKeyPath,
  children,
  className = "",
  ...rest
}) => {
  const ctx = useContext(MenuContext);
  const [active, setActive] = useState(false);
  const preCls = ctx.isDropdown ? "dropdown-menu" : "menu";
  const key = menuKey ?? "";
  const keyPath = ownKeyPath ?? ctx.keyPath;
  const isSelected = ctx.selectedKeys.includes(key) && !ctx.isDropdown;
  const paddingLeft =
    ctx.mode === "inline" && !ctx.inlineCollapsed && keyPath.length && !isPopup
      ? `${keyPath.length * 16 + 16}px`
      : undefined;

  return (
    <li
      className={clsx(
        `k-${preCls}-item`,
        {
          [`k-${preCls}-item-active`]: active,
          [`k-${preCls}-item-selected`]: isSelected,
          [`k-${preCls}-item-disabled`]: disabled,
        },
        className
      )}
      style={{ paddingLeft }}
      onMouseEnter={() => !disabled && setActive(true)}
      onMouseLeave={() => !disabled && setActive(false)}
      onClick={() => {
        if (!disabled) ctx.onSelectedChange(key, true, keyPath);
      }}
      {...rest}
    >
      {icon ? <Icon type={icon} className={`k-${preCls}-item-icon`} /> : null}
      <span className={`k-${preCls}-title-content`}>{title || children}</span>
    </li>
  );
};

export default MenuItem;
