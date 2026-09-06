import clsx from "clsx";
import React, { useId, useState, type CSSProperties, type ReactNode } from "react";
import type { IconType } from "../icon";
import Icon from "../icon";
import Tooltip from "../tooltip";
import { useMenuContext, useSubMenuContext } from "./menu-context";
import { handleMenuItemKeydown } from "./menu-keyboard";

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
    menuContext?.selectedKeys.includes(currentKey) && !menuContext?.dropdown,
  );
  const paddingLeft =
    menuContext?.mode === "inline" &&
    !menuContext?.inlineCollapsed &&
    subMenuContext?.keyPath.length
      ? subMenuContext.keyPath.length * 16 + 16
      : undefined;

  const classNames = clsx(
    `k-${preCls}-item`,
    {
      [`k-${preCls}-item-active`]: active,
      [`k-${preCls}-item-selected`]: selected,
      [`k-${preCls}-item-disabled`]: disabled,
    },
    className,
  );

  const titleNode = <span className={`k-${preCls}-title-content`}>{title ?? children}</span>;

  let iconNode: ReactNode = null;
  if (React.isValidElement(icon)) {
    iconNode = <span className={`k-${preCls}-item-icon`}>{icon}</span>;
  } else if (Array.isArray(icon)) {
    iconNode = <Icon type={icon} className={`k-${preCls}-item-icon`} />;
  }

  const itemNode = (
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
      onKeyDown={(event) =>
        handleMenuItemKeydown(event, () => {
          if (!disabled) {
            menuContext?.selectedKeysChange?.(currentKey, true, subMenuContext?.keyPath || []);
          }
        })
      }
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      aria-current={selected ? "page" : undefined}
    >
      {iconNode}
      {titleNode}
    </li>
  );
  const showCollapsedTooltip =
    menuContext?.mode === "inline" &&
    menuContext.inlineCollapsed &&
    menuContext.collapsedTooltip &&
    !menuContext.dropdown &&
    !subMenuContext?.keyPath.length;

  return showCollapsedTooltip ? (
    <Tooltip title={title ?? children} placement="right">
      {itemNode}
    </Tooltip>
  ) : (
    itemNode
  );
};

export default MenuItem;
