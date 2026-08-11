import React, { useId, useState, type CSSProperties, type ReactNode } from "react";
import type { IconType } from "../icon";
import Icon from "../icon";
import { useMenuContext, useSubMenuContext } from "./menu-context";

export interface MenuItemProps {
  itemKey?: string;
  menuKey?: string;
  icon?: IconType[] | ReactNode;
  title?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  itemKey,
  menuKey,
  icon,
  title,
  disabled = false,
  children,
  className = "",
  style,
}) => {
  const menuContext = useMenuContext();
  const subMenuContext = useSubMenuContext();
  const [active, setActive] = useState(false);
  const generatedKey = useId();
  const currentKey = itemKey ?? menuKey ?? generatedKey;

  const preCls = menuContext?.dropdown ? "dropdown-menu" : "menu";
  const selected = Boolean(
    menuContext?.selectedKeys.includes(currentKey) && !menuContext?.dropdown
  );

  const paddingLeft =
    menuContext?.mode === "inline" &&
    !menuContext?.inlineCollapsed &&
    subMenuContext?.keyPath.length
      ? subMenuContext.keyPath.length * 16 + 16
      : undefined;

  const classNames = [
    `k-${preCls}-item`,
    active && `k-${preCls}-item-active`,
    selected && `k-${preCls}-item-selected`,
    disabled && `k-${preCls}-item-disabled`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const titleNode = <span className={`k-${preCls}-title-content`}>{title ?? children}</span>;

  let iconNode: ReactNode = null;
  if (React.isValidElement(icon)) {
    iconNode = <span className={`k-${preCls}-item-icon`}>{icon}</span>;
  } else if (Array.isArray(icon)) {
    iconNode = <Icon type={icon} className={`k-${preCls}-item-icon`} />;
  }

  return (
    <li
      className={classNames}
      style={{
        ...style,
        paddingLeft: paddingLeft ? `${paddingLeft}px` : style?.paddingLeft,
      }}
      onMouseEnter={() => !disabled && setActive(true)}
      onMouseLeave={() => !disabled && setActive(false)}
      onClick={() => {
        if (!disabled) {
          menuContext?.selectedKeysChange?.(currentKey, true, subMenuContext?.keyPath || []);
        }
      }}
    >
      {iconNode}
      {titleNode}
    </li>
  );
};

export default MenuItem;
