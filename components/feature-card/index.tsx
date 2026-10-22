import {
  normalizeSurfaceShape,
  resolvePaintedTheme,
  useConfigAppearance,
} from "../config/use-config-appearance";
import clsx from "clsx";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { SurfaceShapeType, SurfaceThemeType } from "../const/types";
import Icon, { type IconType } from "../icon";
import { wash } from "../utils/color";

export interface FeatureCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title" | "defaultValue" | "defaultChecked"
> {
  icon?: IconType[] | ReactNode;
  title?: ReactNode;
  desc?: ReactNode;
  extra?: ReactNode;
  bordered?: boolean;
  theme?: SurfaceThemeType;
  shape?: SurfaceShapeType;
  size?: "small" | "medium" | "large";
  direction?: "horizontal" | "vertical";
  clickable?: boolean;
  disabled?: boolean;
  color?: string;
  iconBackground?: string;
  children?: ReactNode;
}

// Same surface contract as `Card`: four box tiers plus `fill`, and never `underlined` — a feature
// card is a surface, not a field you type into. Anything outside this set resolves to the card's own
// default so it cannot ship a `k-feature-card-<tier>` class no stylesheet answers.
const PAINTED_THEMES = ["fill", "outline", "plain", "solid", "dashed"] as const;

// The share the icon chip washes its colour by. The sheet's own default — the one that paints when no
// `color` reaches this function — has to fade the same amount.
const ICON_WASH_SHARE = 12;

export default function FeatureCard({
  icon,
  title,
  desc,
  bordered = false,
  theme: themeProp,
  shape: shapeProp,
  size: sizeProp,
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
  const inheritedAppearance = useConfigAppearance();
  const theme =
    resolvePaintedTheme(themeProp ?? inheritedAppearance.theme, PAINTED_THEMES) ?? "fill";
  const shape = normalizeSurfaceShape(shapeProp ?? inheritedAppearance.shape ?? "round");
  const size = sizeProp ?? inheritedAppearance.size ?? "medium";
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
  // The chip washes whatever colour this card carries, and only this function knows what that colour
  // is — `color` is a string the caller typed. Doing the mix in the sheet would need `color-mix()`, so
  // the share is applied here and handed over as a plain `rgba()`. `iconBackground` still wins, and a
  // colour that only resolves inside the page (`currentColor`, `var(--token)`) leaves the sheet's
  // literal default standing.
  const iconWash = iconBackground ? undefined : wash(color, ICON_WASH_SHARE);

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
          ...(iconWash ? { "--k-feature-card-icon-wash": iconWash } : {}),
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
