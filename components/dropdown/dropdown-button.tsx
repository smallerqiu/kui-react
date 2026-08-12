import { Ellipsis } from "kui-icons";
import React, { useRef } from "react";
import Button from "../button/button";
import ButtonGroup from "../button/button-group";
import type { DropPlacementsType, ShapeType, SizeType, ThemeType } from "../const/types";
import { type IconType } from "../icon";
import Dropdown from "./dropdown";
import TriggerButton from "./trigger";

export interface DropdownButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  size?: SizeType;
  shape?: ShapeType;
  disabled?: boolean;
  icon?: IconType[];
  theme?: ThemeType;
  arrow?: boolean;
  placement?: DropPlacementsType;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  size,
  shape,
  disabled = false,
  icon,
  theme,
  arrow = false,
  placement = "bottom-right",
  onClick,
  overlay,
  children,
  className = "",
  ...rest
}) => {
  const refTrigger = useRef<any>(null);

  const triggerNode = (
    <ButtonGroup className="k-dropdown-button" size={size} shape={shape}>
      <Button disabled={disabled} theme={theme} onClick={onClick}>
        {children}
      </Button>
      <TriggerButton
        disabled={disabled}
        theme={theme}
        ref={refTrigger}
        icon={!icon ? Ellipsis : icon}
        className="k-dropdown-trigger"
      />
    </ButtonGroup>
  );

  return (
    <Dropdown
      arrow={arrow}
      placement={placement}
      target={refTrigger}
      disabled={disabled}
      overlay={overlay}
      className={className}
      {...rest}
    >
      {triggerNode}
    </Dropdown>
  );
};

export default DropdownButton;
