import clsx from "clsx";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { ShapeType, ThemeType } from "../const/types";
import Icon, { type IconType } from "../icon";

export interface FeatureCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: IconType[] | ReactNode;
  title?: ReactNode;
  desc?: ReactNode;
  extra?: ReactNode;
  bordered?: boolean;
  theme?: ThemeType;
  shape?: ShapeType;
  size?: "small" | "medium" | "large";
  direction?: "horizontal" | "vertical";
  clickable?: boolean;
  disabled?: boolean;
  color?: string;
  iconBackground?: string;
  children?: ReactNode;
}

export default function FeatureCard({
  icon,
  title,
  desc,
  bordered = false,
  theme = "fill",
  shape = "round",
  size = "medium",
  direction = "horizontal",
  clickable = false,
  disabled = false,
  color,
  iconBackground,
  children,
  extra,
  onClick,
  className,
  ...rest
}: FeatureCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (!clickable || disabled || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    event.currentTarget.click();
  };
  const isLibraryIcon =
    Array.isArray(icon) &&
    icon.every(
      (item): item is IconType =>
        typeof item === "object" && item != null && "d" in item && typeof item.d === "string",
    );

  return (
    <div
      {...rest}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      role={clickable ? "button" : undefined}
      tabIndex={clickable && !disabled ? 0 : undefined}
      aria-disabled={clickable && disabled ? true : undefined}
      style={
        {
          ...rest.style,
          ...(color ? { "--k-feature-card-color": color } : {}),
          ...(iconBackground ? { "--k-feature-card-icon-bg": iconBackground } : {}),
        } as CSSProperties
      }
      className={clsx(
        "k-feature-card",
        {
          "k-feature-card-bordered": bordered,
          [`k-feature-card-${theme}`]: theme,
          [`k-feature-card-${shape}`]: shape,
          [`k-feature-card-${size}`]: size,
          [`k-feature-card-${direction}`]: direction,
          "k-feature-card-clickable": clickable,
          "k-feature-card-disabled": disabled,
        },
        className,
      )}
    >
      {icon != null && (
        <div className="k-feature-card-icon">{isLibraryIcon ? <Icon type={icon} /> : icon}</div>
      )}
      <div className="k-feature-card-content">
        {title != null && <div className="k-feature-card-title">{title}</div>}
        {desc != null && <div className="k-feature-card-desc">{desc}</div>}
        {children}
      </div>
      {extra != null && <div className="k-feature-card-extra">{extra}</div>}
    </div>
  );
}
