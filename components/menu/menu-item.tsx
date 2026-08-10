import clsx from "clsx";
import React, { useContext, useState } from "react";
import Icon, { type IconType } from "../icon";
import { MenuContext, SubMenuContext } from "./menu-context";

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
  const menuContext = useContext(MenuContext);
  const subMenuContext = useContext(SubMenuContext);
  const [active, setActive] = useState(false);
  const preCls = menuContext?.dropdown ? "dropdown-menu" : "menu";
  const selected = menuContext?.selectedKeys.includes(menuKey) && !menuContext.dropdown;

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
          menuContext?.mode === "inline" &&
          !menuContext.inlineCollapsed &&
          subMenuContext?.keyPath.length
            ? `${subMenuContext.keyPath.length * 16 + 16}px`
            : undefined,
      }}
      onMouseEnter={() => !disabled && setActive(true)}
      onMouseLeave={() => !disabled && setActive(false)}
      onClick={() => {
        if (!disabled) {
          menuContext?.selectedKeysChange(menuKey, true, subMenuContext?.keyPath || []);
        }
      }}
      {...rest}
    >
      {icon ? <Icon type={icon} className={`k-${preCls}-item-icon`} /> : null}
      <span className={`k-${preCls}-title-content`}>{title ?? children}</span>
    </li>
  );
};

export default MenuItem;
