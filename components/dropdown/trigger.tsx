import React from "react";
import Button from "../button/button";
import type { ButtonProps } from "../button/button";
import { type IconType } from "../icon";
import { useDropdownContext } from "./dropdown-context";

export interface TriggerButtonProps extends ButtonProps {
  icon?: IconType[];
  disabled?: boolean;
}

const TriggerButton = React.forwardRef<HTMLButtonElement, TriggerButtonProps>(
  (
    {
      icon,
      disabled = false,
      children,
      onMouseEnter,
      onMouseLeave,
      onClick,
      onContextMenu,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const dropdown = useDropdownContext();

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      dropdown?.onMouseEnter?.();
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      dropdown?.onMouseLeave?.();
      onMouseLeave?.(e);
    };

    // Dropdown 交出 target 后 Popup 不再绑定触发事件，这里把点击/右键/方向键接回开合逻辑。
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      dropdown?.onClick?.();
      onClick?.(e);
    };

    const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
      dropdown?.onContextMenu?.();
      onContextMenu?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      dropdown?.onTriggerKeydown?.(e);
      onKeyDown?.(e);
    };

    return (
      <Button
        ref={ref}
        icon={icon}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={!!dropdown?.expanded}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

TriggerButton.displayName = "TriggerButton";

export default TriggerButton;
