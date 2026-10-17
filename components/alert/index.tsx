import { resolvePaintedTheme, useConfigAppearance } from "../config/use-config-appearance";
import clsx from "clsx";
import { CircleAlert, CircleCheck, CircleX, Info, X } from "kui-icons";
import React, { useRef, useState } from "react";
import Transition from "../base/transition";
import { getTransitionProp } from "../utils/transition";
import Icon, { type IconType } from "../icon";
import type { ShapeType, SurfaceThemeType } from "../const/types";

export interface AlertProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "defaultChecked"
> {
  type?: "info" | "success" | "warning" | "error";
  closable?: boolean;
  showIcon?: boolean;
  icon?: IconType[];
  message?: React.ReactNode;
  description?: React.ReactNode;
  bordered?: boolean;
  theme?: SurfaceThemeType;
  shape?: ShapeType;
  onClose?: (e: React.MouseEvent<HTMLElement>) => void;
  onAfterClose?: () => void;
  children?: React.ReactNode;
}

// An alert paints a whole box, so it answers the five surface tiers and never `underlined`. Its own look
// is the tinted plate `fill`, so a tier it does not draw falls back to `fill` — the same DOM as writing
// no `theme` at all. The stylesheet used to answer only `outline` and `plain` (and spelled them with a
// `-theme-` infix no other surface used), which left `theme="fill"` — the documented default — shipping
// `k-alert-theme-fill` as a class nothing painted.
const PAINTED_THEMES = ["fill", "outline", "plain", "solid", "dashed"] as const;

const Alert: React.FC<AlertProps> = ({
  type = "warning",
  closable = false,
  showIcon = true,
  icon,
  message,
  description,
  bordered = false,
  theme: themeProp,
  shape: shapeProp,
  onClose,
  onAfterClose,
  children,
  className = "",
  ...rest
}) => {
  const inheritedAppearance = useConfigAppearance();
  const theme =
    resolvePaintedTheme(themeProp ?? inheritedAppearance.theme, PAINTED_THEMES) ?? "fill";
  const shape = shapeProp ?? inheritedAppearance.shape ?? "round";
  const [closed, setClosed] = useState(false);
  const closing = useRef(false);

  const close = (e: React.MouseEvent<HTMLElement>) => {
    if (closing.current) return;
    closing.current = true;
    setClosed(true);
    onClose?.(e);
  };

  const transitionProps = getTransitionProp("k-alert-slide");

  const icons = {
    info: Info,
    error: CircleX,
    success: CircleCheck,
    warning: CircleAlert,
  };

  const iconNode = showIcon ? (
    <Icon type={icon ? icon : icons[type as keyof typeof icons]} className="k-alert-icon" />
  ) : null;

  const closeIcon = closable ? <Icon className="k-alert-close" type={X} onClick={close} /> : null;

  const descriptionNode = description ? (
    <div className="k-alert-description">{description}</div>
  ) : null;

  const msgNode = <div className="k-alert-message">{message || children}</div>;

  const classes = clsx(
    "k-alert",
    {
      [`k-alert-${type}`]: type,
      "k-alert-has-icon": showIcon,
      "k-alert-has-close": closable,
      "k-alert-bordered": bordered,
      [`k-alert-${theme}`]: theme,
      [`k-alert-shape-${shape}`]: shape,
      "k-alert-has-description": description,
    },
    className,
  );

  return (
    <Transition
      {...transitionProps}
      show={!closed}
      timeout={300}
      onAfterLeave={(el) => {
        transitionProps.onAfterLeave?.(el);
        onAfterClose?.();
      }}
    >
      <div className={classes} {...rest}>
        {iconNode}
        <div className="k-alert-content">
          {msgNode}
          {descriptionNode}
        </div>
        {closeIcon}
      </div>
    </Transition>
  );
};

export default Alert;
