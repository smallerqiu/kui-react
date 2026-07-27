import { Loading } from "kui-icons";
import React, { useContext } from "react";
import { SizeContext } from "../config/size-context";
import type { ButtonType, ShapeType, SizeType, ThemeType } from "../const/types";
import { colors } from "../const/var";
import Icon, { type IconType } from "../icon";
import { getChildren } from "../utils/react-node";
import { ButtonGroupContext } from "./button-group";

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  htmlType?: "button" | "submit" | "reset";
  icon?: IconType[];
  block?: boolean;
  size?: SizeType;
  color?: string;
  loading?: boolean;
  type?: ButtonType;
  disabled?: boolean;
  theme?: ThemeType;
  shape?: ShapeType;
  href?: string;
  target?: string;
}

const Button = React.forwardRef<any, ButtonProps>(
  (
    {
      htmlType = "button",
      icon,
      block = false,
      size,
      color,
      loading = false,
      type = "default",
      disabled = false,
      theme,
      shape,
      href,
      target,
      children,
      className = "",
      onClick,
      ...rest
    },
    ref
  ) => {
    const buttonGroup = useContext(ButtonGroupContext);
    const parentSize = useContext(SizeContext);

    const computedSize = size || buttonGroup?.size || parentSize || "default";
    const computedShape = shape || buttonGroup?.shape;

    const handleClick = (e: React.MouseEvent<any>) => {
      if (loading || disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    const iconOnly = () => {
      const childList = getChildren(children);
      if (!childList.length) {
        return !!icon || !!loading;
      }
      if (childList.length === 1) {
        const firstChild = childList[0];
        if (React.isValidElement(firstChild)) {
          const childType = firstChild.type;
          return (
            childType === Icon ||
            (typeof childType === "object" && (childType as any)?.name === "Icon")
          );
        }
      }
      return false;
    };

    const classes = [
      "k-btn",
      type && !color ? `k-btn-${type}` : "",
      theme === "outline" ? "k-btn-outline" : "",
      computedSize === "small" ? "k-btn-sm" : "",
      block ? "k-btn-block" : "",
      loading ? "k-btn-loading" : "",
      iconOnly() ? "k-btn-icon-only" : "",
      color && colors.includes(color as any) ? `k-btn-${color}` : "",
      computedSize === "large" ? "k-btn-lg" : "",
      computedShape === "circle" ? "k-btn-circle" : "",
      computedShape === "square" ? "k-btn-square" : "",
      theme ? `k-btn-${theme}` : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    let childNodes: React.ReactNode[] = [];
    const iconType = loading ? Loading : icon;

    if (iconType) {
      childNodes.push(<Icon key="btn-icon" type={iconType} spin={loading} />);
    }

    const processedChildren = getChildren(children).map((c, index) => {
      return typeof c === "string" ? <span key={`text-${index}`}>{c.trim()}</span> : c;
    });

    if (processedChildren.length > 0) {
      childNodes = childNodes.concat(processedChildren);
    }

    const commonProps = {
      ...rest,
      className: classes,
      onClick: handleClick,
    };

    if (type === "link" && href && !disabled) {
      return (
        <a href={href} target={target} ref={ref} {...(commonProps as any)}>
          {childNodes}
        </a>
      );
    }

    return (
      <button type={htmlType} disabled={disabled || loading} ref={ref} {...commonProps}>
        {childNodes}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
