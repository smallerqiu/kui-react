import {
  resolvePaintedTheme,
  useConfigAppearance,
  normalizeSurfaceShape,
} from "../config/use-config-appearance";
import clsx from "clsx";
import { CircleCheck, CircleX, Info, TriangleAlert } from "kui-icons";
import { isValidElement, type HTMLAttributes, type ReactNode } from "react";
import type { FeedbackPanelKind, SurfaceShapeType, SurfaceThemeType } from "../const/types";
import Icon, { type IconType } from "../icon";

export interface FeedbackPanelProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "defaultValue" | "defaultChecked"
> {
  kind?: FeedbackPanelKind;
  heading?: ReactNode;
  description?: ReactNode;
  symbol?: IconType[] | ReactNode;
  compact?: boolean;
  actions?: ReactNode;
  theme?: SurfaceThemeType;
  shape?: SurfaceShapeType;
}

// A feedback panel paints a whole box, so it answers the four surface tiers plus `fill` and never
// `underlined`. Its own default is `outline`, which is what the fallback means. The tier class goes
// straight after the prefix, like every other component's, so the shared tooling can point at these
// blocks by name.
const PAINTED_THEMES = ["fill", "outline", "plain", "solid", "dashed"] as const;

const symbols: Record<FeedbackPanelKind, IconType[]> = {
  positive: CircleCheck,
  negative: CircleX,
  caution: TriangleAlert,
  neutral: Info,
};

export default function FeedbackPanel({
  kind = "neutral",
  heading,
  description,
  symbol,
  compact = false,
  actions,
  theme: themeProp,
  shape: shapeProp,
  children,
  className,
  ...rest
}: FeedbackPanelProps) {
  const inheritedAppearance = useConfigAppearance();
  const theme =
    resolvePaintedTheme(themeProp ?? inheritedAppearance.theme, PAINTED_THEMES) ?? "outline";
  const shape = normalizeSurfaceShape(shapeProp ?? inheritedAppearance.shape ?? "round");
  const symbolNode =
    symbol == null || Array.isArray(symbol) ? (
      <Icon type={(symbol as IconType[] | undefined) ?? symbols[kind]} />
    ) : isValidElement(symbol) || typeof symbol !== "object" ? (
      symbol
    ) : null;

  return (
    <section
      {...rest}
      className={clsx(
        "k-feedback-panel",
        `k-feedback-panel-${kind}`,
        `k-feedback-panel-${theme}`,
        `k-feedback-panel-shape-${shape}`,
        { "k-feedback-panel-compact": compact },
        className,
      )}
      aria-live="polite"
    >
      <div className="k-feedback-panel-mark" aria-hidden="true">
        <span className="k-feedback-panel-mark-inner">{symbolNode}</span>
      </div>
      <div className="k-feedback-panel-main">
        {heading != null && <div className="k-feedback-panel-heading">{heading}</div>}
        {description != null && <div className="k-feedback-panel-description">{description}</div>}
        {children != null && <div className="k-feedback-panel-details">{children}</div>}
        {actions != null && <div className="k-feedback-panel-actions">{actions}</div>}
      </div>
    </section>
  );
}

export type { FeedbackPanelKind } from "../const/types";
