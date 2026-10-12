import React from "react";
import Popup from "../popup";
import type { PlacementsType } from "../const/types";
export interface PoptipProps {
  dark?: boolean;
  open?: boolean;
  /** @deprecated Use `open` instead. */
  show?: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  width?: number | string;
  trigger?: "click" | "hover" | "focus";
  placement?: PlacementsType;
  /** 关闭后是否销毁面板内容。默认销毁（重开时重新挂载）；设为 false 可保留面板内的表单状态，代价是每个打开过的实例留一份隐藏 DOM。 */
  destroyOnClose?: boolean;
  /** 只渲染浮层本身，不包含触发元素、定位与动画，与 kui-vue 一致 */
  panelOnly?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  /** @deprecated Use `onOpenChange` instead. */
  onShowChange?: (show: boolean) => void;
  children?: React.ReactNode;
}

export type PoptipPanelProps = Omit<PoptipProps, "children" | "open" | "show">;

export function PoptipPanel(props: PoptipPanelProps) {
  return <Poptip {...props} panelOnly />;
}

const Poptip: React.FC<PoptipProps> = ({
  dark = false,
  open,
  show,
  title,
  content,
  width,
  trigger = "hover",
  placement = "top",
  destroyOnClose = true,
  panelOnly = false,
  onClose,
  onOpenChange,
  onShowChange,
  children,
}) => (
  <Popup
    open={open ?? show}
    trigger={trigger}
    placement={placement}
    panelOnly={panelOnly}
    arrow
    destroyOnClose={destroyOnClose}
    respectDefaultPrevented={false}
    prefixCls="k-poptip"
    className={dark ? "k-poptip-dark" : undefined}
    style={{ width }}
    onOpenChange={(next) => {
      onOpenChange?.(next);
      onShowChange?.(next);
      if (!next) onClose?.();
    }}
    overlay={
      <>
        {title ? <div className="k-poptip-title">{title}</div> : null}
        <div className="k-poptip-body">{content}</div>
      </>
    }
  >
    {children}
  </Popup>
);
export default Poptip;
