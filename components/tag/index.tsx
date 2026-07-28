import clsx from "clsx";
import { X } from "kui-icons";
import React, { useState } from "react";
import { type ColorType, type ShapeType, type SizeType, type ThemeType } from "../const/types";
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

  const tagClasses = clsx(
    "k-tag",
    {
      "k-tag-sm": size === "small",
      "k-tag-lg": size === "large",
      [`k-tag-${color}`]: isPresetColor,
      "k-tag-circle": shape === "circle",
      "k-tag-square": shape === "square",
      "k-tag-has-color": isCustomColor,
      "k-tag-closeable": closeable,
      "k-tag-hidden": hidden,
      "k-tag-fill": theme === "fill",
    },
    className
  );

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
