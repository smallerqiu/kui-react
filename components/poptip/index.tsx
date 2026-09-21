import React from "react";
import Popup from "../popup";
import type { PlacementsType } from "../const/types";
export interface PoptipProps {
  dark?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  /** @deprecated Use `open` instead. */
  show?: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  width?: number | string;
  trigger?: "click" | "hover" | "focus";
  placement?: PlacementsType;
  /** 只渲染浮层本身，不包含触发元素、定位与动画，与 kui-vue 一致 */
  panelOnly?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  /** @deprecated Use `onOpenChange` instead. */
  onShowChange?: (show: boolean) => void;
  children?: React.ReactNode;
}

export type PoptipPanelProps = Omit<PoptipProps, "children" | "open" | "defaultOpen" | "show">;

export function PoptipPanel(props: PoptipPanelProps) {
  return <Poptip {...props} panelOnly />;
}

const Poptip: React.FC<PoptipProps> = ({
  dark = false,
  open,
  defaultOpen = false,
  show,
  title,
  content,
  width,
  trigger = "hover",
  placement = "top",
  panelOnly = false,
  onClose,
  onOpenChange,
  onShowChange,
  children,
}) => (
  <Popup
    open={open ?? show}
    defaultOpen={defaultOpen}
    trigger={trigger}
    placement={placement}
    panelOnly={panelOnly}
    arrow
    destroyOnClose
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
