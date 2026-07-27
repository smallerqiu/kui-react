import React, { useContext } from "react";
import Button from "../button/button";
import { type IconType } from "../icon";
import { DropdownContext } from "./dropdown";

export interface TriggerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconType[];
  disabled?: boolean;
}

const TriggerButton = React.forwardRef<any, TriggerButtonProps>(
  ({ icon, disabled = false, children, onMouseEnter, onMouseLeave, ...rest }, ref) => {
    const dropdown = useContext(DropdownContext);

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
        {...(rest as any)}
      >
        {children}
      </Button>
    );
  }
);

TriggerButton.displayName = "TriggerButton";

export default TriggerButton;
