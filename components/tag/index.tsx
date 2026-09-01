import clsx from "clsx";
import { X } from "kui-icons";
import React, { useState } from "react";
import Transition from "../base/transition";
import { type ColorType, type ShapeType, type SizeType, type ThemeType } from "../const/types";
import { colors } from "../const/var";
import Icon, { type IconType } from "../icon";
import { isColor } from "../utils/color";

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  closeable?: boolean;
  compact?: boolean;
  color?: ColorType;
  shape?: ShapeType;
  icon?: IconType[];
  size?: SizeType;
  theme?: ThemeType;
  onClose?: () => void;
  children?: React.ReactNode;
}

const Tag: React.FC<TagProps> = ({
  closeable = false,
  compact = false,
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

  const closeHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
    setVisible(false);
  };

  const isPresetColor = color !== undefined && colors.some((preset) => preset === color);
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
      "k-tag-compact": compact,
      [`k-tag-${theme}`]: !!theme,
    },
    className,
  );

  const tagStyle: React.CSSProperties = {
    backgroundColor: isCustomColor ? color : undefined,
    ...style,
  };

  return (
    <Transition show={visible} name="k-tag" timeout={200}>
      <div className={tagClasses} style={tagStyle} {...rest}>
        {icon && <Icon className="k-tag-icon" type={icon} />}
        <span className="k-tag-text">{children}</span>
        {closeable && <Icon className="k-tag-close" type={X} onClick={closeHandler} />}
      </div>
    </Transition>
  );
};

export default Tag;
