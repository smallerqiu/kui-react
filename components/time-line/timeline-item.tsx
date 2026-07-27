import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import Icon, { type IconType } from "../icon";

export interface TimelineItemProps extends HTMLAttributes<HTMLLIElement> {
  color?: string;
  icon?: IconType[];
  time?: ReactNode;
  extra?: ReactNode;
  dot?: ReactNode;
}

export default function TimeLineItem({
  color,
  icon,
  time,
  extra,
  dot,
  className,
  children,
  ...rest
}: TimelineItemProps) {
  const custom = dot != null || icon != null;
  const dotStyle: CSSProperties = { color };
  return (
    <li {...rest} className={["k-time-line-item", className].filter(Boolean).join(" ")}>
      <div
        className={["k-time-line-dot", custom && "k-time-line-dot-custom"]
          .filter(Boolean)
          .join(" ")}
        style={dotStyle}
      >
        {dot ?? (icon ? <Icon type={icon} /> : <span className="k-time-line-head" />)}
      </div>
      <div className="k-time-line-item-content">
        {children}
        {extra != null && <div className="k-time-line-item-extra">{extra}</div>}
        {time != null && <div className="k-time-line-item-time">{time}</div>}
      </div>
    </li>
  );
}
