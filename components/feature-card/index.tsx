import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import Icon, { type IconType } from "../icon";
import type { ShapeType, ThemeType } from "../const/types";

export interface FeatureCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: IconType[];
  title?: ReactNode;
  desc?: ReactNode;
  bordered?: boolean;
  theme?: ThemeType;
  shape?: ShapeType;
}

export default function FeatureCard({
  icon,
  title,
  desc,
  bordered = false,
  theme = "fill",
  shape = "round",
  className,
  ...rest
}: FeatureCardProps) {
  return (
    <div
      {...rest}
      className={clsx(
        "k-feature-card",
        {
          "k-feature-card-bordered": bordered,
          [`k-feature-card-${theme}`]: theme,
          [`k-feature-card-${shape}`]: shape,
        },
        className
      )}
    >
      {icon && (
        <div className="k-feature-card-icon">
          <Icon type={icon} />
        </div>
      )}
      <div className="k-feature-card-content">
        {title && <div className="k-feature-card-title">{title}</div>}
        {desc && <div className="k-feature-card-desc">{desc}</div>}
      </div>
    </div>
  );
}
