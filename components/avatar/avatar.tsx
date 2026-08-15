import clsx from "clsx";
import React, { useContext, useEffect, useRef, useState } from "react";
import type { ShapeType } from "../const/types";
import Icon, { type IconType } from "../icon";
import { getChildren } from "../utils/react-node";
import { AvatarGroupContext } from "./avatar-group-context";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: IconType[];
  shape?: ShapeType;
  size?: number | "large" | "small" | "default";
  src?: string;
  children?: React.ReactNode;
}

const Avatar: React.FC<AvatarProps> = ({
  icon,
  shape = "circle",
  size = "default",
  src,
  children,
  className = "",
  style,
  ...rest
}) => {
  const group = useContext(AvatarGroupContext);

  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const [textStyles, setTextStyles] = useState<React.CSSProperties>({});

  const computedSize = group?.size || size;
  const computedShape = group?.shape || shape;

  const updateSize = () => {
    if (innerRef.current && rootRef.current) {
      const max = rootRef.current.offsetWidth - 8;
      const innerWidth = innerRef.current.offsetWidth || innerRef.current.scrollWidth;

      if (innerWidth > 0 && innerWidth > max) {
        const scale = Math.min(max / innerWidth, 1);
        setTextStyles({
          transform: `scale(${scale}) translateX(-50%)`,
        });
      } else {
        setTextStyles({
          transform: "scale(1) translateX(-50%)",
        });
      }
    }
  };

  const childList = getChildren(children);

  useEffect(() => {
    let observer: ResizeObserver | null = new ResizeObserver(() => {
      window.requestAnimationFrame(updateSize);
    });

    if (rootRef.current) observer.observe(rootRef.current);
    if (innerRef.current) observer.observe(innerRef.current);

    updateSize();

    return () => {
      observer?.disconnect();
      observer = null;
    };
  }, [children, src]);

  const sizeVal = computedSize;
  const shapeVal = computedShape;

  const rootStyles: React.CSSProperties = { ...style };
  if (typeof sizeVal === "number") {
    rootStyles.width = `${sizeVal}px`;
    rootStyles.height = `${sizeVal}px`;
    rootStyles.lineHeight = `${sizeVal}px`;
    rootStyles.fontSize = `${sizeVal / 2}px`;
  }

  const hasIcon = childList.some((c) => {
    if (React.isValidElement(c)) {
      const childType = c.type;
      return childType === Icon;
    }
    return false;
  });

  const isText = childList.length === 1 && typeof childList[0] === "string";

  const rootClasses = clsx(
    "k-avatar",
    {
      "k-avatar-lg": sizeVal === "large",
      "k-avatar-sm": sizeVal === "small",
      "k-avatar-image": src,
      "k-avatar-icon": icon || hasIcon,
      "k-avatar-square": shapeVal === "square",
      "k-avatar-round": shapeVal === "round",
    },
    className
  );

  return (
    <div ref={rootRef} className={rootClasses} style={rootStyles} {...rest}>
      {icon ? (
        <Icon type={icon} />
      ) : src ? (
        <img src={src} alt="" />
      ) : isText ? (
        <span ref={innerRef} className="k-avatar-string" style={textStyles}>
          {childList[0]}
        </span>
      ) : (
        children
      )}
    </div>
  );
};

export default Avatar;
