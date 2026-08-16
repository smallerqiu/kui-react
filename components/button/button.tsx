import clsx from "clsx";
import { Loading } from "kui-icons";
import React, { useContext } from "react";
import { SizeContext } from "../config/size-context";
import type { ButtonType, ShapeType, SizeType, ThemeType } from "../const/types";
import { colors } from "../const/var";
import Icon, { type IconType } from "../icon";
import { getChildren } from "../utils/react-node";
import { ButtonGroupContext } from "./button-group-context";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick"> {
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
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
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

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
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
            childType === Icon
          );
        }
      }
      return false;
    };

    const classes = clsx(
      "k-btn",
      {
        [`k-btn-${type}`]: type && !color,
        "k-btn-outline": theme === "outline",
        "k-btn-sm": computedSize === "small",
        "k-btn-block": block,
        "k-btn-loading": loading,
        "k-btn-icon-only": iconOnly(),
        [`k-btn-${color}`]: color && colors.some((preset) => preset === color),
        "k-btn-lg": computedSize === "large",
        "k-btn-circle": computedShape === "circle",
        "k-btn-square": computedShape === "square",
        [`k-btn-${theme}`]: theme,
      },
      className
    );

    let childNodes: React.ReactNode[] = [];
    const iconType = loading ? Loading : icon;

    if (iconType) {
      childNodes.push(
        loading ? (
          <span
            key="btn-loading-icon"
            className={clsx("k-btn-loading-icon", {
              "k-btn-loading-icon-replace": !!icon,
            })}
          >
            <Icon type={iconType} spin />
          </span>
        ) : (
          <Icon key="btn-icon" type={iconType} />
        )
      );
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
    const setElementRef = (node: HTMLButtonElement | HTMLAnchorElement | null) => {
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    if (type === "link" && href && !disabled) {
      const anchorProps = commonProps as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <a href={href} target={target} ref={setElementRef} {...anchorProps}>
          {childNodes}
        </a>
      );
    }

    return (
      <button type={htmlType} disabled={disabled || loading} ref={setElementRef} {...commonProps}>
        {childNodes}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
