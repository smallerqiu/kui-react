import {
  normalizeSurfaceShape,
  resolvePaintedTheme,
  useConfigAppearance,
} from "../config/use-config-appearance";
import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import { hasRenderableContent } from "../utils/react-node";
import StatNumber from "./stat-number";
import { statItemKey } from "./utils/stat-item-key";
import type { SizeType, SurfaceShapeType, SurfaceThemeType } from "../const/types";

export interface StatNumberItem {
  key?: string | number;
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

export interface StatCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title" | "prefix" | "defaultValue" | "defaultChecked"
> {
  title?: ReactNode;
  precision?: number;
  items?: StatNumberItem[];
  separator?: string;
  statNumberType?: "rollup" | "countup";
  reverse?: boolean;
  bordered?: boolean;
  theme?: SurfaceThemeType;
  shape?: SurfaceShapeType;
  size?: SizeType;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

// The surface contract `Card` uses: a stat card is a box, so `underlined` is not one of its looks and
// a tier it cannot draw must not reach the class list. Widened from the private
// `"fill" | "outline" | "plain"` literal to `SurfaceThemeType` so a `ConfigProvider theme="solid"` reaches
// every surface the same way — the guard below, not the prop type, is what decides support.
const PAINTED_THEMES = ["fill", "outline", "plain", "solid", "dashed"] as const;

export default function StatCard({
  title,
  precision = 0,
  items = [],
  separator,
  statNumberType = "countup",
  reverse = false,
  bordered = false,
  theme: themeProp,
  shape: shapeProp,
  size: sizeProp,
  prefix,
  suffix,
  className,
  ...rest
}: StatCardProps) {
  const inheritedAppearance = useConfigAppearance();
  const theme =
    resolvePaintedTheme(themeProp ?? inheritedAppearance.theme, PAINTED_THEMES) ?? "fill";
  const shape = normalizeSurfaceShape(shapeProp ?? inheritedAppearance.shape ?? "round");
  const size = sizeProp ?? inheritedAppearance.size ?? "medium";
  return (
    <div
      {...rest}
      className={clsx(
        "k-stat-card",
        {
          "k-stat-card-bordered": bordered,
          [`k-stat-card-${theme}`]: theme,
          [`k-stat-card-${shape}`]: shape,
          [`k-stat-card-${size}`]: size,
        },
        className,
      )}
    >
      {hasRenderableContent(title) && <div className="k-stat-card-title">{title}</div>}
      <div className="k-stat-card-items">
        {items.map((item, index) => (
          <div
            key={statItemKey(item, index)}
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
            {hasRenderableContent(item.desc) && (
              <div className="k-stat-card-item-desc">{item.desc}</div>
            )}
            {hasRenderableContent(item.trend) && (
              <div
                className={clsx(
                  "k-stat-card-item-trend",
                  `k-stat-card-item-trend-${item.trendStatus || "default"}`,
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
