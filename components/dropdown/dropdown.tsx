import React, { useRef, useState } from "react";
import Popup, { type PopupRef } from "../popup";
import type { DropPlacementsType, TriggerType } from "../const/types";
import { DropdownContext } from "./dropdown-context";

export interface DropdownProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "show" | "defaultValue" | "defaultChecked"
> {
  trigger?: TriggerType;
  disabled?: boolean;
  arrow?: boolean;
  open?: boolean;
  /** @deprecated Use `open` instead. */
  show?: boolean;
  placement?: DropPlacementsType;
  /** 关闭后是否销毁面板内容。默认销毁（重开时重新挂载）；设为 false 可保留面板内的表单状态，代价是每个打开过的实例留一份隐藏 DOM。 */
  destroyOnClose?: boolean;
  target?: React.RefObject<HTMLElement | null>;
  onOpenChange?: (opened: boolean) => void;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger = "hover",
  disabled = false,
  arrow = false,
  open,
  show,
  placement = "bottom-left",
  destroyOnClose = true,
  target,
  onOpenChange,
  overlay,
  children,
  ...attrs
}) => {
  const popupRef = useRef<PopupRef>(null);
  const pendingFocus = useRef<boolean | null>(null);
  const [innerVisible, setInnerVisible] = useState(false);
  // Popup 的 target 只当定位锚点、不绑定事件（见 Popup API），所以把 target 交给
  // DropdownButton 时，右边那个触发按钮的开合要由 Dropdown 自己驱动，状态回灌给 aria-expanded。
  const visible = open ?? show ?? innerVisible;
  const focusMenuItem = () => {
    if (pendingFocus.current === null) return;
    const items = popupRef.current
      ?.getPopupElement()
      ?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])');
    if (!items?.length) return;
    items[pendingFocus.current ? items.length - 1 : 0]?.focus({ preventScroll: true });
    pendingFocus.current = null;
  };
  const openOnArrowKey = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    pendingFocus.current = event.key === "ArrowUp";
    popupRef.current?.open();
    focusMenuItem();
  };
  return (
    <DropdownContext.Provider
      value={{
        expanded: visible,
        onMouseEnter: () => {
          if (trigger === "hover") popupRef.current?.open();
          else popupRef.current?.cancelClose();
        },
        onMouseLeave: () => {
          if (trigger === "hover") popupRef.current?.scheduleClose();
        },
        onClick: () => {
          if (trigger !== "click") return;
          if (visible) popupRef.current?.close();
          else popupRef.current?.open();
        },
        onContextMenu: () => {
          if (trigger === "contextmenu") popupRef.current?.open();
        },
        onTriggerKeydown: openOnArrowKey,
        clearPopTimer: () => popupRef.current?.cancelClose(),
        menuSelected: () => {
          popupRef.current?.close();
          popupRef.current?.getTriggerElement()?.focus({ preventScroll: true });
        },
      }}
    >
      <Popup
        {...attrs}
        ref={popupRef}
        open={open ?? show}
        trigger={trigger}
        disabled={disabled}
        arrow={arrow}
        placement={placement}
        target={target}
        prefixCls="k-dropdown"
        destroyOnClose={destroyOnClose}
        triggerProps={{ "aria-haspopup": "menu" }}
        onOpenChange={(next, detail) => {
          setInnerVisible(next);
          if (next && detail.reason === "contextmenu") pendingFocus.current = false;
          if (!next) pendingFocus.current = null;
          onOpenChange?.(next);
        }}
        onTriggerKeyDown={(event) => openOnArrowKey(event)}
        onAfterOpen={focusMenuItem}
        overlay={<div className="k-dropdown-body">{overlay}</div>}
      >
        {children}
      </Popup>
    </DropdownContext.Provider>
  );
};
export default Dropdown;
