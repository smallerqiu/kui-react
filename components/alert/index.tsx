import clsx from "clsx";
import { CircleAlert, CircleCheck, CircleX, Info, X } from "kui-icons";
import React, { useState } from "react";
import Icon, { type IconType } from "../icon";
import type { ShapeType, ThemeType } from "../const/types";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "info" | "success" | "warning" | "error";
  closable?: boolean;
  showIcon?: boolean;
  icon?: IconType[];
  message?: React.ReactNode;
  description?: React.ReactNode;
  bordered?: boolean;
  theme?: ThemeType;
  shape?: ShapeType;
  onClose?: (e: React.MouseEvent<HTMLElement>) => void;
  children?: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({
  type = "warning",
  closable = false,
  showIcon = true,
  icon,
  message,
  description,
  bordered = false,
  theme = "fill",
  shape = "round",
  onClose,
  children,
  className = "",
  ...rest
}) => {
  const [closed, setClosed] = useState(false);

  const close = (e: React.MouseEvent<HTMLElement>) => {
    setClosed(true);
    onClose?.(e);
  };

  if (closed) return null;

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
      [`k-alert-theme-${theme}`]: theme,
      [`k-alert-shape-${shape}`]: shape,
      "k-alert-has-description": description,
    },
    className
  );

  return (
    <div className={classes} {...rest}>
      {iconNode}
      <div className="k-alert-content">
        {msgNode}
        {descriptionNode}
      </div>
      {closeIcon}
    </div>
  );
};

export default Alert;
