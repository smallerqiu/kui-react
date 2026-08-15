import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import StatNumber from "./stat-number";
import type { ShapeType, ThemeType } from "../const/types";

export interface StatNumberItem {
  value: number;
  duration?: number;
  precision?: number;
  separator?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  desc?: ReactNode;
  trend?: ReactNode;
  trendStatus?: "default" | "success" | "danger" | "warning";
  autoAnimate?: boolean;
  autoAnimateOnce?: boolean;
}

export interface StatCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "prefix"> {
  title?: ReactNode;
  precision?: number;
  items?: StatNumberItem[];
  separator?: string;
  statNumberType?: "rollup" | "countup";
  reverse?: boolean;
  bordered?: boolean;
  theme?: ThemeType;
  shape?: ShapeType;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export default function StatCard({
  title,
  precision = 0,
  items = [],
  separator,
  statNumberType = "countup",
  reverse = false,
  bordered = false,
  theme = "fill",
  shape = "round",
  prefix,
  suffix,
  className,
  ...rest
}: StatCardProps) {
  return (
    <div
      {...rest}
      className={clsx(
        "k-stat-card",
        {
          "k-stat-card-bordered": bordered,
          [`k-stat-card-${theme}`]: theme,
          [`k-stat-card-${shape}`]: shape,
        },
        className
      )}
    >
      {title != null && <div className="k-stat-card-title">{title}</div>}
      <div className="k-stat-card-items">
        {items.map((item, index) => (
          <div
            key={index}
            className={clsx("k-stat-card-item", { "k-stat-card-item-reverse": reverse })}
          >
            <div className="k-stat-card-item-value">
              <StatNumber
                value={item.value}
                autoAnimate={item.autoAnimate}
                autoAnimateOnce={item.autoAnimateOnce}
                duration={item.duration}
                precision={item.precision ?? precision}
                separator={item.separator ?? separator}
                type={statNumberType}
                prefix={item.prefix ?? prefix}
                suffix={item.suffix ?? suffix}
              />
            </div>
            <div className="k-stat-card-item-desc">{item.desc}</div>
            {item.trend !== undefined && (
              <div
                className={clsx(
                  "k-stat-card-item-trend",
                  `k-stat-card-item-trend-${item.trendStatus || "default"}`
                )}
              >
                {item.trend}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
