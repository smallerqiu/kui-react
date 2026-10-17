import { resolvePaintedTheme, useConfigAppearance } from "../config/use-config-appearance";
import clsx from "clsx";
import React from "react";
import { Avatar } from "../avatar";
import Icon, { type IconType } from "../icon";
import type { ShapeType, SizeType, SurfaceThemeType } from "../const/types";

export interface CardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title" | "defaultValue" | "defaultChecked"
> {
  bordered?: boolean;
  theme?: SurfaceThemeType;
  shape?: ShapeType;
  size?: SizeType;
  title?: React.ReactNode;
  icon?: IconType[];
  extra?: React.ReactNode;
  cover?: string | React.ReactNode;
  children?: React.ReactNode;
}

// A card paints a whole box, so the tiers it can answer are the four surface tiers plus `fill`.
// `underlined` is absent — "keep only the bottom border" on a card deletes three sides of the frame,
// which is not an appearance preset (see `.kui-theme-value` in `styles/less-css-var.less`). A tier
// outside this list must not reach the class list: `k-card-<tier>` with no LESS block is the
// "class ships, nothing paints" bug, and a card's own default is `fill`, so the guard falls back.
const PAINTED_THEMES = ["fill", "outline", "plain", "solid", "dashed"] as const;

const Card: React.FC<CardProps> = ({
  bordered = false,
  theme: themeProp,
  shape: shapeProp,
  size: sizeProp,
  title,
  icon,
  extra,
  cover,
  children,
  className = "",
  ...rest
}) => {
  const inheritedAppearance = useConfigAppearance();
  const theme =
    resolvePaintedTheme(themeProp ?? inheritedAppearance.theme, PAINTED_THEMES) ?? "fill";
  const shape = shapeProp ?? inheritedAppearance.shape ?? "round";
  const size = sizeProp ?? inheritedAppearance.size ?? "medium";
  const iconNode = icon ? <Icon type={icon} className="k-card-title-icon" /> : null;
  const titleNode =
    typeof title === "string" ? <span className="k-card-title">{title}</span> : title;
  const extraNode = extra ? <div className="k-card-extra">{extra}</div> : null;
  const coverNode = typeof cover === "string" ? <img src={cover} alt="" /> : cover;

  const showHead = !!(titleNode || extraNode || iconNode);

  const classes = clsx(
    "k-card",
    {
      "k-card-bordered": bordered,
      "k-card-has-cover": !!coverNode,
      [`k-card-${theme}`]: theme,
      [`k-card-${shape}`]: shape,
      [`k-card-${size}`]: size,
    },
    className,
  );

  return (
    <div className={classes} {...rest}>
      {coverNode && <div className="k-card-cover">{coverNode}</div>}
      {!coverNode && showHead && (
        <div className="k-card-head">
          {iconNode}
          {titleNode}
          {extraNode}
        </div>
      )}
      {children ? <div className="k-card-body k-scroll">{children}</div> : null}
    </div>
  );
};

export interface CardMetaProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title" | "defaultValue" | "defaultChecked"
> {
  avatar?: string | React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export function CardMeta({ avatar, title, description, className, ...rest }: CardMetaProps) {
  const avatarNode = typeof avatar === "string" ? <Avatar src={avatar} /> : avatar;
  return (
    <div {...rest} className={clsx("k-card-meta", className)}>
      {avatarNode && <div className="k-card-meta-avatar">{avatarNode}</div>}
      <div className="k-card-meta-content">
        {title != null && <div className="k-card-meta-title">{title}</div>}
        {description != null && <div className="k-card-meta-description">{description}</div>}
      </div>
    </div>
  );
}

export default Card;
