import React from "react";
import Popup from "../popup";
import type { PlacementsType } from "../const/types";
import { colors } from "../const/var";
import { isColor } from "../utils/color";
export interface TooltipProps {
  trigger?: "hover" | "manual";
  open?: boolean;
  /** @deprecated Use `open` instead. */
  show?: boolean;
  title?: React.ReactNode;
  color?: string;
  disabled?: boolean;
  width?: number | string;
  placement?: PlacementsType;
  /** 关闭后是否销毁面板内容。默认销毁（重开时重新挂载）；设为 false 可保留面板内的表单状态，代价是每个打开过的实例留一份隐藏 DOM。 */
  destroyOnClose?: boolean;
  /** 只渲染浮层本身，不包含触发元素、定位与动画，与 kui-vue 一致 */
  panelOnly?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** @deprecated Use `onOpenChange` instead. */
  onShowChange?: (show: boolean) => void;
  children?: React.ReactNode;
}

export type TooltipPanelProps = Omit<TooltipProps, "children" | "open" | "show">;

export function TooltipPanel(props: TooltipPanelProps) {
  return <Tooltip {...props} panelOnly />;
}

const Tooltip: React.FC<TooltipProps> = ({
  trigger = "hover",
  open,
  show,
  title,
  color,
  disabled = false,
  width,
  placement = "top",
  destroyOnClose = true,
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
      disabled={disabled}
      trigger={trigger}
      openDelay={1}
      placement={placement}
      panelOnly={panelOnly}
      prefixCls="k-tooltip"
      arrow
      destroyOnClose={destroyOnClose}
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
            {/* 与 poptip 同一套路（`#ot`）：只描外沿那一圈，把面板的 1px 边接过来。
                上面那条闭合路径负责填色，这条开放路径的肩线落在面板描边的中线上
                （箭头盒顶比面板外沿高 2px，描边带占 y 1~2，所以中线是 1.5），
                整条曲线再往外挪半像素，看着就是描边顺着箭头绕一圈。
                箭头尖端因此落到 viewBox 外半像素，靠 `overflow: visible` 不裁掉。 */}
            <path
              id="ot"
              fill="none"
              d="M24 1.5C20 1.5 18.5 2.5 16.5 4.5C14.5 6.5 14 7.5 12 7.5C10 7.5 9.5 6.5 7.5 4.5C5.5 2.5 4 1.5 0 1.5"
            />
          </svg>
        </div>
      }
    >
      {children}
    </Popup>
  );
};
export default Tooltip;
