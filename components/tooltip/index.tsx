import React from "react";
import Popup from "../base/popup";
import type { PlacementsType } from "../const/types";
import { colors } from "../const/var";
import { isColor } from "../utils/color";
export interface TooltipProps {
  open?: boolean;
  defaultOpen?: boolean;
  /** @deprecated Use `open` instead. */
  show?: boolean;
  title?: React.ReactNode;
  color?: string;
  disabled?: boolean;
  width?: number | string;
  placement?: PlacementsType;
  /** 只渲染浮层本身，不包含触发元素、定位与动画，与 kui-vue 一致 */
  panelOnly?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** @deprecated Use `onOpenChange` instead. */
  onShowChange?: (show: boolean) => void;
  children?: React.ReactNode;
}

export type TooltipPanelProps = Omit<TooltipProps, "children" | "open" | "defaultOpen" | "show">;

export function TooltipPanel(props: TooltipPanelProps) {
  return <Tooltip {...props} panelOnly />;
}

const Tooltip: React.FC<TooltipProps> = ({
  open,
  defaultOpen = false,
  show,
  title,
  color,
  disabled = false,
  width,
  placement = "top",
  panelOnly = false,
  onOpenChange,
  onShowChange,
  children,
}) => {
  const bgColor = isColor(color)
    ? colors.some((preset) => preset === color)
      ? `var(--kui-color-${color})`
      : color
    : undefined;
  return (
    <Popup
      open={disabled ? false : (open ?? show)}
      defaultOpen={defaultOpen}
      disabled={disabled}
      trigger="hover"
      openDelay={1}
      placement={placement}
      panelOnly={panelOnly}
      prefixCls="k-tooltip"
      arrow
      destroyOnClose
      hideWhenDetached
      closeOnOutsideClick={false}
      className={[
        `k-tooltip-has-arrow`,
        color && !isColor(color) && `k-tooltip-${color}`,
        isColor(color) && "k-tooltip-has-color",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ width }}
      contentStyle={{ backgroundColor: bgColor }}
      onOpenChange={(next) => {
        onOpenChange?.(next);
        onShowChange?.(next);
      }}
      overlay={<div className="k-tooltip-title">{title}</div>}
      arrowContent={
        <div className="k-tooltip-arrow">
          <svg style={{ fill: bgColor || "currentcolor" }} viewBox="0 0 24 7">
            <path d="M24 0V1C20 1 18.5 2 16.5 4C14.5 6 14 7 12 7C10 7 9.5 6 7.5 4C5.5 2 4 1 0 1V0H24Z" />
          </svg>
        </div>
      }
    >
      {children}
    </Popup>
  );
};
export default Tooltip;
