import clsx from "clsx";
import { CircleCheck, CircleX, Info, TriangleAlert } from "kui-icons";
import { isValidElement, type HTMLAttributes, type ReactNode } from "react";
import type { FeedbackPanelKind, ShapeType, ThemeType } from "../const/types";
import Icon, { type IconType } from "../icon";

export interface FeedbackPanelProps extends HTMLAttributes<HTMLElement> {
  kind?: FeedbackPanelKind;
  heading?: ReactNode;
  description?: ReactNode;
  symbol?: IconType[] | ReactNode;
  compact?: boolean;
  actions?: ReactNode;
  theme?: ThemeType;
  shape?: ShapeType;
}

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
  theme = "outline",
  shape = "round",
  children,
  className,
  ...rest
}: FeedbackPanelProps) {
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
        `k-feedback-panel-theme-${theme}`,
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
