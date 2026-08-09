import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import Icon, { type IconType } from "../icon";

export interface FeatureCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: IconType[];
  title?: ReactNode;
  desc?: ReactNode;
  bordered?: boolean;
}

export default function FeatureCard({
  icon,
  title,
  desc,
  bordered = false,
  className,
  ...rest
}: FeatureCardProps) {
  return (
    <div
      {...rest}
      className={clsx("k-feature-card", { "k-feature-card-bordered": bordered }, className)}
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
