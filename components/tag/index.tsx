import React, { useState } from "react";
import { X } from "kui-icons";
import {
  type ColorType,
  type ShapeType,
  type SizeType,
  type ThemeType,
} from "../const/types";
import { colors } from "../const/var";
import Icon from "../icon";
import { isColor } from "../utils/color";

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  closeable?: boolean;
  color?: ColorType;
  shape?: ShapeType;
  icon?: any;
  size?: SizeType;
  theme?: ThemeType;
  onClose?: () => void;
  children?: React.ReactNode;
}

const Tag: React.FC<TagProps> = ({
  closeable = false,
  color,
  shape,
  icon,
  size = "small",
  theme = "fill",
  onClose,
  children,
  className = "",
  style,
  ...rest
}) => {
  const [visible, setVisible] = useState(true);
  const [hidden, setHidden] = useState(false);

  const closeHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
    setVisible(false);
    setTimeout(() => {
      setHidden(true);
    }, 300);
  };

  const isPresetColor = color && colors.includes(color as any);
  const isCustomColor = color && isColor(color) && !isPresetColor;

  const tagClasses = [
    "k-tag",
    size === "small" ? "k-tag-sm" : "",
    size === "large" ? "k-tag-lg" : "",
    isPresetColor ? `k-tag-${color}` : "",
    shape === "circle" ? "k-tag-circle" : "",
    shape === "square" ? "k-tag-square" : "",
    isCustomColor ? "k-tag-has-color" : "",
    closeable ? "k-tag-closeable" : "",
    hidden ? "k-tag-hidden" : "",
    theme === "fill" ? "k-tag-fill" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const tagStyle: React.CSSProperties = {
    backgroundColor: isCustomColor ? color : undefined,
    display: visible ? undefined : "none",
    ...style,
  };

  return (
    <div className={tagClasses} style={tagStyle} {...rest}>
      {icon && <Icon className="k-tag-icon" type={icon} />}
      <span className="k-tag-text">{children}</span>
      {closeable && <Icon className="k-tag-close" type={X} onClick={closeHandler} />}
    </div>
  );
};

export default Tag;
