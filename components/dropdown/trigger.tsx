import React from "react";
import Button from "../button/button";
import { type IconType } from "../icon";
import { useDropdownContext } from "./dropdown-context";

export interface TriggerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconType[];
  disabled?: boolean;
}

const TriggerButton = React.forwardRef<any, TriggerButtonProps>(
  ({ icon, disabled = false, children, onMouseEnter, onMouseLeave, ...rest }, ref) => {
    const dropdown = useDropdownContext();

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      dropdown?.onMouseEnter?.();
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      dropdown?.onMouseLeave?.();
      onMouseLeave?.(e);
    };

    return (
      <Button
        ref={ref}
        icon={icon}
        disabled={disabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        {children}
      </Button>
    );
  }
);

TriggerButton.displayName = "TriggerButton";

export default TriggerButton;
