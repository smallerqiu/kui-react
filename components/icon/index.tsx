import clsx from "clsx";
import { forwardRef, type CSSProperties, type HTMLAttributes, type PointerEvent } from "react";

export interface IconType {
  d: string;
  s?: string;
}

export interface IconProps extends Omit<HTMLAttributes<HTMLElement>, "color"> {
  type?: IconType[];
  size?: string | number;
  color?: string;
  spin?: boolean;
  strokeWidth?: string | number;
  reverseFill?: boolean;
}

const parseStyle = (styleString = "") => {
  const styles: Record<string, string> = {};
  for (const rule of styleString.split(";")) {
    const separator = rule.indexOf(":");
    if (separator < 0) continue;
    const property = rule.slice(0, separator).trim();
    const value = rule.slice(separator + 1).trim();
    if (property && value) {
      styles[property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())] = value;
    }
  }
  return styles;
};

const Icon = forwardRef<HTMLElement, IconProps>(function Icon(
  {
    type = [],
    size,
    color,
    spin = false,
    strokeWidth = 2,
    reverseFill = false,
    className,
    style,
    onClick,
    ...rest
  },
  ref
) {
  const iconStyle: CSSProperties = {
    ...style,
    color,
    fontSize: size === undefined ? undefined : typeof size === "number" ? `${size}px` : size,
  };

  const handleClick = (event: PointerEvent<HTMLElement>) => onClick?.(event);

  return (
    <i
      {...rest}
      ref={ref}
      className={clsx("k-icon", { "k-load-loop": spin }, className)}
      style={iconStyle}
      onClick={handleClick}
    >
      <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
        {type.map((item, index) => {
          const pathStyle = parseStyle(item.s);
          if (reverseFill && pathStyle.stroke === "currentcolor" && pathStyle.fill === "none") {
            pathStyle.fill = "currentColor";
            pathStyle.stroke = "none";
          }
          return (
            <path key={`${item.d}-${index}`} d={item.d} style={{ ...pathStyle, strokeWidth }} />
          );
        })}
      </svg>
    </i>
  );
});

export default Icon;
