import React, { useRef } from "react";
import Popup, { type PopupRef } from "../base/popup";
import type { DropPlacementsType, TriggerType } from "../const/types";
import { DropdownContext } from "./dropdown-context";

export interface DropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "show"> {
  trigger?: TriggerType;
  disabled?: boolean;
  arrow?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  /** @deprecated Use `open` instead. */
  show?: boolean;
  placement?: DropPlacementsType;
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
  defaultOpen = false,
  show,
  placement = "bottom-left",
  target,
  onOpenChange,
  overlay,
  children,
  ...attrs
}) => {
  const popupRef = useRef<PopupRef>(null);
  const pendingFocus = useRef<boolean | null>(null);
  const focusMenuItem = () => {
    if (pendingFocus.current === null) return;
    const items = popupRef.current
      ?.getPopupElement()
      ?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])');
    if (!items?.length) return;
    items[pendingFocus.current ? items.length - 1 : 0]?.focus({ preventScroll: true });
    pendingFocus.current = null;
  };
  return (
    <DropdownContext.Provider
      value={{
        onMouseEnter: () => popupRef.current?.cancelClose(),
        onMouseLeave: () => {
          if (trigger === "hover") popupRef.current?.scheduleClose();
        },
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
        defaultOpen={defaultOpen}
        trigger={trigger}
        disabled={disabled}
        arrow={arrow}
        placement={placement}
        target={target}
        prefixCls="k-dropdown"
        destroyOnClose
        triggerProps={{ "aria-haspopup": "menu" }}
        onOpenChange={(next, detail) => {
          if (next && detail.reason === "contextmenu") pendingFocus.current = false;
          if (!next) pendingFocus.current = null;
          onOpenChange?.(next);
        }}
        onTriggerKeyDown={(event, popup) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            pendingFocus.current = event.key === "ArrowUp";
            popup.open();
            focusMenuItem();
          }
        }}
        onAfterOpen={focusMenuItem}
        overlay={<div className="k-dropdown-body">{overlay}</div>}
      >
        {children}
      </Popup>
    </DropdownContext.Provider>
  );
};
export default Dropdown;
