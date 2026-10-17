import {
  resolvePaintedTheme,
  SURFACE_THEMES,
  useConfigAppearance,
} from "../config/use-config-appearance";
import { Ellipsis } from "kui-icons";
import React, { useRef } from "react";
import Button from "../button/button";
import ButtonGroup from "../button/button-group";
import type {
  DropPlacementsType,
  ShapeType,
  SizeType,
  SurfaceThemeType,
  TriggerType,
} from "../const/types";
import { type IconType } from "../icon";
import Dropdown from "./dropdown";
import TriggerButton from "./trigger";

export interface DropdownButtonProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onClick" | "defaultValue" | "defaultChecked"
> {
  size?: SizeType;
  shape?: ShapeType;
  disabled?: boolean;
  icon?: IconType[];
  theme?: SurfaceThemeType;
  arrow?: boolean;
  trigger?: TriggerType;
  placement?: DropPlacementsType;
  /** 关闭后是否销毁面板内容。默认销毁（重开时重新挂载）；设为 false 可保留面板内的表单状态，代价是每个打开过的实例留一份隐藏 DOM。 */
  destroyOnClose?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  size: sizeProp,
  shape: shapeProp,
  disabled = false,
  icon,
  theme: themeProp,
  arrow = false,
  trigger,
  placement = "bottom-right",
  destroyOnClose = true,
  onClick,
  overlay,
  children,
  className = "",
  ...rest
}) => {
  const inheritedAppearance = useConfigAppearance();
  const size = sizeProp ?? inheritedAppearance.size;
  const shape = shapeProp ?? inheritedAppearance.shape;
  // This component owns no plate — the two buttons inside it do — so what it hands them has to be a
  // tier they can paint. A provider can still say `underlined`; the guard answers it the same way the
  // buttons' own guard would have, and a button keeps its guard for what a caller writes on it.
  const theme = resolvePaintedTheme(themeProp ?? inheritedAppearance.theme, SURFACE_THEMES);
  const refTrigger = useRef<HTMLButtonElement>(null);

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
      trigger={trigger}
      placement={placement}
      destroyOnClose={destroyOnClose}
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
